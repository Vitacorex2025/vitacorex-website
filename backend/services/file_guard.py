from __future__ import annotations

from pathlib import Path

from fastapi import HTTPException, UploadFile

from backend.core.config import settings


ALLOWED_EXTENSIONS = {".pdf", ".xlsx", ".xls", ".csv", ".doc", ".docx", ".txt"}


def validate_upload_file(upload: UploadFile) -> dict[str, object]:
    filename = upload.filename or "upload"
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{extension or 'unknown'}'. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}.",
        )

    current = upload.file.tell()
    upload.file.seek(0, 2)
    size_bytes = upload.file.tell()
    upload.file.seek(current)

    max_bytes = settings.max_upload_file_size_mb * 1024 * 1024
    if size_bytes > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File '{filename}' exceeds the {settings.max_upload_file_size_mb} MB limit.",
        )

    return {"filename": filename, "extension": extension, "size_bytes": size_bytes}
