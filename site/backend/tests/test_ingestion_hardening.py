from __future__ import annotations

import io
from pathlib import Path

from fastapi.testclient import TestClient
from openpyxl import Workbook
from reportlab.pdfgen import canvas

from backend.main import app
from backend.services import pdf_extractor
from backend.tests.auth_test_utils import authenticated_client


def _create_case(client: TestClient, title: str) -> str:
    response = client.post(
        "/api/cases",
        json={"matter_name": title, "plaintiff_name": "Cube Systems LLC", "defendant_name": "Single Matter LLC"},
    )
    assert response.status_code == 200, response.text
    return response.json()["id"]


def _pdf_bytes(lines: list[str]) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer)
    y = 780
    for line in lines:
        pdf.drawString(72, y, line)
        y -= 18
    pdf.save()
    return buffer.getvalue()


def _blank_pdf_bytes() -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer)
    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


def _workbook_bytes(rows: list[list[object]], *, extra_sheet: bool = False) -> bytes:
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Aging Report"
    sheet.append(["Organization", "Company", "Owner Name", "Invoice Number", "Invoice Date", "Due Date", "Remaining Amount"])
    for row in rows:
        sheet.append(row)
    if extra_sheet:
        second = workbook.create_sheet("Notes")
        second.append(["Notes"])
        second.append(["Ignore this worksheet."])
    buffer = io.BytesIO()
    workbook.save(buffer)
    return buffer.getvalue()


def _csv_bytes(rows: list[list[object]]) -> bytes:
    lines = [
        "Organization,Company,Owner Name,Company Email,Invoice Number,Invoice Date,Due Date,Remaining Amount"
    ]
    for row in rows:
        lines.append(",".join(str(item or "") for item in row))
    return ("\n".join(lines) + "\n").encode("utf-8")


def test_pdf_ocr_fallback_runs_only_when_direct_text_is_near_empty(tmp_path: Path, monkeypatch):
    blank_path = tmp_path / "scanned.pdf"
    blank_path.write_bytes(_blank_pdf_bytes())

    ocr_calls: list[str] = []

    def fake_ocr(path: Path):
        ocr_calls.append(path.name)
        return "Recovered OCR text for guaranty.", []

    monkeypatch.setattr(pdf_extractor, "_ocr_text_from_pdf", fake_ocr)
    scanned_result = pdf_extractor.extract_pdf_text(blank_path)
    assert scanned_result["method"] == "ocr_fallback"
    assert scanned_result["quality_report"]["ocr_attempted"] is True
    assert scanned_result["quality_report"]["ocr_used"] is True
    assert "Recovered OCR text" in scanned_result["text"]
    assert ocr_calls == ["scanned.pdf"]

    text_path = tmp_path / "contract.pdf"
    text_path.write_bytes(
        _pdf_bytes(
            [
                "Cube Systems LLC",
                "Agreement",
                "The Parties agree that the venue to enforce this Agreement is Orange County, Florida.",
                "This agreement is governed by and construed in accordance with the laws of the State of Florida.",
            ]
        )
    )

    ocr_calls.clear()
    direct_result = pdf_extractor.extract_pdf_text(text_path)
    assert direct_result["method"] == "direct_text"
    assert direct_result["quality_report"]["ocr_attempted"] is False
    assert ocr_calls == []


def test_upload_source_files_returns_per_file_qa_and_normalized_evidence():
    client = authenticated_client(app)
    case_id = _create_case(client, "Sprint 2 upload QA")

    contract_pdf = _pdf_bytes(
        [
            "Cube Systems LLC",
            "Agreement",
            "between Cube Systems LLC (the Club Organizer) and Single Matter LLC (the Customer)",
            "The Parties agree that the venue to enforce this Agreement is Orange County, Florida.",
            "This agreement is governed by and construed in accordance with the laws of the State of Florida.",
        ]
    )
    invoice_pdf = _pdf_bytes(
        [
            "Cube Systems LLC",
            "Invoice INV-100",
            "Invoice Date 2025-02-20",
            "Due Date 2025-03-01",
            "Total amount due $ 1200.00",
            "SINGLE MATTER LLC",
            "Address: 123 Main St Orlando, FL 32801",
        ]
    )
    guaranty_pdf = _pdf_bytes(
        [
            "Personal Guarantee Agreement",
            "I, Jane Guarantor (Full name of Guarantor)",
            "personally guarantee the obligations of Single Matter LLC.",
        ]
    )
    workbook_bytes = _workbook_bytes(
        [
            ["Cube Systems LLC", "Single Matter LLC", "Jane Guarantor", "INV-100", "2025-02-20", "2025-03-01", "1200.00"],
        ],
        extra_sheet=True,
    )

    upload = client.post(
        f"/api/cases/{case_id}/source-files",
        files=[
            ("files", ("master-services-agreement.pdf", io.BytesIO(contract_pdf), "application/pdf")),
            ("files", ("invoice-100.pdf", io.BytesIO(invoice_pdf), "application/pdf")),
            ("files", ("personal-guaranty.pdf", io.BytesIO(guaranty_pdf), "application/pdf")),
            ("files", ("aging-report.xlsx", io.BytesIO(workbook_bytes), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")),
        ],
    )
    assert upload.status_code == 200, upload.text
    stored_files = {item["original_filename"]: item for item in upload.json()["stored_files"]}

    contract = stored_files["master-services-agreement.pdf"]
    assert contract["extraction_status"] in {"extracted_successfully", "partially_extracted"}
    assert contract["normalized_evidence"]["document_type"] == "contract"
    assert any(fact["field"] == "governing_law" for fact in contract["normalized_evidence"]["facts"])

    invoice = stored_files["invoice-100.pdf"]
    assert invoice["normalized_evidence"]["document_type"] == "invoice"
    assert invoice["normalized_evidence"]["identifiers"]["invoice_numbers"] == ["INV-100"]

    guaranty = stored_files["personal-guaranty.pdf"]
    assert guaranty["normalized_evidence"]["document_type"] == "guaranty"
    assert guaranty["normalized_evidence"]["parties"]["guarantors"] == ["Jane Guarantor"]

    workbook = stored_files["aging-report.xlsx"]
    assert workbook["normalized_evidence"]["document_type"] == "aging_report"
    assert workbook["parsed_payload"]["selected_worksheets"] == ["Aging Report"]
    assert workbook["parsed_payload"]["parser_report"]["selected_worksheet_count"] == 1
    assert workbook["parsed_payload"]["parser_report"]["ignored_worksheet_count"] == 1
    assert len(workbook["normalized_evidence"]["worksheet_report"]) == 2


def test_excel_aging_report_marks_ambiguous_rows_as_uncertain(tmp_path: Path):
    workbook_path = tmp_path / "ambiguous-aging.xlsx"
    workbook_path.write_bytes(
        _workbook_bytes(
            [
                ["Cube Systems LLC", "Single Matter LLC", "Jane Guarantor", "INV-100", "2025-02-20", "2025-03-01", "9,301,33"],
            ]
        )
    )

    from backend.services.file_ingestion import analyze_source_file

    analysis = analyze_source_file(workbook_path, workbook_path.name, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    assert analysis["extraction_status"] in {"partially_extracted", "failed"}
    evidence = analysis["normalized_evidence"]
    assert evidence["document_type"] == "aging_report"
    assert evidence["uncertain_fields"]
    assert "ambiguous" in str(evidence["uncertain_fields"][0]["reason"]).lower()


def test_csv_aging_report_supports_provenance_and_truth_summary():
    client = authenticated_client(app)
    case_id = _create_case(client, "Sprint 2 csv truth engine")

    contract_pdf = _pdf_bytes(
        [
            "Cube Systems LLC",
            "Agreement",
            "between Cube Systems LLC (the Club Organizer) and Single Matter LLC (the Customer)",
            "Services delivered and accepted on 2025-02-21.",
            "The Parties agree that the venue to enforce this Agreement is Orange County, Florida.",
            "This agreement is governed by and construed in accordance with the laws of the State of Florida.",
        ]
    )
    invoice_pdf = _pdf_bytes(
        [
            "Cube Systems LLC",
            "Invoice INV-CSV-100",
            "Invoice Date 2025-02-20",
            "Due Date 2025-03-01",
            "Total amount due $ 1200.00",
            "SINGLE MATTER LLC",
            "Address: 123 Main St Orlando, FL 32801",
        ]
    )
    csv_payload = _csv_bytes(
        [
            ["Cube Systems LLC", "Single Matter LLC", "", "collections@singlematter.com", "INV-CSV-100", "2025-02-20", "2025-03-01", "1200.00"],
        ]
    )

    upload = client.post(
        f"/api/cases/{case_id}/source-files",
        files=[
            ("files", ("master-services-agreement.pdf", io.BytesIO(contract_pdf), "application/pdf")),
            ("files", ("invoice-100.pdf", io.BytesIO(invoice_pdf), "application/pdf")),
            ("files", ("aging-report.csv", io.BytesIO(csv_payload), "text/csv")),
        ],
    )
    assert upload.status_code == 200, upload.text
    stored_files = {item["original_filename"]: item for item in upload.json()["stored_files"]}
    csv_file = stored_files["aging-report.csv"]
    assert csv_file["file_type"] == "invoice_csv"
    assert csv_file["extraction_method"] == "csv_parser"
    assert csv_file["normalized_evidence"]["document_type"] == "aging_report"
    assert csv_file["normalized_evidence"]["provenance"]["balance_due"][0]["source_file"] == "aging-report.csv"
    assert csv_file["normalized_evidence"]["provenance"]["balance_due"][0]["source_sheet"] == "CSV Import"

    processed = client.post(f"/api/cases/{case_id}/process")
    assert processed.status_code == 200, processed.text
    truth = processed.json()["extracted_case_data"]["recovery_truth"]
    assert truth["supported_balance"] == "1200.00"
    assert truth["matched_invoice_count"] == 1
    assert truth["reconciliation_summary"]["matched_invoice_numbers"] == ["INV-CSV-100"]
    assert truth["evidence_coverage"]["contract_present"] is True
    assert truth["evidence_coverage"]["performance_proof_present"] is True
    assert truth["route_status"] == "ready_for_payment_plan"
    assert "low_balance_recovery_fit" in truth["route_reason_codes"]
    assert any(item["field"] == "invoice_number" and item["source_file"] == "invoice-100.pdf" for item in truth["source_provenance"])
    assert any(item["field"] == "balance_due" and item["source_file"] == "aging-report.csv" for item in truth["source_provenance"])


def test_multi_entity_workbook_is_flagged_in_file_qa_and_blocks_processing():
    client = authenticated_client(app)
    case_id = _create_case(client, "Sprint 2 multi-entity workbook")

    workbook_bytes = _workbook_bytes(
        [
            ["Cube Systems LLC", "Single Matter LLC", "", "INV-100", "2025-02-20", "2025-03-01", "100.00"],
            ["Cube Systems LLC", "Other Debtor LLC", "", "INV-200", "2025-02-21", "2025-03-02", "150.00"],
        ]
    )

    upload = client.post(
        f"/api/cases/{case_id}/source-files",
        files=[
            ("files", ("multi-debtor-aging.xlsx", io.BytesIO(workbook_bytes), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")),
        ],
    )
    assert upload.status_code == 200, upload.text
    workbook = upload.json()["stored_files"][0]
    assert workbook["extraction_status"] == "partially_extracted"
    assert workbook["parsed_payload"]["parser_report"]["multi_entity_conflict"] is True
    assert len(workbook["parsed_payload"]["selection_candidates"]) == 2
    assert any("multiple debtor entities" in message.lower() for message in workbook["normalized_evidence"]["conflicts"])

    processed = client.post(f"/api/cases/{case_id}/process")
    assert processed.status_code == 200, processed.text
    payload = processed.json()
    assert payload["status"] == "blocked"
    assert "This upload contains multiple debtor matters. Split them into separate cases." in payload["extracted_case_data"]["matter_consistency"]["blockers"]


def test_anchor_debtor_allows_matching_rows_from_multi_entity_workbook():
    client = authenticated_client(app)
    case_id = _create_case(client, "Anchor-based workbook filtering")

    contract_pdf = _pdf_bytes(
        [
            "Cube Systems LLC",
            "Agreement",
            "between Cube Systems LLC (the Club Organizer) and Single Matter LLC (the Customer)",
            "The Parties agree that the venue to enforce this Agreement is Orange County, Florida.",
            "This agreement is governed by and construed in accordance with the laws of the State of Florida.",
        ]
    )
    invoice_pdf = _pdf_bytes(
        [
            "Cube Systems LLC",
            "Invoice INV-100",
            "Invoice Date 2025-02-20",
            "Due Date 2025-03-01",
            "Total amount due $ 100.00",
            "SINGLE MATTER LLC",
            "Address: 123 Main St Orlando, FL 32801",
        ]
    )
    workbook_bytes = _workbook_bytes(
        [
            ["Cube Systems LLC", "Single Matter LLC", "", "INV-100", "2025-02-20", "2025-03-01", "100.00"],
            ["Cube Systems LLC", "Other Debtor LLC", "", "INV-200", "2025-02-21", "2025-03-02", "150.00"],
        ]
    )

    upload = client.post(
        f"/api/cases/{case_id}/source-files",
        files=[
            ("files", ("master-services-agreement.pdf", io.BytesIO(contract_pdf), "application/pdf")),
            ("files", ("invoice-100.pdf", io.BytesIO(invoice_pdf), "application/pdf")),
            ("files", ("multi-debtor-aging.xlsx", io.BytesIO(workbook_bytes), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")),
        ],
    )
    assert upload.status_code == 200, upload.text
    stored_files = {item["original_filename"]: item for item in upload.json()["stored_files"]}
    workbook = stored_files["multi-debtor-aging.xlsx"]
    assert workbook["extraction_status"] == "partially_extracted"
    assert workbook["parsed_payload"]["parser_report"]["multi_entity_conflict"] is True

    processed = client.post(f"/api/cases/{case_id}/process")
    assert processed.status_code == 200, processed.text
    payload = processed.json()
    extraction = payload["extracted_case_data"]

    assert extraction["matter_consistency"]["status"] == "pass"
    assert extraction["defendant_entity"]["party_name"] == "Single Matter LLC"
    assert extraction["amount_reconciliation"]["source_spreadsheet_total"] == "100.00"
    assert extraction["amount_reconciliation"]["approved_reconciled_total"] == "100.00"
    assert "multi-debtor-aging.xlsx (contains unrelated debtors)" in extraction["matter_consistency"]["excluded_sources"]
    assert any("using only the rows that match" in item.lower() for item in extraction["matter_consistency"]["warnings"])
