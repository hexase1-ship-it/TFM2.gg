const { app, BrowserWindow, Menu, dialog } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

app.disableHardwareAcceleration();

const POLL_MS = 3000;
const STABLE_MS = 1000;
const MAX_STABLE_CHECKS = 30;

let mainWindow = null;
let dashboardDir = null;
let gameRoot = null;
let savePath = null;
let lastSnapshot = null;
let refreshCount = 0;
let lastRefreshAt = null;
let refreshing = false;
let watcherStarted = false;

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

function loadingHtml(message) {
  const safe = String(message || "").replace(/[&<>"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  }[ch]));
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
  createWindow();
  createAppMenu();
  console.log(`Game root: ${gameRoot}`);
  writeAutoRefreshStatus("idle", "File > Save 선택... 에서 세이브를 선택하세요.");
  await mainWindow.loadFile(path.join(dashboardDir, "index.html"));
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
