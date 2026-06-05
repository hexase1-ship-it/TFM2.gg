const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const path = require("node:path");

app.disableHardwareAcceleration();

const POLL_MS = 3000;
const STABLE_MS = 1000;
const MAX_STABLE_CHECKS = 30;
const REPO_FULL_NAME = "hexase1-ship-it/TFM2.gg";
const RELEASE_API = `https://api.github.com/repos/${REPO_FULL_NAME}/releases/latest`;
const LATEST_TAG_REF_API = `https://api.github.com/repos/${REPO_FULL_NAME}/git/ref/tags/latest`;
const RELEASE_ASSET_NAME = "TFM2.gg_Distribution.zip";
const UPDATE_INFO_ASSET_NAME = "TFM2.gg_UpdateInfo.json";
const PACKAGE_LAYOUT_VERSION = 3;

let mainWindow = null;
let dashboardDir = null;
let gameRoot = null;
let savePath = null;
let lastSnapshot = null;
let refreshCount = 0;
let lastRefreshAt = null;
let refreshing = false;
let watcherStarted = false;
let updatePromptShown = false;
let policyIpcRegistered = false;

const POLICY_PRESET_IDS = new Set(["classic", "fearless", "hardFearless"]);
const FOLLOW_DASHBOARD_POLICY = "followDashboard";

function nowEpoch() {
  return Math.floor(Date.now() / 1000);
}

function clockNow() {
  const now = new Date();
  return now.toLocaleTimeString("ko-KR", { hour12: false });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  }[ch]));
}

function loadingHtml(message) {
  const safe = escapeHtml(message);
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>TFM2 Meta Dashboard</title>
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #080c12;
      color: #eef5ff;
      font-family: "Segoe UI", sans-serif;
    }
    main {
      width: min(560px, calc(100vw - 48px));
      border: 1px solid #2b3442;
      background: #111722;
      padding: 28px;
      border-radius: 8px;
      box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
    }
    h1 { margin: 0 0 10px; font-size: 24px; }
    p { margin: 0; color: #a9bdd8; line-height: 1.6; }
  </style>
</head>
<body>
  <main>
    <h1>TFM2 메타 대시보드</h1>
    <p>${safe}</p>
  </main>
</body>
</html>`;
}

function setLoading(message) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHtml(message))}`);
  }
}

function userAgentHeaders() {
  return {
    "User-Agent": "TFM2.gg-Dashboard",
    "Accept": "application/vnd.github+json"
  };
}

function requestBuffer(url, headers = {}, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error("리다이렉트가 너무 많습니다."));
      return;
    }
    const parsed = new URL(url);
    const client = parsed.protocol === "http:" ? http : https;
    const req = client.request(parsed, { headers: { ...userAgentHeaders(), ...headers } }, (res) => {
      const status = res.statusCode || 0;
      const location = res.headers.location;
      if (status >= 300 && status < 400 && location) {
        res.resume();
        requestBuffer(new URL(location, parsed).toString(), headers, redirectCount + 1).then(resolve, reject);
        return;
      }
      if (status < 200 || status >= 300) {
        res.resume();
        reject(new Error(`HTTP ${status}: ${url}`));
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.setTimeout(20000, () => req.destroy(new Error("요청 시간이 초과되었습니다.")));
    req.end();
  });
}

async function requestJson(url) {
  const buffer = await requestBuffer(url);
  return JSON.parse(buffer.toString("utf8"));
}

function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const parsed = new URL(url);
    const client = parsed.protocol === "http:" ? http : https;
    const req = client.request(parsed, { headers: userAgentHeaders() }, (res) => {
      const status = res.statusCode || 0;
      const location = res.headers.location;
      if (status >= 300 && status < 400 && location) {
        res.resume();
        downloadFile(new URL(location, parsed).toString(), destination).then(resolve, reject);
        return;
      }
      if (status < 200 || status >= 300) {
        res.resume();
        reject(new Error(`HTTP ${status}: ${url}`));
        return;
      }
      const stream = fs.createWriteStream(destination);
      res.pipe(stream);
      stream.on("finish", () => stream.close(resolve));
      stream.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(90000, () => req.destroy(new Error("다운로드 시간이 초과되었습니다.")));
    req.end();
  });
}

function runPowershell(args, cwd, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn("powershell.exe", args, {
      cwd,
      windowsHide: true,
      env: {
        ...process.env,
        ...extraEnv
      }
    });
    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.stderr.on("data", (data) => {
      output += data.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`PowerShell exit ${code}\n${output}`));
      }
    });
  });
}

function psQuote(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function readJsonFile(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  } catch {
    return null;
  }
}

function policySettingsFile() {
  return path.join(dashboardDir, "data", "policy-settings.json");
}

function normalizePolicySettings(input = {}) {
  const existing = typeof input === "object" && input ? input : {};
  const mode = String(existing.addonPolicyPreset || FOLLOW_DASHBOARD_POLICY);
  const dashboardPreset = POLICY_PRESET_IDS.has(String(existing.dashboardPreset))
    ? String(existing.dashboardPreset)
    : "classic";
  const addonPolicyPreset = mode === FOLLOW_DASHBOARD_POLICY || POLICY_PRESET_IDS.has(mode)
    ? mode
    : FOLLOW_DASHBOARD_POLICY;
  const effectivePreset = addonPolicyPreset === FOLLOW_DASHBOARD_POLICY
    ? dashboardPreset
    : addonPolicyPreset;
  return {
    addonPolicyPreset,
    dashboardPreset,
    effectivePreset,
    lastAppliedPreset: POLICY_PRESET_IDS.has(String(existing.lastAppliedPreset))
      ? String(existing.lastAppliedPreset)
      : null,
    lastPolicyGeneratedAt: existing.lastPolicyGeneratedAt || null,
    lastPolicyOutput: existing.lastPolicyOutput || ""
  };
}

function readPolicySettings() {
  const data = readJsonFile(policySettingsFile()) || {};
  return normalizePolicySettings(data);
}

function writePolicySettings(settings) {
  const normalized = normalizePolicySettings(settings);
  fs.mkdirSync(path.dirname(policySettingsFile()), { recursive: true });
  fs.writeFileSync(policySettingsFile(), `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

async function regenerateAddonPolicies(settings) {
  const normalized = writePolicySettings(settings);
  const refreshScript = path.join(dashboardDir, "refresh_meta_dashboard.ps1");
  const output = await runPowershell([
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    refreshScript,
    "-PolicyOnly",
    "-NoPrompt"
  ], dashboardDir, {
    TFM2_GAME_ROOT: gameRoot,
    TFM2_POLICY_PRESET: normalized.effectivePreset,
    PYTHONDONTWRITEBYTECODE: "1"
  });
  return writePolicySettings({
    ...normalized,
    lastAppliedPreset: normalized.effectivePreset,
    lastPolicyGeneratedAt: new Date().toISOString(),
    lastPolicyOutput: output.slice(-2000)
  });
}

function resolvePackageManifest() {
  const appPath = app.getAppPath();
  const candidates = [
    path.join(appPath, "package_manifest.json"),
    dashboardDir ? path.resolve(dashboardDir, "..", "package_manifest.json") : null,
    dashboardDir ? path.join(dashboardDir, "package_manifest.json") : null,
    path.join(path.dirname(process.execPath), "resources", "app", "package_manifest.json")
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return readJsonFile(candidate);
    }
  }
  return null;
}

function extractVersionSha(version) {
  const match = String(version || "").match(/\+([0-9a-f]{7,40})(?:\.dirty)?$/i);
  return match ? match[1].toLowerCase() : "";
}

function manifestRevision(manifest) {
  const revision = String(manifest?.sourceRevision || "").trim().toLowerCase();
  return revision || extractVersionSha(manifest?.packageVersion);
}

function dashboardRevision(manifest) {
  return String(manifest?.dashboardRevision || "").trim().toLowerCase();
}

function manifestLayoutVersion(manifest) {
  const value = Number.parseInt(manifest?.packageLayoutVersion || 0, 10);
  return Number.isFinite(value) ? value : 0;
}

async function resolveLatestTagSha(ref) {
  const object = ref && ref.object;
  if (!object || !object.sha) {
    return "";
  }
  if (object.type !== "tag") {
    return String(object.sha).toLowerCase();
  }
  const tag = await requestJson(object.url);
  return String(tag?.object?.sha || object.sha).toLowerCase();
}

function releaseAsset(release) {
  const assets = release?.assets || [];
  return assets.find((asset) => asset.name === RELEASE_ASSET_NAME) ||
    assets.find((asset) => String(asset.name || "").toLowerCase().endsWith(".zip")) ||
    null;
}

function namedReleaseAsset(release, name) {
  const assets = release?.assets || [];
  return assets.find((asset) => asset.name === name) || null;
}

async function fetchRemoteUpdateInfo(release) {
  const asset = namedReleaseAsset(release, UPDATE_INFO_ASSET_NAME);
  const url = asset?.browser_download_url || asset?.url;
  if (!url) {
    return null;
  }
  try {
    return await requestJson(url);
  } catch {
    return null;
  }
}

async function getUpdateInfo() {
  const localManifest = resolvePackageManifest();
  const [release, tagRef] = await Promise.all([
    requestJson(RELEASE_API),
    requestJson(LATEST_TAG_REF_API).catch(() => null)
  ]);
  const remoteInfo = await fetchRemoteUpdateInfo(release);
  const latestSha = await resolveLatestTagSha(tagRef);
  const currentVersion = localManifest?.packageVersion || "";
  const currentSha = manifestRevision(localManifest);
  const currentDashboardRevision = dashboardRevision(localManifest);
  const latestDashboardRevision = dashboardRevision(remoteInfo);
  const currentLayout = manifestLayoutVersion(localManifest);
  const latestLayout = manifestLayoutVersion(remoteInfo) || PACKAGE_LAYOUT_VERSION;
  const layoutUpdateNeeded = currentLayout < latestLayout;
  const dashboardUpdateNeeded = !!latestDashboardRevision && (
    !currentDashboardRevision || currentDashboardRevision !== latestDashboardRevision
  );
  const revisionUpdateNeeded = !remoteInfo && !!latestSha && (!currentSha || !latestSha.startsWith(currentSha));
  const updateAvailable = layoutUpdateNeeded || dashboardUpdateNeeded || revisionUpdateNeeded;
  return {
    localManifest,
    remoteInfo,
    release,
    latestSha,
    currentVersion,
    currentSha,
    currentDashboardRevision,
    latestDashboardRevision,
    currentLayout,
    latestLayout,
    layoutUpdateNeeded,
    dashboardUpdateNeeded,
    revisionUpdateNeeded,
    updateAvailable,
    asset: releaseAsset(release)
  };
}

function updateLogHtml(info) {
  const current = info.currentVersion || "알 수 없음";
  const latest = info.latestSha ? info.latestSha.slice(0, 12) : "확인 실패";
  const status = info.updateAvailable ? "새 버전 있음" : "최신 상태";
  const layout = info.currentLayout || "-";
  const release = info.release || {};
  const notes = release.body ? escapeHtml(release.body).replace(/\n/g, "<br>") : "릴리스 노트가 없습니다.";
  const asset = info.asset?.name || RELEASE_ASSET_NAME;
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>TFM2.gg 업데이트 로그</title>
  <style>
    body { margin: 0; background: #f5f7fb; color: #111827; font-family: "Malgun Gothic", "Segoe UI", sans-serif; }
    main { max-width: 820px; margin: 0 auto; padding: 24px; }
    section { background: #fff; border: 1px solid #dbe2ea; padding: 18px; margin-bottom: 14px; }
    h1 { margin: 0 0 10px; font-size: 22px; font-weight: 400; }
    h2 { margin: 0 0 8px; font-size: 15px; font-weight: 400; color: #1d4ed8; }
    p { margin: 6px 0; line-height: 1.7; }
    code { background: #eef2f7; padding: 2px 6px; }
  </style>
</head>
<body>
  <main>
    <section>
      <h1>TFM2.gg 업데이트 로그</h1>
      <p>상태: <code>${escapeHtml(status)}</code></p>
      <p>현재 패키지: <code>${escapeHtml(current)}</code></p>
      <p>설치 구조: <code>${escapeHtml(layout)}</code></p>
      <p>최신 커밋: <code>${escapeHtml(latest)}</code></p>
      <p>배포 파일: <code>${escapeHtml(asset)}</code></p>
    </section>
    <section>
      <h2>릴리스 정보</h2>
      <p>태그: <code>${escapeHtml(release.tag_name || "latest")}</code></p>
      <p>게시: <code>${escapeHtml(release.published_at || "-")}</code></p>
      <p><a href="${escapeHtml(release.html_url || `https://github.com/${REPO_FULL_NAME}/releases/tag/latest`)}" target="_blank">GitHub 릴리스 열기</a></p>
    </section>
    <section>
      <h2>노트</h2>
      <p>${notes}</p>
    </section>
  </main>
</body>
</html>`;
}

async function showUpdateLogWindow() {
  const win = new BrowserWindow({
    width: 860,
    height: 680,
    minWidth: 720,
    minHeight: 520,
    title: "TFM2.gg 업데이트 로그",
    backgroundColor: "#f5f7fb",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHtml("업데이트 로그를 불러오는 중입니다."))}`);
  try {
    const info = await getUpdateInfo();
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(updateLogHtml(info))}`);
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(loadingHtml(`업데이트 로그를 불러오지 못했습니다.\n${message}`))}`);
  }
}

function localUpdateDir() {
  const root = process.env.LOCALAPPDATA || app.getPath("userData");
  return path.join(root, "TFM2.gg", "updates", "latest");
}

function findDistributionRoot(root) {
  if (fs.existsSync(path.join(root, "payload"))) {
    return root;
  }
  for (const name of fs.readdirSync(root)) {
    const candidate = path.join(root, name);
    if (fs.statSync(candidate).isDirectory() && fs.existsSync(path.join(candidate, "payload"))) {
      return candidate;
    }
  }
  throw new Error("다운로드한 ZIP에서 배포 패키지를 찾지 못했습니다.");
}

async function downloadAndLaunchInstaller(info) {
  if (!info.asset) {
    throw new Error("최신 릴리스에 배포 ZIP이 없습니다.");
  }
  const updateDir = localUpdateDir();
  const zipPath = path.join(updateDir, info.asset.name || RELEASE_ASSET_NAME);
  const extractRoot = path.join(updateDir, "extracted");
  fs.rmSync(extractRoot, { recursive: true, force: true });
  fs.mkdirSync(extractRoot, { recursive: true });
  const url = info.asset.browser_download_url || info.asset.url;
  setLoading("새 버전을 다운로드하는 중입니다. 잠시만 기다려 주세요.");
  await downloadFile(url, zipPath);
  await runPowershell([
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    `Expand-Archive -LiteralPath ${psQuote(zipPath)} -DestinationPath ${psQuote(extractRoot)} -Force`
  ], updateDir);
  const packageRoot = findDistributionRoot(extractRoot);
  const installer = path.join(packageRoot, "TFM2GGInstaller.exe");
  if (!fs.existsSync(installer)) {
    throw new Error("배포 패키지에서 TFM2GGInstaller.exe를 찾지 못했습니다.");
  }
  dialog.showMessageBox(mainWindow, {
    type: "info",
    title: "TFM2.gg 업데이트",
    message: "설치 도구를 실행합니다.",
    detail: "업데이트를 적용할 수 있도록 현재 대시보드는 닫힙니다."
  });
  spawn(installer, [], {
    cwd: packageRoot,
    detached: true,
    stdio: "ignore",
    windowsHide: false
  }).unref();
  app.quit();
}

async function checkForUpdatesOnStartup() {
  if (updatePromptShown) {
    return;
  }
  try {
    const info = await getUpdateInfo();
    if (!info.updateAvailable) {
      return;
    }
    updatePromptShown = true;
    const updateReason = info.layoutUpdateNeeded
      ? "설치 구조 업데이트 필요"
      : info.dashboardUpdateNeeded
        ? "대시보드 파일 업데이트 필요"
        : "새 패키지 버전 있음";
    const latestVersion = info.remoteInfo?.packageVersion || (info.latestSha ? info.latestSha.slice(0, 12) : "latest");
    const response = await dialog.showMessageBox(mainWindow, {
      type: "question",
      title: "TFM2.gg 업데이트",
      message: "TFM2.gg 새 버전이 있습니다.",
      detail: `현재 버전: ${info.currentVersion || "알 수 없음"}\n설치 구조: ${info.currentLayout || "-"}\n최신 버전: ${latestVersion}\n사유: ${updateReason}\n\n새 버전으로 업데이트하시겠습니까?`,
      buttons: ["새 버전으로 업데이트", "나중에"],
      defaultId: 0,
      cancelId: 1
    });
    if (response.response === 0) {
      await downloadAndLaunchInstaller(info);
    }
  } catch (error) {
    console.warn("Update check failed:", error && error.message ? error.message : error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 950,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#080c12",
    title: "TFM2 Meta Dashboard",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function registerPolicyIpc() {
  if (policyIpcRegistered) {
    return;
  }
  policyIpcRegistered = true;
  ipcMain.handle("tfm2gg-policy:get-settings", () => readPolicySettings());
  ipcMain.handle("tfm2gg-policy:save-settings", (_event, settings) => writePolicySettings(settings));
  ipcMain.handle("tfm2gg-policy:regenerate", async (_event, settings) => regenerateAddonPolicies(settings));
}

function createAppMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Save 선택...",
          accelerator: "Ctrl+O",
          click: () => chooseSaveAndRefresh()
        },
        {
          label: "다시 갱신",
          accelerator: "F5",
          click: () => {
            if (savePath) {
              refreshDashboard({ initial: false });
            } else {
              chooseSaveAndRefresh();
            }
          }
        },
        { type: "separator" },
        { role: "quit", label: "Exit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "close" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "README 열기",
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.loadFile(path.join(dashboardDir, "README.md")).catch(() => {});
            }
          }
        },
        {
          label: "업데이트 로그",
          click: () => {
            showUpdateLogWindow().catch((error) => {
              const message = error && error.message ? error.message : String(error);
              dialog.showErrorBox("TFM2.gg 업데이트 로그", message);
            });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function resolveDashboardDir() {
  const appPath = app.getAppPath();
  const candidates = [
    path.join(appPath, "tfm2_meta_dashboard"),
    appPath,
    path.resolve(appPath, ".."),
    path.join(path.dirname(process.execPath), "tfm2_meta_dashboard")
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "refresh_meta_dashboard.ps1"))) {
      return candidate;
    }
  }
  throw new Error("tfm2_meta_dashboard 폴더를 찾지 못했습니다.");
}

function looksLikeGameRoot(dir) {
  if (!dir) {
    return false;
  }
  return (
    fs.existsSync(path.join(dir, "mods")) ||
    fs.existsSync(path.join(dir, "Teamfight Manager 2.exe")) ||
    fs.existsSync(path.join(dir, "TeamfightManager2.exe"))
  );
}

function resolveGameRoot() {
  const candidates = [];
  const exeDir = path.dirname(process.execPath);
  candidates.push(exeDir);
  candidates.push(path.dirname(exeDir));
  candidates.push(path.dirname(path.dirname(exeDir)));
  candidates.push(path.resolve(app.getAppPath(), "..", "..", ".."));
  for (const candidate of candidates) {
    if (looksLikeGameRoot(candidate)) {
      return candidate;
    }
  }
  return exeDir;
}

function defaultSaveDir() {
  const appData = process.env.APPDATA;
  if (!appData) {
    return undefined;
  }
  const candidate = path.join(appData, "TeamSamoyed", "TeamfightManager2", "data");
  return fs.existsSync(candidate) ? candidate : undefined;
}

async function selectSaveFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Teamfight Manager 2 세이브 파일 선택",
    defaultPath: defaultSaveDir(),
    properties: ["openFile"],
    filters: [
      { name: "TFM2 save files", extensions: ["data"] },
      { name: "All files", extensions: ["*"] }
    ]
  });
  if (result.canceled || !result.filePaths.length) {
    return null;
  }
  return result.filePaths[0];
}

function saveSnapshot(file) {
  const stat = fs.statSync(file);
  return {
    modifiedMs: Math.floor(stat.mtimeMs),
    size: stat.size
  };
}

function sameSnapshot(a, b) {
  return !!a && !!b && a.modifiedMs === b.modifiedMs && a.size === b.size;
}

async function waitForStableSave(file) {
  let previous = saveSnapshot(file);
  for (let i = 0; i < MAX_STABLE_CHECKS; i += 1) {
    await sleep(STABLE_MS);
    const next = saveSnapshot(file);
    if (sameSnapshot(previous, next)) {
      return next;
    }
    previous = next;
  }
  return previous;
}

function writeAutoRefreshStatus(state, message, extra = {}) {
  const dataDir = path.join(dashboardDir, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const status = {
    state,
    savePath,
    saveFile: savePath ? path.basename(savePath) : "",
    message,
    lastChangeAt: extra.lastChangeAt ?? null,
    lastRefreshAt,
    refreshCount,
    pollSeconds: Math.floor(POLL_MS / 1000),
    error: extra.error ?? null
  };
  const content = `window.TFM2_AUTO_REFRESH_STATUS = ${JSON.stringify(status, null, 2)};\n`;
  fs.writeFileSync(path.join(dataDir, "auto-refresh-status.js"), content, "utf8");
}

function runRefresh() {
  return new Promise((resolve, reject) => {
    const refreshScript = path.join(dashboardDir, "refresh_meta_dashboard.ps1");
    const args = [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      refreshScript,
      "-SavePath",
      savePath,
      "-NoPrompt",
      "-SkipLiveExporter"
    ];
    const child = spawn("powershell.exe", args, {
      cwd: dashboardDir,
      windowsHide: true,
      env: {
        ...process.env,
        TFM2_GAME_ROOT: gameRoot,
        PYTHONDONTWRITEBYTECODE: "1"
      }
    });

    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.stderr.on("data", (data) => {
      output += data.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`대시보드 갱신 실패(exit ${code}). _last_refresh_log.txt를 확인하세요.\n${output}`));
      }
    });
  });
}

async function refreshDashboard({ initial = false, changedAt = null } = {}) {
  if (refreshing) {
    return;
  }
  refreshing = true;
  try {
    writeAutoRefreshStatus("refreshing", initial ? "initial dashboard refresh" : "save changed; refreshing dashboard data", {
      lastChangeAt: changedAt
    });
    if (initial) {
      setLoading("세이브를 분석하는 중입니다. 첫 실행은 잠깐 걸릴 수 있습니다.");
    }
    await runRefresh();
    refreshCount += 1;
    lastRefreshAt = nowEpoch();
    lastSnapshot = saveSnapshot(savePath);
    writeAutoRefreshStatus(initial ? "watching" : "updated", "dashboard data refreshed", {
      lastChangeAt: changedAt
    });
    console.log(`${clockNow()} refresh #${refreshCount} complete`);
    await mainWindow.loadFile(path.join(dashboardDir, "index.html"));
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    writeAutoRefreshStatus("error", "dashboard refresh failed", {
      lastChangeAt: changedAt,
      error: message
    });
    setLoading(message);
    dialog.showErrorBox("TFM2 Meta Dashboard", message);
  } finally {
    refreshing = false;
  }
}

function startWatchingSave() {
  if (watcherStarted) {
    return;
  }
  watcherStarted = true;
  setInterval(async () => {
    if (!savePath || refreshing) {
      return;
    }
    let current;
    try {
      current = saveSnapshot(savePath);
    } catch (error) {
      writeAutoRefreshStatus("error", "save file could not be read", {
        error: error.message || String(error)
      });
      return;
    }
    if (sameSnapshot(current, lastSnapshot)) {
      return;
    }
    const changedAt = nowEpoch();
    console.log(`${clockNow()} save changed; waiting for autosave`);
    writeAutoRefreshStatus("refreshing", "save changed; waiting for autosave to finish", {
      lastChangeAt: changedAt
    });
    try {
      lastSnapshot = await waitForStableSave(savePath);
      await refreshDashboard({ initial: false, changedAt });
    } catch (error) {
      writeAutoRefreshStatus("error", "save file did not stabilize", {
        lastChangeAt: changedAt,
        error: error.message || String(error)
      });
    }
  }, POLL_MS);
}

async function chooseSaveAndRefresh() {
  const selected = await selectSaveFile();
  if (!selected) {
    return;
  }
  savePath = selected;
  lastSnapshot = null;
  refreshCount = 0;
  lastRefreshAt = null;
  console.log(`Save: ${savePath}`);
  writeAutoRefreshStatus("refreshing", "selected save; refreshing dashboard data");
  await refreshDashboard({ initial: true });
  startWatchingSave();
}

async function main() {
  dashboardDir = resolveDashboardDir();
  gameRoot = resolveGameRoot();
  registerPolicyIpc();
  createWindow();
  createAppMenu();
  console.log(`Game root: ${gameRoot}`);
  writeAutoRefreshStatus("idle", "File > Save 선택... 에서 세이브를 선택하세요.");
  await mainWindow.loadFile(path.join(dashboardDir, "index.html"));
  setTimeout(() => {
    checkForUpdatesOnStartup();
  }, 1200);
}

app.whenReady().then(() => {
  main().catch((error) => {
    const message = error && error.message ? error.message : String(error);
    dialog.showErrorBox("TFM2 Meta Dashboard", message);
    app.quit();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
