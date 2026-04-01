from __future__ import annotations

import re
from datetime import datetime, timezone
from decimal import Decimal
from typing import Iterable

from backend.models.case_schema import (
    AmountReconciliation,
    CaseRecord,
    CountyCandidate,
    DebtCaseExtraction,
    FloridaCourtDecision,
    FloridaCourtLevel,
    InvoiceLineItem,
    InvoiceSummary,
    LegalCountDecision,
    MatterConsistencyReport,
    PartyDetails,
    PartyRole,
)
from backend.services.amount_parser import parse_amount
from backend.services.case_state import active_source_files
from backend.services.matter_validator import analyze_case_sources, entity_key, source_kind_from_item

COUNTY_CIVIL_LIMIT = Decimal("50000")


def _clean(value: object | None) -> str | None:
    text = " ".join(str(value or "").replace("\u00a0", " ").split()).strip(" \n\t\r,;")
    return text or None


def _normalize_whitespace(text: str) -> str:
    return re.sub(r"[ \t]+", " ", (text or "").replace("\r", "\n")).replace("\n ", "\n").strip()


def _first_match(patterns: Iterable[str], text: str, flags: int = re.IGNORECASE | re.MULTILINE | re.DOTALL) -> str | None:
    for pattern in patterns:
        match = re.search(pattern, text or "", flags=flags)
        if match:
            groups = [group for group in match.groups() if group is not None]
            if len(groups) >= 2:
                return _clean(" ".join(groups))
            if groups:
                return _clean(groups[0])
            return _clean(match.group(0))
    return None


def _find_sentence(text: str, keywords: Iterable[str]) -> str | None:
    sentences = re.split(r"(?<=[.!?])\s+", text or "")
    for sentence in sentences:
        lowered = sentence.lower()
        if all(keyword.lower() in lowered for keyword in keywords):
            return _clean(sentence)
    return None


def _find_counties(text: str) -> list[str]:
    if not text:
        return []
    pattern = r"\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*)\s+County(?:,\s*Florida)?\b"
    matches: list[str] = []
    for match in re.finditer(pattern, text):
        county = _clean(match.group(1))
        if county:
            matches.append(county)
    seen: set[str] = set()
    results: list[str] = []
    for county in matches:
        key = county.lower()
        if key not in seen:
            seen.add(key)
            results.append(county)
    return results


def _first_email(text: str) -> str | None:
    match = re.search(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", text or "", flags=re.IGNORECASE)
    return match.group(0) if match else None


def _first_phone(text: str) -> str | None:
    match = re.search(r"(\+?1?[\s-]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})", text or "")
    return _clean(match.group(1)) if match else None


def _address_candidates(text: str) -> list[str]:
    patterns = [
        r"(\d{1,6}[^\n,]{0,70},\s*[A-Za-z .'-]+,\s*(?:[A-Za-z ]+|[A-Z]{2})\s+\d{5}(?:-\d{4})?)",
        r"(\d{1,6}[^\n]{0,70}\n[A-Za-z .'-]+,\s*(?:[A-Za-z ]+|[A-Z]{2})\s+\d{5}(?:-\d{4})?)",
        r"Billing Address\s*\*?\s*([\s\S]{0,150}?)Phone Number",
        r"Address:\s*([\s\S]{0,150}?)Phone:",
    ]
    results: list[str] = []
    for pattern in patterns:
        for match in re.finditer(pattern, text or "", flags=re.IGNORECASE):
            value = match.group(1).replace("Phone:", "").replace("\n", ", ")
            value = _clean(value)
            if value and any(char.isdigit() for char in value):
                results.append(value)
    deduped: list[str] = []
    seen: set[str] = set()
    for value in results:
        key = value.lower()
        if key not in seen:
            seen.add(key)
            deduped.append(value)
    return deduped


def _infer_entity_type(name: str | None) -> str | None:
    value = (name or "").upper()
    if not value:
        return None
    if value.endswith("LLC") or " LLC" in value:
        return "Limited Liability Company"
    if value.endswith("INC") or value.endswith("INC.") or " INC" in value or value.endswith("CORP") or " CORP" in value:
        return "Corporation"
    if value.endswith("LP") or " LP" in value:
        return "Limited Partnership"
    return None


def _entity_phrase(entity_type: str | None) -> str | None:
    normalized = (entity_type or "").lower()
    if "limited liability company" in normalized:
        return "a limited liability company"
    if "corporation" in normalized:
        return "a corporation"
    if "limited partnership" in normalized:
        return "a limited partnership"
    return None


def _infer_court(amount: Decimal, venue_county: str | None) -> FloridaCourtDecision:
    if amount <= 0:
        return FloridaCourtDecision(
            court_level=FloridaCourtLevel.UNDETERMINED,
            court_division_label="Undetermined",
            amount_in_controversy=amount,
            venue_county=venue_county,
            reasoning=["Amount in controversy is missing or zero."],
        )
    if amount <= COUNTY_CIVIL_LIMIT:
        return FloridaCourtDecision(
            court_level=FloridaCourtLevel.COUNTY_CIVIL,
            court_division_label="County Court",
            amount_in_controversy=amount,
            venue_county=venue_county,
            reasoning=[f"Amount in controversy does not exceed ${COUNTY_CIVIL_LIMIT:,.0f}; County Court selected."],
        )
    return FloridaCourtDecision(
        court_level=FloridaCourtLevel.CIRCUIT_CIVIL,
        court_division_label="Circuit Court",
        amount_in_controversy=amount,
        venue_county=venue_county,
        reasoning=[f"Amount in controversy exceeds ${COUNTY_CIVIL_LIMIT:,.0f}; Circuit Court selected."],
    )


def _extract_pdf_debtor(text: str, filename: str) -> str | None:
    debtor = _first_match(
        [
            r"Company Name\s*\*?\s*\n([A-Za-z0-9 .,&'/-]+)",
            r"between\s+[A-Za-z0-9 .,&'/-]+?\s+\(the\s+(?:[“”\"])?Club Organizer(?:[“”\"])?\)\s+and\s+([A-Za-z0-9 .,&'/-]+?)\s+\(the\s+(?:[“”\"])?Customer(?:[“”\"])?\)",
            r"Total amount due[\s\S]{0,260}?\n([A-Z][A-Z0-9 .,&'/-]{2,})\nAddress:",
        ],
        text,
    )
    if debtor:
        return debtor
    prefix = re.split(r"[_(]", filename or "", maxsplit=1)[0]
    prefix = prefix.replace(".pdf", "").replace("-", " ")
    prefix = _clean(prefix)
    if prefix and len(prefix.split()) >= 2:
        return prefix
    return None


def _extract_pdf_plaintiff(text: str) -> str | None:
    return _first_match(
        [
            r"between\s+([A-Za-z0-9 .,&'/-]+?)\s+\(the\s+(?:[“”\"])?Club Organizer(?:[“”\"])?\)\s+and\s+[A-Za-z0-9 .,&'/-]+?\s+\(the\s+(?:[“”\"])?Customer(?:[“”\"])?\)",
            r"I hereby authorize\s+([A-Za-z0-9 .,&'/-]+?)\s+to initiate electronic withdrawals",
            r"^([A-Z][A-Za-z0-9 .,&'/-]{2,})\s*\nAddress:",
        ],
        text,
    )


def _extract_pdf_total(text: str) -> tuple[Decimal | None, float, str | None]:
    raw = _first_match(
        [
            r"Total amount due\s*\$?\s*([0-9][0-9\s,.\-]+)",
            r"Balance Due[:\s]*\$?\s*([0-9][0-9\s,.\-]+)",
            r"Total[:\s]*\$?\s*([0-9][0-9\s,.\-]+)",
        ],
        text,
    )
    if not raw:
        return None, 0.0, None
    parsed = parse_amount(raw)
    return parsed.value, parsed.confidence, parsed.warning


def _filtered_texts(record: CaseRecord, anchor_debtor_key: str | None, kinds: set[str]) -> list[str]:
    texts: list[str] = []
    for item in active_source_files(record):
        kind = source_kind_from_item(item)
        if kind not in kinds:
            continue
        text = _normalize_whitespace(item.extracted_text or "")
        if not text:
            continue
        if anchor_debtor_key:
            debtor = _extract_pdf_debtor(text, item.original_filename or item.filename)
            if debtor and entity_key(debtor) != anchor_debtor_key:
                continue
        texts.append(text)
    return texts


def _collect_excel_invoice_rows(record: CaseRecord, anchor_debtor_key: str | None) -> tuple[list[InvoiceLineItem], list[str], int]:
    rows: list[InvoiceLineItem] = []
    warnings: list[str] = []
    excluded_low_confidence = 0

    for item in active_source_files(record):
        if source_kind_from_item(item) not in {"invoice_excel", "invoice_csv"} or not isinstance(item.parsed_payload, dict):
            continue
        warnings.extend(item.parsed_payload.get("warnings", []))
        warnings.extend(item.parsed_payload.get("conflicts", []))
        excluded_low_confidence += int(item.parsed_payload.get("excluded_low_confidence_rows") or 0)

        for row in item.parsed_payload.get("line_items", []):
            customer_name = _clean(row.get("customer_name") or row.get("company"))
            if anchor_debtor_key and customer_name and entity_key(customer_name) != anchor_debtor_key:
                continue
            rows.append(
                InvoiceLineItem(
                    invoice_number=_clean(row.get("invoice_number")),
                    invoice_date=_clean(row.get("invoice_date")),
                    due_date=_clean(row.get("due_date")),
                    customer_name=customer_name,
                    original_amount=Decimal(str(row.get("original_amount") or "0")),
                    balance_due=Decimal(str(row.get("balance_due") or "0")),
                    raw_original_amount_text=_clean(row.get("raw_original_amount_text")),
                    raw_balance_due_text=_clean(row.get("raw_balance_due_text")),
                    parse_confidence=float(row.get("parse_confidence") or 0.0),
                    parse_warning=_clean(row.get("parse_warning")),
                    included_in_total=bool(row.get("included_in_total", True)),
                    source_sheet=_clean(row.get("source_sheet")),
                    source_row=row.get("source_row"),
                    source_filename=item.original_filename,
                    source_kind=source_kind_from_item(item),
                )
            )
    return rows, warnings, excluded_low_confidence


def _collect_pdf_invoice_rows(record: CaseRecord, anchor_debtor_key: str | None) -> tuple[list[InvoiceLineItem], list[str]]:
    rows: list[InvoiceLineItem] = []
    warnings: list[str] = []

    for item in active_source_files(record):
        if source_kind_from_item(item) not in {"invoice_pdf", "account_statement_pdf"}:
            continue
        text = _normalize_whitespace(item.extracted_text or "")
        if not text:
            continue

        filename = item.original_filename or item.filename
        debtor = _extract_pdf_debtor(text, filename)
        if anchor_debtor_key and debtor and entity_key(debtor) != anchor_debtor_key:
            continue

        total, confidence, warning = _extract_pdf_total(text)
        if warning:
            warnings.append(f"{filename}: {warning}")
        if total is None:
            continue

        number = _first_match(
            [
                r"Invoice\s+([A-Z0-9-]+)",
                r"(INV[-_ ]?[0-9]+)",
                r"Invoice Number[:#]?\s*([A-Z0-9-]+)",
            ],
            text,
        )
        invoice_date = _first_match(
            [
                r"Invoice Date\s*([0-9/.-]+)",
                r"Period\s*([0-9/.-]+\s+[0-9/.-]+)",
            ],
            text,
        )

        rows.append(
            InvoiceLineItem(
                invoice_number=_clean(number),
                invoice_date=_clean(invoice_date),
                due_date=_first_match([r"Due Date\s*([0-9/.-]+)"], text),
                customer_name=debtor,
                original_amount=total,
                balance_due=total,
                raw_balance_due_text=str(total),
                parse_confidence=confidence or 1.0,
                parse_warning=warning,
                included_in_total=confidence >= 0.95,
                source_filename=filename,
                source_kind=source_kind_from_item(item),
            )
        )
    return rows, warnings


def _dedupe_invoice_rows(rows: list[InvoiceLineItem]) -> list[InvoiceLineItem]:
    deduped: list[InvoiceLineItem] = []
    seen: set[tuple[str, str, str]] = set()
    for row in rows:
        number_key = (row.invoice_number or "").strip().upper()
        date_key = (row.invoice_date or "").strip()
        amount_key = f"{row.balance_due:.2f}"
        key = (number_key or date_key or row.source_filename or "", date_key, amount_key)
        if key in seen:
            continue
        seen.add(key)
        deduped.append(row)
    return deduped


def _extract_county_candidates(contract_text: str, combined_source: str) -> list[CountyCandidate]:
    candidates: list[CountyCandidate] = []
    venue_clause = _first_match(
        [
            r"(The Parties agree that the venue to enforce this Agreement is[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
            r"(Venue is proper in[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
            r"(venue[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
        ],
        contract_text or combined_source,
    )
    if venue_clause:
        for county in _find_counties(venue_clause):
            candidates.append(
                CountyCandidate(
                    county=county,
                    source="contract_venue_clause",
                    evidence=venue_clause,
                    confidence=0.99,
                )
            )
    for sentence in re.split(r"(?<=[.!?])\s+", combined_source):
        if "florida" not in sentence.lower() or "county" not in sentence.lower():
            continue
        for county in _find_counties(sentence):
            candidates.append(
                CountyCandidate(
                    county=county,
                    source="source_text",
                    evidence=_clean(sentence),
                    confidence=0.45,
                )
            )
    best: dict[str, CountyCandidate] = {}
    for candidate in candidates:
        key = candidate.county.lower()
        existing = best.get(key)
        if existing is None or candidate.confidence > existing.confidence:
            best[key] = candidate
    return sorted(best.values(), key=lambda item: (-item.confidence, item.county))


def _choose_county(candidates: list[CountyCandidate]) -> tuple[str | None, str | None, float | None, list[str]]:
    warnings: list[str] = []
    if not candidates:
        return None, None, None, ["No Florida county could be resolved from the uploaded single-matter source set."]
    top = candidates[0]
    if len(candidates) == 1:
        if top.confidence >= 0.9:
            return top.county, top.source, top.confidence, warnings
        warnings.append("County evidence is too weak to set venue automatically; staff review is required.")
        return None, None, None, warnings
    second = candidates[1]
    if top.confidence >= 0.9 or top.confidence - second.confidence >= 0.15:
        return top.county, top.source, top.confidence, warnings
    warnings.append("Multiple county candidates were found without a clear winner; attorney/staff review is required.")
    return None, None, None, warnings


def _excel_county_candidates(record: CaseRecord, anchor_debtor_key: str | None) -> list[CountyCandidate]:
    counts: dict[str, int] = {}
    for item in active_source_files(record):
        if source_kind_from_item(item) not in {"invoice_excel", "invoice_csv"} or not isinstance(item.parsed_payload, dict):
            continue
        for row in item.parsed_payload.get("line_items", []):
            customer_name = _clean(row.get("customer_name") or row.get("company"))
            if anchor_debtor_key and customer_name and entity_key(customer_name) != anchor_debtor_key:
                continue
            county = _clean(row.get("county"))
            if not county:
                continue
            counts[county] = counts.get(county, 0) + 1
    return [
        CountyCandidate(
            county=county,
            source="invoice_excel_county_column",
            evidence=f"Spreadsheet county column repeated {count} time(s).",
            confidence=0.93 if count >= 1 else 0.0,
        )
        for county, count in counts.items()
    ]


def _build_venue_paragraph(county: str | None, venue_clause: str | None, governing_law: str | None, service_address: str | None) -> str | None:
    if venue_clause:
        label = county + " County" if county and not county.lower().endswith("county") else (county or "the selected Florida county")
        return f"Venue is proper in {label}, Florida because the governing agreement provides: {venue_clause}"
    if county and governing_law:
        return f"Venue is asserted in {county} County, Florida based on the contract's Florida governing-law language and the strongest documented Florida nexus."
    if county and service_address:
        return f"Venue is asserted in {county} County, Florida based on the strongest documented nexus reflected in the uploaded records and service details."
    return None


def _legal_counts(contract_supported: bool, guaranty_supported: bool, account_stated_supported: bool) -> list[LegalCountDecision]:
    counts = [
        LegalCountDecision(code="breach_of_contract", label="Count I – Breach of Contract", supported=contract_supported, reason="Contract and unpaid account evidence present." if contract_supported else "No contract evidence extracted."),
        LegalCountDecision(code="account_stated", label="Count II – Account Stated", supported=account_stated_supported, reason="Invoice or statement delivery evidence supports account stated." if account_stated_supported else "No confident invoice/statement delivery evidence was extracted."),
        LegalCountDecision(code="breach_of_personal_guaranty", label="Count III – Breach of Personal Guaranty", supported=guaranty_supported, reason="Guaranty language or guaranty file supports an individual count." if guaranty_supported else "No guaranty-supported individual liability evidence was extracted."),
        LegalCountDecision(code="unjust_enrichment", label="Count IV – Unjust Enrichment (Alternative)", supported=contract_supported or account_stated_supported, reason="Alternative quasi-contract count retained for review." if (contract_supported or account_stated_supported) else "Alternative count not supported by the current record."),
    ]
    return counts


def _performance_proof_present(record: CaseRecord, anchor_debtor_key: str | None) -> bool:
    contract_texts = _filtered_texts(record, anchor_debtor_key, {"contract_pdf", "guaranty_pdf"})
    invoice_texts = _filtered_texts(record, anchor_debtor_key, {"invoice_pdf", "account_statement_pdf"})
    exhibit_texts = _filtered_texts(record, anchor_debtor_key, {"supporting_exhibit"})
    blob = "\n\n".join([*contract_texts, *invoice_texts, *exhibit_texts]).lower()
    signals = (
        "completed",
        "delivered",
        "accepted",
        "proof of delivery",
        "services rendered",
        "work performed",
        "statement of work",
        "delivery confirmation",
    )
    if any(signal in blob for signal in signals):
        return True
    if exhibit_texts:
        return True
    excel_rows, _, _ = _collect_excel_invoice_rows(record, anchor_debtor_key)
    has_tabular_invoice_support = any(row.included_in_total for row in excel_rows)
    has_invoice_support = bool(invoice_texts) or has_tabular_invoice_support
    # Keep this source-backed and conservative: a contract plus usable invoice or ledger
    # support is enough to treat the matter as having performance support for routing.
    return bool(contract_texts and has_invoice_support)


def _collect_source_provenance(record: CaseRecord) -> list[dict[str, object]]:
    entries: list[dict[str, object]] = []
    seen: set[tuple[str, str, str, str, str]] = set()
    for item in active_source_files(record):
        evidence = item.normalized_evidence if isinstance(item.normalized_evidence, dict) else {}
        for bucket in ("facts", "amounts", "dates"):
            for fact in evidence.get(bucket, []) or []:
                field = str(fact.get("field") or "").strip()
                value = _clean(fact.get("value"))
                source_file = _clean(fact.get("source_file") or item.original_filename or item.filename)
                source_sheet = _clean(fact.get("source_sheet"))
                source_row = str(fact.get("source_row") or "")
                if not field or not value or not source_file:
                    continue
                key = (field, value, source_file, source_sheet or "", source_row)
                if key in seen:
                    continue
                seen.add(key)
                entries.append(
                    {
                        "field": field,
                        "value": value,
                        "confidence": float(fact.get("confidence") or 0.0),
                        "source_file": source_file,
                        "source_kind": source_kind_from_item(item),
                        "source_sheet": source_sheet,
                        "source_row": int(fact.get("source_row")) if fact.get("source_row") not in (None, "") else None,
                        "source_excerpt": _clean(fact.get("source_excerpt")),
                        "extraction_method": _clean(fact.get("extraction_method") or item.extraction_method),
                        "invoice_number": _clean(fact.get("invoice_number")),
                        "uncertain": bool(fact.get("uncertain")),
                    }
                )
    return entries


def _build_recovery_truth_summary(
    record: CaseRecord,
    extraction: DebtCaseExtraction,
    *,
    excel_rows: list[InvoiceLineItem],
    pdf_rows: list[InvoiceLineItem],
    contract_supported: bool,
    performance_proof_present: bool,
) -> dict[str, object]:
    spreadsheet_total = Decimal(str(extraction.amount_reconciliation.spreadsheet_total or "0"))
    pdf_total = Decimal(str(extraction.amount_reconciliation.invoice_pdf_total or "0"))
    supported_balance = Decimal(str(extraction.amount_reconciliation.approved_reconciled_total or extraction.amount_reconciliation.approved_total or extraction.amount_in_controversy or "0"))
    unsupported_balance = Decimal("0.00")
    if spreadsheet_total > 0 and pdf_total > 0 and spreadsheet_total != pdf_total:
        unsupported_balance = abs(spreadsheet_total - pdf_total)

    excel_invoice_keys = {str(row.invoice_number or "").strip().upper() for row in excel_rows if row.invoice_number}
    pdf_invoice_keys = {str(row.invoice_number or "").strip().upper() for row in pdf_rows if row.invoice_number}
    matched_invoice_numbers = sorted([value for value in excel_invoice_keys.intersection(pdf_invoice_keys) if value])

    contactability_present = bool(
        extraction.defendant_entity.email
        or extraction.defendant_entity.phone
        or extraction.service_address
        or extraction.business_address
        or extraction.defendant_entity.address
    )
    venue_present = bool(extraction.venue.venue_clause or extraction.venue.venue_county)
    governing_law_present = bool(extraction.governing_law)
    guarantor_present = bool(extraction.personal_guarantor and extraction.personal_guarantor.party_name)
    invoice_support_present = bool(extraction.invoice_summary.line_items)
    low_quality_files = [
        {
            "filename": item.original_filename,
            "status": item.extraction_status,
            "score": float(item.extraction_quality_score or 0.0),
            "file_type": source_kind_from_item(item),
        }
        for item in active_source_files(record)
        if source_kind_from_item(item) in {"contract_pdf", "guaranty_pdf", "invoice_pdf", "account_statement_pdf", "invoice_excel", "invoice_csv"}
        and (str(item.extraction_status or "").lower() == "failed" or float(item.extraction_quality_score or 0.0) < 0.4)
    ]

    evidence_gaps: list[str] = []
    if not contract_supported:
        evidence_gaps.append("signed_contract")
    if not invoice_support_present:
        evidence_gaps.append("invoice_support")
    if not performance_proof_present:
        evidence_gaps.append("performance_proof")
    if not venue_present:
        evidence_gaps.append("venue_support")
    if not governing_law_present:
        evidence_gaps.append("governing_law")
    if not contactability_present:
        evidence_gaps.append("contact_path")

    critical_blockers = list(
        dict.fromkeys(
            [
                *list(extraction.matter_consistency.blockers or []),
                *list(extraction.amount_reconciliation.blockers or []),
                *(
                    [
                        "One or more critical files were extracted with low quality or failed extraction. Review the flagged files before relying on the diagnosis."
                    ]
                    if low_quality_files
                    else []
                ),
            ]
        )
    )

    blocker_codes: list[str] = []
    if extraction.matter_consistency.blockers or len(extraction.matter_consistency.detected_debtor_entities or []) > 1:
        blocker_codes.append("blocked_identity_conflict")
    if extraction.amount_reconciliation.blockers or unsupported_balance > 0:
        blocker_codes.append("blocked_amount_conflict")
    if low_quality_files:
        blocker_codes.append("blocked_low_extraction_quality")

    readiness_score = 20.0
    coverage_values = [
        contract_supported,
        invoice_support_present,
        performance_proof_present,
        venue_present,
        governing_law_present,
        contactability_present,
    ]
    readiness_score += sum(10.0 for item in coverage_values if item)
    if supported_balance > 0:
        readiness_score += 10.0
    if matched_invoice_numbers:
        readiness_score += 5.0
    if guarantor_present:
        readiness_score += 5.0
    readiness_score -= min(45.0, float(len(critical_blockers)) * 12.0)
    readiness_score = max(0.0, min(100.0, readiness_score))

    source_backed_explanation: list[str] = []
    if supported_balance > 0:
        source_backed_explanation.append(
            f"Supported balance {supported_balance:,.2f} is grounded in the approved reconciled source set."
        )
    if matched_invoice_numbers:
        source_backed_explanation.append(
            f"{len(matched_invoice_numbers)} invoice number(s) match across PDF and spreadsheet/CSV sources."
        )
    elif excel_invoice_keys and pdf_invoice_keys and not matched_invoice_numbers:
        source_backed_explanation.append("Invoice numbers do not match cleanly across PDF and spreadsheet/CSV sources.")
    if guarantor_present:
        source_backed_explanation.append("A guarantor was detected in the uploaded evidence.")
    if venue_present and governing_law_present:
        source_backed_explanation.append("Venue and governing law support are both present in the extracted record.")
    elif venue_present or governing_law_present:
        source_backed_explanation.append("Only part of the venue/governing-law support is present, so review remains necessary.")
    if not performance_proof_present:
        source_backed_explanation.append("Performance proof was not confidently extracted from the current source set.")

    return {
        "schema_version": "2026-03-19",
        "supported_balance": f"{supported_balance:.2f}",
        "unsupported_balance": f"{unsupported_balance:.2f}",
        "invoice_count": int(extraction.invoice_summary.invoice_count or len(extraction.invoice_summary.line_items)),
        "matched_invoice_count": len(matched_invoice_numbers),
        "matched_invoice_numbers": matched_invoice_numbers,
        "debtor_count": len(extraction.matter_consistency.detected_debtor_entities or []),
        "guarantor_present": guarantor_present,
        "venue_present": venue_present,
        "governing_law_present": governing_law_present,
        "contactability_present": contactability_present,
        "performance_proof_present": performance_proof_present,
        "evidence_gap_count": len(evidence_gaps),
        "evidence_gaps": evidence_gaps,
        "critical_blockers": critical_blockers,
        "critical_blocker_codes": blocker_codes,
        "reconciliation_summary": {
            "status": extraction.amount_reconciliation.status,
            "spreadsheet_total": f"{spreadsheet_total:.2f}",
            "invoice_pdf_total": f"{pdf_total:.2f}",
            "supported_balance": f"{supported_balance:.2f}",
            "unsupported_balance": f"{unsupported_balance:.2f}",
            "matched_invoice_count": len(matched_invoice_numbers),
            "matched_invoice_numbers": matched_invoice_numbers,
            "excluded_low_confidence_rows": int(extraction.amount_reconciliation.excluded_low_confidence_rows or 0),
            "conflicts": list(
                dict.fromkeys(
                    [
                        *list(extraction.invoice_summary.conflicts or []),
                        *list(extraction.amount_reconciliation.blockers or []),
                    ]
                )
            ),
        },
        "evidence_coverage": {
            "contract_present": contract_supported,
            "invoice_support_present": invoice_support_present,
            "guarantor_present": guarantor_present,
            "venue_present": venue_present,
            "governing_law_present": governing_law_present,
            "contactability_present": contactability_present,
            "performance_proof_present": performance_proof_present,
        },
        "source_provenance": _collect_source_provenance(record),
        "low_quality_files": low_quality_files,
        "route_reason_codes": [],
        "primary_next_step": None,
        "secondary_options": [],
        "readiness_score": readiness_score,
        "source_backed_explanation": source_backed_explanation,
    }


def extract_case_data(record: CaseRecord) -> DebtCaseExtraction:
    current = record.extracted_case_data or DebtCaseExtraction()
    extraction = DebtCaseExtraction.model_validate(current.model_dump())

    matter_report, matter_detail = analyze_case_sources(record)
    extraction.matter_consistency = MatterConsistencyReport.model_validate(matter_report.model_dump())
    extraction.source_set_used = list(matter_report.source_set_used)

    anchor_debtor_key = matter_detail.get("anchor_debtor_key")
    anchor_plaintiff_name = matter_report.anchor_plaintiff_name
    anchor_debtor_name = matter_report.anchor_debtor_name

    if anchor_plaintiff_name:
        extraction.plaintiff.party_name = anchor_plaintiff_name
    if anchor_debtor_name:
        extraction.defendant_entity.party_name = anchor_debtor_name
    if extraction.plaintiff.party_name and not extraction.plaintiff.entity_type:
        extraction.plaintiff.entity_type = _infer_entity_type(extraction.plaintiff.party_name)
    if extraction.defendant_entity.party_name and not extraction.defendant_entity.entity_type:
        extraction.defendant_entity.entity_type = _infer_entity_type(extraction.defendant_entity.party_name)

    contract_text = "\n\n".join(_filtered_texts(record, anchor_debtor_key, {"contract_pdf", "guaranty_pdf"}))
    guaranty_text = "\n\n".join(_filtered_texts(record, anchor_debtor_key, {"guaranty_pdf"}))
    invoice_pdf_text = "\n\n".join(_filtered_texts(record, anchor_debtor_key, {"invoice_pdf", "account_statement_pdf"}))
    combined_filtered = "\n\n".join(_filtered_texts(record, anchor_debtor_key, {"contract_pdf", "guaranty_pdf", "invoice_pdf", "account_statement_pdf"}))

    # Guarantor extraction
    guaranty_source = guaranty_text or contract_text or combined_filtered
    guaranty_supported = bool(guaranty_text.strip()) or any(
        signal in (guaranty_source or "").lower()
        for signal in ("personal guarantor", "personal guaranty", "personal guarantee agreement", "full name of guarantor", "individually and as personal guarantor")
    )
    if guaranty_supported:
        guarantor_name = _first_match(
            [
                r"individually and as Personal Guarantor\s*[,:-]?\s*([A-Z][A-Za-z .'-]{2,})",
                r"([A-Z][A-Za-z .'-]{2,}),?\s*individually and as Personal Guarantor",
                r"I,\s*([A-Z][A-Za-z .'-]{2,})\s*\(Full name of Guarantor\)",
                r"First Name\s*\*?\s*\n([A-Za-z .'-]+)\s*\nLast Name\s*\*?\s*\n([A-Za-z .'-]+)",
            ],
            guaranty_source,
        )
        if guarantor_name:
            extraction.personal_guarantor = PartyDetails(
                party_name=guarantor_name,
                party_role=PartyRole.PERSONAL_GUARANTOR,
            )
    else:
        extraction.personal_guarantor = None

    # Core contract facts
    governing_law = _first_match(
        [
            r"governed by and construed in accordance with the laws of the\s+State of\s+([A-Za-z ]+?)(?=\.|\n|,)",
            r"governing law[:\s]*([A-Za-z ]+?)(?=\.|\n|,)",
        ],
        contract_text,
    )
    if governing_law:
        extraction.governing_law = governing_law

    payment_terms = _find_sentence(contract_text or combined_filtered, ["pay", "invoice"]) or _find_sentence(contract_text or combined_filtered, ["payment", "invoice"])
    if payment_terms:
        extraction.payment_terms = payment_terms
    default_terms = _find_sentence(contract_text or combined_filtered, ["fails to pay"]) or _find_sentence(contract_text or combined_filtered, ["default"])
    if default_terms:
        extraction.default_terms = default_terms
    interest_terms = _find_sentence(contract_text or combined_filtered, ["interest"]) or _find_sentence(contract_text or combined_filtered, ["29.99%"])
    if interest_terms:
        extraction.interest_terms = interest_terms

    addresses = _address_candidates(contract_text or combined_filtered)
    if addresses:
        extraction.business_address = addresses[0]
        extraction.service_address = addresses[0]
        extraction.defendant_entity.address = addresses[0]

    email = _first_email(combined_filtered)
    phone = _first_phone(combined_filtered)
    if email:
        extraction.defendant_entity.email = email
    if phone:
        extraction.defendant_entity.phone = phone

    # Venue and county from filtered single-matter text only.
    venue_clause = _first_match(
        [
            r"(The Parties agree that the venue to enforce this Agreement is[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
            r"(Venue is proper in[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
            r"(venue[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
        ],
        contract_text or combined_filtered,
    )
    if venue_clause:
        extraction.venue.venue_clause = venue_clause
        extraction.venue.source_document_type = "contract_pdf"

    county_candidates = _extract_county_candidates(contract_text, combined_filtered)
    if not county_candidates:
        county_candidates = _excel_county_candidates(record, anchor_debtor_key)
    extraction.county_candidates = county_candidates
    selected_county, selected_source, selected_confidence, county_warnings = _choose_county(county_candidates)
    if selected_county:
        extraction.venue.venue_county = selected_county
        extraction.venue.venue_state = "Florida"
        extraction.venue.selection_source = selected_source
        extraction.venue.selection_confidence = selected_confidence
    extraction.venue.venue_paragraph = _build_venue_paragraph(
        extraction.venue.venue_county,
        extraction.venue.venue_clause,
        extraction.governing_law,
        extraction.service_address,
    )

    # Invoice ledger + reconciliation
    excel_rows, excel_warnings, excluded_low_confidence_rows = _collect_excel_invoice_rows(record, anchor_debtor_key)
    pdf_rows, pdf_warnings = _collect_pdf_invoice_rows(record, anchor_debtor_key)

    excel_rows = _dedupe_invoice_rows(excel_rows)
    pdf_rows = _dedupe_invoice_rows(pdf_rows)

    spreadsheet_total = sum((row.balance_due for row in excel_rows if row.included_in_total), Decimal("0.00"))
    pdf_total = sum((row.balance_due for row in pdf_rows if row.included_in_total), Decimal("0.00"))

    reconciliation_warnings: list[str] = []
    reconciliation_blockers: list[str] = []
    approved_total = Decimal("0.00")

    if excluded_low_confidence_rows:
        reconciliation_warnings.append(
            f"{excluded_low_confidence_rows} spreadsheet row(s) had ambiguous amount formatting and were excluded from totals."
        )
    if excel_rows and pdf_rows:
        approved_total = pdf_total
        if spreadsheet_total != pdf_total:
            reconciliation_blockers.append(
                f"Invoice PDF totals ({pdf_total:,.2f}) do not match spreadsheet balances ({spreadsheet_total:,.2f})."
            )
        else:
            reconciliation_warnings.append("Spreadsheet balances and invoice PDF totals reconcile.")
    elif excel_rows:
        approved_total = spreadsheet_total
        reconciliation_warnings.append("Amount in controversy is based on spreadsheet balances only.")
    elif pdf_rows:
        approved_total = pdf_total
        reconciliation_warnings.append("Amount in controversy is based on invoice PDF totals only.")

    selected_rows = pdf_rows if pdf_rows else excel_rows
    source_priority = "invoice_pdf" if pdf_rows else ("invoice_excel" if excel_rows else None)

    extraction.invoice_summary = InvoiceSummary(
        source_filename=active_source_files(record)[0].original_filename if active_source_files(record) else None,
        source_priority_used=source_priority,
        invoice_count=len([row for row in selected_rows if row.included_in_total]),
        total_original_amount=sum((row.original_amount for row in selected_rows if row.included_in_total), Decimal("0.00")),
        total_balance_due=approved_total,
        math_verified=approved_total > 0 and not reconciliation_blockers,
        warnings=[*excel_warnings, *pdf_warnings],
        conflicts=[],
        line_items=selected_rows,
    )
    reconciliation_status = "blocked" if reconciliation_blockers else ("pass" if approved_total > 0 else "pending")
    extraction.amount_reconciliation = AmountReconciliation(
        status=reconciliation_status,
        spreadsheet_total=spreadsheet_total,
        invoice_pdf_total=pdf_total,
        approved_total=approved_total,
        spreadsheet_invoice_count=len([row for row in excel_rows if row.included_in_total]),
        invoice_pdf_count=len([row for row in pdf_rows if row.included_in_total]),
        used_invoice_count=len([row for row in selected_rows if row.included_in_total]),
        excluded_low_confidence_rows=excluded_low_confidence_rows,
        warnings=reconciliation_warnings,
        blockers=reconciliation_blockers,
        source_pdf_total=pdf_total,
        source_spreadsheet_total=spreadsheet_total,
        approved_reconciled_total=approved_total,
        case_summary_total=approved_total,
        excluded_sources=list(matter_report.excluded_sources),
    )
    extraction.amount_in_controversy = extraction.amount_reconciliation.approved_reconciled_total or approved_total

    extraction.florida_court = _infer_court(approved_total, extraction.venue.venue_county)
    extraction.separate_summons_required = bool(extraction.personal_guarantor and extraction.personal_guarantor.party_name)

    contract_supported = bool(contract_text.strip())
    performance_proof_present = _performance_proof_present(record, anchor_debtor_key)
    account_stated_supported = bool(invoice_pdf_text.strip() or selected_rows)
    extraction.legal_counts = _legal_counts(contract_supported, extraction.separate_summons_required, account_stated_supported)
    extraction.contract_evidence = [value for value in [extraction.governing_law, extraction.venue.venue_clause, extraction.payment_terms, extraction.default_terms, extraction.interest_terms] if value]
    extraction.guaranty_evidence = [guaranty_text[:400]] if guaranty_text.strip() else []
    extraction.source_conflicts = reconciliation_blockers

    missing: list[str] = []
    if not active_source_files(record):
        missing.append("source_files")
    if not extraction.plaintiff.party_name:
        missing.append("plaintiff.party_name")
    if not extraction.defendant_entity.party_name:
        missing.append("defendant_entity.party_name")
    if not extraction.venue.venue_county:
        missing.append("venue.venue_county")
    if extraction.amount_in_controversy <= 0:
        missing.append("amount_in_controversy")
    if not extraction.invoice_summary.line_items:
        missing.append("invoice_summary.line_items")
    if matter_report.blockers:
        missing.append("matter_consistency")
    if reconciliation_blockers:
        missing.append("amount_reconciliation")
    extraction.missing_required_facts = missing

    review_flags: list[str] = []
    if matter_report.blockers:
        review_flags.append("needs_review:matter_consistency")
    if reconciliation_blockers:
        review_flags.append("needs_review:amount_reconciliation")
    if not extraction.venue.venue_county:
        review_flags.append("needs_review:venue_county")
    if not extraction.governing_law:
        review_flags.append("needs_review:governing_law")
    extraction.review_flags = review_flags

    warnings: list[str] = []
    warnings.extend(matter_report.warnings)
    warnings.extend(county_warnings)
    warnings.extend(reconciliation_warnings)
    if matter_report.blockers:
        warnings.extend(matter_report.blockers)
    if not extraction.governing_law:
        warnings.append("Governing law was not confidently extracted from the uploaded files.")
    if not extraction.venue.venue_clause:
        warnings.append("No controlling Florida venue clause was confidently extracted from the uploaded single-matter source set.")
    if not extraction.payment_terms:
        warnings.append("Payment terms were not confidently extracted from the uploaded files.")
    if not extraction.interest_terms:
        warnings.append("Interest language was not confidently extracted from the uploaded files.")
    extraction.warnings = list(dict.fromkeys(warnings))

    if extraction.personal_guarantor and extraction.service_address:
        extraction.personal_guarantor.address = extraction.service_address
    if extraction.defendant_entity.party_name and extraction.defendant_entity.entity_type:
        phrase = _entity_phrase(extraction.defendant_entity.entity_type)
        if phrase and phrase not in extraction.defendant_entity.source_evidence:
            extraction.defendant_entity.source_evidence.append(phrase)

    extraction.recovery_truth = _build_recovery_truth_summary(
        record,
        extraction,
        excel_rows=excel_rows,
        pdf_rows=pdf_rows,
        contract_supported=contract_supported,
        performance_proof_present=performance_proof_present,
    )
    extraction.processed_at = datetime.now(timezone.utc)
    return extraction
