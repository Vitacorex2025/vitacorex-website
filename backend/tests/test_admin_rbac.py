from __future__ import annotations

import sys
from pathlib import Path
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import backend.core.config as config_module
from backend.main import app
from backend.services import auth_store


def _sync_backend_settings_reference() -> None:
    live_settings = config_module.settings
    for module in list(sys.modules.values()):
        module_name = getattr(module, "__name__", "")
        if not module_name.startswith("backend."):
            continue
        if hasattr(module, "settings"):
            setattr(module, "settings", live_settings)


def _set_setting(name: str, value) -> None:
    object.__setattr__(config_module.settings, name, value)


@pytest.fixture()
def admin_rbac_env(tmp_path):
    original_settings = {
        "storage_path": config_module.settings.storage_path,
        "bootstrap_admin_email": config_module.settings.bootstrap_admin_email,
        "bootstrap_admin_password": config_module.settings.bootstrap_admin_password,
        "enforce_admin_only_case_creation": config_module.settings.enforce_admin_only_case_creation,
        "enforce_admin_only_packet_generation": config_module.settings.enforce_admin_only_packet_generation,
    }
    original_auth_root = auth_store.AUTH_ROOT
    original_auth_db_path = auth_store.AUTH_DB_PATH

    storage_path = tmp_path / "storage"
    auth_root = storage_path / "auth"
    auth_root.mkdir(parents=True, exist_ok=True)

    bootstrap_email = f"bootstrap-{uuid4().hex[:10]}@example.test"
    bootstrap_password = f"Bootstrap-{uuid4().hex[:12]}!"

    _set_setting("storage_path", storage_path)
    _set_setting("bootstrap_admin_email", bootstrap_email)
    _set_setting("bootstrap_admin_password", bootstrap_password)
    _set_setting("enforce_admin_only_case_creation", True)
    _set_setting("enforce_admin_only_packet_generation", True)
    _sync_backend_settings_reference()
    auth_store.AUTH_ROOT = auth_root
    auth_store.AUTH_DB_PATH = auth_root / "auth.db"
    auth_store.ensure_bootstrap_admin()

    try:
        yield {
            "bootstrap_email": bootstrap_email,
            "bootstrap_password": bootstrap_password,
        }
    finally:
        _set_setting("storage_path", original_settings["storage_path"])
        _set_setting("bootstrap_admin_email", original_settings["bootstrap_admin_email"])
        _set_setting("bootstrap_admin_password", original_settings["bootstrap_admin_password"])
        _set_setting("enforce_admin_only_case_creation", original_settings["enforce_admin_only_case_creation"])
        _set_setting("enforce_admin_only_packet_generation", original_settings["enforce_admin_only_packet_generation"])
        _sync_backend_settings_reference()
        auth_store.AUTH_ROOT = original_auth_root
        auth_store.AUTH_DB_PATH = original_auth_db_path
        auth_store.ensure_bootstrap_admin()


def _signup(client: TestClient, email: str) -> dict[str, object]:
    response = client.post(
        "/api/auth/signup",
        json={
            "first_name": "Viewer",
            "last_name": "User",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "workspace_name": "",
            "title": "QA",
            "preferred_language": "en",
            "terms_accepted": True,
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def _text_upload(filename: str = "recovery_note.txt"):
    return ("files", (filename, b"Invoice aging for ACME LLC. Balance due $1250. Counsel follow-up pending.", "text/plain"))


def test_bootstrap_admin_exists_on_startup(admin_rbac_env):
    with TestClient(app):
        pass

    user = auth_store.get_user_by_email(admin_rbac_env["bootstrap_email"])
    assert user is not None
    memberships = auth_store.memberships_for_user(user.id)
    assert any(item.role == "super_admin" for item in memberships)


def test_bootstrap_admin_login_succeeds(admin_rbac_env):
    with TestClient(app) as client:
        response = client.post(
            "/api/auth/login",
            json={"email": admin_rbac_env["bootstrap_email"], "password": admin_rbac_env["bootstrap_password"]},
        )
        assert response.status_code == 200, response.text
        payload = response.json()
        assert payload["authenticated"] is True
        assert payload["authorization"]["role"] == "super_admin"
        assert payload["authorization"]["permissions"]["create_cases"] is True
        assert payload["authorization"]["permissions"]["generate_packets"] is True


def test_non_admin_upload_first_intake_session_succeeds(admin_rbac_env):
    with TestClient(app) as client:
        _signup(client, f"viewer-{uuid4().hex[:10]}@example.com")
        response = client.post(
            "/api/recovery-intake/sessions",
            data={"entry_workflow": "recovery_diagnostic"},
            files=[_text_upload()],
        )
        assert response.status_code == 200, response.text
        payload = response.json()
        assert payload["session_id"].startswith("intake_")
        assert payload["source_file_count"] == 1
        assert payload["diagnosis"]["promotion_required"] is True
        assert payload["diagnosis"]["packet_generation_allowed"] is False


def test_non_admin_create_case_returns_403(admin_rbac_env):
    with TestClient(app) as client:
        _signup(client, f"viewer-{uuid4().hex[:10]}@example.com")
        response = client.post("/api/cases", json={"matter_name": "Blocked matter"})
        assert response.status_code == 403, response.text
        detail = response.json()["error"]["detail"]
        assert detail["code"] == "admin_only_case_creation"


def test_non_admin_intake_promotion_returns_403(admin_rbac_env):
    with TestClient(app) as client:
        _signup(client, f"promote-{uuid4().hex[:10]}@example.com")
        created = client.post(
            "/api/recovery-intake/sessions",
            data={"entry_workflow": "recovery_diagnostic"},
            files=[_text_upload("promotion-source.txt")],
        )
        assert created.status_code == 200, created.text
        session_id = created.json()["session_id"]

        response = client.post(f"/api/recovery-intake/sessions/{session_id}/promote")
        assert response.status_code == 403, response.text
        detail = response.json()["error"]["detail"]
        assert detail["code"] == "admin_only_case_creation"


def test_non_admin_packet_generation_returns_403(admin_rbac_env):
    with TestClient(app) as client:
        signed_up = _signup(client, f"packet-{uuid4().hex[:10]}@example.com")
        workspace_id = signed_up["workspace"]["id"]
        user_id = signed_up["user"]["id"]

        from backend.models.case_schema import CaseRecord
        from backend.services.case_store import save_case

        record = CaseRecord(
            id=f"case_{uuid4().hex[:10]}",
            workspace_id=workspace_id,
            created_by_user_id=user_id,
            title="RBAC blocked packet",
            reference="RBAC-TEST",
        )
        save_case(record)

        response = client.post(
            f"/api/generate/{record.id}",
            json={"selected_document_types": ["complaint"]},
        )
        assert response.status_code == 403, response.text
        detail = response.json()["error"]["detail"]
        assert detail["code"] == "admin_only_packet_generation"
