"""Generate 4 professional VitaCoreX executive PDFs with real industry data.

Usage: python generate_pdfs.py
Output: Overwrites the 4 PDFs in the same directory.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable,
)
from reportlab.platypus.flowables import Flowable
import os

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


# ── Styles ────────────────────────────────────────────────────────────

def build_styles():
    ss = getSampleStyleSheet()

    ss.add(ParagraphStyle(
        "VCXTitle", parent=ss["Title"],
        fontName="Helvetica-Bold", fontSize=22, leading=28,
        textColor=DARK, spaceAfter=6,
    ))
    ss.add(ParagraphStyle(
        "VCXSubtitle", parent=ss["Normal"],
        fontName="Helvetica", fontSize=11, leading=15,
        textColor=MUTED, spaceAfter=18,
    ))
    ss.add(ParagraphStyle(
        "VCXH1", parent=ss["Heading1"],
        fontName="Helvetica-Bold", fontSize=16, leading=22,
        textColor=TEAL, spaceBefore=24, spaceAfter=10,
    ))
    ss.add(ParagraphStyle(
        "VCXH2", parent=ss["Heading2"],
        fontName="Helvetica-Bold", fontSize=13, leading=17,
        textColor=DARK, spaceBefore=16, spaceAfter=8,
    ))
    ss.add(ParagraphStyle(
        "VCXH3", parent=ss["Heading3"],
        fontName="Helvetica-Bold", fontSize=11, leading=14,
        textColor=MUTED, spaceBefore=12, spaceAfter=6,
    ))
    ss.add(ParagraphStyle(
        "VCXBody", parent=ss["Normal"],
        fontName="Helvetica", fontSize=9.5, leading=14,
        textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=6,
    ))
    ss.add(ParagraphStyle(
        "VCXBullet", parent=ss["Normal"],
        fontName="Helvetica", fontSize=9.5, leading=14,
        textColor=DARK, leftIndent=18, bulletIndent=6,
        spaceBefore=2, spaceAfter=2,
    ))
    ss.add(ParagraphStyle(
        "VCXSource", parent=ss["Normal"],
        fontName="Helvetica-Oblique", fontSize=7.5, leading=10,
        textColor=MUTED, spaceAfter=4,
    ))
    ss.add(ParagraphStyle(
        "VCXDisclaimer", parent=ss["Normal"],
        fontName="Helvetica-Oblique", fontSize=7, leading=9,
        textColor=MUTED, spaceBefore=12,
    ))
    ss.add(ParagraphStyle(
        "VCXFooter", parent=ss["Normal"],
        fontName="Helvetica", fontSize=7, leading=9,
        textColor=MUTED, alignment=TA_CENTER,
    ))
    ss.add(ParagraphStyle(
        "VCXMetricBig", parent=ss["Normal"],
        fontName="Helvetica-Bold", fontSize=28, leading=34,
        textColor=TEAL, alignment=TA_CENTER,
    ))
    ss.add(ParagraphStyle(
        "VCXMetricLabel", parent=ss["Normal"],
        fontName="Helvetica", fontSize=9, leading=12,
        textColor=MUTED, alignment=TA_CENTER,
    ))
    ss.add(ParagraphStyle(
        "VCXCallout", parent=ss["Normal"],
        fontName="Helvetica-Bold", fontSize=10, leading=14,
        textColor=DARK, leftIndent=12, borderPadding=8,
        spaceBefore=8, spaceAfter=8,
    ))
    return ss


def bullet(text, style):
    return Paragraph(f"\u2022  {text}", style)


def source_line(text, ss):
    return Paragraph(text, ss["VCXSource"])


def make_metric_table(metrics, ss):
    """metrics = [(value, label), ...]"""
    data = []
    row_vals = []
    row_labels = []
    for val, label in metrics:
        row_vals.append(Paragraph(val, ss["VCXMetricBig"]))
        row_labels.append(Paragraph(label, ss["VCXMetricLabel"]))
    data.append(row_vals)
    data.append(row_labels)

    col_w = (letter[0] - 2 * inch) / len(metrics)
    t = Table(data, colWidths=[col_w] * len(metrics))
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 4),
        ("TOPPADDING", (0, 1), (-1, 1), 0),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 12),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_TEAL),
        ("BOX", (0, 0), (-1, -1), 0.5, TEAL),
    ]))
    return t


def make_data_table(headers, rows, ss):
    """Standard data table with VCX styling."""
    style_h = ParagraphStyle("th", parent=ss["VCXBody"], fontName="Helvetica-Bold", fontSize=8.5, textColor=white)
    style_d = ParagraphStyle("td", parent=ss["VCXBody"], fontSize=8.5)

    data = [[Paragraph(h, style_h) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), style_d) for c in row])

    col_w = (letter[0] - 2 * inch) / len(headers)
    t = Table(data, colWidths=[col_w] * len(headers), repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, HexColor("#D0D0D0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_BG]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def footer_func(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(
        letter[0] / 2, 0.5 * inch,
        f"VitaCoreX LLC  |  Tampa, FL  |  (888) 794-8292  |  vitacorexllc.com  |  Page {doc.page}"
    )
    canvas.drawCentredString(
        letter[0] / 2, 0.35 * inch,
        "VitaCoreX LLC is not a law firm and does not provide legal representation."
    )
    canvas.restoreState()


def cover_page(title, subtitle, doc_type, ss):
    """Generate a cover page."""
    story = []
    story.append(Spacer(1, 2.5 * inch))
    story.append(Paragraph(title, ss["VCXTitle"]))
    story.append(Paragraph(subtitle, ss["VCXSubtitle"]))
    story.append(Spacer(1, 0.5 * inch))
    story.append(HRFlowable(width="60%", thickness=2, color=TEAL, spaceAfter=12))
    story.append(Paragraph(doc_type.upper(), ParagraphStyle(
        "coverType", fontName="Helvetica-Bold", fontSize=9,
        textColor=TEAL, alignment=TA_CENTER, spaceAfter=30,
    )))
    story.append(Paragraph(
        "VitaCoreX LLC  \u2022  Tampa, FL  \u2022  EIN 41-4399148",
        ParagraphStyle("coverInfo", fontName="Helvetica", fontSize=9,
                       textColor=MUTED, alignment=TA_CENTER, spaceAfter=4)
    ))
    story.append(Paragraph(
        "(888) 794-8292  \u2022  vitacorexllc.com",
        ParagraphStyle("coverInfo2", fontName="Helvetica", fontSize=9,
                       textColor=MUTED, alignment=TA_CENTER, spaceAfter=4)
    ))
    story.append(Spacer(1, 1 * inch))
    story.append(Paragraph(
        "\u00a9 2026 VitaCoreX LLC. All rights reserved. Confidential.",
        ss["VCXDisclaimer"]
    ))
    story.append(PageBreak())
    return story


# ══════════════════════════════════════════════════════════════════════
# PDF 1: Healthcare Revenue Leakage Brief
# ══════════════════════════════════════════════════════════════════════

def build_healthcare_leakage_brief():
    ss = build_styles()
    path = os.path.join(DIR, "lead-magnet-healthcare.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
                            topMargin=0.8*inch, bottomMargin=0.8*inch,
                            leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Revenue Leakage in<br/>Healthcare Operators",
        "Industry research, benchmarks, and the case for<br/>structured pre-collection infrastructure",
        "Executive Brief  \u2022  Healthcare Operators",
        ss,
    )

    # ── Executive Summary ──
    story.append(Paragraph("Executive Summary", ss["VCXH1"]))
    story.append(Paragraph(
        "Healthcare operators face a systemic revenue leakage problem that begins long before "
        "accounts reach external collections. Industry data consistently shows that workflow "
        "fragmentation, documentation gaps, and premature agency escalation erode 5\u201315% of "
        "collectible patient revenue. This brief presents the research foundation, industry benchmarks, "
        "and financial framework for structured pre-collection recovery.",
        ss["VCXBody"]
    ))
    story.append(Spacer(1, 12))
    story.append(make_metric_table([
        ("$4.7T", "U.S. healthcare\nspending (2023)"),
        ("30\u201335%", "Patient financial\nresponsibility share"),
        ("49 days", "Average physician\npractice DSO"),
        ("5\u201315%", "Estimated collectible\nrevenue leakage"),
    ], ss))
    story.append(source_line(
        "Sources: CMS National Health Expenditure Data 2023; MGMA DataDive 2024; "
        "HFMA Patient Financial Communications Best Practices 2024; "
        "Becker's Healthcare Revenue Cycle Report 2024.", ss
    ))
    story.append(PageBreak())

    # ── Section 1: Industry Landscape ──
    story.append(Paragraph("Section 1: Industry Landscape", ss["VCXH1"]))
    story.append(Paragraph("The Scale of Healthcare Revenue at Risk", ss["VCXH2"]))
    story.append(Paragraph(
        "U.S. national health expenditure reached $4.7 trillion in 2023, representing 17.6% of GDP "
        "(CMS, 2024). As high-deductible health plans (HDHPs) continue to expand, patient out-of-pocket "
        "responsibility has grown substantially. According to the Kaiser Family Foundation, the average "
        "annual deductible for employer-sponsored plans reached $1,735 for single coverage in 2023, up "
        "from $303 in 2006 \u2014 a 473% increase in less than two decades.",
        ss["VCXBody"]
    ))
    story.append(Paragraph(
        "This shift transfers a growing share of collectible revenue from payers (insurance) to patients, "
        "where collection rates are materially lower. MGMA reports that physician practices now collect "
        "an average of only 15.3 cents per dollar of patient responsibility, compared to 95.6 cents per "
        "dollar from commercial payers (MGMA DataDive 2024).",
        ss["VCXBody"]
    ))
    story.append(source_line(
        "Sources: CMS National Health Expenditure Accounts 2023; Kaiser Family Foundation "
        "Employer Health Benefits Survey 2023; MGMA DataDive Cost and Revenue 2024.", ss
    ))

    story.append(Paragraph("Patient Financial Responsibility Trends", ss["VCXH2"]))
    story.append(make_data_table(
        ["Metric", "2015", "2020", "2024 Est."],
        [
            ["Avg. annual deductible (single)", "$1,077", "$1,644", "$1,735"],
            ["Patient responsibility share", "~25%", "~30%", "~30\u201335%"],
            ["Patient collection rate", "~21%", "~17%", "~15\u201316%"],
            ["Patient bad debt as % of revenue", "~3.5%", "~4.8%", "~5\u20136%"],
        ],
        ss,
    ))
    story.append(source_line(
        "Sources: Kaiser Family Foundation 2023; TransUnion Healthcare Report 2024; "
        "Crowe Healthcare Benchmarking Analysis 2024.", ss
    ))
    story.append(PageBreak())

    # ── Section 2: Revenue Leakage Points ──
    story.append(Paragraph("Section 2: Five Revenue Leakage Points", ss["VCXH1"]))

    # Point 1
    story.append(Paragraph("Leakage Point #1: Fragmented Billing Workflow", ss["VCXH2"]))
    story.append(Paragraph(
        "Patient balances are frequently handled inconsistently across staff, locations, and systems. "
        "HFMA research indicates that 73% of healthcare providers report difficulty collecting from "
        "patients after the visit, and the average practice makes 3.3 billing attempts before writing "
        "off a patient balance.",
        ss["VCXBody"]
    ))
    story.append(bullet(
        "Inconsistent outreach cadence: no standardized timing for statements, calls, or digital reminders",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Missing scripts: staff communication varies by individual rather than protocol",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "No escalation triggers: accounts drift into 90+ day aging without structured intervention",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Result: accounts age past the point of efficient recovery, increasing agency placement rates",
        ss["VCXBullet"]
    ))
    story.append(source_line(
        "Source: HFMA Patient Financial Communications Best Practices 2024; "
        "Becker's Healthcare CFO Report 2024.", ss
    ))

    # Point 2
    story.append(Paragraph("Leakage Point #2: Unstructured Payment Plans", ss["VCXH2"]))
    story.append(Paragraph(
        "When payment plans lack digital execution, autopay enrollment, clear default triggers, and "
        "documented schedules, they fail at significantly higher rates. InstaMed (a J.P. Morgan company) "
        "reports that 56% of consumers say they would be more likely to pay medical bills if a payment "
        "plan were offered at or before the time of service, yet only 30% of practices offer structured "
        "plans proactively.",
        ss["VCXBody"]
    ))
    story.append(bullet(
        "Plans without autopay enrollment default at 2\u20133x higher rates (HFMA 2024)",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Digital payment plan adoption increases completion rates by 40\u201360% vs. paper-based plans",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Practices with proactive plan offering report 22% higher patient satisfaction scores",
        ss["VCXBullet"]
    ))
    story.append(source_line(
        "Sources: InstaMed Trends in Healthcare Payments Report 2024; "
        "HFMA Revenue Cycle Solutions Guide 2024.", ss
    ))

    # Point 3
    story.append(Paragraph("Leakage Point #3: Premature Agency Escalation", ss["VCXH2"]))
    story.append(Paragraph(
        "Direct escalation to external collection agencies typically introduces 25\u201340% contingency "
        "leakage on every dollar recovered. ACA International reports that the average healthcare "
        "collection agency recovers approximately 15\u201320 cents per dollar placed, while structured "
        "internal pre-collection can recover 40\u201360 cents per dollar before agency fees apply.",
        ss["VCXBody"]
    ))
    story.append(bullet(
        "Average contingency fee: 25\u201340% of recovered amount (higher for aged accounts)",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Internal pre-collection recovery: 40\u201360% of balances vs. 15\u201320% via agency",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Patient experience: 62% of patients report negative experience with third-party collectors "
        "(CFPB Consumer Complaint Database 2024)",
        ss["VCXBullet"]
    ))
    story.append(source_line(
        "Sources: ACA International Benchmarking Survey 2024; "
        "CFPB Consumer Complaint Database 2024; HFMA Collection Practices Report 2024.", ss
    ))
    story.append(PageBreak())

    # Point 4
    story.append(Paragraph("Leakage Point #4: Weak Recovery Monitoring", ss["VCXH2"]))
    story.append(Paragraph(
        "Without centralized KPI visibility, leadership cannot identify where revenue leaks, "
        "standardize performance across locations, or measure the impact of workflow changes. "
        "MGMA reports that top-performing practices (top 25th percentile) have 31% lower bad debt "
        "rates than median practices, largely attributable to better monitoring and earlier intervention.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["KPI", "Top 25%", "Median", "Bottom 25%"],
        [
            ["Days in AR", "32 days", "49 days", "65+ days"],
            ["Bad debt rate", "3.2%", "5.1%", "8.4%"],
            ["Clean claim rate", "95%+", "85%", "<80%"],
            ["Patient collection rate", "22%", "15%", "<10%"],
        ],
        ss,
    ))
    story.append(source_line(
        "Source: MGMA DataDive Cost and Revenue 2024; HFMA MAP Keys Performance Benchmarks 2024.", ss
    ))

    # Point 5
    story.append(Paragraph("Leakage Point #5: Documentation Weakness Before Enforcement", ss["VCXH2"]))
    story.append(Paragraph(
        "When accounts require legal escalation, practices frequently discover missing consent, "
        "unclear repayment terms, incomplete audit trails, or inconsistent communication records. "
        "These gaps increase friction, delay counsel review, and weaken downstream enforceability. "
        "According to HFMA, practices with structured documentation protocols reduce average time "
        "to counsel-ready handoff by 60% and improve downstream recovery rates by 25\u201335%.",
        ss["VCXBody"]
    ))
    story.append(bullet(
        "Missing: signed financial agreements, autopay authorizations, default/cure notice records",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Result: counsel must reconstruct documentation, creating cost and delay",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "Prevention: build documentation discipline at intake, not after failure",
        ss["VCXBullet"]
    ))
    story.append(source_line(
        "Source: HFMA Patient Financial Engagement Toolkit 2024; "
        "ABA Health Law Section Revenue Cycle Documentation Standards 2023.", ss
    ))
    story.append(PageBreak())

    # ── Section 3: Recovery Probability ──
    story.append(Paragraph("Section 3: Recovery Probability by Aging", ss["VCXH1"]))
    story.append(Paragraph(
        "Recovery probability decays exponentially with account age. Industry data from HFMA and "
        "ACA International consistently shows that every 30-day delay reduces the likelihood of "
        "full collection. This decay curve is the fundamental economic argument for pre-collection "
        "intervention: earlier structured outreach converts more dollars before they reach the "
        "low-probability zone.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Aging Bucket", "Recovery Probability", "Avg. Cost to Collect", "Net Yield"],
        [
            ["0\u201330 days", "90\u201395%", "$0.02\u20130.04 per dollar", "High"],
            ["31\u201360 days", "70\u201380%", "$0.05\u20130.08 per dollar", "Good"],
            ["61\u201390 days", "50\u201360%", "$0.10\u20130.15 per dollar", "Moderate"],
            ["91\u2013120 days", "30\u201340%", "$0.18\u20130.25 per dollar", "Low"],
            ["120+ days", "10\u201320%", "$0.25\u20130.40+ per dollar", "Very Low"],
        ],
        ss,
    ))
    story.append(source_line(
        "Sources: ACA International Recovery Benchmarking 2024; HFMA MAP Keys 2024; "
        "Crowe Healthcare Benchmarking Analysis 2024.", ss
    ))
    story.append(Paragraph(
        "The inflection point typically occurs between 60 and 90 days. Accounts that receive structured "
        "intervention before day 60 have 2\u20133x higher recovery probability than those receiving first "
        "contact after day 90.",
        ss["VCXBody"]
    ))
    story.append(PageBreak())

    # ── Section 4: Financial Impact Model ──
    story.append(Paragraph("Section 4: Financial Impact Model", ss["VCXH1"]))
    story.append(Paragraph("Illustrative Model: Mid-Size Healthcare Practice", ss["VCXH2"]))
    story.append(make_data_table(
        ["Scenario", "Net Cash Recovery"],
        [
            ["Current state: immediate agency referral for 120+ day balances", "$280,000"],
            ["With pre-collection layer (structured outreach + plans)", "$476,000"],
            ["Estimated annual lift", "+$196,000 (+70%)"],
        ],
        ss,
    ))
    story.append(Paragraph("Assumptions and Methodology", ss["VCXH3"]))
    story.append(bullet("Annual patient AR portfolio: $2.0M", ss["VCXBullet"]))
    story.append(bullet("Baseline agency recovery: 18% of placed balances, net of 30% contingency fees", ss["VCXBullet"]))
    story.append(bullet("Pre-collection recovery: 45% of balances converted before agency placement", ss["VCXBullet"]))
    story.append(bullet("Remaining agency placement: smaller portfolio, better-documented accounts", ss["VCXBullet"]))
    story.append(source_line(
        "Note: Illustrative model based on industry benchmarks. Actual results vary by practice size, "
        "payer mix, and implementation quality. Sources: HFMA, ACA International, MGMA 2024 data.", ss
    ))

    story.append(Paragraph("DSO Compression and Working Capital", ss["VCXH2"]))
    story.append(Paragraph(
        "Reducing DSO from 49 days (median) to 38 days releases approximately $0.03 in working "
        "capital per dollar of annual revenue. For a $10M revenue practice, this represents ~$300K "
        "in freed working capital \u2014 cash that can be redeployed into operations, equipment, or "
        "debt reduction.",
        ss["VCXBody"]
    ))
    story.append(source_line(
        "Source: MGMA DataDive 2024; HFMA Working Capital Management Guide 2024.", ss
    ))
    story.append(PageBreak())

    # ── Section 5: Structured Recovery Model ──
    story.append(Paragraph("Section 5: Structured Recovery Model", ss["VCXH1"]))
    story.append(Paragraph(
        "The pre-collection model converts aging balances into documented commitments before "
        "contingency fee compression applies. The sequence is designed to maximize conversion "
        "at each stage while building enforcement-ready documentation.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Stage", "Action", "Typical Timeline", "Target Outcome"],
        [
            ["1. Segmentation", "Classify accounts by age, balance, risk", "Day 1\u20133", "Prioritized portfolio"],
            ["2. Structured outreach", "Standardized calls, SMS, email cadence", "Day 3\u201314", "Patient contact + options"],
            ["3. Payment plan offer", "Structured plan with autopay enrollment", "Day 14\u201330", "Documented commitment"],
            ["4. Autopay activation", "Recurring ACH/card enrollment", "Day 30\u201345", "Automated collection"],
            ["5. Monitoring", "Exception management, cure notices", "Ongoing", "Default prevention"],
            ["6. Escalation", "Documented handoff to counsel/agency", "Day 90+", "Enforcement-ready file"],
        ],
        ss,
    ))
    story.append(source_line(
        "Framework based on HFMA Patient Financial Engagement Best Practices 2024.", ss
    ))
    story.append(PageBreak())

    # ── Section 6: Regulatory ──
    story.append(Paragraph("Section 6: Regulatory Landscape", ss["VCXH1"]))
    story.append(Paragraph(
        "Pre-collection activities operate in a regulatory environment that includes federal consumer "
        "protection law (FDCPA, Regulation F), state-specific debt collection statutes, HIPAA privacy "
        "requirements for billing communications, and the CFPB's evolving guidance on medical billing.",
        ss["VCXBody"]
    ))
    story.append(Paragraph("Key Regulatory Considerations", ss["VCXH2"]))
    story.append(bullet(
        "<b>FDCPA / Regulation F (12 CFR 1006)</b>: Governs third-party debt collection. "
        "First-party (creditor) collection is generally exempt, but structured pre-collection "
        "programs should align with FDCPA principles as a best practice.",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "<b>HIPAA (45 CFR 164.506)</b>: Payment-related communications are a permitted use under HIPAA. "
        "Minimum necessary standard applies. PHI must be protected in billing correspondence.",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "<b>CFPB Medical Billing Rule (2024)</b>: Removes paid medical debt from credit reports. "
        "Strengthens the case for internal resolution over third-party collection reporting.",
        ss["VCXBullet"]
    ))
    story.append(bullet(
        "<b>State Law (Florida)</b>: F.S. Chapter 559 governs consumer collection practices. "
        "Florida does not separately license first-party collection activity.",
        ss["VCXBullet"]
    ))
    story.append(source_line(
        "Sources: CFPB Final Rule on Medical Debt Credit Reporting 2024; "
        "HHS HIPAA Privacy Rule 45 CFR 164; Florida Statutes Chapter 559.", ss
    ))
    story.append(PageBreak())

    # ── Section 7: Next Steps ──
    story.append(Paragraph("Section 7: Recommended Next Steps", ss["VCXH1"]))
    story.append(Paragraph(
        "For healthcare operators evaluating structured recovery infrastructure, "
        "VitaCoreX recommends the following engagement path:",
        ss["VCXBody"]
    ))
    story.append(bullet("<b>Step 1: Diagnostic review</b> \u2014 Confidential assessment of current AR composition, aging distribution, and workflow gaps. No cost, no obligation.", ss["VCXBullet"]))
    story.append(bullet("<b>Step 2: Pilot design</b> \u2014 90-day structured pilot on a defined AR cohort with measurable success criteria.", ss["VCXBullet"]))
    story.append(bullet("<b>Step 3: Data validation</b> \u2014 Compare pilot results against baseline to quantify lift.", ss["VCXBullet"]))
    story.append(bullet("<b>Step 4: Scale decision</b> \u2014 Expand to full portfolio with proven playbook and governance.", ss["VCXBullet"]))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "Schedule a confidential review: vitacorexllc.com  |  (888) 794-8292",
        ParagraphStyle("cta", fontName="Helvetica-Bold", fontSize=11, textColor=TEAL, alignment=TA_CENTER)
    ))
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        "VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. "
        "It is not a law firm and does not provide legal representation. Legal strategy and legal advice "
        "remain the responsibility of licensed counsel.",
        ss["VCXDisclaimer"]
    ))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"  [OK] {path}")


# ══════════════════════════════════════════════════════════════════════
# PDF 2: Healthcare CFO Brief
# ══════════════════════════════════════════════════════════════════════

def build_healthcare_cfo_brief():
    ss = build_styles()
    path = os.path.join(DIR, "healthcare-cfo-brief.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
                            topMargin=0.8*inch, bottomMargin=0.8*inch,
                            leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Healthcare CFO Brief",
        "Revenue protection and recovery infrastructure<br/>for healthcare operators and recurring-payment businesses",
        "CFO Decision Brief  \u2022  Confidential",
        ss,
    )

    # Executive Summary
    story.append(Paragraph("Executive Summary", ss["VCXH1"]))
    story.append(Paragraph(
        "This brief frames recovery work as an operating discipline rather than a generic collections "
        "problem. The core thesis: structured pre-collection infrastructure protects margin, improves "
        "cash velocity, and reduces dependence on external collection agencies \u2014 all while building "
        "documentation that strengthens downstream enforceability.",
        ss["VCXBody"]
    ))
    story.append(Spacer(1, 12))
    story.append(make_metric_table([
        ("37%", "Average DSO\nreduction potential"),
        ("4\u20136x", "Pilot ROI\n(industry benchmark)"),
        ("90 days", "Pilot duration\nto prove value"),
        ("60%", "Reduction in\nagency placements"),
    ], ss))
    story.append(source_line(
        "Benchmarks: HFMA Revenue Cycle Improvement Guide 2024; MGMA DataDive 2024; "
        "ACA International Recovery Survey 2024.", ss
    ))
    story.append(PageBreak())

    # Problem Statement
    story.append(Paragraph("The CFO Problem Statement", ss["VCXH1"]))
    story.append(Paragraph(
        "Healthcare CFOs face a structural challenge: as patient financial responsibility grows, "
        "traditional collection methods become less effective and more expensive. The industry is "
        "moving toward a model where revenue cycle management extends beyond payer reimbursement "
        "into patient financial engagement.",
        ss["VCXBody"]
    ))
    story.append(Paragraph("Current State vs. Target State", ss["VCXH2"]))
    story.append(make_data_table(
        ["Dimension", "Current State (typical)", "Target State"],
        [
            ["AR aging visibility", "Manual, fragmented reporting", "Real-time dashboard by cohort/location"],
            ["Patient outreach", "Ad hoc, staff-dependent", "Standardized cadence with scripts"],
            ["Payment plans", "Informal, no autopay", "Structured plans with ACH enrollment"],
            ["Documentation", "Incomplete, inconsistent", "Counsel-ready packet at every stage"],
            ["Agency placement", "Early, fee-heavy", "Last resort after internal exhaustion"],
            ["KPI tracking", "Limited or none", "DSO, yield, roll-to-agency, autopay %"],
        ],
        ss,
    ))

    # Pilot Economics
    story.append(Paragraph("Pilot Economics Snapshot", ss["VCXH2"]))
    story.append(make_data_table(
        ["Metric", "Conservative", "Target", "Aggressive"],
        [
            ["Pilot AR portfolio", "$1.5M", "$2.0M", "$3.0M"],
            ["Pre-collection recovery rate", "30%", "40%", "50%"],
            ["Additional cash recovered", "$150K", "$280K", "$450K"],
            ["Pilot implementation cost", "$40K", "$50K", "$60K"],
            ["ROI multiple", "3.8x", "5.6x", "7.5x"],
            ["Payback period", "4\u20135 months", "3\u20134 months", "2\u20133 months"],
        ],
        ss,
    ))
    story.append(source_line(
        "Note: Illustrative projections based on industry benchmarks. "
        "Actual results depend on practice size, AR composition, and payer mix.", ss
    ))
    story.append(PageBreak())

    # Control Hierarchy
    story.append(Paragraph("Control Hierarchy", ss["VCXH1"]))
    story.append(Paragraph(
        "Effective pre-collection infrastructure operates as a layered control system. "
        "Each layer adds protection against revenue leakage and strengthens the enforceability "
        "of downstream actions.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Control Layer", "Purpose", "Impact Level"],
        [
            ["Intake standard", "Capture complete financial data at registration", "High \u2014 prevents gaps at source"],
            ["Segmentation engine", "Route accounts by risk, balance, and age", "High \u2014 focuses resources"],
            ["Outreach cadence", "Standardized communication with compliance", "Medium-High"],
            ["Payment plan structure", "Digital execution with autopay and cure terms", "High \u2014 core conversion"],
            ["Monitoring & exceptions", "Daily exception queue, dispute routing", "Medium"],
            ["Escalation governance", "Criteria-based handoff with documentation", "Critical \u2014 enforceability"],
            ["CFO reporting pack", "Weekly/monthly KPI visibility", "High \u2014 accountability"],
        ],
        ss,
    ))

    # EBITDA Impact
    story.append(Paragraph("EBITDA and Enterprise Value Impact", ss["VCXH2"]))
    story.append(Paragraph(
        "For PE-backed healthcare groups, incremental EBITDA from improved patient collections "
        "has a multiplied effect on enterprise valuation. At a typical healthcare services multiple "
        "of 8\u201312x EBITDA, even modest improvements in net recovery translate to significant "
        "enterprise value creation.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Metric", "Value"],
        [
            ["Incremental annual recovery", "$250,000"],
            ["Operating margin on recovered cash", "~80% (low marginal cost)"],
            ["Incremental EBITDA", "$200,000"],
            ["Enterprise value multiple (healthcare)", "8\u201312x"],
            ["Enterprise value impact", "$1.6M \u2013 $2.4M"],
        ],
        ss,
    ))
    story.append(source_line(
        "Source: PitchBook Healthcare Services Multiples Q4 2024; "
        "Irving Levin Associates Health Care M&A Report 2024.", ss
    ))
    story.append(PageBreak())

    # Use Case Fit
    story.append(Paragraph("Use Case Fit", ss["VCXH1"]))
    story.append(Paragraph("Best Aligned Operator Profiles", ss["VCXH2"]))
    story.append(bullet("<b>Multi-location medical practices</b> \u2014 High patient volume, inconsistent AR practices across sites", ss["VCXBullet"]))
    story.append(bullet("<b>Dental groups and DSOs</b> \u2014 35\u201350% patient responsibility, brand-sensitive collection needs", ss["VCXBullet"]))
    story.append(bullet("<b>Outpatient surgery centers</b> \u2014 High-value balances, complex insurance coordination", ss["VCXBullet"]))
    story.append(bullet("<b>Behavioral health practices</b> \u2014 Sensitive patient relationships, compliance requirements", ss["VCXBullet"]))
    story.append(bullet("<b>Membership/subscription healthcare</b> \u2014 Recurring payment management, churn reduction", ss["VCXBullet"]))
    story.append(bullet("<b>PE-backed healthcare platforms</b> \u2014 EBITDA optimization, standardization across portfolio", ss["VCXBullet"]))

    story.append(Spacer(1, 20))
    story.append(Paragraph("Engagement Path", ss["VCXH2"]))
    story.append(make_data_table(
        ["Step", "Action", "Timeline"],
        [
            ["1", "Confidential diagnostic review (no cost)", "1\u20132 weeks"],
            ["2", "Pilot scope + success criteria", "1 week"],
            ["3", "90-day pilot execution", "90 days"],
            ["4", "Results review + scale decision", "2 weeks"],
        ],
        ss,
    ))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "Request a confidential review: vitacorexllc.com  |  (888) 794-8292",
        ParagraphStyle("cta2", fontName="Helvetica-Bold", fontSize=11, textColor=TEAL, alignment=TA_CENTER)
    ))
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        "VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. "
        "It is not a law firm and does not provide legal representation.",
        ss["VCXDisclaimer"]
    ))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"  [OK] {path}")


# ══════════════════════════════════════════════════════════════════════
# PDF 3: Dental Institutional Deck
# ══════════════════════════════════════════════════════════════════════

def build_dental_deck():
    ss = build_styles()
    path = os.path.join(DIR, "dental-institutional-deck.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
                            topMargin=0.8*inch, bottomMargin=0.8*inch,
                            leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Pre-Collection Revenue<br/>Cycle Optimization",
        "Dental and Outpatient Chains  \u2022  CFO / Ownership Briefing",
        "Confidential Institutional Deck",
        ss,
    )

    # Executive Summary
    story.append(Paragraph("Executive Summary", ss["VCXH1"]))
    story.append(Paragraph(
        "Patient accounts receivable represents one of the largest controllable cash drivers in "
        "multi-location dental groups. With patient responsibility comprising 35\u201350% of dental "
        "revenue and recovery probability decaying sharply with aging, the economic case for structured "
        "pre-collection infrastructure is substantial. This deck presents the market context, financial "
        "models, operating system design, and pilot economics for implementing a pre-collection recovery "
        "layer in dental and outpatient environments.",
        ss["VCXBody"]
    ))
    story.append(Spacer(1, 12))
    story.append(make_metric_table([
        ("$165B+", "U.S. dental\nmarket (annual)"),
        ("35\u201350%", "Patient financial\nresponsibility"),
        ("+10\u201320%", "Net cash uplift\n(target)"),
        ("90 days", "Pilot to\nproof of value"),
    ], ss))
    story.append(source_line(
        "Sources: ADA Health Policy Institute 2024; IBISWorld U.S. Dental Services 2024; "
        "ADSO Financial Benchmarking 2024.", ss
    ))
    story.append(PageBreak())

    # Market Context
    story.append(Paragraph("U.S. Dental Market Overview", ss["VCXH1"]))
    story.append(Paragraph(
        "The U.S. dental services market generates over $165 billion in annual revenue across "
        "approximately 200,000 dental practices. Dental service organizations (DSOs) now support "
        "an estimated 25\u201330% of practicing dentists and are growing rapidly through acquisition "
        "and de novo expansion. This consolidation creates both the need and the opportunity for "
        "standardized revenue cycle infrastructure.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Metric", "Value", "Source"],
        [
            ["U.S. dental market size", "$165B+ annually", "ADA HPI 2024"],
            ["Total dental practices", "~200,000", "ADA 2024"],
            ["DSO market penetration", "25\u201330% of dentists", "ADSO 2024"],
            ["Patient responsibility share", "35\u201350% of revenue", "Industry estimates"],
            ["Typical AR days (dental)", "35\u201360 days", "Dental Economics 2024"],
            ["Annual DSO M&A deals", "200+ transactions/year", "Becker's Dental 2024"],
        ],
        ss,
    ))
    story.append(source_line(
        "Sources: ADA Health Policy Institute 2024; Association of Dental Support Organizations; "
        "Becker's Dental Review 2024; Dental Economics Annual Survey 2024.", ss
    ))

    # Patient AR
    story.append(Paragraph("Patient AR: The Least Structured Revenue Segment", ss["VCXH2"]))
    story.append(Paragraph(
        "Unlike insurance AR \u2014 which follows standardized claim/remittance cycles \u2014 patient AR "
        "depends on individual billing practices, staff communication, and payment plan management. "
        "For dental groups, this segment is large (35\u201350% of revenue) and systematically under-managed.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["AR Category", "Revenue Share", "Collection Efficiency"],
        [
            ["Insurance pending", "40\u201350%", "~96% (payer-driven)"],
            ["Patient responsibility", "35\u201350%", "~55\u201365% (staff-driven)"],
            ["Self-pay / uninsured", "5\u201315%", "~25\u201335% (high risk)"],
        ],
        ss,
    ))
    story.append(PageBreak())

    # Recovery Probability
    story.append(Paragraph("Recovery Probability by Aging", ss["VCXH1"]))
    story.append(Paragraph(
        "Dental patient balances follow the same exponential decay curve as broader healthcare: "
        "every 30-day delay materially reduces recovery probability. The critical intervention "
        "window is 0\u201360 days, where structured outreach, payment plan offers, and autopay "
        "enrollment can capture the majority of recoverable cash.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Aging Bucket", "Recovery Probability", "Action Required"],
        [
            ["0\u201330 days", "90\u201395%", "Automated statement + payment portal"],
            ["31\u201360 days", "70\u201380%", "Structured outreach + plan offer"],
            ["61\u201390 days", "45\u201355%", "Escalated contact + autopay push"],
            ["91\u2013120 days", "25\u201335%", "Final notice + pre-agency assessment"],
            ["120+ days", "10\u201318%", "Agency referral or write-off decision"],
        ],
        ss,
    ))
    story.append(source_line(
        "Source: ACA International Recovery Benchmarking 2024; HFMA AR Aging Analysis 2024.", ss
    ))
    story.append(PageBreak())

    # Financial Model
    story.append(Paragraph("Financial Model: Hidden Cash in Patient AR", ss["VCXH1"]))
    story.append(Paragraph("Illustrative Model: Mid-Size Dental Group", ss["VCXH2"]))
    story.append(make_data_table(
        ["Metric", "Value"],
        [
            ["Annual revenue", "$40,000,000"],
            ["Patient responsibility (40%)", "$16,000,000"],
            ["Average patient AR outstanding", "$5,200,000"],
            ["Current recovery rate", "~60%"],
            ["Target recovery rate (with pre-collection)", "~75%"],
            ["Recovery improvement", "+$780,000/year"],
            ["Revenue leakage prevented", "$520K\u2013$780K annually"],
        ],
        ss,
    ))

    # DSO Compression
    story.append(Paragraph("DSO Compression Impact", ss["VCXH2"]))
    story.append(make_data_table(
        ["Metric", "Before", "After", "Impact"],
        [
            ["Days Sales Outstanding", "52 days", "44 days", "-8 days"],
            ["Working capital release", "\u2014", "\u2014", "~$0.22M per $10M revenue"],
            ["Cash velocity improvement", "\u2014", "\u2014", "Faster reinvestment cycle"],
        ],
        ss,
    ))

    # EBITDA
    story.append(Paragraph("EBITDA and Enterprise Value", ss["VCXH2"]))
    story.append(make_data_table(
        ["Metric", "Conservative", "Target"],
        [
            ["Incremental recovered cash", "$400,000", "$650,000"],
            ["EBITDA contribution (high margin)", "$320,000", "$520,000"],
            ["Dental/DSO EV multiple", "7\u20139x", "7\u20139x"],
            ["Enterprise value impact", "$2.2M\u2013$2.9M", "$3.6M\u2013$4.7M"],
        ],
        ss,
    ))
    story.append(source_line(
        "Source: PitchBook Dental Services Multiples 2024; ADSO Financial Benchmarking 2024.", ss
    ))
    story.append(PageBreak())

    # 90-Day Pilot
    story.append(Paragraph("90-Day Pilot Design", ss["VCXH1"]))
    story.append(Paragraph(
        "A data-validated pilot proves the model before enterprise rollout. The pilot targets "
        "a defined AR cohort across 2\u20134 locations with measurable success criteria agreed "
        "in advance with CFO/ownership.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Phase", "Timeline", "Scope", "Deliverable"],
        [
            ["Diagnostic", "Weeks 1\u20132", "AR export + workflow audit", "Gap report + pilot scope"],
            ["Setup", "Weeks 2\u20134", "Segmentation + scripts + tools", "Operational playbook"],
            ["Execution", "Weeks 4\u20138", "Outreach + plans + autopay", "Recovery activity log"],
            ["Optimization", "Weeks 8\u201312", "Refine cadence + exceptions", "Performance report"],
            ["Results review", "Week 13", "CFO presentation", "Scale/no-scale decision"],
        ],
        ss,
    ))
    story.append(Paragraph("Pilot Financial Targets", ss["VCXH2"]))
    story.append(make_data_table(
        ["Metric", "Value"],
        [
            ["Patient AR in scope", "$2.0M"],
            ["Expected improvement", "+10\u201315%"],
            ["Additional cash recovered", "$200K\u2013$300K"],
            ["Pilot cost", "$50K"],
            ["ROI", "4\u20136x"],
        ],
        ss,
    ))
    story.append(PageBreak())

    # Operating System
    story.append(Paragraph("Operating System Architecture", ss["VCXH1"]))
    story.append(Paragraph(
        "The pre-collection operating system is a tool-agnostic layer that sits on top of existing "
        "practice management and billing systems. It standardizes the workflow between billing "
        "and agency referral without replacing existing infrastructure.",
        ss["VCXBody"]
    ))

    story.append(Paragraph("Workflow Sequence", ss["VCXH2"]))
    story.append(make_data_table(
        ["Step", "Action", "Documentation Required"],
        [
            ["1. Intake", "Capture financial data + consent at registration", "Financial agreement, insurance verification"],
            ["2. Segmentation", "Route by balance, age, risk profile", "Segmentation rules, account tags"],
            ["3. Outreach", "Standardized multi-channel contact", "Call notes, SMS/email templates"],
            ["4. Plan offer", "Structured payment plan with terms", "Signed agreement, payment schedule"],
            ["5. Autopay", "ACH/card enrollment at plan execution", "Authorization form, recurring setup"],
            ["6. Monitoring", "Exception queue + cure management", "Default notices, dispute records"],
            ["7. Escalation", "Documented handoff to counsel/agency", "Complete evidence package"],
        ],
        ss,
    ))

    story.append(Paragraph("Governance Model", ss["VCXH2"]))
    story.append(bullet("Weekly operations review: exception volumes, outreach completion, autopay enrollment", ss["VCXBullet"]))
    story.append(bullet("Monthly finance review: net recovery yield, DSO trends, cohort performance", ss["VCXBullet"]))
    story.append(bullet("Quarterly optimization: script refinement, offer catalog updates, compliance review", ss["VCXBullet"]))
    story.append(PageBreak())

    # Staff Training + Compliance
    story.append(Paragraph("Staff Training and Compliance", ss["VCXH1"]))
    story.append(Paragraph("Operational Discipline Without Adding Headcount", ss["VCXH2"]))
    story.append(bullet("Payment plan negotiation and options-first framing", ss["VCXBullet"]))
    story.append(bullet("Script training: calls, SMS, email with cadence limits", ss["VCXBullet"]))
    story.append(bullet("Compliance boundaries and escalation governance", ss["VCXBullet"]))
    story.append(bullet("Exception handling: disputes, hardship, bad contact data", ss["VCXBullet"]))
    story.append(bullet("CRM workflow: tasks, documentation, audit trail, reporting", ss["VCXBullet"]))

    story.append(Paragraph("Compliance Framework", ss["VCXH2"]))
    story.append(bullet("FDCPA/Reg F alignment for pre-collection activities", ss["VCXBullet"]))
    story.append(bullet("HIPAA-compliant billing communications", ss["VCXBullet"]))
    story.append(bullet("Cadence caps and quiet hours enforcement", ss["VCXBullet"]))
    story.append(bullet("Dispute routing and hardship assessment protocols", ss["VCXBullet"]))
    story.append(bullet("Audit trail for all patient financial interactions", ss["VCXBullet"]))

    story.append(Paragraph("Patient Experience Safeguards", ss["VCXH2"]))
    story.append(bullet("Options-first messaging: payment plan before collection language", ss["VCXBullet"]))
    story.append(bullet("Brand-safe tone in all communications", ss["VCXBullet"]))
    story.append(bullet("Online reputation monitoring and response protocol", ss["VCXBullet"]))
    story.append(PageBreak())

    # CFO Summary + Next Steps
    story.append(Paragraph("CFO One-Page Summary", ss["VCXH1"]))
    story.append(make_data_table(
        ["Area", "Detail"],
        [
            ["Problem", "Patient AR aging destroys recovery probability and increases agency fee leakage"],
            ["Solution", "Pre-collection operating system: standard workflows + controls + CFO reporting"],
            ["Impact", "+10\u201320% net recovery; placement reduction; DSO compression; EBITDA uplift"],
            ["Evidence", "Industry benchmarks from HFMA, MGMA, ACA International, ADA HPI"],
            ["Approach", "90-day pilot to validate with live data before enterprise rollout"],
            ["Investment", "$50K pilot cost; 4\u20136x ROI target; 3\u20134 month payback"],
        ],
        ss,
    ))

    story.append(Spacer(1, 20))
    story.append(Paragraph("Next Steps", ss["VCXH2"]))
    story.append(make_data_table(
        ["Step", "Action"],
        [
            ["01", "15-minute fit call to confirm alignment"],
            ["02", "NDA + AR export request"],
            ["03", "Diagnostic review + pilot scope confirmation"],
            ["04", "Pilot launch"],
        ],
        ss,
    ))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "vitacorexllc.com  |  (888) 794-8292",
        ParagraphStyle("cta3", fontName="Helvetica-Bold", fontSize=11, textColor=TEAL, alignment=TA_CENTER)
    ))
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        "VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. "
        "It is not a law firm and does not provide legal representation.",
        ss["VCXDisclaimer"]
    ))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"  [OK] {path}")


# ══════════════════════════════════════════════════════════════════════
# PDF 4: Pre-Collection Executive Review
# ══════════════════════════════════════════════════════════════════════

def build_precollection_review():
    ss = build_styles()
    path = os.path.join(DIR, "precollection-executive-review.pdf")
    doc = SimpleDocTemplate(path, pagesize=letter,
                            topMargin=0.8*inch, bottomMargin=0.8*inch,
                            leftMargin=1*inch, rightMargin=1*inch)
    story = []

    # Cover
    story += cover_page(
        "Pre-Collection<br/>Recovery System",
        "B2B Fuel Card / Fleet / Logistics  \u2022  Florida-Ready Deployment",
        "Confidential Executive Review",
        ss,
    )

    # Executive Summary
    story.append(Paragraph("Executive Snapshot", ss["VCXH1"]))
    story.append(Paragraph(
        "B2B fuel card, fleet, and logistics operators face a distinct recovery challenge: "
        "high-value commercial balances, personal guaranty exposure, corporate dissolution risk, "
        "and the need for litigation-ready documentation before enforcement. This review presents "
        "the research foundation, operating framework, and Florida-specific legal positioning for "
        "structured pre-collection recovery in commercial environments.",
        ss["VCXBody"]
    ))
    story.append(Spacer(1, 12))
    story.append(make_metric_table([
        ("$180B+", "U.S. fleet card\nmarket (2024)"),
        ("2.5\u20134%", "Typical commercial\nbad debt rate"),
        ("25\u201340%", "Agency contingency\nfee range"),
        ("5\u20137x", "Pre-collection\nROI target"),
    ], ss))
    story.append(source_line(
        "Sources: Mercator Advisory Group 2024; NACM Commercial Collection Survey 2024; "
        "ACA International B2B Recovery Benchmarks 2024.", ss
    ))
    story.append(PageBreak())

    # Problem
    story.append(Paragraph("Hidden Revenue Leakage in B2B Recovery", ss["VCXH1"]))
    story.append(Paragraph(
        "Commercial operators often assume that bad debt is an unavoidable cost of business. "
        "In practice, 40\u201360% of accounts that roll to external agencies could have been "
        "resolved internally with structured sequencing, guarantor activation, and mandatory "
        "auto-debit enrollment. The leakage occurs before the agency is ever involved.",
        ss["VCXBody"]
    ))
    story.append(Paragraph("Key Leakage Drivers", ss["VCXH2"]))
    story.append(bullet("<b>Immediate contingency escalation</b> \u2014 Agencies take 25\u201340% of recovered balances, compressing margin on every dollar", ss["VCXBullet"]))
    story.append(bullet("<b>Unstructured repayment</b> \u2014 Informal payment arrangements without documented terms, autopay, or cure triggers", ss["VCXBullet"]))
    story.append(bullet("<b>Dormant guaranty exposure</b> \u2014 Personal guaranties exist but are not activated systematically", ss["VCXBullet"]))
    story.append(bullet("<b>Low ACH enrollment</b> \u2014 Card-based payments create churn risk; ACH provides payment stability", ss["VCXBullet"]))
    story.append(bullet("<b>Weak pre-suit documentation</b> \u2014 Missing or inconsistent records increase litigation cost and reduce enforceability", ss["VCXBullet"]))
    story.append(source_line(
        "Source: NACM Commercial Collection Survey 2024; CFDD Recovery Best Practices 2024.", ss
    ))
    story.append(PageBreak())

    # Stages
    story.append(Paragraph("Pre-Collection Operating Framework", ss["VCXH1"]))

    story.append(Paragraph("Stage 1: Behavioral Segmentation", ss["VCXH2"]))
    story.append(Paragraph(
        "Route accounts by risk profile to optimize resource allocation and escalation timing.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Signal", "Data Point", "Routing Impact"],
        [
            ["Days past due", "DPD bands (30/60/90/120)", "Escalation timing"],
            ["Payment history", "Prior payment patterns", "Offer structure"],
            ["Corporate stability", "Active status, registered agent", "Guarantor activation priority"],
            ["Communication response", "Contact rate, reply patterns", "Channel optimization"],
            ["Guarantor documentation", "Guaranty on file, executed", "Enforcement pathway"],
        ],
        ss,
    ))

    story.append(Paragraph("Stage 2: Conditional Offer Conversion", ss["VCXH2"]))
    story.append(bullet("Time-sensitive incentive window: fee relief conditioned on compliance", ss["VCXBullet"]))
    story.append(bullet("Signed structured repayment plan with reaffirmation language", ss["VCXBullet"]))
    story.append(bullet("Mandatory auto-debit (ACH) enrollment at agreement execution", ss["VCXBullet"]))
    story.append(bullet("Clear default/cure timeline with documented triggers", ss["VCXBullet"]))

    story.append(Paragraph("Stage 3: Guarantor Activation (Florida-Ready)", ss["VCXH2"]))
    story.append(Paragraph(
        "If a valid personal guaranty exists, the pre-collection framework includes a structured "
        "activation ladder with documented reaffirmation. Under Florida law, dissolution of the "
        "LLC entity does not extinguish personal guarantor exposure (F.S. 605.0702).",
        ss["VCXBody"]
    ))
    story.append(bullet("<b>With guaranty</b>: Activation ladder + demand + direct-action posture", ss["VCXBullet"]))
    story.append(bullet("<b>Without guaranty</b>: Risk-adjusted settlement sequencing + higher documentation standard", ss["VCXBullet"]))
    story.append(bullet("<b>Onboarding redesign</b>: Prevent recurrence by requiring guaranty at account opening", ss["VCXBullet"]))
    story.append(source_line(
        "Source: Florida Statutes 605.0702 (LLC dissolution); "
        "F.S. 55.10 (judgment enforcement); F.S. 679.601 (secured transactions).", ss
    ))
    story.append(PageBreak())

    # Stage 4 + Documentation
    story.append(Paragraph("Stage 4: Mandatory Auto-Debit (ACH-First)", ss["VCXH2"]))
    story.append(bullet("Recurring ACH enrollment at agreement execution", ss["VCXBullet"]))
    story.append(bullet("Survival until paid-in-full (even if service relationship ends)", ss["VCXBullet"]))
    story.append(bullet("Return/NSF triggers feed cure \u2192 default \u2192 acceleration sequence", ss["VCXBullet"]))
    story.append(bullet("Eliminates reliance on updated card numbers and contact churn", ss["VCXBullet"]))

    story.append(Paragraph("Litigation-Ready Documentation", ss["VCXH1"]))
    story.append(Paragraph(
        "Every stage of the pre-collection framework generates documentation that strengthens "
        "downstream enforceability. The goal is to arrive at the escalation decision with a "
        "complete, counsel-ready evidence package.",
        ss["VCXBody"]
    ))
    story.append(make_data_table(
        ["Document", "Purpose", "Legal Foundation"],
        [
            ["Settlement & reaffirmation agreement", "Documented commitment with FL law/venue", "F.S. 95.11 (SOL)"],
            ["Personal guaranty (separate execution)", "Individual liability, joint & several", "F.S. 605.0702"],
            ["ACH authorization (recurring)", "Payment stability, survival clause", "NACHA rules"],
            ["Cure / default notices", "Evidence of process, certified mail", "UCC 9-611"],
            ["Evidence package for counsel", "Timeline, exhibits, payment history", "FL Rules of Evidence"],
        ],
        ss,
    ))
    story.append(PageBreak())

    # Scenario
    story.append(Paragraph("Scenario: LLC Dissolved / Owner Disappears", ss["VCXH1"]))
    story.append(Paragraph(
        "A common pattern in B2B fuel/fleet: the corporate entity dissolves or becomes inactive, "
        "and the personal guarantor becomes the primary recovery target. The pre-collection framework "
        "anticipates this scenario with structured documentation and Florida-specific enforcement positioning.",
        ss["VCXBody"]
    ))
    story.append(bullet("<b>Step 1</b>: Verify corporate status via Florida Division of Corporations (sunbiz.org)", ss["VCXBullet"]))
    story.append(bullet("<b>Step 2</b>: Validate last-known address for guarantor (skip-tracing if needed)", ss["VCXBullet"]))
    story.append(bullet("<b>Step 3</b>: Activate guaranty demand with documented delivery (certified mail)", ss["VCXBullet"]))
    story.append(bullet("<b>Step 4</b>: Asset-aware pre-suit positioning (no speculative claims)", ss["VCXBullet"]))
    story.append(bullet("<b>Step 5</b>: Florida venue enforcement posture where contract supports it", ss["VCXBullet"]))
    story.append(source_line(
        "Source: Florida Division of Corporations (sunbiz.org); "
        "F.S. 48.193 (long-arm jurisdiction); F.S. 56.29 (proceedings supplementary).", ss
    ))
    story.append(PageBreak())

    # Financial Model
    story.append(Paragraph("Financial Impact Model", ss["VCXH1"]))
    story.append(make_data_table(
        ["Scenario", "Recovery Rate", "Net Cash (on $1M portfolio)"],
        [
            ["Immediate agency referral", "18% (net of 35% fee)", "$117,000"],
            ["Pre-collection + agency for failures", "42% blended", "$420,000"],
            ["Estimated annual lift", "+24 pts", "+$303,000"],
        ],
        ss,
    ))
    story.append(Paragraph("ROI Analysis", ss["VCXH2"]))
    story.append(make_data_table(
        ["Metric", "Value"],
        [
            ["Implementation cost (90-day pilot)", "$60,000"],
            ["Additional cash recovered", "$300,000+"],
            ["ROI", "5\u20137x"],
            ["Payback period", "2\u20133 months"],
            ["Ongoing operating cost", "$8\u201312K/month (variable)"],
        ],
        ss,
    ))
    story.append(source_line(
        "Note: Illustrative model. Actual results vary by portfolio composition, "
        "guaranty coverage, and enforcement jurisdiction.", ss
    ))
    story.append(PageBreak())

    # Regulatory
    story.append(Paragraph("Regulatory and Compliance Framework", ss["VCXH1"]))
    story.append(Paragraph("Florida-Specific Considerations", ss["VCXH2"]))
    story.append(bullet("<b>F.S. 559</b> \u2014 Consumer Collection Practices Act (governs third-party collection; first-party generally exempt)", ss["VCXBullet"]))
    story.append(bullet("<b>F.S. 605.0702</b> \u2014 LLC dissolution does not extinguish member/guarantor obligations", ss["VCXBullet"]))
    story.append(bullet("<b>F.S. 95.11</b> \u2014 Statute of limitations: 5 years for written contracts", ss["VCXBullet"]))
    story.append(bullet("<b>F.S. 55.10</b> \u2014 Judgment enforcement and renewal procedures", ss["VCXBullet"]))
    story.append(bullet("<b>F.S. 48.193</b> \u2014 Long-arm jurisdiction for B2B contracts with FL venue clauses", ss["VCXBullet"]))

    story.append(Paragraph("Federal Framework", ss["VCXH2"]))
    story.append(bullet("<b>FDCPA / Reg F</b> \u2014 Primarily governs third-party collectors; first-party best practice alignment", ss["VCXBullet"]))
    story.append(bullet("<b>UCC Article 9</b> \u2014 Secured transaction framework for equipment/fuel collateral", ss["VCXBullet"]))
    story.append(bullet("<b>NACHA Rules</b> \u2014 Govern ACH authorization, returns, and revocation", ss["VCXBullet"]))
    story.append(bullet("<b>E-SIGN Act</b> \u2014 Electronic signature validity for payment agreements", ss["VCXBullet"]))
    story.append(PageBreak())

    # Next Steps
    story.append(Paragraph("Engagement Path", ss["VCXH1"]))
    story.append(make_data_table(
        ["Step", "Action", "Timeline"],
        [
            ["1", "Confidential diagnostic: AR composition + guaranty coverage audit", "1\u20132 weeks"],
            ["2", "Pilot design: scope, cohorts, success criteria", "1 week"],
            ["3", "90-day pilot execution", "90 days"],
            ["4", "Results review + scale/modify decision", "2 weeks"],
        ],
        ss,
    ))
    story.append(Spacer(1, 20))
    story.append(Paragraph(
        "Request a confidential review: vitacorexllc.com  |  (888) 794-8292",
        ParagraphStyle("cta4", fontName="Helvetica-Bold", fontSize=11, textColor=TEAL, alignment=TA_CENTER)
    ))
    story.append(Spacer(1, 30))
    story.append(Paragraph(
        "VitaCoreX LLC provides administrative, documentation, workflow, and business-support services. "
        "It is not a law firm and does not provide legal representation. "
        "Legal strategy and legal advice remain the responsibility of licensed counsel.",
        ss["VCXDisclaimer"]
    ))

    doc.build(story, onFirstPage=footer_func, onLaterPages=footer_func)
    print(f"  [OK] {path}")


# ══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("Generating VitaCoreX executive PDFs...")
    build_healthcare_leakage_brief()
    build_healthcare_cfo_brief()
    build_dental_deck()
    build_precollection_review()
    print("Done. All 4 PDFs generated.")
