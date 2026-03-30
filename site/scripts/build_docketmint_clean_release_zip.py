from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DESKTOP = ROOT.parents[2]
ARCHIVE_NAME = "docketmint_clean_auth_persistence_fixed_2026-03-20.zip"
MANIFEST_NAME = "docketmint_clean_auth_persistence_fixed_2026-03-20_manifest.json"

DEST = ROOT / ARCHIVE_NAME
MANIFEST = ROOT / MANIFEST_NAME
DESKTOP_DEST = DESKTOP / ARCHIVE_NAME
DESKTOP_MANIFEST = DESKTOP / MANIFEST_NAME
EXTRACT_DIR = ROOT / "tmp_zip_validate" / "clean_auth_persistence_fixed_extract"

INCLUDED_DIRS = (
    "app",
    "assets",
    "backend",
    "docs",
    "es",
    "ru",
    "scripts",
)

ROOT_FILE_NAMES = {
    ".env.example",
    "Dockerfile",
    "Procfile",
    "README.txt",
    "app.html",
    "index.html",
    "main.py",
    "main_vitacorex.py",
    "manifest.webmanifest",
    "pytest.ini",
    "render.yaml",
    "requirements.txt",
    "robots.txt",
    "scripts.js",
    "sitemap.xml",
    "styles.css",
    "vercel.json",
}

SKIP_DIR_NAMES = {
    ".venv",
    ".pytest_cache",
    "__pycache__",
    "tmp_auth_extract",
    "tmp_storage_baseline",
    "tmp_zip_validate",
}
SKIP_DIR_PREFIXES = ("storage", "tmp_")
SKIP_SUFFIXES = {".zip", ".pyc", ".pyo", ".log"}

KEY_FILES = [
    ".env.example",
    "render.yaml",
    "docs/RELEASE_RUNBOOK.md",
    "backend/core/config.py",
    "backend/services/auth_service.py",
    "backend/services/auth_store.py",
    "backend/tests/test_auth_isolation.py",
    "assets/js/sign-in.js",
    "assets/js/sign-up.js",
    "assets/js/api-client.js",
    "app/sign-in/index.html",
    "app/sign-up/index.html",
    "index.html",
]


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def should_skip(path: Path) -> bool:
    relative_parts = path.relative_to(ROOT).parts
    for part in relative_parts[:-1] if path.is_file() else relative_parts:
        if part in SKIP_DIR_NAMES:
            return True
        if any(part.startswith(prefix) for prefix in SKIP_DIR_PREFIXES):
            return True
    return path.is_file() and path.suffix.lower() in SKIP_SUFFIXES


def include_root_file(path: Path) -> bool:
    if path.name in ROOT_FILE_NAMES:
        return True
    if path.suffix.lower() in {".html", ".xml", ".webmanifest"} and path.name == path.name.lower():
        return True
    return False


def collect_files() -> list[Path]:
    collected: list[Path] = []

    for directory in INCLUDED_DIRS:
        base = ROOT / directory
        if not base.exists():
            continue
        for item in base.rglob("*"):
            if item.is_file() and not should_skip(item):
                collected.append(item)

    for item in ROOT.iterdir():
        if not item.is_file():
            continue
        if should_skip(item):
            continue
        if include_root_file(item):
            collected.append(item)

    return sorted({path.resolve(): path for path in collected}.values())


def main() -> None:
    if DEST.exists():
        DEST.unlink()
    if EXTRACT_DIR.exists():
        shutil.rmtree(EXTRACT_DIR)

    files = collect_files()
    with zipfile.ZipFile(DEST, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for file_path in files:
            archive.write(file_path, file_path.relative_to(ROOT).as_posix())

    with zipfile.ZipFile(DEST, "r") as archive:
        bad_member = archive.testzip()
        if bad_member:
            raise RuntimeError(f"zip validation failed for {bad_member}")
        archive.extractall(EXTRACT_DIR)
        entry_count = len(archive.infolist())

    extracted_count = sum(1 for item in EXTRACT_DIR.rglob("*") if item.is_file())
    archive_hash = sha256_file(DEST)

    manifest = {
        "archive_name": DEST.name,
        "entries": entry_count,
        "extracted_files": extracted_count,
        "sha256": archive_hash,
        "included_dirs": list(INCLUDED_DIRS),
        "root_file_names": sorted(ROOT_FILE_NAMES),
        "skip_dir_names": sorted(SKIP_DIR_NAMES),
        "skip_dir_prefixes": list(SKIP_DIR_PREFIXES),
        "skip_suffixes": sorted(SKIP_SUFFIXES),
        "key_file_hashes": {
            relative: sha256_file(ROOT / relative)
            for relative in KEY_FILES
            if (ROOT / relative).exists()
        },
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    shutil.copy2(DEST, DESKTOP_DEST)
    shutil.copy2(MANIFEST, DESKTOP_MANIFEST)

    print(f"archive_name={DEST.name}")
    print(f"entries={entry_count}")
    print(f"extracted_files={extracted_count}")
    print(f"sha256={archive_hash}")
    print(f"manifest={MANIFEST.name}")
    print(f"desktop_archive={DESKTOP_DEST}")


if __name__ == "__main__":
    main()
