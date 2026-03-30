from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docketmint_step06_design_system_polish_2026-03-19.zip"
MANIFEST = ROOT / "docketmint_step06_design_system_polish_2026-03-19_manifest.json"
EXTRACT_DIR = ROOT / "tmp_zip_validate" / "step06_design_system_extract"

EXCLUDED_DIR_NAMES = {
    ".venv",
    ".pytest_cache",
    "__pycache__",
    "tmp_auth_extract",
    "tmp_storage_baseline",
    "tmp_zip_validate",
}
EXCLUDED_DIR_PREFIXES = ("storage", "tmp_")
EXCLUDED_SUFFIXES = {".zip", ".pyc", ".pyo"}
EXCLUDED_FILE_NAMES = {"step06_full_pytest.txt"}

KEY_FILES = [
    "DESIGN_SYSTEM_REPORT.md",
    "CHANGED_FILES.txt",
    "VALIDATION_REPORT.md",
    "KNOWN_ISSUES.md",
    "index.html",
    "app/sign-in/index.html",
    "app/sign-up/index.html",
    "app/home/index.html",
    "assets/css/public-home.css",
    "assets/css/app-shell.css",
    "assets/css/settings-shell.css",
    "backend/tests/test_shell_architecture.py",
]


def should_skip(path: Path) -> bool:
    relative_parts = path.relative_to(ROOT).parts
    for part in relative_parts[:-1] if path.is_file() else relative_parts:
        if part in EXCLUDED_DIR_NAMES:
            return True
        if any(part.startswith(prefix) for prefix in EXCLUDED_DIR_PREFIXES):
            return True
    if path.is_file() and path.name in EXCLUDED_FILE_NAMES:
        return True
    if path.is_file() and path.suffix.lower() in EXCLUDED_SUFFIXES:
        return True
    return False


def collect_files() -> list[Path]:
    files: list[Path] = []
    for item in ROOT.rglob("*"):
        if not item.is_file():
            continue
        if should_skip(item):
            continue
        files.append(item)
    return sorted(files)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest().upper()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


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
        "excluded_dir_names": sorted(EXCLUDED_DIR_NAMES),
        "excluded_dir_prefixes": list(EXCLUDED_DIR_PREFIXES),
        "excluded_suffixes": sorted(EXCLUDED_SUFFIXES),
        "key_file_hashes": {
            relative: sha256_file(ROOT / relative)
            for relative in KEY_FILES
            if (ROOT / relative).exists()
        },
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"archive_name={DEST.name}")
    print(f"entries={entry_count}")
    print(f"extracted_files={extracted_count}")
    print(f"sha256={archive_hash}")
    print(f"manifest={MANIFEST.name}")


if __name__ == "__main__":
    main()
