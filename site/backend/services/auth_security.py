from __future__ import annotations

import base64
import hashlib
import hmac
import secrets


PBKDF2_ITERATIONS = 260_000


def hash_password(password: str, salt: str | None = None) -> str:
    raw_salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), raw_salt.encode("utf-8"), PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${raw_salt}${base64.b64encode(digest).decode('ascii')}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, _, salt, digest = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = hash_password(password, salt=salt)
        return hmac.compare_digest(candidate, f"{algorithm}${PBKDF2_ITERATIONS}${salt}${digest}")
    except Exception:
        return False
