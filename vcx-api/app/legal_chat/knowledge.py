"""Knowledge retrieval and topic classification for the legal assistant.

Phase 1: Initial knowledge base with 4 topics.
Phase 4C: Expanded out-of-scope detection, escalation triggers,
          topic-to-product routing map.

All responses are knowledge-retrieval, NOT generative.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Optional

KB_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge"


@dataclass
class Chunk:
    topic: str
    title: str
    text: str
    source: str


TOPIC_KEYWORDS = {
    "contracts": {
        "contract", "agreement", "clause", "terms", "terminate", "termination",
        "renewal", "fee", "liability", "indemnity", "nda", "vendor", "client",
        "signing", "sign", "negotiate", "breach", "penalty", "non-compete",
        "confidentiality", "warranty", "amendment", "addendum",
    },
    "immigration_packets": {
        "uscis", "i-130", "i-485", "i-765", "packet", "evidence", "rfe",
        "immigration", "biometrics", "affidavit", "sponsor", "petition",
        "green card", "visa", "naturalization", "i-140", "i-129", "i-20",
        "form", "filing", "supporting documents",
    },
    "auto_deal_review": {
        "dealer", "apr", "monthly", "doc fee", "warranty", "gap", "financing",
        "auto", "car", "vehicle", "loan", "payment", "trade-in",
        "buyer's order", "installment", "lease", "down payment", "add-on",
        "service contract", "dealer fee",
    },
    "florida_official_sources": {
        "sunpass", "toll", "citation", "traffic", "clerk", "florida", "court",
        "county", "pacer", "record", "portal", "dmv", "tag", "registration",
        "title", "license", "hsmv", "sunbiz",
    },
}

# ── Phase 4C: Comprehensive out-of-scope detection ──────────────────

OUT_OF_SCOPE_KEYWORDS = {
    # Criminal / emergency
    "criminal", "arrest", "arrested", "jail", "prison", "felony", "misdemeanor",
    "bail", "bond hearing", "probation violation", "parole",
    # Family / domestic
    "custody", "divorce", "child support", "alimony", "domestic violence",
    "restraining order", "protective order", "adoption",
    # Housing
    "eviction", "landlord tenant", "unlawful detainer", "rent dispute",
    # Financial
    "bankruptcy", "chapter 7", "chapter 13", "foreclosure", "debt collection lawsuit",
    # Immigration emergencies
    "asylum emergency", "deportation emergency", "removal proceedings",
    "detained by ice", "immigration court hearing",
    # Litigation
    "appeal deadline", "injunction", "sue", "lawsuit strategy", "trial",
    "hearing tomorrow", "court date", "deposition", "discovery",
    "motion to dismiss", "summary judgment", "class action",
    # Medical / personal injury
    "medical malpractice", "personal injury", "wrongful death", "slip and fall",
    # Estate / tax
    "estate planning", "will contest", "probate litigation", "tax evasion",
    # Employment litigation
    "wrongful termination lawsuit", "discrimination claim", "eeoc charge",
    "harassment complaint", "workers comp appeal",
    # General legal advice
    "should i sue", "can i sue", "what are my legal rights",
    "do i have a case", "am i liable", "legal strategy",
    "represent me", "be my lawyer", "need a lawyer",
    "legal representation", "attorney-client",
}

# ── Phase 4C: Phrases that indicate user wants general legal advice ──

_ADVICE_SEEKING_PATTERNS = [
    re.compile(r"(?:should|can|could)\s+i\s+(?:sue|file|take\s+legal\s+action)", re.IGNORECASE),
    re.compile(r"(?:what\s+are|do\s+i\s+have)\s+(?:my\s+)?(?:legal\s+)?rights", re.IGNORECASE),
    re.compile(r"(?:am\s+i|is\s+this)\s+(?:legally?\s+)?(?:liable|responsible|at\s+fault)", re.IGNORECASE),
    re.compile(r"(?:give|provide)\s+(?:me\s+)?(?:legal\s+)?advice", re.IGNORECASE),
    re.compile(r"what\s+(?:should|would)\s+(?:a\s+)?(?:lawyer|attorney)\s+(?:say|do|recommend)", re.IGNORECASE),
    re.compile(r"(?:represent|defend)\s+me", re.IGNORECASE),
]

REQUIRES_STATE = {"contracts", "auto_deal_review", "florida_official_sources"}

# ── Phase 4C: Product routing map ────────────────────────────────────
# Maps topics to the VCX products/pages they should route into.

TOPIC_PRODUCT_ROUTES: dict[str, list[dict[str, str]]] = {
    "contracts": [
        {"label": "Open Contract Scanner", "url": "/app/contract-intelligence/", "description": "Upload a contract for automated clause detection and risk scoring."},
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=contract-review", "description": "Request a reviewed response from an advisor."},
    ],
    "immigration_packets": [
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=immigration-packets", "description": "Request packet review from an advisor."},
    ],
    "auto_deal_review": [
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=auto-deal-review", "description": "Submit your deal sheet for advisor review."},
    ],
    "florida_official_sources": [
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=florida-sources", "description": "Request help finding the right official portal."},
    ],
}

# Default routes for out-of-scope or unmatched topics
DEFAULT_PRODUCT_ROUTES = [
    {"label": "Open Structured Intake", "url": "/structured-case-intake.html", "description": "Submit your matter for private advisor review."},
    {"label": "Request Private Consultation", "url": "/contact.html", "description": "Schedule a confidential consultation call."},
    {"label": "Sign In to Client Portal", "url": "/app/sign-in/", "description": "Access your existing matter through the Packet Room."},
]


def _normalize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9\-']+", text.lower())


def _load_chunks() -> list[Chunk]:
    chunks: list[Chunk] = []
    if not KB_DIR.exists():
        return chunks

    for path in sorted(KB_DIR.glob("*.md")):
        topic = path.stem
        raw = path.read_text(encoding="utf-8")
        parts = re.split(r"^##\s+", raw, flags=re.MULTILINE)
        if not parts:
            continue

        preface = parts[0].strip()
        if preface:
            chunks.append(Chunk(topic=topic, title="Overview", text=preface, source=path.name))

        for part in parts[1:]:
            lines = part.strip().splitlines()
            if not lines:
                continue
            title = lines[0].strip()
            text = "\n".join(lines[1:]).strip()
            if text:
                chunks.append(Chunk(topic=topic, title=title, text=text, source=path.name))
    return chunks


CHUNKS = _load_chunks()


def detect_out_of_scope(message: str) -> bool:
    """Check if the message asks about topics this assistant cannot handle."""
    lower = message.lower()
    # Keyword match
    if any(keyword in lower for keyword in OUT_OF_SCOPE_KEYWORDS):
        return True
    # Pattern match (advice-seeking phrases)
    if any(pattern.search(message) for pattern in _ADVICE_SEEKING_PATTERNS):
        return True
    return False


def infer_topic(message: str) -> Optional[str]:
    tokens = set(_normalize(message))
    best_topic = None
    best_score = 0
    for topic, keywords in TOPIC_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in message.lower() or kw in tokens)
        if score > best_score:
            best_topic = topic
            best_score = score
    return best_topic if best_score >= 2 else None


def topic_needs_state(topic: Optional[str]) -> bool:
    return topic in REQUIRES_STATE


def retrieve(topic: str, message: str, limit: int = 4) -> list[Chunk]:
    tokens = set(_normalize(message))
    scored: list[tuple[int, Chunk]] = []
    for chunk in CHUNKS:
        if chunk.topic != topic:
            continue
        haystack = f"{chunk.title}\n{chunk.text}".lower()
        score = sum(1 for token in tokens if token in haystack)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]


def summarize_chunks(chunks: Iterable[Chunk]) -> tuple[list[str], list[str]]:
    bullets: list[str] = []
    sources: list[str] = []
    for chunk in chunks:
        first_sentences = re.split(r"(?<=[.!?])\s+", chunk.text.strip())
        snippet = " ".join(first_sentences[:2]).strip()
        bullets.append(f"{chunk.title}: {snippet}")
        if chunk.source not in sources:
            sources.append(chunk.source)
    return bullets, sources


def get_product_routes(topic: Optional[str]) -> list[dict[str, str]]:
    """Return the product routing links for a given topic."""
    if topic and topic in TOPIC_PRODUCT_ROUTES:
        return TOPIC_PRODUCT_ROUTES[topic]
    return DEFAULT_PRODUCT_ROUTES
