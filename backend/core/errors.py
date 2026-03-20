from __future__ import annotations

import uuid
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

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


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.warning("HTTP exception: %s", exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content=_http_error_payload(exc.detail, request_id),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.warning("Request validation error: %s", exc.errors())
    return JSONResponse(
        status_code=422,
        content={
            **_base_error_payload("validation_error", request_id),
            "error": {
                **_base_error_payload("validation_error", request_id)["error"],
                "message": "Request validation failed.",
            },
            "details": exc.errors(),
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
