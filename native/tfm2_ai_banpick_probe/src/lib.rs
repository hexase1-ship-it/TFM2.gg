use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{Mutex, OnceLock};
use std::time::SystemTime;

use mod_api::*;

const MOD_ID: &str = "tfm2_ai_banpick_probe";
const POLICY_FILE_NAME: &str = "ai_champion_policy.tsv";
const DEFAULT_LOG_LIMIT: usize = 240;

static POLICY_CACHE: OnceLock<Mutex<PolicyCache>> = OnceLock::new();
static LAST_ERROR: OnceLock<Mutex<Option<String>>> = OnceLock::new();
static HOOK_LOG_REMAINING: AtomicUsize = AtomicUsize::new(DEFAULT_LOG_LIMIT);
static HOOK_LOG_LIMIT_REACHED: AtomicBool = AtomicBool::new(false);

#[derive(Debug)]
struct AiBanpickHook;

#[derive(Clone)]
struct AiPolicyRow {
    champion_id: String,
    tier: String,
    overall: f32,
}

#[derive(Clone)]
struct AiConfig {
    enabled: bool,
    overall_neutral: f32,
    overall_divisor: f32,
    min_bias: f32,
    max_bias: f32,
}

#[derive(Clone)]
struct AiPolicy {
    source: PathBuf,
    rows_by_candidate: Vec<Option<AiPolicyRow>>,
    config: AiConfig,
}

#[derive(Default)]
struct PolicyCache {
    source: Option<PathBuf>,
    modified: Option<SystemTime>,
    size: Option<u64>,
    policy: Option<AiPolicy>,
}

impl Default for AiConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            overall_neutral: 50.0,
            overall_divisor: 20.0,
            min_bias: -1.5,
            max_bias: 1.5,
        }
    }
}

impl ModDraftScoreHook for AiBanpickHook {
    fn id(&self) -> &str {
        "tfm2gg_ai_banpick_policy"
    }

    fn score_ban(
        &self,
        ctx: &DraftScoreContext<'_>,
        candidate: usize,
        base_score: f32,
    ) -> DraftScoreDecision {
        score_candidate("ban", ctx, candidate, base_score)
    }

    fn score_pick(
        &self,
        ctx: &DraftScoreContext<'_>,
        candidate: usize,
        base_score: f32,
    ) -> DraftScoreDecision {
        score_candidate("pick", ctx, candidate, base_score)
    }
}

fn score_candidate(
    phase: &str,
    ctx: &DraftScoreContext<'_>,
    candidate: usize,
    base_score: f32,
) -> DraftScoreDecision {
    let Some(policy) = load_policy() else {
        return DraftScoreDecision::Pass;
    };
    if !policy.config.enabled {
        return DraftScoreDecision::Pass;
    }
    let Some(row) = policy
        .rows_by_candidate
        .get(candidate)
        .and_then(|value| value.as_ref())
    else {
        return DraftScoreDecision::Pass;
    };

    let divisor = if policy.config.overall_divisor.abs() < 0.001 {
        20.0
    } else {
        policy.config.overall_divisor
    };
    let bias = ((row.overall - policy.config.overall_neutral) / divisor)
        .clamp(policy.config.min_bias, policy.config.max_bias);
    if bias.abs() < 0.0001 {
        log_hook(phase, candidate, row, base_score, base_score, ctx);
        return DraftScoreDecision::Pass;
    }
    let replacement = base_score + bias;
    log_hook(phase, candidate, row, base_score, replacement, ctx);
    DraftScoreDecision::Add(bias)
}

fn load_policy() -> Option<AiPolicy> {
    let config = read_all_config();
    let Some(path) = find_policy_file(&config) else {
        log_error_once("policy: ai_champion_policy.tsv not found".to_string());
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

        let policy_result = fs::read_to_string(&path)
            .map_err(|err| err.to_string())
            .and_then(|text| parse_policy(&text, path.clone(), ai_config(&config)));
        match policy_result {
            Ok(policy) => {
                let row_count = policy
                    .rows_by_candidate
                    .iter()
                    .filter(|entry| entry.is_some())
                    .count();
                log_line(&format!(
                    "policy: loaded {row_count} AI champion rows from {}",
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
    config: AiConfig,
) -> Result<AiPolicy, String> {
    let mut rows_by_candidate: Vec<Option<AiPolicyRow>> = Vec::new();
    for (line_number, raw_line) in text.lines().enumerate() {
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let columns: Vec<&str> = line.split('\t').collect();
        if columns.len() < 3 {
            continue;
        }
        if columns[0].eq_ignore_ascii_case("champion_id") {
            continue;
        }
        let champion_id = columns[0].trim();
        let tier = columns[1].trim();
        let overall = columns[2]
            .trim()
            .parse::<f32>()
            .map_err(|err| format!("line {}: invalid overall: {err}", line_number + 1))?;
        let candidate_index = columns
            .get(3)
            .and_then(|value| value.trim().parse::<usize>().ok())
            .or_else(|| canonical_candidate_index(champion_id));
        let Some(candidate_index) = candidate_index else {
            continue;
        };
        if rows_by_candidate.len() <= candidate_index {
            rows_by_candidate.resize(candidate_index + 1, None);
        }
        rows_by_candidate[candidate_index] = Some(AiPolicyRow {
            champion_id: champion_id.to_string(),
            tier: tier.to_string(),
            overall,
        });
    }

    if rows_by_candidate.iter().all(|row| row.is_none()) {
        return Err("no usable policy rows found".to_string());
    }

    Ok(AiPolicy {
        source,
        rows_by_candidate,
        config,
    })
}

fn canonical_candidate_index(champion_id: &str) -> Option<usize> {
    CANONICAL_CHAMPIONS
        .iter()
        .position(|candidate| *candidate == champion_id)
}

fn read_all_config() -> HashMap<String, String> {
    let mut result = HashMap::new();
    for path in [mod_dir().join("config.ini"), mod_dir().join("ai_banpick_config.ini")] {
        for (key, value) in read_config(&path) {
            result.insert(key, value);
        }
    }
    result
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

fn ai_config(raw: &HashMap<String, String>) -> AiConfig {
    let default = AiConfig::default();
    AiConfig {
        enabled: raw
            .get("enabled")
            .and_then(|value| parse_bool(value))
            .unwrap_or(default.enabled),
        overall_neutral: parse_f32(raw.get("overall_neutral"), default.overall_neutral),
        overall_divisor: parse_f32(raw.get("overall_divisor"), default.overall_divisor),
        min_bias: parse_f32(raw.get("min_bias"), default.min_bias),
        max_bias: parse_f32(raw.get("max_bias"), default.max_bias),
    }
}

fn parse_bool(value: &str) -> Option<bool> {
    match value.trim().to_ascii_lowercase().as_str() {
        "1" | "true" | "yes" | "on" => Some(true),
        "0" | "false" | "no" | "off" => Some(false),
        _ => None,
    }
}

fn parse_f32(value: Option<&String>, fallback: f32) -> f32 {
    value
        .and_then(|text| text.trim().parse::<f32>().ok())
        .filter(|value| value.is_finite())
        .unwrap_or(fallback)
}

fn find_policy_file(config: &HashMap<String, String>) -> Option<PathBuf> {
    let mod_dir = mod_dir();
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

fn log_hook(
    phase: &str,
    candidate: usize,
    row: &AiPolicyRow,
    base_score: f32,
    replacement: f32,
    ctx: &DraftScoreContext<'_>,
) {
    let remaining = HOOK_LOG_REMAINING.load(Ordering::Relaxed);
    if remaining == 0 {
        if !HOOK_LOG_LIMIT_REACHED.swap(true, Ordering::Relaxed) {
            log_line("draft_score_hook log limit reached");
        }
        return;
    }
    if HOOK_LOG_REMAINING
        .compare_exchange(remaining, remaining - 1, Ordering::Relaxed, Ordering::Relaxed)
        .is_err()
    {
        return;
    }
    log_line(&format!(
        "draft_score_hook {phase}: candidate={candidate} champion={} tier={} overall={:.1} base={:.3} replacement={:.3} ctx={ctx:?}",
        row.champion_id, row.tier, row.overall, base_score, replacement
    ));
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
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(path) {
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

fn init(_ctx: &GameCtx) -> ModRegistration {
    log_line("mod: init 0.4.10 source AI banpick policy");
    let mut reg = ModRegistration::new(MOD_ID);
    reg.add_draft_score_hook(AiBanpickHook);
    reg
}

declare_mod!(init);

const CANONICAL_CHAMPIONS: &[&str] = &[
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
];
