"""Policy engine for the legal assistant — controls what the assistant can answer.

Phase 1: Initial topic routing + out-of-scope detection.
Phase 4C: Tighter routing, escalation links, event typing,
          stronger unsupported-topic handling.

All responses are retrieval-based. No generative or LLM output.
"""
from __future__ import annotations

from typing import Optional

from .knowledge import (
    detect_out_of_scope,
    get_product_routes,
    infer_topic,
    retrieve,
    summarize_chunks,
    topic_needs_state,
    DEFAULT_PRODUCT_ROUTES,
)
from ..models.chat import ChatResponse

ALLOWED_TOPICS = {
    "contracts": "contracts and document questions",
    "immigration_packets": "immigration packet organization",
    "auto_deal_review": "auto deal fee and payment review",
    "florida_official_sources": "Florida official source routing",
}

TOPIC_SUGGESTIONS = {
    "contracts": [
        "What clause should I review before signing?",
        "What documents should I upload for contract review?",
        "What are common renewal and termination issues?",
    ],
    "immigration_packets": [
        "Which evidence categories usually belong in a packet?",
        "How should I organize forms and supporting records?",
        "What should I check before asking for review?",
    ],
    "auto_deal_review": [
        "How do I verify APR and monthly payment?",
        "Which fees should I question before signing?",
        "What numbers should I collect from the dealer sheet?",
    ],
    "florida_official_sources": [
        "Where do I check a Florida traffic citation?",
        "Which portal should I use for toll issues?",
        "Where do I find Florida court or PACER links?",
    ],
}

DEFAULT_SUGGESTIONS = [
    "Contract review question",
    "Immigration packet question",
    "Auto deal question",
    "Florida portal question",
]

# Phase 4C: Narrow-scope disclaimer appended to every answered response
_DISCLAIMER = (
    "\n\nThis is general information and workflow guidance only. It is not legal "
    "representation, not attorney-client advice, and not a substitute for licensed "
    "counsel. VitaCoreX LLC is not a law firm."
)

# Phase 4C: Strong boundary message for out-of-scope
_OUT_OF_SCOPE_ANSWER = (
    "This assistant is intentionally limited to four narrow topics: contracts, "
    "immigration packet organization, auto deal review, and Florida official-source "
    "routing.\n\n"
    "I cannot help with emergency matters, court strategy, criminal cases, family "
    "law, eviction, litigation, personal injury, estate disputes, tax questions, "
    "or any matter requiring legal representation.\n\n"
    "For private review of your specific situation, please use one of these options:"
)

# Phase 4C: Message when no topic is detected
_NO_TOPIC_ANSWER = (
    "I can only help with these four specific areas:\n\n"
    "1. Contracts — clause review, document checklists, signing questions\n"
    "2. Immigration packets — form organization, evidence categories, filing prep\n"
    "3. Auto deal review — fee verification, APR check, dealer sheet review\n"
    "4. Florida official sources — toll portals, traffic citations, court records\n\n"
    "Please select a topic or rephrase your question to match one of these areas. "
    "If your question falls outside these topics, use Structured Intake for private review."
)


def answer_message(
    message: str,
    topic: Optional[str],
    state: Optional[str],
    session_id: str,
) -> ChatResponse:
    """Process a user message and return a controlled response.

    Phase 4C: Every response now includes:
      - event_type for logging
      - escalation_links for product routing
      - Stronger boundary enforcement
    """
    # ── 1. Out-of-scope gate (highest priority) ──────────────────────
    if detect_out_of_scope(message):
        return ChatResponse(
            session_id=session_id,
            answer=_OUT_OF_SCOPE_ANSWER,
            status="out_of_scope",
            event_type="out_of_scope",
            next_step="Use Structured Intake or request a private consultation.",
            suggestions=["Open Structured Intake", "Request private consultation"],
            escalation_links=DEFAULT_PRODUCT_ROUTES,
        )

    # ── 2. Topic detection ───────────────────────────────────────────
    chosen_topic = topic or infer_topic(message)

    if not chosen_topic:
        return ChatResponse(
            session_id=session_id,
            answer=_NO_TOPIC_ANSWER,
            status="no_topic",
            event_type="no_topic",
            suggestions=DEFAULT_SUGGESTIONS,
            escalation_links=DEFAULT_PRODUCT_ROUTES,
        )

    # Validate topic is in the allowed set
    if chosen_topic not in ALLOWED_TOPICS:
        return ChatResponse(
            session_id=session_id,
            answer=_NO_TOPIC_ANSWER,
            status="no_topic",
            event_type="invalid_topic",
            suggestions=DEFAULT_SUGGESTIONS,
            escalation_links=DEFAULT_PRODUCT_ROUTES,
        )

    # ── 3. State/jurisdiction gate ───────────────────────────────────
    if topic_needs_state(chosen_topic) and not state:
        return ChatResponse(
            session_id=session_id,
            topic=chosen_topic,
            answer=(
                "Before I answer, tell me the state or jurisdiction connected to "
                "this matter. That keeps the routing cleaner and avoids generic "
                "answers where local rules or portals may differ."
            ),
            status="need_more_info",
            event_type="need_state",
            suggestions=["Florida", "California", "New York", "Texas"],
            escalation_links=get_product_routes(chosen_topic),
        )

    # ── 4. Knowledge retrieval ───────────────────────────────────────
    chunks = retrieve(chosen_topic, message, limit=4)
    bullets, sources = summarize_chunks(chunks)

    # No matching knowledge blocks → escalate to product
    if not bullets:
        return ChatResponse(
            session_id=session_id,
            topic=chosen_topic,
            state=state,
            answer=(
                f"I can help with {ALLOWED_TOPICS[chosen_topic]}, but I do not "
                f"have an approved answer block for that exact question yet.\n\n"
                f"To get a reviewed response based on your documents, use one of "
                f"the options below."
            ),
            status="escalate",
            event_type="no_knowledge_match",
            next_step="Route to structured intake or document review.",
            suggestions=TOPIC_SUGGESTIONS[chosen_topic],
            sources=sources,
            escalation_links=get_product_routes(chosen_topic),
        )

    # ── 5. Controlled answer with disclaimer ─────────────────────────
    preface = {
        "contracts": "Here is a controlled first-pass answer for a contract/document question.",
        "immigration_packets": "Here is a controlled first-pass answer for packet organization.",
        "auto_deal_review": "Here is a controlled first-pass answer for an auto deal review question.",
        "florida_official_sources": "Here is a controlled first-pass routing answer for a Florida official source question.",
    }[chosen_topic]

    body = "\n".join(f"- {bullet}" for bullet in bullets)

    next_step = {
        "contracts": "Upload your contract to the Contract Scanner for clause-level analysis, or submit to Structured Intake for advisor review.",
        "immigration_packets": "Submit your packet to Structured Intake for advisor review and organization feedback.",
        "auto_deal_review": "Submit your deal sheet to Structured Intake for fee and payment verification.",
        "florida_official_sources": "If you need help beyond portal routing, submit to Structured Intake.",
    }[chosen_topic]

    return ChatResponse(
        session_id=session_id,
        topic=chosen_topic,
        state=state,
        answer=f"{preface}\n\n{body}{_DISCLAIMER}",
        status="answered",
        event_type="answered",
        next_step=next_step,
        suggestions=TOPIC_SUGGESTIONS[chosen_topic],
        sources=sources,
        escalation_links=get_product_routes(chosen_topic),
    )
