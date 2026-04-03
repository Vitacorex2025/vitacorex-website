"""Upload validation: extension allowlist, size limits, filename sanitization.

Phase 4A: Validates files before storage across intakes, uploads, and contracts.
"""

import os
import re
from pathlib import PurePath

from fastapi import HTTPException

# --- Configuration -------------------------------------------------------

MAX_UPLOAD_MB = int(os.getenv("VCX_MAX_UPLOAD_MB", "25"))
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

# Allowed extensions (case-insensitive)
ALLOWED_EXTENSIONS = frozenset({
    ".pdf", ".doc", ".docx", ".txt", ".md",
    ".jpg", ".jpeg", ".png", ".gif",
    ".csv", ".xlsx", ".xls",
})

# Blocked extensions — executables & scripts (reject even if not in allowlist)
BLOCKED_EXTENSIONS = frozenset({
    ".exe", ".bat", ".cmd", ".sh", ".ps1",
    ".js", ".html", ".htm", ".php", ".py", ".rb", ".pl",
    ".com", ".scr", ".vbs", ".wsf", ".msi", ".jar",
    ".dll", ".sys", ".cpl", ".inf", ".reg",
})

# Allowed MIME types (lenient — browsers may report incorrect MIME)
ALLOWED_MIME_TYPES = frozenset({
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "text/csv",
    "text/x-markdown",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/octet-stream",  # Accept when extension is valid
})


# --- Public API ----------------------------------------------------------

def sanitize_filename(filename: str) -> str:
    """Strip dangerous characters, preserve extension, truncate to 200 chars."""
    if not filename:
        return "unnamed"

    # Remove path separators and null bytes
    name = filename.replace("/", "_").replace("\\", "_").replace("\x00", "")

    # Remove control characters (0x00-0x1f, 0x7f)
    name = re.sub(r"[\x00-\x1f\x7f]", "", name)

    # Remove leading/trailing dots and spaces
    name = name.strip(". ")

    if not name:
        return "unnamed"

    # Truncate to 200 characters, preserving extension
    path = PurePath(name)
    max_stem = 200 - len(path.suffix)
    return path.stem[:max_stem] + path.suffix


def validate_file(
    filename: str,
    size: int,
    content_type: str | None = None,
) -> str:
    """Validate a file upload.

    Returns the sanitized filename on success.
    Raises HTTPException(400|413) on failure.
    """
    if not filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    # 1. Extension check
    ext = PurePath(filename).suffix.lower()

    if ext in BLOCKED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File type '{ext}' is not allowed. "
                "Executable and script files are blocked for security."
            ),
        )

    if ext and ext not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' is not supported. Allowed: {allowed}",
        )

    if not ext:
        raise HTTPException(
            status_code=400,
            detail="File must have an extension (e.g., .pdf, .docx, .txt).",
        )

    # 2. Size check
    if size > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=(
                f"File too large ({size / (1024 * 1024):.1f} MB). "
                f"Maximum allowed: {MAX_UPLOAD_MB} MB."
            ),
        )

    if size == 0:
        raise HTTPException(status_code=400, detail="Empty file.")

    # 3. MIME type check (lenient — only reject clearly wrong MIME types)
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        # Allow broad text/* and application/* when extension is valid
        if not (
            content_type.startswith("text/")
            or content_type.startswith("application/")
            or content_type.startswith("image/")
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Content type '{content_type}' is not allowed.",
            )

    return sanitize_filename(filename)
