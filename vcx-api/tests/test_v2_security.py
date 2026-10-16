"""Owner desk auth (503/401/cookie+CSRF), owner actions, calendar notify auth, legacy fail-closed tokens."""

import re

from conftest import ADMIN, admin_headers, create, db_rows


def test_owner_503_when_token_unset(client, monkeypatch):
    req = create(client)
    monkeypatch.setenv("VCX_ADMIN_TOKEN", "")
    rid = req["request_id"]
    assert client.get("/owner").status_code == 503
    assert client.get("/owner", headers=admin_headers("anything")).status_code == 503
    assert client.get("/owner/login").status_code == 503
    assert client.post("/owner/login", data={"token": ""}).status_code == 503
    assert client.get(f"/owner/requests/{rid}", headers=admin_headers("x")).status_code == 503
    for path in ("status", "quote", "reclassify"):
        assert client.post(f"/api/v2/owner/requests/{rid}/{path}", json={}, headers=admin_headers("x")).status_code == 503
    assert client.get("/api/v2/owner/requests").status_code == 503


def test_owner_401_with_wrong_or_missing_token(client):
    req = create(client)
    rid = req["request_id"]
    assert client.get("/owner").status_code == 401
    assert client.get("/owner", headers=admin_headers("wrong")).status_code == 401
    assert client.get(f"/owner/requests/{rid}", headers=admin_headers("wrong")).status_code == 401
    r = client.post(f"/api/v2/owner/requests/{rid}/status", json={"status": "TRIAGE"}, headers=admin_headers("wrong"))
    assert r.status_code == 401
    assert client.post(f"/api/v2/owner/requests/{rid}/status", json={"status": "TRIAGE"}).status_code == 401
    assert client.post("/owner/login", data={"token": "wrong"}).status_code == 401
    ok = client.get("/owner", headers=admin_headers())
    assert ok.status_code == 200 and rid in ok.text and "TEST" in ok.text
    assert ok.headers["cache-control"] == "no-store" and "frame-ancestors 'none'" in ok.headers["content-security-policy"]


def test_owner_cookie_login_requires_csrf_for_writes(client, env):
    req = create(client)
    rid = req["request_id"]
    r = client.post("/owner/login", data={"token": ADMIN}, follow_redirects=False)
    assert r.status_code == 303
    cookie = r.headers["set-cookie"]
    assert "HttpOnly" in cookie and "SameSite=strict" in cookie and ADMIN not in cookie
    page = client.get(f"/owner/requests/{rid}")
    assert page.status_code == 200 and "Event history" in page.text
    csrf = re.search(r'name="csrf" value="([0-9a-f]+)"', page.text).group(1)
    no_csrf = client.post(f"/api/v2/owner/requests/{rid}/status", data={"status": "TRIAGE"}, follow_redirects=False)
    assert no_csrf.status_code == 403
    cross = client.post(f"/api/v2/owner/requests/{rid}/status", data={"status": "TRIAGE", "csrf": csrf},
                        headers={"Origin": "http://evil.example"}, follow_redirects=False)
    assert cross.status_code == 403
    good = client.post(f"/api/v2/owner/requests/{rid}/status", data={"status": "TRIAGE", "csrf": csrf},
                       follow_redirects=False)
    assert good.status_code == 303 and "ok=status_updated" in good.headers["location"]
    assert db_rows(env, "SELECT status FROM v2_requests")[0]["status"] == "TRIAGE"
    quote = client.post(f"/api/v2/owner/requests/{rid}/quote",
                        data={"amount_usd": "149.50", "scope_text": "TEST scope", "expires_in_days": "10", "csrf": csrf},
                        follow_redirects=False)
    assert quote.status_code == 303
    assert db_rows(env, "SELECT amount_cents FROM v2_quotes")[0]["amount_cents"] == 14950


def test_owner_status_transitions_and_reclassify_audit(client, env):
    req = create(client, "contracts_documents")
    rid, h = req["request_id"], admin_headers()
    bad = client.post(f"/api/v2/owner/requests/{rid}/status", json={"status": "ORDER_CREATED"}, headers=h)
    assert bad.status_code == 409 and bad.json()["error"] == "invalid_transition"
    ref = client.post(f"/api/v2/owner/requests/{rid}/status", json={"status": "REFERRED_WITH_CONSENT"}, headers=h)
    assert ref.status_code == 409 and ref.json()["error"] == "referral_consent_missing"
    ok = client.post(f"/api/v2/owner/requests/{rid}/status", json={"status": "NEEDS_INFORMATION", "note": "ask year"},
                     headers=h)
    assert ok.status_code == 200 and ok.json()["status"] == "NEEDS_INFORMATION"
    rc = client.post(f"/api/v2/owner/requests/{rid}/reclassify",
                     json={"service_id": "tax_1040_simple", "subtype": "simple_w2", "reason": "customer meant taxes"},
                     headers=h)
    assert rc.status_code == 200 and rc.json()["queue"] == "TAX"
    ev = db_rows(env, "SELECT data_json FROM v2_events WHERE event_type='request.classified'")
    assert len(ev) == 1 and "contracts_documents" in ev[0]["data_json"] and "customer meant taxes" in ev[0]["data_json"]
    bad_sub = client.post(f"/api/v2/owner/requests/{rid}/reclassify",
                          json={"service_id": "tax_1040_simple", "subtype": "nope", "reason": "x"}, headers=h)
    assert bad_sub.status_code == 422
    ny = create(client, "business_filing_other_state", details={"entity_name": "Test Co LLC"})
    db_rows(env, "SELECT 1")
    q = client.post(f"/api/v2/owner/requests/{ny['request_id']}/quote", headers=h,
                    json={"amount_cents": 50, "scope_text": "x", "expires_in_days": 5})
    assert q.status_code == 422  # amount out of range
    sens = client.post(f"/api/v2/owner/requests/{ny['request_id']}/quote", headers=h,
                       json={"amount_cents": 15000, "scope_text": "client ssn 123-45-6789", "expires_in_days": 5})
    assert sens.status_code == 422 and sens.json()["error"] == "sensitive_data"


def test_calendar_notify_requires_admin_token(client, monkeypatch):
    body = {"to": ["someone@example.test"], "subject": "x", "body": "y"}
    assert client.post("/api/calendar/notify", json=body).status_code == 401
    assert client.post("/api/calendar/notify", json=body, headers=admin_headers("wrong")).status_code == 401
    ok = client.post("/api/calendar/notify", json=body, headers=admin_headers())
    assert ok.status_code == 200 and ok.json()["ok"] is False  # SMTP unset in tests: nothing sent
    monkeypatch.setenv("VCX_ADMIN_TOKEN", "")
    assert client.post("/api/calendar/notify", json=body, headers=admin_headers()).status_code == 503


def test_legacy_admin_endpoints_fail_closed_without_env(client, monkeypatch):
    monkeypatch.setenv("VCX_ADMIN_TOKEN", "")
    assert client.get("/api/review/queue", headers={"X-Admin-Token": "change-me"}).status_code == 503
    r = client.post("/api/legal-chat/transcript-token/abc", headers={"X-Admin-Token": "change-me"})
    assert r.status_code == 503
    t = client.get("/api/legal-chat/transcript/abc", headers={"X-Admin-Token": "change-me"})
    assert t.status_code == 503
    from app.services.transcript_auth import verify_signed_token
    import pytest
    with pytest.raises(ValueError):
        verify_signed_token("YWJjOjk5OTk5OTk5OTk.deadbeef")


def test_cors_allows_configured_origin_only(client):
    ok = client.options("/api/v2/requests", headers={"Origin": "http://localhost:4646",
                                                     "Access-Control-Request-Method": "POST"})
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:4646"
    bad = client.options("/api/v2/requests", headers={"Origin": "http://evil.example",
                                                      "Access-Control-Request-Method": "POST"})
    assert bad.headers.get("access-control-allow-origin") is None


def test_rate_limit_is_per_visitor_behind_render_proxy(client, monkeypatch):
    """Render's proxy appends the visitor's address as the last X-Forwarded-For entry; request.client.host is the
    proxy itself. The shared limiter must key on that last entry so one visitor cannot exhaust everyone's limit."""
    from app.rate_limit import limiter

    monkeypatch.setattr(limiter, "enabled", True)
    limiter.reset()
    try:
        def post(xff=None):
            headers = {"X-Forwarded-For": xff} if xff else {}
            return client.post("/api/v2/requests", json={}, headers=headers).status_code

        # 10/minute on the request form; entries the client sends before the proxy's own do not change its key.
        statuses = [post(f"10.0.0.{i}, 203.0.113.7") for i in range(10)]
        assert 429 not in statuses
        assert post("203.0.113.7") == 429
        assert post("198.51.100.9") != 429
        assert post("203.0.113.7, 198.51.100.9") != 429
        assert post() != 429  # no header: falls back to the socket address, a key of its own
    finally:
        limiter.reset()
