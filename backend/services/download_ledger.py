
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from backend.models.case_schema import CaseRecord, DownloadLedgerEntry
from backend.services.case_store import save_case


def _utcnow():
    return datetime.now(timezone.utc)


def sync_generated_outputs(record: CaseRecord) -> CaseRecord:
    existing_by_name = {item.file_name: item for item in record.download_ledger}
    generated = []
    owner_service_slug = record.workflow_slug or "matter_workspace"

    if record.packet_generation:
        for doc in record.packet_generation.documents:
            if str(doc.status).lower() != "generated":
                continue
            generated.append(
                {
                    "file_name": Path(doc.document_path or doc.document_name).name,
                    "file_path": doc.document_path,
                    "download_url": doc.download_url,
                    "category": "generated_output",
                    "metadata": {
                        "document_type": doc.document_type,
                        "packet_version": record.packet_generation.version_number,
                        "release_state": record.packet_generation.release_state,
                        "generation_qa_status": record.packet_generation.generation_qa_status,
                    },
                    "generated_at": record.packet_generation.generated_at,
                    "owner_kind": "case",
                    "owner_id": record.id,
                    "service_slug": owner_service_slug,
                }
            )
        if record.packet_generation.zip_path:
            generated.append(
                {
                    "file_name": Path(record.packet_generation.zip_path).name,
                    "file_path": record.packet_generation.zip_path,
                    "download_url": record.packet_generation.download_url,
                    "category": "zip_package",
                    "metadata": {
                        "selected_document_types": record.packet_generation.selected_document_types,
                        "packet_version": record.packet_generation.version_number,
                        "release_state": record.packet_generation.release_state,
                        "generation_qa_status": record.packet_generation.generation_qa_status,
                    },
                    "generated_at": record.packet_generation.generated_at,
                    "owner_kind": "case",
                    "owner_id": record.id,
                    "service_slug": owner_service_slug,
                }
            )

    if record.contract_review:
        if record.contract_review.revised_contract_path:
            generated.append(
                {
                    "file_name": Path(record.contract_review.revised_contract_path).name,
                    "file_path": record.contract_review.revised_contract_path,
                    "download_url": record.contract_review.revised_contract_download_url,
                    "category": "contract_review_output",
                    "metadata": {"kind": "revised_contract"},
                    "generated_at": record.contract_review.generated_at or _utcnow(),
                    "owner_kind": "case",
                    "owner_id": record.id,
                    "service_slug": owner_service_slug,
                }
            )
        if record.contract_review.change_memo_path:
            generated.append(
                {
                    "file_name": Path(record.contract_review.change_memo_path).name,
                    "file_path": record.contract_review.change_memo_path,
                    "download_url": record.contract_review.change_memo_download_url,
                    "category": "contract_review_output",
                    "metadata": {"kind": "change_memo"},
                    "generated_at": record.contract_review.generated_at or _utcnow(),
                    "owner_kind": "case",
                    "owner_id": record.id,
                    "service_slug": owner_service_slug,
                }
            )

    for item in record.action_packet_outputs or []:
        if not item.download_url or not item.file_path:
            continue
        generated.append(
            {
                "file_name": Path(item.file_path).name,
                "file_path": item.file_path,
                "download_url": item.download_url,
                "category": item.type or "action_packet_output",
                "metadata": {"label": item.label or item.type},
                "generated_at": _utcnow(),
                "owner_kind": item.owner_kind or "case",
                "owner_id": item.owner_id or record.id,
                "service_slug": item.service_slug or owner_service_slug,
            }
        )

    for item in generated:
        current = existing_by_name.get(item["file_name"])
        if current:
            current.file_path = item["file_path"]
            current.download_url = item["download_url"]
            current.available = True
            current.category = item["category"]
            current.metadata.update(item["metadata"])
            current.owner_kind = item["owner_kind"]
            current.owner_id = item["owner_id"]
            current.service_slug = item["service_slug"]
        else:
            record.download_ledger.append(
                DownloadLedgerEntry(
                    id=uuid4().hex[:12],
                    category=item["category"],
                    file_name=item["file_name"],
                    file_path=item["file_path"],
                    download_url=item["download_url"],
                    generated_at=item["generated_at"],
                    metadata=item["metadata"],
                    owner_kind=item["owner_kind"],
                    owner_id=item["owner_id"],
                    service_slug=item["service_slug"],
                )
            )
    return record


def mark_downloaded(record: CaseRecord, ledger_id: str) -> DownloadLedgerEntry:
    for item in record.download_ledger:
        if item.id == ledger_id:
            item.downloaded_at = _utcnow()
            save_case(record)
            return item
    raise FileNotFoundError(f"Download ledger entry '{ledger_id}' was not found.")


def visible_entries(record: CaseRecord) -> list[DownloadLedgerEntry]:
    sync_generated_outputs(record)
    return [item for item in record.download_ledger if item.available]
