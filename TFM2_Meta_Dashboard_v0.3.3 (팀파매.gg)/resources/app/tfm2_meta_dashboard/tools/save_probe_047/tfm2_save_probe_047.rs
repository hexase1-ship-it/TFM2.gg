use std::env;
use std::error::Error;
use std::fmt::Debug;
use std::fs;
use std::path::{Path, PathBuf};
use std::process;

use game_core::Database;

fn main() {
    if let Err(err) = run() {
        eprintln!("{err}");
        process::exit(1);
    }
}

fn run() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        return Err("usage: tfm2_save_probe.exe <save-path-or-file-name> <output-dir>".into());
    }

    let requested_save = args[1].trim_matches('"').to_string();
    let out_dir = PathBuf::from(args[2].trim_matches('"'));
    fs::create_dir_all(&out_dir)?;

    let load_name = save_name_for_database_load(&requested_save)?;
    let database = match Database::load(&load_name) {
        Ok(database) => database,
        Err(err) => {
            write_probe_manifest(
                &out_dir,
                &[
                    ("save", requested_save.as_str()),
                    ("load_name", load_name.as_str()),
                    ("decode", "failed"),
                    ("error", &format!("{err:?}")),
                ],
            )?;
            return Err(format!("Database::load failed for {requested_save}: {err:?}").into());
        }
    };

    let teams = write_debug(&out_dir, "teams.debug.txt", &database.teams)?;
    let athletes = write_debug(&out_dir, "athletes.debug.txt", &database.athletes)?;
    write_debug(
        &out_dir,
        "champion_patch_statistics.debug.txt",
        &database.champion_patch_statistics,
    )?;
    let solo_rank_matches =
        write_debug(&out_dir, "solo_rank_matches.debug.txt", &database.solo_rank_matches)?;
    let match_replays = write_debug(&out_dir, "match_replays.debug.txt", &database.match_replays)?;
    let league_competitions = write_debug(
        &out_dir,
        "league_competitions.debug.txt",
        &database.league_competitions,
    )?;
    let tournament_competitions = write_debug(
        &out_dir,
        "tournament_competitions.debug.txt",
        &database.tournament_competitions,
    )?;
    let year_schedules =
        write_debug(&out_dir, "year_schedules.debug.txt", &database.year_schedules)?;
    let match_stats = write_debug(&out_dir, "match_stats.debug.txt", &database.match_stats)?;
    write_debug(
        &out_dir,
        "champion_info_sheet.debug.txt",
        &database.champion_info_sheet,
    )?;
    write_debug(&out_dir, "pre_patch_data.debug.txt", &database.pre_patch_data)?;
    write_debug(
        &out_dir,
        "champion_action_patch_state.debug.txt",
        &database.champion_action_patch_state,
    )?;

    let rows = [
        ("reason", "save_probe".to_string()),
        ("save", requested_save.clone()),
        ("load_name", load_name),
        ("decode", "ok".to_string()),
        ("teams", count_data_table_debug_entries(&teams).to_string()),
        (
            "athletes",
            count_data_table_debug_entries(&athletes).to_string(),
        ),
        (
            "champion_patch_statistics",
            database.champion_patch_statistics.len().to_string(),
        ),
        (
            "solo_rank_matches",
            count_data_table_debug_entries(&solo_rank_matches).to_string(),
        ),
        (
            "match_replays",
            count_data_table_debug_entries(&match_replays).to_string(),
        ),
        (
            "league_competitions",
            count_data_table_debug_entries(&league_competitions).to_string(),
        ),
        (
            "tournament_competitions",
            count_data_table_debug_entries(&tournament_competitions).to_string(),
        ),
        (
            "year_schedules",
            count_data_table_debug_entries(&year_schedules).to_string(),
        ),
        (
            "match_stats",
            count_data_table_debug_entries(&match_stats).to_string(),
        ),
    ];
    write_manifest(&out_dir.join("manifest.tsv"), &rows)?;
    write_manifest(&out_dir.join("save_probe_manifest.tsv"), &rows[1..])?;

    println!(
        "save_probe ok: save={} teams={} athletes={} match_replays={}",
        requested_save,
        rows[4].1,
        rows[5].1,
        rows[8].1
    );
    Ok(())
}

fn save_name_for_database_load(save: &str) -> Result<String, Box<dyn Error>> {
    let path = Path::new(save);
    if path.is_absolute() {
        return path
            .file_name()
            .map(|name| name.to_string_lossy().into_owned())
            .ok_or_else(|| format!("save path has no file name: {save}").into());
    }
    Ok(save.to_string())
}

fn write_debug<T: Debug>(
    out_dir: &Path,
    file_name: &str,
    value: &T,
) -> Result<String, Box<dyn Error>> {
    let text = format!("{value:#?}\n");
    fs::write(out_dir.join(file_name), text.as_bytes())?;
    Ok(text)
}

fn write_manifest(path: &Path, rows: &[(&str, String)]) -> Result<(), Box<dyn Error>> {
    let mut text = String::from("field\tvalue\n");
    for (field, value) in rows {
        text.push_str(field);
        text.push('\t');
        text.push_str(&value.replace(['\r', '\n', '\t'], " "));
        text.push('\n');
    }
    fs::write(path, text)?;
    Ok(())
}

fn write_probe_manifest(out_dir: &Path, rows: &[(&str, &str)]) -> Result<(), Box<dyn Error>> {
    let mut text = String::from("field\tvalue\n");
    for (field, value) in rows {
        text.push_str(field);
        text.push('\t');
        text.push_str(&value.replace(['\r', '\n', '\t'], " "));
        text.push('\n');
    }
    fs::write(out_dir.join("save_probe_manifest.tsv"), text)?;
    Ok(())
}

fn count_data_table_debug_entries(text: &str) -> usize {
    let Some(data_start) = text.find("data: {") else {
        return 0;
    };
    let body = &text[(data_start + "data: ".len())..];
    count_top_level_map_entries(body)
}

fn count_top_level_map_entries(text: &str) -> usize {
    let mut depth = 0usize;
    let mut count = 0usize;
    let mut in_string = false;
    let mut escape = false;
    let mut started = false;

    for ch in text.chars() {
        if in_string {
            if escape {
                escape = false;
            } else if ch == '\\' {
                escape = true;
            } else if ch == '"' {
                in_string = false;
            }
            continue;
        }

        match ch {
            '"' => in_string = true,
            '{' | '[' | '(' => {
                depth += 1;
                started = true;
            }
            '}' | ']' | ')' => {
                if depth == 0 {
                    return count;
                }
                depth -= 1;
                if started && depth == 0 {
                    return count;
                }
            }
            ':' if depth == 1 => count += 1,
            _ => {}
        }
    }

    count
}
