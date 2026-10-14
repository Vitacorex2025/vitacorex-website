"""vcx-api v2 — runtime configuration.

Every value is read from the environment at call time (not import time) so a
missing secret always fails closed and tests can switch settings per case.
Secrets are never logged or echoed by this module.
"""

import os
from datetime import datetime, timezone
from pathlib import Path

API_ROOT = Path(__file__).resolve().parent.parent.parent  # vcx-api/

SUPPORTED_LOCALES = ("en", "ru", "es")


def env(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def vcx_env() -> str:
    return env("VCX_ENV", "preview").lower()


def is_production() -> bool:
    return vcx_env() == "production"


def subject_prefix() -> str:
    """Subject prefix: every non-production message is visibly TEST."""
    return "" if is_production() else "[TEST]"


def site_base() -> str:
    return env("VCX_SITE_BASE", "http://localhost:4646").rstrip("/")


def api_base() -> str:
    return env("VCX_API_BASE", "http://localhost:8787").rstrip("/")


def admin_token() -> str:
    return env("VCX_ADMIN_TOKEN")


def voice_secret() -> str:
    return env("VCX_VOICE_TOOL_SECRET")


def webhook_secret() -> str:
    return env("VCX_STRIPE_WEBHOOK_SECRET")


def payments_mode() -> str:
    return env("VCX_PAYMENTS_MODE", "mock").lower()


def stripe_secret_key() -> str:
    return env("STRIPE_SECRET_KEY")


def owner_email() -> str:
    return env("VCX_OWNER_EMAIL") or env("VCX_ADMIN_EMAIL")


def from_email() -> str:
    return env("VCX_FROM_EMAIL", "noreply@vitacorexllc.com")


def smtp_settings() -> dict | None:
    host, user, password = env("VCX_SMTP_HOST"), env("VCX_SMTP_USER"), env("VCX_SMTP_PASS")
    if not (host and user and password):
        return None
    try:
        port = int(env("VCX_SMTP_PORT", "587"))
    except ValueError:
        port = 587
    return {"host": host, "port": port, "user": user, "password": password}


def mail_sink_dir() -> Path:
    raw = env("VCX_MAIL_SINK_DIR")
    path = Path(raw) if raw else API_ROOT / "data" / "mail-sink"
    if not path.is_absolute():
        path = API_ROOT / path
    return path


def catalog_path() -> Path:
    raw = env("VCX_CATALOG_PATH", "../assets/data/vcx-catalog.json")
    path = Path(raw)
    if not path.is_absolute():
        path = (API_ROOT / path).resolve()
    return path


def outbox_max_attempts() -> int:
    try:
        return max(1, int(env("VCX_OUTBOX_MAX_ATTEMPTS", "6")))
    except ValueError:
        return 6


def outbox_worker_enabled() -> bool:
    return env("VCX_OUTBOX_WORKER", "true").lower() == "true"


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def now_iso() -> str:
    return iso(utcnow())


def parse_iso(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
