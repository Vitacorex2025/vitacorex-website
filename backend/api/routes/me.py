from __future__ import annotations

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from backend.services import auth_service


router = APIRouter(tags=["me"])


class ProfileUpdateRequest(BaseModel):
    first_name: str | None = Field(default=None, max_length=80)
    last_name: str | None = Field(default=None, max_length=80)
    title: str | None = Field(default=None, max_length=120)
    preferred_language: str | None = Field(default=None, max_length=5)


@router.get("/me")
def get_me(request: Request) -> dict[str, object]:
    return auth_service.bootstrap_payload(request)


@router.patch("/me/profile")
def patch_profile(payload: ProfileUpdateRequest, request: Request) -> dict[str, object]:
    return auth_service.update_profile(
        request,
        first_name=payload.first_name,
        last_name=payload.last_name,
        title=payload.title,
        preferred_language=payload.preferred_language,
    )
