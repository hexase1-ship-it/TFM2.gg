from __future__ import annotations

import json
import os
import queue
import re
import shutil
import ssl
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
RELEASE_PAGE_URL = f"https://github.com/{REPO_FULL_NAME}/releases/tag/latest"
DIRECT_DOWNLOAD_URL = f"https://github.com/{REPO_FULL_NAME}/releases/download/latest/{RELEASE_ASSET_NAME}"
TARGET_GAME_VERSION = "0.4.9"
PACKAGE_LAYOUT_VERSION = 2
DASHBOARD_INSTALL_DIR_NAME = APP_NAME
DASHBOARD_EXE_NAME = "TFM2MetaDashboard.exe"
DASHBOARD_SHELL_DEFAULT_ITEMS = (
    DASHBOARD_EXE_NAME,
    "locales",
    "chrome_100_percent.pak",
    "chrome_200_percent.pak",
    "d3dcompiler_47.dll",
    "dxcompiler.dll",
    "dxil.dll",
    "ffmpeg.dll",
    "icudtl.dat",
    "libEGL.dll",
    "libGLESv2.dll",
    "LICENSE",
    "LICENSES.chromium.html",
    "resources.pak",
    "snapshot_blob.bin",
    "v8_context_snapshot.bin",
    "version",
    "vk_swiftshader.dll",
    "vk_swiftshader_icd.json",
    "vulkan-1.dll",
)
DASHBOARD_SHELL_EXCLUDED_NAMES = {"resources"}
MOD_PACKAGE_DIR_NAME = "tfm2_meta_item_delegate (팀파매.gg 통계 아이템 자동 설정 애드온 모드)"
SOURCE_DASHBOARD_DIR_NAME = "TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)"

EXPECTED_GAME_FILES = {
    "TeamfightManager2.exe": 63_621_632,
    "bundle.game_data": 1_119_325_519,
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


def copy_dashboard_shell_contents(src: Path, dst: Path) -> None:
    exe = src / DASHBOARD_EXE_NAME
    if not exe.exists():
        raise FileNotFoundError(f"Dashboard executable not found: {exe}")
    dst.mkdir(parents=True, exist_ok=True)
    for item in src.iterdir():
        if item.name.lower() in DASHBOARD_SHELL_EXCLUDED_NAMES:
            continue
        target = dst / item.name
        if item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)


def remove_known_path(root: Path, target: Path) -> None:
    root = root.resolve()
    target = target.resolve()
    if root != target and root not in target.parents:
        raise RuntimeError(f"안전 범위 밖 삭제 차단: {target}")
    if target.is_dir():
        shutil.rmtree(target)
    elif target.exists():
        target.unlink()


def remove_empty_known_dir(root: Path, target: Path) -> None:
    if target.is_dir() and not any(target.iterdir()):
        remove_known_path(root, target)


def ensure_writable_files(paths: list[Path]) -> None:
    locked = []
    for path in paths:
        if not path.exists() or path.is_dir():
            continue
        try:
            with path.open("r+b"):
                pass
        except OSError:
            locked.append(path)
    if locked:
        joined = "\n".join(str(path) for path in locked)
        raise PermissionError("파일이 사용 중입니다. 게임과 대시보드를 종료한 뒤 다시 실행하세요.\n" + joined)


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


class RemoteUpdateError(RuntimeError):
    pass


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

    def manifest_target_game_version(self) -> str:
        return str(self.manifest.get("targetGameVersion") or "").strip()

    def effective_target_game_version(self) -> str:
        return TARGET_GAME_VERSION

    def expected_game_files(self) -> dict:
        manifest_expected = self.manifest.get("expectedGameFiles")
        if (
            self.manifest_target_game_version() == TARGET_GAME_VERSION
            and isinstance(manifest_expected, dict)
            and manifest_expected
        ):
            return manifest_expected
        return EXPECTED_GAME_FILES

    def save_config(self, game_dir: Path) -> None:
        self.config["gameDir"] = str(game_dir)
        write_json(self.config_path, self.config)

    def payload_root(self, source_root: Path | None = None) -> Path:
        root = source_root or self.remote_root or self.root
        payload = root / "payload"
        return payload if payload.exists() else root

    def dashboard_install_dir(self, game_dir: Path) -> Path:
        return game_dir / DASHBOARD_INSTALL_DIR_NAME

    def dashboard_app_dir(self, game_dir: Path) -> Path:
        return self.dashboard_install_dir(game_dir) / "resources" / "app"

    def legacy_dashboard_app_dir(self, game_dir: Path) -> Path:
        return game_dir / "resources" / "app"

    def source_project_dir(self, prefix: str, fallback_name: str) -> Path:
        exact = self.root / fallback_name
        if exact.exists():
            return exact
        if self.root.exists():
            matches = sorted(
                path for path in self.root.iterdir()
                if path.is_dir() and path.name.lower().startswith(prefix.lower())
            )
            if matches:
                return matches[-1]
        return exact

    def source_dashboard_dir(self) -> Path:
        return self.source_project_dir("TFM2_Meta_Dashboard", SOURCE_DASHBOARD_DIR_NAME)

    def source_mod_dir(self) -> Path:
        return self.source_project_dir(MOD_ID, MOD_PACKAGE_DIR_NAME)

    def dashboard_payload(self, source_root: Path | None = None) -> Path:
        payload = self.payload_root(source_root)
        candidate = payload / "dashboard_app"
        if candidate.exists():
            return candidate
        return self.source_dashboard_dir() / "resources" / "app"

    def dashboard_shell_payload(self, source_root: Path | None = None) -> Path:
        payload = self.payload_root(source_root)
        candidate = payload / "dashboard_shell"
        if candidate.exists():
            return candidate
        return self.source_dashboard_dir()

    def dashboard_shell_item_names(self, source_root: Path | None = None) -> list[str]:
        shell = self.dashboard_shell_payload(source_root)
        if shell.exists():
            return [
                item.name for item in shell.iterdir()
                if item.name.lower() not in DASHBOARD_SHELL_EXCLUDED_NAMES
            ]
        return list(DASHBOARD_SHELL_DEFAULT_ITEMS)

    def dashboard_shell_targets(self, game_dir: Path, source_root: Path | None = None) -> list[Path]:
        install_dir = self.dashboard_install_dir(game_dir)
        return [install_dir / name for name in self.dashboard_shell_item_names(source_root)]

    def legacy_dashboard_shell_targets(self, game_dir: Path) -> list[Path]:
        return [game_dir / name for name in DASHBOARD_SHELL_DEFAULT_ITEMS]

    def legacy_dashboard_targets(self, game_dir: Path) -> list[Path]:
        legacy_app = self.legacy_dashboard_app_dir(game_dir)
        return [
            legacy_app / "main.cjs",
            legacy_app / "package.json",
            legacy_app / "tfm2_meta_dashboard",
            legacy_app / "mods" / MOD_ID,
            legacy_app / "package_manifest.json",
            *self.legacy_dashboard_shell_targets(game_dir),
        ]

    def addon_payload(self, source_root: Path | None = None) -> Path:
        payload = self.payload_root(source_root)
        candidate = payload / "mods" / MOD_ID
        if candidate.exists():
            return candidate
        return self.source_mod_dir()

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

        target_version = self.effective_target_game_version()
        expected = self.expected_game_files()
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
                checks.append(ComponentStatus(True, name, f"{target_version} 기준 파일 크기 일치"))
            else:
                checks.append(
                    ComponentStatus(
                        False,
                        name,
                        f"크기 다름: {actual:,} bytes",
                    )
                )

        mods_ok = (game_dir / "mods").exists()
        dashboard_home_ok = self.dashboard_install_dir(game_dir).exists()
        checks.append(ComponentStatus(True, "mods 폴더", "있음" if mods_ok else "설치 시 생성"))
        checks.append(
            ComponentStatus(
                True,
                "TFM2.gg 폴더",
                "있음" if dashboard_home_ok else "설치 시 생성",
            )
        )

        if size_checked and size_matches == size_checked:
            main = ComponentStatus(True, "호환", f"Teamfight Manager 2 {target_version} 기준과 일치")
        elif size_checked:
            main = ComponentStatus(
                False,
                "주의",
                f"Teamfight Manager 2 {target_version}용 설치 도구입니다. 게임 파일 크기가 일부 달라 Steam 업데이트/무결성 확인을 권장합니다.",
            )
        else:
            main = ComponentStatus(False, "부적합", "필수 게임 파일이 없어 자동 설치가 안전하지 않습니다.")
        return main, checks

    def install_dashboard(self, game_dir: Path, source_root: Path | None = None) -> None:
        resources_app = self.dashboard_app_dir(game_dir)
        resources_app.mkdir(parents=True, exist_ok=True)
        self.backup_existing(game_dir, [resources_app / "tfm2_meta_dashboard", resources_app / "mods" / MOD_ID, resources_app / "package_manifest.json"])
        copy_tree_contents(self.dashboard_payload(source_root), resources_app)

    def install_dashboard_shell(self, game_dir: Path, source_root: Path | None = None) -> None:
        shell = self.dashboard_shell_payload(source_root)
        install_dir = self.dashboard_install_dir(game_dir)
        existing_shell_items = []
        if install_dir.exists():
            existing_shell_items = [
                item for item in install_dir.iterdir()
                if item.name.lower() not in DASHBOARD_SHELL_EXCLUDED_NAMES
            ]
        self.backup_existing(game_dir, existing_shell_items)
        for target in existing_shell_items:
            if target.exists():
                remove_known_path(game_dir, target)
        copy_dashboard_shell_contents(shell, install_dir)

    def install_addon(self, game_dir: Path, source_root: Path | None = None) -> None:
        mods_dir = game_dir / "mods"
        addon_dst = mods_dir / MOD_ID
        mods_dir.mkdir(parents=True, exist_ok=True)
        self.backup_existing(game_dir, [addon_dst])
        if addon_dst.exists():
            remove_known_path(game_dir, addon_dst)
        copy_dir(self.addon_payload(source_root), addon_dst)

    def install_all(self, game_dir: Path, source_root: Path | None = None) -> None:
        self.save_config(game_dir)
        ensure_writable_files(self.install_lock_paths(game_dir))
        self.migrate_legacy_dashboard(game_dir)
        self.install_dashboard_shell(game_dir, source_root)
        self.install_dashboard(game_dir, source_root)
        self.install_addon(game_dir, source_root)

    def remove_all(self, game_dir: Path) -> None:
        ensure_writable_files(self.install_lock_paths(game_dir))
        targets = [
            self.dashboard_install_dir(game_dir),
            game_dir / "mods" / MOD_ID,
            *self.legacy_dashboard_targets(game_dir),
        ]
        self.backup_existing(game_dir, [target for target in targets if target.exists()])
        for target in targets:
            if target.exists():
                remove_known_path(game_dir, target)
        self.remove_empty_legacy_dirs(game_dir)

    def migrate_legacy_dashboard(self, game_dir: Path) -> None:
        targets = [target for target in self.legacy_dashboard_targets(game_dir) if target.exists()]
        if not targets:
            return
        self.backup_existing(game_dir, targets)
        for target in targets:
            if target.exists():
                remove_known_path(game_dir, target)
        self.remove_empty_legacy_dirs(game_dir)

    def remove_empty_legacy_dirs(self, game_dir: Path) -> None:
        legacy_app = self.legacy_dashboard_app_dir(game_dir)
        for target in [
            legacy_app / "mods",
            legacy_app,
            game_dir / "resources",
        ]:
            remove_empty_known_dir(game_dir, target)

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
        dashboard_app = self.dashboard_app_dir(game_dir)
        dashboard = dashboard_app / "tfm2_meta_dashboard"
        dashboard_shell = self.dashboard_install_dir(game_dir) / DASHBOARD_EXE_NAME
        legacy_dashboard = self.legacy_dashboard_app_dir(game_dir) / "tfm2_meta_dashboard"
        legacy_dashboard_shell = game_dir / DASHBOARD_EXE_NAME
        core_json = addon / "core-item-builds.json"
        core_data = read_json(core_json, {})
        installed_manifest = self.installed_manifest(game_dir)
        installed_version = self.package_version(installed_manifest)
        has_legacy = legacy_dashboard.exists() or legacy_dashboard_shell.exists()
        package_version = installed_version or ("설치 버전 기록 없음" if dashboard.exists() or dashboard_shell.exists() or has_legacy or addon.exists() else self.package_version(self.manifest) or "local-dev")
        layout_version = self.manifest_layout_version(installed_manifest)
        install_complete = self.install_complete(game_dir)
        if install_complete:
            layout_status = "최신 구조"
        elif has_legacy:
            layout_status = "이전 구조 정리 필요"
        elif dashboard.exists() or dashboard_shell.exists() or addon.exists():
            layout_status = "복구 필요"
        else:
            layout_status = "미설치"
        return {
            "dashboardInstalled": dashboard.exists(),
            "dashboardShellInstalled": dashboard_shell.exists(),
            "legacyDashboardInstalled": has_legacy,
            "addonInstalled": addon.exists(),
            "addonVersion": mod_info.get("version") or "-",
            "coreGeneratedAt": core_data.get("generatedAt") or "-",
            "packageVersion": package_version,
            "sourceRevision": self.manifest_revision(installed_manifest),
            "layoutVersion": layout_version,
            "layoutStatus": layout_status,
            "installComplete": install_complete,
            "dashboardInstallDir": str(self.dashboard_install_dir(game_dir)),
            "dashboardSize": dir_size(dashboard),
            "dashboardShellSize": dashboard_shell.stat().st_size if dashboard_shell.exists() else 0,
            "addonSize": dir_size(addon),
        }

    def package_version(self, manifest: dict | None) -> str:
        if not isinstance(manifest, dict):
            return ""
        return str(manifest.get("packageVersion") or "").strip()

    def manifest_revision(self, manifest: dict | None) -> str:
        if not isinstance(manifest, dict):
            return ""
        revision = str(manifest.get("sourceRevision") or "").strip().lower()
        if revision:
            return revision
        match = re.search(r"\+([0-9a-f]{7,40})(?:\.dirty)?$", self.package_version(manifest), re.IGNORECASE)
        return match.group(1).lower() if match else ""

    def manifest_layout_version(self, manifest: dict | None) -> int:
        if not isinstance(manifest, dict):
            return 0
        try:
            return int(manifest.get("packageLayoutVersion") or 0)
        except (TypeError, ValueError):
            return 0

    def required_install_paths(self, game_dir: Path) -> list[Path]:
        dashboard_app = self.dashboard_app_dir(game_dir)
        return [
            self.dashboard_install_dir(game_dir) / DASHBOARD_EXE_NAME,
            dashboard_app / "main.cjs",
            dashboard_app / "tfm2_meta_dashboard",
            dashboard_app / "tfm2_meta_dashboard" / "data" / "meta-data.js",
            dashboard_app / "tfm2_meta_dashboard" / "data" / "core-item-builds.json",
            game_dir / "mods" / MOD_ID / "tfm2_meta_item_delegate.dll",
        ]

    def install_lock_paths(self, game_dir: Path) -> list[Path]:
        return [
            self.dashboard_install_dir(game_dir) / DASHBOARD_EXE_NAME,
            game_dir / DASHBOARD_EXE_NAME,
            game_dir / "mods" / MOD_ID / "tfm2_meta_item_delegate.dll",
        ]

    def install_complete(self, game_dir: Path) -> bool:
        manifest = self.installed_manifest(game_dir)
        if self.manifest_layout_version(manifest) < PACKAGE_LAYOUT_VERSION:
            return False
        return all(path.exists() for path in self.required_install_paths(game_dir))

    def needs_update(self, game_dir: Path, remote_manifest: dict) -> tuple[bool, str]:
        current_manifest = self.installed_manifest(game_dir)
        current_revision = self.manifest_revision(current_manifest)
        remote_revision = self.manifest_revision(remote_manifest)
        current_layout = self.manifest_layout_version(current_manifest)
        remote_layout = self.manifest_layout_version(remote_manifest) or PACKAGE_LAYOUT_VERSION
        if current_layout < remote_layout:
            return True, "설치 구조 업데이트 필요"
        if not self.install_complete(game_dir):
            return True, "설치 파일 복구 필요"
        if remote_revision and current_revision and current_revision != remote_revision:
            return True, "새 패키지 버전 있음"
        if remote_revision and not current_revision:
            return True, "현재 설치 버전 확인 필요"
        return False, "이미 최신 상태"

    def installed_manifest(self, game_dir: Path) -> dict:
        for candidate in [
            self.dashboard_install_dir(game_dir) / "package_manifest.json",
            self.dashboard_app_dir(game_dir) / "package_manifest.json",
            self.dashboard_app_dir(game_dir) / "tfm2_meta_dashboard" / "package_manifest.json",
            self.legacy_dashboard_app_dir(game_dir) / "package_manifest.json",
            self.legacy_dashboard_app_dir(game_dir) / "tfm2_meta_dashboard" / "package_manifest.json",
        ]:
            data = read_json(candidate)
            if isinstance(data, dict):
                return data
        return {}

    def remote_manifest(self, package: Path) -> dict:
        for candidate in [
            package / "package_manifest.json",
            package / "payload" / "package_manifest.json",
            package / "payload" / "dashboard_shell" / "package_manifest.json",
            package / "payload" / "dashboard_app" / "package_manifest.json",
        ]:
            data = read_json(candidate)
            if isinstance(data, dict):
                return data
        return {}

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

    def request_headers(self, api_asset: bool = False) -> dict[str, str]:
        headers = {
            "User-Agent": f"{APP_NAME}-Installer",
        }
        token = self.github_token()
        if token:
            headers["Authorization"] = f"Bearer {token}"
        if api_asset:
            headers["Accept"] = "application/octet-stream"
        return headers

    def request(self, url: str, headers: dict[str, str]) -> urllib.request.Request:
        req = urllib.request.Request(url)
        for key, value in headers.items():
            req.add_header(key, value)
        return req

    def is_certificate_error(self, exc: BaseException) -> bool:
        seen: set[int] = set()
        stack: list[object] = [exc]
        while stack:
            current = stack.pop()
            if current is None:
                continue
            marker = id(current)
            if marker in seen:
                continue
            seen.add(marker)
            if isinstance(current, ssl.SSLCertVerificationError):
                return True
            if isinstance(current, ssl.SSLError) and "CERTIFICATE_VERIFY_FAILED" in str(current):
                return True
            if "CERTIFICATE_VERIFY_FAILED" in str(current):
                return True
            for attr in ("reason", "__cause__", "__context__"):
                value = getattr(current, attr, None)
                if value is not None:
                    stack.append(value)
        return False

    def certifi_ssl_context(self) -> ssl.SSLContext | None:
        try:
            import certifi  # type: ignore
            return ssl.create_default_context(cafile=certifi.where())
        except Exception:
            return None

    def remote_update_error(self, url: str, errors: list[BaseException]) -> RemoteUpdateError:
        details = "\n".join(f"- {type(error).__name__}: {error}" for error in errors[-3:])
        if any(self.is_certificate_error(error) for error in errors):
            return RemoteUpdateError(
                "원격 업데이트 HTTPS 인증서 검증에 실패했습니다.\n\n"
                "Windows 루트 인증서가 오래되었거나, 백신/보안 프로그램/VPN/프록시가 HTTPS 인증서를 가로채는 환경일 수 있습니다.\n"
                "설치/복구/제거 기능은 계속 사용할 수 있습니다.\n\n"
                f"직접 다운로드: {DIRECT_DOWNLOAD_URL}\n"
                f"릴리스 페이지: {RELEASE_PAGE_URL}\n\n"
                f"세부 오류:\n{details}"
            )
        return RemoteUpdateError(
            "원격 업데이트 서버에 연결하지 못했습니다.\n\n"
            "네트워크, VPN/프록시, 방화벽, GitHub 접속 상태를 확인해 주세요.\n"
            f"직접 다운로드: {DIRECT_DOWNLOAD_URL}\n\n"
            f"세부 오류:\n{details}"
        )

    def urllib_read(self, url: str, headers: dict[str, str], timeout: int, context: ssl.SSLContext | None = None) -> bytes:
        with urllib.request.urlopen(self.request(url, headers), timeout=timeout, context=context) as response:
            return response.read()

    def urllib_download(self, url: str, dst: Path, headers: dict[str, str], timeout: int, context: ssl.SSLContext | None = None) -> None:
        with urllib.request.urlopen(self.request(url, headers), timeout=timeout, context=context) as response:
            dst.parent.mkdir(parents=True, exist_ok=True)
            with dst.open("wb") as fh:
                shutil.copyfileobj(response, fh)

    def powershell_exe(self) -> str | None:
        return shutil.which("powershell.exe") or shutil.which("pwsh.exe")

    def powershell_download(self, url: str, dst: Path, headers: dict[str, str], timeout: int) -> None:
        ps = self.powershell_exe()
        if not ps:
            raise RuntimeError("PowerShell executable not found")
        dst.parent.mkdir(parents=True, exist_ok=True)
        headers_fd, headers_name = tempfile.mkstemp(prefix="tfm2gg-headers-", suffix=".json")
        os.close(headers_fd)
        headers_file = Path(headers_name)
        try:
            headers_file.write_text(json.dumps(headers), encoding="utf-8")
            script = r'''
param(
    [string]$Url,
    [string]$OutFile,
    [string]$HeadersFile
)
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$headers = @{}
if ($HeadersFile -and (Test-Path -LiteralPath $HeadersFile)) {
    $raw = Get-Content -LiteralPath $HeadersFile -Raw -Encoding UTF8
    if ($raw) {
        $parsed = ConvertFrom-Json -InputObject $raw
        foreach ($property in $parsed.PSObject.Properties) {
            $headers[$property.Name] = [string]$property.Value
        }
    }
}
Invoke-WebRequest -Uri $Url -OutFile $OutFile -Headers $headers -UseBasicParsing -MaximumRedirection 10
'''
            result = subprocess.run(
                [ps, "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script, url, str(dst), str(headers_file)],
                capture_output=True,
                text=True,
                timeout=max(timeout + 30, 60),
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
            )
            if result.returncode != 0:
                output = (result.stderr or result.stdout or "").strip()
                raise RuntimeError(output or f"PowerShell exited with {result.returncode}")
            if not dst.exists() or dst.stat().st_size <= 0:
                raise RuntimeError("PowerShell download produced an empty file")
        finally:
            try:
                headers_file.unlink(missing_ok=True)
            except OSError:
                pass

    def read_url(self, url: str, headers: dict[str, str], timeout: int) -> bytes:
        errors: list[BaseException] = []
        try:
            return self.urllib_read(url, headers, timeout)
        except urllib.error.HTTPError:
            raise
        except Exception as exc:
            errors.append(exc)

        if self.is_certificate_error(errors[-1]):
            context = self.certifi_ssl_context()
            if context is not None:
                try:
                    return self.urllib_read(url, headers, timeout, context)
                except urllib.error.HTTPError:
                    raise
                except Exception as exc:
                    errors.append(exc)

        temp_fd, temp_name = tempfile.mkstemp(prefix="tfm2gg-update-", suffix=".download")
        os.close(temp_fd)
        temp_path = Path(temp_name)
        try:
            try:
                self.powershell_download(url, temp_path, headers, timeout)
                return temp_path.read_bytes()
            except Exception as exc:
                errors.append(exc)
                raise self.remote_update_error(url, errors) from exc
        finally:
            try:
                temp_path.unlink(missing_ok=True)
            except OSError:
                pass

    def request_json(self, url: str) -> dict:
        data = self.read_url(url, self.request_headers(), timeout=20)
        return json.loads(data.decode("utf-8"))

    def download_url(self, url: str, dst: Path, api_asset: bool = False) -> None:
        if not url:
            raise RemoteUpdateError("원격 업데이트 다운로드 URL을 찾지 못했습니다.")
        headers = self.request_headers(api_asset=api_asset)
        part = dst.with_name(dst.name + ".part")
        errors: list[BaseException] = []

        def remove_part() -> None:
            try:
                part.unlink(missing_ok=True)
            except OSError:
                pass

        def attempt_urllib(context: ssl.SSLContext | None = None) -> bool:
            remove_part()
            try:
                self.urllib_download(url, part, headers, timeout=90, context=context)
                return True
            except urllib.error.HTTPError:
                raise
            except Exception as exc:
                errors.append(exc)
                remove_part()
                return False

        remove_part()
        downloaded = False
        try:
            downloaded = attempt_urllib()
            if not downloaded and self.is_certificate_error(errors[-1]):
                context = self.certifi_ssl_context()
                if context is not None:
                    downloaded = attempt_urllib(context)
                else:
                    errors.append(RuntimeError("certifi CA bundle is unavailable"))

            if not downloaded:
                remove_part()
                try:
                    self.powershell_download(url, part, headers, timeout=90)
                    downloaded = True
                except Exception as ps_exc:
                    errors.append(ps_exc)
                    raise self.remote_update_error(url, errors) from ps_exc

            if not part.exists() or part.stat().st_size <= 0:
                raise RemoteUpdateError("원격 업데이트 ZIP 다운로드 결과가 비어 있습니다.")
            os.replace(part, dst)
        finally:
            remove_part()

    def validate_update_zip(self, zip_path: Path) -> None:
        try:
            with zipfile.ZipFile(zip_path, "r") as archive:
                bad_member = archive.testzip()
        except zipfile.BadZipFile as exc:
            raise RemoteUpdateError("다운로드된 업데이트 ZIP 파일이 손상되었거나 ZIP 형식이 아닙니다.") from exc
        if bad_member:
            raise RemoteUpdateError(f"다운로드된 업데이트 ZIP 파일에 손상된 항목이 있습니다: {bad_member}")

    def validate_remote_package(self, package: Path) -> dict:
        manifest = self.remote_manifest(package)
        if not manifest:
            raise RemoteUpdateError("원격 업데이트 패키지에서 package_manifest.json을 찾지 못했습니다.")
        repository = str(manifest.get("repository") or manifest.get("repo") or "").strip()
        if repository and repository.lower() != REPO_FULL_NAME.lower():
            raise RemoteUpdateError(f"원격 업데이트 패키지 저장소가 일치하지 않습니다: {repository}")
        layout_version = self.manifest_layout_version(manifest)
        if layout_version < PACKAGE_LAYOUT_VERSION:
            raise RemoteUpdateError(
                f"원격 업데이트 패키지 구조가 오래되었습니다. 필요: {PACKAGE_LAYOUT_VERSION}, 실제: {layout_version or '-'}"
            )
        payload = self.payload_root(package)
        required_paths = [
            payload / "dashboard_shell" / DASHBOARD_EXE_NAME,
            payload / "dashboard_app" / "main.cjs",
            payload / "dashboard_app" / "tfm2_meta_dashboard",
            payload / "mods" / MOD_ID / "tfm2_meta_item_delegate.dll",
            payload / "README.md",
        ]
        missing = [path for path in required_paths if not path.exists()]
        if missing:
            names = "\n".join(f"- {path.relative_to(package)}" for path in missing)
            raise RemoteUpdateError(f"원격 업데이트 패키지에 필요한 파일이 없습니다.\n{names}")
        return manifest

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
        self.validate_update_zip(target_zip)

        extract_root = local_update_dir() / safe_tag / "extracted"
        if extract_root.exists():
            shutil.rmtree(extract_root)
        extract_root.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(target_zip, "r") as archive:
            archive.extractall(extract_root)

        package = self.find_extracted_package(extract_root)
        self.validate_remote_package(package)
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
        self.style.configure("TLabel", background=bg, foreground="#1f2937", font=("Malgun Gothic", 10))
        self.style.configure("Card.TLabel", background=card, foreground="#1f2937", font=("Malgun Gothic", 10))
        self.style.configure("Title.TLabel", background=bg, foreground=ink, font=("Malgun Gothic", 21))
        self.style.configure("Subtle.TLabel", background=bg, foreground=muted, font=("Malgun Gothic", 10))
        self.style.configure("CardTitle.TLabel", background=card, foreground=ink, font=("Malgun Gothic", 11))
        self.style.configure("StatusGood.TLabel", background="#dcfce7", foreground="#166534", font=("Malgun Gothic", 10))
        self.style.configure("StatusWarn.TLabel", background="#fff7ed", foreground="#9a3412", font=("Malgun Gothic", 10))
        self.style.configure("StatusBad.TLabel", background="#fee2e2", foreground="#991b1b", font=("Malgun Gothic", 10))
        self.style.configure(
            "TButton",
            font=("Malgun Gothic", 10),
            padding=(10, 8),
            background="#e5e7eb",
            foreground="#111827",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("TButton", background=[("active", "#d1d5db"), ("pressed", "#cbd5e1")])
        self.style.configure(
            "Primary.TButton",
            font=("Malgun Gothic", 10),
            padding=(12, 8),
            background="#2563eb",
            foreground="#ffffff",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("Primary.TButton", background=[("active", "#1d4ed8"), ("pressed", "#1e40af")])
        self.style.configure(
            "Accent.TButton",
            font=("Malgun Gothic", 10),
            padding=(10, 8),
            background="#059669",
            foreground="#ffffff",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("Accent.TButton", background=[("active", "#047857"), ("pressed", "#065f46")])
        self.style.configure(
            "Danger.TButton",
            font=("Malgun Gothic", 10),
            padding=(10, 8),
            background="#ef4444",
            foreground="#ffffff",
            borderwidth=0,
            relief="flat",
        )
        self.style.map("Danger.TButton", background=[("active", "#dc2626"), ("pressed", "#b91c1c")])
        self.style.configure(
            "Refresh.TButton",
            font=("Malgun Gothic", 10),
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
            f"실행 파일: {'설치됨' if installed['dashboardShellInstalled'] else '없음'}",
            f"대시보드: {'설치됨' if installed['dashboardInstalled'] else '없음'}",
            f"애드온: {'설치됨' if installed['addonInstalled'] else '없음'}",
            f"설치 구조: {installed['layoutStatus']}",
            f"애드온 버전: {installed['addonVersion']}",
            f"메타 생성: {installed['coreGeneratedAt']}",
        ]
        self.install_card_var.set("\n".join(install_lines))
        self.update_card_var.set(
            f"패키지: {installed['packageVersion']}\n"
            f"레이아웃: {installed['layoutVersion'] or '-'}\n"
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
                if not self.model.install_complete(game_dir):
                    missing = [str(path) for path in self.model.required_install_paths(game_dir) if not path.exists()]
                    raise RuntimeError("설치 검증 실패: 필수 파일이 누락되었습니다.\n" + "\n".join(missing))
                if kind == "install":
                    self.work_queue.put(("log", "설치 완료: 대시보드 파일은 TFM2.gg 폴더에 정리되고 애드온이 적용되었습니다."))
                    self.work_queue.put(("success", ("설치 완료", "TFM2.gg 설치가 완료되었습니다.\n대시보드는 게임 폴더의 TFM2.gg 폴더 안에 설치되었습니다.")))
                else:
                    self.work_queue.put(("log", "복구 완료: 대시보드 폴더와 애드온을 다시 적용했습니다."))
                    self.work_queue.put(("success", ("복구 완료", "TFM2.gg 복구가 완료되었습니다.\n대시보드 파일은 TFM2.gg 폴더에 정리되었습니다.")))
            elif kind == "addon":
                self.model.install_addon(game_dir)
                self.work_queue.put(("log", "애드온 설치 완료: 아이템 자동 설정 모드가 적용되었습니다."))
                self.work_queue.put(("success", ("애드온 설치 완료", "아이템 자동 설정 애드온 설치가 완료되었습니다.")))
            elif kind == "remove":
                self.model.remove_all(game_dir)
                self.work_queue.put(("log", "제거 완료: TFM2.gg 설치 항목을 제거했습니다."))
                self.work_queue.put(("success", ("제거 완료", "TFM2.gg 설치 항목을 제거했습니다.\n기존 파일은 백업 후 처리되었습니다.")))
            elif kind == "update":
                package, release = self.model.download_latest_distribution()
                remote_manifest = self.model.remote_manifest(package)
                remote_version = self.model.package_version(remote_manifest)
                current_manifest = self.model.installed_manifest(game_dir)
                current_version = self.model.package_version(current_manifest)
                self.work_queue.put(("log", f"원격 패키지 확인 완료: {package}"))
                needs_update, reason = self.model.needs_update(game_dir, remote_manifest)
                if not needs_update:
                    self.work_queue.put(("log", f"이미 최신 상태입니다: {current_version or reason}"))
                    self.work_queue.put(("info", ("업데이트 확인", f"이미 최신 상태입니다.\n현재 버전: {current_version or '-'}")))
                else:
                    self.work_queue.put(("log", f"업데이트 필요: {reason}"))
                    self.work_queue.put(("remote_apply", (package, release, current_version, remote_version, reason)))
            self.work_queue.put(("refresh", None))
            self.work_queue.put(("done", kind))
        except RemoteUpdateError as exc:
            self.work_queue.put(("error", str(exc)))
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
                elif kind == "info":
                    title, message = payload
                    messagebox.showinfo(str(title), str(message))
                elif kind == "success":
                    title, message = payload
                    messagebox.showinfo(str(title), str(message))
                elif kind == "refresh":
                    self.refresh_status()
                elif kind == "remote_apply":
                    package, release, current_version, remote_version, reason = payload
                    tag = release.get("tag_name") or "latest"
                    detail = (
                        f"현재 버전: {current_version or '알 수 없음'}\n"
                        f"새 버전: {remote_version or tag}\n\n"
                        f"사유: {reason}\n\n"
                        "새 버전으로 업데이트하시겠습니까?"
                    )
                    if messagebox.askyesno("원격 업데이트", detail):
                        threading.Thread(target=self.apply_remote_package, args=(package,), daemon=True).start()
                elif kind == "done":
                    done_labels = {
                        "install": "설치 완료",
                        "repair": "복구 완료",
                        "addon": "애드온 설치 완료",
                        "remove": "제거 완료",
                        "update": "업데이트 확인 완료",
                    }
                    self.status_var.set(done_labels.get(str(payload), f"{payload} 완료"))
        except queue.Empty:
            pass
        self.after(120, self.drain_queue)

    def apply_remote_package(self, package: Path):
        try:
            self.work_queue.put(("log", "원격 패키지 설치/복구 적용 시작"))
            game_dir = self.current_game_dir()
            self.model.install_all(game_dir, source_root=package)
            if not self.model.install_complete(game_dir):
                missing = [str(path) for path in self.model.required_install_paths(game_dir) if not path.exists()]
                raise RuntimeError("업데이트 검증 실패: 필수 파일이 누락되었습니다.\n" + "\n".join(missing))
            self.work_queue.put(("log", "업데이트 완료: 새 원격 패키지가 적용되었습니다."))
            self.work_queue.put(("success", ("업데이트 완료", "TFM2.gg 업데이트가 완료되었습니다.\n대시보드 파일은 TFM2.gg 폴더에 정리되었습니다.")))
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
        text = tk.Text(frame, bg="#ffffff", fg="#1f2937", relief="flat", padx=14, pady=12, wrap="word", font=("Malgun Gothic", 10))
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
