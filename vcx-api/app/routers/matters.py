"""Matter status endpoints — client-facing (magic-link auth)."""

from datetime import datetime

from fastapi import APIRouter, Header, HTTPException

from ..db import get_conn
from ..models.matter import ChecklistUpdate, MatterDetail
from ..services.magic_link import validate_token

router = APIRouter()


@router.get("/api/matters/{matter_id}", response_model=MatterDetail)
def get_matter(matter_id: str, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "").strip()

    with get_conn() as conn:
        if not validate_token(matter_id, token, conn):
            raise HTTPException(status_code=403, detail="Invalid or expired token")

        matter = conn.execute(
            "SELECT * FROM matters WHERE id=?", (matter_id,)
        ).fetchone()
        if not matter:
            raise HTTPException(status_code=404, detail="Matter not found")

        checklist = conn.execute(
            "SELECT id, label, is_complete, completed_at FROM checklists WHERE matter_id=? ORDER BY sort_order",
            (matter_id,),
        ).fetchall()

        events = conn.execute(
            "SELECT new_status, note, actor, created_at FROM status_events WHERE matter_id=? ORDER BY created_at",
            (matter_id,),
        ).fetchall()

        docs = conn.execute(
            "SELECT id, original_name, size_bytes, uploaded_at FROM documents WHERE matter_id=? ORDER BY uploaded_at",
            (matter_id,),
        ).fetchall()

        deliverables = conn.execute(
            "SELECT id, title, description, status, created_at, delivered_at FROM deliverables WHERE matter_id=? ORDER BY created_at",
            (matter_id,),
        ).fetchall()

    return MatterDetail(
        matter_id=matter["id"],
        status=matter["status"],
        service_type=matter["service_type"],
        urgency=matter["urgency"],
        triage_score=matter["triage_score"],
        created_at=matter["created_at"],
        checklist=[dict(r) for r in checklist],
        status_events=[dict(r) for r in events],
        documents=[dict(r) for r in docs],
        deliverables=[dict(r) for r in deliverables],
    )


@router.patch("/api/matters/{matter_id}/checklist/{checklist_id}")
def update_checklist(
    matter_id: str,
    checklist_id: str,
    body: ChecklistUpdate,
    authorization: str = Header(...),
):
    token = authorization.replace("Bearer ", "").strip()

    with get_conn() as conn:
        if not validate_token(matter_id, token, conn):
            raise HTTPException(status_code=403, detail="Invalid or expired token")

        row = conn.execute(
            "SELECT id FROM checklists WHERE id=? AND matter_id=?",
            (checklist_id, matter_id),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Checklist item not found")

        now = datetime.now().isoformat() if body.is_complete else None
        conn.execute(
            "UPDATE checklists SET is_complete=?, completed_at=? WHERE id=?",
            (1 if body.is_complete else 0, now, checklist_id),
        )

    return {"ok": True}
