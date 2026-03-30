from __future__ import annotations

import json
import os
import socket
import sys
import time
from multiprocessing import Process
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parents[1]
SAMPLE_DIR = ROOT / "backend" / "sample_inputs"
REPORT_PATH = ROOT / "SMOKE_TEST_REPORT.txt"

sys.path.insert(0, str(ROOT))
from backend.tests.auth_test_utils import signup_httpx_client


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def serve(port: int, storage_path: str) -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    os.environ["DOCKETMINT_STORAGE_PATH"] = storage_path
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    import uvicorn
    from main import app

    uvicorn.run(app, host="127.0.0.1", port=port, log_level="error", access_log=False)


def wait_for(url: str, timeout: float = 20.0) -> None:
    started = time.time()
    while time.time() - started < timeout:
        try:
            response = httpx.get(url, timeout=2.0)
            if response.status_code == 200:
                return
        except Exception:
            pass
        time.sleep(0.25)
    raise RuntimeError(f"Timed out waiting for {url}")


def main() -> None:
    storage_root = ROOT / "storage_smoke"
    if storage_root.exists():
        import shutil
        shutil.rmtree(storage_root)
    storage_root.mkdir(parents=True, exist_ok=True)

    port = free_port()
    base = f"http://127.0.0.1:{port}"
    process = Process(target=serve, args=(port, str(storage_root)), daemon=True)
    process.start()
    client = None
    report = {
        "base_url": base,
        "steps": [],
    }
    try:
        wait_for(base + "/api/health")
        report["steps"].append("1. /api/health reachable")

        client = signup_httpx_client(base)
        report["steps"].append("2. Signup and authenticated session bootstrap succeeded")

        for path in [
            "/api/system-status",
            "/api/platform/services",
            "/api/cases?limit=5",
            "/app/workspace/",
            "/app/downloads/",
            "/app/contract-intelligence/",
            "/app/template-library/",
        ]:
            response = client.get(path, timeout=15.0)
            response.raise_for_status()
        report["steps"].append("3. System, services, case list, workspace, downloads, and key module routes reachable")

        create = client.post(
            "/api/cases",
            json={
                "matter_name": "Counterparty acceptance packet",
                "plaintiff_name": "Client Company LLC",
                "defendant_name": "Counterparty LLC",
            },
            timeout=10.0,
        )
        create.raise_for_status()
        case_id = create.json()["id"]
        report["case_id"] = case_id
        report["steps"].append("4. Matter created")

        listed_before_upload = client.get("/api/cases?limit=20", timeout=15.0)
        listed_before_upload.raise_for_status()
        assert any(item["id"] == case_id for item in listed_before_upload.json())
        report["steps"].append("5. Matter appears in /api/cases")

        with open(SAMPLE_DIR / "Counterparty LLC.pdf", "rb") as contract_fh, open(SAMPLE_DIR / "Counterparty LLC Invoices.xlsx", "rb") as ledger_fh:
            upload = client.post(
                f"/api/cases/{case_id}/source-files",
                files=[
                    ("files", ("Counterparty LLC.pdf", contract_fh, "application/pdf")),
                    ("files", ("Counterparty LLC Invoices.xlsx", ledger_fh, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")),
                ],
                timeout=30.0,
            )
        upload.raise_for_status()
        report["steps"].append("6. Source PDF and invoice Excel uploaded")

        uploaded_case = client.get(f"/api/cases/{case_id}", timeout=15.0)
        uploaded_case.raise_for_status()
        uploaded_case_json = uploaded_case.json()
        assert len(uploaded_case_json["source_files"]) == 2
        report["uploaded_files"] = [
            {
                "name": item.get("original_filename"),
                "file_type": item.get("file_type"),
                "active": not bool(item.get("excluded_from_active_matter")),
            }
            for item in uploaded_case_json["source_files"]
        ]
        report["steps"].append("7. Uploaded files persisted in case state")

        processed = client.post(f"/api/cases/{case_id}/process", timeout=30.0)
        processed.raise_for_status()
        processed_json = processed.json()
        extracted = processed_json["extracted_case_data"]
        report["processing_snapshot"] = {
            "plaintiff": extracted["plaintiff"]["party_name"],
            "defendant": extracted["defendant_entity"]["party_name"],
            "county": extracted["venue"]["venue_county"],
            "court_level": extracted["florida_court"]["court_division_label"],
            "amount_in_controversy": extracted["amount_in_controversy"],
            "invoice_count": extracted["invoice_summary"]["invoice_count"],
        }
        report["process_status"] = processed_json["status"]
        report["process_blockers"] = processed_json["client_snapshot"]["blockers"]
        report["steps"].append("8. Processing completed and extracted case data is populated")

        progress_before_generation = client.get(f"/api/generate/{case_id}/progress", timeout=15.0)
        progress_before_generation.raise_for_status()
        report["generation_progress_before"] = progress_before_generation.json()["generation_progress"]["status"]

        generated = client.post(
            f"/api/generate/{case_id}?wait=true",
            json={"selected_document_types": ["complaint", "debt_calculation_sheet"]},
            timeout=60.0,
        )
        generated.raise_for_status()
        gen_json = generated.json()
        docs = gen_json["generated_documents"]
        report["generated_count"] = len([doc for doc in docs if doc["status"] == "generated"])
        report["document_statuses"] = [{"type": doc["document_type"], "status": doc["status"]} for doc in docs]
        report["generated_names"] = [doc["document_name"] for doc in docs if doc["status"] == "generated"]
        report["zip_download_url"] = gen_json["zip_download_url"]
        report["generation_progress_after"] = gen_json["generation_progress"]["status"]
        report["steps"].append("9. Selected documents generated with individual DOCX outputs and ZIP")

        first_doc = next(doc for doc in docs if doc["status"] == "generated")
        doc_resp = client.get(first_doc["download_url"], timeout=30.0)
        doc_resp.raise_for_status()
        report["first_doc_download"] = {
            "name": first_doc["document_name"],
            "status_code": doc_resp.status_code,
            "content_type": doc_resp.headers.get("content-type"),
            "bytes": len(doc_resp.content),
        }
        report["steps"].append("10. Individual DOCX download succeeded")

        zip_resp = client.get(gen_json["zip_download_url"], timeout=30.0)
        zip_resp.raise_for_status()
        report["zip_download"] = {
            "status_code": zip_resp.status_code,
            "content_type": zip_resp.headers.get("content-type"),
            "bytes": len(zip_resp.content),
        }
        report["steps"].append("11. Full ZIP download succeeded")

        empty_case = client.post("/api/cases", json={"matter_name": "Negative-path acceptance"}, timeout=10.0)
        empty_case.raise_for_status()
        blocked_generate = client.post(
            f"/api/generate/{empty_case.json()['id']}?wait=true",
            json={"selected_document_types": ["complaint"]},
            timeout=20.0,
        )
        assert blocked_generate.status_code == 400
        report["error_path"] = blocked_generate.json()
        report["steps"].append("12. Error path returns structured blocked payload for empty matter")

        REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    finally:
        try:
            if client is not None:
                client.close()
        except Exception:
            pass
        if process.is_alive():
            process.terminate()
            process.join(timeout=5)


if __name__ == "__main__":
    main()
