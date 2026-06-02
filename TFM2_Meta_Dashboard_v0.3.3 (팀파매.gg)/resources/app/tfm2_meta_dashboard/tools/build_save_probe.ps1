param(
    [string]$SdkRoot = "",
    [string]$RustupToolchain = "nightly"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $scriptDir "save_probe_047\tfm2_save_probe_047.rs"
$output = Join-Path $scriptDir "tfm2_save_probe.exe"

if (-not $SdkRoot) {
    $candidates = @(
        (Join-Path $scriptDir "..\..\..\..\..\..\2_Mod SDK\mod-sdk"),
        "C:\팀파매2 모딩\2_Mod SDK\mod-sdk"
    )
    foreach ($candidate in $candidates) {
        $resolved = Resolve-Path -LiteralPath $candidate -ErrorAction SilentlyContinue
        if ($resolved) {
            $SdkRoot = $resolved.Path
            break
        }
    }
}

if (-not $SdkRoot -or -not (Test-Path -LiteralPath $SdkRoot)) {
    throw "TFM2 0.4.7 Mod SDK was not found. Pass -SdkRoot <path-to-mod-sdk>."
}

$deps = Join-Path $SdkRoot "deps"
$native = Join-Path $SdkRoot "native"
$gameCore = Get-ChildItem -LiteralPath $deps -Filter "libgame_core-*.rlib" | Select-Object -First 1
if (-not $gameCore) {
    throw "libgame_core-*.rlib was not found under $deps"
}

$rustup = Join-Path $env:USERPROFILE ".cargo\bin\rustup.exe"
if (Test-Path -LiteralPath $rustup) {
    & $rustup run $RustupToolchain rustc --edition 2021 $source -o $output -L "dependency=$deps" -L "native=$native" --extern "game_core=$($gameCore.FullName)"
} else {
    & rustc --edition 2021 $source -o $output -L "dependency=$deps" -L "native=$native" --extern "game_core=$($gameCore.FullName)"
}

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "Built $output"
