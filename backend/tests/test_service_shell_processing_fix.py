
from fastapi.testclient import TestClient
from backend.main import app
from backend.tests.auth_test_utils import authenticated_client

client = authenticated_client(app)

def test_legacy_uploaded_files_redirects():
    response = client.get("/app/uploaded-files/?case=case_test", follow_redirects=False)
    assert response.status_code in (307, 302)
    assert "/app/workspace/" in response.headers["location"]

def test_legacy_entity_check_redirects():
    response = client.get("/app/entity-check/?case=case_test", follow_redirects=False)
    assert response.status_code in (307, 302)
    assert "/app/entity-verification/" in response.headers["location"]

def test_module_pages_exist():
    expectations = {
        "/app/contract-intelligence/": "Upload contract files",
        "/app/best-contract-builder/": "Upload contract files",
        "/app/venue-engine/": "Current matter",
        "/app/entity-verification/": "Current matter",
        "/app/forms-autofill/": "Current matter",
        "/app/pre-suit-demand/": "Current matter",
        "/app/evidence-audit/": "Current matter",
        "/app/damages-calculator/": "Current matter",
    }
    for path, marker in expectations.items():
        response = client.get(path)
        assert response.status_code == 200
        assert marker in response.text

def test_process_requires_source_files():
    response = client.post("/api/cases/case_missing/process")
    assert response.status_code in (404, 400)
