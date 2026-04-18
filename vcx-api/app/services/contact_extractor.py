"""Auto-detect contact info (email, phone) in chat messages.

Extracts emails and US phone numbers via regex.
Tracks per-session to only forward once (first detection).
"""

import logging
import re
import threading

logger = logging.getLogger("vcx.contact_extractor")

# Thread-safe set of sessions that already triggered a CRM forward
_forwarded_sessions: set[str] = set()
_lock = threading.Lock()

# Patterns
_EMAIL_RE = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
_PHONE_RE = re.compile(
    r'(?:\+?1[-.\s]?)?'           # optional +1 or 1
    r'(?:\(?\d{3}\)?[-.\s]?)'     # area code
    r'\d{3}[-.\s]?'               # exchange
    r'\d{4}'                      # subscriber
)


def extract_contact(text: str) -> dict | None:
    """Return {'email': ..., 'phone': ...} if contact info found, else None."""
    email_match = _EMAIL_RE.search(text)
    phone_match = _PHONE_RE.search(text)

    if not email_match and not phone_match:
        return None

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": _normalize_phone(phone_match.group(0)) if phone_match else None,
    }


def should_forward(session_id: str) -> bool:
    """Return True if this session hasn't been forwarded yet. Mark it."""
    with _lock:
        if session_id in _forwarded_sessions:
            return False
        _forwarded_sessions.add(session_id)
        return True


def maybe_forward_contact(
    session_id: str,
    message: str,
    forward_fn,
) -> bool:
    """Check message for contact info. If found and first time, call forward_fn.

    Args:
        session_id: Chat session ID
        message: User's message text
        forward_fn: Callable(name, email, phone) — typically forward_lead_to_crm

    Returns:
        True if a forward was triggered
    """
    contact = extract_contact(message)
    if not contact:
        return False

    if not should_forward(session_id):
        return False

    # Forward as preliminary lead
    forward_fn(
        name=contact.get("email", "Chat User") or "Chat User",
        email=contact.get("email"),
        phone=contact.get("phone"),
        source="chat_auto_detect",
    )

    logger.info(
        "Auto-detected contact in chat %s: email=%s phone=%s",
        session_id,
        contact.get("email"),
        bool(contact.get("phone")),
    )
    return True


def _normalize_phone(raw: str) -> str:
    """Strip non-digits, ensure 10-digit US format."""
    digits = re.sub(r'\D', '', raw)
    if len(digits) == 11 and digits[0] == '1':
        digits = digits[1:]
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return raw.strip()
