"""Pydantic models for Packet Room / Client Portal."""
from pydantic import BaseModel

class PortalSession(BaseModel):
    token: str
    contact_id: str
    expires_at: str

class MatterComment(BaseModel):
    content: str
    author_name: str | None = None

class PacketExportRequest(BaseModel):
    format: str = "pdf"  # pdf|zip
