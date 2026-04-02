"""POST /api/intakes — Create a new matter from intake form."""

import os
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, Form, UploadFile

from ..db import get_conn
from ..models.intake import IntakeResponse
from ..services.checklist import generate_initial_checklist
from ..services.magic_link import build_magic_link, generate_token
from ..services.triage import compute_triage_score, generate_matter_id

router = APIRouter()

UPLOADS_DIR = Path(os.getenv("VCX_UPLOADS_DIR", "uploads"))


def _next_step_text(urgency: str) -> str:
    if urgency in ("Same day / urgent", "24 hours"):
        return "Priority review. Expect contact within 24 hours."
    if urgency == "48 hours":
        return "Review will begin within 48 business hours."
    return "Review will begin within 2-3 business days."


@router.post("/api/intakes", status_code=201, response_model=IntakeResponse)
async def create_intake(
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    state: str = Form(...),
    service_type: str = Form(...),
    urgency: str = Form("Standard"),
    message: str = Form(...),
    client_type: str = Form("company"),
    company: str = Form(None),
    company_size: str = Form(None),
    annual_revenue: str = Form(None),
    accounts_receivable: str = Form(None),
    agency_usage: str = Form(None),
    attachment: UploadFile = File(None),
):
    with get_conn() as conn:
        # 1. Organization (if company)
        org_id = None
        if client_type == "company" and company:
            org_id = str(uuid.uuid4())
            conn.execute(
                """INSERT INTO organizations
                   (id, name, size, annual_revenue, accounts_receivable, agency_usage)
                   VALUES (?,?,?,?,?,?)""",
                (org_id, company, company_size, annual_revenue,
                 accounts_receivable, agency_usage),
            )

        # 2. Contact (upsert by email)
        existing = conn.execute(
            "SELECT id FROM contacts WHERE email=?", (email,)
        ).fetchone()
        if existing:
            contact_id = existing["id"]
            conn.execute(
                """UPDATE contacts SET full_name=?, phone=?, state=?,
                   client_type=?, org_id=COALESCE(?,org_id), updated_at=?
                   WHERE id=?""",
                (full_name, phone, state, client_type, org_id,
                 datetime.now().isoformat(), contact_id),
            )
        else:
            contact_id = str(uuid.uuid4())
            conn.execute(
                """INSERT INTO contacts
                   (id, org_id, full_name, email, phone, state, client_type)
                   VALUES (?,?,?,?,?,?,?)""",
                (contact_id, org_id, full_name, email, phone, state, client_type),
            )

        # 3. Matter
        matter_id = generate_matter_id(conn)
        magic_token = generate_token()
        has_attachment = attachment is not None and attachment.filename
        triage_score = compute_triage_score(
            urgency, service_type, bool(has_attachment), client_type
        )

        conn.execute(
            """INSERT INTO matters
               (id, contact_id, org_id, service_type, urgency, message,
                client_type, status, triage_score, magic_token)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (matter_id, contact_id, org_id, service_type, urgency, message,
             client_type, "intake_received", triage_score, magic_token),
        )

        # 4. Status events
        now = datetime.now().isoformat()
        conn.execute(
            """INSERT INTO status_events (matter_id, old_status, new_status, note, created_at)
               VALUES (?,?,?,?,?)""",
            (matter_id, None, "intake_received", "Intake submitted via web form", now),
        )
        conn.execute(
            """INSERT INTO status_events (matter_id, old_status, new_status, note, created_at)
               VALUES (?,?,?,?,?)""",
            (matter_id, "intake_received", "triage",
             f"Auto-scored at {triage_score}", now),
        )
        conn.execute(
            "UPDATE matters SET status='triage' WHERE id=?", (matter_id,)
        )

        # 5. File upload
        if has_attachment:
            matter_dir = UPLOADS_DIR / matter_id
            matter_dir.mkdir(parents=True, exist_ok=True)
            file_id = str(uuid.uuid4())
            safe_name = f"{file_id}_{attachment.filename}"
            file_path = matter_dir / safe_name
            content = await attachment.read()
            file_path.write_bytes(content)

            conn.execute(
                """INSERT INTO documents
                   (id, matter_id, filename, original_name, content_type,
                    size_bytes, storage_path)
                   VALUES (?,?,?,?,?,?,?)""",
                (file_id, matter_id, safe_name, attachment.filename,
                 attachment.content_type, len(content), str(file_path)),
            )

        # 6. Checklist
        checklist_items = generate_initial_checklist(
            service_type, bool(has_attachment), client_type
        )
        checklist_out = []
        for item in checklist_items:
            cid = str(uuid.uuid4())
            is_done = 1 if item.get("pre_complete") else 0
            conn.execute(
                """INSERT INTO checklists
                   (id, matter_id, label, sort_order, is_complete, completed_at)
                   VALUES (?,?,?,?,?,?)""",
                (cid, matter_id, item["label"], item["sort_order"],
                 is_done, now if is_done else None),
            )
            checklist_out.append({
                "id": cid,
                "label": item["label"],
                "is_complete": bool(is_done),
            })

    magic_link = build_magic_link(matter_id, magic_token)

    return IntakeResponse(
        ok=True,
        matter_id=matter_id,
        magic_link=magic_link,
        status="triage",
        triage_score=triage_score,
        checklist=checklist_out,
        next_step=_next_step_text(urgency),
    )
