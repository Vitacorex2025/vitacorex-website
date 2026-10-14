"""vcx-api v2 — owner / voice / admin authentication (fail closed).

Unset secret -> 503 (never a default token). Wrong or missing credential -> 401.
The owner session cookie never contains the admin token itself: it is an
HMAC of an issue timestamp keyed by the token, so rotating the token logs
every session out.
"""

import hashlib
import hmac
import secrets
import time

from fastapi import Request

from .v2_config import admin_token, voice_secret

COOKIE_NAME = "vcx_owner"
SESSION_TTL_SECONDS = 12 * 3600


class AuthError(Exception):
    def __init__(self, status_code: int, error: str):
        super().__init__(error)
        self.status_code = status_code
        self.body = {"error": error}


def _hmac(key: str, msg: str) -> str:
    return hmac.new(key.encode(), msg.encode(), hashlib.sha256).hexdigest()


def _eq(a, b) -> bool:
    return isinstance(a, str) and isinstance(b, str) and secrets.compare_digest(a.encode(), b.encode())


def check_admin_value(value) -> None:
    """Header-style admin check used by legacy endpoints (calendar notify)."""
    token = admin_token()
    if not token:
        raise AuthError(503, "admin_not_configured")
    if not _eq(value, token):
        raise AuthError(401, "unauthorized")


def make_session_cookie() -> str:
    ts = str(int(time.time()))
    return f"{ts}.{_hmac(admin_token(), 'owner-session:' + ts)}"


def session_valid(value) -> bool:
    token = admin_token()
    if not token or not isinstance(value, str) or "." not in value:
        return False
    ts, sig = value.split(".", 1)
    if not ts.isdigit():
        return False
    age = time.time() - int(ts)
    if age < -60 or age > SESSION_TTL_SECONDS:
        return False
    return _eq(sig, _hmac(token, "owner-session:" + ts))


def csrf_token(cookie_value: str) -> str:
    return _hmac(admin_token(), "csrf:" + (cookie_value or ""))[:40]


def owner_auth(request: Request) -> str:
    """Return 'header' or 'cookie'; raise AuthError otherwise."""
    token = admin_token()
    if not token:
        raise AuthError(503, "owner_desk_not_configured")
    header = request.headers.get("x-admin-token")
    if header is not None:
        if _eq(header, token):
            return "header"
        raise AuthError(401, "unauthorized")
    if session_valid(request.cookies.get(COOKIE_NAME)):
        return "cookie"
    raise AuthError(401, "unauthorized")


def same_origin(request: Request) -> bool:
    origin = request.headers.get("origin")
    if not origin or origin == "null":
        return origin is None
    own = f"{request.url.scheme}://{request.headers.get('host', request.url.netloc)}"
    return origin.rstrip("/") == own


def check_csrf(request: Request, auth_kind: str, supplied) -> None:
    """Cookie-authenticated writes need a same-origin request and a CSRF token."""
    if auth_kind != "cookie":
        return
    if not same_origin(request):
        raise AuthError(403, "cross_origin_refused")
    if not _eq(supplied, csrf_token(request.cookies.get(COOKIE_NAME, ""))):
        raise AuthError(403, "csrf_failed")


def voice_auth(request: Request) -> None:
    secret = voice_secret()
    if not secret:
        raise AuthError(503, "voice_tools_not_configured")
    if not _eq(request.headers.get("x-vcx-voice-secret"), secret):
        raise AuthError(401, "unauthorized")
