"""POST /api/intakes — Create a new matter from intake form."""

import os
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, Form, Request, UploadFile

from ..db import get_conn
from ..models.intake import IntakeResponse
from ..rate_limit import limiter
from ..services.checklist import generate_initial_checklist
from ..services.crm_webhook import forward_lead_to_crm
from ..services.email_service import (
    send_admin_intake_notification,
    send_client_intake_confirmation,
    send_owner_lead_notification,
)
from ..services.magic_link import build_magic_link, generate_token
from ..services.triage import compute_triage_score, generate_matter_id
from ..services.upload_validator import validate_file

router = APIRouter()

UPLOADS_DIR = Path(os.getenv("VCX_UPLOADS_DIR", "uploads"))


def _next_step_text(urgency: str) -> str:
    if urgency in ("Same day / urgent", "24 hours"):
        return "Priority review. Expect contact within 24 hours."
    if urgency == "48 hours":
        return "Review will begin within 48 business hours."
    return "Review will begin within 2-3 business days."


@router.post("/api/intakes", status_code=201, response_model=IntakeResponse)
@limiter.limit("10/minute")
async def create_intake(
    request: Request,
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
    # Phase 4A: Validate attachment before processing
    attachment_content = None
    if attachment is not None and attachment.filename:
        attachment_content = await attachment.read()
        validate_file(
            attachment.filename, len(attachment_content), attachment.content_type
        )

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
        has_attachment = attachment_content is not None
        triage_score = compute_triage_score(
            urgency, service_type, has_attachment, client_type
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

        # 5. File upload (already validated + read above)
        if has_attachment:
            matter_dir = UPLOADS_DIR / matter_id
            matter_dir.mkdir(parents=True, exist_ok=True)
            file_id = str(uuid.uuid4())
            from ..services.upload_validator import sanitize_filename
            safe_name = f"{file_id}_{sanitize_filename(attachment.filename)}"
            file_path = matter_dir / safe_name
            file_path.write_bytes(attachment_content)

            conn.execute(
                """INSERT INTO documents
                   (id, matter_id, filename, original_name, content_type,
                    size_bytes, storage_path)
                   VALUES (?,?,?,?,?,?,?)""",
                (file_id, matter_id, safe_name, attachment.filename,
                 attachment.content_type, len(attachment_content), str(file_path)),
            )

        # 6. Checklist
        checklist_items = generate_initial_checklist(
            service_type, has_attachment, client_type
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
    next_step = _next_step_text(urgency)

    # Phase 4A: Fire-and-forget email notifications (never fail intake on email error)
    send_client_intake_confirmation(
        to_email=email,
        client_name=full_name,
        matter_id=matter_id,
        magic_link=magic_link,
        next_step=next_step,
    )
    send_admin_intake_notification(
        client_name=full_name,
        client_email=email,
        matter_id=matter_id,
        service_type=service_type,
        triage_score=triage_score,
    )

    # Phase CRM: Forward lead to BloomlyTax VCX CRM (fire-and-forget)
    forward_lead_to_crm(
        name=full_name,
        email=email,
        phone=phone,
        service=service_type,
        message=message,
        source="website_intake",
        state=state,
        urgency=urgency,
        company=company,
    )

    # Phase CRM: Send owner notification with full lead details
    send_owner_lead_notification(
        name=full_name,
        email=email,
        phone=phone,
        service=service_type,
        message=message,
        matter_id=matter_id,
        urgency=urgency,
        state=state,
    )

    return IntakeResponse(
        ok=True,
        matter_id=matter_id,
        magic_link=magic_link,
        status="triage",
        triage_score=triage_score,
        checklist=checklist_out,
        next_step=next_step,
    )
