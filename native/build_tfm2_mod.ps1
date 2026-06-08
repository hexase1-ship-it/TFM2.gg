param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectDir,
    [Parameter(Mandatory = $true)]
    [string]$CrateName,
    [string]$SdkDir = "",
    [string]$RustupToolchain = "",
    [string[]]$ExternCrates = @("mod_api")
)

$ErrorActionPreference = "Stop"

$cargoBin = Join-Path $env:USERPROFILE ".cargo\bin"
if (Test-Path -LiteralPath $cargoBin) {
    $env:PATH = "$cargoBin;$env:PATH"
}

$projectPath = (Resolve-Path -LiteralPath $ProjectDir).Path
$manifest = Join-Path $projectPath "Cargo.toml"
$targetDir = Join-Path $projectPath "target"

function Find-SdkRoot {
    param([string]$StartDir)

    $preferredVersion = "0.4.11"
    $cursor = (Resolve-Path -LiteralPath $StartDir).Path
    while ($cursor) {
        $sdkHome = Join-Path $cursor "2_Mod SDK"
        if (Test-Path -LiteralPath $sdkHome) {
            $preferred = Join-Path $sdkHome "$preferredVersion\mod-sdk"
            if (Test-Path -LiteralPath $preferred) {
                return $preferred
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

    if (-not [string]::IsNullOrWhiteSpace($RequestedToolchain)) {
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

    return "nightly"
}

$sdkPath = if ($SdkDir) { $SdkDir } else { Find-SdkRoot -StartDir $projectPath }
if (-not $sdkPath) {
    throw "TFM2 compatible Mod SDK was not found. Pass -SdkDir <path-to-mod-sdk>."
}

$sdk = (Resolve-Path -LiteralPath $sdkPath).Path
$depsDir = Join-Path $sdk "deps"
$nativeDir = Join-Path $sdk "native"
$toolchain = Resolve-SdkToolchain -SdkRoot $sdk -RequestedToolchain $RustupToolchain
$env:RUSTUP_TOOLCHAIN = $toolchain

function Get-SdkRlib([string]$crateName) {
    $match = Get-ChildItem -LiteralPath $depsDir -Filter "lib$crateName-*.rlib" | Select-Object -First 1
    if (-not $match) {
        throw "lib$crateName .rlib not found in $depsDir"
    }
    return $match.FullName
}

$flags = @("-L", "dependency=$depsDir")
foreach ($crate in $ExternCrates) {
    $flags += @("--extern", "$crate=$(Get-SdkRlib $crate)")
}
if (Test-Path -LiteralPath $nativeDir) {
    $flags += @("-L", "native=$nativeDir")
}
$env:CARGO_ENCODED_RUSTFLAGS = $flags -join [char]31

cargo rustc --release --manifest-path $manifest --target-dir $targetDir --lib -- --crate-type cdylib
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$builtDll = Join-Path (Join-Path $targetDir "release") "$CrateName.dll"
if (-not (Test-Path -LiteralPath $builtDll)) {
    throw "Cargo build finished, but expected DLL was not found: $builtDll"
}

$outDll = Join-Path $projectPath "$CrateName.dll"
Copy-Item -LiteralPath $builtDll -Destination $outDll -Force
Write-Host "Build successful: $outDll"
