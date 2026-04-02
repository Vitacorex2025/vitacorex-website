from __future__ import annotations

from typing import Optional

from .knowledge import detect_out_of_scope, infer_topic, retrieve, summarize_chunks, topic_needs_state
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


def answer_message(message: str, topic: Optional[str], state: Optional[str], session_id: str) -> ChatResponse:
    lower = message.lower()

    if detect_out_of_scope(lower):
        return ChatResponse(
            session_id=session_id,
            answer=(
                "I can only help with a limited set of documentation-led topics on this site. "
                "I cannot guide emergency, court-strategy, criminal, family, eviction, or litigation matters here. "
                "Use structured intake for private review instead."
            ),
            status="escalate",
            next_step="Open structured intake for private review.",
            suggestions=["Open structured intake", "Request private consultation"],
        )

    chosen_topic = topic or infer_topic(message)
    if not chosen_topic:
        return ChatResponse(
            session_id=session_id,
            answer=(
                "Start by choosing one of the supported areas: contracts, immigration packet organization, "
                "auto deal review, or Florida official source routing. I am intentionally narrow in scope."
            ),
            status="need_more_info",
            suggestions=DEFAULT_SUGGESTIONS,
        )

    if topic_needs_state(chosen_topic) and not state:
        return ChatResponse(
            session_id=session_id,
            topic=chosen_topic,
            answer=(
                "Before I answer, tell me the state or jurisdiction connected to this matter. "
                "That keeps the routing cleaner and avoids generic answers where local rules or portals may differ."
            ),
            status="need_more_info",
            suggestions=["Florida", "California", "New York", "Texas"],
        )

    chunks = retrieve(chosen_topic, message, limit=4)
    bullets, sources = summarize_chunks(chunks)

    if not bullets:
        answer = (
            f"I can help with {ALLOWED_TOPICS[chosen_topic]}, but I do not have an approved answer block for that exact question yet. "
            "Use the intake form if you want a reviewed response based on your documents."
        )
        status = "escalate"
        next_step = "Route to structured intake or document review."
        suggestions = TOPIC_SUGGESTIONS[chosen_topic]
        return ChatResponse(
            session_id=session_id,
            topic=chosen_topic,
            state=state,
            answer=answer,
            status=status,
            next_step=next_step,
            suggestions=suggestions,
            sources=sources,
        )

    preface = {
        "contracts": "Here is a controlled first-pass answer for a contract/document question.",
        "immigration_packets": "Here is a controlled first-pass answer for packet organization.",
        "auto_deal_review": "Here is a controlled first-pass answer for an auto deal review question.",
        "florida_official_sources": "Here is a controlled first-pass routing answer for a Florida official source question.",
    }[chosen_topic]

    body = "\n".join(f"- {bullet}" for bullet in bullets)
    disclaimer = (
        "\n\nThis is general information and workflow guidance only. It is not legal representation, "
        "not attorney-client advice, and not a substitute for licensed counsel."
    )

    next_step = {
        "contracts": "Use Contract Scanner or request a reviewed memo.",
        "immigration_packets": "Use Immigration Helper or request packet review.",
        "auto_deal_review": "Use Auto Deal Check or request fee/payment review.",
        "florida_official_sources": "Open the Florida source locator for the correct portal.",
    }[chosen_topic]

    return ChatResponse(
        session_id=session_id,
        topic=chosen_topic,
        state=state,
        answer=f"{preface}\n\n{body}{disclaimer}",
        status="answered",
        next_step=next_step,
        suggestions=TOPIC_SUGGESTIONS[chosen_topic],
        sources=sources,
    )
