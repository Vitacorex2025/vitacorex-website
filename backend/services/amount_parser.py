from __future__ import annotations

import re
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation


@dataclass(frozen=True)
class ParsedAmount:
    raw_text: str | None
    value: Decimal | None
    confidence: float
    warning: str | None = None

    @property
    def usable(self) -> bool:
        return self.value is not None and self.confidence >= 0.95


def _finalize(text: str, confidence: float, warning: str | None = None) -> ParsedAmount:
    negative = text.startswith("(") and text.endswith(")")
    cleaned = text.strip().strip("()")
    cleaned = cleaned.replace("$", "").replace("USD", "").replace("usd", "").replace(" ", "")
    try:
        value = Decimal(cleaned)
    except (InvalidOperation, ValueError):
        return ParsedAmount(raw_text=text, value=None, confidence=0.0, warning=warning or "Unable to parse amount.")
    if negative:
        value = -value
    return ParsedAmount(raw_text=text, value=value.quantize(Decimal("0.01")), confidence=confidence, warning=warning)


def parse_amount(value: object | None) -> ParsedAmount:
    if isinstance(value, Decimal):
        return ParsedAmount(raw_text=str(value), value=value.quantize(Decimal("0.01")), confidence=1.0)
    if isinstance(value, int):
        return ParsedAmount(raw_text=str(value), value=Decimal(value).quantize(Decimal("0.01")), confidence=1.0)
    if isinstance(value, float):
        return ParsedAmount(raw_text=str(value), value=Decimal(str(value)).quantize(Decimal("0.01")), confidence=0.98)

    raw_text = str(value or "").strip()
    if not raw_text:
        return ParsedAmount(raw_text=None, value=None, confidence=0.0, warning="Amount field is blank.")

    text = raw_text.replace("\u00a0", " ").strip()

    # Standard US format, optional commas/spaces and decimal cents.
    if (
        re.fullmatch(r"\(?-?\$?\s*\d{1,3}(?:[ ,]\d{3})*(?:\.\d{2})?\s*\)?", text)
        or re.fullmatch(r"\(?-?\$?\s*\d+(?:\.\d{2})?\s*\)?", text)
    ):
        normalized = re.sub(r"[\$, ]", "", text)
        return _finalize(normalized, 1.0)

    # Decimal comma formats like 1234,56 or 1.234,56.
    if re.fullmatch(r"\(?-?\$?\s*\d+(?:,\d{2})\s*\)?", text):
        normalized = re.sub(r"[\$ ]", "", text).replace(",", ".")
        return _finalize(normalized, 0.96)
    if re.fullmatch(r"\(?-?\$?\s*\d{1,3}(?:\.\d{3})+(?:,\d{2})\s*\)?", text):
        normalized = re.sub(r"[\$ .]", "", text).replace(",", ".")
        return _finalize(normalized, 0.95)

    comma_count = text.count(",")
    dot_count = text.count(".")
    if comma_count > 1 and dot_count == 0:
        return ParsedAmount(
            raw_text=raw_text,
            value=None,
            confidence=0.0,
            warning=f"Ambiguous numeric string '{raw_text}' requires review before it can be used in totals.",
        )
    if comma_count and dot_count and text.rfind(",") > text.rfind("."):
        return ParsedAmount(
            raw_text=raw_text,
            value=None,
            confidence=0.0,
            warning=f"Mixed comma/decimal separators in '{raw_text}' are ambiguous and were excluded from totals.",
        )

    squashed = re.sub(r"[\$, ]", "", text)
    try:
        return _finalize(squashed, 0.75, warning=f"Amount '{raw_text}' was parsed with low confidence and requires review.")
    except Exception:
        return ParsedAmount(raw_text=raw_text, value=None, confidence=0.0, warning="Unable to parse amount.")
