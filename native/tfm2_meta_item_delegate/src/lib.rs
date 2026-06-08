use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};
use std::time::SystemTime;

use game_core::ItemBuildOverride;
use mod_api::*;
use serde_json::Value;

const MOD_ID: &str = "tfm2_meta_item_delegate";
const DATA_FILE_NAME: &str = "core-item-builds.json";
const TSV_FILE_NAME: &str = "meta_item_builds.tsv";

static BUILD_CACHE: OnceLock<Mutex<BuildCache>> = OnceLock::new();
static LAST_APPLY: OnceLock<Mutex<Option<String>>> = OnceLock::new();
static LAST_ERROR: OnceLock<Mutex<Option<String>>> = OnceLock::new();

#[derive(Clone)]
struct MetaBuilds {
    source: PathBuf,
    modified: Option<SystemTime>,
    size: Option<u64>,
    generated_at: Option<String>,
    rows: HashMap<String, [ItemBuildOverride; 3]>,
}

#[derive(Default)]
struct BuildCache {
    source: Option<PathBuf>,
    modified: Option<SystemTime>,
    size: Option<u64>,
    builds: Option<MetaBuilds>,
}

struct MetaItemDelegateClient;

impl ModExtension for MetaItemDelegateClient {
    fn post_update(
        &self,
        scene: &mut Scene,
        _ui: &mut GameUI,
        _assets: &mut Assets,
        _dt: f32,
    ) {
        let _ = catch_unwind(AssertUnwindSafe(|| apply_meta_items(scene)));
    }
}

fn apply_meta_items(scene: &mut Scene) {
    let Scene::InGame { data } = scene else {
        return;
    };

    let team_id = {
        let Ok(db) = data.db.try_borrow() else {
            return;
        };

        let team_id = db.player_team_id();
        if !db.teams.contains_key(&team_id) {
            return;
        }
        team_id
    };

    let Some(builds) = load_builds() else {
        return;
    };

    let Ok(mut db) = data.db.try_borrow_mut() else {
        return;
    };

    let Some(team) = db.teams.get_mut(&team_id) else {
        return;
    };

    let before = team.champion_personal_tactics.len();
    let mut changed = 0usize;
    for (champion, directions) in &builds.rows {
        if team.champion_personal_tactics.get(champion) != Some(directions) {
            team.champion_personal_tactics
                .insert(champion.clone(), *directions);
            changed += 1;
        }
    }

    if changed == 0 {
        return;
    }

    let after = team.champion_personal_tactics.len();
    let signature = format!(
        "{}:{}:{}:{}:{:?}:{:?}",
        team_id,
        changed,
        before,
        after,
        builds.modified,
        builds.size
    );
    if remember_apply_signature(signature) {
        log_line(format!(
            "apply: team {team_id} personal item defaults changed={changed}, map_size={before}->{after}, rows={}, source={}, generated_at={}",
            builds.rows.len(),
            builds.source.display(),
            builds.generated_at.as_deref().unwrap_or("unknown"),
        ));
    }
}

fn load_builds() -> Option<MetaBuilds> {
    let Some(path) = find_data_file() else {
        log_error_once("data: core-item-builds.json not found".to_string());
        return None;
    };

    let metadata = fs::metadata(&path).ok();
    let modified = metadata.as_ref().and_then(|meta| meta.modified().ok());
    let size = metadata.as_ref().map(|meta| meta.len());
    let cache = BUILD_CACHE.get_or_init(|| Mutex::new(BuildCache::default()));
    if let Ok(mut guard) = cache.lock() {
        if guard.source.as_ref() == Some(&path)
            && guard.modified == modified
            && guard.size == size
        {
            return guard.builds.clone();
        }

        match fs::read_to_string(&path)
            .map_err(|err| err.to_string())
            .and_then(|text| parse_builds(&text, path.clone(), modified, size))
        {
            Ok(builds) => {
                log_line(format!(
                    "data: loaded {} rows from {} bytes={}",
                    builds.rows.len(),
                    builds.source.display(),
                    builds.size.unwrap_or(0),
                ));
                guard.source = Some(path);
                guard.modified = modified;
                guard.size = size;
                guard.builds = Some(builds.clone());
                clear_last_error();
                Some(builds)
            }
            Err(err) => {
                log_error_once(format!("data: parse failed {}: {err}", path.display()));
                guard.source = Some(path);
                guard.modified = modified;
                guard.size = size;
                guard.builds = None;
                None
            }
        }
    } else {
        None
    }
}

fn parse_builds(
    text: &str,
    source: PathBuf,
    modified: Option<SystemTime>,
    size: Option<u64>,
) -> Result<MetaBuilds, String> {
    if source.file_name().and_then(|name| name.to_str()) == Some(TSV_FILE_NAME) {
        return parse_tsv_builds(text, source, modified, size);
    }

    let root: Value = serde_json::from_str(text).map_err(|err| err.to_string())?;
    let generated_at = root
        .get("generatedAt")
        .and_then(Value::as_str)
        .map(str::to_string);
    let latest_patch = root.get("latestPatch").and_then(Value::as_str);
    let min_games = root
        .get("rules")
        .and_then(|rules| rules.get("recommendedMinGames"))
        .and_then(Value::as_u64)
        .unwrap_or(0);
    let builds = root
        .get("builds")
        .and_then(Value::as_object)
        .ok_or_else(|| "missing builds object".to_string())?;

    let mut rows = HashMap::new();

    for scope in ["tournament", "solo"] {
        if let Some(patch) = latest_patch
            .and_then(|patch| builds.get(scope).and_then(|scope_value| scope_value.get(patch)))
        {
            collect_patch_rows(patch, &mut rows, min_games);
        }
    }

    for scope in ["tournament", "solo"] {
        if let Some(patch) = builds.get(scope).and_then(|scope_value| scope_value.get("all")) {
            collect_patch_rows(patch, &mut rows, min_games);
        }
    }

    for scope in ["tournament", "solo"] {
        if let Some(scope_object) = builds.get(scope).and_then(Value::as_object) {
            for (patch_key, patch) in scope_object {
                if Some(patch_key.as_str()) == latest_patch || patch_key == "all" {
                    continue;
                }
                collect_patch_rows(patch, &mut rows, min_games);
            }
        }
    }

    if rows.is_empty() {
        return Err("no usable meta item data found".to_string());
    }

    Ok(MetaBuilds {
        source,
        modified,
        size,
        generated_at,
        rows,
    })
}

fn parse_tsv_builds(
    text: &str,
    source: PathBuf,
    modified: Option<SystemTime>,
    size: Option<u64>,
) -> Result<MetaBuilds, String> {
    let mut rows = HashMap::new();
    for (line_number, raw_line) in text.lines().enumerate() {
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }

        let columns: Vec<&str> = line.split('\t').collect();
        if columns.len() < 2 {
            return Err(format!("line {} has no item directions", line_number + 1));
        }

        let champion = columns[0].trim();
        if champion.is_empty() {
            return Err(format!("line {} has an empty champion id", line_number + 1));
        }

        let mut directions = [ItemBuildOverride::Auto; 3];
        for index in 0..3 {
            if let Some(value) = columns.get(index + 1).map(|value| value.trim()) {
                if value.is_empty() {
                    continue;
                }
                directions[index] = direction_from_token(value)
                    .ok_or_else(|| format!("line {} has unsupported direction {value}", line_number + 1))?;
            }
        }
        rows.insert(champion.to_string(), directions);
    }

    if rows.is_empty() {
        return Err("no usable TSV item data found".to_string());
    }

    Ok(MetaBuilds {
        source,
        modified,
        size,
        generated_at: None,
        rows,
    })
}

fn collect_patch_rows(
    patch: &Value,
    rows: &mut HashMap<String, [ItemBuildOverride; 3]>,
    min_games: u64,
) {
    let Some(champions) = patch.as_object() else {
        return;
    };

    for (champion, by_position) in champions {
        if rows.contains_key(champion) {
            continue;
        }
        if let Some(directions) = best_champion_directions(by_position, min_games) {
            rows.insert(champion.clone(), directions);
        }
    }
}

fn best_champion_directions(value: &Value, min_games: u64) -> Option<[ItemBuildOverride; 3]> {
    const POSITION_ORDER: [&str; 6] = ["all", "top", "jungle", "mid", "bot", "support"];

    for position in POSITION_ORDER {
        if let Some(directions) = value
            .get(position)
            .and_then(|position| best_position_directions(position, min_games))
        {
            return Some(directions);
        }
    }

    value.as_object().and_then(|positions| {
        positions
            .values()
            .find_map(|position| best_position_directions(position, min_games))
    })
}

fn best_position_directions(value: &Value, min_games: u64) -> Option<[ItemBuildOverride; 3]> {
    value
        .get("core3")
        .and_then(|core| best_entry_directions(core, min_games))
        .or_else(|| {
            value
                .get("core2")
                .and_then(|core| best_entry_directions(core, min_games))
        })
}

fn best_entry_directions(value: &Value, min_games: u64) -> Option<[ItemBuildOverride; 3]> {
    let entries = value.as_array()?;
    entries
        .iter()
        .find_map(|entry| {
            if entry_games(entry) >= min_games {
                entry_directions(entry)
            } else {
                None
            }
        })
        .or_else(|| entries.iter().find_map(entry_directions))
}

fn entry_games(value: &Value) -> u64 {
    value.get("games").and_then(Value::as_u64).unwrap_or(0)
}

fn entry_directions(value: &Value) -> Option<[ItemBuildOverride; 3]> {
    value
        .get("directions")
        .and_then(parse_direction_array)
        .or_else(|| value.get("itemIds").and_then(parse_item_id_array))
}

fn parse_direction_array(value: &Value) -> Option<[ItemBuildOverride; 3]> {
    let values = value.as_array()?;
    let mut directions = [ItemBuildOverride::Auto; 3];
    for (index, raw) in values.iter().take(3).enumerate() {
        let direction = raw.as_str().and_then(direction_from_str)?;
        directions[index] = direction;
    }
    Some(directions)
}

fn parse_item_id_array(value: &Value) -> Option<[ItemBuildOverride; 3]> {
    let values = value.as_array()?;
    let mut directions = [ItemBuildOverride::Auto; 3];
    for (index, raw) in values.iter().take(3).enumerate() {
        let item_id = raw.as_u64()?;
        directions[index] = direction_from_item_id(item_id)?;
    }
    Some(directions)
}

fn direction_from_token(value: &str) -> Option<ItemBuildOverride> {
    direction_from_str(value).or_else(|| {
        value
            .parse::<u64>()
            .ok()
            .and_then(direction_from_item_id)
    })
}

fn direction_from_item_id(value: u64) -> Option<ItemBuildOverride> {
    match value {
        0..=4 => Some(ItemBuildOverride::AD),
        5..=9 => Some(ItemBuildOverride::AttackSpeed),
        // Teamfight Manager 2 0.4.11 has no separate armor item override.
        10..=14 => Some(ItemBuildOverride::Hp),
        15..=19 => Some(ItemBuildOverride::MagicResistance),
        20..=24 => Some(ItemBuildOverride::Magic),
        25..=29 => Some(ItemBuildOverride::Hp),
        _ => None,
    }
}

fn direction_from_str(value: &str) -> Option<ItemBuildOverride> {
    match value {
        "AD" => Some(ItemBuildOverride::AD),
        "Magic" => Some(ItemBuildOverride::Magic),
        "AttackSpeed" => Some(ItemBuildOverride::AttackSpeed),
        "MagicResistance" => Some(ItemBuildOverride::MagicResistance),
        "Hp" => Some(ItemBuildOverride::Hp),
        "Auto" => Some(ItemBuildOverride::Auto),
        // Teamfight Manager 2 exposes no separate armor/defense item override in 0.4.11.
        "Defense" => Some(ItemBuildOverride::Hp),
        _ => None,
    }
}

fn find_data_file() -> Option<PathBuf> {
    let cwd = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    let mod_dir = cwd.join("mods").join(MOD_ID);
    let mut candidates = vec![
        mod_dir.join(DATA_FILE_NAME),
        cwd.join("TFM2.gg")
            .join("resources")
            .join("app")
            .join("tfm2_meta_dashboard")
            .join("data")
            .join(DATA_FILE_NAME),
        cwd.join("resources")
            .join("app")
            .join("tfm2_meta_dashboard")
            .join("data")
            .join(DATA_FILE_NAME),
        cwd.join("tfm2_meta_dashboard")
            .join("data")
            .join(DATA_FILE_NAME),
        mod_dir.join("data").join(DATA_FILE_NAME),
    ];

    if let Some(dll_dir) = loaded_module_dir() {
        candidates.push(dll_dir.join(DATA_FILE_NAME));
        candidates.push(dll_dir.join("data").join(DATA_FILE_NAME));
    }

    candidates.push(mod_dir.join("data").join(TSV_FILE_NAME));
    if let Some(dll_dir) = loaded_module_dir() {
        candidates.push(dll_dir.join("data").join(TSV_FILE_NAME));
    }

    candidates.into_iter().find(|path| path.is_file())
}

#[cfg(windows)]
fn loaded_module_dir() -> Option<PathBuf> {
    use std::ffi::{c_void, OsString};
    use std::os::windows::ffi::OsStringExt;
    use std::ptr::null_mut;

    const GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT: u32 = 0x00000002;
    const GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS: u32 = 0x00000004;

    #[link(name = "kernel32")]
    extern "system" {
        fn GetModuleHandleExW(
            dw_flags: u32,
            lp_module_name: *const u16,
            ph_module: *mut *mut c_void,
        ) -> i32;
        fn GetModuleFileNameW(h_module: *mut c_void, lp_filename: *mut u16, n_size: u32) -> u32;
    }

    let mut module = null_mut();
    let address = loaded_module_dir as *const () as *const u16;
    let ok = unsafe {
        GetModuleHandleExW(
            GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
            address,
            &mut module,
        )
    };
    if ok == 0 || module.is_null() {
        return None;
    }

    let mut buffer = vec![0u16; 32768];
    let len = unsafe { GetModuleFileNameW(module, buffer.as_mut_ptr(), buffer.len() as u32) };
    if len == 0 {
        return None;
    }
    buffer.truncate(len as usize);
    PathBuf::from(OsString::from_wide(&buffer))
        .parent()
        .map(Path::to_path_buf)
}

#[cfg(not(windows))]
fn loaded_module_dir() -> Option<PathBuf> {
    None
}

fn mod_dir() -> PathBuf {
    std::env::current_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
        .join("mods")
        .join(MOD_ID)
}

fn log_path() -> PathBuf {
    mod_dir().join("debug.log")
}

fn log_line(message: String) {
    let path = log_path();
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(path) {
        let _ = writeln!(file, "{message}");
    }
}

fn log_error_once(message: String) {
    let state = LAST_ERROR.get_or_init(|| Mutex::new(None));
    if let Ok(mut guard) = state.lock() {
        if guard.as_ref() == Some(&message) {
            return;
        }
        *guard = Some(message.clone());
    }
    log_line(message);
}

fn clear_last_error() {
    if let Some(state) = LAST_ERROR.get() {
        if let Ok(mut guard) = state.lock() {
            *guard = None;
        }
    }
}

fn remember_apply_signature(signature: String) -> bool {
    let state = LAST_APPLY.get_or_init(|| Mutex::new(None));
    if let Ok(mut guard) = state.lock() {
        if guard.as_ref() == Some(&signature) {
            return false;
        }
        *guard = Some(signature);
        true
    } else {
        true
    }
}

fn init(_ctx: &GameCtx) -> ModRegistration {
    log_line("mod: init 0.4.11 client item delegate".to_string());

    let mut reg = ModRegistration::new(MOD_ID);
    reg.set_extension(MetaItemDelegateClient);
    reg
}

declare_mod!(init);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn maps_supported_direction_names() {
        assert!(matches!(direction_from_str("AD"), Some(ItemBuildOverride::AD)));
        assert!(matches!(
            direction_from_str("AttackSpeed"),
            Some(ItemBuildOverride::AttackSpeed)
        ));
        assert!(matches!(
            direction_from_str("MagicResistance"),
            Some(ItemBuildOverride::MagicResistance)
        ));
        assert!(matches!(direction_from_str("Defense"), Some(ItemBuildOverride::Hp)));
    }

    #[test]
    fn parses_latest_patch_all_position_core3() {
        let text = r#"{
            "generatedAt": "test",
            "latestPatch": "2026.0.0",
            "builds": {
                "tournament": {
                    "2026.0.0": {
                        "hunter": {
                            "all": {
                                "core3": [
                                    { "directions": ["AttackSpeed", "AD", "Defense"] }
                                ]
                            }
                        }
                    }
                }
            }
        }"#;

        let builds = parse_builds(text, PathBuf::from("core-item-builds.json"), None, None).unwrap();
        let directions = builds.rows.get("hunter").unwrap();
        assert!(matches!(directions[0], ItemBuildOverride::AttackSpeed));
        assert!(matches!(directions[1], ItemBuildOverride::AD));
        assert!(matches!(directions[2], ItemBuildOverride::Hp));
    }

    #[test]
    fn uses_item_ids_when_directions_are_missing() {
        let text = r#"{
            "latestPatch": "2026.0.0",
            "rules": { "recommendedMinGames": 5 },
            "builds": {
                "tournament": {
                    "2026.0.0": {
                        "fighter": {
                            "all": {
                                "core3": [
                                    { "itemIds": [4, 14, 24], "games": 6 }
                                ]
                            }
                        }
                    }
                }
            }
        }"#;

        let builds = parse_builds(text, PathBuf::from("core-item-builds.json"), None, None).unwrap();
        let directions = builds.rows.get("fighter").unwrap();
        assert!(matches!(directions[0], ItemBuildOverride::AD));
        assert!(matches!(directions[1], ItemBuildOverride::Hp));
        assert!(matches!(directions[2], ItemBuildOverride::Magic));
    }

    #[test]
    fn parses_tsv_fallback_rows() {
        let text = "pyromancer\tMagic\tMagic\tMagic\nfighter\t4\t14\t14\n";
        let builds = parse_builds(text, PathBuf::from(TSV_FILE_NAME), None, None).unwrap();

        let pyromancer = builds.rows.get("pyromancer").unwrap();
        assert!(matches!(pyromancer[0], ItemBuildOverride::Magic));

        let fighter = builds.rows.get("fighter").unwrap();
        assert!(matches!(fighter[0], ItemBuildOverride::AD));
        assert!(matches!(fighter[1], ItemBuildOverride::Hp));
        assert!(matches!(fighter[2], ItemBuildOverride::Hp));
    }
}
