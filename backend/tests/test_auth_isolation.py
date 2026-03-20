from __future__ import annotations

import importlib
import sys
from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient
from starlette.requests import Request

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.core.config import settings
from backend.main import app
from backend.services import auth_store


def _signup(client: TestClient, email: str) -> dict[str, object]:
    response = client.post(
        "/api/auth/signup",
        json={
            "first_name": "Case",
            "last_name": "Owner",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "workspace_name": "",
            "title": "QA",
            "preferred_language": "ru",
            "terms_accepted": True,
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def test_signup_login_logout_and_session_persistence():
    email = f"auth-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)
    signed_up = _signup(client, email)

    assert signed_up["authenticated"] is True
    assert signed_up["user"]["email"] == email
    assert signed_up["user"]["preferred_language"] == "ru"
    assert signed_up["membership"]["role"] == "viewer"
    assert signed_up["authorization"]["role"] == "viewer"
    assert signed_up["authorization"]["permissions"]["create_cases"] is (not settings.enforce_admin_only_case_creation)

    session = client.get("/api/auth/session")
    assert session.status_code == 200
    assert session.json()["authenticated"] is True

    logged_out = client.post("/api/auth/logout")
    assert logged_out.status_code == 200

    after_logout = client.get("/api/auth/session")
    assert after_logout.status_code == 200
    assert after_logout.json()["authenticated"] is False

    logged_in = client.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    assert logged_in.status_code == 200
    assert logged_in.json()["authenticated"] is True

    after_login = client.get("/api/auth/session")
    assert after_login.status_code == 200
    assert after_login.json()["authenticated"] is True

    diagnostics = client.get("/api/auth/diagnostics")
    assert diagnostics.status_code == 200
    assert diagnostics.json()["storage_backend"] == "sqlite"
    assert Path(diagnostics.json()["storage_path"]).name == "auth.db"
    assert diagnostics.json()["storage_path_source"]
    assert diagnostics.json()["storage_persistence_risk"]


def test_signup_sets_cookie_and_home_bootstraps_from_cookie_only():
    email = f"cookie-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)

    response = client.post(
        "/api/auth/signup",
        json={
            "first_name": "Cookie",
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
    set_cookie = response.headers.get("set-cookie", "")
    assert "docketmint_session=" in set_cookie
    assert "Path=/" in set_cookie
    assert "HttpOnly" in set_cookie
    assert "SameSite=lax" in set_cookie
    assert "Secure" not in set_cookie

    session = client.get("/api/auth/session")
    assert session.status_code == 200
    assert session.json()["authenticated"] is True

    home = client.get("/app/home/")
    assert home.status_code == 200
    assert "Operator Command Center" in home.text
    assert "Turn operator file chaos into a counsel-ready next step." in home.text


def test_public_hosts_share_cookie_domain_and_session_survives_www_to_apex_switch():
    email = f"public-host-{uuid4().hex[:12]}@example.com"
    www_client = TestClient(app, base_url="https://www.docketmint.app")

    response = www_client.post(
        "/api/auth/signup",
        json={
            "first_name": "Public",
            "last_name": "Host",
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
    set_cookie = response.headers.get("set-cookie", "")
    assert "Domain=docketmint.app" in set_cookie
    assert "Secure" in set_cookie
    assert "SameSite=lax" in set_cookie

    apex_client = TestClient(app, base_url="https://docketmint.app")
    for cookie in www_client.cookies.jar:
        apex_client.cookies.jar.set_cookie(cookie)

    session = apex_client.get("/api/auth/session")
    assert session.status_code == 200
    assert session.json()["authenticated"] is True


def test_public_host_session_bootstrap_ignores_legacy_session_header_without_cookie():
    email = f"public-header-{uuid4().hex[:12]}@example.com"
    client = TestClient(app, base_url="https://docketmint.app")
    _signup(client, email)

    session_id = client.cookies.get("docketmint_session")
    assert session_id

    stateless_client = TestClient(app, base_url="https://docketmint.app")
    response = stateless_client.get("/api/auth/session", headers={"x-session-id": session_id})

    assert response.status_code == 200
    assert response.json()["authenticated"] is False


def test_logout_clears_cookie_and_protected_app_redirects_to_sign_in():
    email = f"logout-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)
    _signup(client, email)

    logout = client.post("/api/auth/logout")
    assert logout.status_code == 200
    cleared = logout.headers.get("set-cookie", "")
    assert "docketmint_session=" in cleared
    assert "Max-Age=0" in cleared or "expires=" in cleared.lower()

    after_logout = client.get("/app/home/", follow_redirects=False)
    assert after_logout.status_code == 307
    assert after_logout.headers["location"].startswith("/app/sign-in/")


def test_auth_records_survive_store_reload():
    email = f"reload-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)
    _signup(client, email)

    importlib.reload(auth_store)

    fresh_client = TestClient(app)
    logged_in = fresh_client.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    assert logged_in.status_code == 200
    assert logged_in.json()["authenticated"] is True


def test_render_runtime_defaults_storage_to_disk_mount_when_env_missing(monkeypatch, tmp_path):
    import backend.core.config as config_module

    importlib.reload(config_module)
    disk_mount = tmp_path / "render-disk"
    disk_mount.mkdir(parents=True, exist_ok=True)

    try:
        monkeypatch.delenv("DOCKETMINT_STORAGE_PATH", raising=False)
        monkeypatch.setenv("DOCKETMINT_RENDER_DISK_MOUNT_PATH", str(disk_mount))
        monkeypatch.setenv("RENDER_SERVICE_ID", "srv_test")
        reloaded = importlib.reload(config_module)
        assert reloaded.settings.render_runtime_detected is True
        assert reloaded.settings.storage_path == (disk_mount / "docketmint-storage").resolve()
        assert reloaded.settings.storage_path_source == "auto_render_disk"
        assert reloaded.settings.storage_persistence_risk == "low"
    finally:
        monkeypatch.undo()
        importlib.reload(config_module)


def test_duplicate_signup_returns_existing_email_code():
    email = f"existing-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)
    _signup(client, email)

    duplicate = client.post(
        "/api/auth/signup",
        json={
            "first_name": "Case",
            "last_name": "Owner",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "workspace_name": "",
            "title": "QA",
            "preferred_language": "en",
            "terms_accepted": True,
        },
    )

    assert duplicate.status_code == 409
    assert duplicate.json()["error"]["detail"]["code"] == "email_exists"


def test_wrong_password_returns_clear_error_without_bootstrapping_session():
    email = f"wrong-pass-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)
    _signup(client, email)
    client.post("/api/auth/logout")

    bad_login = client.post("/api/auth/login", json={"email": email, "password": "WrongPassword123!"})
    assert bad_login.status_code == 401
    assert bad_login.json()["error"]["detail"]["code"] == "invalid_credentials"

    session = client.get("/api/auth/session")
    assert session.status_code == 200
    assert session.json()["authenticated"] is False


def test_signup_rejects_whitespace_only_names():
    email = f"whitespace-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)

    bad_first_name = client.post(
        "/api/auth/signup",
        json={
            "first_name": "   ",
            "last_name": "Owner",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "workspace_name": "",
            "title": "QA",
            "preferred_language": "en",
            "terms_accepted": True,
        },
    )

    assert bad_first_name.status_code == 400
    assert bad_first_name.json()["error"]["detail"]["code"] == "first_name_required"

    bad_last_name = client.post(
        "/api/auth/signup",
        json={
            "first_name": "Case",
            "last_name": "   ",
            "email": email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "workspace_name": "",
            "title": "QA",
            "preferred_language": "en",
            "terms_accepted": True,
        },
    )

    assert bad_last_name.status_code == 400
    assert bad_last_name.json()["error"]["detail"]["code"] == "last_name_required"


def test_local_split_origin_auth_cookie_falls_back_to_lax_when_not_secure(monkeypatch):
    import backend.core.config as config_module
    import backend.services.auth_service as auth_service_module

    original_config = config_module
    original_auth = auth_service_module

    try:
        monkeypatch.setenv("DOCKETMINT_SPLIT_ORIGIN_MODE", "1")
        monkeypatch.setenv("DOCKETMINT_SESSION_COOKIE_SECURE", "0")
        monkeypatch.delenv("DOCKETMINT_SESSION_COOKIE_SAMESITE", raising=False)

        reloaded_config = importlib.reload(config_module)
        reloaded_auth = importlib.reload(auth_service_module)
        request = Request(
            {
                "type": "http",
                "method": "GET",
                "scheme": "http",
                "path": "/api/auth/login",
                "query_string": b"",
                "headers": [(b"host", b"localhost:8000")],
                "client": ("127.0.0.1", 8000),
                "server": ("localhost", 8000),
            }
        )

        assert reloaded_config.settings.cookie_samesite == "none"
        assert reloaded_auth._cookie_secure_for_request(request) is False
        assert reloaded_auth._cookie_samesite_for_request(request) == "lax"
    finally:
        monkeypatch.undo()
        importlib.reload(original_config)
        importlib.reload(original_auth)


def test_auth_pages_sanitize_next_redirects_to_internal_app_routes():
    sign_in_js = (Path(__file__).resolve().parents[2] / "assets" / "js" / "sign-in.js").read_text(encoding="utf-8")
    sign_up_js = (Path(__file__).resolve().parents[2] / "assets" / "js" / "sign-up.js").read_text(encoding="utf-8")

    assert "function sanitizeNextUrl(value)" in sign_in_js
    assert "function sanitizeNextUrl(value)" in sign_up_js
    assert "url.origin !== window.location.origin" in sign_in_js
    assert "url.origin !== window.location.origin" in sign_up_js
    assert "!/^\\/app(?:\\/|$)/.test(path)" in sign_in_js
    assert "!/^\\/app(?:\\/|$)/.test(path)" in sign_up_js
    assert "/^\\/app\\/(?:sign-in|sign-up)(?:\\/|$)/.test(path)" in sign_in_js
    assert "/^\\/app\\/(?:sign-in|sign-up)(?:\\/|$)/.test(path)" in sign_up_js


def test_same_origin_auth_runtime_clears_stale_saved_api_base():
    runtime_config = Path(__file__).resolve().parents[2] / "assets" / "js" / "runtime-config.js"
    config_js = Path(__file__).resolve().parents[2] / "assets" / "js" / "config.js"
    api_client_js = Path(__file__).resolve().parents[2] / "assets" / "js" / "api-client.js"
    app_shell_js = Path(__file__).resolve().parents[2] / "assets" / "js" / "app-shell.js"

    runtime_text = runtime_config.read_text(encoding="utf-8")
    config_text = config_js.read_text(encoding="utf-8")
    client_text = api_client_js.read_text(encoding="utf-8")
    shell_text = app_shell_js.read_text(encoding="utf-8")

    assert "publicProxyMode" in runtime_text
    assert "authSameOriginOnly" in runtime_text
    assert "canonicalAuthApiBase" in runtime_text
    assert "apiBaseCandidates: [defaultBase]" in runtime_text
    assert "safeStorageRemove('docketmint.apiBaseUrl')" in config_text
    assert "canonicalAuthApiBase" in config_text
    assert "resolvedApiBaseUrl: defaultBase" in config_text
    assert "pathRequiresSameOriginAuth" in client_text
    assert "if(isSameOriginOnlyMode()){" in client_text
    assert "activeAuthApiBase" in client_text
    assert "return requestAgainstBase('/api', path, options);" in client_text
    assert "isMissingCaseError" in client_text
    assert "ensureValidActiveCaseId" in client_text
    assert "clearActiveCaseId();" in client_text
    assert "await window.DocketMintApi.ensureValidActiveCaseId()" in shell_text


def test_authenticated_users_redirect_away_from_sign_in_and_sign_up_pages():
    email = f"redirect-auth-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)
    _signup(client, email)

    sign_in = client.get("/app/sign-in/", follow_redirects=False)
    sign_up = client.get("/app/sign-up/", follow_redirects=False)

    assert sign_in.status_code == 307
    assert sign_in.headers["location"] == "/app/home/"
    assert sign_up.status_code == 307
    assert sign_up.headers["location"] == "/app/home/"


def test_session_payload_exposes_role_and_permission_flags():
    email = f"session-role-{uuid4().hex[:12]}@example.com"
    client = TestClient(app)
    _signup(client, email)

    session = client.get("/api/auth/session")
    assert session.status_code == 200
    payload = session.json()
    assert payload["authenticated"] is True
    assert payload["membership"]["role"] == "viewer"
    assert payload["authorization"]["role"] == "viewer"
    assert payload["authorization"]["is_admin"] is False
    assert payload["authorization"]["permissions"]["create_cases"] is (not settings.enforce_admin_only_case_creation)
    assert payload["authorization"]["permissions"]["generate_packets"] is (not settings.enforce_admin_only_packet_generation)
    assert payload["commercial"]["plan_code"] == "starter"
    assert payload["commercial"]["billing_mode"] == "workspace_subscription"


def test_account_isolation_keeps_cases_scoped_per_user():
    first = TestClient(app)
    second = TestClient(app)

    first_email = f"user-a-{uuid4().hex[:10]}@example.com"
    second_email = f"user-b-{uuid4().hex[:10]}@example.com"
    first_payload = _signup(first, first_email)
    _signup(second, second_email)

    from backend.models.case_schema import CaseRecord
    from backend.services.case_store import save_case

    case_id = f"case_{uuid4().hex[:10]}"
    save_case(
        CaseRecord(
            id=case_id,
            workspace_id=first_payload["workspace"]["id"],
            created_by_user_id=first_payload["user"]["id"],
            title="Private matter",
            reference="PRIVATE-MATTER",
        )
    )

    first_cases = first.get("/api/cases")
    assert first_cases.status_code == 200
    assert any(item["id"] == case_id for item in first_cases.json())

    second_cases = second.get("/api/cases")
    assert second_cases.status_code == 200
    assert all(item["id"] != case_id for item in second_cases.json())

    second_lookup = second.get(f"/api/cases/{case_id}")
    assert second_lookup.status_code == 404
