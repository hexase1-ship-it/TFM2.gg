param(
    [string]$OutputRoot = "dist",
    [switch]$BuildExe
)

$ErrorActionPreference = "Stop"

function Resolve-ProjectDirectory {
    param(
        [string]$Root,
        [string]$Prefix
    )

    $matches = Get-ChildItem -LiteralPath $Root -Directory |
        Where-Object { $_.Name.StartsWith($Prefix, [System.StringComparison]::OrdinalIgnoreCase) } |
        Sort-Object Name

    if (-not $matches) {
        throw "Required project directory not found: $Prefix"
    }
    if (@($matches).Count -gt 1) {
        $names = ($matches | Select-Object -ExpandProperty Name) -join ", "
        throw "Multiple project directories matched '$Prefix': $names"
    }
    return $matches[0].FullName
}

function Assert-PathExists {
    param(
        [string]$Path,
        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "$Label not found: $Path"
    }
}

function Copy-CleanDirectory {
    param(
        [string]$Source,
        [string]$Destination
    )

    if (Test-Path -LiteralPath $Destination) {
        Remove-Item -LiteralPath $Destination -Recurse -Force
    }
    Copy-Item -LiteralPath $Source -Destination $Destination -Recurse -Force
}

function Ensure-DashboardPythonRuntime {
    param(
        [string]$DashboardDestination,
        [string]$CacheDirectory
    )

    $runtimePython = Join-Path $DashboardDestination "tfm2_meta_dashboard\runtime\python\python.exe"
    if (Test-Path -LiteralPath $runtimePython -PathType Leaf) {
        return
    }

    $runtimeDir = Split-Path -Parent $runtimePython
    New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null

    $pythonVersion = "3.12.3"
    $runtimeZip = Join-Path $CacheDirectory "python-$pythonVersion-embed-amd64.zip"
    $runtimeUrl = "https://www.python.org/ftp/python/$pythonVersion/python-$pythonVersion-embed-amd64.zip"
    if (-not (Test-Path -LiteralPath $runtimeZip -PathType Leaf)) {
        Write-Host "Downloading bundled Python runtime: $runtimeUrl"
        Invoke-WebRequest -Uri $runtimeUrl -OutFile $runtimeZip
    }

    Expand-Archive -LiteralPath $runtimeZip -DestinationPath $runtimeDir -Force
    Assert-PathExists -Path $runtimePython -Label "Bundled Python runtime"
}

function Copy-DashboardShell {
    param(
        [string]$DashboardProject,
        [string]$Destination,
        [string]$CacheDirectory
    )

    if (Test-Path -LiteralPath $Destination) {
        Remove-Item -LiteralPath $Destination -Recurse -Force
    }
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null

    $localDashboardExe = Join-Path $DashboardProject "TFM2MetaDashboard.exe"
    if (Test-Path -LiteralPath $localDashboardExe -PathType Leaf) {
        Write-Host "Using local dashboard shell: $DashboardProject"
        Get-ChildItem -LiteralPath $DashboardProject -Force |
            Where-Object { $_.Name -ne "resources" } |
            ForEach-Object {
                Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $Destination $_.Name) -Recurse -Force
            }
    } else {
        $electronVersionPath = Join-Path $DashboardProject "version"
        $electronVersion = "39.8.10"
        if (Test-Path -LiteralPath $electronVersionPath -PathType Leaf) {
            $candidateVersion = (Get-Content -LiteralPath $electronVersionPath -Raw).Trim()
            if ($candidateVersion) {
                $electronVersion = $candidateVersion
            }
        }

        $electronZip = Join-Path $CacheDirectory "electron-v$electronVersion-win32-x64.zip"
        $electronUrl = "https://github.com/electron/electron/releases/download/v$electronVersion/electron-v$electronVersion-win32-x64.zip"
        if (-not (Test-Path -LiteralPath $electronZip -PathType Leaf)) {
            Write-Host "Downloading dashboard Electron shell: $electronUrl"
            Invoke-WebRequest -Uri $electronUrl -OutFile $electronZip
        }

        $extractRoot = Join-Path $CacheDirectory "electron-shell-v$electronVersion"
        if (Test-Path -LiteralPath $extractRoot) {
            Remove-Item -LiteralPath $extractRoot -Recurse -Force
        }
        New-Item -ItemType Directory -Path $extractRoot -Force | Out-Null
        Expand-Archive -LiteralPath $electronZip -DestinationPath $extractRoot -Force

        Get-ChildItem -LiteralPath $extractRoot -Force |
            Where-Object { $_.Name -ne "resources" } |
            ForEach-Object {
                Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $Destination $_.Name) -Recurse -Force
            }

        $electronExe = Join-Path $Destination "electron.exe"
        Assert-PathExists -Path $electronExe -Label "Electron shell executable"
        Rename-Item -LiteralPath $electronExe -NewName "TFM2MetaDashboard.exe" -Force
    }

    Assert-PathExists -Path (Join-Path $Destination "TFM2MetaDashboard.exe") -Label "Dashboard shell executable"
}

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$outRoot = Join-Path $repoRoot $OutputRoot
$packageRoot = Join-Path $outRoot "TFM2.gg_Distribution"
$payloadRoot = Join-Path $packageRoot "payload"
$installerSrc = Join-Path $repoRoot "installer\tfm2gg_installer.py"
$dashboardProject = Resolve-ProjectDirectory -Root $repoRoot -Prefix "TFM2_Meta_Dashboard_v0.3.3"
$modSrc = Resolve-ProjectDirectory -Root $repoRoot -Prefix "tfm2_meta_item_delegate "
$dashboardSrc = Join-Path $dashboardProject "resources\app"
$readmeSrc = Join-Path $repoRoot "README.md"

Assert-PathExists -Path $installerSrc -Label "Installer source"
Assert-PathExists -Path $dashboardSrc -Label "Dashboard payload"
Assert-PathExists -Path $modSrc -Label "Addon payload"
Assert-PathExists -Path $readmeSrc -Label "README"

if (-not (Test-Path -LiteralPath $outRoot)) {
    New-Item -ItemType Directory -Path $outRoot -Force | Out-Null
}

$builtExe = $null
if ($BuildExe) {
    $pyinstaller = Get-Command pyinstaller -ErrorAction SilentlyContinue
    if (-not $pyinstaller) {
        python -m pip install pyinstaller
    }

    $exeDist = Join-Path $outRoot "pyinstaller-dist"
    $buildDir = Join-Path $outRoot "pyinstaller-build"
    $specDir = Join-Path $outRoot "pyinstaller-spec"
    if (Test-Path -LiteralPath $exeDist) {
        Remove-Item -LiteralPath $exeDist -Recurse -Force
    }

    pyinstaller --noconfirm --clean --windowed --onefile `
        --name "TFM2GGInstaller" `
        --distpath $exeDist `
        --workpath $buildDir `
        --specpath $specDir `
        $installerSrc

    $builtExe = Join-Path $exeDist "TFM2GGInstaller.exe"
    Assert-PathExists -Path $builtExe -Label "Built installer exe"
}

if (Test-Path -LiteralPath $packageRoot) {
    Remove-Item -LiteralPath $packageRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $payloadRoot -Force | Out-Null

Copy-Item -LiteralPath $installerSrc -Destination (Join-Path $packageRoot "TFM2GGInstaller.py") -Force
if ($builtExe) {
    Copy-Item -LiteralPath $builtExe -Destination (Join-Path $packageRoot "TFM2GGInstaller.exe") -Force
}
Copy-Item -LiteralPath $readmeSrc -Destination (Join-Path $payloadRoot "README.md") -Force
$dashboardDest = Join-Path $payloadRoot "dashboard_app"
Copy-CleanDirectory -Source $dashboardSrc -Destination $dashboardDest
Ensure-DashboardPythonRuntime -DashboardDestination $dashboardDest -CacheDirectory $outRoot
$dashboardShellDest = Join-Path $payloadRoot "dashboard_shell"
Copy-DashboardShell -DashboardProject $dashboardProject -Destination $dashboardShellDest -CacheDirectory $outRoot
New-Item -ItemType Directory -Path (Join-Path $payloadRoot "mods") -Force | Out-Null
Copy-CleanDirectory -Source $modSrc -Destination (Join-Path $payloadRoot "mods\tfm2_meta_item_delegate")

Get-ChildItem -LiteralPath $packageRoot -Recurse -File -Force |
    Where-Object {
        $_.Name -eq "_last_refresh_log.txt" -or
        $_.Name -eq "debug.log" -or
        $_.Extension -in @(".pdb", ".bak", ".ilk", ".exp")
    } |
    Remove-Item -Force

$dashboardFileCount = (Get-ChildItem -LiteralPath (Join-Path $payloadRoot "dashboard_app") -Recurse -File | Measure-Object).Count
$dashboardShellFileCount = (Get-ChildItem -LiteralPath (Join-Path $payloadRoot "dashboard_shell") -Recurse -File | Measure-Object).Count
$dashboardShellExe = Join-Path $payloadRoot "dashboard_shell\TFM2MetaDashboard.exe"
$modDll = Join-Path $payloadRoot "mods\tfm2_meta_item_delegate\tfm2_meta_item_delegate.dll"
if ($dashboardFileCount -lt 10) {
    throw "Dashboard payload looks incomplete. File count: $dashboardFileCount"
}
if ($dashboardShellFileCount -lt 10) {
    throw "Dashboard shell payload looks incomplete. File count: $dashboardShellFileCount"
}
Assert-PathExists -Path $dashboardShellExe -Label "Dashboard shell executable"
Assert-PathExists -Path $modDll -Label "Addon DLL"

$sha = ""
try {
    $sha = (git -C $repoRoot rev-parse --short=12 HEAD).Trim()
} catch {
    $sha = "nogit"
}
$version = (Get-Date -Format "yyyy.MM.dd.HHmm") + "+$sha"
$manifest = [ordered]@{
    name = "TFM2.gg"
    packageVersion = $version
    targetGameVersion = "0.4.7"
    repository = "hexase1-ship-it/TFM2.gg"
    releaseAsset = "TFM2.gg_Distribution.zip"
    expectedGameFiles = [ordered]@{
        "TeamfightManager2.exe" = 62701568
        "bundle.game_data" = 1118940252
    }
    generatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}
$manifestJson = $manifest | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $packageRoot "package_manifest.json"), $manifestJson, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $payloadRoot "package_manifest.json"), $manifestJson, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $dashboardDest "package_manifest.json"), $manifestJson, $utf8NoBom)

$zipPath = Join-Path $outRoot "TFM2.gg_Distribution.zip"
if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -LiteralPath $packageRoot -DestinationPath $zipPath -Force

$zipInfo = Get-Item -LiteralPath $zipPath
Write-Host "Distribution package: $packageRoot"
Write-Host "Distribution zip: $zipPath"
Write-Host "Dashboard files: $dashboardFileCount"
Write-Host "Dashboard shell files: $dashboardShellFileCount"
Write-Host "Package size: $($zipInfo.Length) bytes"
