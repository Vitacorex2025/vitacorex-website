"""Contract analysis engine — pattern-based clause detection and risk scoring.

This module does NOT use LLM calls. All analysis is deterministic,
pattern-based, and rule-driven. It identifies clause types by keyword
matching and assigns risk levels based on predefined thresholds.

Human review remains required for all outputs.
"""

import re
from typing import Optional

# ── Clause detection patterns ────────────────────────────────────────
# Each pattern: (clause_type, compiled_regex, base_risk_level, note_template)

_PATTERNS: list[tuple[str, re.Pattern, str, str]] = []


def _p(clause_type: str, pattern: str, risk: str, note: str):
    _PATTERNS.append((clause_type, re.compile(pattern, re.IGNORECASE | re.DOTALL), risk, note))


# Termination / cancellation
_p("termination",
   r"(?:terminat|cancel).{0,80}(?:upon|with|without)\s+(?:\d+\s*(?:day|month|week|business day)s?|notice|cause|written)",
   "caution",
   "Review termination trigger conditions and required notice period.")

_p("termination_for_cause",
   r"(?:terminat|cancel).{0,60}(?:for cause|material breach|default)",
   "caution",
   "Termination-for-cause clause detected. Verify what constitutes 'cause'.")

# Indemnification
_p("indemnification",
   r"(?:indemnif|hold harmless).{0,120}(?:against|from|any and all)",
   "caution",
   "Indemnification obligation found. Confirm scope and cap.")

# Limitation of liability
_p("liability_limitation",
   r"(?:limit(?:ation)?\s+(?:of|on)\s+liabilit|(?:aggregate|total)\s+liabilit).{0,120}(?:shall not exceed|limited to|cap)",
   "caution",
   "Liability cap clause. Verify the cap amount relative to contract value.")

_p("liability_exclusion",
   r"(?:in no event|under no circumstance).{0,80}(?:liable|responsib).{0,60}(?:indirect|consequential|incidental|special|punitive)",
   "neutral",
   "Standard consequential damages exclusion.")

# Auto-renewal
_p("auto_renewal",
   r"(?:auto(?:matic(?:ally)?)?[\s-]*renew|renew\s+auto).{0,100}(?:unless|until|for\s+(?:an\s+)?additional)",
   "caution",
   "Auto-renewal clause. Confirm cancellation window and notice requirements.")

# Non-compete / non-solicitation
_p("non_compete",
   r"(?:non[\s-]*compet|covenant\s+not\s+to\s+compet).{0,120}(?:period|month|year|within)",
   "high_risk",
   "Non-compete restriction detected. Assess geographic scope and duration.")

_p("non_solicitation",
   r"(?:non[\s-]*solicit|shall\s+not\s+(?:directly\s+or\s+indirectly\s+)?solicit)",
   "caution",
   "Non-solicitation clause. Review scope of covered relationships.")

# Confidentiality / NDA
_p("confidentiality",
   r"(?:confidential|proprietary)\s+information.{0,120}(?:shall\s+not|agree\s+(?:to\s+)?(?:not|keep)|maintain\s+(?:the\s+)?confidential)",
   "neutral",
   "Standard confidentiality provision.")

# Governing law / jurisdiction
_p("governing_law",
   r"(?:govern(?:ed|ing)\s+(?:by\s+)?(?:the\s+)?law|jurisdiction\s+of|venue\s+(?:shall\s+be|in)).{0,80}(?:state\s+of|county|district|court)",
   "neutral",
   "Governing law / jurisdiction clause. Confirm favorable forum.")

# Assignment
_p("assignment",
   r"(?:assign(?:ment)?|transfer).{0,60}(?:without\s+(?:the\s+)?(?:prior\s+)?(?:written\s+)?consent|shall\s+not\s+(?:be\s+)?assign)",
   "neutral",
   "Assignment restriction. Verify if consent is required for M&A scenarios.")

# Payment terms
_p("payment_terms",
   r"(?:payment|invoice).{0,80}(?:net\s+\d+|within\s+\d+\s*(?:day|business)|due\s+(?:upon|within|on))",
   "neutral",
   "Payment terms identified. Confirm net days and late-fee provisions.")

# Force majeure
_p("force_majeure",
   r"(?:force\s+majeure|act\s+of\s+god|unforeseeable).{0,120}(?:shall\s+(?:not\s+)?(?:be\s+)?(?:liable|excused|relieved)|neither\s+party)",
   "neutral",
   "Force majeure clause. Review covered events list.")

# Intellectual property
_p("ip_ownership",
   r"(?:intellectual\s+property|work[\s-]*(?:for[\s-]*hire|product)|(?:all\s+)?(?:right|title|interest)).{0,80}(?:shall\s+(?:be\s+)?(?:owned|vest|belong)|assign|transfer)",
   "caution",
   "IP ownership provision. Verify work-for-hire / assignment scope.")

# Warranty / representations
_p("warranty",
   r"(?:warrant|represent).{0,60}(?:that|as\s+follows|the\s+following)",
   "neutral",
   "Warranty / representation clause. Standard language, review scope.")

# Dispute resolution / arbitration
_p("arbitration",
   r"(?:arbitrat|mediat|(?:alternative|binding)\s+dispute\s+resolution).{0,80}(?:shall|agree|submit|binding)",
   "caution",
   "Arbitration / ADR clause. Assess whether litigation rights are waived.")


# ── Text extraction (basic) ─────────────────────────────────────────

def extract_text_from_bytes(content: bytes, filename: str) -> Optional[str]:
    """Best-effort text extraction. Returns None if format unsupported."""
    lower = filename.lower()
    if lower.endswith(".txt") or lower.endswith(".md"):
        return content.decode("utf-8", errors="replace")
    # For PDF/DOCX we return None — those require pdfplumber/python-docx
    # which are Day 31-60 roadmap items
    return None


# ── Clause detection ─────────────────────────────────────────────────

def detect_clauses(text: str) -> list[dict]:
    """Run all patterns against the text. Return list of clause dicts."""
    results = []
    seen_types = set()
    for clause_type, pattern, risk, note in _PATTERNS:
        for match in pattern.finditer(text):
            # Take up to 200 chars around the match for excerpt
            start = max(0, match.start() - 40)
            end = min(len(text), match.end() + 160)
            excerpt = text[start:end].strip()
            # Clean up whitespace
            excerpt = re.sub(r"\s+", " ", excerpt)
            if len(excerpt) > 250:
                excerpt = excerpt[:247] + "..."

            key = (clause_type, excerpt[:80])
            if key in seen_types:
                continue
            seen_types.add(key)

            results.append({
                "clause_type": clause_type,
                "text_excerpt": excerpt,
                "confidence": round(0.6 + 0.3 * (len(match.group()) / 100), 2),
                "risk_level": risk,
                "note": note,
            })
    # Deduplicate by type (keep highest confidence per type)
    by_type: dict[str, list[dict]] = {}
    for r in results:
        by_type.setdefault(r["clause_type"], []).append(r)

    final = []
    for clause_type, items in by_type.items():
        items.sort(key=lambda x: x["confidence"], reverse=True)
        # Keep top 2 per type max
        final.extend(items[:2])

    final.sort(key=lambda x: {"high_risk": 0, "caution": 1, "neutral": 2}.get(x["risk_level"], 3))
    return final


# ── Risk scoring ─────────────────────────────────────────────────────

RISK_WEIGHTS = {
    "high_risk": 25,
    "caution": 10,
    "neutral": 2,
    "safe": 0,
}


def compute_risk_score(clauses: list[dict]) -> int:
    """Aggregate risk score from detected clauses (0-100)."""
    if not clauses:
        return 0
    raw = sum(RISK_WEIGHTS.get(c["risk_level"], 0) for c in clauses)
    # Normalize: 0-100 scale, capped at 100
    return min(100, raw)


def generate_risk_summary(clauses: list[dict], risk_score: int) -> str:
    """Generate a human-readable risk summary."""
    if not clauses:
        return "No recognizable clauses detected. The document may require manual review."

    high = [c for c in clauses if c["risk_level"] == "high_risk"]
    caution = [c for c in clauses if c["risk_level"] == "caution"]
    neutral = [c for c in clauses if c["risk_level"] == "neutral"]

    parts = []
    parts.append(f"Detected {len(clauses)} clause(s) across {len(set(c['clause_type'] for c in clauses))} categories.")

    if high:
        types = ", ".join(set(c["clause_type"].replace("_", " ") for c in high))
        parts.append(f"HIGH-RISK items ({len(high)}): {types}. These require immediate counsel review.")

    if caution:
        types = ", ".join(set(c["clause_type"].replace("_", " ") for c in caution))
        parts.append(f"CAUTION items ({len(caution)}): {types}. Recommend review before signing.")

    if neutral:
        parts.append(f"Standard provisions ({len(neutral)}): generally expected contract language.")

    parts.append(f"Aggregate risk score: {risk_score}/100.")
    parts.append("This is a preliminary automated scan. It does not constitute legal advice. Consult licensed counsel before acting on these findings.")

    return " ".join(parts)
