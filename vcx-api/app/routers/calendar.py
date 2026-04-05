"""Deadline Calendar — REST API endpoints."""

import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel

from ..rate_limit import limiter
from ..db import get_conn
from ..models.calendar import CalendarRegister, EventCreate, EventUpdate, NoteUpsert
from ..services import calendar_engine
from ..services.email_service import _send_email, _esc

logger = logging.getLogger("vcx.calendar.api")

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


@router.post("/register")
@limiter.limit("10/minute")
async def register_owner(request: Request, body: CalendarRegister):
    """Register a new calendar owner and return a generated owner_id."""
    owner_id = uuid.uuid4().hex[:12]
    return {"ok": True, "owner_id": owner_id, "name": body.name}


@router.get("/home")
@limiter.limit("30/minute")
async def calendar_home(request: Request, owner_id: str = Query("default")):
    """Risk-first dashboard snapshot."""
    try:
        snapshot = calendar_engine.get_home_snapshot(owner_id=owner_id)
        return {"ok": True, **snapshot}
    except Exception as exc:
        logger.error("Calendar home error: %s", exc)
        raise HTTPException(500, detail=str(exc))


@router.get("/widget")
@limiter.limit("60/minute")
async def calendar_widget(request: Request, owner_id: str = Query("default")):
    """Compact widget data: today's events + tomorrow count."""
    try:
        today = datetime.utcnow()
        today_str = today.strftime("%Y-%m-%d")
        tomorrow_str = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        day_label = today.strftime("%A, %b ") + str(today.day)

        with get_conn() as conn:
            rows = conn.execute(
                "SELECT id, title, event_type, start_at, priority "
                "FROM calendar_events "
                "WHERE start_at LIKE ? AND status = 'scheduled' AND owner_id = ? "
                "ORDER BY start_at",
                (today_str + "%", owner_id),
            ).fetchall()

            tomorrow_count = conn.execute(
                "SELECT COUNT(*) c FROM calendar_events "
                "WHERE start_at LIKE ? AND status = 'scheduled' AND owner_id = ?",
                (tomorrow_str + "%", owner_id),
            ).fetchone()["c"]

        events = []
        for r in rows:
            sa = r["start_at"]
            time_str = sa[11:16] if len(sa) >= 16 else "00:00"
            events.append({
                "id": r["id"],
                "title": r["title"],
                "event_type": r["event_type"],
                "time": time_str,
                "priority": r["priority"],
            })

        return {
            "ok": True,
            "date": today_str,
            "day_label": day_label,
            "events": events,
            "event_count": len(events),
            "tomorrow_count": tomorrow_count,
        }
    except Exception as exc:
        logger.error("Calendar widget error: %s", exc)
        raise HTTPException(500, detail=str(exc))


@router.get("/month/{month}")
@limiter.limit("30/minute")
async def calendar_month(request: Request, month: str, owner_id: str = Query("default")):
    """Events + notes for a month (YYYY-MM)."""
    if len(month) != 7 or month[4] != "-":
        raise HTTPException(400, detail="Month format: YYYY-MM")
    try:
        payload = calendar_engine.get_month_events(month, owner_id=owner_id)
        return {"ok": True, **payload}
    except Exception as exc:
        logger.error("Calendar month error: %s", exc)
        raise HTTPException(500, detail=str(exc))


@router.get("/day/{date}")
@limiter.limit("30/minute")
async def calendar_day(request: Request, date: str, owner_id: str = Query("default")):
    """Events + note for a specific date (YYYY-MM-DD)."""
    if len(date) != 10:
        raise HTTPException(400, detail="Date format: YYYY-MM-DD")
    try:
        payload = calendar_engine.get_day_payload(date, owner_id=owner_id)
        return {"ok": True, **payload}
    except Exception as exc:
        logger.error("Calendar day error: %s", exc)
        raise HTTPException(500, detail=str(exc))


@router.post("/events")
@limiter.limit("15/minute")
async def create_event(request: Request, body: EventCreate, owner_id: str = Query("default")):
    """Create a new calendar event."""
    try:
        data = body.model_dump()
        data["owner_id"] = owner_id
        event = calendar_engine.create_event(data)
        return {"ok": True, "event": event}
    except Exception as exc:
        logger.error("Event create error: %s", exc)
        raise HTTPException(500, detail=str(exc))


@router.put("/events/{event_id}")
@limiter.limit("15/minute")
async def update_event(request: Request, event_id: str, body: EventUpdate,
                       owner_id: str = Query("default")):
    """Update a calendar event."""
    try:
        data = {k: v for k, v in body.model_dump().items() if v is not None}
        event = calendar_engine.update_event(event_id, data, owner_id=owner_id)
        if not event:
            raise HTTPException(404, detail="Event not found")
        return {"ok": True, "event": event}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Event update error: %s", exc)
        raise HTTPException(500, detail=str(exc))


@router.delete("/events/{event_id}")
@limiter.limit("15/minute")
async def delete_event(request: Request, event_id: str, owner_id: str = Query("default")):
    """Delete a calendar event."""
    try:
        ok = calendar_engine.delete_event(event_id, owner_id=owner_id)
        if not ok:
            raise HTTPException(404, detail="Event not found")
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Event delete error: %s", exc)
        raise HTTPException(500, detail=str(exc))


@router.post("/notes")
@limiter.limit("15/minute")
async def upsert_note(request: Request, body: NoteUpsert, owner_id: str = Query("default")):
    """Create or update a day note."""
    try:
        data = body.model_dump()
        data["owner_id"] = owner_id
        note = calendar_engine.upsert_day_note(data)
        return {"ok": True, "note": note}
    except Exception as exc:
        logger.error("Note upsert error: %s", exc)
        raise HTTPException(500, detail=str(exc))


class CalendarNotifyRequest(BaseModel):
    to: list[str]
    subject: str
    body: str
    event: Optional[dict] = None


@router.post("/notify")
@limiter.limit("10/minute")
async def calendar_notify(request: Request, body: CalendarNotifyRequest):
    """Send calendar event notification emails."""
    sent_count = 0
    for recipient in body.to:
        if not recipient or "@" not in recipient:
            continue
        body_html = f"""\
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#2D8A82;margin-bottom:16px;">Calendar Reminder</h2>
  <pre style="white-space:pre-wrap;font-family:inherit;line-height:1.6;">{_esc(body.body)}</pre>
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
  <p style="font-size:12px;color:#999;">
    VitaCoreX Deadline Calendar | (888) 794-8292
  </p>
</div>"""
        _send_email(recipient, body.subject, body_html, body.body)
        sent_count += 1

    return {"ok": True, "sent": sent_count}
