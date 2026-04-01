
from __future__ import annotations

import os
import socket
import sys
import tempfile
import time
import zipfile
from multiprocessing import Process
from pathlib import Path
from tempfile import NamedTemporaryFile

import httpx
from docx import Document

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
DATA_DIR = ROOT / "backend" / "sample_inputs"
from backend.tests.auth_test_utils import signup_httpx_client

XpressMixedFiles = [
    "Cases to Steven Citifuel.xlsx",
    "Cases to Steven TSS.xlsx",
    "XPRESS GLOBAL TRANSPORTATION.pdf",
    "XPRESS_GLOBAL_TRANSPORTATIONcom_Cube_Systems_LLCorg_Cube_Systems.pdf",
    "XPRESS_GLOBAL_TRANSPORTATIONcom_Cube_Systems_LLCorg_Cube_Systems (2).pdf",
    "XPRESS_GLOBAL_TRANSPORTATIONcom_Cube_Systems_LLCorg_Cube_Systems (3).pdf",
]


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def _serve(port: int, storage_path: str) -> None:
    os.environ["DOCKETMINT_STORAGE_PATH"] = storage_path
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    import uvicorn
    from main import app

    uvicorn.run(app, host="127.0.0.1", port=port, log_level="error", access_log=False)


def _wait_for_ready(base_url: str, timeout: float = 20.0) -> None:
    started = time.time()
    last_error: Exception | None = None
    while time.time() - started < timeout:
        try:
            response = httpx.get(base_url + "/api/health", timeout=2.0)
            if response.status_code == 200:
                return
        except Exception as exc:
            last_error = exc
        time.sleep(0.25)
    raise AssertionError(f"Live server did not become ready at {base_url}: {last_error}")


def _upload_files(client: httpx.Client, case_id: str, names: list[str]) -> None:
    files = []
    handles = []
    try:
        for name in names:
            path = DATA_DIR / name
            handle = path.open("rb")
            handles.append(handle)
            content_type = "application/pdf" if path.suffix.lower() == ".pdf" else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            files.append(("files", (name, handle, content_type)))
        response = client.post(f"/api/cases/{case_id}/source-files", files=files)
        assert response.status_code == 200
    finally:
        for handle in handles:
            handle.close()


def test_same_origin_live_server_roundtrip(tmp_path):
    storage_path = tmp_path / "storage"
    port = _free_port()
    base_url = f"http://127.0.0.1:{port}"
    process = Process(target=_serve, args=(port, str(storage_path)), daemon=True)
    client = None
    process.start()
    try:
        _wait_for_ready(base_url)
        client = signup_httpx_client(base_url)

        for path in ["/api/health", "/api/system-status", "/api/cases?limit=1", "/app/new-case/"]:
            response = client.get(path)
            assert response.status_code == 200

        create = client.post("/api/cases", json={"matter_name": "Xpress live roundtrip"})
        assert create.status_code == 200
        case_id = create.json()["id"]

        _upload_files(client, case_id, XpressMixedFiles)

        processed = client.post(f"/api/cases/{case_id}/process")
        assert processed.status_code == 200
        extracted = processed.json()["extracted_case_data"]
        assert processed.json()["status"] == "blocked"
        assert extracted["matter_consistency"]["status"] == "blocked"
        assert extracted["defendant_entity"]["party_name"] == "XPRESS GLOBAL TRANSPORTATION"
        assert extracted["amount_reconciliation"]["approved_total"] == "110651.07"

        split = client.post(f"/api/cases/{case_id}/split-by-debtor")
        assert split.status_code == 200
        xpress_case = next(item["case_id"] for item in split.json()["created_cases"] if "XPRESS" in item["debtor_name"].upper())

        child_processed = client.post(f"/api/cases/{xpress_case}/process")
        assert child_processed.status_code == 200
        child_extracted = child_processed.json()["extracted_case_data"]
        assert child_extracted["matter_consistency"]["status"] == "pass"
        assert child_extracted["amount_reconciliation"]["approved_total"] == "110651.07"

        review = client.patch(
            f"/api/cases/{xpress_case}/review",
            json={"venue_county": "Orange", "governing_law": "Florida"},
        )
        assert review.status_code == 200

        sunbiz = client.post(f"/api/sunbiz/cases/{xpress_case}/lookup")
        assert sunbiz.status_code == 200
        sunbiz_payload = sunbiz.json()
        assert sunbiz_payload["provider_status"] == "unavailable"
        assert sunbiz_payload["official_record_available"] is False
        assert sunbiz_payload["registered_agent_name"] is None

        memo = client.get(f"/api/sunbiz/cases/{xpress_case}/report.pdf")
        assert memo.status_code == 200
        assert "application/pdf" in (memo.headers.get("content-type") or "")

        blocked = client.post(
            f"/api/generate/{xpress_case}?wait=true",
            json={"selected_document_types": ["summons_company"]},
        )
        assert blocked.status_code == 200
        blocked_docs = blocked.json()["generated_documents"]
        assert len(blocked_docs) == 1
        assert blocked_docs[0]["document_type"] == "summons_company"
        assert blocked_docs[0]["status"] == "blocked"
        assert "registered-agent" in (blocked_docs[0]["blocking_reason"] or "").lower()

        generate = client.post(
            f"/api/generate/{xpress_case}?wait=true",
            json={"selected_document_types": ["complaint", "debt_calculation_sheet"]},
        )
        assert generate.status_code == 200
        packet = generate.json()
        docs = packet["generated_documents"]
        assert [doc["document_type"] for doc in docs] == ["complaint", "debt_calculation_sheet"]
        assert all(doc["status"] == "generated" for doc in docs)

        complaint = next(doc for doc in docs if doc["document_type"] == "complaint")
        complaint_response = client.get(complaint["download_url"])
        assert complaint_response.status_code == 200
        with NamedTemporaryFile(suffix=".docx", delete=False) as tmp_docx:
            tmp_docx.write(complaint_response.content)
            tmp_docx.flush()
            tmp_docx_path = tmp_docx.name
        try:
            text = "\n".join(paragraph.text for paragraph in Document(tmp_docx_path).paragraphs)
        finally:
            Path(tmp_docx_path).unlink(missing_ok=True)
        assert "Kambuljon Kazakov" in text
        assert text.count("WHEREFORE") == 1

        zip_response = client.get(packet["zip_download_url"])
        assert zip_response.status_code == 200
        assert any(
            item in (zip_response.headers.get("content-type") or "")
            for item in ["application/zip", "application/x-zip-compressed"]
        )
        with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp_zip:
            tmp_zip.write(zip_response.content)
            tmp_zip.flush()
            tmp_zip_path = tmp_zip.name
        try:
            with zipfile.ZipFile(tmp_zip_path, "r") as archive:
                names = archive.namelist()
        finally:
            Path(tmp_zip_path).unlink(missing_ok=True)
        assert any(name.endswith("02 Complaint.docx") for name in names)
        assert any(name.endswith("09 Debt Calculation Sheet.docx") for name in names)
        assert not any(name.endswith("05 Summons Company.docx") for name in names)

        downloads = client.get(f"/api/downloads/cases/{xpress_case}")
        assert downloads.status_code == 200
        archive_entries = downloads.json()["packet_archive"]
        assert archive_entries[0]["version_number"] == 2
        assert archive_entries[0]["release_state"] == "ready_for_review"
        assert archive_entries[0]["review_required"] is True
        assert any(item["version_number"] == 1 for item in archive_entries)

        activity = client.get(f"/api/cases/{xpress_case}/activity")
        assert activity.status_code == 200
        event_types = [event["event_type"] for event in activity.json()["events"]]
        assert any(item in event_types for item in ["sunbiz.lookup.completed", "sunbiz.lookup.unavailable", "sunbiz.lookup.no_match"])
        assert "generation.success" in event_types
    finally:
        try:
            client.close()
        except Exception:
            pass
        process.terminate()
        process.join(timeout=5.0)
