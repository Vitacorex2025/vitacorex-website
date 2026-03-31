from __future__ import annotations

from fastapi import APIRouter, Request, Response
from pydantic import BaseModel, Field

from backend.services import auth_service


router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str = Field(min_length=8)


class SignupRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    email: str
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)
    workspace_name: str | None = Field(default=None, max_length=140)
    title: str | None = Field(default=None, max_length=120)
    preferred_language: str = "en"
    terms_accepted: bool = False


@router.get("/auth/diagnostics")
def get_auth_diagnostics(request: Request) -> dict[str, object]:
    return auth_service.auth_diagnostics(request)


@router.get("/auth/session")
def get_auth_session(request: Request) -> dict[str, object]:
    return auth_service.bootstrap_payload(request)


@router.post("/auth/signup")
def signup(payload: SignupRequest, request: Request, response: Response) -> dict[str, object]:
    if payload.password != payload.confirm_password:
        from fastapi import HTTPException

        raise HTTPException(status_code=400, detail={"message": "Passwords do not match.", "code": "password_mismatch"})
    result = auth_service.signup(
        payload.first_name,
        payload.last_name,
        payload.email,
        payload.password,
        workspace_name=payload.workspace_name,
        title=payload.title,
        preferred_language=payload.preferred_language,
        terms_accepted=payload.terms_accepted,
        request=request,
    )
    auth_service.attach_session_cookie(response, result["session"], request=request)
    return result["payload"]


@router.post("/auth/login")
def login(payload: LoginRequest, request: Request, response: Response) -> dict[str, object]:
    result = auth_service.login(payload.email, payload.password, request=request)
    auth_service.attach_session_cookie(response, result["session"], request=request)
    return result["payload"]


@router.post("/auth/logout")
def logout(request: Request, response: Response) -> dict[str, object]:
    return auth_service.logout_current_session(request, response)
