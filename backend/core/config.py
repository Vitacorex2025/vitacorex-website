from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

_RENDER_MARKER_ENV_VARS = (
    "RENDER",
    "RENDER_EXTERNAL_URL",
    "RENDER_SERVICE_ID",
    "RENDER_SERVICE_NAME",
)
_RENDER_DISK_MOUNT_ENV_VAR = "DOCKETMINT_RENDER_DISK_MOUNT_PATH"
_DEFAULT_RENDER_DISK_MOUNT = Path("/var/data")
_RENDER_EPHEMERAL_ROOTS = (
    Path("/opt/render/project/src"),
    Path("/opt/render/project"),
)


def _running_on_render() -> bool:
    return any((os.getenv(name) or "").strip() for name in _RENDER_MARKER_ENV_VARS)


def _absolute_path(value: str) -> Path:
    candidate = Path(value).expanduser()
    return candidate if candidate.is_absolute() else (Path.cwd() / candidate).resolve()


def _render_disk_mount_path() -> Path | None:
    override = (os.getenv(_RENDER_DISK_MOUNT_ENV_VAR) or "").strip()
    if not override and not _running_on_render():
        return None
    candidate = _absolute_path(override) if override else _DEFAULT_RENDER_DISK_MOUNT
    return _resolve_loose(candidate)


def _resolve_loose(path: Path) -> Path:
    try:
        return path.resolve(strict=False)
    except (OSError, RuntimeError):
        return path.absolute()


def _path_is_within(candidate: Path, root: Path) -> bool:
    resolved_candidate = _resolve_loose(candidate)
    resolved_root = _resolve_loose(root)
    return resolved_candidate == resolved_root or resolved_root in resolved_candidate.parents


def _storage_path_within_render_disk_mount(candidate: Path) -> bool:
    mount_path = _render_disk_mount_path()
    if mount_path is None:
        return False
    return _path_is_within(candidate, mount_path)


def _storage_mount_verified(source: str, resolved_path: Path) -> bool:
    if not _running_on_render():
        return False
    if source not in {"auto_render_disk", "explicit_env"}:
        return False
    return _storage_path_within_render_disk_mount(resolved_path)


def _uses_render_ephemeral_filesystem(candidate: Path) -> bool:
    if not _running_on_render():
        return False
    resolved_candidate = _resolve_loose(candidate)
    if _storage_path_within_render_disk_mount(resolved_candidate):
        return False
    return any(_path_is_within(resolved_candidate, root) for root in _RENDER_EPHEMERAL_ROOTS)


def _render_disk_storage_path() -> Path | None:
    mount_path = _render_disk_mount_path()
    if mount_path is None:
        return None
    return (mount_path / "docketmint-storage").resolve()


def _as_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _resolve_storage_path(raw_value: str | None) -> Path:
    if raw_value:
        return _absolute_path(raw_value)
    render_disk_storage = _render_disk_storage_path()
    if render_disk_storage is not None:
        return render_disk_storage
    return (Path(__file__).resolve().parents[2] / "storage").resolve()


def _storage_path_source(raw_value: str | None) -> str:
    explicit = (raw_value or "").strip()
    if explicit:
        return "explicit_env"
    if _render_disk_storage_path() is not None:
        return "auto_render_disk"
    return "repo_default"


def _storage_persistence_risk(source: str, resolved_path: Path) -> str:
    if _running_on_render():
        if _storage_mount_verified(source, resolved_path):
            return "low"
        return "high"
    if source == "auto_render_disk":
        return "low"
    return "medium"


def _normalize_origin(value: str | None) -> str:
    return (value or "").strip().rstrip("/")


def storage_guard_runtime_error_message(
    *,
    resolved_storage_path: Path,
    render_disk_mount_path: Path | None,
    storage_path_source: str,
) -> str:
    mount_label = str(render_disk_mount_path) if render_disk_mount_path else "unresolved"
    return (
        "Refusing startup because DocketMint auth storage persistence is not verified on Render.\n"
        f"resolved_storage_path={resolved_storage_path}\n"
        f"render_disk_mount_path={mount_label}\n"
        f"storage_path_source={storage_path_source}\n"
        "startup_block_reason=Production Render deployment must use a verified persistent disk path for auth/session data.\n"
        "fix_env=Set DOCKETMINT_RENDER_DISK_MOUNT_PATH=/var/data and "
        "DOCKETMINT_STORAGE_PATH=/var/data/docketmint-storage, or remove a stale DOCKETMINT_STORAGE_PATH override "
        "that points outside the Render disk mount."
    )


def legacy_render_service_block_message(
    *,
    canonical_root_dir: str,
    render_service_name: str,
) -> str:
    return (
        "Refusing startup because this legacy Python service is not the canonical DocketMint public web target.\n"
        f"render_service_name={render_service_name or 'unknown'}\n"
        f"canonical_release_target=render.yaml -> runtime=node -> rootDir={canonical_root_dir}\n"
        "startup_block_reason=The public dual-engine product now lives in the Next.js app, while the root Python/static stack is retained only for archive and forensic comparison.\n"
        "fix_deploy=In Render, create or update the public web service from the repo-root render.yaml blueprint and move the custom domain to the Node service.\n"
        "override=Only set DOCKETMINT_ALLOW_LEGACY_RENDER_SERVICE=true if you intentionally need the archive Python service for a non-public internal task."
    )


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("DOCKETMINT_APP_NAME", "DocketMint API")
    app_env: str = os.getenv("DOCKETMINT_ENV", os.getenv("APP_ENV", "development"))
    api_v1_prefix: str = os.getenv("DOCKETMINT_API_PREFIX", "/api")
    frontend_url: str = _normalize_origin(os.getenv("DOCKETMINT_FRONTEND_URL", ""))
    public_app_url: str = _normalize_origin(os.getenv("DOCKETMINT_PUBLIC_APP_URL", "https://docketmint.app"))
    public_app_www_url: str = _normalize_origin(os.getenv("DOCKETMINT_PUBLIC_APP_WWW_URL", "https://www.docketmint.app"))
    render_service_url: str = _normalize_origin(os.getenv("DOCKETMINT_RENDER_SERVICE_URL", "https://docketmint.onrender.com"))
    split_origin_mode: bool = _as_bool(os.getenv("DOCKETMINT_SPLIT_ORIGIN_MODE"), default=False)
    configured_public_api_url: str = _normalize_origin(os.getenv("DOCKETMINT_PUBLIC_API_URL", ""))
    storage_path: Path = _resolve_storage_path(os.getenv("DOCKETMINT_STORAGE_PATH"))
    max_upload_file_size_mb: int = int(os.getenv("DOCKETMINT_MAX_UPLOAD_MB", "25"))
    live_sunbiz_lookup_enabled: bool = _as_bool(os.getenv("DOCKETMINT_ENABLE_LIVE_SUNBIZ"), default=False)
    sunbiz_timeout_seconds: float = float(os.getenv("DOCKETMINT_SUNBIZ_TIMEOUT_SECONDS", "12"))
    allowed_origins_raw: str = os.getenv("DOCKETMINT_ALLOWED_ORIGINS", "")
    log_level: str = os.getenv("DOCKETMINT_LOG_LEVEL", "INFO")
    session_cookie_name: str = os.getenv("DOCKETMINT_SESSION_COOKIE_NAME", "docketmint_session")
    session_cookie_domain: str = os.getenv("DOCKETMINT_SESSION_COOKIE_DOMAIN", "").strip()
    session_cookie_secure_override: str = os.getenv("DOCKETMINT_SESSION_COOKIE_SECURE", "").strip().lower()
    session_cookie_samesite_override: str = os.getenv("DOCKETMINT_SESSION_COOKIE_SAMESITE", "").strip().lower()
    bootstrap_admin_email: str = os.getenv("DOCKETMINT_BOOTSTRAP_ADMIN_EMAIL", "").strip().lower()
    bootstrap_admin_password: str = os.getenv("DOCKETMINT_BOOTSTRAP_ADMIN_PASSWORD", "")
    default_plan: str = os.getenv("DOCKETMINT_DEFAULT_PLAN", "auto").strip().lower()
    enforce_admin_only_case_creation: bool = _as_bool(
        os.getenv("DOCKETMINT_ENFORCE_ADMIN_ONLY_CASE_CREATION"),
        default=False,
    )
    enforce_admin_only_packet_generation: bool = _as_bool(
        os.getenv("DOCKETMINT_ENFORCE_ADMIN_ONLY_PACKET_GENERATION"),
        default=False,
    )
    allow_legacy_render_service: bool = _as_bool(
        os.getenv("DOCKETMINT_ALLOW_LEGACY_RENDER_SERVICE"),
        default=False,
    )

    @property
    def public_api_url(self) -> str:
        if not self.split_origin_mode:
            return self.api_v1_prefix
        if self.configured_public_api_url:
            return self.configured_public_api_url
        return f"{self.render_service_url}{self.api_v1_prefix}"

    @property
    def canonical_api_base(self) -> str:
        return self.api_v1_prefix if not self.split_origin_mode else self.public_api_url

    @property
    def backend_candidates(self) -> list[str]:
        candidates = [self.canonical_api_base]
        if self.split_origin_mode:
            candidates.append(f"{self.render_service_url}{self.api_v1_prefix}")
        ordered: list[str] = []
        for item in candidates:
            normalized = _normalize_origin(item)
            if normalized and normalized not in ordered:
                ordered.append(normalized)
        return ordered

    @property
    def allowed_origins(self) -> list[str]:
        configured = [_normalize_origin(item) for item in self.allowed_origins_raw.split(",") if item.strip()]
        defaults = [
            self.frontend_url,
            self.public_app_url,
            self.public_app_www_url,
            self.render_service_url,
            self.configured_public_api_url.replace("/api", "") if self.configured_public_api_url else "",
            "https://docketmint.vercel.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
        ordered: list[str] = []
        for item in defaults + configured:
            if item and item not in ordered:
                ordered.append(item)
        return ordered

    @property
    def cookie_secure(self) -> bool:
        if self.session_cookie_secure_override in {"1", "true", "yes", "on"}:
            return True
        if self.session_cookie_secure_override in {"0", "false", "no", "off"}:
            return False
        return self.split_origin_mode or self.app_env.lower() == "production"

    @property
    def cookie_samesite(self) -> str:
        if self.session_cookie_samesite_override in {"lax", "strict", "none"}:
            return self.session_cookie_samesite_override
        return "none" if self.split_origin_mode else "lax"

    @property
    def render_runtime_detected(self) -> bool:
        return _running_on_render()

    @property
    def render_disk_mount_path(self) -> Path | None:
        return _render_disk_mount_path()

    @property
    def storage_path_source(self) -> str:
        return _storage_path_source(os.getenv("DOCKETMINT_STORAGE_PATH"))

    @property
    def storage_path_within_render_disk_mount(self) -> bool:
        return _storage_path_within_render_disk_mount(self.storage_path)

    @property
    def storage_mount_verified(self) -> bool:
        return _storage_mount_verified(self.storage_path_source, self.storage_path)

    @property
    def storage_persistence_risk(self) -> str:
        return _storage_persistence_risk(self.storage_path_source, self.storage_path)

    @property
    def startup_guard_enabled(self) -> bool:
        return self.render_runtime_detected and self.app_env.lower() == "production"


settings = Settings()
