from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass
from typing import Iterable

from backend.models.case_schema import CaseRecord, MatterConflictDetail, MatterConsistencyReport, StoredFile
from backend.services.case_state import active_source_files


_CORP_SUFFIXES = {
    "LLC", "L L C", "INC", "INC.", "CORP", "CORPORATION", "COMPANY", "CO", "CO.", "LTD", "LIMITED", "PLLC",
}
_CANONICAL_REPLACEMENTS = {
    "TRANSPORTATION": "TRANSPORT",
    "LOGISTICS": "LOGISTICS",
    "SYSTEM": "SYSTEMS",
    "SYSTEMS": "SYSTEMS",
}


def _clean(value: object | None) -> str | None:
    text = " ".join(str(value or "").replace("\u00a0", " ").split()).strip(" \n\t\r,;")
    return text or None


def entity_key(name: str | None) -> str:
    value = (_clean(name) or "").upper()
    if not value:
        return ""
    value = value.replace("&", " AND ")
    value = re.sub(r"[^A-Z0-9 ]+", " ", value)
    tokens = []
    for token in value.split():
        token = _CANONICAL_REPLACEMENTS.get(token, token)
        if token in _CORP_SUFFIXES:
            continue
        tokens.append(token)
    if not tokens:
        return ""
    return " ".join(tokens)


def _display_name(name: str | None) -> str | None:
    cleaned = _clean(name)
    return cleaned if cleaned else None


@dataclass
class CandidateHit:
    name: str
    key: str
    source_filename: str
    source_kind: str
    confidence: float


def _append_hit(bucket: dict[str, list[CandidateHit]], name: str | None, source_filename: str, source_kind: str, confidence: float) -> None:
    display = _display_name(name)
    key = entity_key(display)
    if not display or not key:
        return
    bucket[key].append(CandidateHit(name=display, key=key, source_filename=source_filename, source_kind=source_kind, confidence=confidence))


def _iter_pdf_candidates(text: str) -> dict[str, list[str]]:
    text = text or ""
    debtors: list[str] = []
    plaintiffs: list[str] = []
    guarantors: list[str] = []

    patterns = {
        "debtors": [
            r"Company Name\s*\*?\s*\n([A-Za-z0-9 .,&'/-]+)",
            r"between\s+[A-Za-z0-9 .,&'/-]+?\s+\(the\s+(?:[“”\"])?Club Organizer(?:[“”\"])?\)\s+and\s+([A-Za-z0-9 .,&'/-]+?)\s+\(the\s+(?:[“”\"])?Customer(?:[“”\"])?\)",
            r"Invoice(?:\s+[A-Z0-9-]+)?[\s\S]{0,260}?\n([A-Z][A-Z0-9 .,&'/-]{2,})\nAddress:",
        ],
        "plaintiffs": [
            r"between\s+([A-Za-z0-9 .,&'/-]+?)\s+\(the\s+(?:[“”\"])?Club Organizer(?:[“”\"])?\)\s+and\s+[A-Za-z0-9 .,&'/-]+?\s+\(the\s+(?:[“”\"])?Customer(?:[“”\"])?\)",
            r"I hereby authorize\s+([A-Za-z0-9 .,&'/-]+?)\s+to initiate electronic withdrawals",
            r"^([A-Z][A-Za-z0-9 .,&'/-]{2,})\s*\nAddress:",
        ],
        "guarantors": [
            r"I,\s*([A-Z][A-Za-z .'-]{2,})\s*\(Full name of Guarantor\)",
            r"Personal Guarantee Agreement\s*I,\s*([A-Z][A-Za-z .'-]{2,})",
            r"Cardholder's name\s*\*?\s*\n([A-Za-z .'-]+)",
        ],
    }

    for pattern in patterns["debtors"]:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE | re.MULTILINE | re.DOTALL):
            value = _clean(match.group(1))
            if value:
                debtors.append(value)
    for pattern in patterns["plaintiffs"]:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE | re.MULTILINE | re.DOTALL):
            value = _clean(match.group(1))
            if value:
                plaintiffs.append(value)
    for pattern in patterns["guarantors"]:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE | re.MULTILINE | re.DOTALL):
            value = _clean(match.group(1))
            if value:
                guarantors.append(value)

    return {"debtors": debtors, "plaintiffs": plaintiffs, "guarantors": guarantors}


def _hits_by_key(hits: Iterable[CandidateHit]) -> dict[str, dict[str, object]]:
    grouped: dict[str, dict[str, object]] = {}
    for hit in hits:
        current = grouped.setdefault(
            hit.key,
            {
                "display_name": hit.name,
                "sources": set(),
                "score": 0.0,
            },
        )
        current["sources"].add(hit.source_filename)
        current["score"] = float(current["score"]) + hit.confidence
        if len(hit.name) > len(str(current["display_name"])):
            current["display_name"] = hit.name
    return grouped


def _preferred_name(grouped: dict[str, dict[str, object]], preferred: str | None) -> tuple[str | None, str | None]:
    if preferred:
        key = entity_key(preferred)
        if key and key in grouped:
            return key, grouped[key]["display_name"]
    if not grouped:
        if preferred:
            return entity_key(preferred), preferred
        return None, None
    ranked = sorted(
        grouped.items(),
        key=lambda item: (
            -float(item[1]["score"]),
            -len(item[1]["sources"]),
            str(item[1]["display_name"]).lower(),
        ),
    )
    return ranked[0][0], str(ranked[0][1]["display_name"])


def analyze_case_sources(record: CaseRecord) -> tuple[MatterConsistencyReport, dict[str, object]]:
    debtor_hits: dict[str, list[CandidateHit]] = defaultdict(list)
    plaintiff_hits: dict[str, list[CandidateHit]] = defaultdict(list)
    guarantor_hits: dict[str, list[CandidateHit]] = defaultdict(list)
    strong_debtor_hits: dict[str, list[CandidateHit]] = defaultdict(list)
    file_debtor_keys: dict[str, set[str]] = defaultdict(set)
    tabular_file_ids: set[str] = set()
    tabular_debtor_keys: set[str] = set()
    non_tabular_debtor_keys: set[str] = set()
    workbook_messages: list[str] = []
    conflict_details: list[MatterConflictDetail] = []

    preferred_defendant = record.extracted_case_data.defendant_entity.party_name
    preferred_plaintiff = record.extracted_case_data.plaintiff.party_name

    for item in active_source_files(record):
        payload = item.parsed_payload or {}
        source_kind = item.file_type.value if hasattr(item.file_type, "value") else str(item.file_type)
        filename = item.original_filename or item.filename

        if source_kind in {"invoice_excel", "invoice_csv"}:
            tabular_file_ids.add(item.id)
            line_items = payload.get("line_items", []) if isinstance(payload, dict) else []
            debtor_keys_in_file: set[str] = set()
            plaintiff_keys_in_file: set[str] = set()

            for row in line_items:
                company = _display_name(row.get("company") or row.get("customer_name"))
                organization = _display_name(row.get("organization"))
                guarantor = _display_name(row.get("owner_name"))
                if company:
                    key = entity_key(company)
                    debtor_keys_in_file.add(key)
                    tabular_debtor_keys.add(key)
                    _append_hit(debtor_hits, company, filename, source_kind, 0.35)
                if organization:
                    key = entity_key(organization)
                    plaintiff_keys_in_file.add(key)
                    _append_hit(plaintiff_hits, organization, filename, source_kind, 0.25)
                if guarantor:
                    _append_hit(guarantor_hits, guarantor, filename, source_kind, 0.20)

            file_debtor_keys[item.id] = {key for key in debtor_keys_in_file if key}
            if len(file_debtor_keys[item.id]) > 1:
                display_values = sorted({next(hit.name for hit in debtor_hits[key] if hit.source_filename == filename) for key in file_debtor_keys[item.id] if debtor_hits.get(key)})
                workbook_messages.append(
                    f"Workbook '{filename}' contains multiple debtor companies ({', '.join(display_values[:6])})."
                )
                conflict_details.append(MatterConflictDetail(source_filename=filename, conflict_type="multi_debtor_workbook", entities=display_values))
            if len(plaintiff_keys_in_file) > 1:
                plaintiff_values = sorted({next(hit.name for hit in plaintiff_hits[key] if hit.source_filename == filename) for key in plaintiff_keys_in_file if plaintiff_hits.get(key)})
                conflict_details.append(MatterConflictDetail(source_filename=filename, conflict_type="multi_plaintiff_workbook", entities=plaintiff_values))
            continue

        text = item.extracted_text or ""
        file_candidates = _iter_pdf_candidates(text)
        current_file_keys: set[str] = set()
        for debtor in file_candidates["debtors"]:
            key = entity_key(debtor)
            if key:
                current_file_keys.add(key)
                non_tabular_debtor_keys.add(key)
                _append_hit(debtor_hits, debtor, filename, source_kind, 1.0 if source_kind in {"contract_pdf", "guaranty_pdf"} else 0.9)
                if source_kind in {"contract_pdf", "guaranty_pdf", "invoice_pdf", "account_statement_pdf"}:
                    _append_hit(strong_debtor_hits, debtor, filename, source_kind, 1.0 if source_kind in {"contract_pdf", "guaranty_pdf"} else 0.9)
        for plaintiff in file_candidates["plaintiffs"]:
            _append_hit(plaintiff_hits, plaintiff, filename, source_kind, 0.95)
        for guarantor in file_candidates["guarantors"]:
            _append_hit(guarantor_hits, guarantor, filename, source_kind, 0.85)
        if current_file_keys:
            file_debtor_keys[item.id] = current_file_keys
        if len(current_file_keys) > 1:
            names = sorted({hit.name for key in current_file_keys for hit in debtor_hits.get(key, []) if hit.source_filename == filename})
            conflict_details.append(MatterConflictDetail(source_filename=filename, conflict_type="multi_debtor_pdf", entities=names))

    debtor_grouped = _hits_by_key(hit for hits in debtor_hits.values() for hit in hits)
    plaintiff_grouped = _hits_by_key(hit for hits in plaintiff_hits.values() for hit in hits)
    guarantor_grouped = _hits_by_key(hit for hits in guarantor_hits.values() for hit in hits)
    strong_debtor_grouped = _hits_by_key(hit for hits in strong_debtor_hits.values() for hit in hits)

    overlapping_party_keys = [key for key in list(plaintiff_grouped.keys()) if key in debtor_grouped]
    if overlapping_party_keys and len(plaintiff_grouped) > 1:
        for key in overlapping_party_keys:
            plaintiff_grouped.pop(key, None)

    anchor_debtor_key, anchor_debtor_name = _preferred_name(debtor_grouped, preferred_defendant)
    anchor_plaintiff_key, anchor_plaintiff_name = _preferred_name(plaintiff_grouped, preferred_plaintiff)
    preferred_anchor_key = entity_key(preferred_defendant)
    extra_debtor_keys = {key for key in debtor_grouped if key and key != anchor_debtor_key}
    anchor_confirmed_by_primary_sources = bool(
        anchor_debtor_key
        and strong_debtor_grouped
        and len(strong_debtor_grouped) == 1
        and anchor_debtor_key in strong_debtor_grouped
    )
    anchor_confirmed_by_user_target = bool(anchor_debtor_key and preferred_anchor_key and preferred_anchor_key == anchor_debtor_key)
    every_tabular_file_contains_anchor = bool(
        anchor_debtor_key
        and tabular_file_ids
        and all(
            not file_debtor_keys.get(file_id)
            or anchor_debtor_key in file_debtor_keys.get(file_id, set())
            for file_id in tabular_file_ids
        )
    )
    tabular_only_extra_debtors = bool(
        anchor_debtor_key
        and extra_debtor_keys
        and workbook_messages
        and every_tabular_file_contains_anchor
        and extra_debtor_keys.issubset(tabular_debtor_keys)
        and not extra_debtor_keys.intersection(non_tabular_debtor_keys)
        and (anchor_confirmed_by_primary_sources or anchor_confirmed_by_user_target)
    )

    detected_debtors = [str(item["display_name"]) for _, item in sorted(debtor_grouped.items(), key=lambda pair: (-float(pair[1]["score"]), str(pair[1]["display_name"])))]
    detected_plaintiffs = [str(item["display_name"]) for _, item in sorted(plaintiff_grouped.items(), key=lambda pair: (-float(pair[1]["score"]), str(pair[1]["display_name"])))]
    detected_guarantors = [str(item["display_name"]) for _, item in sorted(guarantor_grouped.items(), key=lambda pair: (-float(pair[1]["score"]), str(pair[1]["display_name"])))]

    blockers: list[str] = []
    warnings: list[str] = []

    if len(debtor_grouped) > 1:
        if tabular_only_extra_debtors:
            warnings.append(
                f"Spreadsheet/CSV sources also contain other debtor companies. DocketMint is using only the rows that match {anchor_debtor_name or 'the anchored debtor'} for this matter."
            )
        else:
            blockers.append("This upload contains multiple debtor matters. Split them into separate cases.")
    if len(plaintiff_grouped) > 1:
        blockers.append("This upload contains multiple unrelated plaintiff/source sets. Separate them before complaint generation.")
    if tabular_only_extra_debtors:
        warnings.extend(workbook_messages)
    else:
        blockers.extend(workbook_messages)

    source_set_used: list[str] = []
    excluded_sources: list[str] = []
    for item in record.source_files:
        filename = item.original_filename or item.filename
        if getattr(item, "excluded_from_active_matter", False):
            excluded_sources.append(filename + " (manually excluded)")
            continue
        file_keys = file_debtor_keys.get(item.id, set())
        if anchor_debtor_key and file_keys and anchor_debtor_key in file_keys and len(file_keys) == 1:
            source_set_used.append(filename)
        elif anchor_debtor_key and file_keys and anchor_debtor_key in file_keys and len(file_keys) > 1:
            source_set_used.append(filename + " (matching rows only)")
            excluded_sources.append(filename + " (contains unrelated debtors)")
        elif file_keys:
            excluded_sources.append(filename)
        else:
            if anchor_debtor_name and (item.original_filename or "").upper().startswith(anchor_debtor_name.split()[0].upper()):
                source_set_used.append(filename)
            elif anchor_debtor_name and source_kind_from_item(item) in {"contract_pdf", "guaranty_pdf"}:
                source_set_used.append(filename)

    report = MatterConsistencyReport(
        status="blocked" if blockers else "pass",
        anchor_plaintiff_name=anchor_plaintiff_name,
        anchor_debtor_name=anchor_debtor_name,
        detected_debtor_entities=detected_debtors,
        detected_plaintiff_entities=detected_plaintiffs,
        detected_guarantors=detected_guarantors,
        source_set_used=source_set_used,
        excluded_sources=excluded_sources,
        blockers=blockers,
        warnings=warnings,
        conflicts=conflict_details,
    )

    detail = {
        "anchor_debtor_key": anchor_debtor_key,
        "anchor_plaintiff_key": anchor_plaintiff_key,
        "file_debtor_keys": {file_id: sorted(keys) for file_id, keys in file_debtor_keys.items()},
        "workbook_messages": workbook_messages,
        "debtor_grouped": debtor_grouped,
        "plaintiff_grouped": plaintiff_grouped,
        "guarantor_grouped": guarantor_grouped,
        "strong_debtor_grouped": strong_debtor_grouped,
        "tabular_only_extra_debtors": tabular_only_extra_debtors,
        "every_tabular_file_contains_anchor": every_tabular_file_contains_anchor,
    }
    return report, detail


def source_kind_from_item(item: StoredFile) -> str:
    return item.file_type.value if hasattr(item.file_type, "value") else str(item.file_type)
