# TFM2.gg

Teamfight Manager 2 meta dashboard and item-delegate mod workspace.

This repository keeps the source and current mod package files needed to maintain the TFM2.gg dashboard integration for Teamfight Manager 2 0.4.8.

## Contents

- `TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)/resources/app/` - Electron app resources, dashboard scripts, data generation tools, and save probe source.
- `native/tfm2_meta_item_delegate/` - Rust native mod source built with the 0.4.7 SDK and verified against 0.4.8.
- `tfm2_meta_item_delegate (팀파매.gg 통계 아이템 자동 설정 애드온 모드)/` - installable mod package with `mod.mod_info`, README, current meta JSON, and compiled DLL.

## Notes

Large packaged runtime artifacts are intentionally excluded from git:

- `TFM2MetaDashboard.exe`
- Electron runtime DLLs and locale packs
- bundled Python runtime
- Rust `target/`
- generated ZIPs and backup folders

The native mod can be rebuilt with:

```powershell
.\native\tfm2_meta_item_delegate\build_mod_048.ps1
```
