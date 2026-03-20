from __future__ import annotations

import json
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = 'https://vitacorexllc.com'
LANGS = ('en', 'ru', 'es')
PAGES = {
    'index': {
        'surface': 'dark',
        'title': 'VitaCoreX | Revenue recovery design and documentation control for complex operators',
        'description': 'VitaCoreX helps finance-led operators prevent cash leakage, documentation breakdown, and weak counsel handoff before outside cost expands.',
        'kicker': 'For finance-led operators and counsel-facing teams',
        'h1': 'Revenue recovery design and documentation control for operators that cannot afford a weak handoff.',
        'intro': 'VitaCoreX helps companies tighten recovery sequencing, improve file discipline, and create a safer next step before outside legal or agency cost expands.',
        'hero_rows': [
            ('What VitaCoreX does', 'Revenue recovery design, legal file control, and structured intake discipline for complex operators.'),
            ('What VitaCoreX does not do', 'It does not sell generic services, promise legal outcomes, or act as a law firm.'),
            ('What a first engagement produces', 'A confidential review, a short executive read, and a clear recommendation for diagnose, pilot, or scale.'),
        ],
        'sections': [
            ('Trust signals', [
                ('Operator signal', 'Tampa, Florida based advisory built for U.S. operators, finance teams, and counsel-facing leadership.'),
                ('Documentation-first', 'The story is framed around file quality, packet logic, and operating control instead of vague consulting language.'),
                ('Response discipline', 'Qualified company inquiries receive an initial response target within one business day.'),
                ('Boundary', 'VitaCoreX is not a law firm and does not promise legal outcomes.'),
            ], 'trust'),
            ('What serious buyers can forward internally after one pass', [
                ('What breaks first', 'Recovery performance weakens when escalation timing drifts, files arrive incomplete, and handoff quality varies by operator, site, or team.'),
                ('What VitaCoreX fixes', 'VitaCoreX clarifies recovery logic, file-control standards, packet readiness, and the working rules needed before outside cost expands.'),
                ('What leadership receives', 'An executive brief, sample packet logic, and a controlled recommendation for diagnose, pilot, or scale.'),
            ], 'cards'),
            ('Concrete proof surfaces instead of zero-state theatre', [
                ('Pilot structure', 'A bounded pilot plan with scope, evidence window, and operator-side responsibilities before larger rollout.'),
                ('File-control deliverable', 'A chronology standard, packet checklist, and gap log that reduce downstream cleanup.'),
                ('Executive brief', 'A short board-safe summary of leakage, handoff risk, and the recommended next step.'),
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
        ],
        'cta_title': 'Request a confidential review when the operating problem is real enough to justify a serious next step.',
        'cta_copy': 'The safest CTA is the clearest one: a confidential review that checks the operating model, file condition, and whether the right next step is review, pilot, or packet-control work.',
    },
    'solutions': {
        'surface': 'dark',
        'title': 'Solutions | VitaCoreX',
        'description': 'Three controlled solution lines for revenue recovery infrastructure, legal file control, and structured intake.',
        'kicker': 'Solutions',
        'h1': 'Three solution lines. One operator story.',
        'intro': 'The public site stays company-first by classifying the operating problem into three bounded solution lines instead of a generic services menu.',
        'sections': [
            ('Core solution architecture', [
                ('Revenue Recovery Infrastructure', 'Design the timing, rules, reporting, and escalation logic that protect cash before external fees compress margin.'),
                ('Corporate Legal File Control', 'Build a cleaner chronology, exhibit order, and counsel-facing packet standard before legal strategy is burdened with administrative cleanup.'),
                ('Structured Intake and Packet Design', 'Control what enters the system, what is missing, and what is ready so the next step is based on evidence rather than guesswork.'),
            ], 'cards'),
            ('What a first company engagement can produce', [
                ('Operating read', 'A short summary of leakage, file condition, and internal handoff risk.'),
                ('Pilot map', 'A scoped plan for one lane, one evidence window, and one decision point.'),
                ('Packet logic', 'A practical view of what a cleaner packet, chronology, and gap log should look like.'),
            ], 'cards'),
        ],
        'cta_title': 'Use the review page when a company needs a direct recommendation, not more browsing.',
        'cta_copy': 'The review path stays short, structured, and selective so a CFO, owner, or counsel-facing operator can move with confidence.',
    },
    'revenue-recovery-workflow': {
        'surface': 'dark',
        'title': 'Revenue Recovery Infrastructure | VitaCoreX',
        'description': 'Revenue recovery design for operators that need stronger sequencing, cleaner conversion logic, and lower fee compression before outside cost expands.',
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
        ],
        'cta_title': 'Start with a confidential review when the recovery issue is material enough to warrant structured intervention.',
        'cta_copy': 'The first question is whether the highest-value move is diagnose, pilot, or a broader redesign of the operating model.',
    },
    'corporate-legal-file-control': {
        'surface': 'dark',
        'title': 'Corporate Legal File Control | VitaCoreX',
        'description': 'Documentation control and counsel-ready packet standards for companies that cannot afford weak chronology, missing records, or poor handoff quality.',
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
        ],
        'cta_title': 'Use the company review path when the packet itself is delaying confident action.',
        'cta_copy': 'The review will clarify whether the strongest next move is file cleanup, packet control, or a combined pilot with recovery design work.',
    },
    'structured-case-intake': {
        'surface': 'dark',
        'title': 'Structured Intake and Packet Design | VitaCoreX',
        'description': 'Structured intake, packet readiness, and evidence discipline before downstream spend or legal escalation expands.',
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
        ],
        'cta_title': 'Start with review when the intake layer itself is the bottleneck.',
        'cta_copy': 'The first step is to confirm what the intake gate should capture, what should be blocked, and what should be escalated only after evidence is complete.',
    },
    'industries': {
        'surface': 'dark',
        'title': 'Industries | VitaCoreX',
        'description': 'Where VitaCoreX fits best: healthcare, dental, subscription, fleet, fuel, logistics, and contract-heavy service businesses.',
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
            ('What buyer fit looks like', [
                ('Strong fit', 'The problem is expensive, repeatable, and visible enough that leadership wants a safer operating model and a clearer handoff logic.'),
                ('Weak fit', 'The need is only one-off consumer help, generic consulting language, or a vague request without an operating problem behind it.'),
            ], 'compare'),
        ],
        'cta_title': 'If the issue maps to one of these operator environments, use the review path and keep the discussion concrete.',
        'cta_copy': 'The form is structured to capture the lane, the pain, and the likely next step without forcing unnecessary friction up front.',
    },
    'resources': {
        'surface': 'dark',
        'title': 'Proof and Executive Briefs | VitaCoreX',
        'description': 'Executive briefs, sample outputs, and a bounded pilot structure for buyers who need more than decorative claims.',
        'kicker': 'Proof',
        'h1': 'Proof that supports internal forwarding, not fake prestige.',
        'intro': 'VitaCoreX uses executive briefs, sample packet logic, and bounded pilot materials so a serious buyer can explain the firm internally without guessing.',
        'sections': [
            ('Proof architecture', [
                ('Executive brief framing', 'Short, decision-useful materials for CFO, owner, and counsel-facing review.'),
                ('Sample output strip', 'Pilot structure, file-control deliverable, executive brief, and sample packet logic presented as concrete working outputs.'),
                ('Representative scenario', 'A bounded example with realistic context rather than zero-state counters or theatrical ROI claims.'),
            ], 'cards'),
            ('Sample outputs', [
                ('Representative operator brief', 'A concise read on leakage, handoff risk, and why a pilot may or may not make sense.'),
                ('Pilot structure memo', 'Scope, evidence window, responsibilities, and decision point for a controlled first engagement.'),
                ('File-control sample', 'An anonymized illustration of chronology, required-document logic, and gap visibility.'),
            ], 'cards'),
        ],
        'cta_title': 'Request the executive brief through the structured gate, not a browser-only email handoff.',
        'cta_copy': 'The request is stored as structured lead data with attribution, language, and asset tracking before the brief is released.',
    },
    'contact': {
        'surface': 'dark',
        'title': 'Request Confidential Review | VitaCoreX',
        'description': 'Use the company-first review form to request a confidential operating review with context, attribution, and controlled document handling.',
        'kicker': 'Review',
        'h1': 'Request a confidential review without turning the first step into a long intake interview.',
        'intro': 'The review page is company-first. Advanced fields stay available for serious buyers, but the visible form stays focused on fit, operating pain, and the safest next step.',
        'sections': [
            ('Visible trust around the form', [
                ('Response window', 'Qualified company inquiries receive an initial response target within one business day.'),
                ('Confidentiality', 'Documents and context are handled through a controlled review process with attachment storage and lead metadata captured server-side.'),
                ('Next-step doctrine', 'The outcome is a clearer recommendation for review, pilot, scale, or no-fit rather than a vague promise.'),
            ], 'cards'),
        ],
        'cta_title': 'The company review path is designed for clarity first.',
        'cta_copy': 'The first step stays short, structured, and auditable so serious buyers are not forced through a prototype-feeling form.',
    },
    'about': {
        'surface': 'soft',
        'title': 'About VitaCoreX',
        'description': 'What VitaCoreX does, what it does not do, and how engagements are structured.',
        'kicker': 'About',
        'h1': 'A selective advisory posture built around operator clarity, file quality, and safer handoff logic.',
        'intro': 'VitaCoreX is positioned as a premium advisory layer for complex operators, not a general service marketplace and not a law firm.',
        'sections': [
            ('Credibility block', [
                ('What VitaCoreX does', 'Revenue recovery design, corporate legal file control, and structured intake discipline for operator teams that need a safer next step.'),
                ('What VitaCoreX does not do', 'The public site does not offer legal representation, generic agency services, or fake prestige signals meant to substitute for proof.'),
                ('How engagements are structured', 'A first review clarifies fit, a bounded pilot proves evidence, and scale follows only when the operating model justifies it.'),
            ], 'cards'),
            ('Diagnose, pilot, scale', [
                ('Diagnose', 'Review the workflow, file condition, escalation logic, and internal forwarding risk.'),
                ('Pilot', 'Run one bounded lane with documented responsibilities, evidence window, and decision criteria.'),
                ('Scale', 'Expand only after the buyer has proof, clarity, and internal confidence.'),
            ], 'steps'),
        ],
        'cta_title': 'Use the company review page when the issue is specific enough to justify a serious conversation.',
        'cta_copy': 'The public site stays selective by design. Clarity and boundary come before volume.',
    },
    'additional-services': {
        'surface': 'soft',
        'title': 'Private Client Services | VitaCoreX',
        'description': 'A secondary, quieter path for selected private-client and individual documentation matters.',
        'kicker': 'Private Client Services',
        'h1': 'A quieter secondary path for selected private-client matters.',
        'intro': 'Private-client work remains available, but it is intentionally subordinate to the company lane so enterprise buyers are never forced to classify VitaCoreX as a general services marketplace.',
        'sections': [
            ('Selected private-client scope', [
                ('Contracts and documentation support', 'Selected reviews for contracts, personal documentation packages, and evidence organization when the scope is appropriate.'),
                ('Immigration packet organization', 'Structured packet assembly support for document-heavy cases without presenting the public site as regulated legal intake.'),
                ('Business and launch support', 'Selected startup or planning materials where the need is bounded, document-driven, and a fit for the secondary lane.'),
            ], 'cards'),
            ('Self-selection matters', [
                ('Use this page when', 'The request is individual, document-driven, and does not belong in the company advisory lane.'),
                ('Do not use this page when', 'The real need is operator-side recovery design, file-control work, or a counsel-facing corporate handoff issue.'),
            ], 'compare'),
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
    'en': {'home':'Home','solutions':'Solutions','industries':'Industries','proof':'Proof','review':'Review','about':'About','private':'Private Client Services','signin':'Sign in','review_cta':'Request confidential review','proof_cta':'Review executive brief','subtitle':'Operator advisory and documentation control','city':'Tampa, Florida, U.S.','boundary':'VitaCoreX is not a law firm. The public site describes advisory, documentation, and intake control services only.','footer_brand':'VitaCoreX LLC','footer_copy':'Premium operator advisory for revenue recovery design, legal file control, and structured intake before outside cost expands.','footer_firm':'Firm posture','footer_secondary':'Secondary routes','footer_boundary':'Legal boundary','lang_label':'Language','service_btn':'Request service','career_btn':'Submit application'},
    'ru': {'home':'Главная','solutions':'Решения','industries':'Отрасли','proof':'Proof','review':'Review','about':'О компании','private':'Частные услуги','signin':'Войти','review_cta':'Запросить конфиденциальный обзор','proof_cta':'Открыть executive brief','subtitle':'Операторский advisory и контроль документации','city':'Тампа, Флорида, США','boundary':'VitaCoreX не является юридической фирмой. Публичный сайт описывает advisory, контроль документации и структурированный intake.','footer_brand':'VitaCoreX LLC','footer_copy':'Премиальный advisory для операторов: дизайн revenue recovery, контроль юридического файла и структурированный intake до роста внешних расходов.','footer_firm':'Позиция фирмы','footer_secondary':'Вторичные маршруты','footer_boundary':'Правовая граница','lang_label':'Язык','service_btn':'Запросить услугу','career_btn':'Отправить заявку'},
    'es': {'home':'Inicio','solutions':'Soluciones','industries':'Industrias','proof':'Proof','review':'Review','about':'Nosotros','private':'Servicios privados','signin':'Entrar','review_cta':'Solicitar revisión confidencial','proof_cta':'Abrir executive brief','subtitle':'Advisory operativo y control documental','city':'Tampa, Florida, EE. UU.','boundary':'VitaCoreX no es un bufete de abogados. El sitio público describe advisory, control documental e intake estructurado.','footer_brand':'VitaCoreX LLC','footer_copy':'Advisory premium para operadores: diseño de revenue recovery, control del expediente legal e intake estructurado antes de que aumente el costo externo.','footer_firm':'Postura de firma','footer_secondary':'Rutas secundarias','footer_boundary':'Límite legal','lang_label':'Idioma','service_btn':'Solicitar servicio','career_btn':'Enviar postulación'},
}

def route_for(lang, slug):
    if lang == 'en':
        return '/' if slug == 'index' else f'/{slug}.html'
    return f'/{lang}/' if slug == 'index' else f'/{lang}/{slug}.html'

def canonical_for(lang, slug):
    return DOMAIN + route_for(lang, slug)

def file_for(lang, slug):
    folder = ROOT if lang == 'en' else ROOT / lang
    folder.mkdir(parents=True, exist_ok=True)
    return folder / ('index.html' if slug == 'index' else f'{slug}.html')

def header(lang, slug):
    ui = UI[lang]
    switch = ''.join(f'<a href="{route_for(code, slug)}" aria-current="{"true" if code == lang else "false"}">{code.upper()}</a>' for code in LANGS)
    nav_items = [(ui['home'], 'index'), (ui['solutions'], 'solutions'), (ui['industries'], 'industries'), (ui['proof'], 'resources'), (ui['review'], 'contact'), (ui['about'], 'about'), (ui['private'], 'additional-services')]
    nav = ''.join(f'<a href="{route_for(lang, target)}" {"aria-current=\"page\"" if slug == target else ""}>{label}</a>' for label, target in nav_items)
    mobile = nav + f'<a href="/app/sign-in/">{ui["signin"]}</a>'
    return f'''<header class="site-header"><div class="site-shell header-row"><a class="brand" href="{route_for(lang, 'index')}" aria-label="VitaCoreX"><span class="brand-mark"><img src="/assets/img/logo.png" alt=""></span><span class="brand-copy"><strong>VitaCoreX</strong><small>{ui['subtitle']}</small></span></a><nav class="site-nav" aria-label="Primary">{nav}</nav><div class="header-actions"><div class="lang-switch" aria-label="{ui['lang_label']}">{switch}</div><a class="btn btn-secondary" href="/app/sign-in/">{ui['signin']}</a><button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobileMenu">Menu</button></div></div><div class="site-shell mobile-menu" id="mobileMenu" data-mobile-menu hidden><nav aria-label="Mobile">{mobile}</nav></div></header>'''

def footer(lang):
    ui = UI[lang]
    firm_links = ''.join([f'<a href="{route_for(lang, "solutions")}">{ui["solutions"]}</a>', f'<a href="{route_for(lang, "resources")}">{ui["proof"]}</a>', f'<a href="{route_for(lang, "contact")}">{ui["review_cta"]}</a>', f'<a href="{route_for(lang, "about")}">{ui["about"]}</a>'])
    secondary_links = ''.join([f'<a href="{route_for(lang, "additional-services")}">{ui["private"]}</a>', f'<a href="{route_for(lang, "careers")}">Careers</a>', f'<a href="{route_for(lang, "privacy-policy")}">Privacy Policy</a>', f'<a href="{route_for(lang, "terms-of-use")}">Terms of Use</a>', f'<a href="{route_for(lang, "cookie-policy")}">Cookie Policy</a>'])
    return f'''<footer class="footer"><div class="site-shell footer-grid"><section class="footer-card footer-copy"><strong>{ui['footer_brand']}</strong><p>{ui['footer_copy']}</p><p>{ui['city']}</p></section><section class="footer-card"><h2 class="footer-title">{ui['footer_firm']}</h2><div class="footer-links">{firm_links}</div></section><section class="footer-card"><h2 class="footer-title">{ui['footer_secondary']}</h2><div class="footer-links">{secondary_links}</div></section><section class="footer-card footer-copy"><h2 class="footer-title">{ui['footer_boundary']}</h2><p>{ui['boundary']}</p></section></div></footer>'''

def render_cards(items, mode):
    if mode == 'trust':
        return '<div class="trust-strip">' + ''.join(f'<article class="trust-chip"><span class="stat-label">{title}</span><strong>{body}</strong></article>' for title, body in items) + '</div>'
    if mode == 'steps':
        return '<div class="step-grid">' + ''.join(f'<article class="step-card"><span class="step-number">{i:02d}</span><h3>{title}</h3><p>{body}</p></article>' for i, (title, body) in enumerate(items, 1)) + '</div>'
    if mode == 'compare':
        classes = ['comparison-card comparison-card--positive', 'comparison-card comparison-card--negative']
        return '<div class="comparison-grid">' + ''.join(f'<article class="{classes[min(i,1)]}"><h3>{title}</h3><p>{body}</p></article>' for i, (title, body) in enumerate(items)) + '</div>'
    if mode == 'cards4':
        return '<div class="card-grid card-grid--4">' + ''.join(f'<article class="card"><h3>{title}</h3><p>{body}</p></article>' for title, body in items) + '</div>'
    if mode == 'policy':
        return ''.join(f'<article class="policy-article"><h2>{title}</h2><p>{body}</p></article>' for title, body in items)
    return '<div class="card-grid card-grid--3">' + ''.join(f'<article class="card"><h3>{title}</h3><p>{body}</p></article>' for title, body in items) + '</div>'

def resource_form(lang):
    ui = UI[lang]
    return f'''<section class="section"><div class="site-shell form-layout"><aside class="form-panel"><p class="eyebrow">What happens next</p><h2>What happens next</h2><ul class="key-list"><li>The request is stored as structured lead data rather than inbox-only email.</li><li>If the request fits the company lane, VitaCoreX releases the brief and logs the asset against the lead record.</li><li>The resulting path stays bounded: review, pilot, or no-fit recommendation.</li></ul></aside><div class="form-panel"><p class="eyebrow">Unlock the executive brief</p><p>Use a short company form to request the executive brief. The public gate captures attribution, company context, and the asset requested without reducing the page to lead bait.</p><form data-intake-form novalidate><input type="hidden" name="purpose" value="executive_brief"><input type="hidden" name="lang" value="{lang}"><input type="hidden" name="route_key" value="executive-brief"><input type="hidden" name="service_line" value="proof and executive brief"><input type="hidden" name="asset_requested" value="executive-brief"><input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=executive_brief"><input type="hidden" name="page_path"><input type="hidden" name="page_url"><input type="hidden" name="page_title"><input type="hidden" name="referrer"><input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_term"><input type="hidden" name="utm_content"><input type="hidden" name="gclid"><input type="hidden" name="fbclid"><input type="hidden" name="submitted_after_ms"><div class="form-stack"><div class="field-row"><div class="field"><label>Full name</label><input name="full_name" required autocomplete="name"></div><div class="field"><label>Work email</label><input name="work_email" type="email" required autocomplete="email" inputmode="email"></div></div><div class="field-row"><div class="field"><label>Company</label><input name="company_name" required autocomplete="organization"></div><div class="field"><label>Title</label><input name="title" autocomplete="organization-title"></div></div><div class="field is-hidden"><label>Leave blank</label><input name="company_website" autocomplete="off" tabindex="-1"></div><div class="field"><label>Message</label><textarea name="message" placeholder="Tell VitaCoreX what kind of operator context or decision path you want the brief to support."></textarea></div><p class="form-note">The brief gate records attribution, language, route, and asset requested. It does not imply representation, legal advice, or guaranteed engagement.</p><div class="status" data-form-status></div><button class="btn btn-primary" type="submit">{ui['proof_cta']}</button></div></form></div></div></section>'''

def company_form(lang):
    ui = UI[lang]
    return f'''<section class="section section--soft"><div class="site-shell form-layout"><aside class="form-panel"><p class="eyebrow">Visible trust around the form</p><h2>Why the form looks reliable</h2><p>CRM-first route, structured storage, attachment metadata, and audit logging replace inbox-only prototype behavior.</p><ul class="key-list"><li>{ui['city']}</li><li>{ui['boundary']}</li><li>Qualified company inquiries receive an initial response target within one business day.</li></ul></aside><div class="form-panel"><p class="eyebrow">Company review request</p><p>Use this route for revenue recovery, file-control, and intake-discipline issues. Private-client requests belong on the secondary page.</p><form data-intake-form novalidate><input type="hidden" name="purpose" value="company_review"><input type="hidden" name="lang" value="{lang}"><input type="hidden" name="route_key" value="company-review"><input type="hidden" name="service_line" value="company confidential review"><input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=company_review"><input type="hidden" name="page_path"><input type="hidden" name="page_url"><input type="hidden" name="page_title"><input type="hidden" name="referrer"><input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_term"><input type="hidden" name="utm_content"><input type="hidden" name="gclid"><input type="hidden" name="fbclid"><input type="hidden" name="submitted_after_ms"><div class="form-stack"><div class="field-row"><div class="field"><label>Full name</label><input name="full_name" autocomplete="name" required></div><div class="field"><label>Work email</label><input name="work_email" type="email" autocomplete="email" inputmode="email" required></div></div><div class="field-row"><div class="field"><label>Company</label><input name="company_name" autocomplete="organization" required></div><div class="field"><label>Title</label><input name="title" autocomplete="organization-title"></div></div><div class="field-row"><div class="field"><label>Phone</label><input name="phone" type="tel" autocomplete="tel" inputmode="tel"></div><div class="field"><label>Industry</label><select name="industry" required><option value="">Select</option><option>Healthcare / Dental</option><option>Subscription / Recurring payments</option><option>Fleet / Fuel / Logistics</option><option>Contract-heavy services</option><option>Other</option></select></div></div><div class="field is-hidden"><label>Leave blank</label><input name="company_website" autocomplete="off" tabindex="-1"></div><details class="disclosure"><summary>Add context</summary><div class="disclosure-grid form-stack"><div class="field-row"><div class="field"><label>Annual revenue band</label><select name="annual_revenue_band"><option value="">Select</option><option>Under $5M</option><option>$5M to $25M</option><option>$25M to $100M</option><option>$100M+</option></select></div><div class="field"><label>Portfolio size band</label><select name="portfolio_size_band"><option value="">Select</option><option>Under $250K</option><option>$250K to $1M</option><option>$1M to $5M</option><option>$5M+</option></select></div></div><div class="field-row"><div class="field"><label>Documentation condition</label><select name="documentation_condition"><option value="">Select</option><option>Structured</option><option>Mixed by team or site</option><option>Weak chronology / packet quality</option></select></div><div class="field"><label>Urgency</label><select name="urgency"><option value="">Select</option><option>Immediate</option><option>30-day review</option><option>Exploratory</option></select></div></div><div class="field"><label>Pain type</label><input name="pain_type" placeholder="Leakage, fee compression, weak packet handoff, intake bottleneck"></div><div class="field"><label>Attachment</label><input name="attachment" type="file" data-file-list="#companyFileList" accept=".pdf,.doc,.docx,.xlsx,.csv,.txt"><div class="file-pill" id="companyFileList" data-empty-label="No file selected.">No file selected.</div><p class="field-note">Optional sample file. Attachments are stored with the lead record, not passed through browser-only email logic.</p></div></div></details><div class="field"><label>Message</label><textarea name="message" required placeholder="Describe the operating issue, the file condition, and the safest next step you need."></textarea></div><p class="form-note">Response window: one business day for qualified company inquiries. Confidentiality is handled through controlled review and structured storage. VitaCoreX is not a law firm.</p><div class="status" data-form-status></div><button class="btn btn-primary" type="submit">{ui['review_cta']}</button></div></form></div></div></section>'''

def private_form(lang):
    ui = UI[lang]
    return f'''<section class="section"><div class="site-shell form-layout"><aside class="form-panel"><p class="eyebrow">Secondary route</p><h2>Private-client work stays available without crowding the company lane.</h2><p>{ui['boundary']}</p></aside><div class="form-panel"><p class="eyebrow">Private-client request</p><p>The request form stays clean, selective, and clear about fit, confidentiality, and what happens next.</p><form data-intake-form novalidate><input type="hidden" name="purpose" value="individual_request"><input type="hidden" name="lang" value="{lang}"><input type="hidden" name="route_key" value="private-client"><input type="hidden" name="service_line" value="private client services"><input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=individual_request"><input type="hidden" name="page_path"><input type="hidden" name="page_url"><input type="hidden" name="page_title"><input type="hidden" name="referrer"><input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_term"><input type="hidden" name="utm_content"><input type="hidden" name="gclid"><input type="hidden" name="fbclid"><input type="hidden" name="submitted_after_ms"><div class="form-stack"><div class="field-row"><div class="field"><label>Full name</label><input name="full_name" autocomplete="name" required></div><div class="field"><label>Email</label><input name="email" type="email" autocomplete="email" inputmode="email" required></div></div><div class="field-row"><div class="field"><label>Phone</label><input name="phone" type="tel" autocomplete="tel" inputmode="tel"></div><div class="field"><label>Requested service</label><select name="service_line" required><option value="">Select</option><option>Contracts and documentation support</option><option>Immigration packet organization</option><option>Business or launch support</option></select></div></div><div class="field is-hidden"><label>Leave blank</label><input name="company_website" autocomplete="off" tabindex="-1"></div><div class="field"><label>Message</label><textarea name="message" required placeholder="Describe the matter, timeline, and what support you need."></textarea></div><p class="form-note">This route is secondary and selective. VitaCoreX reviews fit before requesting unnecessary documents.</p><div class="status" data-form-status></div><button class="btn btn-primary" type="submit">{ui['service_btn']}</button></div></form></div></div></section>'''

def careers_form(lang):
    ui = UI[lang]
    return f'''<section class="section"><div class="site-shell form-layout"><div class="form-panel"><p class="eyebrow">Selective application</p><p>The application captures role interest, location, and a resume or sample document without turning careers into a top-level conversion focus.</p><form data-intake-form novalidate><input type="hidden" name="purpose" value="careers_application"><input type="hidden" name="lang" value="{lang}"><input type="hidden" name="route_key" value="careers"><input type="hidden" name="service_line" value="careers"><input type="hidden" name="thank_you_path" value="{route_for(lang, 'thank-you')}?purpose=careers_application"><input type="hidden" name="page_path"><input type="hidden" name="page_url"><input type="hidden" name="page_title"><input type="hidden" name="referrer"><input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_term"><input type="hidden" name="utm_content"><input type="hidden" name="gclid"><input type="hidden" name="fbclid"><input type="hidden" name="submitted_after_ms"><div class="form-stack"><div class="field-row"><div class="field"><label>Full name</label><input name="full_name" autocomplete="name" required></div><div class="field"><label>Email</label><input name="email" type="email" autocomplete="email" required></div></div><div class="field-row"><div class="field"><label>Location</label><input name="location"></div><div class="field"><label>Role interest</label><input name="role_interest" required></div></div><div class="field"><label>LinkedIn URL</label><input name="linkedin_url" inputmode="url"></div><div class="field"><label>Resume or sample</label><input name="resume" type="file" data-file-list="#careerFileList" accept=".pdf,.doc,.docx,.txt"><div class="file-pill" id="careerFileList" data-empty-label="No file selected.">No file selected.</div></div><div class="field"><label>Message</label><textarea name="message" placeholder="Describe the role fit, relevant operator experience, and why VitaCoreX should review your application."></textarea></div><div class="field is-hidden"><label>Leave blank</label><input name="company_website" autocomplete="off" tabindex="-1"></div><div class="status" data-form-status></div><button class="btn btn-primary" type="submit">{ui['career_btn']}</button></div></form></div><aside class="form-panel"><p class="eyebrow">Secondary route</p><h2>Careers remain subordinate to the buyer path.</h2><p>The public site stays company-first. Careers are visible and professional, but they do not interrupt the core company review flow.</p></aside></div></section>'''

def page_body(lang, slug):
    ui = UI[lang]
    page = PAGES[slug]
    if slug == 'thank-you':
        return f'<section class="thankyou-hero"><div class="thankyou-card"><p class="eyebrow">{page["kicker"]}</p><h1 data-thankyou-title>{page["h1"]}</h1><p data-thankyou-body>{page["intro"]}</p><p><strong>Lead ID:</strong> <span data-thankyou-lead>Pending</span></p><div class="hero-actions"><a class="btn btn-primary" href="{route_for(lang, "contact")}">{ui["review_cta"]}</a><a class="btn btn-secondary" href="{route_for(lang, "resources")}">{ui["proof_cta"]}</a></div></div></section>'
    breadcrumbs = '' if slug == 'index' else f'<nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="{route_for(lang, "index")}">{ui["home"]}</a><span>/</span><span>{page["kicker"]}</span></nav>'
    hero_rows = ''
    if page.get('hero_rows'):
        hero_rows = '<aside class="hero-card"><h2>First-screen credibility</h2><div class="meta-card">' + ''.join(f'<div class="meta-row"><span>{label}</span><strong>{value}</strong></div>' for label, value in page['hero_rows']) + '</div></aside>'
    actions = f'<div class="hero-actions"><a class="btn btn-primary" href="{route_for(lang, "contact")}">{ui["review_cta"]}</a><a class="btn btn-secondary" href="{route_for(lang, "resources")}">{ui["proof_cta"]}</a></div>'
    if slug == 'index':
        actions += f'<p class="inline-note">{ui["boundary"]}</p>'
    body = [f'<section class="hero"><div class="site-shell hero-grid"><div class="hero-copy">{breadcrumbs}<p class="eyebrow">{page["kicker"]}</p><h1>{page["h1"]}</h1><p>{page["intro"]}</p>{actions}</div>{hero_rows}</div></section>']
    for title, items, mode in page.get('sections', []):
        cls = 'section section--soft' if mode in {'policy', 'compare'} else 'section'
        body.append(f'<section class="{cls}"><div class="site-shell"><div class="section-head"><h2>{title}</h2></div>{render_cards(items, mode)}</div></section>')
    if slug == 'resources':
        body.append(resource_form(lang))
    if slug == 'contact':
        body.append(company_form(lang))
    if slug == 'additional-services':
        body.append(private_form(lang))
    if slug == 'careers':
        body.append(careers_form(lang))
    body.append(f'<section class="section section--soft"><div class="site-shell"><div class="cta-band"><div><h2>{page["cta_title"]}</h2><p>{page["cta_copy"]}</p></div><div class="cta-actions"><a class="btn btn-primary" href="{route_for(lang, "contact")}">{ui["review_cta"]}</a><a class="btn btn-secondary" href="{route_for(lang, "resources")}">{ui["proof_cta"]}</a></div></div></div></section>')
    return ''.join(body)

def head(lang, slug):
    page = PAGES[slug]
    alts = ''.join([f'<link rel="alternate" hreflang="{("en-US" if code == "en" else code)}" href="{canonical_for(code, slug)}">' for code in LANGS]) + f'<link rel="alternate" hreflang="x-default" href="{canonical_for("en", slug)}">'
    schema = [{"@context":"https://schema.org","@type":"Organization","name":"VitaCoreX LLC","url":DOMAIN,"areaServed":"US","address":{"@type":"PostalAddress","addressLocality":"Tampa","addressRegion":"FL","addressCountry":"US"},"description":UI['en']['footer_copy']}]
    if slug == 'index':
        schema.append({"@context":"https://schema.org","@type":"WebSite","name":"VitaCoreX","url":DOMAIN,"inLanguage":lang})
    robots = 'noindex, nofollow' if slug == 'thank-you' else 'index, follow'
    return f'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{page["title"]}</title><meta name="description" content="{page["description"]}"><meta name="robots" content="{robots}"><meta name="theme-color" content="#07131f"><meta property="og:type" content="website"><meta property="og:locale" content="{lang}"><meta property="og:title" content="{page["title"]}"><meta property="og:description" content="{page["description"]}"><meta property="og:url" content="{canonical_for(lang, slug)}"><meta property="og:image" content="/assets/img/og-vitacorex-2026.svg"><meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="{canonical_for(lang, slug)}">{alts}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"><link rel="icon" href="/assets/img/logo.png"><link rel="apple-touch-icon" href="/assets/img/logo.png"><link rel="manifest" href="/manifest.webmanifest"><link href="/assets/css/vitacorex-public.css" rel="stylesheet"><script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script></head>'

def render_page(lang, slug):
    page = PAGES[slug]
    return f'<!DOCTYPE html><html lang="{lang}">{head(lang, slug)}<body data-api-base="/api" data-surface="{page.get("surface", "dark")}"><a class="skip-link" href="#main">Skip to content</a>{header(lang, slug)}<main id="main">{page_body(lang, slug)}</main>{footer(lang)}<div class="consent-banner" data-consent-banner hidden><div class="consent-copy"><strong data-consent-title></strong><p data-consent-body></p></div><div class="consent-actions"><button class="btn btn-secondary" type="button" data-consent-essential></button><button class="btn btn-primary" type="button" data-consent-analytics></button></div></div><script src="/assets/js/vitacorex-public.js"></script></body></html>'

def write_svg():
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#07131f"/><stop offset="100%" stop-color="#11283d"/></linearGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><rect x="78" y="80" width="1044" height="470" rx="34" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.12)"/><text x="108" y="168" fill="#d2ba87" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="6">VITACOREX</text><text x="108" y="260" fill="#f8fbfd" font-family="Space Grotesk, Arial, sans-serif" font-size="64" font-weight="700">Revenue recovery design</text><text x="108" y="330" fill="#f8fbfd" font-family="Space Grotesk, Arial, sans-serif" font-size="64" font-weight="700">and documentation control</text><text x="108" y="410" fill="#aec0cf" font-family="Inter, Arial, sans-serif" font-size="28">For finance-led operators that cannot afford a weak handoff.</text><text x="108" y="490" fill="#aec0cf" font-family="Inter, Arial, sans-serif" font-size="24">Tampa, Florida, U.S.  •  Not a law firm</text></svg>'
    (ROOT / 'assets' / 'img' / 'og-vitacorex-2026.svg').write_text(svg, encoding='utf-8')

def write_manifest():
    payload = {'name':'VitaCoreX Public Review','short_name':'VitaCoreX','start_url':'/','display':'standalone','background_color':'#07131f','theme_color':'#07131f','icons':[{'src':'/assets/img/logo.png','sizes':'512x512','type':'image/png'}],'shortcuts':[{'name':'Request confidential review','url':'/contact.html'},{'name':'Review executive brief','url':'/resources.html'},{'name':'Sign in','url':'/app/sign-in/'}]}
    (ROOT / 'manifest.webmanifest').write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')

def write_pdf(path, title, subtitle, bullets):
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
    write_pdf(briefs / 'vitacorex-executive-brief.pdf','Executive brief','A concise operator-facing read on leakage, documentation condition,\nand the safest next move before outside cost expands.',['What is breaking first in the current workflow or file-control layer.','What a first engagement would produce and what VitaCoreX does not claim.','How to decide between diagnose, pilot, scale, or a no-fit outcome.'])
    write_pdf(briefs / 'vitacorex-pilot-structure.pdf','Pilot structure','A bounded pilot is used to validate fit, evidence, and decision quality\nbefore larger deployment.',['One operator lane with one evidence window and one decision point.','Documented responsibilities on both the operator and VitaCoreX side.','Measured outputs that can be forwarded internally without inflated claims.'])
    write_pdf(briefs / 'vitacorex-file-control-sample.pdf','File-control sample','An anonymized sample of chronology, gap visibility, and counsel-facing packet logic.',['Required document logic with blocker visibility.','Chronology structure before counsel or collections escalation.','Packet-control discipline that reduces avoidable downstream cleanup.'])

def write_sitemap():
    urls = [canonical_for(lang, slug) for lang in LANGS for slug in PAGES if slug != 'thank-you']
    xml = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in urls:
        xml.extend(['  <url>', f'    <loc>{url}</loc>', '  </url>'])
    xml.append('</urlset>')
    (ROOT / 'sitemap.xml').write_text('\n'.join(xml), encoding='utf-8')

def write_robots():
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: https://vitacorexllc.com/sitemap.xml\n', encoding='utf-8')

def main():
    for lang in LANGS:
        for slug in PAGES:
            file_for(lang, slug).write_text(render_page(lang, slug), encoding='utf-8')
    (ROOT / 'vitacorex-landing.html').write_text((ROOT / 'index.html').read_text(encoding='utf-8'), encoding='utf-8')
    write_svg(); write_manifest(); write_briefs(); write_sitemap(); write_robots()

if __name__ == '__main__':
    main()
