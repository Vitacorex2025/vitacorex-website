from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.main import app
from backend.tests.auth_test_utils import authenticated_client


def test_contract_intelligence_standalone_session_flow():
    client = authenticated_client(app)
    contract_text = (
        b"This agreement is governed by Florida law. Venue is Miami-Dade County. "
        b"The guarantor personally guarantees payment. Attorneys' fees and late fees apply."
    )

    create_response = client.post(
        "/api/contract-intelligence/sessions",
        files=[("contract_files", ("agreement.txt", contract_text, "text/plain"))],
    )
    assert create_response.status_code == 200, create_response.text
    session = create_response.json()
    session_id = session["session_id"]

    analyze_response = client.post(f"/api/contract-intelligence/sessions/{session_id}/analyze")
    assert analyze_response.status_code == 200, analyze_response.text
    analyzed = analyze_response.json()
    assert analyzed["review"]["findings"]

    draft_response = client.post(f"/api/contract-intelligence/sessions/{session_id}/generate-draft")
    assert draft_response.status_code == 200, draft_response.text
    generated = draft_response.json()
    assert generated["generated_output"]["revised_contract_download_url"]
    assert generated["generated_output"]["change_memo_download_url"]

    list_response = client.get("/api/contract-intelligence/sessions")
    assert list_response.status_code == 200
    assert any(item["session_id"] == session_id for item in list_response.json()["sessions"])

    delete_response = client.delete(f"/api/contract-intelligence/sessions/{session_id}")
    assert delete_response.status_code == 200, delete_response.text

    missing_response = client.get(f"/api/contract-intelligence/sessions/{session_id}")
    assert missing_response.status_code == 404
