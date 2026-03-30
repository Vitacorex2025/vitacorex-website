
from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from backend.models.case_schema import CaseRecord, GeneratedDocument
from backend.services.template_registry import write_manifest
from backend.services.validation_service import collect_case_warnings, collect_missing_required_facts
from backend.services.zip_builder import ArchiveItem, build_case_zip


@dataclass(frozen=True)
class ExportBuildResult:
    zip_path: Path
    generated_at: datetime
    warnings: list[str]
    missing_items: list[str]
    manifest_path: Path


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def build_case_export(
    record: CaseRecord,
    output_dir: str | Path,
    generated_docs: list[GeneratedDocument],
    extra_warnings: list[str] | None = None,
) -> ExportBuildResult:
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    generated_at = _utcnow()
    archive_name = f"{record.id}_packet.zip"
    warnings = collect_case_warnings(record, extra_warnings)
    missing_items = collect_missing_required_facts(record)

    archive_items: list[ArchiveItem] = []
    for index, doc in enumerate(generated_docs, start=1):
        if str(doc.status).lower() != "generated":
            if doc.blocking_reason:
                missing_items.append(f"{doc.document_type}:{doc.blocking_reason}")
            continue
        source_path = Path(doc.document_path or "")
        if source_path.exists():
            archive_items.append(ArchiveItem(source_path=source_path, archive_name=f"docs/{index:02d}_{source_path.name}"))
        else:
            missing_items.append(f"generated_doc_missing:{doc.document_name}")


    if record.sunbiz_lookup and record.sunbiz_lookup.pdf_report_path:
        pdf_path = Path(record.sunbiz_lookup.pdf_report_path)
        if pdf_path.exists():
            archive_items.append(ArchiveItem(source_path=pdf_path, archive_name="verification/sunbiz_internal_verification_memo.pdf"))
    if record.sunbiz_lookup and record.sunbiz_lookup.evidence_package_path:
        evidence_path = Path(record.sunbiz_lookup.evidence_package_path)
        if evidence_path.exists():
            archive_items.append(ArchiveItem(source_path=evidence_path, archive_name="verification/sunbiz_evidence_package.json"))

    manifest_payload = {
        "case_id": record.id,
        "generated_at": generated_at.isoformat(),
        "status": record.status,
        "plaintiff_name": record.extracted_case_data.plaintiff.party_name,
        "defendant_name": record.extracted_case_data.defendant_entity.party_name,
        "amount_in_controversy": str(record.extracted_case_data.amount_reconciliation.case_summary_total or record.extracted_case_data.amount_in_controversy),
        "generated_documents": [doc.model_dump(mode="json") for doc in generated_docs],
        "warnings": warnings,
        "missing_items": missing_items,
    }
    manifest_path = _write_json(output_dir / "packet_manifest.json", manifest_payload)
    write_manifest(output_dir / "template_manifest.json", record)
    archive_items.append(ArchiveItem(source_path=manifest_path, archive_name="packet_manifest.json"))
    archive_items.append(ArchiveItem(source_path=output_dir / "template_manifest.json", archive_name="template_manifest.json"))

    zip_path = build_case_zip(record.id, output_dir, archive_items=archive_items, archive_name=archive_name)
    return ExportBuildResult(
        zip_path=zip_path,
        generated_at=generated_at,
        warnings=warnings,
        missing_items=missing_items,
        manifest_path=manifest_path,
    )
