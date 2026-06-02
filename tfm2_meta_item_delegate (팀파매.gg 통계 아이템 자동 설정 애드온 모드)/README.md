# TFM2 Meta Item Delegate

Automatically keeps the team's champion personal item-direction defaults synced from dashboard meta data. After ban/pick, the game's normal personal item screen reads those champion defaults, so picked champions use the statistical item directions without pressing a separate button.

The mod reads the first usable file in this order:

```text
mods/tfm2_meta_item_delegate/core-item-builds.json
mods/tfm2_meta_item_delegate/data/core-item-builds.json
resources/app/tfm2_meta_dashboard/data/core-item-builds.json
```

The mod does not change item stats, champion stats, prices, match rules, or balance data. It only writes the same champion personal item-direction override field that the strategy UI already uses.

## How It Runs

- Version 0.2.2 is rebuilt against the Teamfight Manager 2 0.4.7 SDK.
- The mod uses a client-side `InGame` extension and does not register the older server tick hooks that could crash on save load after the 0.4.7 ABI change.
- The parsed meta data is cached and only reloaded when the file path or modified time changes.
- It updates the current player team's `champion_personal_tactics` map only when a champion's saved item directions differ from the meta file.
- Because the game already uses that map when it opens the post-ban/pick personal item screen, the selected champions should appear with their meta item directions automatically.
- Manual item changes may be overwritten again on later sets if the dashboard meta data still recommends a different direction.
- The old `Meta Items` button and strategy UI override are removed. The mod no longer scans or edits the visible strategy UI each frame.

## Selection Logic

For each champion in `builds.tournament`, the mod picks one build with this priority:

1. `latestPatch` from the dashboard file.
2. Patch key `all`.
3. Other patch keys.
4. Position key `all` before role-specific keys, because this mod applies one default build per champion.
5. `core3` before `core2`.
6. Builds with at least `rules.recommendedMinGames`.
7. Higher dashboard `score`.
8. Higher `winRate`.
9. Higher `games`.

The selected dashboard `directions` are mapped directly to the game strategy directions:

```text
AD, Magic, AttackSpeed, MagicResistance, Hp, Auto
```

Teamfight Manager 2 0.4.7 exposes no separate armor/defense item override enum, so dashboard `Defense` directions are mapped to `Hp`.

## Rebuild

```powershell
.\native\tfm2_meta_item_delegate\build_mod_047.ps1
```
