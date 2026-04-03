"""Knowledge retrieval, topic classification, and mode routing for the assistant.

Phase 1: Initial knowledge base with 4 topics.
Phase 4C: Expanded out-of-scope detection, escalation triggers,
          topic-to-product routing map.
Phase 5A: Three-mode routing (general_chat, legal_information, vcx_routing),
          broader conversation support, strengthened legal-mode controls.
Phase 5B: Structured legal responses (what-matters / what-to-check /
          documents-needed), deeper fact-gathering sequences, jurisdiction +
          case-type + timeline prompts, stronger escalation paths.

All legal responses are knowledge-retrieval, NOT generative.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Optional

KB_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge"


@dataclass
class Chunk:
    topic: str
    title: str
    text: str
    source: str


# ══════════════════════════════════════════════════════════════════════
#  Topic keywords (legal_information mode)
# ══════════════════════════════════════════════════════════════════════

TOPIC_KEYWORDS = {
    "contracts": {
        "contract", "agreement", "clause", "terms", "terminate", "termination",
        "renewal", "fee", "liability", "indemnity", "nda", "vendor", "client",
        "signing", "sign", "negotiate", "breach", "penalty", "non-compete",
        "confidentiality", "warranty", "amendment", "addendum",
    },
    "immigration_packets": {
        "uscis", "i-130", "i-485", "i-765", "packet", "evidence", "rfe",
        "immigration", "biometrics", "affidavit", "sponsor", "petition",
        "green card", "visa", "naturalization", "i-140", "i-129", "i-20",
        "form", "filing", "supporting documents",
    },
    "auto_deal_review": {
        "dealer", "apr", "monthly", "doc fee", "warranty", "gap", "financing",
        "auto", "car", "vehicle", "loan", "payment", "trade-in",
        "buyer's order", "installment", "lease", "down payment", "add-on",
        "service contract", "dealer fee",
    },
    "florida_official_sources": {
        "sunpass", "toll", "citation", "traffic", "clerk", "florida", "court",
        "county", "pacer", "record", "portal", "dmv", "tag", "registration",
        "title", "license", "hsmv", "sunbiz",
    },
}

# ── Phase 5A: Broader legal detection (any legal topic, not just 4) ───

LEGAL_BROAD_KEYWORDS = {
    "legal", "law", "lawyer", "attorney", "court", "judge", "statute",
    "regulation", "compliance", "rights", "liability", "damages",
    "settlement", "mediation", "arbitration", "litigation", "lawsuit",
    "filing", "motion", "hearing", "deposition", "discovery",
    "jurisdiction", "precedent", "ruling", "verdict", "appeal",
    "criminal", "civil", "tort", "negligence", "malpractice",
    "custody", "divorce", "alimony", "child support", "adoption",
    "bankruptcy", "foreclosure", "eviction", "landlord", "tenant",
    "employment law", "discrimination", "harassment", "wrongful termination",
    "intellectual property", "trademark", "patent", "copyright",
    "estate", "probate", "will", "trust", "power of attorney",
    "tax law", "irs", "audit", "tax dispute",
    "insurance claim", "personal injury", "workers comp",
    "immigration", "deportation", "asylum", "visa",
    "contract", "clause", "breach", "indemnity",
}

# ── Phase 5A: VCX routing keywords ────────────────────────────────────

VCX_ROUTING_KEYWORDS = {
    "vitacorex", "vcx", "vitacore",
    "intake", "structured intake", "case intake",
    "contract scanner", "contract intelligence", "contract review",
    "recovery pilot", "revenue recovery",
    "packet room", "client portal", "matter status",
    "sign in", "sign-in", "login", "log in",
    "upload", "submit", "my case", "my matter",
    "your services", "your products", "what do you offer",
    "how does this work", "how do i use",
    "pricing", "cost", "consultation",
}

# ── High-risk legal requests (always escalate) ────────────────────────

HIGH_RISK_KEYWORDS = {
    "criminal charge", "arrest", "arrested", "jail", "prison", "felony",
    "misdemeanor", "bail", "bond hearing", "probation violation", "parole",
    "domestic violence", "restraining order", "protective order",
    "hearing tomorrow", "court date tomorrow", "appeal deadline",
    "filing deadline",
    "asylum emergency", "deportation emergency", "removal proceedings",
    "detained by ice", "immigration court hearing tomorrow",
    "represent me", "be my lawyer", "need a lawyer now",
    "legal representation", "attorney-client",
}

_ADVICE_SEEKING_PATTERNS = [
    re.compile(r"(?:should|can|could)\s+i\s+(?:sue|file|take\s+legal\s+action)", re.IGNORECASE),
    re.compile(r"(?:am\s+i|is\s+this)\s+(?:legally?\s+)?(?:liable|responsible|at\s+fault)", re.IGNORECASE),
    re.compile(r"(?:give|provide)\s+(?:me\s+)?(?:legal\s+)?advice", re.IGNORECASE),
    re.compile(r"what\s+(?:should|would)\s+(?:a\s+)?(?:lawyer|attorney)\s+(?:say|do|recommend)", re.IGNORECASE),
    re.compile(r"(?:represent|defend)\s+me", re.IGNORECASE),
]

REQUIRES_STATE = {"contracts", "auto_deal_review", "florida_official_sources"}


# ══════════════════════════════════════════════════════════════════════
#  Phase 5B — Structured legal response data
# ══════════════════════════════════════════════════════════════════════

# ── Case-type detection per topic ─────────────────────────────────────

CASE_TYPES: dict[str, dict[str, set[str]]] = {
    "contracts": {
        "employment": {"employment", "employee", "employer", "hire", "fired", "offer letter", "severance", "non-compete"},
        "service":    {"service agreement", "service contract", "sow", "statement of work", "vendor", "consulting", "freelance"},
        "nda":        {"nda", "non-disclosure", "confidentiality agreement", "proprietary"},
        "lease":      {"lease", "rental", "landlord", "tenant", "rent", "property"},
        "purchase":   {"purchase", "sale", "buyer", "seller", "acquisition", "closing"},
    },
    "immigration_packets": {
        "family":     {"i-130", "spouse", "parent", "child", "family", "marriage", "fiance"},
        "employment": {"i-140", "h-1b", "h1b", "employer", "perm", "labor certification"},
        "adjustment": {"i-485", "adjustment", "green card", "permanent resident"},
        "ead":        {"i-765", "ead", "employment authorization", "work permit"},
        "rfe":        {"rfe", "request for evidence", "noid", "notice of intent"},
    },
    "auto_deal_review": {
        "new_purchase":  {"new car", "new vehicle", "brand new", "msrp", "factory"},
        "used_purchase": {"used car", "used vehicle", "pre-owned", "certified", "cpo"},
        "lease":         {"lease", "leasing", "residual", "money factor"},
        "financing":     {"financing", "refinance", "refi", "apr", "interest rate", "loan"},
        "trade_in":      {"trade-in", "trade in", "payoff", "negative equity", "upside down"},
    },
    "florida_official_sources": {
        "traffic":       {"traffic", "citation", "ticket", "moving violation", "speeding"},
        "toll":          {"toll", "sunpass", "e-pass", "toll-by-plate", "unpaid toll"},
        "court":         {"court", "case", "filing", "clerk", "docket", "pacer"},
        "dmv":           {"dmv", "hsmv", "registration", "title", "license", "tag", "renewal"},
        "business":      {"sunbiz", "corporation", "llc", "annual report", "registered agent"},
    },
}


def detect_case_type(topic: str, message: str) -> Optional[str]:
    """Detect the specific case type within a legal topic."""
    if topic not in CASE_TYPES:
        return None
    lower = message.lower()
    best_type = None
    best_score = 0
    for case_type, keywords in CASE_TYPES[topic].items():
        score = sum(1 for kw in keywords if kw in lower)
        if score > best_score:
            best_type = case_type
            best_score = score
    return best_type if best_score >= 1 else None


# ── Phase 5B: Structured response blocks ──────────────────────────────
# Three sections per topic: what_matters, what_to_check, documents_needed

@dataclass
class StructuredLegalBlock:
    what_matters: list[str] = field(default_factory=list)
    what_to_check: list[str] = field(default_factory=list)
    documents_needed: list[str] = field(default_factory=list)


STRUCTURED_BLOCKS: dict[str, dict[str, StructuredLegalBlock]] = {
    # ── CONTRACTS ─────────────────────────────────────────────────
    "contracts": {
        "_default": StructuredLegalBlock(
            what_matters=[
                "Which party drafted the contract (drafter usually writes terms in their favor)",
                "Whether the contract is already signed or still in negotiation",
                "Whether key terms (payment, termination, liability) are clearly defined",
                "Whether there are auto-renewal or evergreen clauses",
                "Whether governing law and dispute resolution are specified",
            ],
            what_to_check=[
                "Termination clause: notice period, cure period, termination for convenience",
                "Liability caps: whether there are limits on damages, exclusions on consequential damages",
                "Indemnification: who indemnifies whom, scope of indemnification obligations",
                "Non-compete / non-solicitation: duration, geographic scope, enforceability by state",
                "Intellectual property: ownership of work product, pre-existing IP carve-outs",
                "Payment terms: net-30/60/90, late payment penalties, acceptance criteria",
            ],
            documents_needed=[
                "The full contract including all exhibits, schedules, and amendments",
                "Any prior versions or redlines showing negotiation history",
                "Correspondence about the contract (emails, cover letters)",
                "Your notes on specific concerns or verbal promises not in writing",
                "If employment: the offer letter, employee handbook reference",
                "If vendor: the RFP/RFQ and the winning bid or proposal",
            ],
        ),
        "employment": StructuredLegalBlock(
            what_matters=[
                "Whether this is at-will employment or a fixed-term contract",
                "Presence and scope of non-compete / non-solicitation clauses",
                "Intellectual property assignment and invention disclosure obligations",
                "Severance terms and conditions for triggering severance",
                "Change-of-control or acquisition-related provisions",
            ],
            what_to_check=[
                "At-will vs. for-cause termination language",
                "Non-compete: duration, geographic area, specific activities restricted",
                "IP assignment: whether it covers only work-related inventions or all inventions",
                "Benefits: what survives termination (COBRA, vesting schedules)",
                "Arbitration clause: mandatory arbitration, class action waiver",
                "Clawback provisions on bonuses or equity",
            ],
            documents_needed=[
                "The employment agreement (all pages, all exhibits)",
                "The offer letter (may differ from the agreement)",
                "Employee handbook or policy manual if referenced",
                "Any equity/option grant agreements",
                "Non-compete / non-solicitation addendum if separate",
                "Severance agreement if applicable",
            ],
        ),
        "nda": StructuredLegalBlock(
            what_matters=[
                "Whether the NDA is mutual or one-way",
                "Definition of confidential information (narrow vs. broad)",
                "Duration of confidentiality obligations",
                "Permitted disclosures and exceptions (judicial process, pre-existing knowledge)",
                "Remedies for breach (injunctive relief, liquidated damages)",
            ],
            what_to_check=[
                "Definition scope: does it cover oral disclosures? Is there a marking requirement?",
                "Residual knowledge clause: can the receiving party use general knowledge retained in memory?",
                "Non-solicitation of employees clause embedded in the NDA",
                "Return or destruction of materials upon termination",
                "Survival period: how long obligations last after the NDA expires",
                "Governing law and dispute resolution venue",
            ],
            documents_needed=[
                "The NDA (all pages including signature page)",
                "Any cover letter or email describing what will be shared",
                "If mutual: both parties' lists of confidential materials",
                "If part of a larger deal: the master agreement referencing the NDA",
            ],
        ),
        "lease": StructuredLegalBlock(
            what_matters=[
                "Lease term (fixed vs. month-to-month) and renewal conditions",
                "Total financial obligation: rent + CAM + insurance + taxes",
                "Maintenance and repair responsibilities (who handles what)",
                "Early termination: penalties, notice requirements, subletting rights",
                "Default and cure provisions",
            ],
            what_to_check=[
                "Rent escalation clause: fixed increase, CPI-based, or market rate reset",
                "Security deposit: amount, conditions for return, deduction policies",
                "Use restrictions: permitted uses, exclusivity clauses, hours of operation",
                "Assignment and subletting: requires consent? reasonableness standard?",
                "Insurance requirements: minimum coverage, additional insured endorsements",
                "Holdover provisions: what happens if tenant stays past lease term",
            ],
            documents_needed=[
                "The lease agreement including all riders and amendments",
                "Floor plan or premises description",
                "Building rules and regulations if referenced",
                "CAM reconciliation statements if available",
                "Landlord's insurance requirements document",
            ],
        ),
    },
    # ── IMMIGRATION PACKETS ───────────────────────────────────────
    "immigration_packets": {
        "_default": StructuredLegalBlock(
            what_matters=[
                "Which immigration benefit you are applying for",
                "The filing category and whether it requires a petitioner",
                "Current immigration status and any gaps in status",
                "Whether there are pending applications that may be affected",
                "Processing time expectations and whether premium processing is available",
            ],
            what_to_check=[
                "Form version: ensure you are using the latest USCIS form edition",
                "Filing fees: correct fee amount and accepted payment methods",
                "Signatures: all required signatures in ink, correct signatories",
                "Photographs: 2 passport-style photos per USCIS specifications",
                "Translations: certified translations for every non-English document",
                "Evidence indexing: tab each exhibit, create a master evidence list",
            ],
            documents_needed=[
                "Completed USCIS forms (correct edition, signed)",
                "Government-issued photo IDs (passport, state ID, driver's license)",
                "Birth certificates for all principal applicants and derivatives",
                "Marriage certificate (if applicable)",
                "Financial evidence (tax returns, pay stubs, bank statements, I-864 support)",
                "Employment verification letters",
                "Passport-style photographs (USCIS spec)",
                "Filing fee payment (check or money order payable to U.S. Department of Homeland Security)",
            ],
        ),
        "family": StructuredLegalBlock(
            what_matters=[
                "The relationship between petitioner and beneficiary",
                "Whether the beneficiary is inside or outside the U.S.",
                "Priority date and visa bulletin category",
                "Whether concurrent filing (I-130 + I-485) is available",
                "Any prior immigration violations or grounds of inadmissibility",
            ],
            what_to_check=[
                "Proof of relationship: marriage certificate, birth certificates, adoption decree",
                "Proof of petitioner's status: naturalization certificate or valid green card",
                "Bona fide marriage evidence (if spouse petition): joint accounts, lease, photos, affidavits",
                "I-864 financial support: meets 125% of poverty guidelines for household size",
                "Any prior marriages: proof of termination (divorce decree, death certificate)",
                "Criminal history: disclosure requirements and potential waivers",
            ],
            documents_needed=[
                "I-130 Petition for Alien Relative",
                "I-485 Application to Register Permanent Residence (if concurrent)",
                "I-130A Supplemental Information (for spouse petitions)",
                "I-864 Affidavit of Support with supporting financials",
                "Marriage certificate and all prior divorce decrees",
                "Birth certificates for petitioner and beneficiary",
                "Passport copies for both parties",
                "Bona fide marriage evidence package",
            ],
        ),
        "rfe": StructuredLegalBlock(
            what_matters=[
                "Exactly what evidence USCIS is requesting",
                "The deadline to respond (usually 30-87 days from notice date)",
                "Whether the RFE requests additional evidence or questions credibility",
                "Which specific deficiency USCIS identified in the original filing",
            ],
            what_to_check=[
                "RFE notice: read every paragraph carefully, USCIS may request multiple items",
                "Original filing: compare what was submitted vs. what is now requested",
                "Deadline calculation: count from the date on the notice, not date received",
                "Cover letter: address each RFE point individually with page references",
                "New evidence: ensure it is current and does not contradict prior submissions",
            ],
            documents_needed=[
                "The RFE notice itself (all pages)",
                "A copy of your original petition/application as filed",
                "The specific evidence requested in the RFE",
                "A cover letter addressing each RFE point with tab references",
                "Updated evidence if originals are now outdated",
                "Expert opinions or affidavits if USCIS questioned credibility",
            ],
        ),
    },
    # ── AUTO DEAL REVIEW ──────────────────────────────────────────
    "auto_deal_review": {
        "_default": StructuredLegalBlock(
            what_matters=[
                "The difference between the advertised price and the contract price",
                "Whether the APR matches your independent credit approval",
                "Total cost of add-ons (GAP, service contract, paint, theft, etc.)",
                "Whether the monthly payment x number of payments equals the total financed",
                "Trade-in allowance vs. actual payoff on your existing loan",
            ],
            what_to_check=[
                "Doc fee: varies by state, some states cap this fee",
                "Dealer add-ons: nitrogen tire fill, VIN etching, fabric protection (often overpriced)",
                "GAP insurance: dealer price vs. credit union price (often 2-3x markup)",
                "Extended warranty / service contract: coverage scope, exclusions, deductible",
                "Rate markup: dealers can mark up the buy rate from the lender (check your own pre-approval)",
                "Packed payments: inflated monthly payment used to hide add-on costs",
            ],
            documents_needed=[
                "Buyer's order (itemized, showing every line item)",
                "Credit application disclosure",
                "Your own pre-approval letter from bank or credit union",
                "Vehicle window sticker / Monroney label (new cars)",
                "Trade-in appraisal form",
                "Any advertisements or online price quotes you were shown",
            ],
        ),
        "lease": StructuredLegalBlock(
            what_matters=[
                "Money factor (lease equivalent of APR) and how it compares to buy-rate",
                "Residual value: is it realistic for the vehicle and mileage tier?",
                "Capitalized cost vs. MSRP: any markups above sticker?",
                "Mileage allowance: annual limit and per-mile overage charge",
                "Disposition fee and end-of-lease charges",
            ],
            what_to_check=[
                "Money factor to APR conversion: multiply money factor x 2400",
                "Cap cost reductions: verify that your down payment and trade-in are reflected",
                "Acquisition fee: typically non-negotiable but should be disclosed",
                "Wear and tear standards: get the lessor's specific guidelines in writing",
                "Early termination: remaining payments + disposition fee + negative equity",
                "Purchase option: price at lease end vs. projected market value",
            ],
            documents_needed=[
                "Lease agreement (all pages)",
                "Itemized capitalized cost worksheet",
                "Money factor disclosure (ask dealer for it in writing)",
                "Mileage tier and overage rate schedule",
                "Wear and tear guidelines from the leasing company",
            ],
        ),
    },
    # ── FLORIDA OFFICIAL SOURCES ──────────────────────────────────
    "florida_official_sources": {
        "_default": StructuredLegalBlock(
            what_matters=[
                "Which Florida county the matter originates in",
                "The type of record or service you need (traffic, toll, court, DMV, business)",
                "Whether there are any deadlines or response windows",
                "Whether you need to appear in person or can handle it online",
            ],
            what_to_check=[
                "Portal URL: verify you are on the official .gov or .state.fl.us domain",
                "Payment methods: which forms of payment the portal accepts",
                "Filing deadlines: traffic citations typically require response within 30 days",
                "Fee schedules: look for the official fee schedule on the portal",
                "Hours of operation: some clerk offices have limited hours",
                "E-filing requirements: whether the county requires e-filing for certain case types",
            ],
            documents_needed=[
                "Citation or case number (exact number as printed on the document)",
                "Government-issued photo ID",
                "Vehicle registration (for DMV/toll matters)",
                "Proof of insurance (for traffic/DMV matters)",
                "Payment method accepted by the specific portal",
            ],
        ),
        "traffic": StructuredLegalBlock(
            what_matters=[
                "Citation number and issuing county",
                "Whether this is a traffic infraction, criminal traffic offense, or civil violation",
                "Response deadline (typically 30 days from citation date)",
                "Point value: some violations add points to your license",
                "Whether traffic school is an option to avoid points",
            ],
            what_to_check=[
                "Clerk of Court website for the issuing county",
                "Options: pay fine, elect traffic school, request hearing",
                "Traffic school eligibility: not available for all violations or if used recently",
                "Payment amount: base fine + court costs + surcharges",
                "CDL holders: traffic school may not dismiss points for CDL violations",
            ],
            documents_needed=[
                "The traffic citation (front and back)",
                "Driver's license number",
                "Vehicle registration if relevant",
                "Proof of insurance if required by citation",
            ],
        ),
        "toll": StructuredLegalBlock(
            what_matters=[
                "Which toll authority issued the invoice (SunPass, E-PASS, Toll-By-Plate)",
                "Whether this is an unpaid toll, penalty, or collections notice",
                "The total amount and whether penalties have been added",
                "Whether your transponder was active at the time",
            ],
            what_to_check=[
                "SunPass account: check balance and transaction history at sunpass.com",
                "Invoice dispute window: typically 60 days from invoice date",
                "Penalty waiver: some authorities waive penalties if you pay the base toll promptly",
                "Toll-By-Plate: verify the license plate photo matches your vehicle",
            ],
            documents_needed=[
                "The toll invoice or notice (all pages)",
                "SunPass or E-PASS account number",
                "Vehicle registration showing the license plate",
                "Bank or credit card statement if you believe you already paid",
            ],
        ),
    },
}


# ── Phase 5B: Fact-gathering question sequences ──────────────────────
# Ordered for logical flow: jurisdiction -> case type -> timeline -> specifics

FACT_GATHERING_SEQUENCE: dict[str, list[dict[str, str]]] = {
    "contracts": [
        {"id": "jurisdiction", "question": "Which state's law governs this contract?", "why": "Contract enforcement rules vary by state."},
        {"id": "case_type", "question": "What type of contract is this? (employment, service/vendor, NDA, lease, purchase/sale, other)", "why": "Different contract types have different risk areas."},
        {"id": "stage", "question": "What stage are you at? (pre-signing review, already signed, dispute, renewal)", "why": "The available options depend on whether the contract is already executed."},
        {"id": "timeline", "question": "Is there a signing deadline or key date approaching?", "why": "Urgency affects which VCX service path to recommend."},
        {"id": "concern", "question": "Is there a specific clause or issue you are concerned about?", "why": "Targeted review is more useful than a general scan."},
        {"id": "counterparty", "question": "Who is the other party? (employer, vendor, landlord, buyer, etc.)", "why": "The power dynamic affects negotiation leverage."},
    ],
    "immigration_packets": [
        {"id": "form", "question": "Which USCIS form is the primary filing? (I-130, I-485, I-765, I-140, other)", "why": "Each form has specific evidence and fee requirements."},
        {"id": "relationship", "question": "What is the petitioner-beneficiary relationship? (spouse, parent, employer, self-petition)", "why": "The relationship determines the evidence package."},
        {"id": "location", "question": "Is the beneficiary currently inside or outside the United States?", "why": "This determines whether consular processing or adjustment of status applies."},
        {"id": "timeline", "question": "Is there a filing deadline, RFE response date, or priority date concern?", "why": "Timing drives which steps are urgent."},
        {"id": "status", "question": "What is the current immigration status of the beneficiary?", "why": "Status gaps or violations may require additional filings or waivers."},
        {"id": "prior_filings", "question": "Have any related petitions been filed previously? (approved, denied, pending)", "why": "Prior filings affect strategy and evidence requirements."},
    ],
    "auto_deal_review": [
        {"id": "state", "question": "What state is the dealership located in?", "why": "Doc fee caps and consumer protection rules vary by state."},
        {"id": "deal_type", "question": "Is this a purchase (new/used) or a lease?", "why": "Lease math and purchase math work differently."},
        {"id": "stage", "question": "Have you signed anything yet, or are you still negotiating?", "why": "Pre-signing review has more options than post-signing."},
        {"id": "timeline", "question": "Is there a deadline? (promotional rate expiring, trade-in appraisal expiring, etc.)", "why": "Artificial urgency is a common dealer tactic."},
        {"id": "financing", "question": "Are you financing through the dealer or do you have your own pre-approval?", "why": "Dealer financing may include a rate markup over the buy rate."},
        {"id": "trade_in", "question": "Is there a trade-in involved? Do you owe money on it?", "why": "Negative equity on a trade-in can be rolled into the new loan."},
    ],
    "florida_official_sources": [
        {"id": "county", "question": "Which Florida county does this matter involve?", "why": "Each county has its own clerk of court and local procedures."},
        {"id": "record_type", "question": "What type of record or portal do you need? (traffic citation, toll, court filing, DMV, business/SunBiz)", "why": "Each record type has a different portal."},
        {"id": "timeline", "question": "Is there a response deadline? (citation response date, filing deadline)", "why": "Missing a deadline can result in additional penalties or default."},
        {"id": "case_number", "question": "Do you have a case number, citation number, or invoice number?", "why": "Having the reference number speeds up the lookup."},
        {"id": "action", "question": "Are you looking to pay, dispute, file, or just look up information?", "why": "The correct portal page depends on the action you need."},
    ],
}


# ── Phase 5B: Escalation paths with context ───────────────────────────

ESCALATION_PATHS: dict[str, list[dict[str, str]]] = {
    "contracts": [
        {"label": "Upload to Contract Scanner", "url": "/app/contract-intelligence/", "description": "Automated clause detection, risk scoring, and missing-protection analysis.", "when": "You have the contract file ready for automated review."},
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=contract-review", "description": "Advisor review with triage, scoring, and follow-up.", "when": "You want a human reviewer to assess the contract."},
        {"label": "Open Contract Review Desk", "url": "/app/vcx-contract-review/", "description": "Full contract review with detailed advisor feedback.", "when": "You need a comprehensive clause-by-clause review."},
        {"label": "Sign In to Client Portal", "url": "/app/sign-in/", "description": "Access your existing matter or check review status.", "when": "You have already submitted and want to check progress."},
    ],
    "immigration_packets": [
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=immigration-packets", "description": "Packet review, organization feedback, and completeness check.", "when": "You want an advisor to review your packet before filing."},
        {"label": "Open Packet Room", "url": "/app/vcx-packet-room/", "description": "Track your matter, upload documents, view timeline.", "when": "You have an active matter and need to add documents."},
        {"label": "Sign In to Client Portal", "url": "/app/sign-in/", "description": "Access your existing matter.", "when": "You have already submitted and want to check status."},
    ],
    "auto_deal_review": [
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=auto-deal-review", "description": "Deal sheet review, fee audit, and advisor feedback.", "when": "You want a reviewer to check the numbers on your deal."},
        {"label": "Sign In to Client Portal", "url": "/app/sign-in/", "description": "Access your existing matter.", "when": "You have already submitted and want to check status."},
    ],
    "florida_official_sources": [
        {"label": "Submit to Structured Intake", "url": "/structured-case-intake.html?service=florida-sources", "description": "Help finding the right portal and understanding the process.", "when": "You need guidance beyond basic portal routing."},
        {"label": "Sign In to Client Portal", "url": "/app/sign-in/", "description": "Access your existing matter.", "when": "You have already submitted and want to check status."},
    ],
}


# ── Product routing maps (kept for backward compat) ───────────────────

TOPIC_PRODUCT_ROUTES: dict[str, list[dict[str, str]]] = {
    topic: [{"label": e["label"], "url": e["url"], "description": e["description"]} for e in paths]
    for topic, paths in ESCALATION_PATHS.items()
}

DEFAULT_PRODUCT_ROUTES = [
    {"label": "Open Structured Intake", "url": "/structured-case-intake.html", "description": "Submit your matter for private advisor review."},
    {"label": "Request Private Consultation", "url": "/contact.html", "description": "Schedule a confidential consultation call."},
    {"label": "Sign In to Client Portal", "url": "/app/sign-in/", "description": "Access your existing matter through the Packet Room."},
]

VCX_SERVICE_ROUTES = [
    {"label": "Structured Case Intake", "url": "/structured-case-intake.html", "description": "Submit a new matter for review and triage."},
    {"label": "Contract Intelligence", "url": "/app/contract-intelligence/", "description": "Upload contracts for clause detection and risk scoring."},
    {"label": "Contract Review Desk", "url": "/app/vcx-contract-review/", "description": "Full contract review with advisor feedback."},
    {"label": "Recovery Pilot Studio", "url": "/app/vcx-recovery-pilot/", "description": "Model revenue recovery scenarios and generate briefs."},
    {"label": "Packet Room / Client Portal", "url": "/app/vcx-packet-room/", "description": "Access your matter timeline, documents, and deliverables."},
    {"label": "Legal Assistant", "url": "/app/legal-assistant/", "description": "First-pass legal information and workflow guidance."},
    {"label": "Sign In", "url": "/app/sign-in/", "description": "Sign in to access your existing matter."},
]


# ══════════════════════════════════════════════════════════════════════
#  Helpers
# ══════════════════════════════════════════════════════════════════════

def _normalize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9\-']+", text.lower())


def _load_chunks() -> list[Chunk]:
    chunks: list[Chunk] = []
    if not KB_DIR.exists():
        return chunks
    for path in sorted(KB_DIR.glob("*.md")):
        topic = path.stem
        raw = path.read_text(encoding="utf-8")
        parts = re.split(r"^##\s+", raw, flags=re.MULTILINE)
        if not parts:
            continue
        preface = parts[0].strip()
        if preface:
            chunks.append(Chunk(topic=topic, title="Overview", text=preface, source=path.name))
        for part in parts[1:]:
            lines = part.strip().splitlines()
            if not lines:
                continue
            title = lines[0].strip()
            text = "\n".join(lines[1:]).strip()
            if text:
                chunks.append(Chunk(topic=topic, title=title, text=text, source=path.name))
    return chunks


CHUNKS = _load_chunks()


# ══════════════════════════════════════════════════════════════════════
#  Detection functions
# ══════════════════════════════════════════════════════════════════════

def detect_high_risk(message: str) -> bool:
    """Check if the message is a high-risk legal request that must escalate."""
    lower = message.lower()
    if any(keyword in lower for keyword in HIGH_RISK_KEYWORDS):
        return True
    if any(pattern.search(message) for pattern in _ADVICE_SEEKING_PATTERNS):
        return True
    return False


detect_out_of_scope = detect_high_risk  # Phase 4C compat alias


def detect_mode(message: str, current_topic: Optional[str] = None) -> str:
    """Determine which mode should handle this message."""
    lower = message.lower()
    if detect_high_risk(message):
        return "high_risk"
    if any(kw in lower for kw in VCX_ROUTING_KEYWORDS):
        return "vcx_routing"
    if current_topic and current_topic in TOPIC_KEYWORDS:
        return "legal_information"
    if infer_topic(message):
        return "legal_information"
    tokens = set(_normalize(message))
    legal_score = sum(1 for kw in LEGAL_BROAD_KEYWORDS if kw in lower or kw in tokens)
    if legal_score >= 2:
        return "legal_information"
    return "general_chat"


def infer_topic(message: str) -> Optional[str]:
    tokens = set(_normalize(message))
    best_topic = None
    best_score = 0
    for topic, keywords in TOPIC_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in message.lower() or kw in tokens)
        if score > best_score:
            best_topic = topic
            best_score = score
    return best_topic if best_score >= 2 else None


def topic_needs_state(topic: Optional[str]) -> bool:
    return topic in REQUIRES_STATE


def retrieve(topic: str, message: str, limit: int = 4) -> list[Chunk]:
    tokens = set(_normalize(message))
    scored: list[tuple[int, Chunk]] = []
    for chunk in CHUNKS:
        if chunk.topic != topic:
            continue
        haystack = f"{chunk.title}\n{chunk.text}".lower()
        score = sum(1 for token in tokens if token in haystack)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]


def summarize_chunks(chunks: Iterable[Chunk]) -> tuple[list[str], list[str]]:
    bullets: list[str] = []
    sources: list[str] = []
    for chunk in chunks:
        first_sentences = re.split(r"(?<=[.!?])\s+", chunk.text.strip())
        snippet = " ".join(first_sentences[:2]).strip()
        bullets.append(f"{chunk.title}: {snippet}")
        if chunk.source not in sources:
            sources.append(chunk.source)
    return bullets, sources


def get_product_routes(topic: Optional[str]) -> list[dict[str, str]]:
    """Return the product routing links for a given topic."""
    if topic and topic in TOPIC_PRODUCT_ROUTES:
        return TOPIC_PRODUCT_ROUTES[topic]
    return DEFAULT_PRODUCT_ROUTES


def get_structured_block(topic: str, case_type: Optional[str] = None) -> StructuredLegalBlock:
    """Get the structured response block for a topic + case type.

    Phase 5B: Returns case-type-specific block if available,
    otherwise returns the _default block for the topic.
    """
    topic_blocks = STRUCTURED_BLOCKS.get(topic, {})
    if case_type and case_type in topic_blocks:
        return topic_blocks[case_type]
    return topic_blocks.get("_default", StructuredLegalBlock())


def get_fact_gathering_questions(topic: str) -> list[dict[str, str]]:
    """Get the ordered fact-gathering question sequence for a topic."""
    return FACT_GATHERING_SEQUENCE.get(topic, [])


def get_escalation_paths(topic: str) -> list[dict[str, str]]:
    """Get escalation paths with context-aware descriptions."""
    return ESCALATION_PATHS.get(topic, [
        {"label": e["label"], "url": e["url"], "description": e["description"], "when": ""}
        for e in DEFAULT_PRODUCT_ROUTES
    ])
