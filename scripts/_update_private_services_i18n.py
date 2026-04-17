#!/usr/bin/env python3
"""
One-shot rewrite of PAGE_DATA keys in additional-services.html
to match the new Private Client Services positioning.

After running this script once, DO NOT run again — it is idempotent
(uses full-string matches), but the file is committed to git.
"""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "additional-services.html"

NEW_EN = {
    "title": "Private Client Services | VitaCoreX LLC",
    "desc": "Defined-scope advisory for private matters: contract review, immigration packet preparation, and auto-deal analysis. Clear scope, timeframe, and deliverable.",
    "hero_eyebrow": "Private Client Services",
    "hero_title": "Private-client advisory, with scope and structure.",
    "hero_lead": "Three services for individuals and families: contract review, immigration packet preparation, and auto-deal analysis. Every engagement has a defined scope, a clear timeframe, and a delivered document package \u2014 before you commit.",
    "side_h3": "Discretion by default",
    "side_p": "Every matter is handled one-to-one. No shared workflows, no generic templates. Your documents stay in a single-tenant environment from first message to final deliverable.",
    "curated_eyebrow": "Private services",
    "curated_h2": "Three services. Defined scope. Fixed deliverable.",
    "curated_intro": "Each service below lists exactly what you receive, how long it takes, and in what format \u2014 before you commit. No open-ended retainers, no billable-hour uncertainty.",
    "card1_h3": "Contract & Lease Review",
    "card1_p": "Independent review of high-stakes documents before you sign. We surface clauses that are outside market norms, fees that deviate from threshold expectations, and commitments that don\u2019t match the verbal agreement.",
    "card1_li1": "Side-by-side clause-by-clause review",
    "card1_li2": "Risk and negotiation-leverage markup",
    "card1_li3": "Plain-language summary memo",
    "card1_cta1": "Try free scanner",
    "card1_cta2": "Request review",
    "card2_h3": "Immigration Packet Preparation",
    "card2_p": "Document-organization support for USCIS packets. We build the evidence index, verify the form sequence, and prepare the submission-ready folder. Legal strategy and filing decisions remain with your attorney.",
    "card2_li1": "Evidence index and checklist",
    "card2_li2": "Form sequence and exhibit tabbing",
    "card2_li3": "Submission-readiness walkthrough",
    "card2_cta1": "Try free helper",
    "card2_cta2": "Request preparation",
    "card3_h3": "Auto Deal & Major-Purchase Review",
    "card3_p": "Pre-signing analysis of the complete deal sheet. We calculate the true monthly payment, flag dealer fees above common thresholds (doc fee, GAP, extended warranty), and summarize the negotiation points worth raising at the table.",
    "card3_li1": "Threshold check on doc fee, GAP, warranty",
    "card3_li2": "True monthly payment with APR verification",
    "card3_li3": "Negotiation points memo",
    "card3_cta1": "Try free calculator",
    "card3_cta2": "Request review",
    "card4_h3": "Florida Official Source Locator",
    "card4_p": "Routes you to the correct official Florida government portal for tolls, traffic citations, and court records. VitaCoreX does not retrieve records directly \u2014 we point you to the authoritative source.",
    "card4_li1": "SunPass, CFX, and county toll portals",
    "card4_li2": "County clerk traffic citation portals",
    "card4_li3": "Florida Courts and PACER portals",
    "card4_cta1": "Start Portal Locator",
    "fit_good_pill": "Good fit",
    "fit_good_li1": "Time-sensitive document review before you sign, file, or commit.",
    "fit_good_li2": "Matters where the pressure is the document itself, not ongoing representation.",
    "fit_good_li3": "Clients who want a fixed deliverable and a clear end \u2014 not an open retainer.",
    "fit_not_pill": "Not designed for",
    "fit_not_li1": "Emergency legal representation, court strategy, or attorney work product.",
    "fit_not_li2": "Open-ended \u201cdo everything\u201d personal administration without defined scope.",
    "fit_not_li3": "Direct submission of regulated filings on the client\u2019s behalf.",
    "cta_privacy": "Review privacy policy",
    "cta_intake": "Start private intake",
}

NEW_RU = {
    "title": "\u0421\u0435\u0440\u0432\u0438\u0441\u044b \u0434\u043b\u044f \u0447\u0430\u0441\u0442\u043d\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432 | VitaCoreX LLC",
    "desc": "\u0421\u043e\u043f\u0440\u043e\u0432\u043e\u0436\u0434\u0435\u043d\u0438\u0435 \u0447\u0430\u0441\u0442\u043d\u044b\u0445 \u0432\u043e\u043f\u0440\u043e\u0441\u043e\u0432 \u0441 \u0447\u0451\u0442\u043a\u0438\u043c \u043e\u0431\u044a\u0451\u043c\u043e\u043c: \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0434\u043e\u0433\u043e\u0432\u043e\u0440\u043e\u0432, \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0445 \u043f\u0430\u043a\u0435\u0442\u043e\u0432, \u0430\u043d\u0430\u043b\u0438\u0437 \u0430\u0432\u0442\u043e\u0441\u0434\u0435\u043b\u043e\u043a. \u0424\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0441\u0440\u043e\u043a \u0438 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442.",
    "hero_eyebrow": "\u0421\u0435\u0440\u0432\u0438\u0441\u044b \u0434\u043b\u044f \u0447\u0430\u0441\u0442\u043d\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432",
    "hero_title": "\u0421\u043e\u043f\u0440\u043e\u0432\u043e\u0436\u0434\u0435\u043d\u0438\u0435 \u0447\u0430\u0441\u0442\u043d\u044b\u0445 \u0432\u043e\u043f\u0440\u043e\u0441\u043e\u0432 \u2014 \u0441 \u0447\u0451\u0442\u043a\u0438\u043c \u043e\u0431\u044a\u0451\u043c\u043e\u043c \u0438 \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u043e\u0439.",
    "hero_lead": "\u0422\u0440\u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0434\u043b\u044f \u0447\u0430\u0441\u0442\u043d\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432: \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0434\u043e\u0433\u043e\u0432\u043e\u0440\u043e\u0432, \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u043e\u0433\u043e \u043f\u0430\u043a\u0435\u0442\u0430, \u0430\u043d\u0430\u043b\u0438\u0437 \u0430\u0432\u0442\u043e\u0441\u0434\u0435\u043b\u043a\u0438. \u0423 \u043a\u0430\u0436\u0434\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0437\u0430\u0440\u0430\u043d\u0435\u0435 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0451\u043d \u043e\u0431\u044a\u0451\u043c, \u0441\u0440\u043e\u043a \u0438 \u0444\u043e\u0440\u043c\u0430\u0442 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430 \u2014 \u0434\u043e \u043d\u0430\u0447\u0430\u043b\u0430.",
    "side_h3": "\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e",
    "side_p": "\u041a\u0430\u0436\u0434\u043e\u0435 \u0434\u0435\u043b\u043e \u0432\u0435\u0434\u0451\u0442\u0441\u044f \u043e\u0434\u0438\u043d \u043d\u0430 \u043e\u0434\u0438\u043d. \u0411\u0435\u0437 \u043e\u0431\u0449\u0438\u0445 \u0448\u0430\u0431\u043b\u043e\u043d\u043e\u0432 \u0438 \u043f\u043e\u0442\u043e\u043a\u043e\u0432\u044b\u0445 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u043e\u0432. \u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0432 \u0438\u0437\u043e\u043b\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0439 \u0441\u0440\u0435\u0434\u0435 \u043e\u0442 \u043f\u0435\u0440\u0432\u043e\u0433\u043e \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f \u0434\u043e \u0437\u0430\u043a\u0440\u044b\u0442\u0438\u044f \u0440\u0430\u0431\u043e\u0442\u044b.",
    "curated_eyebrow": "\u0427\u0430\u0441\u0442\u043d\u044b\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u044b",
    "curated_h2": "\u0422\u0440\u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f. \u0427\u0451\u0442\u043a\u0438\u0439 \u043e\u0431\u044a\u0451\u043c. \u0424\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442.",
    "curated_intro": "\u041a\u0430\u0436\u0434\u044b\u0439 \u0441\u0435\u0440\u0432\u0438\u0441 \u043d\u0438\u0436\u0435 \u0432\u043a\u043b\u044e\u0447\u0430\u0435\u0442 \u0447\u0451\u0442\u043a\u043e\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435: \u0447\u0442\u043e \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435, \u0437\u0430 \u043a\u0430\u043a\u043e\u0439 \u0441\u0440\u043e\u043a \u0438 \u0432 \u043a\u0430\u043a\u043e\u043c \u0444\u043e\u0440\u043c\u0430\u0442\u0435 \u2014 \u0434\u043e \u043e\u043f\u043b\u0430\u0442\u044b. \u0411\u0435\u0437 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u0445 \u0440\u0435\u0442\u0435\u0439\u043d\u0435\u0440\u043e\u0432 \u0438 \u043f\u043e\u0447\u0430\u0441\u043e\u0432\u043e\u0439 \u043d\u0435\u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0451\u043d\u043d\u043e\u0441\u0442\u0438.",
    "card1_h3": "\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0434\u043e\u0433\u043e\u0432\u043e\u0440\u043e\u0432 \u0438 \u0430\u0440\u0435\u043d\u0434\u044b",
    "card1_p": "\u041d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0432\u0430\u0436\u043d\u044b\u0445 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u0434\u043e \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u0438\u044f. \u0412\u044b\u0434\u0435\u043b\u044f\u0435\u043c \u0443\u0441\u043b\u043e\u0432\u0438\u044f, \u0432\u044b\u0445\u043e\u0434\u044f\u0449\u0438\u0435 \u0437\u0430 \u0440\u044b\u043d\u043e\u0447\u043d\u044b\u0435 \u043d\u043e\u0440\u043c\u044b, \u043a\u043e\u043c\u0438\u0441\u0441\u0438\u0438 \u0432\u044b\u0448\u0435 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0445 \u043f\u043e\u0440\u043e\u0433\u043e\u0432 \u0438 \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0440\u0430\u0441\u0445\u043e\u0434\u044f\u0442\u0441\u044f \u0441 \u0443\u0441\u0442\u043d\u044b\u043c\u0438 \u0434\u043e\u0433\u043e\u0432\u043e\u0440\u0435\u043d\u043d\u043e\u0441\u0442\u044f\u043c\u0438.",
    "card1_li1": "\u041f\u043e\u0441\u0442\u0430\u0442\u0435\u0439\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440 \u0441 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f\u043c\u0438",
    "card1_li2": "\u0420\u0430\u0437\u043c\u0435\u0442\u043a\u0430 \u0440\u0438\u0441\u043a\u043e\u0432 \u0438 \u043f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u043d\u044b\u0445 \u0440\u044b\u0447\u0430\u0433\u043e\u0432",
    "card1_li3": "\u041a\u0440\u0430\u0442\u043a\u043e\u0435 \u0440\u0435\u0437\u044e\u043c\u0435 \u043d\u0430 \u043f\u0440\u043e\u0441\u0442\u043e\u043c \u044f\u0437\u044b\u043a\u0435",
    "card1_cta1": "\u041f\u043e\u043f\u0440\u043e\u0431\u043e\u0432\u0430\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0439 \u0441\u043a\u0430\u043d\u0435\u0440",
    "card1_cta2": "\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0443",
    "card2_h3": "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u043e\u0433\u043e \u043f\u0430\u043a\u0435\u0442\u0430",
    "card2_p": "\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u0434\u043b\u044f USCIS: \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u043c \u0438\u043d\u0434\u0435\u043a\u0441 \u0434\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432, \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u043c \u043f\u043e\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0444\u043e\u0440\u043c \u0438 \u0433\u043e\u0442\u043e\u0432\u0438\u043c \u043f\u0430\u043f\u043a\u0443 \u0434\u043b\u044f \u043f\u043e\u0434\u0430\u0447\u0438. \u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f \u0438 \u0440\u0435\u0448\u0435\u043d\u0438\u044f \u043f\u043e \u043f\u043e\u0434\u0430\u0447\u0435 \u043e\u0441\u0442\u0430\u044e\u0442\u0441\u044f \u0437\u0430 \u0432\u0430\u0448\u0438\u043c \u0430\u0434\u0432\u043e\u043a\u0430\u0442\u043e\u043c.",
    "card2_li1": "\u0418\u043d\u0434\u0435\u043a\u0441 \u0434\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432 \u0438 \u0447\u0435\u043a-\u043b\u0438\u0441\u0442",
    "card2_li2": "\u041f\u043e\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0444\u043e\u0440\u043c \u0438 \u0432\u043a\u043b\u0430\u0434\u043a\u0438 \u044d\u043a\u0441\u043f\u043e\u043d\u0430\u0442\u043e\u0432",
    "card2_li3": "\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0433\u043e\u0442\u043e\u0432\u043d\u043e\u0441\u0442\u0438 \u043a \u043f\u043e\u0434\u0430\u0447\u0435",
    "card2_cta1": "\u041f\u043e\u043f\u0440\u043e\u0431\u043e\u0432\u0430\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0439 \u043f\u043e\u043c\u043e\u0449\u043d\u0438\u043a",
    "card2_cta2": "\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0443",
    "card3_h3": "\u0410\u043d\u0430\u043b\u0438\u0437 \u0430\u0432\u0442\u043e\u0441\u0434\u0435\u043b\u043a\u0438 \u0438 \u043a\u0440\u0443\u043f\u043d\u044b\u0445 \u043f\u043e\u043a\u0443\u043f\u043e\u043a",
    "card3_p": "\u0420\u0430\u0437\u0431\u043e\u0440 \u043f\u043e\u043b\u043d\u043e\u0433\u043e deal sheet \u0434\u043e \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u0438\u044f: \u0441\u0447\u0438\u0442\u0430\u0435\u043c \u0440\u0435\u0430\u043b\u044c\u043d\u044b\u0439 \u0435\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 \u043f\u043b\u0430\u0442\u0451\u0436, \u0432\u044b\u0434\u0435\u043b\u044f\u0435\u043c \u043a\u043e\u043c\u0438\u0441\u0441\u0438\u0438 \u0432\u044b\u0448\u0435 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0445 \u043f\u043e\u0440\u043e\u0433\u043e\u0432 (doc fee, GAP, \u0433\u0430\u0440\u0430\u043d\u0442\u0438\u044f) \u0438 \u0433\u043e\u0442\u043e\u0432\u0438\u043c \u043f\u0435\u0440\u0435\u0447\u0435\u043d\u044c \u043f\u0443\u043d\u043a\u0442\u043e\u0432 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u043e\u0432.",
    "card3_li1": "\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043f\u043e\u0440\u043e\u0433\u043e\u0432 \u043f\u043e doc fee, GAP, \u0433\u0430\u0440\u0430\u043d\u0442\u0438\u0438",
    "card3_li2": "\u0420\u0435\u0430\u043b\u044c\u043d\u044b\u0439 \u0435\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 \u043f\u043b\u0430\u0442\u0451\u0436 \u0441 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u043e\u0439 APR",
    "card3_li3": "\u0417\u0430\u043f\u0438\u0441\u043a\u0430 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u043e\u0432",
    "card3_cta1": "\u041f\u043e\u043f\u0440\u043e\u0431\u043e\u0432\u0430\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0439 \u043a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440",
    "card3_cta2": "\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c \u0440\u0430\u0437\u0431\u043e\u0440",
    "card4_h3": "\u041b\u043e\u043a\u0430\u0442\u043e\u0440 \u043e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0445 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u043e\u0432 \u0424\u043b\u043e\u0440\u0438\u0434\u044b",
    "card4_p": "\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442 \u043d\u0430 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u043e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u043f\u043e\u0440\u0442\u0430\u043b \u043f\u0440\u0430\u0432\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0424\u043b\u043e\u0440\u0438\u0434\u044b \u0434\u043b\u044f \u043e\u043f\u043b\u0430\u0442\u044b \u0434\u043e\u0440\u043e\u0433, \u0448\u0442\u0440\u0430\u0444\u043e\u0432 \u0438 \u0441\u0443\u0434\u0435\u0431\u043d\u044b\u0445 \u0437\u0430\u043f\u0438\u0441\u0435\u0439. VitaCoreX \u043d\u0435 \u0438\u0437\u0432\u043b\u0435\u043a\u0430\u0435\u0442 \u0437\u0430\u043f\u0438\u0441\u0438 \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u2014 \u043c\u044b \u0443\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u043c \u043d\u0430 \u0430\u0432\u0442\u043e\u0440\u0438\u0442\u0435\u0442\u043d\u044b\u0439 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a.",
    "card4_li1": "SunPass, CFX \u0438 \u043f\u043e\u0440\u0442\u0430\u043b\u044b \u043e\u043a\u0440\u0443\u0433\u043e\u0432",
    "card4_li2": "\u041f\u043e\u0440\u0442\u0430\u043b\u044b \u043a\u043b\u0435\u0440\u043a\u043e\u0432 \u043e\u043a\u0440\u0443\u0433\u043e\u0432 \u043f\u043e \u0448\u0442\u0440\u0430\u0444\u0430\u043c",
    "card4_li3": "\u041f\u043e\u0440\u0442\u0430\u043b\u044b \u0441\u0443\u0434\u043e\u0432 \u0424\u043b\u043e\u0440\u0438\u0434\u044b \u0438 PACER",
    "card4_cta1": "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043b\u043e\u043a\u0430\u0442\u043e\u0440 \u043f\u043e\u0440\u0442\u0430\u043b\u043e\u0432",
    "fit_good_pill": "\u0425\u043e\u0440\u043e\u0448\u0435\u0435 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435",
    "fit_good_li1": "\u0421\u0440\u043e\u0447\u043d\u044b\u0439 \u0440\u0430\u0437\u0431\u043e\u0440 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430 \u0434\u043e \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u0438\u044f, \u043f\u043e\u0434\u0430\u0447\u0438 \u0438\u043b\u0438 \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430.",
    "fit_good_li2": "\u0412\u043e\u043f\u0440\u043e\u0441\u044b, \u0433\u0434\u0435 \u0434\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0438\u0434\u0451\u0442 \u043e\u0442 \u0441\u0430\u043c\u043e\u0433\u043e \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430, \u0430 \u043d\u0435 \u043e\u0442 \u0434\u043b\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430.",
    "fit_good_li3": "\u041a\u043b\u0438\u0435\u043d\u0442\u044b, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0445\u043e\u0442\u044f\u0442 \u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u0438 \u044f\u0441\u043d\u044b\u0439 \u043a\u043e\u043d\u0435\u0446 \u0440\u0430\u0431\u043e\u0442\u044b \u2014 \u0430 \u043d\u0435 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u0439 \u0440\u0435\u0442\u0435\u0439\u043d\u0435\u0440.",
    "fit_not_pill": "\u041d\u0435 \u043f\u0440\u0435\u0434\u043d\u0430\u0437\u043d\u0430\u0447\u0435\u043d\u043e \u0434\u043b\u044f",
    "fit_not_li1": "\u042d\u043a\u0441\u0442\u0440\u0435\u043d\u043d\u043e\u0433\u043e \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430, \u0441\u0443\u0434\u0435\u0431\u043d\u043e\u0439 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438 \u0438\u043b\u0438 \u0440\u0430\u0431\u043e\u0442\u044b \u0430\u0434\u0432\u043e\u043a\u0430\u0442\u0430 \u0441 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u043c.",
    "fit_not_li2": "\u041e\u0442\u043a\u0440\u044b\u0442\u043e\u0439 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0431\u0435\u0437 \u0447\u0451\u0442\u043a\u043e \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0451\u043d\u043d\u043e\u0433\u043e \u043e\u0431\u044a\u0451\u043c\u0430.",
    "fit_not_li3": "\u041f\u0440\u044f\u043c\u043e\u0439 \u043f\u043e\u0434\u0430\u0447\u0438 \u0440\u0435\u0433\u0443\u043b\u0438\u0440\u0443\u0435\u043c\u044b\u0445 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u043e\u0442 \u0438\u043c\u0435\u043d\u0438 \u043a\u043b\u0438\u0435\u043d\u0442\u0430.",
    "cta_privacy": "\u041e\u0437\u043d\u0430\u043a\u043e\u043c\u0438\u0442\u044c\u0441\u044f \u0441 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u043e\u0439 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438",
    "cta_intake": "\u041d\u0430\u0447\u0430\u0442\u044c \u0447\u0430\u0441\u0442\u043d\u044b\u0439 intake",
}

NEW_ES = {
    "title": "Servicios para clientes privados | VitaCoreX LLC",
    "desc": "Asesor\u00eda de alcance definido para asuntos privados: revisi\u00f3n de contratos, preparaci\u00f3n de paquete de inmigraci\u00f3n y an\u00e1lisis de compra de auto. Alcance, plazo y entregable claros.",
    "hero_eyebrow": "Servicios para clientes privados",
    "hero_title": "Asesor\u00eda para clientes privados, con alcance y estructura.",
    "hero_lead": "Tres servicios para individuos y familias: revisi\u00f3n de contratos, preparaci\u00f3n de paquete de inmigraci\u00f3n y an\u00e1lisis de compra de auto. Cada contrataci\u00f3n tiene un alcance definido, un plazo claro y un paquete documental entregado \u2014 antes de comprometerse.",
    "side_h3": "Discreci\u00f3n por defecto",
    "side_p": "Cada asunto se maneja uno a uno. Sin flujos compartidos ni plantillas gen\u00e9ricas. Sus documentos permanecen en un entorno aislado desde el primer mensaje hasta el entregable final.",
    "curated_eyebrow": "Servicios privados",
    "curated_h2": "Tres servicios. Alcance definido. Entregable fijo.",
    "curated_intro": "Cada servicio a continuaci\u00f3n detalla exactamente qu\u00e9 recibe, cu\u00e1nto tarda y en qu\u00e9 formato \u2014 antes de comprometerse. Sin retenedores abiertos ni incertidumbre de horas facturables.",
    "card1_h3": "Revisi\u00f3n de contratos y arrendamientos",
    "card1_p": "Revisi\u00f3n independiente de documentos importantes antes de firmar. Identificamos cl\u00e1usulas fuera de las normas del mercado, tarifas que se desv\u00edan de los umbrales y compromisos que no coinciden con el acuerdo verbal.",
    "card1_li1": "Revisi\u00f3n cl\u00e1usula por cl\u00e1usula con anotaciones",
    "card1_li2": "Marcado de riesgo y apalancamiento de negociaci\u00f3n",
    "card1_li3": "Memo resumen en lenguaje claro",
    "card1_cta1": "Probar el esc\u00e1ner gratis",
    "card1_cta2": "Solicitar revisi\u00f3n",
    "card2_h3": "Preparaci\u00f3n de paquete de inmigraci\u00f3n",
    "card2_p": "Soporte de organizaci\u00f3n documental para paquetes USCIS. Construimos el \u00edndice de evidencia, verificamos la secuencia de formularios y preparamos la carpeta lista para enviar. La estrategia legal y las decisiones de presentaci\u00f3n las conserva su abogado.",
    "card2_li1": "\u00cdndice de evidencia y lista de verificaci\u00f3n",
    "card2_li2": "Secuencia de formularios y tabulado de anexos",
    "card2_li3": "Revisi\u00f3n de preparaci\u00f3n para presentaci\u00f3n",
    "card2_cta1": "Probar el asistente gratis",
    "card2_cta2": "Solicitar preparaci\u00f3n",
    "card3_h3": "Revisi\u00f3n de compra de auto y adquisiciones mayores",
    "card3_p": "An\u00e1lisis previo a la firma de la hoja completa del trato. Calculamos el pago mensual real, se\u00f1alamos tarifas del concesionario por encima de umbrales comunes (doc fee, GAP, garant\u00eda extendida) y resumimos los puntos de negociaci\u00f3n a plantear en la mesa.",
    "card3_li1": "Verificaci\u00f3n de umbrales en doc fee, GAP, garant\u00eda",
    "card3_li2": "Pago mensual real con verificaci\u00f3n de APR",
    "card3_li3": "Memo de puntos de negociaci\u00f3n",
    "card3_cta1": "Probar la calculadora gratis",
    "card3_cta2": "Solicitar revisi\u00f3n",
    "card4_h3": "Localizador de fuentes oficiales de Florida",
    "card4_p": "Le dirige al portal oficial correcto del gobierno de Florida para peajes, citaciones de tr\u00e1fico y registros judiciales. VitaCoreX no recupera registros directamente \u2014 le se\u00f1ala la fuente autorizada.",
    "card4_li1": "Portales de SunPass, CFX y peajes del condado",
    "card4_li2": "Portales de citaciones de tr\u00e1fico del condado",
    "card4_li3": "Portales de tribunales de Florida y PACER",
    "card4_cta1": "Abrir localizador de portales",
    "fit_good_pill": "Buen encaje",
    "fit_good_li1": "Revisi\u00f3n documental con plazo ajustado antes de firmar, presentar o comprometerse.",
    "fit_good_li2": "Asuntos donde la presi\u00f3n proviene del documento mismo, no de una representaci\u00f3n continua.",
    "fit_good_li3": "Clientes que quieren un entregable fijo y un final claro \u2014 no un retenedor abierto.",
    "fit_not_pill": "No dise\u00f1ado para",
    "fit_not_li1": "Representaci\u00f3n legal de urgencia, estrategia judicial o trabajo abogado-cliente.",
    "fit_not_li2": "Administraci\u00f3n personal abierta sin alcance definido.",
    "fit_not_li3": "Presentaci\u00f3n directa de archivos regulados en nombre del cliente.",
    "cta_privacy": "Revisar pol\u00edtica de privacidad",
    "cta_intake": "Iniciar intake privado",
}

def patch_page_data(html: str) -> str:
    # Locate the inline PAGE_DATA object after `window.PAGE_DATA=`
    # It starts with { and ends with }; (terminated by ;).
    marker = "window.PAGE_DATA="
    idx = html.find(marker)
    if idx < 0:
        raise SystemExit("PAGE_DATA not found")
    start = idx + len(marker)
    # Walk brace depth from the first `{`
    assert html[start] == "{", "Expected { after window.PAGE_DATA="
    depth = 0
    end = None
    i = start
    in_str = False
    esc = False
    while i < len(html):
        c = html[i]
        if esc:
            esc = False
        elif c == "\\":
            esc = True
        elif c == '"':
            in_str = not in_str
        elif not in_str:
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        i += 1
    if end is None:
        raise SystemExit("Could not find matching } for PAGE_DATA")

    old_json = html[start:end]
    data = json.loads(old_json)
    # Merge new keys into en/ru/es, preserving anything else (e.g. advisory_*)
    for lang_key, patch in (("en", NEW_EN), ("ru", NEW_RU), ("es", NEW_ES)):
        if lang_key not in data:
            data[lang_key] = {}
        data[lang_key].update(patch)
    # Serialize compact (single line) to match original
    new_json = json.dumps(data, ensure_ascii=False, separators=(", ", ": "))
    return html[:start] + new_json + html[end:]


def main() -> int:
    html = TARGET.read_text(encoding="utf-8")
    new_html = patch_page_data(html)
    if new_html == html:
        print("No changes applied")
        return 0
    TARGET.write_text(new_html, encoding="utf-8")
    print(f"Updated {TARGET.name} PAGE_DATA (en/ru/es)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
