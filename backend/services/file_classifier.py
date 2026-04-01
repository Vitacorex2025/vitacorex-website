
from __future__ import annotations

import re
import unicodedata

from backend.models.case_schema import FileType


_TEMPLATE_KEYWORDS = {
    "demand letter",
    "complaint",
    "civil cover sheet",
    "request for issuance of summons",
    "summons company",
    "summons individual",
    "motion for clerk",
    "motion for clerks default",
    "proposed final judgment",
    "debt calculation sheet",
    "affidavit of amount due",
    "exhibit index",
}


_TEMPLATE_SLOT_MAP = {
    "01 demand letter.docx": "demand_letter",
    "02 complaint.docx": "complaint",
    "03 civil cover sheet.docx": "civil_cover_sheet",
    "04 request for issuance of summons.docx": "request_for_issuance_of_summons",
    "05 summons company.docx": "summons_company",
    "06 summons individual.docx": "summons_individual",
    "07 motion for clerk's default.docx": "motion_for_clerks_default",
    "07 motion for clerks default.docx": "motion_for_clerks_default",
    "08 proposed final judgment.docx": "proposed_final_judgment",
    "09 debt calculation sheet.docx": "debt_calculation_sheet",
    "10 affidavit of amount due.docx": "affidavit_of_amount_due",
    "11 exhibit index.docx": "exhibit_index",
}


def normalized_filename(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value or "upload")
    normalized = normalized.encode("ascii", "ignore").decode("ascii")
    normalized = re.sub(r"[^a-zA-Z0-9._-]+", "-", normalized).strip(".-")
    return normalized or "upload"


def infer_template_slot(filename: str) -> str | None:
    normalized = " ".join((filename or "").replace("_", " ").replace("-", " ").split()).lower()
    for key, slot in _TEMPLATE_SLOT_MAP.items():
        if normalized == key:
            return slot
    for key, slot in _TEMPLATE_SLOT_MAP.items():
        if key.replace(".docx", "") in normalized:
            return slot
    return None


def classify_file(filename: str, content_type: str | None = None, extracted_text: str | None = None) -> str:
    name = (filename or "").lower()
    ctype = (content_type or "").lower()
    text = (extracted_text or "").lower()

    if name.endswith(".docx"):
        return FileType.TEMPLATE_DOCX.value if infer_template_slot(filename) else FileType.UNKNOWN.value

    if name.endswith(".csv"):
        return FileType.INVOICE_CSV.value

    if name.endswith((".xlsx", ".xls")):
        return FileType.INVOICE_EXCEL.value

    if any(token in name for token in ("statement", "account", "chargeoff", "charge-off")):
        return FileType.ACCOUNT_STATEMENT_PDF.value

    if any(token in name for token in ("invoice", "inv_")):
        return FileType.INVOICE_PDF.value

    guaranty_signals = ("personal guarant", "personal guaranty", "personal guarantee", "guarantor", "continuing guaranty", "continuing guarantee")
    if any(token in name for token in ("guarant", "guarantee")) or any(signal in text for signal in guaranty_signals):
        return FileType.GUARANTY_PDF.value

    contract_signals = ("agreement", "governed by", "venue", "club organizer", "services provided")
    if any(token in name for token in ("contract", "agreement", "msa", "terms")) or any(signal in text for signal in contract_signals):
        return FileType.CONTRACT_PDF.value

    if "application/pdf" in ctype:
        if "invoice" in text and "total" in text:
            return FileType.INVOICE_PDF.value
        if "agreement" in text or "governed by" in text or "venue" in text:
            return FileType.CONTRACT_PDF.value
        return FileType.SUPPORTING_EXHIBIT.value

    return FileType.UNKNOWN.value
