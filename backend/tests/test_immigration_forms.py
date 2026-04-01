
from __future__ import annotations

import io
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from fastapi.testclient import TestClient
from reportlab.pdfgen import canvas

from backend.main import app
from backend.tests.auth_test_utils import authenticated_client

client = authenticated_client(app)


def build_fillable_pdf() -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer)
    c.drawString(72, 760, "Sample Immigration Form")
    c.acroForm.textfield(name='given_name', x=72, y=700, width=180, height=22)
    c.acroForm.textfield(name='family_name', x=72, y=660, width=180, height=22)
    c.acroForm.textfield(name='a_number', x=72, y=620, width=180, height=22)
    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.read()


def test_create_immigration_session_and_generate_pdf():
    pdf_bytes = build_fillable_pdf()
    support_text = b"Given Name John\nFamily Name Doe\nA-Number A123456789\nDate of Birth 01/02/1990"
    response = client.post(
        "/api/immigration/forms/sessions",
        files=[
            ("form_file", ("i-000.pdf", pdf_bytes, "application/pdf")),
            ("supporting_files", ("intake.txt", support_text, "text/plain")),
        ],
    )
    assert response.status_code == 200
    session = response.json()
    assert session["form"]["is_fillable"] is True
    assert "given_name" in session["form"]["field_names"]
    assert session["supporting_hints"]["given_name"] == "John"
    assert session["form_profile"]["form_type"] == "generic_uscis_form"
    assert isinstance(session["missing_fields"], list)
    assert session["required_fields"]

    generate = client.post(
        f"/api/immigration/forms/sessions/{session['session_id']}/generate",
        json={"values": {"family_name": "Doe", "given_name": "John", "a_number": "A123456789"}},
    )
    assert generate.status_code == 200
    payload = generate.json()
    assert payload["status"] == "generated"
    assert payload["generated_output"]["download_url"].endswith("/filled_form.pdf")


def test_immigration_route_is_served():
    response = client.get("/app/immigration-forms/")
    assert response.status_code == 200
    assert "Immigration Forms Studio" in response.text
