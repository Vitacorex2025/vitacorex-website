"""Generate 4 professional VitaCoreX executive PDFs with charts, TOC, and dense content.

Usage: python generate_pdfs.py
Output: Overwrites the 4 PDFs in the same directory.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable,
)
from reportlab.platypus.flowables import Flowable
from reportlab.graphics.shapes import Drawing, Rect, String, Line as GLine, Circle, Polygon
from reportlab.graphics import renderPDF
import os, sys

# ── Brand colors ──────────────────────────────────────────────────────
TEAL = HexColor("#2D8A82")
DARK = HexColor("#1A2F2A")
MUTED = HexColor("#4A6B62")
LIGHT_BG = HexColor("#F6F2EA")
LIGHT_TEAL = HexColor("#E8F4F2")
ACCENT = HexColor("#3D9E94")
RED_ACCENT = HexColor("#8B4348")
GOLD = HexColor("#B89963")

DIR = os.path.dirname(os.path.abspath(__file__))
PAGE_W, PAGE_H = letter
CONTENT_W = PAGE_W - 2 * inch  # usable width with 1in margins


# ── Styles ────────────────────────────────────────────────────────────

def build_styles():
    ss = getSampleStyleSheet()
    ss.add(ParagraphStyle("VCXTitle", parent=ss["Title"],
        fontName="Helvetica-Bold", fontSize=24, leading=30, textColor=DARK, spaceAfter=4))
    ss.add(ParagraphStyle("VCXSubtitle", parent=ss["Normal"],
        fontName="Helvetica", fontSize=11, leading=15, textColor=MUTED, spaceAfter=14))
    ss.add(ParagraphStyle("VCXH1", parent=ss["Heading1"],
        fontName="Helvetica-Bold", fontSize=15, leading=20, textColor=TEAL,
        spaceBefore=14, spaceAfter=6))
    ss.add(ParagraphStyle("VCXH2", parent=ss["Heading2"],
        fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=DARK,
        spaceBefore=10, spaceAfter=5))
    ss.add(ParagraphStyle("VCXH3", parent=ss["Heading3"],
        fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=MUTED,
        spaceBefore=8, spaceAfter=4))
    ss.add(ParagraphStyle("VCXBody", parent=ss["Normal"],
        fontName="Helvetica", fontSize=9, leading=13, textColor=DARK,
        alignment=TA_JUSTIFY, spaceAfter=4))
    ss.add(ParagraphStyle("VCXBodyDense", parent=ss["Normal"],
        fontName="Helvetica", fontSize=8.5, leading=12, textColor=DARK,
        alignment=TA_JUSTIFY, spaceAfter=3))
    ss.add(ParagraphStyle("VCXBullet", parent=ss["Normal"],
        fontName="Helvetica", fontSize=9, leading=13, textColor=DARK,
        leftIndent=18, bulletIndent=6, spaceBefore=1, spaceAfter=1))
    ss.add(ParagraphStyle("VCXBulletDense", parent=ss["Normal"],
        fontName="Helvetica", fontSize=8.5, leading=12, textColor=DARK,
        leftIndent=18, bulletIndent=6, spaceBefore=1, spaceAfter=1))
    ss.add(ParagraphStyle("VCXSource", parent=ss["Normal"],
        fontName="Helvetica-Oblique", fontSize=7, leading=9, textColor=MUTED, spaceAfter=3))
    ss.add(ParagraphStyle("VCXDisclaimer", parent=ss["Normal"],
        fontName="Helvetica-Oblique", fontSize=7, leading=9, textColor=MUTED, spaceBefore=8))
    ss.add(ParagraphStyle("VCXFooter", parent=ss["Normal"],
        fontName="Helvetica", fontSize=7, leading=9, textColor=MUTED, alignment=TA_CENTER))
    ss.add(ParagraphStyle("VCXMetricBig", parent=ss["Normal"],
        fontName="Helvetica-Bold", fontSize=24, leading=30, textColor=TEAL, alignment=TA_CENTER))
    ss.add(ParagraphStyle("VCXMetricLabel", parent=ss["Normal"],
        fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED, alignment=TA_CENTER))
    ss.add(ParagraphStyle("VCXCallout", parent=ss["Normal"],
        fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=DARK,
        leftIndent=12, borderPadding=6, spaceBefore=6, spaceAfter=6))
    ss.add(ParagraphStyle("VCXCalloutBody", parent=ss["Normal"],
        fontName="Helvetica", fontSize=9, leading=12, textColor=DARK,
        leftIndent=12, spaceBefore=2, spaceAfter=4))
    ss.add(ParagraphStyle("VCXTOC", parent=ss["Normal"],
        fontName="Helvetica", fontSize=10, leading=18, textColor=DARK, spaceAfter=2))
    ss.add(ParagraphStyle("VCXTOCTitle", parent=ss["Normal"],
        fontName="Helvetica-Bold", fontSize=16, leading=22, textColor=TEAL,
        spaceBefore=20, spaceAfter=16))
    ss.add(ParagraphStyle("VCXConfBadge", parent=ss["Normal"],
        fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=RED_ACCENT,
        alignment=TA_CENTER, spaceBefore=6, spaceAfter=4))
    return ss


# ── Helper functions ──────────────────────────────────────────────────

def b(text, ss):
    return Paragraph(f"<bullet>&bull;</bullet> {text}", ss["VCXBullet"])

def bd(text, ss):
    return Paragraph(f"<bullet>&bull;</bullet> {text}", ss["VCXBulletDense"])

def src(text, ss):
    return Paragraph(text, ss["VCXSource"])

def body(text, ss):
    return Paragraph(text, ss["VCXBody"])

def bodyd(text, ss):
    return Paragraph(text, ss["VCXBodyDense"])

def h1(text, ss):
    return Paragraph(text, ss["VCXH1"])

def h2(text, ss):
    return Paragraph(text, ss["VCXH2"])

def h3(text, ss):
    return Paragraph(text, ss["VCXH3"])

def sp(pts=6):
    return Spacer(1, pts)

def callout(title, text, ss):
    """Teal-bordered callout box."""
    data = [[Paragraph(f"<b>{title}</b>", ss["VCXCallout"]),
             Paragraph(text, ss["VCXCalloutBody"])]]
    t = Table(data, colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_TEAL),
        ("BOX", (0, 0), (-1, -1), 1.5, TEAL),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


def make_metric_table(metrics, ss):
    """metrics = [(value, label), ...]"""
    row_vals = [Paragraph(v, ss["VCXMetricBig"]) for v, l in metrics]
    row_labels = [Paragraph(l, ss["VCXMetricLabel"]) for v, l in metrics]
    col_w = CONTENT_W / len(metrics)
    t = Table([row_vals, row_labels], colWidths=[col_w] * len(metrics))
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, 0), 8),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING", (0, 1), (-1, 1), 0),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_TEAL),
        ("BOX", (0, 0), (-1, -1), 0.5, TEAL),
    ]))
    return t


def make_table(headers, rows, ss, col_widths=None):
    """Standard data table with dense VCX styling."""
    sth = ParagraphStyle("th", parent=ss["VCXBody"], fontName="Helvetica-Bold", fontSize=8, textColor=white, leading=11)
    std = ParagraphStyle("td", parent=ss["VCXBody"], fontSize=8, leading=11, spaceAfter=1)
    data = [[Paragraph(h, sth) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), std) for c in row])
    if col_widths is None:
        col_widths = [CONTENT_W / len(headers)] * len(headers)
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, HexColor("#D0D0D0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def make_table_gold_header(headers, rows, ss, col_widths=None):
    """Gold-accented header table for differentiation."""
    sth = ParagraphStyle("thg", parent=ss["VCXBody"], fontName="Helvetica-Bold", fontSize=8, textColor=white, leading=11)
    std = ParagraphStyle("tdg", parent=ss["VCXBody"], fontSize=8, leading=11, spaceAfter=1)
    data = [[Paragraph(h, sth) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), std) for c in row])
    if col_widths is None:
        col_widths = [CONTENT_W / len(headers)] * len(headers)
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), GOLD),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, HexColor("#D0D0D0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


# ── Chart helpers ─────────────────────────────────────────────────────

def make_bar_chart(data_pairs, title, width=460, height=180, bar_color=TEAL, accent_color=ACCENT):
    """Bar chart using Drawing primitives. data_pairs = [(label, value), ...]"""
    d = Drawing(width, height)
    n = len(data_pairs)
    max_val = max(v for _, v in data_pairs) * 1.15
    chart_left = 50
    chart_bottom = 35
    chart_width = width - chart_left - 20
    chart_height = height - chart_bottom - 30
    # Title
    d.add(String(width / 2, height - 12, title, fontSize=9, fontName="Helvetica-Bold",
                 fillColor=DARK, textAnchor="middle"))
    # Y-axis line
    d.add(GLine(chart_left, chart_bottom, chart_left, chart_bottom + chart_height,
                strokeColor=HexColor("#CCCCCC"), strokeWidth=0.5))
    # X-axis line
    d.add(GLine(chart_left, chart_bottom, chart_left + chart_width, chart_bottom,
                strokeColor=HexColor("#CCCCCC"), strokeWidth=0.5))
    # Gridlines
    for i in range(5):
        y = chart_bottom + (chart_height * (i + 1) / 5)
        d.add(GLine(chart_left, y, chart_left + chart_width, y,
                    strokeColor=HexColor("#EEEEEE"), strokeWidth=0.3))
        val = max_val * (i + 1) / 5
        if max_val > 1000:
            label = f"${val/1000:.0f}K" if val >= 1000 else f"${val:.0f}"
        elif max_val > 100:
            label = f"{val:.0f}%"
        else:
            label = f"{val:.0f}"
        d.add(String(chart_left - 4, y - 3, label, fontSize=6, fontName="Helvetica",
                     fillColor=MUTED, textAnchor="end"))
    bar_width = (chart_width / n) * 0.6
    gap = (chart_width / n) * 0.4
    for i, (label, value) in enumerate(data_pairs):
        x = chart_left + (chart_width / n) * i + gap / 2
        bar_h = (value / max_val) * chart_height if max_val > 0 else 0
        colors = [TEAL, ACCENT, GOLD, RED_ACCENT, MUTED, HexColor("#5BA3A0"), HexColor("#8B7355")]
        c = colors[i % len(colors)]
        d.add(Rect(x, chart_bottom, bar_width, bar_h, fillColor=c, strokeColor=None))
        # Value label on bar
        if max_val > 1000:
            vl = f"${value/1000:.0f}K" if value >= 1000 else f"${value:.0f}"
        elif max_val > 1:
            vl = f"{value:.0f}%"
        else:
            vl = f"{value:.1f}"
        d.add(String(x + bar_width / 2, chart_bottom + bar_h + 3, vl,
                     fontSize=6, fontName="Helvetica-Bold", fillColor=c, textAnchor="middle"))
        # X label
        d.add(String(x + bar_width / 2, chart_bottom - 12, label,
                     fontSize=6, fontName="Helvetica", fillColor=MUTED, textAnchor="middle"))
    return d


def make_dual_bar_chart(data_pairs, title, legend, width=460, height=190):
    """Grouped bar chart with two bars per category. data_pairs = [(label, val1, val2), ...]"""
    d = Drawing(width, height)
    n = len(data_pairs)
    all_vals = []
    for _, v1, v2 in data_pairs:
        all_vals.extend([v1, v2])
    max_val = max(all_vals) * 1.15
    chart_left = 55
    chart_bottom = 35
    chart_width = width - chart_left - 20
    chart_height = height - chart_bottom - 35
    d.add(String(width / 2, height - 12, title, fontSize=9, fontName="Helvetica-Bold",
                 fillColor=DARK, textAnchor="middle"))
    d.add(GLine(chart_left, chart_bottom, chart_left, chart_bottom + chart_height,
                strokeColor=HexColor("#CCCCCC"), strokeWidth=0.5))
    d.add(GLine(chart_left, chart_bottom, chart_left + chart_width, chart_bottom,
                strokeColor=HexColor("#CCCCCC"), strokeWidth=0.5))
    for i in range(5):
        y = chart_bottom + (chart_height * (i + 1) / 5)
        d.add(GLine(chart_left, y, chart_left + chart_width, y,
                    strokeColor=HexColor("#EEEEEE"), strokeWidth=0.3))
        val = max_val * (i + 1) / 5
        label = f"${val/1000:.0f}K" if val >= 1000 else f"{val:.0f}%"
        d.add(String(chart_left - 4, y - 3, label, fontSize=6, fontName="Helvetica",
                     fillColor=MUTED, textAnchor="end"))
    group_w = chart_width / n
    bar_w = group_w * 0.3
    for i, (label, v1, v2) in enumerate(data_pairs):
        x_base = chart_left + group_w * i + group_w * 0.1
        h1v = (v1 / max_val) * chart_height if max_val > 0 else 0
        h2v = (v2 / max_val) * chart_height if max_val > 0 else 0
        d.add(Rect(x_base, chart_bottom, bar_w, h1v, fillColor=TEAL, strokeColor=None))
        d.add(Rect(x_base + bar_w + 2, chart_bottom, bar_w, h2v, fillColor=GOLD, strokeColor=None))
        d.add(String(x_base + bar_w, chart_bottom - 12, label,
                     fontSize=6, fontName="Helvetica", fillColor=MUTED, textAnchor="middle"))
    # Legend
    lx = chart_left + chart_width - 120
    ly = height - 25
    d.add(Rect(lx, ly, 8, 8, fillColor=TEAL, strokeColor=None))
    d.add(String(lx + 12, ly + 1, legend[0], fontSize=6, fontName="Helvetica", fillColor=DARK))
    d.add(Rect(lx + 70, ly, 8, 8, fillColor=GOLD, strokeColor=None))
    d.add(String(lx + 82, ly + 1, legend[1], fontSize=6, fontName="Helvetica", fillColor=DARK))
    return d


def make_line_chart(data_points, title, x_labels, y_label="", width=460, height=180):
    """Line chart for decay curves. data_points = [val1, val2, ...]"""
    d = Drawing(width, height)
    n = len(data_points)
    max_val = max(data_points) * 1.1
    chart_left = 50
    chart_bottom = 35
    chart_width = width - chart_left - 20
    chart_height = height - chart_bottom - 30
    d.add(String(width / 2, height - 12, title, fontSize=9, fontName="Helvetica-Bold",
                 fillColor=DARK, textAnchor="middle"))
    d.add(GLine(chart_left, chart_bottom, chart_left, chart_bottom + chart_height,
                strokeColor=HexColor("#CCCCCC"), strokeWidth=0.5))
    d.add(GLine(chart_left, chart_bottom, chart_left + chart_width, chart_bottom,
                strokeColor=HexColor("#CCCCCC"), strokeWidth=0.5))
    # Y-axis labels
    for i in range(5):
        y = chart_bottom + (chart_height * (i + 1) / 5)
        d.add(GLine(chart_left, y, chart_left + chart_width, y,
                    strokeColor=HexColor("#EEEEEE"), strokeWidth=0.3))
        val = max_val * (i + 1) / 5
        d.add(String(chart_left - 4, y - 3, f"{val:.0f}%", fontSize=6, fontName="Helvetica",
                     fillColor=MUTED, textAnchor="end"))
    # Shaded area under curve
    points_for_fill = []
    for i in range(n):
        x = chart_left + (chart_width / (n - 1)) * i if n > 1 else chart_left
        y = chart_bottom + (data_points[i] / max_val) * chart_height
        points_for_fill.append((x, y))
    # Draw line segments and dots
    for i in range(n):
        x = chart_left + (chart_width / (n - 1)) * i if n > 1 else chart_left
        y = chart_bottom + (data_points[i] / max_val) * chart_height
        if i > 0:
            px = chart_left + (chart_width / (n - 1)) * (i - 1)
            py = chart_bottom + (data_points[i - 1] / max_val) * chart_height
            d.add(GLine(px, py, x, y, strokeColor=TEAL, strokeWidth=2))
        d.add(Circle(x, y, 3, fillColor=TEAL, strokeColor=white, strokeWidth=1))
        d.add(String(x, y + 6, f"{data_points[i]:.0f}%", fontSize=6, fontName="Helvetica-Bold",
                     fillColor=TEAL, textAnchor="middle"))
        if i < len(x_labels):
            d.add(String(x, chart_bottom - 12, x_labels[i], fontSize=6, fontName="Helvetica",
                         fillColor=MUTED, textAnchor="middle"))
    # Red danger zone
    danger_x = chart_left + (chart_width / (n - 1)) * 3 if n > 3 else chart_left + chart_width * 0.6
    d.add(Rect(danger_x, chart_bottom, chart_left + chart_width - danger_x, chart_height,
               fillColor=HexColor("#8B434815"), strokeColor=None, fillOpacity=0.08))
    return d


def make_waterfall_chart(items, title, width=460, height=200):
    """Waterfall chart for ROI. items = [(label, value, 'add'|'sub'|'total'), ...]"""
    d = Drawing(width, height)
    n = len(items)
    vals = [abs(v) for _, v, _ in items]
    max_running = 0
    running = 0
    for _, v, t in items:
        if t == 'total':
            running = v
        elif t == 'add':
            running += v
        else:
            running -= v
        if abs(running) > max_running:
            max_running = abs(running)
        if abs(v) > max_running:
            max_running = abs(v)
    max_val = max_running * 1.3
    chart_left = 50
    chart_bottom = 35
    chart_width = width - chart_left - 20
    chart_height = height - chart_bottom - 30
    d.add(String(width / 2, height - 12, title, fontSize=9, fontName="Helvetica-Bold",
                 fillColor=DARK, textAnchor="middle"))
    d.add(GLine(chart_left, chart_bottom, chart_left + chart_width, chart_bottom,
                strokeColor=HexColor("#CCCCCC"), strokeWidth=0.5))
    bar_width = (chart_width / n) * 0.6
    gap = (chart_width / n) * 0.2
    running = 0
    for i, (label, value, typ) in enumerate(items):
        x = chart_left + (chart_width / n) * i + gap
        if typ == 'total':
            base_y = chart_bottom
            bar_h = (value / max_val) * chart_height
            color = TEAL
            running = value
        elif typ == 'add':
            base_y = chart_bottom + (running / max_val) * chart_height
            bar_h = (value / max_val) * chart_height
            color = ACCENT
            running += value
        else:  # sub
            running -= value
            base_y = chart_bottom + (running / max_val) * chart_height
            bar_h = (value / max_val) * chart_height
            color = RED_ACCENT
        d.add(Rect(x, base_y, bar_width, bar_h, fillColor=color, strokeColor=None))
        vl = f"${value/1000:.0f}K" if value >= 1000 else f"${value:.0f}"
        d.add(String(x + bar_width / 2, base_y + bar_h + 3, vl,
                     fontSize=6, fontName="Helvetica-Bold", fillColor=color, textAnchor="middle"))
        d.add(String(x + bar_width / 2, chart_bottom - 12, label,
                     fontSize=5.5, fontName="Helvetica", fillColor=MUTED, textAnchor="middle"))
    return d


class DrawingFlowable(Flowable):
    """Wrap a reportlab Drawing as a platypus Flowable."""
    def __init__(self, drawing):
        Flowable.__init__(self)
        self.drawing = drawing
        self.width = drawing.width
        self.height = drawing.height

    def wrap(self, availWidth, availHeight):
        return self.width, self.height

    def draw(self):
        renderPDF.draw(self.drawing, self.canv, 0, 0)


# ── Page templates ────────────────────────────────────────────────────

def footer_func(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(PAGE_W / 2, 0.45 * inch,
        f"VitaCoreX LLC | Tampa, FL | (888) 794-8292 | vitacorexllc.com | Page {doc.page}")
    canvas.drawCentredString(PAGE_W / 2, 0.30 * inch,
        "VitaCoreX LLC is not a law firm and does not provide legal representation.")
    canvas.restoreState()


def cover_page(title, subtitle, doc_type, ss):
    story = []
    story.append(Spacer(1, 1.8 * inch))
    # Proprietary methodology badge
    badge_data = [[Paragraph("PROPRIETARY", ss["VCXConfBadge"])]]
    badge = Table(badge_data, colWidths=[1.4 * inch])
    badge.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 1.5, RED_ACCENT),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(badge)
    story.append(sp(20))
    story.append(Paragraph(title, ss["VCXTitle"]))
    story.append(Paragraph(subtitle, ss["VCXSubtitle"]))
    story.append(sp(8))
    story.append(HRFlowable(width="60%", thickness=2, color=TEAL, spaceAfter=10))
    story.append(Paragraph(doc_type.upper(), ParagraphStyle(
        "coverType", fontName="Helvetica-Bold", fontSize=9,
        textColor=TEAL, alignment=TA_CENTER, spaceAfter=20)))
    story.append(Paragraph("VitaCoreX LLC  |  Tampa, FL  |  EIN 41-4399148",
        ParagraphStyle("ci1", fontName="Helvetica", fontSize=9, textColor=MUTED, alignment=TA_CENTER, spaceAfter=3)))
    story.append(Paragraph("(888) 794-8292  |  vitacorexllc.com",
        ParagraphStyle("ci2", fontName="Helvetica", fontSize=9, textColor=MUTED, alignment=TA_CENTER, spaceAfter=3)))
    story.append(sp(40))
    story.append(Paragraph(
        "Copyright 2026 VitaCoreX LLC. All rights reserved. Proprietary methodology. "
        "Intended for executive review and internal forwarding within the recipient organization.", ss["VCXDisclaimer"]))
    story.append(PageBreak())
    return story


def toc_page(sections, ss):
    """Table of Contents page."""
    story = []
    story.append(Paragraph("Table of Contents", ss["VCXTOCTitle"]))
    story.append(HRFlowable(width="100%", thickness=1, color=TEAL, spaceAfter=14))
    for i, (section_title, page_hint) in enumerate(sections, 1):
        dots = "." * max(2, 60 - len(section_title) - len(str(i)))
        story.append(Paragraph(
            f"<b>{i}.</b>  {section_title} <font color='#4A6B62'>{dots}</font> <b>{page_hint}</b>",
            ss["VCXTOC"]))
    story.append(sp(20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#D0D0D0"), spaceAfter=10))
    story.append(Paragraph(
        "This document contains proprietary analysis and industry research compiled by VitaCoreX LLC. "
        "All data sources are cited inline. Financial projections are illustrative and based on published "
        "industry benchmarks. Actual results depend on implementation, payer mix, patient demographics, "
        "and operational execution.", ss["VCXDisclaimer"]))
    story.append(PageBreak())
    return story


# ══════════════════════════════════════════════════════════════════════
# PDF 1: Healthcare Revenue Leakage Brief (14+ pages)
# ══════════════════════════════════════════════════════════════════════

def build_healthcare_leakage():
    print("  [1/4] Building lead-magnet-healthcare.pdf ...")
    ss = build_styles()
    path = os.path.join(DIR, "lead-magnet-healthcare.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
        topMargin=0.7*inch, bottomMargin=0.7*inch, leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Revenue Leakage in<br/>Healthcare Operators",
        "Industry research, benchmarks, and the case for<br/>structured pre-collection infrastructure",
        "Executive Brief  |  Healthcare Operators  |  2026", ss)

    # TOC
    story += toc_page([
        ("Executive Summary", "3"),
        ("Industry Landscape: U.S. Healthcare Spending", "4"),
        ("Five Revenue Leakage Points", "5"),
        ("Recovery Probability by Aging", "8"),
        ("Financial Impact Model", "9"),
        ("Structured Recovery Model", "11"),
        ("Regulatory Landscape", "12"),
        ("Implementation Risk Assessment", "13"),
        ("Next Steps and Engagement Path", "14"),
    ], ss)

    # ── Executive Summary ──
    story.append(h1("Executive Summary", ss))
    story.append(body(
        "Healthcare operators across the United States face a systemic revenue leakage problem that begins "
        "long before accounts reach external collections. Industry data from HFMA, MGMA, CMS, and the Kaiser "
        "Family Foundation consistently shows that workflow fragmentation, documentation gaps, unstructured payment "
        "plans, and premature agency escalation erode 5-15% of collectible patient revenue annually. For a mid-size "
        "practice generating $10M in annual revenue, this represents $500K-$1.5M in avoidable losses each year.", ss))
    story.append(body(
        "This brief presents the research foundation, industry benchmarks, financial models, and regulatory "
        "framework for structured pre-collection recovery. The analysis draws on published data from 2022-2024 "
        "sources including CMS National Health Expenditure data, MGMA DataDive benchmarks, HFMA best practices, "
        "ACA International recovery surveys, and CFPB consumer complaint analysis.", ss))
    story.append(sp(6))
    story.append(make_metric_table([
        ("$4.7T", "U.S. healthcare\nspending (2023)"),
        ("30-35%", "Patient financial\nresponsibility share"),
        ("49 days", "Average physician\npractice DSO"),
        ("5-15%", "Estimated collectible\nrevenue leakage"),
    ], ss))
    story.append(src(
        "Sources: CMS National Health Expenditure Data 2023; MGMA DataDive 2024; "
        "HFMA Patient Financial Communications Best Practices 2024; "
        "Becker's Healthcare Revenue Cycle Report 2024.", ss))
    story.append(sp(6))
    # Executive one-pager chart
    story.append(DrawingFlowable(make_bar_chart([
        ("Payer\nCollect", 96), ("Patient\nCollect", 15), ("Agency\nNet Yield", 12),
        ("Pre-Collect\nNet Yield", 48), ("Bad Debt\nWrite-Off", 6),
    ], "Collection Efficiency by Channel (cents per dollar)", width=460, height=170)))
    story.append(src("Source: MGMA DataDive 2024; ACA International Recovery Benchmarking 2024; HFMA 2024.", ss))
    story.append(sp(4))
    story.append(callout("Key Finding",
        "Practices deploying structured pre-collection workflows recover 3-4x more per dollar than those "
        "relying solely on agency placement. The 60-90 day aging window is the critical intervention period "
        "where recovery probability drops from 55% to below 35%.", ss))
    story.append(PageBreak())

    # ── Section 1: Industry Landscape (2 pages) ──
    story.append(h1("Section 1: Industry Landscape", ss))
    story.append(h2("The Scale of Healthcare Revenue at Risk", ss))
    story.append(body(
        "U.S. national health expenditure reached $4.7 trillion in 2023, representing 17.6% of GDP "
        "(CMS, 2024). The trajectory of healthcare spending has been consistently upward, with CMS "
        "projecting expenditures to reach $6.2 trillion by 2028. Within this spending, the shift toward "
        "consumer-directed healthcare has fundamentally altered the revenue cycle for providers.", ss))
    story.append(body(
        "As high-deductible health plans (HDHPs) continue to expand enrollment, patient out-of-pocket "
        "responsibility has grown substantially. The Kaiser Family Foundation reports that the average "
        "annual deductible for employer-sponsored plans reached $1,735 for single coverage in 2023, up "
        "from $303 in 2006 -- a 473% increase in less than two decades. Over 55% of covered workers now "
        "have a deductible of $1,000 or more, compared to just 10% in 2006.", ss))
    story.append(body(
        "This shift transfers a growing share of collectible revenue from payers (insurance companies) to patients, "
        "where collection rates are materially lower. MGMA reports that physician practices now collect "
        "an average of only 15.3 cents per dollar of patient responsibility, compared to 95.6 cents per "
        "dollar from commercial payers. The gap between payer and patient collection efficiency represents "
        "the single largest controllable revenue leak in most healthcare operations.", ss))
    story.append(sp(4))
    story.append(h2("Patient Financial Responsibility Trends (2015-2024)", ss))
    story.append(make_table(
        ["Metric", "2015", "2018", "2020", "2022", "2024 Est."],
        [
            ["Avg. annual deductible (single)", "$1,077", "$1,350", "$1,644", "$1,763", "$1,735"],
            ["HDHP enrollment share", "24%", "29%", "31%", "29%", "32%"],
            ["Patient responsibility share of revenue", "~25%", "~28%", "~30%", "~32%", "~30-35%"],
            ["Patient collection rate (cents/$)", "~21c", "~18c", "~17c", "~16c", "~15-16c"],
            ["Patient bad debt as % of revenue", "~3.5%", "~4.0%", "~4.8%", "~5.2%", "~5-6%"],
            ["Avg. patient balance at discharge", "$1,013", "$1,252", "$1,692", "$1,801", "$1,920"],
            ["% patients unable to pay $400 surprise", "47%", "40%", "36%", "37%", "35%"],
        ], ss))
    story.append(src(
        "Sources: Kaiser Family Foundation Employer Health Benefits Survey 2023; TransUnion Healthcare "
        "Report 2024; Federal Reserve Survey of Household Economics 2023; Crowe Healthcare Benchmarking 2024.", ss))
    story.append(sp(4))
    story.append(h2("Deductible Growth vs. Wage Growth", ss))
    story.append(body(
        "The fundamental challenge is the divergence between deductible growth and wage growth. Since 2010, "
        "average deductibles have increased 68% while average worker earnings increased only 27% over the "
        "same period (Kaiser Family Foundation, 2023). This creates a growing population of patients who are "
        "technically insured but functionally unable to pay their out-of-pocket obligations without structured "
        "payment assistance.", ss))
    story.append(body(
        "TransUnion Healthcare data shows that 62% of patients with balances over $500 do not pay in full "
        "within 12 months when no payment plan is offered, but this drops to 29% when structured payment "
        "options are provided at or before the point of service. The availability and quality of payment "
        "infrastructure is therefore a direct determinant of revenue recovery.", ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_bar_chart([
        ("2015", 25), ("2017", 27), ("2019", 29), ("2021", 31), ("2023", 33), ("2025E", 35),
    ], "Patient Responsibility Share of Provider Revenue (%)", width=460, height=160)))
    story.append(src("Source: HFMA, Kaiser Family Foundation, CMS Office of the Actuary projections 2024.", ss))
    story.append(PageBreak())

    # ── Section 2: Five Revenue Leakage Points (3 pages) ──
    story.append(h1("Section 2: Five Revenue Leakage Points", ss))
    story.append(body(
        "Analysis of healthcare revenue cycle data reveals five systemic points where collectible revenue "
        "is lost before it reaches external collections. Each leakage point is addressable through workflow "
        "design, staff training, and technology infrastructure. Together, they account for the 5-15% "
        "collectible revenue leakage observed across the industry.", ss))
    story.append(sp(4))

    # Point 1
    story.append(h2("Leakage Point 1: Fragmented Billing Workflow", ss))
    story.append(body(
        "Patient balances are frequently handled inconsistently across staff, locations, and EHR systems. "
        "HFMA research indicates that 73% of healthcare providers report difficulty collecting from patients "
        "after the visit, and the average practice makes 3.3 billing attempts before writing off a patient "
        "balance. The lack of standardized outreach cadence means that accounts drift through aging buckets "
        "without structured intervention, reducing recovery probability with each passing week.", ss))
    story.append(b("Inconsistent outreach cadence: no standardized timing for statements, calls, or digital reminders", ss))
    story.append(b("Missing scripts: staff communication varies by individual rather than by documented protocol", ss))
    story.append(b("No escalation triggers: accounts age past 90 days without structured intervention steps", ss))
    story.append(b("Multi-location variance: different offices use different billing practices, creating data fragmentation", ss))
    story.append(b("EHR workflow gaps: billing tasks fall between clinical and administrative functions", ss))
    story.append(src("Source: HFMA Patient Financial Communications Best Practices 2024; Becker's Healthcare CFO Report 2024.", ss))
    story.append(sp(4))

    # Point 2
    story.append(h2("Leakage Point 2: Unstructured Payment Plans", ss))
    story.append(body(
        "When payment plans lack digital execution, autopay enrollment, clear default triggers, and "
        "documented schedules, they fail at significantly higher rates. InstaMed (a J.P. Morgan company) "
        "reports that 56% of consumers say they would be more likely to pay medical bills if a payment "
        "plan were offered at or before the time of service, yet only 30% of practices offer structured "
        "plans proactively. The gap between patient willingness and provider capability represents one "
        "of the most actionable leakage points in the revenue cycle.", ss))
    story.append(b("Plans without autopay enrollment default at 2-3x higher rates (HFMA 2024)", ss))
    story.append(b("Digital payment plan adoption increases completion rates by 40-60% vs. paper-based plans", ss))
    story.append(b("Practices with proactive plan offering report 22% higher patient satisfaction scores", ss))
    story.append(b("Average plan duration: 6-12 months; default rates spike after month 3 without autopay", ss))
    story.append(b("Only 18% of practices offer real-time financial counseling at point of service", ss))
    story.append(src("Sources: InstaMed Trends in Healthcare Payments Report 2024; HFMA Revenue Cycle Solutions Guide 2024.", ss))
    story.append(sp(4))

    # Point 3
    story.append(h2("Leakage Point 3: Premature Agency Escalation", ss))
    story.append(body(
        "Direct escalation to external collection agencies typically introduces 25-40% contingency leakage "
        "on every dollar recovered. ACA International reports that the average healthcare collection agency "
        "recovers approximately 15-20 cents per dollar placed, while structured internal pre-collection "
        "can recover 40-60 cents per dollar before agency fees apply. The decision to escalate too early "
        "is often driven by resource constraints rather than strategic optimization.", ss))
    story.append(make_table(
        ["Recovery Channel", "Gross Recovery", "Fee/Cost", "Net Yield", "Patient Impact"],
        [
            ["Internal billing (0-30 days)", "85-95%", "Staff cost", "80-90%", "Positive"],
            ["Structured pre-collection (30-90 days)", "40-60%", "5-15% fee", "35-55%", "Neutral"],
            ["External agency (90+ days)", "15-20%", "25-40% contingency", "10-14%", "Negative"],
            ["Legal escalation (180+ days)", "8-12%", "33-50% + costs", "4-8%", "Very negative"],
        ], ss))
    story.append(src("Sources: ACA International Benchmarking Survey 2024; CFPB Consumer Complaint Database 2024.", ss))
    story.append(sp(4))
    story.append(body(
        "The net yield differential between channels is the core economic argument for pre-collection: "
        "structured outreach at 30-90 days captures 35-55 cents per dollar, compared to 10-14 cents "
        "through agency placement and as little as 4-8 cents through legal escalation. Critically, the "
        "patient relationship impact inverts as well -- early structured contact preserves goodwill and "
        "future revenue, while agency and legal channels damage retention. For multi-location operators, "
        "the compounding effect of channel optimization across sites represents a material EBITDA lever.", ss))
    story.append(PageBreak())

    # Point 4
    story.append(h2("Leakage Point 4: Weak Recovery Monitoring", ss))
    story.append(body(
        "Without centralized KPI visibility, leadership cannot identify where revenue leaks, standardize "
        "performance across locations, or measure the impact of workflow changes. MGMA reports that "
        "top-performing practices (top 25th percentile) have 31% lower bad debt rates than median "
        "practices, largely attributable to better monitoring and earlier intervention. The absence of "
        "real-time dashboards and aging alerts means that deteriorating accounts are identified too late "
        "for cost-effective recovery.", ss))
    story.append(make_table(
        ["KPI", "Top 25%", "Median", "Bottom 25%", "Gap Impact"],
        [
            ["Days in AR", "32 days", "49 days", "65+ days", "$300K+ working capital"],
            ["Bad debt rate", "3.2%", "5.1%", "8.4%", "$160K-520K revenue"],
            ["Clean claim rate", "95%+", "85%", "<80%", "Rework cost + delay"],
            ["Patient collection rate", "22%", "15%", "<10%", "$70K-120K per $1M"],
            ["Denial rate", "4%", "8%", "12%+", "$40-65 per denied claim"],
            ["Cost to collect", "3.5%", "5.5%", "8%+", "Operating margin drag"],
        ], ss))
    story.append(src("Source: MGMA DataDive Cost and Revenue 2024; HFMA MAP Keys Performance Benchmarks 2024.", ss))
    story.append(sp(4))

    # Point 5
    story.append(h2("Leakage Point 5: Documentation Weakness Before Enforcement", ss))
    story.append(body(
        "When accounts require legal escalation, practices frequently discover missing consent, unclear "
        "repayment terms, incomplete audit trails, or inconsistent communication records. These gaps "
        "increase friction, delay counsel review, and weaken downstream enforceability. HFMA reports "
        "that practices with structured documentation protocols reduce average time to counsel-ready "
        "handoff by 60% and improve downstream recovery rates by 25-35%.", ss))
    story.append(b("Missing: signed financial agreements, autopay authorizations, default and cure notice records", ss))
    story.append(b("Result: counsel must reconstruct documentation, creating cost ($150-300/hour) and delay (4-8 weeks)", ss))
    story.append(b("Prevention: build documentation discipline at intake, not after payment failure", ss))
    story.append(b("Digital signatures and timestamped records create enforceable audit trails automatically", ss))
    story.append(b("HIPAA-compliant communication logs protect against patient disputes and regulatory complaints", ss))
    story.append(src("Source: HFMA Patient Financial Engagement Toolkit 2024; ABA Health Law Section 2023.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Documentation Element", "% Practices Missing", "Impact on Recovery", "Remediation Cost"],
        [
            ["Signed financial agreement", "42%", "Cannot enforce payment terms", "$50-150 per account"],
            ["Autopay authorization", "67%", "2-3x higher default rate", "$30-80 per account"],
            ["Default/cure notice records", "55%", "Delays legal escalation 4-8 weeks", "$100-250 per account"],
            ["Communication audit trail", "38%", "CFPB complaint vulnerability", "$200-500 per complaint"],
            ["Insurance verification records", "25%", "Denial rework, delayed AR", "$40-65 per claim"],
        ], ss))
    story.append(src("Source: HFMA 2024; Becker's Healthcare Revenue Cycle Survey 2024.", ss))
    story.append(PageBreak())

    # ── Section 3: Recovery Probability ──
    story.append(h1("Section 3: Recovery Probability by Aging", ss))
    story.append(body(
        "Recovery probability decays exponentially with account age. Industry data from HFMA and "
        "ACA International consistently shows that every 30-day delay reduces the likelihood of "
        "full collection. This decay curve is the fundamental economic argument for pre-collection "
        "intervention: earlier structured outreach converts more dollars before they reach the "
        "low-probability zone beyond 90 days.", ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_line_chart(
        [93, 78, 55, 35, 18, 8],
        "Healthcare Patient AR Recovery Probability by Aging Bucket (%)",
        ["0-30d", "31-60d", "61-90d", "91-120d", "121-180d", "180+d"],
        width=460, height=175)))
    story.append(src("Sources: ACA International Recovery Benchmarking 2024; HFMA MAP Keys 2024; Crowe 2024.", ss))
    story.append(sp(6))
    story.append(make_table(
        ["Aging Bucket", "Recovery Probability", "Avg. Cost to Collect", "Net Yield", "Recommended Action"],
        [
            ["0-30 days", "90-95%", "$0.02-0.04/dollar", "High (85-90%)", "Standard billing cycle"],
            ["31-60 days", "70-80%", "$0.05-0.08/dollar", "Good (65-75%)", "Payment plan offer + reminder"],
            ["61-90 days", "50-60%", "$0.10-0.15/dollar", "Moderate (40-50%)", "Structured pre-collection"],
            ["91-120 days", "30-40%", "$0.18-0.25/dollar", "Low (22-30%)", "Intensive recovery protocol"],
            ["121-180 days", "15-25%", "$0.25-0.35/dollar", "Very Low (10-18%)", "Final internal attempt"],
            ["180+ days", "5-12%", "$0.30-0.40+/dollar", "Minimal (3-8%)", "Agency/legal evaluation"],
        ], ss))
    story.append(sp(4))
    story.append(callout("Critical Inflection Point",
        "The 60-90 day window is where most healthcare revenue is won or lost. Accounts receiving "
        "structured intervention before day 60 have 2-3x higher recovery probability than those "
        "receiving first contact after day 90. Each week of delay in this window reduces expected "
        "recovery by approximately 3-5 percentage points.", ss))
    story.append(PageBreak())

    # ── Section 4: Financial Impact Model (2 pages) ──
    story.append(h1("Section 4: Financial Impact Model", ss))
    story.append(body(
        "The following models illustrate the financial impact of structured pre-collection across three "
        "practice sizes. All assumptions are based on published industry benchmarks from HFMA, MGMA, "
        "and ACA International. Results are illustrative and will vary based on payer mix, patient "
        "demographics, geographic market, and implementation quality.", ss))
    story.append(sp(4))
    story.append(h2("Scenario A: Small Practice ($3M Annual Revenue)", ss))
    story.append(make_table(
        ["Metric", "Current State", "With Pre-Collection", "Delta"],
        [
            ["Annual patient AR portfolio", "$450K", "$450K", "--"],
            ["Agency placement volume", "$320K", "$160K", "-50%"],
            ["Agency recovery (net of 30% fee)", "$40K", "$22K", "-$18K"],
            ["Pre-collection recovery (net)", "--", "$108K", "+$108K"],
            ["Total net cash recovery", "$40K", "$130K", "+$90K (+225%)"],
            ["DSO reduction", "52 days", "39 days", "-13 days"],
            ["Working capital freed", "--", "$107K", "+$107K"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Scenario B: Mid-Size Practice ($10M Annual Revenue)", ss))
    story.append(make_table(
        ["Metric", "Current State", "With Pre-Collection", "Delta"],
        [
            ["Annual patient AR portfolio", "$2.0M", "$2.0M", "--"],
            ["Agency placement volume", "$1.4M", "$700K", "-50%"],
            ["Agency recovery (net of 30% fee)", "$196K", "$98K", "-$98K"],
            ["Pre-collection recovery (net)", "--", "$480K", "+$480K"],
            ["Total net cash recovery", "$196K", "$578K", "+$382K (+195%)"],
            ["DSO reduction", "49 days", "36 days", "-13 days"],
            ["Working capital freed", "--", "$356K", "+$356K"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Scenario C: Large Group / Health System ($50M Revenue)", ss))
    story.append(make_table(
        ["Metric", "Current State", "With Pre-Collection", "Delta"],
        [
            ["Annual patient AR portfolio", "$12.5M", "$12.5M", "--"],
            ["Agency placement volume", "$8.8M", "$4.4M", "-50%"],
            ["Agency recovery (net of 30% fee)", "$1.23M", "$616K", "-$616K"],
            ["Pre-collection recovery (net)", "--", "$3.0M", "+$3.0M"],
            ["Total net cash recovery", "$1.23M", "$3.62M", "+$2.39M (+194%)"],
            ["DSO reduction", "55 days", "40 days", "-15 days"],
            ["Working capital freed", "--", "$2.05M", "+$2.05M"],
        ], ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_bar_chart([
        ("Small\n$3M", 90), ("Mid-Size\n$10M", 382), ("Large\n$50M", 2390),
    ], "Annual Recovery Lift by Practice Size ($K)", width=460, height=160)))
    story.append(src(
        "Note: Illustrative models based on HFMA, ACA International, MGMA 2024 benchmarks. "
        "Assumes 45% pre-collection conversion rate, 30% agency contingency fee, 50% reduction in agency placement volume.", ss))
    story.append(sp(4))
    story.append(body(
        "The scale effect is pronounced: a $50M multi-location operator can realize over $2.3M in "
        "annual recovery lift, representing a 4.7% improvement on patient AR. Even a conservative "
        "$3M single-site practice captures $90K annually -- typically enough to fund the entire "
        "pre-collection program while generating net positive returns in the first quarter. The "
        "non-linear scaling occurs because larger organizations have more accounts in the 30-90 day "
        "window and greater operational leverage from standardized workflows.", ss))
    story.append(PageBreak())

    story.append(h2("Sensitivity Analysis: Pre-Collection Conversion Rate Impact", ss))
    story.append(body(
        "The conversion rate achieved during the pre-collection window is the primary variable determining "
        "financial outcomes. The table below shows sensitivity for a mid-size practice ($10M revenue, $2M patient AR).", ss))
    story.append(make_table(
        ["Pre-Collection Conversion Rate", "Net Recovery", "Annual Lift vs. Agency Only", "ROI Multiple"],
        [
            ["25% (Conservative)", "$370K", "+$174K", "3.5x"],
            ["35% (Below Target)", "$458K", "+$262K", "4.2x"],
            ["45% (Target)", "$578K", "+$382K", "5.1x"],
            ["55% (Above Target)", "$698K", "+$502K", "6.0x"],
            ["65% (Optimistic)", "$818K", "+$622K", "7.0x"],
        ], ss))
    story.append(sp(4))
    story.append(h2("DSO Compression and Working Capital Impact", ss))
    story.append(body(
        "Reducing DSO from 49 days (MGMA median) to 36 days releases approximately $0.036 in working "
        "capital per dollar of annual revenue. For a $10M revenue practice, this represents approximately "
        "$356K in freed working capital that can be redeployed into operations, equipment purchases, "
        "facility expansion, or debt service reduction. The working capital benefit compounds annually.", ss))
    story.append(make_table(
        ["Practice Revenue", "Current DSO", "Target DSO", "Working Capital Released", "Annual Opportunity Cost Saved"],
        [
            ["$3M", "52 days", "39 days", "$107K", "$5.3K at 5%"],
            ["$10M", "49 days", "36 days", "$356K", "$17.8K at 5%"],
            ["$25M", "51 days", "38 days", "$890K", "$44.5K at 5%"],
            ["$50M", "55 days", "40 days", "$2.05M", "$102.5K at 5%"],
        ], ss))
    story.append(src("Source: MGMA DataDive 2024; HFMA Working Capital Management Guide 2024.", ss))
    story.append(PageBreak())

    # ── Section 5: Structured Recovery Model ──
    story.append(h1("Section 5: Structured Recovery Model", ss))
    story.append(body(
        "The VitaCoreX recovery model operates as a six-stage structured workflow designed to maximize "
        "conversion before agency escalation. Each stage has defined entry criteria, communication "
        "protocols, documentation requirements, and escalation triggers. The model is designed to be "
        "repeatable, auditable, and compliant with FDCPA, HIPAA, and state consumer protection laws.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Stage", "Timing", "Actions", "Documentation", "Expected Conversion"],
        [
            ["1. Assessment", "Day 0-3", "Account review, balance validation, insurance verification, patient eligibility check", "Account intake form, balance confirmation", "N/A (setup)"],
            ["2. Initial Outreach", "Day 3-14", "Multi-channel contact (letter, call, SMS, email), financial counseling offer", "Contact log, script adherence, opt-in records", "15-25%"],
            ["3. Payment Plan Offer", "Day 14-30", "Structured plan proposal, autopay enrollment, hardship screening", "Signed plan agreement, autopay authorization, hardship documentation", "20-30%"],
            ["4. Active Monitoring", "Day 30-60", "Plan compliance monitoring, missed payment alerts, cure notice protocol", "Payment tracking log, default notices, cure confirmations", "10-15%"],
            ["5. Intensive Recovery", "Day 60-90", "Escalated outreach, settlement offer, guarantor activation, documentation assembly", "Settlement terms, guarantor notice, communication audit trail", "8-12%"],
            ["6. Resolution / Handoff", "Day 90+", "Final internal attempt, agency preparation, counsel-ready package assembly", "Complete account file, compliance certification, handoff checklist", "3-5%"],
        ], ss))
    story.append(sp(4))
    story.append(body(
        "Cumulative expected conversion across all six stages: 56-87% of engaged accounts. The remaining "
        "accounts are transferred to agency or legal with complete documentation packages, improving "
        "downstream recovery rates by 25-35% compared to standard agency placement.", ss))
    story.append(src("Source: VitaCoreX operational framework; benchmarks from HFMA and ACA International 2024.", ss))
    story.append(sp(6))
    story.append(h2("Recovery Model Performance Metrics", ss))
    story.append(make_table(
        ["Metric", "Industry Average (Agency)", "Pre-Collection Target", "Improvement"],
        [
            ["Gross recovery rate", "15-20%", "45-60%", "2.5-3x"],
            ["Net yield (after fees)", "10-14%", "35-55%", "3-4x"],
            ["Average time to resolution", "180+ days", "45-60 days", "-67%"],
            ["Patient satisfaction impact", "Negative", "Neutral/Positive", "Significant"],
            ["Documentation completeness", "35-50%", "95%+", "+45-60pp"],
            ["CFPB complaint risk", "Moderate-High", "Very Low", "Substantial reduction"],
        ], ss))
    story.append(PageBreak())

    # ── Section 6: Regulatory Landscape ──
    story.append(h1("Section 6: Regulatory Landscape", ss))
    story.append(body(
        "Healthcare revenue recovery operates within a complex regulatory framework spanning federal "
        "and state law. Compliance is both a legal obligation and a business imperative -- regulatory "
        "violations can result in significant financial penalties, reputational damage, and loss of "
        "patient trust. The following framework outlines the key regulatory requirements.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Regulation", "Jurisdiction", "Key Requirements", "Penalty for Violation"],
        [
            ["FDCPA", "Federal", "Prohibits harassment, false statements, unfair practices in debt collection; requires written validation notice within 5 days of initial contact", "Up to $1,000 per violation + actual damages + attorney fees; class action: up to $500K or 1% of net worth"],
            ["HIPAA Privacy Rule", "Federal", "Limits disclosure of PHI in billing communications; requires minimum necessary standard; business associate agreements for third-party vendors", "$100-$50,000 per violation; max $1.5M per year per category; criminal penalties possible"],
            ["CFPB Regulation F", "Federal", "Limits call frequency (7 calls/7 days per debt); requires clear electronic communication disclosures; opt-out mechanisms", "CFPB enforcement actions; consent orders; civil money penalties"],
            ["Florida F.S. 559", "State", "Florida Consumer Collection Practices Act; additional protections beyond FDCPA; registration requirements for collectors", "State enforcement; private right of action; attorney fees"],
            ["No Surprises Act", "Federal", "Limits balance billing for emergency and certain non-emergency services; independent dispute resolution for out-of-network claims", "Up to $10,000 per violation; CMS enforcement"],
            ["State Surprise Billing Laws", "Various", "State-specific patient billing protections; often more restrictive than federal law", "Varies by state; license risk"],
        ], ss))
    story.append(src(
        "Sources: CFPB Debt Collection Rule (Regulation F) 2021; HHS HIPAA Enforcement; "
        "ACA International Compliance Resources 2024; Florida Statutes Chapter 559.", ss))
    story.append(sp(4))
    story.append(h2("Compliance Integration Points", ss))
    story.append(body(
        "Effective pre-collection programs integrate compliance at every workflow stage rather than "
        "treating it as a separate function. Key integration points include: communication frequency "
        "monitoring (FDCPA/Reg F limits), PHI minimization in billing correspondence (HIPAA), patient "
        "consent documentation (state law), dispute resolution protocols (FDCPA Section 809), and "
        "call recording/monitoring for quality assurance and regulatory defense.", ss))
    story.append(b("All patient communications are logged with timestamps, channel, and content summary", ss))
    story.append(b("HIPAA minimum necessary standard applied to all billing correspondence", ss))
    story.append(b("Automated frequency controls prevent exceeding CFPB Regulation F call limits", ss))
    story.append(b("Patient dispute rights communicated in writing within required timeframes", ss))
    story.append(b("Staff training includes annual compliance certification with documented testing", ss))
    story.append(PageBreak())

    # ── Section 7: Implementation Risk Assessment ──
    story.append(h1("Section 7: Implementation Risk Assessment", ss))
    story.append(body(
        "Pre-collection program implementation carries identifiable risks that can be mitigated through "
        "structured planning, phased deployment, and continuous monitoring. The following assessment "
        "catalogs the most common failure modes observed across healthcare revenue cycle implementations "
        "and the corresponding mitigation strategies.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Risk Category", "Description", "Probability", "Impact", "Mitigation Strategy"],
        [
            ["Staff adoption resistance", "Billing staff resist new workflows or revert to prior practices after initial training", "High", "High", "Phased rollout with champions; weekly coaching; performance-based incentives tied to new KPIs"],
            ["EHR integration complexity", "Existing EHR/PM system does not support required data feeds or workflow automation", "Medium", "High", "Pre-implementation technical assessment; middleware solutions; API-based integration where available"],
            ["Patient communication backlash", "Increased outreach volume generates patient complaints or negative satisfaction scores", "Medium", "Medium", "Empathetic scripting; opt-out mechanisms; satisfaction monitoring; complaint response protocol"],
            ["Regulatory non-compliance", "New workflows inadvertently violate FDCPA, HIPAA, or state collection laws", "Low", "Very High", "Compliance review before launch; ongoing audit program; legal counsel engagement for complex scenarios"],
            ["Volume/capacity mismatch", "Pre-collection volume exceeds staff capacity, creating backlogs and missed intervention windows", "Medium", "High", "Staffing model validated against projected volumes; technology automation for routine tasks; overflow protocol"],
            ["Data quality issues", "Incorrect balances, stale contact information, or missing insurance data degrade outreach effectiveness", "High", "Medium", "Data validation at intake; real-time eligibility verification; regular data hygiene audits"],
            ["Leadership attention drift", "Initial executive sponsorship fades, reducing organizational commitment to new processes", "Medium", "High", "Monthly executive dashboard; quarterly business reviews; ROI reporting tied to strategic objectives"],
        ], ss))
    story.append(src("Source: HFMA Revenue Cycle Improvement Guide 2024; Becker's Healthcare Implementation Best Practices 2024.", ss))
    story.append(sp(6))
    story.append(h2("Risk Mitigation Timeline", ss))
    story.append(make_table(
        ["Phase", "Weeks", "Risk Focus", "Key Deliverables"],
        [
            ["Pre-Launch Assessment", "1-3", "Technical readiness, compliance review, staffing model", "Go/no-go decision, risk register, contingency plans"],
            ["Pilot Launch", "4-8", "Staff adoption, patient response, data quality", "Pilot performance report, workflow refinements, training updates"],
            ["Controlled Expansion", "9-13", "Volume/capacity, process consistency, KPI tracking", "Full deployment plan, capacity validation, compliance audit"],
            ["Steady State Operations", "14+", "Performance optimization, leadership reporting, continuous improvement", "Monthly dashboards, quarterly reviews, annual compliance certification"],
        ], ss))
    story.append(PageBreak())

    # ── Section 8: Next Steps ──
    story.append(h1("Section 8: Next Steps and Engagement Path", ss))
    story.append(body(
        "VitaCoreX LLC provides structured pre-collection recovery infrastructure for healthcare operators "
        "seeking to reduce revenue leakage, improve cash flow, and strengthen documentation compliance. "
        "The engagement follows a phased approach designed to deliver measurable results within 90 days.", ss))
    story.append(sp(4))
    story.append(h2("Engagement Process", ss))
    story.append(make_table(
        ["Step", "Description", "Timeline", "Deliverable"],
        [
            ["1. Discovery Call", "30-minute assessment of current revenue cycle, AR aging profile, staffing model, and technology stack", "Week 1", "Preliminary opportunity assessment"],
            ["2. Data Review", "Analysis of AR aging report, collection rates by bucket, payer mix, and documentation practices", "Week 1-2", "Quantified leakage analysis with benchmarking"],
            ["3. Proposal", "Custom engagement proposal with financial model, staffing plan, technology requirements, and ROI projections", "Week 2-3", "Detailed proposal with sensitivity analysis"],
            ["4. Pilot Launch", "90-day controlled pilot on defined account segment with weekly performance reporting", "Week 4-16", "Pilot performance dashboard with ROI tracking"],
            ["5. Scale Decision", "Review pilot results, refine model, and plan full deployment", "Week 16-18", "Go/no-go recommendation with scaling plan"],
        ], ss))
    story.append(sp(6))
    story.append(h2("Contact Information", ss))
    story.append(body(
        "To schedule a discovery call or request additional information, contact VitaCoreX LLC:", ss))
    story.append(b("Phone: (888) 794-8292", ss))
    story.append(b("Email: info@vitacorexllc.com", ss))
    story.append(b("Website: vitacorexllc.com", ss))
    story.append(b("Location: Tampa, FL", ss))
    story.append(sp(6))
    story.append(callout("Confidentiality Notice",
        "This document is the proprietary work product of VitaCoreX LLC and is provided for informational "
        "purposes only. Distribution, reproduction, or use beyond the intended recipient requires written "
        "authorization from VitaCoreX LLC. All industry data is sourced from published reports and does "
        "not constitute legal, financial, or medical advice.", ss))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"    -> {path}")


# ══════════════════════════════════════════════════════════════════════
# PDF 2: Healthcare CFO Brief (10+ pages)
# ══════════════════════════════════════════════════════════════════════

def build_cfo_brief():
    print("  [2/4] Building healthcare-cfo-brief.pdf ...")
    ss = build_styles()
    path = os.path.join(DIR, "healthcare-cfo-brief.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
        topMargin=0.7*inch, bottomMargin=0.7*inch, leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Healthcare CFO Brief",
        "Pre-collection economics, EBITDA impact modeling,<br/>and pilot design for healthcare finance leaders",
        "CFO Advisory Brief  |  Healthcare Finance  |  2026", ss)

    # TOC
    story += toc_page([
        ("Executive Summary", "3"),
        ("CFO Problem Statement", "4"),
        ("Control Hierarchy: Layered Recovery Architecture", "5"),
        ("EBITDA Impact Analysis", "6"),
        ("Pilot Economics and Scenario Modeling", "7"),
        ("Competitive Landscape", "8"),
        ("Use Case Fit Assessment", "9"),
        ("Implementation Timeline (13-Week)", "10"),
        ("KPI Dashboard Design", "11"),
        ("Engagement Path", "12"),
    ], ss)

    # ── Executive Summary ──
    story.append(h1("Executive Summary", ss))
    story.append(body(
        "For healthcare CFOs, patient accounts receivable represents one of the largest controllable "
        "levers for EBITDA improvement. Industry data shows that the gap between current-state agency "
        "recovery (10-14% net yield) and structured pre-collection recovery (35-55% net yield) represents "
        "a 3-5x improvement opportunity on patient AR portfolios. This brief provides the financial "
        "framework, competitive analysis, and operational blueprint for CFOs evaluating pre-collection "
        "infrastructure investment.", ss))
    story.append(sp(4))
    story.append(make_metric_table([
        ("37%", "Average patient AR\nwritten off annually"),
        ("4-6x", "ROI multiple on\npre-collection investment"),
        ("90 days", "Target window for\nstructured intervention"),
        ("60%", "Reduction in agency\nplacement volume"),
    ], ss))
    story.append(src("Sources: HFMA MAP Keys 2024; MGMA DataDive 2024; Becker's Healthcare CFO Report 2024.", ss))
    story.append(sp(4))
    # Executive one-pager chart
    story.append(DrawingFlowable(make_dual_bar_chart([
        ("Q1", 45, 120), ("Q2", 52, 155), ("Q3", 60, 195), ("Q4", 65, 230),
    ], "Cumulative Recovery: Agency Only vs. Pre-Collection ($K, Mid-Size Practice)",
       ["Agency Only", "With Pre-Collection"], width=460, height=180)))
    story.append(src("Illustrative model: $10M revenue practice, $2M patient AR. HFMA/MGMA benchmarks.", ss))
    story.append(PageBreak())

    # ── CFO Problem Statement (2 pages) ──
    story.append(h1("CFO Problem Statement", ss))
    story.append(body(
        "The healthcare CFO faces a structural misalignment between revenue cycle investment and "
        "patient AR outcomes. While significant capital has been deployed into RCM technology, payer "
        "contract optimization, and denial management, the patient responsibility segment -- now "
        "30-35% of total revenue -- receives disproportionately low investment in collection "
        "infrastructure. The result is a persistent 5-6% bad debt rate that directly erodes EBITDA.", ss))
    story.append(sp(4))
    story.append(h2("Current State vs. Target State", ss))
    story.append(make_table(
        ["Metric", "Current State (Median)", "Target State (Top Quartile)", "Gap"],
        [
            ["Patient collection rate", "15.3 cents/dollar", "22+ cents/dollar", "+44%"],
            ["Bad debt as % of revenue", "5.1%", "3.2%", "-37%"],
            ["Days in patient AR", "49 days", "32 days", "-35%"],
            ["Agency placement rate", "60-70% of aged AR", "25-35% of aged AR", "-50%"],
            ["Net agency yield", "10-14%", "N/A (pre-collection)", "3-4x improvement"],
            ["Documentation completeness at handoff", "35-50%", "95%+", "+45-60pp"],
            ["Patient satisfaction (billing)", "62nd percentile", "80th+ percentile", "+18pp"],
            ["Cost to collect (% of collections)", "5.5%", "3.5%", "-36%"],
        ], ss))
    story.append(src("Sources: MGMA DataDive 2024; HFMA MAP Keys 2024; Press Ganey Patient Experience 2024.", ss))
    story.append(sp(4))
    story.append(h2("Board-Level Financial Metrics", ss))
    story.append(body(
        "Healthcare boards increasingly scrutinize patient AR performance as a measure of operational "
        "discipline. Key metrics that CFOs should present to the board include net collection rate "
        "trends, bad debt rate trajectory, DSO by payer category, and the cost-to-collect ratio. "
        "Pre-collection investment can be framed as EBITDA protection rather than a cost center, as "
        "the alternative -- continued agency reliance -- carries higher total cost per recovered dollar.", ss))
    story.append(make_table(
        ["Board Metric", "Benchmark (Top Quartile)", "Typical Reporting Frequency", "Strategic Importance"],
        [
            ["Net collection rate", "96%+", "Monthly", "Revenue integrity indicator"],
            ["Bad debt rate", "<3.5%", "Monthly", "Direct EBITDA impact"],
            ["Days in AR (total)", "<35 days", "Monthly", "Working capital efficiency"],
            ["Patient AR aging (>90 days)", "<15% of total AR", "Monthly", "Recovery risk exposure"],
            ["Cost to collect", "<4%", "Quarterly", "Operational efficiency"],
            ["Patient satisfaction (billing)", "80th percentile+", "Quarterly", "Retention and reputation"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Peer Benchmarking Data", ss))
    story.append(body(
        "MGMA DataDive 2024 segmented performance data reveals significant variance between top-quartile "
        "and bottom-quartile practices across all patient AR metrics. The gap represents both the "
        "opportunity and the urgency: practices in the bottom quartile lose 2-3x more revenue to bad "
        "debt than their top-quartile peers, and the gap is widening as patient responsibility increases.", ss))
    story.append(make_table(
        ["Performance Tier", "Patient Collection Rate", "Bad Debt Rate", "Days in AR", "Agency Spend % Revenue"],
        [
            ["Top 10%", "25+ cents/dollar", "2.5%", "28 days", "0.3%"],
            ["Top 25%", "22 cents/dollar", "3.2%", "32 days", "0.5%"],
            ["Median", "15.3 cents/dollar", "5.1%", "49 days", "1.2%"],
            ["Bottom 25%", "10 cents/dollar", "8.4%", "65 days", "2.1%"],
            ["Bottom 10%", "<8 cents/dollar", "11%+", "80+ days", "3.0%+"],
        ], ss))
    story.append(src("Source: MGMA DataDive Cost and Revenue 2024; HFMA Benchmarking Report 2024.", ss))
    story.append(PageBreak())

    # ── Control Hierarchy ──
    story.append(h1("Control Hierarchy: Layered Recovery Architecture", ss))
    story.append(body(
        "Effective patient AR recovery requires a layered control architecture where each stage adds "
        "incremental recovery probability while maintaining compliance and patient relationship quality. "
        "The hierarchy is designed to exhaust lower-cost, higher-yield recovery methods before escalating "
        "to higher-cost channels.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Control Layer", "Timing", "Recovery Mechanism", "Avg. Yield", "Cost Profile"],
        [
            ["L1: Financial Counseling", "Pre-service / Point of service", "Eligibility screening, price transparency, upfront collection, charity care assessment", "65-80%", "Staff time only ($8-15/contact)"],
            ["L2: Standard Billing", "0-30 days post-service", "Statement generation, patient portal reminders, autopay enrollment", "85-95% of residual", "System-driven ($2-5/contact)"],
            ["L3: Active Recovery", "31-60 days", "Multi-channel outreach, payment plan structuring, hardship evaluation", "40-60% of residual", "Staff + system ($12-25/contact)"],
            ["L4: Structured Pre-Collection", "61-90 days", "Intensive outreach, settlement offers, guarantor activation, documentation assembly", "25-40% of residual", "Specialized staff ($20-40/contact)"],
            ["L5: External Agency", "90+ days", "Third-party collection with contingency fee", "15-20% of residual", "25-40% contingency on recovery"],
            ["L6: Legal Escalation", "180+ days", "Litigation through counsel (rare, high-value accounts only)", "8-15% of residual", "33-50% + court costs"],
        ], ss))
    story.append(src("Source: HFMA Revenue Cycle Hierarchy Model 2024; ACA International 2024.", ss))
    story.append(sp(4))
    story.append(callout("CFO Insight",
        "The economic case for pre-collection (L3-L4) is that it captures the largest incremental yield "
        "improvement at the lowest marginal cost. Moving accounts from L5 (agency) to L3-L4 (pre-collection) "
        "improves net yield by 3-4x while reducing patient experience damage and regulatory risk.", ss))
    story.append(PageBreak())

    # ── EBITDA Impact ──
    story.append(h1("EBITDA Impact Analysis", ss))
    story.append(body(
        "Pre-collection investment impacts EBITDA through three channels: direct recovery improvement, "
        "agency fee avoidance, and DSO-driven working capital release. The combined effect can "
        "represent a 0.5-1.5% improvement in EBITDA margin for practices with significant patient AR.", ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_waterfall_chart([
        ("Baseline\nRecovery", 196, "total"),
        ("Pre-Collect\nRecovery", 480, "add"),
        ("Agency Fee\nSavings", 98, "add"),
        ("Impl.\nCost", 120, "sub"),
        ("Net Annual\nImpact", 654, "total"),
    ], "EBITDA Impact Waterfall: Mid-Size Practice ($K)", width=460, height=195)))
    story.append(src("Illustrative: $10M revenue, $2M patient AR portfolio. HFMA/MGMA benchmarks.", ss))
    story.append(sp(6))
    story.append(h2("Enterprise Value Impact", ss))
    story.append(body(
        "For practices considering M&A transactions, EBITDA improvements from pre-collection translate "
        "directly to enterprise value at prevailing multiples. Healthcare services businesses typically "
        "trade at 8-14x EBITDA (PitchBook 2024), meaning each $100K of sustainable EBITDA improvement "
        "translates to $800K-$1.4M in enterprise value.", ss))
    story.append(make_table(
        ["Practice Revenue", "Annual EBITDA Lift", "Enterprise Value Impact (8x)", "Enterprise Value Impact (12x)", "Enterprise Value Impact (14x)"],
        [
            ["$3M", "$68K", "$544K", "$816K", "$952K"],
            ["$10M", "$382K", "$3.06M", "$4.58M", "$5.35M"],
            ["$25M", "$1.1M", "$8.8M", "$13.2M", "$15.4M"],
            ["$50M", "$2.4M", "$19.2M", "$28.8M", "$33.6M"],
        ], ss))
    story.append(src("Source: PitchBook Healthcare Services M&A Report 2024; Becker's Healthcare Valuation Data 2024.", ss))
    story.append(PageBreak())

    # ── Pilot Economics ──
    story.append(h1("Pilot Economics and Scenario Modeling", ss))
    story.append(body(
        "A 90-day controlled pilot provides the evidence base for full deployment decisions. The pilot "
        "is designed to test conversion rates, patient response, staff adoption, and ROI on a defined "
        "account segment before committing to organization-wide implementation.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Scenario", "Pilot AR Volume", "Conversion Rate", "Gross Recovery", "Net Revenue (after fees)", "Pilot ROI"],
        [
            ["Conservative", "$500K", "25%", "$125K", "$106K", "2.1x"],
            ["Target", "$500K", "40%", "$200K", "$170K", "3.4x"],
            ["Aggressive", "$500K", "55%", "$275K", "$234K", "4.7x"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Pilot Cost Structure", ss))
    story.append(make_table(
        ["Cost Category", "90-Day Pilot Cost", "Notes"],
        [
            ["VitaCoreX engagement fee", "$35,000-50,000", "Based on volume and complexity"],
            ["Staff training and onboarding", "$5,000-10,000", "One-time; includes materials and coaching"],
            ["Technology setup/integration", "$5,000-15,000", "Depends on EHR/PM system"],
            ["Internal staff time (incremental)", "$8,000-12,000", "Estimated 0.5-1.0 FTE equivalent"],
            ["Total pilot investment", "$53,000-87,000", "Blended estimate"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Break-Even Analysis", ss))
    story.append(body(
        "At a $65K average pilot cost and $500K pilot AR volume, the break-even conversion rate is "
        "approximately 15-18%. Industry data suggests that even poorly implemented pre-collection "
        "programs exceed 20% conversion, and well-structured programs consistently achieve 35-55%. "
        "The risk-adjusted expected value of the pilot is strongly positive across all reasonable "
        "scenarios.", ss))
    story.append(DrawingFlowable(make_bar_chart([
        ("Break-\nEven", 15), ("Conser-\nvative", 25), ("Target", 40), ("Aggres-\nsive", 55), ("Top\nDecile", 65),
    ], "Conversion Rate Scenarios vs. Break-Even (%)", width=460, height=160)))
    story.append(src("Source: VitaCoreX pilot data; HFMA Revenue Cycle Improvement benchmarks 2024.", ss))
    story.append(PageBreak())

    # ── Competitive Landscape ──
    story.append(h1("Competitive Landscape", ss))
    story.append(body(
        "Healthcare CFOs have multiple options for addressing patient AR leakage. Understanding the "
        "strengths, limitations, and cost structures of each approach is essential for making informed "
        "investment decisions. The following comparison evaluates five common approaches.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Approach", "Strengths", "Limitations", "Typical Cost", "Net Yield"],
        [
            ["External Collection Agency", "No upfront cost; pay-for-performance model", "25-40% contingency; patient relationship damage; low net yield; regulatory risk", "25-40% of recovered", "10-14%"],
            ["In-House Billing Team", "Full control; patient relationship preserved", "Staff capacity constraints; limited expertise in aged AR; high fixed cost", "$50-75K per FTE", "15-25% (capacity limited)"],
            ["RCM Software Platform", "Automation; analytics; scalable", "Requires staff execution; implementation complexity; subscription cost", "$3-10 per claim", "Varies widely"],
            ["Outsourced RCM (full cycle)", "End-to-end management; expertise", "Loss of control; vendor dependency; transition risk; 4-8% of collections", "4-8% of net collections", "Varies by vendor"],
            ["Structured Pre-Collection (VitaCoreX)", "Higher net yield; documentation-ready; patient-centered; compliance-built", "Requires organizational commitment; 90-day measurement cycle; change management", "Performance-based", "35-55%"],
        ], ss))
    story.append(src("Source: HFMA Vendor Assessment Guide 2024; Becker's Healthcare RCM Market Report 2024.", ss))
    story.append(sp(4))
    story.append(h2("Key Differentiators of Pre-Collection vs. Agency", ss))
    story.append(make_table(
        ["Dimension", "Traditional Agency", "Pre-Collection"],
        [
            ["Timing of intervention", "After 90-120+ days", "30-90 day window"],
            ["Fee structure", "25-40% contingency", "Fixed + performance component"],
            ["Patient communication tone", "Collection-oriented", "Financial counseling-oriented"],
            ["Documentation output", "Minimal", "Counsel-ready file for each account"],
            ["Regulatory posture", "FDCPA-managed risk", "Compliance-first design"],
            ["Data and reporting", "Monthly batch reports", "Real-time dashboard"],
            ["Patient satisfaction impact", "Typically negative", "Neutral to positive"],
            ["Downstream legal readiness", "Low", "High (complete audit trail)"],
        ], ss))
    story.append(PageBreak())

    # ── Use Case Fit ──
    story.append(h1("Use Case Fit Assessment", ss))
    story.append(body(
        "Pre-collection infrastructure delivers the highest ROI for organizations with specific "
        "characteristics. The following assessment helps CFOs determine alignment between their "
        "organization's profile and the pre-collection model.", ss))
    story.append(sp(4))
    story.append(make_table_gold_header(
        ["Profile Dimension", "Best Fit", "Moderate Fit", "Lower Fit"],
        [
            ["Annual patient AR volume", ">$500K", "$200K-500K", "<$200K"],
            ["Patient responsibility share", ">30%", "20-30%", "<20%"],
            ["Current bad debt rate", ">5%", "3-5%", "<3%"],
            ["Number of locations", "3+", "2", "1"],
            ["Current agency placement rate", ">50% of aged AR", "30-50%", "<30%"],
            ["EHR/PM system", "Major platform (Epic, athena, eCW)", "Mid-tier system", "Paper/manual"],
            ["Staff capacity for change", "Dedicated billing team", "Shared billing function", "Minimal billing staff"],
            ["Strategic priority", "Revenue cycle optimization", "General improvement", "Other priorities"],
        ], ss))
    story.append(src("Source: VitaCoreX engagement criteria; HFMA practice segmentation data 2024.", ss))
    story.append(PageBreak())

    # ── Implementation Timeline ──
    story.append(h1("Implementation Timeline (13-Week)", ss))
    story.append(body(
        "The following timeline outlines the standard 13-week implementation process from contract "
        "execution to full pilot operation. Each phase includes specific milestones, deliverables, "
        "and success criteria.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Week", "Phase", "Activities", "Deliverables", "Success Criteria"],
        [
            ["1-2", "Discovery and Assessment", "AR aging analysis, workflow audit, staff interviews, technology assessment, compliance review", "Current state assessment report, opportunity quantification, risk register", "Complete data received; gaps identified"],
            ["3-4", "Design and Planning", "Workflow design, communication templates, escalation protocols, training materials, KPI definitions", "Operating playbook, training curriculum, technology requirements document", "Stakeholder sign-off on design"],
            ["5-6", "Setup and Training", "Technology configuration, staff training sessions (2-3 per group), pilot account selection, communication testing", "Trained staff, configured system, pilot cohort defined", "Training completion >95%; system validated"],
            ["7-8", "Soft Launch", "Pilot accounts activated, daily monitoring, staff coaching, workflow refinement, patient feedback collection", "Weekly performance reports, issue log, refinement recommendations", "First conversion achieved; no compliance issues"],
            ["9-10", "Optimization", "Performance analysis, workflow adjustments, expanded outreach channels, staff performance coaching", "Optimization report, updated workflows, performance benchmarks", "Conversion rate trending toward target"],
            ["11-12", "Steady Operations", "Full pilot operation, KPI tracking, executive reporting, compliance audit preparation", "Monthly executive dashboard, compliance certification, financial impact analysis", "ROI tracking positive; stable operations"],
            ["13", "Decision Point", "Pilot results review, scaling assessment, full deployment planning, contract evaluation", "Pilot results report, scaling recommendation, Phase 2 proposal", "Go/no-go decision with data support"],
        ], ss))
    story.append(src("Source: VitaCoreX implementation methodology; HFMA change management best practices 2024.", ss))
    story.append(PageBreak())

    # ── KPI Dashboard Design ──
    story.append(h1("KPI Dashboard Design", ss))
    story.append(body(
        "CFO-level visibility into pre-collection performance requires a structured dashboard that "
        "separates operational metrics (tracked weekly) from strategic metrics (tracked monthly). "
        "The following framework defines the key performance indicators and their target ranges.", ss))
    story.append(sp(4))
    story.append(h2("Weekly Operational KPIs", ss))
    story.append(make_table(
        ["KPI", "Definition", "Target Range", "Alert Threshold", "Data Source"],
        [
            ["Accounts engaged", "Number of accounts in active pre-collection", "100% of eligible", "<80% engaged", "Workflow system"],
            ["Contact rate", "% of accounts with successful contact in current cycle", ">70%", "<50%", "Communication log"],
            ["Payment plan enrollment", "% of engaged accounts with active plan", ">40%", "<25%", "Payment system"],
            ["Autopay enrollment", "% of payment plans with autopay enabled", ">65%", "<40%", "Payment system"],
            ["Plan default rate (weekly)", "% of active plans missing scheduled payment", "<8%", ">15%", "Payment system"],
            ["Staff productivity", "Accounts resolved per FTE per week", "15-25", "<10", "Workflow system"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Monthly Strategic KPIs", ss))
    story.append(make_table(
        ["KPI", "Definition", "Target Range", "Benchmark Source"],
        [
            ["Conversion rate", "% of pre-collection accounts resolving with payment", "35-55%", "HFMA 2024"],
            ["Net yield per dollar", "Net cash recovered per dollar of pre-collection AR", "$0.35-0.55", "ACA International 2024"],
            ["Agency placement reduction", "% reduction in accounts sent to external agency", "40-60%", "VitaCoreX target"],
            ["DSO improvement", "Reduction in days sales outstanding (patient AR)", "10-15 day reduction", "MGMA 2024"],
            ["Bad debt rate improvement", "Reduction in bad debt as % of revenue", "1-2pp reduction", "HFMA MAP Keys 2024"],
            ["Patient satisfaction (billing)", "Patient-reported satisfaction with billing process", "75th percentile+", "Press Ganey 2024"],
            ["Compliance incidents", "Number of regulatory findings or patient complaints", "Zero", "Internal audit"],
            ["Program ROI", "Net financial benefit / total program cost", ">3.0x", "VitaCoreX target"],
        ], ss))
    story.append(src("Source: HFMA KPI Framework 2024; MGMA Performance Benchmarking 2024.", ss))
    story.append(PageBreak())

    # ── Engagement Path ──
    story.append(h1("Engagement Path", ss))
    story.append(body(
        "VitaCoreX LLC partners with healthcare CFOs to design, implement, and optimize pre-collection "
        "recovery infrastructure. The engagement is structured to deliver measurable ROI within 90 days, "
        "with clear decision points and transparent reporting.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Step", "Description", "Timeline"],
        [
            ["1. CFO Briefing", "45-minute executive briefing with financial modeling specific to your organization", "Schedule at convenience"],
            ["2. AR Portfolio Analysis", "Detailed analysis of AR aging, payer mix, collection rates, and leakage quantification", "1-2 weeks after data receipt"],
            ["3. Custom Proposal", "Financial model, staffing plan, technology requirements, and projected ROI with scenarios", "1 week after analysis"],
            ["4. Pilot Execution", "90-day controlled pilot with weekly reporting and ongoing optimization", "Begins within 2 weeks of contract"],
            ["5. Scale Decision", "Data-driven go/no-go with full deployment roadmap", "Week 13 of pilot"],
        ], ss))
    story.append(sp(6))
    story.append(callout("Schedule a CFO Briefing",
        "Contact VitaCoreX LLC at (888) 794-8292 or info@vitacorexllc.com to schedule a 45-minute "
        "executive briefing. We will prepare a preliminary financial analysis specific to your "
        "organization's patient AR profile before the call.", ss))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"    -> {path}")


# ══════════════════════════════════════════════════════════════════════
# PDF 3: Dental Institutional Deck (14+ pages)
# ══════════════════════════════════════════════════════════════════════

def build_dental_deck():
    print("  [3/4] Building dental-institutional-deck.pdf ...")
    ss = build_styles()
    path = os.path.join(DIR, "dental-institutional-deck.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
        topMargin=0.7*inch, bottomMargin=0.7*inch, leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Pre-Collection Revenue Cycle<br/>Optimization for Dental Groups",
        "Market analysis, financial modeling, and operational<br/>design for dental service organizations",
        "Institutional Deck  |  Dental Market  |  2026", ss)

    # TOC
    story += toc_page([
        ("Executive Summary", "3"),
        ("Market Overview: U.S. Dental Industry", "4"),
        ("Patient AR Problem in Dental", "6"),
        ("Recovery Probability by Aging (Dental)", "7"),
        ("Dental-Specific Revenue Issues", "8"),
        ("Financial Model: Mid-Size Dental Group", "10"),
        ("90-Day Pilot Design", "11"),
        ("Operating System Architecture", "12"),
        ("Staff Training and Compliance", "13"),
        ("CFO One-Page Summary and Next Steps", "14"),
    ], ss)

    # ── Executive Summary ──
    story.append(h1("Executive Summary", ss))
    story.append(body(
        "The U.S. dental market exceeded $165 billion in 2023, with patient out-of-pocket responsibility "
        "representing 35-50% of total dental revenue depending on practice mix. Unlike medical practices "
        "with dominant payer relationships, dental practices rely heavily on patient payments -- making "
        "collection efficiency a primary determinant of financial performance. Dental groups and DSOs "
        "operating at scale face unique AR challenges including treatment plan abandonment, multi-location "
        "billing variance, and insurance coding denial patterns specific to dental procedures.", ss))
    story.append(sp(4))
    story.append(make_metric_table([
        ("$165B+", "U.S. dental market\nsize (2023)"),
        ("35-50%", "Patient out-of-pocket\nshare of dental revenue"),
        ("+10-20%", "Revenue lift from\npre-collection"),
        ("90 days", "Critical intervention\nwindow"),
    ], ss))
    story.append(src(
        "Sources: ADA Health Policy Institute 2024; IBISWorld Dental Industry Report 2024; "
        "Becker's Dental + DSO Review 2024.", ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_bar_chart([
        ("Insurance\nPays", 52), ("Patient\nPays", 38), ("Write-\nOff", 6), ("Bad\nDebt", 4),
    ], "Dental Revenue Dollar Allocation (Typical DSO)", width=460, height=160)))
    story.append(src("Source: ADA HPI Practice Economics Survey 2024; DSO financial benchmarks.", ss))
    story.append(sp(4))
    story.append(callout("Key Insight",
        "Dental practices with structured pre-collection programs recover 10-20% more net revenue from "
        "patient balances compared to those relying solely on statement-and-agency workflows. The higher "
        "patient-pay share in dental (vs. medical) makes collection infrastructure disproportionately "
        "impactful on total revenue.", ss))
    story.append(PageBreak())

    # ── Market Overview (2 pages) ──
    story.append(h1("Section 1: Market Overview -- U.S. Dental Industry", ss))
    story.append(h2("Industry Size and Growth", ss))
    story.append(body(
        "The U.S. dental industry generated over $165 billion in revenue in 2023, with CMS projecting "
        "continued growth of 4-5% annually through 2028. The industry is characterized by ongoing "
        "consolidation, with dental service organizations (DSOs) now representing an estimated 30-35% "
        "of total dental revenue, up from approximately 15% in 2015. Private equity investment in "
        "dental has accelerated this consolidation, with over $10 billion deployed into DSO platforms "
        "and add-on acquisitions since 2019 (PitchBook 2024).", ss))
    story.append(body(
        "The market structure is shifting from predominantly solo practitioner models to multi-location "
        "group practices and DSO-affiliated platforms. This consolidation creates both challenges "
        "(multi-location billing variance, integration complexity) and opportunities (centralized "
        "infrastructure, economies of scale in revenue cycle management) for collection optimization.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Market Metric", "2019", "2021", "2023", "2025 Projected"],
        [
            ["Total U.S. dental revenue", "$140B", "$148B", "$165B", "$178B"],
            ["DSO market share", "20-22%", "25-27%", "30-35%", "37-42%"],
            ["Number of DSO platforms (20+ locations)", "120", "180", "250+", "310+"],
            ["Average PE entry multiple (EBITDA)", "10-12x", "12-14x", "11-14x", "11-15x"],
            ["Solo practitioner share", "65%", "58%", "50-52%", "44-48%"],
            ["Average patient balance at checkout", "$285", "$340", "$395", "$420+"],
            ["Patient out-of-pocket share", "38%", "40%", "42%", "44%"],
        ], ss))
    story.append(src(
        "Sources: ADA Health Policy Institute 2024; PitchBook DSO Deal Activity 2024; "
        "IBISWorld U.S. Dental Industry Report 2024; CMS National Health Expenditure Projections.", ss))
    story.append(sp(4))
    story.append(h2("Insurance vs. Patient Payment Breakdown", ss))
    story.append(body(
        "Dental insurance coverage in the U.S. reaches approximately 65% of the population, but dental "
        "benefit plans typically carry significant limitations: annual maximums averaging $1,500 (largely "
        "unchanged since the 1970s), deductibles of $50-150 per individual, and coinsurance rates of "
        "20-50% for non-preventive procedures. The result is that even insured patients face substantial "
        "out-of-pocket costs for restorative, endodontic, periodontal, and prosthodontic treatment.", ss))
    story.append(make_table(
        ["Procedure Category", "Insurance Coverage Rate", "Typical Patient Coinsurance", "Average OOP Cost"],
        [
            ["Preventive (D0100-D1999)", "80-100%", "0-20%", "$15-50"],
            ["Basic Restorative (D2000-D2999)", "70-80%", "20-30%", "$80-250"],
            ["Major Restorative (D2700-D2999)", "50-60%", "40-50%", "$250-800"],
            ["Endodontic (D3000-D3999)", "50-80%", "20-50%", "$200-700"],
            ["Periodontic (D4000-D4999)", "50-80%", "20-50%", "$150-1,500"],
            ["Prosthodontic (D5000-D5999)", "50%", "50%", "$500-3,000"],
            ["Implant (D6000-D6999)", "0-50%", "50-100%", "$1,500-5,000"],
            ["Orthodontic (D8000-D8999)", "25-50%", "50-75%", "$2,000-5,000"],
        ], ss))
    story.append(src("Source: ADA HPI Dental Benefits Report 2024; National Association of Dental Plans 2024.", ss))
    story.append(sp(4))
    story.append(h2("M&A Trends and EBITDA Multiples", ss))
    story.append(body(
        "DSO valuations remain elevated, with platform transactions commanding 11-15x EBITDA and add-on "
        "acquisitions at 5-8x EBITDA (PitchBook 2024). Revenue cycle efficiency directly impacts EBITDA "
        "and therefore enterprise value. A DSO generating $40M in revenue with a 2% improvement in net "
        "collection rate adds approximately $800K to EBITDA -- translating to $8.8-11.2M in enterprise "
        "value at prevailing multiples.", ss))
    story.append(PageBreak())

    # ── Patient AR Problem ──
    story.append(h1("Section 2: Patient AR Problem in Dental", ss))
    story.append(body(
        "Dental practices face unique collection challenges compared to medical practices. The combination "
        "of higher patient responsibility share, elective treatment components, multi-visit treatment "
        "plans, and insurance benefit limitations creates a complex AR environment where structured "
        "collection infrastructure provides outsized returns.", ss))
    story.append(sp(4))
    story.append(h2("Collection Efficiency by Category", ss))
    story.append(make_table(
        ["Revenue Category", "Volume Share", "Collection Rate", "Avg. Days to Collect", "Primary Challenge"],
        [
            ["Insurance-covered preventive", "25-30%", "95-98%", "21-35 days", "Claim processing delays"],
            ["Insurance-covered restorative", "25-30%", "85-92%", "30-45 days", "Coding denials, downcoding"],
            ["Patient copay/coinsurance", "20-25%", "55-70%", "45-75 days", "Balance billing confusion"],
            ["Patient self-pay (no insurance)", "10-15%", "35-50%", "60-120+ days", "Affordability, payment plans"],
            ["Elective/cosmetic", "5-10%", "40-60%", "30-90 days", "Buyer's remorse, financing"],
            ["Orthodontic patient portions", "5-10%", "75-85%", "Contract-based", "Plan compliance over 18-24 months"],
        ], ss))
    story.append(src("Source: ADA HPI Practice Economics 2024; Dental Group Management Association 2024.", ss))
    story.append(sp(4))
    story.append(h2("Why Dental AR Is Different from Medical AR", ss))
    story.append(make_table(
        ["Dimension", "Medical AR", "Dental AR", "Implication for Recovery"],
        [
            ["Patient responsibility share", "30-35%", "35-50%", "Higher volume of patient collections required"],
            ["Treatment elective component", "Low (medically necessary)", "Moderate to high", "Patient willingness to pay varies by perceived value"],
            ["Multi-visit treatment plans", "Occasional", "Common (crowns, root canals, implants)", "Balance fragmentation across visits"],
            ["Insurance annual maximum", "No annual max (typical)", "$1,000-2,000 annual max", "Patients exceed benefits mid-year"],
            ["Coding complexity", "High (CPT/ICD-10)", "Moderate (CDT codes)", "Denial patterns differ significantly"],
            ["Patient switching cost", "Moderate (referrals, records)", "Low (many alternative providers)", "Higher churn risk from aggressive collection"],
        ], ss))
    story.append(PageBreak())

    # ── Recovery Probability ──
    story.append(h1("Section 3: Recovery Probability by Aging (Dental)", ss))
    story.append(body(
        "Dental patient AR follows a similar decay pattern to healthcare generally, but with faster "
        "deterioration in the 60-120 day window due to the elective nature of many dental procedures. "
        "Patients who do not pay dental balances within 60 days are significantly less likely to pay "
        "without structured intervention compared to medical patients with equivalent balances.", ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_line_chart(
        [90, 72, 48, 28, 14, 6],
        "Dental Patient AR Recovery Probability by Aging Bucket (%)",
        ["0-30d", "31-60d", "61-90d", "91-120d", "121-180d", "180+d"],
        width=460, height=175)))
    story.append(src("Sources: ADA HPI 2024; ACA International Recovery Data 2024; Dental group benchmarks.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Aging Bucket", "Recovery Rate (Dental)", "Recovery Rate (Medical)", "Delta", "Dental-Specific Factor"],
        [
            ["0-30 days", "88-92%", "90-95%", "-2-3pp", "Comparable; insurance processing"],
            ["31-60 days", "68-75%", "70-80%", "-2-5pp", "Elective treatment regret begins"],
            ["61-90 days", "42-52%", "50-60%", "-5-8pp", "Lower urgency; alternative providers"],
            ["91-120 days", "24-32%", "30-40%", "-6-8pp", "Balance becomes \"old\" in patient mind"],
            ["121-180 days", "12-18%", "15-25%", "-3-7pp", "Minimal response to standard billing"],
            ["180+ days", "4-8%", "5-12%", "-1-4pp", "Agency or write-off territory"],
        ], ss))
    story.append(sp(4))
    story.append(callout("Dental-Specific Insight",
        "The 60-day window is even more critical in dental than in medical. Dental patients who do not "
        "respond to structured outreach by day 60 have only a 28% probability of full payment. Practices "
        "that wait until 90+ days to intervene lose 40-60% of recoverable balances.", ss))
    story.append(PageBreak())

    # ── Dental-Specific Revenue Issues (2 pages) ──
    story.append(h1("Section 4: Dental-Specific Revenue Issues", ss))
    story.append(h2("Treatment Plan Acceptance vs. Completion Gap", ss))
    story.append(body(
        "One of the most significant revenue leakage points unique to dental is the gap between "
        "treatment plan acceptance and treatment completion. Industry data from the ADA Health Policy "
        "Institute shows that while 60-70% of patients accept recommended treatment plans, only "
        "35-50% complete all planned procedures within 12 months. This gap represents revenue that "
        "was clinically indicated, patient-accepted, but never converted to billed services.", ss))
    story.append(make_table(
        ["Treatment Category", "Acceptance Rate", "Completion Rate (12 mo.)", "Revenue Gap", "Primary Barrier"],
        [
            ["Preventive / hygiene", "90-95%", "85-90%", "5-10%", "Scheduling friction"],
            ["Basic restorative (fillings)", "75-85%", "65-75%", "10-15%", "Urgency perception"],
            ["Major restorative (crowns, bridges)", "55-65%", "35-45%", "20-30%", "Cost / insurance limits"],
            ["Endodontic (root canals)", "60-70%", "50-60%", "10-20%", "Fear / seeking alternatives"],
            ["Periodontic (deep cleaning, surgery)", "50-60%", "30-40%", "20-30%", "Perceived non-urgency"],
            ["Implants", "40-50%", "25-35%", "15-25%", "High OOP cost; financing needed"],
            ["Orthodontic", "50-60%", "45-55%", "5-15%", "Financial commitment length"],
        ], ss))
    story.append(src("Source: ADA HPI Treatment Acceptance Research 2024; Dental Economics Practice Survey 2024.", ss))
    story.append(sp(4))
    story.append(h2("Insurance Coding Denial Patterns for Dental", ss))
    story.append(body(
        "Dental insurance denials follow predictable patterns that differ significantly from medical "
        "claim denials. Understanding these patterns allows practices to implement proactive denial "
        "prevention and appeal strategies. The most common dental denial categories account for "
        "approximately 70% of all dental claim denials.", ss))
    story.append(make_table(
        ["Denial Category", "Frequency", "Avg. Balance Impact", "Prevention Strategy", "Appeal Success Rate"],
        [
            ["Frequency limitation (e.g., 2 cleanings/year)", "25-30%", "$150-300", "Eligibility verification at scheduling", "Low (plan limitation)"],
            ["Annual maximum exceeded", "15-20%", "$500-3,000", "Benefit tracking; patient notification", "Low (plan limitation)"],
            ["Missing/invalid information", "12-15%", "Varies", "Front desk training; verification protocols", "High (85%+)"],
            ["Procedure not covered", "10-12%", "$200-2,000", "Pre-authorization; patient cost estimate", "Medium (40-60%)"],
            ["Downcoding (e.g., D2740 to D2750)", "8-10%", "$150-500", "Clinical documentation; narrative support", "Medium-High (50-70%)"],
            ["Coordination of benefits error", "5-8%", "Varies", "Primary/secondary verification", "High (80%+)"],
            ["Prior authorization required", "5-7%", "$300-1,500", "Pre-auth workflow automation", "High if obtained (90%+)"],
        ], ss))
    story.append(src("Source: ADA Dental Claim Denial Analysis 2024; DentaQuest Claims Data Report 2024.", ss))
    story.append(sp(4))
    story.append(h2("Case Abandonment After Treatment Planning", ss))
    story.append(body(
        "Case abandonment occurs when patients accept treatment, complete initial procedures, but fail "
        "to return for subsequent phases. This is particularly common in multi-visit restorative and "
        "prosthodontic treatment plans. For DSOs, multi-location tracking of case abandonment is "
        "essential to identify systemic patterns vs. individual practice issues.", ss))
    story.append(b("35-45% of multi-visit treatment plans experience some phase abandonment (ADA HPI 2024)", ss))
    story.append(b("Average revenue loss per abandoned case: $800-2,500 depending on treatment type", ss))
    story.append(b("Top abandonment drivers: cost concern (40%), fear/anxiety (20%), scheduling difficulty (15%), moved/switched providers (15%)", ss))
    story.append(b("Structured follow-up at 7, 14, and 30 days post-missed appointment reduces abandonment by 25-35%", ss))
    story.append(sp(4))
    story.append(h2("Multi-Location Variance in DSOs", ss))
    story.append(body(
        "DSOs operating multiple locations frequently discover significant variance in collection "
        "efficiency across sites. This variance is driven by differences in staff training, front "
        "desk execution, patient demographics, payer mix, and provider treatment patterns. "
        "Standardized pre-collection workflows reduce inter-location variance by 40-60%, bringing "
        "bottom-performing locations closer to organizational benchmarks.", ss))
    story.append(make_table(
        ["Metric", "Top-Performing Location", "Average Location", "Bottom Location", "Variance"],
        [
            ["Patient collection rate", "78%", "62%", "45%", "33pp"],
            ["AR >90 days as % of total", "8%", "18%", "32%", "24pp"],
            ["Treatment plan completion", "55%", "42%", "28%", "27pp"],
            ["Denial rate", "5%", "10%", "18%", "13pp"],
            ["Patient balance at checkout", "85% collected", "60% collected", "35% collected", "50pp"],
        ], ss))
    story.append(src("Source: DSO operational benchmarks; Dental Group Management Association 2024.", ss))
    story.append(PageBreak())

    # ── Financial Model (2 pages) ──
    story.append(h1("Section 5: Financial Model -- Mid-Size Dental Group", ss))
    story.append(body(
        "The following financial model illustrates the impact of structured pre-collection for a "
        "mid-size dental group with $40M in annual revenue and 15-20 locations. The model uses "
        "conservative assumptions based on published industry benchmarks.", ss))
    story.append(sp(4))
    story.append(h2("Baseline Assumptions", ss))
    story.append(make_table(
        ["Assumption", "Value", "Source"],
        [
            ["Annual revenue", "$40M", "Practice profile"],
            ["Patient responsibility share", "42%", "ADA HPI 2024"],
            ["Annual patient AR portfolio", "$16.8M", "Calculated (42% of $40M)"],
            ["Current patient collection rate", "62%", "Industry median"],
            ["Current bad debt rate", "5.8%", "ADA HPI dental benchmarks"],
            ["Current agency placement volume", "$6.4M (38% of patient AR)", "Estimated"],
            ["Agency contingency fee", "28% average", "ACA International 2024"],
            ["Agency gross recovery rate", "16% of placed balances", "ACA International 2024"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Impact Model: Pre-Collection Implementation", ss))
    story.append(make_table(
        ["Metric", "Current State", "With Pre-Collection", "Delta"],
        [
            ["Patient AR portfolio", "$16.8M", "$16.8M", "--"],
            ["Patient collection rate", "62%", "74%", "+12pp"],
            ["Bad debt rate", "5.8%", "3.6%", "-2.2pp"],
            ["Agency placement volume", "$6.4M", "$2.9M", "-55%"],
            ["Agency recovery (net of 28% fee)", "$737K", "$334K", "-$403K"],
            ["Pre-collection recovery (net)", "--", "$2.52M", "+$2.52M"],
            ["Total net patient cash recovery", "$11.1M", "$13.4M", "+$2.3M (+21%)"],
            ["Annual bad debt reduction", "--", "$880K", "+$880K"],
            ["Net annual revenue improvement", "--", "$2.3M", "+$2.3M"],
        ], ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_dual_bar_chart([
        ("Q1", 180, 460), ("Q2", 210, 580), ("Q3", 240, 690), ("Q4", 260, 810),
    ], "Cumulative Patient Cash Recovery: Current vs. Pre-Collection ($K)",
       ["Agency Only", "With Pre-Collection"], width=460, height=180)))
    story.append(src("Illustrative: $40M dental group, 42% patient share. ADA HPI/ACA International benchmarks.", ss))
    story.append(sp(4))
    story.append(h2("DSO Compression and EBITDA Impact", ss))
    story.append(body(
        "Reducing DSO from 52 days (dental median) to 38 days releases approximately $1.54M in working "
        "capital for a $40M dental group. Combined with the $2.3M annual net recovery improvement, the "
        "total financial impact is approximately $3.8M in the first year. At a 12x EBITDA multiple, "
        "this translates to approximately $27.6M in enterprise value creation.", ss))
    story.append(make_table(
        ["Valuation Impact", "EBITDA Improvement", "At 8x Multiple", "At 12x Multiple", "At 14x Multiple"],
        [
            ["Net revenue improvement", "$2.3M", "$18.4M", "$27.6M", "$32.2M"],
            ["Working capital release (DSO)", "$1.54M", "One-time cash", "One-time cash", "One-time cash"],
            ["Total Year 1 financial impact", "$3.84M", "--", "--", "--"],
        ], ss))
    story.append(src("Source: PitchBook DSO Valuation Data 2024; ADA HPI Practice Economics 2024.", ss))
    story.append(PageBreak())

    # ── 90-Day Pilot Design ──
    story.append(h1("Section 6: 90-Day Pilot Design", ss))
    story.append(body(
        "The pilot is designed to validate conversion rates, patient response, staff execution, and "
        "ROI on a controlled account segment before full deployment. Pilot design is critical for "
        "de-risking the investment and building internal stakeholder confidence.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Phase", "Weeks", "Activities", "Financial Targets"],
        [
            ["Phase 1: Setup", "1-3", "Account selection ($750K-1M AR), staff training, workflow configuration, communication template design, compliance review", "Investment: $25-35K setup cost"],
            ["Phase 2: Active Recovery", "4-8", "Multi-channel outreach, payment plan structuring, autopay enrollment, weekly performance reporting, patient feedback monitoring", "Target: 20-30% conversion ($150-300K)"],
            ["Phase 3: Optimization", "9-12", "Performance analysis, workflow refinement, expanded settlement offers, staff coaching, compliance audit", "Target: 35-45% cumulative conversion ($263-338K)"],
            ["Phase 4: Decision", "13", "Pilot results review, ROI validation, full deployment planning, scaling analysis", "Target: >3x ROI on pilot investment"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Pilot Success Criteria", ss))
    story.append(make_table(
        ["Metric", "Minimum Threshold", "Target", "Stretch Goal"],
        [
            ["Conversion rate", "20%", "35%", "50%+"],
            ["Net yield per dollar", "$0.18", "$0.32", "$0.45+"],
            ["Patient satisfaction (no decline)", "Baseline -0", "Baseline +5%", "Baseline +10%"],
            ["Compliance incidents", "0 violations", "0 violations", "0 violations"],
            ["Agency placement reduction", "20%", "40%", "60%"],
            ["Staff adoption score", "70%", "85%", "95%+"],
            ["Pilot ROI", "1.5x", "3.0x", "5.0x"],
        ], ss))
    story.append(PageBreak())

    # ── Operating System Architecture ──
    story.append(h1("Section 7: Operating System Architecture", ss))
    story.append(body(
        "The pre-collection operating system integrates with the practice management system to create "
        "a structured, automated, and auditable recovery workflow. The architecture is designed for "
        "multi-location deployment with centralized governance and location-specific execution.", ss))
    story.append(sp(4))
    story.append(h2("Workflow Sequence", ss))
    story.append(make_table(
        ["Stage", "Trigger", "Actions", "Escalation Criteria", "Documentation Output"],
        [
            ["Intake Assessment", "Balance >$50, insurance adjudicated", "Balance validation, patient contact verification, insurance benefit check", "Proceed to outreach if balance confirmed", "Intake form, eligibility verification"],
            ["Initial Contact", "Day 3 post-adjudication", "Friendly reminder (letter + digital), financial counseling offer, payment portal link", "No response by day 14", "Contact log, delivery confirmation"],
            ["Payment Plan Offer", "Day 14 or patient response", "Structured plan proposal, autopay enrollment, hardship screening", "No enrollment by day 30", "Signed agreement, autopay auth"],
            ["Active Monitoring", "Plan activated", "Payment tracking, missed payment alerts, cure notice protocol", "Two consecutive missed payments", "Payment log, default notices"],
            ["Intensive Recovery", "Day 60 or plan default", "Escalated outreach, settlement offer, guarantor review, documentation assembly", "No resolution by day 90", "Settlement terms, full audit trail"],
            ["Resolution/Handoff", "Day 90+", "Final attempt, agency preparation, counsel-ready package", "Transfer to agency with complete file", "Handoff checklist, compliance cert"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Governance Framework", ss))
    story.append(make_table(
        ["Governance Element", "Frequency", "Participants", "Purpose"],
        [
            ["Daily huddle", "Daily (15 min)", "Recovery team", "Account prioritization, issue escalation"],
            ["Weekly review", "Weekly (30 min)", "Recovery lead + management", "KPI review, workflow adjustments"],
            ["Monthly dashboard", "Monthly", "Practice leadership / DSO executives", "Performance reporting, trend analysis"],
            ["Quarterly business review", "Quarterly", "CFO + VitaCoreX leadership", "ROI assessment, strategic planning"],
            ["Annual compliance audit", "Annually", "Compliance officer + external review", "Regulatory compliance certification"],
        ], ss))
    story.append(PageBreak())

    # ── Staff Training ──
    story.append(h1("Section 8: Staff Training and Compliance", ss))
    story.append(h2("Operational Discipline Framework", ss))
    story.append(body(
        "Staff training is the most critical success factor for pre-collection implementation. The "
        "training program covers five domains: communication skills, workflow execution, technology "
        "operation, compliance requirements, and performance optimization. Training is delivered "
        "in a blended format combining live sessions, e-learning modules, and on-the-job coaching.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Training Domain", "Hours", "Format", "Assessment", "Recertification"],
        [
            ["Empathetic financial communication", "4 hours", "Live workshop + role play", "Scripted call evaluation", "Annual"],
            ["Pre-collection workflow execution", "3 hours", "System walkthrough + practice", "Process accuracy test (>90%)", "Semi-annual"],
            ["Practice management system operation", "2 hours", "Hands-on training", "Task completion audit", "As needed"],
            ["FDCPA/HIPAA compliance", "3 hours", "E-learning + live Q&A", "Written exam (>85%)", "Annual"],
            ["Performance metrics and optimization", "2 hours", "Dashboard training + coaching", "KPI interpretation exercise", "Quarterly"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Compliance Framework", ss))
    story.append(make_table(
        ["Compliance Area", "Requirement", "Monitoring Method", "Violation Response"],
        [
            ["FDCPA communication limits", "Max 7 calls per 7-day period per debt", "Automated call log monitoring", "Immediate workflow suspension + review"],
            ["HIPAA PHI protection", "Minimum necessary standard in all communications", "Monthly communication audit", "Staff retraining + process update"],
            ["State consumer protection", "Florida F.S. 559 additional protections", "Quarterly compliance review", "Legal counsel consultation"],
            ["Patient dispute rights", "Written validation within 5 days of initial contact", "Automated template compliance", "Process correction + documentation"],
            ["Recording and monitoring", "All calls recorded with consent notification", "Weekly call quality review", "Coaching + re-recording"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Patient Safeguards", ss))
    story.append(b("All patients receive written explanation of their rights under FDCPA and state law", ss))
    story.append(b("Hardship screening available for patients demonstrating financial distress", ss))
    story.append(b("Opt-out mechanism for all digital communications (SMS, email)", ss))
    story.append(b("Escalation path to practice management for patient complaints", ss))
    story.append(b("No negative credit reporting during pre-collection period", ss))
    story.append(b("Settlement offers available for qualified accounts with documented financial hardship", ss))
    story.append(PageBreak())

    # ── CFO One-Page Summary + Next Steps ──
    story.append(h1("Section 9: CFO One-Page Summary", ss))
    story.append(body(
        "For the dental group or DSO CFO evaluating pre-collection infrastructure, the following "
        "summary captures the key financial metrics and decision framework.", ss))
    story.append(sp(4))
    story.append(make_table_gold_header(
        ["Metric", "Value", "Source"],
        [
            ["Addressable patient AR (typical DSO)", "$10-20M annually", "Practice profile / 42% of revenue"],
            ["Current net yield (agency model)", "10-14%", "ACA International 2024"],
            ["Target net yield (pre-collection)", "35-55%", "HFMA 2024; VitaCoreX benchmarks"],
            ["Expected annual revenue lift", "$1.5-3.5M per $40M revenue", "Financial model above"],
            ["Pilot investment", "$50-80K for 90 days", "VitaCoreX pricing"],
            ["Expected pilot ROI", "3-5x", "Conservative scenario analysis"],
            ["Implementation timeline", "13 weeks to steady state", "Standard deployment"],
            ["Enterprise value impact", "$18-32M at 12x EBITDA", "PitchBook dental multiples"],
        ], ss))
    story.append(sp(6))
    story.append(h2("Next Steps", ss))
    story.append(make_table(
        ["Step", "Description", "Timeline"],
        [
            ["1. Discovery Call", "30-minute assessment of dental group AR profile, DSO structure, and collection challenges", "Schedule at convenience"],
            ["2. AR Analysis", "Review of aging report, payer mix, location-level variance, and treatment completion data", "1-2 weeks after data receipt"],
            ["3. Custom Proposal", "Financial model, pilot design, and implementation plan specific to your dental group", "1 week after analysis"],
            ["4. Pilot Launch", "90-day controlled pilot on selected account segment with weekly reporting", "2 weeks post-contract"],
            ["5. Scale Decision", "Data-driven deployment decision with full ROI validation", "Week 13 of pilot"],
        ], ss))
    story.append(sp(6))
    story.append(callout("Schedule a Discovery Call",
        "Contact VitaCoreX LLC at (888) 794-8292 or info@vitacorexllc.com. We specialize in dental "
        "group and DSO revenue cycle optimization with deep expertise in multi-location pre-collection "
        "infrastructure deployment.", ss))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"    -> {path}")


# ══════════════════════════════════════════════════════════════════════
# PDF 4: Pre-Collection Executive Review -- B2B Focus (12+ pages)
# ══════════════════════════════════════════════════════════════════════

def build_precollection_review():
    print("  [4/4] Building precollection-executive-review.pdf ...")
    ss = build_styles()
    path = os.path.join(DIR, "precollection-executive-review.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
        topMargin=0.7*inch, bottomMargin=0.7*inch, leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Pre-Collection Recovery System:<br/>B2B Commercial AR",
        "Structured recovery for commercial receivables,<br/>fleet/fuel card portfolios, and B2B credit operations",
        "Executive Review  |  B2B Commercial  |  2026", ss)

    # TOC
    story += toc_page([
        ("Executive Snapshot", "3"),
        ("B2B Commercial AR Landscape", "4"),
        ("Hidden Leakage in B2B Receivables", "6"),
        ("Pre-Collection Operating Framework", "7"),
        ("Litigation-Ready Documentation", "9"),
        ("LLC Dissolution Enforcement Scenario", "10"),
        ("Financial Impact Model", "11"),
        ("Regulatory Framework", "12"),
        ("Commercial Credit Assessment Framework", "13"),
        ("Engagement Path", "14"),
    ], ss)

    # ── Executive Snapshot ──
    story.append(h1("Executive Snapshot", ss))
    story.append(body(
        "B2B commercial accounts receivable represents one of the largest and least-optimized asset "
        "classes in American business. Over $180 billion in commercial receivables are past due at "
        "any given time, with a substantial portion ultimately written off without structured recovery "
        "intervention. Unlike consumer (B2C) collections, commercial AR recovery involves different "
        "legal frameworks (UCC Article 9, personal guaranty enforcement, LLC dissolution mechanics) "
        "and different economic dynamics (higher average balance, fewer accounts, greater documentation "
        "requirements per account).", ss))
    story.append(sp(4))
    story.append(make_metric_table([
        ("$180B+", "U.S. commercial AR\npast due at any time"),
        ("2.5-4%", "Average commercial\nbad debt rate"),
        ("25-40%", "Revenue lost when\naccounts reach agency"),
        ("5-7x", "ROI on structured\npre-collection"),
    ], ss))
    story.append(src(
        "Sources: NACM Credit Managers Index 2024; ACA International Commercial Collection Survey 2024; "
        "Federal Reserve Senior Loan Officer Survey 2024; Dun & Bradstreet Credit Risk Report 2024.", ss))
    story.append(sp(4))
    # Executive one-pager chart
    story.append(DrawingFlowable(make_bar_chart([
        ("Current\nTerms", 92), ("31-60\nPast Due", 75), ("61-90\nPast Due", 52),
        ("91-120\nPast Due", 35), ("120+\nPast Due", 18),
    ], "B2B Commercial AR Recovery Probability by Aging (%)", width=460, height=165)))
    story.append(src("Source: NACM National Summary of Domestic Trade Receivables 2024; D&B Payment Analysis 2024.", ss))
    story.append(sp(4))
    story.append(callout("Key Differentiator",
        "B2B pre-collection operates under fundamentally different legal and economic rules than B2C. "
        "Personal guaranty enforcement, UCC Article 9 security interests, and LLC dissolution mechanics "
        "provide leverage that does not exist in consumer collections. Structured documentation during "
        "the pre-collection phase is the foundation for downstream enforcement.", ss))
    story.append(PageBreak())

    # ── B2B Commercial AR Landscape (2 pages) ──
    story.append(h1("Section 1: B2B Commercial AR Landscape", ss))
    story.append(h2("Fleet/Fuel Card Industry Structure", ss))
    story.append(body(
        "The U.S. fleet/fuel card industry processes over $200 billion in annual transactions across "
        "approximately 8 million active commercial accounts. Major players include WEX, Comdata (Corpay), "
        "FleetCor (Corpay), and Fuelman, with regional and independent card programs comprising an "
        "additional 15-20% of the market. Fleet card AR is characterized by high transaction volume, "
        "relatively predictable payment patterns, and identifiable deterioration signals when accounts "
        "begin to experience financial distress.", ss))
    story.append(body(
        "Fleet card portfolios typically experience 1.5-3% annual charge-off rates, with the majority "
        "of losses concentrated in small to mid-size fleet accounts (5-50 vehicles). Larger accounts "
        "have lower default rates but higher absolute loss values. The fleet card industry's credit "
        "management practices vary significantly between major national programs and regional/independent "
        "card programs, creating optimization opportunities in the pre-collection space.", ss))
    story.append(sp(4))
    story.append(h2("Commercial Credit Terms and Default Patterns", ss))
    story.append(make_table(
        ["Industry Segment", "Typical Credit Terms", "Average Balance", "Default Rate", "Primary Default Driver"],
        [
            ["Fleet/fuel cards", "Net 15-30", "$5,000-50,000", "1.5-3%", "Cash flow disruption, fuel price spikes"],
            ["Equipment leasing", "Monthly/quarterly", "$25,000-500,000", "2-4%", "Revenue decline, equipment obsolescence"],
            ["Trade credit (wholesale)", "Net 30-60", "$10,000-100,000", "2-3%", "Customer insolvency, dispute escalation"],
            ["Professional services", "Net 30-45", "$5,000-250,000", "3-5%", "Scope disputes, budget cuts"],
            ["Construction/contractors", "Net 30-90", "$20,000-500,000", "4-7%", "Project delays, lien disputes"],
            ["SaaS/technology", "Monthly/annual", "$2,000-100,000", "2-4%", "Budget reallocation, contract disputes"],
        ], ss))
    story.append(src("Sources: NACM Credit Managers Survey 2024; Dun & Bradstreet Industry Payment Analysis 2024.", ss))
    story.append(sp(4))
    story.append(h2("B2B vs. B2C Recovery Dynamics", ss))
    story.append(make_table(
        ["Dimension", "B2B Commercial", "B2C Consumer", "Practical Implication"],
        [
            ["Average account balance", "$5,000-500,000", "$200-5,000", "B2B justifies higher per-account investment"],
            ["Number of accounts", "Fewer, concentrated", "Many, distributed", "B2B allows case-by-case strategy"],
            ["Legal framework", "UCC Art 9, state commercial law, guaranty enforcement", "FDCPA, CFPB Reg F, state consumer protection", "Different tools and compliance requirements"],
            ["Personal guaranty availability", "Common (60-80% of commercial credit)", "Rare", "B2B has guarantor leverage for LLC defaults"],
            ["Documentation requirements", "High (contracts, guaranties, UCC filings)", "Moderate (account agreements, statements)", "B2B pre-collection must build legal file"],
            ["Relationship dynamics", "Ongoing commercial relationship", "Transactional", "B2B recovery must preserve business relationship when possible"],
            ["Recovery rate (agency)", "15-22% net", "10-14% net", "B2B has slightly higher agency yields but same structural waste"],
            ["Statute of limitations", "Typically 4-6 years (written contract)", "Varies 3-6 years", "Longer window for B2B enforcement"],
        ], ss))
    story.append(src("Sources: NACM 2024; ACA International Commercial vs. Consumer Survey 2024.", ss))
    story.append(PageBreak())

    # ── Hidden Leakage ──
    story.append(h1("Section 2: Hidden Leakage in B2B Receivables", ss))
    story.append(body(
        "Commercial AR leakage occurs through mechanisms that are distinct from consumer AR. While "
        "consumer leakage is primarily driven by affordability and communication gaps, commercial "
        "leakage is driven by documentation deficiencies, guaranty gaps, and suboptimal escalation "
        "timing. The following analysis identifies the primary leakage drivers and their cost impact.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Leakage Driver", "Description", "Frequency", "Average Cost per Account", "Mitigation"],
        [
            ["Missing personal guaranty", "LLC/corp debtor defaults without enforceable personal guaranty on file", "25-35% of accounts", "$15,000-50,000", "Guaranty at origination; annual re-certification"],
            ["Incomplete UCC filing", "Security interest not properly perfected; priority lost to other creditors", "15-20% of accounts", "$10,000-100,000", "UCC-1 filing at origination; continuation filing tracking"],
            ["Stale contact information", "Debtor entity changes address, principals, or registered agent without notice", "30-40% of accounts", "$5,000-20,000 (delay cost)", "Quarterly data verification; Secretary of State monitoring"],
            ["Premature write-off", "Account written off before exhausting pre-collection remedies", "20-30% of aged accounts", "30-60% of balance (opportunity cost)", "Structured pre-collection before write-off decision"],
            ["Dispute escalation failure", "Legitimate disputes not resolved, causing entire balance to age", "10-15% of accounts", "Full balance at risk", "Dispute resolution protocol with defined timelines"],
            ["LLC dissolution without notice", "Debtor entity dissolves (voluntarily or administratively) during collection", "5-10% of aged accounts", "Full balance at risk", "Secretary of State monitoring; early guarantor activation"],
        ], ss))
    story.append(src("Sources: NACM Credit Risk Management Guide 2024; ACA International Commercial Collection 2024.", ss))
    story.append(sp(4))
    story.append(h2("Cost of Inaction: B2B Write-Off Analysis", ss))
    story.append(body(
        "For a commercial credit operation with $50M in annual receivables and a 3% bad debt rate, "
        "the annual write-off is $1.5M. If structured pre-collection recovers 40-55% of accounts "
        "that would otherwise be written off, the annual recovery is $600K-$825K. At a 5-7x ROI "
        "on pre-collection investment, the economic case is compelling for any commercial portfolio "
        "with meaningful aging beyond 60 days.", ss))
    story.append(DrawingFlowable(make_waterfall_chart([
        ("Bad Debt\nPortfolio", 1500, "total"),
        ("Pre-Collect\nRecovery", 675, "add"),
        ("Improved\nAgency Yield", 120, "add"),
        ("Program\nCost", 175, "sub"),
        ("Net Annual\nBenefit", 2120, "total"),
    ], "B2B Pre-Collection Impact: $50M Portfolio ($K Annual)", width=460, height=190)))
    story.append(src("Illustrative: $50M receivables, 3% bad debt rate. NACM/ACA International benchmarks.", ss))
    story.append(sp(4))
    story.append(body(
        "The waterfall demonstrates that pre-collection generates value through two mechanisms: direct "
        "recovery from structured outreach ($675K) and improved agency yield on remaining placements "
        "($120K) due to better documentation and account segmentation. After program costs ($175K), "
        "the net annual benefit exceeds $620K -- a 3.5x return on investment. For larger portfolios "
        "($100M+), these economics scale proportionally, making pre-collection one of the highest-ROI "
        "investments available to B2B credit operations.", ss))
    story.append(PageBreak())

    # ── Pre-Collection Operating Framework (2 pages) ──
    story.append(h1("Section 3: Pre-Collection Operating Framework", ss))
    story.append(body(
        "The B2B pre-collection framework operates in four stages, each with specific objectives, "
        "actions, documentation outputs, and escalation criteria. The framework is designed to "
        "maximize recovery while preserving commercial relationships where possible and building "
        "litigation-ready documentation packages for accounts requiring legal escalation.", ss))
    story.append(sp(4))

    story.append(h2("Stage 1: Segmentation and Assessment (Days 0-10)", ss))
    story.append(body(
        "Upon account referral, each account undergoes comprehensive assessment including balance "
        "validation, guaranty review, UCC filing verification, entity status check (Secretary of "
        "State), principal identification, and credit score review. Accounts are segmented into "
        "recovery tiers based on balance size, documentation completeness, entity status, and "
        "guarantor viability.", ss))
    story.append(make_table(
        ["Segment", "Balance Range", "Documentation Score", "Recovery Priority", "Approach"],
        [
            ["A: High-value, well-documented", "$50K+", "Complete (guaranty + UCC)", "Critical", "Senior account manager, direct outreach"],
            ["B: Mid-value, documentation gaps", "$15K-50K", "Partial (missing guaranty or UCC)", "High", "Targeted outreach + documentation cure"],
            ["C: Standard commercial", "$5K-15K", "Variable", "Standard", "Structured outreach sequence"],
            ["D: Small balance / high volume", "<$5K", "Variable", "Automated", "Digital outreach + payment portal"],
        ], ss))
    story.append(sp(4))

    story.append(h2("Stage 2: Structured Offer and Conversion (Days 10-30)", ss))
    story.append(body(
        "Accounts receive structured payment offers calibrated to their segment, balance, and financial "
        "condition. Offers include full payment incentives (5-10% discount for payment within 10 days), "
        "structured payment plans (3-12 months with mandatory autopay), and settlement offers for "
        "accounts with documented hardship. All offers are documented with formal terms and acceptance "
        "records.", ss))
    story.append(make_table(
        ["Offer Type", "Criteria", "Typical Terms", "Acceptance Rate", "Documentation"],
        [
            ["Full payment discount", "All segments, first offer", "5-10% discount if paid within 10 days", "15-25%", "Offer letter, payment confirmation"],
            ["Structured plan (short)", "Segments A-C", "3-6 months, mandatory autopay, 0% interest", "20-30%", "Signed plan, autopay authorization"],
            ["Structured plan (extended)", "Segments A-B, high balance", "6-12 months, mandatory autopay", "10-15%", "Signed plan, autopay auth, guaranty confirmation"],
            ["Settlement offer", "Documented hardship", "40-70% of balance, lump sum or 3-payment", "8-12%", "Settlement agreement, release terms"],
        ], ss))
    story.append(sp(4))

    story.append(h2("Stage 3: Guarantor Activation (Days 30-60)", ss))
    story.append(body(
        "For accounts where the entity debtor has not responded to initial outreach or where payment "
        "plans have defaulted, the personal guarantor (if available) is formally activated through "
        "a demand letter citing the guaranty agreement, the defaulted balance, and the cure period. "
        "Guarantor activation is one of the most effective tools in B2B pre-collection, as it shifts "
        "the obligation from the business entity to the individual principal.", ss))
    story.append(b("Guarantor demand letter with copy of signed guaranty agreement and default calculation", ss))
    story.append(b("14-day cure period before escalation to documentation-for-counsel stage", ss))
    story.append(b("Guarantor financial assessment where possible (public records, real property search)", ss))
    story.append(b("Parallel entity-level outreach continues during guarantor activation period", ss))
    story.append(b("Guarantor activation converts 20-35% of previously unresponsive accounts (NACM 2024)", ss))
    story.append(sp(4))

    story.append(h2("Stage 4: Mandatory Auto-Debit and Documentation Assembly (Days 60-90)", ss))
    story.append(body(
        "Accounts that have been converted to payment plans are monitored for compliance. Plans with "
        "mandatory auto-debit authorization experience 70-80% completion rates vs. 35-45% for voluntary "
        "payment plans. Accounts that reach day 90 without resolution are prepared for agency or legal "
        "handoff with complete documentation packages including all communication records, offers, "
        "responses, guaranty documents, UCC filings, and entity status reports.", ss))
    story.append(make_table(
        ["Documentation Package Component", "Status Check", "Legal Purpose"],
        [
            ["Original credit agreement", "Verified and attached", "Foundation for breach claim"],
            ["Personal guaranty (if applicable)", "Verified, current address confirmed", "Guarantor enforcement"],
            ["UCC-1 filing (if applicable)", "Filed, current, continuation tracked", "Security interest priority"],
            ["Communication log", "Complete, timestamped, all channels", "Proof of notice and opportunity to cure"],
            ["Payment history", "Full transaction history with defaults identified", "Damages calculation"],
            ["Entity status report (Secretary of State)", "Current within 30 days", "Entity existence, dissolution status, registered agent"],
            ["Offer/settlement history", "All offers documented with responses", "Good faith negotiation evidence"],
            ["Guarantor demand and response", "Demand sent, response documented", "Guarantor liability establishment"],
        ], ss))
    story.append(PageBreak())

    # ── Litigation-Ready Documentation ──
    story.append(h1("Section 4: Litigation-Ready Documentation", ss))
    story.append(body(
        "The pre-collection documentation package is designed to be immediately usable by counsel "
        "for demand letter, lawsuit, or judgment enforcement without additional discovery or "
        "reconstruction. Each document has a specific legal purpose and is assembled during the "
        "pre-collection workflow rather than after account escalation.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Document", "Purpose", "Legal Foundation", "Assembly Timing"],
        [
            ["Credit application with signed terms", "Establishes contractual relationship and agreed terms", "Contract law; offer and acceptance", "Stage 1 (verification)"],
            ["Personal guaranty agreement", "Creates individual liability for entity debts", "Guaranty law; consideration established by credit extension", "Stage 1 (verification)"],
            ["UCC-1 financing statement", "Perfects security interest in collateral", "UCC Article 9; priority among creditors", "Stage 1 (verification/filing)"],
            ["Demand letter with delivery confirmation", "Satisfies notice requirements; starts cure period", "FDCPA (if applicable); state notice requirements", "Stage 2 (initial outreach)"],
            ["Payment plan agreement with default terms", "Establishes modified payment obligation with clear default triggers", "Contract modification; new consideration", "Stage 2 (offer conversion)"],
            ["ACH/auto-debit authorization", "Enables automated payment collection", "NACHA Operating Rules; E-SIGN Act", "Stage 2 (enrollment)"],
            ["Default and cure notice", "Documents breach and opportunity to cure before acceleration", "Good faith requirement; acceleration clause enforcement", "Stage 3 (guarantor activation)"],
            ["Communication audit trail", "Proves compliance with all notice and communication requirements", "FDCPA defense; state law compliance; good faith evidence", "Throughout (continuous)"],
            ["Entity status report", "Verifies current entity existence, dissolution status, registered agent", "Standing to sue; service of process; dissolution enforcement", "Stage 1 and Stage 4 (update)"],
        ], ss))
    story.append(src("Sources: UCC Article 9; FDCPA; Florida Statutes; NACHA Operating Rules; E-SIGN Act (15 USC 7001).", ss))
    story.append(PageBreak())

    # ── LLC Dissolution Scenario ──
    story.append(h1("Section 5: LLC Dissolution Enforcement Scenario", ss))
    story.append(body(
        "LLC dissolution presents unique challenges and opportunities in B2B recovery. When a debtor "
        "LLC dissolves (voluntarily or through administrative dissolution by the state), creditors "
        "have specific rights and remedies under state law. Florida Revised Limited Liability Company "
        "Act (F.S. Chapter 605) provides a structured framework for creditor claims against dissolved "
        "LLCs and their members/managers.", ss))
    story.append(sp(4))
    story.append(h2("Florida LLC Dissolution: Creditor Rights Timeline", ss))
    story.append(make_table(
        ["Phase", "Timing", "LLC Obligation", "Creditor Right", "Legal Basis"],
        [
            ["Pre-dissolution notice", "Before dissolution", "Notify known creditors in writing", "File claim within stated period (min 120 days)", "F.S. 605.0702(1)"],
            ["Claims filing period", "120+ days post-notice", "Process filed claims; accept or reject", "Submit claim with supporting documentation", "F.S. 605.0702(2)"],
            ["Rejection response", "90 days after rejection", "Provide written rejection with reasons", "Commence legal action within 90 days of rejection", "F.S. 605.0702(3)"],
            ["Unknown creditor publication", "After dissolution filing", "Publish notice in newspaper of general circulation", "File claim within 4 years of publication", "F.S. 605.0703"],
            ["Asset distribution", "During winding up", "Pay claims before distributing to members", "Priority over member distributions", "F.S. 605.0710"],
            ["Post-dissolution enforcement", "Up to 4 years", "Former members liable for distributions received", "Sue former members for received distributions", "F.S. 605.0704"],
        ], ss))
    story.append(src("Source: Florida Revised LLC Act, F.S. Chapter 605; Florida Bar CLE materials 2024.", ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_line_chart(
        [95, 80, 65, 45, 30, 15, 8],
        "LLC Dissolution Recovery Probability Over Time (%)",
        ["Dis. Notice", "60 Days", "120 Days", "1 Year", "2 Years", "3 Years", "4 Years"],
        width=460, height=170)))
    story.append(src("Illustrative based on Florida dissolution timeline and creditor claim processing data.", ss))
    story.append(sp(4))
    story.append(h2("Personal Guaranty Enforcement in Dissolution", ss))
    story.append(body(
        "When an LLC dissolves, the personal guaranty becomes the primary enforcement mechanism. The "
        "guaranty survives entity dissolution and can be enforced against the individual guarantor's "
        "personal assets. Key requirements for enforcement include: (1) valid and enforceable guaranty "
        "agreement, (2) proper default notice to guarantor, (3) opportunity to cure, and (4) "
        "documentation of the underlying obligation and default. Pre-collection documentation that "
        "includes these elements reduces downstream legal costs and accelerates recovery.", ss))
    story.append(PageBreak())

    # ── Financial Impact Model ──
    story.append(h1("Section 6: Financial Impact Model", ss))
    story.append(h2("Agency vs. Pre-Collection Comparison", ss))
    story.append(body(
        "The following model compares outcomes for a commercial credit operation with $20M in annual "
        "receivables and a 3.5% bad debt rate ($700K annual write-off exposure). The model assumes "
        "conservative pre-collection conversion rates based on NACM and ACA International benchmarks.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Metric", "Agency Only", "Pre-Collection + Agency", "Delta"],
        [
            ["Total past-due portfolio addressed", "$700K", "$700K", "--"],
            ["Accounts receiving structured intervention", "0% (direct to agency)", "100%", "+100%"],
            ["Pre-collection conversion rate", "N/A", "40-50%", "--"],
            ["Pre-collection recovery (net)", "$0", "$252K-315K", "+$252K-315K"],
            ["Remaining accounts to agency", "$700K", "$385K-420K", "-40-50%"],
            ["Agency gross recovery", "$112K (16%)", "$62K-67K", "-$45K-50K"],
            ["Agency contingency fee (30%)", "-$34K", "-$19K-20K", "+$14K-15K"],
            ["Agency net recovery", "$78K", "$43K-47K", "-$31K-35K"],
            ["TOTAL net cash recovery", "$78K", "$295K-362K", "+$217K-284K (+278-364%)"],
        ], ss))
    story.append(sp(4))
    story.append(DrawingFlowable(make_dual_bar_chart([
        ("Gross\nRecovery", 112, 314), ("Agency\nFees", 34, 20), ("Net\nYield", 78, 295),
    ], "Agency Only vs. Pre-Collection: Annual Recovery Comparison ($K)",
       ["Agency Only", "Pre-Collection"], width=460, height=180)))
    story.append(src("Illustrative: $20M receivables, 3.5% bad debt. NACM/ACA International 2024 benchmarks.", ss))
    story.append(sp(4))
    story.append(h2("ROI Analysis", ss))
    story.append(make_table(
        ["Investment Component", "Annual Cost", "Return", "ROI"],
        [
            ["VitaCoreX engagement fee", "$45,000-65,000", "--", "--"],
            ["Internal staff allocation (incremental)", "$15,000-25,000", "--", "--"],
            ["Technology/integration", "$5,000-10,000", "--", "--"],
            ["Total annual investment", "$65,000-100,000", "--", "--"],
            ["Net incremental recovery", "--", "$217K-284K", "--"],
            ["NET ROI", "--", "$117K-219K", "2.2-4.4x"],
        ], ss))
    story.append(sp(4))
    story.append(body(
        "The ROI range of 2.2-4.4x reflects conservative assumptions. The lower bound assumes 25% "
        "pre-collection conversion and minimal agency yield improvement; the upper bound assumes 40% "
        "conversion with full documentation benefits flowing through to agency performance. Most "
        "commercial operations achieve mid-range results (3.0-3.5x) within the first 12 months, with "
        "continued improvement as workflow refinements compound. The payback period is typically 4-6 "
        "months, with break-even achieved in the first quarter for portfolios exceeding $10M.", ss))
    story.append(sp(4))
    story.append(body(
        "Key variables driving ROI variance include: (1) portfolio composition -- higher-balance "
        "accounts and accounts with personal guaranties yield better conversion rates; (2) debtor "
        "industry -- construction and professional services show higher voluntary payment rates than "
        "wholesale distribution; (3) documentation quality at referral -- accounts referred with "
        "complete contract files and communication logs convert 25-30% faster than undocumented "
        "accounts; (4) internal staff engagement -- organizations that integrate pre-collection "
        "workflows into existing credit management processes see 15-20% higher conversion rates.", ss))
    story.append(PageBreak())

    # ── Regulatory Framework (2 pages) ──
    story.append(h1("Section 7: Regulatory Framework", ss))
    story.append(h2("Florida-Specific Commercial Recovery Law", ss))
    story.append(body(
        "Florida provides a comprehensive legal framework for commercial debt recovery that includes "
        "both statutory remedies and common law enforcement mechanisms. Understanding these tools "
        "is essential for designing compliant and effective pre-collection workflows.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Statute", "Title / Subject", "Key Provisions", "Application to Pre-Collection"],
        [
            ["F.S. 559", "Florida Consumer Collection Practices Act", "Prohibits specific collection abuses; registration requirements; additional protections beyond federal FDCPA", "Applies when collecting consumer debts; commercial debts may be exempt but best practice to comply"],
            ["F.S. 605.0702", "LLC Dissolution -- Known Creditor Claims", "LLC must notify known creditors; 120-day minimum claim period; rejection triggers 90-day litigation window", "Critical for dissolved entity recovery; drives documentation timing"],
            ["F.S. 95.11", "Statute of Limitations", "Written contracts: 5 years; oral contracts: 4 years; foreign judgments: 20 years", "Defines enforcement window; pre-collection must start well before expiration"],
            ["F.S. 55.10", "Judgment Liens on Real Property", "Recorded judgment creates lien on debtor's real property in county of recording; 10-year duration", "Post-judgment enforcement tool; pre-collection documentation enables faster judgment"],
            ["F.S. 48.193", "Long-Arm Statute", "Florida courts can exercise jurisdiction over non-residents who conduct business in Florida", "Enables Florida jurisdiction for out-of-state debtors with Florida business connections"],
        ], ss))
    story.append(src("Source: Florida Statutes; Florida Bar Continuing Legal Education materials 2024.", ss))
    story.append(sp(4))
    story.append(h2("Federal Commercial Recovery Framework", ss))
    story.append(make_table(
        ["Law/Regulation", "Key Provisions", "Pre-Collection Application"],
        [
            ["FDCPA (15 USC 1692)", "Governs third-party debt collection; prohibits harassment, false statements, unfair practices. Note: first-party creditors generally exempt for commercial debts", "Compliance framework even when technically exempt; best practice protects against disputes"],
            ["UCC Article 9", "Governs security interests in personal property; filing, perfection, priority, and enforcement of security interests", "UCC-1 filing verification and continuation tracking; priority analysis for secured claims"],
            ["NACHA Operating Rules", "Governs ACH payment processing; authorization requirements, return codes, dispute resolution", "Auto-debit authorization compliance; return handling procedures"],
            ["E-SIGN Act (15 USC 7001)", "Electronic signatures and records have same legal effect as written signatures", "Digital agreement execution; electronic audit trails; e-signed guaranties"],
            ["Fair Credit Reporting Act", "Governs credit reporting; accuracy requirements; dispute procedures; permissible purposes", "Commercial credit reporting; tradeline accuracy; dispute response obligations"],
            ["Telephone Consumer Protection Act", "Restrictions on autodialed calls, prerecorded messages, and texts; prior express consent required", "Outreach compliance; consent documentation; opt-out mechanisms"],
        ], ss))
    story.append(src("Sources: Federal statutes as cited; CFPB Compliance Guides; NACM Legal Reference 2024.", ss))
    story.append(PageBreak())

    # ── Commercial Credit Assessment ──
    story.append(h1("Section 8: Commercial Credit Assessment Framework", ss))
    story.append(body(
        "Effective pre-collection begins with accurate assessment of the debtor's ability and willingness "
        "to pay. The commercial credit assessment framework evaluates both entity-level and individual "
        "guarantor-level factors to determine the optimal recovery strategy for each account.", ss))
    story.append(sp(4))
    story.append(h2("Entity Risk Scoring Model", ss))
    story.append(make_table(
        ["Factor", "Weight", "Low Risk (Score: 1-3)", "Medium Risk (Score: 4-6)", "High Risk (Score: 7-10)"],
        [
            ["Entity status", "20%", "Active, good standing", "Administrative issues, warnings", "Dissolved, revoked, or suspended"],
            ["Payment history (prior 12 months)", "25%", "Current or <30 days late", "30-60 days late pattern", "60+ days late pattern"],
            ["Years in business", "10%", "5+ years", "2-5 years", "<2 years"],
            ["Balance relative to credit limit", "15%", "<50% of limit", "50-80% of limit", ">80% of limit or over limit"],
            ["Industry risk", "10%", "Stable industry, low default", "Cyclical industry", "Distressed industry"],
            ["Guaranty status", "20%", "Current, enforceable guaranty", "Guaranty on file, untested", "No guaranty or expired"],
        ], ss))
    story.append(sp(4))
    story.append(h2("Guarantor Evaluation Criteria", ss))
    story.append(make_table(
        ["Factor", "Assessment Method", "Favorable Indicator", "Unfavorable Indicator"],
        [
            ["Real property ownership", "County recorder search", "Multiple properties, no tax liens", "No property, or significant liens"],
            ["Personal credit profile", "Consumer credit report (with permissible purpose)", "700+ score, stable history", "Below 600, recent delinquencies"],
            ["Other business interests", "Secretary of State search", "Active businesses, good standing", "Multiple dissolved entities, serial defaults"],
            ["Geographic stability", "Address history", "Stable residence 3+ years", "Frequent moves, out-of-state"],
            ["Litigation history", "Court records search", "No adverse judgments", "Multiple judgments, bankruptcy history"],
            ["Asset visibility", "Public records", "Identifiable real/personal property", "No visible assets, nominee ownership"],
        ], ss))
    story.append(src("Sources: NACM Credit Investigation Manual 2024; Dun & Bradstreet Credit Assessment Guidelines.", ss))
    story.append(sp(4))
    story.append(h2("Recovery Strategy by Risk Score", ss))
    story.append(make_table(
        ["Risk Score", "Entity Assessment", "Recommended Strategy", "Expected Conversion", "Escalation Path"],
        [
            ["1-3 (Low)", "Viable entity, good history", "Standard outreach, payment plan offer", "60-80%", "Rarely needed; standard agency if required"],
            ["4-6 (Medium)", "Some risk indicators present", "Accelerated outreach, guarantor notification, settlement offer", "35-55%", "Guarantor activation at day 30; agency at day 90"],
            ["7-8 (High)", "Significant risk, limited viability", "Immediate guarantor activation, settlement priority, documentation assembly", "20-35%", "Legal review at day 60; potential litigation"],
            ["9-10 (Critical)", "Dissolved/dissolving, non-responsive", "Guarantor demand, creditor claim filing, legal preparation", "10-20%", "Immediate counsel referral with complete file"],
        ], ss))
    story.append(PageBreak())

    # ── Engagement Path ──
    story.append(h1("Section 9: Engagement Path", ss))
    story.append(body(
        "VitaCoreX LLC provides structured pre-collection recovery infrastructure for B2B commercial "
        "credit operations. The engagement is designed to integrate with existing credit management "
        "workflows while providing specialized recovery expertise and documentation discipline for "
        "aged commercial receivables.", ss))
    story.append(sp(4))
    story.append(make_table(
        ["Step", "Description", "Timeline", "Deliverable"],
        [
            ["1. Portfolio Assessment", "Review of AR aging, credit terms, guaranty coverage, UCC filing status, write-off patterns", "Week 1-2", "Portfolio opportunity report with prioritized recovery targets"],
            ["2. Custom Recovery Design", "Strategy development including segmentation model, outreach sequences, documentation requirements", "Week 2-3", "Recovery playbook and financial model with scenario analysis"],
            ["3. Pilot Launch", "90-day controlled pilot on defined account segment ($500K-2M in aged AR)", "Week 4-16", "Weekly performance reports, conversion tracking, ROI measurement"],
            ["4. Optimization and Scaling", "Performance analysis, workflow refinement, expanded deployment", "Week 16-20", "Scaling plan with validated conversion rates and cost model"],
            ["5. Steady State Operations", "Ongoing recovery management with monthly reporting and quarterly reviews", "Ongoing", "Monthly executive dashboard, quarterly business review"],
        ], ss))
    story.append(sp(6))
    story.append(h2("Engagement Differentiators for B2B", ss))
    story.append(b("Deep expertise in Florida commercial law including LLC dissolution, guaranty enforcement, and UCC Article 9", ss))
    story.append(b("Litigation-ready documentation assembly built into every account workflow", ss))
    story.append(b("Guarantor activation as a core recovery tool (not available in consumer collections)", ss))
    story.append(b("Entity monitoring including Secretary of State status tracking and registered agent changes", ss))
    story.append(b("Performance-aligned pricing with transparent cost structure", ss))
    story.append(b("Real-time portfolio dashboard with aging analysis, conversion tracking, and ROI reporting", ss))
    story.append(sp(6))
    story.append(callout("Schedule a Portfolio Assessment",
        "Contact VitaCoreX LLC at (888) 794-8292 or info@vitacorexllc.com to schedule a portfolio "
        "assessment. We will review your commercial AR aging, credit documentation, and recovery "
        "operations to identify specific opportunities for structured pre-collection improvement.", ss))
    story.append(sp(10))
    story.append(Paragraph(
        "Copyright 2026 VitaCoreX LLC. All rights reserved. Proprietary methodology. "
        "Intended for executive review and internal forwarding within the recipient organization.",
        ss["VCXDisclaimer"]))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"    -> {path}")


# ══════════════════════════════════════════════════════════════════════
# Main
# ══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 60)
    print("VitaCoreX LLC -- Executive PDF Generator")
    print("=" * 60)
    print(f"Output directory: {DIR}")
    print()

    build_healthcare_leakage()
    build_cfo_brief()
    build_dental_deck()
    build_precollection_review()

    print()
    print("=" * 60)
    print("All 4 PDFs generated successfully.")
    print("=" * 60)
