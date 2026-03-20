from __future__ import annotations

from contextvars import ContextVar
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, Request, Response, status

from backend.core.config import settings
from backend.models.auth_schema import (
    MembershipRecord,
    MembershipRole,
    MembershipStatus,
    SessionContext,
    SessionRecord,
    UserRecord,
    UserStatus,
    WorkspaceRecord,
)
from backend.services import auth_store
from backend.services.auth_security import hash_password, verify_password
from backend.services.entitlements_service import safe_commercial_payload


_CURRENT_CONTEXT: ContextVar[SessionContext | None] = ContextVar("auth_session_context", default=None)
SESSION_COOKIE_NAME = settings.session_cookie_name or "docketmint_session"
SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14
PUBLIC_COOKIE_SHARED_HOSTS = {"docketmint.app", "www.docketmint.app"}
ADMIN_MEMBERSHIP_ROLES = {MembershipRole.SUPER_ADMIN, MembershipRole.ADMIN}
ROLE_PRIORITY = {
    MembershipRole.SUPER_ADMIN: 100,
    MembershipRole.ADMIN: 90,
    MembershipRole.OWNER: 80,
    MembershipRole.OPERATOR: 50,
    MembershipRole.REVIEWER: 30,
    MembershipRole.VIEWER: 10,
}


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _normalize_email(value: str) -> str:
    return (value or "").strip().lower()


def _normalize_language(value: str | None) -> str:
    normalized = (value or "en").strip().lower()
    return normalized if normalized in {"en", "ru", "es"} else "en"


def _slugify(value: str) -> str:
    raw = []
    last_dash = False
    for ch in str(value or "").strip().lower():
        if ch.isalnum():
            raw.append(ch)
            last_dash = False
        elif not last_dash:
            raw.append("-")
            last_dash = True
    slug = "".join(raw).strip("-")
    return slug or f"account-{uuid4().hex[:6]}"


def _display_name(first_name: str, last_name: str, email: str) -> str:
    name = " ".join(item for item in [first_name.strip(), last_name.strip()] if item).strip()
    if name:
        return name
    return (email.split("@")[0] if "@" in email else email).replace(".", " ").replace("_", " ").title() or "Account"


def set_request_context(context: SessionContext | None) -> None:
    _CURRENT_CONTEXT.set(context)


def get_request_context() -> SessionContext | None:
    return _CURRENT_CONTEXT.get()


def current_workspace_id() -> str | None:
    context = get_request_context()
    return context.workspace.id if context else None


def current_user_id() -> str | None:
    context = get_request_context()
    return context.user.id if context else None


def _public_user(user: UserRecord) -> dict[str, object]:
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "title": user.title,
        "status": user.status,
        "preferred_language": user.preferred_language,
    }


def _public_workspace(workspace: WorkspaceRecord) -> dict[str, object]:
    return {
        "id": workspace.id,
        "name": workspace.name,
        "slug": workspace.slug,
        "status": workspace.status,
        "branding_name": workspace.branding_name,
        "is_personal": workspace.is_personal,
    }


def _public_membership(membership: MembershipRecord) -> dict[str, object]:
    return {
        "id": membership.id,
        "workspace_id": membership.workspace_id,
        "user_id": membership.user_id,
        "role": membership.role,
        "membership_status": membership.membership_status,
        "last_active_at": membership.last_active_at,
    }


def _role_priority(role: str | None) -> int:
    return ROLE_PRIORITY.get(str(role or "").strip().lower(), 0)


def _is_admin_role(role: str | None) -> bool:
    return str(role or "").strip().lower() in ADMIN_MEMBERSHIP_ROLES


def _authorization_payload(membership: MembershipRecord) -> dict[str, object]:
    role = str(membership.role or MembershipRole.VIEWER)
    is_admin = _is_admin_role(role)
    return {
        "role": role,
        "is_admin": is_admin,
        "admin_roles": sorted(ADMIN_MEMBERSHIP_ROLES),
        "permissions": {
            "create_cases": is_admin or not settings.enforce_admin_only_case_creation,
            "generate_packets": is_admin or not settings.enforce_admin_only_packet_generation,
        },
        "messages": {
            "create_cases": "Only admin users can create recovery matters in this environment.",
            "generate_packets": "Only admin users can generate packet outputs in this environment.",
        },
        "enforcement": {
            "admin_only_case_creation": settings.enforce_admin_only_case_creation,
            "admin_only_packet_generation": settings.enforce_admin_only_packet_generation,
        },
    }


def session_payload(context: SessionContext) -> dict[str, object]:
    return {
        "authenticated": True,
        "user": _public_user(context.user),
        "workspace": _public_workspace(context.workspace),
        "membership": _public_membership(context.membership),
        "authorization": _authorization_payload(context.membership),
        "commercial": safe_commercial_payload(context.workspace, context.membership),
        "session": {
            "id": context.session.id,
            "created_at": context.session.created_at,
            "last_seen_at": context.session.last_seen_at,
        },
    }


def bootstrap_payload(request: Request) -> dict[str, object]:
    context = get_request_context() or resolve_request_context(request)
    if not context:
        return {"authenticated": False}
    return session_payload(context)


def get_context_from_session_id(session_id: str | None) -> SessionContext | None:
    if not session_id:
        return None
    session = auth_store.get_session_by_id(session_id)
    if not session or session.revoked_at is not None:
        return None
    user = auth_store.get_user_by_id(session.user_id)
    workspace = auth_store.get_workspace_by_id(session.workspace_id)
    membership = auth_store.get_membership(session.workspace_id, session.user_id)
    if not user or not workspace or not membership:
        return None
    if user.status != UserStatus.ACTIVE or membership.membership_status != MembershipStatus.ACTIVE:
        return None
    now = utcnow()
    session.last_seen_at = now
    membership.last_active_at = now
    membership.updated_at = now
    user.updated_at = now
    workspace.updated_at = now
    auth_store.upsert_session(session)
    auth_store.upsert_membership(membership)
    auth_store.upsert_user(user)
    auth_store.upsert_workspace(workspace)
    return SessionContext(user=user, workspace=workspace, membership=membership, session=session)


def resolve_request_context(request: Request) -> SessionContext | None:
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id and _request_host(request) in {"localhost", "127.0.0.1", "testserver"}:
        # Keep the legacy header fallback only for local/test tooling.
        # Public browser auth must resolve from the cookie only.
        session_id = request.headers.get("x-session-id")
    context = get_context_from_session_id(session_id)
    set_request_context(context)
    return context


def require_session(request: Request) -> SessionContext:
    context = get_request_context() or resolve_request_context(request)
    if not context:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Authentication required.", "code": "auth_required"},
        )
    return context


def require_case_creation_access(request: Request) -> SessionContext:
    context = require_session(request)
    if settings.enforce_admin_only_case_creation and not _is_admin_role(context.membership.role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "Only admin users can create recovery matters in this environment.",
                "code": "admin_only_case_creation",
                "role": context.membership.role,
                "admin_roles": sorted(ADMIN_MEMBERSHIP_ROLES),
            },
        )
    return context


def require_packet_generation_access(request: Request) -> SessionContext:
    context = require_session(request)
    if settings.enforce_admin_only_packet_generation and not _is_admin_role(context.membership.role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "message": "Only admin users can generate packet outputs in this environment.",
                "code": "admin_only_packet_generation",
                "role": context.membership.role,
                "admin_roles": sorted(ADMIN_MEMBERSHIP_ROLES),
            },
        )
    return context


def _request_scheme(request: Request | None) -> str:
    if not request:
        return ""
    forwarded = (request.headers.get("x-forwarded-proto") or "").split(",")[0].strip().lower()
    if forwarded:
        return forwarded
    try:
        return (request.url.scheme or "").strip().lower()
    except Exception:
        return ""


def _request_host(request: Request | None) -> str:
    if not request:
        return ""
    host = (request.headers.get("host") or "").split(",")[0].strip()
    if host:
        return host.split(":")[0].lower()
    try:
        return (request.url.hostname or "").strip().lower()
    except Exception:
        return ""


def _cookie_secure_for_request(request: Request | None) -> bool:
    host = _request_host(request)
    scheme = _request_scheme(request)
    if host in {"localhost", "127.0.0.1"} and scheme == "http":
        return False
    if scheme == "https":
        return True
    return settings.cookie_secure


def _cookie_samesite_for_request(request: Request | None) -> str:
    samesite = str(settings.cookie_samesite or "lax").strip().lower() or "lax"
    if samesite not in {"lax", "strict", "none"}:
        samesite = "lax"
    if samesite == "none" and not _cookie_secure_for_request(request):
        return "lax"
    return samesite


def _cookie_domain_for_request(request: Request | None) -> str | None:
    configured = (settings.session_cookie_domain or "").strip()
    if configured:
        return configured
    host = _request_host(request)
    if host in PUBLIC_COOKIE_SHARED_HOSTS:
        return "docketmint.app"
    return None


def attach_session_cookie(response: Response, session: SessionRecord, request: Request | None = None) -> None:
    kwargs: dict[str, object] = {
        "max_age": SESSION_MAX_AGE_SECONDS,
        "httponly": True,
        "secure": _cookie_secure_for_request(request),
        "samesite": _cookie_samesite_for_request(request),
        "path": "/",
    }
    cookie_domain = _cookie_domain_for_request(request)
    if cookie_domain:
        kwargs["domain"] = cookie_domain
    response.set_cookie(SESSION_COOKIE_NAME, session.id, **kwargs)


def clear_session_cookie(response: Response, request: Request | None = None) -> None:
    kwargs: dict[str, object] = {
        "path": "/",
        "httponly": True,
        "secure": _cookie_secure_for_request(request),
        "samesite": _cookie_samesite_for_request(request),
    }
    cookie_domain = _cookie_domain_for_request(request)
    if cookie_domain:
        kwargs["domain"] = cookie_domain
    response.delete_cookie(SESSION_COOKIE_NAME, **kwargs)


def _client_ip(request: Request | None) -> str | None:
    if not request or not request.client:
        return None
    return request.client.host


def _user_agent(request: Request | None) -> str | None:
    if not request:
        return None
    return request.headers.get("user-agent")


def _create_session_record(user: UserRecord, workspace: WorkspaceRecord, request: Request | None = None) -> SessionRecord:
    session = SessionRecord(
        id=f"ses_{uuid4().hex[:24]}",
        user_id=user.id,
        workspace_id=workspace.id,
        ip_address=_client_ip(request),
        user_agent=_user_agent(request),
    )
    auth_store.upsert_session(session)
    return session


def _default_workspace_name(first_name: str, last_name: str, email: str) -> str:
    return f"{_display_name(first_name, last_name, email)} account"


def signup(
    first_name: str,
    last_name: str,
    email: str,
    password: str,
    workspace_name: str | None = None,
    title: str | None = None,
    preferred_language: str = "en",
    terms_accepted: bool = False,
    request: Request | None = None,
) -> dict[str, object]:
    normalized_email = _normalize_email(email)
    normalized_first_name = (first_name or "").strip()
    normalized_last_name = (last_name or "").strip()
    normalized_title = (title or "").strip()
    normalized_workspace_name = (workspace_name or "").strip()
    normalized_language = _normalize_language(preferred_language)
    if not normalized_email or "@" not in normalized_email:
        raise HTTPException(status_code=400, detail={"message": "A valid email address is required.", "code": "invalid_email"})
    if not normalized_first_name:
        raise HTTPException(status_code=400, detail={"message": "First name is required.", "code": "first_name_required"})
    if not normalized_last_name:
        raise HTTPException(status_code=400, detail={"message": "Last name is required.", "code": "last_name_required"})
    if len(password or "") < 8:
        raise HTTPException(status_code=400, detail={"message": "Password must be at least 8 characters.", "code": "weak_password"})
    if not terms_accepted:
        raise HTTPException(status_code=400, detail={"message": "Accept the service terms before creating an account.", "code": "terms_required"})
    if auth_store.get_user_by_email(normalized_email):
        raise HTTPException(status_code=409, detail={"message": "An account with this email already exists.", "code": "email_exists"})

    user = UserRecord(
        id=f"usr_{uuid4().hex[:12]}",
        email=normalized_email,
        password_hash=hash_password(password),
        first_name=normalized_first_name,
        last_name=normalized_last_name,
        title=normalized_title,
        preferred_language=normalized_language,
    )
    workspace_label = normalized_workspace_name or _default_workspace_name(user.first_name, user.last_name, user.email)
    workspace = WorkspaceRecord(
        id=f"ws_{uuid4().hex[:12]}",
        name=workspace_label,
        slug=_slugify(workspace_label),
        owner_user_id=user.id,
        is_personal=True,
        branding_name="DocketMint",
    )
    membership = MembershipRecord(
        id=f"mem_{uuid4().hex[:12]}",
        workspace_id=workspace.id,
        user_id=user.id,
        role=MembershipRole.VIEWER,
        membership_status=MembershipStatus.ACTIVE,
    )
    auth_store.upsert_user(user)
    auth_store.upsert_workspace(workspace)
    auth_store.upsert_membership(membership)
    session = _create_session_record(user, workspace, request=request)
    return {"payload": session_payload(SessionContext(user=user, workspace=workspace, membership=membership, session=session)), "session": session}


def authenticate_login(email: str, password: str) -> tuple[UserRecord, WorkspaceRecord, MembershipRecord]:
    user = auth_store.get_user_by_email(email)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail={"message": "Invalid email or password.", "code": "invalid_credentials"})
    if user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=403, detail={"message": "This account is not active.", "code": "account_inactive"})
    memberships = [item for item in auth_store.memberships_for_user(user.id) if item.membership_status == MembershipStatus.ACTIVE]
    if not memberships:
        raise HTTPException(status_code=403, detail={"message": "No active account scope is available.", "code": "membership_missing"})
    memberships.sort(key=lambda item: (-_role_priority(item.role), str(item.joined_at)))
    membership = memberships[0]
    workspace = auth_store.get_workspace_by_id(membership.workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail={"message": "Workspace is not available.", "code": "workspace_missing"})
    return user, workspace, membership


def login(email: str, password: str, request: Request | None = None) -> dict[str, object]:
    user, workspace, membership = authenticate_login(email, password)
    session = _create_session_record(user, workspace, request=request)
    return {"payload": session_payload(SessionContext(user=user, workspace=workspace, membership=membership, session=session)), "session": session}


def logout_current_session(request: Request, response: Response) -> dict[str, object]:
    context = get_request_context() or resolve_request_context(request)
    if context:
        context.session.revoked_at = utcnow()
        auth_store.upsert_session(context.session)
    clear_session_cookie(response, request=request)
    set_request_context(None)
    return {"ok": True}


def update_profile(
    request: Request,
    *,
    first_name: str | None = None,
    last_name: str | None = None,
    title: str | None = None,
    preferred_language: str | None = None,
) -> dict[str, object]:
    context = require_session(request)
    user = context.user
    if first_name is not None:
        user.first_name = first_name.strip()
    if last_name is not None:
        user.last_name = last_name.strip()
    if title is not None:
        user.title = title.strip()
    if preferred_language is not None:
        user.preferred_language = _normalize_language(preferred_language)
    auth_store.upsert_user(user)
    set_request_context(SessionContext(user=user, workspace=context.workspace, membership=context.membership, session=context.session))
    return session_payload(get_request_context())


def auth_diagnostics() -> dict[str, object]:
    return {
        "public_auth_mode": "person_first",
        "providers": [],
        "session_cookie_name": SESSION_COOKIE_NAME,
        "cookie_secure_default": settings.cookie_secure,
        "cookie_samesite": settings.cookie_samesite,
        "split_origin_mode": settings.split_origin_mode,
        "canonical_api_base": settings.canonical_api_base,
        "public_api_url": settings.public_api_url,
        "bootstrap_admin_email": settings.bootstrap_admin_email,
        "default_plan": settings.default_plan,
        "enforce_admin_only_case_creation": settings.enforce_admin_only_case_creation,
        "enforce_admin_only_packet_generation": settings.enforce_admin_only_packet_generation,
        "storage_backend": auth_store.storage_backend(),
        "storage_path": str(auth_store.database_path()),
        "storage_path_source": settings.storage_path_source,
        "storage_persistence_risk": settings.storage_persistence_risk,
        "render_runtime_detected": settings.render_runtime_detected,
    }
