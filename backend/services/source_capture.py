from __future__ import annotations

from pathlib import Path


def write_text_capture(directory: Path, filename: str, content: str) -> Path:
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / filename
    path.write_text(content or "", encoding="utf-8")
    return path


def write_bytes_capture(directory: Path, filename: str, content: bytes) -> Path:
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / filename
    path.write_bytes(content or b"")
    return path
