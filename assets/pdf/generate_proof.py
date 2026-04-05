#!/usr/bin/env python3
"""
VitaCoreX — Executive Proof Document Generator
Generates a premium multi-page institutional PDF in VitaCoreX teal color scheme.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Frame, PageTemplate, BaseDocTemplate, Image, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, Line, Circle, String
from reportlab.graphics import renderPDF

# ─── Colors ───────────────────────────────────────────────────
NAVY_DEEP  = HexColor('#0B2320')
NAVY_MID   = HexColor('#0F2F2C')
TEAL       = HexColor('#2D8A82')
TEAL_LIGHT = HexColor('#5BC4B8')
TEAL_PALE  = HexColor('#D0F0EA')
GOLD       = HexColor('#C8AF78')
GOLD_LIGHT = HexColor('#E8D9B0')
WHITE      = HexColor('#FFFFFF')
OFF_WHITE  = HexColor('#F0FAF8')
GRAY_TEXT  = HexColor('#3A6B65')
DARK_TEXT  = HexColor('#0D1E34')

W, H = letter  # 612 x 792

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(SCRIPT_DIR, '..', 'img', 'logo.png')
OUT_DIR = SCRIPT_DIR
OUT_PATH = os.path.join(OUT_DIR, 'VitaCoreX_Institutional_Proof.pdf')


def draw_cover(c):
    """Page 1 — Full-bleed dark cover with logo, title, and accent lines."""
    # Full background
    c.setFillColor(NAVY_DEEP)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Subtle gradient overlay band at top
    for i in range(120):
        alpha = 0.06 * (1 - i / 120)
        c.setFillColor(Color(0.18, 0.77, 0.72, alpha))
        c.rect(0, H - i * 2, W, 2, fill=1, stroke=0)

    # Bottom accent band
    c.setFillColor(TEAL)
    c.rect(0, 0, W, 6, fill=1, stroke=0)

    # Gold thin line
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(60, H - 260, W - 60, H - 260)
    c.line(60, 180, W - 60, 180)

    # Logo
    if os.path.exists(LOGO_PATH):
        c.drawImage(LOGO_PATH, W / 2 - 55, H - 220, width=110, height=110,
                     preserveAspectRatio=True, mask='auto')

    # Title block
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 32)
    c.drawCentredString(W / 2, H - 340, 'Revenue Recovery Design')
    c.setFont('Helvetica-Bold', 32)
    c.drawCentredString(W / 2, H - 380, '& Corporate Legal File Control')

    # Subtitle
    c.setFillColor(TEAL_LIGHT)
    c.setFont('Helvetica', 13)
    c.drawCentredString(W / 2, H - 420,
        'Institutional Advisory  \u2022  Documentation Control  \u2022  Counsel-Ready Infrastructure')

    # Divider dot pattern
    c.setFillColor(GOLD)
    for i in range(5):
        c.circle(W / 2 - 24 + i * 12, H - 450, 1.5, fill=1, stroke=0)

    # Body copy
    c.setFillColor(Color(0.82, 0.94, 0.92, 0.85))
    c.setFont('Helvetica', 10.5)
    lines = [
        'VitaCoreX designs recovery systems, file-control standards, and counsel-ready',
        'operating discipline for organizations that want faster cash conversion,',
        'lower leakage, and cleaner escalation.',
    ]
    y = H - 490
    for line in lines:
        c.drawCentredString(W / 2, y, line)
        y -= 16

    # Bottom badge
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 9)
    c.drawCentredString(W / 2, 210, 'INSTITUTIONAL PROOF DOCUMENT')

    c.setFillColor(Color(0.82, 0.94, 0.92, 0.6))
    c.setFont('Helvetica', 8.5)
    c.drawCentredString(W / 2, 130, 'VitaCoreX LLC  \u2022  Tampa, FL  \u2022  EIN 41-4399148')
    c.drawCentredString(W / 2, 116, '(888) 794-8292  \u2022  vitacorexllc.com')
    c.drawCentredString(W / 2, 96, '\u00A9 2026 VitaCoreX LLC. All rights reserved.')


def draw_page_bg(c, page_num):
    """Standard page background — white with teal header strip and footer."""
    # White background
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Top header bar
    c.setFillColor(NAVY_DEEP)
    c.rect(0, H - 52, W, 52, fill=1, stroke=0)

    # Teal accent line under header
    c.setFillColor(TEAL)
    c.rect(0, H - 54, W, 2, fill=1, stroke=0)

    # Header text
    c.setFillColor(TEAL_LIGHT)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(40, H - 36, 'VITACOREX LLC')
    c.setFillColor(Color(0.82, 0.94, 0.92, 0.6))
    c.setFont('Helvetica', 7.5)
    c.drawRightString(W - 40, H - 36, 'Institutional Proof  \u2022  Confidential')

    # Footer
    c.setStrokeColor(HexColor('#E0E8E6'))
    c.setLineWidth(0.5)
    c.line(40, 50, W - 40, 50)

    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 7)
    c.drawString(40, 36, '\u00A9 2026 VitaCoreX LLC')
    c.drawRightString(W - 40, 36, f'Page {page_num}')


def draw_section_header(c, y, title, subtitle=None):
    """Dark teal section banner."""
    c.setFillColor(NAVY_MID)
    c.roundRect(40, y - 8, W - 80, 44 if not subtitle else 60, 6, fill=1, stroke=0)

    # Gold accent bar
    c.setFillColor(GOLD)
    c.rect(40, y + (36 if not subtitle else 52) - 8, W - 80, 2, fill=1, stroke=0)

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 15)
    if subtitle:
        c.drawString(60, y + 28, title)
        c.setFillColor(TEAL_LIGHT)
        c.setFont('Helvetica', 9)
        c.drawString(60, y + 10, subtitle)
    else:
        c.drawString(60, y + 10, title)

    return y - 16


def draw_metric_card(c, x, y, number, label, w=120, h=70):
    """Individual stat metric card."""
    # Card background
    c.setFillColor(OFF_WHITE)
    c.setStrokeColor(HexColor('#B8DDD8'))
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)

    # Number
    c.setFillColor(TEAL)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(x + w / 2, y + h - 30, number)

    # Label
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 7.5)
    c.drawCentredString(x + w / 2, y + 12, label)


def draw_service_block(c, x, y, num, title, desc, w=240):
    """Service offering block with number badge."""
    # Number badge
    c.setFillColor(TEAL)
    c.circle(x + 14, y + 14, 14, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 11)
    c.drawCentredString(x + 14, y + 9, str(num))

    # Title
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(x + 36, y + 10, title)

    # Description
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 8.5)
    words = desc.split()
    line = ''
    ly = y - 10
    for word in words:
        test = line + ' ' + word if line else word
        if c.stringWidth(test, 'Helvetica', 8.5) < w - 10:
            line = test
        else:
            c.drawString(x + 36, ly, line)
            ly -= 12
            line = word
    if line:
        c.drawString(x + 36, ly, line)


def draw_page2_executive_snapshot(c):
    """Page 2 — Executive Snapshot: metrics + core advisory."""
    draw_page_bg(c, 2)

    y = H - 90
    y = draw_section_header(c, y, 'EXECUTIVE SNAPSHOT',
                            'What sophisticated operators should understand immediately')

    y -= 30

    # Metrics row
    metrics = [
        ('150+', 'OPERATORS SERVED'),
        ('94%', 'CLIENT RETENTION'),
        ('$12M+', 'REVENUE RECOVERED'),
        ('<48h', 'AVG. RESPONSE'),
    ]
    card_w = 120
    gap = 14
    total = len(metrics) * card_w + (len(metrics) - 1) * gap
    start_x = (W - total) / 2

    for i, (num, label) in enumerate(metrics):
        draw_metric_card(c, start_x + i * (card_w + gap), y - 70, num, label, card_w, 72)

    y -= 110

    # Divider
    c.setStrokeColor(HexColor('#D0E8E4'))
    c.setLineWidth(0.5)
    c.line(60, y, W - 60, y)
    y -= 30

    # Advisory lines
    y = draw_section_header(c, y, 'CORE ADVISORY LINES',
                            'Frame the offer around economic control, file quality, and executive implementation')
    y -= 20

    services = [
        ('Revenue Recovery Design', 'Build internal recovery logic before outside spend compounds. Identify leak points, define escalation triggers, and create documentation standards.'),
        ('Corporate Legal File Control', 'Structure file infrastructure so counsel receives clean, decision-ready packets. Reduce back-and-forth, lower preparation cost, and protect timeline integrity.'),
        ('Structured Case Intake', 'Route inquiries correctly from first contact. Define what to send, establish expectations, and create clean handoff documentation.'),
        ('Documentation Discipline', 'Establish packet standards, audit readiness protocols, and maintain compliance-grade file organization across all operational units.'),
        ('Escalation Architecture', 'Define when and how matters move from internal handling to outside counsel. Prevent premature escalation and fee compression.'),
        ('Executive Reporting', 'Produce leadership-ready briefs that show recovery trajectory, documentation quality metrics, and cost-avoidance measurement.'),
    ]

    col1_x = 60
    col2_x = W / 2 + 10
    items_per_col = 3

    for i, (title, desc) in enumerate(services):
        col = i // items_per_col
        row = i % items_per_col
        x = col1_x if col == 0 else col2_x
        by = y - row * 90
        draw_service_block(c, x, by, i + 1, title, desc, w=240)


def draw_page3_methodology(c):
    """Page 3 — Methodology + Compliance."""
    draw_page_bg(c, 3)

    y = H - 90
    y = draw_section_header(c, y, 'METHODOLOGY',
                            'Diagnose, pilot, then scale only when the evidence justifies it')
    y -= 30

    # Three-phase diagram
    phases = [
        ('DIAGNOSE', 'Review workflow friction, document quality, escalation logic, and where recoverable value leaks first.', TEAL),
        ('PILOT', 'Define a contained workstream with clear expectations, response windows, and measurement logic.', HexColor('#1A6B62')),
        ('SCALE', 'Expand only when pilot metrics justify broader deployment. Maintain documentation discipline throughout.', NAVY_MID),
    ]

    phase_w = 160
    phase_h = 140
    phase_gap = 16
    total_w = 3 * phase_w + 2 * phase_gap
    sx = (W - total_w) / 2

    for i, (title, desc, color) in enumerate(phases):
        px = sx + i * (phase_w + phase_gap)
        py = y - phase_h

        # Card
        c.setFillColor(color)
        c.roundRect(px, py, phase_w, phase_h, 8, fill=1, stroke=0)

        # Phase number
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 36)
        c.drawString(px + 14, py + phase_h - 44, f'0{i + 1}')

        # Title
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 12)
        c.drawString(px + 14, py + phase_h - 64, title)

        # Desc
        c.setFillColor(Color(0.82, 0.94, 0.92, 0.8))
        c.setFont('Helvetica', 7.5)
        words = desc.split()
        line = ''
        ly = py + phase_h - 82
        for word in words:
            test = line + ' ' + word if line else word
            if c.stringWidth(test, 'Helvetica', 7.5) < phase_w - 28:
                line = test
            else:
                c.drawString(px + 14, ly, line)
                ly -= 11
                line = word
        if line:
            c.drawString(px + 14, ly, line)

        # Arrow between phases
        if i < 2:
            ax = px + phase_w + 2
            ay = py + phase_h / 2
            c.setStrokeColor(GOLD)
            c.setLineWidth(1.5)
            c.line(ax, ay, ax + phase_gap - 4, ay)
            # Arrowhead
            c.setFillColor(GOLD)
            c.drawString(ax + phase_gap - 10, ay - 4, '\u25B6')

    y -= (phase_h + 40)

    # Divider
    c.setStrokeColor(HexColor('#D0E8E4'))
    c.setLineWidth(0.5)
    c.line(60, y, W - 60, y)
    y -= 30

    # Compliance section
    y = draw_section_header(c, y, 'COMPLIANCE & POSITIONING',
                            'What VitaCoreX does and does not do')
    y -= 25

    does = [
        'Operational advisory for revenue recovery infrastructure',
        'Documentation control and counsel-ready file structuring',
        'Structured intake and escalation architecture design',
        'Executive reporting and KPI measurement systems',
    ]

    does_not = [
        'Legal representation or licensed practice of law',
        'Licensed collection agency activities',
        'Investment, tax, or financial planning advice',
        'Direct patient/client case management',
    ]

    # Two columns
    col_w = 240
    c.setFont('Helvetica-Bold', 10)

    # Does column
    cx = 60
    c.setFillColor(TEAL)
    c.drawString(cx, y, 'WHAT VITACOREX DOES')
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9)
    for i, item in enumerate(does):
        iy = y - 20 - i * 18
        c.setFillColor(TEAL)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(cx, iy, '\u2713')
        c.setFillColor(DARK_TEXT)
        c.setFont('Helvetica', 9)
        c.drawString(cx + 16, iy, item)

    # Does NOT column
    cx2 = W / 2 + 20
    c.setFillColor(HexColor('#B42318'))
    c.setFont('Helvetica-Bold', 10)
    c.drawString(cx2, y, 'WHAT VITACOREX DOES NOT DO')
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9)
    for i, item in enumerate(does_not):
        iy = y - 20 - i * 18
        c.setFillColor(HexColor('#B42318'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(cx2, iy, '\u2717')
        c.setFillColor(DARK_TEXT)
        c.setFont('Helvetica', 9)
        c.drawString(cx2 + 16, iy, item)

    y -= 120

    # Disclaimer
    c.setStrokeColor(HexColor('#D0E8E4'))
    c.setLineWidth(0.5)
    c.line(60, y, W - 60, y)
    y -= 18
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 7.5)
    c.drawString(60, y, 'VitaCoreX LLC provides administrative, documentation, workflow, and business-support services.')
    c.drawString(60, y - 12, 'It is not a law firm and does not provide legal representation. Legal strategy remains the responsibility of licensed counsel.')


def draw_page4_industries(c):
    """Page 4 — Industry Focus + CTA."""
    draw_page_bg(c, 4)

    y = H - 90
    y = draw_section_header(c, y, 'INDUSTRY VERTICALS',
                            'Targeted positioning for operators in high-friction recovery environments')
    y -= 30

    industries = [
        ('Healthcare & Dental', 'Claims denial management, insurance AR recovery, patient balance cleanup, and compliance-grade documentation for multi-site groups.'),
        ('Fleet & Logistics', 'Fuel-card reconciliation, vendor dispute recovery, contract compliance documentation, and damage-claim file structuring.'),
        ('Subscription & Recurring', 'Churn-recovery systems, payment-failure escalation, dunning infrastructure, and retention-metric dashboards.'),
        ('Contract Services', 'Multi-party agreement cleanup, milestone-billing recovery, change-order documentation, and dispute-ready file packets.'),
    ]

    card_w = 240
    card_h = 110
    gap_x = 20
    gap_y = 16

    for i, (title, desc) in enumerate(industries):
        col = i % 2
        row = i // 2
        cx = 60 + col * (card_w + gap_x)
        cy = y - row * (card_h + gap_y) - card_h

        # Card
        c.setFillColor(OFF_WHITE)
        c.setStrokeColor(HexColor('#B8DDD8'))
        c.setLineWidth(0.5)
        c.roundRect(cx, cy, card_w, card_h, 8, fill=1, stroke=1)

        # Teal top accent
        c.setFillColor(TEAL)
        # Clip-safe approach: draw small rect at top
        c.roundRect(cx, cy + card_h - 4, card_w, 4, 0, fill=1, stroke=0)

        # Title
        c.setFillColor(TEAL)
        c.setFont('Helvetica-Bold', 11)
        c.drawString(cx + 16, cy + card_h - 28, title)

        # Desc
        c.setFillColor(DARK_TEXT)
        c.setFont('Helvetica', 8)
        words = desc.split()
        line = ''
        ly = cy + card_h - 46
        for word in words:
            test = line + ' ' + word if line else word
            if c.stringWidth(test, 'Helvetica', 8) < card_w - 32:
                line = test
            else:
                c.drawString(cx + 16, ly, line)
                ly -= 12
                line = word
        if line:
            c.drawString(cx + 16, ly, line)

    y -= 2 * (card_h + gap_y) + 40

    # Divider
    c.setStrokeColor(HexColor('#D0E8E4'))
    c.setLineWidth(0.5)
    c.line(60, y, W - 60, y)
    y -= 30

    # CTA Section
    # Dark box
    c.setFillColor(NAVY_MID)
    c.roundRect(60, y - 140, W - 120, 140, 10, fill=1, stroke=0)

    # Gold accent
    c.setFillColor(GOLD)
    c.rect(60, y, W - 120, 2, fill=1, stroke=0)

    # CTA content
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(W / 2, y - 40, 'Ready to strengthen your operating layer?')

    c.setFillColor(TEAL_LIGHT)
    c.setFont('Helvetica', 10.5)
    c.drawCentredString(W / 2, y - 65,
        'Start with a confidential diagnostic. No commitment. No generic pitch.')

    # CTA Button
    btn_w = 240
    btn_h = 38
    btn_x = W / 2 - btn_w / 2
    btn_y = y - 115

    c.setFillColor(TEAL)
    c.roundRect(btn_x, btn_y, btn_w, btn_h, 20, fill=1, stroke=0)

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 11)
    c.drawCentredString(W / 2, btn_y + 12, 'Request a Confidential Review')

    # Bottom contact
    y = btn_y - 40
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 8)
    c.drawCentredString(W / 2, y,
        'vitacorexllc.com   \u2022   (888) 794-8292   \u2022   Tampa, FL')


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    c = canvas.Canvas(OUT_PATH, pagesize=letter)
    c.setTitle('VitaCoreX — Institutional Proof Document')
    c.setAuthor('VitaCoreX LLC')
    c.setSubject('Revenue Recovery Design & Corporate Legal File Control')
    c.setCreator('VitaCoreX Document System')

    # Page 1 — Cover
    draw_cover(c)
    c.showPage()

    # Page 2 — Executive Snapshot + Services
    draw_page2_executive_snapshot(c)
    c.showPage()

    # Page 3 — Methodology + Compliance
    draw_page3_methodology(c)
    c.showPage()

    # Page 4 — Industries + CTA
    draw_page4_industries(c)
    c.showPage()

    c.save()
    print(f'Generated: {OUT_PATH}')


if __name__ == '__main__':
    main()
