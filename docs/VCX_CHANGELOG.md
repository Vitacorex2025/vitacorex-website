# VCX Changelog

## [Phase 4 — Regression & Visual-Freeze Review] - 2026-04-02

### Review Scope
- Full regression audit across Phase 4A, 4B, 4C
- No new features added — review only

### Results
- **Homepage:** ZERO DIFF — `index.html` completely unchanged
- **Global CSS:** ZERO DIFF — `styles.css`, `ui-shell.css`, `premium-fixes.css`
- **Design System CSS:** ZERO DIFF — `vcx-tokens.css` through `vcx-utilities.css`
- **Global JS:** ZERO DIFF — `ui-shell.js`, `premium-fixes.js`
- **Internal Links:** 483 checked across 16 HTML files — zero broken
- **Boundary Markers:** All tracked-file insertions wrapped in `<!-- VCX Phase N START/END -->`
- **Page-Scoped CSS:** All new CSS uses `body[data-vcx-page]` scoping — no global leakage
- **API Pattern:** `window.VCX_API_BASE || ''` present in all API-calling scripts
- **Documented Deviations:** sign-in rewrite recorded in `GUARDRAIL_DEVIATIONS.md`
- **Schema:** `schema.sql` unchanged across all Phase 4 sub-phases

### Open Risks (from review)
1. Transcript endpoint (`GET /api/legal-chat/transcript/{id}`) lacks auth — session UUIDs are unguessable but production should add auth
2. Legal assistant 69 out-of-scope keywords may produce edge-case false positives
3. Email service requires SMTP config — missing config = silent no-op (by design)

### Files Created
| # | File | Purpose |
|---|------|---------|
| 1 | `docs/VCX_PHASE4_REVIEW.md` | This review report |

### Files Modified
| # | File | Change |
|---|------|--------|
| 1 | `docs/VCX_CHANGELOG.md` | Added Phase 4 review section |

---

## [Phase 4C — Legal Assistant Hardening] - 2026-04-02

### Tighter Topic Routing
- Expanded `TOPIC_KEYWORDS` per topic with additional synonyms and variations (e.g., "signing", "breach", "green card", "visa", "buyer's order", "dmv")
- Added topic validation gate in policy.py — rejects topics not in `ALLOWED_TOPICS`
- Stronger "no topic detected" response with numbered list of exactly 4 supported areas
- New status types: `out_of_scope`, `no_topic` (previously only `escalate`, `need_more_info`, `answered`)

### Stronger Unsupported-Topic Handling
- Expanded `OUT_OF_SCOPE_KEYWORDS` from 14 to 55+ keywords covering: criminal/emergency, family/domestic, housing, financial, immigration emergencies, litigation, medical/PI, estate/tax, employment litigation, general legal advice seeking
- Added `_ADVICE_SEEKING_PATTERNS` — 6 regex patterns detecting phrases like "should I sue", "what are my legal rights", "represent me", "give me legal advice"
- Out-of-scope responses now explicitly list what the assistant cannot help with and provide actionable product routing links

### Better Escalation Linking
- Created `TOPIC_PRODUCT_ROUTES` mapping in knowledge.py — maps each topic to specific VCX product pages with labels, URLs, and descriptions
- Created `DEFAULT_PRODUCT_ROUTES` — fallback routes for out-of-scope/unmatched topics (Structured Intake, Private Consultation, Client Portal Sign-In)
- New `get_product_routes(topic)` function returns the appropriate product links per topic
- Every ChatResponse now includes `escalation_links[]` — clickable product routes rendered in the UI
- Topic-specific routing: contracts → Contract Scanner + Structured Intake, immigration → Structured Intake, auto deal → Structured Intake, Florida sources → Structured Intake
- Next-step text updated with specific product names and actions

### Transcript/Event Logging
- Added `_log_event()` in chat.py router — saves policy decisions to the messages table with role='event' and JSON content
- Events logged: `answered`, `out_of_scope`, `no_topic`, `invalid_topic`, `no_knowledge_match`, `need_state`, `escalation_submitted`
- Added `event_type` field to ChatResponse model for structured logging
- Added GET /api/legal-chat/transcript/{session_id} endpoint — returns full session transcript including user messages, assistant responses, and policy events (rate-limited 30/min)

### Frontend Improvements (vcx-legal-assistant.js + vcx-legal-assistant.css)
- Escalation links rendered as styled cards with label + description (`.la-escalation-link`)
- Boundary responses (out_of_scope, escalate, no_topic) get visual treatment (`.la-message-boundary` — red-tinted background)
- Improved initial greeting: explicitly lists 4 supported topics with numbered descriptions, includes Structured Intake link for out-of-scope matters
- Better error handling: 429 rate limit shows fallback link to Structured Intake, network error shows phone number + intake link
- All CSS scoped to `body[data-vcx-page="legal-assistant"]` existing page scope

### Model Updates
- `ChatResponse.escalation_links: list[EscalationLink]` — new field with `EscalationLink(label, url, description)` model
- `ChatResponse.event_type: str | None` — policy decision type for logging
- `ChatResponse.status` expanded: `out_of_scope | no_topic | need_more_info | answered | escalate`

### Files Changed (Phase 4C)

| # | File | Action |
|---|------|--------|
| 1 | vcx-api/app/legal_chat/knowledge.py | Enhanced (expanded keywords + product routes + advice patterns) |
| 2 | vcx-api/app/legal_chat/policy.py | Enhanced (tighter routing + escalation links + event types) |
| 3 | vcx-api/app/models/chat.py | Enhanced (EscalationLink model + event_type + escalation_links) |
| 4 | vcx-api/app/routers/chat.py | Enhanced (event logging + transcript endpoint) |
| 5 | assets/js/vcx-legal-assistant.js | Enhanced (escalation link rendering + boundary UX + improved greeting) |
| 6 | assets/css/vcx-legal-assistant.css | Enhanced (escalation link styles + boundary message styles) |
| 7 | docs/VCX_CHANGELOG.md | Updated |
| 8 | docs/VCX_PHASE4C_QA.md | Created |

### Files NOT modified
- index.html (homepage)
- app/legal-assistant/index.html (HTML structure unchanged)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system CSS (vcx-tokens through vcx-utilities)
- site.js, vcx-i18n.js, shell-i18n.js
- structured-case-intake.html
- All Phase 4A/4B files
- schema.sql (no schema changes)
- vcx-api/knowledge/*.md (knowledge base content unchanged)
- _references/ directory

---

## [Phase 4B — Contract Intelligence Server Wiring] - 2026-04-02

### Server-Side Text Extraction
- Added `pdfplumber>=0.11.0` and `python-docx>=1.1.0` to requirements.txt
- Enhanced `vcx-api/app/services/contract_analyzer.py`:
  - `_extract_pdf()`: pdfplumber-based text extraction with page-level concatenation
  - `_extract_docx()`: python-docx paragraph extraction
  - Safe fallback: ImportError or extraction failure returns None (graceful degradation)
  - `extract_text_from_bytes()` now routes .pdf → pdfplumber, .docx → python-docx, .txt/.md → UTF-8 decode

### Enhanced Contract Analysis (Phase 4B additions to contract_analyzer.py)
- `detect_missing_protections(clauses, contract_type)`: identifies commonly expected clauses not found, per-contract-type expected clause maps (Employment, Service, NDA, Lease, Purchase, Other)
- `generate_suggested_questions(clauses, missing_protections)`: context-specific questions for counsel based on found clauses and missing protections
- `generate_issue_buckets(clauses, missing_protections)`: groups findings into priority buckets — Immediate Attention (high_risk + high-severity missing), Review Recommended (caution + medium-severity missing), Standard Provisions (neutral)

### Enhanced API Response (contracts.py + contract.py models)
- POST /api/contracts/analyze now accepts optional form fields: contract_type, concerns, negotiated, deadline (questionnaire context)
- Response model extended with: extraction_method, word_count, missing_protections[], suggested_questions[], issue_buckets[], questionnaire{}, disclaimer
- New Pydantic models: MissingProtection, SuggestedQuestion, IssueBucketItem, IssueBucket, QuestionnaireContext

### Frontend API Bridge
- Created `assets/js/vcx-contract-intelligence.js`: external script that overrides window.vcxScanContract to use POST /api/contracts/analyze
  - Sends file + questionnaire via FormData
  - Renders enriched server results: issue buckets, missing protections, suggested questions for counsel, extraction quality notice, escalation CTAs
  - Falls back to original client-side analysis on API failure (TypeError/network error)
  - Overrides window.vcxHandleFile to update file notices (PDF/DOCX now show success notices)
  - Bridges server response to client-side analysis format for stronger clause suggestions compatibility
  - Error differentiation: 429 (rate limited), 413 (file too large), 400 (validation), server errors

### Contract Intelligence Page (additive modifications)
- `app/contract-intelligence/index.html`:
  - Added `window._vcxSetAnalysis` bridge setter in IIFE (2 lines, boundary-marked)
  - Added `<script src="/assets/js/vcx-contract-intelligence.js">` before vcx-i18n.js (boundary-marked)
  - Updated upload hint i18n text in EN/RU/ES to reflect server-side PDF/DOCX support
  - Updated inline upload hint paragraph
- No visual design changes. Existing CSS classes reused for server results rendering.

### Escalation Path
- Server results include dual CTAs: "Schedule contract review call" (Calendly) + "Submit to Structured Intake" (with ?service=contract-review parameter)
- Review reference ID shown in results for advisor follow-up
- Advisor review form summary now includes risk score, review ID, missing protections count

### Documentation
- Updated `docs/VCX_CHANGELOG.md`: Phase 4B section
- Updated `docs/VCX_ROADMAP_30_60_90.md`: checked off completed items
- Created `docs/VCX_PHASE4B_QA.md`: full QA checklist and rollback notes

### Files Changed (Phase 4B)

| # | File | Action |
|---|------|--------|
| 1 | vcx-api/requirements.txt | Modified (+pdfplumber, +python-docx) |
| 2 | vcx-api/app/services/contract_analyzer.py | Enhanced (PDF/DOCX extraction + missing protections + questions + buckets) |
| 3 | vcx-api/app/models/contract.py | Enhanced (6 new Pydantic models + extended response) |
| 4 | vcx-api/app/routers/contracts.py | Enhanced (questionnaire form fields + enriched response) |
| 5 | assets/js/vcx-contract-intelligence.js | Created (API bridge with fallback) |
| 6 | app/contract-intelligence/index.html | Modified (3 additive insertions + i18n text updates) |
| 7 | docs/VCX_CHANGELOG.md | Updated |
| 8 | docs/VCX_ROADMAP_30_60_90.md | Updated |
| 9 | docs/VCX_PHASE4B_QA.md | Created |

### Files NOT modified
- index.html (homepage)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system CSS (vcx-tokens, vcx-base, vcx-layout, vcx-components, vcx-utilities)
- site.js, vcx-i18n.js, shell-i18n.js
- structured-case-intake.html
- All Phase 4A files (upload_validator, email_service, rate_limit, sign-in)
- schema.sql (no schema changes needed)
- _references/ directory
- All other app pages

---

## [Phase 4A — Visual-Freeze Hardening] - 2026-04-02

### Upload Validation
- Created `vcx-api/app/services/upload_validator.py`: extension allowlist (.pdf, .doc, .docx, .txt, .md, .jpg, .jpeg, .png, .gif, .csv, .xlsx, .xls), blocked extensions (.exe, .bat, .cmd, .sh, .ps1, .js, .html, .php, .py, etc.), 25MB size limit (VCX_MAX_UPLOAD_MB env var), filename sanitization (path separators, control chars, truncation)
- Wired to: intakes.py (attachment), uploads.py (all files), contracts.py (upload + analyze)

### Rate Limiting
- Added `slowapi>=0.1.9` dependency
- Created `vcx-api/app/rate_limit.py`: shared limiter configuration with VCX_RATE_LIMIT_ENABLED env var
- Rate limits per endpoint: intakes 10/min, uploads 20/min, contracts 10/min, recovery 10/min, chat 30/min, portal magic-link 5/min, portal request-access 5/min, portal lookup-email 5/min, review queue 30/min, review update 20/min, escalate 10/min
- 429 Too Many Requests response on limit exceeded

### Email Notifications
- Created `vcx-api/app/services/email_service.py`: SMTP-based, fire-and-forget (background thread)
- 4 email functions: send_client_intake_confirmation(), send_admin_intake_notification(), send_status_change_notification(), send_portal_access_link()
- Env vars: VCX_SMTP_HOST, VCX_SMTP_PORT, VCX_SMTP_USER, VCX_SMTP_PASS, VCX_ADMIN_EMAIL, VCX_FROM_EMAIL
- Missing SMTP config = warning log, no failure (graceful degradation)
- Wired to: intakes.py (client + admin email on submission), review.py (client email on status change), portal.py (access link email)

### CORS Tightening
- Improved main.py CORS parsing: whitespace stripping after comma split
- Added optional env vars: VCX_CORS_ALLOW_CREDENTIALS, VCX_CORS_ALLOW_METHODS, VCX_CORS_ALLOW_HEADERS

### Sign-In → Portal Auth Flow
- Rewrote `app/sign-in/index.html` from redirect stub to functional sign-in form with v284 canonical shell (header, footer, nav, i18n, clocks)
- Created `assets/js/vcx-sign-in.js`: form handler POSTs to /api/portal/request-access, shows success/error/dev-link
- Created `assets/css/vcx-sign-in.css`: minimal styles scoped to body[data-vcx-page="vcx-sign-in"]
- Added POST /api/portal/request-access endpoint: creates portal session, sends magic link email (or returns link in dev mode)
- Added sessionStorage persistence to vcx-packet-room.js: saves/restores auth token across page refresh
- Added sessionStorage persistence to vcx-matter-status.js: saves/restores matter token across page refresh

### Error Handling Improvements
- vcx-intake-api.js: differentiates 422 (validation), 429 (rate limited), 413 (file too large), 400 (bad request), 500 (server error), network error
- vcx-packet-room.js: differentiates expired session (401), invalid token (404), rate limited (429), network error; auto-clears session on 401
- vcx-matter-status.js: improved expired-link message with "Request new access link" button, portal link, session cleanup
- vcx-review-queue.js: added 15s fetch timeout (AbortController), retry on timeout, rate limit messaging, session expired detection

### Security Fixes
- review.py: admin token comparison changed from `!=` to `secrets.compare_digest()` (prevents timing attacks)
- portal.py: timezone handling fixed — uses `datetime.now(timezone.utc)` consistently, handles naive datetimes as UTC

### Documentation
- Created `vcx-api/.env.example`: all env vars with defaults and descriptions
- Created `docs/VCX_PHASE4A_QA.md`: full QA checklist, rollback notes, done definition
- Updated `docs/VCX_CHANGELOG.md`: Phase 4A section
- Updated `docs/VCX_ROADMAP_30_60_90.md`: checked off completed items
- Updated `docs/GUARDRAIL_DEVIATIONS.md`: sign-in page rewrite

### Files Changed (Phase 4A)

| # | File | Action |
|---|------|--------|
| 1 | vcx-api/app/services/upload_validator.py | Created |
| 2 | vcx-api/app/services/email_service.py | Created |
| 3 | vcx-api/app/rate_limit.py | Created |
| 4 | vcx-api/app/main.py | Modified (rate limiting + CORS) |
| 5 | vcx-api/requirements.txt | Modified (+slowapi) |
| 6 | vcx-api/.env.example | Rewritten (comprehensive) |
| 7 | vcx-api/app/routers/intakes.py | Modified (validation + email + rate limit) |
| 8 | vcx-api/app/routers/uploads.py | Modified (validation + rate limit) |
| 9 | vcx-api/app/routers/review.py | Modified (email + rate limit + secrets) |
| 10 | vcx-api/app/routers/contracts.py | Modified (validation + rate limit) |
| 11 | vcx-api/app/routers/recovery.py | Modified (rate limit) |
| 12 | vcx-api/app/routers/chat.py | Modified (rate limit) |
| 13 | vcx-api/app/routers/portal.py | Modified (rate limit + request-access + timezone) |
| 14 | assets/js/vcx-intake-api.js | Modified (error handling) |
| 15 | assets/js/vcx-packet-room.js | Modified (session persistence + errors) |
| 16 | assets/js/vcx-matter-status.js | Modified (session persistence + errors) |
| 17 | assets/js/vcx-review-queue.js | Modified (timeout + errors) |
| 18 | assets/js/vcx-sign-in.js | Created |
| 19 | assets/css/vcx-sign-in.css | Created |
| 20 | app/sign-in/index.html | Rewritten (stub → functional) |
| 21 | docs/VCX_CHANGELOG.md | Updated |
| 22 | docs/VCX_ROADMAP_30_60_90.md | Updated |
| 23 | docs/GUARDRAIL_DEVIATIONS.md | Updated |
| 24 | docs/VCX_PHASE4A_QA.md | Created |

### Files NOT modified
- index.html (homepage)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system CSS (vcx-tokens, vcx-base, vcx-layout, vcx-components, vcx-utilities)
- site.js (no changes needed for Phase 4A)
- structured-case-intake.html
- Existing app pages (legal-assistant, matter-status, review, vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room HTML)
- schema.sql (no schema changes needed)
- All Phase 1/2/3 backend services (contract_analyzer, recovery_engine, triage, checklist, magic_link)
- _references/ directory

---

## [Phase 3 — Product Build Step] - 2026-04-02

### Product 2: Contract Review Desk — fully functional
- Created `vcx-api/app/services/contract_analyzer.py`: pattern-based clause detection engine with 16 clause patterns (termination, indemnification, liability, auto-renewal, non-compete, non-solicitation, confidentiality, governing law, assignment, payment terms, force majeure, IP ownership, warranty, arbitration)
- Functions: `extract_text_from_bytes()`, `detect_clauses()`, `compute_risk_score()`, `generate_risk_summary()`
- Risk weighting: high_risk=25, caution=10, neutral=2, safe=0 (0-100 scale)
- Upgraded `vcx-api/app/routers/contracts.py`: all 3 endpoints now DB-wired
  - POST /api/contracts/upload: saves file, inserts into contract_reviews
  - POST /api/contracts/analyze: text extraction + clause detection + risk scoring + DB persistence
  - GET /api/contracts/{review_id}/report: full report with clauses, risk score, summary, disclaimer
- Upgraded `assets/js/vcx-contract-review.js`: DOM IDs aligned with HTML, risk score bar, clause cards with type/excerpt/risk/note/confidence, full report loading
- Updated `app/vcx-contract-review/index.html`: added .txt/.md to accepted file types with format note

### Product 3: Recovery Pilot Studio — fully functional
- Created `vcx-api/app/services/recovery_engine.py`: deterministic financial models
  - `compute_baseline()`: AR ratio, aging severity, net recovery, annual leakage
  - `compute_projections()`: 3 scenarios (conservative +10%, moderate +20%, aggressive +35%)
  - `generate_pilot_outline()`: 3-phase engagement plan with deliverables
  - `assemble_brief_data()`: full executive brief assembly
- Upgraded `vcx-api/app/routers/recovery.py`: all 4 endpoints now DB-wired
  - POST /api/recovery/pilot: creates pilot with initial baseline
  - PATCH /api/recovery/pilot/{id}: updates data, auto-computes analysis at step 4+
  - GET /api/recovery/pilot/{id}: returns full state with analysis data
  - POST /api/recovery/pilot/{id}/brief: generates complete executive brief
- Upgraded `app/vcx-recovery-pilot/index.html`: added wizard panels for steps 2-5 (Revenue Baseline, AR & Collections, Analysis display, Executive Brief display)
- Upgraded `assets/js/vcx-recovery-pilot.js`: full 5-step wizard with API integration, creates pilot at step 1, PATCHes at each step, renders analysis KPI grid + 3-scenario projections + executive brief with engagement phases

### Product 4: Packet Room / Client Portal — fully functional
- Upgraded `vcx-api/app/routers/portal.py`: all endpoints now DB-wired
  - GET/POST /api/portal/magic-link/{token}: verifies token against matters table, creates 24h portal session
  - POST /api/portal/lookup-email: email-based matter lookup (privacy-safe)
  - GET /api/portal/matters: lists all matters for authenticated contact
  - GET /api/portal/matters/{id}: matter overview
  - GET /api/portal/matters/{id}/packet: full packet with timeline, documents, checklist, comments, deliverables
  - POST /api/portal/matters/{id}/comments: client comment posting
  - GET /api/portal/matters/{id}/export: stub (Phase 4)
- Upgraded `assets/js/vcx-packet-room.js`: DOM IDs aligned with HTML, auth flow with token/email support, URL token auto-login, matter list rendering, full packet display (timeline, documents, checklist, comments with inline posting, deliverables)

### Files changed (Phase 3)
| # | File | Action |
|---|------|--------|
| 1 | vcx-api/app/services/contract_analyzer.py | Created |
| 2 | vcx-api/app/services/recovery_engine.py | Created |
| 3 | vcx-api/app/routers/contracts.py | Rewritten |
| 4 | vcx-api/app/routers/recovery.py | Rewritten |
| 5 | vcx-api/app/routers/portal.py | Rewritten |
| 6 | assets/js/vcx-contract-review.js | Rewritten |
| 7 | assets/js/vcx-recovery-pilot.js | Rewritten |
| 8 | assets/js/vcx-packet-room.js | Rewritten |
| 9 | app/vcx-recovery-pilot/index.html | Updated (steps 2-5) |
| 10 | app/vcx-contract-review/index.html | Updated (file types) |
| 11 | docs/VCX_CHANGELOG.md | Updated |
| 12 | docs/VCX_ROADMAP_30_60_90.md | Updated |

### Files NOT modified
- index.html (homepage)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css)
- Design system CSS (vcx-tokens, vcx-base, vcx-layout, vcx-components, vcx-utilities)
- structured-case-intake.html
- site.js
- Existing app pages (legal-assistant, matter-status, review, vcx-intake)
- schema.sql (no schema changes needed)
- All Phase 1/Phase 2 files remain untouched

---

## [Phase 2 — Safe Realignment] - 2026-04-02

### Migration to v284 clean baseline
- All Phase 1 product files migrated from vcx-work build workspace into clean v284 repo
- Branch: codex/phase2-safe-realign (from commit 25e958c)

### Shell Template Reconciliation
- All 7 app pages rebuilt with v284 canonical shell (vcx-header, full i18n en/ru/es, metric bar, lang switcher, dual clock chips, mobile nav, vcx-footer with 3-column footer-grid-extended)
- Root-relative asset paths enforced on all app page links (header nav, footer nav, images, scripts)
- Pages: legal-assistant, matter-status, review, vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room

### Modified — structured-case-intake.html (3 additive edits)
- Inserted `<div id="intakeResult">` after `</form>` (hidden by default, populated by API response)
- Added Legal Assistant link as 4th chip in existing self-service card
- Added `<script src="/assets/js/vcx-intake-api.js">` after existing scripts

### Modified — assets/js/site.js (guardrail deviation, documented)
- bindIntakeForm() (lines 364-401): delegates to VCX_IntakeAPI.submit() when loaded, else FormSubmit.co fallback
- Boundary markers added: `// VCX Phase 2: modified bindIntakeForm -- START/END`
- See docs/GUARDRAIL_DEVIATIONS.md for full justification

### Added — Integration cards on 3 service pages
- additional-services.html: 3 product cards (Contract Review Desk, Legal Assistant, Packet Room)
- revenue-recovery-workflow.html: 2 product cards (Recovery Pilot Studio, Intake OS)
- corporate-legal-file-control.html: 2 product cards (Contract Review Desk, Packet Room)
- All cards use existing .card.reveal pattern with VCX design token border colors
- Boundary markers: `<!-- VCX Phase 2: product integration cards -- START/END -->`

### Added — New files
- .gitignore: vcx-api exclusions (data/, uploads/, .env, __pycache__, *.db)
- docs/GUARDRAIL_DEVIATIONS.md: formal deviation log
- _codex_phase2_preflight.md: preflight audit document

### Files NOT modified
- index.html (homepage)
- Top navigation structure
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system (vcx-tokens.css, vcx-base.css, vcx-layout.css, vcx-components.css, vcx-utilities.css)
- Existing app pages (contract-intelligence, dealer-contract-check, immigration-forms, private-lookup, sign-in)
- _references/ directory

---

## [Phase 1] - 2026-04-02

### Added — VCX Intake OS (Product 1)
- FastAPI backend at vcx-api/ with 9-table SQLite schema
- POST /api/intakes — full intake pipeline (org → contact → matter → triage → checklist → magic link)
- POST /api/uploads/{matter_id} — document upload with Bearer token auth
- GET /api/matters/{matter_id} — client status page data
- PATCH /api/matters/{matter_id}/checklist/{cid} — interactive checklist toggle
- GET /api/review/queue — admin triage queue with filter/pagination
- PATCH /api/review/matters/{matter_id} — admin status update with audit trail
- Client status page at /app/matter-status/
- Admin review queue at /app/review/
- Intake API client (assets/js/vcx-intake-api.js)

### Added — Legal Assistant (Product 5)
- POST /api/legal-chat/message — knowledge-backed chat with 4 topics
- POST /api/legal-chat/escalate — lead capture
- Legal assistant frontend at /app/legal-assistant/
- Knowledge base: contracts, immigration, auto deal review, FL official sources

### Added — Product Scaffolds (Products 2-4)
- Contract Review Desk: app/vcx-contract-review/, vcx-api/app/routers/contracts.py
- Recovery Pilot Studio: app/vcx-recovery-pilot/, vcx-api/app/routers/recovery.py
- Packet Room / Client Portal: app/vcx-packet-room/, vcx-api/app/routers/portal.py
- VCX Intake landing page: app/vcx-intake/
- All new tables in schema.sql for Products 2-4

### Added — Documentation
- docs/VCX_IMPLEMENTATION_PLAN.md
- docs/VCX_API_MAP.md
- docs/VCX_DATA_MODEL.md
- docs/VCX_ROADMAP_30_60_90.md
- docs/VCX_CHANGELOG.md
- AGENTS.md (guardrails)
- _codex_phase0.md (architecture audit)

### Modified (Minimal)
- assets/js/site.js: bindIntakeForm() now delegates to VCX_IntakeAPI.submit() with FormSubmit.co fallback
- structured-case-intake.html: Added intakeResult div, legal-assistant link, vcx-intake-api.js script
- .gitignore: Added vcx-api exclusions

## [Phase 1 — Pass 2] - 2026-04-02

### Added — Integration Cards (safe entry points on existing pages)
- additional-services.html: Inserted 3 product cards (Contract Review Desk, Legal Assistant, Packet Room) between the advisory card and fit-grid section. Uses existing .card.reveal pattern with colored top borders. No nav or header/footer changes.
- revenue-recovery-workflow.html: Inserted 2 product cards (Recovery Pilot Studio, Intake OS) before the industry-grid section. Same card pattern, additive insertion.
- corporate-legal-file-control.html: Inserted 2 product cards (Contract Review Desk, Packet Room) before the industry-grid section. Same card pattern, additive insertion.

### Files Changed in Pass 2
| File | Change Type | Description |
|------|------------|-------------|
| additional-services.html | Additive insert | 3 product cards between advisory CTA and fit-grid |
| revenue-recovery-workflow.html | Additive insert | 2 product cards before industry-grid |
| corporate-legal-file-control.html | Additive insert | 2 product cards before industry-grid |
| docs/VCX_CHANGELOG.md | Updated | Added Pass 2 entries |

### Not Modified (confirmed)
- index.html (homepage)
- Top navigation structure
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css)
- Existing app pages (contract-intelligence, dealer-contract-check, immigration-forms, private-lookup)
