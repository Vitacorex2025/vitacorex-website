#!/usr/bin/env python3
"""
VitaCoreX — Branded PDF Generator (Teal Color Scheme)
Generates all 4 institutional PDFs in the VitaCoreX brand palette.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color, white
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ─── Colors ───────────────────────────────────────────────────
NAVY_DEEP  = HexColor('#0B2320')
NAVY_MID   = HexColor('#0F2F2C')
TEAL       = HexColor('#2D8A82')
TEAL_LIGHT = HexColor('#5BC4B8')
TEAL_PALE  = HexColor('#D0F0EA')
GOLD       = HexColor('#C8AF78')
WHITE      = HexColor('#FFFFFF')
OFF_WHITE  = HexColor('#F0FAF8')
GRAY_TEXT  = HexColor('#3A6B65')
DARK_TEXT  = HexColor('#0D1E34')

W, H = letter
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(SCRIPT_DIR, '..', 'img', 'logo.png')

# ─── Shared Styles ────────────────────────────────────────────
def make_styles():
    return {
        'title': ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=24,
            textColor=WHITE, alignment=TA_CENTER, spaceAfter=8, leading=30),
        'subtitle': ParagraphStyle('Subtitle', fontName='Helvetica', fontSize=11,
            textColor=TEAL_LIGHT, alignment=TA_CENTER, spaceAfter=20, leading=15),
        'h1': ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=18,
            textColor=NAVY_DEEP, spaceAfter=10, spaceBefore=18, leading=22),
        'h2': ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=14,
            textColor=TEAL, spaceAfter=8, spaceBefore=14, leading=18),
        'h3': ParagraphStyle('H3', fontName='Helvetica-Bold', fontSize=11,
            textColor=NAVY_MID, spaceAfter=6, spaceBefore=10, leading=14),
        'body': ParagraphStyle('Body', fontName='Helvetica', fontSize=9.5,
            textColor=DARK_TEXT, spaceAfter=6, leading=13),
        'bullet': ParagraphStyle('Bullet', fontName='Helvetica', fontSize=9.5,
            textColor=DARK_TEXT, spaceAfter=4, leading=13,
            bulletFontName='Helvetica', bulletFontSize=9, leftIndent=18, bulletIndent=6),
        'small': ParagraphStyle('Small', fontName='Helvetica', fontSize=8,
            textColor=GRAY_TEXT, spaceAfter=4, leading=11),
        'cover_body': ParagraphStyle('CoverBody', fontName='Helvetica', fontSize=10,
            textColor=Color(0.82, 0.94, 0.92, 0.85), alignment=TA_CENTER, leading=14),
        'section_title': ParagraphStyle('SectionTitle', fontName='Helvetica-Bold',
            fontSize=13, textColor=WHITE, leading=16),
        'section_sub': ParagraphStyle('SectionSub', fontName='Helvetica',
            fontSize=9, textColor=TEAL_LIGHT, leading=12),
        'metric_num': ParagraphStyle('MetricNum', fontName='Helvetica-Bold',
            fontSize=20, textColor=TEAL, alignment=TA_CENTER, leading=24),
        'metric_label': ParagraphStyle('MetricLabel', fontName='Helvetica',
            fontSize=7.5, textColor=GRAY_TEXT, alignment=TA_CENTER, leading=10),
        'disclaimer': ParagraphStyle('Disclaimer', fontName='Helvetica', fontSize=7.5,
            textColor=GRAY_TEXT, spaceAfter=4, leading=10),
    }


# ─── Canvas Drawing Helpers ───────────────────────────────────
def draw_cover(c, title_lines, subtitle, doc_type='PROPRIETARY \u2014 EXECUTIVE BRIEF'):
    c.setFillColor(NAVY_DEEP)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    for i in range(120):
        alpha = 0.06 * (1 - i / 120)
        c.setFillColor(Color(0.18, 0.77, 0.72, alpha))
        c.rect(0, H - i * 2, W, 2, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(0, 0, W, 6, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(60, H - 260, W - 60, H - 260)
    c.line(60, 180, W - 60, 180)
    if os.path.exists(LOGO_PATH):
        c.drawImage(LOGO_PATH, W/2 - 55, H - 220, 110, 110, preserveAspectRatio=True, mask='auto')
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 28)
    y = H - 320
    for line in title_lines:
        c.drawCentredString(W/2, y, line)
        y -= 36
    c.setFillColor(TEAL_LIGHT)
    c.setFont('Helvetica', 12)
    c.drawCentredString(W/2, y - 20, subtitle)
    c.setFillColor(GOLD)
    for i in range(5):
        c.circle(W/2 - 24 + i*12, y - 50, 1.5, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 9)
    c.drawCentredString(W/2, 210, doc_type)
    c.setFillColor(Color(0.82, 0.94, 0.92, 0.6))
    c.setFont('Helvetica', 8.5)
    c.drawCentredString(W/2, 130, 'VitaCoreX LLC  \u2022  Tampa, FL  \u2022  EIN 41-4399148')
    c.drawCentredString(W/2, 116, '(888) 794-8292  \u2022  vitacorexllc.com')
    c.drawCentredString(W/2, 96, '\u00A9 2026 VitaCoreX LLC. All rights reserved.')


def draw_page_header_footer(c, page_num, doc_label='Confidential'):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(NAVY_DEEP)
    c.rect(0, H - 52, W, 52, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(0, H - 54, W, 2, fill=1, stroke=0)
    c.setFillColor(TEAL_LIGHT)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(40, H - 36, 'VITACOREX LLC')
    c.setFillColor(Color(0.82, 0.94, 0.92, 0.6))
    c.setFont('Helvetica', 7.5)
    c.drawRightString(W - 40, H - 36, doc_label)
    c.setStrokeColor(HexColor('#E0E8E6'))
    c.setLineWidth(0.5)
    c.line(40, 50, W - 40, 50)
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 7)
    c.drawString(40, 36, '\u00A9 2026 VitaCoreX LLC')
    c.drawRightString(W - 40, 36, f'Page {page_num}')


def draw_section_banner(c, y, title, subtitle=None):
    h = 60 if subtitle else 44
    c.setFillColor(NAVY_MID)
    c.roundRect(40, y - 8, W - 80, h, 6, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(40, y + h - 8, W - 80, 2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 14)
    if subtitle:
        c.drawString(60, y + 28, title)
        c.setFillColor(TEAL_LIGHT)
        c.setFont('Helvetica', 9)
        c.drawString(60, y + 10, subtitle)
    else:
        c.drawString(60, y + 10, title)
    return y - 16


def draw_metric_card(c, x, y, number, label, w=120, h=72):
    c.setFillColor(OFF_WHITE)
    c.setStrokeColor(HexColor('#B8DDD8'))
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(x + w/2, y + h - 30, number)
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 7.5)
    c.drawCentredString(x + w/2, y + 12, label)


def draw_text_block(c, x, y, title, bullets, col_w=240):
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(x, y, title)
    c.setFont('Helvetica', 9)
    ly = y - 16
    for b in bullets:
        c.setFillColor(TEAL)
        c.drawString(x, ly, '\u2022')
        c.setFillColor(DARK_TEXT)
        words = b.split()
        line = ''
        for word in words:
            test = line + ' ' + word if line else word
            if c.stringWidth(test, 'Helvetica', 9) < col_w - 20:
                line = test
            else:
                c.drawString(x + 12, ly, line)
                ly -= 13
                line = word
        if line:
            c.drawString(x + 12, ly, line)
        ly -= 15
    return ly


def make_table(headers, rows, col_widths=None):
    data = [headers] + rows
    if not col_widths:
        col_widths = [W * 0.9 / len(headers)] * len(headers)
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_MID),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (-1, -1), DARK_TEXT),
        ('BACKGROUND', (0, 1), (-1, -1), OFF_WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [OFF_WHITE, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#B8DDD8')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    return t


# ═══════════════════════════════════════════════════════════════
# PDF 1: Healthcare CFO Brief (1 page)
# ═══════════════════════════════════════════════════════════════
def generate_healthcare_cfo_brief():
    out = os.path.join(SCRIPT_DIR, 'healthcare-cfo-brief.pdf')
    c = canvas.Canvas(out, pagesize=letter)

    draw_page_header_footer(c, 1, 'Healthcare CFO Brief  \u2022  Confidential')

    y = H - 90
    c.setFillColor(NAVY_DEEP)
    c.setFont('Helvetica-Bold', 22)
    c.drawString(40, y, 'Healthcare CFO Brief')
    y -= 18
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 9.5)
    c.drawString(40, y, 'Revenue protection and recovery infrastructure for healthcare operators')
    y -= 12
    c.drawString(40, y, 'and recurring-payment businesses. Tampa, FL \u2022 Operating nationwide \u2022 2025')

    y -= 35
    y = draw_section_banner(c, y, 'EXECUTIVE SUMMARY')
    y -= 20
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9.5)
    lines = [
        'This brief frames recovery work as an operating discipline rather than a generic',
        'collections problem. The relevant levers are intake completeness, documentation',
        'thresholds, escalation logic, and filing-ready handoff when outside escalation',
        'becomes necessary.'
    ]
    for line in lines:
        c.drawString(50, y, line)
        y -= 14

    y -= 15
    y = draw_section_banner(c, y, 'PILOT ECONOMICS SNAPSHOT')
    y -= 15
    from reportlab.platypus import Table as T2, TableStyle as TS2
    tdata = [
        ['Metric', 'Base State', 'Pilot Target'],
        ['Documentation completeness', 'Fragmented / ad hoc', 'Standardized intake package'],
        ['Collection leakage', 'High variability', 'Lower avoidable leakage'],
        ['Counsel handoff quality', 'Inconsistent', 'Filing-ready packet'],
        ['Executive reporting', 'Limited visibility', 'Traceable workflow state'],
    ]
    t = T2(tdata, colWidths=[170, 155, 175])
    t.setStyle(TS2([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_MID),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('TEXTCOLOR', (0, 1), (-1, -1), DARK_TEXT),
        ('BACKGROUND', (0, 1), (-1, -1), OFF_WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [OFF_WHITE, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#B8DDD8')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    tw, th = t.wrap(500, 300)
    t.drawOn(c, 50, y - th)
    y -= th + 20

    y = draw_section_banner(c, y, 'CONTROL HIERARCHY')
    y -= 15
    tdata2 = [
        ['Layer', 'Relative Control Value'],
        ['Intake standard', 'High'],
        ['Documentation threshold', 'Medium-High'],
        ['Escalation logic', 'Medium'],
        ['Counsel handoff', 'Critical'],
    ]
    t2 = T2(tdata2, colWidths=[250, 250])
    t2.setStyle(TS2([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_MID),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('TEXTCOLOR', (0, 1), (-1, -1), DARK_TEXT),
        ('BACKGROUND', (0, 1), (-1, -1), OFF_WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [OFF_WHITE, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#B8DDD8')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    tw2, th2 = t2.wrap(500, 300)
    t2.drawOn(c, 50, y - th2)
    y -= th2 + 20

    y = draw_section_banner(c, y, 'USE CASE FIT')
    y -= 18
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9)
    c.drawString(50, y, 'Best aligned with medical practices, outpatient groups, dental groups / DSO')
    c.drawString(50, y - 13, 'environments, gyms or memberships, and subscription or card-on-file businesses')
    c.drawString(50, y - 26, 'that need tighter documentation discipline before escalation.')

    c.save()
    print(f'  Generated: {out}')


# ═══════════════════════════════════════════════════════════════
# PDF 2: Lead Magnet Healthcare (10 pages)
# ═══════════════════════════════════════════════════════════════
def generate_lead_magnet():
    out = os.path.join(SCRIPT_DIR, 'lead-magnet-healthcare.pdf')
    c = canvas.Canvas(out, pagesize=letter)

    # Page 1: Cover
    draw_cover(c, ['5 Revenue Leakage Points', 'in Healthcare Operators'],
               'Why Clinics Lose 8\u201315% Revenue in Workflow Chaos',
               'LEAD MAGNET  \u2022  HEALTHCARE OPERATORS')
    c.showPage()

    # Page 2: Executive Overview
    draw_page_header_footer(c, 2, 'Lead Magnet  \u2022  Healthcare')
    y = H - 90
    y = draw_section_banner(c, y, 'EXECUTIVE OVERVIEW', 'Why revenue leakage starts before collections')
    y -= 25
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9.5)
    c.drawString(50, y, 'Healthcare operators often have a sequencing problem, not just a collections problem.')
    y -= 20
    bullets = [
        'Organizations often assume poor collections performance is the main driver of revenue loss.',
        'Workflow discipline and documentation structure usually determine whether balances convert into cash or drift into aging.',
        'Many clinics lack a standardized operating layer between patient responsibility billing, payment agreements, autopay activation, and escalation controls.',
        'That gap creates hidden revenue leakage long before formal collections begin.'
    ]
    for b in bullets:
        y = draw_bullet(c, 50, y, b, W - 100) - 4

    y -= 20
    metrics = [('DSO \u2193', 'Cash velocity improves'), ('Yield \u2191', 'More balances convert'),
               ('Roll-to-agency \u2193', 'Fewer fee placements'), ('Control \u2191', 'Leadership KPIs')]
    card_w = 120
    gap = 10
    sx = (W - 4*card_w - 3*gap) / 2
    for i, (num, label) in enumerate(metrics):
        draw_metric_card(c, sx + i*(card_w + gap), y - 72, num, label, card_w, 72)
    c.showPage()

    # Pages 3-7: Leakage Points
    leakage_points = [
        ('REVENUE LEAKAGE POINT #1', 'Fragmented patient billing workflow',
         ['Patient balances are often handled inconsistently across locations and staff members.',
          'Symptoms include inconsistent communication cadence, no standardized outreach scripts, missing payment plan structure, and undocumented commitments.',
          'As accounts drift into older aging buckets, recovery probability decays materially.'],
         'Every additional 30-day delay materially reduces recovery probability and increases avoidable agency placements.'),
        ('REVENUE LEAKAGE POINT #2', 'Lack of structured payment agreements',
         ['Informal payment plans frequently lack digital agreement execution, autopay authorization, documented schedules, and clear default triggers.',
          'Without those controls, payment plans fail at higher rates and create weak downstream documentation.',
          'A structured system converts balances into documented repayment commitments with clearer enforceability.'],
         'A structured layer with digital agreement, ACH authorization, defined default triggers, and audit trail is the core operating control.'),
        ('REVENUE LEAKAGE POINT #3', 'Early agency escalation compresses margin',
         ['Direct escalation to agencies typically introduces 25\u201340% contingency leakage.',
          'The organization gives up a significant share of recoverable cash before exhausting cleaner internal sequencing.',
          'Pre-collection recovery can reduce placements by converting balances earlier into documented commitments.'],
         'This is margin protection and cash velocity improvement, not "collections outsourcing."'),
        ('REVENUE LEAKAGE POINT #4', 'Weak recovery monitoring',
         ['Leadership often lacks centralized visibility into plan completion, autopay enrollment, yield by cohort, and roll-to-agency.',
          'Without these KPIs, leakage remains invisible and operator performance cannot be standardized across locations.',
          'Structured reporting turns recovery into a measurable finance and operations function.'],
         'Net yield, cohort performance, DSO, autopay enrollment, and placement reduction are executive metrics.'),
        ('REVENUE LEAKAGE POINT #5', 'Documentation weakness before enforcement',
         ['When accounts require escalation, organizations often discover missing consent, unclear repayment terms, incomplete audit trail, or inconsistent communication records.',
          'These gaps increase friction, delay legal review, and weaken downstream enforceability.',
          'The strongest recovery systems build documentation discipline before escalation, not after failure.'],
         'Structured documentation strengthens downstream enforceability and preserves evidence for counsel.'),
    ]
    for idx, (section, title, bullets, cfo_note) in enumerate(leakage_points):
        draw_page_header_footer(c, idx + 3, 'Lead Magnet  \u2022  Healthcare')
        y = H - 90
        y = draw_section_banner(c, y, section, title)
        y -= 25
        for b in bullets:
            y = draw_bullet(c, 50, y, b, W - 100) - 4
        y -= 20
        c.setFillColor(OFF_WHITE)
        c.setStrokeColor(HexColor('#B8DDD8'))
        c.roundRect(50, y - 60, W - 100, 56, 6, fill=1, stroke=1)
        c.setFillColor(TEAL)
        c.setFont('Helvetica-Bold', 9)
        c.drawString(62, y - 18, 'Why CFOs care')
        c.setFillColor(DARK_TEXT)
        c.setFont('Helvetica', 8.5)
        words = cfo_note.split()
        line = ''
        ly = y - 34
        for word in words:
            test = line + ' ' + word if line else word
            if c.stringWidth(test, 'Helvetica', 8.5) < W - 140:
                line = test
            else:
                c.drawString(62, ly, line)
                ly -= 12
                line = word
        if line:
            c.drawString(62, ly, line)
        c.showPage()

    # Page 8: Structured Recovery Model
    draw_page_header_footer(c, 8, 'Lead Magnet  \u2022  Healthcare')
    y = H - 90
    y = draw_section_banner(c, y, 'STRUCTURED RECOVERY MODEL', 'From aging balance to documented commitment')
    y -= 30
    steps = ['Account\naging', 'Segmen-\ntation', 'Structured\noutreach', 'Signed\nagreement',
             'Autopay\nactivation', 'Monitoring\n& exceptions', 'Escalation\nif needed']
    sw = 70
    sg = 8
    total = len(steps) * sw + (len(steps) - 1) * sg
    sx = (W - total) / 2
    for i, step in enumerate(steps):
        px = sx + i * (sw + sg)
        c.setFillColor(TEAL if i % 2 == 0 else NAVY_MID)
        c.roundRect(px, y - 60, sw, 55, 6, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 7.5)
        lines = step.split('\n')
        for j, ln in enumerate(lines):
            c.drawCentredString(px + sw/2, y - 30 - j*11, ln)
        if i < len(steps) - 1:
            c.setFillColor(GOLD)
            c.setFont('Helvetica', 12)
            c.drawCentredString(px + sw + sg/2, y - 35, '\u25B6')
    y -= 100
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9.5)
    c.drawString(50, y, 'Focus: convert balances into documented commitments before contingency compression applies.')
    c.showPage()

    # Page 9: Financial Impact
    draw_page_header_footer(c, 9, 'Lead Magnet  \u2022  Healthcare')
    y = H - 90
    y = draw_section_banner(c, y, 'FINANCIAL IMPACT', 'Illustrative net-cash improvement before agency fees')
    y -= 25
    tdata = [
        ['Scenario', 'Net Cash'],
        ['Immediate agency referral', '$280K'],
        ['Pre-collection + agency for failures', '$476K'],
        ['Estimated lift', '$196K'],
    ]
    t = Table(tdata, colWidths=[300, 200])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_MID),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('TEXTCOLOR', (0, 1), (-1, -1), DARK_TEXT),
        ('BACKGROUND', (0, -1), (-1, -1), TEAL_PALE),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -2), OFF_WHITE),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#B8DDD8')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    tw, th = t.wrap(500, 300)
    t.drawOn(c, 50, y - th)
    y -= th + 30
    draw_metric_card(c, 100, y - 80, '+$196K', 'Illustrative lift vs agency', 180, 80)
    draw_metric_card(c, 320, y - 80, '+70%', 'Improvement in net cash', 180, 80)
    y -= 120
    bullets = [
        'Higher repayment plan adoption', 'Increased autopay enrollment',
        'Reduced agency placements', 'Improved cash velocity',
        'Stronger documentation before enforcement'
    ]
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica-Bold', 10)
    c.drawString(50, y, 'Organizations implementing structured recovery typically target:')
    y -= 18
    for b in bullets:
        y = draw_bullet(c, 50, y, b, W - 100)
    c.showPage()

    # Page 10: About / CTA
    draw_page_header_footer(c, 10, 'Lead Magnet  \u2022  Healthcare')
    y = H - 90
    y = draw_section_banner(c, y, 'ABOUT VITACOREX LLC', 'Operator-oriented recovery and documentation consulting')
    y -= 25
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9.5)
    c.drawString(50, y, 'Built for healthcare operators, dental groups, and multi-location service businesses.')
    y -= 25
    services = ['Contract infrastructure', 'Revenue recovery workflows', 'Documentation systems',
                'Litigation-ready case preparation', 'Structured administrative and operational support for payment environments']
    for s in services:
        y = draw_bullet(c, 50, y, s, W - 100)
    y -= 30
    c.setFillColor(OFF_WHITE)
    c.setStrokeColor(TEAL)
    c.setLineWidth(1)
    c.roundRect(50, y - 80, W - 100, 76, 8, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont('Helvetica-Bold', 13)
    c.drawCentredString(W/2, y - 25, 'Next Step')
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 10)
    c.drawCentredString(W/2, y - 45, 'Schedule a consultation and request a confidential review')
    c.drawCentredString(W/2, y - 60, 'of your recovery workflow, documentation structure, and placement logic.')
    y -= 110
    c.setFillColor(TEAL)
    c.setFont('Helvetica-Bold', 10)
    c.drawCentredString(W/2, y, 'vitacorexllc.com  \u2022  (888) 794-8292')
    y -= 30
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 7.5)
    c.drawString(50, y, 'VitaCoreX LLC is not a law firm and does not provide legal representation.')
    c.drawString(50, y - 12, 'All materials are for operational and commercial discussion purposes.')

    c.save()
    print(f'  Generated: {out}')


def draw_bullet(c, x, y, text, max_w):
    c.setFillColor(TEAL)
    c.setFont('Helvetica', 9.5)
    c.drawString(x, y, '\u2022')
    c.setFillColor(DARK_TEXT)
    words = text.split()
    line = ''
    ly = y
    for word in words:
        test = line + ' ' + word if line else word
        if c.stringWidth(test, 'Helvetica', 9.5) < max_w - 20:
            line = test
        else:
            c.drawString(x + 14, ly, line)
            ly -= 13
            line = word
    if line:
        c.drawString(x + 14, ly, line)
    return ly - 15


# ═══════════════════════════════════════════════════════════════
# PDF 3: Pre-Collection Executive Review (23 pages)
# ═══════════════════════════════════════════════════════════════
def generate_precollection():
    out = os.path.join(SCRIPT_DIR, 'precollection-executive-review.pdf')
    c = canvas.Canvas(out, pagesize=letter)

    # Page 1: Cover
    draw_cover(c, ['Pre-Collection Recovery', 'System'],
               'B2B Fuel Card / Fleet / Logistics  \u2022  Florida-ready deployment',
               'PROPRIETARY \u2014 EXECUTIVE REVIEW')
    c.showPage()

    pages = [
        ('EXECUTIVE SNAPSHOT', 'Pre-Collection Recovery', [
            'Recoverable balances leak before agency referral',
            'Guaranties exist but are not activated systematically',
            'Payment plans are offered, but without mandatory auto-debit discipline',
        ], [
            'Internal pre-collection sequencing layer',
            'Behavioral segmentation + controlled offers',
            'Guarantor activation + mandatory ACH',
            'Acceleration discipline + litigation-ready documentation',
        ]),
        ('HIDDEN REVENUE LEAKAGE', 'Key drivers before agency referral', [
            'Immediate contingency-based escalation (fee compression)',
            'Unstructured repayment attempts (no sequencing, no triggers)',
            'Low enrollment into auto-pay plans',
            'Weak documentation before enforcement',
            'Higher complaint / dispute risk under stress',
        ], None),
        ('WHY STANDARD WORKFLOWS UNDERPERFORM', 'Observed pattern', [
            'Guaranty is signed but rarely used early (no activation ladder)',
            'ACH is optional (high churn on cards / contact details)',
            'Acceleration exists on paper but is not applied consistently',
            'Letters are reactive and inconsistent (no timing discipline)',
            'Outcome depends on individual operator style rather than system',
        ], None),
        ('STAGE 1 \u2014 BEHAVIORAL SEGMENTATION', 'Controlled escalation', [
            'Days past due (DPD) bands',
            'Payment history patterns',
            'Corporate stability indicators (signals, not claims)',
            'Communication responsiveness',
            'Guarantor exposure and documentation status',
        ], None),
        ('STAGE 2 \u2014 CONDITIONAL OFFER CONVERSION', 'High-level mechanics', [
            'Time-sensitive incentive window (fee relief conditioned on compliance)',
            'Signed structured plan (reaffirmation language where appropriate)',
            'Mandatory auto-debit enrollment (ACH preference)',
            'Clear default / cure timeline and triggers',
        ], None),
        ('CORPORATE DEBT \u2192 GUARANTOR EXPOSURE', 'Florida-ready pathway', [
            'Activation ladder and documented reaffirmation',
            'Direct-action posture (where contract allows)',
            'Dissolution of LLC does not extinguish guarantor exposure',
        ], [
            'Risk-adjusted settlement sequencing (if no guaranty)',
            'Higher documentation standard before escalation',
            'Onboarding redesign to prevent recurrence',
        ]),
        ('STAGE 3 \u2014 MANDATORY AUTO-DEBIT', 'ACH-first discipline', [
            'Recurring ACH enrollment at agreement execution',
            'Survival until paid-in-full (even if service relationship ends)',
            'Return/NSF triggers feed cure \u2192 default \u2192 acceleration sequence',
            'Reduced reliance on changed cards / contact churn',
        ], None),
        ('LITIGATION-READY DOCUMENTATION', 'Enforcement posture', [
            'Settlement & reaffirmation agreement (Florida governing law / venue)',
            'Personal guaranty (separate execution; joint & several)',
            'ACH authorization (recurring; survival; update obligation)',
            'Cure / default notices (certified mail templates)',
            'Evidence packaging for counsel (timeline, exhibits, payment history)',
        ], None),
        ('SCENARIO: LLC DISSOLVED / OWNER DISAPPEARS', 'What actually works', [
            'Immediate status verification (corporate registry) + last-known address validation',
            'Guarantor activation (if signed) + documented demand to individual',
            'Asset-aware pre-suit positioning (no speculative claims)',
            'Florida venue enforcement posture where contract supports it',
        ], None),
        ('ILLUSTRATIVE IMPACT', 'Charts are directional', None, None),
        ('END-TO-END WORKFLOW', 'Sequencing', None, None),
        ('CRM LAYER REQUIREMENTS', 'Visibility & controls', [
            'Single account timeline (calls, SMS, email, letters, payment events)',
            'Stage/status pipeline (DPD bands + offer state + ACH state)',
            'Task assignment with due dates and audit trail',
            'Email and SMS tracking where supported (opens/clicks)',
            'Exportable evidence packet for counsel',
        ], None),
        ('WHAT VITACOREX DELIVERS', 'Engagement deliverables', [
            'Process design: sequencing + triggers + escalation ladder',
            'Document package: settlement, guaranty, ACH, notices (Florida-ready)',
            'CRM build-out: pipelines, statuses, templates, automation rules',
            'Team enablement: scripts, playbooks, QA standards',
            'Operational governance: KPI dashboard and monthly optimization',
        ], None),
        ('90-DAY PILOT', 'Low disruption deployment', [
            'Week 1\u20132: portfolio sampling + baseline curve + workflow mapping',
            'Week 3\u20134: documentation + CRM configuration + training',
            'Month 2: controlled rollout on selected DPD bands',
            'Month 3: measurement, tuning, and scale decision',
        ], None),
        ('KPI DASHBOARD', 'Executive reporting', [
            'Net recovery rate before agency referral',
            'Roll-to-agency ratio',
            'Plan acceptance rate and completion rate',
            'Auto-debit enrollment and failure rate',
            'Median time-to-cure / time-to-cash',
            'Complaint/dispute incidence during recovery',
        ], None),
    ]

    kpi_table_page = True
    compliance_page = True
    cost_page = True
    onboarding_page = True
    next_steps_page = True
    appendix_pages = True

    for idx, (title, sub, bullets1, bullets2) in enumerate(pages):
        pn = idx + 2
        draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
        y = H - 90
        y = draw_section_banner(c, y, title, sub)
        y -= 25

        if title == 'ILLUSTRATIVE IMPACT':
            metrics = [
                ('+10\u201320%', 'NET RECOVERY\nUPLIFT'),
                ('-8\u201312pp', 'ROLL-TO-AGENCY\nREDUCTION'),
                ('-15\u201320d', 'DSO\nIMPROVEMENT'),
                ('+30\u201345pp', 'AUTOPAY\nENROLLMENT'),
            ]
            card_w = 120
            gap = 10
            sx = (W - 4*card_w - 3*gap) / 2
            for i, (num, label) in enumerate(metrics):
                draw_metric_card(c, sx + i*(card_w + gap), y - 80, num, label, card_w, 80)
            y -= 120
            c.setFillColor(GRAY_TEXT)
            c.setFont('Helvetica', 8)
            c.drawString(50, y, 'Note: final results depend on portfolio mix, documentation quality, and enforcement discipline.')
        elif title == 'END-TO-END WORKFLOW':
            steps = ['Segment', 'Conditional\nOffer', 'Sign Plan', 'ACH\nAuto-Debit',
                     'Cure/Default', 'Acceleration', 'Pre-Suit\nPackage', 'Counsel/\nFiling']
            sw = 60
            sg = 6
            total = len(steps) * sw + (len(steps) - 1) * sg
            sx = (W - total) / 2
            for i, step in enumerate(steps):
                px = sx + i * (sw + sg)
                c.setFillColor(TEAL if i < 5 else NAVY_MID)
                c.roundRect(px, y - 55, sw, 50, 5, fill=1, stroke=0)
                c.setFillColor(WHITE)
                c.setFont('Helvetica-Bold', 7)
                lines = step.split('\n')
                for j, ln in enumerate(lines):
                    c.drawCentredString(px + sw/2, y - 28 - j*10, ln)
                if i < len(steps) - 1:
                    c.setFillColor(GOLD)
                    c.setFont('Helvetica', 9)
                    c.drawCentredString(px + sw + sg/2, y - 32, '\u25B6')
        elif title.startswith('EXECUTIVE SNAPSHOT'):
            c.setFillColor(TEAL)
            c.setFont('Helvetica-Bold', 10)
            c.drawString(50, y, 'Problem:')
            y -= 16
            for b in bullets1:
                y = draw_bullet(c, 50, y, b, W - 100) - 2
            y -= 15
            c.setFillColor(TEAL)
            c.setFont('Helvetica-Bold', 10)
            c.drawString(50, y, 'Solution:')
            y -= 16
            for b in bullets2:
                y = draw_bullet(c, 50, y, b, W - 100) - 2
            y -= 15
            c.setFillColor(DARK_TEXT)
            c.setFont('Helvetica', 9)
            c.drawString(50, y, 'Outcome targets (illustrative): higher net recovery, shorter time-to-cash,')
            c.drawString(50, y - 13, 'lower roll-to-agency, stronger enforcement posture.')
        elif title.startswith('CORPORATE DEBT'):
            c.setFillColor(TEAL)
            c.setFont('Helvetica-Bold', 10)
            c.drawString(50, y, 'If a valid personal guaranty exists:')
            y -= 16
            for b in bullets1:
                y = draw_bullet(c, 50, y, b, W - 100) - 2
            y -= 15
            c.setFillColor(TEAL)
            c.setFont('Helvetica-Bold', 10)
            c.drawString(50, y, 'If guaranty does NOT exist:')
            y -= 16
            for b in bullets2:
                y = draw_bullet(c, 50, y, b, W - 100) - 2
        else:
            if bullets1:
                for b in bullets1:
                    y = draw_bullet(c, 50, y, b, W - 100) - 2

        if title == 'HIDDEN REVENUE LEAKAGE':
            y -= 20
            c.setFillColor(OFF_WHITE)
            c.setStrokeColor(TEAL)
            c.setLineWidth(1)
            c.roundRect(50, y - 40, W - 100, 36, 6, fill=1, stroke=1)
            c.setFillColor(DARK_TEXT)
            c.setFont('Helvetica-Bold', 10)
            c.drawCentredString(W/2, y - 26, 'This is a sequencing problem \u2014 not a collections problem.')

        c.showPage()

    # KPI Table page
    pn = len(pages) + 2
    draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
    y = H - 90
    y = draw_section_banner(c, y, 'KPI TABLE (ILLUSTRATIVE)', 'Baseline vs target')
    y -= 20
    tdata = [
        ['Metric', 'Baseline', 'Target'],
        ['Net recovery (pre-agency)', '42\u201348%', '50\u201358% (+6\u201310 pp)'],
        ['Roll-to-agency rate', '28\u201335%', '18\u201324% (-8\u201312 pp)'],
        ['Auto-debit enrollment', '15\u201325%', '55\u201370% (+30\u201345 pp)'],
        ['Plan completion rate', '40\u201350%', '60\u201375% (+15\u201325 pp)'],
        ['Median time-to-cash', '52\u201360 days', '35\u201345 days (-15\u201320 d)'],
    ]
    t = Table(tdata, colWidths=[200, 150, 150])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_MID),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('TEXTCOLOR', (0, 1), (-1, -1), DARK_TEXT),
        ('BACKGROUND', (0, 1), (-1, -1), OFF_WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [OFF_WHITE, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#B8DDD8')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    tw, th = t.wrap(500, 400)
    t.drawOn(c, 50, y - th)
    y -= th + 15
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 7.5)
    c.drawString(50, y, 'All figures are illustrative and provided for executive modeling purposes only.')
    c.showPage()
    pn += 1

    # Compliance page
    draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
    y = H - 90
    y = draw_section_banner(c, y, 'COMPLIANCE & RISK POSTURE', 'B2B-first approach')
    y -= 25
    for b in ['B2B collections practices with documented consent and clear notices',
              'Segmentation and messaging governance (avoid inconsistent claims)',
              'Audit trail for communications and payment authorizations',
              'Escalation aligned to contract and venue language']:
        y = draw_bullet(c, 50, y, b, W - 100) - 2
    y -= 15
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 8.5)
    c.drawString(50, y, 'Note: If portfolio includes consumer debt, separate FDCPA workflows must be implemented.')
    c.showPage()
    pn += 1

    # Why This Matters Now
    draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
    y = H - 90
    y = draw_section_banner(c, y, 'WHY THIS MATTERS NOW', 'Cost of inaction')
    y -= 25
    for b in ['Agency escalation compresses retained recovery via contingency fees',
              'Operational cost grows as accounts age (re-work, contact decay)',
              'LLC churn and contact churn reduce future collectability',
              'Lack of system makes outcomes unpredictable and difficult to forecast']:
        y = draw_bullet(c, 50, y, b, W - 100) - 2
    c.showPage()
    pn += 1

    # Onboarding Package
    draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
    y = H - 90
    y = draw_section_banner(c, y, 'ONBOARDING PACKAGE', 'Day-1 protection \u2014 prevent recurrence')
    y -= 25
    for b in ['Separate personal guaranty execution (individual capacity)',
              'Mandatory recurring ACH authorization for payment plans',
              'Florida governing law / venue language (where commercially appropriate)',
              'Acceleration and cure mechanics aligned to operations',
              'Documentation checklist for enforceability']:
        y = draw_bullet(c, 50, y, b, W - 100) - 2
    c.showPage()
    pn += 1

    # Next Steps
    draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
    y = H - 90
    y = draw_section_banner(c, y, 'NEXT STEPS', 'Engagement pathway')
    y -= 30
    steps_data = [
        ('01', 'NDA (if required) \u2192 data request for baseline'),
        ('02', '30-minute working session (ops + finance)'),
        ('03', 'Pilot scope confirmation and timeline'),
        ('04', 'Deployment and measurement'),
    ]
    for num, desc in steps_data:
        c.setFillColor(TEAL)
        c.circle(70, y + 6, 16, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(70, y + 1, num)
        c.setFillColor(DARK_TEXT)
        c.setFont('Helvetica', 11)
        c.drawString(100, y, desc)
        y -= 40
    y -= 20
    c.setFillColor(TEAL)
    c.setFont('Helvetica-Bold', 10)
    c.drawCentredString(W/2, y, 'vitacorexllc.com  \u2022  (888) 794-8292')
    c.showPage()
    pn += 1

    # Appendix A
    draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
    y = H - 90
    y = draw_section_banner(c, y, 'APPENDIX A \u2014 DATA REQUEST', 'Minimal footprint for pilot')
    y -= 25
    for b in ['Last 12 months: delinquency list (DPD, balance, last payment date)',
              'Contract flags: guaranty present (Y/N), documentation completeness',
              'Communication fields: phone/email last verified date',
              'Agency escalation history and fees (if applicable)']:
        y = draw_bullet(c, 50, y, b, W - 100) - 2
    c.showPage()
    pn += 1

    # Appendix B
    draw_page_header_footer(c, pn, 'Pre-Collection  \u2022  Executive Review')
    y = H - 90
    y = draw_section_banner(c, y, 'APPENDIX B \u2014 DISCLOSURES', 'Important notices')
    y -= 25
    c.setFillColor(DARK_TEXT)
    c.setFont('Helvetica', 9.5)
    disc = [
        'This deck is informational and does not constitute legal advice.',
        'Implementation requires review of existing contracts and applicable law.',
        'Illustrative charts are directional; results depend on portfolio mix and execution discipline.',
    ]
    for d in disc:
        y = draw_bullet(c, 50, y, d, W - 100) - 2
    y -= 30
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 8)
    c.drawCentredString(W/2, y, 'VitaCoreX LLC is not a law firm and does not provide legal representation.')
    c.drawCentredString(W/2, y - 13, 'Legal strategy and legal advice remain the responsibility of licensed counsel.')
    c.drawCentredString(W/2, y - 30, '\u00A9 2026 VitaCoreX LLC. All rights reserved.')

    c.save()
    print(f'  Generated: {out}')


# ═══════════════════════════════════════════════════════════════
# PDF 4: Dental Institutional Deck (45 pages)
# ═══════════════════════════════════════════════════════════════
def generate_dental_deck():
    out = os.path.join(SCRIPT_DIR, 'dental-institutional-deck.pdf')
    c = canvas.Canvas(out, pagesize=letter)

    # Cover
    draw_cover(c, ['Pre-Collection Revenue', 'Cycle Optimization'],
               'Dental & Outpatient Chains  \u2022  CFO / Ownership Briefing',
               'PROPRIETARY \u2014 INSTITUTIONAL DECK')
    c.showPage()

    # Define all 44 content pages
    deck_pages = [
        ('EXECUTIVE SUMMARY', 'Financially-driven operating system', [
            'Patient AR is one of the largest controllable cash drivers in multi-location dental groups.',
            'Recovery probability decays sharply with aging; every 30 days delay destroys conversion yield.',
            'A standardized pre-collection layer improves plan adoption, reduces defaults, and limits roll-to-agency.',
            'Pilot-first deployment produces CFO-grade evidence before scale.',
        ], [('+10\u201320%', 'Net cash uplift'), ('25\u201340%', 'Agency fee avoidance'), ('90 days', 'Pilot duration'), ('DSO \u2193', 'Primary lever')]),
        ('AGENDA', 'Today\u2019s discussion', [
            'Market context and why patient AR is now a board-level cash lever',
            'Patient AR structure and recovery decay curve',
            'Financial model: DSO compression, working capital release, EBITDA impact',
            'Operating system: workflow, controls, and governance',
            '90-day pilot design, success criteria, and rollout plan',
            'Commercial model and next steps',
        ], None),
        ('THE PROBLEM', 'Revenue leakage before collections', [
            'Aged patient balances rapidly lose recovery probability.',
            'Unstructured outreach lowers payment plan adoption and increases early default.',
            'Early agency escalation creates 25\u201340% contingency leakage and reputational risk.',
            'Teams lack a standardized layer that converts balances into documented commitments and autopay.',
            'Leadership lacks consistent, comparable KPIs across locations.',
        ], None),
        ('WHY DENTAL / DSO CHAINS', 'Fast, measurable financial wins within 90 days', [
            'High patient responsibility share creates a large controllable cash pool.',
            'Brand sensitivity makes "options-first" pre-collection preferable to external collections.',
            'Multi-location standardization produces immediate operational leverage.',
            'RCM and cash outcomes are measurable quickly.',
        ], None),
        ('U.S. DENTAL MARKET OVERVIEW', 'Context for PE-backed DSOs', [
            'U.S. dental services market: $165B+ annual revenue (industry estimates).',
            'DSO footprint expanding; consolidation accelerates standardization and KPI discipline.',
            'Patient responsibility often represents 35\u201350% of revenue depending on specialty and payer mix.',
            'Typical AR days: ~35\u201360 (varies by specialty and process maturity).',
        ], None),
    ]

    # Financial pages
    fin_tables = [
        ('HIDDEN CASH IN PATIENT AR', 'Illustrative exposure in a mid-size dental group', [
            ['Metric', 'Example'],
            ['Annual Revenue', '$40,000,000'],
            ['Patient Responsibility (40%)', '$16,000,000'],
            ['Average Patient AR', '$5,200,000'],
            ['Recovery Loss vs Optimal', '10\u201315%'],
            ['Cash Leakage', '$520,000 \u2013 $780,000 / year'],
        ]),
        ('PATIENT AR COMPOSITION', 'Why patient balances are the least structured RCM segment', [
            ['Category', 'Share'],
            ['Insurance pending', '40\u201350%'],
            ['Patient responsibility', '25\u201340%'],
            ['Self-pay', '10\u201320%'],
        ]),
        ('DSO COMPRESSION IMPACT', 'Working capital release from faster time-to-cash', [
            ['Metric', 'Value'],
            ['DSO reduction', '52 \u2192 44 days (\u22128)'],
            ['For $10M revenue practice', 'Working capital \u2248 $0.22M'],
            ['At enterprise scale', 'Meaningful liquidity lever'],
        ]),
        ('EBITDA EXPANSION', 'Incremental recovery converts to EBITDA after costs', [
            ['Assumption (illustrative)', 'Value'],
            ['Annual patient AR portfolio', '$5,000,000'],
            ['Current recovery (baseline)', '25% \u2192 $1,250,000'],
            ['Pre-collection recovery (target)', '38% \u2192 $1,900,000'],
            ['Incremental recovered cash', '+ $650,000'],
            ['EBITDA margin example', '15%'],
            ['Incremental EBITDA', '$97,500'],
        ]),
        ('ENTERPRISE VALUE IMPACT', 'Why PE-backed DSOs care about small EBITDA changes', [
            ['Metric', 'Example'],
            ['Incremental EBITDA', '$250,000'],
            ['DSO / dental multiple', '7\u20139x'],
            ['Enterprise value impact', '$1.75M \u2013 $2.25M'],
        ]),
        ('AGENCY FEE LEAKAGE', 'Contingency fees reduce margin and enterprise value', [
            ['Metric', 'Value'],
            ['Typical contingency fee', '25\u201340%'],
            ['Example recovered', '$1.0M'],
            ['Agency keeps', '$250\u2013$400K'],
        ]),
        ('ROI MODEL', 'Pilot economics in CFO language', [
            ['Metric', 'Value'],
            ['Implementation cost', '$80K'],
            ['Incremental recovery (cash)', '$450K'],
            ['ROI multiple', '5.6x'],
            ['Payback period', '3\u20136 months'],
        ]),
        ('90-DAY PILOT FINANCIALS', 'Data-validated before enterprise rollout', [
            ['Pilot portfolio', 'Value'],
            ['Patient AR in scope', '$2.0M'],
            ['Expected improvement', '+10\u201315%'],
            ['Additional cash', '$200K\u2013$300K'],
            ['Pilot cost', '$50K'],
            ['ROI', '4\u20136x'],
        ]),
        ('CASE STUDY TEMPLATE', 'Example dental group (illustrative)', [
            ['Attribute', 'Value'],
            ['Locations', '12'],
            ['Patient AR portfolio', '$4.5M'],
            ['Autopay enrollment', '42%'],
            ['Recovery rate change', '+13%'],
            ['Agency placements', '\u221228%'],
        ]),
    ]

    # Operational pages
    ops_pages = [
        ('CLINIC-LEVEL ROLLOUT', 'Pilot \u2192 standardization \u2192 enterprise scale', [
            ['Phase', 'Scope', 'Outcome'],
            ['1. Pilot', '3 clinics | 90 days', 'Validated uplift + playbook'],
            ['2. Standardize', 'Policies, scripts, dashboards', 'Repeatable execution'],
            ['3. Enterprise rollout', 'All clinics', 'Sustained cash velocity + KPI control'],
        ]),
        ('STAFF TRAINING AGENDA', 'Operational discipline without adding headcount', None),
        ('CFO ONE-PAGE SUMMARY', 'Board / ownership language', [
            ['Area', 'Detail'],
            ['Problem', 'Patient AR aging destroys recovery probability and increases agency leakage.'],
            ['Solution', 'Pre-collection operating system: standard workflows + controls + reporting.'],
            ['Impact', '+10\u201320% net recovery; placements \u2193; DSO compression; EBITDA uplift.'],
            ['Approach', '90-day pilot to validate before enterprise rollout.'],
        ]),
    ]

    # System pages (bullet-only)
    system_pages = [
        ('REVENUE CYCLE ARCHITECTURE', 'Tool-agnostic operating layer', [
            'Tool-agnostic layer on top of PMS/billing exports',
            'Standardized cases + tasks + documentation',
            'CFO reporting pack (weekly/monthly)',
        ]),
        ('PRE-COLLECTION WORKFLOW', 'Sequencing', [
            'Intake \u2192 segment \u2192 outreach \u2192 agreement \u2192 autopay \u2192 monitor \u2192 escalate',
            'Convert balances into documented commitments before agency fees apply',
        ]),
        ('SEGMENTATION MODEL', 'Routes accounts by risk profile', [
            'Routes accounts by balance size, age, and contactability',
            'Standard offers per segment; exceptions reviewed by lead',
        ]),
        ('OFFER CATALOG', 'Structured payment options', [
            '3/6/12-month plans with down-payment rules',
            'Autopay default (opt-out), clear terms and cure periods',
        ]),
        ('AUTOPAY ACTIVATION', 'Enrollment process', [
            'Enrollment process with clear authorization',
            'Reduces defaults and increases completion rates',
        ]),
        ('MONITORING ENGINE', 'Daily exception management', [
            'Daily exception queue (fails, disputes, bad data)',
            'Cure notices and remediation scripts',
        ]),
        ('ESCALATION LADDER', 'Governed decision pathway', [
            'Cure \u2192 default \u2192 acceleration \u2192 pre-suit option \u2192 agency',
            'Governance ensures consistent, defendable decisions',
        ]),
        ('CFO KPI DASHBOARD', 'Executive metrics', [
            'Net yield vs baseline, roll-to-agency %, cohort curves',
            'Autopay enrollment/completion, exception volumes',
        ]),
        ('GOVERNANCE MODEL', 'Review cadence', [
            'Weekly ops review; monthly finance review',
            'Quarterly optimization of offers and scripts',
        ]),
        ('RISK CONTROL FRAMEWORK', 'Operational safeguards', [
            'Cadence caps, dispute routing, audit trail',
            'Brand-safe tone and documentation discipline',
        ]),
        ('COMPLIANCE BOUNDARIES', 'Regulatory alignment', [
            'Informational alignment to FDCPA/Reg F where applicable',
            'Client retains collections authority unless separately structured',
        ]),
        ('DATA SECURITY & HANDLING', 'Access and retention', [
            'Least-privilege access; encrypted exports',
            'Retention policy aligned to compliance program',
        ]),
        ('CRM / DATA ARCHITECTURE', 'System foundation', [
            'HubSpot/Salesforce-style CRM or RCM tooling',
            'Single source of truth for commitments + activity',
        ]),
        ('REPORTING PACK (MONTHLY)', 'Leadership visibility', [
            'Net recovery yield, cohort performance, DSO trends',
            'Placements avoided, patient experience indicators',
        ]),
        ('90-DAY PILOT DESIGN', 'Scope and governance', [
            'Scope: clinics, AR cohorts, communication channels',
            'Success criteria and governance cadence',
        ]),
        ('PILOT SUCCESS METRICS', 'Measurable outcomes', [
            'Incremental cash, yield uplift, DSO impact',
            'Placements \u2193, default rate \u2193, disputes stable',
        ]),
        ('IMPLEMENTATION TIMELINE', 'Phased deployment', [
            'Week 1\u20132: diagnostic + setup',
            'Week 3\u20136: execution + training',
            'Week 7\u201312: optimization + reporting',
        ]),
        ('COMMERCIAL MODEL', 'Pricing structure', [
            'Implementation + training + optimization',
            'Pricing depends on clinic count, tools, AR volume',
        ]),
        ('WHAT SUCCESS LOOKS LIKE', 'Target state', [
            'Higher net recovery with fewer external placements',
            'Repeatable playbook + CFO-grade reporting',
        ]),
        ('COMMON OBJECTIONS & ANSWERS', 'Addressing concerns', [
            '"We already use an agency" \u2192 reduce placements first, then complement',
            '"Staff overloaded" \u2192 automation + scripts focus on exceptions only',
        ]),
        ('PATIENT EXPERIENCE SAFEGUARDS', 'Brand protection', [
            'Options-first messaging, quiet hours, dispute/hardship routing',
            'Reputation protection and review monitoring',
        ]),
        ('WHAT WE NEED FROM YOU', 'Getting started', [
            'AR export (aging + balances + contact fields)',
            'Current policy and agency fee structure',
        ]),
    ]

    pn = 2
    # Render first 5 pages (with metrics on page 2)
    for idx, (title, sub, bullets, metrics) in enumerate(deck_pages):
        draw_page_header_footer(c, pn, 'Dental Institutional Deck  \u2022  Confidential')
        y = H - 90
        y = draw_section_banner(c, y, title, sub)
        y -= 25
        if bullets:
            for b in bullets:
                y = draw_bullet(c, 50, y, b, W - 100) - 2
        if metrics:
            y -= 20
            card_w = 120
            gap = 10
            sx = (W - 4*card_w - 3*gap) / 2
            for i, (num, label) in enumerate(metrics):
                draw_metric_card(c, sx + i*(card_w + gap), y - 72, num, label, card_w, 72)
        c.showPage()
        pn += 1

    # Recovery decay chart page
    draw_page_header_footer(c, pn, 'Dental Institutional Deck  \u2022  Confidential')
    y = H - 90
    y = draw_section_banner(c, y, 'RECOVERY PROBABILITY BY AGING', 'Aging destroys recovery probability')
    y -= 30
    # Draw simple bar chart
    bars = [(90, '0\u201330'), (70, '30\u201360'), (50, '60\u201390'), (30, '90\u2013120'), (15, '120+')]
    bw = 60
    bg = 30
    bh_max = 200
    sx = (W - len(bars) * (bw + bg)) / 2 + bg/2
    for i, (val, label) in enumerate(bars):
        bx = sx + i * (bw + bg)
        bar_h = val / 100 * bh_max
        c.setFillColor(TEAL if val > 40 else GOLD if val > 20 else HexColor('#B42318'))
        c.roundRect(bx, y - bh_max, bw, bar_h, 4, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 14)
        c.drawCentredString(bx + bw/2, y - bh_max + bar_h - 25, f'{val}%')
        c.setFillColor(DARK_TEXT)
        c.setFont('Helvetica', 8)
        c.drawCentredString(bx + bw/2, y - bh_max - 15, label + ' days')
    y -= bh_max + 40
    c.setFillColor(GRAY_TEXT)
    c.setFont('Helvetica', 9)
    c.drawString(50, y, 'Every 30-day delay materially reduces recovery probability.')
    c.showPage()
    pn += 1

    # Financial table pages
    for title, sub, tdata in fin_tables:
        draw_page_header_footer(c, pn, 'Dental Institutional Deck  \u2022  Confidential')
        y = H - 90
        y = draw_section_banner(c, y, title, sub)
        y -= 20
        if len(tdata[0]) == 2:
            cw = [260, 240]
        else:
            cw = [160, 180, 160]
        t = Table(tdata, colWidths=cw)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), NAVY_MID),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('TEXTCOLOR', (0, 1), (-1, -1), DARK_TEXT),
            ('BACKGROUND', (0, 1), (-1, -1), OFF_WHITE),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [OFF_WHITE, WHITE]),
            ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#B8DDD8')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        tw, th = t.wrap(500, 500)
        t.drawOn(c, 50, y - th)
        c.showPage()
        pn += 1

    # Ops table pages
    for title, sub, tdata in ops_pages:
        draw_page_header_footer(c, pn, 'Dental Institutional Deck  \u2022  Confidential')
        y = H - 90
        y = draw_section_banner(c, y, title, sub)
        y -= 20
        if tdata:
            ncols = len(tdata[0])
            cw = [500 / ncols] * ncols
            t = Table(tdata, colWidths=cw)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), NAVY_MID),
                ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('TEXTCOLOR', (0, 1), (-1, -1), DARK_TEXT),
                ('BACKGROUND', (0, 1), (-1, -1), OFF_WHITE),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [OFF_WHITE, WHITE]),
                ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#B8DDD8')),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            tw, th = t.wrap(500, 500)
            t.drawOn(c, 50, y - th)
        else:
            y -= 5
            staff_items = [
                'Payment plan negotiation and options-first framing',
                'Script training (calls, SMS, email) with cadence caps',
                'Compliance boundaries and escalation governance',
                'Exception handling (disputes, hardship, bad contact data)',
                'CRM workflow: tasks, documentation, audit trail, reporting'
            ]
            for b in staff_items:
                y = draw_bullet(c, 50, y, b, W - 100) - 2
        c.showPage()
        pn += 1

    # System pages (bullet-style)
    for title, sub, bullets in system_pages:
        draw_page_header_footer(c, pn, 'Dental Institutional Deck  \u2022  Confidential')
        y = H - 90
        y = draw_section_banner(c, y, title, sub)
        y -= 25
        for b in bullets:
            y = draw_bullet(c, 50, y, b, W - 100) - 2
        c.showPage()
        pn += 1

    # Next Steps page
    draw_page_header_footer(c, pn, 'Dental Institutional Deck  \u2022  Confidential')
    y = H - 90
    y = draw_section_banner(c, y, 'NEXT STEPS', 'Getting started')
    y -= 30
    for num, desc in [('01', '15-minute fit call'), ('02', 'NDA + AR export request'), ('03', 'Pilot scope confirmation and launch')]:
        c.setFillColor(TEAL)
        c.circle(70, y + 6, 16, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(70, y + 1, num)
        c.setFillColor(DARK_TEXT)
        c.setFont('Helvetica', 11)
        c.drawString(100, y, desc)
        y -= 45
    y -= 10
    c.setFillColor(TEAL)
    c.setFont('Helvetica-Bold', 10)
    c.drawCentredString(W/2, y, 'vitacorexllc.com  \u2022  (888) 794-8292')
    c.showPage()
    pn += 1

    # Appendix pages
    appendices = [
        ('APPENDIX: KPI DEFINITIONS', ['Net recovery, roll-to-agency, completion rate, cash velocity']),
        ('APPENDIX: OUTREACH CADENCE', ['Day 1 notice; Day 7 plan; Day 14 reminder; Day 21 final notice']),
        ('APPENDIX: ROLES & RESPONSIBILITIES', ['Finance: KPI targets; Ops/RCM: execution; Billing: disputes; Agency: last-mile']),
    ]
    for title, bullets in appendices:
        draw_page_header_footer(c, pn, 'Dental Institutional Deck  \u2022  Confidential')
        y = H - 90
        y = draw_section_banner(c, y, title)
        y -= 25
        for b in bullets:
            y = draw_bullet(c, 50, y, b, W - 100) - 2
        y -= 30
        c.setFillColor(GRAY_TEXT)
        c.setFont('Helvetica', 8)
        c.drawCentredString(W/2, y, 'VitaCoreX LLC is not a law firm and does not provide legal representation.')
        c.showPage()
        pn += 1

    c.save()
    print(f'  Generated: {out} ({pn - 1} pages)')


# ═══════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════
if __name__ == '__main__':
    print('VitaCoreX PDF Generator — Teal Brand Suite')
    print('=' * 50)
    generate_healthcare_cfo_brief()
    generate_lead_magnet()
    generate_precollection()
    generate_dental_deck()
    print('=' * 50)
    print('All PDFs generated successfully.')
