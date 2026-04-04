"""Deadline Calendar — business logic and SQLite queries."""

import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional

from ..db import get_conn

logger = logging.getLogger("vcx.calendar")

WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def _new_id() -> str:
    return uuid.uuid4().hex[:12]


def _today() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d")


def _row_to_dict(row) -> dict:
    return dict(row) if row else {}


# ── Home Snapshot ────────────────────────────────────────────────────

def get_home_snapshot(owner_id: str = "default") -> dict:
    """Compute risk-first dashboard: buckets + weekly memory + KPI."""
    today = _today()
    tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
    week_end = (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%d")
    month_start = datetime.utcnow().replace(day=1).strftime("%Y-%m-%d")

    with get_conn() as conn:
        # Risk buckets
        overdue = conn.execute(
            "SELECT COUNT(*) c FROM calendar_events WHERE start_at < ? AND status='scheduled' AND owner_id = ?",
            (today, owner_id)
        ).fetchone()["c"]

        today_count = conn.execute(
            "SELECT COUNT(*) c FROM calendar_events WHERE start_at LIKE ? AND status='scheduled' AND owner_id = ?",
            (today + "%", owner_id)
        ).fetchone()["c"]

        tomorrow_count = conn.execute(
            "SELECT COUNT(*) c FROM calendar_events WHERE start_at LIKE ? AND status='scheduled' AND owner_id = ?",
            (tomorrow + "%", owner_id)
        ).fetchone()["c"]

        week_count = conn.execute(
            "SELECT COUNT(*) c FROM calendar_events WHERE start_at >= ? AND start_at < ? AND status='scheduled' AND owner_id = ?",
            (today, week_end, owner_id)
        ).fetchone()["c"]

        risk_buckets = [
            {"key": "overdue", "label": "Overdue", "count": overdue,
             "helper": "Past deadline — requires immediate action"},
            {"key": "today", "label": "Today", "count": today_count,
             "helper": "Due before end of day"},
            {"key": "tomorrow", "label": "Tomorrow", "count": tomorrow_count,
             "helper": "Prepare now to avoid pressure"},
            {"key": "next_7_days", "label": "Next 7 Days", "count": week_count,
             "helper": "Upcoming week workload"},
        ]

        # Weekly memory (7 days)
        weekly_memory = []
        for i in range(7):
            d = (datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d")
            dt = datetime.utcnow() + timedelta(days=i)
            label = "Today" if i == 0 else ("Tomorrow" if i == 1 else WEEKDAY_LABELS[dt.weekday()])

            events = conn.execute(
                "SELECT id, title, event_type, start_at, priority, status FROM calendar_events "
                "WHERE start_at LIKE ? AND status != 'canceled' AND owner_id = ? ORDER BY start_at LIMIT 4",
                (d + "%", owner_id)
            ).fetchall()

            note = conn.execute(
                "SELECT short_text FROM calendar_day_notes WHERE note_date = ? AND owner_id = ?",
                (d, owner_id)
            ).fetchone()

            has_overdue = conn.execute(
                "SELECT COUNT(*) c FROM calendar_events WHERE start_at < ? AND start_at LIKE ? AND status='scheduled' AND owner_id = ?",
                (datetime.utcnow().strftime("%Y-%m-%dT%H:%M"), d + "%", owner_id)
            ).fetchone()["c"] > 0 if i == 0 else False

            event_list = [dict(e) for e in events[:3]]
            overflow = max(0, len(events) - 3)

            weekly_memory.append({
                "date": d,
                "label": label,
                "note_excerpt": note["short_text"] if note and note["short_text"] else None,
                "events": event_list,
                "has_overdue_pressure": has_overdue,
                "overflow_count": overflow,
            })

        # KPI
        month_total = conn.execute(
            "SELECT COUNT(*) c FROM calendar_events WHERE start_at >= ? AND owner_id = ?",
            (month_start, owner_id)
        ).fetchone()["c"]
        high_priority = conn.execute(
            "SELECT COUNT(*) c FROM calendar_events WHERE priority='high' AND status='scheduled' AND owner_id = ?",
            (owner_id,)
        ).fetchone()["c"]
        completed = conn.execute(
            "SELECT COUNT(*) c FROM calendar_events WHERE status='completed' AND start_at >= ? AND owner_id = ?",
            (month_start, owner_id)
        ).fetchone()["c"]

        kpi = {
            "month_total": month_total,
            "due_today": today_count,
            "overdue": overdue,
            "high_priority": high_priority,
            "completed_this_month": completed,
        }

    return {"risk_buckets": risk_buckets, "weekly_memory": weekly_memory, "kpi": kpi}


# ── Month ────────────────────────────────────────────────────────────

def get_month_events(month: str, owner_id: str = "default") -> dict:
    """Get events and day notes for a month (YYYY-MM)."""
    with get_conn() as conn:
        events = conn.execute(
            "SELECT * FROM calendar_events WHERE start_at LIKE ? AND owner_id = ? ORDER BY start_at",
            (month + "%", owner_id)
        ).fetchall()
        notes = conn.execute(
            "SELECT * FROM calendar_day_notes WHERE note_date LIKE ? AND owner_id = ? ORDER BY note_date",
            (month + "%", owner_id)
        ).fetchall()
    return {
        "month": month,
        "events": [dict(e) for e in events],
        "day_notes": [dict(n) for n in notes],
    }


# ── Day ──────────────────────────────────────────────────────────────

def get_day_payload(date: str, owner_id: str = "default") -> dict:
    """Get events + note for a specific date."""
    with get_conn() as conn:
        events = conn.execute(
            "SELECT * FROM calendar_events WHERE start_at LIKE ? AND owner_id = ? ORDER BY start_at",
            (date + "%", owner_id)
        ).fetchall()
        note = conn.execute(
            "SELECT * FROM calendar_day_notes WHERE note_date = ? AND owner_id = ?",
            (date, owner_id)
        ).fetchone()
    return {
        "date": date,
        "events": [dict(e) for e in events],
        "day_note": dict(note) if note else None,
    }


# ── Event CRUD ───────────────────────────────────────────────────────

def create_event(data: dict) -> dict:
    eid = _new_id()
    now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
    owner_id = data.get("owner_id", "default")
    with get_conn() as conn:
        conn.execute(
            """INSERT INTO calendar_events
               (id, title, event_type, start_at, end_at, status, priority,
                description, contact_id, matter_id, owner_id, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, 'scheduled', ?, ?, ?, ?, ?, ?, ?)""",
            (eid, data["title"], data.get("event_type", "followup"),
             data["start_at"], data.get("end_at"),
             data.get("priority", "medium"), data.get("description"),
             data.get("contact_id"), data.get("matter_id"), owner_id, now, now)
        )
        row = conn.execute("SELECT * FROM calendar_events WHERE id = ?", (eid,)).fetchone()
    return dict(row)


def update_event(event_id: str, data: dict, owner_id: str = "default") -> Optional[dict]:
    now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
    sets = []
    vals = []
    for key in ["title", "event_type", "start_at", "end_at", "status",
                 "priority", "description", "contact_id", "matter_id"]:
        if key in data and data[key] is not None:
            sets.append(f"{key} = ?")
            vals.append(data[key])
    if not sets:
        return None
    sets.append("updated_at = ?")
    vals.append(now)
    vals.append(event_id)
    vals.append(owner_id)

    with get_conn() as conn:
        conn.execute(
            f"UPDATE calendar_events SET {', '.join(sets)} WHERE id = ? AND owner_id = ?", vals
        )
        row = conn.execute("SELECT * FROM calendar_events WHERE id = ? AND owner_id = ?",
                           (event_id, owner_id)).fetchone()
    return dict(row) if row else None


def delete_event(event_id: str, owner_id: str = "default") -> bool:
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM calendar_events WHERE id = ? AND owner_id = ?",
                           (event_id, owner_id))
    return cur.rowcount > 0


# ── Day Notes ────────────────────────────────────────────────────────

def upsert_day_note(data: dict) -> dict:
    nid = _new_id()
    now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
    owner_id = data.get("owner_id", "default")
    with get_conn() as conn:
        existing = conn.execute(
            "SELECT id FROM calendar_day_notes WHERE note_date = ? AND owner_id = ?",
            (data["note_date"], owner_id)
        ).fetchone()
        if existing:
            conn.execute(
                """UPDATE calendar_day_notes
                   SET short_text = ?, content = ?, status = ?,
                       display_priority = ?, contact_id = ?, matter_id = ?, updated_at = ?
                   WHERE note_date = ? AND owner_id = ?""",
                (data.get("short_text", ""), data.get("content", ""),
                 data.get("status", "open"), data.get("display_priority", "medium"),
                 data.get("contact_id"), data.get("matter_id"), now,
                 data["note_date"], owner_id)
            )
            nid = existing["id"]
        else:
            conn.execute(
                """INSERT INTO calendar_day_notes
                   (id, note_date, short_text, content, status, display_priority,
                    contact_id, matter_id, owner_id, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (nid, data["note_date"], data.get("short_text", ""),
                 data.get("content", ""), data.get("status", "open"),
                 data.get("display_priority", "medium"),
                 data.get("contact_id"), data.get("matter_id"), owner_id, now, now)
            )
        row = conn.execute("SELECT * FROM calendar_day_notes WHERE id = ?", (nid,)).fetchone()
    return dict(row) if row else {}
