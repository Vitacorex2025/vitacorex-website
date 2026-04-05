"""LLM integration for VitaCoreX chat assistant.

Uses OpenAI GPT-4o-mini for conversational AI responses.
Falls back to rule-based policy engine if no API key or on errors.
"""

import logging
import os
from typing import Optional

logger = logging.getLogger("vcx.llm")

_API_KEY = os.getenv("OPENAI_API_KEY", "")
_MODEL = os.getenv("VCX_LLM_MODEL", "gpt-4o-mini")
_MAX_TOKENS = int(os.getenv("VCX_LLM_MAX_TOKENS", "2000"))

_client = None


def _get_client():
    """Lazy-init OpenAI client."""
    global _client
    if _client is not None:
        return _client
    if not _API_KEY:
        return None
    try:
        from openai import OpenAI
        _client = OpenAI(api_key=_API_KEY)
        logger.info("OpenAI client initialized (model=%s)", _MODEL)
        return _client
    except Exception as exc:
        logger.warning("Failed to init OpenAI client: %s", exc)
        return None


def is_available() -> bool:
    """Check if LLM is configured and reachable."""
    return bool(_API_KEY) and _get_client() is not None


# ── System prompt — defines assistant personality and guardrails ──

SYSTEM_PROMPT = """You are the VitaCoreX Assistant — a professional, knowledgeable AI advisor for VitaCoreX LLC, a consulting firm based in Tampa, Florida that specializes in:

- Revenue recovery infrastructure and design
- Corporate legal file control and documentation
- Structured case intake and advisory
- Contract review and intelligence
- Immigration packet preparation support
- Auto deal analysis
- Florida official source lookups (tolls, traffic, courts)

PERSONALITY:
- Professional, concise, and helpful
- Speak like a senior consultant — confident but never arrogant
- Use clear, plain language — avoid jargon unless the user uses it first
- Be warm but businesslike
- Answer in the same language the user writes in (English, Russian, Spanish)

RULES:
- You are NOT a lawyer and do NOT provide legal advice or legal representation
- You provide information, workflow guidance, and service routing
- When legal questions arise, provide general educational information and recommend the user submit through Structured Intake or consult licensed counsel
- Never fabricate case law, statutes, or legal citations
- If unsure, say so honestly and suggest a consultation
- Keep responses concise (2-4 paragraphs max unless the user asks for detail)

VITACOREX SERVICES (recommend when relevant):
- Structured Case Intake: /structured-case-intake.html — submit matters for private review
- Contract Review Desk: /app/vcx-contract-review/ — upload contracts for clause analysis
- Immigration Form Helper: /app/immigration-forms/ — check immigration packets
- Auto Deal Check: /app/dealer-contract-check/ — verify auto deal numbers
- Florida Lookups: /app/private-lookup/ — tolls, traffic fines, court records
- Private Consultation: call (888) 794-8292 or book via Calendly

COMPANY FACTS:
- VitaCoreX LLC, Tampa FL, EIN 41-4399148, established 2025
- Phone: (888) 794-8292
- Not a law firm — provides administrative and documentation support services
"""


def chat_completion(
    message: str,
    history: list[dict] | None = None,
    topic: Optional[str] = None,
    state: Optional[str] = None,
) -> Optional[str]:
    """Generate an AI response using OpenAI.

    Args:
        message: Current user message
        history: Previous messages as [{"role": "user"/"assistant", "content": "..."}]
        topic: Current conversation topic (contracts, immigration, etc.)
        state: US state/jurisdiction if known

    Returns:
        AI response string, or None if LLM unavailable/errored
    """
    client = _get_client()
    if not client:
        return None

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add context hints
    if topic or state:
        ctx = "Context: "
        if topic:
            ctx += f"The conversation topic is '{topic}'. "
        if state:
            ctx += f"The user's jurisdiction is {state}. "
        messages.append({"role": "system", "content": ctx})

    # Add conversation history (last 10 messages max)
    if history:
        for msg in history[-10:]:
            role = msg.get("role", "user")
            if role in ("user", "assistant"):
                messages.append({"role": role, "content": msg.get("content", "")})

    # Add current message
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=messages,
            max_tokens=_MAX_TOKENS,
            temperature=0.7,
        )
        answer = response.choices[0].message.content
        if answer:
            return answer.strip()
        return None
    except Exception as exc:
        logger.warning("LLM call failed: %s", exc)
        return None


def chat_completion_stream(
    message: str,
    history: list[dict] | None = None,
    topic: Optional[str] = None,
    state: Optional[str] = None,
):
    """Yield streaming chunks from OpenAI.

    Yields str chunks as they arrive. Returns None-generator if unavailable.
    """
    client = _get_client()
    if not client:
        return

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if topic or state:
        ctx = "Context: "
        if topic:
            ctx += f"The conversation topic is '{topic}'. "
        if state:
            ctx += f"The user's jurisdiction is {state}. "
        messages.append({"role": "system", "content": ctx})

    if history:
        for msg in history[-10:]:
            role = msg.get("role", "user")
            if role in ("user", "assistant"):
                messages.append({"role": role, "content": msg.get("content", "")})

    messages.append({"role": "user", "content": message})

    try:
        stream = client.chat.completions.create(
            model=_MODEL,
            messages=messages,
            max_tokens=_MAX_TOKENS,
            temperature=0.7,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta if chunk.choices else None
            if delta and delta.content:
                yield delta.content
    except Exception as exc:
        logger.warning("LLM stream failed: %s", exc)
        return
