from __future__ import annotations

import re

from backend.services.invoice_balance_service import summarize_invoice_balance


CONTRACT_PATTERNS = [r"\bagreement\b", r"\bgoverning law\b", r"\bvenue\b", r"\battorneys'? fees\b"]
GUARANTY_PATTERNS = [r"\bpersonal guaranty\b", r"\bpersonally guarantee\b", r"\bguarantor\b"]
PERFORMANCE_PATTERNS = [r"\bcompleted\b", r"\bdelivered\b", r"\baccepted\b", r"\bproof of delivery\b"]


def parse_invoice_recovery_matter(texts: list[str]) -> dict[str, object]:
    blob = "\n".join(texts)

    balance_summary = summarize_invoice_balance(texts)

    has_contract = any(re.search(p, blob, re.IGNORECASE) for p in CONTRACT_PATTERNS)
    has_personal_guaranty = any(re.search(p, blob, re.IGNORECASE) for p in GUARANTY_PATTERNS)
    performance_proof_present = any(re.search(p, blob, re.IGNORECASE) for p in PERFORMANCE_PATTERNS)

    has_attorneys_fees_clause = bool(re.search(r"\battorneys'? fees\b", blob, re.IGNORECASE))
    has_governing_law_clause = bool(re.search(r"\bgoverning law\b", blob, re.IGNORECASE))
    has_venue_clause = bool(re.search(r"\bvenue\b", blob, re.IGNORECASE))

    evidence_gap_count = 0
    if not has_contract:
        evidence_gap_count += 1
    if not performance_proof_present:
        evidence_gap_count += 1

    return {
        "supported_balance": balance_summary["supported_balance"],
        "invoice_count": balance_summary["invoice_count"],
        "invoice_numbers": balance_summary["invoice_numbers"],
        "has_contract": has_contract,
        "has_personal_guaranty": has_personal_guaranty,
        "has_attorneys_fees_clause": has_attorneys_fees_clause,
        "has_governing_law_clause": has_governing_law_clause,
        "has_venue_clause": has_venue_clause,
        "performance_proof_present": performance_proof_present,
        "evidence_gap_count": evidence_gap_count,
        "recommended_route": "demand_path" if balance_summary["supported_balance"] != "0.00" else "balance_review",
    }
