use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};
use std::time::SystemTime;

use game_core::ChampionTier;
use mod_api::*;

const MOD_ID: &str = "tfm2_meta_champion_tiers";
const POLICY_FILE_NAME: &str = "champion_tier_policy.tsv";

static POLICY_CACHE: OnceLock<Mutex<PolicyCache>> = OnceLock::new();
static LAST_APPLY: OnceLock<Mutex<Option<String>>> = OnceLock::new();
static LAST_ERROR: OnceLock<Mutex<Option<String>>> = OnceLock::new();

#[derive(Clone)]
struct TierPolicy {
    source: PathBuf,
    modified: Option<SystemTime>,
    size: Option<u64>,
    rows: HashMap<String, Option<ChampionTier>>,
}

#[derive(Default)]
struct PolicyCache {
    source: Option<PathBuf>,
    modified: Option<SystemTime>,
    size: Option<u64>,
    policy: Option<TierPolicy>,
}

struct MetaTierClient;
struct MetaTierServer;

impl ModExtension for MetaTierClient {
    fn post_update(
        &self,
        scene: &mut Scene,
        _ui: &mut GameUI,
        _assets: &mut Assets,
        _dt: f32,
    ) {
        let _ = catch_unwind(AssertUnwindSafe(|| apply_policy_to_scene(scene, "client_post_update")));
    }
}

impl ModServerExtension for MetaTierServer {}

fn apply_policy_to_scene(scene: &mut Scene, source_label: &str) {
    let Scene::InGame { data } = scene else {
        return;
    };
    let Some(policy) = load_policy() else {
        return;
    };
    let Ok(mut db) = data.db.try_borrow_mut() else {
        return;
    };

    let mut teams = 0usize;
    let mut changed = 0usize;
    let mut already_matched = 0usize;
    for team in db.teams.values_mut() {
        teams += 1;
        for (champion_id, desired) in &policy.rows {
            match desired {
                Some(tier) => {
                    if team.champion_tiers.get(champion_id) == Some(tier) {
                        already_matched += 1;
                    } else {
                        team.champion_tiers.insert(champion_id.clone(), *tier);
                        changed += 1;
                    }
                }
                None => {
                    if team.champion_tiers.remove(champion_id).is_some() {
                        changed += 1;
                    } else {
                        already_matched += 1;
                    }
                }
            }
        }
    }

    let signature = format!(
        "{source_label}:{:?}:{:?}:{changed}:{already_matched}",
        policy.modified, policy.size
    );
    if changed > 0 && remember_apply_signature(signature) {
        let line = format!(
            "source={source_label} policy_file={} teams={teams} policy_rows={} changed={changed} already_matched={already_matched}",
            policy.source.display(),
            policy.rows.len(),
        );
        log_line(&line);
        write_latest_snapshot(&policy, &line);
    }
}

fn load_policy() -> Option<TierPolicy> {
    let Some(path) = find_policy_file() else {
        log_error_once("policy: champion_tier_policy.tsv not found".to_string());
        return None;
    };
    let metadata = fs::metadata(&path).ok();
    let modified = metadata.as_ref().and_then(|meta| meta.modified().ok());
    let size = metadata.as_ref().map(|meta| meta.len());
    let cache = POLICY_CACHE.get_or_init(|| Mutex::new(PolicyCache::default()));

    if let Ok(mut guard) = cache.lock() {
        if guard.source.as_ref() == Some(&path)
            && guard.modified == modified
            && guard.size == size
        {
            return guard.policy.clone();
        }

        match fs::read_to_string(&path)
            .map_err(|err| err.to_string())
            .and_then(|text| parse_policy(&text, path.clone(), modified, size))
        {
            Ok(policy) => {
                log_line(&format!(
                    "policy: loaded {} champion tiers from {}",
                    policy.rows.len(),
                    policy.source.display()
                ));
                guard.source = Some(path);
                guard.modified = modified;
                guard.size = size;
                guard.policy = Some(policy.clone());
                clear_last_error();
                Some(policy)
            }
            Err(err) => {
                log_error_once(format!("policy: parse failed {}: {err}", path.display()));
                guard.source = Some(path);
                guard.modified = modified;
                guard.size = size;
                guard.policy = None;
                None
            }
        }
    } else {
        None
    }
}

fn parse_policy(
    text: &str,
    source: PathBuf,
    modified: Option<SystemTime>,
    size: Option<u64>,
) -> Result<TierPolicy, String> {
    let mut rows = HashMap::new();
    for (line_number, raw_line) in text.lines().enumerate() {
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let columns: Vec<&str> = line.split('\t').collect();
        if columns.len() < 2 {
            continue;
        }
        if columns[0].eq_ignore_ascii_case("champion_id") {
            continue;
        }
        let champion_id = columns[0].trim();
        if champion_id.is_empty() {
            continue;
        }
        let tier = parse_tier(columns[1].trim(), columns.get(2).copied())
            .map_err(|err| format!("line {}: {err}", line_number + 1))?;
        rows.insert(champion_id.to_string(), tier);
    }

    if rows.is_empty() {
        return Err("no usable policy rows found".to_string());
    }

    Ok(TierPolicy {
        source,
        modified,
        size,
        rows,
    })
}

fn parse_tier(label: &str, overall: Option<&str>) -> Result<Option<ChampionTier>, String> {
    match label.trim().to_ascii_uppercase().as_str() {
        "S" | "OP" => Ok(Some(ChampionTier::S)),
        "A" | "1" => Ok(Some(ChampionTier::A)),
        "B" | "2" => Ok(Some(ChampionTier::B)),
        "C" | "3" => Ok(Some(ChampionTier::C)),
        "D" | "4" => Ok(Some(ChampionTier::D)),
        "NO" | "NO-TIER" | "NONE" | "-" => Ok(Some(ChampionTier::NoTier)),
        "" => derive_tier_from_overall(overall),
        other => derive_tier_from_overall(overall)
            .map_err(|_| format!("unknown tier '{other}'")),
    }
}

fn derive_tier_from_overall(overall: Option<&str>) -> Result<Option<ChampionTier>, String> {
    let value = overall
        .and_then(|text| text.trim().parse::<f32>().ok())
        .ok_or_else(|| "missing tier and overall".to_string())?;
    if value >= 85.0 {
        Ok(Some(ChampionTier::S))
    } else if value >= 72.0 {
        Ok(Some(ChampionTier::A))
    } else if value >= 60.0 {
        Ok(Some(ChampionTier::B))
    } else if value >= 48.0 {
        Ok(Some(ChampionTier::C))
    } else {
        Ok(Some(ChampionTier::D))
    }
}

fn find_policy_file() -> Option<PathBuf> {
    let mod_dir = mod_dir();
    let config = read_config(&mod_dir.join("config.ini"));
    let policy_file = config
        .get("policy_file")
        .cloned()
        .unwrap_or_else(|| POLICY_FILE_NAME.to_string());

    let mut candidates = Vec::new();
    if let Some(path) = config.get("policy_path") {
        candidates.push(PathBuf::from(path));
    }
    if let Some(dir) = config.get("policy_dir") {
        candidates.push(PathBuf::from(dir).join(&policy_file));
    }
    if let Some(game_dir) = game_dir() {
        candidates.push(
            game_dir
                .join("TFM2.gg")
                .join("resources")
                .join("app")
                .join("tfm2_meta_dashboard")
                .join("data")
                .join("policy_exports")
                .join(&policy_file),
        );
        candidates.push(
            game_dir
                .join("TFM2_Meta_Dashboard")
                .join("resources")
                .join("app")
                .join("tfm2_meta_dashboard")
                .join("data")
                .join("policy_exports")
                .join(&policy_file),
        );
    }
    candidates.push(mod_dir.join(&policy_file));
    candidates.into_iter().find(|path| path.is_file())
}

fn read_config(path: &Path) -> HashMap<String, String> {
    let mut result = HashMap::new();
    let Ok(text) = fs::read_to_string(path) else {
        return result;
    };
    for raw_line in text.lines() {
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') || line.starts_with(';') {
            continue;
        }
        let Some((key, value)) = line.split_once('=') else {
            continue;
        };
        result.insert(key.trim().to_ascii_lowercase(), value.trim().to_string());
    }
    result
}

fn game_dir() -> Option<PathBuf> {
    std::env::current_exe()
        .ok()
        .and_then(|path| path.parent().map(Path::to_path_buf))
}

fn mod_dir() -> PathBuf {
    if let Some(game_dir) = game_dir() {
        let candidate = game_dir.join("mods").join(MOD_ID);
        if candidate.is_dir() {
            return candidate;
        }
    }
    std::env::current_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
        .join(MOD_ID)
}

fn log_line(message: &str) {
    let path = mod_dir().join("debug.log");
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&path) {
        let _ = writeln!(file, "{message}");
    }
}

fn log_error_once(message: String) {
    let slot = LAST_ERROR.get_or_init(|| Mutex::new(None));
    if let Ok(mut guard) = slot.lock() {
        if guard.as_ref() == Some(&message) {
            return;
        }
        *guard = Some(message.clone());
    }
    log_line(&message);
}

fn clear_last_error() {
    if let Some(slot) = LAST_ERROR.get() {
        if let Ok(mut guard) = slot.lock() {
            *guard = None;
        }
    }
}

fn remember_apply_signature(signature: String) -> bool {
    let slot = LAST_APPLY.get_or_init(|| Mutex::new(None));
    if let Ok(mut guard) = slot.lock() {
        if guard.as_ref() == Some(&signature) {
            return false;
        }
        *guard = Some(signature);
        true
    } else {
        false
    }
}

fn write_latest_snapshot(policy: &TierPolicy, summary: &str) {
    let path = mod_dir().join("tier-policy-latest.txt");
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    if let Ok(mut file) = OpenOptions::new().create(true).write(true).truncate(true).open(path) {
        let _ = writeln!(file, "{summary}");
        let _ = writeln!(file, "source={}", policy.source.display());
        for (champion, tier) in &policy.rows {
            let label = tier.map(tier_label).unwrap_or("No");
            let _ = writeln!(file, "{champion}\t{label}");
        }
    }
}

fn tier_label(tier: ChampionTier) -> &'static str {
    match tier {
        ChampionTier::S => "S",
        ChampionTier::A => "A",
        ChampionTier::B => "B",
        ChampionTier::C => "C",
        ChampionTier::D => "D",
        ChampionTier::NoTier => "No",
    }
}

fn init(_ctx: &GameCtx) -> ModRegistration {
    log_line("mod: init 0.4.10 source meta champion tiers");
    let mut reg = ModRegistration::new(MOD_ID);
    reg.set_extension(MetaTierClient);
    reg.set_server_extension(MetaTierServer);
    reg
}

declare_mod!(init);
