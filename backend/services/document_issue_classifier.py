from __future__ import annotations

import re

from backend.models.case_schema import CaseRecord, StoredFile
from backend.services.case_state import active_source_files
from backend.services.irs_notice_parser import parse_irs_notice
from backend.services.invoice_recovery_parser import parse_invoice_recovery_matter

IRS_PATTERNS = [r"\bIRS\b", r"\bCP\d{2,4}[A-Z]?\b", r"\bLTR\s?\d+\b"]
SSA_PATTERNS = [r"\bSocial Security\b", r"\boverpayment\b"]
DEBT_PATTERNS = [r"\bdebt collector\b", r"\bvalidation notice\b", r"\battempt to collect\b"]
MEDICAL_PATTERNS = [r"\bpatient responsibility\b", r"\bEOB\b", r"\binsurance\b", r"\bclaim\b"]
AUTO_PATTERNS = [r"\bVIN\b", r"\bbuyer'?s order\b", r"\bretail installment\b", r"\bvehicle\b"]
CONTRACT_PATTERNS = [r"\bagreement\b", r"\bgoverning law\b", r"\bindemnify\b", r"\barbitration\b"]
INVOICE_PATTERNS = [r"\binvoice\b", r"\bbalance due\b", r"\bpayment terms\b"]
PERMIT_PATTERNS = [r"\bpermit\b", r"\blicense\b", r"\binspection\b", r"\bzoning\b"]
IMMIGRATION_PATTERNS = [r"\bUSCIS\b", r"\bI-130\b", r"\bI-485\b", r"\bbeneficiary\b", r"\bpetitioner\b"]


def _active_sources(record: CaseRecord) -> list[StoredFile]:
    return active_source_files(record) or list(record.source_files or [])


def _text_chunks(record: CaseRecord) -> list[str]:
    chunks: list[str] = []
    for item in _active_sources(record):
        text = (item.extracted_text or "").strip()
        if text:
            chunks.append(text)
        elif item.parsed_payload:
            chunks.append(str(item.parsed_payload))
        else:
            chunks.append(f"{item.original_filename} {item.file_type}")
    if record.title:
        chunks.append(record.title)
    if record.reference:
        chunks.append(record.reference)
    return chunks


def _has_pattern(patterns: list[str], blob: str) -> bool:
    return any(re.search(pattern, blob, re.IGNORECASE) for pattern in patterns)


def _has_file_type(record: CaseRecord, file_types: set[str]) -> bool:
    for item in _active_sources(record):
        if str(item.file_type or "").lower() in file_types:
            return True
    return False


def _has_service_scope(record: CaseRecord, service_scope: str) -> bool:
    target = (service_scope or "").strip().lower()
    if not target:
        return False
    for item in _active_sources(record):
        if str(item.service_scope or "").strip().lower() == target:
            return True
    return False


def _attach_payload(record: CaseRecord, key: str, value: dict[str, object]) -> None:
    payload = dict(getattr(record, "workflow_payload", {}) or {})
    payload[key] = value
    record.workflow_payload = payload


def classify_case_issue(record: CaseRecord) -> str:
    chunks = _text_chunks(record)
    blob = "\n".join(chunks)

    if not blob.strip():
        return "unknown"

    if _has_pattern(IRS_PATTERNS, blob):
        _attach_payload(record, "irs_notice", parse_irs_notice(chunks))
        return "irs_notice"

    if _has_pattern(SSA_PATTERNS, blob):
        return "ssa_overpayment_notice"

    if _has_pattern(IMMIGRATION_PATTERNS, blob):
        return "immigration_intake"

    if _has_pattern(DEBT_PATTERNS, blob):
        return "debt_collection_notice"

    if _has_pattern(MEDICAL_PATTERNS, blob):
        return "medical_bill"

    auto_match = _has_pattern(AUTO_PATTERNS, blob)
    if auto_match:
        return "vehicle_purchase_contract"

    has_invoice_docs = _has_file_type(record, {"invoice_excel", "invoice_csv", "invoice_pdf", "account_statement_pdf"})
    has_contract_docs = _has_file_type(record, {"contract_pdf", "guaranty_pdf"})
    has_invoice_keywords = _has_pattern(INVOICE_PATTERNS, blob)
    has_contract_keywords = _has_pattern(CONTRACT_PATTERNS, blob)
    has_invoice_scope = _has_service_scope(record, "invoice_recovery")

    if (has_invoice_docs or has_invoice_scope or has_invoice_keywords) and (has_contract_docs or has_contract_keywords or has_invoice_keywords):
        _attach_payload(record, "invoice_recovery", parse_invoice_recovery_matter(chunks))
        return "invoice_recovery_matter"

    if _has_pattern(PERMIT_PATTERNS, blob):
        return "permit_issue"

    if has_contract_docs or has_contract_keywords:
        return "business_contract"

    return "unknown"
