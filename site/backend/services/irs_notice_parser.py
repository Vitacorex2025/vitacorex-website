from __future__ import annotations

import re


NOTICE_PATTERNS = [
    re.compile(r"\b(CP\d{2,4}[A-Z]?)\b", re.IGNORECASE),
    re.compile(r"\b(LTR\s?\d+)\b", re.IGNORECASE),
]
TAX_YEAR_PATTERNS = [
    re.compile(r"\btax year\s*(20\d{2})\b", re.IGNORECASE),
    re.compile(r"\bfor\s+(20\d{2})\b", re.IGNORECASE),
]
AMOUNT_PATTERN = re.compile(r"\$ ?([0-9,]+(?:\.[0-9]{2})?)", re.IGNORECASE)
KEYWORD_MAP = {
    "identity": [r"\bidentity\b", r"\bverify your identity\b", r"\bverification\b"],
    "payment": [r"\bbalance due\b", r"\bpayment\b", r"\bamount due\b"],
    "correction": [r"\bcorrection\b", r"\bchanged your return\b", r"\badjustment\b"],
    "review": [r"\breview\b", r"\bplease review\b"],
    "audit": [r"\baudit\b", r"\bexamination\b"],
}


def _first_match(patterns: list[re.Pattern[str]], blob: str) -> str | None:
    for pattern in patterns:
        match = pattern.search(blob)
        if match:
            return str(match.group(1)).strip().upper().replace(" ", "")
    return None


def _first_tax_year(blob: str) -> str | None:
    for pattern in TAX_YEAR_PATTERNS:
        match = pattern.search(blob)
        if match:
            return str(match.group(1)).strip()
    return None


def _claimed_amount(blob: str) -> str | None:
    values: list[float] = []
    for match in AMOUNT_PATTERN.findall(blob or ""):
        try:
            values.append(float(str(match).replace(",", "")))
        except Exception:
            continue
    if not values:
        return None
    return f"{max(values):.2f}"


def _keywords(blob: str) -> list[str]:
    found: list[str] = []
    for label, patterns in KEYWORD_MAP.items():
        if any(re.search(pattern, blob, re.IGNORECASE) for pattern in patterns):
            found.append(label)
    return found


def parse_irs_notice(texts: list[str]) -> dict[str, object]:
    blob = "\n".join(texts or [])
    keywords = _keywords(blob)
    recommended_route = "build_response_packet"
    if "identity" in keywords:
        recommended_route = "identity_verification_path"
    elif "payment" in keywords:
        recommended_route = "payment_resolution"
    elif "audit" in keywords or "correction" in keywords:
        recommended_route = "build_response_packet"

    return {
        "notice_number": _first_match(NOTICE_PATTERNS, blob),
        "tax_year": _first_tax_year(blob),
        "claimed_amount": _claimed_amount(blob),
        "keywords": keywords,
        "recommended_route": recommended_route,
    }
