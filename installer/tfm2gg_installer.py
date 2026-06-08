from __future__ import annotations

import json
import copy
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
TARGET_GAME_VERSION = "0.4.11"
STEAM_APP_ID = "3009300"
PACKAGE_LAYOUT_VERSION = 4
DASHBOARD_INSTALL_DIR_NAME = APP_NAME
DASHBOARD_EXE_NAME = "TFM2MetaDashboard.exe"
BACKUP_KEEP_COUNT = 5
BACKUP_MIN_KEEP_COUNT = 2
BACKUP_MAX_BYTES = 2 * 1024 * 1024 * 1024
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
META_TIER_MOD_ID = "tfm2_meta_champion_tiers"
AI_BANPICK_MOD_ID = "tfm2_ai_banpick_probe"
CHAMPION_VIEW_COMPAT_MOD_ID = "tfm2gg_champion_view_compat"
CHAMPION_TEXT_ASSET_KEY = "asset/base/text/champion"
CHAMPION_VIEW_ASSET_KEY = "asset/base/style/champion_view"
SOURCE_DASHBOARD_DIR_NAME = "TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)"

EXPECTED_GAME_FILES = {
    "TeamfightManager2.exe": 64_445_440,
    "bundle.game_data": 1_121_270_589,
}
CRITICAL_GAME_FILES = {"bundle.game_data"}

DEFAULT_GAME_DIR = Path(r"C:\Program Files (x86)\Steam\steamapps\common\Teamfight Manager2")


@dataclass
class ComponentStatus:
    ok: bool
    label: str
    detail: str


@dataclass(frozen=True)
class AddonPackage:
    mod_id: str
    label: str
    source_prefix: str
    source_fallback: str
    dll_name: str
    policy_file: str | None = None
    config_extra: tuple[tuple[str, str], ...] = ()


@dataclass(frozen=True)
class WorkshopChampionMod:
    workshop_id: str
    source_type: str
    source_id: str
    mod_id: str
    name: str
    version: str
    author: str
    path: Path
    champion_ids: tuple[str, ...]
    enabled: bool
    known: bool
    has_style_override: bool
    has_code: bool

    @property
    def source_label(self) -> str:
        if self.source_type == "local":
            return f"Local:{self.source_id}"
        return f"Workshop:{self.workshop_id}"


ADDON_PACKAGES = (
    AddonPackage(
        mod_id=MOD_ID,
        label="아이템 자동 설정",
        source_prefix=MOD_ID,
        source_fallback=MOD_PACKAGE_DIR_NAME,
        dll_name="tfm2_meta_item_delegate.dll",
    ),
    AddonPackage(
        mod_id=META_TIER_MOD_ID,
        label="메타 티어 동기화",
        source_prefix=META_TIER_MOD_ID,
        source_fallback="tfm2_meta_champion_tiers (팀파매.gg 메타 티어 동기화 애드온 모드)",
        dll_name="tfm2_meta_champion_tiers.dll",
        policy_file="champion_tier_policy.tsv",
    ),
    AddonPackage(
        mod_id=AI_BANPICK_MOD_ID,
        label="AI 밴픽 보정",
        source_prefix=AI_BANPICK_MOD_ID,
        source_fallback="tfm2_ai_banpick_probe (팀파매.gg AI 밴픽 보정 애드온 모드)",
        dll_name="tfm2_ai_banpick_probe.dll",
        policy_file="ai_champion_policy.tsv",
        config_extra=(
            ("enabled", "true"),
            ("overall_neutral", "50"),
            ("overall_divisor", "20"),
            ("min_bias", "-1.5"),
            ("max_bias", "1.5"),
            ("candidate_map_file", "candidate_map.tsv"),
        ),
    ),
)
ADDON_BY_ID = {addon.mod_id: addon for addon in ADDON_PACKAGES}
CORE_ADDON_IDS = (MOD_ID,)
POLICY_TIER_SORT = {"S": 5, "A": 4, "B": 3, "C": 2, "D": 1}
ADDON_WORKSHOP_SHADOW_IDS = {
    MOD_ID: "3999000102",
    META_TIER_MOD_ID: "3999000101",
    AI_BANPICK_MOD_ID: "3999000103",
}


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


def safe_file_component(text: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", str(text or "").strip())
    return cleaned.strip("._") or "unknown"


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


def replace_json_asset_type_preserving_format(path: Path, asset_key: str, expected_type: str, new_type: str) -> bool:
    text = path.read_text(encoding="utf-8-sig")
    data = json.loads(text)
    if not isinstance(data, dict):
        return False
    entry = data.get(asset_key)
    if not isinstance(entry, dict):
        return False
    if str(entry.get("type") or "").strip().lower() != expected_type.lower():
        return False

    key_literal = json.dumps(asset_key, ensure_ascii=False)
    key_pos = text.find(key_literal)
    if key_pos < 0:
        raise RuntimeError(f"Could not locate {asset_key} in {path}")
    colon_pos = text.find(":", key_pos + len(key_literal))
    object_start = text.find("{", colon_pos)
    if colon_pos < 0 or object_start < 0:
        raise RuntimeError(f"Could not locate {asset_key} object in {path}")

    depth = 0
    in_string = False
    escaped = False
    object_end = -1
    for index in range(object_start, len(text)):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                object_end = index
                break
    if object_end < 0:
        raise RuntimeError(f"Could not parse {asset_key} object in {path}")

    block = text[object_start:object_end + 1]
    replaced_block, count = re.subn(
        r'("type"\s*:\s*)"[^"]*"',
        rf'\1"{new_type}"',
        block,
        count=1,
    )
    if count != 1:
        raise RuntimeError(f"Could not locate {asset_key}.type in {path}")
    path.write_text(text[:object_start] + replaced_block + text[object_end + 1:], encoding="utf-8")
    return True


def policy_tier_from_overall(overall: float) -> str:
    if overall >= 85:
        return "S"
    if overall >= 72:
        return "A"
    if overall >= 60:
        return "B"
    if overall >= 48:
        return "C"
    return "D"


def read_policy_rows(path: Path) -> list[dict]:
    rows = []
    if not path.exists():
        return rows
    try:
        lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    except OSError:
        return rows
    for line in lines:
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        try:
            overall = float(parts[2])
        except ValueError:
            continue
        rows.append({"championId": parts[0], "tier": parts[1], "overall": overall})
    return rows


def read_policy_headers(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    try:
        lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    except OSError:
        return {}
    headers: dict[str, str] = {}
    for line in lines:
        text = line.strip()
        if not text.startswith("#") or ":" not in text:
            continue
        key, value = text[1:].split(":", 1)
        headers[key.strip()] = value.strip()
    return headers


def summarize_policy_gate(path: Path) -> str:
    headers = read_policy_headers(path)
    gate = headers.get("PatchGate") or ""
    if not gate:
        return ""
    requested = headers.get("RequestedPatch") or "-"
    effective = headers.get("EffectivePatch") or "-"
    metrics = headers.get("GateMetrics") or ""
    if "decision=apply_latest" in gate:
        return f" / gate latest {effective}"
    if "decision=apply_immediate" in gate:
        return f" / gate immediate {effective}"
    if "decision=fallback_all_patches" in gate:
        return f" / gate fallback {effective} ({metrics})"
    if "decision=hold" in gate:
        return f" / gate hold {requested}->{effective} ({metrics})"
    return f" / gate {gate}"


def format_tier_counts(rows: list[dict]) -> str:
    counts = {tier: 0 for tier in POLICY_TIER_SORT}
    for row in rows:
        tier = str(row.get("tier") or "C")
        counts[tier] = counts.get(tier, 0) + 1
    return " ".join(f"{tier}{counts.get(tier, 0)}" for tier in ["S", "A", "B", "C", "D"])


def summarize_champion_tier_policy(path: Path) -> str:
    rows = read_policy_rows(path)
    if not rows:
        return "없음"
    mismatch = sum(1 for row in rows if policy_tier_from_overall(row["overall"]) != row["tier"])
    suffix = "정상" if mismatch == 0 else f"불일치 {mismatch}"
    return f"{len(rows)}행 {format_tier_counts(rows)} ({suffix}){summarize_policy_gate(path)}"


def summarize_ai_policy(path: Path) -> str:
    rows = read_policy_rows(path)
    if not rows:
        return "없음"
    biases = [max(-1.5, min(1.5, (row["overall"] - 50.0) / 20.0)) for row in rows]
    positive = sum(1 for bias in biases if bias > 0.05)
    negative = sum(1 for bias in biases if bias < -0.05)
    neutral = len(biases) - positive - negative
    return f"{len(rows)}행 +{positive}/0{neutral}/-{negative} ({min(biases):+.2f}~{max(biases):+.2f})"


def summarize_candidate_map(path: Path) -> str:
    if not path.exists():
        return "커스텀 AI: 비활성"
    try:
        lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    except OSError:
        return "커스텀 AI: 맵 읽기 실패"
    expected = None
    base = 0
    external = 0
    rejected = 0
    for line in lines:
        text = line.strip()
        if not text:
            continue
        if text.startswith("# ExpectedRuntimeChampionCount:"):
            expected = text.split(":", 1)[1].strip()
            continue
        if text.startswith("#"):
            continue
        parts = text.split("\t")
        if len(parts) < 4 or parts[0].lower() == "candidate_index":
            continue
        source = parts[2].strip()
        status = parts[3].strip()
        if source == "base" and status == "verified_base":
            base += 1
        elif source == "active_external" and status == "conditional_external":
            external += 1
        else:
            rejected += 1
    if external <= 0:
        return f"커스텀 AI: 비활성 (기본 {base})"
    suffix = f", 거부 {rejected}" if rejected else ""
    return f"커스텀 AI: 조건부 {external}명 / 예상 {expected or '-'}명 (기본 {base}{suffix})"


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


def format_bytes(size: int) -> str:
    value = float(size or 0)
    for unit in ["B", "KB", "MB", "GB"]:
        if value < 1024 or unit == "GB":
            return f"{value:.1f}{unit}" if unit != "B" else f"{int(value)}B"
        value /= 1024
    return f"{value:.1f}GB"


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

    def source_addon_dir(self, addon: AddonPackage) -> Path:
        return self.source_project_dir(addon.source_prefix, addon.source_fallback)

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

    def addon_payload(self, source_root: Path | None = None, addon: AddonPackage | None = None) -> Path:
        addon = addon or ADDON_BY_ID[MOD_ID]
        payload = self.payload_root(source_root)
        candidate = payload / "mods" / addon.mod_id
        if candidate.exists():
            return candidate
        return self.source_addon_dir(addon)

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

    def steamapps_dirs(self, game_dir: Path) -> list[Path]:
        candidates = []
        try:
            candidates.append(game_dir.resolve().parents[1])
        except IndexError:
            pass
        for guessed in self.steam_library_guesses() + [DEFAULT_GAME_DIR]:
            try:
                candidates.append(guessed.resolve().parents[1])
            except (IndexError, OSError):
                continue
        seen = set()
        result = []
        for path in candidates:
            key = str(path).lower()
            if key not in seen and (path / "common").exists():
                seen.add(key)
                result.append(path)
        return result

    def workshop_content_dirs(self, game_dir: Path) -> list[Path]:
        dirs = []
        for steamapps in self.steamapps_dirs(game_dir):
            candidate = steamapps / "workshop" / "content" / STEAM_APP_ID
            if candidate.exists():
                dirs.append(candidate)
        return dirs

    def workshop_shadow_dir(self, game_dir: Path, addon: AddonPackage) -> Path | None:
        shadow_id = ADDON_WORKSHOP_SHADOW_IDS.get(addon.mod_id)
        if not shadow_id:
            return None
        dirs = self.workshop_content_dirs(game_dir)
        if not dirs:
            return None
        return dirs[0] / shadow_id

    def mods_config_path(self, game_dir: Path) -> Path:
        return game_dir / "config" / "game" / "mods.json"

    def read_mods_config(self, game_dir: Path) -> dict:
        data = read_json(self.mods_config_path(game_dir), {})
        if not isinstance(data, dict):
            data = {}
        for key in ["enabled_mods", "known_workshop_mods", "accepted_code_mod_warnings", "accepted_save_mod_mismatch_warnings"]:
            if not isinstance(data.get(key), list):
                data[key] = []
        return data

    def write_mods_config(self, game_dir: Path, data: dict) -> None:
        path = self.mods_config_path(game_dir)
        self.backup_existing(game_dir, [path])
        write_json(path, data)

    def is_game_running(self) -> bool:
        try:
            result = subprocess.run(
                ["tasklist", "/FI", "IMAGENAME eq TeamfightManager2.exe"],
                capture_output=True,
                text=True,
                timeout=5,
            )
        except Exception:
            return False
        return "TeamfightManager2.exe" in (result.stdout or "")

    def find_workshop_mod_info(self, workshop_item_dir: Path) -> tuple[Path, Path] | None:
        direct = workshop_item_dir / "mod.mod_info"
        if direct.exists():
            return workshop_item_dir, direct
        try:
            children = sorted(path for path in workshop_item_dir.iterdir() if path.is_dir())
        except OSError:
            return None
        for child in children:
            info = child / "mod.mod_info"
            if info.exists():
                return child, info
        return None

    def local_mod_dirs(self, game_dir: Path) -> list[Path]:
        mods_dir = game_dir / "mods"
        if not mods_dir.exists():
            return []
        try:
            return sorted(path for path in mods_dir.iterdir() if path.is_dir())
        except OSError:
            return []

    def load_champion_ids_from_mod(self, mod_root: Path) -> tuple[str, ...]:
        champion_dir = mod_root / "champion"
        if not champion_dir.exists():
            return ()
        ids = []
        for file_path in sorted(champion_dir.glob("*.data_champion")):
            data = read_json(file_path, {})
            champion_id = data.get("id") if isinstance(data, dict) else None
            ids.append(str(champion_id or file_path.stem))
        return tuple(ids)

    def mod_override_row(self, mod_root: Path, asset_key: str) -> dict:
        override_info = read_json(mod_root / "mod.override_info", {})
        if not isinstance(override_info, dict):
            return {}
        row = override_info.get(asset_key)
        return row if isinstance(row, dict) else {}

    def mod_champion_view_merge_type(self, mod_root: Path) -> str:
        row = self.mod_override_row(mod_root, CHAMPION_VIEW_ASSET_KEY)
        return str(row.get("type") or "").strip().lower()

    def champion_view_file_for_mod(self, mod_root: Path) -> Path:
        row = self.mod_override_row(mod_root, CHAMPION_VIEW_ASSET_KEY)
        remapping = str(row.get("remapping") or "").strip().replace("\\", "/")
        if remapping.startswith("asset/"):
            parts = remapping.split("/", 2)
            if len(parts) == 3:
                relative = Path(parts[2])
                candidate = mod_root / relative
                if candidate.suffix != ".champion_view":
                    candidate = candidate.with_suffix(".champion_view")
                if candidate.exists():
                    return candidate
        return mod_root / "style" / "champion_view.champion_view"

    def load_champion_view_entries(self, mod_root: Path) -> dict:
        data = read_json(self.champion_view_file_for_mod(mod_root), {})
        if not isinstance(data, dict):
            return {}
        entries = data.get("entries")
        if not isinstance(entries, dict):
            return {}
        return {str(key): value for key, value in entries.items() if isinstance(value, dict)}

    def champion_text_file_for_mod(self, mod_root: Path) -> Path:
        row = self.mod_override_row(mod_root, CHAMPION_TEXT_ASSET_KEY)
        remapping = str(row.get("remapping") or "").strip().replace("\\", "/")
        if remapping.startswith("asset/"):
            parts = remapping.split("/", 2)
            if len(parts) == 3:
                relative = Path(parts[2])
                candidate = mod_root / relative
                if candidate.suffix != ".i18n":
                    candidate = candidate.with_suffix(".i18n")
                if candidate.exists():
                    return candidate
        return mod_root / "text" / "champion.i18n"

    def load_champion_text_payload(self, mod_root: Path) -> dict:
        data = read_json(self.champion_text_file_for_mod(mod_root), {})
        return data if isinstance(data, dict) else {}

    def merge_champion_text_payload(self, merged: dict, source: dict, champion_ids: set[str]) -> set[str]:
        added: set[str] = set()
        for language, language_payload in source.items():
            if not isinstance(language_payload, dict):
                continue
            descriptions = language_payload.get("description")
            if not isinstance(descriptions, dict):
                continue
            target_language = merged.setdefault(str(language), {})
            target_descriptions = target_language.setdefault("description", {})
            if not isinstance(target_descriptions, dict):
                target_descriptions = {}
                target_language["description"] = target_descriptions
            for champion_id in champion_ids:
                row = descriptions.get(champion_id)
                if isinstance(row, dict):
                    target_descriptions[champion_id] = copy.deepcopy(row)
                    added.add(champion_id)
        return added

    def mod_has_style_override(self, mod_root: Path) -> bool:
        return self.mod_champion_view_merge_type(mod_root) == "override"

    def champion_view_compat_dir(self, game_dir: Path) -> Path:
        return game_dir / "mods" / CHAMPION_VIEW_COMPAT_MOD_ID

    def workshop_override_backup_dir(self, row: WorkshopChampionMod, create: bool = False) -> Path:
        if row.source_type == "local":
            path = (
                user_state_dir()
                / "workshop_override_backups"
                / STEAM_APP_ID
                / "local"
                / safe_file_component(row.source_id)
                / safe_file_component(row.mod_id)
            )
        else:
            path = (
                user_state_dir()
                / "workshop_override_backups"
                / STEAM_APP_ID
                / safe_file_component(row.workshop_id)
                / safe_file_component(row.mod_id)
            )
        if create:
            path.mkdir(parents=True, exist_ok=True)
        return path

    def workshop_override_backup_path(self, row: WorkshopChampionMod, kind: str, stamp: str) -> Path:
        folder = self.workshop_override_backup_dir(row, create=True)
        return folder / f"mod.override_info.tfm2gg_{safe_file_component(kind)}_override_backup_{stamp}"

    def workshop_override_backup_files(self, row: WorkshopChampionMod, kind: str) -> list[Path]:
        folder = self.workshop_override_backup_dir(row)
        if not folder.exists():
            return []
        patterns = {
            "view": [
                "mod.override_info.tfm2gg_view_override_backup_*",
                "mod.override_info.tfm2gg_override_backup_*",
            ],
            "text": [
                "mod.override_info.tfm2gg_text_override_backup_*",
            ],
        }.get(kind, [])
        out: list[Path] = []
        for pattern in patterns:
            out.extend(sorted(folder.glob(pattern)))
        return sorted(set(out))

    def workshop_root_override_backup_files(self, row: WorkshopChampionMod) -> list[Path]:
        patterns = [
            "mod.override_info.tfm2gg_*backup*",
            "mod.override_info.tfm2gg_*restore_backup*",
        ]
        out: list[Path] = []
        for pattern in patterns:
            out.extend(path for path in sorted(row.path.glob(pattern)) if path.is_file())
        return sorted(set(out))

    def migrate_workshop_override_backups(self, game_dir: Path) -> list[str]:
        moved: list[str] = []
        for row in self.discover_workshop_champion_mods(game_dir):
            backup_dir = self.workshop_override_backup_dir(row, create=True)
            for source in self.workshop_root_override_backup_files(row):
                target = backup_dir / source.name
                if target.exists():
                    target = backup_dir / f"{source.name}.{int(source.stat().st_mtime)}"
                shutil.move(str(source), str(target))
                moved.append(str(source))
        return moved

    def build_champion_view_compat_plan(self, game_dir: Path) -> dict:
        config = self.read_mods_config(game_dir)
        enabled_order = [str(item) for item in config.get("enabled_mods", []) if str(item) != CHAMPION_VIEW_COMPAT_MOD_ID]
        enabled_index = {mod_id: index for index, mod_id in enumerate(enabled_order)}
        active = [
            row for row in self.discover_workshop_champion_mods(game_dir)
            if row.enabled and row.mod_id in enabled_index
        ]
        active.sort(key=lambda row: enabled_index.get(row.mod_id, 10_000))

        active_champion_ids: set[str] = set()
        for row in active:
            active_champion_ids.update(row.champion_ids)

        text_ids: set[str] = set()
        sources: dict[str, str] = {}
        style_override_mods: list[str] = []
        style_merge_mods: list[str] = []
        style_patched_mods: list[str] = []
        text_override_mods: list[str] = []
        text_patched_mods: list[str] = []
        backup_residue_mods: list[str] = []
        missing_text_ids: list[str] = []

        for row in active:
            if self.workshop_root_override_backup_files(row):
                backup_residue_mods.append(row.mod_id)
            merge_type = self.mod_champion_view_merge_type(row.path)
            if merge_type == "override":
                style_override_mods.append(row.mod_id)
            elif merge_type == "merge":
                style_merge_mods.append(row.mod_id)
                if self.workshop_override_backup_files(row, "view"):
                    style_patched_mods.append(row.mod_id)

            text_type = str(self.mod_override_row(row.path, CHAMPION_TEXT_ASSET_KEY).get("type") or "").strip().lower()
            if text_type == "override":
                text_override_mods.append(row.mod_id)
            elif text_type == "merge" and self.workshop_override_backup_files(row, "text"):
                text_patched_mods.append(row.mod_id)

            champion_ids = set(row.champion_ids)
            text = self.load_champion_text_payload(row.path)
            added: set[str] = set()
            if isinstance(text, dict):
                for champion_id in champion_ids:
                    if champion_id in text:
                        added.add(champion_id)
                    elif isinstance(text.get("data"), dict) and champion_id in text["data"]:
                        added.add(champion_id)
            text_ids.update(added)
            for champion_id in added:
                sources[champion_id] = row.mod_id
            missing_text_ids.extend(sorted(champion_ids - added))

        generated_ids = sorted(text_ids)
        compat_dir = self.champion_view_compat_dir(game_dir)
        config_enabled = [str(item) for item in config.get("enabled_mods", [])]
        compat_enabled = CHAMPION_VIEW_COMPAT_MOD_ID in config_enabled
        return {
            "activeMods": [row.mod_id for row in active],
            "activeChampionCount": len(active_champion_ids),
            "generatedIds": generated_ids,
            "textPayload": {},
            "sources": sources,
            "overrideMods": style_override_mods,
            "mergeMods": style_merge_mods,
            "viewPatchedMods": sorted(set(style_patched_mods)),
            "textOverrideMods": text_override_mods,
            "textPatchedMods": sorted(set(text_patched_mods)),
            "backupResidueMods": sorted(set(backup_residue_mods)),
            "missingAfterOrder": [],
            "missingStyleIds": [],
            "missingTextIds": sorted(set(missing_text_ids)),
            "conflictRisk": bool(style_override_mods),
            "shouldInstall": bool(style_override_mods or text_override_mods or backup_residue_mods or compat_dir.exists() or compat_enabled),
            "installed": bool((style_patched_mods or text_patched_mods) and not style_override_mods and not text_override_mods and not backup_residue_mods),
            "enabled": compat_enabled,
            "loadLast": bool(config_enabled and config_enabled[-1] == CHAMPION_VIEW_COMPAT_MOD_ID),
        }

    def format_champion_view_compat_summary(self, plan: dict) -> str:
        view_override_count = len(plan.get("overrideMods") or [])
        text_override_count = len(plan.get("textOverrideMods") or [])
        view_patched_count = len(plan.get("viewPatchedMods") or [])
        text_patched_count = len(plan.get("textPatchedMods") or [])
        residue_count = len(plan.get("backupResidueMods") or [])
        if residue_count:
            return f"backup residue cleanup needed: {residue_count} mods"
        if view_override_count or text_override_count:
            return f"merge patch needed: view {view_override_count} / text {text_override_count}"
        if view_patched_count or text_patched_count:
            return f"workshop merge patch applied: view {view_patched_count} / text {text_patched_count}"
        return "clean / no merge patch"

    def restore_champion_view_override_backups(self, game_dir: Path) -> list[str]:
        records: list[dict] = []
        compat_dir = self.champion_view_compat_dir(game_dir)
        manifest = read_json(compat_dir / "tfm2gg_compat_manifest.json", {})
        if isinstance(manifest, dict):
            records.extend(record for record in manifest.get("workshopOverrideBackups") or [] if isinstance(record, dict))

        for row in self.discover_workshop_champion_mods(game_dir):
            override_path = row.path / "mod.override_info"
            backups = self.workshop_override_backup_files(row, "view")
            for backup_path in backups:
                records.append({"path": str(override_path), "backupPath": str(backup_path), "modId": row.mod_id})

        restored: list[str] = []
        seen: set[tuple[str, str]] = set()
        for record in records:
            path_text = str(record.get("path") or "")
            backup_text = str(record.get("backupPath") or "")
            key = (path_text, backup_text)
            if not path_text or not backup_text or key in seen:
                continue
            seen.add(key)
            path = Path(path_text)
            backup_path = Path(backup_text)
            if not path.exists() or not backup_path.exists():
                continue
            backup_info = read_json(backup_path, {})
            current_info = read_json(path, {})
            if not isinstance(backup_info, dict) or not isinstance(current_info, dict):
                continue
            backup_entry = backup_info.get(CHAMPION_VIEW_ASSET_KEY)
            current_entry = current_info.get(CHAMPION_VIEW_ASSET_KEY)
            if not isinstance(backup_entry, dict) or not isinstance(current_entry, dict):
                continue
            if str(backup_entry.get("type") or "").strip().lower() != "override":
                continue
            current_type = str(current_entry.get("type") or "").strip().lower()
            backup_remapping = str(backup_entry.get("remapping") or "")
            current_remapping = str(current_entry.get("remapping") or "")
            if current_type == "override" and (not backup_remapping or backup_remapping == current_remapping):
                continue

            stamp = time.strftime("%Y%m%d_%H%M%S")
            snapshot_dir = user_state_dir() / "workshop_override_backups" / "restore_snapshots"
            snapshot_dir.mkdir(parents=True, exist_ok=True)
            current_backup = snapshot_dir / f"{stamp}_{safe_file_component(str(record.get('modId') or path.parent.name))}_view_current_mod.override_info"
            if not current_backup.exists():
                shutil.copy2(path, current_backup)
            replace_json_asset_type_preserving_format(path, CHAMPION_VIEW_ASSET_KEY, current_type or "merge", "override")
            restored.append(str(record.get("modId") or path.parent.name))
        return sorted(set(restored))

    def patch_champion_text_overrides(self, game_dir: Path) -> tuple[list[str], list[dict]]:
        patched: list[str] = []
        records: list[dict] = []
        stamp = time.strftime("%Y%m%d_%H%M%S")
        config = self.read_mods_config(game_dir)
        enabled = set(map(str, config.get("enabled_mods", [])))
        for row in self.discover_workshop_champion_mods(game_dir):
            if not row.enabled or row.mod_id not in enabled:
                continue
            override_path = row.path / "mod.override_info"
            override_info = read_json(override_path, {})
            if not isinstance(override_info, dict):
                continue
            entry = override_info.get(CHAMPION_TEXT_ASSET_KEY)
            if not isinstance(entry, dict):
                continue
            if str(entry.get("type") or "").strip().lower() != "override":
                continue
            backups = self.workshop_override_backup_files(row, "text")
            backup_path = backups[0] if backups else self.workshop_override_backup_path(row, "text", stamp)
            if not backup_path.exists():
                shutil.copy2(override_path, backup_path)
            replace_json_asset_type_preserving_format(override_path, CHAMPION_TEXT_ASSET_KEY, "override", "merge")
            patched.append(row.mod_id)
            records.append({
                "modId": row.mod_id,
                "workshopId": row.workshop_id,
                "sourceType": row.source_type,
                "sourceId": row.source_id,
                "path": str(override_path),
                "backupPath": str(backup_path),
            })
        return sorted(set(patched)), records

    def patch_champion_view_overrides(self, game_dir: Path) -> tuple[list[str], list[dict]]:
        patched: list[str] = []
        records: list[dict] = []
        stamp = time.strftime("%Y%m%d_%H%M%S")
        config = self.read_mods_config(game_dir)
        enabled = set(map(str, config.get("enabled_mods", [])))
        for row in self.discover_workshop_champion_mods(game_dir):
            if not row.enabled or row.mod_id not in enabled:
                continue
            override_path = row.path / "mod.override_info"
            override_info = read_json(override_path, {})
            if not isinstance(override_info, dict):
                continue
            entry = override_info.get(CHAMPION_VIEW_ASSET_KEY)
            if not isinstance(entry, dict):
                continue
            if str(entry.get("type") or "").strip().lower() != "override":
                continue
            backups = self.workshop_override_backup_files(row, "view")
            backup_path = backups[0] if backups else self.workshop_override_backup_path(row, "view", stamp)
            if not backup_path.exists():
                shutil.copy2(override_path, backup_path)
            replace_json_asset_type_preserving_format(override_path, CHAMPION_VIEW_ASSET_KEY, "override", "merge")
            patched.append(row.mod_id)
            records.append({
                "modId": row.mod_id,
                "workshopId": row.workshop_id,
                "sourceType": row.source_type,
                "sourceId": row.source_id,
                "path": str(override_path),
                "backupPath": str(backup_path),
            })
        return sorted(set(patched)), records

    def restore_champion_text_override_backups(self, game_dir: Path) -> list[str]:
        records: list[dict] = []
        compat_dir = self.champion_view_compat_dir(game_dir)
        manifest = read_json(compat_dir / "tfm2gg_compat_manifest.json", {})
        if isinstance(manifest, dict):
            records.extend(record for record in manifest.get("workshopTextOverrideBackups") or [] if isinstance(record, dict))

        for row in self.discover_workshop_champion_mods(game_dir):
            override_path = row.path / "mod.override_info"
            backups = self.workshop_override_backup_files(row, "text")
            for backup_path in backups:
                records.append({"path": str(override_path), "backupPath": str(backup_path), "modId": row.mod_id})

        restored: list[str] = []
        seen: set[tuple[str, str]] = set()
        for record in records:
            path_text = str(record.get("path") or "")
            backup_text = str(record.get("backupPath") or "")
            key = (path_text, backup_text)
            if not path_text or not backup_text or key in seen:
                continue
            seen.add(key)
            path = Path(path_text)
            backup_path = Path(backup_text)
            if not path.exists() or not backup_path.exists():
                continue
            backup_info = read_json(backup_path, {})
            current_info = read_json(path, {})
            if not isinstance(backup_info, dict) or not isinstance(current_info, dict):
                continue
            backup_entry = backup_info.get(CHAMPION_TEXT_ASSET_KEY)
            current_entry = current_info.get(CHAMPION_TEXT_ASSET_KEY)
            if not isinstance(backup_entry, dict) or not isinstance(current_entry, dict):
                continue
            if str(backup_entry.get("type") or "").strip().lower() != "override":
                continue
            current_type = str(current_entry.get("type") or "").strip().lower()
            backup_remapping = str(backup_entry.get("remapping") or "")
            current_remapping = str(current_entry.get("remapping") or "")
            if current_type == "override" and (not backup_remapping or backup_remapping == current_remapping):
                continue

            stamp = time.strftime("%Y%m%d_%H%M%S")
            snapshot_dir = user_state_dir() / "workshop_override_backups" / "restore_snapshots"
            snapshot_dir.mkdir(parents=True, exist_ok=True)
            current_backup = snapshot_dir / f"{stamp}_{safe_file_component(str(record.get('modId') or path.parent.name))}_text_current_mod.override_info"
            if not current_backup.exists():
                shutil.copy2(path, current_backup)
            replace_json_asset_type_preserving_format(path, CHAMPION_TEXT_ASSET_KEY, current_type or "merge", "override")
            restored.append(str(record.get("modId") or path.parent.name))
        return sorted(set(restored))

    def sync_champion_view_compat(self, game_dir: Path, force: bool = False) -> dict:
        plan = self.build_champion_view_compat_plan(game_dir)
        if not force and not plan.get("shouldInstall") and not plan.get("installed"):
            return plan
        if not plan.get("activeMods"):
            if force:
                raise RuntimeError("No active champion mods were found.")
            return plan
        if self.is_game_running():
            raise RuntimeError("Teamfight Manager 2 is running. Close the game before changing champion mod compatibility files.")

        moved_backup_files = self.migrate_workshop_override_backups(game_dir)
        patched_view_mods, view_backup_records = self.patch_champion_view_overrides(game_dir)
        patched_text_mods, text_backup_records = self.patch_champion_text_overrides(game_dir)
        compat_dir = self.champion_view_compat_dir(game_dir)
        if compat_dir.exists():
            self.backup_existing(game_dir, [compat_dir])
        if compat_dir.exists():
            remove_known_path(game_dir, compat_dir)

        config = self.read_mods_config(game_dir)
        enabled_mods = [str(item) for item in config.get("enabled_mods", []) if str(item) != CHAMPION_VIEW_COMPAT_MOD_ID]
        config["enabled_mods"] = enabled_mods
        self.write_mods_config(game_dir, config)

        updated = self.build_champion_view_compat_plan(game_dir)
        updated["patchedChampionViewMods"] = patched_view_mods
        updated["patchedTextOverrideMods"] = patched_text_mods
        updated["workshopViewOverrideBackups"] = view_backup_records
        updated["workshopTextOverrideBackups"] = text_backup_records
        updated["movedWorkshopBackupFiles"] = moved_backup_files
        return updated

    def remove_champion_view_compat(self, game_dir: Path) -> None:
        if self.is_game_running():
            raise RuntimeError("Teamfight Manager 2 is running. Close the game before removing champion mod compatibility files.")
        self.migrate_workshop_override_backups(game_dir)
        self.restore_champion_text_override_backups(game_dir)
        self.restore_champion_view_override_backups(game_dir)
        compat_dir = self.champion_view_compat_dir(game_dir)
        self.backup_existing(game_dir, [compat_dir])
        if compat_dir.exists():
            remove_known_path(game_dir, compat_dir)
        config = self.read_mods_config(game_dir)
        enabled_mods = [str(item) for item in config.get("enabled_mods", []) if str(item) != CHAMPION_VIEW_COMPAT_MOD_ID]
        config["enabled_mods"] = enabled_mods
        self.write_mods_config(game_dir, config)

    def discover_workshop_champion_mods(self, game_dir: Path) -> list[WorkshopChampionMod]:
        config = self.read_mods_config(game_dir)
        enabled = set(map(str, config.get("enabled_mods", [])))
        known = set(map(str, config.get("known_workshop_mods", [])))
        mods = []
        seen = set()

        def append_mod(item_dir: Path, source_type: str, source_id: str) -> None:
            located = self.find_workshop_mod_info(item_dir)
            if not located:
                return
            mod_root, info_path = located
            info = read_json(info_path, {})
            if not isinstance(info, dict):
                return
            mod_id = str(info.get("mod_id") or info.get("id") or "").strip()
            if not mod_id or mod_id in seen:
                return
            champion_ids = self.load_champion_ids_from_mod(mod_root)
            if not champion_ids:
                return
            seen.add(mod_id)
            mods.append(
                WorkshopChampionMod(
                    workshop_id=source_id if source_type == "workshop" else "local",
                    source_type=source_type,
                    source_id=source_id,
                    mod_id=mod_id,
                    name=str(info.get("name") or mod_id),
                    version=str(info.get("version") or "-"),
                    author=str(info.get("author") or "-"),
                    path=mod_root,
                    champion_ids=champion_ids,
                    enabled=mod_id in enabled,
                    known=mod_id in known or mod_id in enabled,
                    has_style_override=self.mod_has_style_override(mod_root),
                    has_code=bool(list(mod_root.rglob("*.dll"))),
                )
            )

        for item_dir in self.local_mod_dirs(game_dir):
            append_mod(item_dir, "local", item_dir.name)

        for content_dir in self.workshop_content_dirs(game_dir):
            try:
                item_dirs = sorted(path for path in content_dir.iterdir() if path.is_dir())
            except OSError:
                continue
            for item_dir in item_dirs:
                append_mod(item_dir, "workshop", item_dir.name)
        return mods

    def set_workshop_champion_mod_enabled(self, game_dir: Path, mod_id: str, enabled: bool) -> None:
        if self.is_game_running():
            raise RuntimeError("게임이 실행 중입니다. 챔피언 모드 활성 상태는 게임을 종료한 뒤 변경해 주세요.")
        mods = {row.mod_id: row for row in self.discover_workshop_champion_mods(game_dir)}
        if mod_id not in mods:
            raise RuntimeError(f"감지된 챔피언 모드가 아닙니다: {mod_id}")
        config = self.read_mods_config(game_dir)
        enabled_mods = [str(item) for item in config.get("enabled_mods", [])]
        known_mods = [str(item) for item in config.get("known_workshop_mods", [])]
        if enabled:
            if mod_id not in enabled_mods:
                enabled_mods.append(mod_id)
            if mod_id not in known_mods:
                known_mods.append(mod_id)
        else:
            enabled_mods = [item for item in enabled_mods if item != mod_id]
            if mod_id not in known_mods:
                known_mods.append(mod_id)
        config["enabled_mods"] = enabled_mods
        config["known_workshop_mods"] = known_mods
        self.write_mods_config(game_dir, config)

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
        critical_matches = 0
        critical_failures = []
        optional_mismatches = []
        for name, expected_size in expected.items():
            file_path = game_dir / name
            is_critical = name in CRITICAL_GAME_FILES
            if not file_path.exists():
                checks.append(ComponentStatus(False, name, "필수 파일 없음"))
                if is_critical:
                    critical_failures.append(name)
                continue
            size_checked += 1
            actual = file_path.stat().st_size
            if int(actual) == int(expected_size):
                size_matches += 1
                if is_critical:
                    critical_matches += 1
                checks.append(ComponentStatus(True, name, f"{target_version} 기준 파일 크기 일치"))
            else:
                detail = f"크기 다름: {actual:,} bytes (기대 {int(expected_size):,})"
                if not is_critical:
                    optional_mismatches.append(name)
                    checks.append(
                        ComponentStatus(
                            True,
                            name,
                            f"실행 파일 빌드 차이 허용: {actual:,} bytes",
                        )
                    )
                    continue
                critical_failures.append(name)
                checks.append(
                    ComponentStatus(
                        False,
                        name,
                        detail,
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

        critical_expected = [name for name in expected if name in CRITICAL_GAME_FILES]
        if critical_failures:
            main = ComponentStatus(
                False,
                "주의",
                f"Teamfight Manager 2 {target_version}용 설치 도구입니다. 핵심 게임 데이터 파일이 달라 Steam 업데이트/무결성 확인을 권장합니다.",
            )
        elif critical_expected and critical_matches == len(critical_expected):
            if optional_mismatches:
                main = ComponentStatus(
                    True,
                    "호환",
                    f"Teamfight Manager 2 {target_version} 핵심 데이터 기준과 일치합니다. 실행 파일 빌드 차이는 허용했습니다.",
                )
            else:
                main = ComponentStatus(True, "호환", f"Teamfight Manager 2 {target_version} 기준과 일치")
        elif size_checked and size_matches == size_checked:
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
        unknown_shell_items = [
            item for item in existing_shell_items
            if item.name not in DASHBOARD_SHELL_DEFAULT_ITEMS
        ]
        self.backup_existing(game_dir, unknown_shell_items)
        for target in existing_shell_items:
            if target.exists():
                remove_known_path(game_dir, target)
        copy_dashboard_shell_contents(shell, install_dir)

    def policy_export_dir(self, game_dir: Path) -> Path:
        return self.dashboard_app_dir(game_dir) / "tfm2_meta_dashboard" / "data" / "policy_exports"

    def write_policy_addon_config(self, game_dir: Path, addon: AddonPackage, addon_dir: Path) -> None:
        if not addon.policy_file:
            return
        lines = [
            f"# {addon.label} config",
            "# Generated by TFM2.gg installer. Restart the game after editing.",
            f"policy_dir={self.policy_export_dir(game_dir)}",
            f"policy_file={addon.policy_file}",
        ]
        for key, value in addon.config_extra:
            lines.append(f"{key}={value}")
        (addon_dir / "config.ini").write_text("\n".join(lines) + "\n", encoding="utf-8")

    def install_addon(self, game_dir: Path, source_root: Path | None = None, addon_id: str = MOD_ID) -> None:
        addon = ADDON_BY_ID[addon_id]
        mods_dir = game_dir / "mods"
        addon_dst = mods_dir / addon.mod_id
        mods_dir.mkdir(parents=True, exist_ok=True)
        self.backup_existing(game_dir, [addon_dst])
        if addon_dst.exists():
            remove_known_path(game_dir, addon_dst)
        copy_dir(self.addon_payload(source_root, addon), addon_dst)
        self.write_policy_addon_config(game_dir, addon, addon_dst)

        shadow_dst = self.workshop_shadow_dir(game_dir, addon)
        if shadow_dst:
            if shadow_dst.exists():
                shutil.rmtree(shadow_dst)
            copy_dir(addon_dst, shadow_dst)
            self.write_policy_addon_config(game_dir, addon, shadow_dst)

        config = self.read_mods_config(game_dir)
        enabled_mods = [str(item) for item in config.get("enabled_mods", [])]
        if addon.mod_id not in enabled_mods:
            enabled_mods.append(addon.mod_id)
        accepted = [str(item) for item in config.get("accepted_code_mod_warnings", [])]
        if addon.mod_id not in accepted:
            accepted.append(addon.mod_id)
        config["enabled_mods"] = enabled_mods
        config["accepted_code_mod_warnings"] = accepted
        self.write_mods_config(game_dir, config)

    def install_addons(self, game_dir: Path, addon_ids: tuple[str, ...], source_root: Path | None = None) -> None:
        for addon_id in addon_ids:
            self.install_addon(game_dir, source_root, addon_id)

    def installed_optional_addon_ids(self, game_dir: Path) -> tuple[str, ...]:
        return tuple(
            addon.mod_id
            for addon in ADDON_PACKAGES
            if addon.mod_id not in CORE_ADDON_IDS and (game_dir / "mods" / addon.mod_id).exists()
        )

    def install_all(self, game_dir: Path, source_root: Path | None = None) -> None:
        self.save_config(game_dir)
        ensure_writable_files(self.install_lock_paths(game_dir))
        self.migrate_legacy_dashboard(game_dir)
        self.install_dashboard_shell(game_dir, source_root)
        self.install_dashboard(game_dir, source_root)
        self.install_addons(game_dir, CORE_ADDON_IDS + self.installed_optional_addon_ids(game_dir), source_root)
        self.sync_champion_view_compat(game_dir)

    def remove_all(self, game_dir: Path) -> None:
        ensure_writable_files(self.install_lock_paths(game_dir))
        targets = [
            self.dashboard_install_dir(game_dir),
            *[game_dir / "mods" / addon.mod_id for addon in ADDON_PACKAGES],
            self.champion_view_compat_dir(game_dir),
            *self.legacy_dashboard_targets(game_dir),
        ]
        self.backup_existing(game_dir, [target for target in targets if target.exists()])
        for target in targets:
            if target.exists():
                remove_known_path(game_dir, target)
        for addon in ADDON_PACKAGES:
            shadow = self.workshop_shadow_dir(game_dir, addon)
            if shadow and shadow.exists():
                shutil.rmtree(shadow)
        self.remove_empty_legacy_dirs(game_dir)
        config = self.read_mods_config(game_dir)
        remove_ids = {CHAMPION_VIEW_COMPAT_MOD_ID, *[addon.mod_id for addon in ADDON_PACKAGES]}
        enabled_mods = [str(item) for item in config.get("enabled_mods", []) if str(item) not in remove_ids]
        accepted = [str(item) for item in config.get("accepted_code_mod_warnings", []) if str(item) not in remove_ids]
        config["enabled_mods"] = enabled_mods
        config["accepted_code_mod_warnings"] = accepted
        self.write_mods_config(game_dir, config)

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

    def backup_dir(self) -> Path:
        return user_state_dir() / "backups"

    def backup_status(self) -> dict:
        root = self.backup_dir()
        dirs = [path for path in root.iterdir() if path.is_dir()] if root.exists() else []
        total = 0
        for path in dirs:
            total += dir_size(path)
        return {
            "path": str(root),
            "count": len(dirs),
            "size": total,
            "limit": BACKUP_MAX_BYTES,
            "keepCount": BACKUP_KEEP_COUNT,
        }

    def prune_backups(self) -> dict:
        root = self.backup_dir()
        if not root.exists():
            return {"deletedDirs": 0, "deletedBytes": 0, **self.backup_status()}
        entries = []
        for path in root.iterdir():
            if not path.is_dir():
                continue
            try:
                stat = path.stat()
            except OSError:
                continue
            entries.append({
                "path": path,
                "mtime": stat.st_mtime,
                "size": dir_size(path),
            })
        entries.sort(key=lambda row: row["mtime"], reverse=True)
        total = sum(row["size"] for row in entries)
        remove_paths = []
        for row in entries[BACKUP_KEEP_COUNT:]:
            remove_paths.append(row)
        kept = [row for row in entries if row not in remove_paths]
        while total - sum(row["size"] for row in remove_paths) > BACKUP_MAX_BYTES and len(kept) > BACKUP_MIN_KEEP_COUNT:
            oldest = kept.pop()
            remove_paths.append(oldest)
        deleted_dirs = 0
        deleted_bytes = 0
        for row in remove_paths:
            path = row["path"]
            try:
                resolved = path.resolve()
                root_resolved = root.resolve()
                if root_resolved != resolved and root_resolved in resolved.parents:
                    shutil.rmtree(path)
                    deleted_dirs += 1
                    deleted_bytes += int(row["size"] or 0)
            except OSError:
                continue
        status = self.backup_status()
        status.update({"deletedDirs": deleted_dirs, "deletedBytes": deleted_bytes})
        return status

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
        self.prune_backups()

    def installed_status(self, game_dir: Path) -> dict:
        addon_status = {}
        for addon in ADDON_PACKAGES:
            path = game_dir / "mods" / addon.mod_id
            mod_info = read_json(path / "mod.mod_info", {})
            addon_status[addon.mod_id] = {
                "label": addon.label,
                "installed": path.exists(),
                "version": mod_info.get("version") or "-",
                "size": dir_size(path),
                "path": str(path),
            }
        addon = game_dir / "mods" / MOD_ID
        dashboard_app = self.dashboard_app_dir(game_dir)
        dashboard = dashboard_app / "tfm2_meta_dashboard"
        dashboard_shell = self.dashboard_install_dir(game_dir) / DASHBOARD_EXE_NAME
        legacy_dashboard = self.legacy_dashboard_app_dir(game_dir) / "tfm2_meta_dashboard"
        legacy_dashboard_shell = game_dir / DASHBOARD_EXE_NAME
        core_json = addon / "core-item-builds.json"
        core_data = read_json(core_json, {})
        policy_dir = dashboard / "data" / "policy_exports"
        policy_files = {
            "championTier": policy_dir / "champion_tier_policy.tsv",
            "aiChampion": policy_dir / "ai_champion_policy.tsv",
            "aiCandidateMap": policy_dir / "candidate_map.tsv",
        }
        meta_tier_mod = game_dir / "mods" / META_TIER_MOD_ID
        ai_banpick_mod = game_dir / "mods" / AI_BANPICK_MOD_ID
        addon_logs = {
            "metaTier": {
                "latest": (meta_tier_mod / "tier-policy-latest.txt").exists(),
                "debug": (meta_tier_mod / "debug.log").exists(),
            },
            "aiBanpick": {
                "debug": (ai_banpick_mod / "debug.log").exists(),
            },
        }
        installed_manifest = self.installed_manifest(game_dir)
        try:
            champion_view_compat = self.build_champion_view_compat_plan(game_dir)
            champion_view_compat["summary"] = self.format_champion_view_compat_summary(champion_view_compat)
        except Exception as exc:
            champion_view_compat = {"summary": f"check failed: {exc}", "installed": False, "enabled": False}
        installed_version = self.package_version(installed_manifest)
        has_legacy = legacy_dashboard.exists() or legacy_dashboard_shell.exists()
        any_addon_installed = any(row["installed"] for row in addon_status.values())
        package_version = installed_version or ("설치 버전 기록 없음" if dashboard.exists() or dashboard_shell.exists() or has_legacy or any_addon_installed else self.package_version(self.manifest) or "local-dev")
        layout_version = self.manifest_layout_version(installed_manifest)
        install_complete = self.install_complete(game_dir)
        if install_complete:
            layout_status = "최신 구조"
        elif has_legacy:
            layout_status = "이전 구조 정리 필요"
        elif dashboard.exists() or dashboard_shell.exists() or any_addon_installed:
            layout_status = "복구 필요"
        else:
            layout_status = "미설치"
        return {
            "dashboardInstalled": dashboard.exists(),
            "dashboardShellInstalled": dashboard_shell.exists(),
            "legacyDashboardInstalled": has_legacy,
            "addonInstalled": addon_status[MOD_ID]["installed"],
            "addonVersion": addon_status[MOD_ID]["version"],
            "addons": addon_status,
            "policyFiles": {key: path.exists() for key, path in policy_files.items()},
            "policyDetails": {
                "championTier": summarize_champion_tier_policy(policy_files["championTier"]),
                "aiChampion": summarize_ai_policy(policy_files["aiChampion"]),
                "aiCandidateMap": summarize_candidate_map(policy_files["aiCandidateMap"]),
            },
            "addonLogs": addon_logs,
            "coreGeneratedAt": core_data.get("generatedAt") or "-",
            "packageVersion": package_version,
            "sourceRevision": self.manifest_revision(installed_manifest),
            "layoutVersion": layout_version,
            "layoutStatus": layout_status,
            "installComplete": install_complete,
            "championViewCompat": champion_view_compat,
            "dashboardInstallDir": str(self.dashboard_install_dir(game_dir)),
            "dashboardSize": dir_size(dashboard),
            "dashboardShellSize": dashboard_shell.stat().st_size if dashboard_shell.exists() else 0,
            "addonSize": addon_status[MOD_ID]["size"],
            "backup": self.backup_status(),
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
        policy_dir = dashboard_app / "tfm2_meta_dashboard" / "data" / "policy_exports"
        return [
            self.dashboard_install_dir(game_dir) / DASHBOARD_EXE_NAME,
            dashboard_app / "main.cjs",
            dashboard_app / "tfm2_meta_dashboard",
            dashboard_app / "tfm2_meta_dashboard" / "data" / "meta-data.js",
            dashboard_app / "tfm2_meta_dashboard" / "data" / "core-item-builds.json",
            policy_dir / "champion_tier_policy.tsv",
            policy_dir / "ai_champion_policy.tsv",
            policy_dir / "candidate_map.tsv",
            game_dir / "mods" / MOD_ID / "tfm2_meta_item_delegate.dll",
        ]

    def install_lock_paths(self, game_dir: Path) -> list[Path]:
        return [
            self.dashboard_install_dir(game_dir) / DASHBOARD_EXE_NAME,
            game_dir / DASHBOARD_EXE_NAME,
            *[game_dir / "mods" / addon.mod_id / addon.dll_name for addon in ADDON_PACKAGES],
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
            payload / "dashboard_app" / "tfm2_meta_dashboard" / "data" / "policy_exports" / "champion_tier_policy.tsv",
            payload / "dashboard_app" / "tfm2_meta_dashboard" / "data" / "policy_exports" / "ai_champion_policy.tsv",
            payload / "dashboard_app" / "tfm2_meta_dashboard" / "data" / "policy_exports" / "candidate_map.tsv",
            *[payload / "mods" / addon.mod_id / addon.dll_name for addon in ADDON_PACKAGES],
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
        self.geometry("1020x760")
        self.minsize(960, 700)
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
        self.style.configure("TNotebook", background=bg, borderwidth=0)
        self.style.configure("TNotebook.Tab", font=("Malgun Gothic", 10), padding=(14, 7))

    def create_widgets(self):
        outer = ttk.Frame(self, padding=22)
        outer.pack(fill="both", expand=True)
        outer.columnconfigure(0, weight=1)
        outer.rowconfigure(4, weight=1, minsize=230)

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
        for index in range(9):
            actions.columnconfigure(index, weight=1)
        ttk.Button(actions, text="설치", style="Primary.TButton", command=lambda: self.run_task("install")).grid(row=0, column=0, sticky="ew", padx=4)
        ttk.Button(actions, text="복구", command=lambda: self.run_task("repair")).grid(row=0, column=1, sticky="ew", padx=4)
        ttk.Button(actions, text="아이템", style="Accent.TButton", command=lambda: self.run_task("addon")).grid(row=0, column=2, sticky="ew", padx=4)
        ttk.Button(actions, text="메타 티어", style="Accent.TButton", command=lambda: self.run_task("meta_tier_addon")).grid(row=0, column=3, sticky="ew", padx=4)
        ttk.Button(actions, text="AI 밴픽", style="Accent.TButton", command=lambda: self.run_task("ai_banpick_addon")).grid(row=0, column=4, sticky="ew", padx=4)
        ttk.Button(actions, text="챔프 모드", style="Refresh.TButton", command=self.show_champion_mod_manager).grid(row=0, column=5, sticky="ew", padx=4)
        ttk.Button(actions, text="제거", style="Danger.TButton", command=self.confirm_remove).grid(row=0, column=6, sticky="ew", padx=4)
        ttk.Button(actions, text="README", command=self.show_readme).grid(row=0, column=7, sticky="ew", padx=4)
        ttk.Button(actions, text="원격 업데이트", style="Refresh.TButton", command=lambda: self.run_task("update")).grid(row=0, column=8, sticky="ew", padx=4)

        body = ttk.Frame(outer)
        body.grid(row=4, column=0, sticky="nsew")
        body.columnconfigure(0, weight=1)
        body.rowconfigure(0, weight=1)
        notebook = ttk.Notebook(body)
        notebook.grid(row=0, column=0, sticky="nsew")
        log_card = ttk.Frame(notebook, style="Card.TFrame", padding=14)
        log_card.columnconfigure(0, weight=1)
        log_card.rowconfigure(1, weight=1)
        ttk.Label(log_card, text="작업 로그", style="CardTitle.TLabel").grid(row=0, column=0, sticky="w", pady=(0, 8))
        self.log_text = tk.Text(
            log_card,
            height=9,
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
        log_scroll = ttk.Scrollbar(log_card, orient="vertical", command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=log_scroll.set)
        log_scroll.grid(row=1, column=1, sticky="ns")
        notebook.add(log_card, text="작업 로그")

        detail_card = ttk.Frame(notebook, style="Card.TFrame", padding=14)
        detail_card.columnconfigure(0, weight=1)
        detail_card.rowconfigure(1, weight=1)
        ttk.Label(detail_card, text="상태 상세", style="CardTitle.TLabel").grid(row=0, column=0, sticky="w", pady=(0, 8))
        self.status_detail_text = tk.Text(
            detail_card,
            height=9,
            bg="#ffffff",
            fg="#1f2937",
            insertbackground="#1f2937",
            relief="flat",
            padx=12,
            pady=10,
            font=("Malgun Gothic", 9),
            wrap="word",
            state="disabled",
        )
        self.status_detail_text.grid(row=1, column=0, sticky="nsew")
        detail_scroll = ttk.Scrollbar(detail_card, orient="vertical", command=self.status_detail_text.yview)
        self.status_detail_text.configure(yscrollcommand=detail_scroll.set)
        detail_scroll.grid(row=1, column=1, sticky="ns")
        notebook.add(detail_card, text="상태 상세")

        footer = ttk.Frame(outer)
        footer.grid(row=5, column=0, sticky="ew", pady=(12, 0))
        footer.columnconfigure(0, weight=1)
        ttk.Label(footer, textvariable=self.status_var, style="Subtle.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Button(footer, text="백업 정리", command=lambda: self.run_task("clean_backups")).grid(row=0, column=1, sticky="e", padx=(0, 8))
        ttk.Button(footer, text="상태 새로고침", style="Refresh.TButton", command=self.refresh_status).grid(row=0, column=2, sticky="e")

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

    def set_status_detail(self, text: str):
        self.status_detail_text.configure(state="normal")
        self.status_detail_text.delete("1.0", "end")
        self.status_detail_text.insert("1.0", text)
        self.status_detail_text.configure(state="disabled")

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
        addon_short_labels = {
            MOD_ID: "아이템",
            META_TIER_MOD_ID: "메타",
            AI_BANPICK_MOD_ID: "AI",
        }
        addon_lines = []
        for addon in ADDON_PACKAGES:
            row = installed["addons"][addon.mod_id]
            label = addon_short_labels.get(addon.mod_id, addon.label)
            state = row["version"] if row["installed"] and row["version"] else ("설치됨" if row["installed"] else "없음")
            addon_lines.append(f"{label} {state}")
        policy_ok = (
            installed["policyFiles"].get("championTier")
            and installed["policyFiles"].get("aiChampion")
            and installed["policyFiles"].get("aiCandidateMap")
        )
        meta_logs = installed["addonLogs"]["metaTier"]
        ai_logs = installed["addonLogs"]["aiBanpick"]
        backup = installed.get("backup") or {}
        shell_state = "설치됨" if installed["dashboardShellInstalled"] else "없음"
        dashboard_state = "설치됨" if installed["dashboardInstalled"] else "없음"
        installed_addon_count = sum(1 for row in installed["addons"].values() if row["installed"])
        compat_summary = installed["championViewCompat"]["summary"]
        compat_short = "정상"
        lower_compat = str(compat_summary).lower()
        if "needed" in lower_compat or "failed" in lower_compat:
            compat_short = "확인 필요"
        elif "applied" in lower_compat:
            compat_short = "적용됨"
        install_summary_lines = [
            f"구조: {installed['layoutStatus']}",
            f"대시보드: {shell_state} / 애드온 {installed_addon_count}/{len(ADDON_PACKAGES)}",
            f"정책: {'있음' if policy_ok else '없음'} / 챔프 호환 {compat_short}",
        ]
        detail_lines = [
            f"챔프 호환: {installed['championViewCompat']['summary']}",
            f"실행/대시보드: {shell_state} / {dashboard_state}",
            f"설치 구조: {installed['layoutStatus']}",
            f"애드온: {' / '.join(addon_lines)}",
            f"메타 티어 TSV: {installed['policyDetails']['championTier']}",
            f"AI 보정 TSV: {installed['policyDetails']['aiChampion']}",
            installed["policyDetails"]["aiCandidateMap"],
            f"정책 TSV: {'있음' if policy_ok else '없음'}",
            f"모드 로그: 티어 {'있음' if meta_logs['latest'] or meta_logs['debug'] else '대기'} / AI {'있음' if ai_logs['debug'] else '대기'}",
            f"백업: {backup.get('count', 0)}개 / {format_bytes(int(backup.get('size') or 0))}",
            f"메타 생성: {installed['coreGeneratedAt']}",
        ]
        self.install_card_var.set("\n".join(install_summary_lines))
        self.set_status_detail("\n".join(detail_lines))
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
                self.model.install_addon(game_dir, addon_id=MOD_ID)
                self.work_queue.put(("log", "애드온 설치 완료: 아이템 자동 설정 모드가 적용되었습니다."))
                self.work_queue.put(("success", ("애드온 설치 완료", "아이템 자동 설정 애드온 설치가 완료되었습니다.")))
            elif kind == "meta_tier_addon":
                self.model.install_addon(game_dir, addon_id=META_TIER_MOD_ID)
                self.work_queue.put(("log", "애드온 설치 완료: 메타 티어 동기화 모드가 적용되었습니다."))
                self.work_queue.put(("success", ("메타 티어 설치 완료", "메타 티어 동기화 애드온 설치가 완료되었습니다.\n대시보드 메타 티어를 인게임 S/A/B/C/D 티어로 변환해 적용합니다.\n게임을 실행 중이었다면 재시작 후 모드 목록에서 활성화해 주세요.")))
            elif kind == "ai_banpick_addon":
                self.model.install_addon(game_dir, addon_id=AI_BANPICK_MOD_ID)
                self.work_queue.put(("log", "애드온 설치 완료: AI 밴픽 보정 모드가 적용되었습니다."))
                self.work_queue.put(("success", ("AI 밴픽 설치 완료", "AI 밴픽 보정 애드온 설치가 완료되었습니다.\nAI가 밴픽 후보를 평가할 때 메타 점수 기반 보정을 더합니다.\n게임을 실행 중이었다면 재시작 후 모드 목록에서 활성화해 주세요.")))
            elif kind == "remove":
                self.model.remove_all(game_dir)
                self.work_queue.put(("log", "제거 완료: TFM2.gg 설치 항목을 제거했습니다."))
                self.work_queue.put(("success", ("제거 완료", "TFM2.gg 설치 항목을 제거했습니다.\n기존 파일은 백업 후 처리되었습니다.")))
            elif kind == "clean_backups":
                status = self.model.prune_backups()
                deleted_dirs = int(status.get("deletedDirs") or 0)
                deleted_bytes = int(status.get("deletedBytes") or 0)
                kept_count = int(status.get("count") or 0)
                kept_size = int(status.get("size") or 0)
                self.work_queue.put(("log", f"백업 정리 완료: {deleted_dirs}개 삭제, {format_bytes(deleted_bytes)} 확보"))
                self.work_queue.put((
                    "info",
                    (
                        "백업 정리 완료",
                        f"남은 백업: {kept_count}개\n사용량: {format_bytes(kept_size)}\n보존 기준: 최근 {BACKUP_KEEP_COUNT}개 / 최대 {format_bytes(BACKUP_MAX_BYTES)}",
                    ),
                ))
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
                        "meta_tier_addon": "메타 티어 설치 완료",
                        "ai_banpick_addon": "AI 밴픽 설치 완료",
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

    def show_champion_mod_manager(self):
        win = tk.Toplevel(self)
        win.title("챔피언 추가 모드 관리")
        win.geometry("900x520")
        win.configure(bg="#f5f7fb")
        frame = ttk.Frame(win, padding=16)
        frame.pack(fill="both", expand=True)
        frame.rowconfigure(2, weight=1)
        frame.columnconfigure(0, weight=1)

        title = ttk.Frame(frame)
        title.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        title.columnconfigure(0, weight=1)
        ttk.Label(title, text="챔피언 추가 모드", style="Title.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(
            title,
            text="Steam 창작마당과 게임 mods 폴더에서 감지된 챔피언 추가 모드를 게임 활성 목록에 켜고 끕니다. 적용 후 게임 재시작이 필요합니다.",
            style="Subtle.TLabel",
        ).grid(row=1, column=0, sticky="w", pady=(3, 0))

        info_var = tk.StringVar(value="")
        ttk.Label(frame, textvariable=info_var, style="Subtle.TLabel").grid(row=1, column=0, sticky="w", pady=(0, 8))

        columns = ("state", "name", "mod_id", "version", "champions", "source", "warnings")
        tree = ttk.Treeview(frame, columns=columns, show="headings", selectmode="browse")
        headers = {
            "state": "상태",
            "name": "모드",
            "mod_id": "mod_id",
            "version": "버전",
            "champions": "챔피언",
            "source": "Source",
            "warnings": "주의",
        }
        widths = {
            "state": 78,
            "name": 230,
            "mod_id": 130,
            "version": 70,
            "champions": 90,
            "source": 140,
            "warnings": 150,
        }
        for column in columns:
            tree.heading(column, text=headers[column])
            tree.column(column, width=widths[column], anchor="w")
        tree.grid(row=2, column=0, sticky="nsew")
        scroll = ttk.Scrollbar(frame, orient="vertical", command=tree.yview)
        scroll.grid(row=2, column=1, sticky="ns")
        tree.configure(yscrollcommand=scroll.set)

        rows_by_iid: dict[str, WorkshopChampionMod] = {}

        def refresh_tree():
            rows_by_iid.clear()
            tree.delete(*tree.get_children())
            game_dir = self.current_game_dir()
            mods = self.model.discover_workshop_champion_mods(game_dir)
            active_count = sum(1 for row in mods if row.enabled)
            try:
                compat_plan = self.model.build_champion_view_compat_plan(game_dir)
                compat_summary = self.model.format_champion_view_compat_summary(compat_plan)
            except Exception as exc:
                compat_summary = f"check failed: {exc}"
            info_var.set(f"감지된 챔프 모드 {len(mods)}개 / 활성 {active_count}개 / 호환 패치 {compat_summary}")
            for index, row in enumerate(mods):
                warnings = []
                if row.has_style_override:
                    warnings.append("표시 스타일 override")
                if row.has_code:
                    warnings.append("DLL 포함")
                values = (
                    "켜짐" if row.enabled else "꺼짐",
                    row.name,
                    row.mod_id,
                    row.version,
                    f"{len(row.champion_ids)}개",
                    row.source_label,
                    ", ".join(warnings) if warnings else "-",
                )
                iid = str(index)
                rows_by_iid[iid] = row
                tree.insert("", "end", iid=iid, values=values)

        def selected_row() -> WorkshopChampionMod | None:
            selection = tree.selection()
            if not selection:
                messagebox.showinfo("챔피언 모드", "먼저 모드를 선택해 주세요.")
                return None
            return rows_by_iid.get(selection[0])

        def set_enabled(enabled: bool):
            row = selected_row()
            if not row:
                return
            action = "활성화" if enabled else "비활성화"
            if not messagebox.askyesno("챔피언 모드", f"{row.name}\n\n이 모드를 {action}할까요?\n게임 실행 중에는 적용되지 않습니다."):
                return
            try:
                game_dir = self.current_game_dir()
                self.model.set_workshop_champion_mod_enabled(game_dir, row.mod_id, enabled)
                compat_plan = self.model.sync_champion_view_compat(game_dir)
                self.log(f"champion mod compat patch: {self.model.format_champion_view_compat_summary(compat_plan)}")
                self.log(f"챔피언 모드 {action}: {row.mod_id}")
                refresh_tree()
                self.refresh_status()
                messagebox.showinfo("챔피언 모드", f"{row.name} {action} 완료\n게임을 재시작해야 적용됩니다.")
            except Exception as exc:
                messagebox.showerror("챔피언 모드", str(exc))

        def rebuild_compat():
            try:
                plan = self.model.sync_champion_view_compat(self.current_game_dir(), force=True)
                summary = self.model.format_champion_view_compat_summary(plan)
                self.log(f"champion mod compat patch rebuilt: {summary}")
                refresh_tree()
                self.refresh_status()
                messagebox.showinfo("챔프 모드 안정화", f"호환 패치 적용을 완료했습니다.\n{summary}")
            except Exception as exc:
                messagebox.showerror("챔프 모드 안정화", str(exc))

        def remove_compat():
            if not messagebox.askyesno("챔프 모드 안정화", "TFM2.gg가 적용했던 호환 패치를 제거하고, 가능한 원본 override 상태로 되돌릴까요?"):
                return
            try:
                self.model.remove_champion_view_compat(self.current_game_dir())
                self.log("champion mod compat patch removed")
                refresh_tree()
                self.refresh_status()
                messagebox.showinfo("챔프 모드 안정화", "호환 패치를 제거했습니다.")
            except Exception as exc:
                messagebox.showerror("챔프 모드 안정화", str(exc))

        def open_folder():
            row = selected_row()
            if row:
                os.startfile(row.path)

        btns = ttk.Frame(frame)
        btns.grid(row=3, column=0, columnspan=2, sticky="ew", pady=(12, 0))
        ttk.Button(btns, text="호환 패치", style="Accent.TButton", command=rebuild_compat).pack(side="left", padx=(0, 8))
        ttk.Button(btns, text="호환 패치 제거", command=remove_compat).pack(side="left", padx=(0, 8))
        ttk.Button(btns, text="활성화", style="Primary.TButton", command=lambda: set_enabled(True)).pack(side="left")
        ttk.Button(btns, text="비활성화", style="Danger.TButton", command=lambda: set_enabled(False)).pack(side="left", padx=(8, 0))
        ttk.Button(btns, text="폴더 열기", command=open_folder).pack(side="left", padx=(8, 0))
        ttk.Button(btns, text="새로고침", style="Refresh.TButton", command=refresh_tree).pack(side="left", padx=(8, 0))
        ttk.Button(btns, text="닫기", command=win.destroy).pack(side="right")
        refresh_tree()

    def confirm_remove(self):
        if messagebox.askyesno("제거 확인", "TFM2.gg 대시보드와 설치된 팀파매.gg 애드온을 제거할까요?\n기존 항목은 백업 후 제거됩니다."):
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
