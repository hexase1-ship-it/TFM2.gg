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
Copy-CleanDirectory -Source $dashboardSrc -Destination (Join-Path $payloadRoot "dashboard_app")
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
$modDll = Join-Path $payloadRoot "mods\tfm2_meta_item_delegate\tfm2_meta_item_delegate.dll"
if ($dashboardFileCount -lt 10) {
    throw "Dashboard payload looks incomplete. File count: $dashboardFileCount"
}
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

$zipPath = Join-Path $outRoot "TFM2.gg_Distribution.zip"
if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -LiteralPath $packageRoot -DestinationPath $zipPath -Force

$zipInfo = Get-Item -LiteralPath $zipPath
Write-Host "Distribution package: $packageRoot"
Write-Host "Distribution zip: $zipPath"
Write-Host "Dashboard files: $dashboardFileCount"
Write-Host "Package size: $($zipInfo.Length) bytes"
