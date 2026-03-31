
from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

from backend.models.case_schema import CaseRecord, CaseStatus, DebtCaseExtraction, PartyDetails


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def active_source_files(record: CaseRecord):
    return [item for item in record.source_files if not getattr(item, "excluded_from_active_matter", False)]


def _preserved_party(existing: PartyDetails | None, default_role) -> PartyDetails:
    if existing:
        clone = PartyDetails.model_validate(existing.model_dump())
        clone.source_evidence = []
        return clone
    return PartyDetails(party_role=default_role)


def reset_processing_state(record: CaseRecord, preserve_parties: bool = False) -> CaseRecord:
    plaintiff = _preserved_party(record.extracted_case_data.plaintiff if preserve_parties else None, "plaintiff")
    defendant = _preserved_party(record.extracted_case_data.defendant_entity if preserve_parties else None, "defendant_entity")
    extraction = DebtCaseExtraction(
        plaintiff=plaintiff,
        defendant_entity=defendant,
    )
    extraction.processed_at = None
    extraction.amount_in_controversy = Decimal("0.00")
    extraction.amount_reconciliation.approved_total = Decimal("0.00")
    extraction.amount_reconciliation.approved_reconciled_total = Decimal("0.00")
    extraction.amount_reconciliation.case_summary_total = Decimal("0.00")
    extraction.amount_reconciliation.review_approved = False
    extraction.amount_reconciliation.status = "pending"
    record.extracted_case_data = extraction
    record.sunbiz_lookup = None
    record.entity_verification = None
    record.jurisdiction_analysis = None
    record.contract_review = None
    record.packet_generation = None
    record.generation_progress = None
    record.status = CaseStatus.UPLOADED.value if active_source_files(record) else CaseStatus.DRAFT.value
    return record


def case_summary_total(record: CaseRecord) -> Decimal:
    reconciliation = record.extracted_case_data.amount_reconciliation
    amount = reconciliation.case_summary_total or reconciliation.approved_reconciled_total or reconciliation.approved_total or record.extracted_case_data.amount_in_controversy
    return Decimal(str(amount or "0")).quantize(Decimal("0.01"))


def synchronize_case_status(record: CaseRecord) -> str:
    extraction = record.extracted_case_data
    sources = active_source_files(record)

    if not sources:
        extraction.processed_at = None
        extraction.amount_in_controversy = Decimal("0.00")
        extraction.amount_reconciliation.approved_total = Decimal("0.00")
        extraction.amount_reconciliation.approved_reconciled_total = Decimal("0.00")
        extraction.amount_reconciliation.case_summary_total = Decimal("0.00")
        record.packet_generation = None
        if record.generation_progress:
            record.generation_progress.status = "blocked"
            record.generation_progress.message = "Generation results were invalidated because no active source files remain."
        record.status = CaseStatus.DRAFT.value
        return record.status

    blockers = []
    blockers.extend(extraction.matter_consistency.blockers)
    blockers.extend(extraction.amount_reconciliation.blockers)
    blockers.extend(extraction.missing_required_facts)

    if blockers:
        record.packet_generation = None
        if record.generation_progress and record.generation_progress.status == "completed":
            record.generation_progress.status = "blocked"
            record.generation_progress.message = "Generation results were invalidated by later blockers."
        record.status = CaseStatus.BLOCKED.value
        return record.status

    if not extraction.processed_at:
        record.packet_generation = None
        if record.generation_progress and record.generation_progress.status == "completed":
            record.generation_progress.status = "blocked"
            record.generation_progress.message = "Generation results were invalidated because the source set changed."
        record.status = CaseStatus.UPLOADED.value
        return record.status

    if record.generation_progress and record.generation_progress.status in {"queued", "generating"}:
        record.status = CaseStatus.GENERATING.value
        return record.status

    if record.packet_generation and record.packet_generation.documents:
        qa_failed = any(str(doc.status).lower() == "failed_qa" for doc in record.packet_generation.documents)
        if qa_failed:
            record.status = CaseStatus.GENERATION_FAILED.value
        else:
            record.status = CaseStatus.PACKET_GENERATED.value
        return record.status

    if record.sunbiz_lookup and record.sunbiz_lookup.result_classification == "verified_match" and record.sunbiz_lookup.official_record_available:
        record.status = CaseStatus.VERIFIED.value
        return record.status

    if extraction.processed_at and not record.sunbiz_lookup:
        record.status = CaseStatus.READY_FOR_VERIFICATION.value
        return record.status

    if extraction.processed_at:
        record.status = CaseStatus.READY_FOR_GENERATION.value
        return record.status

    record.status = CaseStatus.EXTRACTED.value
    return record.status
