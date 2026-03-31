from __future__ import annotations

import shutil
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPORT = Path(r"C:\Users\sergz\CodexExports")
STAGE = EXPORT / "clean_release_stage"
VERIFY = EXPORT / "clean_release_verify"
ZIP_PATH = EXPORT / "clean_release.zip"
SIZE_REPORT = EXPORT / "SIZE_REPORT.md"
RUN_GUIDE = EXPORT / "RUN_GUIDE.md"
MANIFEST = EXPORT / "clean_release_manifest.txt"

INCLUDED_DIRS = ("app", "assets", "backend", "docs", "es", "ru")
SELECTED_SCRIPT_FILES = ("scripts/smoke_acceptance.py",)
ROOT_FILES = {
    ".env.example",
    "Dockerfile",
    "Procfile",
    "README.txt",
    "main.py",
    "app.html",
    "index.html",
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
EXCLUDED_DIR_NAMES = {
    ".venv",
    "venv",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".cache",
    "coverage",
    "htmlcov",
    "node_modules",
    ".next",
    "dist",
    "build",
    "tmp",
    "temp",
    "logs",
    ".git",
}
EXCLUDED_FILE_NAMES = {".DS_Store", "Thumbs.db"}
EXCLUDED_SUFFIXES = {".pyc", ".pyo", ".log", ".zip", ".tar", ".db", ".sqlite", ".sqlite3"}
EXCLUDED_PATHS = {"backend/template_library/uploaded"}
EXCLUDED_PART_PREFIXES = ("storage", "tmp_")


def rel_posix(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def include_root_item(path: Path) -> bool:
    if path.name in ROOT_FILES:
        return True
    if path.suffix.lower() in {".html", ".xml", ".webmanifest"} and path.name == path.name.lower():
        return True
    return False


def is_excluded(path: Path) -> bool:
    parts = path.relative_to(ROOT).parts
    scope_parts = parts[:-1] if path.is_file() else parts

    for idx in range(1, len(parts) + 1):
        if "/".join(parts[:idx]) in EXCLUDED_PATHS:
            return True

    for part in scope_parts:
        if part in EXCLUDED_DIR_NAMES:
            return True
        if any(part.startswith(prefix) for prefix in EXCLUDED_PART_PREFIXES):
            return True

    if path.is_file():
        if path.name in EXCLUDED_FILE_NAMES:
            return True
        if path.suffix.lower() in EXCLUDED_SUFFIXES:
            return True

    return False


def copy_file(src: Path) -> None:
    dst = STAGE / src.relative_to(ROOT)
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def human_size(size_bytes: int) -> str:
    value = float(size_bytes)
    for unit in ("B", "KB", "MB", "GB"):
        if value < 1024 or unit == "GB":
            return f"{value:.2f} {unit}"
        value /= 1024
    return f"{size_bytes} B"


def path_size(path: Path) -> int:
    if path.is_file():
        return path.stat().st_size
    return sum(item.stat().st_size for item in path.rglob("*") if item.is_file())


def why_included(relative_path: str, kind: str) -> str:
    if relative_path == "backend":
        return "FastAPI app, auth/session logic, services, templates, tests, and sample inputs for verification."
    if relative_path == "assets":
        return "Shared frontend runtime assets: CSS, JS, images, and browser shell logic."
    if relative_path == "app":
        return "Authenticated DocketMint HTML surfaces for Legal, Recovery, Calendar, intake, and settings."
    if relative_path == "ru":
        return "Russian public-route localization files shipped with the product."
    if relative_path == "es":
        return "Spanish public-route localization files shipped with the product."
    if relative_path == "docs":
        return "Docs required to run, validate, and deploy the release."
    if relative_path == "backend/tests":
        return "Regression suite included so a fresh checkout can be verified immediately."
    if relative_path == "backend/sample_inputs":
        return "Small fixtures used by the included verification tests."
    if relative_path == "backend/template_library":
        return "Template manifest and seeded templates required for runtime template features."
    if relative_path == "backend/template_library/seeded":
        return "Seeded document templates required for packet/template functionality on first deploy."
    if relative_path == "backend/services":
        return "Core service modules implementing auth, routing, storage, dashboards, and workflows."
    if relative_path == "assets/js":
        return "Client runtime logic for auth, i18n, navigation, shell, and dashboard hydration."
    if relative_path == "assets/css":
        return "Stylesheets needed by the public site and authenticated application shell."
    if relative_path == "app/home":
        return "Unified post-login home and engine switcher entry point."
    if relative_path == "app/recovery":
        return "Recovery Pipeline surface included in the release."
    if relative_path == "app/legal":
        return "Legal Workflow surface included in the release."
    if relative_path.endswith(".html"):
        return "Static public page that is part of the shipped site surface."
    if relative_path in {
        ".env.example",
        "render.yaml",
        "requirements.txt",
        "Dockerfile",
        "Procfile",
        "vercel.json",
        "pytest.ini",
        "main.py",
    }:
        return "Runtime or deployment configuration needed for install, startup, or verification."
    if relative_path.startswith("scripts/"):
        return "Included helper script for fresh smoke validation after install."
    return "Included because it belongs to the runtime or verification-ready release surface."


def build_release() -> None:
    EXPORT.mkdir(parents=True, exist_ok=True)

    for target in (STAGE, VERIFY):
        if target.exists():
            shutil.rmtree(target)
        target.mkdir(parents=True, exist_ok=True)

    for target in (ZIP_PATH, SIZE_REPORT, RUN_GUIDE, MANIFEST):
        if target.exists():
            target.unlink()

    included_files: list[Path] = []

    for dirname in INCLUDED_DIRS:
        base = ROOT / dirname
        if not base.exists():
            continue
        for item in base.rglob("*"):
            if not item.is_file():
                continue
            if is_excluded(item):
                continue
            copy_file(item)
            included_files.append(item)

    for relative in SELECTED_SCRIPT_FILES:
        target = ROOT / relative
        if target.exists() and target.is_file() and not is_excluded(target):
            copy_file(target)
            included_files.append(target)

    for item in ROOT.iterdir():
        if not item.is_file():
            continue
        if is_excluded(item):
            continue
        if include_root_item(item):
            copy_file(item)
            included_files.append(item)

    deduped = sorted({path.resolve(): path for path in included_files}.values(), key=rel_posix)
    MANIFEST.write_text("\n".join(rel_posix(path) for path in deduped) + "\n", encoding="utf-8")

    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for src in deduped:
            archive.write(src, rel_posix(src))

    with zipfile.ZipFile(ZIP_PATH, "r") as archive:
        bad_member = archive.testzip()
        if bad_member:
            raise RuntimeError(f"zip validation failed for {bad_member}")
        archive.extractall(VERIFY)
        zip_entries = len(archive.infolist())

    verified_files = sum(1 for item in VERIFY.rglob("*") if item.is_file())
    zip_size = ZIP_PATH.stat().st_size

    candidate_paths: list[Path] = list(STAGE.iterdir())
    for relative in (
        "backend/tests",
        "backend/sample_inputs",
        "backend/template_library",
        "backend/template_library/seeded",
        "backend/services",
        "assets/js",
        "assets/css",
        "app/home",
        "app/recovery",
        "app/legal",
    ):
        target = STAGE / relative
        if target.exists():
            candidate_paths.append(target)

    seen: set[Path] = set()
    unique_candidates: list[Path] = []
    for item in candidate_paths:
        resolved = item.resolve()
        if resolved in seen:
            continue
        seen.add(resolved)
        unique_candidates.append(item)

    ranked = sorted(
        (
            {
                "path": item,
                "kind": "dir" if item.is_dir() else "file",
                "size": path_size(item),
            }
            for item in unique_candidates
        ),
        key=lambda entry: (-entry["size"], entry["path"].as_posix().lower()),
    )[:20]

    size_lines = [
        "# SIZE REPORT",
        "",
        f"- Archive: `{ZIP_PATH}`",
        f"- Final ZIP size: `{human_size(zip_size)}` ({zip_size} bytes)",
        f"- Included file count: `{len(deduped)}`",
        f"- Verified extracted file count: `{verified_files}`",
        f"- ZIP entry count: `{zip_entries}`",
        "",
        "## Top 20 Largest Included Folders/Files",
        "",
        "| Rank | Type | Path | Size | Why it is necessary |",
        "| --- | --- | --- | ---: | --- |",
    ]
    for index, item in enumerate(ranked, start=1):
        relative = item["path"].relative_to(STAGE).as_posix()
        size_lines.append(
            f"| {index} | {item['kind']} | `{relative}` | {human_size(item['size'])} | {why_included(relative, item['kind'])} |"
        )
    SIZE_REPORT.write_text("\n".join(size_lines) + "\n", encoding="utf-8")

    run_guide = """# RUN GUIDE

## Fresh Dependencies

1. Install Python 3.11+.
2. Create a fresh virtual environment.
3. Install dependencies with `pip install -r requirements.txt`.

## Exact Startup Steps

1. Unzip `clean_release.zip` into a fresh folder.
2. Create and activate a new virtual environment.
3. Install dependencies:

```powershell
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
```

4. Configure environment variables. Minimum local example:

```powershell
$env:DOCKETMINT_ENV='development'
$env:DOCKETMINT_API_PREFIX='/api'
$env:DOCKETMINT_STORAGE_PATH=(Resolve-Path '.').Path + '\\storage'
```

5. Start the app:

```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

6. Open the app:
   - Public site: `http://127.0.0.1:8000/`
   - Sign-in: `http://127.0.0.1:8000/app/sign-in/`
   - System status: `http://127.0.0.1:8000/api/system-status`

## Fresh Verification

```powershell
python -m pytest backend/tests -q
python scripts/smoke_acceptance.py
```

## Render-Oriented Production Notes

1. Use `render.yaml` as the production blueprint.
2. Keep persistent storage on `/var/data`.
3. Set:
   - `DOCKETMINT_RENDER_DISK_MOUNT_PATH=/var/data`
   - `DOCKETMINT_STORAGE_PATH=/var/data/docketmint-storage`
4. Review `docs/RELEASE_RUNBOOK.md` before deploy.

## Intentionally NOT Bundled

- Local virtual environments: `.venv`, `venv`
- Python caches: `__pycache__`, `.pytest_cache`, `.mypy_cache`, `.cache`
- Coverage/build artifacts: `coverage`, `htmlcov`, `dist`, `build`, `.next`
- Dependency/vendor folders: `node_modules`
- Local temp/runtime folders: `tmp*`, `temp`, `logs`, `storage*`
- Local uploads/backups and generated auth/storage databases
- Existing release ZIP/TAR packages and validation extracts
- Local desktop/runtime junk such as `.DS_Store`, `Thumbs.db`, `.git`
- Runtime-uploaded template files under `backend/template_library/uploaded`

## Release Package Scope

This ZIP intentionally includes source code, configs, public/app assets, docs, backend tests, sample inputs, and seeded template assets needed to run or verify a fresh release. It is not a workstation snapshot.
"""
    RUN_GUIDE.write_text(run_guide, encoding="utf-8")

    print(f"ZIP={ZIP_PATH}")
    print(f"ZIP_SIZE={zip_size}")
    print(f"STAGED_FILES={len(deduped)}")
    print(f"VERIFY_FILES={verified_files}")
    print(f"SIZE_REPORT={SIZE_REPORT}")
    print(f"RUN_GUIDE={RUN_GUIDE}")
    print(f"MANIFEST={MANIFEST}")


if __name__ == "__main__":
    build_release()
