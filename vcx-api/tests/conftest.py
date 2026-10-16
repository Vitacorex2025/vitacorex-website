"""Shared fixtures for vcx-api v2 tests: isolated temp DB + mail sink per test.

Environment is fixed BEFORE the app is imported so the developer's local .env
(loaded by python-dotenv without override) can never leak into a test run.
All secret-looking values below are throwaway test placeholders.
"""

import json
import os
import sqlite3
import sys
import tempfile
import uuid
from pathlib import Path

import pytest

API_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(API_ROOT))

_BOOT = Path(tempfile.mkdtemp(prefix="vcx-v2-boot-"))

ADMIN = "test-admin-placeholder-0123456789"
VOICE = "test-voice-placeholder-0123456789"
WHSEC = "whsec_test_placeholder_0123456789"

BASE_ENV = {
    "VCX_ENV": "preview",
    "VCX_LEGACY_API": "true",   # legacy routers stay testable; production leaves them off
    "VCX_DB_PATH": str(_BOOT / "boot.db"),
    "VCX_MAIL_SINK_DIR": str(_BOOT / "sink"),
    "VCX_RATE_LIMIT_ENABLED": "false",
    "VCX_OUTBOX_WORKER": "false",
    "VCX_OUTBOX_MAX_ATTEMPTS": "6",
    "VCX_PAYMENTS_MODE": "mock",
    "VCX_ADMIN_TOKEN": ADMIN,
    "VCX_VOICE_TOOL_SECRET": VOICE,
    "VCX_STRIPE_WEBHOOK_SECRET": WHSEC,
    "STRIPE_SECRET_KEY": "",
    "VCX_SITE_BASE": "http://localhost:4646",
    "VCX_API_BASE": "http://testserver",
    "VCX_ALLOWED_ORIGINS": "http://localhost:4646",
    "VCX_OWNER_EMAIL": "owner@example.test",
    "VCX_ADMIN_EMAIL": "",
    "VCX_SMTP_HOST": "",
    "VCX_SMTP_USER": "",
    "VCX_SMTP_PASS": "",
    "VCX_TRANSCRIPT_SECRET": "",
    "VCX_CRM_WEBHOOK_URL": "",
    "OPENAI_API_KEY": "",
    "VCX_CATALOG_PATH": "",
}
for _k, _v in BASE_ENV.items():
    os.environ[_k] = _v

CATALOG_PATH = (API_ROOT / ".." / "assets" / "data" / "vcx-catalog.json").resolve()


@pytest.fixture
def env(tmp_path, monkeypatch):
    import app.db as db
    from app.services import v2_outbox

    for k, v in BASE_ENV.items():
        monkeypatch.setenv(k, v)
    monkeypatch.setenv("VCX_MAIL_SINK_DIR", str(tmp_path / "sink"))
    monkeypatch.setattr(db, "_DB_FULL", tmp_path / "vcx.db")
    db.init_db()
    v2_outbox.set_sender_override(None)
    yield tmp_path
    v2_outbox.set_sender_override(None)


@pytest.fixture
def client(env):
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        yield c


@pytest.fixture
def catalog():
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def admin_headers(token: str = ADMIN) -> dict:
    return {"X-Admin-Token": token}


def payload(service_id: str = "tax_1040_simple", **over) -> dict:
    body = {
        "idempotency_key": str(uuid.uuid4()),
        "service_id": service_id,
        "subtype": None,
        "locale": "en",
        "source_channel": "web",
        "contact": {"name": "Test Person", "email": "test.person@example.test", "phone": "+1 813 555 0100"},
        "details": {},
        "summary": "TEST request — synthetic data",
        "consent": {"privacy": True, "notice_version": "general-2026-10-14", "referral": False},
        "hp": "",
    }
    body.update(over)
    return body


def db_rows(env_path: Path, sql: str, params=()) -> list[dict]:
    conn = sqlite3.connect(str(env_path / "vcx.db"))
    conn.row_factory = sqlite3.Row
    try:
        return [dict(r) for r in conn.execute(sql, params).fetchall()]
    finally:
        conn.close()


def db_exec(env_path: Path, sql: str, params=()) -> None:
    conn = sqlite3.connect(str(env_path / "vcx.db"))
    try:
        conn.execute(sql, params)
        conn.commit()
    finally:
        conn.close()


def create(client, service_id="tax_1040_simple", **over) -> dict:
    r = client.post("/api/v2/requests", json=payload(service_id, **over))
    assert r.status_code == 201, r.text
    return r.json()
