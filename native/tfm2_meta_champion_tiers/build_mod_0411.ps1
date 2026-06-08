param(
    [string]$SdkDir = "",
    [string]$RustupToolchain = ""
)

$ErrorActionPreference = "Stop"

$builder = Join-Path (Split-Path -Parent $PSScriptRoot) "build_tfm2_mod.ps1"
& $builder `
    -ProjectDir $PSScriptRoot `
    -CrateName "tfm2_meta_champion_tiers" `
    -SdkDir $SdkDir `
    -RustupToolchain $RustupToolchain `
    -ExternCrates @("mod_api", "game_core")
