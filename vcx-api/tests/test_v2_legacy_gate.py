"""Audit 2026-10-16: the live API exposes the v2 surface only; legacy routers and the API docs need explicit flags,
and the legacy chat upload never builds a path from a session id that is not a plain token."""

import json
import os
import subprocess
import sys
from pathlib import Path

API_ROOT = Path(__file__).resolve().parent.parent
PROBE = (
    "import json; from app.main import app; "
    "print(json.dumps(sorted({getattr(r, 'path', '') for r in app.routes})))"
)


def _routes(extra_env):
    env = {k: v for k, v in os.environ.items() if k not in ("VCX_LEGACY_API", "VCX_API_DOCS")}
    env.update(extra_env)
    out = subprocess.run([sys.executable, "-c", PROBE], cwd=API_ROOT, env=env, capture_output=True, text=True, timeout=120)
    assert out.returncode == 0, out.stderr[-800:]
    return set(json.loads(out.stdout.strip().splitlines()[-1]))


def test_production_default_has_no_legacy_routes_and_no_docs():
    paths = _routes({})
    assert "/api/v2/requests" in paths and "/api/v2/checkout" in paths and "/owner" in paths
    legacy = [p for p in paths if p.startswith(("/api/intakes", "/api/portal", "/api/legal-chat", "/api/uploads",
                                                "/api/matters", "/api/review", "/api/contracts", "/api/recovery",
                                                "/api/ai/", "/api/calendar"))]
    assert legacy == []
    assert "/openapi.json" not in paths and "/api/docs" not in paths


def test_legacy_routes_only_with_the_flag():
    paths = _routes({"VCX_LEGACY_API": "true"})
    assert "/api/intakes" in paths and "/api/portal/magic-link/{token}" in paths
    assert "/openapi.json" not in paths


def test_chat_session_id_must_be_a_plain_token():
    from app.services.chat_attachments import safe_session_dir
    for bad in ("..", "../x", "a/b", r"a\b", "/etc", r"C:\x", "", "x" * 81, "a.b"):
        assert safe_session_dir(bad) is None, bad
    assert safe_session_dir("chat_ABC-123") is not None


def test_chat_upload_rejects_path_session_id(client):
    r = client.post("/api/legal-chat/upload", data={"session_id": "../../escape"},
                    files={"file": ("note.txt", b"hello", "text/plain")})
    assert r.status_code == 400
