"""Contract analysis engine — pattern-based clause detection and risk scoring.

This module does NOT use LLM calls. All analysis is deterministic,
pattern-based, and rule-driven. It identifies clause types by keyword
matching and assigns risk levels based on predefined thresholds.

Phase 3: Initial 16-pattern clause detection + risk scoring.
Phase 4B: PDF/DOCX extraction, missing protections, suggested questions,
          issue bucketing.

Human review remains required for all outputs.
"""

import logging
import re
from typing import Optional

logger = logging.getLogger("vcx.contract_analyzer")

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


# ── Expected protections per contract type ──────────────────────────
# Maps contract type to clause types that are commonly expected.

_EXPECTED_PROTECTIONS: dict[str, list[str]] = {
    "Employment": [
        "termination", "non_compete", "confidentiality", "ip_ownership",
        "non_solicitation", "governing_law", "arbitration", "warranty",
    ],
    "Service": [
        "termination", "liability_limitation", "indemnification",
        "payment_terms", "confidentiality", "ip_ownership",
        "governing_law", "force_majeure", "warranty",
    ],
    "NDA": [
        "confidentiality", "termination", "governing_law",
        "assignment", "arbitration",
    ],
    "Lease": [
        "termination", "payment_terms", "liability_limitation",
        "force_majeure", "governing_law", "auto_renewal", "assignment",
    ],
    "Purchase": [
        "payment_terms", "warranty", "liability_limitation",
        "indemnification", "termination", "governing_law",
        "force_majeure", "ip_ownership",
    ],
    "Other": [
        "termination", "liability_limitation", "confidentiality",
        "governing_law", "payment_terms",
    ],
}

# Default expected protections when no type is specified
_DEFAULT_EXPECTED = [
    "termination", "liability_limitation", "confidentiality",
    "governing_law", "payment_terms", "indemnification",
]

# ── Suggested questions per clause type ──────────────────────────────

_QUESTIONS_FOR_FOUND: dict[str, list[str]] = {
    "termination": [
        "What is the minimum notice period required to terminate?",
        "Are there financial penalties for early termination?",
    ],
    "termination_for_cause": [
        "How is 'cause' defined — is there a cure period?",
        "Does the definition of material breach include subjective criteria?",
    ],
    "indemnification": [
        "Is the indemnification mutual or one-sided?",
        "Is there a cap on indemnification obligations?",
    ],
    "liability_limitation": [
        "What is the aggregate liability cap relative to the contract value?",
        "Are there carve-outs for gross negligence or willful misconduct?",
    ],
    "liability_exclusion": [
        "Does the exclusion cover data breach or IP infringement?",
    ],
    "auto_renewal": [
        "What is the opt-out window before auto-renewal?",
        "Can pricing change on renewal without consent?",
    ],
    "non_compete": [
        "What is the geographic scope and duration of the restriction?",
        "Is the scope reasonable relative to your industry?",
    ],
    "non_solicitation": [
        "Does the non-solicitation extend to passive sourcing or referrals?",
        "What is the duration and how are covered contacts defined?",
    ],
    "confidentiality": [
        "How long does the confidentiality obligation survive after termination?",
        "Are there exceptions for publicly available information?",
    ],
    "governing_law": [
        "Is the governing jurisdiction favorable to your organization?",
        "Is there a jury trial waiver?",
    ],
    "assignment": [
        "Can the agreement be assigned in an acquisition without consent?",
    ],
    "payment_terms": [
        "What are the late-fee provisions?",
        "Is there a right to dispute invoices?",
    ],
    "force_majeure": [
        "Does the force majeure clause cover pandemics and supply-chain disruptions?",
    ],
    "ip_ownership": [
        "Does the IP assignment include pre-existing work?",
        "Who owns derivative works created during the engagement?",
    ],
    "warranty": [
        "What is the warranty period and what remedies are available?",
        "Are there warranty disclaimers that limit your protections?",
    ],
    "arbitration": [
        "Is arbitration mandatory or optional?",
        "Does the clause preserve the right to seek injunctive relief in court?",
    ],
}

_QUESTIONS_FOR_MISSING: dict[str, str] = {
    "termination": "No termination clause detected — ask counsel how the contract can be ended and what happens to obligations post-termination.",
    "indemnification": "No indemnification clause found — ask counsel whether indemnification protection should be added.",
    "liability_limitation": "No liability cap detected — ask counsel about the maximum financial exposure under this agreement.",
    "auto_renewal": "No auto-renewal language found — confirm with counsel whether the contract renews automatically or requires affirmative renewal.",
    "non_compete": "No non-compete restriction detected — if relevant to your industry, confirm this is intentional.",
    "confidentiality": "No confidentiality clause found — if sensitive information will be exchanged, ask counsel about adding NDA protections.",
    "governing_law": "No governing law clause detected — ask counsel which jurisdiction governs this agreement.",
    "payment_terms": "No payment terms detected — ask counsel to clarify invoicing, net days, and late-fee provisions.",
    "ip_ownership": "No IP ownership clause found — if deliverables or creative work are involved, ask counsel who will own the output.",
    "force_majeure": "No force majeure clause detected — ask counsel whether performance obligations are excused during unforeseeable events.",
    "warranty": "No warranty clause found — ask counsel what representations or guarantees apply.",
    "assignment": "No assignment restriction found — the agreement may be freely assignable. Confirm with counsel.",
    "arbitration": "No dispute resolution clause detected — ask counsel whether disputes will be resolved in court, mediation, or arbitration.",
}


# ── Text extraction ─────────────────────────────────────────────────

def extract_text_from_bytes(content: bytes, filename: str) -> Optional[str]:
    """Best-effort text extraction. Returns None if format unsupported."""
    lower = filename.lower()

    # Plain text / markdown
    if lower.endswith(".txt") or lower.endswith(".md"):
        return content.decode("utf-8", errors="replace")

    # PDF via pdfplumber
    if lower.endswith(".pdf"):
        return _extract_pdf(content)

    # DOCX via python-docx
    if lower.endswith(".docx"):
        return _extract_docx(content)

    # Legacy .doc — no extraction support (binary Word format)
    if lower.endswith(".doc"):
        logger.info("Legacy .doc format — no text extraction available.")
        return None

    return None


def _extract_pdf(content: bytes) -> Optional[str]:
    """Extract text from a PDF using pdfplumber. Returns None on failure."""
    try:
        import io
        import pdfplumber

        pages_text = []
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)

        if not pages_text:
            logger.info("PDF opened but no text extracted (may be image-based).")
            return None

        combined = "\n\n".join(pages_text)
        logger.info("PDF extraction: %d pages, %d chars.", len(pages_text), len(combined))
        return combined

    except ImportError:
        logger.warning("pdfplumber not installed — PDF extraction unavailable.")
        return None
    except Exception as exc:
        logger.warning("PDF extraction failed: %s", exc)
        return None


def _extract_docx(content: bytes) -> Optional[str]:
    """Extract text from a DOCX using python-docx. Returns None on failure."""
    try:
        import io
        from docx import Document

        doc = Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]

        if not paragraphs:
            logger.info("DOCX opened but no text extracted.")
            return None

        combined = "\n".join(paragraphs)
        logger.info("DOCX extraction: %d paragraphs, %d chars.", len(paragraphs), len(combined))
        return combined

    except ImportError:
        logger.warning("python-docx not installed — DOCX extraction unavailable.")
        return None
    except Exception as exc:
        logger.warning("DOCX extraction failed: %s", exc)
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


# ── Phase 4B: Missing protections ────────────────────────────────────

def detect_missing_protections(
    clauses: list[dict],
    contract_type: str | None = None,
) -> list[dict]:
    """Identify expected protections not found in the document.

    Returns a list of dicts:
      { clause_type, label, severity, recommendation }
    """
    found_types = set(c["clause_type"] for c in clauses)

    expected = _EXPECTED_PROTECTIONS.get(
        contract_type or "", _DEFAULT_EXPECTED
    )

    # Friendly labels
    _labels = {
        "termination": "Termination Rights",
        "termination_for_cause": "Termination for Cause",
        "indemnification": "Indemnification",
        "liability_limitation": "Limitation of Liability",
        "liability_exclusion": "Consequential Damages Exclusion",
        "auto_renewal": "Auto-Renewal Protection",
        "non_compete": "Non-Compete Restriction",
        "non_solicitation": "Non-Solicitation",
        "confidentiality": "Confidentiality / NDA",
        "governing_law": "Governing Law & Jurisdiction",
        "assignment": "Assignment Restriction",
        "payment_terms": "Payment Terms",
        "force_majeure": "Force Majeure",
        "ip_ownership": "IP / Work Product Ownership",
        "warranty": "Warranty / Representations",
        "arbitration": "Dispute Resolution / Arbitration",
    }

    missing = []
    for ct in expected:
        if ct not in found_types:
            severity = "high" if ct in (
                "termination", "liability_limitation",
                "indemnification", "ip_ownership",
            ) else "medium"
            missing.append({
                "clause_type": ct,
                "label": _labels.get(ct, ct.replace("_", " ").title()),
                "severity": severity,
                "recommendation": _QUESTIONS_FOR_MISSING.get(
                    ct,
                    f"'{_labels.get(ct, ct)}' clause not detected. Consult counsel about adding this protection.",
                ),
            })

    return missing


# ── Phase 4B: Suggested questions for counsel ────────────────────────

def generate_suggested_questions(
    clauses: list[dict],
    missing_protections: list[dict],
) -> list[dict]:
    """Generate context-specific questions the client should ask their attorney.

    Returns a list of dicts:
      { category, question, context }
    """
    questions = []

    # Questions for FOUND clauses
    for clause in clauses:
        ct = clause["clause_type"]
        q_list = _QUESTIONS_FOR_FOUND.get(ct, [])
        for q in q_list:
            questions.append({
                "category": ct.replace("_", " ").title(),
                "question": q,
                "context": "found",
            })

    # Questions for MISSING protections
    for mp in missing_protections:
        questions.append({
            "category": mp["label"],
            "question": mp["recommendation"],
            "context": "missing",
        })

    return questions


# ── Phase 4B: Issue bucketing ────────────────────────────────────────

def generate_issue_buckets(
    clauses: list[dict],
    missing_protections: list[dict],
) -> list[dict]:
    """Group findings into priority buckets for the preliminary memo.

    Returns:
      [
        { bucket: "Immediate Attention", severity: "high", items: [...] },
        { bucket: "Review Recommended", severity: "medium", items: [...] },
        { bucket: "Standard Provisions", severity: "low", items: [...] },
      ]
    """
    high_items = []
    medium_items = []
    low_items = []

    # Bucket found clauses
    for clause in clauses:
        item = {
            "type": "clause_found",
            "clause_type": clause["clause_type"],
            "label": clause["clause_type"].replace("_", " ").title(),
            "excerpt": clause.get("text_excerpt", ""),
            "note": clause.get("note", ""),
            "confidence": clause.get("confidence", 0),
        }
        if clause["risk_level"] == "high_risk":
            high_items.append(item)
        elif clause["risk_level"] == "caution":
            medium_items.append(item)
        else:
            low_items.append(item)

    # Bucket missing protections
    for mp in missing_protections:
        item = {
            "type": "missing_protection",
            "clause_type": mp["clause_type"],
            "label": mp["label"],
            "excerpt": "",
            "note": mp["recommendation"],
            "confidence": 0,
        }
        if mp["severity"] == "high":
            high_items.append(item)
        else:
            medium_items.append(item)

    buckets = []
    if high_items:
        buckets.append({
            "bucket": "Immediate Attention",
            "severity": "high",
            "items": high_items,
        })
    if medium_items:
        buckets.append({
            "bucket": "Review Recommended",
            "severity": "medium",
            "items": medium_items,
        })
    if low_items:
        buckets.append({
            "bucket": "Standard Provisions",
            "severity": "low",
            "items": low_items,
        })

    return buckets
