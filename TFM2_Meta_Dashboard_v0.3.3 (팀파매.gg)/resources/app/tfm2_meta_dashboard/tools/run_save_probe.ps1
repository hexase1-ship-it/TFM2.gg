param(
    [Parameter(Mandatory = $true)]
    [string]$SavePath,
    [string]$OutDir
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$probeExe = Join-Path $scriptDir "tfm2_save_probe.exe"
$fallbackProbeExe = Join-Path $scriptDir "save_probe\target\release\tfm2_save_probe.exe"
if (-not (Test-Path -LiteralPath $probeExe) -and (Test-Path -LiteralPath $fallbackProbeExe)) {
    $probeExe = $fallbackProbeExe
}
if (-not (Test-Path -LiteralPath $probeExe)) {
    $buildScript = Join-Path $scriptDir "build_save_probe.ps1"
    if (Test-Path -LiteralPath $buildScript) {
        & $buildScript
        if ($LASTEXITCODE -ne 0) {
            exit $LASTEXITCODE
        }
        if (Test-Path -LiteralPath $fallbackProbeExe) {
            $probeExe = $fallbackProbeExe
        }
    }
    if (-not (Test-Path -LiteralPath $probeExe)) {
        throw "tfm2_save_probe.exe not found. Expected $probeExe"
    }
}

if (-not $OutDir) {
    if ($env:APPDATA) {
        $OutDir = Join-Path $env:APPDATA "TeamSamoyed\TeamfightManager2\diagnostics\save_probe"
    } else {
        $OutDir = Join-Path $scriptDir "..\data\save_probe"
    }
}

& $probeExe $SavePath $OutDir
exit $LASTEXITCODE
