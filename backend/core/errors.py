from __future__ import annotations

import uuid
from datetime import date, datetime, time
from pathlib import Path
from typing import Any
from uuid import UUID

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.datastructures import UploadFile

from backend.core.logging import get_logger

logger = get_logger(__name__)


def _base_error_payload(error_type: str, request_id: str) -> dict[str, Any]:
    return {
        "success": False,
        "error": {
            "type": error_type,
            "request_id": request_id,
        },
    }


def _http_error_payload(detail: Any, request_id: str) -> dict[str, Any]:
    payload = _base_error_payload("http_error", request_id)

    if isinstance(detail, dict):
        payload["error"]["message"] = str(detail.get("message") or "HTTP error.")
        payload["error"]["detail"] = detail
        return payload

    if isinstance(detail, list):
        payload["error"]["message"] = "HTTP error."
        payload["error"]["detail"] = detail
        return payload

    payload["error"]["message"] = str(detail)
    return payload


def _safe_json_detail(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    if isinstance(value, UploadFile):
        headers = dict(value.headers.items()) if getattr(value, "headers", None) else {}
        return {
            "filename": value.filename,
            "content_type": value.content_type,
            "headers": headers,
        }
    if isinstance(value, dict):
        return {str(key): _safe_json_detail(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set, frozenset)):
        return [_safe_json_detail(item) for item in value]
    if isinstance(value, BaseException):
        return str(value)
    if hasattr(value, "model_dump"):
        try:
            return _safe_json_detail(value.model_dump(mode="json"))
        except Exception:
            return repr(value)
    return repr(value)


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.warning("HTTP exception: %s", exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content=_http_error_payload(exc.detail, request_id),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    safe_errors = _safe_json_detail(exc.errors())
    logger.warning("Request validation error: %s", safe_errors)
    return JSONResponse(
        status_code=422,
        content={
            **_base_error_payload("validation_error", request_id),
            "error": {
                **_base_error_payload("validation_error", request_id)["error"],
                "message": "Request validation failed.",
            },
            "details": safe_errors,
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.exception("Unhandled application exception")
    return JSONResponse(
        status_code=500,
        content={
            **_base_error_payload("server_error", request_id),
            "error": {
                **_base_error_payload("server_error", request_id)["error"],
                "message": "Internal server error.",
            },
        },
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
