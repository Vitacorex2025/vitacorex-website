"""Pydantic models for Deadline Calendar."""

from typing import Optional, List
from pydantic import BaseModel, Field


class CalendarEvent(BaseModel):
    id: str
    title: str
    event_type: str = "followup"
    start_at: str
    end_at: Optional[str] = None
    status: str = "scheduled"
    priority: str = "medium"
    description: Optional[str] = None
    contact_id: Optional[str] = None
    matter_id: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class DayNote(BaseModel):
    id: str
    note_date: str
    short_text: str = ""
    content: str = ""
    status: str = "open"
    display_priority: str = "medium"
    contact_id: Optional[str] = None
    matter_id: Optional[str] = None
    created_at: Optional[str] = None


class EventCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    event_type: str = "followup"
    start_at: str
    end_at: Optional[str] = None
    priority: str = "medium"
    description: Optional[str] = None
    contact_id: Optional[str] = None
    matter_id: Optional[str] = None
    owner_id: str = "default"


class EventUpdate(BaseModel):
    title: Optional[str] = None
    event_type: Optional[str] = None
    start_at: Optional[str] = None
    end_at: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    description: Optional[str] = None
    contact_id: Optional[str] = None
    matter_id: Optional[str] = None


class NoteUpsert(BaseModel):
    note_date: str
    short_text: str = ""
    content: str = ""
    status: str = "open"
    display_priority: str = "medium"
    contact_id: Optional[str] = None
    matter_id: Optional[str] = None
    owner_id: str = "default"


class RiskBucket(BaseModel):
    key: str
    label: str
    count: int
    helper: str


class WeeklyDay(BaseModel):
    date: str
    label: str
    note_excerpt: Optional[str] = None
    events: List[dict] = []
    has_overdue_pressure: bool = False
    overflow_count: int = 0


class HomeSnapshot(BaseModel):
    risk_buckets: List[RiskBucket]
    weekly_memory: List[WeeklyDay]
    kpi: dict = {}


class DayPayload(BaseModel):
    date: str
    events: List[CalendarEvent]
    day_note: Optional[DayNote] = None


class MonthPayload(BaseModel):
    month: str
    events: List[CalendarEvent]
    day_notes: List[DayNote]


class CalendarRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class QuickAddRequest(BaseModel):
    text: str
    date: Optional[str] = None
