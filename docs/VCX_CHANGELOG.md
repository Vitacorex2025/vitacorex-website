# VCX Changelog

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
