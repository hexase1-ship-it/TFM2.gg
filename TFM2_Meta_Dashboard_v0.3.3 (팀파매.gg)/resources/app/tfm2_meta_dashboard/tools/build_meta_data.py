import gzip
import argparse
import json
import math
import os
import re
import struct
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


ROOT = Path(os.environ.get("TFM2_GAME_ROOT", Path(__file__).resolve().parents[2])).resolve()
DASHBOARD = Path(__file__).resolve().parents[1]
OUT = DASHBOARD / "data" / "meta-data.js"
CORE_ITEM_BUILDS_OUT = DASHBOARD / "data" / "core-item-builds.json"
CORE_ITEM_BUILDS_MOD_OUT = ROOT / "mods" / "tfm2_meta_item_delegate" / "core-item-builds.json"
CORE_ITEM_BUILDS_MOD_DATA_OUT = ROOT / "mods" / "tfm2_meta_item_delegate" / "data" / "core-item-builds.json"
BANPICK_DATA = DASHBOARD / "data" / "banpick-data.js"
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


def version_sort_key(version):
    parts = re.findall(r"\d+", str(version))
    return tuple(int(part) for part in parts) if parts else (0,)


def load_js_json(path: Path):
    text = path.read_text(encoding="utf-8")
    raw = text[text.find("=") + 1 :].strip()
    if raw.endswith(";"):
        raw = raw[:-1]
    return json.loads(raw)


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
if os.environ.get("TFM2_META_EXPORT_DIR"):
    EXPORT_DIR = Path(os.environ["TFM2_META_EXPORT_DIR"]).expanduser().resolve()
else:
    EXPORT_DIR = next((path / "meta_export" for path in DIAG_DIRS if (path / "meta_export").exists()), DIAG_DIR / "meta_export")


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
        teams[team_id] = {
            "id": team_id,
            "name": parse_quoted_field(block, "name"),
            "leagueId": parse_first_int(block, "league_id"),
        }
    return teams


def parse_enum_field(text, field):
    match = re.search(rf"\b{re.escape(field)}:\s*([A-Za-z0-9_]+)", text)
    return match.group(1) if match else None


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
        "series": 0,
        "assigned": 0,
        "unknown": 0,
        "latestKnownDate": None,
        "latestPatchDate": None,
        "daysSincePatch": None,
        "confidence": "none",
        "patchEvents": [],
    }
    team_meta = parse_debug_team_metadata(export_dir / "teams.debug.txt")
    match_stats = parse_match_stats_for_date_inference(export_dir / "match_stats.debug.txt")
    schedule = parse_year_schedule_metadata(export_dir / "year_schedules.debug.txt")
    competition_types = parse_league_competition_types(export_dir / "league_competitions.debug.txt")
    status["sets"] = len(match_stats)
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
    assigned = 0
    for series_index, item in enumerate(series):
        league_id = item["leagueId"]
        if league_id is None:
            continue
        league_type = competition_types.get(league_id) or "Spring"
        regular_schedule = schedule["leagueRegular"].get(league_type) or []
        playoff_schedule = schedule["leaguePlayoff"].get(league_type) or []
        schedule_row = None
        event_kind = "LeagueMatch"
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
        if not schedule_row:
            continue

        for row in item["rows"]:
            replay_dates[row["id"]] = {
                "date": schedule_row["date"],
                "dateKey": schedule_row["dateKey"],
                "dateLabel": f"{schedule_row['date']} (일정 추정)",
                "dateSource": "league_schedule_inferred",
                "dateConfidence": "high",
                "leagueId": league_id,
                "leagueType": league_type,
                "leagueRound": schedule_row.get("round"),
                "leagueIndex": schedule_row.get("index"),
                "scheduleEvent": event_kind,
                "seriesId": series_index,
            }
            assigned += 1

    known_dates = [row["date"] for row in replay_dates.values() if row.get("date")]
    latest_known = max(known_dates) if known_dates else None
    latest_patch = None
    days_since_patch = None
    if latest_known:
        patch_dates = [event["date"] for event in schedule["patchEvents"] if event["date"] <= latest_known]
        latest_patch = max(patch_dates) if patch_dates else None
        if latest_patch:
            try:
                days_since_patch = (
                    datetime.fromisoformat(latest_known) - datetime.fromisoformat(latest_patch)
                ).days
            except ValueError:
                days_since_patch = None

    status.update(
        {
            "enabled": bool(replay_dates),
            "series": len(series),
            "assigned": assigned,
            "unknown": max(0, len(match_stats) - assigned),
            "latestKnownDate": latest_known,
            "latestPatchDate": latest_patch,
            "daysSincePatch": days_since_patch,
            "confidence": "high" if assigned else "none",
        }
    )
    return replay_dates, status


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
    for champion, row in stats.items():
        matches = row["pickCount"]
        wins = row["wins"]
        losses = row["losses"]
        out = {
            "pickCount": matches,
            "banCount": row.get("banCount", 0),
            "wins": wins,
            "losses": losses,
            "winRate": round(wins / matches * 100, 1) if matches else None,
            "pickRate": round(matches / total_match * 100, 1) if total_match else None,
            "banRate": round(row.get("banCount", 0) / total_match * 100, 1) if total_match else None,
            "banPickRate": round((matches + row.get("banCount", 0)) / total_match * 100, 1) if total_match else None,
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
            "source": source,
            "confidence": "exported",
        }
        finalized[champion] = out
    return finalized


def parse_solo_rank_stats(path: Path, champion_ids, item_catalog=None):
    if not path.exists():
        return {}, {"groups": 0, "pairs": {}, "counters": {}}, {}, {}, empty_lane_synergy_payload(), {}
    text = path.read_text(encoding="utf-8", errors="ignore")
    champion_ids = set(champion_ids)
    stats = defaultdict(blank_stat)
    stats_by_version = defaultdict(lambda: defaultdict(blank_stat))
    relations = RelationAccumulator()
    relations_by_version = defaultdict(RelationAccumulator)
    lane_synergies = LanePairAccumulator()
    lane_synergies_by_version = defaultdict(LanePairAccumulator)
    total_matches = 0
    total_matches_by_version = Counter()

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
        total_matches += 1
        total_matches_by_version[version] += 1
        for player in blue_players:
            add_player_stat(stats, player["champion"], blue_win, player, "solo_rank_export")
            add_player_stat(stats_by_version[version], player["champion"], blue_win, player, "solo_rank_export")
        for player in red_players:
            add_player_stat(stats, player["champion"], not blue_win, player, "solo_rank_export")
            add_player_stat(stats_by_version[version], player["champion"], not blue_win, player, "solo_rank_export")
        relations.record([p["champion"] for p in blue_players], [p["champion"] for p in red_players], blue_win)
        relations_by_version[version].record([p["champion"] for p in blue_players], [p["champion"] for p in red_players], blue_win)
        lane_synergies.record(blue_players, blue_win)
        lane_synergies.record(red_players, not blue_win)
        lane_synergies_by_version[version].record(blue_players, blue_win)
        lane_synergies_by_version[version].record(red_players, not blue_win)

    version_stats = {
        version: finalize_aggregated_stats(rows, total_matches_by_version[version], "solo_rank_export", item_catalog)
        for version, rows in stats_by_version.items()
    }
    return (
        finalize_aggregated_stats(stats, total_matches, "solo_rank_export", item_catalog),
        relations.to_payload(),
        version_stats,
        {version: rel.to_payload() for version, rel in relations_by_version.items()},
        lane_synergies.to_payload(),
        {version: rel.to_payload() for version, rel in lane_synergies_by_version.items()},
    )


def parse_solo_team(team_text, champion_ids, item_catalog=None):
    players = []
    for block in split_struct_blocks(team_text, "SoloRankAthlete"):
        champion = parse_quoted_field(block, "champion")
        if champion not in champion_ids:
            continue
        item_icons = parse_quoted_array(block, "items")
        item_details = with_item_order(describe_item_icons(item_icons, item_catalog))
        players.append(
            {
                "champion": champion,
                "position": parse_position_from_stats(block),
                "kills": parse_first_int(block, "kill") or 0,
                "deaths": parse_first_int(block, "death") or 0,
                "assists": parse_first_int(block, "assist") or 0,
                "cs": parse_first_int(block, "cs") or 0,
                "level": parse_first_int(block, "level") or 0,
                "dealt": parse_first_int(block, "dealing") or 0,
                "healing": parse_first_int(block, "healing") or 0,
                "taken": parse_first_int(block, "tanking") or 0,
                "rating": parse_first_int(block, "rating") or 0,
                "itemIcons": item_icons,
                "itemIds": [item["id"] for item in item_details if item.get("id") is not None],
                "itemNames": [item["name"] for item in item_details if item.get("name")],
                "items": item_details,
            }
        )
    return players


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


def parse_match_analysis(path: Path, champion_ids, save_lookup, solo_replay_ids=None, limit=600, item_catalog=None, replay_dates=None):
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
                "source": "tournament",
                "version": parse_version(block),
                "date": date_info.get("date"),
                "dateKey": date_info.get("dateKey") or "unknown",
                "dateLabel": date_info.get("dateLabel") or "date not exported",
                "dateSource": date_info.get("dateSource") or "unknown",
                "dateConfidence": date_info.get("dateConfidence") or "none",
                "leagueId": date_info.get("leagueId"),
                "leagueType": date_info.get("leagueType"),
                "leagueRound": date_info.get("leagueRound"),
                "leagueIndex": date_info.get("leagueIndex"),
                "scheduleEvent": date_info.get("scheduleEvent"),
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
    matches.sort(key=lambda row: row["id"], reverse=True)
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


def meta_export_data_paths():
    return [
        EXPORT_DIR / "teams.debug.txt",
        EXPORT_DIR / "athletes.debug.txt",
        EXPORT_DIR / "champion_patch_statistics.debug.txt",
        EXPORT_DIR / "champion_patch_statistics.tsv",
        EXPORT_DIR / "solo_rank_matches.debug.txt",
        EXPORT_DIR / "match_replays.debug.txt",
        EXPORT_DIR / "league_competitions.debug.txt",
        EXPORT_DIR / "tournament_competitions.debug.txt",
        EXPORT_DIR / "year_schedules.debug.txt",
        EXPORT_DIR / "match_stats.debug.txt",
        EXPORT_DIR / "match_replay_summary.tsv",
        EXPORT_DIR / "match_replay_players.tsv",
    ]


def inspect_meta_export():
    manifest_path = EXPORT_DIR / "manifest.tsv"
    manifest = read_tsv_fields(manifest_path)
    compatibility = read_tsv_fields(EXPORT_DIR / "compatibility_error.tsv")
    reason = None
    if compatibility:
        reason = compatibility.get("message") or compatibility.get("sdk") or "compatibility_error.tsv present"
    elif manifest.get("compatibility") == "incompatible_database_layout":
        reason = "incompatible_database_layout"
    elif manifest and not meta_export_counts_look_sane(manifest):
        reason = "impossible_manifest_counts"
    else:
        data_paths = [path for path in meta_export_data_paths() if path.exists()]
        if data_paths and not manifest_path.exists():
            reason = "export_data_without_manifest"
        elif data_paths and manifest_path.exists():
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
                    "source": "combined_export",
                    "confidence": "exported",
                }
            )
        row["tier"] = calculated_tier(row)
        combined[cid] = row
    return combined


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
    return parser.parse_args()


def main():
    args = parse_args()
    if not BANPICK_DATA.exists():
        raise SystemExit(
            "Required file is missing: "
            f"{BANPICK_DATA}\n"
            "Re-extract the dashboard package. It should include data\\banpick-data.js and assets\\."
        )
    base = load_js_json(BANPICK_DATA)
    champions = base["champions"]
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
    print(f"Meta export dir: {EXPORT_DIR if EXPORT_DIR.exists() else str(EXPORT_DIR) + ' [missing]'}")
    meta_export_status = inspect_meta_export()
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
    team_lookup_source = "meta_exporter" if exporter_lookup["teams"] else "save_fallback"
    athlete_lookup_source = "meta_exporter" if exporter_lookup["athletes"] else "unavailable"
    print(
        "Lookup: "
        f"teams={len(save_lookup['teams'])} ({team_lookup_source}) "
        f"athletes={len(save_lookup['athletes'])} ({athlete_lookup_source})"
    )
    if meta_export_status["usable"]:
        replay_date_lookup, replay_date_status = infer_replay_dates(EXPORT_DIR)
    else:
        replay_date_lookup, replay_date_status = (
            {},
            {
                "enabled": False,
                "source": "disabled",
                "sets": 0,
                "series": 0,
                "assigned": 0,
                "unknown": 0,
                "latestKnownDate": None,
                "latestPatchDate": None,
                "daysSincePatch": None,
                "confidence": "none",
                "patchEvents": [],
            },
        )
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
    if meta_export_status["usable"]:
        current_champion_info = load_champion_debug_values(EXPORT_DIR / "champion_info_sheet.debug.txt", champion_ids)
        base_champion_info = load_champion_debug_values(EXPORT_DIR / "pre_patch_data.debug.txt", champion_ids)
        current_champion_info_count = apply_current_champion_info(champions, current_champion_info, base_champion_info)
        if current_champion_info_count:
            print(f"Champion current info: {current_champion_info_count} champions loaded from save_probe champion_info_sheet")

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
        ) = parse_solo_rank_stats(EXPORT_DIR / "solo_rank_matches.debug.txt", champion_ids, item_catalog)
        solo_stats = normalize_scope(champions, solo_stats_raw, draft_scan)
        solo_replay_ids = parse_solo_rank_replay_ids(EXPORT_DIR / "solo_rank_matches.debug.txt")
        (
            tournament_relationships,
            tournament_relationships_by_version,
            tournament_lane_synergies,
            tournament_lane_synergies_by_version,
        ) = parse_match_replay_relations(EXPORT_DIR / "match_replays.debug.txt", champion_ids, solo_replay_ids)
        full_match_analysis = parse_match_analysis(
            EXPORT_DIR / "match_replays.debug.txt",
            champion_ids,
            save_lookup,
            solo_replay_ids,
            limit=None,
            item_catalog=item_catalog,
            replay_dates=replay_date_lookup,
        )
        match_analysis = full_match_analysis[:600]
    else:
        empty_rel = {"groups": 0, "pairs": {}, "counters": {}}
        solo_stats_raw = {}
        solo_relationships = empty_rel
        solo_stats_by_version_raw = {}
        solo_relationships_by_version = {}
        solo_lane_synergies = empty_lane_synergy_payload()
        solo_lane_synergies_by_version = {}
        solo_stats = normalize_scope(champions, solo_stats_raw, draft_scan)
        solo_replay_ids = set()
        tournament_relationships = empty_rel
        tournament_relationships_by_version = {}
        tournament_lane_synergies = empty_lane_synergy_payload()
        tournament_lane_synergies_by_version = {}
        full_match_analysis = []
        match_analysis = []
    combined_stats = combine_scope_stats(champions, tournament_stats, solo_stats, draft_scan, item_catalog)

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

    payload = {
        "generatedAt": generated_at,
        "save": {
            "path": str(save_path) if save_path else None,
            "lastModified": datetime.fromtimestamp(save_path.stat().st_mtime).isoformat(timespec="seconds") if save_path else None,
            "searchRoots": [str(path) for path in manual_search_roots + SAVE_DIRS],
        },
        "sources": {
            "championInfo": "save_probe champion_info_sheet" if current_champion_info_count else "bundled dashboard champion data",
            "championCurrentInfo": current_champion_info_count,
            "saveNewsStats": len(news_rows),
            "draftLikeGroups": draft_scan["groups"],
            "metaExporter": bool(exported) and meta_export_status["usable"],
            "saveProbe": save_probe_active,
            "metaExportSource": meta_source_kind,
            "metaExportUsable": meta_export_status["usable"],
            "metaExportReason": meta_export_status["reason"],
            "replaySummaries": load_replay_summary_count(meta_export_status["usable"]),
            "matchAnalysis": len(match_analysis),
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
            "exactReplayAthleteNames": athlete_lookup_source == "meta_exporter",
            "matchAnalysisSource": "match_replays.debug.txt raw MatchReplayData; team/player names prefer teams.debug.txt and athletes.debug.txt from the same Meta Exporter snapshot" if meta_export_status["usable"] else "disabled: current Meta Exporter snapshot is incompatible, so stale replay debug files were ignored",
            "matchAnalysisDateSource": replay_date_status.get("source"),
            "itemCatalogSource": item_catalog.get("source"),
            "itemCatalogItems": len(item_catalog.get("byId", {})),
            "coreItemBuilds": str(CORE_ITEM_BUILDS_OUT),
            "coreItemBuildsMod": str(CORE_ITEM_BUILDS_MOD_OUT),
            "coreItemBuildsTournamentMatches": core_item_builds["sources"]["tournamentMatches"],
        },
        "saveLookup": save_lookup,
        "replayDateInference": replay_date_status,
        "itemCatalog": item_catalog,
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

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "window.TFM2_META_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    core_item_build_paths = write_core_item_builds(core_item_builds)
    print(f"Wrote {OUT}")
    for path in core_item_build_paths:
        print(f"Wrote {path}")
    print(
        f"champions={len(champions)} news_stats={len(news_rows)} tournament_matches={tournament_relationships.get('groups', 0)} solo_matches={solo_relationships.get('groups', 0)} exporter={bool(exported) and meta_export_status['usable']}"
    )


if __name__ == "__main__":
    main()
