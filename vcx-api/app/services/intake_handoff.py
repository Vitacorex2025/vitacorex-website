"""Phase 6B: Enhanced intake-handoff quality helpers.

Improves the accuracy and clarity of the chat-to-intake prefill without
changing the visual shell or adding new UI elements.

Functions:
  infer_urgency        -- derive urgency from timeline keywords
  extract_timeline     -- pull the first deadline / hearing mention
  extract_state        -- detect a US state if the session has none
  get_documents_for_handoff -- documents-needed list from structured blocks
  enhance_handoff      -- main enrichment entry-point called by the router
"""

from __future__ import annotations

import re
import urllib.parse
from typing import Optional


# ══════════════════════════════════════════════════════════════════════
#  Urgency inference
# ══════════════════════════════════════════════════════════════════════

_URGENT_RE = re.compile(
    r"\b("
    r"today|tomorrow|asap|immediately|emergency|urgent|"
    r"same.day|right\s+away|court\s+date\s+tomorrow|"
    r"hearing\s+tomorrow|filing\s+today|deadline\s+today"
    r")\b",
    re.IGNORECASE,
)

_SOON_RE = re.compile(
    r"\b("
    r"deadline|due\s+date|expires?|expiring|court\s+date|"
    r"hearing\s+date|filing\s+deadline|days?\s+left|"
    r"next\s+week|this\s+week|end\s+of\s+month|"
    r"running\s+out\s+of\s+time|time.sensitive|pressing"
    r")\b",
    re.IGNORECASE,
)


def infer_urgency(combined_text: str, current_urgency: str = "Standard") -> str:
    """Return a tighter urgency if user language signals a deadline."""
    if current_urgency not in ("Standard", ""):
        return current_urgency  # already non-default — respect it
    if _URGENT_RE.search(combined_text):
        return "Same day / urgent"
    if _SOON_RE.search(combined_text):
        return "48 hours"
    return "Standard"


# ══════════════════════════════════════════════════════════════════════
#  Timeline extraction
# ══════════════════════════════════════════════════════════════════════

_TIMELINE_RE = re.compile(
    r"(?:deadline|due\s+date|expires?|hearing|court\s+date|filing)[^.!?\n]{0,100}",
    re.IGNORECASE,
)


def extract_timeline(combined_text: str) -> Optional[str]:
    """Pull the first timeline-related phrase from user messages."""
    m = _TIMELINE_RE.search(combined_text)
    if m:
        snippet = m.group(0).strip()
        if len(snippet) > 120:
            snippet = snippet[:117] + "..."
        return snippet
    return None


# ══════════════════════════════════════════════════════════════════════
#  State extraction from free text
# ══════════════════════════════════════════════════════════════════════

_STATE_NAMES: dict[str, str] = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
    "california": "CA", "colorado": "CO", "connecticut": "CT",
    "delaware": "DE", "florida": "FL", "georgia": "GA", "hawaii": "HI",
    "idaho": "ID", "illinois": "IL", "indiana": "IN", "iowa": "IA",
    "kansas": "KS", "kentucky": "KY", "louisiana": "LA", "maine": "ME",
    "maryland": "MD", "massachusetts": "MA", "michigan": "MI",
    "minnesota": "MN", "mississippi": "MS", "missouri": "MO",
    "montana": "MT", "nebraska": "NE", "nevada": "NV",
    "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM",
    "new york": "NY", "north carolina": "NC", "north dakota": "ND",
    "ohio": "OH", "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA",
    "rhode island": "RI", "south carolina": "SC", "south dakota": "SD",
    "tennessee": "TN", "texas": "TX", "utah": "UT", "vermont": "VT",
    "virginia": "VA", "washington": "WA", "west virginia": "WV",
    "wisconsin": "WI", "wyoming": "WY", "district of columbia": "DC",
}

_STATE_ABBREVS = set(_STATE_NAMES.values())

_ABBREV_RE = re.compile(r"\b([A-Z]{2})\b")


def extract_state(combined_text: str, current_state: Optional[str]) -> Optional[str]:
    """Detect a US state from user messages when session state is empty."""
    if current_state:
        return current_state
    lower = combined_text.lower()
    # Check full state names first (more reliable)
    for name, abbr in _STATE_NAMES.items():
        if name in lower:
            return abbr
    # Fallback: standalone two-letter abbreviations
    for m in _ABBREV_RE.finditer(combined_text):
        if m.group(1) in _STATE_ABBREVS:
            return m.group(1)
    return None


# ══════════════════════════════════════════════════════════════════════
#  Documents-needed from structured blocks
# ══════════════════════════════════════════════════════════════════════

def get_documents_for_handoff(
    topic: Optional[str],
    case_type: Optional[str],
) -> list[str]:
    """Return the documents-needed list from Phase 5B structured blocks."""
    if not topic:
        return []
    try:
        from ..legal_chat.knowledge import get_structured_block
        block = get_structured_block(topic, case_type)
        return list(block.documents_needed) if block and block.documents_needed else []
    except Exception:
        return []


# ══════════════════════════════════════════════════════════════════════
#  Enhanced summary builder
# ══════════════════════════════════════════════════════════════════════

def build_enhanced_summary(
    topic_label: Optional[str],
    case_type: Optional[str],
    state: Optional[str],
    timeline: Optional[str],
    user_facts: list[str],
    session_id: str,
) -> str:
    """Compose a richer, section-based summary for the intake message field."""
    parts: list[str] = []

    if topic_label:
        line = f"Topic: {topic_label}"
        if case_type:
            line += f" ({case_type.replace('_', ' ').title()})"
        parts.append(line)

    if state:
        parts.append(f"Jurisdiction: {state}")

    if timeline:
        parts.append(f"Timeline note: {timeline}")

    if user_facts:
        parts.append("")
        parts.append("Key facts from conversation:")
        for fact in user_facts[-8:]:
            truncated = fact[:120].strip()
            if len(fact) > 120:
                truncated += "..."
            parts.append(f"  - {truncated}")

    parts.append(f"\nChat reference: {session_id}")
    summary = "\n".join(parts)

    if len(summary) > 500:
        summary = summary[:497] + "..."
    return summary


# ══════════════════════════════════════════════════════════════════════
#  Main entry-point — enrich an IntakeHandoffResponse
# ══════════════════════════════════════════════════════════════════════

def enhance_handoff(session_id: str, resp: "IntakeHandoffResponse") -> "IntakeHandoffResponse":
    """Phase 6B: Enrich a Phase 6A handoff with better field inference.

    Reads user messages from the session and improves:
      - urgency (from timeline keywords)
      - state (extracted from message text when missing)
      - summary (richer, with timeline and case-type sections)
      - doc_hint (includes documents-needed list from structured blocks)
      - prefill_url (carries all enriched params + new extras)

    The returned IntakeHandoffResponse replaces the original.
    """
    from ..db import get_session, list_recent_messages
    from ..legal_chat.knowledge import detect_case_type
    from ..legal_chat.policy import ALLOWED_TOPICS
    from ..models.chat import IntakeHandoffResponse

    # ── Retrieve user messages ────────────────────────────────────
    messages = list_recent_messages(session_id, limit=50)
    user_messages = [m["content"] for m in messages if m["role"] == "user"]
    combined = " ".join(user_messages)

    session = get_session(session_id)
    topic = (session.get("topic") if session else None) or resp.topic

    # ── Detect case type ──────────────────────────────────────────
    case_type = detect_case_type(topic, combined) if topic else None

    # ── Better state ──────────────────────────────────────────────
    state = extract_state(combined, resp.state)

    # ── Better urgency ────────────────────────────────────────────
    urgency = infer_urgency(combined, resp.urgency)

    # ── Timeline extraction ───────────────────────────────────────
    timeline = extract_timeline(combined)

    # ── Documents list ────────────────────────────────────────────
    docs = get_documents_for_handoff(topic, case_type)

    # ── Enhanced doc hint ─────────────────────────────────────────
    doc_hint = resp.doc_hint
    if docs and not doc_hint:
        doc_hint = "Documents to prepare: " + "; ".join(docs[:3])
    elif docs and doc_hint:
        extras = [d for d in docs[:3] if d.lower()[:20] not in (doc_hint or "").lower()]
        if extras:
            doc_hint = doc_hint + ". Also prepare: " + "; ".join(extras[:2])

    if doc_hint and len(doc_hint) > 200:
        doc_hint = doc_hint[:197] + "..."

    # ── Enhanced summary ──────────────────────────────────────────
    topic_label: str | None = None
    if topic:
        topic_label = ALLOWED_TOPICS.get(topic, topic)

    summary = build_enhanced_summary(
        topic_label=topic_label,
        case_type=case_type,
        state=state,
        timeline=timeline,
        user_facts=user_messages,
        session_id=session_id,
    )

    # ── Rebuild prefill URL with enriched params ──────────────────
    params: dict[str, str] = {"vcx_from": "chat", "vcx_session": session_id}
    if resp.name:
        params["vcx_name"] = resp.name
    if resp.email:
        params["vcx_email"] = resp.email
    if resp.phone:
        params["vcx_phone"] = resp.phone
    if topic:
        params["vcx_topic"] = topic
    if resp.service_type:
        params["vcx_service"] = resp.service_type
    if state:
        params["vcx_state"] = state
    if urgency:
        params["vcx_urgency"] = urgency
    if summary:
        params["vcx_summary"] = summary
    if resp.recommended_next_step:
        params["vcx_next_step"] = resp.recommended_next_step
    # Phase 6B extras
    if case_type:
        params["vcx_case_type"] = case_type.replace("_", " ").title()
    if timeline:
        params["vcx_timeline"] = timeline
    if doc_hint:
        params["vcx_doc_hint"] = doc_hint
    if docs:
        params["vcx_docs_needed"] = "|".join(docs[:6])

    prefill_url = "/structured-case-intake.html?" + urllib.parse.urlencode(params)

    return IntakeHandoffResponse(
        session_id=session_id,
        name=resp.name,
        email=resp.email,
        phone=resp.phone,
        topic=topic,
        service_type=resp.service_type,
        state=state,
        urgency=urgency,
        summary=summary,
        doc_hint=doc_hint,
        recommended_next_step=resp.recommended_next_step,
        prefill_url=prefill_url,
    )
