from __future__ import annotations

import re
from decimal import Decimal

AMOUNT_PATTERN = r"\$ ?([0-9,]+(?:\.[0-9]{2})?)"
INVOICE_NUMBER_PATTERNS = [
    r"\binvoice\s*(?:number|#)?\s*[:\-]?\s*([A-Z0-9\-]+)\b",
    r"\binv\s*[:\-]?\s*([A-Z0-9\-]+)\b",
]


def _extract_amounts(text: str) -> list[Decimal]:
    values: list[Decimal] = []
    for match in re.findall(AMOUNT_PATTERN, text or "", re.IGNORECASE):
        try:
            values.append(Decimal(match.replace(",", "")))
        except Exception:
            continue
    return values


def _extract_invoice_numbers(text: str) -> list[str]:
    found: list[str] = []
    blob = text or ""
    for pattern in INVOICE_NUMBER_PATTERNS:
        for match in re.findall(pattern, blob, re.IGNORECASE):
            cleaned = str(match).strip()
            if cleaned and re.search(r"\d", cleaned) and cleaned not in found:
                found.append(cleaned)
    return found


def _canonical_invoice_key(value: str) -> str:
    cleaned = re.sub(r"[^A-Z0-9]", "", str(value or "").upper())
    cleaned = re.sub(r"^(INV|INVOICE)+", "", cleaned)
    return cleaned or str(value or "").upper()


def summarize_invoice_balance(texts: list[str]) -> dict[str, object]:
    invoice_numbers: list[str] = []
    invoice_seen: set[str] = set()
    all_amounts: list[Decimal] = []

    for text in texts:
        for invoice_number in _extract_invoice_numbers(text):
            key = _canonical_invoice_key(invoice_number)
            if key in invoice_seen:
                continue
            invoice_seen.add(key)
            invoice_numbers.append(invoice_number)
        all_amounts.extend(_extract_amounts(text))

    supported_balance = max(all_amounts).quantize(Decimal("0.01")) if all_amounts else Decimal("0.00")

    return {
        "invoice_count": len(invoice_numbers),
        "invoice_numbers": invoice_numbers,
        "supported_balance": f"{supported_balance:.2f}",
    }
