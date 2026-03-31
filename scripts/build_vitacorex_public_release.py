from __future__ import annotations

import json
from pathlib import Path

from vitacorex_public_translations import GLOBAL_COPY, OG_LOCALE, PAGE_TRANSLATIONS

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
except ImportError:  # pragma: no cover - optional dependency in local packaging only
    letter = None
    canvas = None

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = 'https://vitacorexllc.com'
LANGS = ('en', 'ru', 'es')
BOOKING_URL = 'https://calendly.com/vitacorex2025/30min'
PRIVATE_LINE_DISPLAY = '(888) 794-8292'
PRIVATE_LINE_HREF = 'tel:+18887948292'
TRACKING_IDS = {
    'ga4': 'G-E08EE1KSQQ',
    'gtm': '',
    'clarity': '',
    'hotjarSiteId': '',
    'hotjarVersion': 6,
    'metaPixel': '',
    'linkedInPartner': '',
    'apolloAppId': '69a7b325debb1e000d36d253',
}
WEBPAGE_TYPES = {
    'about': 'AboutPage',
    'contact': 'ContactPage',
    'solutions': 'CollectionPage',
    'industries': 'CollectionPage',
    'resources': 'CollectionPage',
}
SERVICE_SCHEMA = {
    'revenue-recovery-workflow': {
        'name': 'Revenue Recovery Workflow Design',
        'serviceType': 'Revenue recovery workflow advisory',
        'audience': 'Finance-led operators with aged receivables, payment-plan complexity, and external-placement pressure.',
    },
    'corporate-legal-file-control': {
        'name': 'Counsel-Ready File Control and Packet Standards',
        'serviceType': 'Corporate file control and counsel-ready packet preparation',
        'audience': 'Counsel-facing organizations with weak chronology, missing records, and packet-handoff risk.',
    },
    'structured-case-intake': {
        'name': 'Structured Case Intake and Packet Readiness',
        'serviceType': 'Structured intake design and packet-readiness advisory',
        'audience': 'Operators with repeatable intake, document-readiness, and evidence-discipline bottlenecks.',
    },
}
PAGES = {
    'index': {
        'surface': 'dark',
        'title': 'Revenue Recovery and Documentation Control for Complex Operators | VitaCoreX',
        'description': 'VitaCoreX helps finance-led operators reduce revenue leakage, strengthen documentation control, and improve counsel-ready handoff before outside cost expands.',
        'kicker': 'For finance-led operators and counsel-facing teams',
        'h1': 'Revenue recovery design and documentation control for operators that cannot afford a weak handoff.',
        'intro': 'VitaCoreX helps companies tighten recovery sequencing, improve file discipline, and create a safer next step before outside legal or agency cost expands.',
        'hero_rows': [
            ('What VitaCoreX does', 'Revenue recovery design, legal file control, and structured intake discipline for complex operators.'),
            ('What VitaCoreX does not do', 'It does not sell generic services, promise legal outcomes, or act as a law firm.'),
            ('What a first engagement can produce', 'A confidential review, an executive brief, a blocker log, and a clear recommendation for diagnose, pilot, scale, or no-fit.'),
        ],
        'sections': [
            ('Trust signals', [
                ('Operator signal', 'Tampa, Florida based advisory built for U.S. operators, finance teams, and counsel-facing leadership.'),
                ('Documentation-first', 'The story is framed around file quality, packet logic, and operating control instead of vague consulting language.'),
                ('Response discipline', 'Qualified company inquiries receive an initial response target within one business day, with yes-fit and no-fit decisions made explicitly.'),
                ('Boundary', 'VitaCoreX is not a law firm and does not promise legal outcomes.'),
            ], 'trust'),
            ('Three controlled service lanes', [
                ('Revenue Recovery Infrastructure', 'Tighten sequencing, payment-plan logic, cohort visibility, and placement discipline before recoverable balances decay into avoidable fee compression.', '/revenue-recovery-workflow.html', 'Explore recovery lane'),
                ('Corporate Legal File Control', 'Build chronology, exhibit order, and counsel-ready packet logic before outside legal spend is burdened by administrative cleanup.', '/corporate-legal-file-control.html', 'Review file-control lane'),
                ('Structured Intake and Packet Design', 'Control intake requirements, blocker visibility, and packet readiness before downstream cost grows around weak evidence.', '/structured-case-intake.html', 'See intake standard'),
            ], 'linked_cards'),
            ('What leadership receives first', [
                ('Executive brief', 'A short operating read on leakage, file condition, and the safest next move before outside cost expands.'),
                ('First artifact preview', 'A practical view of the packet, chronology, intake gate, or workflow standard that needs to be built first.'),
                ('Bounded recommendation', 'A clear path to diagnose, pilot, scale, or no-fit instead of an inflated promise.'),
            ], 'cards'),
            ('What the first 10 business days can produce', [
                ('Blocker log', 'A visible list of missing records, sequencing breaks, and handoff risks that still need to be resolved before the work expands.'),
                ('Workflow or packet map', 'A concise map of the current operating lane, packet state, or intake gate so leadership can see where the real failure starts.'),
                ('Diagnose / pilot / no-fit memo', 'A short recommendation that makes the next move explicit instead of hiding behind general consulting language.'),
            ], 'cards'),
            ('Evidence standard before a pilot begins', [
                ('Named blockers', 'The firm expects a visible list of missing records, weak handoff points, or sequencing breaks before calling a lane ready.'),
                ('Real operating context', 'The strongest first pass includes account mix, workflow pressure, or packet examples rather than abstract pain statements alone.'),
                ('Decision owner', 'The review should support a real internal decision by finance, ownership, or a counsel-facing operator, not browsing for generic ideas.'),
            ], 'cards'),
            ('How engagements work', [
                ('Diagnose', 'Review the current workflow, file condition, escalation timing, and internal forwarding risk.'),
                ('Pilot', 'Run one bounded operator lane with evidence, reporting, and a clear decision point.'),
                ('Scale', 'Expand only after the pilot proves fit, response quality, and economic logic.'),
            ], 'steps'),
            ('Who it is for and not for', [
                ('For', 'Multi-location healthcare and dental operators, subscription businesses, fleet or fuel programs, and contract-heavy service companies with real documentation and escalation complexity.'),
                ('Not for', 'Buyers looking for a generic agency, a self-praising consulting deck, or public pages that overstate legal capability.'),
            ], 'compare'),
            ('How to move through the trust layer', [
                ('See the three-lane architecture', 'Use the solutions page when the company knows the problem is real but still needs to classify the safest first lane.', '/solutions.html', 'See solution architecture'),
                ('See operator environments', 'Use the industries page when the buyer needs to confirm whether the operating environment fits the VitaCoreX posture.', '/industries.html', 'See operator environments'),
                ('See proof surfaces', 'Use the proof hub when leadership needs an executive brief, sample packet logic, or a bounded pilot artifact before review.', '/resources.html', 'See proof surfaces'),
            ], 'linked_cards'),
            ('FAQ', [
                ('Is VitaCoreX a law firm or a licensed collection agency?', 'No. VitaCoreX is an advisory and documentation-control layer. Legal strategy, legal advice, and regulated collections activity remain outside the public-site offer.'),
                ('Why are there no public case studies, client logos, or outcome tables here?', 'Because VitaCoreX uses bounded proof surfaces and anonymized operator-safe materials instead of public claims that can distort fit, confidentiality, or legal and commercial expectations.'),
                ('What should a serious buyer prepare before asking for review?', 'A short operating summary, the current blocker pattern, and sample documents if they already exist.'),
            ], 'faq'),
        ],
        'cta_title': 'Request a confidential review when the operating problem is real enough to justify a serious next step.',
        'cta_copy': 'The safest CTA is the clearest one: a confidential review that checks the operating model, file condition, and whether the right next step is review, pilot, packet-control work, or a no-fit decision.',
    },
    'solutions': {
        'surface': 'dark',
        'title': 'Revenue Recovery, File Control, and Intake Design Solutions | VitaCoreX',
        'description': 'Compare VitaCoreX service lanes for revenue recovery workflow, counsel-ready file control, and structured intake design to identify the right first engagement.',
        'kicker': 'Solutions',
        'h1': 'Three solution lines. One operator story.',
        'intro': 'The public site stays company-first by classifying the operating problem into three bounded solution lines instead of a vague services catalog.',
        'sections': [
            ('Core solution architecture', [
                ('Revenue Recovery Infrastructure', 'Design the timing, rules, reporting, and escalation logic that protect cash before external fees compress margin.', '/revenue-recovery-workflow.html', 'Open recovery lane'),
                ('Corporate Legal File Control', 'Build a cleaner chronology, exhibit order, and counsel-facing packet standard before legal strategy is burdened with administrative cleanup.', '/corporate-legal-file-control.html', 'Open file-control lane'),
                ('Structured Intake and Packet Design', 'Control what enters the system, what is missing, and what is ready so the next step is based on evidence rather than guesswork.', '/structured-case-intake.html', 'Open intake lane'),
            ], 'linked_cards'),
            ('Who this architecture is for and not for', [
                ('For', 'Finance-led operators with a real bottleneck in recovery design, file quality, or intake readiness.'),
                ('Not for', 'Buyers hunting for a generic service catalog, self-serve software, or public claims that pretend to replace legal judgment.'),
            ], 'compare'),
            ('What a first company engagement can produce', [
                ('Operating read', 'A short summary of leakage, file condition, and internal handoff risk.'),
                ('Pilot map', 'A scoped plan for one lane, one evidence window, and one decision point.'),
                ('Packet logic', 'A practical view of what a cleaner packet, chronology, and gap log should look like.'),
            ], 'cards'),
            ('How lane selection works', [
                ('Diagnose the real bottleneck', 'Decide whether the first problem is sequencing, file quality, intake readiness, or a combination that needs staged work.'),
                ('Match the first lane', 'Choose the lane that produces the clearest first deliverable and the safest next-step logic.'),
                ('Confirm evidence and decision owner', 'Pressure-test whether enough context exists to recommend diagnose, pilot, scale, or no-fit.'),
            ], 'steps'),
            ('Compliance boundaries', [
                ('Advisory, not legal representation', 'The solutions describe operating design, documentation control, and intake standards. They do not substitute for attorney judgment.'),
                ('Company-first posture', 'The public architecture is built for operator-side decision making first, with individual services kept secondary and bounded.'),
                ('No theatrical guarantees', 'The site avoids fake ROI counters, promised legal outcomes, and other trust-destroying public claims.'),
            ], 'cards'),
            ('Supporting trust surfaces', [
                ('See operator environments', 'Use the industries page when the lane is still clear only after matching it to the real operating environment.', '/industries.html', 'See operator environments'),
                ('Review proof surfaces', 'Use the proof hub when leadership wants an executive brief, pilot memo, or sample packet before choosing scope.', '/resources.html', 'Review proof surfaces'),
                ('Understand VitaCoreX posture', 'Use the about page when internal stakeholders need the firm boundary, method, and selection logic in one place.', '/about.html', 'Understand the posture'),
            ], 'linked_cards'),
            ('FAQ', [
                ('How should a buyer choose between the three lanes?', 'Start with the lane that fixes the earliest blocker in the operating story. If sequencing is breaking, start with recovery infrastructure. If the file is weak, start with file control. If readiness is weak, start with intake design.'),
                ('Can a company use more than one lane?', 'Yes, but the first step is still bounded. VitaCoreX prefers one first deliverable and one decision point before broader work expands.'),
                ('What evidence is needed to choose the first lane with confidence?', 'A useful first choice usually needs three things: a visible blocker pattern, one representative packet or workflow example, and a real internal decision owner.'),
                ('What if the bottleneck spans recovery, file quality, and intake at the same time?', 'That is common. VitaCoreX still prefers one first lane and one bounded deliverable so leadership can evaluate the next move with evidence instead of bundling everything into a vague transformation project.'),
            ], 'faq'),
        ],
        'cta_title': 'Use the review page when a company needs a direct recommendation, not more browsing.',
        'cta_copy': 'The review path stays short, structured, and selective so a CFO, owner, or counsel-facing operator can move with confidence.',
    },
    'revenue-recovery-workflow': {
        'surface': 'dark',
        'title': 'Revenue Recovery Workflow Design for Complex Operators | VitaCoreX',
        'description': 'Improve revenue recovery workflow, sequencing, payment-plan logic, and cohort visibility before external placement and fee compression erode recoverable balances.',
        'kicker': 'Revenue recovery infrastructure',
        'h1': 'Prevent recoverable balances from decaying into avoidable fee compression.',
        'intro': 'This lane is for operators that need a stronger recovery model before accounts drift into weak follow-up, fragmented payment logic, or premature external placement.',
        'sections': [
            ('Scope', [
                ('What it addresses', 'Inconsistent follow-up, weak payment-plan discipline, poor visibility across cohorts, and agency placement that arrives before internal sequencing is strong enough.'),
                ('What it produces first', 'A confidential operating read, a pilot lane recommendation, and a directional view of where cash conversion is weakening.'),
                ('What it is not', 'It is not a promise of collections outcomes, litigation work, or a generic demand campaign.'),
            ], 'cards'),
            ('Fit', [
                ('For', 'Operators with recurring payment complexity, aged receivables, multi-site inconsistency, or rising external recovery cost.'),
                ('Not for', 'Businesses seeking a commodity collections vendor or a public page that overclaims legal power.'),
            ], 'compare'),
            ('What the first deliverable set includes', [
                ('Workflow map', 'A concise view of sequencing, exceptions, and handoff points that are weakening recovery performance.'),
                ('Leakage checkpoint summary', 'A short read on where balances decay through timing drift, weak follow-up, or poor operator discipline.'),
                ('Pilot recommendation', 'A bounded next step with scope, evidence window, and a clear decision point before broader rollout.'),
            ], 'cards'),
            ('How the lane runs', [
                ('Map the current recovery sequence', 'Review the existing follow-up path, payment-plan logic, escalation timing, and where external placement begins.'),
                ('Pressure-test the highest-risk cohorts', 'Check which balance types, sites, or account groups are creating the most avoidable compression.'),
                ('Define the first bounded intervention', 'Recommend diagnose, pilot, or a broader redesign only after the pattern is visible enough to act on.'),
            ], 'steps'),
            ('Evidence and KPI standard', [
                ('Cohort logic first', 'The strongest review starts with aging, exceptions, payment behavior, and handoff condition - not decorative outcome claims.'),
                ('Operator-side proof', 'VitaCoreX looks for the actual rules, scripts, reports, and workflow breaks driving weak performance.'),
                ('Measured pilot criteria', 'Any pilot recommendation should define what improves, what is observed, and what would invalidate expansion.'),
            ], 'cards'),
            ('What a ready pilot already shows', [
                ('Aging and exception view', 'Leadership can point to the balances, cohort pressure, or exception categories that make the current sequence commercially weak.'),
                ('Payment-plan rule review', 'The current rule set is visible enough to test where flexibility, drift, or inconsistency is harming recovery quality.'),
                ('Placement timing checkpoint', 'The company can show when accounts move downstream today and why that timing may be too early, too late, or too inconsistent.'),
            ], 'cards'),
            ('Pilot readiness', [
                ('Ready for pilot', 'A real cohort, visible handoff sequence, and one decision owner are already identifiable.'),
                ('Not ready for pilot', 'The operator still cannot show which balances, rules, or exceptions are actually breaking first.'),
            ], 'compare'),
            ('Adjacent service lines', [
                ('Corporate Legal File Control', 'Use file control when weak chronology, missing records, or poor packet condition are delaying confident escalation.', '/corporate-legal-file-control.html', 'Review file-control lane'),
                ('Structured Intake and Packet Design', 'Use intake design when new matters enter the workflow without enough evidence or blocker visibility.', '/structured-case-intake.html', 'Review intake lane'),
                ('Proof and Executive Briefs', 'Use the proof hub when a buyer needs a bounded brief or sample artifact before recommending a pilot internally.', '/resources.html', 'Open proof hub'),
                ('Operator environments', 'Use the industries page when leadership needs to confirm whether this lane matches the operating environment before a pilot begins.', '/industries.html', 'See operator fit'),
            ], 'linked_cards'),
            ('FAQ', [
                ('Does this page promise collections results?', 'No. The lane is about designing a stronger recovery model, not promising regulated collections outcomes.'),
                ('Does VitaCoreX replace an agency, a collector, or direct debtor outreach?', 'No. This lane is about upstream recovery design, sequencing, controls, and handoff logic before regulated collections activity or external placement takes over.'),
                ('When is a pilot better than a full redesign?', 'When the operator needs evidence on one lane first before expanding budget, workflow change, or downstream handoff.'),
                ('How is success judged before expansion?', 'Through a bounded pilot standard: defined cohorts, observed workflow change, visible exception handling, and a decision point that can stop expansion if the evidence is weak.'),
            ], 'faq'),
        ],
        'cta_title': 'Start with a confidential review when the recovery issue is material enough to warrant structured intervention.',
        'cta_copy': 'The first question is whether the highest-value move is diagnose, pilot, or a broader redesign of the operating model.',
    },
    'corporate-legal-file-control': {
        'surface': 'dark',
        'title': 'Counsel-Ready File Control and Packet Standards | VitaCoreX',
        'description': 'Build stronger chronology, exhibit order, and document control before counsel review is slowed by missing records, weak packet structure, or poor handoff quality.',
        'kicker': 'Corporate legal file control',
        'h1': 'Build a cleaner file before legal cost expands.',
        'intro': 'This lane is for operators that need stronger chronology, packet discipline, and counsel-facing file quality before outside legal strategy is burdened with cleanup.',
        'sections': [
            ('Scope', [
                ('What it addresses', 'Missing records, uneven exhibit order, weak chronology, and packet assembly that makes internal forwarding or counsel review politically risky.'),
                ('What it produces first', 'A gap log, packet-control standard, and clearer handoff logic for counsel-facing teams.'),
                ('What it is not', 'It is not legal representation, legal advice, or a substitute for attorney judgment.'),
            ], 'cards'),
            ('Fit', [
                ('For', 'Counsel-facing organizations with weak file discipline, inconsistent packet assembly, or heavy administrative cleanup before escalation.'),
                ('Not for', 'Buyers seeking courtroom claims on a public page or one-off document support without an operating problem behind it.'),
            ], 'compare'),
            ('What the first deliverable set includes', [
                ('Chronology standard', 'A cleaner event sequence that makes downstream review faster, safer, and easier to forward internally.'),
                ('Gap log', 'A visible list of missing records, weak exhibits, or unresolved blockers that still prevent a clean packet.'),
                ('Counsel-ready packet map', 'A practical view of how the packet should be organized before outside legal strategy takes over.'),
            ], 'cards'),
            ('How the lane runs', [
                ('Assess the current packet state', 'Review chronology, exhibit order, naming discipline, and what is still missing or hard to defend.'),
                ('Standardize the packet logic', 'Define how the file should be ordered, labeled, and pressure-tested before it moves downstream.'),
                ('Confirm the handoff boundary', 'Clarify what the company should complete before counsel review and what remains outside VitaCoreX scope.'),
            ], 'steps'),
            ('Evidence standard', [
                ('Required-document visibility', 'The first pass should show which records exist, which are missing, and which still need authentication or cleanup.'),
                ('Chronology over storytelling', 'The lane prioritizes sequence, exhibit logic, and file discipline over vague narrative claims.'),
                ('Boundary on legal judgment', 'VitaCoreX can strengthen the packet, but it does not replace attorney review or advise on litigation strategy.'),
            ], 'cards'),
            ('What a cleaner packet shows', [
                ('Chronology excerpt', 'The sequence of events can be understood quickly enough that a reviewer sees what happened, when it happened, and what still needs proof.'),
                ('Gap visibility', 'Missing records, weak exhibits, and unresolved blockers remain visible instead of being buried in a polished but incomplete file.'),
                ('Exhibit order', 'The packet is organized to support review and forwarding instead of forcing counsel or leadership to reconstruct the story from scratch.'),
            ], 'cards'),
            ('Pilot readiness', [
                ('Ready for pilot', 'A representative packet, a visible missing-record pattern, and one downstream review owner can already be identified.'),
                ('Not ready for pilot', 'The company still cannot show which documents exist, which are missing, or who the improved packet is supposed to support.'),
            ], 'compare'),
            ('Adjacent service lines', [
                ('Revenue Recovery Infrastructure', 'Use the recovery lane when weak operating sequence is part of the same story behind file breakdown.', '/revenue-recovery-workflow.html', 'Review recovery lane'),
                ('Structured Intake and Packet Design', 'Use intake design when file problems start at the intake gate rather than later packet assembly.', '/structured-case-intake.html', 'Review intake lane'),
                ('Proof and Executive Briefs', 'Use the proof hub when leadership needs a bounded sample packet or executive read before committing.', '/resources.html', 'Open proof hub'),
                ('Operator environments', 'Use the industries page when leadership needs to confirm where this lane fits before forwarding the work internally.', '/industries.html', 'See operator fit'),
            ], 'linked_cards'),
            ('FAQ', [
                ('Does file control replace legal review?', 'No. It improves chronology, packet order, and blocker visibility before legal review begins.'),
                ('Can this work begin before outside counsel is retained?', 'Yes. Chronology cleanup, gap visibility, and packet standardization often create value before counsel selection because they reduce later cleanup and improve the eventual handoff.'),
                ('Why does this matter commercially?', 'Weak file control creates avoidable cleanup, slower counsel-facing review, and higher downstream cost before strategy even starts.'),
                ('Will outside counsel actually receive something usable?', 'That is the point of the lane: a chronology standard, clearer exhibit order, and a visible blocker log that make the packet easier to review and easier to trust.'),
            ], 'faq'),
        ],
        'cta_title': 'Use the company review path when the packet itself is delaying confident action.',
        'cta_copy': 'The review will clarify whether the strongest next move is file cleanup, packet control, or a combined pilot with recovery design work.',
    },
    'structured-case-intake': {
        'surface': 'dark',
        'title': 'Structured Case Intake and Packet Readiness | VitaCoreX',
        'description': 'Strengthen case intake, required-document logic, and packet readiness so only evidence-ready matters move downstream or escalate further.',
        'kicker': 'Structured intake and packet design',
        'h1': 'Control what enters the process before the next step becomes expensive.',
        'intro': 'This lane is for companies that need a stronger intake gate, a cleaner readiness standard, and a more reliable packet before downstream cost or internal confusion grows.',
        'sections': [
            ('Scope', [
                ('What it addresses', 'Unclear intake requirements, inconsistent evidence collection, poor blocker visibility, and packet readiness that depends on who handled the matter.'),
                ('What it produces first', 'A structured intake map, a required-document logic, and a cleaner view of blockers versus ready files.'),
                ('What it is not', 'It is not a public promise of regulated intake, legal advice, or an all-purpose case-management implementation.'),
            ], 'cards'),
            ('Fit', [
                ('For', 'Teams with recurring packet work, mixed file quality, or too much downstream rework caused by weak intake control.'),
                ('Not for', 'One-off buyers who do not need a repeatable intake discipline or leadership teams that only want cosmetic process language.'),
            ], 'compare'),
            ('What the first deliverable set includes', [
                ('Intake gate map', 'A clearer rule set for what should enter the process, what should pause, and what should not advance yet.'),
                ('Required-document logic', 'A practical minimum for packet readiness so the next step is based on evidence instead of assumption.'),
                ('Ready-versus-blocked view', 'A visible method for separating workable files from files that still need records, clarification, or cleanup.'),
            ], 'cards'),
            ('How the lane runs', [
                ('Define trigger points', 'Review where requests enter the workflow and what information is currently missing at the moment of intake.'),
                ('Classify blockers early', 'Separate missing documents, weak evidence, and out-of-scope matters before they consume downstream time.'),
                ('Route only ready files', 'Recommend an intake rule set that protects the next team from preventable rework and weak packet quality.'),
            ], 'steps'),
            ('Evidence standard', [
                ('Minimum viable packet', 'Each matter should show the required documents, current blocker status, and a clean path to readiness.'),
                ('Consistent chronology and naming', 'The lane favors repeatable packet structure so the next reviewer is not guessing what each file means.'),
                ('Escalation only after readiness', 'The public posture is explicit: do not escalate a matter just because it arrived. Escalate when the evidence standard is met.'),
            ], 'cards'),
            ('Ready vs blocked in practice', [
                ('Ready file', 'The required documents exist, chronology is understandable, and the next reviewer can see why the matter is actually ready to move.'),
                ('Blocked file', 'The matter is still missing records, identity of the blocker, or enough evidence to justify downstream effort.'),
                ('Escalation-ready file', 'The packet is complete enough that legal, recovery, or downstream teams are not being asked to solve preventable intake failures.'),
            ], 'cards'),
            ('Pilot readiness', [
                ('Ready for pilot', 'One matter type, one intake gate, or one repeatable blocker pattern can already be inspected with real evidence.'),
                ('Not ready for pilot', 'The company still cannot show what readiness means, what should be blocked, or which files are actually safe to escalate.'),
            ], 'compare'),
            ('Adjacent service lines', [
                ('Revenue Recovery Infrastructure', 'Use the recovery lane when intake weakness is one part of a broader sequencing problem across receivables.', '/revenue-recovery-workflow.html', 'Review recovery lane'),
                ('Corporate Legal File Control', 'Use file control when the intake gate is acceptable but the downstream packet still breaks under counsel-facing review.', '/corporate-legal-file-control.html', 'Review file-control lane'),
                ('Proof and Executive Briefs', 'Use the proof hub when leadership needs a sample packet or briefing to align stakeholders before change begins.', '/resources.html', 'Open proof hub'),
                ('Operator environments', 'Use the industries page when leadership needs to confirm whether this lane fits the operating environment before a pilot begins.', '/industries.html', 'See operator fit'),
            ], 'linked_cards'),
            ('FAQ', [
                ('Is this a public legal intake product?', 'No. It is an advisory lane for intake rules, packet readiness, and evidence discipline.'),
                ('Does this require replacing our CRM, intake system, or current forms?', 'No. The first step is usually a rules-and-readiness standard that can be layered onto the current workflow before any tooling change is considered.'),
                ('Why does the evidence standard matter so much?', 'Because weak intake creates expensive downstream cleanup, poor handoffs, and avoidable escalation on incomplete files.'),
                ('Can this lane start with one matter type or one intake gate first?', 'Yes. VitaCoreX prefers a bounded intake pilot when one lane or packet type can prove whether better evidence discipline actually improves downstream readiness.'),
            ], 'faq'),
        ],
        'cta_title': 'Start with review when the intake layer itself is the bottleneck.',
        'cta_copy': 'The first step is to confirm what the intake gate should capture, what should be blocked, and what should be escalated only after evidence is complete.',
    },
    'industries': {
        'surface': 'dark',
        'title': 'Industries with Expensive Documentation and Handoff Risk | VitaCoreX',
        'description': 'Where VitaCoreX fits best: healthcare, dental, subscription, fleet, fuel, logistics, and contract-heavy operators with real documentation and escalation complexity.',
        'kicker': 'Industries',
        'h1': 'Designed for operators with real documentation and escalation complexity.',
        'intro': 'The model is strongest where recurring balances, contract load, and counsel-facing handoff quality are expensive enough to justify disciplined intervention.',
        'sections': [
            ('Core operator environments', [
                ('Healthcare and dental operators', 'Multi-location environments where recurring receivables, patient balances, and file quality need a safer handoff before outside cost expands.'),
                ('Subscription and recurring-payment businesses', 'Operators that need tighter follow-up, stronger payment-plan logic, and better exception handling across account cohorts.'),
                ('Fleet, fuel, and logistics programs', 'Programs with volume, contract complexity, or portfolio inconsistency that make ad hoc recovery and packet control too risky.'),
                ('Contract-heavy service businesses', 'Companies that need cleaner chronology, stronger documentation, and a more credible counsel-facing packet standard.'),
            ], 'cards4'),
            ('Typical first lane by operator environment', [
                ('Healthcare and dental operators', 'Recurring receivables and multi-site follow-up issues usually map first to recovery infrastructure.', '/revenue-recovery-workflow.html', 'Open recovery lane'),
                ('Contract-heavy service businesses', 'When packet quality and chronology are the real blockers, corporate legal file control is usually the safer first lane.', '/corporate-legal-file-control.html', 'Open file-control lane'),
                ('Document-heavy intake programs', 'If the bottleneck begins at intake, packet design and evidence readiness should be fixed before anything escalates.', '/structured-case-intake.html', 'Open intake lane'),
            ], 'linked_cards'),
            ('What buyer fit looks like', [
                ('Strong fit', 'The problem is expensive, repeatable, and visible enough that leadership wants a safer operating model and a clearer handoff logic.'),
                ('Weak fit', 'The need is only one-off consumer help, generic consulting language, or a vague request without an operating problem behind it.'),
            ], 'compare'),
            ('How to continue from industry fit', [
                ('See the three-lane architecture', 'Use the solutions page when the industry fit is clear but the right first lane still needs to be classified.', '/solutions.html', 'See solutions'),
                ('Review proof for internal forwarding', 'Use the proof hub when leadership wants a brief, pilot memo, or sample packet before approving the first move.', '/resources.html', 'Review proof'),
                ('Understand the advisory boundary', 'Use the about page when internal stakeholders need the firm posture and engagement logic in one place.', '/about.html', 'Review firm posture'),
            ], 'linked_cards'),
            ('FAQ', [
                ('Does VitaCoreX only work in these industries?', 'No. These are the most common operator environments where the public posture fits especially well. The real question is whether the documentation, sequencing, and handoff problem is material enough to justify structured intervention.'),
                ('How complex does the operating problem need to be before VitaCoreX is a fit?', 'The problem should be material, repeatable, documented enough to inspect, and tied to a real leadership decision about recovery, file quality, or intake readiness.'),
                ('What if the company spans more than one environment?', 'That is common. VitaCoreX still prefers one first lane, one bounded deliverable, and one decision point before broader scope expands.'),
            ], 'faq'),
        ],
        'cta_title': 'If the issue maps to one of these operator environments, use the review path and keep the discussion concrete.',
        'cta_copy': 'The form is structured to capture the lane, the pain, and the likely next step without forcing unnecessary friction up front.',
    },
    'resources': {
        'surface': 'dark',
        'title': 'Executive Briefs, Sample Outputs, and Pilot Proof | VitaCoreX',
        'description': 'Review executive brief framing, sample packet logic, and pilot proof materials designed for CFO, owner, and counsel-facing internal forwarding.',
        'kicker': 'Proof materials',
        'h1': 'Proof that supports internal forwarding, not public theater.',
        'intro': 'VitaCoreX uses executive briefs, sample packet logic, and bounded pilot materials so a serious buyer can explain the firm internally without guessing or inventing proof.',
        'sections': [
            ('What the proof layer contains', [
                ('Executive brief framing', 'Short, decision-useful materials for CFO, owner, and counsel-facing review.'),
                ('Sample output strip', 'Pilot structure, file-control deliverable, executive brief, and sample packet logic presented as concrete working outputs.'),
                ('Representative scenario', 'A bounded example with realistic context rather than zero-state counters or theatrical ROI claims.'),
            ], 'cards'),
            ('Use the right proof surface', [
                ('Executive brief PDF', 'A short operator-facing read on leakage, file condition, and the safest next move before outside cost expands.', '/assets/briefs/vitacorex-executive-brief.pdf', 'Review brief'),
                ('Pilot structure memo', 'A bounded pilot model with scope, responsibilities, evidence window, and decision logic.', '/assets/briefs/vitacorex-pilot-structure.pdf', 'Review pilot memo'),
                ('File-control sample', 'An anonymized sample of chronology, required-document logic, and gap visibility.', '/assets/briefs/vitacorex-file-control-sample.pdf', 'Review sample'),
            ], 'linked_cards'),
            ('Inside each proof asset', [
                ('Inside the executive brief', 'Current condition, blocker pattern, first-artifact view, and the rule for diagnose, pilot, scale, or no-fit.'),
                ('Inside the pilot memo', 'Scope, evidence window, responsibilities, and the stop-or-expand criteria before a broader rollout.'),
                ('Inside the file-control sample', 'Chronology excerpt, required-document logic, gap visibility, and the handoff boundary before counsel review.'),
            ], 'cards'),
            ('What the proof does and does not claim', [
                ('Representative, not theatrical', 'The materials illustrate what a serious first pass can look like without pretending every operator or outcome is identical.'),
                ('Strongest with context', 'The proof surfaces are most useful when paired with enough company context to match the right material to the next decision.'),
                ('Useful for internal forwarding', 'The goal is to help a CFO, owner, or counsel-facing operator explain the lane internally without overselling the public story.'),
            ], 'cards'),
            ('Choose the right lane after proof', [
                ('Use proof for recovery design', 'Move into the recovery lane when the materials confirm that sequencing, payment-plan logic, or cohort leakage is the first bottleneck.', '/revenue-recovery-workflow.html', 'Open recovery lane'),
                ('Use proof for file-control review', 'Move into the file-control lane when chronology, exhibit order, or packet quality are delaying confident escalation.', '/corporate-legal-file-control.html', 'Open file-control lane'),
                ('Use proof for intake design', 'Move into the intake lane when readiness, blocker visibility, or required-document logic are still weak at the front end.', '/structured-case-intake.html', 'Open intake lane'),
                ('Compare the three lanes', 'Use the solutions page when leadership wants to classify the safest first lane before requesting proof or review.', '/solutions.html', 'Compare solutions'),
            ], 'linked_cards'),
            ('FAQ', [
                ('Are these materials guaranteed engagement outcomes?', 'No. They are proof surfaces that clarify approach, boundaries, and next-step logic.'),
                ('Why use the brief form if some proof materials are already visible here?', 'Because the strongest path still ties the request to buyer context, fit, and the most useful next-step decision instead of treating every operator like the same case.'),
                ('Are the sample materials anonymized and representative?', 'Yes. The proof is intentionally bounded and anonymized. It is meant to show the shape and discipline of the work without pretending to be a public case study library.'),
                ('Why are there no public testimonials, logos, or exact outcome tables?', 'Because the proof layer is designed for internal forwarding and credibility, not for theatrical social proof that can overstate fit, confidentiality, or outcomes.'),
            ], 'faq'),
        ],
        'cta_title': 'Use the brief form when leadership needs proof tied to a real company decision, not a vague email handoff.',
        'cta_copy': 'The form keeps the request tied to company context, language, and the most useful proof surface for the next conversation.',
    },
    'contact': {
        'surface': 'dark',
        'title': 'Request a Confidential Company Review | VitaCoreX',
        'description': 'Request a confidential company review for revenue recovery, file control, or intake readiness with structured context capture and controlled document handling.',
        'kicker': 'Review',
        'h1': 'Request a confidential review without turning the first step into a long intake interview.',
        'intro': 'The review page is company-first. Advanced fields stay available for serious buyers, but the visible form stays focused on fit, operating pain, and the safest next step.',
        'sections': [
            ('Visible trust around the review', [
                ('Response window', 'Qualified company inquiries receive an initial response target within one business day.'),
                ('Controlled document handling', 'Documents and context enter a controlled review path. The first pass asks only for materials that clarify fit, blockers, or the next decision.'),
                ('Bounded next step', 'The outcome is a clearer recommendation for review, pilot, scale, reroute, or no-fit rather than a vague promise.'),
            ], 'cards'),
            ('Who should use this form and who should not', [
                ('Use this form when', 'The request is company-first, tied to an operator problem, and needs a bounded recommendation on recovery design, file control, or intake readiness.'),
                ('Do not use this form when', 'The request is really a private-client document matter, a broad software demo request, or a search for public legal advice.'),
            ], 'compare'),
            ('Use the right support surface before you submit', [
                ('Choose the right lane first', 'Use the solutions page when the operating issue is real but the first lane is still unclear.', '/solutions.html', 'See solutions'),
                ('Check operator fit', 'Use the industries page when leadership wants to confirm that the operating environment fits the VitaCoreX posture before submitting.', '/industries.html', 'See industries'),
                ('Review proof before submitting', 'Use the proof hub when internal stakeholders want an executive brief or sample artifact before the company review begins.', '/resources.html', 'Review proof'),
            ], 'linked_cards'),
            ('What to prepare before submitting', [
                ('Decision context', 'State the business issue, the internal decision this review should support, and the lane that seems most likely.'),
                ('Current blocker pattern', 'Describe where the workflow, packet, or intake layer is failing today rather than listing abstract goals.'),
                ('Sample materials if available', 'Optional files are useful when they illustrate the problem clearly, but they are not required to submit the first review request.'),
            ], 'cards'),
            ('What the first response can include', [
                ('Executive brief recommendation', 'The first response can point leadership to the most useful proof surface before the work expands into a pilot.'),
                ('Document request only when needed', 'Follow-up requests stay narrow and are used only when they improve the next decision.'),
                ('No-fit or reroute decision', 'When the request belongs in a private-client path, needs regulated legal representation, or lacks enough context, VitaCoreX can say no or reroute it quickly.'),
            ], 'cards'),
            ('What happens after submission', [
                ('Structured triage', 'The request is reviewed against fit, scope, and the likely first lane instead of being dropped into an inbox-only flow.'),
                ('Bounded next-step recommendation', 'VitaCoreX responds with review, pilot, scale, private-client routing, or no-fit guidance when appropriate.'),
                ('Document request only when useful', 'If more evidence is needed, the follow-up asks only for what clarifies the next decision.'),
            ], 'steps'),
            ('FAQ', [
                ('Do I need to upload documents on the first form?', 'No. The first review can begin with a concise description, and files are requested only when they improve the decision.'),
                ('What happens if the request is not a fit?', 'VitaCoreX can decline, defer, or reroute the request when the issue belongs in a private-client path, needs regulated legal representation, or lacks enough operator context to justify review.'),
                ('Will this form create an attorney-client relationship?', 'No. The form starts a bounded advisory review and does not create legal representation.'),
                ('Why does the form ask for company context, lane, and routing detail?', 'Because the goal is not inbox capture. The first pass needs enough operating context to preserve attribution, assess fit, and recommend the safest next lane.'),
            ], 'faq'),
        ],
        'cta_title': 'The company review path is designed for clarity first.',
        'cta_copy': 'The first step stays short, structured, and auditable so serious buyers are not forced through a prototype-feeling form.',
    },
    'about': {
        'surface': 'soft',
        'title': 'About VitaCoreX: Advisory Model and Boundaries | VitaCoreX',
        'description': 'Learn what VitaCoreX does, what it does not do, who the firm is built for, and how bounded diagnose, pilot, and scale engagements are structured.',
        'kicker': 'About',
        'h1': 'A selective advisory posture built around operator clarity, file quality, and safer handoff logic.',
        'intro': 'VitaCoreX is positioned as a premium advisory layer for complex operators, not a general service marketplace and not a law firm.',
        'sections': [
            ('How VitaCoreX works', [
                ('What VitaCoreX does', 'Revenue recovery design, corporate legal file control, and structured intake discipline for operator teams that need a safer next step.'),
                ('What stays outside scope', 'The public site does not offer legal representation, generic agency services, or fake prestige signals meant to substitute for proof.'),
                ('How the first decision is made', 'A first review clarifies fit, a bounded pilot proves evidence, and scale follows only when the operating model justifies it.'),
            ], 'cards'),
            ('Who the firm is for and not for', [
                ('For', 'Operators with enough complexity, documentation load, or counsel-facing pressure that weak handoff quality becomes expensive.'),
                ('Not for', 'Buyers looking for public legal advice, commodity collections services, or a one-size-fits-all consulting menu.'),
            ], 'compare'),
            ('What a first engagement produces', [
                ('Executive brief', 'A short operator-facing read on leakage, file condition, and the safest next move before outside cost expands.'),
                ('Blocker or gap log', 'A visible list of missing records, sequencing breaks, or packet issues that still need to be resolved.'),
                ('Diagnose / pilot / no-fit recommendation', 'A clear recommendation on whether to move, narrow scope, or stop instead of stretching the engagement to fit.'),
            ], 'cards'),
            ('Method and evidence chain', [
                ('Review the operator context', 'Start with the current workflow, file state, or intake gate and the internal decision this work is supposed to support.'),
                ('Pressure-test the evidence', 'Confirm what records exist, what is still missing, and whether the pattern is strong enough for a bounded pilot.'),
                ('Recommend one controlled next move', 'Advance only when the first lane, deliverable, and decision owner are visible enough to justify action.'),
            ], 'steps'),
            ('Proof surfaces for internal forwarding', [
                ('See solution architecture', 'Use the solutions page when internal stakeholders want the three-lane framework in one place before approving scope.', '/solutions.html', 'See solutions'),
                ('See operator environments', 'Use the industries page when the buyer needs to confirm that the operating environment fits the VitaCoreX posture.', '/industries.html', 'See industries'),
                ('Review proof materials', 'Use the proof hub when leadership needs an executive brief, pilot memo, or sample packet before moving ahead.', '/resources.html', 'Review proof'),
            ], 'linked_cards'),
            ('Compliance boundaries', [
                ('Not a law firm', 'VitaCoreX does not provide legal representation or legal advice on the public site.'),
                ('Not a licensed collection agency', 'The public posture is upstream operating design and documentation control, not a public claim to regulated collections activity.'),
                ('Evidence before expansion', 'The firm prefers bounded proof, explicit deliverables, and a real decision owner before any broader deployment.'),
            ], 'cards'),
            ('FAQ', [
                ('What kinds of engagements does VitaCoreX decline at the first pass?', 'The firm declines work that is too vague, too consumer-like, too legal-strategy dependent, or too disconnected from a real operator-side decision and evidence trail.'),
                ('Why does VitaCoreX avoid public legal or collections claims?', 'Because the public offer is deliberately upstream: operator advisory, packet control, and intake discipline before regulated legal or collections activity begins.'),
                ('How does VitaCoreX differ from a generic consulting firm?', 'The public story is built around revenue recovery logic, file quality, intake standards, and concrete operator deliverables rather than abstract transformation language.'),
            ], 'faq'),
        ],
        'cta_title': 'Use the company review page when the issue is specific enough to justify a serious conversation.',
        'cta_copy': 'The public site stays selective by design. Clarity and boundary come before volume.',
    },
    'additional-services': {
        'surface': 'soft',
        'title': 'Selected Private Client Documentation Support | VitaCoreX',
        'description': 'Selected private-client documentation support that remains secondary to the company-first VitaCoreX advisory model.',
        'kicker': 'Private Client Services',
        'h1': 'A quieter secondary path for selected private-client matters.',
        'intro': 'Private-client work remains available, but it is intentionally subordinate to the company lane so enterprise buyers are never forced to classify VitaCoreX as a general services marketplace.',
        'sections': [
            ('Selected private-client scope', [
                ('Contracts and documentation support', 'Selected reviews for contracts, personal documentation packages, and evidence organization when the scope is bounded and document-driven.'),
                ('Immigration packet organization', 'Structured packet assembly support for document-heavy matters without presenting the public site as regulated legal intake or legal representation.'),
                ('Founder and launch documentation', 'Selected planning or startup materials where the need is limited, document-heavy, and genuinely secondary to the company lane.'),
            ], 'cards'),
            ('What a bounded private-client engagement can produce', [
                ('Review memo', 'A concise note on document condition, missing items, and the safest next administrative move.'),
                ('Packet organization standard', 'A cleaner structure for personal documents, chronology, and supporting records when the matter is a fit.'),
                ('Next-step note', 'A bounded recommendation on what should be clarified, prepared, or forwarded next without overstating legal scope.'),
            ], 'cards'),
            ('How the secondary review works', [
                ('Confirm that the matter is documentation-first', 'The request is screened for bounded documentation support, organization, or packet readiness rather than open-ended legal strategy.'),
                ('Limit the review to one decision window', 'The safest first step is one packet, one deadline, or one bounded document problem instead of a sprawling private matter.'),
                ('Decline or reroute when legal strategy controls the outcome', 'If filings, court posture, or representation are the real issue, VitaCoreX narrows scope or declines the request.'),
            ], 'steps'),
            ('What to have ready before asking for review', [
                ('Current documents', 'Bring the records, drafts, or packet materials that already exist so the first pass can stay concrete.'),
                ('Decision deadline', 'Explain what deadline, filing window, or practical decision the review needs to support.'),
                ('Boundary awareness', 'Use this route when the need is documentation support, organization, or bounded review - not public legal advice or court promises.'),
            ], 'cards'),
            ('Compliance boundaries', [
                ('No legal representation', 'The page remains limited to documentation support, organization, and bounded review.'),
                ('No filing or court promises', 'The public site does not promise filing strategy, courtroom outcomes, or regulated immigration or legal representation.'),
                ('Secondary by design', 'The private-client lane remains available without displacing the company-first advisory story.'),
            ], 'cards'),
            ('Self-selection matters', [
                ('Use this page when', 'The request is individual, document-driven, and does not belong in the company advisory lane.'),
                ('Do not use this page when', 'The real need is operator-side recovery design, file-control work, or a counsel-facing corporate handoff issue.'),
            ], 'compare'),
            ('FAQ', [
                ('Does this page offer legal representation?', 'No. It offers bounded documentation support, organization, and review where the scope is appropriate.'),
                ('Can immigration packet support include filing or legal advice?', 'No. The page is limited to packet organization and document readiness, not legal representation or filing strategy.'),
                ('What private matters are still out of scope even if they are document-heavy?', 'Anything that depends on public legal advice, court promises, filing strategy, or ongoing legal representation remains outside scope even when the documents are substantial.'),
                ('Will VitaCoreX review a single contract or document set?', 'Sometimes, if the matter is bounded, document-driven, and appropriate for a secondary review lane. The page is not meant for open-ended legal problem solving.'),
            ], 'faq'),
        ],
        'cta_title': 'Private-client requests stay available without diluting the premium company signal.',
        'cta_copy': 'This page exists for selected secondary work and keeps the conversion path clean for individuals.',
    },
    'careers': {
        'surface': 'soft',
        'title': 'Careers | VitaCoreX',
        'description': 'Selective careers page for operator-side workflow, documentation, and intake roles.',
        'kicker': 'Careers',
        'h1': 'Careers stay visible, but clearly secondary to the buyer journey.',
        'intro': 'The public site keeps careers in a quieter lane. Applications are welcome, but the core brand remains company-first and buyer-facing.',
        'sections': [('What VitaCoreX looks for', [('Documentation discipline', 'Candidates who care about clean packet logic, structured intake, and careful execution over vague operations language.'), ('Operator empathy', 'People who understand finance-led teams, counsel-facing pressure, and the cost of weak handoffs.'), ('Selective process', 'Applications are reviewed against concrete work needs rather than vanity headcount.')], 'cards')],
        'cta_title': 'Applications are reviewed selectively and do not interrupt the company-first buyer path.',
        'cta_copy': 'Careers remain professional and visible without competing with the premium company lane.',
    },
    'privacy-policy': {
        'surface': 'soft',
        'title': 'Privacy Policy | VitaCoreX',
        'description': 'How VitaCoreX handles public-site lead data, attachments, consent preferences, and structured intake records.',
        'kicker': 'Privacy Policy',
        'h1': 'Privacy for a company-first advisory site.',
        'intro': 'This policy explains how VitaCoreX handles public-site requests, optional attachments, consent settings, and structured lead-routing metadata.',
        'sections': [('What is collected', [('What is collected', 'Public forms may collect contact details, company context, attribution data, language, page path, selected service line, and optional file attachments.')], 'policy'), ('Why it is collected', [('Why it is collected', 'The data is used to evaluate fit, route the inquiry, store an audit-ready lead record, and coordinate the appropriate next step.')], 'policy'), ('How it is stored', [('How it is stored', 'Submissions are stored in structured backend records with attachment metadata and optional CRM webhook delivery when configured.')], 'policy'), ('What is not promised', [('What is not promised', 'The public site does not claim regulated clinical intake, legal representation, or any use beyond the bounded review and routing process described here.')], 'policy')],
        'cta_title': 'Use the visible consent settings and browser controls when you want to limit optional measurement.',
        'cta_copy': 'Essential storage supports routing, language choice, and form integrity.',
    },
    'terms-of-use': {
        'surface': 'soft',
        'title': 'Terms of Use | VitaCoreX',
        'description': 'Terms governing the public VitaCoreX site, public forms, and the advisory boundary around company and private-client requests.',
        'kicker': 'Terms of Use',
        'h1': 'Terms for a bounded public advisory surface.',
        'intro': 'These terms govern use of the public site, its forms, downloadable assets, and the advisory boundary described on VitaCoreX pages.',
        'sections': [('Informational scope', [('Informational scope', 'Public pages describe advisory, documentation, and intake-control services. They do not form an attorney-client relationship or provide legal advice.')], 'policy'), ('Submission rules', [('Submission rules', 'Users should submit accurate information, avoid unlawful content, and only upload files they are authorized to share.')], 'policy'), ('Asset and content use', [('Asset and content use', 'Executive briefs, proof materials, and public content are provided for review and evaluation. They may not be copied or republished as your own materials.')], 'policy'), ('No guaranteed outcome', [('No guaranteed outcome', 'A submitted form or downloaded brief does not guarantee engagement, response, or legal outcome.')], 'policy')],
        'cta_title': 'Use the review path only when the operating issue is real and the information shared is accurate.',
        'cta_copy': 'The public site is selective by design and may decline or defer engagements that do not fit.',
    },
    'cookie-policy': {
        'surface': 'soft',
        'title': 'Cookie Policy | VitaCoreX',
        'description': 'Essential settings, consent preferences, attribution persistence, and optional measurement on the VitaCoreX public site.',
        'kicker': 'Cookie Policy',
        'h1': 'Cookie and consent details with a restrained posture.',
        'intro': 'VitaCoreX uses essential browser storage for language, consent, and form integrity. Optional measurement can be enabled without blocking access.',
        'sections': [('Essential storage', [('Essential storage', 'Language choice, consent state, and certain form-integrity values may be stored to keep the site usable and the submission process reliable.')], 'policy'), ('Attribution values', [('Attribution values', 'UTM values, page path, referrer, and similar context may be captured on form submission to preserve attribution and routing clarity.')], 'policy'), ('Optional measurement', [('Optional measurement', 'If enabled, optional measurement is handled separately from essential storage and should never block the public site.')], 'policy'), ('User control', [('User control', 'Visitors can use the visible consent controls and browser settings to limit or clear stored preferences.')], 'policy')],
        'cta_title': 'The visible consent controls are part of the trust layer, not an afterthought.',
        'cta_copy': 'VitaCoreX keeps essential and optional states separate so the site remains usable even when optional measurement is declined.',
    },
    'thank-you': {
        'surface': 'dark',
        'title': 'Thank You | VitaCoreX',
        'description': 'Confirmation page for structured VitaCoreX review, brief, careers, and private-client requests.',
        'kicker': 'Thank you',
        'h1': 'Your request is in the queue.',
        'intro': 'The page adjusts the message by request type and language while preserving the same controlled next-step logic.',
        'sections': [],
        'cta_title': 'Keep the next step controlled.',
        'cta_copy': 'Review, proof, and private-client routes stay clear and bounded after submission.',
    },
}

UI = {
    'en': {
        'home': 'Home',
        'solutions': 'Solutions',
        'industries': 'Industries',
        'proof': 'Proof',
        'review': 'Review',
        'about': 'About',
        'private': 'Private Client Services',
        'careers': 'Careers',
        'privacy': 'Privacy Policy',
        'terms': 'Terms of Use',
        'cookies': 'Cookie Policy',
        'signin': 'Sign in',
        'review_cta': 'Request confidential review',
        'proof_cta': 'Review executive brief',
        'subtitle': 'Operator advisory and documentation control',
        'city': 'Tampa, Florida, U.S.',
        'boundary': 'VitaCoreX is not a law firm. The public site describes advisory, documentation, and intake control services only.',
        'footer_brand': 'VitaCoreX LLC',
        'footer_copy': 'Premium operator advisory for revenue recovery design, legal file control, and structured intake before outside cost expands.',
        'footer_services': 'Core service lines',
        'footer_firm': 'Firm posture',
        'footer_secondary': 'Secondary routes',
        'footer_boundary': 'Legal boundary',
        'contact_line': f'Private consultation line: {PRIVATE_LINE_DISPLAY}',
        'call_cta': 'Call private line',
        'book_cta': 'Book consultation',
        'lang_label': 'Language',
        'primary_label': 'Primary navigation',
        'mobile_label': 'Mobile navigation',
        'breadcrumbs_label': 'Breadcrumbs',
        'skip': 'Skip to content',
        'menu': 'Menu',
        'service_btn': 'Request service',
        'career_btn': 'Submit application',
    },
    'ru': {
        'home': 'Главная',
        'solutions': 'Решения',
        'industries': 'Отрасли',
        'proof': 'Материалы',
        'review': 'Разбор',
        'about': 'О компании',
        'private': 'Частные услуги',
        'careers': 'Карьера',
        'privacy': 'Политика конфиденциальности',
        'terms': 'Условия использования',
        'cookies': 'Политика файлов куки',
        'signin': 'Войти',
        'review_cta': 'Запросить конфиденциальный разбор',
        'proof_cta': 'Запросить обзор для руководства',
        'subtitle': 'Операционный консалтинг и контроль документации',
        'city': 'Тампа, Флорида, США',
        'boundary': 'VitaCoreX не является юридической фирмой. Публичный сайт описывает только консультационные услуги, контроль документации и структурированную обработку обращений.',
        'footer_brand': 'VitaCoreX LLC',
        'footer_copy': 'Премиальный операционный консалтинг по проектированию возврата выручки, контролю юридического файла и структурированной обработке обращений до роста внешних затрат.',
        'footer_services': 'Ключевые сервисные направления',
        'footer_firm': 'Позиция фирмы',
        'footer_secondary': 'Дополнительные разделы',
        'footer_boundary': 'Правовые границы',
        'contact_line': f'Частная линия для консультаций: {PRIVATE_LINE_DISPLAY}',
        'call_cta': 'Позвонить на частную линию',
        'book_cta': 'Записаться на консультацию',
        'lang_label': 'Выбор языка',
        'primary_label': 'Основная навигация',
        'mobile_label': 'Мобильная навигация',
        'breadcrumbs_label': 'Навигационная цепочка',
        'skip': 'Перейти к содержанию',
        'menu': 'Меню',
        'service_btn': 'Запросить услугу',
        'career_btn': 'Отправить заявку',
    },
    'es': {
        'home': 'Inicio',
        'solutions': 'Soluciones',
        'industries': 'Industrias',
        'proof': 'Materiales',
        'review': 'Evaluación',
        'about': 'Nosotros',
        'private': 'Servicios privados',
        'careers': 'Carreras',
        'privacy': 'Política de privacidad',
        'terms': 'Términos de uso',
        'cookies': 'Política de cookies',
        'signin': 'Ingresar',
        'review_cta': 'Solicitar evaluación confidencial',
        'proof_cta': 'Solicitar resumen ejecutivo',
        'subtitle': 'Asesoría operativa y control documental',
        'city': 'Tampa, Florida, EE. UU.',
        'boundary': 'VitaCoreX no es un bufete de abogados. El sitio público describe únicamente servicios de asesoría, control documental y admisión estructurada.',
        'footer_brand': 'VitaCoreX LLC',
        'footer_copy': 'Asesoría premium para operadores sobre diseño de recuperación de ingresos, control del expediente legal y admisión estructurada antes de que aumente el costo externo.',
        'footer_services': 'Líneas centrales de servicio',
        'footer_firm': 'Postura de la firma',
        'footer_secondary': 'Rutas secundarias',
        'footer_boundary': 'Límite legal',
        'contact_line': f'Línea privada de consulta: {PRIVATE_LINE_DISPLAY}',
        'call_cta': 'Llamar a la línea privada',
        'book_cta': 'Reservar consulta',
        'lang_label': 'Idioma',
        'primary_label': 'Navegación principal',
        'mobile_label': 'Navegación móvil',
        'breadcrumbs_label': 'Ruta de navegación',
        'skip': 'Saltar al contenido',
        'menu': 'Menú',
        'service_btn': 'Solicitar servicio',
        'career_btn': 'Enviar postulación',
    },
}

DEFAULT_GLOBAL_COPY = {
    'hero_credibility_title': 'First-screen credibility',
    'lead_id_label': 'Lead ID:',
    'lead_pending': 'Pending',
    'schema_org_description': 'VitaCoreX LLC provides operator advisory for revenue recovery design, legal file control, and structured intake before outside cost expands.',
}

FORM_COPY = {
    'en': {
        'resource': {
            'aside_eyebrow': 'What happens next',
            'aside_title': 'What happens next',
            'aside_items': [
                'The request is captured with company context instead of getting lost in inbox-only email.',
                'VitaCoreX uses the request to send the most useful brief or follow-up material for the next internal decision.',
                'The resulting path stays bounded: review, pilot, or a no-fit recommendation.',
            ],
            'panel_eyebrow': 'Unlock the executive brief',
            'panel_intro': 'Use a short company form to request the executive brief. The form captures company context, language, and the material requested without reducing the page to lead bait.',
            'full_name': 'Full name',
            'work_email': 'Work email',
            'company': 'Company',
            'title': 'Title',
            'honeypot': 'Leave blank',
            'message': 'Message',
            'message_placeholder': 'Tell VitaCoreX what kind of operator context or decision path you want the brief to support.',
            'form_note': 'The form records attribution, language, route, and the material requested. It does not imply representation, legal advice, or guaranteed engagement.',
        },
        'company': {
            'aside_eyebrow': 'Visible trust around the form',
            'aside_title': 'Why the form looks reliable',
            'aside_body': 'A structured review path, controlled storage, and selective document requests replace prototype-style inbox handling.',
            'aside_response': 'Qualified company inquiries receive an initial response target within one business day.',
            'panel_eyebrow': 'Company review request',
            'panel_intro': 'Use this route for revenue recovery, file-control, and intake-discipline issues. Private-client requests belong on the secondary page.',
            'full_name': 'Full name',
            'work_email': 'Work email',
            'company': 'Company',
            'title': 'Title',
            'phone': 'Phone',
            'industry': 'Industry',
            'select': 'Select',
            'industry_options': [('Healthcare / Dental', 'Healthcare / Dental'), ('Subscription / Recurring payments', 'Subscription / Recurring payments'), ('Fleet / Fuel / Logistics', 'Fleet / Fuel / Logistics'), ('Contract-heavy services', 'Contract-heavy services'), ('Other', 'Other')],
            'honeypot': 'Leave blank',
            'summary': 'Add context',
            'annual_revenue_band': 'Annual revenue band',
            'annual_revenue_options': [('Under $5M', 'Under $5M'), ('$5M to $25M', '$5M to $25M'), ('$25M to $100M', '$25M to $100M'), ('$100M+', '$100M+')],
            'portfolio_size_band': 'Portfolio size band',
            'portfolio_size_options': [('Under $250K', 'Under $250K'), ('$250K to $1M', '$250K to $1M'), ('$1M to $5M', '$1M to $5M'), ('$5M+', '$5M+')],
            'documentation_condition': 'Documentation condition',
            'documentation_options': [('Structured', 'Structured'), ('Mixed by team or site', 'Mixed by team or site'), ('Weak chronology / packet quality', 'Weak chronology / packet quality')],
            'urgency': 'Urgency',
            'urgency_options': [('Immediate', 'Immediate'), ('30-day review', '30-day review'), ('Exploratory', 'Exploratory')],
            'pain_type': 'Pain type',
            'pain_type_placeholder': 'Leakage, fee compression, weak packet handoff, intake bottleneck',
            'attachment': 'Attachment',
            'file_empty': 'No file selected.',
            'attachment_note': 'Optional sample file. Attach only what helps clarify the next decision.',
            'message': 'Message',
            'message_placeholder': 'Describe the operating issue, the file condition, and the safest next step you need.',
            'form_note': 'Response window: one business day for qualified company inquiries. Documents are handled through controlled review. VitaCoreX is not a law firm.',
        },
        'private': {
            'aside_eyebrow': 'Secondary route',
            'aside_title': 'Private-client work stays available without crowding the company lane.',
            'panel_eyebrow': 'Private-client request',
            'panel_intro': 'The request form stays clean, selective, and clear about fit, confidentiality, and what happens next.',
            'full_name': 'Full name',
            'email': 'Email',
            'phone': 'Phone',
            'requested_service': 'Requested service',
            'select': 'Select',
            'service_options': [('Contracts and documentation support', 'Contracts and documentation support'), ('Immigration packet organization', 'Immigration packet organization'), ('Business or launch support', 'Business or launch support')],
            'honeypot': 'Leave blank',
            'message': 'Message',
            'message_placeholder': 'Describe the matter, timeline, and what support you need.',
            'form_note': 'This route is secondary and selective. VitaCoreX reviews fit before requesting unnecessary documents.',
        },
        'careers': {
            'panel_eyebrow': 'Selective application',
            'panel_intro': 'The application captures role interest, location, and a resume or sample document without turning careers into a top-level conversion focus.',
            'full_name': 'Full name',
            'email': 'Email',
            'location': 'Location',
            'role_interest': 'Role interest',
            'linkedin': 'LinkedIn URL',
            'resume': 'Resume or sample',
            'file_empty': 'No file selected.',
            'message': 'Message',
            'message_placeholder': 'Describe the role fit, relevant operator experience, and why VitaCoreX should review your application.',
            'honeypot': 'Leave blank',
            'aside_eyebrow': 'Secondary route',
            'aside_title': 'Careers remain subordinate to the buyer path.',
            'aside_body': 'The public site stays company-first. Careers are visible and professional, but they do not interrupt the core company review flow.',
        },
    },
    'ru': {
        'resource': {
            'aside_eyebrow': 'Что дальше',
            'aside_title': 'Что происходит после отправки',
            'aside_items': [
                'Запрос фиксируется вместе с контекстом компании, а не теряется в обычной входящей почте.',
                'VitaCoreX использует запрос, чтобы отправить наиболее полезный обзор или следующий материал для внутреннего решения.',
                'Дальнейший маршрут остается ограниченным: разбор, пилот или вывод о несоответствии.',
            ],
            'panel_eyebrow': 'Запросить обзор для руководства',
            'panel_intro': 'Используйте короткую корпоративную форму, чтобы запросить обзор для руководства. Форма фиксирует контекст компании, язык и нужный материал, не превращая страницу в приманку для заявок.',
            'full_name': 'Имя и фамилия',
            'work_email': 'Рабочая электронная почта',
            'company': 'Компания',
            'title': 'Должность',
            'honeypot': 'Оставьте поле пустым',
            'message': 'Сообщение',
            'message_placeholder': 'Опишите, какой операционный контекст или сценарий решения должен поддержать обзор.',
            'form_note': 'Форма фиксирует источник обращения, язык, маршрут и запрошенный материал. Она не означает юридическое представительство, юридическую консультацию или гарантированное начало работы.',
        },
        'company': {
            'aside_eyebrow': 'Видимые основания доверия',
            'aside_title': 'Почему форма выглядит надежно',
            'aside_body': 'Структурированный маршрут разбора, контролируемое хранение и выборочный запрос документов заменяют поведение уровня почтового прототипа.',
            'aside_response': 'По квалифицированным корпоративным запросам целевой срок первого ответа составляет один рабочий день.',
            'panel_eyebrow': 'Запрос корпоративного разбора',
            'panel_intro': 'Используйте этот маршрут для задач по возврату выручки, контролю файла и дисциплине приема. Запросы частных клиентов относятся к вторичной странице.',
            'full_name': 'Имя и фамилия',
            'work_email': 'Рабочая электронная почта',
            'company': 'Компания',
            'title': 'Должность',
            'phone': 'Телефон',
            'industry': 'Отрасль',
            'select': 'Выберите',
            'industry_options': [('Healthcare / Dental', 'Медицина / стоматология'), ('Subscription / Recurring payments', 'Подписки / регулярные платежи'), ('Fleet / Fuel / Logistics', 'Автопарки / топливо / логистика'), ('Contract-heavy services', 'Услуги с высокой договорной нагрузкой'), ('Other', 'Другое')],
            'honeypot': 'Оставьте поле пустым',
            'summary': 'Добавить контекст',
            'annual_revenue_band': 'Диапазон годовой выручки',
            'annual_revenue_options': [('Under $5M', 'До $5 млн'), ('$5M to $25M', '$5 млн - $25 млн'), ('$25M to $100M', '$25 млн - $100 млн'), ('$100M+', 'Свыше $100 млн')],
            'portfolio_size_band': 'Размер портфеля',
            'portfolio_size_options': [('Under $250K', 'До $250 тыс.'), ('$250K to $1M', '$250 тыс. - $1 млн'), ('$1M to $5M', '$1 млн - $5 млн'), ('$5M+', 'Свыше $5 млн')],
            'documentation_condition': 'Состояние документации',
            'documentation_options': [('Structured', 'Структурировано'), ('Mixed by team or site', 'Смешано по командам или площадкам'), ('Weak chronology / packet quality', 'Слабая хронология / качество пакета')],
            'urgency': 'Срочность',
            'urgency_options': [('Immediate', 'Немедленно'), ('30-day review', 'Оценка в течение 30 дней'), ('Exploratory', 'Предварительное изучение')],
            'pain_type': 'Тип проблемы',
            'pain_type_placeholder': 'Утечки, компрессия сборов, слабая передача пакета, узкое место на входе',
            'attachment': 'Вложение',
            'file_empty': 'Файл не выбран.',
            'attachment_note': 'Необязательный пример файла. Прикладывайте только то, что помогает прояснить следующее решение.',
            'message': 'Сообщение',
            'message_placeholder': 'Опишите операционную проблему, состояние файла и самый безопасный следующий шаг, который вам нужен.',
            'form_note': 'Окно ответа: один рабочий день для квалифицированных корпоративных запросов. Документы обрабатываются через контролируемый разбор. VitaCoreX не является юридической фирмой.',
        },
        'private': {
            'aside_eyebrow': 'Вторичное направление',
            'aside_title': 'Работа с частными клиентами остается доступной и не перегружает корпоративный маршрут.',
            'panel_eyebrow': 'Запрос частного клиента',
            'panel_intro': 'Форма остается чистой, выборочной и ясно объясняет релевантность, конфиденциальность и то, что произойдет дальше.',
            'full_name': 'Имя и фамилия',
            'email': 'Электронная почта',
            'phone': 'Телефон',
            'requested_service': 'Запрашиваемая услуга',
            'select': 'Выберите',
            'service_options': [('Contracts and documentation support', 'Договоры и помощь по документам'), ('Immigration packet organization', 'Организация иммиграционного пакета'), ('Business or launch support', 'Поддержка бизнеса или запуска')],
            'honeypot': 'Оставьте поле пустым',
            'message': 'Сообщение',
            'message_placeholder': 'Опишите ситуацию, сроки и поддержку, которая вам нужна.',
            'form_note': 'Это вторичный и выборочный маршрут. VitaCoreX сначала оценивает релевантность, не запрашивая лишние документы.',
        },
        'careers': {
            'panel_eyebrow': 'Выборочная заявка',
            'panel_intro': 'Форма фиксирует интерес к роли, локацию и резюме или образец документа, не превращая карьерное направление в основную точку конверсии.',
            'full_name': 'Имя и фамилия',
            'email': 'Электронная почта',
            'location': 'Локация',
            'role_interest': 'Интересующая роль',
            'linkedin': 'Ссылка на LinkedIn',
            'resume': 'Резюме или образец',
            'file_empty': 'Файл не выбран.',
            'message': 'Сообщение',
            'message_placeholder': 'Опишите соответствие роли, релевантный операционный опыт и почему VitaCoreX стоит рассмотреть вашу заявку.',
            'honeypot': 'Оставьте поле пустым',
            'aside_eyebrow': 'Вторичное направление',
            'aside_title': 'Карьера остается подчиненной пути покупателя.',
            'aside_body': 'Публичный сайт остается ориентированным на компании. Карьерное направление видно и оформлено профессионально, но не прерывает основной маршрут корпоративного разбора.',
        },
    },
    'es': {
        'resource': {
            'aside_eyebrow': 'Qué ocurre después',
            'aside_title': 'Qué ocurre después del envío',
            'aside_items': [
                'La solicitud se captura con contexto de empresa en lugar de perderse en un correo de bandeja de entrada.',
                'VitaCoreX usa la solicitud para enviar el resumen o el material de seguimiento más útil para la siguiente decisión interna.',
                'La ruta resultante sigue siendo acotada: evaluación, piloto o recomendación de no encaje.',
            ],
            'panel_eyebrow': 'Solicitar resumen ejecutivo',
            'panel_intro': 'Use un formulario corporativo breve para solicitar el resumen ejecutivo. El formulario captura contexto de empresa, idioma y el material solicitado sin convertir la página en un formulario cebo.',
            'full_name': 'Nombre completo',
            'work_email': 'Correo laboral',
            'company': 'Empresa',
            'title': 'Cargo',
            'honeypot': 'Déjelo en blanco',
            'message': 'Mensaje',
            'message_placeholder': 'Cuéntele a VitaCoreX qué contexto operativo o qué ruta de decisión debe respaldar el resumen.',
            'form_note': 'El formulario registra canal de origen, idioma, ruta y el material solicitado. No implica representación legal, asesoría jurídica ni contratación garantizada.',
        },
        'company': {
            'aside_eyebrow': 'Confianza visible alrededor del formulario',
            'aside_title': 'Por qué el formulario transmite confianza',
            'aside_body': 'Una ruta estructurada de revisión, almacenamiento controlado y solicitudes selectivas de documentos sustituyen el comportamiento de un prototipo basado solo en correo.',
            'aside_response': 'Las consultas corporativas calificadas reciben un objetivo inicial de respuesta dentro de un día hábil.',
            'panel_eyebrow': 'Solicitud de evaluación corporativa',
            'panel_intro': 'Use esta ruta para temas de recuperación de ingresos, control documental y disciplina de admisión. Las solicitudes privadas pertenecen a la página secundaria.',
            'full_name': 'Nombre completo',
            'work_email': 'Correo laboral',
            'company': 'Empresa',
            'title': 'Cargo',
            'phone': 'Teléfono',
            'industry': 'Industria',
            'select': 'Seleccione',
            'industry_options': [('Healthcare / Dental', 'Salud / odontología'), ('Subscription / Recurring payments', 'Suscripciones / pagos recurrentes'), ('Fleet / Fuel / Logistics', 'Flotas / combustible / logística'), ('Contract-heavy services', 'Servicios con alta carga contractual'), ('Other', 'Otra')],
            'honeypot': 'Déjelo en blanco',
            'summary': 'Agregar contexto',
            'annual_revenue_band': 'Tramo de ingresos anuales',
            'annual_revenue_options': [('Under $5M', 'Menos de $5M'), ('$5M to $25M', '$5M a $25M'), ('$25M to $100M', '$25M a $100M'), ('$100M+', 'Más de $100M')],
            'portfolio_size_band': 'Tamaño de cartera',
            'portfolio_size_options': [('Under $250K', 'Menos de $250K'), ('$250K to $1M', '$250K a $1M'), ('$1M to $5M', '$1M a $5M'), ('$5M+', 'Más de $5M')],
            'documentation_condition': 'Estado documental',
            'documentation_options': [('Structured', 'Estructurado'), ('Mixed by team or site', 'Mixto según equipo o sede'), ('Weak chronology / packet quality', 'Cronología débil / calidad del paquete')],
            'urgency': 'Urgencia',
            'urgency_options': [('Immediate', 'Inmediata'), ('30-day review', 'Revisión en 30 días'), ('Exploratory', 'Exploratoria')],
            'pain_type': 'Tipo de problema',
            'pain_type_placeholder': 'Fugas, compresión de comisiones, traspaso débil del paquete, cuello de botella en admisión',
            'attachment': 'Adjunto',
            'file_empty': 'Ningún archivo seleccionado.',
            'attachment_note': 'Archivo de muestra opcional. Adjunte solo lo que ayude a aclarar la siguiente decisión.',
            'message': 'Mensaje',
            'message_placeholder': 'Describa el problema operativo, el estado del expediente y el siguiente paso más seguro que necesita.',
            'form_note': 'Ventana de respuesta: un día hábil para consultas corporativas calificadas. Los documentos se gestionan mediante revisión controlada. VitaCoreX no es un bufete de abogados.',
        },
        'private': {
            'aside_eyebrow': 'Ruta secundaria',
            'aside_title': 'El trabajo con clientes privados sigue disponible sin saturar la vía corporativa.',
            'panel_eyebrow': 'Solicitud privada',
            'panel_intro': 'El formulario se mantiene limpio, selectivo y claro respecto al encaje, la confidencialidad y el siguiente paso.',
            'full_name': 'Nombre completo',
            'email': 'Correo electrónico',
            'phone': 'Teléfono',
            'requested_service': 'Servicio solicitado',
            'select': 'Seleccione',
            'service_options': [('Contracts and documentation support', 'Contratos y apoyo documental'), ('Immigration packet organization', 'Organización de paquete migratorio'), ('Business or launch support', 'Apoyo para negocio o lanzamiento')],
            'honeypot': 'Déjelo en blanco',
            'message': 'Mensaje',
            'message_placeholder': 'Describa el asunto, el plazo y el apoyo que necesita.',
            'form_note': 'Esta ruta es secundaria y selectiva. VitaCoreX revisa el encaje antes de pedir documentos innecesarios.',
        },
        'careers': {
            'panel_eyebrow': 'Postulación selectiva',
            'panel_intro': 'La solicitud recoge interés por el puesto, ubicación y currículum o documento de muestra sin convertir carreras en un foco principal de conversión.',
            'full_name': 'Nombre completo',
            'email': 'Correo electrónico',
            'location': 'Ubicación',
            'role_interest': 'Rol de interés',
            'linkedin': 'URL de LinkedIn',
            'resume': 'Currículum o muestra',
            'file_empty': 'Ningún archivo seleccionado.',
            'message': 'Mensaje',
            'message_placeholder': 'Describa el encaje con el rol, la experiencia operativa relevante y por qué VitaCoreX debería revisar su postulación.',
            'honeypot': 'Déjelo en blanco',
            'aside_eyebrow': 'Ruta secundaria',
            'aside_title': 'Carreras se mantiene subordinada al recorrido del comprador.',
            'aside_body': 'El sitio público se mantiene centrado en la empresa. Carreras es visible y profesional, pero no interrumpe la ruta principal de evaluación corporativa.',
        },
    },
}

def localized_page(lang, slug):
    page = dict(PAGES[slug])
    if lang != 'en':
        page.update(PAGE_TRANSLATIONS.get(lang, {}).get(slug, {}))
    return page

def global_copy(lang):
    copy = dict(DEFAULT_GLOBAL_COPY)
    copy.update(GLOBAL_COPY.get(lang, {}))
    return copy

def render_options(placeholder, options):
    html = [f'<option value="">{placeholder}</option>']
    html.extend(f'<option value="{value}">{label}</option>' for value, label in options)
    return ''.join(html)

def route_for(lang, slug):
    if lang == 'en':
        return '/' if slug == 'index' else f'/{slug}.html'
    return f'/{lang}/' if slug == 'index' else f'/{lang}/{slug}.html'

def canonical_for(lang, slug):
    return DOMAIN + route_for(lang, slug)

def localized_href(lang, href):
    if not href or not href.startswith('/'):
        return href
    if href.startswith('/assets/') or href.startswith('/app/') or href.startswith('/api/'):
        return href
    slug = href.strip('/').removesuffix('.html')
    if not slug:
        slug = 'index'
    if slug in PAGES:
        return route_for(lang, slug)
    return href

def file_for(lang, slug):
    folder = ROOT if lang == 'en' else ROOT / lang
    folder.mkdir(parents=True, exist_ok=True)
    return folder / ('index.html' if slug == 'index' else f'{slug}.html')

def head_bootstrap(lang, slug):
    return (
        '<style>'
        'body.vcx-menu-open{overflow:hidden;}'
        '</style>'
        '<script>'
        '(function(){'
        'var root=document.documentElement;'
        "var localeKey='docketmint.locale';"
        f'var current={json.dumps(lang)};'
        'window.__VCX_PUBLIC_BOOT__=window.__VCX_PUBLIC_BOOT__||{};'
        "root.setAttribute('data-vcx-shell','ready');"
        'try{'
        'window.localStorage.setItem(localeKey,current);'
        '}catch(error){}'
        '})();'
        '</script>'
    )

def compatibility_bootstrap():
    tracking = json.dumps(TRACKING_IDS, ensure_ascii=False, separators=(',', ':'))
    contact = json.dumps({
        'booking_url': BOOKING_URL,
        'phone_display': PRIVATE_LINE_DISPLAY,
        'phone_href': PRIVATE_LINE_HREF,
    }, ensure_ascii=False, separators=(',', ':'))
    return (
        '<script>'
        f'window.VCX_TRACKING_IDS=window.VCX_TRACKING_IDS||{tracking};'
        f'window.VCX_CONTACT=window.VCX_CONTACT||{contact};'
        '</script>'
    )

def header(lang, slug):
    ui = UI[lang]
    switch = ''.join(
        f'<a href="{route_for(code, slug)}" data-shell-locale="{code}" aria-current="{"true" if code == lang else "false"}">{code.upper()}</a>'
        for code in LANGS
    )
    nav_items = [
        ('shell.nav.home', ui['home'], 'index'),
        ('shell.nav.solutions', ui['solutions'], 'solutions'),
        ('shell.nav.industries', ui['industries'], 'industries'),
        ('shell.nav.proof', ui['proof'], 'resources'),
        ('shell.nav.review', ui['review'], 'contact'),
        ('shell.nav.about', ui['about'], 'about'),
        ('shell.nav.private', ui['private'], 'additional-services'),
    ]
    nav = ''.join(
        f'<a href="{route_for(lang, target)}" data-shell-key="{key}" {"aria-current=\"page\"" if slug == target else ""}>{label}</a>'
        for key, label, target in nav_items
    )
    mobile = (
        nav
        + f'<a href="/app/sign-in/" data-shell-key="shell.nav.signin">{ui["signin"]}</a>'
        + f'<div class="lang-switch lang-switch--mobile" aria-label="{ui["lang_label"]}" data-shell-switcher data-shell-aria-key="shell.language_label">{switch}</div>'
    )
    return (
        f'<header class="site-header" data-public-shell="marketing">'
        f'<div class="site-shell header-row">'
        f'<a class="brand" href="{route_for(lang, "index")}" aria-label="VitaCoreX">'
        f'<span class="brand-mark"><img src="/assets/img/logo.png" alt=""></span>'
        f'<span class="brand-copy"><strong>VitaCoreX</strong><small data-shell-key="shell.subtitle">{ui["subtitle"]}</small></span>'
        f'</a>'
        f'<nav class="site-nav" aria-label="{ui["primary_label"]}" data-shell-aria-key="shell.primary_label">{nav}</nav>'
        f'<div class="header-actions">'
        f'<div class="lang-switch" aria-label="{ui["lang_label"]}" data-shell-switcher data-shell-aria-key="shell.language_label">{switch}</div>'
        f'<a class="btn btn-secondary" href="/app/sign-in/" data-shell-key="shell.nav.signin">{ui["signin"]}</a>'
        f'<button class="menu-toggle" type="button" data-menu-toggle data-public-menu-toggle aria-expanded="false" aria-controls="mobileMenu" aria-label="{ui["menu"]}" data-shell-key="shell.menu" data-shell-aria-key="shell.menu">{ui["menu"]}</button>'
        f'</div>'
        f'</div>'
        f'<div class="site-shell mobile-menu" id="mobileMenu" data-mobile-menu data-public-menu-panel hidden>'
        f'<nav aria-label="{ui["mobile_label"]}" data-shell-aria-key="shell.mobile_label">{mobile}</nav>'
        f'</div>'
        f'</header>'
    )

def footer(lang):
    ui = UI[lang]
    service_links = ''.join([
        f'<a href="{route_for(lang, "revenue-recovery-workflow")}">{localized_page(lang, "revenue-recovery-workflow")["kicker"]}</a>',
        f'<a href="{route_for(lang, "corporate-legal-file-control")}">{localized_page(lang, "corporate-legal-file-control")["kicker"]}</a>',
        f'<a href="{route_for(lang, "structured-case-intake")}">{localized_page(lang, "structured-case-intake")["kicker"]}</a>',
    ])
    firm_links = ''.join([
        f'<a href="{route_for(lang, "solutions")}" data-shell-key="shell.nav.solutions">{ui["solutions"]}</a>',
        f'<a href="{route_for(lang, "industries")}" data-shell-key="shell.nav.industries">{ui["industries"]}</a>',
        f'<a href="{route_for(lang, "resources")}" data-shell-key="shell.nav.proof">{ui["proof"]}</a>',
        f'<a href="{route_for(lang, "contact")}" data-shell-key="shell.cta.review">{ui["review_cta"]}</a>',
        f'<a href="{route_for(lang, "about")}" data-shell-key="shell.nav.about">{ui["about"]}</a>',
    ])
    secondary_links = ''.join([
        f'<a href="{route_for(lang, "additional-services")}" data-shell-key="shell.nav.private">{ui["private"]}</a>',
        f'<a href="{route_for(lang, "careers")}" data-shell-key="shell.nav.careers">{ui["careers"]}</a>',
        f'<a href="{route_for(lang, "privacy-policy")}" data-shell-key="shell.policy.privacy">{ui["privacy"]}</a>',
        f'<a href="{route_for(lang, "terms-of-use")}" data-shell-key="shell.policy.terms">{ui["terms"]}</a>',
        f'<a href="{route_for(lang, "cookie-policy")}" data-shell-key="shell.policy.cookies">{ui["cookies"]}</a>',
    ])
    return (
        '<footer class="footer">'
        '<div class="site-shell footer-grid">'
        f'<section class="footer-card footer-copy"><strong data-shell-key="shell.footer.brand">{ui["footer_brand"]}</strong><p data-shell-key="shell.footer.copy">{ui["footer_copy"]}</p><p data-shell-key="shell.city">{ui["city"]}</p><p class="footer-contact-label" data-shell-key="shell.contact.line">{ui["contact_line"]}</p><div class="footer-quick-actions"><a class="footer-quick-link" data-shell-key="shell.cta.call" href="{PRIVATE_LINE_HREF}">{ui["call_cta"]}</a><a class="footer-quick-link" data-shell-key="shell.cta.book" href="{BOOKING_URL}" rel="noopener" target="_blank">{ui["book_cta"]}</a></div></section>'
        f'<section class="footer-card"><h2 class="footer-title" data-shell-key="shell.footer.services">{ui["footer_services"]}</h2><div class="footer-links">{service_links}</div></section>'
        f'<section class="footer-card"><h2 class="footer-title" data-shell-key="shell.footer.firm">{ui["footer_firm"]}</h2><div class="footer-links">{firm_links}</div></section>'
        f'<section class="footer-card"><h2 class="footer-title" data-shell-key="shell.footer.secondary">{ui["footer_secondary"]}</h2><div class="footer-links">{secondary_links}</div></section>'
        f'<section class="footer-card footer-copy"><h2 class="footer-title" data-shell-key="shell.footer.boundary">{ui["footer_boundary"]}</h2><p data-shell-key="shell.boundary">{ui["boundary"]}</p></section>'
        '</div>'
        '</footer>'
    )

def render_cards(lang, items, mode):
    if mode == 'trust':
        return '<div class="trust-strip">' + ''.join(f'<article class="trust-chip"><span class="stat-label">{title}</span><strong>{body}</strong></article>' for title, body in items) + '</div>'
    if mode == 'steps':
        return '<div class="step-grid">' + ''.join(f'<article class="step-card"><span class="step-number">{i:02d}</span><h3>{title}</h3><p>{body}</p></article>' for i, (title, body) in enumerate(items, 1)) + '</div>'
    if mode == 'compare':
        classes = ['comparison-card comparison-card--positive', 'comparison-card comparison-card--negative']
        return '<div class="comparison-grid">' + ''.join(f'<article class="{classes[min(i,1)]}"><h3>{title}</h3><p>{body}</p></article>' for i, (title, body) in enumerate(items)) + '</div>'
    if mode == 'linked_cards':
        return '<div class="card-grid card-grid--3">' + ''.join(
            f'<article class="card card--linked"><h3>{title}</h3><p>{body}</p><a class="card-link" href="{localized_href(lang, href)}">{cta}</a></article>'
            for title, body, href, cta in items
        ) + '</div>'
    if mode == 'cards4':
        return '<div class="card-grid card-grid--4">' + ''.join(f'<article class="card"><h3>{title}</h3><p>{body}</p></article>' for title, body in items) + '</div>'
    if mode == 'faq':
        return '<div class="faq-list">' + ''.join(f'<details class="faq-item"><summary>{question}</summary><p>{answer}</p></details>' for question, answer in items) + '</div>'
    if mode == 'policy':
        return ''.join(f'<article class="policy-article"><h2>{title}</h2><p>{body}</p></article>' for title, body in items)
    return '<div class="card-grid card-grid--3">' + ''.join(f'<article class="card"><h3>{title}</h3><p>{body}</p></article>' for title, body in items) + '</div>'

def page_label(page):
    return page['title'].split(' | ')[0]

def page_faq_items(page):
    for title, items, mode in page.get('sections', []):
        if mode == 'faq':
            return items
    return []

def breadcrumb_graph(lang, slug, page):
    if slug in {'index', 'thank-you'}:
        return None
    return {
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': UI[lang]['home'], 'item': canonical_for(lang, 'index')},
            {'@type': 'ListItem', 'position': 2, 'name': page_label(page), 'item': canonical_for(lang, slug)},
        ],
    }

def schema_graph(lang, slug, page, chrome):
    canonical = canonical_for(lang, slug)
    webpage_type = WEBPAGE_TYPES.get(slug, 'WebPage')
    graph = [
        {
            '@type': 'Organization',
            '@id': f'{DOMAIN}#organization',
            'name': 'VitaCoreX LLC',
            'url': DOMAIN,
            'areaServed': 'US',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'Tampa',
                'addressRegion': 'FL',
                'addressCountry': 'US',
            },
            'description': chrome['schema_org_description'],
        },
        {
            '@type': webpage_type,
            '@id': f'{canonical}#webpage',
            'url': canonical,
            'name': page_label(page),
            'description': page['description'],
            'inLanguage': lang,
            'isPartOf': {'@id': f'{DOMAIN}#website'},
            'about': {'@id': f'{DOMAIN}#organization'},
        },
    ]
    if slug == 'index':
        graph.append({
            '@type': 'WebSite',
            '@id': f'{DOMAIN}#website',
            'name': 'VitaCoreX',
            'url': DOMAIN,
            'inLanguage': lang,
        })
    breadcrumb = breadcrumb_graph(lang, slug, page)
    if breadcrumb:
        graph.append(breadcrumb)
    if slug in SERVICE_SCHEMA:
        service = SERVICE_SCHEMA[slug]
        graph.append({
            '@type': 'Service',
            '@id': f'{canonical}#service',
            'name': service['name'],
            'serviceType': service['serviceType'],
            'description': page['description'],
            'provider': {'@id': f'{DOMAIN}#organization'},
            'url': canonical,
            'areaServed': 'US',
            'audience': {
                '@type': 'BusinessAudience',
                'audienceType': service['audience'],
            },
        })
    faq_items = page_faq_items(page)
    if faq_items and slug != 'thank-you':
        graph.append({
            '@type': 'FAQPage',
            'mainEntity': [
                {
                    '@type': 'Question',
                    'name': question,
                    'acceptedAnswer': {'@type': 'Answer', 'text': answer},
                }
                for question, answer in faq_items
            ],
        })
    return {'@context': 'https://schema.org', '@graph': graph}

def resource_form(lang):
    ui = UI[lang]
    form = FORM_COPY[lang]['resource']
    bullets = ''.join(f'<li>{item}</li>' for item in form['aside_items'])
    return f'''
<section class="section">
  <div class="site-shell form-layout">
    <aside class="form-panel">
      <p class="eyebrow">{form['aside_eyebrow']}</p>
      <h2>{form['aside_title']}</h2>
      <ul class="key-list">{bullets}</ul>
    </aside>
    <div class="form-panel">
      <p class="eyebrow">{form['panel_eyebrow']}</p>
      <p>{form['panel_intro']}</p>
      <form data-intake-form novalidate>
        <input type="hidden" name="purpose" value="executive_brief">
        <input type="hidden" name="lang" value="{lang}">
        <input type="hidden" name="route_key" value="executive-brief">
        <input type="hidden" name="service_line" value="proof and executive brief">
        <input type="hidden" name="asset_requested" value="executive-brief">
        <input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=executive_brief">
        <input type="hidden" name="page_path">
        <input type="hidden" name="page_url">
        <input type="hidden" name="page_title">
        <input type="hidden" name="landing_page">
        <input type="hidden" name="referrer">
        <input type="hidden" name="utm_source">
        <input type="hidden" name="utm_medium">
        <input type="hidden" name="utm_campaign">
        <input type="hidden" name="utm_term">
        <input type="hidden" name="utm_content">
        <input type="hidden" name="gclid">
        <input type="hidden" name="fbclid">
        <input type="hidden" name="msclkid">
        <input type="hidden" name="li_fat_id">
        <input type="hidden" name="submitted_after_ms">
        <div class="form-stack">
          <div class="field-row">
            <div class="field">
              <label>{form['full_name']}</label>
              <input name="full_name" required autocomplete="name">
            </div>
            <div class="field">
              <label>{form['work_email']}</label>
              <input name="work_email" type="email" required autocomplete="email" inputmode="email">
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>{form['company']}</label>
              <input name="company_name" required autocomplete="organization">
            </div>
            <div class="field">
              <label>{form['title']}</label>
              <input name="title" autocomplete="organization-title">
            </div>
          </div>
          <div class="field is-hidden">
            <label>{form['honeypot']}</label>
            <input name="company_website" autocomplete="off" tabindex="-1">
          </div>
          <div class="field">
            <label>{form['message']}</label>
            <textarea name="message" placeholder="{form['message_placeholder']}"></textarea>
          </div>
          <p class="form-note">{form['form_note']}</p>
          <div class="status" data-form-status></div>
          <button class="btn btn-primary" type="submit" data-shell-key="shell.cta.proof">{ui['proof_cta']}</button>
        </div>
      </form>
    </div>
  </div>
</section>'''

def company_form(lang):
    ui = UI[lang]
    form = FORM_COPY[lang]['company']
    industry_options = render_options(form['select'], form['industry_options'])
    annual_options = render_options(form['select'], form['annual_revenue_options'])
    portfolio_options = render_options(form['select'], form['portfolio_size_options'])
    documentation_options = render_options(form['select'], form['documentation_options'])
    urgency_options = render_options(form['select'], form['urgency_options'])
    return f'''
<section class="section section--soft">
  <div class="site-shell form-layout">
    <aside class="form-panel">
      <p class="eyebrow">{form['aside_eyebrow']}</p>
      <h2>{form['aside_title']}</h2>
      <p>{form['aside_body']}</p>
      <ul class="key-list">
        <li data-shell-key="shell.city">{ui['city']}</li>
        <li data-shell-key="shell.boundary">{ui['boundary']}</li>
        <li>{form['aside_response']}</li>
      </ul>
      <div class="contact-quick-card">
        <strong data-shell-key="shell.contact.line">{ui['contact_line']}</strong>
        <div class="card-actions">
          <a class="btn btn-secondary" data-shell-key="shell.cta.call" href="{PRIVATE_LINE_HREF}">{ui['call_cta']}</a>
          <a class="btn btn-secondary" data-shell-key="shell.cta.book" href="{BOOKING_URL}" rel="noopener" target="_blank">{ui['book_cta']}</a>
        </div>
      </div>
    </aside>
    <div class="form-panel">
      <p class="eyebrow">{form['panel_eyebrow']}</p>
      <p>{form['panel_intro']}</p>
      <form data-intake-form novalidate>
        <input type="hidden" name="purpose" value="company_review">
        <input type="hidden" name="lang" value="{lang}">
        <input type="hidden" name="route_key" value="company-review">
        <input type="hidden" name="service_line" value="company confidential review">
        <input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=company_review">
        <input type="hidden" name="page_path">
        <input type="hidden" name="page_url">
        <input type="hidden" name="page_title">
        <input type="hidden" name="landing_page">
        <input type="hidden" name="referrer">
        <input type="hidden" name="utm_source">
        <input type="hidden" name="utm_medium">
        <input type="hidden" name="utm_campaign">
        <input type="hidden" name="utm_term">
        <input type="hidden" name="utm_content">
        <input type="hidden" name="gclid">
        <input type="hidden" name="fbclid">
        <input type="hidden" name="msclkid">
        <input type="hidden" name="li_fat_id">
        <input type="hidden" name="submitted_after_ms">
        <div class="form-stack">
          <div class="field-row">
            <div class="field">
              <label>{form['full_name']}</label>
              <input name="full_name" autocomplete="name" required>
            </div>
            <div class="field">
              <label>{form['work_email']}</label>
              <input name="work_email" type="email" autocomplete="email" inputmode="email" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>{form['company']}</label>
              <input name="company_name" autocomplete="organization" required>
            </div>
            <div class="field">
              <label>{form['title']}</label>
              <input name="title" autocomplete="organization-title">
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>{form['phone']}</label>
              <input name="phone" type="tel" autocomplete="tel" inputmode="tel">
            </div>
            <div class="field">
              <label>{form['industry']}</label>
              <select name="industry" required>{industry_options}</select>
            </div>
          </div>
          <div class="field is-hidden">
            <label>{form['honeypot']}</label>
            <input name="company_website" autocomplete="off" tabindex="-1">
          </div>
          <details class="disclosure">
            <summary>{form['summary']}</summary>
            <div class="disclosure-grid form-stack">
              <div class="field-row">
                <div class="field">
                  <label>{form['annual_revenue_band']}</label>
                  <select name="annual_revenue_band">{annual_options}</select>
                </div>
                <div class="field">
                  <label>{form['portfolio_size_band']}</label>
                  <select name="portfolio_size_band">{portfolio_options}</select>
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>{form['documentation_condition']}</label>
                  <select name="documentation_condition">{documentation_options}</select>
                </div>
                <div class="field">
                  <label>{form['urgency']}</label>
                  <select name="urgency">{urgency_options}</select>
                </div>
              </div>
              <div class="field">
                <label>{form['pain_type']}</label>
                <input name="pain_type" placeholder="{form['pain_type_placeholder']}">
              </div>
              <div class="field">
                <label>{form['attachment']}</label>
                <input name="attachment" type="file" data-file-list="#companyFileList" accept=".pdf,.doc,.docx,.xlsx,.csv,.txt">
                <div class="file-pill" id="companyFileList" data-empty-label="{form['file_empty']}">{form['file_empty']}</div>
                <p class="field-note">{form['attachment_note']}</p>
              </div>
            </div>
          </details>
          <div class="field">
            <label>{form['message']}</label>
            <textarea name="message" required placeholder="{form['message_placeholder']}"></textarea>
          </div>
          <p class="form-note">{form['form_note']}</p>
          <div class="status" data-form-status></div>
          <button class="btn btn-primary" type="submit" data-shell-key="shell.cta.review">{ui['review_cta']}</button>
        </div>
      </form>
    </div>
  </div>
</section>'''

def private_form(lang):
    ui = UI[lang]
    form = FORM_COPY[lang]['private']
    service_options = render_options(form['select'], form['service_options'])
    return f'''
<section class="section">
  <div class="site-shell form-layout">
    <aside class="form-panel">
      <p class="eyebrow">{form['aside_eyebrow']}</p>
      <h2>{form['aside_title']}</h2>
      <p data-shell-key="shell.boundary">{ui['boundary']}</p>
    </aside>
    <div class="form-panel">
      <p class="eyebrow">{form['panel_eyebrow']}</p>
      <p>{form['panel_intro']}</p>
      <form data-intake-form novalidate>
        <input type="hidden" name="purpose" value="individual_request">
        <input type="hidden" name="lang" value="{lang}">
        <input type="hidden" name="route_key" value="private-client">
        <input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=individual_request">
        <input type="hidden" name="page_path">
        <input type="hidden" name="page_url">
        <input type="hidden" name="page_title">
        <input type="hidden" name="landing_page">
        <input type="hidden" name="referrer">
        <input type="hidden" name="utm_source">
        <input type="hidden" name="utm_medium">
        <input type="hidden" name="utm_campaign">
        <input type="hidden" name="utm_term">
        <input type="hidden" name="utm_content">
        <input type="hidden" name="gclid">
        <input type="hidden" name="fbclid">
        <input type="hidden" name="msclkid">
        <input type="hidden" name="li_fat_id">
        <input type="hidden" name="submitted_after_ms">
        <div class="form-stack">
          <div class="field-row">
            <div class="field">
              <label>{form['full_name']}</label>
              <input name="full_name" autocomplete="name" required>
            </div>
            <div class="field">
              <label>{form['email']}</label>
              <input name="email" type="email" autocomplete="email" inputmode="email" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>{form['phone']}</label>
              <input name="phone" type="tel" autocomplete="tel" inputmode="tel">
            </div>
            <div class="field">
              <label>{form['requested_service']}</label>
              <select name="service_line" required>{service_options}</select>
            </div>
          </div>
          <div class="field is-hidden">
            <label>{form['honeypot']}</label>
            <input name="company_website" autocomplete="off" tabindex="-1">
          </div>
          <div class="field">
            <label>{form['message']}</label>
            <textarea name="message" required placeholder="{form['message_placeholder']}"></textarea>
          </div>
          <p class="form-note">{form['form_note']}</p>
          <div class="status" data-form-status></div>
          <button class="btn btn-primary" type="submit" data-shell-key="shell.cta.service">{ui['service_btn']}</button>
        </div>
      </form>
    </div>
  </div>
</section>'''

def careers_form(lang):
    ui = UI[lang]
    form = FORM_COPY[lang]['careers']
    return f'''
<section class="section">
  <div class="site-shell form-layout">
    <div class="form-panel">
      <p class="eyebrow">{form['panel_eyebrow']}</p>
      <p>{form['panel_intro']}</p>
      <form data-intake-form novalidate>
        <input type="hidden" name="purpose" value="careers_application">
        <input type="hidden" name="lang" value="{lang}">
        <input type="hidden" name="route_key" value="careers">
        <input type="hidden" name="service_line" value="careers">
        <input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=careers_application">
        <input type="hidden" name="page_path">
        <input type="hidden" name="page_url">
        <input type="hidden" name="page_title">
        <input type="hidden" name="landing_page">
        <input type="hidden" name="referrer">
        <input type="hidden" name="utm_source">
        <input type="hidden" name="utm_medium">
        <input type="hidden" name="utm_campaign">
        <input type="hidden" name="utm_term">
        <input type="hidden" name="utm_content">
        <input type="hidden" name="gclid">
        <input type="hidden" name="fbclid">
        <input type="hidden" name="msclkid">
        <input type="hidden" name="li_fat_id">
        <input type="hidden" name="submitted_after_ms">
        <div class="form-stack">
          <div class="field-row">
            <div class="field">
              <label>{form['full_name']}</label>
              <input name="full_name" autocomplete="name" required>
            </div>
            <div class="field">
              <label>{form['email']}</label>
              <input name="email" type="email" autocomplete="email" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>{form['location']}</label>
              <input name="location">
            </div>
            <div class="field">
              <label>{form['role_interest']}</label>
              <input name="role_interest" required>
            </div>
          </div>
          <div class="field">
            <label>{form['linkedin']}</label>
            <input name="linkedin_url" inputmode="url">
          </div>
          <div class="field">
            <label>{form['resume']}</label>
            <input name="resume" type="file" data-file-list="#careerFileList" accept=".pdf,.doc,.docx,.txt">
            <div class="file-pill" id="careerFileList" data-empty-label="{form['file_empty']}">{form['file_empty']}</div>
          </div>
          <div class="field">
            <label>{form['message']}</label>
            <textarea name="message" placeholder="{form['message_placeholder']}"></textarea>
          </div>
          <div class="field is-hidden">
            <label>{form['honeypot']}</label>
            <input name="company_website" autocomplete="off" tabindex="-1">
          </div>
          <div class="status" data-form-status></div>
          <button class="btn btn-primary" type="submit" data-shell-key="shell.cta.careers">{ui['career_btn']}</button>
        </div>
      </form>
    </div>
    <aside class="form-panel">
      <p class="eyebrow">{form['aside_eyebrow']}</p>
      <h2>{form['aside_title']}</h2>
      <p>{form['aside_body']}</p>
    </aside>
  </div>
</section>'''

def page_body(lang, slug):
    ui = UI[lang]
    page = localized_page(lang, slug)
    chrome = global_copy(lang)
    if slug == 'thank-you':
        return f'<section class="thankyou-hero"><div class="thankyou-card"><p class="eyebrow">{page["kicker"]}</p><h1 data-thankyou-title>{page["h1"]}</h1><p data-thankyou-body>{page["intro"]}</p><p data-thankyou-lead-row hidden><strong>{chrome["lead_id_label"]}</strong> <span data-thankyou-lead></span></p><div class="hero-actions"><a class="btn btn-primary" href="{route_for(lang, "contact")}" data-shell-key="shell.cta.review">{ui["review_cta"]}</a><a class="btn btn-secondary" href="{route_for(lang, "resources")}" data-shell-key="shell.cta.proof">{ui["proof_cta"]}</a></div></div></section>'
    breadcrumbs = '' if slug == 'index' else f'<nav class="breadcrumbs" aria-label="{ui["breadcrumbs_label"]}" data-shell-aria-key="shell.breadcrumbs_label"><a href="{route_for(lang, "index")}" data-shell-key="shell.nav.home">{ui["home"]}</a><span>/</span><span>{page["kicker"]}</span></nav>'
    hero_rows = ''
    if page.get('hero_rows'):
        hero_rows = f'<aside class="hero-card"><h2>{chrome["hero_credibility_title"]}</h2><div class="meta-card">' + ''.join(f'<div class="meta-row"><span>{label}</span><strong>{value}</strong></div>' for label, value in page['hero_rows']) + '</div></aside>'
    actions = f'<div class="hero-actions"><a class="btn btn-primary" href="{route_for(lang, "contact")}" data-shell-key="shell.cta.review">{ui["review_cta"]}</a><a class="btn btn-secondary" href="{route_for(lang, "resources")}" data-shell-key="shell.cta.proof">{ui["proof_cta"]}</a></div>'
    if slug == 'index':
        actions += f'<p class="inline-note" data-shell-key="shell.boundary">{ui["boundary"]}</p>'
    body = [f'<section class="hero"><div class="site-shell hero-grid"><div class="hero-copy">{breadcrumbs}<p class="eyebrow">{page["kicker"]}</p><h1>{page["h1"]}</h1><p>{page["intro"]}</p>{actions}</div>{hero_rows}</div></section>']
    for title, items, mode in page.get('sections', []):
        cls = 'section section--soft' if mode in {'policy', 'compare'} else 'section'
        body.append(f'<section class="{cls}"><div class="site-shell"><div class="section-head"><h2>{title}</h2></div>{render_cards(lang, items, mode)}</div></section>')
    if slug == 'resources':
        body.append(resource_form(lang))
    if slug == 'contact':
        body.append(company_form(lang))
    if slug == 'additional-services':
        body.append(private_form(lang))
    if slug == 'careers':
        body.append(careers_form(lang))
    body.append(f'<section class="section section--soft"><div class="site-shell"><div class="cta-band"><div><h2>{page["cta_title"]}</h2><p>{page["cta_copy"]}</p></div><div class="cta-actions"><a class="btn btn-primary" href="{route_for(lang, "contact")}" data-shell-key="shell.cta.review">{ui["review_cta"]}</a><a class="btn btn-secondary" href="{route_for(lang, "resources")}" data-shell-key="shell.cta.proof">{ui["proof_cta"]}</a></div></div></div></section>')
    return ''.join(body)

def head(lang, slug):
    page = localized_page(lang, slug)
    chrome = global_copy(lang)
    alts = '' if slug == 'thank-you' else ''.join([f'<link rel="alternate" hreflang="{("en-US" if code == "en" else code)}" href="{canonical_for(code, slug)}">' for code in LANGS]) + f'<link rel="alternate" hreflang="x-default" href="{canonical_for("en", slug)}">'
    schema = schema_graph(lang, slug, page, chrome)
    robots = 'noindex, nofollow' if slug == 'thank-you' else 'index, follow'
    return f'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{page["title"]}</title><meta name="description" content="{page["description"]}"><meta name="robots" content="{robots}"><meta name="theme-color" content="#07131f"><meta property="og:type" content="website"><meta property="og:locale" content="{OG_LOCALE.get(lang, lang)}"><meta property="og:title" content="{page["title"]}"><meta property="og:description" content="{page["description"]}"><meta property="og:url" content="{canonical_for(lang, slug)}"><meta property="og:image" content="/assets/img/og-vitacorex-2026.svg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{page["title"]}"><meta name="twitter:description" content="{page["description"]}"><meta name="twitter:image" content="/assets/img/og-vitacorex-2026.svg"><link rel="canonical" href="{canonical_for(lang, slug)}">{alts}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"><link rel="icon" href="/assets/img/logo.png"><link rel="apple-touch-icon" href="/assets/img/logo.png"><link rel="manifest" href="/manifest.webmanifest">{compatibility_bootstrap()}{head_bootstrap(lang, slug)}<link href="/assets/css/vitacorex-public.css" rel="stylesheet"><script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script></head>'

def render_page(lang, slug):
    ui = UI[lang]
    page = localized_page(lang, slug)
    return f'<!DOCTYPE html><html lang="{lang}" data-vcx-shell="ready">{head(lang, slug)}<body data-api-base="/api" data-surface="{page.get("surface", "dark")}" data-public-shell="marketing" data-shell-lang="{lang}" data-shell-slug="{slug}"><a class="skip-link" href="#main" data-shell-key="shell.skip">{ui["skip"]}</a>{header(lang, slug)}<main id="main">{page_body(lang, slug)}</main>{footer(lang)}<div class="consent-banner" data-consent-banner hidden><div class="consent-copy"><strong data-consent-title></strong><p data-consent-body></p></div><div class="consent-actions"><button class="btn btn-secondary" type="button" data-consent-essential></button><button class="btn btn-primary" type="button" data-consent-analytics></button></div></div><script src="/assets/js/vitacorex-public.js"></script></body></html>'

def write_svg():
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#07131f"/><stop offset="100%" stop-color="#11283d"/></linearGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><rect x="78" y="80" width="1044" height="470" rx="34" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.12)"/><text x="108" y="168" fill="#d2ba87" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="6">VITACOREX</text><text x="108" y="260" fill="#f8fbfd" font-family="Space Grotesk, Arial, sans-serif" font-size="64" font-weight="700">Revenue recovery design</text><text x="108" y="330" fill="#f8fbfd" font-family="Space Grotesk, Arial, sans-serif" font-size="64" font-weight="700">and documentation control</text><text x="108" y="410" fill="#aec0cf" font-family="Inter, Arial, sans-serif" font-size="28">For finance-led operators that cannot afford a weak handoff.</text><text x="108" y="490" fill="#aec0cf" font-family="Inter, Arial, sans-serif" font-size="24">Tampa, Florida, U.S.  •  Not a law firm</text></svg>'
    (ROOT / 'assets' / 'img' / 'og-vitacorex-2026.svg').write_text(svg, encoding='utf-8')

def write_manifest():
    payload = {'name':'VitaCoreX Public Review','short_name':'VitaCoreX','start_url':'/','display':'standalone','background_color':'#07131f','theme_color':'#07131f','icons':[{'src':'/assets/img/logo.png','sizes':'512x512','type':'image/png'}],'shortcuts':[{'name':'Request confidential review','url':'/contact.html'},{'name':'Review executive brief','url':'/resources.html'},{'name':'Sign in','url':'/app/sign-in/'}]}
    (ROOT / 'manifest.webmanifest').write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')

def write_pdf(path, title, subtitle, bullets):
    if canvas is None or letter is None:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter
    c.setFillColorRGB(0.04, 0.09, 0.14)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColorRGB(0.82, 0.73, 0.52)
    c.setFont('Helvetica-Bold', 16)
    c.drawString(50, height - 60, 'VITACOREX')
    c.setFillColorRGB(0.95, 0.97, 0.98)
    c.setFont('Helvetica-Bold', 24)
    c.drawString(50, height - 110, title)
    c.setFillColorRGB(0.72, 0.8, 0.86)
    c.setFont('Helvetica', 12)
    y = height - 140
    for line in subtitle.split('\n'):
        c.drawString(50, y, line)
        y -= 16
    y -= 10
    c.setFillColorRGB(0.95, 0.97, 0.98)
    for bullet in bullets:
        c.drawString(60, y, '• ' + bullet)
        y -= 20
    c.save()

def write_briefs():
    briefs = ROOT / 'assets' / 'briefs'
    write_pdf(briefs / 'vitacorex-executive-brief.pdf','Executive brief','A concise operator-facing read on leakage, documentation condition,\nand the safest next move before outside cost expands.',['Current condition and the blocker pattern that is weakening the lane first.','What the first engagement would produce and what VitaCoreX does not claim.','What evidence would justify diagnose, pilot, scale, or a no-fit decision.','How to explain the recommendation internally without overstating certainty.'])
    write_pdf(briefs / 'vitacorex-pilot-structure.pdf','Pilot structure','A bounded pilot is used to validate fit, evidence, and decision quality\nbefore larger deployment.',['One operator lane with one evidence window and one decision point.','Documented responsibilities on both the operator and VitaCoreX side.','Stop-or-expand criteria before the work broadens into a larger rollout.','Measured outputs that can be forwarded internally without inflated claims.'])
    write_pdf(briefs / 'vitacorex-file-control-sample.pdf','File-control sample','An anonymized sample of chronology, gap visibility, and counsel-facing packet logic.',['Required document logic with blocker visibility.','Chronology structure before counsel or collections escalation.','Gap-log discipline that keeps missing items visible instead of hidden.','Packet-control standards that reduce avoidable downstream cleanup.'])

def write_sitemap():
    live_slugs = [slug for slug in PAGES if slug != 'thank-you']
    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    ]
    for slug in live_slugs:
        canonical_urls = {lang: canonical_for(lang, slug) for lang in LANGS}
        for lang in LANGS:
            xml.extend(['  <url>', f'    <loc>{canonical_urls[lang]}</loc>'])
            for alt_lang in LANGS:
                hreflang = 'en-US' if alt_lang == 'en' else alt_lang
                xml.append(
                    f'    <xhtml:link rel="alternate" hreflang="{hreflang}" href="{canonical_urls[alt_lang]}"/>'
                )
            xml.append(
                f'    <xhtml:link rel="alternate" hreflang="x-default" href="{canonical_urls["en"]}"/>'
            )
            xml.append('  </url>')
    xml.append('</urlset>')
    (ROOT / 'sitemap.xml').write_text('\n'.join(xml), encoding='utf-8')

def write_robots():
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /app/\nDisallow: /.layer67_guard_runtime/\nDisallow: /vitacorex_fix/\n\nSitemap: https://vitacorexllc.com/sitemap.xml\n', encoding='utf-8')

def render_landing_alias():
    return render_page('en', 'index').replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex, nofollow">', 1)

def main():
    for lang in LANGS:
        for slug in PAGES:
            file_for(lang, slug).write_text(render_page(lang, slug), encoding='utf-8')
    (ROOT / 'vitacorex-landing.html').write_text(render_landing_alias(), encoding='utf-8')
    write_svg(); write_manifest(); write_briefs(); write_sitemap(); write_robots()

if __name__ == '__main__':
    main()

