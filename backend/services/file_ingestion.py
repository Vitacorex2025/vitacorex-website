from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any

from backend.services.excel_parser import parse_invoice_workbook
from backend.services.file_classifier import classify_file
from backend.services.matter_validator import entity_key
from backend.services.pdf_extractor import extract_pdf_text


def _clean(value: object | None) -> str | None:
    text = " ".join(str(value or "").replace("\u00a0", " ").split()).strip(" \n\t\r,;")
    return text or None


def _dedupe(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        cleaned = _clean(value)
        key = (cleaned or "").lower()
        if cleaned and key not in seen:
            seen.add(key)
            result.append(cleaned)
    return result


def _to_decimal_text(value: object | None) -> str | None:
    if value in (None, ""):
        return None
    try:
        return f"{Decimal(str(value)):.2f}"
    except (InvalidOperation, ValueError):
        return _clean(value)


def _excerpt_around(text: str, value: object | None, *, window: int = 120) -> str | None:
    cleaned = _clean(value)
    if not cleaned:
        return None
    normalized = str(text or "").replace("\r", " ").replace("\n", " ")
    index = normalized.lower().find(cleaned.lower())
    if index < 0:
        return cleaned[:window]
    start = max(0, index - (window // 2))
    end = min(len(normalized), index + len(cleaned) + (window // 2))
    excerpt = " ".join(normalized[start:end].split())
    return excerpt or cleaned[:window]


def _provenance_entry(
    field: str,
    value: object | None,
    confidence: float,
    *,
    source_file: str,
    extraction_method: str,
    source: str,
    source_excerpt: str | None = None,
    source_sheet: str | None = None,
    source_row: int | None = None,
    invoice_number: str | None = None,
) -> dict[str, Any] | None:
    cleaned = _clean(value)
    if not cleaned:
        return None
    payload: dict[str, Any] = {
        "field": field,
        "value": cleaned,
        "confidence": float(confidence),
        "uncertain": bool(confidence < 0.8),
        "source": source,
        "source_file": source_file,
        "source_excerpt": source_excerpt,
        "extraction_method": extraction_method,
    }
    if source_sheet:
        payload["source_sheet"] = source_sheet
    if source_row is not None:
        payload["source_row"] = int(source_row)
    if invoice_number:
        payload["invoice_number"] = invoice_number
    return payload


def _provenance_index(*groups: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    index: dict[str, list[dict[str, Any]]] = {}
    for group in groups:
        for item in group:
            field = str(item.get("field") or "").strip()
            if not field:
                continue
            index.setdefault(field, []).append(
                {
                    "value": item.get("value"),
                    "confidence": item.get("confidence"),
                    "source_file": item.get("source_file"),
                    "source_sheet": item.get("source_sheet"),
                    "source_row": item.get("source_row"),
                    "source_excerpt": item.get("source_excerpt"),
                    "extraction_method": item.get("extraction_method"),
                    "invoice_number": item.get("invoice_number"),
                }
            )
    return index


def _extract_pdf_candidates(text: str) -> dict[str, list[str]]:
    text = text or ""
    patterns = {
        "debtors": [
            r"Company Name\s*\*?\s*\n([A-Za-z0-9 .,&'/-]+)",
            r"between\s+[A-Za-z0-9 .,&'/-]+?\s+\(the\s+(?:[\"\u201c\u201d])?Club Organizer(?:[\"\u201c\u201d])?\)\s+and\s+([A-Za-z0-9 .,&'/-]+?)\s+\(the\s+(?:[\"\u201c\u201d])?Customer(?:[\"\u201c\u201d])?\)",
            r"Invoice(?:\s+[A-Z0-9-]+)?[\s\S]{0,260}?\n([A-Z][A-Z0-9 .,&'/-]{2,})\nAddress:",
        ],
        "plaintiffs": [
            r"between\s+([A-Za-z0-9 .,&'/-]+?)\s+\(the\s+(?:[\"\u201c\u201d])?Club Organizer(?:[\"\u201c\u201d])?\)\s+and\s+[A-Za-z0-9 .,&'/-]+?\s+\(the\s+(?:[\"\u201c\u201d])?Customer(?:[\"\u201c\u201d])?\)",
            r"I hereby authorize\s+([A-Za-z0-9 .,&'/-]+?)\s+to initiate electronic withdrawals",
            r"^([A-Z][A-Za-z0-9 .,&'/-]{2,})\s*\nAddress:",
        ],
        "guarantors": [
            r"I,\s*([A-Z][A-Za-z .'-]{2,})\s*\(Full name of Guarantor\)",
            r"Personal Guarantee Agreement\s*I,\s*([A-Z][A-Za-z .'-]{2,})",
            r"Cardholder's name\s*\*?\s*\n([A-Za-z .'-]+)",
        ],
    }
    results: dict[str, list[str]] = {"debtors": [], "plaintiffs": [], "guarantors": []}
    for bucket, bucket_patterns in patterns.items():
        for pattern in bucket_patterns:
            for match in re.finditer(pattern, text, flags=re.IGNORECASE | re.MULTILINE | re.DOTALL):
                value = _clean(match.group(1))
                if value:
                    results[bucket].append(value)
    return {key: _dedupe(value) for key, value in results.items()}


def _find_first(patterns: list[str], text: str, *, flags: int = re.IGNORECASE | re.MULTILINE | re.DOTALL) -> str | None:
    for pattern in patterns:
        match = re.search(pattern, text or "", flags=flags)
        if not match:
            continue
        groups = [group for group in match.groups() if group is not None]
        if groups:
            return _clean(" ".join(groups))
        return _clean(match.group(0))
    return None


def _build_pdf_evidence(
    filename: str,
    file_type: str,
    text: str,
    quality_report: dict[str, Any],
    *,
    extraction_method: str,
) -> dict[str, Any]:
    text = text or ""
    candidates = _extract_pdf_candidates(text)
    debtors = candidates["debtors"]
    plaintiffs = candidates["plaintiffs"]
    guarantors = candidates["guarantors"]
    document_type = {
        "contract_pdf": "contract",
        "guaranty_pdf": "guaranty",
        "invoice_pdf": "invoice",
        "account_statement_pdf": "statement",
        "supporting_exhibit": "correspondence",
        "unknown": "correspondence",
    }.get(file_type, "correspondence")

    invoice_number = _find_first(
        [
            r"Invoice Number[:#]?\s*([A-Z0-9-]+)",
            r"Invoice\s+([A-Z0-9-]+)",
            r"(INV[-_ ]?[0-9]+)",
        ],
        text,
    )
    invoice_date = _find_first([r"Invoice Date\s*([0-9/.-]+)"], text)
    due_date = _find_first([r"Due Date\s*([0-9/.-]+)"], text)
    total_amount = _find_first(
        [
            r"Total amount due\s*\$?\s*([0-9][0-9\s,.\-]+)",
            r"Balance Due[:\s]*\$?\s*([0-9][0-9\s,.\-]+)",
            r"Total[:\s]*\$?\s*([0-9][0-9\s,.\-]+)",
        ],
        text,
    )
    governing_law = _find_first(
        [
            r"governed by and construed in accordance with the laws of the\s+State of\s+([A-Za-z ]+?)(?=\.|\n|,)",
            r"governing law[:\s]*([A-Za-z ]+?)(?=\.|\n|,)",
        ],
        text,
    )
    venue_clause = _find_first(
        [
            r"(The Parties agree that the venue to enforce this Agreement is[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
            r"(Venue is proper in[\s\S]{0,120}?[A-Za-z\s]+County,\s*Florida\.)",
        ],
        text,
    )
    contact_email = _find_first([r"([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})"], text, flags=re.IGNORECASE)
    contact_phone = _find_first([r"(\+?1?[\s-]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})"], text)

    facts = [
        _provenance_entry(
            "governing_law",
            governing_law,
            0.9,
            source_file=filename,
            extraction_method=extraction_method,
            source="pdf_text",
            source_excerpt=_excerpt_around(text, governing_law),
        ),
        _provenance_entry(
            "venue_clause",
            venue_clause,
            0.88,
            source_file=filename,
            extraction_method=extraction_method,
            source="pdf_text",
            source_excerpt=_excerpt_around(text, venue_clause),
        ),
        _provenance_entry(
            "invoice_number",
            invoice_number,
            0.92,
            source_file=filename,
            extraction_method=extraction_method,
            source="pdf_text",
            source_excerpt=_excerpt_around(text, invoice_number),
            invoice_number=_clean(invoice_number),
        ),
        _provenance_entry(
            "invoice_date",
            invoice_date,
            0.86,
            source_file=filename,
            extraction_method=extraction_method,
            source="pdf_text",
            source_excerpt=_excerpt_around(text, invoice_date),
            invoice_number=_clean(invoice_number),
        ),
        _provenance_entry(
            "due_date",
            due_date,
            0.86,
            source_file=filename,
            extraction_method=extraction_method,
            source="pdf_text",
            source_excerpt=_excerpt_around(text, due_date),
            invoice_number=_clean(invoice_number),
        ),
        _provenance_entry(
            "contact_email",
            contact_email,
            0.82,
            source_file=filename,
            extraction_method=extraction_method,
            source="pdf_text",
            source_excerpt=_excerpt_around(text, contact_email),
        ),
        _provenance_entry(
            "contact_phone",
            contact_phone,
            0.82,
            source_file=filename,
            extraction_method=extraction_method,
            source="pdf_text",
            source_excerpt=_excerpt_around(text, contact_phone),
        ),
    ]
    facts = [item for item in facts if item]

    amounts: list[dict[str, Any]] = []
    total_amount_text = _to_decimal_text(total_amount)
    if total_amount_text:
        amounts.append(
            {
                "field": "total_amount_due",
                "value": total_amount_text,
                "currency": "USD",
                "confidence": 0.86,
                "uncertain": False,
                "source": "pdf_text",
                "source_file": filename,
                "source_excerpt": _excerpt_around(text, total_amount),
                "extraction_method": extraction_method,
                "invoice_number": _clean(invoice_number),
            }
        )

    uncertain_fields: list[dict[str, Any]] = []
    required_by_type = {
        "contract": ["governing_law", "venue_clause"],
        "guaranty": ["guarantor_name"],
        "invoice": ["invoice_number", "total_amount_due"],
        "statement": ["total_amount_due"],
        "correspondence": [],
    }
    present_fields = {item["field"] for item in facts}
    if amounts:
        present_fields.add("total_amount_due")
    if guarantors:
        present_fields.add("guarantor_name")
    for field in required_by_type.get(document_type, []):
        if field not in present_fields:
            uncertain_fields.append({"field": field, "reason": "not_confidently_extracted", "confidence": 0.0})

    debtor_keys = {entity_key(item) for item in debtors if entity_key(item)}
    conflicts: list[str] = []
    if len(debtor_keys) > 1:
        conflicts.append(f"Multiple debtor entities detected in '{filename}'.")
    if quality_report.get("near_empty_text"):
        uncertain_fields.append({"field": "document_text", "reason": "near_empty_text", "confidence": 0.0})

    dates = [item for item in facts if item["field"] in {"invoice_date", "due_date"}]

    return {
        "schema_version": "2026-03-19",
        "document_type": document_type,
        "source_filename": filename,
        "parties": {
            "plaintiffs": plaintiffs,
            "debtors": debtors,
            "guarantors": guarantors,
        },
        "facts": facts,
        "amounts": amounts,
        "dates": dates,
        "identifiers": {
            "invoice_numbers": [invoice_number] if invoice_number else [],
        },
        "uncertain_fields": uncertain_fields,
        "conflicts": conflicts,
        "quality": {
            "score": float(quality_report.get("score") or 0.0),
            "status": quality_report.get("status") or "failed",
            "method": quality_report.get("method") or "direct_text",
        },
        "provenance": _provenance_index(facts, amounts, dates),
        "summary": {
            "extracted_fact_count": len(facts) + len(amounts),
            "text_characters": int(quality_report.get("text_characters") or 0),
        },
    }


def _build_excel_evidence(filename: str, parsed_payload: dict[str, Any], *, extraction_method: str) -> dict[str, Any]:
    line_items = list(parsed_payload.get("line_items") or [])
    selection_candidates = list(parsed_payload.get("selection_candidates") or [])
    uncertain_fields: list[dict[str, Any]] = []
    amounts: list[dict[str, Any]] = []
    for row in line_items:
        confidence = float(row.get("parse_confidence") or 0.0)
        if row.get("balance_due") is not None:
            amounts.append(
                {
                    "field": "balance_due",
                    "value": _to_decimal_text(row.get("balance_due")),
                    "currency": row.get("currency") or "USD",
                    "confidence": confidence,
                    "uncertain": bool(confidence < 0.95 or not row.get("included_in_total", True)),
                    "source": row.get("source_sheet") or "worksheet",
                    "source_file": filename,
                    "source_sheet": row.get("source_sheet"),
                    "source_row": row.get("source_row"),
                    "source_excerpt": " ".join(
                        str(item)
                        for item in [
                            row.get("invoice_number"),
                            row.get("invoice_date"),
                            row.get("due_date"),
                            row.get("raw_balance_due_text") or row.get("balance_due"),
                        ]
                        if item not in (None, "")
                    )[:140],
                    "extraction_method": extraction_method,
                    "invoice_number": row.get("invoice_number"),
                }
            )
        if row.get("parse_warning"):
            uncertain_fields.append(
                {
                    "field": "balance_due",
                    "reason": str(row.get("parse_warning")),
                    "confidence": confidence,
                    "invoice_number": row.get("invoice_number"),
                    "source": row.get("source_sheet"),
                }
            )

    for warning in list(parsed_payload.get("warnings") or []):
        lowered = str(warning).lower()
        if "row" in lowered and ("ambiguous" in lowered or "confidence" in lowered or "amount" in lowered):
            uncertain_fields.append(
                {
                    "field": "balance_due",
                    "reason": str(warning),
                    "confidence": 0.0,
                    "source": "workbook_parser",
                }
            )

    facts = []
    if parsed_payload.get("selected_worksheets"):
        facts.append(
            {
                "field": "selected_worksheets",
                "value": ", ".join(parsed_payload.get("selected_worksheets") or []),
                "confidence": 0.95,
                "uncertain": False,
                "source": "workbook_parser" if extraction_method == "workbook_parser" else "csv_parser",
                "source_file": filename,
                "extraction_method": extraction_method,
            }
        )
    if selection_candidates:
        facts.append(
            {
                "field": "debtor_selection_candidates",
                "value": ", ".join(
                    [
                        f"{item.get('entity_name') or 'Unknown'} ({int(item.get('usable_row_count') or item.get('row_count') or 0)} row(s))"
                        for item in selection_candidates[:4]
                    ]
                ),
                "confidence": 0.88 if len(selection_candidates) == 1 else 0.45,
                "uncertain": len(selection_candidates) > 1,
                "source": "workbook_parser" if extraction_method == "workbook_parser" else "csv_parser",
                "source_file": filename,
                "extraction_method": extraction_method,
            }
        )
    dates = [
        {
            "field": "invoice_date",
            "value": row.get("invoice_date"),
            "confidence": 0.85,
            "uncertain": False,
            "source": row.get("source_sheet") or "worksheet",
            "source_file": filename,
            "source_sheet": row.get("source_sheet"),
            "source_row": row.get("source_row"),
            "source_excerpt": " ".join(
                str(item)
                for item in [row.get("invoice_number"), row.get("invoice_date"), row.get("due_date")]
                if item not in (None, "")
            )[:140],
            "extraction_method": extraction_method,
            "invoice_number": row.get("invoice_number"),
        }
        for row in line_items
        if row.get("invoice_date")
    ]

    conflicts = list(parsed_payload.get("conflicts") or [])
    parser_report = dict(parsed_payload.get("parser_report") or {})
    if parser_report.get("multi_entity_conflict"):
        conflicts.append(f"Workbook '{filename}' contains multiple debtor entities.")
        uncertain_fields.append(
            {
                "field": "debtor_selection",
                "reason": "multiple_debtor_entities_detected",
                "confidence": 0.0,
            }
        )

    return {
        "schema_version": "2026-03-19",
        "document_type": "aging_report",
        "source_filename": filename,
        "parties": {
            "plaintiffs": list(parsed_payload.get("plaintiff_entities") or []),
            "debtors": list(parsed_payload.get("debtor_entities") or []),
            "guarantors": list(parsed_payload.get("guarantor_entities") or []),
        },
        "facts": facts,
        "amounts": [item for item in amounts if item.get("value") is not None],
        "dates": dates,
        "identifiers": {
            "invoice_numbers": _dedupe([str(row.get("invoice_number") or "") for row in line_items if row.get("invoice_number")]),
        },
        "worksheet_report": list(parsed_payload.get("worksheet_report") or []),
        "parser_report": parser_report,
        "uncertain_fields": uncertain_fields,
        "conflicts": _dedupe([str(item) for item in conflicts if item]),
        "provenance": _provenance_index(facts, [item for item in amounts if item.get("value") is not None], dates),
        "summary": {
            "invoice_count": int(parsed_payload.get("invoice_count") or 0),
            "selected_worksheet_count": len(parsed_payload.get("selected_worksheets") or []),
            "total_balance_due": _to_decimal_text(parsed_payload.get("total_balance_due")),
        },
    }


def _score_pdf_quality(text: str, warnings: list[str], report: dict[str, Any]) -> tuple[float, str]:
    text_characters = int(report.get("text_characters") or len(text or ""))
    alnum_characters = int(report.get("alnum_characters") or len(re.findall(r"[A-Za-z0-9]", text or "")))
    near_empty = bool(report.get("near_empty_text"))
    used_ocr = bool(report.get("ocr_used"))
    if text_characters <= 0 or alnum_characters <= 0:
        return 0.0, "failed"
    score = 0.25
    if alnum_characters >= 40:
        score += 0.25
    if text_characters >= 120:
        score += 0.25
    if not near_empty:
        score += 0.15
    if used_ocr:
        score += 0.05
    score -= min(0.15, len(warnings) * 0.03)
    score = max(0.0, min(1.0, score))
    if near_empty and not used_ocr:
        return min(score, 0.39), "failed"
    if score >= 0.82:
        return score, "extracted_successfully"
    if score >= 0.4:
        return score, "partially_extracted"
    return score, "failed"


def _score_excel_quality(parsed_payload: dict[str, Any], warnings: list[str]) -> tuple[float, str]:
    invoice_count = int(parsed_payload.get("invoice_count") or 0)
    selected_worksheets = list(parsed_payload.get("selected_worksheets") or [])
    parser_report = dict(parsed_payload.get("parser_report") or {})
    multi_entity_conflict = bool(parser_report.get("multi_entity_conflict"))
    excluded_low_confidence_rows = int(parsed_payload.get("excluded_low_confidence_rows") or 0)
    conflicts = list(parsed_payload.get("conflicts") or [])

    if invoice_count <= 0 or not selected_worksheets:
        return 0.1, "failed"

    score = 0.45
    score += min(0.2, invoice_count * 0.03)
    score += min(0.15, len(selected_worksheets) * 0.05)
    if str(parsed_payload.get("total_balance_due") or "0") not in {"0", "0.00"}:
        score += 0.1
    score -= min(0.15, excluded_low_confidence_rows * 0.04)
    score -= min(0.15, len(conflicts) * 0.05)
    score -= min(0.1, len(warnings) * 0.02)
    if multi_entity_conflict:
        score = min(score, 0.59)
    score = max(0.0, min(1.0, score))

    if multi_entity_conflict:
        return max(score, 0.35), "partially_extracted"
    if score >= 0.82 and excluded_low_confidence_rows == 0 and not conflicts:
        return score, "extracted_successfully"
    if score >= 0.35:
        return score, "partially_extracted"
    return score, "failed"


def analyze_source_file(path: str | Path, original_filename: str, content_type: str | None = None) -> dict[str, Any]:
    path = Path(path)
    warnings: list[str] = []
    extracted_text: str | None = None
    parsed_payload: dict[str, Any] | None = None
    extraction_method = "direct_text"
    extraction_report: dict[str, Any] = {}

    if path.suffix.lower() == ".pdf":
        pdf_result = extract_pdf_text(path)
        extracted_text = str(pdf_result.get("text") or "")
        warnings.extend(list(pdf_result.get("warnings") or []))
        extraction_method = str(pdf_result.get("method") or "direct_text")
        extraction_report = dict(pdf_result.get("quality_report") or {})
    elif path.suffix.lower() in {".xlsx", ".xls", ".csv"}:
        parsed_payload = parse_invoice_workbook(path)
        warnings.extend(list(parsed_payload.get("warnings") or []))
        warnings.extend(list(parsed_payload.get("conflicts") or []))
        extraction_method = "csv_parser" if path.suffix.lower() == ".csv" else "workbook_parser"
        extraction_report = dict(parsed_payload.get("parser_report") or {})

    file_type = classify_file(original_filename or path.name, content_type, extracted_text)

    if path.suffix.lower() == ".pdf":
        score, status = _score_pdf_quality(extracted_text or "", warnings, extraction_report)
        extraction_report = {
            **extraction_report,
            "score": score,
            "status": status,
            "method": extraction_method,
        }
        normalized_evidence = _build_pdf_evidence(
            original_filename or path.name,
            file_type,
            extracted_text or "",
            extraction_report,
            extraction_method=extraction_method,
        )
    elif path.suffix.lower() in {".xlsx", ".xls", ".csv"} and isinstance(parsed_payload, dict):
        score, status = _score_excel_quality(parsed_payload, warnings)
        extraction_report = {
            **extraction_report,
            "score": score,
            "status": status,
            "method": extraction_method,
        }
        normalized_evidence = _build_excel_evidence(
            original_filename or path.name,
            parsed_payload,
            extraction_method=extraction_method,
        )
    else:
        score = 0.0
        status = "failed"
        normalized_evidence = {
            "schema_version": "2026-03-19",
            "document_type": "unsupported",
            "source_filename": original_filename or path.name,
            "parties": {"plaintiffs": [], "debtors": [], "guarantors": []},
            "facts": [],
            "amounts": [],
            "dates": [],
            "identifiers": {},
            "uncertain_fields": [{"field": "document_type", "reason": "unsupported_source_type", "confidence": 0.0}],
            "conflicts": [],
            "provenance": {},
            "summary": {"extracted_fact_count": 0},
        }
        extraction_report = {"score": score, "status": status, "method": "unsupported"}
        warnings.append("Source type is not supported for structured extraction QA.")

    if isinstance(parsed_payload, dict) and parsed_payload.get("debtor_entities") and len(parsed_payload.get("debtor_entities") or []) > 1:
        label = "CSV file" if path.suffix.lower() == ".csv" else "Workbook"
        warnings.append(
            f"Single matter only. {label} '{original_filename or path.name}' contains multiple debtor companies. "
            "DocketMint can use matching rows only when a debtor anchor is confirmed; otherwise split it before single-matter processing."
        )

    return {
        "extracted_text": extracted_text,
        "parsed_payload": parsed_payload,
        "warnings": list(dict.fromkeys([item for item in warnings if item])),
        "file_type": file_type,
        "extraction_quality_score": float(score),
        "extraction_status": status,
        "extraction_method": extraction_method,
        "extraction_report": extraction_report,
        "normalized_evidence": normalized_evidence,
    }
