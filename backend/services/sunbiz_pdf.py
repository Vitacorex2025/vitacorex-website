from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

from backend.models.case_schema import CaseRecord, SunbizLookupResult


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _fmt_datetime(value: datetime | None) -> str:
    if not value:
        return _utcnow().isoformat()
    return value.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")


def _line_wrap(text: str, font_name: str, font_size: int, width: float) -> list[str]:
    words = str(text or "").split()
    if not words:
        return [""]
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = current + " " + word
        if stringWidth(candidate, font_name, font_size) <= width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def _draw_wrapped(c: canvas.Canvas, x: float, y: float, text: str, width: float, font_name: str = "Helvetica", font_size: int = 10, leading: float = 13.0) -> float:
    c.setFont(font_name, font_size)
    for line in _line_wrap(text, font_name, font_size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def _write_label_value(c: canvas.Canvas, x: float, y: float, label: str, value: str, width: float, line_height: float = 14.0) -> float:
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x, y, label)
    c.setFont("Helvetica", 10)
    lines = _line_wrap(value or "Unavailable", "Helvetica", 10, width)
    current_y = y
    for index, line in enumerate(lines):
        c.drawString(x + 132 if index == 0 else x, current_y, line)
        current_y -= line_height
    return current_y


def build_sunbiz_pdf(case_record: CaseRecord, output_path: str | Path) -> Path:
    if not case_record.sunbiz_lookup:
        raise ValueError("SunBiz verification has not been run for this case.")

    result: SunbizLookupResult = case_record.sunbiz_lookup
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(output_path), pagesize=LETTER)
    width, height = LETTER
    margin = 52
    y = height - margin

    c.setTitle(f"SunBiz Internal Verification Memo - {case_record.id}")
    c.setFont("Helvetica-Bold", 17)
    c.drawString(margin, y, "SunBiz Internal Verification Memo")
    y -= 18
    c.setFont("Helvetica-Bold", 9)
    c.drawString(margin, y, "Internal workflow memo only — not an official State of Florida certificate, certified copy, or court certification.")
    y -= 22

    c.setFont("Helvetica", 10)
    c.drawString(margin, y, f"Case ID: {case_record.id}")
    y -= 14
    c.drawString(margin, y, f"Lookup timestamp: {_fmt_datetime(result.looked_up_at)}")
    y -= 18

    warning_lines = list(result.warnings or [])
    if result.result_classification == "unavailable":
        warning_lines.insert(0, "Live SunBiz integration is not configured. No official SunBiz verification was performed.")
    elif result.result_classification == "no_match":
        warning_lines.insert(0, "No Florida Division of Corporations match was found for the queried entity.")
    if not result.official_record_available:
        warning_lines.append("Do not use this memo as a substitute for an official SunBiz certificate or certified copy.")

    c.setFillColorRGB(0.55, 0.1, 0.1)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(margin, y, "Warnings / legal review notes")
    y -= 16
    c.setFont("Helvetica", 10)
    for warning in warning_lines or ["No additional warnings recorded."]:
        y = _draw_wrapped(c, margin, y, "• " + warning, width - (margin * 2))
    c.setFillColorRGB(0, 0, 0)
    y -= 8

    sections = [
        ("Queried entity:", result.queried_entity_name or "Unavailable"),
        ("Result classification:", result.result_classification or "Unavailable"),
        ("Provider status:", result.provider_status or "Unavailable"),
        ("Matched entity:", result.matched_entity_name or "No official match stored"),
        ("Exact match:", "Yes" if result.exact_match else "No"),
        ("Confidence:", f"{result.match_score:.2f}" if isinstance(result.match_score, (int, float)) else "Not scored"),
        ("Florida document #:", result.florida_document_number or "Unavailable"),
        ("Status:", result.entity_status or "Unavailable"),
        ("Registered agent:", result.registered_agent_name or "Unavailable"),
        ("Registered office:", result.registered_agent_address or result.principal_address or "Unavailable"),
        ("Source URL:", result.source_url or result.detail_url or "Unavailable"),
    ]
    for label, value in sections:
        y = _write_label_value(c, margin, y, label, value, width - (margin * 2) - 132)
        y -= 4

    c.setFont("Helvetica-Bold", 11)
    c.drawString(margin, y, "Officers / managers")
    y -= 16
    c.setFont("Helvetica", 10)
    if result.officers:
        for officer in result.officers:
            parts = [officer.officer_name or "Unnamed officer"]
            if officer.officer_title:
                parts.append(officer.officer_title)
            if officer.officer_address:
                parts.append(officer.officer_address)
            y = _draw_wrapped(c, margin, y, "• " + " — ".join(parts), width - (margin * 2))
    else:
        y = _draw_wrapped(c, margin, y, "No officer or manager data is stored in this memo.", width - (margin * 2))

    y -= 8
    c.setFont("Helvetica-Bold", 11)
    c.drawString(margin, y, "Official-source path")
    y -= 16
    c.setFont("Helvetica", 10)
    proof_steps = [
        "1. If court-facing proof is needed, obtain the official Certificate of Status and/or certified copy directly from SunBiz.",
        "2. Preserve the official result URL, detail page, and timestamp in the case audit log.",
        "3. Do not cite internal memo text as if it were an official State of Florida record.",
    ]
    for step in proof_steps:
        y = _draw_wrapped(c, margin, y, step, width - (margin * 2))

    c.showPage()
    c.save()
    return output_path
