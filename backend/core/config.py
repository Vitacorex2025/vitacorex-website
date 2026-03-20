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
    try:
        if candidate.exists() and candidate.is_dir():
            return candidate.resolve()
    except OSError:
        return None
    return None


def _as_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _resolve_storage_path(raw_value: str | None) -> Path:
    if raw_value:
        return _absolute_path(raw_value)
    render_disk_mount = _render_disk_mount_path()
    if render_disk_mount is not None:
        return (render_disk_mount / "docketmint-storage").resolve()
    return (Path(__file__).resolve().parents[2] / "storage").resolve()


def _normalize_origin(value: str | None) -> str:
    return (value or "").strip().rstrip("/")


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
    def storage_path_source(self) -> str:
        explicit = (os.getenv("DOCKETMINT_STORAGE_PATH") or "").strip()
        if explicit:
            return "explicit_env"
        if _render_disk_mount_path() is not None:
            return "auto_render_disk"
        return "repo_default"

    @property
    def storage_persistence_risk(self) -> str:
        if self.render_runtime_detected and self.storage_path_source == "repo_default":
            return "high"
        if self.storage_path_source in {"explicit_env", "auto_render_disk"}:
            return "low"
        return "medium"


settings = Settings()
settings.storage_path.mkdir(parents=True, exist_ok=True)
