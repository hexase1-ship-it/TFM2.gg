# TFM2.gg

Teamfight Manager 2 meta dashboard and addon package workspace.

This repository keeps the source and current package files needed to maintain the TFM2.gg dashboard integration for Teamfight Manager 2 0.4.10.

## Contents

- `TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)/resources/app/` - Electron app resources, dashboard scripts, data generation tools, and save probe source.
- `native/tfm2_meta_item_delegate/` - Rust native mod source rebuilt with the 0.4.10 SDK.
- `tfm2_meta_item_delegate (팀파매.gg 통계 아이템 자동 설정 애드온 모드)/` - installable mod package with `mod.mod_info`, README, current meta JSON, and compiled DLL.
- `tfm2_meta_champion_tiers (팀파매.gg 메타 티어 동기화 애드온 모드)/` - optional addon that applies dashboard-generated champion meta tiers to in-game team champion tier data.
- `tfm2_ai_banpick_probe (팀파매.gg AI 밴픽 보정 애드온 모드)/` - optional addon that adds dashboard-generated meta score bias to native AI ban/pick scoring.

## Policy Exports

Dashboard refresh now writes addon policy TSV files to:

```text
TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)/resources/app/tfm2_meta_dashboard/data/policy_exports/
```

The installer rewrites optional addon `config.ini` files at install time so the game mods read that dashboard policy folder. This keeps the dashboard, meta tier addon, and AI banpick addon on the same generated scoring snapshot.

## Notes

Large packaged runtime artifacts are intentionally excluded from git:

- `TFM2MetaDashboard.exe`
- Electron runtime DLLs and locale packs
- bundled Python runtime
- Rust `target/`
- generated ZIPs and backup folders

The native mod can be rebuilt with:

```powershell
.\native\tfm2_meta_item_delegate\build_mod_049.ps1
```
