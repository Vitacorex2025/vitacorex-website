from __future__ import annotations

from uuid import uuid4

import httpx
from fastapi.testclient import TestClient

import backend.core.config as config_module
from backend.models.auth_schema import MembershipRole
from backend.services import auth_store


DEFAULT_PASSWORD = "Password123!"


def _signup_payload(email: str, language: str = "en", title: str = "QA") -> dict[str, object]:
    return {
        "first_name": "Test",
        "last_name": "User",
        "email": email,
        "password": DEFAULT_PASSWORD,
        "confirm_password": DEFAULT_PASSWORD,
        "workspace_name": "",
        "title": title,
        "preferred_language": language,
        "terms_accepted": True,
    }


def _use_bootstrap_admin() -> bool:
    return bool(
        (config_module.settings.enforce_admin_only_case_creation or config_module.settings.enforce_admin_only_packet_generation)
        and config_module.settings.bootstrap_admin_email
        and config_module.settings.bootstrap_admin_password
    )


def _elevate_session_membership_to_admin(client) -> None:
    session = client.get("/api/auth/session")
    assert session.status_code == 200, session.text
    payload = session.json()
    membership = auth_store.get_membership(payload["workspace"]["id"], payload["user"]["id"])
    assert membership is not None
    membership.role = MembershipRole.ADMIN
    auth_store.upsert_membership(membership)


def authenticated_client(
    app,
    *,
    email: str | None = None,
    language: str = "en",
    title: str = "QA",
    elevate_if_bootstrap: bool = True,
) -> TestClient:
    client = TestClient(app)
    payload = _signup_payload(email or f"test-{uuid4().hex[:12]}@example.com", language=language, title=title)
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 200, response.text
    if elevate_if_bootstrap and _use_bootstrap_admin():
        _elevate_session_membership_to_admin(client)
    return client


def signup_httpx_client(
    base_url: str,
    *,
    email: str | None = None,
    language: str = "en",
    title: str = "QA",
    elevate_if_bootstrap: bool = True,
) -> httpx.Client:
    client = httpx.Client(base_url=base_url, follow_redirects=True, timeout=60.0)
    payload = _signup_payload(email or f"live-{uuid4().hex[:12]}@example.com", language=language, title=title)
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 200, response.text
    if elevate_if_bootstrap and _use_bootstrap_admin():
        _elevate_session_membership_to_admin(client)
    return client
