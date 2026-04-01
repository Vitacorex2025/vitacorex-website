$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $root "docketmint_final_cleanup_auth_base_stability_2026-03-18_windows_compatible.zip"
$extract = Join-Path $root "tmp_zip_validate\\windows_compatible_extract"

if (Test-Path $dest) {
  Remove-Item $dest -Force
}

if (Test-Path $extract) {
  Remove-Item $extract -Recurse -Force
}

$items = @(
  (Join-Path $root "app"),
  (Join-Path $root "assets"),
  (Join-Path $root "backend"),
  (Join-Path $root "scripts"),
  (Join-Path $root ".env.example"),
  (Join-Path $root "Dockerfile"),
  (Join-Path $root "Procfile"),
  (Join-Path $root "README.txt"),
  (Join-Path $root "main.py"),
  (Join-Path $root "render.yaml"),
  (Join-Path $root "requirements.txt"),
  (Join-Path $root "vercel.json"),
  (Join-Path $root "FINAL_CLEANUP_AUTH_BASE_STABILITY_REPORT_2026-03-18.md")
)

Compress-Archive -Path $items -DestinationPath $dest -CompressionLevel Optimal

New-Item -ItemType Directory -Path $extract | Out-Null
Expand-Archive -LiteralPath $dest -DestinationPath $extract -Force

$count = (Get-ChildItem -Path $extract -Recurse -File).Count
Write-Output ("archive=" + $dest)
Write-Output ("extracted_files=" + $count)
