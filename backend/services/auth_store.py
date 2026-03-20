from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from uuid import uuid4

from backend.core.config import settings
from backend.models.auth_schema import MembershipRecord, MembershipRole, MembershipStatus, SessionRecord, UserRecord, UserStatus, WorkspaceRecord
from backend.services.auth_security import hash_password


AUTH_ROOT = settings.storage_path / "auth"
AUTH_ROOT.mkdir(parents=True, exist_ok=True)
AUTH_DB_PATH = AUTH_ROOT / "auth.db"

LEGACY_COLLECTIONS: dict[str, tuple[type, str]] = {
    "users": (UserRecord, "users.json"),
    "workspaces": (WorkspaceRecord, "workspaces.json"),
    "memberships": (MembershipRecord, "memberships.json"),
    "sessions": (SessionRecord, "sessions.json"),
}


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _legacy_collection_path(name: str) -> Path:
    return AUTH_ROOT / LEGACY_COLLECTIONS[name][1]


def _load_legacy_collection(name: str) -> list:
    model, _ = LEGACY_COLLECTIONS[name]
    path = _legacy_collection_path(name)
    if not path.exists():
        return []
    raw = path.read_text(encoding="utf-8").strip()
    if not raw:
        return []
    return [model.model_validate(item) for item in json.loads(raw)]


@contextmanager
def _connect():
    conn = sqlite3.connect(AUTH_DB_PATH, timeout=30, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        conn.execute("PRAGMA foreign_keys = ON")
        conn.execute("PRAGMA journal_mode = WAL")
        yield conn
        conn.commit()
    finally:
        conn.close()


def _row_count(conn: sqlite3.Connection, table: str) -> int:
    row = conn.execute(f"SELECT COUNT(*) AS count FROM {table}").fetchone()
    return int(row["count"] if row else 0)


def _serialize(item) -> dict[str, object]:
    payload = item.model_dump(mode="json") if hasattr(item, "model_dump") else dict(item)
    if "is_personal" in payload:
        payload["is_personal"] = 1 if payload["is_personal"] else 0
    return payload


def _normalize_workspace(payload: dict[str, object]) -> dict[str, object]:
    data = dict(payload)
    data["is_personal"] = bool(data.get("is_personal", True))
    return data


def _migrate_legacy_json(conn: sqlite3.Connection) -> None:
    if any(_row_count(conn, table) for table in ("users", "workspaces", "memberships", "sessions")):
        return

    users = _load_legacy_collection("users")
    workspaces = _load_legacy_collection("workspaces")
    memberships = _load_legacy_collection("memberships")
    sessions = _load_legacy_collection("sessions")
    if not any([users, workspaces, memberships, sessions]):
        return

    for item in users:
        conn.execute(
            """
            INSERT OR REPLACE INTO users (
              id, email, password_hash, first_name, last_name, title,
              status, preferred_language, created_at, updated_at
            ) VALUES (
              :id, :email, :password_hash, :first_name, :last_name, :title,
              :status, :preferred_language, :created_at, :updated_at
            )
            """,
            _serialize(item),
        )
    for item in workspaces:
        conn.execute(
            """
            INSERT OR REPLACE INTO workspaces (
              id, name, slug, owner_user_id, status, is_personal,
              branding_name, created_at, updated_at
            ) VALUES (
              :id, :name, :slug, :owner_user_id, :status, :is_personal,
              :branding_name, :created_at, :updated_at
            )
            """,
            _serialize(item),
        )
    for item in memberships:
        conn.execute(
            """
            INSERT OR REPLACE INTO memberships (
              id, workspace_id, user_id, role, membership_status,
              joined_at, last_active_at, created_at, updated_at
            ) VALUES (
              :id, :workspace_id, :user_id, :role, :membership_status,
              :joined_at, :last_active_at, :created_at, :updated_at
            )
            """,
            _serialize(item),
        )
    for item in sessions:
        conn.execute(
            """
            INSERT OR REPLACE INTO sessions (
              id, user_id, workspace_id, user_agent, ip_address,
              created_at, last_seen_at, revoked_at
            ) VALUES (
              :id, :user_id, :workspace_id, :user_agent, :ip_address,
              :created_at, :last_seen_at, :revoked_at
            )
            """,
            _serialize(item),
        )


def _ensure_bootstrap_admin(conn: sqlite3.Connection) -> None:
    email = (settings.bootstrap_admin_email or "").strip().lower()
    password = settings.bootstrap_admin_password or ""
    if not email or not password:
        return

    now = _utcnow()
    existing_user = conn.execute("SELECT * FROM users WHERE lower(email) = ?", (email,)).fetchone()
    user_id = str(existing_user["id"]) if existing_user else f"usr_bootstrap_{uuid4().hex[:10]}"
    created_at = str(existing_user["created_at"]) if existing_user else now
    conn.execute(
        """
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, title,
          status, preferred_language, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          password_hash = excluded.password_hash,
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          title = excluded.title,
          status = excluded.status,
          preferred_language = excluded.preferred_language,
          updated_at = excluded.updated_at
        """,
        (
            user_id,
            email,
            hash_password(password),
            "VitaCoreX",
            "Admin",
            "Super Admin",
            UserStatus.ACTIVE,
            "en",
            created_at,
            now,
        ),
    )

    workspace_row = conn.execute(
        """
        SELECT w.*
        FROM workspaces w
        INNER JOIN memberships m ON m.workspace_id = w.id
        WHERE m.user_id = ?
        ORDER BY m.created_at ASC
        LIMIT 1
        """,
        (user_id,),
    ).fetchone()
    if workspace_row is None:
        workspace_row = conn.execute(
            "SELECT * FROM workspaces WHERE owner_user_id = ? ORDER BY created_at ASC LIMIT 1",
            (user_id,),
        ).fetchone()

    workspace_id = str(workspace_row["id"]) if workspace_row else f"ws_bootstrap_{uuid4().hex[:10]}"
    workspace_created_at = str(workspace_row["created_at"]) if workspace_row else now
    conn.execute(
        """
        INSERT INTO workspaces (
          id, name, slug, owner_user_id, status, is_personal,
          branding_name, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          owner_user_id = excluded.owner_user_id,
          status = excluded.status,
          updated_at = excluded.updated_at
        """,
        (
            workspace_id,
            (workspace_row["name"] if workspace_row else "DocketMint Admin").strip() if workspace_row else "DocketMint Admin",
            (workspace_row["slug"] if workspace_row else "docketmint-admin").strip() if workspace_row else "docketmint-admin",
            user_id,
            "active",
            int(bool(workspace_row["is_personal"])) if workspace_row else 0,
            (workspace_row["branding_name"] if workspace_row else "DocketMint").strip() if workspace_row else "DocketMint",
            workspace_created_at,
            now,
        ),
    )

    membership_row = conn.execute(
        "SELECT * FROM memberships WHERE workspace_id = ? AND user_id = ?",
        (workspace_id, user_id),
    ).fetchone()
    membership_id = str(membership_row["id"]) if membership_row else f"mem_bootstrap_{uuid4().hex[:10]}"
    joined_at = str(membership_row["joined_at"]) if membership_row else now
    conn.execute(
        """
        INSERT INTO memberships (
          id, workspace_id, user_id, role, membership_status,
          joined_at, last_active_at, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          role = excluded.role,
          membership_status = excluded.membership_status,
          last_active_at = excluded.last_active_at,
          updated_at = excluded.updated_at
        """,
        (
            membership_id,
            workspace_id,
            user_id,
            MembershipRole.SUPER_ADMIN,
            MembershipStatus.ACTIVE,
            joined_at,
            now,
            str(membership_row["created_at"]) if membership_row else now,
            now,
        ),
    )


def _ensure_schema() -> None:
    AUTH_ROOT.mkdir(parents=True, exist_ok=True)
    with _connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id TEXT PRIMARY KEY,
              email TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              first_name TEXT NOT NULL DEFAULT '',
              last_name TEXT NOT NULL DEFAULT '',
              title TEXT NOT NULL DEFAULT '',
              status TEXT NOT NULL DEFAULT 'active',
              preferred_language TEXT NOT NULL DEFAULT 'en',
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS workspaces (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              slug TEXT NOT NULL,
              owner_user_id TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'active',
              is_personal INTEGER NOT NULL DEFAULT 1,
              branding_name TEXT NOT NULL DEFAULT 'DocketMint',
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS memberships (
              id TEXT PRIMARY KEY,
              workspace_id TEXT NOT NULL,
              user_id TEXT NOT NULL,
              role TEXT NOT NULL DEFAULT 'owner',
              membership_status TEXT NOT NULL DEFAULT 'active',
              joined_at TEXT NOT NULL,
              last_active_at TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              UNIQUE(workspace_id, user_id)
            );

            CREATE TABLE IF NOT EXISTS sessions (
              id TEXT PRIMARY KEY,
              user_id TEXT NOT NULL,
              workspace_id TEXT NOT NULL,
              user_agent TEXT,
              ip_address TEXT,
              created_at TEXT NOT NULL,
              last_seen_at TEXT NOT NULL,
              revoked_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
            CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
            CREATE INDEX IF NOT EXISTS idx_sessions_workspace_id ON sessions(workspace_id);
            """
        )
        _migrate_legacy_json(conn)
        _ensure_bootstrap_admin(conn)


def storage_backend() -> str:
    return "sqlite"


def database_path() -> Path:
    return AUTH_DB_PATH


def all_users() -> list[UserRecord]:
    _ensure_schema()
    with _connect() as conn:
        rows = conn.execute("SELECT * FROM users ORDER BY created_at ASC").fetchall()
    return [UserRecord.model_validate(dict(row)) for row in rows]


def save_users(items: list[UserRecord]) -> None:
    _ensure_schema()
    with _connect() as conn:
        conn.execute("DELETE FROM users")
        for item in items:
            conn.execute(
                """
                INSERT INTO users (
                  id, email, password_hash, first_name, last_name, title,
                  status, preferred_language, created_at, updated_at
                ) VALUES (
                  :id, :email, :password_hash, :first_name, :last_name, :title,
                  :status, :preferred_language, :created_at, :updated_at
                )
                """,
                _serialize(item),
            )


def all_workspaces() -> list[WorkspaceRecord]:
    _ensure_schema()
    with _connect() as conn:
        rows = conn.execute("SELECT * FROM workspaces ORDER BY created_at ASC").fetchall()
    return [WorkspaceRecord.model_validate(_normalize_workspace(dict(row))) for row in rows]


def save_workspaces(items: list[WorkspaceRecord]) -> None:
    _ensure_schema()
    with _connect() as conn:
        conn.execute("DELETE FROM workspaces")
        for item in items:
            conn.execute(
                """
                INSERT INTO workspaces (
                  id, name, slug, owner_user_id, status, is_personal,
                  branding_name, created_at, updated_at
                ) VALUES (
                  :id, :name, :slug, :owner_user_id, :status, :is_personal,
                  :branding_name, :created_at, :updated_at
                )
                """,
                _serialize(item),
            )


def all_memberships() -> list[MembershipRecord]:
    _ensure_schema()
    with _connect() as conn:
        rows = conn.execute("SELECT * FROM memberships ORDER BY created_at ASC").fetchall()
    return [MembershipRecord.model_validate(dict(row)) for row in rows]


def save_memberships(items: list[MembershipRecord]) -> None:
    _ensure_schema()
    with _connect() as conn:
        conn.execute("DELETE FROM memberships")
        for item in items:
            conn.execute(
                """
                INSERT INTO memberships (
                  id, workspace_id, user_id, role, membership_status,
                  joined_at, last_active_at, created_at, updated_at
                ) VALUES (
                  :id, :workspace_id, :user_id, :role, :membership_status,
                  :joined_at, :last_active_at, :created_at, :updated_at
                )
                """,
                _serialize(item),
            )


def all_sessions() -> list[SessionRecord]:
    _ensure_schema()
    with _connect() as conn:
        rows = conn.execute("SELECT * FROM sessions ORDER BY created_at ASC").fetchall()
    return [SessionRecord.model_validate(dict(row)) for row in rows]


def save_sessions(items: list[SessionRecord]) -> None:
    _ensure_schema()
    with _connect() as conn:
        conn.execute("DELETE FROM sessions")
        for item in items:
            conn.execute(
                """
                INSERT INTO sessions (
                  id, user_id, workspace_id, user_agent, ip_address,
                  created_at, last_seen_at, revoked_at
                ) VALUES (
                  :id, :user_id, :workspace_id, :user_agent, :ip_address,
                  :created_at, :last_seen_at, :revoked_at
                )
                """,
                _serialize(item),
            )


def get_user_by_id(user_id: str) -> UserRecord | None:
    _ensure_schema()
    with _connect() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return UserRecord.model_validate(dict(row)) if row else None


def get_user_by_email(email: str) -> UserRecord | None:
    _ensure_schema()
    target = (email or "").strip().lower()
    with _connect() as conn:
        row = conn.execute("SELECT * FROM users WHERE lower(email) = ?", (target,)).fetchone()
    return UserRecord.model_validate(dict(row)) if row else None


def get_workspace_by_id(workspace_id: str) -> WorkspaceRecord | None:
    _ensure_schema()
    with _connect() as conn:
        row = conn.execute("SELECT * FROM workspaces WHERE id = ?", (workspace_id,)).fetchone()
    return WorkspaceRecord.model_validate(_normalize_workspace(dict(row))) if row else None


def get_membership(workspace_id: str, user_id: str) -> MembershipRecord | None:
    _ensure_schema()
    with _connect() as conn:
        row = conn.execute(
            "SELECT * FROM memberships WHERE workspace_id = ? AND user_id = ?",
            (workspace_id, user_id),
        ).fetchone()
    return MembershipRecord.model_validate(dict(row)) if row else None


def memberships_for_user(user_id: str) -> list[MembershipRecord]:
    _ensure_schema()
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM memberships WHERE user_id = ? ORDER BY joined_at ASC",
            (user_id,),
        ).fetchall()
    return [MembershipRecord.model_validate(dict(row)) for row in rows]


def get_session_by_id(session_id: str) -> SessionRecord | None:
    _ensure_schema()
    with _connect() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return SessionRecord.model_validate(dict(row)) if row else None


def upsert_user(user: UserRecord) -> UserRecord:
    _ensure_schema()
    payload = _serialize(user)
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO users (
              id, email, password_hash, first_name, last_name, title,
              status, preferred_language, created_at, updated_at
            ) VALUES (
              :id, :email, :password_hash, :first_name, :last_name, :title,
              :status, :preferred_language, :created_at, :updated_at
            )
            ON CONFLICT(id) DO UPDATE SET
              email = excluded.email,
              password_hash = excluded.password_hash,
              first_name = excluded.first_name,
              last_name = excluded.last_name,
              title = excluded.title,
              status = excluded.status,
              preferred_language = excluded.preferred_language,
              created_at = excluded.created_at,
              updated_at = excluded.updated_at
            """,
            payload,
        )
    return user


def upsert_workspace(workspace: WorkspaceRecord) -> WorkspaceRecord:
    _ensure_schema()
    payload = _serialize(workspace)
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO workspaces (
              id, name, slug, owner_user_id, status, is_personal,
              branding_name, created_at, updated_at
            ) VALUES (
              :id, :name, :slug, :owner_user_id, :status, :is_personal,
              :branding_name, :created_at, :updated_at
            )
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              slug = excluded.slug,
              owner_user_id = excluded.owner_user_id,
              status = excluded.status,
              is_personal = excluded.is_personal,
              branding_name = excluded.branding_name,
              created_at = excluded.created_at,
              updated_at = excluded.updated_at
            """,
            payload,
        )
    return workspace


def upsert_membership(membership: MembershipRecord) -> MembershipRecord:
    _ensure_schema()
    payload = _serialize(membership)
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO memberships (
              id, workspace_id, user_id, role, membership_status,
              joined_at, last_active_at, created_at, updated_at
            ) VALUES (
              :id, :workspace_id, :user_id, :role, :membership_status,
              :joined_at, :last_active_at, :created_at, :updated_at
            )
            ON CONFLICT(id) DO UPDATE SET
              workspace_id = excluded.workspace_id,
              user_id = excluded.user_id,
              role = excluded.role,
              membership_status = excluded.membership_status,
              joined_at = excluded.joined_at,
              last_active_at = excluded.last_active_at,
              created_at = excluded.created_at,
              updated_at = excluded.updated_at
            """,
            payload,
        )
    return membership


def upsert_session(session: SessionRecord) -> SessionRecord:
    _ensure_schema()
    payload = _serialize(session)
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO sessions (
              id, user_id, workspace_id, user_agent, ip_address,
              created_at, last_seen_at, revoked_at
            ) VALUES (
              :id, :user_id, :workspace_id, :user_agent, :ip_address,
              :created_at, :last_seen_at, :revoked_at
            )
            ON CONFLICT(id) DO UPDATE SET
              user_id = excluded.user_id,
              workspace_id = excluded.workspace_id,
              user_agent = excluded.user_agent,
              ip_address = excluded.ip_address,
              created_at = excluded.created_at,
              last_seen_at = excluded.last_seen_at,
              revoked_at = excluded.revoked_at
            """,
            payload,
        )
    return session


def revoke_session(session_id: str) -> None:
    _ensure_schema()
    revoked_at = _utcnow()
    with _connect() as conn:
        conn.execute("UPDATE sessions SET revoked_at = ? WHERE id = ?", (revoked_at, session_id))


def ensure_bootstrap_admin() -> None:
    _ensure_schema()


_ensure_schema()
