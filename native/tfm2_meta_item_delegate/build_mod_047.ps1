param(
    [string]$SdkDir = ""
)

$ErrorActionPreference = "Stop"

$cargoBin = Join-Path $env:USERPROFILE ".cargo\bin"
if (Test-Path -LiteralPath $cargoBin) {
    $env:PATH = "$cargoBin;$env:PATH"
}
$env:RUSTUP_TOOLCHAIN = "nightly"

$projectDir = $PSScriptRoot
$manifest = Join-Path $projectDir "Cargo.toml"
$targetDir = Join-Path $projectDir "target"
$sdkPath = if ($SdkDir) {
    $SdkDir
} else {
    Join-Path $projectDir "..\..\..\..\..\2_Mod SDK\mod-sdk"
}
$sdk = (Resolve-Path -LiteralPath $sdkPath).Path
$depsDir = Join-Path $sdk "deps"
$nativeDir = Join-Path $sdk "native"

function Get-SdkRlib([string]$crateName) {
    $match = Get-ChildItem -LiteralPath $depsDir -Filter "lib$crateName-*.rlib" | Select-Object -First 1
    if (-not $match) {
        throw "lib$crateName .rlib not found in $depsDir"
    }
    return $match.FullName
}

$modApi = Get-SdkRlib "mod_api"
$gameCore = Get-SdkRlib "game_core"
$serdeJson = Get-SdkRlib "serde_json"

$flags = @(
    "-L",
    "dependency=$depsDir",
    "--extern",
    "mod_api=$modApi",
    "--extern",
    "game_core=$gameCore",
    "--extern",
    "serde_json=$serdeJson"
)
if (Test-Path -LiteralPath $nativeDir) {
    $flags += @("-L", "native=$nativeDir")
}
$env:CARGO_ENCODED_RUSTFLAGS = $flags -join [char]31

cargo rustc --release --manifest-path $manifest --target-dir $targetDir --lib -- --crate-type cdylib
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$builtDll = Join-Path (Join-Path $targetDir "release") "tfm2_meta_item_delegate.dll"
if (-not (Test-Path -LiteralPath $builtDll)) {
    throw "Cargo build finished, but expected DLL was not found: $builtDll"
}

$outDll = Join-Path $projectDir "tfm2_meta_item_delegate.dll"
Copy-Item -LiteralPath $builtDll -Destination $outDll -Force
Write-Host "Build successful: $outDll"
