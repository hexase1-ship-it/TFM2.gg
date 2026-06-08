param(
    [string]$SavePath = "",
    [switch]$NoPrompt,
    [switch]$OpenDashboard,
    [switch]$SkipLiveExporter,
    [switch]$PolicyOnly
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
$env:PYTHONDONTWRITEBYTECODE = "1"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$builder = Join-Path $scriptDir "tools\build_meta_data.py"
$logPath = Join-Path $scriptDir "_last_refresh_log.txt"
$script:SaveProbeExportDir = $null
$script:SaveProbeFallbackSavePath = $null

function Resolve-TFM2GameRoot {
    if ($env:TFM2_GAME_ROOT -and (Test-Path -LiteralPath (Join-Path $env:TFM2_GAME_ROOT "TeamfightManager2.exe") -PathType Leaf)) {
        return $env:TFM2_GAME_ROOT
    }

    $cursor = Get-Item -LiteralPath $scriptDir
    while ($cursor) {
        if (Test-Path -LiteralPath (Join-Path $cursor.FullName "TeamfightManager2.exe") -PathType Leaf) {
            return $cursor.FullName
        }
        $cursor = $cursor.Parent
    }
    return $null
}

$resolvedGameRoot = Resolve-TFM2GameRoot
if ($resolvedGameRoot) {
    $env:TFM2_GAME_ROOT = $resolvedGameRoot
}

function Write-FailAndExit($message, $exitCode = 1) {
    Write-Host ""
    Write-Host $message -ForegroundColor Red
    Write-Host "Log file:"
    Write-Host $logPath
    if (-not $NoPrompt) {
        Read-Host "Press Enter to exit"
    }
    exit $exitCode
}

function Invoke-CapturedNative($exe, $argsList) {
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $output = & $exe @argsList 2>&1
        $exitCode = $LASTEXITCODE
        return @{
            Output = $output
            ExitCode = $exitCode
        }
    } finally {
        $ErrorActionPreference = $oldPreference
    }
}

function Test-PythonRunner($exe, $argsList) {
    $result = Invoke-CapturedNative $exe ($argsList + @("--version"))
    $text = (($result.Output | Out-String).Trim())
    return @{
        Ok = ($result.ExitCode -eq 0 -and $text -match "Python 3\.")
        Version = $text
        ExitCode = $result.ExitCode
    }
}

function Get-CandidateSaveFiles {
    $roots = New-Object System.Collections.Generic.List[string]
    if ($env:TFM2_SAVE_PATH) {
        $roots.Add($env:TFM2_SAVE_PATH)
    }
    if ($env:APPDATA) {
        $roots.Add((Join-Path $env:APPDATA "TeamSamoyed\TeamfightManager2\data"))
        $roots.Add((Join-Path $env:APPDATA "TeamSamoyed\Teamfight Manager2\data"))
    }
    if ($env:USERPROFILE) {
        $roots.Add((Join-Path $env:USERPROFILE "AppData\Roaming\TeamSamoyed\TeamfightManager2\data"))
        $roots.Add((Join-Path $env:USERPROFILE "AppData\Roaming\TeamSamoyed\Teamfight Manager2\data"))
    }

    $seen = @{}
    $files = @()
    foreach ($rawRoot in $roots) {
        if ([string]::IsNullOrWhiteSpace($rawRoot)) {
            continue
        }
        $root = $rawRoot.Trim('"')
        if (Test-Path -LiteralPath $root -PathType Leaf) {
            $item = Get-Item -LiteralPath $root -ErrorAction SilentlyContinue
            if ($item -and $item.Extension -ieq ".data" -and -not $seen.ContainsKey($item.FullName.ToLowerInvariant())) {
                $seen[$item.FullName.ToLowerInvariant()] = $true
                $files += $item
            }
            continue
        }
        if (Test-Path -LiteralPath $root -PathType Container) {
            Get-ChildItem -LiteralPath $root -Filter "*.data" -File -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
                $key = $_.FullName.ToLowerInvariant()
                if (-not $seen.ContainsKey($key)) {
                    $seen[$key] = $true
                    $files += $_
                }
            }
        }
    }
    return $files | Sort-Object LastWriteTime -Descending
}

function Get-MetaExportDir {
    if ($env:APPDATA) {
        return (Join-Path $env:APPDATA "TeamSamoyed\TeamfightManager2\diagnostics\meta_export")
    }
    if ($env:USERPROFILE) {
        return (Join-Path $env:USERPROFILE "AppData\Roaming\TeamSamoyed\TeamfightManager2\diagnostics\meta_export")
    }
    return (Join-Path $scriptDir "..\tfm2_meta_export")
}

function Get-SaveProbeExportDir {
    return (Join-Path $scriptDir "data\save_probe_snapshot")
}

function Get-NormalizedPathKey([string]$Path) {
    if ([string]::IsNullOrWhiteSpace($Path)) {
        return ""
    }
    try {
        return ([System.IO.Path]::GetFullPath($Path.Trim('"'))).ToLowerInvariant()
    } catch {
        return $Path.Trim('"').ToLowerInvariant()
    }
}

function Invoke-SaveProbeOnce {
    param(
        [string]$RunnerScript,
        [string]$SelectedSavePath,
        [string]$ExportDir
    )

    $probeArgs = @(
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        $RunnerScript,
        "-SavePath",
        $SelectedSavePath,
        "-OutDir",
        $ExportDir
    )
    return Invoke-CapturedNative "powershell.exe" $probeArgs
}

function Format-ProbeOutput($Result, [int]$MaxLength = 900) {
    $text = (($Result.Output | Out-String).Trim())
    if ($text.Length -gt $MaxLength) {
        return ($text.Substring(0, $MaxLength) + " ...")
    }
    return $text
}

function Write-AutoRefreshStatus {
    param(
        [string]$SelectedSavePath,
        [string]$State = "updated",
        [string]$Message = "dashboard data refreshed"
    )

    $dataDir = Join-Path $scriptDir "data"
    New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
    $statusPath = Join-Path $dataDir "auto-refresh-status.js"
    $saveFile = ""
    if (-not [string]::IsNullOrWhiteSpace($SelectedSavePath)) {
        $saveFile = Split-Path -Leaf $SelectedSavePath
    }

    $status = [ordered]@{
        state = $State
        savePath = $SelectedSavePath
        saveFile = $saveFile
        message = $Message
        lastChangeAt = $null
        lastRefreshAt = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
        refreshCount = 1
        pollSeconds = 3
        error = $null
    }
    $json = $status | ConvertTo-Json -Depth 4
    Set-Content -LiteralPath $statusPath -Value "window.TFM2_AUTO_REFRESH_STATUS = $json;" -Encoding UTF8
}

function Test-SaveProbeFallbackEnabled {
    if (-not $env:TFM2_ALLOW_SAVE_PROBE_FALLBACK) {
        return $false
    }
    return @("1", "true", "yes", "on") -contains $env:TFM2_ALLOW_SAVE_PROBE_FALLBACK.Trim().ToLowerInvariant()
}

function Get-FallbackSaveProbeCandidates {
    param(
        [string]$SelectedSavePath,
        [int]$Limit = 8
    )

    $selectedKey = Get-NormalizedPathKey $SelectedSavePath
    $candidates = @(
        Get-CandidateSaveFiles | Where-Object {
            (Get-NormalizedPathKey $_.FullName) -ne $selectedKey
        } | Select-Object -First $Limit
    )
    return $candidates
}

function Invoke-FallbackSaveProbeSnapshot {
    param(
        [string]$RunnerScript,
        [string]$SelectedSavePath,
        [string]$ExportDir,
        [int]$SelectedExitCode,
        [string]$SelectedOutput
    )

    foreach ($candidate in (Get-FallbackSaveProbeCandidates -SelectedSavePath $SelectedSavePath)) {
        Clear-MetaExportSnapshot $ExportDir
        $result = Invoke-SaveProbeOnce -RunnerScript $RunnerScript -SelectedSavePath $candidate.FullName -ExportDir $ExportDir
        if ($result.ExitCode -eq 0) {
            $script:SaveProbeExportDir = $ExportDir
            $script:SaveProbeFallbackSavePath = $candidate.FullName
            $modified = $candidate.LastWriteTime.ToString("s")
            return "fallback: selected save_probe failed exit $SelectedExitCode; using latest decodable save $($candidate.FullName) (modified $modified)"
        }
    }

    Clear-MetaExportSnapshot $ExportDir
    if ([string]::IsNullOrWhiteSpace($SelectedOutput)) {
        return "failed: save_probe exit $SelectedExitCode"
    }
    return "failed: save_probe exit $SelectedExitCode; $SelectedOutput"
}

function Get-MetaExportSnapshotFiles {
    return @(
        "export.request",
        "manifest.tsv",
        "compatibility_error.tsv",
        "teams.debug.txt",
        "athletes.debug.txt",
        "champion_patch_statistics.debug.txt",
        "champion_patch_statistics.tsv",
        "solo_rank_matches.debug.txt",
        "match_replays.debug.txt",
        "league_competitions.debug.txt",
        "tournament_competitions.debug.txt",
        "year_schedules.debug.txt",
        "match_stats.debug.txt",
        "champion_info_sheet.debug.txt",
        "pre_patch_data.debug.txt",
        "champion_action_patch_state.debug.txt",
        "match_replay_summary.tsv",
        "match_replay_players.tsv"
    )
}

function Invoke-SaveProbeSnapshot {
    param([string]$SelectedSavePath)

    $script:SaveProbeExportDir = $null
    $script:SaveProbeFallbackSavePath = $null

    if ([string]::IsNullOrWhiteSpace($SelectedSavePath)) {
        return "skipped: no save selected"
    }

    $runnerScript = Join-Path $scriptDir "tools\run_save_probe.ps1"
    if (-not (Test-Path -LiteralPath $runnerScript)) {
        return "skipped: run_save_probe.ps1 not found"
    }

    $exportDir = Get-SaveProbeExportDir
    New-Item -ItemType Directory -Force -Path $exportDir | Out-Null
    Clear-MetaExportSnapshot $exportDir

    $result = Invoke-SaveProbeOnce -RunnerScript $runnerScript -SelectedSavePath $SelectedSavePath -ExportDir $exportDir
    if ($result.ExitCode -eq 0) {
        $script:SaveProbeExportDir = $exportDir
        return "received: save_probe ($exportDir)"
    }
    $text = Format-ProbeOutput $result
    if (Test-SaveProbeFallbackEnabled) {
        return Invoke-FallbackSaveProbeSnapshot -RunnerScript $runnerScript -SelectedSavePath $SelectedSavePath -ExportDir $exportDir -SelectedExitCode $result.ExitCode -SelectedOutput $text
    }

    Clear-MetaExportSnapshot $exportDir
    if ([string]::IsNullOrWhiteSpace($text)) {
        return "failed: save_probe exit $($result.ExitCode); fallback disabled"
    }
    return "failed: save_probe exit $($result.ExitCode); fallback disabled; $text"
}

function Clear-MetaExportSnapshot($exportDir) {
    New-Item -ItemType Directory -Force -Path $exportDir | Out-Null
    foreach ($fileName in Get-MetaExportSnapshotFiles) {
        Remove-Item -LiteralPath (Join-Path $exportDir $fileName) -Force -ErrorAction SilentlyContinue
    }
}

function Request-MetaExporterSnapshot {
    param([string]$SelectedSavePath)

    $timeoutSeconds = 300
    if ($env:TFM2_EXPORT_WAIT_SECONDS -match "^\d+$") {
        $timeoutSeconds = [int]$env:TFM2_EXPORT_WAIT_SECONDS
    }
    if ($timeoutSeconds -le 0) {
        return "skipped"
    }

    $exportDir = Get-MetaExportDir
    Clear-MetaExportSnapshot $exportDir

    $requestPath = Join-Path $exportDir "export.request"
    $manifestPath = Join-Path $exportDir "manifest.tsv"
    $compatPath = Join-Path $exportDir "compatibility_error.tsv"

    @(
        "requested_at`t$((Get-Date).ToUniversalTime().ToString("o"))",
        "source`trefresh_meta_dashboard.ps1",
        "selected_save`t$SelectedSavePath"
    ) | Set-Content -LiteralPath $requestPath -Encoding UTF8

    Write-Host ""
    Write-Host "Cleared previous Meta Exporter snapshot files."
    Write-Host "Requested a fresh Meta Exporter snapshot from the running game."
    Write-Host "Waiting up to $timeoutSeconds seconds; if the game is not ready, no old export data will be reused."

    $deadline = (Get-Date).AddSeconds($timeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Milliseconds 500
        $manifest = Get-Item -LiteralPath $manifestPath -ErrorAction SilentlyContinue
        if ($manifest) {
            if (-not (Test-Path -LiteralPath $requestPath)) {
                if (Test-Path -LiteralPath $compatPath) {
                    Write-Host "Meta Exporter responded, but skipped DB export because the current Mod SDK is incompatible with the game version." -ForegroundColor Yellow
                    return "incompatible: $compatPath"
                }
                Write-Host "Fresh Meta Exporter snapshot received." -ForegroundColor Green
                return "received: $exportDir"
            }
        }
    }

    Remove-Item -LiteralPath $requestPath -Force -ErrorAction SilentlyContinue
    Write-Host "No live Meta Exporter response yet; the pending request was cleared." -ForegroundColor Yellow
    Write-Host "Load a save first, keep the game running, then run refresh again for a live export."
    return "timeout: $exportDir"
}

if (-not (Test-Path -LiteralPath $builder)) {
    "build_meta_data.py was not found." | Set-Content -LiteralPath $logPath -Encoding UTF8
    Write-Host "build_meta_data.py was not found." -ForegroundColor Red
    Write-Host "Extract this package directly into the Teamfight Manager2 install folder."
    Read-Host "Press Enter to exit"
    exit 1
}

$localPythonCandidates = @(
    (Join-Path $scriptDir "python\python.exe"),
    (Join-Path $scriptDir "runtime\python\python.exe")
)
$pythonCandidates = @()
$runner = $null
$runnerArgs = @()
foreach ($candidate in $localPythonCandidates) {
    if (Test-Path -LiteralPath $candidate -PathType Leaf) {
        $pythonCandidates += @{
            Runner = $candidate
            Args = @()
            Label = "bundled python"
        }
    }
}
$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pyLauncher) {
    $pythonCandidates += @{
        Runner = $pyLauncher.Source
        Args = @("-3")
        Label = "py launcher"
    }
}
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    $pythonCandidates += @{
        Runner = $python.Source
        Args = @()
        Label = "python command"
    }
}

$pythonProbeLog = New-Object System.Collections.Generic.List[string]
foreach ($candidate in $pythonCandidates) {
    $probe = Test-PythonRunner $candidate.Runner $candidate.Args
    $pythonProbeLog.Add(("{0}: {1} {2} -> exit {3}; {4}" -f $candidate.Label, $candidate.Runner, ($candidate.Args -join " "), $probe.ExitCode, $probe.Version))
    if ($probe.Ok) {
        $runner = $candidate.Runner
        $runnerArgs = $candidate.Args
        break
    }
}

if (-not $runner) {
    @(
        "Python 3 was not found or did not run correctly.",
        "",
        "Python probe:",
        ($pythonProbeLog -join [Environment]::NewLine)
    ) | Set-Content -LiteralPath $logPath -Encoding UTF8
    Write-Host "Python 3 was not found." -ForegroundColor Red
    Write-Host "Install Python 3, then run this file again. During install, enable 'Add python.exe to PATH'."
    Write-Host "If Windows opens Microsoft Store instead, disable App execution aliases for python.exe and python3.exe."
    Write-Host "Download: https://www.python.org/downloads/windows/"
    Read-Host "Press Enter to exit"
    exit 1
}

if ($PolicyOnly) {
    $header = @(
        "TFM2 Meta Dashboard policy-only refresh log",
        "Time: $(Get-Date -Format s)",
        "Script: $scriptDir",
        "Game root: $env:TFM2_GAME_ROOT",
        "Python: $runner $($runnerArgs -join ' ')",
        "Python probe:",
        ($pythonProbeLog -join [Environment]::NewLine),
        "Policy preset: $env:TFM2_POLICY_PRESET",
        ""
    )
    $header | Set-Content -LiteralPath $logPath -Encoding UTF8
    try {
        $result = Invoke-CapturedNative $runner ($runnerArgs + @($builder, "--policy-only"))
        $result.Output | Out-File -LiteralPath $logPath -Append -Encoding UTF8
        if ($result.ExitCode -ne 0) {
            throw "policy-only refresh failed with exit $($result.ExitCode)"
        }
        Write-Host "Addon policy files refreshed."
        exit 0
    } catch {
        $_ | Out-File -LiteralPath $logPath -Append -Encoding UTF8
        Write-FailAndExit "Addon policy refresh failed." 1
    }
}

$saveFiles = @(Get-CandidateSaveFiles)
$manualSavePath = $SavePath.Trim()

if (-not [string]::IsNullOrWhiteSpace($manualSavePath)) {
    Write-Host ""
    Write-Host "Save: $manualSavePath"
} elseif ($NoPrompt) {
    if ($saveFiles.Count -gt 0) {
        $manualSavePath = $saveFiles[0].FullName
        Write-Host ""
        Write-Host "Save: $manualSavePath"
    } else {
        Write-Host ""
        Write-Host "No save file was auto-detected; refreshing from an existing diagnostic snapshot if available." -ForegroundColor Yellow
        $manualSavePath = ""
    }
} else {
    Write-Host ""
    Write-Host "Select a save file."
}

if ([string]::IsNullOrWhiteSpace($manualSavePath) -and $saveFiles.Count -gt 0) {
    $max = [Math]::Min($saveFiles.Count, 12)
    for ($i = 0; $i -lt $max; $i++) {
        $item = $saveFiles[$i]
        $sizeMb = [Math]::Round($item.Length / 1MB, 1)
        Write-Host ("  {0}. {1}  {2} MB  {3}" -f ($i + 1), $item.Name, $sizeMb, $item.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss"))
    }
    Write-Host ""
    Write-Host "Press Enter to use #1, type a number, or paste a save/data folder path."
    $answer = Read-Host "Save"
    if ([string]::IsNullOrWhiteSpace($answer)) {
        $manualSavePath = $saveFiles[0].FullName
    } elseif ($answer -match "^\d+$" -and [int]$answer -ge 1 -and [int]$answer -le $max) {
        $manualSavePath = $saveFiles[[int]$answer - 1].FullName
    } else {
        $manualSavePath = $answer.Trim()
    }
} elseif (-not $NoPrompt -and [string]::IsNullOrWhiteSpace($manualSavePath)) {
    Write-Host "No save file was auto-detected."
    Write-Host "Paste a save file path or the game's AppData data folder."
    Write-Host "Example: C:\Users\YOURNAME\AppData\Roaming\TeamSamoyed\TeamfightManager2\data"
    $manualSavePath = (Read-Host "Save path").Trim()
}

if ($SkipLiveExporter) {
    $exportRequestStatus = "skipped"
    Clear-MetaExportSnapshot (Get-MetaExportDir)
} else {
    $exportRequestStatus = Request-MetaExporterSnapshot -SelectedSavePath $manualSavePath
}
$saveProbeStatus = Invoke-SaveProbeSnapshot -SelectedSavePath $manualSavePath
$metaExportOverride = $script:SaveProbeExportDir
$metaExportUsedByBuilder = if ($metaExportOverride) { $metaExportOverride } else { Get-MetaExportDir }
$builderSavePath = if ($script:SaveProbeFallbackSavePath) { $script:SaveProbeFallbackSavePath } else { $manualSavePath }

$builderArgs = @()
if ($builderSavePath -and $builderSavePath.Trim().Length -gt 0) {
    $builderArgs += @("--save-path", $builderSavePath.Trim('"'))
}

$header = @(
    "TFM2 Meta Dashboard refresh log",
    "Time: $(Get-Date -Format s)",
    "Script: $scriptDir",
    "Game root: $env:TFM2_GAME_ROOT",
    "Python: $runner $($runnerArgs -join ' ')",
    "Python probe:",
    ($pythonProbeLog -join [Environment]::NewLine),
    "Selected save input: $manualSavePath",
    "Builder save input: $builderSavePath",
    "Meta Exporter request: $exportRequestStatus",
    "Save probe: $saveProbeStatus",
    "Save probe fallback save: $script:SaveProbeFallbackSavePath",
    "Meta export data used by builder: $metaExportUsedByBuilder",
    ""
)
$header | Set-Content -LiteralPath $logPath -Encoding UTF8

try {
    $previousMetaExportDir = $env:TFM2_META_EXPORT_DIR
    if ($metaExportOverride) {
        $env:TFM2_META_EXPORT_DIR = $metaExportOverride
    }
    $result = Invoke-CapturedNative $runner ($runnerArgs + @($builder) + $builderArgs)
    $exitCode = $result.ExitCode
    $result.Output | Out-File -LiteralPath $logPath -Append -Encoding UTF8
} catch {
    $_ | Out-File -LiteralPath $logPath -Append -Encoding UTF8
    Write-FailAndExit "Failed to refresh dashboard data." 1
} finally {
    if ($null -ne $previousMetaExportDir) {
        $env:TFM2_META_EXPORT_DIR = $previousMetaExportDir
    } else {
        Remove-Item Env:TFM2_META_EXPORT_DIR -ErrorAction SilentlyContinue
    }
}

if ($exitCode -ne 0) {
    Write-FailAndExit "Failed to refresh dashboard data." $exitCode
}

Write-AutoRefreshStatus -SelectedSavePath $builderSavePath

Write-Host ""
Write-Host "TFM2 meta dashboard data refreshed." -ForegroundColor Green
Write-Host "Log file:"
Write-Host $logPath
Write-Host "Open this file in your browser:"
Write-Host (Join-Path $scriptDir "index.html")
if ($OpenDashboard) {
    Start-Process -FilePath (Join-Path $scriptDir "index.html")
}
if (-not $NoPrompt) {
    Read-Host "Press Enter to exit"
}
