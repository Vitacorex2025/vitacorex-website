"""Internal review queue — admin endpoints (X-Admin-Token auth)."""

import os
import secrets
from datetime import datetime

from fastapi import APIRouter, HTTPException, Header, Query, Request

from ..db import get_conn
from ..models.matter import MatterPatch, QueueItem, QueueResponse
from ..rate_limit import limiter
from ..services.email_service import send_status_change_notification

router = APIRouter(prefix="/api/review")

ADMIN_TOKEN = os.getenv("VCX_ADMIN_TOKEN", "change-me")


def _check_admin(token: str):
    # Phase 4A: Use constant-time comparison to prevent timing attacks
    if not secrets.compare_digest(token, ADMIN_TOKEN):
        raise HTTPException(status_code=403, detail="Unauthorized")


@router.get("/queue", response_model=QueueResponse)
@limiter.limit("30/minute")
def get_queue(
    request: Request,
    status: str = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    x_admin_token: str = Header(...),
):
    _check_admin(x_admin_token)

    with get_conn() as conn:
        where = "WHERE 1=1"
        params: list = []
        if status:
            where += " AND m.status=?"
            params.append(status)

        count_row = conn.execute(
            f"SELECT COUNT(*) as cnt FROM matters m {where}", params
        ).fetchone()
        total = count_row["cnt"]

        offset = (page - 1) * per_page
        rows = conn.execute(
            f"""SELECT m.id, c.full_name, m.service_type, m.urgency,
                       m.triage_score, m.status, m.created_at, m.magic_token,
                       (SELECT COUNT(*) FROM documents d WHERE d.matter_id=m.id) as doc_count
                FROM matters m
                JOIN contacts c ON c.id = m.contact_id
                {where}
                ORDER BY m.triage_score DESC, m.created_at DESC
                LIMIT ? OFFSET ?""",
            params + [per_page, offset],
        ).fetchall()

    items = [
        QueueItem(
            matter_id=r["id"],
            contact_name=r["full_name"],
            service_type=r["service_type"],
            urgency=r["urgency"],
            triage_score=r["triage_score"],
            status=r["status"],
            created_at=r["created_at"],
            document_count=r["doc_count"],
            magic_token=r["magic_token"],
        )
        for r in rows
    ]

    return QueueResponse(matters=items, total=total, page=page, per_page=per_page)


@router.patch("/matters/{matter_id}")
@limiter.limit("20/minute")
def update_matter(
    request: Request,
    matter_id: str,
    body: MatterPatch,
    x_admin_token: str = Header(...),
):
    _check_admin(x_admin_token)

    with get_conn() as conn:
        matter = conn.execute(
            "SELECT id, status, contact_id FROM matters WHERE id=?", (matter_id,)
        ).fetchone()
        if not matter:
            raise HTTPException(status_code=404, detail="Matter not found")

        old_status = matter["status"]
        contact_id = matter["contact_id"]
        updates = []
        params = []

        if body.status and body.status != old_status:
            updates.append("status=?")
            params.append(body.status)
            conn.execute(
                """INSERT INTO status_events
                   (matter_id, old_status, new_status, actor, note)
                   VALUES (?,?,?,?,?)""",
                (matter_id, old_status, body.status, "admin",
                 body.triage_notes or f"Status changed to {body.status}"),
            )

        if body.assigned_to:
            updates.append("assigned_to=?")
            params.append(body.assigned_to)

        if body.triage_notes:
            updates.append("triage_notes=?")
            params.append(body.triage_notes)

        if updates:
            updates.append("updated_at=?")
            params.append(datetime.now().isoformat())
            params.append(matter_id)
            conn.execute(
                f"UPDATE matters SET {', '.join(updates)} WHERE id=?", params
            )

        # Phase 4A: Send email notification on status change
        if body.status and body.status != old_status and contact_id:
            contact = conn.execute(
                "SELECT full_name, email FROM contacts WHERE id=?",
                (contact_id,),
            ).fetchone()
            if contact and contact["email"]:
                send_status_change_notification(
                    to_email=contact["email"],
                    client_name=contact["full_name"] or "Client",
                    matter_id=matter_id,
                    old_status=old_status,
                    new_status=body.status,
                    note=body.triage_notes or "",
                )

    return {"ok": True, "matter_id": matter_id, "status": body.status or old_status}
