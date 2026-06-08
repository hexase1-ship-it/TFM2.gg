import gzip
import argparse
import base64
import json
import math
import os
import re
import struct
import zlib
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


ROOT = Path(os.environ.get("TFM2_GAME_ROOT", Path(__file__).resolve().parents[2])).resolve()
DASHBOARD = Path(__file__).resolve().parents[1]
REPO_ROOT = DASHBOARD.parents[3] if len(DASHBOARD.parents) > 3 else ROOT
STEAM_APP_ID = "3009300"
MAX_EXTERNAL_SPRITE_BYTES = 5 * 1024 * 1024
OUT = DASHBOARD / "data" / "meta-data.js"
SCORE_MODEL_SPEC = DASHBOARD / "data" / "score-model-spec.json"
POLICY_SETTINGS = DASHBOARD / "data" / "policy-settings.json"
CORE_ITEM_BUILDS_OUT = DASHBOARD / "data" / "core-item-builds.json"
CORE_ITEM_BUILDS_MOD_OUT = ROOT / "mods" / "tfm2_meta_item_delegate" / "core-item-builds.json"
CORE_ITEM_BUILDS_MOD_DATA_OUT = ROOT / "mods" / "tfm2_meta_item_delegate" / "data" / "core-item-builds.json"
POLICY_EXPORT_DIR = DASHBOARD / "data" / "policy_exports"
POLICY_HISTORY_DIR = POLICY_EXPORT_DIR / "history"
POLICY_HISTORY_INDEX = POLICY_EXPORT_DIR / "policy-history.json"
CHAMPION_TIER_POLICY_OUT = POLICY_EXPORT_DIR / "champion_tier_policy.tsv"
AI_CHAMPION_POLICY_OUT = POLICY_EXPORT_DIR / "ai_champion_policy.tsv"
CHAMPION_TIER_POLICY_MOD_OUT = ROOT / "mods" / "tfm2_meta_champion_tiers" / "champion_tier_policy.tsv"
AI_CHAMPION_POLICY_MOD_OUT = ROOT / "mods" / "tfm2_ai_banpick_probe" / "ai_champion_policy.tsv"
CHAMPION_TIER_POLICY_SOURCE_MOD_OUT = REPO_ROOT / "tfm2_meta_champion_tiers (팀파매.gg 메타 티어 동기화 애드온 모드)" / "champion_tier_policy.tsv"
AI_CHAMPION_POLICY_SOURCE_MOD_OUT = REPO_ROOT / "tfm2_ai_banpick_probe (팀파매.gg AI 밴픽 보정 애드온 모드)" / "ai_champion_policy.tsv"
BANPICK_DATA = DASHBOARD / "data" / "banpick-data.js"
AI_CANDIDATE_MAP_OUT = POLICY_EXPORT_DIR / "candidate_map.tsv"
AI_CANDIDATE_MAP_MOD_OUT = ROOT / "mods" / "tfm2_ai_banpick_probe" / "candidate_map.tsv"
AI_CANDIDATE_MAP_SOURCE_MOD_OUT = REPO_ROOT / "tfm2_ai_banpick_probe (팀파매.gg AI 밴픽 보정 애드온 모드)" / "candidate_map.tsv"
ITEM_SETTING_PATHS = [
    DASHBOARD / "data" / "item_setting.item_setting",
    ROOT / "mods" / "base_unpacked" / "setting" / "item_setting.item_setting",
    ROOT / "_modding_downloads" / "base_current" / "setting" / "item_setting.item_setting",
]
ITEM_I18N_PATHS = [
    DASHBOARD / "data" / "item.i18n",
    ROOT / "mods" / "base_unpacked" / "text" / "item.i18n",
    ROOT / "_modding_downloads" / "base_current" / "text" / "item.i18n",
]
ITEM_ICON_DIR = DASHBOARD / "assets" / "items"

DATE_VERSION_RE = re.compile(r"^\d{4}\.\d+\.\d+$")
POSITION_NAMES = ["top", "jungle", "mid", "bot", "support"]
POSITION_FIELD_NAMES = {"top": "top", "jungle": "jungle", "mid": "mid", "bot": "bottom", "support": "support"}
BUILD_DIRECTIONS = {"AD", "Magic", "AttackSpeed", "Defense", "MagicResistance", "Hp", "Auto"}
LEAGUE_REGION_LABELS = {
    "tack": "한국",
    "tacc": "중국",
    "tace": "유럽",
    "taca": "북미",
    "tacs": "남미",
    "tacj": "일본",
}
LEAGUE_KEY_FALLBACKS = ["tack", "tacc", "tace", "taca", "tacs", "tacj"]
POLICY_PRESETS = {
    "classic": {"label": "classic", "weights": {"win": 1.0, "pick": 0.2, "ban": 0.2}},
    "fearless": {"label": "fearless", "weights": {"win": 1.0, "pick": 0.18, "ban": 0.55}},
    "hardFearless": {"label": "hardFearless", "weights": {"win": 1.0, "pick": 0.15, "ban": 0.85}},
}
POLICY_PRESET_IDS = set(POLICY_PRESETS)
FOLLOW_DASHBOARD_POLICY = "followDashboard"
POLICY_TIER_MAP = {"OP": "S", "1": "A", "2": "B", "3": "C", "4": "D", "-": "No"}
POLICY_TIER_SORT = {"S": 6, "A": 5, "B": 4, "C": 3, "D": 2, "No": 1}
TIER_POLICY_OVERALL_ANCHORS = {"S": 90.0, "A": 75.0, "B": 62.0, "C": 50.0, "D": 35.0}
AI_POLICY_OVERALL_ANCHORS = {"S": 80.0, "A": 70.0, "B": 60.0, "C": 50.0, "D": 40.0}
POLICY_GATE_MODES = {"sampleGate", "immediate", "locked"}
DEFAULT_TIER_POLICY_GATE = {
    "mode": "sampleGate",
    "minMatches": 100,
    "fallbackMatches": 50,
    "minEligibleRatio": 0.45,
}
BASE_CANDIDATE_ORDER = [
    "fighter",
    "knight",
    "swordman",
    "archer",
    "soldier",
    "priest",
    "pythoness",
    "monk",
    "pyromancer",
    "ice_mage",
    "ninja",
    "magic_knight",
    "berserker",
    "executioner",
    "lancer",
    "ogre",
    "dual_blader",
    "cavalry_knight",
    "gunner",
    "pole_warrior",
    "jiangshi",
    "gambler",
    "hammerer",
    "demon",
    "vampire",
    "spirit_caller",
    "boomerang_hunter",
    "inquisitor",
    "shield_bearer",
    "whip_master",
    "werewolf",
    "dokkaebi",
    "necromancer",
    "bard",
    "barrier_magician",
    "chef",
    "clown",
    "dancer",
    "dark_mage",
    "exorcist",
    "ghost",
    "illusionist",
    "lightning_mage",
    "plague_doctor",
    "poison_dart_hunter",
    "shadowmancer",
    "taoist",
    "siege_breaker",
    "android",
    "druid",
    "prisoner",
    "bomber",
    "voodoo_shaman",
    "white_mage",
    "wind_mage",
    "enchanter",
    "hitman",
    "guardian_spirit",
    "hunter",
    "circus_blade",
]
BASE_CANDIDATE_INDEX = {champion_id: index for index, champion_id in enumerate(BASE_CANDIDATE_ORDER)}
INTERNAL_SCORE_FIELDS = [
    "pickOpportunities",
    "banOpportunities",
]
SOURCE_COUNTER_FIELDS = [
    "sourceMatchCounts",
    "sourcePickCounts",
    "sourceBanCounts",
]

DEFAULT_SCORE_MODEL_SPEC = {
    "modelVersion": "tfm2gg-meta-v1",
    "posterior": {
        "z": 0.84,
        "fallbackPriorMean": 0.5,
        "kappa": {"early": [8, 50], "normal": [12, 80], "role": [18, 100]},
        "ratePriorKappa": 20,
    },
    "strength": {"meanWeight": 0.7, "lowerWeight": 0.3},
    "pressure": {"eps": 0.001, "scale": 16},
    "presets": {
        "classic": {
            "label": "classic",
            "metaStrengthWeight": 0.84,
            "metaPressureWeight": 0.16,
            "lowerStrengthWeight": 0.88,
            "lowerPressureWeight": 0.12,
        },
        "fearless": {
            "label": "fearless",
            "metaStrengthWeight": 0.78,
            "metaPressureWeight": 0.22,
            "lowerStrengthWeight": 0.82,
            "lowerPressureWeight": 0.18,
        },
        "hardFearless": {
            "label": "hardFearless",
            "metaStrengthWeight": 0.72,
            "metaPressureWeight": 0.28,
            "lowerStrengthWeight": 0.78,
            "lowerPressureWeight": 0.22,
        },
    },
    "tiers": [
        {"tier": "OP", "minLower": 56, "maxPercentile": 0.08},
        {"tier": "1", "minLower": 51, "maxPercentile": 0.22},
        {"tier": "2", "minLower": 48, "maxPercentile": 0.45},
        {"tier": "3", "minLower": 44, "maxPercentile": 0.7},
    ],
    "honey": {
        "residualDivisor": 20,
        "adaptiveResidualMinDivisor": 3,
        "adaptiveResidualQuantile": 0.75,
        "adaptiveResidualScale": 1.25,
        "rankGapWeight": 0.72,
        "residualGapWeight": 0.28,
    },
}


def version_sort_key(version):
    parts = re.findall(r"\d+", str(version))
    return tuple(int(part) for part in parts) if parts else (0,)


def load_js_json(path: Path):
    text = path.read_text(encoding="utf-8")
    raw = text[text.find("=") + 1 :].strip()
    if raw.endswith(";"):
        raw = raw[:-1]
    return json.loads(raw)


def load_score_model_spec():
    try:
        spec = json.loads(SCORE_MODEL_SPEC.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        spec = DEFAULT_SCORE_MODEL_SPEC
    merged = json.loads(json.dumps(DEFAULT_SCORE_MODEL_SPEC))
    for key, value in (spec or {}).items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key].update(value)
        else:
            merged[key] = value
    return merged


def load_policy_settings():
    try:
        data = json.loads(POLICY_SETTINGS.read_text(encoding="utf-8-sig"))
    except (OSError, json.JSONDecodeError):
        return {}
    return data if isinstance(data, dict) else {}


def int_setting(value, fallback, minimum=0):
    try:
        number = int(value)
    except (TypeError, ValueError):
        return fallback
    return max(minimum, number)


def float_setting(value, fallback, minimum=0.0, maximum=None):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return fallback
    if not math.isfinite(number):
        return fallback
    number = max(minimum, number)
    if maximum is not None:
        number = min(maximum, number)
    return number


def tier_policy_gate_settings():
    settings = load_policy_settings()
    mode = (
        os.environ.get("TFM2_TIER_POLICY_GATE_MODE")
        or settings.get("tierPolicyGateMode")
        or DEFAULT_TIER_POLICY_GATE["mode"]
    )
    mode = str(mode).strip()
    if mode not in POLICY_GATE_MODES:
        mode = DEFAULT_TIER_POLICY_GATE["mode"]
    return {
        "mode": mode,
        "minMatches": int_setting(
            os.environ.get("TFM2_TIER_POLICY_MIN_MATCHES") or settings.get("tierPolicyMinMatches"),
            DEFAULT_TIER_POLICY_GATE["minMatches"],
            1,
        ),
        "fallbackMatches": int_setting(
            os.environ.get("TFM2_TIER_POLICY_FALLBACK_MATCHES") or settings.get("tierPolicyFallbackMatches"),
            DEFAULT_TIER_POLICY_GATE["fallbackMatches"],
            1,
        ),
        "minEligibleRatio": float_setting(
            os.environ.get("TFM2_TIER_POLICY_MIN_ELIGIBLE_RATIO") or settings.get("tierPolicyMinEligibleRatio"),
            DEFAULT_TIER_POLICY_GATE["minEligibleRatio"],
            0.0,
            1.0,
        ),
    }


def load_json_file(path, default=None):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8-sig"))
    except (OSError, json.JSONDecodeError):
        return default


def detect_game_root_for_mods(root=ROOT):
    candidates = []
    env_root = os.environ.get("TFM2_GAME_INSTALL_DIR") or os.environ.get("TFM2_GAME_DIR")
    if env_root:
        candidates.append(Path(env_root))
    root = Path(root)
    candidates.append(root)
    for parent in root.parents:
        candidates.append(parent)
    candidates.append(Path(r"C:\Program Files (x86)\Steam\steamapps\common\Teamfight Manager2"))
    for candidate in candidates:
        try:
            resolved = candidate.expanduser().resolve()
        except OSError:
            continue
        if (resolved / "TeamfightManager2.exe").exists():
            return resolved
    return root


def read_enabled_mod_ids(game_root=ROOT):
    data = load_json_file(Path(game_root) / "config" / "game" / "mods.json", {})
    if not isinstance(data, dict):
        return []
    return [str(item) for item in data.get("enabled_mods", []) if str(item)]


def workshop_content_dirs(game_root=ROOT):
    candidates = []
    try:
        candidates.append(Path(game_root).resolve().parents[1] / "workshop" / "content" / STEAM_APP_ID)
    except IndexError:
        pass
    return [path for path in candidates if path.exists()]


def local_mod_dirs(game_root=ROOT):
    mods_dir = Path(game_root) / "mods"
    if not mods_dir.exists():
        return []
    try:
        return sorted(path for path in mods_dir.iterdir() if path.is_dir())
    except OSError:
        return []


def find_workshop_mod_root(item_dir):
    direct = item_dir / "mod.mod_info"
    if direct.exists():
        return item_dir, direct
    try:
        children = sorted(path for path in item_dir.iterdir() if path.is_dir())
    except OSError:
        return None
    for child in children:
        info = child / "mod.mod_info"
        if info.exists():
            return child, info
    return None


def discover_workshop_champion_mods(game_root=ROOT):
    out = {}

    def add_candidate(item_dir, source_type, source_id):
        located = find_workshop_mod_root(item_dir)
        if not located:
            return
        mod_root, info_path = located
        info = load_json_file(info_path, {})
        if not isinstance(info, dict):
            return
        mod_id = str(info.get("mod_id") or info.get("id") or "").strip()
        if not mod_id or mod_id in out:
            return
        champion_dir = mod_root / "champion"
        champion_files = sorted(champion_dir.glob("*.data_champion")) if champion_dir.exists() else []
        if not champion_files:
            return
        out[mod_id] = {
            "sourceType": source_type,
            "sourceId": source_id,
            "workshopId": source_id if source_type == "workshop" else None,
            "modId": mod_id,
            "name": info.get("name") or mod_id,
            "version": info.get("version") or "-",
            "author": info.get("author") or "-",
            "path": str(mod_root),
            "championFiles": champion_files,
        }

    for item_dir in local_mod_dirs(game_root):
        add_candidate(item_dir, "local", item_dir.name)

    for content_dir in workshop_content_dirs(game_root):
        try:
            item_dirs = sorted(path for path in content_dir.iterdir() if path.is_dir())
        except OSError:
            continue
        for item_dir in item_dirs:
            add_candidate(item_dir, "workshop", item_dir.name)
    return out


def load_mod_champion_i18n(mod_root):
    data = load_json_file(Path(mod_root) / "text" / "champion.i18n", {})
    if not isinstance(data, dict):
        return {}
    for lang in ["ko", "en", "ja", "zh-CN"]:
        desc = ((data.get(lang) or {}).get("description") or {})
        if desc:
            return desc
    return {}


def png_dimensions(path):
    try:
        with Path(path).open("rb") as handle:
            header = handle.read(24)
    except OSError:
        return None
    if len(header) < 24 or not header.startswith(b"\x89PNG\r\n\x1a\n"):
        return None
    return struct.unpack(">II", header[16:24])


def png_data_uri(width, height, rgba):
    if width <= 0 or height <= 0 or len(rgba) != width * height * 4:
        return None
    scanlines = bytearray()
    stride = width * 4
    for y in range(height):
        scanlines.append(0)
        start = y * stride
        scanlines.extend(rgba[start : start + stride])

    def chunk(kind, payload):
        return (
            struct.pack(">I", len(payload))
            + kind
            + payload
            + struct.pack(">I", zlib.crc32(kind + payload) & 0xFFFFFFFF)
        )

    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(scanlines), 9))
        + chunk(b"IEND", b"")
    )
    return "data:image/png;base64," + base64.b64encode(png).decode("ascii")


def alpha_blend_pixel(canvas, index, red, green, blue, alpha):
    if alpha <= 0:
        return
    if alpha >= 255 and canvas[index + 3] == 0:
        canvas[index : index + 4] = bytes((red, green, blue, alpha))
        return
    dst_alpha = canvas[index + 3]
    out_alpha = alpha + (dst_alpha * (255 - alpha) + 127) // 255
    if out_alpha <= 0:
        return
    for channel, src in enumerate((red, green, blue)):
        dst = canvas[index + channel]
        src_part = src * alpha
        dst_part = dst * dst_alpha * (255 - alpha) // 255
        canvas[index + channel] = min(255, (src_part + dst_part + out_alpha // 2) // out_alpha)
    canvas[index + 3] = min(255, out_alpha)


def crop_alpha_bbox(width, height, rgba):
    min_x, min_y = width, height
    max_x, max_y = -1, -1
    for y in range(height):
        for x in range(width):
            if rgba[(y * width + x) * 4 + 3]:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if max_x < min_x or max_y < min_y:
        return 0, 0, width, height, bytes(rgba)
    crop_w = max_x - min_x + 1
    crop_h = max_y - min_y + 1
    cropped = bytearray(crop_w * crop_h * 4)
    for y in range(crop_h):
        src = ((min_y + y) * width + min_x) * 4
        dst = y * crop_w * 4
        cropped[dst : dst + crop_w * 4] = rgba[src : src + crop_w * 4]
    return min_x, min_y, crop_w, crop_h, bytes(cropped)


def aseprite_first_frame_png(path):
    try:
        data = Path(path).read_bytes()
    except OSError:
        return None
    if len(data) < 144:
        return None
    try:
        if struct.unpack_from("<H", data, 4)[0] != 0xA5E0:
            return None
        frame_count = struct.unpack_from("<H", data, 6)[0]
        canvas_width, canvas_height = struct.unpack_from("<HH", data, 8)
        color_depth = struct.unpack_from("<H", data, 12)[0]
    except struct.error:
        return None
    if frame_count <= 0 or canvas_width <= 0 or canvas_height <= 0 or color_depth != 32:
        return None

    frame_offset = 128
    try:
        frame_size = struct.unpack_from("<I", data, frame_offset)[0]
        if struct.unpack_from("<H", data, frame_offset + 4)[0] != 0xF1FA:
            return None
        chunk_count = struct.unpack_from("<I", data, frame_offset + 12)[0] or struct.unpack_from("<H", data, frame_offset + 6)[0]
    except struct.error:
        return None

    frame_end = min(len(data), frame_offset + frame_size)
    chunk_offset = frame_offset + 16
    canvas = bytearray(canvas_width * canvas_height * 4)
    for _ in range(chunk_count):
        if chunk_offset + 6 > frame_end:
            break
        try:
            chunk_size = struct.unpack_from("<I", data, chunk_offset)[0]
            chunk_type = struct.unpack_from("<H", data, chunk_offset + 4)[0]
        except struct.error:
            break
        if chunk_size <= 0:
            break
        chunk_end = min(frame_end, chunk_offset + chunk_size)
        if chunk_type == 0x2005 and chunk_offset + 22 <= chunk_end:
            try:
                cel_x, cel_y = struct.unpack_from("<hh", data, chunk_offset + 8)
                opacity = data[chunk_offset + 12]
                cel_type = struct.unpack_from("<H", data, chunk_offset + 13)[0]
                payload_offset = chunk_offset + 22
                cel_width, cel_height = struct.unpack_from("<HH", data, payload_offset)
                pixel_offset = payload_offset + 4
                if cel_type == 0:
                    pixels = data[pixel_offset:chunk_end]
                elif cel_type == 2:
                    pixels = zlib.decompress(data[pixel_offset:chunk_end])
                else:
                    pixels = b""
            except (struct.error, zlib.error):
                pixels = b""
            expected = cel_width * cel_height * 4
            if len(pixels) >= expected:
                for y in range(cel_height):
                    dst_y = cel_y + y
                    if dst_y < 0 or dst_y >= canvas_height:
                        continue
                    for x in range(cel_width):
                        dst_x = cel_x + x
                        if dst_x < 0 or dst_x >= canvas_width:
                            continue
                        src_index = (y * cel_width + x) * 4
                        red, green, blue, alpha = pixels[src_index : src_index + 4]
                        alpha = (alpha * opacity + 127) // 255
                        dst_index = (dst_y * canvas_width + dst_x) * 4
                        alpha_blend_pixel(canvas, dst_index, red, green, blue, alpha)
        chunk_offset += chunk_size

    _crop_x, _crop_y, crop_width, crop_height, cropped = crop_alpha_bbox(canvas_width, canvas_height, canvas)
    uri = png_data_uri(crop_width, crop_height, cropped)
    if not uri:
        return None
    return {
        "sheet": uri,
        "sheetWidth": crop_width,
        "sheetHeight": crop_height,
        "frame": {"x": 0, "y": 0, "w": crop_width, "h": crop_height},
        "renderScale": 1.45 if crop_height >= 72 else 1.2,
    }


def external_asset_candidates(mod_root, source):
    if not source:
        return []
    source_text = str(source).replace("\\", "/").strip().rstrip("/")
    if not source_text:
        return []
    parts = [part for part in source_text.split("/") if part]
    candidates = []
    if len(parts) > 2 and parts[0] == "asset":
        candidates.append(Path(mod_root).joinpath(*parts[2:]))
    if len(parts) > 1:
        candidates.append(Path(mod_root).joinpath(*parts[1:]))
    candidates.append(Path(mod_root).joinpath(*parts))

    out = []
    seen = set()
    for candidate in candidates:
        key = str(candidate)
        if key in seen:
            continue
        seen.add(key)
        out.append(candidate)
    return out


def resolve_external_png(mod_root, source):
    for candidate in external_asset_candidates(mod_root, source):
        if candidate.suffix.lower() == ".png" and candidate.exists():
            return candidate
        png_path = Path(f"{candidate}.png")
        if png_path.exists():
            return png_path
    return None


def external_png_data_uri(mod_root, source, max_bytes=512 * 1024):
    path = resolve_external_png(mod_root, source)
    if not path:
        return None
    dimensions = png_dimensions(path)
    if not dimensions:
        return None
    try:
        data = path.read_bytes()
    except OSError:
        return None
    if len(data) > max_bytes:
        return None
    return {
        "src": "data:image/png;base64," + base64.b64encode(data).decode("ascii"),
        "width": dimensions[0],
        "height": dimensions[1],
    }


def resolve_external_sprite_base(mod_root, mod_id, source):
    if not source:
        return None
    source_text = str(source).replace("\\", "/").strip().rstrip("/")
    if source_text.endswith("#sheet.png"):
        source_text = source_text[: -len("#sheet.png")]
    if not source_text:
        return None

    for candidate in external_asset_candidates(mod_root, source_text):
        if Path(f"{candidate}#sheet.png").exists():
            return candidate
    return None


def load_external_idle_frame(anim_path):
    data = load_json_file(anim_path, {})
    anims = data.get("anims") if isinstance(data, dict) else {}
    if not isinstance(anims, dict):
        return None

    ordered_tags = ["idle", "stand", "run", "attack", "skill", "skill2", "ult", "dead"]
    for tag in ordered_tags:
        anim = anims.get(tag)
        frames = anim.get("frames") if isinstance(anim, dict) else None
        if frames:
            frame_data = (frames[0] or {}).get("data") if isinstance(frames[0], dict) else None
            if isinstance(frame_data, dict):
                return {
                    "x": int(float(frame_data.get("x") or 0)),
                    "y": int(float(frame_data.get("y") or 0)),
                    "w": max(1, int(float(frame_data.get("w") or 1))),
                    "h": max(1, int(float(frame_data.get("h") or 1))),
                }

    for anim in anims.values():
        frames = anim.get("frames") if isinstance(anim, dict) else None
        if not frames:
            continue
        frame_data = (frames[0] or {}).get("data") if isinstance(frames[0], dict) else None
        if isinstance(frame_data, dict):
            return {
                "x": int(float(frame_data.get("x") or 0)),
                "y": int(float(frame_data.get("y") or 0)),
                "w": max(1, int(float(frame_data.get("w") or 1))),
                "h": max(1, int(float(frame_data.get("h") or 1))),
            }
    return None


def external_champion_asset(data, mod_meta):
    source = data.get("sprite")
    asset = {"external": True, "source": source}
    mod_root = Path(mod_meta.get("path") or "")
    base_path = resolve_external_sprite_base(mod_root, mod_meta.get("modId"), source)
    if not base_path:
        for candidate in external_asset_candidates(mod_root, source):
            aseprite_path = candidate if candidate.suffix.lower() == ".aseprite" else Path(f"{candidate}.aseprite")
            if not aseprite_path.exists():
                continue
            aseprite_asset = aseprite_first_frame_png(aseprite_path)
            if aseprite_asset:
                asset.update(aseprite_asset)
            return asset
        return asset

    sheet_path = Path(f"{base_path}#sheet.png")
    anim_path = Path(f"{base_path}#anim.fanim")
    dimensions = png_dimensions(sheet_path)
    frame = load_external_idle_frame(anim_path)
    if not dimensions or not frame:
        return asset

    try:
        sheet_bytes = sheet_path.read_bytes()
    except OSError:
        return asset
    if len(sheet_bytes) > MAX_EXTERNAL_SPRITE_BYTES:
        return asset

    asset.update(
        {
            "sheet": "data:image/png;base64," + base64.b64encode(sheet_bytes).decode("ascii"),
            "sheetWidth": dimensions[0],
            "sheetHeight": dimensions[1],
            "frame": frame,
            "renderScale": 1.45 if frame["h"] >= 72 else 1.2,
        }
    )
    return asset


def map_entity_stats(raw):
    raw = raw or {}
    move_speed = stat_number(raw.get("move_speed"))
    out = {
        "attack": stat_number(raw.get("attack")) or 0,
        "magicPower": stat_number(raw.get("magic_power")) or 0,
        "hp": stat_number(raw.get("hp")) or 0,
        "defence": stat_number(raw.get("defence")) or 0,
        "magicResistance": stat_number(raw.get("magic_resistance")) or 0,
    }
    if move_speed is not None:
        out["moveSpeed"] = move_speed
        out["moveSpeedDisplay"] = round(move_speed * 0.06, 2)
    return out


def infer_role_fit(category, tags):
    normalized = {str(tag).lower() for tag in tags or []}
    category_key = str(category or "").lower()
    fit = {"top": 0.2, "jungle": 0.2, "mid": 0.2, "bot": 0.2, "support": 0.2}
    if "range" in normalized or category_key == "range":
        fit.update({"bot": 0.7, "mid": 0.35})
    if "ap" in normalized or "magic" in normalized or category_key == "magician":
        fit.update({"mid": 0.7, "support": 0.35})
    if "tank" in normalized or "melee" in normalized or category_key == "melee":
        fit.update({"top": 0.65, "jungle": 0.45})
    if "heal" in normalized or "shield" in normalized:
        fit["support"] = max(fit.get("support", 0), 0.7)
    return fit


def best_role_from_fit(role_fit):
    return max(role_fit.items(), key=lambda item: item[1])[0] if role_fit else "mid"


def clean_game_rich_text(text):
    text = str(text or "")
    if text.startswith("#asset/"):
        return ""
    text = re.sub(r"<i#[^>]*>", "", text)
    text = re.sub(r"<#[0-9a-fA-F]{6,8}>", "", text)
    text = text.replace("<>", "")
    text = re.sub(r"<[^>]*>", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def external_skill_payload(champion_id, key, action, translations, icon_source=None, mod_meta=None):
    action = action or {}
    description = clean_game_rich_text(translations.get(key) or action.get("description") or "")
    payload = {
        "id": key,
        "level": {"skill": 1, "skill2": 3, "ult": 5}.get(key, 1),
        "iconKey": f"{champion_id}_{key}",
        "cooltime": format_cooltime_ticks(action.get("cooltime")) or "-",
        "description": description,
    }
    if icon_source and mod_meta:
        icon = external_png_data_uri(Path(mod_meta.get("path") or ""), icon_source)
        if icon:
            payload["iconImage"] = icon["src"]
            payload["iconWidth"] = icon["width"]
            payload["iconHeight"] = icon["height"]
    return payload


def external_champion_payload(file_path, mod_meta, translations):
    data = load_json_file(file_path, {})
    if not isinstance(data, dict):
        return None
    champion_id = str(data.get("id") or Path(file_path).stem)
    text = translations.get(champion_id) or {}
    category = data.get("category") or "Unknown"
    raw_tags = [str(tag) for tag in (data.get("tags") or [])]
    tags = sorted({*raw_tags, str(category)})
    role_fit = infer_role_fit(category, tags)
    skill_icons = data.get("skill_icons") if isinstance(data.get("skill_icons"), list) else []
    return {
        "id": champion_id,
        "name": text.get("name") or champion_id,
        "category": category,
        "tags": tags,
        "rawTags": raw_tags,
        "description": {
            key: clean_game_rich_text(text.get(key) or (data.get(key) or {}).get("description") or "")
            for key in ["attack", "skill", "skill2", "ult"]
        },
        "stats": map_entity_stats(data.get("stat")),
        "growth": map_entity_stats(data.get("growth")),
        "skills": [
            external_skill_payload(
                champion_id,
                key,
                data.get(key),
                text,
                skill_icons[index] if index < len(skill_icons) else None,
                mod_meta,
            )
            for index, key in enumerate(["skill", "skill2", "ult"])
        ],
        "metrics": {},
        "roleFit": role_fit,
        "bestRole": best_role_from_fit(role_fit),
        "asset": external_champion_asset(data, mod_meta),
        "overall": None,
        "tier": "-",
        "modSource": {
            "type": mod_meta.get("sourceType") or "workshop",
            "sourceId": mod_meta.get("sourceId"),
            "workshopId": mod_meta.get("workshopId"),
            "modId": mod_meta.get("modId"),
            "modName": mod_meta.get("name"),
            "version": mod_meta.get("version"),
        },
    }


def load_active_external_champions(champions, game_root=ROOT):
    enabled_mod_ids = read_enabled_mod_ids(game_root)
    workshop_mods = discover_workshop_champion_mods(game_root)
    existing = {champ.get("id") for champ in champions}
    loaded_mods = []
    added = []
    for mod_id in enabled_mod_ids:
        mod_meta = workshop_mods.get(mod_id)
        if not mod_meta:
            continue
        translations = load_mod_champion_i18n(mod_meta["path"])
        mod_champions = []
        for champion_file in mod_meta["championFiles"]:
            champ = external_champion_payload(champion_file, mod_meta, translations)
            if not champ or champ["id"] in existing:
                continue
            champions.append(champ)
            existing.add(champ["id"])
            mod_champions.append(champ["id"])
            added.append(champ["id"])
        loaded_mods.append(
            {
                "modId": mod_id,
                "name": mod_meta.get("name"),
                "version": mod_meta.get("version"),
                "sourceType": mod_meta.get("sourceType") or "workshop",
                "sourceId": mod_meta.get("sourceId"),
                "workshopId": mod_meta.get("workshopId"),
                "champions": mod_champions,
            }
        )
    return {"mods": loaded_mods, "championIds": added}


def is_external_workshop_champion(champ):
    source = champ.get("modSource") if isinstance(champ, dict) else None
    return isinstance(source, dict) and source.get("type") in {"workshop", "local"}


def active_external_champion_ids(game_root=ROOT):
    enabled_mod_ids = read_enabled_mod_ids(game_root)
    workshop_mods = discover_workshop_champion_mods(game_root)
    active_ids = []
    for mod_id in enabled_mod_ids:
        mod_meta = workshop_mods.get(mod_id)
        if not mod_meta:
            continue
        for champion_file in mod_meta.get("championFiles") or []:
            data = load_json_file(champion_file, {})
            if not isinstance(data, dict):
                continue
            champion_id = str(data.get("id") or "").strip()
            if champion_id:
                active_ids.append(champion_id)
    return active_ids


def split_policy_champions_for_current_mods(champions, game_root=ROOT):
    active_external_ids_ordered = active_external_champion_ids(game_root)
    active_external = set(active_external_ids_ordered)
    enabled_mod_ids = set(read_enabled_mod_ids(game_root))
    workshop_mods = discover_workshop_champion_mods(game_root)
    base_champions = []
    external_by_id = {}
    inactive_external_ids = set()
    for champ in champions:
        champion_id = str(champ.get("id") or "").strip()
        if not champion_id:
            continue
        if is_external_workshop_champion(champ):
            external_by_id[champion_id] = champ
            if champion_id not in active_external:
                inactive_external_ids.add(champion_id)
        else:
            base_champions.append(champ)

    for mod_id, mod_meta in workshop_mods.items():
        for champion_file in mod_meta.get("championFiles") or []:
            data = load_json_file(champion_file, {})
            if not isinstance(data, dict):
                continue
            champion_id = str(data.get("id") or "").strip()
            if not champion_id or champion_id in external_by_id:
                continue
            external_by_id[champion_id] = {
                "id": champion_id,
                "name": champion_id,
                "modSource": {
                    "type": mod_meta.get("sourceType") or "workshop",
                    "sourceId": mod_meta.get("sourceId"),
                    "workshopId": mod_meta.get("workshopId"),
                    "modId": mod_id,
                    "modName": mod_meta.get("name"),
                    "version": mod_meta.get("version"),
                },
            }
            if mod_id not in enabled_mod_ids:
                inactive_external_ids.add(champion_id)

    active_external_champions = [
        external_by_id[champion_id]
        for champion_id in active_external_ids_ordered
        if champion_id in external_by_id
    ]
    for champ in base_champions:
        champion_id = str(champ.get("id") or "").strip()
        if champion_id in BASE_CANDIDATE_INDEX:
            champ["candidateIndex"] = BASE_CANDIDATE_INDEX[champion_id]
    for offset, champ in enumerate(active_external_champions):
        champ["candidateIndex"] = len(BASE_CANDIDATE_ORDER) + offset
    inactive_external_champions = [
        champ
        for champion_id, champ in external_by_id.items()
        if champion_id in inactive_external_ids
    ]
    champion_tier_champions = base_champions + active_external_champions + inactive_external_champions

    ai_champions = base_champions + active_external_champions

    return {
        "championTierChampions": champion_tier_champions,
        "aiChampions": ai_champions,
        "activeExternalIds": active_external,
        "inactiveExternalIds": inactive_external_ids,
        "activeExternalCount": len(active_external_champions),
        "inactiveExternalCount": len(inactive_external_champions),
    }


def resolve_policy_preset():
    env_preset = os.environ.get("TFM2_POLICY_PRESET")
    if env_preset:
        preset_id = env_preset.strip()
        if preset_id in POLICY_PRESET_IDS:
            return preset_id, "env"

    settings = load_policy_settings()
    mode = str(settings.get("addonPolicyPreset") or FOLLOW_DASHBOARD_POLICY).strip()
    dashboard_preset = str(settings.get("dashboardPreset") or "classic").strip()
    if mode == FOLLOW_DASHBOARD_POLICY:
        preset_id = dashboard_preset if dashboard_preset in POLICY_PRESET_IDS else "classic"
        return preset_id, "dashboard setting"
    if mode in POLICY_PRESET_IDS:
        return mode, "policy setting"
    return "classic", "default"


def first_existing(paths):
    for path in paths:
        if path.exists():
            return path
    return None


def load_item_translations():
    path = first_existing(ITEM_I18N_PATHS)
    if not path:
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}

    names = {}
    for lang in ["ko", "en"]:
        section = data.get(lang, {})
        for key, value in section.items():
            if isinstance(value, dict) and value.get("name") and key not in names:
                names[key] = value["name"]
    return names


def item_icon_asset_path(icon):
    if not icon:
        return None
    path = ITEM_ICON_DIR / f"{icon}.png"
    return f"assets/items/{icon}.png" if path.exists() else None


def load_item_catalog():
    path = first_existing(ITEM_SETTING_PATHS)
    if not path:
        return {"source": None, "byId": {}, "byIcon": {}}
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"source": str(path), "byId": {}, "byIcon": {}}

    names = load_item_translations()
    by_id = {}
    by_icon = {}
    item_index = 0
    for setting_id, row in raw.items():
        if setting_id == "mod_items" or not isinstance(row, dict):
            continue
        key = row.get("key") or setting_id
        icon = row.get("icon") or ""
        name = names.get(key) or names.get(setting_id) or str(key).replace("_", " ").title()
        direction = normalize_build_direction(row.get("category"))
        item = {
            "id": item_index,
            "settingId": setting_id,
            "key": key,
            "icon": icon,
            "iconPath": item_icon_asset_path(icon),
            "name": name,
            "tier": row.get("tier"),
            "category": row.get("category"),
            "direction": direction,
        }
        by_id[str(item_index)] = item
        if icon:
            by_icon[icon] = item
        item_index += 1
    return {"source": str(path), "byId": by_id, "byIcon": by_icon}


def normalize_build_direction(category):
    value = str(category or "").strip()
    if value in BUILD_DIRECTIONS:
        return value
    aliases = {
        "Defence": "Defense",
        "defense": "Defense",
        "defence": "Defense",
        "MR": "MagicResistance",
        "MagicResist": "MagicResistance",
        "HP": "Hp",
        "Health": "Hp",
        "AS": "AttackSpeed",
        "Attack_Speed": "AttackSpeed",
    }
    return aliases.get(value, "Auto")


def compact_item(item):
    if not item:
        return None
    return {
        key: item.get(key)
        for key in ["id", "key", "icon", "iconPath", "name", "category", "direction"]
        if item.get(key) is not None
    }


def fallback_item_from_id(item_id):
    try:
        number = int(item_id)
    except (TypeError, ValueError):
        return None
    if number < 0:
        return {"id": number, "key": str(number), "icon": str(number), "name": f"item #{number}", "direction": "Auto"}
    icon = f"t{number % 5 + 1}_{number // 5}"
    return {"id": number, "key": icon, "icon": icon, "name": icon, "direction": "Auto"}


def describe_item_ids(item_ids, item_catalog):
    by_id = (item_catalog or {}).get("byId", {})
    out = []
    for item_id in item_ids or []:
        item = compact_item(by_id.get(str(item_id))) or fallback_item_from_id(item_id)
        if item:
            out.append(item)
    return out


def describe_item_icons(icon_keys, item_catalog):
    by_icon = (item_catalog or {}).get("byIcon", {})
    out = []
    for icon in icon_keys or []:
        item = compact_item(by_icon.get(str(icon)))
        if item:
            out.append(item)
        elif icon:
            out.append({"key": icon, "icon": icon, "name": icon})
    return out


def with_item_order(items):
    return [{**item, "order": index + 1} for index, item in enumerate(items or [])]


def item_summary_key(item):
    if not isinstance(item, dict):
        return None
    if item.get("icon"):
        return str(item["icon"])
    if item.get("id") is not None:
        return f"id:{item['id']}"
    return item.get("key")


def item_from_summary_key(key, item_catalog):
    if not key:
        return None
    by_icon = (item_catalog or {}).get("byIcon", {})
    by_id = (item_catalog or {}).get("byId", {})
    if key in by_icon:
        return compact_item(by_icon[key])
    if str(key).startswith("id:"):
        item_id = str(key)[3:]
        return compact_item(by_id.get(item_id)) or fallback_item_from_id(item_id)
    return {"key": key, "icon": key if re.match(r"^t\d+_\d+$", str(key)) else None, "name": str(key), "direction": "Auto"}


def item_top_list(item_counts, item_catalog, limit=8):
    rows = []
    for key, count in Counter(item_counts or {}).most_common(limit):
        item = item_from_summary_key(key, item_catalog)
        if item:
            item["count"] = count
            rows.append(item)
    return rows


def item_build_signature(item):
    if not isinstance(item, dict):
        return None
    if item.get("id") is not None:
        return f"id:{item['id']}"
    if item.get("icon"):
        return f"icon:{item['icon']}"
    if item.get("key"):
        return f"key:{item['key']}"
    return None


def item_build_payload(item):
    if not isinstance(item, dict):
        return {}
    return {
        key: item.get(key)
        for key in ["id", "key", "icon", "iconPath", "name", "category", "direction"]
        if item.get(key) is not None
    }


def item_direction(item):
    if not isinstance(item, dict):
        return "Auto"
    return normalize_build_direction(item.get("direction") or item.get("category"))


def build_directions(items, slots=3):
    directions = [item_direction(item) for item in (items or [])[:slots]]
    while len(directions) < slots:
        directions.append("Auto")
    return directions


def core_item_catalog_payload(item_catalog):
    out = {}
    for item_id, item in sorted((item_catalog or {}).get("byId", {}).items(), key=lambda pair: int(pair[0])):
        out[str(item_id)] = item_build_payload(item)
    return out


def item_build_score(wins, games):
    games = int(games or 0)
    wins = int(wins or 0)
    if games <= 0:
        return 0.0
    # Wilson lower bound keeps one-off 100% builds below larger, reliable samples.
    z = 1.28
    phat = wins / games
    denom = 1 + z * z / games
    centre = phat + z * z / (2 * games)
    margin = z * math.sqrt((phat * (1 - phat) + z * z / (4 * games)) / games)
    return round(max(0, (centre - margin) / denom) * 100, 2)


def empty_core_item_builds(generated_at, save_path=None, patch_versions=None):
    return {
        "generatedAt": generated_at,
        "save": {"path": str(save_path) if save_path else None},
        "latestPatch": patch_versions[-1] if patch_versions else None,
        "rules": {
            "coreSizes": [2, 3],
            "directionSlots": 3,
            "directionValues": ["AD", "Magic", "AttackSpeed", "Defense", "MagicResistance", "Hp", "Auto"],
            "topPerGroup": 5,
            "score": "wilson_lower_bound_80pct",
            "recommendedMinGames": 5,
            "fallbackOrder": [
                "current patch + champion + position + 3 core",
                "current patch + champion + all positions + 3 core",
                "all patches + champion + all positions + 3 core",
                "2 core fallback",
            ],
        },
        "sources": {
            "tournamentMatches": 0,
            "itemKind": "saved_replay_items",
            "note": "Tournament MatchReplayAthlete.items are used as saved replay item/build slots. The save does not expose separate purchase timestamps.",
        },
        "itemCatalog": {},
        "builds": {"tournament": {}},
    }


def add_core_item_combo(groups, scope, patch, champion, position, core_size, items, won):
    patch_key = patch or "unknown"
    pos_key = position or "all"
    signatures = tuple(item_build_signature(item) for item in items[:core_size])
    if len(signatures) < core_size or any(not key for key in signatures):
        return
    item_payloads = tuple(tuple(sorted(item_build_payload(item).items())) for item in items[:core_size])
    for patch_bucket in [patch_key, "all"]:
        for position_bucket in [pos_key, "all"]:
            key = (scope, patch_bucket, champion, position_bucket, core_size, signatures)
            row = groups[key]
            row["games"] += 1
            row["wins"] += 1 if won else 0
            if not row["items"]:
                row["items"] = [dict(payload) for payload in item_payloads]


def compact_core_item_builds(groups, top_per_group=5):
    nested = {}
    grouped_rows = defaultdict(list)
    for (scope, patch, champion, position, core_size, signatures), row in groups.items():
        if row["games"] <= 0:
            continue
        wins = row["wins"]
        games = row["games"]
        grouped_rows[(scope, patch, champion, position, core_size)].append(
            {
                "itemKeys": list(signatures),
                "itemIds": [item.get("id") for item in row["items"] if item.get("id") is not None],
                "itemCategories": [item_direction(item) for item in row["items"]],
                "directions": build_directions(row["items"], 3),
                "games": games,
                "wins": wins,
                "winRate": round(wins / games * 100, 1) if games else None,
                "score": item_build_score(wins, games),
            }
        )

    for (scope, patch, champion, position, core_size), rows in grouped_rows.items():
        rows.sort(key=lambda row: (row["score"], row["games"], row["winRate"] or 0), reverse=True)
        scope_node = nested.setdefault(scope, {})
        patch_node = scope_node.setdefault(patch, {})
        champion_node = patch_node.setdefault(champion, {})
        position_node = champion_node.setdefault(position, {})
        position_node[f"core{core_size}"] = rows[:top_per_group]
    return nested


def build_core_item_builds(match_analysis, generated_at, save_path=None, patch_versions=None, item_catalog=None):
    payload = empty_core_item_builds(generated_at, save_path, patch_versions)
    payload["itemCatalog"] = core_item_catalog_payload(item_catalog)
    groups = defaultdict(lambda: {"games": 0, "wins": 0, "items": []})
    tournament_matches = 0
    for match in match_analysis or []:
        version = match.get("version") or "unknown"
        if match.get("source") == "tournament":
            tournament_matches += 1
        for side in ["blue", "red"]:
            team = match.get(side) or {}
            won = match.get("winner") == side
            for player in team.get("players") or []:
                champion = player.get("champion")
                if not champion:
                    continue
                items = [item for item in player.get("items") or [] if item]
                for core_size in [2, 3]:
                    if len(items) >= core_size:
                        add_core_item_combo(
                            groups,
                            match.get("source") or "tournament",
                            version,
                            champion,
                            player.get("position") or "all",
                            core_size,
                            items,
                            won,
                        )
    payload["sources"]["tournamentMatches"] = tournament_matches
    payload["builds"] = compact_core_item_builds(groups)
    return payload


def write_core_item_builds(core_item_builds):
    text = json.dumps(core_item_builds, ensure_ascii=True, separators=(",", ":")) + "\n"
    written = []
    for path in unique_paths([CORE_ITEM_BUILDS_OUT, CORE_ITEM_BUILDS_MOD_OUT, CORE_ITEM_BUILDS_MOD_DATA_OUT]):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        written.append(path)
    return written


def clamp_value(value, min_value, max_value):
    return min(max_value, max(min_value, value))


def round1(value):
    return round(value * 10) / 10


def policy_preset():
    preset_id, _source = resolve_policy_preset()
    return POLICY_PRESETS.get(preset_id, POLICY_PRESETS["classic"])


def policy_sample_volume(stats):
    rows = list((stats or {}).values())
    total_matches = max((row.get("totalMatch") or 0 for row in rows), default=0)
    total_picks = sum(row.get("pickCount") or 0 for row in rows)
    estimated_matches = total_picks / 10 if total_picks else 0
    return max(total_matches, estimated_matches)


def effective_policy_sample_info(stats, replay_date_status):
    explicit_min = os.environ.get("TFM2_POLICY_MIN_SAMPLE")
    if explicit_min and explicit_min.strip().isdigit():
        min_sample = max(1, int(explicit_min.strip()))
        return {"minSample": min_sample, "mode": "custom", "reason": "TFM2_POLICY_MIN_SAMPLE"}

    mode = os.environ.get("TFM2_POLICY_SAMPLE_MODE", "auto").strip()
    if mode == "early":
        return {"minSample": 5, "mode": "early", "reason": "manual"}
    if mode == "normal":
        return {"minSample": 10, "mode": "normal", "reason": "manual"}

    days = replay_date_status.get("daysSincePatch") if isinstance(replay_date_status, dict) else None
    try:
        days = None if days is None else float(days)
    except (TypeError, ValueError):
        days = None
    if days is not None and math.isfinite(days):
        return (
            {"minSample": 10, "mode": "normal", "reason": f"{days:g} days since patch"}
            if days >= 3
            else {"minSample": 5, "mode": "early", "reason": f"{days:g} days since patch"}
        )

    match_count = policy_sample_volume(stats)
    return (
        {"minSample": 10, "mode": "normal", "reason": f"{match_count:g} matches"}
        if match_count >= 100
        else {"minSample": 5, "mode": "early", "reason": f"{match_count:g} matches"}
    )


def finite_float(value, fallback=math.nan):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return fallback
    return number if math.isfinite(number) else fallback


def model_preset(score_model_spec, preset_id):
    presets = score_model_spec.get("presets") or {}
    return presets.get(preset_id) or presets.get("classic") or DEFAULT_SCORE_MODEL_SPEC["presets"]["classic"]


def beta_posterior(successes, trials, prior_mean, kappa, z):
    trials = max(0, int(trials or 0))
    successes = clamp_value(float(successes or 0), 0, trials)
    prior_mean = clamp_value(float(prior_mean), 0.001, 0.999)
    kappa = max(0.01, float(kappa or 0.01))
    alpha = successes + prior_mean * kappa
    beta = max(0.001, trials - successes) + (1 - prior_mean) * kappa
    total = alpha + beta
    mean = alpha / total
    sd = math.sqrt((alpha * beta) / ((total * total) * (total + 1)))
    lower = clamp_value(mean - z * sd, 0, 1)
    return {"mean": mean, "sd": sd, "lower": lower}


def beta_rate_mean(successes, trials, prior_mean, kappa):
    trials = max(0, int(trials or 0))
    successes = clamp_value(float(successes or 0), 0, trials)
    prior_mean = clamp_value(float(prior_mean), 0.001, 0.999)
    kappa = max(0.01, float(kappa or 0.01))
    return (successes + prior_mean * kappa) / (trials + kappa)


def kappa_bounds(score_model_spec, sample_info, role_scoped=False):
    groups = (score_model_spec.get("posterior") or {}).get("kappa") or {}
    key = "role" if role_scoped else sample_info.get("mode") or "normal"
    bounds = groups.get(key) or groups.get("normal") or [12, 80]
    return float(bounds[0]), float(bounds[1])


def estimate_win_prior(stats, sample_info, score_model_spec, role_scoped=False):
    rows = []
    total_wins = 0.0
    total_picks = 0.0
    for stat in (stats or {}).values():
        picks = int(stat.get("pickCount") or 0)
        wins = finite_float(stat.get("wins"), None)
        win_rate = finite_float(stat.get("winRate"), None)
        if picks <= 0:
            continue
        if wins is None and win_rate is not None:
            wins = picks * win_rate / 100
        if wins is None:
            continue
        wins = clamp_value(wins, 0, picks)
        total_wins += wins
        total_picks += picks
        rows.append({"picks": picks, "rate": wins / picks})

    fallback = float((score_model_spec.get("posterior") or {}).get("fallbackPriorMean") or 0.5)
    mean = total_wins / total_picks if total_picks else fallback
    mean = clamp_value(mean, 0.001, 0.999)
    low, high = kappa_bounds(score_model_spec, sample_info, role_scoped)
    if len(rows) < 2:
        return {"mean": mean, "kappa": max(low, min(high, 24.0))}

    observed_var = sum((row["rate"] - mean) ** 2 for row in rows) / max(1, len(rows) - 1)
    noise_var = sum(mean * (1 - mean) / max(1, row["picks"]) for row in rows) / len(rows)
    between_var = max(observed_var - noise_var, 0.0005)
    kappa = mean * (1 - mean) / between_var - 1
    return {"mean": mean, "kappa": clamp_value(kappa, low, high)}


def source_counter(stat, field):
    value = stat.get(field)
    return value if isinstance(value, dict) else {}


def estimate_source_baselines(stats, score_model_spec):
    totals = defaultdict(float)
    picks = defaultdict(float)
    bans = defaultdict(float)
    for stat in (stats or {}).values():
        match_counts = source_counter(stat, "sourceMatchCounts")
        pick_counts = source_counter(stat, "sourcePickCounts")
        ban_counts = source_counter(stat, "sourceBanCounts")
        for source, total in match_counts.items():
            total = finite_float(total, 0)
            if total <= 0:
                continue
            totals[source] += total
            picks[source] += finite_float(pick_counts.get(source), 0)
            bans[source] += finite_float(ban_counts.get(source), 0)

    baselines = {}
    for source, total in totals.items():
        pick_base = clamp_value(picks[source] / total, 0.001, 0.999)
        ban_base = clamp_value(bans[source] / total, 0.001, 0.999) if source != "solo" else None
        presence = pick_base if source == "solo" else 1 - (1 - pick_base) * (1 - (ban_base or 0))
        baselines[source] = {"pick": pick_base, "ban": ban_base, "presence": clamp_value(presence, 0.001, 0.999)}

    if not baselines:
        baselines["overall"] = {"pick": 0.1, "ban": 0.05, "presence": 0.145}
    total_weight = sum(totals.values()) or 1
    combined_presence = sum(
        baselines[source]["presence"] * (totals.get(source) or 0)
        for source in baselines
    ) / total_weight
    return {"bySource": baselines, "presence": clamp_value(combined_presence, 0.001, 0.999)}


def build_policy_score_context(stats, sample_info, score_model_spec):
    return {
        "winPrior": estimate_win_prior(stats, sample_info, score_model_spec),
        "exposure": estimate_source_baselines(stats, score_model_spec),
    }


def source_normalized_presence(stat, context, score_model_spec):
    rate_kappa = float((score_model_spec.get("posterior") or {}).get("ratePriorKappa") or 20)
    source_matches = source_counter(stat, "sourceMatchCounts")
    source_picks = source_counter(stat, "sourcePickCounts")
    source_bans = source_counter(stat, "sourceBanCounts")
    baselines = (context.get("exposure") or {}).get("bySource") or {}
    if source_matches:
        weighted = 0.0
        total_weight = 0.0
        no_ban_data = False
        for source, total in source_matches.items():
            total = finite_float(total, 0)
            if total <= 0:
                continue
            baseline = baselines.get(source) or baselines.get("overall") or {"pick": 0.1, "ban": 0.05}
            pick_post = beta_rate_mean(source_picks.get(source), total, baseline.get("pick") or 0.1, rate_kappa)
            if source == "solo":
                presence = pick_post
                no_ban_data = True
            else:
                ban_post = beta_rate_mean(source_bans.get(source), total, baseline.get("ban") or 0.05, rate_kappa)
                presence = 1 - (1 - pick_post) * (1 - ban_post)
            weighted += presence * total
            total_weight += total
        if total_weight:
            return {
                "presence": clamp_value(weighted / total_weight, 0, 1),
                "noBanData": no_ban_data and total_weight > 0,
            }

    pick_rate = clamp_value(finite_float(stat.get("pickRate"), 0) / 100, 0, 1)
    ban_rate_raw = finite_float(stat.get("banRate"), None)
    if ban_rate_raw is None:
        return {"presence": pick_rate, "noBanData": True}
    ban_rate = clamp_value(ban_rate_raw / 100, 0, 1)
    return {"presence": clamp_value(1 - (1 - pick_rate) * (1 - ban_rate), 0, 1), "noBanData": False}


def score_model_entry(stat, sample_info, preset_id, score_model_spec, context):
    sample = int(stat.get("pickCount") or 0)
    min_sample = int(sample_info.get("minSample") or 5)
    raw_win_rate = finite_float(stat.get("winRate"))
    if not math.isfinite(raw_win_rate) or sample < min_sample:
        reason = "missing win rate" if not math.isfinite(raw_win_rate) else f"sample {sample}/{min_sample}"
        return {
            "eligible": False,
            "tier": "-",
            "score": None,
            "metaLower": None,
            "strengthScore": None,
            "draftPressureScore": None,
            "policyTier": "No",
            "policyOverall": 50.0,
            "sample": sample,
            "minSample": min_sample,
            "reason": reason,
        }

    wins = finite_float(stat.get("wins"), sample * raw_win_rate / 100)
    win_prior = context.get("winPrior") or {"mean": 0.5, "kappa": 24}
    posterior_spec = score_model_spec.get("posterior") or {}
    posterior = beta_posterior(
        wins,
        sample,
        win_prior.get("mean", 0.5),
        win_prior.get("kappa", 24),
        posterior_spec.get("z", 0.84),
    )
    strength_spec = score_model_spec.get("strength") or {}
    strength_score = 100 * (
        float(strength_spec.get("meanWeight", 0.7)) * posterior["mean"]
        + float(strength_spec.get("lowerWeight", 0.3)) * posterior["lower"]
    )
    strength_lower = 100 * posterior["lower"]
    exposure = source_normalized_presence(stat, context, score_model_spec)
    baseline_presence = (context.get("exposure") or {}).get("presence") or 0.1
    pressure_spec = score_model_spec.get("pressure") or {}
    eps = float(pressure_spec.get("eps") or 0.001)
    scale = float(pressure_spec.get("scale") or 16)
    draft_pressure_score = clamp_value(
        50 + scale * math.log((exposure["presence"] + eps) / (baseline_presence + eps)),
        0,
        100,
    )
    preset = model_preset(score_model_spec, preset_id)
    score = (
        float(preset.get("metaStrengthWeight", 0.78)) * strength_score
        + float(preset.get("metaPressureWeight", 0.22)) * draft_pressure_score
    )
    meta_lower = (
        float(preset.get("lowerStrengthWeight", 0.82)) * strength_lower
        + float(preset.get("lowerPressureWeight", 0.18)) * draft_pressure_score
    )
    reliability = math.sqrt(sample / max(1, sample + min_sample * 2))
    return {
        "eligible": True,
        "tier": "4",
        "score": round1(clamp_value(score, 0, 100)),
        "metaLower": round1(clamp_value(meta_lower, 0, 100)),
        "strengthScore": round1(clamp_value(strength_score, 0, 100)),
        "strengthLower": round1(clamp_value(strength_lower, 0, 100)),
        "draftPressureScore": round1(draft_pressure_score),
        "presence": round1(exposure["presence"] * 100),
        "baselinePresence": round1(baseline_presence * 100),
        "reliability": round1(reliability * 100),
        "noBanData": exposure.get("noBanData", False),
        "policyTier": "D",
        "policyOverall": round1(clamp_value(score, 0, 100)),
        "sample": sample,
        "minSample": min_sample,
        "winRate": raw_win_rate,
        "posteriorMean": round1(posterior["mean"] * 100),
        "posteriorLower": round1(posterior["lower"] * 100),
        "posteriorSd": round1(posterior["sd"] * 100),
        "priorMean": round1((win_prior.get("mean") or 0.5) * 100),
        "priorKappa": round1(win_prior.get("kappa") or 0),
    }


def meta_tier_for_policy_rank(entry, index, total, score_model_spec=None):
    if not entry.get("eligible") or entry.get("metaLower") is None or not total:
        return "-"
    percentile = (index + 1) / total
    score = entry["metaLower"]
    for row in (score_model_spec or DEFAULT_SCORE_MODEL_SPEC).get("tiers", []):
        if score >= float(row.get("minLower") or 0) and percentile <= float(row.get("maxPercentile") or 1):
            return row.get("tier") or "4"
    return "4"


def tier_policy_overall(policy_tier, eligible=True):
    if not eligible:
        return None
    return TIER_POLICY_OVERALL_ANCHORS.get(policy_tier, 50.0)


def ai_policy_overall(entry):
    if not entry.get("eligible"):
        return 50.0
    policy_tier = entry.get("policyTier") or "C"
    base = AI_POLICY_OVERALL_ANCHORS.get(policy_tier, 50.0)
    score_delta = clamp_value((finite_float(entry.get("score"), 50.0) - 50.0) / 10.0, -1.0, 1.0) * 2.0
    lower_delta = clamp_value((finite_float(entry.get("metaLower"), 50.0) - 50.0) / 10.0, -1.0, 1.0)
    return round1(clamp_value(base + score_delta + lower_delta, 20.0, 80.0))


def select_policy_stats(default_stats, stats_by_patch, patch_versions, scope="overall"):
    requested = os.environ.get("TFM2_POLICY_PATCH", "latest").strip()
    requested_latest = requested in {"", "latest"}
    if requested_latest:
        patch = patch_versions[-1] if patch_versions else "all"
    else:
        patch = requested
    if patch != "all":
        patch_payload = stats_by_patch.get(patch)
        if isinstance(patch_payload, dict) and scope in patch_payload:
            return patch_payload.get(scope) or {}, patch, f"{scope} patch {patch}"
        if requested_latest and patch_versions:
            return {}, patch, f"{scope} patch {patch}"
    return default_stats, "all", f"{scope} all patches"


def build_policy_exports(
    champions,
    stats,
    generated_at,
    save_path,
    patch_key,
    source_label,
    replay_date_status,
    score_model_spec,
    scope="overall",
    cleanup_champion_ids=None,
):
    cleanup_champion_ids = set(cleanup_champion_ids or [])
    legacy_preset = policy_preset()
    preset_id = legacy_preset["label"]
    _resolved_preset, preset_source = resolve_policy_preset()
    preset = model_preset(score_model_spec, preset_id)
    sample_info = effective_policy_sample_info(stats, replay_date_status)
    context = build_policy_score_context(stats, sample_info, score_model_spec)
    entries = []
    assign_candidate_indexes(champions)
    for champ in champions:
        champion_id = champ["id"]
        stat = stats.get(champion_id, {})
        info = score_model_entry(stat, sample_info, preset_id, score_model_spec, context)
        if champion_id in cleanup_champion_ids:
            info = {
                **info,
                "eligible": False,
                "tier": "-",
                "reason": "inactive_external_champion_mod",
            }
        entry = {
            "championId": champion_id,
            "championName": champ.get("name") or champion_id,
            "candidateIndex": champ.get("candidateIndex"),
            "pickCount": int(stat.get("pickCount") or 0),
            "winRate": stat.get("winRate"),
            **info,
        }
        entries.append(entry)

    eligible = sorted(
        [entry for entry in entries if entry["eligible"]],
        key=lambda entry: (
            float(entry.get("metaLower") or -1),
            float(entry.get("score") or -1),
            float(entry.get("winRate") or -1),
            int(entry.get("pickCount") or 0),
            str(entry.get("championName") or ""),
        ),
        reverse=True,
    )
    for index, entry in enumerate(eligible):
        meta_tier = meta_tier_for_policy_rank(entry, index, len(eligible), score_model_spec)
        entry["tier"] = meta_tier
        entry["policyTier"] = POLICY_TIER_MAP.get(meta_tier, "C")
        entry["rank"] = index + 1
        entry["eligibleCount"] = len(eligible)

    rows = []
    for entry in entries:
        cleanup_row = entry["championId"] in cleanup_champion_ids
        if cleanup_row:
            continue
        policy_tier = "No" if cleanup_row else entry["policyTier"]
        tier_overall = tier_policy_overall(policy_tier, entry["eligible"])
        ai_overall = 50.0 if cleanup_row else ai_policy_overall(entry)
        rows.append(
            {
                "championId": entry["championId"],
                "championName": entry["championName"],
                "candidateIndex": entry.get("candidateIndex"),
                "tier": policy_tier,
                "aiTier": policy_tier if entry["eligible"] else "C",
                "tierOverall": round1(tier_overall) if tier_overall is not None else None,
                "aiOverall": round1(ai_overall),
                "rawOverall": round1(entry["policyOverall"] if entry["eligible"] else 50.0),
                "eligible": entry["eligible"],
                "metaTier": entry.get("tier") or "-",
                "score": entry.get("score"),
                "metaLower": entry.get("metaLower"),
                "strengthScore": entry.get("strengthScore"),
                "draftPressureScore": entry.get("draftPressureScore"),
                "presence": entry.get("presence"),
                "reliability": entry.get("reliability"),
                "pickCount": entry.get("pickCount"),
                "winRate": entry.get("winRate"),
                "reason": entry.get("reason"),
            }
        )
    rows.sort(
        key=lambda row: (
            row["eligible"],
            POLICY_TIER_SORT.get(row["tier"], 0),
            finite_float(row.get("score"), -1),
            finite_float(row.get("metaLower"), -1),
            str(row["championName"]),
        ),
        reverse=True,
    )
    metadata = {
        "generatedAt": generated_at,
        "save": str(save_path) if save_path else None,
        "source": source_label,
        "patch": patch_key,
        "scope": scope,
        "region": "all",
        "role": "all",
        "modelVersion": score_model_spec.get("modelVersion"),
        "preset": preset.get("label") or preset_id,
        "presetSource": preset_source,
        "weights": {
            "strength": preset.get("metaStrengthWeight"),
            "draftPressure": preset.get("metaPressureWeight"),
            "lowerStrength": preset.get("lowerStrengthWeight"),
            "lowerPressure": preset.get("lowerPressureWeight"),
        },
        "sample": sample_info,
        "sampleVolume": round1(policy_sample_volume(stats)),
        "winPrior": {
            "mean": round1((context.get("winPrior", {}).get("mean") or 0.5) * 100),
            "kappa": round1(context.get("winPrior", {}).get("kappa") or 0),
        },
        "baselinePresence": round1((context.get("exposure", {}).get("presence") or 0) * 100),
        "eligibleCount": len(eligible),
        "rowCount": len(rows),
        "activeRowCount": len(rows),
        "cleanupRowCount": len(cleanup_champion_ids),
        "policyProfiles": {
            "championTier": {
                "tierField": "tier",
                "overallField": "tierOverall",
                "semantic": "dashboard_meta_tier_for_in_game_sabcd_no",
                "anchors": TIER_POLICY_OVERALL_ANCHORS,
                "note": "overall is an S/A/B/C/D anchor for the native tier addon; No leaves overall blank and is applied as explicit NoTier for active champions.",
            },
            "aiChampion": {
                "tierField": "aiTier",
                "overallField": "aiOverall",
                "candidateIndexField": "candidateIndex",
                "semantic": "ai_bias_scaled_from_meta_tier",
                "anchors": AI_POLICY_OVERALL_ANCHORS,
                "nativeBiasFormula": "clamp((overall - 50) / 20, -1.5, 1.5)",
                "note": "overall is scaled for AI draft bias so the native addon has a visible but capped effect.",
            },
        },
    }
    return {"metadata": metadata, "rows": rows}


def render_policy_tsv(policy, profile_key):
    meta = policy["metadata"]
    profile = (meta.get("policyProfiles") or {}).get(profile_key) or {}
    gate = meta.get("gate") if isinstance(meta.get("gate"), dict) else {}
    tier_field = profile.get("tierField") or "tier"
    overall_field = profile.get("overallField") or "tierOverall"
    candidate_index_field = profile.get("candidateIndexField")
    native_bias_formula = profile.get("nativeBiasFormula") or "-"
    format_line = (
        "# Format: champion_id<TAB>tier<TAB>overall<TAB>candidate_index"
        if candidate_index_field
        else "# Format: champion_id<TAB>tier<TAB>overall"
    )
    header_line = (
        "# champion_id\ttier\toverall\tcandidate_index"
        if candidate_index_field
        else "# champion_id\ttier\toverall"
    )
    low_sample_note = (
        "# Non-eligible or low-sample champions are emitted as No with blank overall."
        if profile_key == "championTier"
        else "# Non-eligible or low-sample champions are emitted as neutral C/50.0."
    )
    lines = [
        "# AUTO_GENERATED_BY_TFM2_META_DASHBOARD",
        "# Do not hand-edit unless you intentionally want to override dashboard meta scoring.",
        f"# Generated: {meta['generatedAt']}",
        f"# Save: {meta.get('save') or '-'}",
        f"# Source: {meta.get('source')}",
        f"# Patch: {meta.get('patch')}",
        f"# Scope: {meta.get('scope')}",
        f"# Region: {meta.get('region')}",
        f"# Role: {meta.get('role')}",
        f"# Model: {meta.get('modelVersion')}",
        f"# Preset: {meta.get('preset')} weights={json.dumps(meta.get('weights'), sort_keys=True)}",
        f"# PolicyPresetSource: {meta.get('presetSource')}",
        f"# Sample: {meta.get('sample', {}).get('mode')} min={meta.get('sample', {}).get('minSample')} reason={meta.get('sample', {}).get('reason')}",
        f"# SampleVolume: {meta.get('sampleVolume')}",
        f"# PatchGate: mode={gate.get('mode') or '-'} decision={gate.get('decision') or '-'} source={gate.get('sourceKind') or '-'} mature={gate.get('mature')}",
        f"# RequestedPatch: {gate.get('requestedPatch') or meta.get('patch')}",
        f"# EffectivePatch: {gate.get('effectivePatch') or meta.get('patch')}",
        f"# HoldReason: {gate.get('reason') or '-'}",
        f"# GateMetrics: matches={gate.get('sampleVolume') or meta.get('sampleVolume')} min={gate.get('minMatches') or '-'} fallback={gate.get('fallbackMatches') or '-'} eligible={gate.get('eligibleCount') or meta.get('eligibleCount')}/{gate.get('activeRowCount') or meta.get('activeRowCount')} required={gate.get('requiredEligibleCount') or '-'}",
        f"# WinPrior: mean={meta.get('winPrior', {}).get('mean')} kappa={meta.get('winPrior', {}).get('kappa')}",
        f"# BaselinePresence: {meta.get('baselinePresence')}",
        f"# PolicyKind: {profile_key}",
        f"# OverallSemantic: {profile.get('semantic')}",
        f"# OverallNote: {profile.get('note')}",
        f"# OverallAnchors: {json.dumps(profile.get('anchors') or {}, sort_keys=True, ensure_ascii=False)}",
        f"# NativeBiasFormula: {native_bias_formula}",
        format_line,
        "# For No tier, overall is omitted and the native addon writes an explicit NoTier entry.",
        low_sample_note,
        header_line,
    ]
    for row in policy["rows"]:
        tier = row.get(tier_field) or row.get("tier") or "C"
        overall_value = row.get(overall_field)
        candidate_index = row.get(candidate_index_field) if candidate_index_field else None
        try:
            overall = float(overall_value)
        except (TypeError, ValueError):
            overall = None
        suffix = ""
        if candidate_index_field:
            try:
                suffix = f"\t{int(candidate_index)}"
            except (TypeError, ValueError):
                suffix = "\t"
        if overall is None or not math.isfinite(overall):
            lines.append(f"{row['championId']}\t{tier}{suffix}")
        else:
            lines.append(f"{row['championId']}\t{tier}\t{round1(overall):.1f}{suffix}")
    return "\n".join(lines) + "\n"


def policy_history_key(policy):
    meta = policy.get("metadata") or {}
    preset = str(meta.get("preset") or "classic")
    scope = str(meta.get("scope") or "tournament")
    return f"championTier|{scope}|{preset}"


def safe_file_part(value):
    text = str(value or "unknown")
    text = re.sub(r"[^A-Za-z0-9_.-]+", "_", text).strip("._")
    return text or "unknown"


def policy_gate_metrics(policy, settings=None):
    settings = settings or tier_policy_gate_settings()
    meta = policy.get("metadata") or {}
    rows = policy.get("rows") if isinstance(policy.get("rows"), list) else []
    sample_volume = finite_float(meta.get("sampleVolume"), 0)
    eligible_count = int(meta.get("eligibleCount") or 0)
    active_count = int(meta.get("activeRowCount") or 0)
    if eligible_count <= 0 and rows:
        eligible_count = sum(1 for row in rows if str(row.get("tier") or "No") != "No")
    if active_count <= 0:
        active_count = max(0, int(meta.get("rowCount") or 0) - int(meta.get("cleanupRowCount") or 0))
    if active_count <= 0 and rows:
        active_count = len(rows)
    eligible_ratio = eligible_count / active_count if active_count else 0
    required_eligible = math.ceil(active_count * float(settings.get("minEligibleRatio") or 0))
    min_matches = int(settings.get("minMatches") or DEFAULT_TIER_POLICY_GATE["minMatches"])
    fallback_matches = int(settings.get("fallbackMatches") or DEFAULT_TIER_POLICY_GATE["fallbackMatches"])
    coverage_ready = eligible_count >= required_eligible
    mature_by_matches_and_coverage = sample_volume >= min_matches and coverage_ready
    mature_by_fallback_coverage = sample_volume >= fallback_matches and coverage_ready
    mature = mature_by_matches_and_coverage or mature_by_fallback_coverage
    if mature_by_matches_and_coverage:
        reason = f"match_count {sample_volume:g}/{min_matches}, eligible {eligible_count}/{required_eligible}"
    elif mature_by_fallback_coverage:
        reason = f"coverage {sample_volume:g}/{fallback_matches}, eligible {eligible_count}/{required_eligible}"
    else:
        reason = f"sample {sample_volume:g}/{min_matches}, eligible {eligible_count}/{required_eligible}"
    return {
        "sampleVolume": round1(sample_volume),
        "eligibleCount": eligible_count,
        "activeRowCount": active_count,
        "eligibleRatio": round1(eligible_ratio * 100),
        "requiredEligibleCount": required_eligible,
        "minMatches": min_matches,
        "fallbackMatches": fallback_matches,
        "minEligibleRatio": round1(float(settings.get("minEligibleRatio") or 0) * 100),
        "coverageReady": coverage_ready,
        "matureByMatchesAndCoverage": mature_by_matches_and_coverage,
        "matureByFallbackCoverage": mature_by_fallback_coverage,
        "mature": mature,
        "reason": reason,
    }


def gate_metadata(settings, decision, reason, candidate_policy, effective_policy, source_kind, metrics=None):
    candidate_meta = candidate_policy.get("metadata") or {}
    effective_meta = effective_policy.get("metadata") or {}
    metrics = metrics or policy_gate_metrics(candidate_policy, settings)
    return {
        "mode": settings.get("mode"),
        "decision": decision,
        "sourceKind": source_kind,
        "reason": reason,
        "requestedPatch": candidate_meta.get("patch"),
        "requestedSource": candidate_meta.get("source"),
        "effectivePatch": effective_meta.get("patch"),
        "effectiveSource": effective_meta.get("source"),
        "sampleVolume": metrics.get("sampleVolume"),
        "eligibleCount": metrics.get("eligibleCount"),
        "activeRowCount": metrics.get("activeRowCount"),
        "eligibleRatio": metrics.get("eligibleRatio"),
        "requiredEligibleCount": metrics.get("requiredEligibleCount"),
        "minMatches": metrics.get("minMatches"),
        "fallbackMatches": metrics.get("fallbackMatches"),
        "minEligibleRatio": metrics.get("minEligibleRatio"),
        "mature": metrics.get("mature"),
    }


def copy_policy_with_gate(policy, gate):
    result = json.loads(json.dumps(policy, ensure_ascii=False))
    result.setdefault("metadata", {})["gate"] = gate
    return result


def load_policy_history_index():
    data = load_json_file(POLICY_HISTORY_INDEX, {})
    return data if isinstance(data, dict) else {}


def write_json_atomic(path: Path, payload):
    text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


def policy_export_relative(path: Path):
    try:
        return path.relative_to(POLICY_EXPORT_DIR).as_posix()
    except ValueError:
        return str(path)


def archive_stable_champion_tier_policy(policy):
    meta = policy.get("metadata") or {}
    patch = safe_file_part(meta.get("patch") or "all")
    preset = safe_file_part(meta.get("preset") or "classic")
    scope = safe_file_part(meta.get("scope") or "tournament")
    stem = f"champion_tier_policy.{scope}.{patch}.{preset}"
    json_path = POLICY_HISTORY_DIR / f"{stem}.json"
    tsv_path = POLICY_HISTORY_DIR / f"{stem}.tsv"
    archive_policy = json.loads(json.dumps(policy, ensure_ascii=False))
    archive_policy.setdefault("metadata", {})["archivedAt"] = datetime.now().isoformat(timespec="seconds")
    write_json_atomic(json_path, archive_policy)
    tsv_path.parent.mkdir(parents=True, exist_ok=True)
    tsv_path.write_text(render_policy_tsv(archive_policy, "championTier"), encoding="utf-8")

    index = load_policy_history_index()
    index.setdefault("version", 1)
    index.setdefault("championTier", {})[policy_history_key(policy)] = {
        "json": policy_export_relative(json_path),
        "tsv": policy_export_relative(tsv_path),
        "patch": meta.get("patch"),
        "source": meta.get("source"),
        "scope": meta.get("scope"),
        "preset": meta.get("preset"),
        "generatedAt": meta.get("generatedAt"),
        "archivedAt": archive_policy["metadata"]["archivedAt"],
    }
    write_json_atomic(POLICY_HISTORY_INDEX, index)


def load_last_stable_champion_tier_policy(candidate_policy):
    entry = (load_policy_history_index().get("championTier") or {}).get(policy_history_key(candidate_policy))
    if not isinstance(entry, dict):
        return None
    json_path = Path(entry.get("json") or "")
    if not json_path.is_absolute():
        json_path = POLICY_EXPORT_DIR / json_path
    policy = load_json_file(json_path, None)
    if isinstance(policy, dict) and isinstance(policy.get("rows"), list):
        return policy
    return None


def held_policy_is_usable(policy, settings):
    if not isinstance(policy, dict) or not isinstance(policy.get("rows"), list):
        return False
    return bool(policy_gate_metrics(policy, settings).get("mature"))


def load_existing_champion_tier_tsv(path: Path):
    if not path.exists():
        return None
    try:
        lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    except OSError:
        return None
    meta = {"source": f"existing {path.name}", "patch": "unknown", "scope": "tournament"}
    rows = []
    for line in lines:
        text = line.strip()
        if not text:
            continue
        if text.startswith("#"):
            if ":" in text:
                key, value = text[1:].split(":", 1)
                key = key.strip()
                value = value.strip()
                if key == "Source":
                    meta["source"] = value
                elif key == "Patch":
                    meta["patch"] = value
                elif key == "Scope":
                    meta["scope"] = value
                elif key == "Preset":
                    meta["preset"] = value.split()[0] if value else None
            continue
        parts = text.split("\t")
        if len(parts) < 2:
            continue
        tier = parts[1].strip() or "No"
        overall = None
        if len(parts) >= 3 and parts[2].strip():
            try:
                overall = float(parts[2])
            except ValueError:
                overall = None
        rows.append(
            {
                "championId": parts[0].strip(),
                "tier": tier,
                "tierOverall": overall,
                "eligible": tier != "No",
            }
        )
    if not rows:
        return None
    return {"metadata": meta, "rows": rows}


def reconcile_held_champion_tier_policy(current_policy, held_policy, reason, source_kind):
    current = json.loads(json.dumps(current_policy, ensure_ascii=False))
    held_meta = held_policy.get("metadata") or {}
    held_rows = {
        str(row.get("championId") or ""): row
        for row in held_policy.get("rows") or []
        if row.get("championId")
    }
    reconciled = []
    for row in current.get("rows") or []:
        champion_id = str(row.get("championId") or "")
        cleanup_row = row.get("reason") == "inactive_external_champion_mod_cleanup"
        held = held_rows.get(champion_id)
        next_row = dict(row)
        if cleanup_row:
            next_row.update({
                "tier": "No",
                "tierOverall": None,
                "eligible": False,
                "reason": "inactive_external_champion_mod_cleanup",
            })
        elif held:
            tier = str(held.get("tier") or "No")
            if tier not in POLICY_TIER_SORT:
                tier = "No"
            overall = held.get("tierOverall")
            if tier == "No":
                overall = None
            elif overall is None:
                overall = tier_policy_overall(tier, True)
            next_row.update({
                "tier": tier,
                "tierOverall": round1(overall) if overall is not None else None,
                "eligible": tier != "No",
                "reason": f"held_{source_kind}",
            })
        else:
            next_row.update({
                "tier": "No",
                "tierOverall": None,
                "eligible": False,
                "reason": "new_champion_without_stable_policy",
            })
        reconciled.append(next_row)
    current["rows"] = reconciled
    current.setdefault("metadata", {})["source"] = held_meta.get("source") or current["metadata"].get("source")
    current["metadata"]["patch"] = held_meta.get("patch") or current["metadata"].get("patch")
    current["metadata"]["scope"] = held_meta.get("scope") or current["metadata"].get("scope")
    if held_meta.get("preset"):
        current["metadata"]["preset"] = held_meta.get("preset")
    current["metadata"]["heldPolicyReason"] = reason
    current["metadata"]["heldPolicySourceKind"] = source_kind
    return current


def no_tier_wait_policy(policy, reason):
    current = json.loads(json.dumps(policy, ensure_ascii=False))
    rows = []
    for row in current.get("rows") or []:
        next_row = dict(row)
        if next_row.get("reason") == "inactive_external_champion_mod_cleanup":
            next_row["reason"] = "inactive_external_champion_mod_cleanup"
        else:
            next_row["reason"] = "sample_gate_waiting_for_tournament_data"
        next_row["tier"] = "No"
        next_row["tierOverall"] = None
        next_row["eligible"] = False
        rows.append(next_row)
    current["rows"] = rows
    current.setdefault("metadata", {})["eligibleCount"] = 0
    current["metadata"]["heldPolicyReason"] = reason
    current["metadata"]["heldPolicySourceKind"] = "candidate_no_sample"
    return current


def apply_champion_tier_policy_gate(candidate_policy, fallback_builder=None):
    settings = tier_policy_gate_settings()
    metrics = policy_gate_metrics(candidate_policy, settings)
    mode = settings.get("mode")
    fallback = fallback_builder() if fallback_builder else None
    fallback_metrics = policy_gate_metrics(fallback, settings) if fallback else None

    if mode == "immediate":
        decision = "apply_immediate"
        reason = "manual immediate mode"
        gated = copy_policy_with_gate(
            candidate_policy,
            gate_metadata(settings, decision, reason, candidate_policy, candidate_policy, "candidate", metrics),
        )
        if metrics.get("mature"):
            archive_stable_champion_tier_policy(gated)
        return gated

    if metrics.get("mature") and mode != "locked":
        decision = "apply_latest"
        reason = metrics.get("reason") or "latest policy is mature"
        gated = copy_policy_with_gate(
            candidate_policy,
            gate_metadata(settings, decision, reason, candidate_policy, candidate_policy, "candidate", metrics),
        )
        archive_stable_champion_tier_policy(gated)
        return gated

    hold_reason = metrics.get("reason") or "latest policy sample gate not met"

    if mode == "locked":
        existing = load_existing_champion_tier_tsv(CHAMPION_TIER_POLICY_OUT)
        if existing:
            effective = reconcile_held_champion_tier_policy(candidate_policy, existing, hold_reason, "locked_existing_tsv")
            decision = "locked_existing_tsv"
            return copy_policy_with_gate(
                effective,
                gate_metadata(settings, decision, hold_reason, candidate_policy, effective, "locked_existing_tsv", metrics),
            )
        decision = "locked_no_existing_policy"
        reason = f"{hold_reason}; no existing policy to keep"
        return copy_policy_with_gate(
            candidate_policy,
            gate_metadata(settings, decision, reason, candidate_policy, candidate_policy, "candidate_no_history", metrics),
        )

    if fallback and fallback_metrics and fallback_metrics.get("mature"):
        decision = "fallback_all_patches"
        reason = f"{hold_reason}; no previous stable patch policy"
        effective = copy_policy_with_gate(
            fallback,
            gate_metadata(settings, decision, reason, candidate_policy, fallback, "fallback_all_patches", metrics),
        )
        archive_stable_champion_tier_policy(effective)
        return effective

    decision = "awaiting_sample"
    reason = f"{hold_reason}; no mature tournament policy source exists"
    effective = no_tier_wait_policy(candidate_policy, reason)
    return copy_policy_with_gate(
        effective,
        gate_metadata(settings, decision, reason, candidate_policy, effective, "candidate_no_sample", metrics),
    )


def render_ai_candidate_map_tsv(policy):
    meta = policy["metadata"]
    active_external_count = int(meta.get("activeExternalChampionCount") or 0)
    expected_runtime_count = len(BASE_CANDIDATE_ORDER) + active_external_count
    mode = "conditional_custom" if active_external_count else "base_only"
    rows = []
    for row in policy.get("rows") or []:
        champion_id = str(row.get("championId") or "").strip()
        if not champion_id:
            continue
        try:
            candidate_index = int(row.get("candidateIndex"))
        except (TypeError, ValueError):
            continue
        base_index = BASE_CANDIDATE_INDEX.get(champion_id)
        if base_index is not None and base_index == candidate_index:
            source = "base"
            status = "verified_base"
        elif champion_id not in BASE_CANDIDATE_INDEX:
            source = "active_external"
            status = "conditional_external"
        else:
            source = "base"
            status = "rejected_index_mismatch"
        rows.append(
            {
                "candidateIndex": candidate_index,
                "championId": champion_id,
                "source": source,
                "status": status,
            }
        )
    rows.sort(key=lambda row: (row["candidateIndex"], row["championId"]))

    lines = [
        "# AUTO_GENERATED_BY_TFM2_META_DASHBOARD",
        "# Do not hand-edit unless you intentionally want to override dashboard AI draft mapping.",
        f"# Generated: {meta['generatedAt']}",
        f"# Source: {meta.get('source')}",
        f"# Patch: {meta.get('patch')}",
        f"# Scope: {meta.get('scope')}",
        f"# Preset: {meta.get('preset')}",
        "# MapKind: aiCandidateMap",
        f"# CustomCandidateMode: {mode}",
        f"# BaseCandidateCount: {len(BASE_CANDIDATE_ORDER)}",
        f"# ActiveExternalChampionCount: {active_external_count}",
        f"# ExpectedRuntimeChampionCount: {expected_runtime_count}",
        "# Verification: custom rows are applied only when runtime available_champions count matches ExpectedRuntimeChampionCount.",
        "# Verification: base rows must match the built-in 0..59 candidate order.",
        "# Format: candidate_index<TAB>champion_id<TAB>source<TAB>status",
        "# candidate_index\tchampion_id\tsource\tstatus",
    ]
    for row in rows:
        lines.append(
            f"{row['candidateIndex']}\t{row['championId']}\t{row['source']}\t{row['status']}"
        )
    return "\n".join(lines) + "\n"


def write_policy_file(text, paths, optional_paths=None):
    written = []
    skipped = []
    for path in unique_paths(paths):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        written.append(path)
    for path in unique_paths(optional_paths or []):
        if not path.parent.exists():
            skipped.append({"path": str(path), "reason": "parent missing"})
            continue
        try:
            path.write_text(text, encoding="utf-8")
            written.append(path)
        except OSError as exc:
            skipped.append({"path": str(path), "reason": str(exc)})
    return written, skipped


def write_text_atomic(path: Path, text: str, encoding="utf-8"):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_bytes(text.encode(encoding))
    tmp.replace(path)


def write_policy_exports(champion_tier_policy, ai_champion_policy=None):
    ai_champion_policy = ai_champion_policy or champion_tier_policy
    tier_text = render_policy_tsv(champion_tier_policy, "championTier")
    ai_text = render_policy_tsv(ai_champion_policy, "aiChampion")
    ai_candidate_map_text = render_ai_candidate_map_tsv(ai_champion_policy)
    game_root = detect_game_root_for_mods(ROOT)
    live_tier_policy_out = game_root / "mods" / "tfm2_meta_champion_tiers" / "champion_tier_policy.tsv"
    live_ai_policy_out = game_root / "mods" / "tfm2_ai_banpick_probe" / "ai_champion_policy.tsv"
    live_ai_candidate_map_out = game_root / "mods" / "tfm2_ai_banpick_probe" / "candidate_map.tsv"
    tier_written, tier_skipped = write_policy_file(
        tier_text,
        [CHAMPION_TIER_POLICY_OUT],
        [CHAMPION_TIER_POLICY_MOD_OUT, CHAMPION_TIER_POLICY_SOURCE_MOD_OUT, live_tier_policy_out],
    )
    ai_written, ai_skipped = write_policy_file(
        ai_text,
        [AI_CHAMPION_POLICY_OUT],
        [AI_CHAMPION_POLICY_MOD_OUT, AI_CHAMPION_POLICY_SOURCE_MOD_OUT, live_ai_policy_out],
    )
    candidate_map_written, candidate_map_skipped = write_policy_file(
        ai_candidate_map_text,
        [AI_CANDIDATE_MAP_OUT],
        [AI_CANDIDATE_MAP_MOD_OUT, AI_CANDIDATE_MAP_SOURCE_MOD_OUT, live_ai_candidate_map_out],
    )
    return {
        "championTierPolicy": {
            "written": [str(path) for path in tier_written],
            "skipped": tier_skipped,
        },
        "aiChampionPolicy": {
            "written": [str(path) for path in ai_written],
            "skipped": ai_skipped,
        },
        "aiCandidateMap": {
            "written": [str(path) for path in candidate_map_written],
            "skipped": candidate_map_skipped,
        },
    }


def unique_paths(paths):
    seen = set()
    out = []
    for path in paths:
        try:
            resolved = Path(path).expanduser().resolve()
        except OSError:
            continue
        key = str(resolved).lower()
        if key not in seen:
            seen.add(key)
            out.append(resolved)
    return out


def tfm2_data_roots():
    raw_roots = []
    if os.environ.get("TFM2_APPDATA"):
        raw_roots.append(Path(os.environ["TFM2_APPDATA"]))
    if os.environ.get("APPDATA"):
        raw_roots.append(Path(os.environ["APPDATA"]))
    if os.environ.get("USERPROFILE"):
        raw_roots.append(Path(os.environ["USERPROFILE"]) / "AppData" / "Roaming")
    raw_roots.append(Path.home() / "AppData" / "Roaming")

    candidates = []
    for root in unique_paths(raw_roots):
        if root.name.lower() == "teamfightmanager2":
            candidates.append(root)
        else:
            candidates.append(root / "TeamSamoyed" / "TeamfightManager2")
            candidates.append(root / "TeamSamoyed" / "Teamfight Manager2")
    return unique_paths(candidates)


APPDATA_ROOTS = tfm2_data_roots()
APPDATA = next((root for root in APPDATA_ROOTS if (root / "data").exists()), APPDATA_ROOTS[0])
SAVE_DIRS = [root / "data" for root in APPDATA_ROOTS]
DIAG_DIRS = [root / "diagnostics" for root in APPDATA_ROOTS]
DIAG_DIR = next((path for path in DIAG_DIRS if path.exists()), APPDATA / "diagnostics")
EXPLICIT_EXPORT_DIR = bool(os.environ.get("TFM2_META_EXPORT_DIR"))
if EXPLICIT_EXPORT_DIR:
    EXPORT_DIR = Path(os.environ["TFM2_META_EXPORT_DIR"]).expanduser().resolve()
else:
    EXPORT_DIR = next((path / "meta_export" for path in DIAG_DIRS if (path / "meta_export").exists()), DIAG_DIR / "meta_export")
SAVE_PROBE_SNAPSHOT_DIR = DASHBOARD / "data" / "save_probe_snapshot"


def looks_like_save(path: Path):
    if path.suffix.lower() != ".data":
        return False
    try:
        with path.open("rb") as f:
            tail = b""
            while True:
                chunk = f.read(1024 * 1024)
                if not chunk:
                    return False
                if b"\x1f\x8b\x08" in tail + chunk:
                    return True
                tail = chunk[-2:]
    except OSError:
        return False


def scan_save_dir(save_dir: Path):
    saves = []
    if not save_dir.exists():
        return saves
    direct = list(save_dir.glob("*.data"))
    recursive = [path for path in save_dir.rglob("*.data") if path.is_file() and path not in direct]
    for path in direct + recursive:
        if looks_like_save(path):
            saves.append(path)
    return saves


def resolve_manual_save_path(raw):
    if not raw:
        return None, []
    text = str(raw).strip().strip('"')
    if not text:
        return None, []
    path = Path(text).expanduser()
    if path.is_file():
        return path if looks_like_save(path) else None, [path]
    if path.is_dir():
        dirs = [path]
        if (path / "data").is_dir():
            dirs.insert(0, path / "data")
        saves = []
        for directory in dirs:
            saves.extend(scan_save_dir(directory))
        saves = sorted(set(saves), key=lambda p: p.stat().st_mtime, reverse=True)
        return (saves[0] if saves else None), dirs
    return None, [path]


def latest_save(manual_path=None):
    manual_save, manual_roots = resolve_manual_save_path(manual_path or os.environ.get("TFM2_SAVE_PATH"))
    if manual_save:
        return manual_save, manual_roots

    saves = []
    for save_dir in SAVE_DIRS:
        saves.extend(scan_save_dir(save_dir))
    saves = sorted(set(saves), key=lambda p: p.stat().st_mtime, reverse=True)
    return (saves[0] if saves else None), manual_roots


def decompress_save(path: Path):
    data = path.read_bytes()
    start = data.find(b"\x1f\x8b\x08")
    if start < 0:
        return b""
    return gzip.decompress(data[start:])


def readable_text(blob: bytes):
    chars = []
    for byte in blob:
        if 32 <= byte < 127:
            chars.append(chr(byte))
        else:
            chars.append("\t")
    return re.sub(r"\t+", "\t", "".join(chars))


def looks_like_team_name(token):
    token = (token or "").strip()
    if not 2 <= len(token) <= 64:
        return False
    if any(ch in token for ch in ":/#{}[]\\|"):
        return False
    if not re.search(r"[A-Za-z0-9가-힣]", token):
        return False
    lower = token.lower()
    blocked = [
        "asset",
        "custom_team_logo",
        "furniture",
        "wallpaper",
        "window",
        "partition",
        "chair",
        "desk",
        "plain_",
        "premium_",
        "clean_",
    ]
    return not any(word in lower for word in blocked)


ATHLETE_NAME_STOPWORDS = {
    "Position",
    "Champion",
    "PickCount",
    "WinRate",
    "ChampionStats",
    "Team",
    "Region",
    "Country",
    "League",
    "Season",
    "Year",
    "Month",
    "Day",
    "ContentId",
    "LocalizedName",
    "LocalizedDesc",
    "True",
    "False",
    "None",
    "Game",
    "Data",
    "Asset",
    "Player",
    "Coach",
    "Staff",
    "Ratio",
    "Rating",
    "Rank",
    "Score",
}


def looks_like_athlete_name(token):
    token = (token or "").strip()
    if not 2 <= len(token) <= 28:
        return False
    if token in ATHLETE_NAME_STOPWORDS:
        return False
    if any(ch in token for ch in ":/#{}[]\\|"):
        return False
    if not re.search(r"[A-Za-z가-힣]", token):
        return False
    lower = token.lower()
    blocked = [
        "asset",
        "custom_team_logo",
        "furniture",
        "wallpaper",
        "window",
        "partition",
        "chair",
        "desk",
        "plain_",
        "premium_",
        "clean_",
    ]
    if any(word in lower for word in blocked):
        return False
    if re.fullmatch(r"[A-Z]", token):
        return False
    if re.fullmatch(r"[a-z_]+", token) and len(token) > 10:
        return False
    return True


def extract_team_names_from_text(text):
    teams = {}
    for match in re.finditer(r"custom:custom_team_logo/(\d+)", text):
        prefix = text[max(0, match.start() - 240) : match.start()]
        tokens = [token.strip() for token in prefix.split("\t") if token.strip()]
        for token in reversed(tokens):
            if looks_like_team_name(token):
                teams[str(int(match.group(1)))] = token
                break
    return teams


def extract_athlete_names_from_text(text):
    # The save starts with global/team data and later stores athlete contract rows.
    # Scanning after the first megabyte avoids many non-player date fields.
    start_pos = min(1_000_000, len(text))
    tokens = [
        (match.group(0).strip(), start_pos + match.start())
        for match in re.finditer(r"[^\t]+", text[start_pos:])
    ]
    names = []
    for index, (token, _pos) in enumerate(tokens):
        if not re.fullmatch(r"20\d{2}-\d{2}-\d{2}", token):
            continue
        if index + 1 >= len(tokens) or tokens[index + 1][0] != "00:00:00":
            continue
        has_end_date = any(
            cursor < len(tokens) and re.fullmatch(r"20\d{2}-\d{2}-\d{2}", tokens[cursor][0])
            for cursor in range(index + 2, min(index + 8, len(tokens)))
        )
        if not has_end_date:
            continue
        candidates = []
        for cursor in range(max(0, index - 50), index):
            candidate = tokens[cursor][0]
            if looks_like_athlete_name(candidate):
                candidates.append(candidate)
        if candidates:
            name = candidates[-1]
            if not names or names[-1] != name:
                names.append(name)
    return {str(index): name for index, name in enumerate(names)}


def extract_save_lookup(blob):
    if not blob:
        return {"teams": {}, "athletes": {}}
    text = readable_text(blob)
    return {
        "teams": extract_team_names_from_text(text),
        "athletes": extract_athlete_names_from_text(text),
    }


def iter_struct_blocks_with_prefix(text, struct_name):
    search = f"{struct_name} {{"
    offset = 0
    while True:
        start = text.find(search, offset)
        if start < 0:
            break
        open_at = text.find("{", start)
        block, end = read_balanced(text, open_at)
        if not block:
            break
        yield block, text[max(0, start - 80) : start]
        offset = end + 1


def parse_debug_name_lookup(path: Path, struct_names, name_fields, validator):
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8", errors="ignore")
    out = {}
    for struct_name in struct_names:
        for block, prefix in iter_struct_blocks_with_prefix(text, struct_name):
            item_id = parse_first_int(block, "id")
            if item_id is None:
                key_match = re.search(r"(\d+)\s*:\s*$", prefix)
                if key_match:
                    item_id = int(key_match.group(1))
            if item_id is None:
                continue

            name = None
            for field in name_fields:
                name = parse_quoted_field(block, field)
                if name:
                    break
            if name and validator(name):
                out[str(item_id)] = name
    return out


def extract_exporter_lookup(export_dir: Path):
    return {
        "teams": parse_debug_name_lookup(
            export_dir / "teams.debug.txt",
            ["Team"],
            ["name", "team_name", "display_name", "localized_name"],
            looks_like_team_name,
        ),
        "athletes": parse_debug_name_lookup(
            export_dir / "athletes.debug.txt",
            ["Athlete"],
            ["name", "nickname", "nick_name", "display_name", "localized_name"],
            looks_like_athlete_name,
        ),
    }


def parse_debug_team_metadata(path: Path):
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8", errors="ignore")
    teams = {}
    for block, _prefix in iter_struct_blocks_with_prefix(text, "Team"):
        team_id = parse_first_int(block, "id")
        if team_id is None:
            continue
        league_keys = re.findall(r"#asset/base/text/ui\?league\.([A-Za-z0-9_]+)", block)
        league_key = Counter(league_keys).most_common(1)[0][0] if league_keys else None
        teams[team_id] = {
            "id": team_id,
            "name": parse_quoted_field(block, "name"),
            "leagueId": parse_first_int(block, "league_id"),
            "leagueKey": league_key,
        }
    return teams


def derive_league_key(league_id, league_key=None):
    if league_key:
        return league_key
    if league_id is None:
        return None
    base = LEAGUE_KEY_FALLBACKS[league_id % len(LEAGUE_KEY_FALLBACKS)]
    return f"{base}2" if league_id >= len(LEAGUE_KEY_FALLBACKS) else base


def league_context_from_key(league_id, league_key=None):
    resolved_key = derive_league_key(league_id, league_key)
    if not resolved_key:
        return {
            "leagueId": league_id,
            "leagueKey": None,
            "regionKey": None,
            "regionLabel": "지역 미확인",
            "division": None,
            "divisionLabel": "등급 미확인",
            "leagueLabel": f"리그 {league_id}" if league_id is not None else "리그 미확인",
        }
    division_match = re.fullmatch(r"(.+?)(2)?", resolved_key)
    region_key = division_match.group(1) if division_match else resolved_key.rstrip("2")
    division = 2 if resolved_key.endswith("2") else 1
    region_label = LEAGUE_REGION_LABELS.get(region_key, region_key.upper())
    division_label = f"{division}부"
    return {
        "leagueId": league_id,
        "leagueKey": resolved_key,
        "regionKey": region_key,
        "regionLabel": region_label,
        "division": division,
        "divisionLabel": division_label,
        "leagueLabel": f"{region_label} {division_label}",
    }


def region_context_from_id(region_id):
    if region_id is None:
        return {"regionId": None, "regionKey": None, "regionLabel": "region unknown"}
    if 0 <= region_id < len(LEAGUE_KEY_FALLBACKS):
        region_key = LEAGUE_KEY_FALLBACKS[region_id]
    else:
        region_key = f"region{region_id}"
    return {
        "regionId": region_id,
        "regionKey": region_key,
        "regionLabel": LEAGUE_REGION_LABELS.get(region_key, region_key.upper()),
    }


def build_league_meta(team_meta):
    league_keys = defaultdict(Counter)
    for team in team_meta.values():
        league_id = team.get("leagueId")
        league_key = team.get("leagueKey")
        if league_id is not None and league_key:
            league_keys[league_id][league_key] += 1

    meta = {}
    for league_id in sorted({team.get("leagueId") for team in team_meta.values() if team.get("leagueId") is not None}):
        league_key = league_keys[league_id].most_common(1)[0][0] if league_keys.get(league_id) else None
        meta[league_id] = league_context_from_key(league_id, league_key)
    return meta


def competition_kind_for_event(event):
    if event == "LeagueMatch":
        return "league_regular"
    if event == "LeaguePlayoff":
        return "league_playoff"
    if event in {"TournamentGroupMatch", "TournamentMatch"}:
        return "international"
    return "unknown"


def parse_enum_field(text, field):
    match = re.search(rf"\b{re.escape(field)}:\s*([A-Za-z0-9_]+)", text)
    return match.group(1) if match else None


def parse_datetime_field(text, field):
    match = re.search(rf"\b{re.escape(field)}:\s*(\d{{4}}-\d{{2}}-\d{{2}}T\d{{2}}:\d{{2}}:\d{{2}})", text)
    return match.group(1) if match else None


def date_key_from_datetime(value):
    if not value:
        return None
    match = re.match(r"^(\d{4}-\d{2}-\d{2})", str(value))
    return match.group(1) if match else None


def days_since_latest_patch(known_date, patch_events):
    if not known_date:
        return None, None
    patch_dates = [event["date"] for event in patch_events or [] if event.get("date") and event["date"] <= known_date]
    latest_patch = max(patch_dates) if patch_dates else None
    if not latest_patch:
        return None, None
    try:
        return latest_patch, (datetime.fromisoformat(known_date) - datetime.fromisoformat(latest_patch)).days
    except ValueError:
        return latest_patch, None


def parse_league_competition_types(path: Path):
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8", errors="ignore")
    competitions = {}
    for block, _prefix in iter_struct_blocks_with_prefix(text, "LeagueCompetition"):
        competition_id = parse_first_int(block, "id")
        league_type = parse_enum_field(block, "league_type")
        if competition_id is not None and league_type:
            competitions[competition_id] = league_type
    return competitions


def parse_year_schedule_metadata(path: Path):
    empty = {
        "leagueRegular": defaultdict(list),
        "leaguePlayoff": defaultdict(list),
        "tournamentGroup": [],
        "tournament": [],
        "patchEvents": [],
    }
    if not path.exists():
        return empty
    text = path.read_text(encoding="utf-8", errors="ignore")
    event_re = re.compile(r"\((\d{4}-\d{2}-\d{2}),\s*([A-Za-z]+)(?:\s*\{([^()]*)\})?\)")
    current_league_type = "Spring"
    for match in event_re.finditer(text):
        date, event, body = match.groups()
        body = body or ""
        if event == "LeagueScheduleCreate":
            current_league_type = parse_enum_field(body, "ty") or current_league_type
            continue
        if event in {"MinorPatch", "MajorPatch", "SeasonPatch"}:
            empty["patchEvents"].append({"date": date, "type": event})
            continue

        round_no = parse_first_int(body, "round")
        index_no = parse_first_int(body, "index")
        row = {
            "date": date,
            "dateKey": date,
            "round": round_no,
            "index": index_no,
            "event": event,
            "leagueType": current_league_type,
        }
        if event == "LeagueMatch":
            empty["leagueRegular"][current_league_type].append(row)
        elif event == "LeaguePlayoff":
            empty["leaguePlayoff"][current_league_type].append(row)
        elif event == "TournamentGroupMatch":
            empty["tournamentGroup"].append(row)
        elif event == "TournamentMatch":
            empty["tournament"].append(row)
    return empty


def parse_match_stats_for_date_inference(path: Path):
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8", errors="ignore")
    rows = []
    for block, _prefix in iter_struct_blocks_with_prefix(text, "MatchStat"):
        row_id = parse_first_int(block, "id")
        team0_id = parse_first_int(block, "team0_id")
        team1_id = parse_first_int(block, "team1_id")
        if row_id is None or team0_id is None or team1_id is None:
            continue
        rows.append(
            {
                "id": row_id,
                "team0Id": team0_id,
                "team1Id": team1_id,
                "version": parse_version(block),
            }
        )
    rows.sort(key=lambda row: row["id"])
    return rows


def series_key_for_match_stat(row):
    return tuple(sorted((row["team0Id"], row["team1Id"])))


def infer_replay_dates(export_dir: Path):
    status = {
        "enabled": False,
        "source": "match_stats + teams + year_schedules",
        "sets": 0,
        "tournamentSets": 0,
        "soloSets": 0,
        "series": 0,
        "assigned": 0,
        "tournamentAssigned": 0,
        "soloAssigned": 0,
        "unknown": 0,
        "latestKnownDate": None,
        "latestPatchDate": None,
        "daysSincePatch": None,
        "confidence": "none",
        "confidenceCounts": {},
        "assignedBySource": {},
        "patchEvents": [],
    }
    team_meta = parse_debug_team_metadata(export_dir / "teams.debug.txt")
    league_meta = build_league_meta(team_meta)
    match_stats = parse_match_stats_for_date_inference(export_dir / "match_stats.debug.txt")
    schedule = parse_year_schedule_metadata(export_dir / "year_schedules.debug.txt")
    competition_types = parse_league_competition_types(export_dir / "league_competitions.debug.txt")
    status["sets"] = len(match_stats)
    status["tournamentSets"] = len(match_stats)
    status["patchEvents"] = schedule["patchEvents"]
    if not team_meta or not match_stats or not schedule["leagueRegular"]:
        status["unknown"] = len(match_stats)
        return {}, status

    series = []
    current = None
    for row in match_stats:
        key = series_key_for_match_stat(row)
        team0 = team_meta.get(row["team0Id"], {})
        team1 = team_meta.get(row["team1Id"], {})
        league0 = team0.get("leagueId")
        league1 = team1.get("leagueId")
        league_id = league0 if league0 == league1 else None
        if current and current["key"] == key and current["leagueId"] == league_id:
            current["rows"].append(row)
            continue
        current = {"key": key, "leagueId": league_id, "rows": [row]}
        series.append(current)

    replay_dates = {}
    regular_ordinals = defaultdict(int)
    playoff_ordinals = defaultdict(int)
    tournament_ordinals = defaultdict(int)
    assigned = 0
    for series_index, item in enumerate(series):
        league_id = item["leagueId"]
        league_type = competition_types.get(league_id) or "Spring"
        schedule_row = None
        event_kind = "LeagueMatch"
        date_source = "league_schedule_inferred"
        date_confidence = "high"
        if league_id is not None:
            regular_schedule = schedule["leagueRegular"].get(league_type) or []
            playoff_schedule = schedule["leaguePlayoff"].get(league_type) or []
            regular_index = regular_ordinals[(league_id, league_type)]
            if regular_index < len(regular_schedule):
                schedule_row = regular_schedule[regular_index]
                regular_ordinals[(league_id, league_type)] += 1
            else:
                playoff_index = playoff_ordinals[(league_id, league_type)]
                if playoff_index < len(playoff_schedule):
                    schedule_row = playoff_schedule[playoff_index]
                    playoff_ordinals[(league_id, league_type)] += 1
                    event_kind = "LeaguePlayoff"
        else:
            tournament_schedule = (schedule["tournamentGroup"] or []) + (schedule["tournament"] or [])
            tournament_index = tournament_ordinals["international"]
            if tournament_index < len(tournament_schedule):
                schedule_row = tournament_schedule[tournament_index]
                tournament_ordinals["international"] += 1
                event_kind = schedule_row.get("event") or "TournamentMatch"
                date_source = "tournament_schedule_inferred"
                date_confidence = "medium"
        if not schedule_row:
            continue

        league_context = league_meta.get(league_id) or league_context_from_key(league_id)
        competition_kind = competition_kind_for_event(event_kind)
        for row in item["rows"]:
            replay_dates[row["id"]] = {
                "date": schedule_row["date"],
                "dateKey": schedule_row["dateKey"],
                "dateLabel": f"{schedule_row['date']} (일정 추정)",
                "dateSource": date_source,
                "dateConfidence": date_confidence,
                "leagueId": league_id,
                "leagueKey": league_context.get("leagueKey"),
                "regionKey": league_context.get("regionKey"),
                "regionLabel": league_context.get("regionLabel"),
                "division": league_context.get("division"),
                "divisionLabel": league_context.get("divisionLabel"),
                "leagueLabel": league_context.get("leagueLabel"),
                "leagueType": league_type,
                "leagueRound": schedule_row.get("round"),
                "leagueIndex": schedule_row.get("index"),
                "scheduleEvent": event_kind,
                "competitionKind": competition_kind,
                "seriesId": series_index,
            }
            assigned += 1

    known_dates = [row["date"] for row in replay_dates.values() if row.get("date")]
    latest_known = max(known_dates) if known_dates else None
    latest_patch, days_since_patch = days_since_latest_patch(latest_known, schedule["patchEvents"])
    confidence_counts = Counter(row.get("dateConfidence") or "none" for row in replay_dates.values())
    source_counts = Counter(row.get("dateSource") or "unknown" for row in replay_dates.values())

    status.update(
        {
            "enabled": bool(replay_dates),
            "series": len(series),
            "assigned": assigned,
            "tournamentSets": len(match_stats),
            "tournamentAssigned": assigned,
            "unknown": max(0, len(match_stats) - assigned),
            "latestKnownDate": latest_known,
            "latestPatchDate": latest_patch,
            "daysSincePatch": days_since_patch,
            "confidence": "high" if confidence_counts.get("high") else "medium" if assigned else "none",
            "confidenceCounts": dict(confidence_counts),
            "assignedBySource": dict(source_counts),
        }
    )
    return replay_dates, status


def merge_solo_replay_date_status(status, solo_matches):
    merged = dict(status or {})
    solo_matches = solo_matches or []
    solo_total = len(solo_matches)
    solo_assigned = sum(1 for row in solo_matches if row.get("dateConfidence") == "exported")
    tournament_sets = int(merged.get("tournamentSets") or merged.get("sets") or 0)
    tournament_assigned = int(merged.get("tournamentAssigned") or merged.get("assigned") or 0)
    confidence_counts = Counter(merged.get("confidenceCounts") or {})
    source_counts = Counter(merged.get("assignedBySource") or {})
    for row in solo_matches:
        if row.get("dateConfidence"):
            confidence_counts[row.get("dateConfidence") or "none"] += 1
        if row.get("dateSource") and row.get("dateSource") != "unknown":
            source_counts[row.get("dateSource")] += 1

    known_dates = [
        value
        for value in [merged.get("latestKnownDate")]
        + [row.get("date") or row.get("dateKey") for row in solo_matches]
        if value and value != "unknown"
    ]
    latest_known = max(known_dates) if known_dates else merged.get("latestKnownDate")
    latest_patch, days_since_patch = days_since_latest_patch(latest_known, merged.get("patchEvents") or [])
    merged.update(
        {
            "enabled": bool(tournament_assigned or solo_assigned),
            "source": "match_stats + teams + year_schedules + solo_rank_matches",
            "sets": tournament_sets + solo_total,
            "tournamentSets": tournament_sets,
            "soloSets": solo_total,
            "assigned": tournament_assigned + solo_assigned,
            "tournamentAssigned": tournament_assigned,
            "soloAssigned": solo_assigned,
            "unknown": max(0, (tournament_sets - tournament_assigned) + (solo_total - solo_assigned)),
            "latestKnownDate": latest_known,
            "latestPatchDate": latest_patch,
            "daysSincePatch": days_since_patch,
            "confidence": "exported"
            if confidence_counts.get("exported")
            else "high"
            if confidence_counts.get("high")
            else "medium"
            if confidence_counts.get("medium")
            else "none",
            "confidenceCounts": dict(confidence_counts),
            "assignedBySource": dict(source_counts),
        }
    )
    return merged


def extract_news_champion_stats(blob: bytes, champion_ids):
    text = readable_text(blob)
    champ = "|".join(sorted(map(re.escape, champion_ids), key=len, reverse=True))
    pattern = re.compile(
        rf"Position\t(?P<position>[a-z_]+)\tChampion\t(?P<champion>{champ})\t"
        rf"PickCount\t(?P<pick>\d+)\tWinRate\t(?P<rate>\d+)\t"
        rf"ChampionStats\t(?P=champion)\|(?P<games>\d+)\|(?P<wins>\d+)\|(?P<rate2>\d+)"
    )
    seen = set()
    rows = []
    for match in pattern.finditer(text):
        row = {
            "position": match.group("position"),
            "champion": match.group("champion"),
            "pickCount": int(match.group("games")),
            "wins": int(match.group("wins")),
            "winRate": int(match.group("rate2")),
            "source": "save_news_meta_report",
        }
        key = tuple(row.items())
        if key not in seen:
            seen.add(key)
            rows.append(row)
    return rows


def valid_token(raw: bytes):
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        return None
    if not text:
        return None
    if all(32 <= ord(ch) < 127 for ch in text):
        return text
    return None


def scan_length_prefixed_tokens(blob: bytes, champion_ids):
    champion_ids = set(champion_ids)
    tokens = []
    i = 0
    end = len(blob) - 8
    while i <= end:
        length = struct.unpack_from("<Q", blob, i)[0]
        if 1 <= length <= 64 and i + 8 + length <= len(blob):
            token = valid_token(blob[i + 8 : i + 8 + length])
            if token and (token in champion_ids or DATE_VERSION_RE.match(token)):
                tokens.append((i, token))
                i += 8 + length
                continue
        i += 1
    return tokens


def extract_draft_like_groups(blob: bytes, champion_ids):
    tokens = scan_length_prefixed_tokens(blob, champion_ids)
    champion_ids = set(champion_ids)
    groups = []
    for idx, (offset, token) in enumerate(tokens):
        if not DATE_VERSION_RE.match(token):
            continue
        group = []
        last_end = offset + 8 + len(token)
        for next_offset, next_token in tokens[idx + 1 : idx + 20]:
            if DATE_VERSION_RE.match(next_token):
                break
            if next_token not in champion_ids:
                continue
            if next_offset - last_end > 96:
                break
            group.append(next_token)
            last_end = next_offset + 8 + len(next_token)
            if len(group) >= 10:
                break
        if len(group) >= 5:
            groups.append(group)

    mentions = Counter()
    pairs = defaultdict(Counter)
    for group in groups:
        unique = list(dict.fromkeys(group))
        for champ in unique:
            mentions[champ] += 1
        for champ in unique:
            for other in unique:
                if champ != other:
                    pairs[champ][other] += 1

    return {
        "groups": len(groups),
        "mentions": dict(mentions),
        "pairs": {
            champ: [
                {"champion": other, "count": count}
                for other, count in counter.most_common(8)
            ]
            for champ, counter in pairs.items()
        },
    }


def parse_champion_stats_block(text, champion_ids, total_match, source_version=None):
    parsed = {}

    def balanced_block(start):
        open_at = text.find("{", start)
        block, _ = read_balanced(text, open_at)
        return block

    def balanced_sub_block(body, start):
        open_at = body.find("{", start)
        block, _ = read_balanced(body, open_at)
        return block

    for champ in champion_ids:
        marker = f'"{champ}": ChampionSeasonStatistics'
        pos = text.find(marker)
        if pos < 0:
            continue
        body = balanced_block(pos)
        if not body:
            continue

        ban = parse_first_int(body, "bans")
        totals = Counter()
        by_position = {}
        for position_match in re.finditer(r"\b(Top|Jungle|Mid|Bottom|Support):\s+ChampionStatistics\s+\{", body):
            position = normalize_position(position_match.group(1))
            block = balanced_sub_block(body, position_match.start())
            if not block:
                continue
            row = {
                "wins": parse_first_int(block, "wins") or 0,
                "matches": parse_first_int(block, "matches") or 0,
                "dealing": parse_first_int(block, "dealing") or 0,
                "tanking": parse_first_int(block, "tanking") or 0,
                "healing": parse_first_int(block, "healing") or 0,
                "kills": parse_first_int(block, "kills") or 0,
                "deaths": parse_first_int(block, "deaths") or 0,
                "cs": parse_first_int(block, "cs") or 0,
                "gold": parse_first_int(block, "gold") or 0,
                "dealingLinePhase": parse_first_int(block, "dealing_line_phase") or 0,
                "tankingLinePhase": parse_first_int(block, "tanking_line_phase") or 0,
                "healingLinePhase": parse_first_int(block, "healing_line_phase") or 0,
                "goldLinePhase": parse_first_int(block, "gold_line_phase") or 0,
                "csLinePhase": parse_first_int(block, "cs_line_phase") or 0,
            }
            by_position[position] = row
            for key, value in row.items():
                totals[key] += value

        matches = totals["matches"]
        wins = totals["wins"]
        if matches or ban is not None:
            parsed[champ] = {
                "pickCount": matches,
                "banCount": ban,
                "wins": wins,
                "losses": max(0, matches - wins),
                "dealt": totals["dealing"],
                "taken": totals["tanking"],
                "healing": totals["healing"],
                "kills": totals["kills"],
                "deaths": totals["deaths"],
                "cs": totals["cs"],
                "gold": totals["gold"],
                "linePhase": {
                    "dealt": totals["dealingLinePhase"],
                    "taken": totals["tankingLinePhase"],
                    "healing": totals["healingLinePhase"],
                    "gold": totals["goldLinePhase"],
                    "cs": totals["csLinePhase"],
                },
                "byPosition": by_position,
                "totalMatch": total_match,
                "version": source_version,
                "source": "meta_exporter_debug",
            }
    return parsed


def parse_debug_champion_stats_versions(path: Path, champion_ids):
    if not path.exists():
        return {}, {}
    text = path.read_text(encoding="utf-8", errors="ignore")
    by_version = {}
    for match in re.finditer(r'"([^"]+)":\s+ChampionPatchStatistics\s+\{', text):
        version = match.group(1)
        open_at = text.find("{", match.start())
        body, _ = read_balanced(text, open_at)
        if not body:
            continue
        by_version[version] = parse_champion_stats_block(
            body,
            champion_ids,
            parse_first_int(body, "total_match") or 0,
            version,
        )
    if by_version:
        latest_version = sorted(by_version.keys(), key=version_sort_key)[-1]
        return by_version[latest_version], by_version
    total_match = parse_first_int(text, "total_match") or 0
    return parse_champion_stats_block(text, champion_ids, total_match), {}


def parse_debug_champion_stats(path: Path, champion_ids):
    latest, _ = parse_debug_champion_stats_versions(path, champion_ids)
    return latest


def parse_first_int(text, field):
    match = re.search(rf"\b{re.escape(field)}:\s*(-?\d+)", text)
    return int(match.group(1)) if match else None


def printable_tokens(blob):
    text = "".join(chr(x) if 32 <= x < 127 else " " for x in blob)
    return re.findall(r"[A-Za-z0-9_./:#?%+-]+", text)


def parse_num(token):
    token = token.strip().rstrip("%")
    try:
        return float(token)
    except ValueError:
        return None


def parse_debug_scalar(raw):
    value = str(raw or "").strip().rstrip(",")
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1]
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    if re.fullmatch(r"-?\d+\.\d+", value):
        return float(value)
    return value


def find_matching_brace(text, open_index):
    depth = 0
    in_string = False
    escaped = False
    for index in range(open_index, len(text)):
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
                return index
    return None


def extract_debug_struct_block(text, pattern):
    match = re.search(pattern, text, flags=re.MULTILINE)
    if not match:
        return None
    open_index = text.find("{", match.start())
    if open_index < 0:
        return None
    close_index = find_matching_brace(text, open_index)
    if close_index is None:
        return None
    return text[open_index : close_index + 1]


def extract_champion_debug_block(text, champion_id):
    return extract_debug_struct_block(
        text,
        rf"^\s*{re.escape(champion_id)}:\s+\w+ChampionInfo\s*\{{",
    )


def extract_debug_field_block(block, field):
    return extract_debug_struct_block(
        block,
        rf"^\s*{re.escape(field)}:\s+\w+\s*\{{",
    )


def parse_debug_struct_values(block):
    if not block:
        return {}
    values = {}
    depth = 0
    for line in block.splitlines():
        match = re.match(r"^\s*([A-Za-z_][A-Za-z0-9_]*):\s*([^,\n]+),?", line)
        if depth == 1 and match:
            raw_value = match.group(2).strip()
            if "{" not in raw_value and "[" not in raw_value:
                values[match.group(1)] = parse_debug_scalar(raw_value)
        depth += line.count("{")
        depth -= line.count("}")
    return values


def normalize_champion_debug_actions(raw_actions):
    actions = dict(raw_actions)
    if "skill1" in raw_actions:
        actions["skill"] = raw_actions["skill1"]
        if "skill2" in raw_actions:
            actions["skill2"] = raw_actions["skill2"]
        elif "skill" in raw_actions:
            actions["skill2"] = raw_actions["skill"]
    return actions


def load_champion_debug_values(path, champion_ids):
    if not path.exists():
        return {}
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return {}

    out = {}
    for champion_id in champion_ids:
        block = extract_champion_debug_block(text, champion_id)
        if not block:
            continue
        raw_actions = {}
        for field in ["attack", "skill", "skill1", "skill2", "ult"]:
            action_block = extract_debug_field_block(block, field)
            if action_block:
                raw_actions[field] = parse_debug_struct_values(action_block)
        out[champion_id] = {
            "stats": parse_debug_struct_values(extract_debug_field_block(block, "stat")),
            "growth": parse_debug_struct_values(extract_debug_field_block(block, "growth")),
            "actions": normalize_champion_debug_actions(raw_actions),
            "rawActions": raw_actions,
        }
    return out


def parse_champion_candidate_order(path, champion_ids):
    """Return game candidate order from save_probe ChampionInfoSheet when exported."""
    if not path or not Path(path).exists():
        return []
    champion_set = set(champion_ids or [])
    if not champion_set:
        return []
    try:
        text = Path(path).read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []

    order = []
    seen = set()
    field_re = re.compile(r"^    ([A-Za-z_][A-Za-z0-9_]*):\s+[A-Za-z0-9_]+ChampionInfo\s*\{")
    for line in text.splitlines():
        match = field_re.match(line)
        if not match:
            continue
        champion_id = match.group(1)
        if champion_id in champion_set and champion_id not in seen:
            seen.add(champion_id)
            order.append(champion_id)
    return order


def assign_candidate_indexes(champions, candidate_order=None):
    """Attach draft candidate indexes used by the native AI draft hook policy TSV."""
    if not champions:
        return {}

    index_map = {}
    for index, champion_id in enumerate(candidate_order or []):
        if champion_id not in index_map:
            index_map[champion_id] = index
    if candidate_order is None:
        for champ in champions:
            champion_id = champ.get("id")
            try:
                candidate_index = int(champ.get("candidateIndex"))
            except (TypeError, ValueError):
                continue
            if champion_id and champion_id not in index_map:
                index_map[champion_id] = candidate_index
    for champion_id, index in BASE_CANDIDATE_INDEX.items():
        index_map.setdefault(champion_id, index)

    next_index = max(index_map.values(), default=-1) + 1
    for champ in champions:
        champion_id = champ.get("id")
        if not champion_id:
            continue
        candidate_index = index_map.get(champion_id)
        if candidate_index is None:
            candidate_index = next_index
            next_index += 1
            index_map[champion_id] = candidate_index
        champ["candidateIndex"] = int(candidate_index)
    return index_map


def stat_number(value):
    if isinstance(value, (int, float)):
        return value
    parsed = parse_num(str(value))
    return parsed if parsed is not None else None


def format_compact_number(value, max_digits=2):
    number = stat_number(value)
    if number is None:
        return str(value)
    if abs(number - round(number)) < 1e-9:
        return str(int(round(number)))
    return f"{number:.{max_digits}f}".rstrip("0").rstrip(".")


def format_cooltime_ticks(ticks):
    number = stat_number(ticks)
    if number is None:
        return None
    return format_compact_number(number / 60.0, 2)


def camel_to_snake(name):
    text = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", str(name))
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", text)
    return text.strip("_").lower()


def format_time_ticks(ticks):
    number = stat_number(ticks)
    if number is None:
        return None
    return f"{number / 60.0:.2f}"


def placeholder_value_from_action(name, action):
    if not action:
        return None, None
    key = camel_to_snake(name)
    candidates = [key, f"{key}_value", f"{key}_amount", f"{key}_ratio", f"{key}_coef"]
    for candidate in candidates:
        if candidate in action:
            return candidate, action[candidate]

    if key == "time":
        time_keys = [
            item
            for item in action
            if item != "duration" and (item.endswith("_duration") or item.endswith("_time"))
        ]
        if len(time_keys) == 1:
            return time_keys[0], action[time_keys[0]]
    return None, None


def format_placeholder_value(name, action_key, value):
    number = stat_number(value)
    if number is None:
        return None
    key = action_key or ""
    if key.endswith("_duration") or key.endswith("_time") or camel_to_snake(name) in {"time", "tick"}:
        return format_time_ticks(number)
    return format_compact_number(number)


def apply_action_placeholders_to_description(description, current_action):
    if not description or not current_action:
        return description

    def replace(match):
        name = match.group(1)
        action_key, value = placeholder_value_from_action(name, current_action)
        if action_key is None:
            return match.group(0)
        formatted = format_placeholder_value(name, action_key, value)
        return formatted if formatted is not None else match.group(0)

    return re.sub(r"\{([A-Za-z][A-Za-z0-9_]*)\}", replace, description)


def replace_value_text(text, old_value, new_value, suffix=""):
    old_number = stat_number(old_value)
    new_number = stat_number(new_value)
    if old_number is None or new_number is None:
        return text
    old_text = format_compact_number(old_number) + suffix
    new_text = format_compact_number(new_number) + suffix
    if old_text == new_text or old_text not in text:
        return text
    return text.replace(old_text, new_text, 1)


def apply_action_values_to_description(description, base_action, current_action):
    if not description or not base_action or not current_action:
        return description
    text = description
    for key, old_value in base_action.items():
        if key not in current_action:
            continue
        new_value = current_action[key]
        if stat_number(old_value) is None or stat_number(new_value) is None:
            continue
        if abs(float(stat_number(old_value)) - float(stat_number(new_value))) < 1e-9:
            continue
        if key.endswith("_ratio") or key in {"attack_ratio", "magic_ratio", "heal_ratio", "shield_ratio", "slow"}:
            next_text = replace_value_text(text, old_value, new_value, "%")
            if next_text != text:
                text = next_text
                continue
        text = replace_value_text(text, old_value, new_value)
    return apply_action_placeholders_to_description(text, current_action)


def apply_current_champion_info(champions, current_info, base_info):
    if not current_info:
        return 0
    by_id = {champ.get("id"): champ for champ in champions}
    updated = 0
    stat_map = {
        "attack": "attack",
        "magic_power": "magicPower",
        "hp": "hp",
        "defence": "defence",
        "magic_resistance": "magicResistance",
        "move_speed": "moveSpeed",
    }
    skill_id_map = {"skill": "skill", "skill2": "skill2", "ult": "ult"}
    for champion_id, current in current_info.items():
        champ = by_id.get(champion_id)
        if not champ:
            continue

        stats = champ.setdefault("stats", {})
        for raw_key, out_key in stat_map.items():
            value = stat_number(current.get("stats", {}).get(raw_key))
            if value is not None:
                stats[out_key] = value
                if raw_key == "move_speed":
                    stats["moveSpeedDisplay"] = round(value * 0.06, 2)

        growth = champ.setdefault("growth", {})
        for raw_key, out_key in stat_map.items():
            value = stat_number(current.get("growth", {}).get(raw_key))
            if value is not None:
                if raw_key == "move_speed":
                    growth["moveSpeedDisplay"] = round(value * 0.06, 2)
                else:
                    growth[out_key] = value

        current_actions = current.get("actions", {})
        base_actions = (base_info.get(champion_id) or {}).get("actions", {}) if base_info else {}
        skill_by_id = {skill.get("id"): skill for skill in champ.get("skills", [])}
        for action_key, skill_id in skill_id_map.items():
            skill = skill_by_id.get(skill_id)
            action = current_actions.get(action_key, {})
            if not skill or not action:
                continue
            cooltime = format_cooltime_ticks(action.get("cooltime"))
            if cooltime is not None:
                skill["cooltime"] = cooltime
            skill["description"] = apply_action_values_to_description(
                skill.get("description", ""),
                base_actions.get(action_key, {}),
                action,
            )

        champ["currentInfoSource"] = "save_probe_champion_info"
        updated += 1
    return updated


def pct_change(old, new):
    if old is None or new is None or abs(old) < 1e-9:
        return 0.0
    return round((new / old - 1.0) * 100.0, 2)


def add_patch_delta(patches, champ, field, delta):
    if champ is None or abs(delta) < 0.01:
        return
    patches.setdefault(champ, {})
    patches[champ][field] = round(patches[champ].get(field, 0.0) + delta, 2)


def field_from_patch_asset(asset_key):
    key = asset_key.split("?", 1)[-1]
    if key == "stat.attack":
        return "attack", 1.0
    if key == "stat.magic_power":
        return "magicPower", 1.0
    if key == "stat.hp":
        return "hp", 1.0
    if key == "stat.defence":
        return "defence", 1.0
    if key == "stat.magic_resistance":
        return "magicResistance", 1.0
    if key == "stat.move_speed":
        return "moveSpeed", 1.0
    if key == "stat.attack_speed":
        return "cooldown", -1.0
    if key in {"patch_key.attack_coef", "patch_key.ap_coef", "patch_key.damage"}:
        return "damage", 1.0
    if key in {"patch_key.growth_attack", "patch_key.growth_magic_power"}:
        return "damage", 0.45
    if key == "patch_key.growth_hp":
        return "hp", 0.45
    if key == "patch_key.growth_defence":
        return "defence", 0.45
    if key == "patch_key.growth_magic_resistance":
        return "magicResistance", 0.45
    if key == "patch_key.cooltime":
        return "cooldown", 1.0
    if key in {"stat.range", "patch_key.hit_box", "patch_key.move_range"}:
        return "range", 1.0
    if key in {
        "patch_key.stun",
        "patch_key.airbone",
        "patch_key.bind",
        "patch_key.slow_time",
        "patch_key.slow_ratio",
        "patch_key.shield",
        "patch_key.heal",
        "patch_key.buff_time",
    }:
        return "utility", 1.0
    return None, 0.0


def extract_patch_blocks(payload):
    blocks = []
    stop_markers = [
        b"#asset/base/text/news?patch.title",
        b"#asset/base/text/news?solo_rank_report.title",
        b"#asset/base/text/news?article.",
    ]
    for match in re.finditer(rb"20\d\d\.\d+\.\d+", payload):
        start = max(0, match.start() - 80)
        end = min(len(payload), match.start() + 10000)
        for marker in stop_markers:
            marker_index = payload.find(marker, match.start() + 20, end)
            if marker_index != -1:
                end = min(end, marker_index)
        block = payload[start:end]
        if b"#asset/base/text/champion?" in block:
            blocks.append((match.group(0).decode("ascii"), match.start(), block))
    return blocks


def parse_patch_block(block, champion_ids, version=None, offset=None):
    tokens = printable_tokens(block)
    patches = {}
    changes = []
    current_champ = None
    i = 0
    champion_id_set = set(champion_ids)
    while i < len(tokens):
        token = tokens[i]
        if token in champion_id_set:
            current_champ = token
            i += 1
            continue
        if token.startswith("#asset/base/text/champion?"):
            field, weight = field_from_patch_asset(token)
            j = i + 1
            target_tokens = []
            while j < len(tokens) and parse_num(tokens[j]) is None:
                if tokens[j] in champion_id_set or tokens[j].startswith("#asset/"):
                    break
                target_tokens.append(tokens[j])
                j += 1
            if j + 1 < len(tokens):
                old = parse_num(tokens[j])
                new = parse_num(tokens[j + 1])
                if old is not None and new is not None and field:
                    target = next(
                        (
                            item
                            for item in target_tokens
                            if item in {"base_attack", "skill", "skill1", "skill2", "ult"}
                        ),
                        None,
                    )
                    delta = pct_change(old, new) * weight
                    add_patch_delta(patches, current_champ, field, delta)
                    changes.append(
                        {
                            "version": version,
                            "versionOffset": offset,
                            "champion": current_champ,
                            "asset": token.split("?", 1)[-1],
                            "target": target,
                            "field": field,
                            "old": old,
                            "new": new,
                            "delta": round(delta, 2),
                        }
                    )
                    i = j + 2
                    continue
        i += 1
    return patches, changes


def merge_patch_dicts(dicts):
    merged = {}
    for patch in dicts:
        for champ, fields in patch.items():
            for field, value in fields.items():
                add_patch_delta(merged, champ, field, value)
    return merged


def extract_current_patch_summary(payload, champion_ids, save_path):
    parsed = []
    parsed_by_version = {}
    all_changes = []
    changes_by_version = defaultdict(list)
    versions = []
    for version, offset, block in extract_patch_blocks(payload):
        patches, changes = parse_patch_block(block, champion_ids, version, offset)
        if changes:
            parsed.append(patches)
            parsed_by_version.setdefault(version, []).append(patches)
            all_changes.extend(changes)
            changes_by_version[version].extend(changes)
            versions.append({"version": version, "offset": offset, "changes": len(changes)})
    return {
        "meta": {
            "source": str(save_path) if save_path else None,
            "versions": versions,
            "changeCount": len(all_changes),
        },
        "patches": merge_patch_dicts(parsed),
        "patchesByVersion": {
            version: merge_patch_dicts(rows)
            for version, rows in parsed_by_version.items()
        },
        "changes": all_changes,
        "changesByVersion": dict(changes_by_version),
    }


def read_balanced(text, open_index, open_char="{", close_char="}"):
    if open_index < 0 or open_index >= len(text) or text[open_index] != open_char:
        return "", -1
    depth = 0
    for idx in range(open_index, len(text)):
        char = text[idx]
        if char == open_char:
            depth += 1
        elif char == close_char:
            depth -= 1
            if depth == 0:
                return text[open_index : idx + 1], idx
    return "", -1


def extract_named_array(body, name):
    marker = f"{name}: ["
    start = body.find(marker)
    if start < 0:
        return ""
    open_at = body.find("[", start)
    block, _ = read_balanced(body, open_at, "[", "]")
    return block[1:-1] if block else ""


def extract_named_struct(body, name, struct_name):
    marker = f"{name}: {struct_name} {{"
    start = body.find(marker)
    if start < 0:
        return ""
    open_at = body.find("{", start)
    block, _ = read_balanced(body, open_at)
    return block if block else ""


def parse_int_array(body, field):
    match = re.search(rf"\b{re.escape(field)}:\s*\[([^\]]*)\]", body)
    if not match:
        return []
    return [int(value) for value in re.findall(r"-?\d+", match.group(1))]


def parse_quoted_array(body, field):
    match = re.search(rf"\b{re.escape(field)}:\s*\[([^\]]*)\]", body)
    if not match:
        return []
    return re.findall(r'"([^"]+)"', match.group(1))


def split_struct_blocks(text, struct_name):
    blocks = []
    search = f"{struct_name} {{"
    offset = 0
    while True:
        start = text.find(search, offset)
        if start < 0:
            break
        open_at = text.find("{", start)
        block, end = read_balanced(text, open_at)
        if not block:
            break
        blocks.append(block)
        offset = end + 1
    return blocks


def parse_bool(body, field):
    match = re.search(rf"\b{re.escape(field)}:\s*(true|false)", body)
    return match.group(1) == "true" if match else None


def parse_quoted_field(body, field):
    match = re.search(rf"\b{re.escape(field)}:\s*\"([^\"]+)\"", body)
    return match.group(1) if match else None


def parse_version(body):
    return parse_quoted_field(body, "version") or "unknown"


def normalize_position(position):
    if not position:
        return None
    value = position.lower()
    return "bot" if value == "bottom" else value


def parse_position_enum(body):
    match = re.search(r"\bposition:\s*(Top|Jungle|Mid|Bottom|Support)", body)
    return normalize_position(match.group(1)) if match else None


def parse_position_from_stats(body):
    scores = {}
    for pos in POSITION_NAMES:
        value = parse_first_int(body, POSITION_FIELD_NAMES[pos])
        scores[pos] = value if value is not None else 0
    best, score = max(scores.items(), key=lambda item: item[1])
    return best if score > 0 else None


def blank_stat():
    return {
        "pickCount": 0,
        "banCount": 0,
        "wins": 0,
        "losses": 0,
        "dealt": 0,
        "taken": 0,
        "healing": 0,
        "kills": 0,
        "deaths": 0,
        "assists": 0,
        "cs": 0,
        "gold": 0,
        "rating": 0,
        "level": 0,
        "itemCounts": Counter(),
        "byPosition": defaultdict(lambda: Counter()),
        "linePhase": Counter(),
        "source": "not_collected",
    }


def add_player_stat(stats, champion, won, player, source):
    row = stats[champion]
    row["pickCount"] += 1
    row["wins"] += 1 if won else 0
    row["losses"] += 0 if won else 1
    row["kills"] += player.get("kills", 0)
    row["deaths"] += player.get("deaths", 0)
    row["assists"] += player.get("assists", 0)
    row["cs"] += player.get("cs", 0)
    row["dealt"] += player.get("dealt", 0)
    row["taken"] += player.get("taken", 0)
    row["healing"] += player.get("healing", 0)
    row["rating"] += player.get("rating", 0)
    row["level"] += player.get("level", 0)
    for item in player.get("items", []):
        key = item_summary_key(item)
        if key:
            row["itemCounts"][key] += 1
    if player.get("position"):
        pos = row["byPosition"][player["position"]]
        pos["matches"] += 1
        pos["wins"] += 1 if won else 0
        pos["dealing"] += player.get("dealt", 0)
        pos["tanking"] += player.get("taken", 0)
        pos["healing"] += player.get("healing", 0)
        pos["kills"] += player.get("kills", 0)
        pos["deaths"] += player.get("deaths", 0)
        pos["assists"] += player.get("assists", 0)
        pos["cs"] += player.get("cs", 0)
        pos["rating"] += player.get("rating", 0)
        pos["level"] += player.get("level", 0)
    row["source"] = source


def finalize_aggregated_stats(stats, total_match, source, item_catalog=None):
    finalized = {}
    source_key = "solo" if "solo" in str(source).lower() else "tournament"
    for champion, row in stats.items():
        matches = row["pickCount"]
        wins = row["wins"]
        losses = row["losses"]
        bans = row.get("banCount", 0)
        out = {
            "pickCount": matches,
            "banCount": bans,
            "wins": wins,
            "losses": losses,
            "winRate": round(wins / matches * 100, 1) if matches else None,
            "pickRate": round(matches / total_match * 100, 1) if total_match else None,
            "banRate": None if source_key == "solo" else round(bans / total_match * 100, 1) if total_match else None,
            "banPickRate": round(matches / total_match * 100, 1)
            if source_key == "solo" and total_match
            else round((matches + bans) / total_match * 100, 1)
            if total_match
            else None,
            "dealt": row["dealt"],
            "taken": row["taken"],
            "healing": row["healing"],
            "kills": row["kills"],
            "deaths": row["deaths"],
            "assists": row["assists"],
            "cs": row["cs"],
            "gold": row["gold"],
            "rating": row["rating"],
            "level": row["level"],
            "itemCounts": dict(row["itemCounts"]) if row.get("itemCounts") else None,
            "topItems": item_top_list(row.get("itemCounts"), item_catalog),
            "linePhase": dict(row["linePhase"]) if row["linePhase"] else None,
            "byPosition": {pos: dict(values) for pos, values in row["byPosition"].items()},
            "totalMatch": total_match,
            "pickOpportunities": total_match,
            "banOpportunities": None if source_key == "solo" else total_match,
            "sourceMatchCounts": {source_key: total_match},
            "sourcePickCounts": {source_key: matches},
            "sourceBanCounts": {source_key: 0 if source_key == "solo" else bans},
            "source": source,
            "confidence": "exported",
        }
        finalized[champion] = out
    return finalized


def parse_solo_rank_stats(path: Path, champion_ids, item_catalog=None):
    empty_splits = {
        "stats": {"region": {}},
        "statsByPatch": {"region": {}},
        "relationships": {"region": {}},
        "relationshipsByPatch": {"region": {}},
        "laneSynergies": {"region": {}},
        "laneSynergiesByPatch": {"region": {}},
        "counts": {"region": {}, "regionByPatch": {}},
    }
    if not path.exists():
        return {}, {"groups": 0, "pairs": {}, "counters": {}}, {}, {}, empty_lane_synergy_payload(), {}, empty_splits
    text = path.read_text(encoding="utf-8", errors="ignore")
    champion_ids = set(champion_ids)
    stats = defaultdict(blank_stat)
    stats_by_version = defaultdict(lambda: defaultdict(blank_stat))
    stats_by_region = defaultdict(lambda: defaultdict(blank_stat))
    stats_by_version_region = defaultdict(lambda: defaultdict(lambda: defaultdict(blank_stat)))
    relations = RelationAccumulator()
    relations_by_version = defaultdict(RelationAccumulator)
    relations_by_region = defaultdict(RelationAccumulator)
    relations_by_version_region = defaultdict(lambda: defaultdict(RelationAccumulator))
    lane_synergies = LanePairAccumulator()
    lane_synergies_by_version = defaultdict(LanePairAccumulator)
    lane_synergies_by_region = defaultdict(LanePairAccumulator)
    lane_synergies_by_version_region = defaultdict(lambda: defaultdict(LanePairAccumulator))
    total_matches = 0
    total_matches_by_version = Counter()
    total_matches_by_region = Counter()
    total_matches_by_version_region = defaultdict(Counter)

    offset = 0
    while True:
        start = text.find("SoloRankMatch {", offset)
        if start < 0:
            break
        open_at = text.find("{", start)
        block, end = read_balanced(text, open_at)
        if not block:
            break
        offset = end + 1
        if "played: true" not in block:
            continue
        blue_win = parse_bool(block, "blue_team_win")
        if blue_win is None:
            continue
        blue_players = parse_solo_team(extract_named_array(block, "blue_team"), champion_ids, item_catalog)
        red_players = parse_solo_team(extract_named_array(block, "red_team"), champion_ids, item_catalog)
        if not blue_players or not red_players:
            continue
        version = parse_version(block)
        region = region_context_from_id(parse_first_int(block, "region_id"))
        region_key = region.get("regionKey")
        total_matches += 1
        total_matches_by_version[version] += 1
        if region_key:
            total_matches_by_region[region_key] += 1
            total_matches_by_version_region[version][region_key] += 1
        for player in blue_players:
            add_player_stat(stats, player["champion"], blue_win, player, "solo_rank_export")
            add_player_stat(stats_by_version[version], player["champion"], blue_win, player, "solo_rank_export")
            if region_key:
                add_player_stat(stats_by_region[region_key], player["champion"], blue_win, player, "solo_rank_region_split")
                add_player_stat(stats_by_version_region[version][region_key], player["champion"], blue_win, player, "solo_rank_region_split")
        for player in red_players:
            add_player_stat(stats, player["champion"], not blue_win, player, "solo_rank_export")
            add_player_stat(stats_by_version[version], player["champion"], not blue_win, player, "solo_rank_export")
            if region_key:
                add_player_stat(stats_by_region[region_key], player["champion"], not blue_win, player, "solo_rank_region_split")
                add_player_stat(stats_by_version_region[version][region_key], player["champion"], not blue_win, player, "solo_rank_region_split")
        relations.record([p["champion"] for p in blue_players], [p["champion"] for p in red_players], blue_win)
        relations_by_version[version].record([p["champion"] for p in blue_players], [p["champion"] for p in red_players], blue_win)
        lane_synergies.record(blue_players, blue_win)
        lane_synergies.record(red_players, not blue_win)
        lane_synergies_by_version[version].record(blue_players, blue_win)
        lane_synergies_by_version[version].record(red_players, not blue_win)
        if region_key:
            relations_by_region[region_key].record([p["champion"] for p in blue_players], [p["champion"] for p in red_players], blue_win)
            relations_by_version_region[version][region_key].record([p["champion"] for p in blue_players], [p["champion"] for p in red_players], blue_win)
            lane_synergies_by_region[region_key].record(blue_players, blue_win)
            lane_synergies_by_region[region_key].record(red_players, not blue_win)
            lane_synergies_by_version_region[version][region_key].record(blue_players, blue_win)
            lane_synergies_by_version_region[version][region_key].record(red_players, not blue_win)

    version_stats = {
        version: finalize_aggregated_stats(rows, total_matches_by_version[version], "solo_rank_export", item_catalog)
        for version, rows in stats_by_version.items()
    }
    split_stats = {
        key: finalize_aggregated_stats(rows, total_matches_by_region[key], "solo_rank_region_split", item_catalog)
        for key, rows in sorted(stats_by_region.items())
    }
    split_stats_by_patch = {}
    for version, region_rows in sorted(stats_by_version_region.items(), key=lambda item: version_sort_key(item[0])):
        split_stats_by_patch[version] = {
            key: finalize_aggregated_stats(rows, total_matches_by_version_region[version][key], "solo_rank_region_split", item_catalog)
            for key, rows in sorted(region_rows.items())
        }
    solo_splits = {
        "stats": {"region": split_stats},
        "statsByPatch": {"region": split_stats_by_patch},
        "relationships": {"region": {key: rel.to_payload() for key, rel in sorted(relations_by_region.items())}},
        "relationshipsByPatch": {
            "region": {
                version: {key: rel.to_payload() for key, rel in sorted(region_rows.items())}
                for version, region_rows in sorted(relations_by_version_region.items(), key=lambda item: version_sort_key(item[0]))
            }
        },
        "laneSynergies": {"region": {key: rel.to_payload() for key, rel in sorted(lane_synergies_by_region.items())}},
        "laneSynergiesByPatch": {
            "region": {
                version: {key: rel.to_payload() for key, rel in sorted(region_rows.items())}
                for version, region_rows in sorted(lane_synergies_by_version_region.items(), key=lambda item: version_sort_key(item[0]))
            }
        },
        "counts": {
            "region": dict(sorted(total_matches_by_region.items())),
            "regionByPatch": {
                version: dict(sorted(counter.items()))
                for version, counter in sorted(total_matches_by_version_region.items(), key=lambda item: version_sort_key(item[0]))
            },
        },
    }
    return (
        finalize_aggregated_stats(stats, total_matches, "solo_rank_export", item_catalog),
        relations.to_payload(),
        version_stats,
        {version: rel.to_payload() for version, rel in relations_by_version.items()},
        lane_synergies.to_payload(),
        {version: rel.to_payload() for version, rel in lane_synergies_by_version.items()},
        solo_splits,
    )


def parse_solo_team(team_text, champion_ids, item_catalog=None):
    players = []
    for block in split_struct_blocks(team_text, "SoloRankAthlete"):
        champion = parse_quoted_field(block, "champion")
        if champion not in champion_ids:
            continue
        athlete_id = parse_first_int(block, "athlete_id")
        item_icons = parse_quoted_array(block, "items")
        item_details = with_item_order(describe_item_icons(item_icons, item_catalog))
        cs = parse_first_int(block, "cs") or 0
        players.append(
            {
                "champion": champion,
                "position": parse_position_from_stats(block),
                "athleteId": athlete_id,
                "name": f"athlete #{athlete_id}" if athlete_id is not None else None,
                "kills": parse_first_int(block, "kill") or 0,
                "deaths": parse_first_int(block, "death") or 0,
                "assists": parse_first_int(block, "assist") or 0,
                "cs": cs,
                "level": parse_first_int(block, "level") or 0,
                "dealt": parse_first_int(block, "dealing") or 0,
                "healing": parse_first_int(block, "healing") or 0,
                "taken": parse_first_int(block, "tanking") or 0,
                "rating": parse_first_int(block, "rating") or 0,
                "lineGold": 0,
                "lineCs": cs,
                "gold": 0,
                "itemIcons": item_icons,
                "itemIds": [item["id"] for item in item_details if item.get("id") is not None],
                "itemNames": [item["name"] for item in item_details if item.get("name")],
                "items": item_details,
            }
        )
    return players


def compact_solo_performance(players):
    players = players or []
    return {
        "gold": 0,
        "killsTotal": sum(player.get("kills", 0) for player in players),
        "deathsTotal": sum(player.get("deaths", 0) for player in players),
        "epic": 0,
        "serpen": 0,
        "firstEpic": False,
        "firstSerpen": False,
        "lineGoldTotal": 0,
        "lineCsTotal": sum(player.get("cs", 0) for player in players),
        "dealtTotal": sum(player.get("dealt", 0) for player in players),
    }


def match_analysis_sort_key(match):
    date_value = (
        match.get("resultTime")
        or match.get("dateTime")
        or match.get("date")
        or match.get("dateKey")
        or ""
    )
    if str(date_value).lower() in {"unknown", "date not exported"}:
        date_value = ""
    raw_id = match.get("sourceId", match.get("id"))
    try:
        numeric_id = int(raw_id)
    except (TypeError, ValueError):
        numeric_match = re.search(r"\d+", str(raw_id))
        numeric_id = int(numeric_match.group(0)) if numeric_match else 0
    source_order = 1 if match.get("source") == "solo" else 0
    return (str(date_value), source_order, numeric_id)


def parse_solo_rank_match_analysis(path: Path, champion_ids, item_catalog=None, limit=None):
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8", errors="ignore")
    champion_ids = set(champion_ids)
    matches = []
    offset = 0
    while True:
        start = text.find("SoloRankMatch {", offset)
        if start < 0:
            break
        open_at = text.find("{", start)
        block, end = read_balanced(text, open_at)
        if not block:
            break
        offset = end + 1
        if "played: true" not in block:
            continue

        solo_id = parse_first_int(block, "id")
        blue_win = parse_bool(block, "blue_team_win")
        if solo_id is None or blue_win is None:
            continue
        blue_players = parse_solo_team(extract_named_array(block, "blue_team"), champion_ids, item_catalog)
        red_players = parse_solo_team(extract_named_array(block, "red_team"), champion_ids, item_catalog)
        if not blue_players or not red_players:
            continue

        region = region_context_from_id(parse_first_int(block, "region_id"))
        date_value = parse_datetime_field(block, "date")
        result_time = parse_datetime_field(block, "result_time")
        date_key = date_key_from_datetime(date_value) or date_key_from_datetime(result_time)
        date_label = f"{date_key} (솔랭 export)" if date_key else "date not exported"
        blue = compact_solo_performance(blue_players)
        red = compact_solo_performance(red_players)
        blue.update({"name": "솔랭 블루", "bans": [], "players": blue_players})
        red.update({"name": "솔랭 레드", "bans": [], "players": red_players})
        matches.append(
            {
                "id": f"solo:{solo_id}",
                "sourceId": solo_id,
                "source": "solo",
                "version": parse_version(block),
                "date": date_key,
                "dateTime": date_value,
                "resultTime": result_time,
                "dateKey": date_key or "unknown",
                "dateLabel": date_label,
                "dateSource": "solo_rank_match_exported" if date_key else "unknown",
                "dateConfidence": "exported" if date_key else "none",
                "regionKey": region.get("regionKey"),
                "regionLabel": region.get("regionLabel"),
                "competitionKind": "solo_rank",
                "scheduleEvent": "SoloRankMatch",
                "gameTick": None,
                "durationSec": None,
                "blueTeamId": None,
                "redTeamId": None,
                "winner": "blue" if blue_win else "red",
                "blue": blue,
                "red": red,
            }
        )
    matches.sort(key=match_analysis_sort_key, reverse=True)
    return matches if limit is None else matches[:limit]


def parse_match_replay_relations(path: Path, champion_ids, excluded_replay_ids=None):
    if not path.exists():
        return {"groups": 0, "pairs": {}, "counters": {}}, {}, empty_lane_synergy_payload(), {}
    text = path.read_text(encoding="utf-8", errors="ignore")
    champion_ids = set(champion_ids)
    relations = RelationAccumulator()
    relations_by_version = defaultdict(RelationAccumulator)
    lane_synergies = LanePairAccumulator()
    lane_synergies_by_version = defaultdict(LanePairAccumulator)

    offset = 0
    while True:
        start = text.find("MatchReplayData {", offset)
        if start < 0:
            break
        open_at = text.find("{", start)
        block, end = read_balanced(text, open_at)
        if not block:
            break
        offset = end + 1
        replay_id = parse_first_int(block, "id")
        blue_win = parse_bool(block, "blue_team_win")
        if blue_win is None:
            continue
        version = parse_version(block)
        blue = parse_replay_team(extract_named_array(block, "blue_team"), champion_ids)
        red = parse_replay_team(extract_named_array(block, "red_team"), champion_ids)
        if blue and red:
            relations.record([p["champion"] for p in blue], [p["champion"] for p in red], blue_win)
            relations_by_version[version].record([p["champion"] for p in blue], [p["champion"] for p in red], blue_win)
            lane_synergies.record(blue, blue_win)
            lane_synergies.record(red, not blue_win)
            lane_synergies_by_version[version].record(blue, blue_win)
            lane_synergies_by_version[version].record(red, not blue_win)
    return (
        relations.to_payload(),
        {version: rel.to_payload() for version, rel in relations_by_version.items()},
        lane_synergies.to_payload(),
        {version: rel.to_payload() for version, rel in lane_synergies_by_version.items()},
    )


def parse_replay_team(team_text, champion_ids):
    players = []
    for block in split_struct_blocks(team_text, "MatchReplayAthlete"):
        champion = parse_quoted_field(block, "champion")
        if champion in champion_ids:
            players.append({"champion": champion, "position": parse_position_enum(block)})
    return players


def array_at(values, index):
    if index is None or index < 0 or index >= len(values):
        return 0
    return values[index] or 0


def parse_match_performance(block):
    if not block:
        return {
            "gold": 0,
            "killsTotal": 0,
            "deathsTotal": 0,
            "epic": 0,
            "serpen": 0,
            "firstEpic": False,
            "firstSerpen": False,
            "kills": [],
            "deaths": [],
            "deals": [],
            "lineGold": [],
            "lineCs": [],
        }
    return {
        "gold": parse_first_int(block, "total_gold") or 0,
        "killsTotal": parse_first_int(block, "total_kills") or 0,
        "deathsTotal": parse_first_int(block, "total_deaths") or 0,
        "epic": parse_first_int(block, "epic_secured") or 0,
        "serpen": parse_first_int(block, "serpen_secured") or 0,
        "firstEpic": parse_bool(block, "first_epic") or False,
        "firstSerpen": parse_bool(block, "first_serpen") or False,
        "kills": parse_int_array(block, "kills"),
        "deaths": parse_int_array(block, "deaths"),
        "deals": parse_int_array(block, "deal"),
        "lineGold": parse_int_array(block, "gold_line_phase"),
        "lineCs": parse_int_array(block, "cs_line_phase"),
    }


def compact_performance(perf):
    return {
        "gold": perf["gold"],
        "killsTotal": perf["killsTotal"],
        "deathsTotal": perf["deathsTotal"],
        "epic": perf["epic"],
        "serpen": perf["serpen"],
        "firstEpic": perf["firstEpic"],
        "firstSerpen": perf["firstSerpen"],
        "lineGoldTotal": sum(perf["lineGold"]),
        "lineCsTotal": sum(perf["lineCs"]),
        "dealtTotal": sum(perf["deals"]),
    }


def parse_match_team_details(team_text, champion_ids, perf, save_lookup, item_catalog=None):
    players = []
    athlete_names = save_lookup.get("athletes", {})
    for block in split_struct_blocks(team_text, "MatchReplayAthlete"):
        champion = parse_quoted_field(block, "champion")
        if champion not in champion_ids:
            continue
        slot = parse_first_int(block, "id")
        athlete_id = parse_first_int(block, "athlete_id")
        perf_index = slot % 5 if slot is not None else len(players)
        item_ids = parse_int_array(block, "items")
        item_details = with_item_order(describe_item_ids(item_ids, item_catalog))
        players.append(
            {
                "champion": champion,
                "position": parse_position_enum(block),
                "slot": slot,
                "athleteId": athlete_id,
                "name": athlete_names.get(str(athlete_id), f"athlete #{athlete_id}" if athlete_id is not None else "athlete"),
                "kills": array_at(perf["kills"], perf_index),
                "deaths": array_at(perf["deaths"], perf_index),
                "dealt": array_at(perf["deals"], perf_index),
                "lineGold": array_at(perf["lineGold"], perf_index),
                "lineCs": array_at(perf["lineCs"], perf_index),
                "gold": array_at(perf["lineGold"], perf_index),
                "cs": array_at(perf["lineCs"], perf_index),
                "itemIds": item_ids,
                "itemIcons": [item["icon"] for item in item_details if item.get("icon")],
                "itemNames": [item["name"] for item in item_details if item.get("name")],
                "items": item_details,
                "itemSource": "saved_replay_items",
            }
        )
    order = {role: index for index, role in enumerate(POSITION_NAMES)}
    players.sort(key=lambda row: order.get(row.get("position"), 99))
    return players


def parse_match_analysis(
    path: Path,
    champion_ids,
    save_lookup,
    solo_replay_ids=None,
    limit=600,
    item_catalog=None,
    replay_dates=None,
    team_meta=None,
    league_meta=None,
):
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8", errors="ignore")
    champion_ids = set(champion_ids)
    team_names = save_lookup.get("teams", {})
    matches = []
    offset = 0
    while True:
        start = text.find("MatchReplayData {", offset)
        if start < 0:
            break
        open_at = text.find("{", start)
        block, end = read_balanced(text, open_at)
        if not block:
            break
        offset = end + 1

        replay_id = parse_first_int(block, "id")
        blue_win = parse_bool(block, "blue_team_win")
        if blue_win is None:
            continue
        blue_perf = parse_match_performance(extract_named_struct(block, "blue_performance", "MatchTeamPerformance"))
        red_perf = parse_match_performance(extract_named_struct(block, "red_performance", "MatchTeamPerformance"))
        blue_players = parse_match_team_details(extract_named_array(block, "blue_team"), champion_ids, blue_perf, save_lookup, item_catalog)
        red_players = parse_match_team_details(extract_named_array(block, "red_team"), champion_ids, red_perf, save_lookup, item_catalog)
        if not blue_players or not red_players:
            continue

        game_tick = parse_first_int(block, "game_tick") or 0
        blue_team_id = parse_first_int(block, "blue_team_id")
        red_team_id = parse_first_int(block, "red_team_id")
        date_info = (replay_dates or {}).get(replay_id) or {}
        blue_team_meta = (team_meta or {}).get(blue_team_id, {})
        red_team_meta = (team_meta or {}).get(red_team_id, {})
        blue_league_id = blue_team_meta.get("leagueId")
        red_league_id = red_team_meta.get("leagueId")
        league_id = date_info.get("leagueId")
        if league_id is None and blue_league_id == red_league_id:
            league_id = blue_league_id
        league_context = (league_meta or {}).get(league_id) or league_context_from_key(
            league_id,
            date_info.get("leagueKey") or blue_team_meta.get("leagueKey") or red_team_meta.get("leagueKey"),
        )
        schedule_event = date_info.get("scheduleEvent")
        competition_kind = date_info.get("competitionKind") or competition_kind_for_event(schedule_event)
        if competition_kind == "unknown" and blue_league_id is not None and red_league_id is not None and blue_league_id != red_league_id:
            competition_kind = "international"
        blue = compact_performance(blue_perf)
        red = compact_performance(red_perf)
        blue.update(
            {
                "name": team_names.get(str(blue_team_id), f"blue team #{blue_team_id}" if blue_team_id is not None else "blue team"),
                "bans": parse_quoted_array(block, "blue_ban"),
                "players": blue_players,
            }
        )
        red.update(
            {
                "name": team_names.get(str(red_team_id), f"red team #{red_team_id}" if red_team_id is not None else "red team"),
                "bans": parse_quoted_array(block, "red_ban"),
                "players": red_players,
            }
        )
        matches.append(
            {
                "id": replay_id or len(matches),
                "sourceId": replay_id or len(matches),
                "source": "tournament",
                "version": parse_version(block),
                "date": date_info.get("date"),
                "dateKey": date_info.get("dateKey") or "unknown",
                "dateLabel": date_info.get("dateLabel") or "date not exported",
                "dateSource": date_info.get("dateSource") or "unknown",
                "dateConfidence": date_info.get("dateConfidence") or "none",
                "leagueId": league_id,
                "leagueKey": league_context.get("leagueKey"),
                "regionKey": league_context.get("regionKey"),
                "regionLabel": league_context.get("regionLabel"),
                "division": league_context.get("division"),
                "divisionLabel": league_context.get("divisionLabel"),
                "leagueLabel": league_context.get("leagueLabel"),
                "blueLeagueId": blue_league_id,
                "redLeagueId": red_league_id,
                "leagueType": date_info.get("leagueType"),
                "leagueRound": date_info.get("leagueRound"),
                "leagueIndex": date_info.get("leagueIndex"),
                "scheduleEvent": schedule_event,
                "competitionKind": competition_kind,
                "seriesId": date_info.get("seriesId"),
                "gameTick": game_tick,
                "durationSec": round(game_tick / 51),
                "blueTeamId": blue_team_id,
                "redTeamId": red_team_id,
                "winner": "blue" if blue_win else "red",
                "blue": blue,
                "red": red,
            }
        )
    matches.sort(key=match_analysis_sort_key, reverse=True)
    return matches if limit is None else matches[:limit]


class RelationAccumulator:
    def __init__(self):
        self.groups = 0
        self.synergy = defaultdict(lambda: defaultdict(lambda: Counter(games=0, wins=0)))
        self.counter = defaultdict(lambda: defaultdict(lambda: Counter(games=0, wins=0)))

    def record(self, blue, red, blue_win):
        blue = list(dict.fromkeys(blue))
        red = list(dict.fromkeys(red))
        if not blue or not red:
            return
        self.groups += 1
        self._record_team(blue, blue_win)
        self._record_team(red, not blue_win)
        self._record_opponents(blue, red, blue_win)
        self._record_opponents(red, blue, not blue_win)

    def _record_team(self, team, won):
        for champ in team:
            for other in team:
                if champ == other:
                    continue
                row = self.synergy[champ][other]
                row["games"] += 1
                row["wins"] += 1 if won else 0

    def _record_opponents(self, team, enemies, won):
        for champ in team:
            for enemy in enemies:
                row = self.counter[champ][enemy]
                row["games"] += 1
                row["wins"] += 1 if won else 0

    def to_payload(self):
        return {
            "groups": self.groups,
            "pairs": relation_table(self.synergy, reverse=True),
            "counters": relation_table(self.counter, reverse=False),
        }


def relation_table(source, reverse):
    out = {}
    for champ, counters in source.items():
        rows = []
        for other, stat in counters.items():
            games = stat["games"]
            wins = stat["wins"]
            if games <= 0:
                continue
            rows.append(
                {
                    "champion": other,
                    "games": games,
                    "wins": wins,
                    "winRate": round(wins / games * 100, 1),
                }
            )
        if any(row["games"] >= 5 for row in rows):
            rows = [row for row in rows if row["games"] >= 5]
        elif any(row["games"] >= 3 for row in rows):
            rows = [row for row in rows if row["games"] >= 3]
        rows.sort(
            key=lambda row: (
                row["winRate"] if reverse else -row["winRate"],
                min(row["games"], 30),
                row["games"],
            ),
            reverse=True,
        )
        out[champ] = rows[:12]
    return out


LANE_COMBOS = [
    ("bot_support", "bot", "support"),
    ("top_jungle", "top", "jungle"),
    ("mid_jungle", "mid", "jungle"),
]


def empty_lane_synergy_payload():
    return {combo: [] for combo, _, _ in LANE_COMBOS}


class LanePairAccumulator:
    def __init__(self):
        self.rows = defaultdict(lambda: Counter(games=0, wins=0))

    def record(self, players, won):
        by_position = {}
        for player in players:
            position = player.get("position")
            champion = player.get("champion")
            if position and champion and position not in by_position:
                by_position[position] = champion
        for combo, left_role, right_role in LANE_COMBOS:
            left = by_position.get(left_role)
            right = by_position.get(right_role)
            if not left or not right or left == right:
                continue
            row = self.rows[(combo, left, right)]
            row["games"] += 1
            row["wins"] += 1 if won else 0

    def to_payload(self):
        out = empty_lane_synergy_payload()
        for (combo, left, right), stat in self.rows.items():
            games = stat["games"]
            wins = stat["wins"]
            if games <= 0:
                continue
            out[combo].append(
                {
                    "leftChampion": left,
                    "rightChampion": right,
                    "games": games,
                    "wins": wins,
                    "winRate": round(wins / games * 100, 1),
                }
            )
        for combo, rows in out.items():
            if any(row["games"] >= 5 for row in rows):
                rows[:] = [row for row in rows if row["games"] >= 5]
            elif any(row["games"] >= 3 for row in rows):
                rows[:] = [row for row in rows if row["games"] >= 3]
            rows.sort(key=lambda row: (row["winRate"], min(row["games"], 30), row["games"]), reverse=True)
            del rows[20:]
        return out


def aggregate_match_analysis_stats(champions, rows, draft_scan, item_catalog=None):
    champion_ids = {champ["id"] for champ in champions}
    stats = defaultdict(blank_stat)
    total_matches = 0
    for match in rows:
        if match.get("source") != "tournament":
            continue
        blue = match.get("blue") or {}
        red = match.get("red") or {}
        blue_players = blue.get("players") or []
        red_players = red.get("players") or []
        if not blue_players or not red_players:
            continue
        total_matches += 1
        winner = match.get("winner")
        for ban in (blue.get("bans") or []) + (red.get("bans") or []):
            if ban in champion_ids:
                stats[ban]["banCount"] += 1
        for player in blue_players:
            champion = player.get("champion")
            if champion in champion_ids:
                add_player_stat(stats, champion, winner == "blue", player, "match_replay_split")
        for player in red_players:
            champion = player.get("champion")
            if champion in champion_ids:
                add_player_stat(stats, champion, winner == "red", player, "match_replay_split")

    finalized = finalize_aggregated_stats(stats, total_matches, "match_replay_split", item_catalog)
    return normalize_scope(champions, finalized, draft_scan)


def aggregate_match_analysis_relationships(rows):
    relations = RelationAccumulator()
    lane_synergies = LanePairAccumulator()
    for match in rows:
        if match.get("source") != "tournament":
            continue
        blue_players = (match.get("blue") or {}).get("players") or []
        red_players = (match.get("red") or {}).get("players") or []
        if not blue_players or not red_players:
            continue
        blue_win = match.get("winner") == "blue"
        relations.record([p["champion"] for p in blue_players], [p["champion"] for p in red_players], blue_win)
        lane_synergies.record(blue_players, blue_win)
        lane_synergies.record(red_players, not blue_win)
    return relations.to_payload(), lane_synergies.to_payload()


def split_key_for_match(match, axis):
    if axis == "league":
        league_id = match.get("leagueId")
        return str(league_id) if league_id is not None else None
    if axis == "region":
        return match.get("regionKey")
    if axis == "division":
        division = match.get("division")
        return str(division) if division is not None else None
    if axis == "regionDivision":
        region = match.get("regionKey")
        division = match.get("division")
        return f"{region}:{division}" if region and division is not None else None
    if axis == "competition":
        return match.get("competitionKind") or "unknown"
    return None


def build_match_analysis_split_payload(champions, rows, draft_scan, item_catalog=None):
    axes = ["league", "region", "division", "regionDivision", "competition"]
    grouped = {axis: defaultdict(list) for axis in axes}
    grouped_by_patch = {axis: defaultdict(lambda: defaultdict(list)) for axis in axes}
    counts = {axis: Counter() for axis in axes}

    for match in rows:
        version = match.get("version") or "unknown"
        for axis in axes:
            key = split_key_for_match(match, axis)
            if not key:
                continue
            grouped[axis][key].append(match)
            grouped_by_patch[axis][version][key].append(match)
            counts[axis][key] += 1

    def stats_payload(groups):
        return {
            key: aggregate_match_analysis_stats(champions, group_rows, draft_scan, item_catalog)
            for key, group_rows in sorted(groups.items(), key=lambda item: item[0])
        }

    def relationship_payload(groups):
        out = {}
        lane_out = {}
        for key, group_rows in sorted(groups.items(), key=lambda item: item[0]):
            rel, lane = aggregate_match_analysis_relationships(group_rows)
            out[key] = rel
            lane_out[key] = lane
        return out, lane_out

    stats = {axis: stats_payload(grouped[axis]) for axis in axes}
    relationships = {}
    lane_synergies = {}
    for axis in axes:
        relationships[axis], lane_synergies[axis] = relationship_payload(grouped[axis])

    stats_by_patch = {axis: {} for axis in axes}
    relationships_by_patch = {axis: {} for axis in axes}
    lane_synergies_by_patch = {axis: {} for axis in axes}
    for axis in axes:
        for version, groups in sorted(grouped_by_patch[axis].items(), key=lambda item: version_sort_key(item[0])):
            stats_by_patch[axis][version] = stats_payload(groups)
            relationships_by_patch[axis][version], lane_synergies_by_patch[axis][version] = relationship_payload(groups)

    return {
        "stats": stats,
        "statsByPatch": stats_by_patch,
        "relationships": relationships,
        "relationshipsByPatch": relationships_by_patch,
        "laneSynergies": lane_synergies,
        "laneSynergiesByPatch": lane_synergies_by_patch,
        "counts": {axis: dict(counter) for axis, counter in counts.items()},
    }


def load_replay_summary_count(export_usable=True):
    if not export_usable:
        return 0
    path = EXPORT_DIR / "match_replay_summary.tsv"
    if not path.exists():
        return 0
    count = 0
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            if line.startswith("new\t") or re.match(r"^\d+\t", line):
                count += 1
    return count


def parse_solo_rank_replay_ids(path: Path):
    if not path.exists():
        return set()
    text = path.read_text(encoding="utf-8", errors="ignore")
    replay_ids = set()
    for match in re.finditer(r"\b(\d+):\s+SoloRankMatch\s+\{\s+id:\s+(\d+),", text):
        replay_ids.add(int(match.group(2)))
    return replay_ids


def read_tsv_fields(path: Path):
    if not path.exists():
        return {}
    fields = {}
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            line = line.rstrip("\r\n")
            if not line or line == "field\tvalue":
                continue
            key, sep, value = line.partition("\t")
            if sep:
                fields[key] = value
    return fields


def meta_export_counts_look_sane(fields):
    limits = {
        "teams": 10_000,
        "athletes": 100_000,
        "champion_patch_statistics": 10_000,
        "solo_rank_matches": 100_000,
        "match_replays": 100_000,
        "league_competitions": 10_000,
        "tournament_competitions": 10_000,
        "year_schedules": 10_000,
        "match_stats": 100_000,
    }
    for key, limit in limits.items():
        raw = fields.get(key)
        if raw is None:
            continue
        try:
            if int(raw) > limit:
                return False
        except ValueError:
            continue
    return True


def meta_export_data_paths(export_dir=None):
    root = export_dir or EXPORT_DIR
    return [
        root / "teams.debug.txt",
        root / "athletes.debug.txt",
        root / "champion_patch_statistics.debug.txt",
        root / "champion_patch_statistics.tsv",
        root / "solo_rank_matches.debug.txt",
        root / "match_replays.debug.txt",
        root / "league_competitions.debug.txt",
        root / "tournament_competitions.debug.txt",
        root / "year_schedules.debug.txt",
        root / "match_stats.debug.txt",
        root / "match_replay_summary.tsv",
        root / "match_replay_players.tsv",
    ]


def normalized_path_text(path):
    if not path:
        return ""
    try:
        return str(Path(path).expanduser().resolve()).lower()
    except (OSError, RuntimeError, ValueError):
        return str(path).strip().strip('"').lower()


def manifest_matches_save_path(manifest, save_path):
    manifest_save = manifest.get("save")
    return bool(manifest_save) and bool(save_path) and normalized_path_text(manifest_save) == normalized_path_text(save_path)


def inspect_meta_export(export_dir=None):
    root = export_dir or EXPORT_DIR
    manifest_path = root / "manifest.tsv"
    manifest = read_tsv_fields(manifest_path)
    compatibility = read_tsv_fields(root / "compatibility_error.tsv")
    reason = None
    data_paths = [path for path in meta_export_data_paths(root) if path.exists()]
    if compatibility:
        reason = compatibility.get("message") or compatibility.get("sdk") or "compatibility_error.tsv present"
    elif manifest.get("compatibility") == "incompatible_database_layout":
        reason = "incompatible_database_layout"
    elif manifest and not meta_export_counts_look_sane(manifest):
        reason = "impossible_manifest_counts"
    elif not manifest and not data_paths:
        reason = "export_dir_missing" if not root.exists() else "no_export_data"
    else:
        if data_paths and not manifest_path.exists():
            reason = "export_data_without_manifest"
        elif data_paths and manifest_path.exists() and not EXPLICIT_EXPORT_DIR:
            manifest_time = manifest_path.stat().st_mtime
            stale = [path.name for path in data_paths if path.stat().st_mtime + 1 < manifest_time]
            if stale:
                reason = "stale_export_files: " + ", ".join(stale[:4])

    return {
        "usable": reason is None,
        "reason": reason,
        "manifest": manifest,
        "compatibility": compatibility,
    }


def resolve_meta_export_dir(save_path):
    primary_status = inspect_meta_export(EXPORT_DIR)
    if EXPLICIT_EXPORT_DIR or primary_status["usable"]:
        return EXPORT_DIR, primary_status, None

    snapshot_status = inspect_meta_export(SAVE_PROBE_SNAPSHOT_DIR)
    if snapshot_status["usable"] and (
        not save_path or manifest_matches_save_path(snapshot_status.get("manifest") or {}, save_path)
    ):
        return SAVE_PROBE_SNAPSHOT_DIR, snapshot_status, primary_status["reason"]

    return EXPORT_DIR, primary_status, None


def latest_meta_export_timestamp():
    paths = [
        EXPORT_DIR / "manifest.tsv",
        EXPORT_DIR / "compatibility_error.tsv",
    ] + meta_export_data_paths()
    timestamps = [path.stat().st_mtime for path in paths if path.exists()]
    return max(timestamps) if timestamps else None


def merge_stats(champions, news_rows, draft_scan, exported_stats):
    news_best = {}
    for row in news_rows:
        current = news_best.get(row["champion"])
        if current is None or row["pickCount"] > current["pickCount"]:
            news_best[row["champion"]] = row

    stats = {}
    for champ in champions:
        cid = champ["id"]
        stat = {
            "pickCount": None,
            "wins": None,
            "losses": None,
            "winRate": None,
            "banCount": None,
            "banRate": None,
            "banPickRate": None,
            "dealt": None,
            "taken": None,
            "healing": None,
            "itemCounts": None,
            "topItems": [],
            "draftMentions": draft_scan["mentions"].get(cid, 0),
            "source": "not_collected",
            "confidence": "none",
        }

        if cid in news_best:
            row = news_best[cid]
            stat.update(
                {
                    "pickCount": row["pickCount"],
                    "wins": row["wins"],
                    "losses": max(0, row["pickCount"] - row["wins"]),
                    "winRate": row["winRate"],
                    "source": row["source"],
                    "confidence": "partial",
                }
            )

        if cid in exported_stats:
            row = exported_stats[cid]
            pick = row.get("pickCount")
            wins = row.get("wins")
            losses = row.get("losses")
            win_rate = None
            if wins is not None and losses is not None and wins + losses > 0:
                win_rate = round(wins / (wins + losses) * 100, 1)
            total_match = row.get("totalMatch")
            pick_rate = None
            ban_rate = None
            ban_pick_rate = None
            if total_match:
                if pick is not None:
                    pick_rate = round(pick / total_match * 100, 1)
                if row.get("banCount") is not None:
                    ban_rate = round(row.get("banCount") / total_match * 100, 1)
                if pick is not None and row.get("banCount") is not None:
                    ban_pick_rate = round((pick + row.get("banCount")) / total_match * 100, 1)
            stat.update(
                {
                    "pickCount": pick if pick is not None else stat["pickCount"],
                    "banCount": row.get("banCount"),
                    "pickRate": pick_rate,
                    "banRate": ban_rate,
                    "banPickRate": ban_pick_rate,
                    "wins": wins if wins is not None else stat["wins"],
                    "losses": losses if losses is not None else stat["losses"],
                    "winRate": win_rate if win_rate is not None else stat["winRate"],
                    "dealt": row.get("dealt"),
                    "taken": row.get("taken"),
                    "healing": row.get("healing"),
                    "kills": row.get("kills"),
                    "deaths": row.get("deaths"),
                    "cs": row.get("cs"),
                    "gold": row.get("gold"),
                    "linePhase": row.get("linePhase"),
                    "byPosition": row.get("byPosition"),
                    "totalMatch": total_match,
                    "pickOpportunities": total_match,
                    "banOpportunities": total_match,
                    "sourceMatchCounts": {"tournament": total_match or 0},
                    "sourcePickCounts": {"tournament": pick or 0},
                    "sourceBanCounts": {"tournament": row.get("banCount") or 0},
                    "source": row.get("source", "meta_exporter_debug"),
                    "confidence": "exported",
                }
            )

        stats[cid] = stat
    return stats


def calculated_tier(stat):
    sample = stat.get("pickCount") or 0
    win_rate = stat.get("winRate")
    if sample < 5 or win_rate is None:
        return "-"
    if win_rate >= 62:
        return "OP"
    if win_rate >= 57:
        return "1"
    if win_rate >= 53:
        return "2"
    if win_rate >= 49:
        return "3"
    return "4"


def empty_display_stat(draft_mentions=0):
    return {
        "pickCount": None,
        "wins": None,
        "losses": None,
        "winRate": None,
        "pickRate": None,
        "banCount": None,
        "banRate": None,
        "banPickRate": None,
        "dealt": None,
        "taken": None,
        "healing": None,
        "kills": None,
        "deaths": None,
        "assists": None,
        "cs": None,
        "gold": None,
        "itemCounts": None,
        "topItems": [],
        "linePhase": None,
        "byPosition": None,
        "pickOpportunities": None,
        "banOpportunities": None,
        "sourceMatchCounts": None,
        "sourcePickCounts": None,
        "sourceBanCounts": None,
        "draftMentions": draft_mentions,
        "source": "not_collected",
        "confidence": "none",
    }


def normalize_scope(champions, stats, draft_scan):
    normalized = {}
    for champ in champions:
        cid = champ["id"]
        row = empty_display_stat(draft_scan["mentions"].get(cid, 0))
        if cid in stats:
            row.update(stats[cid])
        row["tier"] = calculated_tier(row)
        normalized[cid] = row
    return normalized


def combine_scope_stats(champions, tournament, solo, draft_scan, item_catalog=None):
    combined = {}
    tournament_total = max((row.get("totalMatch") or 0 for row in tournament.values()), default=0)
    solo_total = max((row.get("totalMatch") or 0 for row in solo.values()), default=0)
    total = tournament_total + solo_total
    for champ in champions:
        cid = champ["id"]
        t = tournament.get(cid, {})
        s = solo.get(cid, {})
        picks = (t.get("pickCount") or 0) + (s.get("pickCount") or 0)
        wins = (t.get("wins") or 0) + (s.get("wins") or 0)
        losses = (t.get("losses") or 0) + (s.get("losses") or 0)
        bans = t.get("banCount") or 0
        tournament_picks = t.get("pickCount") or 0
        solo_picks = s.get("pickCount") or 0
        line_phase = merge_counter_dicts(t.get("linePhase"), s.get("linePhase"))
        by_position = merge_position_dicts(t.get("byPosition"), s.get("byPosition"))
        item_counts = merge_counter_dicts(t.get("itemCounts"), s.get("itemCounts"))
        row = empty_display_stat(draft_scan["mentions"].get(cid, 0))
        if picks:
            row.update(
                {
                    "pickCount": picks,
                    "banCount": bans,
                    "wins": wins,
                    "losses": losses,
                    "winRate": round(wins / picks * 100, 1),
                    "pickRate": round(picks / total * 100, 1) if total else None,
                    "banRate": round(bans / tournament_total * 100, 1) if tournament_total else None,
                    "banPickRate": round((picks + bans) / total * 100, 1) if total else None,
                    "dealt": (t.get("dealt") or 0) + (s.get("dealt") or 0),
                    "taken": (t.get("taken") or 0) + (s.get("taken") or 0),
                    "healing": (t.get("healing") or 0) + (s.get("healing") or 0),
                    "kills": (t.get("kills") or 0) + (s.get("kills") or 0),
                    "deaths": (t.get("deaths") or 0) + (s.get("deaths") or 0),
                    "assists": (t.get("assists") or 0) + (s.get("assists") or 0),
                    "cs": (t.get("cs") or 0) + (s.get("cs") or 0),
                    "gold": (t.get("gold") or 0) + (s.get("gold") or 0),
                    "itemCounts": item_counts,
                    "topItems": item_top_list(item_counts, item_catalog),
                    "linePhase": line_phase,
                    "byPosition": by_position,
                    "totalMatch": total,
                    "pickOpportunities": total,
                    "banOpportunities": tournament_total or None,
                    "sourceMatchCounts": {"tournament": tournament_total, "solo": solo_total},
                    "sourcePickCounts": {"tournament": tournament_picks, "solo": solo_picks},
                    "sourceBanCounts": {"tournament": bans, "solo": 0},
                    "source": "combined_export",
                    "confidence": "exported",
                }
            )
        row["tier"] = calculated_tier(row)
        combined[cid] = row
    return combined


def normalize_split_stats(champions, split_stats, draft_scan):
    return {
        axis: {
            key: normalize_scope(champions, rows, draft_scan)
            for key, rows in groups.items()
        }
        for axis, groups in split_stats.items()
    }


def normalize_split_stats_by_patch(champions, split_stats_by_patch, draft_scan):
    return {
        axis: {
            version: {
                key: normalize_scope(champions, rows, draft_scan)
                for key, rows in groups.items()
            }
            for version, groups in versions.items()
        }
        for axis, versions in split_stats_by_patch.items()
    }


def strip_internal_score_fields_from_stats(stats, keep_source_counters=False):
    if not isinstance(stats, dict):
        return
    fields = INTERNAL_SCORE_FIELDS if keep_source_counters else INTERNAL_SCORE_FIELDS + SOURCE_COUNTER_FIELDS
    for row in stats.values():
        if isinstance(row, dict):
            for field in fields:
                row.pop(field, None)


def strip_internal_score_fields_from_split(split_payload, keep_source_counters=False):
    if not isinstance(split_payload, dict):
        return
    for groups in (split_payload.get("stats") or {}).values():
        if isinstance(groups, dict):
            for rows in groups.values():
                strip_internal_score_fields_from_stats(rows, keep_source_counters=keep_source_counters)
    for versions in (split_payload.get("statsByPatch") or {}).values():
        if isinstance(versions, dict):
            for groups in versions.values():
                if isinstance(groups, dict):
                    for rows in groups.values():
                        strip_internal_score_fields_from_stats(rows, keep_source_counters=keep_source_counters)


def strip_internal_score_fields_for_payload(combined_stats, tournament_stats, solo_stats, split_payloads=None, stats_by_patch=None):
    # Source counters are part of the public scoring input now. Keep them in the
    # browser payload so the dashboard and generated native addon policies use
    # the same source-normalized exposure calculation.
    strip_internal_score_fields_from_stats(combined_stats, keep_source_counters=True)
    strip_internal_score_fields_from_stats(tournament_stats, keep_source_counters=True)
    strip_internal_score_fields_from_stats(solo_stats, keep_source_counters=True)
    for scope_group in (stats_by_patch or {}).values():
        if isinstance(scope_group, dict):
            for stats in scope_group.values():
                strip_internal_score_fields_from_stats(stats, keep_source_counters=True)
    for split_payload, _keep_source_counters in split_payloads or []:
        strip_internal_score_fields_from_split(split_payload, keep_source_counters=True)


def split_count(split_payload, axis, key):
    return (split_payload.get("counts", {}).get(axis, {}) or {}).get(key, 0)


def split_count_by_patch(split_payload, axis, version, key):
    return (split_payload.get("counts", {}).get(f"{axis}ByPatch", {}).get(version, {}) or {}).get(key, 0)


def build_combined_region_split_payload(champions, tournament_splits, solo_splits, draft_scan, item_catalog=None):
    axis = "region"
    tournament_regions = tournament_splits.get("stats", {}).get(axis, {}) or {}
    solo_regions = solo_splits.get("stats", {}).get(axis, {}) or {}
    region_keys = sorted(set(tournament_regions) | set(solo_regions))
    stats = {axis: {}}
    relationships = {axis: {}}
    lane_synergies = {axis: {}}
    counts = {axis: {}}
    for key in region_keys:
        stats[axis][key] = combine_scope_stats(
            champions,
            tournament_regions.get(key, {}),
            solo_regions.get(key, {}),
            draft_scan,
            item_catalog,
        )
        relationships[axis][key] = merge_relationship_payloads(
            (tournament_splits.get("relationships", {}).get(axis, {}) or {}).get(key, {}),
            (solo_splits.get("relationships", {}).get(axis, {}) or {}).get(key, {}),
        )
        lane_synergies[axis][key] = merge_lane_synergy_payloads(
            (tournament_splits.get("laneSynergies", {}).get(axis, {}) or {}).get(key, {}),
            (solo_splits.get("laneSynergies", {}).get(axis, {}) or {}).get(key, {}),
        )
        counts[axis][key] = split_count(tournament_splits, axis, key) + split_count(solo_splits, axis, key)

    stats_by_patch = {axis: {}}
    relationships_by_patch = {axis: {}}
    lane_synergies_by_patch = {axis: {}}
    counts[f"{axis}ByPatch"] = {}
    tournament_by_patch = tournament_splits.get("statsByPatch", {}).get(axis, {}) or {}
    solo_by_patch = solo_splits.get("statsByPatch", {}).get(axis, {}) or {}
    versions = sorted(set(tournament_by_patch) | set(solo_by_patch), key=version_sort_key)
    for version in versions:
        version_regions = sorted(set(tournament_by_patch.get(version, {})) | set(solo_by_patch.get(version, {})))
        stats_by_patch[axis][version] = {}
        relationships_by_patch[axis][version] = {}
        lane_synergies_by_patch[axis][version] = {}
        counts[f"{axis}ByPatch"][version] = {}
        for key in version_regions:
            stats_by_patch[axis][version][key] = combine_scope_stats(
                champions,
                tournament_by_patch.get(version, {}).get(key, {}),
                solo_by_patch.get(version, {}).get(key, {}),
                draft_scan,
                item_catalog,
            )
            relationships_by_patch[axis][version][key] = merge_relationship_payloads(
                (tournament_splits.get("relationshipsByPatch", {}).get(axis, {}).get(version, {}) or {}).get(key, {}),
                (solo_splits.get("relationshipsByPatch", {}).get(axis, {}).get(version, {}) or {}).get(key, {}),
            )
            lane_synergies_by_patch[axis][version][key] = merge_lane_synergy_payloads(
                (tournament_splits.get("laneSynergiesByPatch", {}).get(axis, {}).get(version, {}) or {}).get(key, {}),
                (solo_splits.get("laneSynergiesByPatch", {}).get(axis, {}).get(version, {}) or {}).get(key, {}),
            )
            counts[f"{axis}ByPatch"][version][key] = (
                split_count_by_patch(tournament_splits, axis, version, key)
                + split_count_by_patch(solo_splits, axis, version, key)
            )

    return {
        "stats": stats,
        "statsByPatch": stats_by_patch,
        "relationships": relationships,
        "relationshipsByPatch": relationships_by_patch,
        "laneSynergies": lane_synergies,
        "laneSynergiesByPatch": lane_synergies_by_patch,
        "counts": counts,
    }


def merge_counter_dicts(*items):
    total = Counter()
    for item in items:
        if item:
            total.update({key: value or 0 for key, value in item.items()})
    return dict(total) if total else None


def merge_position_dicts(*items):
    merged = defaultdict(Counter)
    for item in items:
        if not item:
            continue
        for pos, values in item.items():
            merged[pos].update({key: value or 0 for key, value in values.items()})
    return {pos: dict(values) for pos, values in merged.items()} if merged else None


def merge_relationship_payloads(*payloads):
    return {
        "groups": sum(payload.get("groups", 0) for payload in payloads if payload),
        "pairs": merge_relation_kind("pairs", payloads, reverse=True),
        "counters": merge_relation_kind("counters", payloads, reverse=False),
    }


def merge_lane_synergy_payloads(*payloads):
    merged = LanePairAccumulator()
    for payload in payloads:
        if not payload:
            continue
        for combo, rows in payload.items():
            for row in rows:
                key = (combo, row["leftChampion"], row["rightChampion"])
                merged.rows[key]["games"] += row.get("games", 0)
                merged.rows[key]["wins"] += row.get("wins", 0)
    return merged.to_payload()


def merge_relation_kind(kind, payloads, reverse):
    merged = defaultdict(lambda: defaultdict(lambda: Counter(games=0, wins=0)))
    for payload in payloads:
        if not payload:
            continue
        for champ, rows in payload.get(kind, {}).items():
            for row in rows:
                other = row["champion"]
                merged[champ][other]["games"] += row.get("games", row.get("count", 0))
                merged[champ][other]["wins"] += row.get("wins", 0)
    return relation_table(merged, reverse=reverse)


def parse_args():
    parser = argparse.ArgumentParser(description="Build TFM2 meta dashboard data.")
    parser.add_argument(
        "--save-path",
        default=None,
        help="Optional TFM2 save file, data folder, or TeamfightManager2 appdata folder.",
    )
    parser.add_argument(
        "--policy-only",
        action="store_true",
        help="Regenerate addon policy TSV files from the current meta-data.js without rebuilding save statistics.",
    )
    return parser.parse_args()


def build_policy_exports_from_payload(payload, generated_at=None):
    generated_at = generated_at or datetime.now().isoformat(timespec="seconds")
    champions = payload.get("champions") or []
    game_root = detect_game_root_for_mods(ROOT)
    policy_split = split_policy_champions_for_current_mods(champions, game_root)
    champion_tier_champions = policy_split["championTierChampions"]
    ai_champions = policy_split["aiChampions"]
    inactive_external_ids = policy_split["inactiveExternalIds"]
    stats_by_scope = payload.get("statsByScope") or {}
    stats_by_patch = payload.get("statsByPatch") or {}
    patch_versions = list(payload.get("patches") or [])
    if not patch_versions:
        patch_versions = sorted(stats_by_patch, key=version_sort_key)
    score_model_spec = payload.get("scoreModelSpec") or load_score_model_spec()
    save_path = (payload.get("save") or {}).get("path")
    replay_date_status = payload.get("replayDateStatus") or {}
    tournament_stats = stats_by_scope.get("tournament") or {}
    combined_stats = stats_by_scope.get("overall") or {}
    tier_policy_stats, tier_policy_patch, tier_policy_source = select_policy_stats(
        tournament_stats,
        stats_by_patch,
        patch_versions,
        scope="tournament",
    )
    ai_policy_stats, ai_policy_patch, ai_policy_source = select_policy_stats(
        combined_stats,
        stats_by_patch,
        patch_versions,
        scope="overall",
    )

    def build_tier_policy_for_stats(stats, patch_key, source_label):
        policy = build_policy_exports(
            champion_tier_champions,
            stats,
            generated_at,
            save_path,
            patch_key,
            source_label,
            replay_date_status,
            score_model_spec,
            scope="tournament",
            cleanup_champion_ids=inactive_external_ids,
        )
        policy["metadata"]["activeExternalChampionCount"] = policy_split["activeExternalCount"]
        policy["metadata"]["inactiveExternalCleanupCount"] = policy_split["inactiveExternalCount"]
        return policy

    champion_tier_policy_exports = build_tier_policy_for_stats(
        tier_policy_stats,
        tier_policy_patch,
        tier_policy_source,
    )
    champion_tier_policy_exports = apply_champion_tier_policy_gate(
        champion_tier_policy_exports,
        None if tier_policy_patch == "all" else lambda: build_tier_policy_for_stats(
            tournament_stats,
            "all",
            "tournament all patches",
        ),
    )
    ai_champion_policy_exports = build_policy_exports(
        ai_champions,
        ai_policy_stats,
        generated_at,
        save_path,
        ai_policy_patch,
        ai_policy_source,
        replay_date_status,
        score_model_spec,
        scope="overall",
    )
    ai_champion_policy_exports["metadata"]["activeExternalChampionCount"] = policy_split["activeExternalCount"]
    ai_champion_policy_exports["metadata"]["customCandidatePolicy"] = "candidate_map_conditional_fail_closed"
    return champion_tier_policy_exports, ai_champion_policy_exports


def run_policy_only():
    if not OUT.exists():
        raise SystemExit(f"Required file is missing: {OUT}")
    payload = load_js_json(OUT)
    champion_tier_policy_exports, ai_champion_policy_exports = build_policy_exports_from_payload(payload)
    status = write_policy_exports(champion_tier_policy_exports, ai_champion_policy_exports)
    for group in status.values():
        for path in group.get("written", []):
            print(f"Wrote {path}")
        for skipped in group.get("skipped", []):
            print(f"Skipped policy mirror {skipped.get('path')}: {skipped.get('reason')}")
    print(
        "policy_only=true "
        f"championPreset={champion_tier_policy_exports['metadata'].get('preset')} "
        f"aiPreset={ai_champion_policy_exports['metadata'].get('preset')}"
    )


def main():
    global EXPORT_DIR
    args = parse_args()
    if args.policy_only:
        run_policy_only()
        return
    if not BANPICK_DATA.exists():
        raise SystemExit(
            "Required file is missing: "
            f"{BANPICK_DATA}\n"
            "Re-extract the dashboard package. It should include data\\banpick-data.js and assets\\."
        )
    base = load_js_json(BANPICK_DATA)
    score_model_spec = load_score_model_spec()
    champions = [dict(champ) for champ in base["champions"]]
    external_mod_game_root = detect_game_root_for_mods(ROOT)
    external_champion_mods = load_active_external_champions(champions, external_mod_game_root)
    if external_champion_mods["championIds"]:
        print(
            "External champion mods: "
            f"{len(external_champion_mods['mods'])} active mods, "
            f"{len(external_champion_mods['championIds'])} champions"
        )
    champion_ids = [champ["id"] for champ in champions]
    item_catalog = load_item_catalog()
    print(
        "Items: "
        f"{len(item_catalog.get('byId', {}))} loaded "
        f"from {item_catalog.get('source') or 'not found'}"
    )

    save_path, manual_search_roots = latest_save(args.save_path)
    print("Save search roots:")
    for save_dir in manual_search_roots:
        marker = "exists" if save_dir.exists() else "missing"
        print(f"  - {save_dir} [manual, {marker}]")
    for save_dir in SAVE_DIRS:
        marker = "exists" if save_dir.exists() else "missing"
        print(f"  - {save_dir} [{marker}]")
    print(f"Selected save: {save_path if save_path else 'not found'}")
    resolved_export_dir, meta_export_status, export_fallback_reason = resolve_meta_export_dir(save_path)
    if resolved_export_dir != EXPORT_DIR:
        EXPORT_DIR = resolved_export_dir
        print(
            "Meta export fallback: using save_probe snapshot "
            f"because primary export was {export_fallback_reason}"
        )
    print(f"Meta export dir: {EXPORT_DIR if EXPORT_DIR.exists() else str(EXPORT_DIR) + ' [missing]'}")
    meta_manifest = meta_export_status.get("manifest") or {}
    meta_source_kind = meta_manifest.get("reason") or ("meta_exporter" if meta_export_status["usable"] else "unavailable")
    save_probe_active = meta_export_status["usable"] and meta_source_kind == "save_probe"
    if meta_export_status["usable"]:
        print(f"Meta export status: usable ({meta_source_kind})")
    else:
        print(f"Meta export status: ignored ({meta_export_status['reason']})")
    blob = decompress_save(save_path) if save_path else b""
    exporter_lookup = extract_exporter_lookup(EXPORT_DIR) if meta_export_status["usable"] else {"teams": {}, "athletes": {}}
    snapshot_lookup_ready = meta_export_status["usable"] and bool(exporter_lookup["teams"] or exporter_lookup["athletes"])
    save_lookup_fallback = (
        {"teams": {}, "athletes": {}}
        if snapshot_lookup_ready
        else extract_save_lookup(blob) if blob else {"teams": {}, "athletes": {}}
    )
    save_lookup = {
        "teams": exporter_lookup["teams"] or save_lookup_fallback["teams"],
        # Replay athlete ids are safest when they come from the same exporter
        # snapshot as match_replays. The save fallback is order-based and can
        # attach the wrong current-roster name to old replay snapshots.
        "athletes": exporter_lookup["athletes"],
    }
    snapshot_lookup_source = "save_probe" if save_probe_active else "meta_exporter"
    team_lookup_source = snapshot_lookup_source if exporter_lookup["teams"] else "save_fallback"
    athlete_lookup_source = snapshot_lookup_source if exporter_lookup["athletes"] else "unavailable"
    print(
        "Lookup: "
        f"teams={len(save_lookup['teams'])} ({team_lookup_source}) "
        f"athletes={len(save_lookup['athletes'])} ({athlete_lookup_source})"
    )
    if meta_export_status["usable"]:
        replay_date_lookup, replay_date_status = infer_replay_dates(EXPORT_DIR)
        team_meta = parse_debug_team_metadata(EXPORT_DIR / "teams.debug.txt")
        league_meta = build_league_meta(team_meta)
    else:
        replay_date_lookup, replay_date_status = (
            {},
            {
                "enabled": False,
                "source": "disabled",
                "sets": 0,
                "tournamentSets": 0,
                "soloSets": 0,
                "series": 0,
                "assigned": 0,
                "tournamentAssigned": 0,
                "soloAssigned": 0,
                "unknown": 0,
                "latestKnownDate": None,
                "latestPatchDate": None,
                "daysSincePatch": None,
                "confidence": "none",
                "confidenceCounts": {},
                "assignedBySource": {},
                "patchEvents": [],
            },
        )
        team_meta = {}
        league_meta = {}
    print(
        "Replay date inference: "
        f"assigned={replay_date_status.get('assigned', 0)}/"
        f"{replay_date_status.get('sets', 0)} "
        f"series={replay_date_status.get('series', 0)} "
        f"latest={replay_date_status.get('latestKnownDate') or 'unknown'}"
    )
    if snapshot_lookup_ready:
        news_rows = []
        draft_scan = {"groups": 0, "mentions": {}, "pairs": {}}
        print("Fast save scan: skipped fallback news/draft/name scans because save_probe/export snapshot is usable")
    else:
        news_rows = extract_news_champion_stats(blob, champion_ids) if blob else []
        draft_scan = extract_draft_like_groups(blob, champion_ids) if blob else {"groups": 0, "mentions": {}, "pairs": {}}

    current_champion_info = {}
    current_champion_info_count = 0
    candidate_order = []
    candidate_index_source = "bundled base candidate order"
    if meta_export_status["usable"]:
        champion_info_sheet_path = EXPORT_DIR / "champion_info_sheet.debug.txt"
        current_champion_info = load_champion_debug_values(champion_info_sheet_path, champion_ids)
        base_champion_info = load_champion_debug_values(EXPORT_DIR / "pre_patch_data.debug.txt", champion_ids)
        current_champion_info_count = apply_current_champion_info(champions, current_champion_info, base_champion_info)
        candidate_order = parse_champion_candidate_order(champion_info_sheet_path, champion_ids)
        if candidate_order:
            candidate_index_source = "save_probe champion_info_sheet order"
        if current_champion_info_count:
            print(f"Champion current info: {current_champion_info_count} champions loaded from save_probe champion_info_sheet")
    candidate_index_map = assign_candidate_indexes(champions, candidate_order or None)
    print(
        "Champion candidate indexes: "
        f"{len(candidate_index_map)} mapped from {candidate_index_source}"
    )

    current_patch = extract_current_patch_summary(blob, champion_ids, save_path) if blob else {"meta": {"source": None, "versions": [], "changeCount": 0}, "patches": {}, "changes": []}
    print(f"Current patch: versions={len(current_patch['meta']['versions'])} changes={current_patch['meta']['changeCount']}")
    if meta_export_status["usable"]:
        exported, exported_by_version = parse_debug_champion_stats_versions(
            EXPORT_DIR / "champion_patch_statistics.debug.txt",
            champion_ids,
        )
    else:
        exported, exported_by_version = {}, {}
    tournament_stats = merge_stats(champions, news_rows, draft_scan, exported)
    if meta_export_status["usable"]:
        (
            solo_stats_raw,
            solo_relationships,
            solo_stats_by_version_raw,
            solo_relationships_by_version,
            solo_lane_synergies,
            solo_lane_synergies_by_version,
            solo_splits,
        ) = parse_solo_rank_stats(EXPORT_DIR / "solo_rank_matches.debug.txt", champion_ids, item_catalog)
        solo_splits["stats"] = normalize_split_stats(champions, solo_splits.get("stats", {}), draft_scan)
        solo_splits["statsByPatch"] = normalize_split_stats_by_patch(champions, solo_splits.get("statsByPatch", {}), draft_scan)
        solo_stats = normalize_scope(champions, solo_stats_raw, draft_scan)
        solo_replay_ids = parse_solo_rank_replay_ids(EXPORT_DIR / "solo_rank_matches.debug.txt")
        (
            tournament_relationships,
            tournament_relationships_by_version,
            tournament_lane_synergies,
            tournament_lane_synergies_by_version,
        ) = parse_match_replay_relations(EXPORT_DIR / "match_replays.debug.txt", champion_ids, solo_replay_ids)
        tournament_match_analysis = parse_match_analysis(
            EXPORT_DIR / "match_replays.debug.txt",
            champion_ids,
            save_lookup,
            solo_replay_ids,
            limit=None,
            item_catalog=item_catalog,
            replay_dates=replay_date_lookup,
            team_meta=team_meta,
            league_meta=league_meta,
        )
        solo_match_analysis = parse_solo_rank_match_analysis(
            EXPORT_DIR / "solo_rank_matches.debug.txt",
            champion_ids,
            item_catalog=item_catalog,
            limit=None,
        )
        replay_date_status = merge_solo_replay_date_status(replay_date_status, solo_match_analysis)
        full_match_analysis = sorted(
            tournament_match_analysis + solo_match_analysis,
            key=match_analysis_sort_key,
            reverse=True,
        )
        tournament_splits = build_match_analysis_split_payload(champions, tournament_match_analysis, draft_scan, item_catalog)
        match_analysis = full_match_analysis[:600]
    else:
        empty_rel = {"groups": 0, "pairs": {}, "counters": {}}
        solo_stats_raw = {}
        solo_relationships = empty_rel
        solo_stats_by_version_raw = {}
        solo_relationships_by_version = {}
        solo_lane_synergies = empty_lane_synergy_payload()
        solo_lane_synergies_by_version = {}
        solo_splits = {
            "stats": {"region": {}},
            "statsByPatch": {"region": {}},
            "relationships": {"region": {}},
            "relationshipsByPatch": {"region": {}},
            "laneSynergies": {"region": {}},
            "laneSynergiesByPatch": {"region": {}},
            "counts": {"region": {}, "regionByPatch": {}},
        }
        solo_stats = normalize_scope(champions, solo_stats_raw, draft_scan)
        solo_replay_ids = set()
        tournament_relationships = empty_rel
        tournament_relationships_by_version = {}
        tournament_lane_synergies = empty_lane_synergy_payload()
        tournament_lane_synergies_by_version = {}
        tournament_match_analysis = []
        solo_match_analysis = []
        full_match_analysis = []
        match_analysis = []
        tournament_splits = build_match_analysis_split_payload(champions, full_match_analysis, draft_scan, item_catalog)
    combined_stats = combine_scope_stats(champions, tournament_stats, solo_stats, draft_scan, item_catalog)
    combined_splits = build_combined_region_split_payload(champions, tournament_splits, solo_splits, draft_scan, item_catalog)

    for scope_stats in [tournament_stats, solo_stats, combined_stats]:
        for champ in champions:
            scope_stats[champ["id"]]["tier"] = calculated_tier(scope_stats[champ["id"]])

    overall_relationships = merge_relationship_payloads(tournament_relationships, solo_relationships)
    overall_lane_synergies = merge_lane_synergy_payloads(tournament_lane_synergies, solo_lane_synergies)
    patch_versions = sorted(
        set(exported_by_version)
        | set(solo_stats_by_version_raw)
        | set(tournament_relationships_by_version)
        | set(solo_relationships_by_version),
        key=version_sort_key,
    )
    stats_by_patch = {}
    relationships_by_patch = {}
    lane_synergies_by_patch = {}

    empty_rel = {"groups": 0, "pairs": {}, "counters": {}}
    for version in patch_versions:
        tournament_v = merge_stats(champions, [], draft_scan, exported_by_version.get(version, {}))
        solo_v = normalize_scope(champions, solo_stats_by_version_raw.get(version, {}), draft_scan)
        combined_v = combine_scope_stats(champions, tournament_v, solo_v, draft_scan, item_catalog)
        for scope_stats in [tournament_v, solo_v, combined_v]:
            for champ in champions:
                scope_stats[champ["id"]]["tier"] = calculated_tier(scope_stats[champ["id"]])
        tournament_rel_v = tournament_relationships_by_version.get(version, empty_rel)
        solo_rel_v = solo_relationships_by_version.get(version, empty_rel)
        overall_rel_v = merge_relationship_payloads(tournament_rel_v, solo_rel_v)
        tournament_lane_v = tournament_lane_synergies_by_version.get(version, empty_lane_synergy_payload())
        solo_lane_v = solo_lane_synergies_by_version.get(version, empty_lane_synergy_payload())
        stats_by_patch[version] = {
            "overall": combined_v,
            "tournament": tournament_v,
            "solo": solo_v,
        }
        relationships_by_patch[version] = {
            "overall": overall_rel_v,
            "tournament": tournament_rel_v,
            "solo": solo_rel_v,
        }
        lane_synergies_by_patch[version] = {
            "overall": merge_lane_synergy_payloads(tournament_lane_v, solo_lane_v),
            "tournament": tournament_lane_v,
            "solo": solo_lane_v,
        }

    meta_export_ts = latest_meta_export_timestamp()
    save_ts = save_path.stat().st_mtime if save_path else None
    manifest_save_path = meta_manifest.get("save")
    manifest_matches_selected_save = (
        bool(manifest_save_path)
        and bool(save_path)
        and str(Path(manifest_save_path)).lower() == str(save_path).lower()
    )
    export_save_delta = round(meta_export_ts - save_ts) if meta_export_ts and save_ts else None
    export_save_mismatched = (
        export_save_delta is not None
        and abs(export_save_delta) > 600
        and not (save_probe_active and manifest_matches_selected_save)
    )
    if export_save_mismatched:
        print(
            "WARNING: selected save and Meta Exporter files differ by "
            f"{abs(export_save_delta) // 60} minutes. Load the same save in-game with "
            "Meta Exporter enabled, then run refresh again so export.request can be consumed."
        )

    generated_at = datetime.now().isoformat(timespec="seconds")
    core_item_builds = build_core_item_builds(full_match_analysis, generated_at, save_path, patch_versions, item_catalog)
    policy_split = split_policy_champions_for_current_mods(champions, external_mod_game_root)
    tier_policy_stats, tier_policy_patch, tier_policy_source = select_policy_stats(
        tournament_stats,
        stats_by_patch,
        patch_versions,
        scope="tournament",
    )
    ai_policy_stats, ai_policy_patch, ai_policy_source = select_policy_stats(
        combined_stats,
        stats_by_patch,
        patch_versions,
        scope="overall",
    )

    def build_tier_policy_for_stats(stats, patch_key, source_label):
        policy = build_policy_exports(
            policy_split["championTierChampions"],
            stats,
            generated_at,
            save_path,
            patch_key,
            source_label,
            replay_date_status,
            score_model_spec,
            scope="tournament",
            cleanup_champion_ids=policy_split["inactiveExternalIds"],
        )
        policy["metadata"]["activeExternalChampionCount"] = policy_split["activeExternalCount"]
        policy["metadata"]["inactiveExternalCleanupCount"] = policy_split["inactiveExternalCount"]
        return policy

    champion_tier_policy_exports = build_tier_policy_for_stats(
        tier_policy_stats,
        tier_policy_patch,
        tier_policy_source,
    )
    champion_tier_policy_exports = apply_champion_tier_policy_gate(
        champion_tier_policy_exports,
        None if tier_policy_patch == "all" else lambda: build_tier_policy_for_stats(
            tournament_stats,
            "all",
            "tournament all patches",
        ),
    )
    ai_champion_policy_exports = build_policy_exports(
        policy_split["aiChampions"],
        ai_policy_stats,
        generated_at,
        save_path,
        ai_policy_patch,
        ai_policy_source,
        replay_date_status,
        score_model_spec,
        scope="overall",
    )
    ai_champion_policy_exports["metadata"]["activeExternalChampionCount"] = policy_split["activeExternalCount"]
    ai_champion_policy_exports["metadata"]["customCandidatePolicy"] = "candidate_map_conditional_fail_closed"
    policy_export_status = write_policy_exports(champion_tier_policy_exports, ai_champion_policy_exports)
    strip_internal_score_fields_for_payload(
        combined_stats,
        tournament_stats,
        solo_stats,
        split_payloads=[
            (tournament_splits, False),
            (solo_splits, False),
            (combined_splits, True),
        ],
        stats_by_patch=stats_by_patch,
    )
    region_order = {key: index for index, key in enumerate(LEAGUE_KEY_FALLBACKS)}
    league_meta_list = sorted(
        league_meta.values(),
        key=lambda row: (
            region_order.get(row.get("regionKey"), 99),
            row.get("division") or 0,
            row.get("leagueId") or 0,
        ),
    )
    region_meta = {}
    for row in league_meta_list:
        region_key = row.get("regionKey")
        if region_key and region_key not in region_meta:
            region_meta[region_key] = {"regionKey": region_key, "label": row.get("regionLabel") or region_key}
    for region_key in solo_splits.get("counts", {}).get("region", {}):
        if region_key and region_key not in region_meta:
            region_meta[region_key] = {
                "regionKey": region_key,
                "label": LEAGUE_REGION_LABELS.get(region_key, region_key),
            }
    competition_meta = [
        {"key": "league_regular", "label": "리그전"},
        {"key": "league_playoff", "label": "플레이오프"},
        {"key": "international", "label": "국제전"},
        {"key": "solo_rank", "label": "솔로랭크"},
        {"key": "unknown", "label": "미확인"},
    ]

    payload = {
        "generatedAt": generated_at,
        "scoreModelSpec": score_model_spec,
        "save": {
            "path": str(save_path) if save_path else None,
            "lastModified": datetime.fromtimestamp(save_path.stat().st_mtime).isoformat(timespec="seconds") if save_path else None,
            "searchRoots": [str(path) for path in manual_search_roots + SAVE_DIRS],
        },
        "sources": {
            "championInfo": "save_probe champion_info_sheet" if current_champion_info_count else "bundled dashboard champion data",
            "championCurrentInfo": current_champion_info_count,
            "externalChampionGameRoot": str(external_mod_game_root),
            "externalChampionMods": external_champion_mods["mods"],
            "externalChampionCount": len(external_champion_mods["championIds"]),
            "championCandidateIndexSource": candidate_index_source,
            "championCandidateIndexes": len(candidate_index_map),
            "saveNewsStats": len(news_rows),
            "draftLikeGroups": draft_scan["groups"],
            "metaExporter": bool(exported) and meta_export_status["usable"],
            "saveProbe": save_probe_active,
            "metaExportSource": meta_source_kind,
            "metaExportUsable": meta_export_status["usable"],
            "metaExportReason": meta_export_status["reason"],
            "replaySummaries": load_replay_summary_count(meta_export_status["usable"]),
            "matchAnalysis": len(match_analysis),
            "matchAnalysisTotal": len(full_match_analysis),
            "tournamentMatchAnalysis": len(tournament_match_analysis),
            "soloMatchAnalysis": len(solo_match_analysis),
            "replayDateInference": replay_date_status,
            "soloRankMatches": solo_relationships.get("groups", 0),
            "tournamentRelationshipMatches": tournament_relationships.get("groups", 0),
            "soloReplayIds": len(solo_replay_ids),
            "excludedSoloReplayIds": 0,
            "metaExportLastModified": datetime.fromtimestamp(meta_export_ts).isoformat(timespec="seconds") if meta_export_ts else None,
            "metaExportSaveDeltaSeconds": export_save_delta,
            "metaExportMismatched": export_save_mismatched,
            "teamLookupSource": team_lookup_source,
            "athleteLookupSource": athlete_lookup_source,
            "exactReplayAthleteNames": athlete_lookup_source in {"meta_exporter", "save_probe"},
            "matchAnalysisSource": "match_replays.debug.txt raw MatchReplayData; team/player names prefer teams.debug.txt and athletes.debug.txt from the same Meta Exporter snapshot" if meta_export_status["usable"] else "disabled: current Meta Exporter snapshot is incompatible, so stale replay debug files were ignored",
            "matchAnalysisDateSource": replay_date_status.get("source"),
            "itemCatalogSource": item_catalog.get("source"),
            "itemCatalogItems": len(item_catalog.get("byId", {})),
            "coreItemBuilds": str(CORE_ITEM_BUILDS_OUT),
            "coreItemBuildsMod": str(CORE_ITEM_BUILDS_MOD_OUT),
            "coreItemBuildsTournamentMatches": core_item_builds["sources"]["tournamentMatches"],
            "policyExports": policy_export_status,
            "policyExportSource": {
                "championTier": champion_tier_policy_exports["metadata"],
                "aiChampion": ai_champion_policy_exports["metadata"],
            },
            "leagueSplitMatches": tournament_splits["counts"].get("league", {}),
            "soloRegionMatches": solo_splits["counts"].get("region", {}),
        },
        "saveLookup": save_lookup,
        "replayDateInference": replay_date_status,
        "itemCatalog": item_catalog,
        "leagueMeta": {
            "leagues": league_meta_list,
            "regions": sorted(region_meta.values(), key=lambda row: region_order.get(row["regionKey"], 99)),
            "divisions": [{"key": "1", "label": "1부"}, {"key": "2", "label": "2부"}],
            "competitions": competition_meta,
            "counts": tournament_splits["counts"],
        },
        "patches": patch_versions,
        "currentPatch": current_patch,
        "champions": champions,
        "skillIconAtlas": base["meta"].get("skillIconAtlas", {}),
        "stats": combined_stats,
        "statsByScope": {
            "overall": combined_stats,
            "tournament": tournament_stats,
            "solo": solo_stats,
        },
        "statsByPatch": stats_by_patch,
        "tournamentSplits": tournament_splits,
        "soloSplits": solo_splits,
        "combinedSplits": combined_splits,
        "relationships": overall_relationships["pairs"],
        "relationshipsByScope": {
            "overall": overall_relationships,
            "tournament": tournament_relationships,
            "solo": solo_relationships,
        },
        "relationshipsByPatch": relationships_by_patch,
        "laneSynergiesByScope": {
            "overall": overall_lane_synergies,
            "tournament": tournament_lane_synergies,
            "solo": solo_lane_synergies,
        },
        "laneSynergiesByPatch": lane_synergies_by_patch,
        "matchAnalysis": match_analysis,
        "notes": [
            "챔피언 이름, 아이콘, 스킬, 기본 스탯은 게임 번들에서 직접 추출했습니다.",
            "대회 승률, 픽률, 밴률은 champion_patch_statistics를 사용합니다.",
            "솔랭 승률과 챔피언별 성과는 solo_rank_matches를 합산합니다.",
            "시너지와 상대 지표는 실제 리플레이/솔랭 경기에서 같은 팀 또는 상대 팀으로 만난 표본을 집계합니다.",
        ],
    }

    write_text_atomic(
        OUT,
        "window.TFM2_META_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
    )
    core_item_build_paths = write_core_item_builds(core_item_builds)
    print(f"Wrote {OUT}")
    for path in core_item_build_paths:
        print(f"Wrote {path}")
    for group in policy_export_status.values():
        for path in group.get("written", []):
            print(f"Wrote {path}")
        for skipped in group.get("skipped", []):
            print(f"Skipped policy mirror {skipped.get('path')}: {skipped.get('reason')}")
    print(
        f"champions={len(champions)} news_stats={len(news_rows)} tournament_matches={tournament_relationships.get('groups', 0)} solo_matches={solo_relationships.get('groups', 0)} exporter={bool(exported) and meta_export_status['usable']}"
    )


if __name__ == "__main__":
    main()
