
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from backend.models.case_schema import CaseRecord, CaseStatus, GeneratedDocument
from backend.services.case_state import active_source_files, case_summary_total
from backend.services.recovery_routing_engine import determine_recovery_route
from backend.services.template_registry import manifest_payload, strict_templates

CORE_REQUIRED_DOCUMENT_TYPES = tuple(item.document_type for item in strict_templates())
OPTIONAL_WHEN_NO_GUARANTOR = {"summons_individual"}
SUNBIZ_REQUIRED_DOCUMENT_TYPES = {"request_for_issuance_of_summons", "summons_company"}


@dataclass
class PacketReadinessResult:
    is_ready: bool
    blockers: list[str]
    warnings: list[str]
    allowed_document_types: list[str]
    verification_required: bool = True

    @property
    def expected_document_types(self) -> list[str]:
        return self.allowed_document_types


def dedupe_messages(values: Iterable[object]) -> list[str]:
    results: list[str] = []
    seen: set[str] = set()
    for value in values:
        normalized = " ".join(str(value).split()).strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        results.append(normalized)
    return results


def expected_document_types(record: CaseRecord) -> list[str]:
    expected = list(CORE_REQUIRED_DOCUMENT_TYPES)
    if not record.extracted_case_data.separate_summons_required:
        expected = [doc_type for doc_type in expected if doc_type not in OPTIONAL_WHEN_NO_GUARANTOR]
    return expected


def has_verified_sunbiz(record: CaseRecord) -> bool:
    result = record.sunbiz_lookup
    if not result:
        return False
    if result.result_classification == "verified_match" and result.official_record_available:
        return bool(result.registered_agent_name or result.registered_agent_address or result.officers)
    return False


def sunbiz_state_label(record: CaseRecord) -> str:
    result = record.sunbiz_lookup
    if not result or not result.looked_up_at:
        return "not_run"
    raw = str(result.result_classification or result.provider_status or "not_run").lower()
    if raw in {"verified_match"}:
        return "verified_florida_match"
    if raw in {"no_match", "no_official_match_found"}:
        return "no_florida_match_found"
    if raw in {"unavailable", "provider_unavailable", "provider_unavailable_or_not_implemented"}:
        return "provider_unavailable"
    return raw or "not_run"


def collect_document_blockers(record: CaseRecord, document_type: str) -> list[str]:
    blockers: list[str] = []
    data = record.extracted_case_data
    sunbiz_state = sunbiz_state_label(record)
    if document_type in SUNBIZ_REQUIRED_DOCUMENT_TYPES and not has_verified_sunbiz(record):
        if sunbiz_state == "no_florida_match_found":
            blockers.append("No Florida Division of Corporations match exists for this matter. Florida registered-agent service documents are blocked.")
        elif sunbiz_state == "provider_unavailable":
            blockers.append("SunBiz integration is unavailable. Florida registered-agent service documents are blocked until attorney/staff review.")
        else:
            blockers.append("Verified SunBiz registered-agent data is required before generating this company-service document.")
    if document_type in SUNBIZ_REQUIRED_DOCUMENT_TYPES:
        verified_address = None
        if record.sunbiz_lookup:
            verified_address = record.sunbiz_lookup.registered_agent_address or record.sunbiz_lookup.principal_address
        if not verified_address:
            blockers.append("No verified Florida registered-agent or registered-office address is available for company service.")
    if document_type == "complaint":
        if data.personal_guarantor and not data.personal_guarantor.party_name:
            blockers.append("Guarantor count was selected without a guarantor name.")
        if not data.plaintiff.party_name or not data.defendant_entity.party_name:
            blockers.append("Complaint generation requires non-blank plaintiff and defendant names from a single matter.")
        missing_fact_labels: list[str] = []
        if not data.governing_law:
            missing_fact_labels.append("governing law")
        if not data.payment_terms:
            missing_fact_labels.append("payment terms")
        if not data.default_terms:
            missing_fact_labels.append("default terms")
        if not data.interest_terms:
            missing_fact_labels.append("interest terms")
        if not data.venue.venue_clause:
            missing_fact_labels.append("venue clause")
        if missing_fact_labels:
            blockers.append(
                "Complaint generation requires extracted or reviewed contract facts for: "
                + ", ".join(missing_fact_labels)
                + "."
            )
    if document_type == "demand_letter":
        if not data.plaintiff.party_name or not data.defendant_entity.party_name:
            blockers.append("Demand letter generation requires non-blank plaintiff and addressee names from a single matter.")
        service_address = (
            data.service_address
            or data.business_address
            or data.defendant_entity.address
            or (data.personal_guarantor.address if data.personal_guarantor else None)
        )
        if not service_address:
            blockers.append("Demand letter generation requires a service or business address for the addressee.")
    return dedupe_messages(blockers)


def template_coverage_report(record: CaseRecord, generated_docs: list[GeneratedDocument] | None = None) -> dict[str, object]:
    expected = expected_document_types(record)
    generated_types = [doc.document_type for doc in (generated_docs or []) if str(doc.status).lower() == "generated"]
    blocked = [doc.document_type for doc in (generated_docs or []) if str(doc.status).lower() != "generated"]
    missing_document_types = [doc_type for doc_type in expected if doc_type not in generated_types]
    manifest = manifest_payload(record)
    missing_template_files = manifest.get("missing_templates", [])
    return {
        "expected_document_types": expected,
        "generated_document_types": generated_types,
        "blocked_or_missing_document_types": blocked,
        "missing_document_types": missing_document_types,
        "missing_template_files": missing_template_files,
        "passed": not missing_document_types,
    }


def collect_missing_required_facts(record: CaseRecord) -> list[str]:
    extraction = record.extracted_case_data
    missing: list[str] = list(extraction.missing_required_facts)
    if not active_source_files(record):
        missing.append("source_files")
    if extraction.processed_at and not extraction.plaintiff.party_name:
        missing.append("plaintiff.party_name")
    if extraction.processed_at and not extraction.defendant_entity.party_name:
        missing.append("defendant_entity.party_name")
    if extraction.processed_at and not extraction.venue.venue_county:
        missing.append("venue.venue_county")
    if extraction.processed_at and not extraction.invoice_summary.line_items:
        missing.append("invoice_summary.line_items")
    if extraction.processed_at and case_summary_total(record) <= 0:
        missing.append("amount_in_controversy")
    return dedupe_messages(missing)


def collect_case_warnings(record: CaseRecord, extra_warnings: list[str] | None = None) -> list[str]:
    extraction = record.extracted_case_data
    warnings: list[str] = []
    warnings.extend(extraction.warnings)
    warnings.extend(extraction.invoice_summary.warnings)
    warnings.extend(extraction.invoice_summary.conflicts)
    warnings.extend(extraction.matter_consistency.warnings)
    warnings.extend(extraction.amount_reconciliation.warnings)
    if record.sunbiz_lookup:
        warnings.extend(record.sunbiz_lookup.warnings)
    if getattr(record, "entity_verification", None):
        warnings.extend(record.entity_verification.warnings)
        warnings.extend(record.entity_verification.provider_limitations)
    if getattr(record, "jurisdiction_analysis", None):
        warnings.extend(record.jurisdiction_analysis.blockers)
        warnings.extend(record.jurisdiction_analysis.service_notes)
    for uploaded in [*record.source_files, *record.template_files]:
        warnings.extend(uploaded.warnings)
    manifest = manifest_payload(record)
    for filename in manifest.get("missing_templates", []):
        warnings.append(f"Template missing: {filename}")
    if extra_warnings:
        warnings.extend(extra_warnings)
    return dedupe_messages(warnings)


def determine_case_status(record: CaseRecord) -> str:
    readiness = assess_packet_readiness(record)
    if readiness.blockers:
        return CaseStatus.BLOCKED.value
    if record.sunbiz_lookup and record.sunbiz_lookup.result_classification == "verified_match" and record.sunbiz_lookup.official_record_available:
        return CaseStatus.VERIFIED.value
    if record.extracted_case_data.processed_at and not record.sunbiz_lookup:
        return CaseStatus.READY_FOR_VERIFICATION.value
    if record.extracted_case_data.processed_at:
        return CaseStatus.READY_FOR_GENERATION.value
    if active_source_files(record):
        return CaseStatus.UPLOADED.value
    return CaseStatus.DRAFT.value


def collect_generation_blockers(record: CaseRecord, include_verification_gate: bool = True) -> list[str]:
    extraction = record.extracted_case_data
    blockers: list[str] = []
    source_files = active_source_files(record)
    processed = bool(extraction.processed_at and source_files)
    approved_source_set = list(extraction.source_set_used or (extraction.matter_consistency.source_set_used if extraction.matter_consistency else []) or [])
    verification_required = bool(processed and extraction.defendant_entity.party_name)

    if not source_files:
        blockers.append("No source evidence is uploaded for this case.")
    if source_files and not extraction.processed_at:
        blockers.append("Matter has not been processed into a canonical snapshot.")
    if processed and not approved_source_set:
        blockers.append("No approved single-matter source set exists.")
    if processed:
        blockers.extend(collect_missing_required_facts(record))
        blockers.extend(extraction.matter_consistency.blockers)
        blockers.extend(extraction.amount_reconciliation.blockers)
        if str(extraction.matter_consistency.status or "").lower() not in {"pass", "approved"}:
            blockers.append("Matter consistency is unresolved.")
        if case_summary_total(record) <= 0:
            blockers.append("No reconciled amount is approved for generation.")
    if verification_required and include_verification_gate:
        state = sunbiz_state_label(record)
        if state == "not_run":
            blockers.append("SunBiz verification has not been run for this matter.")
        elif state == "provider_unavailable":
            blockers.append("SunBiz provider is unavailable, so Florida verification remains incomplete.")
    if record.jurisdiction_analysis and record.jurisdiction_analysis.blockers:
        blockers.extend(record.jurisdiction_analysis.blockers)
    if str(record.issue_category or "").strip().lower() == "invoice_recovery_matter":
        route = determine_recovery_route(record)
        if not route.get("generation_allowed"):
            blockers.extend(route.get("blockers") or [])
            blockers.extend(route.get("missing_evidence") or [])
    return dedupe_messages(blockers)


def assess_packet_readiness(record: CaseRecord) -> PacketReadinessResult:
    extraction = record.extracted_case_data
    source_files = active_source_files(record)
    verification_required = bool(extraction.processed_at and source_files and extraction.defendant_entity.party_name)
    blockers = collect_generation_blockers(record, include_verification_gate=False)
    warnings = collect_case_warnings(record)
    verification_state = sunbiz_state_label(record)
    if verification_required:
        if verification_state == "not_run":
            warnings.append("SunBiz verification is still recommended before generating Florida registered-agent service documents.")
        elif verification_state == "provider_unavailable":
            warnings.append("SunBiz provider is unavailable, so Florida registered-agent service documents will remain blocked until staff review.")
        elif verification_state == "no_florida_match_found":
            warnings.append("No Florida Division of Corporations match was found, so Florida registered-agent service documents remain blocked.")
    warnings = dedupe_messages(warnings)
    allowed = [] if blockers else expected_document_types(record)
    return PacketReadinessResult(
        is_ready=not blockers,
        blockers=blockers,
        warnings=warnings,
        allowed_document_types=allowed,
        verification_required=verification_required,
    )


def archive_source_file_name(index: int, original_filename: str, file_type: str) -> str:
    source_path = Path(original_filename or f"source_{index}")
    safe_type = "".join(ch if ch.isalnum() else "_" for ch in (file_type or "source").lower()).strip("_") or "source"
    safe_name = "".join(ch if ch.isalnum() or ch in {"_", "-"} else "_" for ch in source_path.stem.lower()).strip("_")
    safe_name = safe_name or f"source_{index}"
    return f"source/{index:02d}_{safe_type}_{safe_name}{source_path.suffix.lower()}"
