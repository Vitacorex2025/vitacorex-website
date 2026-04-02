"""Packet Room / Client Portal -- authenticated client access.

Phase 3: Wired to DB. Magic-link token auth via matters table.
Session-based access to matter timeline, documents, comments, deliverables.
"""

import json
import secrets
import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Header, Body

from ..db import get_conn
from ..models.portal import MatterComment

router = APIRouter(prefix="/api/portal")


# ── Helpers ─────────────────────────────────────────────────────────

def _verify_bearer(authorization: str) -> dict:
    """Extract and verify Bearer token against portal_sessions.

    Returns the session row dict or raises 401.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")

    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Empty token.")

    with get_conn() as conn:
        session = conn.execute(
            "SELECT * FROM portal_sessions WHERE magic_token = ?", (token,)
        ).fetchone()

    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")

    # Check expiration
    expires = session["expires_at"]
    if expires and datetime.fromisoformat(expires) < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Session expired. Please re-authenticate.")

    return dict(session)


def _get_contact_matters(contact_id: str) -> list[dict]:
    """Get all matters for a contact."""
    with get_conn() as conn:
        rows = conn.execute(
            """SELECT id, service_type, urgency, status, client_type,
                      triage_score, assigned_to, created_at, updated_at
               FROM matters WHERE contact_id = ?
               ORDER BY created_at DESC""",
            (contact_id,),
        ).fetchall()
    return [dict(r) for r in rows]


# ── Auth: verify magic link ────────────────────────────────────────

@router.get("/magic-link/{token}")
def verify_magic_link(token: str):
    """Verify a magic-link token against the matters table.

    If valid, create a portal_session (24h TTL) and return
    session token + matter list.
    """
    if not token or len(token) < 8:
        raise HTTPException(status_code=400, detail="Invalid token format.")

    with get_conn() as conn:
        # Look up token in matters table
        matter = conn.execute(
            "SELECT * FROM matters WHERE magic_token = ?", (token,)
        ).fetchone()

        if not matter:
            raise HTTPException(status_code=404, detail="Token not found or expired.")

        contact_id = matter["contact_id"]

        # Check if an active session already exists
        existing = conn.execute(
            """SELECT * FROM portal_sessions
               WHERE contact_id = ? AND expires_at > datetime('now')
               ORDER BY created_at DESC LIMIT 1""",
            (contact_id,),
        ).fetchone()

        if existing:
            session_token = existing["magic_token"]
            session_id = existing["id"]
        else:
            # Create a new portal session
            session_id = str(uuid.uuid4())
            session_token = secrets.token_urlsafe(32)
            expires_at = (datetime.utcnow() + timedelta(hours=24)).isoformat()

            conn.execute(
                """INSERT INTO portal_sessions (id, contact_id, magic_token, expires_at, created_at)
                   VALUES (?, ?, ?, ?, datetime('now'))""",
                (session_id, contact_id, session_token, expires_at),
            )

    # Get contact info
    with get_conn() as conn:
        contact = conn.execute(
            "SELECT * FROM contacts WHERE id = ?", (contact_id,)
        ).fetchone()

    matters = _get_contact_matters(contact_id)

    return {
        "ok": True,
        "session_id": session_id,
        "token": session_token,
        "contact": {
            "id": contact_id,
            "name": contact["full_name"] if contact else "",
            "email": contact["email"] if contact else "",
        } if contact else None,
        "matters": matters,
    }


@router.post("/magic-link/{token}")
def verify_magic_link_post(token: str):
    """POST variant for frontend compatibility. Delegates to GET logic."""
    return verify_magic_link(token)


# ── Email-based lookup ──────────────────────────────────────────────

@router.post("/lookup-email")
def lookup_by_email(email: str = Body(..., embed=True)):
    """Look up matters by client email. Returns matter IDs (no sensitive data)
    so the client can request a magic link be sent."""
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email.")

    with get_conn() as conn:
        contact = conn.execute(
            "SELECT id, full_name FROM contacts WHERE email = ?", (email.strip().lower(),)
        ).fetchone()

    if not contact:
        # Don't reveal whether email exists -- return generic message
        return {
            "ok": True,
            "message": "If this email is associated with an active matter, you will receive an access link shortly.",
            "matters_found": 0,
        }

    matters = _get_contact_matters(contact["id"])

    return {
        "ok": True,
        "message": "Matters found. Use your magic link to access the portal.",
        "matters_found": len(matters),
    }


# ── List matters ────────────────────────────────────────────────────

@router.get("/matters")
def list_client_matters(authorization: str = Header(...)):
    """List all matters accessible to the authenticated client."""
    session = _verify_bearer(authorization)
    contact_id = session["contact_id"]
    matters = _get_contact_matters(contact_id)

    return {
        "ok": True,
        "contact_id": contact_id,
        "matters": matters,
    }


# ── Matter packet (full detail) ────────────────────────────────────

@router.get("/matters/{matter_id}")
def get_matter_detail(matter_id: str, authorization: str = Header(...)):
    """Get matter overview (without full packet assembly)."""
    session = _verify_bearer(authorization)
    contact_id = session["contact_id"]

    with get_conn() as conn:
        matter = conn.execute(
            "SELECT * FROM matters WHERE id = ? AND contact_id = ?",
            (matter_id, contact_id),
        ).fetchone()

    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found or access denied.")

    return {
        "ok": True,
        "matter": {
            "id": matter["id"],
            "service_type": matter["service_type"],
            "urgency": matter["urgency"],
            "status": matter["status"],
            "client_type": matter["client_type"],
            "assigned_to": matter["assigned_to"],
            "created_at": matter["created_at"],
            "updated_at": matter["updated_at"],
        },
    }


@router.get("/matters/{matter_id}/packet")
def get_matter_packet(matter_id: str, authorization: str = Header(...)):
    """Get full packet: timeline + docs + checklist + comments + deliverables."""
    session = _verify_bearer(authorization)
    contact_id = session["contact_id"]

    with get_conn() as conn:
        # Verify access
        matter = conn.execute(
            "SELECT * FROM matters WHERE id = ? AND contact_id = ?",
            (matter_id, contact_id),
        ).fetchone()
        if not matter:
            raise HTTPException(status_code=404, detail="Matter not found or access denied.")

        # Timeline (status events)
        events = conn.execute(
            """SELECT id, old_status, new_status, actor, note, created_at
               FROM status_events WHERE matter_id = ?
               ORDER BY created_at ASC""",
            (matter_id,),
        ).fetchall()

        # Documents
        docs = conn.execute(
            """SELECT id, filename, original_name, content_type, size_bytes, uploaded_at
               FROM documents WHERE matter_id = ?
               ORDER BY uploaded_at DESC""",
            (matter_id,),
        ).fetchall()

        # Checklists
        checks = conn.execute(
            """SELECT id, label, is_complete, completed_at, sort_order
               FROM checklists WHERE matter_id = ?
               ORDER BY sort_order ASC""",
            (matter_id,),
        ).fetchall()

        # Comments
        comments = conn.execute(
            """SELECT id, author_type, author_name, content, created_at
               FROM matter_comments WHERE matter_id = ?
               ORDER BY created_at ASC""",
            (matter_id,),
        ).fetchall()

        # Deliverables
        deliverables = conn.execute(
            """SELECT id, title, description, status, created_at, delivered_at
               FROM deliverables WHERE matter_id = ?
               ORDER BY created_at DESC""",
            (matter_id,),
        ).fetchall()

    return {
        "ok": True,
        "matter_id": matter_id,
        "status": matter["status"],
        "service_type": matter["service_type"],
        "timeline": [
            {
                "id": e["id"],
                "title": f"{e['old_status'] or 'new'} -> {e['new_status']}",
                "description": e["note"] or "",
                "actor": e["actor"],
                "date": e["created_at"],
            }
            for e in events
        ],
        "documents": [
            {
                "id": d["id"],
                "name": d["original_name"],
                "filename": d["filename"],
                "content_type": d["content_type"],
                "size": _format_size(d["size_bytes"]),
                "size_bytes": d["size_bytes"],
                "date": d["uploaded_at"],
            }
            for d in docs
        ],
        "checklist": [
            {
                "id": c["id"],
                "label": c["label"],
                "is_complete": bool(c["is_complete"]),
                "completed_at": c["completed_at"],
            }
            for c in checks
        ],
        "comments": [
            {
                "id": cm["id"],
                "author": cm["author_name"] or cm["author_type"],
                "author_type": cm["author_type"],
                "content": cm["content"],
                "timestamp": cm["created_at"],
            }
            for cm in comments
        ],
        "deliverables": [
            {
                "id": dl["id"],
                "name": dl["title"],
                "description": dl["description"],
                "status": dl["status"],
                "created_at": dl["created_at"],
                "delivered_at": dl["delivered_at"],
            }
            for dl in deliverables
        ],
    }


# ── Comments ────────────────────────────────────────────────────────

@router.post("/matters/{matter_id}/comments")
def add_comment(
    matter_id: str,
    comment: MatterComment,
    authorization: str = Header(...),
):
    """Add a client comment to a matter."""
    session = _verify_bearer(authorization)
    contact_id = session["contact_id"]

    with get_conn() as conn:
        # Verify access
        matter = conn.execute(
            "SELECT id FROM matters WHERE id = ? AND contact_id = ?",
            (matter_id, contact_id),
        ).fetchone()
        if not matter:
            raise HTTPException(status_code=404, detail="Matter not found or access denied.")

        comment_id = str(uuid.uuid4())
        conn.execute(
            """INSERT INTO matter_comments
               (id, matter_id, author_type, author_name, content, created_at)
               VALUES (?, ?, 'client', ?, ?, datetime('now'))""",
            (comment_id, matter_id, comment.author_name or "Client", comment.content),
        )

        # Return updated comments
        comments = conn.execute(
            """SELECT id, author_type, author_name, content, created_at
               FROM matter_comments WHERE matter_id = ?
               ORDER BY created_at ASC""",
            (matter_id,),
        ).fetchall()

    return {
        "ok": True,
        "comment_id": comment_id,
        "comments": [
            {
                "id": cm["id"],
                "author": cm["author_name"] or cm["author_type"],
                "author_type": cm["author_type"],
                "content": cm["content"],
                "timestamp": cm["created_at"],
            }
            for cm in comments
        ],
    }


# ── Export (stub — Phase 4) ─────────────────────────────────────────

@router.get("/matters/{matter_id}/export")
def export_packet(matter_id: str, authorization: str = Header(...)):
    """Export final packet as PDF or ZIP. Phase 4 feature."""
    _verify_bearer(authorization)
    raise HTTPException(
        status_code=501,
        detail="Packet export is not yet available. This feature is planned for a future release.",
    )


# ── Helpers ─────────────────────────────────────────────────────────

def _format_size(size_bytes) -> str:
    """Format byte count as human-readable string."""
    if size_bytes is None:
        return ""
    size_bytes = int(size_bytes)
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
