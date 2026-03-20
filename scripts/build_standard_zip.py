from __future__ import annotations

import shutil
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "docketmint_final_cleanup_auth_base_stability_2026-03-18.zip"
EXTRACT_DIR = ROOT / "tmp_zip_validate" / "final_cleanup_current_extract"

INCLUDE_PATHS = [
    "app",
    "assets",
    "backend",
    "scripts",
    ".env.example",
    "Dockerfile",
    "Procfile",
    "README.txt",
    "main.py",
    "render.yaml",
    "requirements.txt",
    "vercel.json",
    "FINAL_CLEANUP_AUTH_BASE_STABILITY_REPORT_2026-03-18.md",
    "ARCHIVE_TRUTH_AUDIT_2026-03-18.md",
]


def iter_files(path: Path) -> list[Path]:
    if path.is_dir():
        return [item for item in path.rglob("*") if item.is_file()]
    return [path]


def main() -> None:
    if DEST.exists():
        DEST.unlink()

    if EXTRACT_DIR.exists():
        shutil.rmtree(EXTRACT_DIR)

    files: list[Path] = []
    for relative in INCLUDE_PATHS:
        target = ROOT / relative
        if target.exists():
            files.extend(iter_files(target))

    with zipfile.ZipFile(DEST, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for file_path in sorted(files):
            arcname = file_path.relative_to(ROOT).as_posix()
            archive.write(file_path, arcname)

    with zipfile.ZipFile(DEST, "r") as archive:
        bad_member = archive.testzip()
        if bad_member:
            raise RuntimeError(f"zip validation failed for {bad_member}")
        archive.extractall(EXTRACT_DIR)
        entry_count = len(archive.infolist())

    extracted_count = sum(1 for item in EXTRACT_DIR.rglob("*") if item.is_file())
    print(f"archive={DEST.name}")
    print(f"entries={entry_count}")
    print(f"extracted_files={extracted_count}")


if __name__ == "__main__":
    main()
