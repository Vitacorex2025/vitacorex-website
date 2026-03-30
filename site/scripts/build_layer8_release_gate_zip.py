from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DESKTOP = ROOT.parents[2]
ARCHIVE_NAME = "docketmint_layer8_release_gate_2026-03-20.zip"
MANIFEST_NAME = "docketmint_layer8_release_gate_2026-03-20_manifest.json"

DEST = ROOT / ARCHIVE_NAME
MANIFEST = ROOT / MANIFEST_NAME
DESKTOP_DEST = DESKTOP / ARCHIVE_NAME
DESKTOP_MANIFEST = DESKTOP / MANIFEST_NAME
EXTRACT_DIR = ROOT / "tmp_zip_validate" / "layer8_release_gate_extract"

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

KEY_FILES = [
    ".env.example",
    "docs/RELEASE_RUNBOOK.md",
    "LAYER8_RELEASE_GATE_REPORT.md",
    "LAYER8_CHANGED_FILES.txt",
    "LAYER8_VALIDATION_REPORT.md",
    "LAYER8_REMAINING_RISKS.md",
    "backend/tests/test_release_gate.py",
    "backend/main.py",
    "backend/core/config.py",
]


def should_skip(path: Path) -> bool:
    relative_parts = path.relative_to(ROOT).parts
    for part in relative_parts[:-1] if path.is_file() else relative_parts:
        if part in EXCLUDED_DIR_NAMES:
            return True
        if any(part.startswith(prefix) for prefix in EXCLUDED_DIR_PREFIXES):
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
