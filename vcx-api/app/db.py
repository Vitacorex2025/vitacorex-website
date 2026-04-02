"""VCX Intake OS — Database layer (SQLite)."""

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DB_PATH = os.getenv("VCX_DB_PATH", "data/vcx.db")
_ROOT = Path(__file__).resolve().parent.parent  # api/
_DB_FULL = _ROOT / DB_PATH


def _ensure_dir():
    _DB_FULL.parent.mkdir(parents=True, exist_ok=True)


@contextmanager
def get_conn():
    """Yield a sqlite3 connection with row_factory set to Row."""
    _ensure_dir()
    conn = sqlite3.connect(str(_DB_FULL))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Create all tables from schema.sql if they don't exist."""
    schema_path = Path(__file__).resolve().parent / "schema.sql"
    ddl = schema_path.read_text(encoding="utf-8")
    with get_conn() as conn:
        conn.executescript(ddl)


# ──────────────────────────────────────────────
#  Chat helpers (ported from legal-assistant-starter)
# ──────────────────────────────────────────────

def ensure_session(session_id: str, topic: str | None = None,
                   state: str | None = None, language: str = "en"):
    with get_conn() as conn:
        row = conn.execute("SELECT id FROM sessions WHERE id=?", (session_id,)).fetchone()
        if not row:
            conn.execute(
                "INSERT INTO sessions (id, topic, state, language) VALUES (?,?,?,?)",
                (session_id, topic, state, language),
            )
        elif topic or state:
            conn.execute(
                "UPDATE sessions SET topic=COALESCE(?,topic), state=COALESCE(?,state) WHERE id=?",
                (topic, state, session_id),
            )


def save_message(session_id: str, role: str, content: str):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO messages (session_id, role, content) VALUES (?,?,?)",
            (session_id, role, content),
        )


def get_session(session_id: str) -> dict | None:
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE id=?", (session_id,)).fetchone()
        return dict(row) if row else None


def list_recent_messages(session_id: str, limit: int = 20) -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE session_id=? ORDER BY id DESC LIMIT ?",
            (session_id, limit),
        ).fetchall()
        return [dict(r) for r in reversed(rows)]


def create_lead(session_id: str | None, name: str, email: str,
                phone: str | None, notes: str | None) -> int:
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO leads (session_id, name, email, phone, notes, source) VALUES (?,?,?,?,?,?)",
            (session_id, name, email, phone, notes, "chat"),
        )
        return cur.lastrowid
