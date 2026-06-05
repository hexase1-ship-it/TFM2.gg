param(
    [string]$SdkRoot = "",
    [string]$RustupToolchain = "nightly"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $scriptDir "save_probe_047\tfm2_save_probe_047.rs"
$output = Join-Path $scriptDir "tfm2_save_probe.exe"

function Find-SdkRoot {
    param([string]$StartDir)

    $preferredVersion = "0.4.10"
    $cursor = (Resolve-Path -LiteralPath $StartDir).Path
    while ($cursor) {
        $sdkHome = Join-Path $cursor "2_Mod SDK"
        if (Test-Path -LiteralPath $sdkHome) {
            $preferred = Join-Path $sdkHome "$preferredVersion\mod-sdk"
            if (Test-Path -LiteralPath $preferred) {
                return $preferred
            }

            $latest = Get-ChildItem -LiteralPath $sdkHome -Directory -ErrorAction SilentlyContinue |
                Sort-Object Name -Descending |
                ForEach-Object { Join-Path $_.FullName "mod-sdk" } |
                Where-Object { Test-Path -LiteralPath $_ } |
                Select-Object -First 1
            if ($latest) {
                return $latest
            }

            $legacy = Join-Path $sdkHome "mod-sdk"
            if (Test-Path -LiteralPath $legacy) {
                return $legacy
            }
        }

        $parent = Split-Path -Parent $cursor
        if (-not $parent -or $parent -eq $cursor) {
            break
        }
        $cursor = $parent
    }

    return $null
}

function Resolve-SdkToolchain {
    param(
        [string]$SdkRoot,
        [string]$RequestedToolchain
    )

    if (-not [string]::IsNullOrWhiteSpace($RequestedToolchain) -and $RequestedToolchain -ne "nightly") {
        return $RequestedToolchain
    }

    $toolchainFile = Join-Path $SdkRoot "toolchain_version.txt"
    if (Test-Path -LiteralPath $toolchainFile) {
        $text = Get-Content -LiteralPath $toolchainFile -Raw
        if ($text -match "\((?<hash>[0-9a-f]+)\s+(?<date>\d{4}-\d{2}-\d{2})\)") {
            $date = [DateTime]::ParseExact($Matches.date, "yyyy-MM-dd", [Globalization.CultureInfo]::InvariantCulture)
            return "nightly-" + $date.AddDays(1).ToString("yyyy-MM-dd")
        }
    }

    return $RequestedToolchain
}

if (-not $SdkRoot) {
    $SdkRoot = Find-SdkRoot -StartDir $scriptDir
}

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
    throw "TFM2 compatible Mod SDK was not found. Pass -SdkRoot <path-to-mod-sdk>."
}

$deps = Join-Path $SdkRoot "deps"
$native = Join-Path $SdkRoot "native"
$gameCore = Get-ChildItem -LiteralPath $deps -Filter "libgame_core-*.rlib" | Select-Object -First 1
if (-not $gameCore) {
    throw "libgame_core-*.rlib was not found under $deps"
}

$toolchain = Resolve-SdkToolchain -SdkRoot $SdkRoot -RequestedToolchain $RustupToolchain
$rustup = Join-Path $env:USERPROFILE ".cargo\bin\rustup.exe"
if (Test-Path -LiteralPath $rustup) {
    & $rustup run $toolchain rustc --edition 2021 $source -o $output -L "dependency=$deps" -L "native=$native" --extern "game_core=$($gameCore.FullName)"
} else {
    & rustc --edition 2021 $source -o $output -L "dependency=$deps" -L "native=$native" --extern "game_core=$($gameCore.FullName)"
}

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "Built $output"
