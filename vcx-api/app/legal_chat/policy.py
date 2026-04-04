"""Policy engine for the assistant — controls routing and response behavior.

Phase 1: Initial topic routing + out-of-scope detection.
Phase 4C: Tighter routing, escalation links, event typing.
Phase 5A: Three-mode architecture (general_chat, legal_information, vcx_routing).
Phase 5B: Structured legal responses.
Phase 9: LLM-powered conversational AI with rule-based fallback.
"""
from __future__ import annotations

import logging
from typing import Optional

from . import llm

from .knowledge import (
    detect_case_type,
    detect_high_risk,
    detect_mode,
    get_escalation_paths,
    get_fact_gathering_questions,
    get_product_routes,
    get_structured_block,
    infer_topic,
    retrieve,
    summarize_chunks,
    topic_needs_state,
    DEFAULT_PRODUCT_ROUTES,
    VCX_SERVICE_ROUTES,
    LEGAL_BROAD_KEYWORDS,
)
from ..models.chat import ChatResponse

# ══════════════════════════════════════════════════════════════════════
#  Core topic definitions
# ══════════════════════════════════════════════════════════════════════

ALLOWED_TOPICS = {
    "contracts": "contracts and document questions",
    "immigration_packets": "immigration packet organization",
    "auto_deal_review": "auto deal fee and payment review",
    "florida_official_sources": "Florida official source routing",
}

TOPIC_SUGGESTIONS = {
    "contracts": [
        "What clauses should I review before signing?",
        "What documents should I upload for contract review?",
        "I have an employment agreement to review",
        "Check my NDA for red flags",
    ],
    "immigration_packets": [
        "What evidence goes in an I-130 packet?",
        "How should I organize my immigration forms?",
        "I received an RFE, what do I do?",
        "What documents do I need for adjustment of status?",
    ],
    "auto_deal_review": [
        "How do I verify the APR on my deal?",
        "Which dealer fees should I question?",
        "Is this lease deal fair?",
        "What should I check on the buyer's order?",
    ],
    "florida_official_sources": [
        "How do I pay a Florida traffic citation?",
        "Where do I check SunPass toll invoices?",
        "How do I look up a court case in Florida?",
        "Where is the Florida DMV registration portal?",
    ],
}

DEFAULT_SUGGESTIONS = [
    "Contract review question",
    "Immigration packet question",
    "Auto deal question",
    "Florida portal question",
]

# ══════════════════════════════════════════════════════════════════════
#  Response templates
# ══════════════════════════════════════════════════════════════════════

_DISCLAIMER = (
    "\n\n---\n"
    "This is general information and workflow guidance only. It is not legal "
    "representation, not attorney-client advice, and not a substitute for licensed "
    "counsel. VitaCoreX LLC is not a law firm."
)

_HIGH_RISK_ANSWER = (
    "This type of matter requires professional review and cannot be handled "
    "through this assistant.\n\n"
    "This includes emergency deadlines, criminal matters, court strategy, "
    "family law emergencies, deportation emergencies, and any request for "
    "legal representation.\n\n"
    "Please use one of the options below to connect with a reviewer:"
)

_LEGAL_DRIFT_NOTICE = (
    "\n\nI notice this touches on a legal topic. For legal questions, I can "
    "provide structured information, issue spotting, and checklists -- just "
    "ask directly. For document-specific review, use Structured Intake."
)

_VCX_ROUTING_ANSWER = (
    "Here are the VitaCoreX services that may help:\n\n"
    "- **Structured Case Intake** -- Submit a new matter for review and triage\n"
    "- **Contract Intelligence** -- Upload contracts for automated clause detection\n"
    "- **Contract Review Desk** -- Full contract review with advisor feedback\n"
    "- **Recovery Pilot Studio** -- Model revenue recovery scenarios\n"
    "- **Packet Room / Client Portal** -- Access your matter timeline and documents\n"
    "- **Legal Assistant** -- First-pass legal information and workflow guidance\n\n"
    "Select a service below or describe what you need help with."
)

_GENERAL_GREETINGS = {
    "hello", "hi", "hey", "good morning", "good afternoon", "good evening",
    "howdy", "what's up", "whats up", "sup", "yo", "greetings",
}

_GENERAL_GREETING_RESPONSE = (
    "Hello! I'm the VitaCoreX assistant. I can help with:\n\n"
    "- General questions and conversation\n"
    "- Legal topic information (contracts, immigration, auto deals, Florida portals)\n"
    "- Navigating VitaCoreX services and tools\n\n"
    "What can I help you with today?"
)

_GENERAL_CHAT_RESPONSE = (
    "I'm happy to help with general questions. While I'm best at legal "
    "topic information and VitaCoreX service routing, I can chat about "
    "other topics too.\n\n"
    "If you have a legal question, I can provide structured information, "
    "issue spotting, and preparation checklists. Just ask!"
)

_BROAD_LEGAL_ANSWER = (
    "I can see this is a legal topic. While my deepest knowledge covers "
    "contracts, immigration packets, auto deal review, and Florida portal "
    "routing, I can help with initial issue spotting on broader topics.\n\n"
    "Important: I provide general information only, not legal advice. For "
    "document-specific review or strategy, please use Structured Intake."
)


# ══════════════════════════════════════════════════════════════════════
#  Formatting helpers (Phase 5B)
# ══════════════════════════════════════════════════════════════════════

def _format_structured_block(topic: str, case_type: Optional[str], kb_bullets: list[str]) -> str:
    """Build a structured response with what-matters / what-to-check / documents sections.

    Phase 5B: Makes legal answers more structured without expanding promises.
    """
    block = get_structured_block(topic, case_type)
    parts: list[str] = []

    type_label = case_type.replace("_", " ").title() if case_type else None
    if type_label:
        parts.append(f"Detected case type: {type_label}\n")

    # Knowledge base findings first (if any)
    if kb_bullets:
        parts.append("Based on your question, here is what I found:\n")
        for bullet in kb_bullets:
            parts.append(f"  - {bullet}")
        parts.append("")

    # What matters
    if block.what_matters:
        parts.append("WHAT MATTERS in this type of matter:\n")
        for i, item in enumerate(block.what_matters, 1):
            parts.append(f"  {i}. {item}")
        parts.append("")

    # What to check
    if block.what_to_check:
        parts.append("WHAT TO CHECK:\n")
        for i, item in enumerate(block.what_to_check, 1):
            parts.append(f"  {i}. {item}")
        parts.append("")

    # Documents needed
    if block.documents_needed:
        parts.append("WHAT DOCUMENTS ARE NEEDED:\n")
        for i, item in enumerate(block.documents_needed, 1):
            parts.append(f"  {i}. {item}")
        parts.append("")

    return "\n".join(parts)


def _format_fact_gathering(topic: str) -> str:
    """Build a structured fact-gathering question sequence.

    Phase 5B: Ordered questions (jurisdiction -> case type -> timeline -> specifics).
    Each question includes a reason so the user understands why it matters.
    """
    questions = get_fact_gathering_questions(topic)
    if not questions:
        return ""

    parts = ["To give you the most useful information, I need to gather some facts:\n"]
    for i, q in enumerate(questions, 1):
        parts.append(f"  {i}. {q['question']}")
        parts.append(f"     (Why: {q['why']})")
    parts.append("")
    parts.append("Please answer as many of these as you can, and I will tailor the response.")
    return "\n".join(parts)


def _format_escalation_section(topic: str) -> str:
    """Build an escalation section with context-aware service descriptions."""
    paths = get_escalation_paths(topic)
    if not paths:
        return ""

    parts = ["\nREADY FOR NEXT STEPS? Here are your options:\n"]
    for path in paths:
        when = f" -- {path['when']}" if path.get("when") else ""
        parts.append(f"  -> {path['label']}: {path['description']}{when}")
    return "\n".join(parts)


# ══════════════════════════════════════════════════════════════════════
#  Main entry point
# ══════════════════════════════════════════════════════════════════════

_logger = logging.getLogger("vcx.policy")


def _try_llm_response(
    message: str,
    topic: Optional[str],
    state: Optional[str],
    session_id: str,
) -> Optional[ChatResponse]:
    """Attempt to get an LLM-powered response.

    Phase 9: If OPENAI_API_KEY is set, use GPT for conversational answers.
    Returns None if LLM is unavailable, allowing fallback to rule-based.
    """
    if not llm.is_available():
        return None

    try:
        # Get recent conversation history from DB
        from ..db import list_recent_messages
        raw_history = list_recent_messages(session_id, limit=10)
        history = []
        for msg in raw_history:
            role = msg.get("role", "")
            if role == "user":
                history.append({"role": "user", "content": msg.get("content", "")})
            elif role == "assistant":
                history.append({"role": "assistant", "content": msg.get("content", "")})

        ai_answer = llm.chat_completion(
            message=message,
            history=history,
            topic=topic,
            state=state,
        )
        if ai_answer:
            # Detect topic for suggestions
            detected_topic = topic or infer_topic(message)
            suggestions = TOPIC_SUGGESTIONS.get(detected_topic, [
                "Tell me about your services",
                "I need help with a contract",
                "Help me organize immigration documents",
                "Check my auto deal",
            ])
            return ChatResponse(
                session_id=session_id,
                topic=detected_topic,
                state=state,
                mode="general_chat",
                answer=ai_answer,
                status="answered",
                event_type="llm_response",
                suggestions=suggestions[:4],
                escalation_links=get_product_routes(detected_topic) if detected_topic else DEFAULT_PRODUCT_ROUTES,
            )
    except Exception as exc:
        _logger.warning("LLM response failed, falling back to rules: %s", exc)

    return None


def answer_message(
    message: str,
    topic: Optional[str],
    state: Optional[str],
    session_id: str,
) -> ChatResponse:
    """Process a user message and return a response.

    Phase 9: Tries LLM first (if configured), falls back to rule-based.
    High-risk messages always go through the rule-based safety handler.
    """
    mode = detect_mode(message, current_topic=topic)

    # Safety: high-risk always uses deterministic handler
    if mode == "high_risk":
        return _handle_high_risk(session_id)

    # Phase 9: Try LLM-powered response first
    llm_response = _try_llm_response(message, topic, state, session_id)
    if llm_response:
        return llm_response

    # Fallback: rule-based responses
    if mode == "vcx_routing":
        return _handle_vcx_routing(message, session_id)
    if mode == "legal_information":
        return _handle_legal(message, topic, state, session_id)
    return _handle_general_chat(message, session_id)


# ══════════════════════════════════════════════════════════════════════
#  Mode handlers
# ══════════════════════════════════════════════════════════════════════

def _handle_high_risk(session_id: str) -> ChatResponse:
    return ChatResponse(
        session_id=session_id,
        answer=_HIGH_RISK_ANSWER,
        mode="high_risk",
        status="escalate",
        event_type="high_risk_escalation",
        next_step="Use Structured Intake or request a private consultation.",
        suggestions=["Open Structured Intake", "Request private consultation"],
        escalation_links=DEFAULT_PRODUCT_ROUTES,
    )


def _handle_vcx_routing(message: str, session_id: str) -> ChatResponse:
    lower = message.lower()
    specific_routes = []
    if any(kw in lower for kw in ("contract", "clause", "nda", "agreement")):
        specific_routes = [
            {"label": "Contract Intelligence", "url": "/app/contract-intelligence/", "description": "Upload contracts for automated clause detection and risk scoring."},
            {"label": "Contract Review Desk", "url": "/app/vcx-contract-review/", "description": "Full contract review with advisor feedback."},
        ]
    elif any(kw in lower for kw in ("recovery", "revenue", "ar ", "receivable")):
        specific_routes = [
            {"label": "Recovery Pilot Studio", "url": "/app/vcx-recovery-pilot/", "description": "Model revenue recovery scenarios and generate briefs."},
        ]
    elif any(kw in lower for kw in ("packet", "portal", "matter", "document", "my case")):
        specific_routes = [
            {"label": "Packet Room / Client Portal", "url": "/app/vcx-packet-room/", "description": "Access your matter timeline, documents, and deliverables."},
            {"label": "Sign In", "url": "/app/sign-in/", "description": "Sign in to access your existing matter."},
        ]
    elif any(kw in lower for kw in ("intake", "submit", "new matter", "new case")):
        specific_routes = [
            {"label": "Structured Case Intake", "url": "/structured-case-intake.html", "description": "Submit a new matter for review and triage."},
        ]
    elif any(kw in lower for kw in ("sign in", "sign-in", "login", "log in")):
        specific_routes = [
            {"label": "Sign In", "url": "/app/sign-in/", "description": "Sign in to access your existing matter."},
        ]

    routes = specific_routes if specific_routes else VCX_SERVICE_ROUTES
    return ChatResponse(
        session_id=session_id,
        answer=_VCX_ROUTING_ANSWER,
        mode="vcx_routing",
        status="answered",
        event_type="vcx_routing",
        next_step="Select a service or describe what you need.",
        suggestions=["Submit a new matter", "Review a contract", "Check my case status", "Revenue recovery analysis"],
        escalation_links=routes,
    )


def _handle_legal(
    message: str,
    topic: Optional[str],
    state: Optional[str],
    session_id: str,
) -> ChatResponse:
    """Handle legal information mode with structured responses.

    Phase 5B: Responses now include:
      - Case-type detection (employment, NDA, lease, etc.)
      - Structured blocks (what matters / what to check / documents needed)
      - Fact-gathering question sequences
      - Context-aware escalation paths
      - NEVER gives final legal conclusions
    """
    chosen_topic = topic or infer_topic(message)

    # ── Broad legal topic (outside core 4) ─────────────────────────
    if not chosen_topic or chosen_topic not in ALLOWED_TOPICS:
        return _handle_broad_legal(message, session_id)

    # ── Phase 5B: Detect case type ─────────────────────────────────
    case_type = detect_case_type(chosen_topic, message)

    # ── Phase 5B: Jurisdiction + case-type gathering ───────────────
    # Ask for facts if we don't have state AND message is short / vague
    if topic_needs_state(chosen_topic) and not state:
        return _handle_fact_gathering(chosen_topic, case_type, session_id)

    # ── Knowledge retrieval ────────────────────────────────────────
    chunks = retrieve(chosen_topic, message, limit=4)
    bullets, sources = summarize_chunks(chunks)

    # ── Phase 5B: Build structured response ────────────────────────
    structured = _format_structured_block(chosen_topic, case_type, bullets)
    escalation = _format_escalation_section(chosen_topic)

    # Combine
    answer = f"{structured}{escalation}{_DISCLAIMER}"

    # Escalation links for UI cards
    esc_links = get_product_routes(chosen_topic)

    return ChatResponse(
        session_id=session_id,
        topic=chosen_topic,
        state=state,
        mode="legal_information",
        answer=answer,
        status="answered",
        event_type="answered",
        next_step=_next_step_for_topic(chosen_topic),
        suggestions=TOPIC_SUGGESTIONS.get(chosen_topic, DEFAULT_SUGGESTIONS),
        sources=sources,
        escalation_links=esc_links,
    )


def _handle_fact_gathering(
    topic: str,
    case_type: Optional[str],
    session_id: str,
) -> ChatResponse:
    """Prompt the user with a structured fact-gathering sequence.

    Phase 5B: Ordered questions for jurisdiction, case type, timeline, specifics.
    Each question includes a reason so the user knows why it matters.
    """
    questions_text = _format_fact_gathering(topic)

    # If we detected a case type, acknowledge it
    type_note = ""
    if case_type:
        label = case_type.replace("_", " ").title()
        type_note = f"It looks like this involves a {label} matter. "

    answer = (
        f"{type_note}Before I provide structured information, I need to gather "
        f"some facts to make sure the response is relevant to your situation.\n\n"
        f"{questions_text}{_DISCLAIMER}"
    )

    return ChatResponse(
        session_id=session_id,
        topic=topic,
        mode="legal_information",
        answer=answer,
        status="need_more_info",
        event_type="fact_gathering",
        next_step="Answer the questions above, then I will provide a structured response.",
        suggestions=["Florida", "California", "New York", "Texas"],
        escalation_links=get_product_routes(topic),
    )


def _handle_broad_legal(message: str, session_id: str) -> ChatResponse:
    """Handle legal topics outside the core 4."""
    answer = (
        f"{_BROAD_LEGAL_ANSWER}\n\n"
        f"To help you further, I would need to know:\n\n"
        f"  1. What type of legal matter is this? (e.g., landlord-tenant, employment, estate)\n"
        f"  2. Which state or jurisdiction is involved?\n"
        f"  3. Is there a deadline or timeline concern?\n"
        f"  4. Have you already consulted with an attorney on this?\n\n"
        f"Based on your answers, I can point you to the right VCX service path "
        f"or recommend submitting through Structured Intake for private advisor review."
        f"{_DISCLAIMER}"
    )

    return ChatResponse(
        session_id=session_id,
        mode="legal_information",
        answer=answer,
        status="need_more_info",
        event_type="broad_legal",
        next_step="Submit to Structured Intake for advisor review on this topic.",
        suggestions=[
            "Submit to Structured Intake",
            "Ask about contracts instead",
            "Ask about immigration packets",
            "Ask about auto deals",
        ],
        escalation_links=DEFAULT_PRODUCT_ROUTES,
    )


def _handle_general_chat(message: str, session_id: str) -> ChatResponse:
    """Handle general conversation with safety rails."""
    lower = message.lower().strip()

    if lower in _GENERAL_GREETINGS or any(g in lower for g in _GENERAL_GREETINGS):
        return ChatResponse(
            session_id=session_id,
            mode="general_chat",
            answer=_GENERAL_GREETING_RESPONSE,
            status="answered",
            event_type="greeting",
            suggestions=[
                "I have a legal question",
                "Tell me about VitaCoreX services",
                "I need to submit a new matter",
                "Help me with a contract",
            ],
        )

    tokens = set(lower.split())
    legal_adjacent = sum(1 for kw in LEGAL_BROAD_KEYWORDS if kw in lower or kw in tokens)

    if legal_adjacent == 1:
        return ChatResponse(
            session_id=session_id,
            mode="general_chat",
            answer=f"{_GENERAL_CHAT_RESPONSE}{_LEGAL_DRIFT_NOTICE}",
            status="answered",
            event_type="general_chat_legal_adjacent",
            suggestions=["Ask a legal question", "Tell me about your services", "Open Structured Intake"],
            escalation_links=[
                {"label": "Open Structured Intake", "url": "/structured-case-intake.html", "description": "Submit a matter for private review."},
            ],
        )

    return ChatResponse(
        session_id=session_id,
        mode="general_chat",
        answer=_GENERAL_CHAT_RESPONSE,
        status="answered",
        event_type="general_chat",
        suggestions=[
            "I have a legal question",
            "Tell me about VitaCoreX services",
            "I need help with a contract",
            "Help me organize immigration documents",
        ],
    )


# ── Helpers ───────────────────────────────────────────────────────────

def _next_step_for_topic(topic: str) -> str:
    return {
        "contracts": "Upload your contract to the Contract Scanner for automated analysis, or submit to Structured Intake for advisor review.",
        "immigration_packets": "Submit your packet to Structured Intake for advisor review and completeness check.",
        "auto_deal_review": "Submit your deal sheet to Structured Intake for fee and payment verification.",
        "florida_official_sources": "If you need help beyond portal routing, submit to Structured Intake.",
    }.get(topic, "Submit to Structured Intake for advisor review.")


# ══════════════════════════════════════════════════════════════════════
#  Phase 6A: Chat-to-Intake handoff helpers
# ══════════════════════════════════════════════════════════════════════

TOPIC_TO_SERVICE: dict[str, str] = {
    "contracts": "Structured Case Intake & Packet Build",
    "immigration_packets": "Structured Case Intake & Packet Build",
    "auto_deal_review": "Services for Individuals",
    "florida_official_sources": "Services for Individuals",
}

_DOC_HINT_RULES: list[tuple[tuple[str, ...], str]] = [
    (("contract", "agreement", "nda"), "Upload the contract or agreement you mentioned"),
    (("deal sheet", "buyer's order"), "Upload the dealer worksheet or buyer's order"),
    (("forms", "packet", "i-485"), "Upload the forms or supporting documents you mentioned"),
    (("citation", "invoice", "notice"), "Upload the citation, invoice, or notice you mentioned"),
]


def _detect_doc_hint(text: str) -> str | None:
    """Return a document-upload hint if the user mentioned relevant docs."""
    lower = text.lower()
    for keywords, hint in _DOC_HINT_RULES:
        if any(kw in lower for kw in keywords):
            return hint
    return None


def build_intake_summary(
    session_id: str,
    name: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    urgency: str = "Standard",
) -> "IntakeHandoffResponse":
    """Build an intake handoff payload from a chat session.

    Phase 6A: Reads user messages from the session, extracts key facts,
    composes a structured summary.  Only user-authored content is included
    in the summary (no assistant responses, no policy events).
    """
    import urllib.parse

    from ..db import get_session, list_recent_messages
    from ..models.chat import IntakeHandoffResponse

    session = get_session(session_id)
    if not session:
        raise ValueError(f"Session {session_id} not found")

    topic = session.get("topic")
    state = session.get("state")

    # Retrieve messages — user role only, privacy-preserving
    messages = list_recent_messages(session_id, limit=50)
    user_messages = [m["content"] for m in messages if m["role"] == "user"]

    # ── Detect case type from combined user text ──────────────────
    combined_text = " ".join(user_messages)
    case_type = detect_case_type(topic, combined_text) if topic else None

    # ── Build structured summary ──────────────────────────────────
    parts: list[str] = []
    if topic:
        topic_label = ALLOWED_TOPICS.get(topic, topic)
        if case_type:
            parts.append(f"Topic: {topic_label} ({case_type.replace('_', ' ').title()})")
        else:
            parts.append(f"Topic: {topic_label}")
    if state:
        parts.append(f"Jurisdiction: {state}")

    if user_messages:
        parts.append("Key facts gathered:")
        for msg in user_messages[-10:]:
            truncated = msg[:100].strip()
            if len(msg) > 100:
                truncated += "..."
            parts.append(f"  - {truncated}")

    parts.append(f"\nConversation reference: {session_id}")
    summary = "\n".join(parts)

    # Enforce 500-char URL-safe limit
    if len(summary) > 500:
        summary = summary[:497] + "..."

    # ── Map topic -> service type ─────────────────────────────────
    service_type = TOPIC_TO_SERVICE.get(topic, "Services for Individuals") if topic else "Services for Individuals"

    # ── Document hint ─────────────────────────────────────────────
    doc_hint = _detect_doc_hint(combined_text)

    # ── Recommended next step ─────────────────────────────────────
    next_step = _next_step_for_topic(topic) if topic else "Submit to Structured Intake for advisor review."

    # ── Build prefill URL ─────────────────────────────────────────
    params: dict[str, str] = {"vcx_from": "chat", "vcx_session": session_id}
    if name:
        params["vcx_name"] = name
    if email:
        params["vcx_email"] = email
    if phone:
        params["vcx_phone"] = phone
    if topic:
        params["vcx_topic"] = topic
    if service_type:
        params["vcx_service"] = service_type
    if state:
        params["vcx_state"] = state
    if urgency:
        params["vcx_urgency"] = urgency
    if summary:
        params["vcx_summary"] = summary
    if next_step:
        params["vcx_next_step"] = next_step

    prefill_url = "/structured-case-intake.html?" + urllib.parse.urlencode(params)

    return IntakeHandoffResponse(
        session_id=session_id,
        name=name,
        email=email,
        phone=phone,
        topic=topic,
        service_type=service_type,
        state=state,
        urgency=urgency,
        summary=summary,
        doc_hint=doc_hint,
        recommended_next_step=next_step,
        prefill_url=prefill_url,
    )
