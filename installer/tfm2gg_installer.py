from __future__ import annotations

import json
import os
import queue
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
import webbrowser
import zipfile
from dataclasses import dataclass
from pathlib import Path
from tkinter import filedialog, messagebox
import tkinter as tk
from tkinter import ttk


APP_NAME = "TFM2.gg"
MOD_ID = "tfm2_meta_item_delegate"
REPO_FULL_NAME = "hexase1-ship-it/TFM2.gg"
RELEASE_API = f"https://api.github.com/repos/{REPO_FULL_NAME}/releases/latest"
RELEASE_ASSET_NAME = "TFM2.gg_Distribution.zip"
TARGET_GAME_VERSION = "0.4.7"
MOD_PACKAGE_DIR_NAME = "tfm2_meta_item_delegate (팀파매.gg 통계 아이템 자동 설정 애드온 모드)"
SOURCE_DASHBOARD_DIR_NAME = "TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)"

EXPECTED_GAME_FILES = {
    "TeamfightManager2.exe": 62_701_568,
    "bundle.game_data": 1_118_940_252,
}

DEFAULT_GAME_DIR = Path(r"C:\Program Files (x86)\Steam\steamapps\common\Teamfight Manager2")


@dataclass
class ComponentStatus:
    ok: bool
    label: str
    detail: str


def is_frozen() -> bool:
    return bool(getattr(sys, "frozen", False))


def package_root() -> Path:
    if is_frozen():
        return Path(sys.executable).resolve().parent
    here = Path(__file__).resolve().parent
    if (here / "payload").exists():
        return here
    if (here.parent / "payload").exists():
        return here.parent
    return here.parent


def user_state_dir() -> Path:
    root = os.environ.get("APPDATA") or str(Path.home())
    path = Path(root) / APP_NAME
    path.mkdir(parents=True, exist_ok=True)
    return path


def local_update_dir() -> Path:
    root = os.environ.get("LOCALAPPDATA") or str(user_state_dir())
    path = Path(root) / APP_NAME / "updates"
    path.mkdir(parents=True, exist_ok=True)
    return path


def read_json(path: Path, default=None):
    try:
        return json.loads(path.read_text(encoding="utf-8-sig"))
    except Exception:
        return default


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def copy_tree_contents(src: Path, dst: Path) -> None:
    if not src.exists():
        raise FileNotFoundError(f"원본 없음: {src}")
    dst.mkdir(parents=True, exist_ok=True)
    for item in src.iterdir():
        target = dst / item.name
        if item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)


def copy_dir(src: Path, dst: Path) -> None:
    if not src.exists():
        raise FileNotFoundError(f"원본 없음: {src}")
    shutil.copytree(src, dst, dirs_exist_ok=True)


def remove_known_path(root: Path, target: Path) -> None:
    root = root.resolve()
    target = target.resolve()
    if root != target and root not in target.parents:
        raise RuntimeError(f"안전 범위 밖 삭제 차단: {target}")
    if target.is_dir():
        shutil.rmtree(target)
    elif target.exists():
        target.unlink()


def dir_size(path: Path) -> int:
    if not path.exists():
        return 0
    total = 0
    for item in path.rglob("*"):
        if item.is_file():
            try:
                total += item.stat().st_size
            except OSError:
                pass
    return total


class InstallerModel:
    def __init__(self, root: Path):
        self.root = root
        self.remote_root: Path | None = None
        self.config_path = user_state_dir() / "config.json"
        self.config = read_json(self.config_path, {})
        self.manifest = self.load_manifest(root)

    def load_manifest(self, root: Path) -> dict:
        for candidate in [
            root / "package_manifest.json",
            root / "installer" / "package_manifest.json",
        ]:
            data = read_json(candidate)
            if isinstance(data, dict):
                return data
        return {
            "name": APP_NAME,
            "packageVersion": "local-dev",
            "targetGameVersion": TARGET_GAME_VERSION,
            "repository": REPO_FULL_NAME,
            "releaseAsset": RELEASE_ASSET_NAME,
            "expectedGameFiles": EXPECTED_GAME_FILES,
        }

    def save_config(self, game_dir: Path) -> None:
        self.config["gameDir"] = str(game_dir)
        write_json(self.config_path, self.config)

    def payload_root(self, source_root: Path | None = None) -> Path:
        root = source_root or self.remote_root or self.root
        payload = root / "payload"
        return payload if payload.exists() else root

    def dashboard_payload(self, source_root: Path | None = None) -> Path:
        payload = self.payload_root(source_root)
        candidate = payload / "dashboard_app"
        if candidate.exists():
            return candidate
        return self.root / SOURCE_DASHBOARD_DIR_NAME / "resources" / "app"

    def addon_payload(self, source_root: Path | None = None) -> Path:
        payload = self.payload_root(source_root)
        candidate = payload / "mods" / MOD_ID
        if candidate.exists():
            return candidate
        return self.root / MOD_PACKAGE_DIR_NAME

    def package_readme(self, source_root: Path | None = None) -> Path:
        payload = self.payload_root(source_root)
        for candidate in [
            payload / "README.md",
            self.root / "README.md",
            self.addon_payload(source_root) / "README.md",
        ]:
            if candidate.exists():
                return candidate
        return self.root / "README.md"

    def guessed_game_dirs(self) -> list[Path]:
        guesses = []
        configured = self.config.get("gameDir")
        if configured:
            guesses.append(Path(configured))
        env = os.environ.get("TFM2_GAME_DIR")
        if env:
            guesses.append(Path(env))
        guesses.append(DEFAULT_GAME_DIR)
        guesses.extend(self.steam_library_guesses())

        seen = set()
        result = []
        for path in guesses:
            key = str(path).lower()
            if key not in seen:
                result.append(path)
                seen.add(key)
        return result

    def steam_library_guesses(self) -> list[Path]:
        candidates = []
        steam_roots = [
            Path(r"C:\Program Files (x86)\Steam"),
            Path(r"C:\Program Files\Steam"),
        ]
        for steam in steam_roots:
            library_file = steam / "steamapps" / "libraryfolders.vdf"
            if not library_file.exists():
                continue
            try:
                text = library_file.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for line in text.splitlines():
                line = line.strip()
                if '"path"' not in line:
                    continue
                parts = line.split('"')
                if len(parts) >= 4:
                    library = Path(parts[3].replace("\\\\", "\\"))
                    candidates.append(library / "steamapps" / "common" / "Teamfight Manager2")
        return candidates

    def detect_game_dir(self) -> Path:
        for path in self.guessed_game_dirs():
            if (path / "TeamfightManager2.exe").exists():
                return path
        return self.guessed_game_dirs()[0]

    def compatibility(self, game_dir: Path) -> tuple[ComponentStatus, list[ComponentStatus]]:
        checks = []
        game_exists = (game_dir / "TeamfightManager2.exe").exists()
        if not game_exists:
            checks.append(ComponentStatus(False, "게임 경로", "TeamfightManager2.exe를 찾지 못했습니다."))
            return ComponentStatus(False, "미감지", "게임 설치 경로를 확인하세요."), checks

        expected = self.manifest.get("expectedGameFiles") or EXPECTED_GAME_FILES
        size_matches = 0
        size_checked = 0
        for name, expected_size in expected.items():
            file_path = game_dir / name
            if not file_path.exists():
                checks.append(ComponentStatus(False, name, "필수 파일 없음"))
                continue
            size_checked += 1
            actual = file_path.stat().st_size
            if int(actual) == int(expected_size):
                size_matches += 1
                checks.append(ComponentStatus(True, name, "0.4.7 기준 파일 크기 일치"))
            else:
                checks.append(
                    ComponentStatus(
                        False,
                        name,
                        f"크기 다름: {actual:,} bytes",
                    )
                )

        mods_ok = (game_dir / "mods").exists()
        resources_ok = (game_dir / "resources" / "app").exists()
        checks.append(ComponentStatus(mods_ok, "mods 폴더", "있음" if mods_ok else "없음"))
        checks.append(
            ComponentStatus(
                resources_ok,
                "dashboard resources",
                "있음" if resources_ok else "없음",
            )
        )

        if size_checked and size_matches == size_checked and mods_ok and resources_ok:
            main = ComponentStatus(True, "호환", f"Teamfight Manager 2 {TARGET_GAME_VERSION} 기준과 일치")
        elif mods_ok and resources_ok:
            main = ComponentStatus(
                False,
                "주의",
                f"설치는 가능하지만 {TARGET_GAME_VERSION} 기준 파일과 완전히 일치하지 않습니다.",
            )
        else:
            main = ComponentStatus(False, "부적합", "필수 폴더가 없어 자동 설치가 안전하지 않습니다.")
        return main, checks

    def install_dashboard(self, game_dir: Path, source_root: Path | None = None) -> None:
        resources_app = game_dir / "resources" / "app"
        resources_app.mkdir(parents=True, exist_ok=True)
        self.backup_existing(game_dir, [resources_app / "tfm2_meta_dashboard", resources_app / "mods" / MOD_ID])
        copy_tree_contents(self.dashboard_payload(source_root), resources_app)

    def install_addon(self, game_dir: Path, source_root: Path | None = None) -> None:
        mods_dir = game_dir / "mods"
        addon_dst = mods_dir / MOD_ID
        mods_dir.mkdir(parents=True, exist_ok=True)
        self.backup_existing(game_dir, [addon_dst])
        copy_dir(self.addon_payload(source_root), addon_dst)

    def install_all(self, game_dir: Path, source_root: Path | None = None) -> None:
        self.save_config(game_dir)
        self.install_dashboard(game_dir, source_root)
        self.install_addon(game_dir, source_root)

    def remove_all(self, game_dir: Path) -> None:
        resources_app = game_dir / "resources" / "app"
        targets = [
            resources_app / "tfm2_meta_dashboard",
            resources_app / "mods" / MOD_ID,
            game_dir / "mods" / MOD_ID,
        ]
        self.backup_existing(game_dir, [target for target in targets if target.exists()])
        for target in targets:
            if target.exists():
                remove_known_path(game_dir, target)

    def backup_existing(self, game_dir: Path, targets: list[Path]) -> None:
        existing = [target for target in targets if target.exists()]
        if not existing:
            return
        stamp = time.strftime("%Y%m%d_%H%M%S")
        backup_root = user_state_dir() / "backups" / stamp
        backup_root.mkdir(parents=True, exist_ok=True)
        for target in existing:
            rel = target.resolve().relative_to(game_dir.resolve())
            dst = backup_root / rel
            if target.is_dir():
                shutil.copytree(target, dst, dirs_exist_ok=True)
            else:
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(target, dst)

    def installed_status(self, game_dir: Path) -> dict:
        addon = game_dir / "mods" / MOD_ID
        mod_info = read_json(addon / "mod.mod_info", {})
        dashboard = game_dir / "resources" / "app" / "tfm2_meta_dashboard"
        core_json = addon / "core-item-builds.json"
        core_data = read_json(core_json, {})
        return {
            "dashboardInstalled": dashboard.exists(),
            "addonInstalled": addon.exists(),
            "addonVersion": mod_info.get("version") or "-",
            "coreGeneratedAt": core_data.get("generatedAt") or "-",
            "packageVersion": self.manifest.get("packageVersion") or "local-dev",
            "dashboardSize": dir_size(dashboard),
            "addonSize": dir_size(addon),
        }

    def github_token(self) -> str | None:
        token = os.environ.get("TFM2GG_GITHUB_TOKEN") or os.environ.get("GITHUB_TOKEN")
        if token:
            return token.strip()
        gh = shutil.which("gh")
        if not gh:
            return None
        try:
            result = subprocess.run(
                [gh, "auth", "token"],
                capture_output=True,
                text=True,
                timeout=8,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
            )
        except Exception:
            return None
        token = result.stdout.strip()
        return token or None

    def request_json(self, url: str) -> dict:
        req = urllib.request.Request(url)
        req.add_header("User-Agent", f"{APP_NAME}-Installer")
        token = self.github_token()
        if token:
            req.add_header("Authorization", f"Bearer {token}")
        with urllib.request.urlopen(req, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))

    def download_url(self, url: str, dst: Path, api_asset: bool = False) -> None:
        req = urllib.request.Request(url)
        req.add_header("User-Agent", f"{APP_NAME}-Installer")
        token = self.github_token()
        if token:
            req.add_header("Authorization", f"Bearer {token}")
        if api_asset:
            req.add_header("Accept", "application/octet-stream")
        with urllib.request.urlopen(req, timeout=90) as response:
            dst.parent.mkdir(parents=True, exist_ok=True)
            with dst.open("wb") as fh:
                shutil.copyfileobj(response, fh)

    def download_latest_distribution(self) -> tuple[Path, dict]:
        release = self.request_json(RELEASE_API)
        assets = release.get("assets") or []
        asset = None
        for candidate in assets:
            if candidate.get("name") == RELEASE_ASSET_NAME:
                asset = candidate
                break
        if asset is None:
            for candidate in assets:
                if str(candidate.get("name", "")).lower().endswith(".zip"):
                    asset = candidate
                    break
        if asset is None:
            raise RuntimeError("latest release에 배포 ZIP asset이 없습니다.")

        tag = release.get("tag_name") or "latest"
        safe_tag = "".join(ch for ch in tag if ch.isalnum() or ch in "._-")
        target_zip = local_update_dir() / safe_tag / asset["name"]
        download_url = asset.get("url") or asset.get("browser_download_url")
        if asset.get("url"):
            self.download_url(download_url, target_zip, api_asset=True)
        else:
            self.download_url(download_url, target_zip)

        extract_root = local_update_dir() / safe_tag / "extracted"
        if extract_root.exists():
            shutil.rmtree(extract_root)
        extract_root.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(target_zip, "r") as archive:
            archive.extractall(extract_root)

        package = self.find_extracted_package(extract_root)
        self.remote_root = package
        return package, release

    def find_extracted_package(self, extract_root: Path) -> Path:
        if (extract_root / "payload").exists():
            return extract_root
        for child in extract_root.iterdir():
            if child.is_dir() and (child / "payload").exists():
                return child
        raise RuntimeError("다운로드한 ZIP에서 payload 폴더를 찾지 못했습니다.")


class Tfm2InstallerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("TFM2.gg 설치 도구")
        self.geometry("920x660")
        self.minsize(860, 620)
        self.configure(bg="#f5f7fb")

        self.model = InstallerModel(package_root())
        self.work_queue: queue.Queue[tuple[str, object]] = queue.Queue()
        self.game_dir_var = tk.StringVar(value=str(self.model.detect_game_dir()))
        self.status_var = tk.StringVar(value="준비됨")
        self.compat_title_var = tk.StringVar(value="-")
        self.compat_detail_var = tk.StringVar(value="설치 경로를 확인하는 중입니다.")
        self.remote_var = tk.StringVar(value="원격 업데이트: 확인 전")

        self.style = ttk.Style(self)
        self.configure_style()
        self.create_widgets()
        self.after(100, self.refresh_status)
        self.after(100, self.drain_queue)

    def configure_style(self):
        self.style.theme_use("clam")
        bg = "#f5f7fb"
        card = "#ffffff"
        ink = "#0f172a"
        muted = "#64748b"
        self.style.configure("TFrame", background=bg)
        self.style.configure(
            "Card.TFrame",
            background=card,
            relief="solid",
            borderwidth=1,
            bordercolor="#dbe2ea",
            lightcolor="#dbe2ea",
            darkcolor="#dbe2ea",
        )
        self.style.configure("TLabel", background=bg, foreground="#1f2937", font=("Segoe UI", 10))
        self.style.configure("Card.TLabel", background=card, foreground="#1f2937", font=("Segoe UI", 10))
        self.style.configure("Title.TLabel", background=bg, foreground=ink, font=("Segoe UI Semibold", 22))
        self.style.configure("Subtle.TLabel", background=bg, foreground=muted, font=("Segoe UI", 10))
        self.style.configure("CardTitle.TLabel", background=card, foreground=ink, font=("Segoe UI Semibold", 12))
        self.style.configure("StatusGood.TLabel", background="#dcfce7", foreground="#166534", font=("Segoe UI Semibold", 11))
        self.style.configure("StatusWarn.TLabel", background="#fff7ed", foreground="#9a3412", font=("Segoe UI Semibold", 11))
        self.style.configure("StatusBad.TLabel", background="#fee2e2", foreground="#991b1b", font=("Segoe UI Semibold", 11))
        self.style.configure(
            "TButton",
            font=("Segoe UI", 10),
            padding=(10, 8),
            background="#e5e7eb",
            foreground="#111827",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("TButton", background=[("active", "#d1d5db"), ("pressed", "#cbd5e1")])
        self.style.configure(
            "Primary.TButton",
            font=("Segoe UI Semibold", 10),
            padding=(12, 8),
            background="#2563eb",
            foreground="#ffffff",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("Primary.TButton", background=[("active", "#1d4ed8"), ("pressed", "#1e40af")])
        self.style.configure(
            "Accent.TButton",
            font=("Segoe UI Semibold", 10),
            padding=(10, 8),
            background="#059669",
            foreground="#ffffff",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("Accent.TButton", background=[("active", "#047857"), ("pressed", "#065f46")])
        self.style.configure(
            "Danger.TButton",
            font=("Segoe UI Semibold", 10),
            padding=(10, 8),
            background="#ef4444",
            foreground="#ffffff",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("Danger.TButton", background=[("active", "#dc2626"), ("pressed", "#b91c1c")])
        self.style.configure(
            "Refresh.TButton",
            font=("Segoe UI", 10),
            padding=(10, 8),
            background="#dbeafe",
            foreground="#1e3a8a",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("Refresh.TButton", background=[("active", "#bfdbfe"), ("pressed", "#93c5fd")])
        self.style.configure("TEntry", padding=(8, 6), fieldbackground="#ffffff", bordercolor="#cbd5e1", lightcolor="#cbd5e1", darkcolor="#cbd5e1")

    def create_widgets(self):
        outer = ttk.Frame(self, padding=22)
        outer.pack(fill="both", expand=True)
        outer.columnconfigure(0, weight=1)
        outer.rowconfigure(4, weight=1)

        header = ttk.Frame(outer)
        header.grid(row=0, column=0, sticky="ew")
        header.columnconfigure(0, weight=1)
        ttk.Label(header, text="TFM2.gg 설치 도구", style="Title.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(
            header,
            text=f"Teamfight Manager 2 {TARGET_GAME_VERSION} 대응 패키지",
            style="Subtle.TLabel",
        ).grid(row=1, column=0, sticky="w", pady=(2, 0))
        self.compat_pill = ttk.Label(header, textvariable=self.compat_title_var, style="StatusWarn.TLabel", padding=(12, 6))
        self.compat_pill.grid(row=0, column=1, rowspan=2, sticky="e")

        path_card = ttk.Frame(outer, style="Card.TFrame", padding=16)
        path_card.grid(row=1, column=0, sticky="ew", pady=(18, 12))
        path_card.columnconfigure(1, weight=1)
        ttk.Label(path_card, text="게임 설치 경로", style="CardTitle.TLabel").grid(row=0, column=0, columnspan=3, sticky="w")
        ttk.Label(path_card, text="TeamfightManager2.exe가 있는 폴더", style="Card.TLabel").grid(row=1, column=0, sticky="w", pady=(4, 8))
        entry = ttk.Entry(path_card, textvariable=self.game_dir_var)
        entry.grid(row=2, column=0, columnspan=2, sticky="ew", padx=(0, 8))
        ttk.Button(path_card, text="찾기", command=self.choose_game_dir).grid(row=2, column=2, sticky="e")

        status_row = ttk.Frame(outer)
        status_row.grid(row=2, column=0, sticky="ew", pady=(0, 12))
        status_row.columnconfigure(0, weight=1)
        status_row.columnconfigure(1, weight=1)
        status_row.columnconfigure(2, weight=1)
        self.game_card = self.make_info_card(status_row, 0, "호환성", self.compat_detail_var)
        self.install_card_var = tk.StringVar(value="설치 상태 확인 중")
        self.make_info_card(status_row, 1, "설치 상태", self.install_card_var)
        self.update_card_var = tk.StringVar(value=self.remote_var.get())
        self.make_info_card(status_row, 2, "업데이트", self.update_card_var)

        actions = ttk.Frame(outer, style="Card.TFrame", padding=16)
        actions.grid(row=3, column=0, sticky="ew", pady=(0, 12))
        for index in range(6):
            actions.columnconfigure(index, weight=1)
        ttk.Button(actions, text="설치", style="Primary.TButton", command=lambda: self.run_task("install")).grid(row=0, column=0, sticky="ew", padx=4)
        ttk.Button(actions, text="복구", command=lambda: self.run_task("repair")).grid(row=0, column=1, sticky="ew", padx=4)
        ttk.Button(actions, text="애드온 추가", style="Accent.TButton", command=lambda: self.run_task("addon")).grid(row=0, column=2, sticky="ew", padx=4)
        ttk.Button(actions, text="제거", style="Danger.TButton", command=self.confirm_remove).grid(row=0, column=3, sticky="ew", padx=4)
        ttk.Button(actions, text="README", command=self.show_readme).grid(row=0, column=4, sticky="ew", padx=4)
        ttk.Button(actions, text="원격 업데이트", style="Refresh.TButton", command=lambda: self.run_task("update")).grid(row=0, column=5, sticky="ew", padx=4)

        body = ttk.Frame(outer)
        body.grid(row=4, column=0, sticky="nsew")
        body.columnconfigure(0, weight=1)
        body.rowconfigure(0, weight=1)
        log_card = ttk.Frame(body, style="Card.TFrame", padding=14)
        log_card.grid(row=0, column=0, sticky="nsew")
        log_card.columnconfigure(0, weight=1)
        log_card.rowconfigure(1, weight=1)
        ttk.Label(log_card, text="작업 로그", style="CardTitle.TLabel").grid(row=0, column=0, sticky="w", pady=(0, 8))
        self.log_text = tk.Text(
            log_card,
            height=12,
            bg="#0f172a",
            fg="#dbeafe",
            insertbackground="#dbeafe",
            relief="flat",
            padx=12,
            pady=10,
            font=("Consolas", 9),
            wrap="word",
        )
        self.log_text.grid(row=1, column=0, sticky="nsew")

        footer = ttk.Frame(outer)
        footer.grid(row=5, column=0, sticky="ew", pady=(12, 0))
        footer.columnconfigure(0, weight=1)
        ttk.Label(footer, textvariable=self.status_var, style="Subtle.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Button(footer, text="상태 새로고침", style="Refresh.TButton", command=self.refresh_status).grid(row=0, column=1, sticky="e")

    def make_info_card(self, parent, column: int, title: str, var: tk.StringVar):
        card = ttk.Frame(parent, style="Card.TFrame", padding=14)
        card.grid(row=0, column=column, sticky="ew", padx=(0 if column == 0 else 6, 0 if column == 2 else 6))
        ttk.Label(card, text=title, style="CardTitle.TLabel").pack(anchor="w")
        ttk.Label(card, textvariable=var, style="Card.TLabel", wraplength=245, justify="left").pack(anchor="w", pady=(8, 0))
        return card

    def log(self, message: str):
        stamp = time.strftime("%H:%M:%S")
        self.log_text.insert("end", f"[{stamp}] {message}\n")
        self.log_text.see("end")

    def choose_game_dir(self):
        initial = self.game_dir_var.get() or str(DEFAULT_GAME_DIR)
        selected = filedialog.askdirectory(title="Teamfight Manager2 설치 폴더 선택", initialdir=initial)
        if selected:
            self.game_dir_var.set(selected)
            self.model.save_config(Path(selected))
            self.refresh_status()

    def current_game_dir(self) -> Path:
        return Path(self.game_dir_var.get()).expanduser()

    def refresh_status(self):
        game_dir = self.current_game_dir()
        main, checks = self.model.compatibility(game_dir)
        self.compat_title_var.set(main.label)
        self.compat_detail_var.set(main.detail)
        self.compat_pill.configure(style="StatusGood.TLabel" if main.ok else ("StatusWarn.TLabel" if main.label == "주의" else "StatusBad.TLabel"))

        installed = self.model.installed_status(game_dir)
        install_lines = [
            f"대시보드: {'설치됨' if installed['dashboardInstalled'] else '없음'}",
            f"애드온: {'설치됨' if installed['addonInstalled'] else '없음'}",
            f"애드온 버전: {installed['addonVersion']}",
            f"메타 생성: {installed['coreGeneratedAt']}",
        ]
        self.install_card_var.set("\n".join(install_lines))
        self.update_card_var.set(
            f"패키지: {installed['packageVersion']}\n"
            f"Repo: {REPO_FULL_NAME}\n"
            f"Asset: {RELEASE_ASSET_NAME}"
        )
        self.status_var.set(f"경로: {game_dir}")
        self.log("상태 갱신 완료")

    def run_task(self, kind: str):
        thread = threading.Thread(target=self.worker, args=(kind,), daemon=True)
        thread.start()

    def worker(self, kind: str):
        try:
            self.work_queue.put(("log", f"{kind} 작업 시작"))
            game_dir = self.current_game_dir()
            if kind in {"install", "repair"}:
                self.model.install_all(game_dir)
                self.work_queue.put(("log", "대시보드와 애드온 설치/복구 완료"))
            elif kind == "addon":
                self.model.install_addon(game_dir)
                self.work_queue.put(("log", "아이템 자동 설정 애드온 설치 완료"))
            elif kind == "remove":
                self.model.remove_all(game_dir)
                self.work_queue.put(("log", "TFM2.gg 설치 항목 제거 완료"))
            elif kind == "update":
                package, release = self.model.download_latest_distribution()
                self.work_queue.put(("log", f"원격 패키지 다운로드 완료: {package}"))
                self.work_queue.put(("remote_apply", (package, release)))
            self.work_queue.put(("refresh", None))
            self.work_queue.put(("done", kind))
        except PermissionError as exc:
            self.work_queue.put(("error", f"권한 오류: 관리자 권한으로 다시 실행하세요.\n{exc}"))
        except urllib.error.HTTPError as exc:
            self.work_queue.put(("error", f"원격 업데이트 오류: HTTP {exc.code}. private repo라면 gh 로그인 또는 TFM2GG_GITHUB_TOKEN이 필요합니다."))
        except Exception as exc:
            self.work_queue.put(("error", str(exc)))

    def drain_queue(self):
        try:
            while True:
                kind, payload = self.work_queue.get_nowait()
                if kind == "log":
                    self.log(str(payload))
                elif kind == "error":
                    self.log(f"오류: {payload}")
                    messagebox.showerror("TFM2.gg", str(payload))
                elif kind == "refresh":
                    self.refresh_status()
                elif kind == "remote_apply":
                    package, release = payload
                    tag = release.get("tag_name") or "latest"
                    if messagebox.askyesno("원격 업데이트", f"{tag} 패키지를 받았습니다.\n이 패키지로 설치/복구를 바로 적용할까요?"):
                        threading.Thread(target=self.apply_remote_package, args=(package,), daemon=True).start()
                elif kind == "done":
                    self.status_var.set(f"{payload} 완료")
        except queue.Empty:
            pass
        self.after(120, self.drain_queue)

    def apply_remote_package(self, package: Path):
        try:
            self.work_queue.put(("log", "원격 패키지 설치/복구 적용 시작"))
            self.model.install_all(self.current_game_dir(), source_root=package)
            self.work_queue.put(("log", "원격 패키지 설치/복구 적용 완료"))
            self.work_queue.put(("refresh", None))
        except Exception as exc:
            self.work_queue.put(("error", str(exc)))

    def confirm_remove(self):
        if messagebox.askyesno("제거 확인", "TFM2.gg 대시보드와 아이템 자동 설정 애드온을 제거할까요?\n기존 항목은 백업 후 제거됩니다."):
            self.run_task("remove")

    def show_readme(self):
        readme = self.model.package_readme()
        if not readme.exists():
            messagebox.showinfo("README", "README 파일을 찾지 못했습니다.")
            return
        win = tk.Toplevel(self)
        win.title("TFM2.gg README")
        win.geometry("760x560")
        win.configure(bg="#f5f7fb")
        frame = ttk.Frame(win, padding=16)
        frame.pack(fill="both", expand=True)
        frame.rowconfigure(1, weight=1)
        frame.columnconfigure(0, weight=1)
        ttk.Label(frame, text="README", style="Title.TLabel").grid(row=0, column=0, sticky="w", pady=(0, 12))
        text = tk.Text(frame, bg="#ffffff", fg="#1f2937", relief="flat", padx=14, pady=12, wrap="word", font=("Segoe UI", 10))
        text.grid(row=1, column=0, sticky="nsew")
        text.insert("1.0", readme.read_text(encoding="utf-8", errors="replace"))
        text.configure(state="disabled")
        btns = ttk.Frame(frame)
        btns.grid(row=2, column=0, sticky="ew", pady=(12, 0))
        ttk.Button(btns, text="파일 열기", command=lambda: os.startfile(readme)).pack(side="left")
        ttk.Button(btns, text="GitHub 열기", command=lambda: webbrowser.open(f"https://github.com/{REPO_FULL_NAME}")).pack(side="left", padx=(8, 0))
        ttk.Button(btns, text="닫기", command=win.destroy).pack(side="right")


def main():
    app = Tfm2InstallerApp()
    app.mainloop()


if __name__ == "__main__":
    main()
