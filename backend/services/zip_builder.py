from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from zipfile import ZIP_DEFLATED, ZipFile

from backend.models.case_schema import GeneratedDocument


@dataclass(frozen=True)
class ArchiveItem:
    source_path: Path
    archive_name: str


def _normalize_archive_name(value: str) -> str:
    normalized = value.replace("\\", "/").strip().lstrip("/")
    if not normalized:
        raise ValueError("Archive item name cannot be empty.")
    return normalized


def _legacy_archive_items(
    generated_docs: list[GeneratedDocument] | None,
    extra_paths: list[str | Path] | None,
) -> list[ArchiveItem]:
    items: list[ArchiveItem] = []

    for doc in generated_docs or []:
        path = Path(doc.document_path)
        items.append(ArchiveItem(source_path=path, archive_name=path.name))

    for extra in extra_paths or []:
        path = Path(extra)
        items.append(ArchiveItem(source_path=path, archive_name=path.name))

    return items


def _dedupe_archive_items(items: Iterable[ArchiveItem]) -> list[ArchiveItem]:
    deduped: list[ArchiveItem] = []
    seen: dict[str, int] = {}

    for item in items:
        source_path = Path(item.source_path)
        archive_name = _normalize_archive_name(item.archive_name)

        if archive_name not in seen:
            seen[archive_name] = 0
            deduped.append(ArchiveItem(source_path=source_path, archive_name=archive_name))
            continue

        seen[archive_name] += 1
        counter = seen[archive_name]
        path = Path(archive_name)
        candidate = path.with_name(f"{path.stem}_{counter}{path.suffix}")
        candidate_name = _normalize_archive_name(candidate.as_posix())

        while candidate_name in seen:
            counter += 1
            candidate = path.with_name(f"{path.stem}_{counter}{path.suffix}")
            candidate_name = _normalize_archive_name(candidate.as_posix())

        seen[archive_name] = counter
        seen[candidate_name] = 0
        deduped.append(ArchiveItem(source_path=source_path, archive_name=candidate_name))

    return deduped


def build_case_zip(
    case_id: str,
    output_dir: str | Path,
    generated_docs: list[GeneratedDocument] | None = None,
    extra_paths: list[str | Path] | None = None,
    archive_items: list[ArchiveItem] | None = None,
    archive_name: str | None = None,
) -> Path:
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    zip_name = archive_name or f"{case_id}_packet.zip"
    zip_path = output_dir / zip_name

    items = archive_items if archive_items is not None else _legacy_archive_items(generated_docs, extra_paths)
    items = _dedupe_archive_items(items)

    if zip_path.exists():
        zip_path.unlink()

    with ZipFile(zip_path, "w", compression=ZIP_DEFLATED) as archive:
        for item in items:
            source_path = Path(item.source_path)
            if not source_path.exists() or not source_path.is_file():
                continue
            archive.write(source_path, arcname=_normalize_archive_name(item.archive_name))

    return zip_path
