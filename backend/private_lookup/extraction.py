"""
VitaCoreX Private Lookup — Document / image extraction.

Attempts to extract lookup-relevant fields from uploaded PDFs and images.
Uses pypdf for PDFs and basic text pattern matching.
No OCR library is required for MVP — falls back gracefully if not available.

Privacy rules:
- Raw document content is NOT sent to analytics
- Raw document content is NOT logged
- Extracted text is used only for field detection
- No raw images are stored beyond the request lifecycle
"""
from __future__ import annotations

import io
import logging
import re
from typing import Optional

from .schema import ExtractionResult, ExtractedField, LookupTab

logger = logging.getLogger(__name__)


def _extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF using pypdf."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(content))
        texts = []
        for page in reader.pages[:3]:  # First 3 pages only
            texts.append(page.extract_text() or "")
        return "\n".join(texts)
    except Exception as e:
        logger.debug("PDF extraction failed: %s", str(e)[:100])
        return ""


def _extract_text_from_image(content: bytes, content_type: str) -> str:
    """Attempt OCR if pytesseract is available. Otherwise return empty string."""
    try:
        import pytesseract
        from PIL import Image
        img = Image.open(io.BytesIO(content))
        return pytesseract.image_to_string(img)
    except ImportError:
        return ""
    except Exception as e:
        logger.debug("OCR extraction failed: %s", str(e)[:100])
        return ""


def _detect_invoice_number(text: str) -> Optional[tuple[str, float]]:
    """Look for SunPass invoice / toll citation patterns."""
    patterns = [
        (r"\bINVOICE\s*#?\s*:?\s*([A-Z0-9\-]{6,20})", 0.85),
        (r"\bINVOICE\s+NUMBER\s*:?\s*([A-Z0-9\-]{6,20})", 0.90),
        (r"\bCITATION\s*#?\s*:?\s*([A-Z0-9\-]{6,20})", 0.85),
        (r"\bTOLL\s+INVOICE\s*:?\s*([A-Z0-9\-]{6,20})", 0.90),
        (r"\b(INV-[A-Z0-9\-]{6,18})\b", 0.80),
    ]
    for pattern, confidence in patterns:
        m = re.search(pattern, text.upper())
        if m:
            return m.group(1).strip(), confidence
    return None


def _detect_plate_number(text: str) -> Optional[tuple[str, float]]:
    """Look for Florida license plate patterns."""
    patterns = [
        (r"\bPLATE\s*#?\s*:?\s*([A-Z0-9]{2,8})\b", 0.80),
        (r"\bLICENSE\s+PLATE\s*:?\s*([A-Z0-9]{4,8})\b", 0.85),
        (r"\bVEHICLE\s+PLATE\s*:?\s*([A-Z0-9]{4,8})\b", 0.80),
        (r"\bTAG\s*:?\s*([A-Z0-9]{4,8})\b", 0.70),
    ]
    for pattern, confidence in patterns:
        m = re.search(pattern, text.upper())
        if m:
            return m.group(1).strip(), confidence
    return None


def _detect_citation_number(text: str) -> Optional[tuple[str, float]]:
    """Look for uniform traffic citation patterns."""
    patterns = [
        (r"\bUNIFORM\s+TRAFFIC\s+CITATION\s*#?\s*:?\s*([A-Z0-9\-]{6,20})", 0.90),
        (r"\bCITATION\s+NUMBER\s*:?\s*([A-Z0-9\-]{6,20})", 0.88),
        (r"\bCITATION\s*#\s*:?\s*([A-Z0-9\-]{6,20})", 0.85),
        (r"\bUTC\s*#?\s*:?\s*([A-Z0-9\-]{6,20})", 0.80),
        (r"\bTICKET\s*#?\s*:?\s*([A-Z0-9\-]{6,20})", 0.75),
    ]
    for pattern, confidence in patterns:
        m = re.search(pattern, text.upper())
        if m:
            return m.group(1).strip(), confidence
    return None


def _detect_case_number(text: str) -> Optional[tuple[str, float]]:
    """Look for Florida court case number patterns."""
    patterns = [
        (r"\bCASE\s*#?\s*:?\s*([0-9]{2}-[A-Z0-9\-]{4,20})", 0.88),
        (r"\bCASE\s+NUMBER\s*:?\s*([0-9A-Z\-]{6,25})", 0.85),
        (r"\b([0-9]{4}-[A-Z]{2}-[0-9]{6})\b", 0.80),  # FL appellate format
        (r"\bDOCKET\s*#?\s*:?\s*([0-9A-Z\-]{6,20})", 0.78),
    ]
    for pattern, confidence in patterns:
        m = re.search(pattern, text.upper())
        if m:
            return m.group(1).strip(), confidence
    return None


def _detect_county(text: str) -> Optional[tuple[str, float]]:
    """Look for Florida county name."""
    fl_counties = [
        "hillsborough", "miami-dade", "broward", "palm beach", "orange",
        "pinellas", "duval", "seminole", "polk", "volusia",
        "lee", "collier", "manatee", "sarasota", "escambia",
        "leon", "alachua", "brevard", "pasco", "hernando",
    ]
    text_lower = text.lower()
    for county in fl_counties:
        if county in text_lower:
            return county.title(), 0.85
    # Generic "County" pattern
    m = re.search(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+County\b", text)
    if m:
        return m.group(1).strip(), 0.70
    return None


def _detect_amount_due(text: str) -> Optional[tuple[str, float]]:
    """Look for dollar amount patterns."""
    patterns = [
        (r"\bAMOUNT\s+DUE\s*:?\s*\$\s*([\d,]+\.?\d*)", 0.88),
        (r"\bBALANCE\s+DUE\s*:?\s*\$\s*([\d,]+\.?\d*)", 0.85),
        (r"\bTOTAL\s+DUE\s*:?\s*\$\s*([\d,]+\.?\d*)", 0.83),
        (r"\bFINE\s+AMOUNT\s*:?\s*\$\s*([\d,]+\.?\d*)", 0.80),
    ]
    for pattern, confidence in patterns:
        m = re.search(pattern, text.upper())
        if m:
            return f"${m.group(1).strip()}", confidence
    return None


def _classify_document(text: str) -> Optional[LookupTab]:
    """Guess which tool tab is most relevant based on document content."""
    text_upper = text.upper()
    toll_signals = ["SUNPASS", "TOLL INVOICE", "UNPAID TOLL", "TURNPIKE", "E-ZPASS"]
    traffic_signals = ["UNIFORM TRAFFIC CITATION", "TRAFFIC CITATION", "CITATION NUMBER", "MOVING VIOLATION", "SPEEDING", "UTC #"]
    court_signals = ["CASE NUMBER", "CIRCUIT COURT", "COUNTY COURT", "APPELLATE", "PLAINTIFF", "DEFENDANT", "PETITIONER", "RESPONDENT", "DOCKET"]

    toll_score = sum(1 for s in toll_signals if s in text_upper)
    traffic_score = sum(1 for s in traffic_signals if s in text_upper)
    court_score = sum(1 for s in court_signals if s in text_upper)

    best = max(toll_score, traffic_score, court_score)
    if best == 0:
        return None
    if toll_score == best:
        return LookupTab.TOLLS
    if traffic_score == best:
        return LookupTab.TRAFFIC
    return LookupTab.COURTS


def extract_from_document(content: bytes, filename: str, content_type: str) -> ExtractionResult:
    """
    Main entry point for document extraction.
    Returns ExtractionResult with extracted fields and suggested tab.
    """
    # Extract text
    is_pdf = "pdf" in content_type.lower() or filename.lower().endswith(".pdf")
    if is_pdf:
        text = _extract_text_from_pdf(content)
    else:
        text = _extract_text_from_image(content, content_type)

    if not text.strip():
        return ExtractionResult(
            suggested_tab=None,
            extracted_fields=[],
            raw_text_snippet=None,
            extraction_successful=False,
            message="Could not read text from this document. Please enter the information manually.",
        )

    extracted_fields: list[ExtractedField] = []

    # Try invoice number (tolls)
    result = _detect_invoice_number(text)
    if result:
        val, conf = result
        extracted_fields.append(ExtractedField(
            field_name="invoice_number",
            value=val,
            confidence=conf,
            requires_confirmation=conf < 0.80,
        ))

    # Try plate number
    result = _detect_plate_number(text)
    if result:
        val, conf = result
        extracted_fields.append(ExtractedField(
            field_name="plate_number",
            value=val,
            confidence=conf,
            requires_confirmation=conf < 0.80,
        ))

    # Try citation number
    result = _detect_citation_number(text)
    if result:
        val, conf = result
        extracted_fields.append(ExtractedField(
            field_name="citation_number",
            value=val,
            confidence=conf,
            requires_confirmation=conf < 0.80,
        ))

    # Try case number
    result = _detect_case_number(text)
    if result:
        val, conf = result
        extracted_fields.append(ExtractedField(
            field_name="case_number",
            value=val,
            confidence=conf,
            requires_confirmation=conf < 0.80,
        ))

    # Try county
    result = _detect_county(text)
    if result:
        val, conf = result
        extracted_fields.append(ExtractedField(
            field_name="fl_county",
            value=val,
            confidence=conf,
            requires_confirmation=conf < 0.80,
        ))

    # Try amount due
    result = _detect_amount_due(text)
    if result:
        val, conf = result
        extracted_fields.append(ExtractedField(
            field_name="amount_due",
            value=val,
            confidence=conf,
            requires_confirmation=False,
        ))

    suggested_tab = _classify_document(text)
    has_extractions = len(extracted_fields) > 0
    snippet = text.strip()[:300].replace("\n", " ") if text.strip() else None

    if has_extractions:
        low_conf_count = sum(1 for f in extracted_fields if f.confidence < 0.80)
        msg = (
            f"Extracted {len(extracted_fields)} field(s) from your document. "
            + (f"{low_conf_count} field(s) need confirmation before proceeding. " if low_conf_count else "")
            + "Please review the extracted values below before running the lookup."
        )
    else:
        msg = "Document was readable but no recognizable fields were found. Please enter the information manually."

    return ExtractionResult(
        suggested_tab=suggested_tab,
        extracted_fields=extracted_fields,
        raw_text_snippet=snippet,
        extraction_successful=has_extractions,
        message=msg,
    )
