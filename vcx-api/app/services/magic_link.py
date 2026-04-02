"""Magic link token generation and validation."""

import os
import secrets

BASE_URL = os.getenv("VCX_BASE_URL", "https://vitacorexllc.com")


def generate_token() -> str:
    """Return a URL-safe 48-byte random token (384 bits of entropy)."""
    return secrets.token_urlsafe(48)


def build_magic_link(matter_id: str, token: str) -> str:
    """Build the client-facing status page URL."""
    return f"{BASE_URL}/app/matter-status/?matter={matter_id}&token={token}"


def validate_token(matter_id: str, token: str, conn) -> bool:
    """Check that the token matches the matter's stored magic_token."""
    row = conn.execute(
        "SELECT magic_token FROM matters WHERE id=?", (matter_id,)
    ).fetchone()
    if not row:
        return False
    return secrets.compare_digest(row["magic_token"], token)
