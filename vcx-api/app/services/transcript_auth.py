"""Transcript access control — HMAC-signed expiring tokens.

Phase 4 Fix: Removes public access to chat transcripts.
Provides two auth methods:
  1. Admin token (X-Admin-Token header, same as review.py)
  2. Signed HMAC token (URL-safe, expiring)

Token format: base64url(session_id:expires_unix):signature
Signature: HMAC-SHA256(secret, session_id:expires_unix)

Secret sourced from VCX_TRANSCRIPT_SECRET env var.
Falls back to VCX_ADMIN_TOKEN if VCX_TRANSCRIPT_SECRET is not set.
"""

import hashlib
import hmac
import os
import time
from base64 import urlsafe_b64decode, urlsafe_b64encode

# ── Secret ────────────────────────────────────────────────────────────

_TRANSCRIPT_SECRET = os.getenv(
    "VCX_TRANSCRIPT_SECRET",
    os.getenv("VCX_ADMIN_TOKEN", "change-me-transcript"),
)

DEFAULT_EXPIRY_MINUTES = int(os.getenv("VCX_TRANSCRIPT_TOKEN_TTL", "60"))


# ── Generate ──────────────────────────────────────────────────────────

def generate_signed_token(session_id: str, expiry_minutes: int | None = None) -> str:
    """Create an HMAC-signed, time-limited transcript access token.

    Args:
        session_id: The chat session UUID to grant access to.
        expiry_minutes: Token lifetime in minutes. Defaults to
                        VCX_TRANSCRIPT_TOKEN_TTL env var (default 60).

    Returns:
        URL-safe string token:  base64url(session_id:expires_unix).signature
    """
    if expiry_minutes is None:
        expiry_minutes = DEFAULT_EXPIRY_MINUTES

    expires_unix = int(time.time()) + (expiry_minutes * 60)
    payload = f"{session_id}:{expires_unix}"
    payload_b64 = urlsafe_b64encode(payload.encode()).decode().rstrip("=")
    signature = _sign(payload)
    return f"{payload_b64}.{signature}"


# ── Verify ────────────────────────────────────────────────────────────

def verify_signed_token(token: str) -> str:
    """Verify a signed transcript token and return the session_id.

    Args:
        token: The token string from generate_signed_token().

    Returns:
        The session_id embedded in the token.

    Raises:
        ValueError: If the token is malformed, expired, or tampered with.
    """
    if not token or "." not in token:
        raise ValueError("Malformed token.")

    parts = token.rsplit(".", 1)
    if len(parts) != 2:
        raise ValueError("Malformed token.")

    payload_b64, provided_sig = parts

    # Decode payload
    try:
        # Re-pad base64
        padding = 4 - (len(payload_b64) % 4)
        if padding != 4:
            payload_b64_padded = payload_b64 + ("=" * padding)
        else:
            payload_b64_padded = payload_b64
        payload = urlsafe_b64decode(payload_b64_padded).decode()
    except Exception as exc:
        raise ValueError(f"Token decode failed: {exc}") from exc

    # Parse session_id:expires_unix
    if ":" not in payload:
        raise ValueError("Malformed token payload.")

    # session_id may contain colons (unlikely for UUIDs, but be safe)
    last_colon = payload.rfind(":")
    session_id = payload[:last_colon]
    expires_str = payload[last_colon + 1:]

    if not session_id or not expires_str:
        raise ValueError("Malformed token payload.")

    try:
        expires_unix = int(expires_str)
    except ValueError as exc:
        raise ValueError("Invalid expiry in token.") from exc

    # Check expiry BEFORE signature (cheap check first)
    if expires_unix < int(time.time()):
        raise ValueError("Token expired.")

    # Verify signature (constant-time comparison)
    expected_sig = _sign(f"{session_id}:{expires_unix}")
    if not hmac.compare_digest(provided_sig, expected_sig):
        raise ValueError("Invalid token signature.")

    return session_id


# ── Internal ──────────────────────────────────────────────────────────

def _sign(payload: str) -> str:
    """HMAC-SHA256 sign a payload string, return hex digest."""
    return hmac.new(
        _TRANSCRIPT_SECRET.encode(),
        payload.encode(),
        hashlib.sha256,
    ).hexdigest()
