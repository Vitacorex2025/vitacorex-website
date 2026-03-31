param(
  [string]$SourceRoot = (Get-Location).Path,
  [string]$OutputRoot = "C:\Users\sergz\CodexExports"
)

$ErrorActionPreference = "Stop"

$src = (Resolve-Path -LiteralPath $SourceRoot).Path
$dst = Join-Path $OutputRoot "READY_EXPORT"
$zip = Join-Path $OutputRoot "ready_download.zip"

if (Test-Path -LiteralPath $dst) {
  Remove-Item -LiteralPath $dst -Recurse -Force
}

if (Test-Path -LiteralPath $zip) {
  Remove-Item -LiteralPath $zip -Force
}

New-Item -ItemType Directory -Path $dst -Force | Out-Null

$rootFiles = @(
  "render.yaml",
  "main.py",
  "requirements.txt",
  "Procfile",
  "vercel.json",
  ".env.example",
  "DEPLOY_FORENSICS_REPORT.txt",
  "DEPLOY_ROOT_DECISION.txt",
  "RENDER_SERVICE_MAP.txt",
  "AUTH_REPAIR_REPORT.txt",
  "SESSION_PERSISTENCE_REPORT.txt",
  "STORAGE_PERSISTENCE_REPORT.txt",
  "RENDER_ENV_MATRIX.txt",
  "STARTUP_GUARD_DECISION.txt",
  "CASE_GENERATOR_AUDIT.txt",
  "PACKET_GENERATOR_AUDIT.txt",
  "EVIDENCE_SELECTION_RULES_REPORT.txt",
  "DUAL_ENGINE_FIX_REPORT.txt",
  "RELEASE_AUDIT_REPORT.txt",
  "PACKAGING_VALIDATION.txt",
  "RELEASE_BLOCKERS.txt",
  "FIX_LOG.txt",
  "SMOKE_TEST_RESULTS.txt"
)

$rootDirs = @(
  "backend",
  "app",
  "assets",
  "docs",
  "scripts"
)

foreach ($file in $rootFiles) {
  $sourceFile = Join-Path $src $file
  if (Test-Path -LiteralPath $sourceFile) {
    Copy-Item -LiteralPath $sourceFile -Destination (Join-Path $dst $file) -Force
  }
}

$excludeDirs = @(
  ".git",
  ".github",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".vercel",
  ".netlify",
  "CodexExports",
  ".release-gate-dist",
  ".dual-engine-smoke-dist",
  ".logic-test-dist",
  "node_modules_broken_backup",
  "_zip_validate_20260322",
  "_zip_validate_runtime_final"
)
$excludeDirPatterns = @("_zip_validate_*")
$excludeFiles = @("Thumbs.db", ".DS_Store")
$excludeExts = @(".log", ".zip", ".rar", ".7z")
$excludeFilePatterns = @("*.tsbuildinfo", "*.broken.backup.json")

function Copy-FilteredTree {
  param([string]$Source, [string]$Destination)

  foreach ($item in (Get-ChildItem -LiteralPath $Source -Force)) {
    if ($item.PSIsContainer) {
      if ($excludeDirs -contains $item.Name) { continue }
      if ($excludeDirPatterns | Where-Object { $item.Name -like $_ }) { continue }
      $targetDir = Join-Path $Destination $item.Name
      New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
      Copy-FilteredTree -Source $item.FullName -Destination $targetDir
      continue
    }

    if ($excludeFiles -contains $item.Name) { continue }
    if ($excludeExts -contains $item.Extension.ToLowerInvariant()) { continue }
    if ($excludeFilePatterns | Where-Object { $item.Name -like $_ }) { continue }

    Copy-Item -LiteralPath $item.FullName -Destination (Join-Path $Destination $item.Name) -Force
  }
}

foreach ($dir in $rootDirs) {
  $sourceDir = Join-Path $src $dir
  if (-not (Test-Path -LiteralPath $sourceDir)) {
    continue
  }
  $targetDir = Join-Path $dst $dir
  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
  Copy-FilteredTree -Source $sourceDir -Destination $targetDir
}

$canonicalDirName = "tmp_deadline_v10_validation"
$canonicalSource = Join-Path $src $canonicalDirName
$canonicalDestination = Join-Path $dst $canonicalDirName

New-Item -ItemType Directory -Path $canonicalDestination -Force | Out-Null
Copy-FilteredTree -Source $canonicalSource -Destination $canonicalDestination

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-NormalizedArchiveEntryName {
  param([string]$BasePath, [string]$FullPath, [bool]$IsDirectory)

  $relativePath = $FullPath.Substring($BasePath.Length).TrimStart('\', '/')
  $normalized = ($relativePath -replace '\\', '/')

  if ($IsDirectory -and -not $normalized.EndsWith('/')) {
    return "$normalized/"
  }

  return $normalized
}

$fileStream = [System.IO.File]::Open($zip, [System.IO.FileMode]::CreateNew)
$archive = [System.IO.Compression.ZipArchive]::new($fileStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)

try {
  $basePath = (Resolve-Path -LiteralPath $dst).Path
  $items = Get-ChildItem -LiteralPath $dst -Recurse -Force

  foreach ($item in $items) {
    $entryName = Get-NormalizedArchiveEntryName -BasePath $basePath -FullPath $item.FullName -IsDirectory $item.PSIsContainer
    if ([string]::IsNullOrWhiteSpace($entryName)) { continue }

    if ($item.PSIsContainer) {
      $archive.CreateEntry($entryName) | Out-Null
      continue
    }

    $entry = $archive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $sourceStream = [System.IO.File]::OpenRead($item.FullName)

    try {
      $sourceStream.CopyTo($entryStream)
    } finally {
      $sourceStream.Dispose()
      $entryStream.Dispose()
    }
  }
} finally {
  $archive.Dispose()
  $fileStream.Dispose()
}

$zipHandle = [System.IO.Compression.ZipFile]::OpenRead($zip)
try {
  $badEntries = @($zipHandle.Entries | Where-Object { $_.FullName.Contains('\') })
  if ($badEntries.Count -gt 0) {
    throw "ready_download.zip contains invalid backslash entry names."
  }

  Write-Output "EXPORT_READY"
  Write-Output ("ENTRY_COUNT=" + $zipHandle.Entries.Count)
  Write-Output ("BAD_ENTRY_COUNT=" + $badEntries.Count)
} finally {
  $zipHandle.Dispose()
}
