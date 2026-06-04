use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};
use std::time::SystemTime;

use game_core::ItemBuildOverride;
use mod_api::*;
use serde_json::Value;

const MOD_ID: &str = "tfm2_meta_item_delegate";
const DATA_FILE_NAME: &str = "core-item-builds.json";

static BUILD_CACHE: OnceLock<Mutex<BuildCache>> = OnceLock::new();
static LAST_APPLY: OnceLock<Mutex<Option<String>>> = OnceLock::new();
static LAST_ERROR: OnceLock<Mutex<Option<String>>> = OnceLock::new();

#[derive(Clone)]
struct MetaBuilds {
    source: PathBuf,
    modified: Option<SystemTime>,
    generated_at: Option<String>,
    rows: HashMap<String, [ItemBuildOverride; 3]>,
}

#[derive(Default)]
struct BuildCache {
    source: Option<PathBuf>,
    modified: Option<SystemTime>,
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

    let Some(builds) = load_builds() else {
        return;
    };

    let Ok(mut db) = data.db.try_borrow_mut() else {
        return;
    };

    let team_id = db.player_team_id();
    let Some(team) = db.teams.get_mut(&team_id) else {
        log_error_once(format!("apply: player team {team_id} not found"));
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
        "{}:{}:{}:{}:{:?}",
        team_id,
        changed,
        before,
        after,
        builds.modified
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

    let modified = fs::metadata(&path).and_then(|meta| meta.modified()).ok();
    let cache = BUILD_CACHE.get_or_init(|| Mutex::new(BuildCache::default()));
    if let Ok(mut guard) = cache.lock() {
        if guard.source.as_ref() == Some(&path) && guard.modified == modified {
            return guard.builds.clone();
        }

        match fs::read_to_string(&path)
            .map_err(|err| err.to_string())
            .and_then(|text| parse_builds(&text, path.clone(), modified))
        {
            Ok(builds) => {
                log_line(format!(
                    "data: loaded {} rows from {}",
                    builds.rows.len(),
                    builds.source.display()
                ));
                guard.source = Some(path);
                guard.modified = modified;
                guard.builds = Some(builds.clone());
                clear_last_error();
                Some(builds)
            }
            Err(err) => {
                log_error_once(format!("data: parse failed {}: {err}", path.display()));
                guard.source = Some(path);
                guard.modified = modified;
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
) -> Result<MetaBuilds, String> {
    let root: Value = serde_json::from_str(text).map_err(|err| err.to_string())?;
    let generated_at = root
        .get("generatedAt")
        .and_then(Value::as_str)
        .map(str::to_string);
    let latest_patch = root.get("latestPatch").and_then(Value::as_str);
    let tournament = root
        .get("builds")
        .and_then(|value| value.get("tournament"))
        .and_then(Value::as_object)
        .ok_or_else(|| "missing builds.tournament object".to_string())?;

    let mut rows = HashMap::new();
    if let Some(patch) = latest_patch.and_then(|patch| tournament.get(patch)) {
        collect_patch_rows(patch, &mut rows);
    }

    if rows.is_empty() {
        for patch in tournament.values() {
            collect_patch_rows(patch, &mut rows);
        }
    }

    if rows.is_empty() {
        return Err("no usable meta item data found".to_string());
    }

    Ok(MetaBuilds {
        source,
        modified,
        generated_at,
        rows,
    })
}

fn collect_patch_rows(patch: &Value, rows: &mut HashMap<String, [ItemBuildOverride; 3]>) {
    let Some(champions) = patch.as_object() else {
        return;
    };

    for (champion, by_position) in champions {
        if rows.contains_key(champion) {
            continue;
        }
        if let Some(directions) = best_champion_directions(by_position) {
            rows.insert(champion.clone(), directions);
        }
    }
}

fn best_champion_directions(value: &Value) -> Option<[ItemBuildOverride; 3]> {
    const POSITION_ORDER: [&str; 6] = ["all", "top", "jungle", "mid", "bot", "support"];

    for position in POSITION_ORDER {
        if let Some(directions) = value.get(position).and_then(best_position_directions) {
            return Some(directions);
        }
    }

    value
        .as_object()
        .and_then(|positions| positions.values().find_map(best_position_directions))
}

fn best_position_directions(value: &Value) -> Option<[ItemBuildOverride; 3]> {
    value
        .get("core3")
        .and_then(first_entry_directions)
        .or_else(|| value.get("core2").and_then(first_entry_directions))
}

fn first_entry_directions(value: &Value) -> Option<[ItemBuildOverride; 3]> {
    value
        .as_array()
        .and_then(|entries| entries.first())
        .and_then(|entry| entry.get("directions"))
        .and_then(parse_direction_array)
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

fn direction_from_str(value: &str) -> Option<ItemBuildOverride> {
    match value {
        "AD" => Some(ItemBuildOverride::AD),
        "Magic" => Some(ItemBuildOverride::Magic),
        "AttackSpeed" => Some(ItemBuildOverride::AttackSpeed),
        "MagicResistance" => Some(ItemBuildOverride::MagicResistance),
        "Hp" => Some(ItemBuildOverride::Hp),
        "Auto" => Some(ItemBuildOverride::Auto),
        // Teamfight Manager 2 exposes no separate armor/defense item override in 0.4.8.
        "Defense" => Some(ItemBuildOverride::Hp),
        _ => None,
    }
}

fn find_data_file() -> Option<PathBuf> {
    let cwd = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    let mod_dir = cwd.join("mods").join(MOD_ID);
    let candidates = [
        mod_dir.join(DATA_FILE_NAME),
        mod_dir.join("data").join(DATA_FILE_NAME),
        cwd.join("resources")
            .join("app")
            .join("tfm2_meta_dashboard")
            .join("data")
            .join(DATA_FILE_NAME),
    ];

    candidates.into_iter().find(|path| path.is_file())
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
    log_line("mod: init 0.4.8 client item delegate".to_string());

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

        let builds = parse_builds(text, PathBuf::from("core-item-builds.json"), None).unwrap();
        let directions = builds.rows.get("hunter").unwrap();
        assert!(matches!(directions[0], ItemBuildOverride::AttackSpeed));
        assert!(matches!(directions[1], ItemBuildOverride::AD));
        assert!(matches!(directions[2], ItemBuildOverride::Hp));
    }
}
