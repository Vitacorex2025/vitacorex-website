# VCX Phase 0 — Architecture Audit & Safe Implementation Plan

> Generated 2026-04-02 | Branch: `codex/vcx-safe-integration`
> Read-only audit of existing site + `_references/` repositories

---

## 1. Current Architecture Summary

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (custom properties), Vanilla JS (ES6+) — no framework |
| CSS Architecture | Design-system-driven: vcx-tokens → vcx-base → vcx-layout → vcx-components → vcx-utilities → styles → ui-shell → premium-fixes |
| Backend | Python 3.14, FastAPI, SQLite (WAL mode, foreign keys) |
| Forms | Hybrid: FormSubmit.co (legacy) + custom `/api/intakes` (new) |
| Auth | Magic-link tokens (client), X-Admin-Token header (admin) |
| i18n | JSON dictionary (en/ru), data-tx/data-common attribute binding |
| File Storage | Local filesystem `vcx-api/uploads/{matter_id}/` |

### Design System Tokens (vcx-tokens.css, 40+ variables)
- **Backgrounds:** `--bg-canvas: #F6F2EA` (warm parchment), `--bg-surface: #FBF8F3`, `--bg-elevated: #FFFFFF`, `--bg-ink: #0F1B2D`
- **Text:** `--ink-strong: #0F1B2D`, `--ink-body: #243548`, `--ink-muted: #5E6C7B`
- **Brand:** `--brand-primary: #173A63` (navy), `--brand-secondary: #58707E`, `--accent-gold: #B08A57`
- **Status:** `--status-success: #2F6B57`, `--status-warning: #9A6A20`, `--status-danger: #8B4348`, `--status-info: #355E8A`
- **Typography:** Georgia/serif for display, system stack for body
- **Responsive breakpoints:** 640px, 768px, 900px (header flip), 1024px

### File Inventory
| Category | Count | Total Size |
|----------|-------|-----------|
| HTML pages (marketing) | 20 | ~240 KB |
| HTML redirect stubs | 7 | ~3 KB |
| HTML app pages | 8 | ~60 KB |
| CSS files | 13 | ~274 KB |
| JS files | 11 | ~232 KB |
| Backend Python files | 21 | ~28 KB |
| Knowledge markdown | 4 | ~8 KB |
| Images | 3 | ~160 KB |

### Shell Pattern (Header/Footer)
Every page loads the same visual shell:
```
<header class="vcx-header"> (sticky, glass-morphism, z-index:120)
  ├── vcx-header-desktop (brand + nav + time chips)
  │   ├── vcx-brand (logo + tagline)
  │   ├── vcx-header-meta (VCX Time + Local Time)
  │   └── vcx-main-nav (8 items)
  └── vcx-header-mobile (brand + hamburger menu)
      └── vcx-mobile-nav (same 8 items, hidden toggle)

<footer class="footer">
  ├── VitaCoreX LLC | Established 2025
  ├── Phone: (888) 794-8292 | EIN: 41-4399148
  ├── Disclaimer (not a law firm)
  └── Copyright 2026
```

### Reusable Component Library (vcx-components.css)
- **Buttons:** `.vcx-btn`, `--primary`, `--secondary`, `--ghost`, `--gold` (44px min-height)
- **Cards:** `.vcx-card`, `--surface`, `--raised`, `--dark`, `--accent` (gold top border)
- **Forms:** `.vcx-label`, `.vcx-input`, `.vcx-select`, `.vcx-textarea`, `.vcx-file-input`
- **Tables:** `.vcx-table-wrap`, `.vcx-table`
- **Badges:** `.vcx-badge--success/warning/danger/info/muted`
- **Alerts:** `.vcx-alert--success/warning/danger/info`
- **Eyebrow:** `.eyebrow` (0.6875rem, uppercase, letter-spacing)

### Existing App Pages (8 SPAs)
| Route | Tool | Status |
|-------|------|--------|
| `/app/contract-intelligence/` | Contract Scanner | Working (client-side JS) |
| `/app/dealer-contract-check/` | Auto Deal Check | Working (client-side JS) |
| `/app/immigration-forms/` | Immigration Helper | Working (client-side JS) |
| `/app/private-lookup/` | FL Official Source Locator | Working (client-side JS) |
| `/app/legal-assistant/` | Legal Chat Assistant | **NEW** — wired to vcx-api |
| `/app/matter-status/` | Client Status Dashboard | **NEW** — wired to vcx-api |
| `/app/review/` | Admin Review Queue | **NEW** — wired to vcx-api |
| `/app/sign-in/` | Auth Portal | Stub (redirect only) |

---

## 2. Existing Backend (vcx-api/) — What's Already Built

### Database Schema (9 tables)
```
sessions ──── messages          (Chat)
              leads             (Escalation)

organizations ── contacts ── matters ── documents     (Intake OS)
                                     ── checklists
                                     ── status_events
                                     ── deliverables
```

### API Endpoints (8 live, tested)
| Method | Path | Auth | Product |
|--------|------|------|---------|
| POST | `/api/intakes` | None | Intake OS |
| POST | `/api/uploads/{matter_id}` | Bearer (magic_token) | Intake OS |
| GET | `/api/matters/{matter_id}` | Bearer (magic_token) | Intake OS |
| PATCH | `/api/matters/{matter_id}/checklist/{cid}` | Bearer (magic_token) | Intake OS |
| GET | `/api/review/queue` | X-Admin-Token | Intake OS |
| PATCH | `/api/review/matters/{matter_id}` | X-Admin-Token | Intake OS |
| POST | `/api/legal-chat/message` | None | Legal Assistant |
| POST | `/api/legal-chat/escalate` | None | Legal Assistant |
| GET | `/healthz` | None | Infrastructure |

### Service Layer
| Service | Functions | Purpose |
|---------|-----------|---------|
| `triage.py` | `compute_triage_score()`, `generate_matter_id()`, `determine_routing()` | Score 0-100, sequential IDs, category routing |
| `checklist.py` | `generate_initial_checklist()` | Service-specific checklists for 6 types |
| `magic_link.py` | `generate_token()`, `build_magic_link()`, `validate_token()` | 48-byte tokens, constant-time comparison |
| `knowledge.py` | `infer_topic()`, `retrieve()`, `detect_out_of_scope()` | Keyword topic detection, chunk retrieval |
| `policy.py` | `answer_message()` | Topic routing, disclaimer injection, escalation |

---

## 3. Reference Repositories — Extractable Patterns

### `_references/legal-assistant-starter/`
- **Used for:** Chat backend (already ported to vcx-api)
- **Extractable:** Session management, lead capture, policy engine, knowledge base chunking
- **Status:** Fully consumed

### `_references/claw-code-main/` (Rust)
- **Extractable:** OAuth token management pattern, plugin/hook pipeline, tool registry
- **Useful for:** Future auth layer, plugin architecture for Contract Review Desk

### `_references/everything-claude-code-main/` (= `strong-base/`)
- **Extractable:** 150+ skills including `contract-analysis`, `legal-workflows`, `recovery-pilot-patterns`, `api-design`, `backend-patterns`
- **Useful for:** Skill templates, hook pipelines, multi-agent orchestration patterns

---

## 4. Files That Should NOT Be Touched (Unless Unavoidable)

### Tier 1 — DO NOT MODIFY (global shell, 5 files)
| File | Size | Risk | Reason |
|------|------|------|--------|
| `assets/css/styles.css` | 60 KB | Critical | Base page styles, card system, reveal animations, form styling for all 20+ pages |
| `assets/css/ui-shell.css` | 95 KB | Critical | Header/footer glass-morphism, mobile nav, sticky positioning, all page shells |
| `assets/js/ui-shell.js` | 17 KB | Critical | Mobile menu, clock ticks, scroll spy, header state management |
| `assets/js/premium-fixes.js` | 0.4 KB | Critical | Polyfills for all pages |
| `assets/css/premium-fixes.css` | 29 KB | Critical | Brand consistency overrides across all pages |

### Tier 2 — MINIMAL DIFF ONLY (already modified once, documented below)
| File | Size | Risk | Current Diff |
|------|------|------|-------------|
| `assets/js/site.js` | 88 KB | High | `bindIntakeForm()` (lines 364-397): Changed submit handler to delegate to `window.VCX_IntakeAPI.submit(form)` when loaded, fallback to FormSubmit.co. Justified: required to wire intake form to own API without breaking existing flow. |
| `structured-case-intake.html` | ~18 KB | High | 3 additive edits: (1) `<div id="intakeResult">` after form, (2) legal-assistant link, (3) `<script src="vcx-intake-api.js">`. All additive, no deletions. |
| `.gitignore` | 0.2 KB | Low | Added vcx-api exclusions |

### Tier 3 — DO NOT TOUCH (marketing pages, 20 files)
All pages in the root directory (`index.html`, `about.html`, `contact.html`, `careers.html`, `resources.html`, `additional-services.html`, `corporate-legal-file-control.html`, `revenue-recovery-workflow.html`, `solutions.html`, `industries.html`, `industry-*.html`, policy pages, `thank-you.html`, redirect stubs).

### Tier 4 — DO NOT TOUCH (reference repos)
Everything under `_references/` — read-only reference material.

---

## 5. Frontend Route Map

### Existing Routes (preserve as-is)
```
/                                    → index.html (Homepage)
/structured-case-intake.html         → Intake form (modified to wire to API)
/contact.html                        → Contact/consultation routing
/corporate-legal-file-control.html   → Service detail
/revenue-recovery-workflow.html      → Service detail
/resources.html                      → Executive briefs
/additional-services.html            → Individual services
/careers.html                        → Job listings
/about.html                          → Company info
/solutions.html                      → Solutions overview
/industries.html                     → Industry solutions
/industry-*.html                     → 4 industry verticals
/cookie-policy.html                  → Legal
/privacy-policy.html                 → Legal
/terms-of-use.html                   → Legal
/thank-you.html                      → Post-submit confirmation
/app/contract-intelligence/          → Contract Scanner (existing)
/app/dealer-contract-check/          → Auto Deal Check (existing)
/app/immigration-forms/              → Immigration Helper (existing)
/app/private-lookup/                 → FL Source Locator (existing)
/app/sign-in/                        → Auth stub (existing)
```

### New Routes (built, Product 1 + Product 5)
```
/app/matter-status/?matter=X&token=Y → Client status dashboard
/app/review/                         → Admin review queue
/app/legal-assistant/                → Public legal chat
```

### Proposed New Routes (Products 2-4)
```
/app/vcx-contract-review/           → Contract Review Desk (Product 2)
/app/vcx-recovery-pilot/            → Recovery Pilot Studio (Product 3)
/app/vcx-packet-room/               → Client Portal (Product 4)
```

---

## 6. Backend API Map

### Built and Tested (Product 1 + 5)
```
POST   /api/intakes                             ← Intake OS (Product 1)
POST   /api/uploads/{matter_id}                 ← Intake OS
GET    /api/matters/{matter_id}                  ← Intake OS
PATCH  /api/matters/{matter_id}/checklist/{cid}  ← Intake OS
GET    /api/review/queue                         ← Intake OS (admin)
PATCH  /api/review/matters/{matter_id}           ← Intake OS (admin)
POST   /api/legal-chat/message                   ← Legal Assistant (Product 5)
POST   /api/legal-chat/escalate                  ← Legal Assistant (Product 5)
GET    /healthz                                  ← Infrastructure
```

### Proposed Endpoints (Products 2-4)
```
# Product 2: Contract Review Desk
POST   /api/contracts/upload          ← Upload contract document
POST   /api/contracts/analyze         ← Trigger clause extraction + risk scoring
GET    /api/contracts/{id}/report     ← Get analysis report
POST   /api/contracts/{id}/memo       ← Generate reviewed memo (premium)
GET    /api/contracts/{id}/status     ← Check analysis progress

# Product 3: Recovery Pilot Studio
POST   /api/recovery/pilot            ← Create new pilot assessment
PATCH  /api/recovery/pilot/{id}       ← Update pilot data (multi-step wizard)
GET    /api/recovery/pilot/{id}       ← Get pilot state + results
POST   /api/recovery/pilot/{id}/brief ← Generate executive brief PDF
GET    /api/recovery/pilot/{id}/kpis  ← Get KPI baseline data

# Product 4: Packet Room / Client Portal
POST   /api/portal/magic-link         ← Generate/refresh portal access
GET    /api/portal/matters            ← List client's matters (auth required)
GET    /api/portal/matters/{id}/packet← Get full packet (chronology + docs + deliverables)
POST   /api/portal/matters/{id}/comments ← Add client comments
GET    /api/portal/matters/{id}/export   ← Export final packet (PDF/ZIP)
```

---

## 7. Data Model Proposal

### Existing Tables (keep as-is)
```sql
-- Chat (3 tables): sessions, messages, leads
-- Intake OS (6 tables): organizations, contacts, matters, documents, checklists, status_events, deliverables
```

### New Tables for Product 2: Contract Review Desk
```sql
CREATE TABLE IF NOT EXISTS contract_reviews (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT REFERENCES matters(id),       -- optional link to intake matter
    contact_id      TEXT REFERENCES contacts(id),
    document_id     TEXT REFERENCES documents(id),     -- uploaded contract
    status          TEXT NOT NULL DEFAULT 'uploaded',   -- uploaded|extracting|reviewed|memo_ready
    extraction_data TEXT,                               -- JSON: clauses, parties, dates, terms
    risk_score      INTEGER,                            -- 0-100
    risk_summary    TEXT,
    review_tier     TEXT DEFAULT 'free',                -- free|paid|premium
    memo_path       TEXT,                               -- generated memo file path
    created_at      TEXT DEFAULT (datetime('now')),
    completed_at    TEXT
);

CREATE TABLE IF NOT EXISTS contract_clauses (
    id              TEXT PRIMARY KEY,
    review_id       TEXT NOT NULL REFERENCES contract_reviews(id),
    clause_type     TEXT NOT NULL,                      -- termination, indemnity, liability, etc.
    text_excerpt    TEXT NOT NULL,
    confidence      REAL,                               -- 0.0-1.0
    risk_level      TEXT DEFAULT 'neutral',             -- safe|neutral|caution|high_risk
    note            TEXT,
    sort_order      INTEGER DEFAULT 0
);
```

### New Tables for Product 3: Recovery Pilot Studio
```sql
CREATE TABLE IF NOT EXISTS recovery_pilots (
    id              TEXT PRIMARY KEY,
    contact_id      TEXT REFERENCES contacts(id),
    org_id          TEXT REFERENCES organizations(id),
    status          TEXT NOT NULL DEFAULT 'draft',      -- draft|baseline|analysis|brief_ready|closed
    wizard_step     INTEGER DEFAULT 1,                  -- 1-5 wizard steps
    baseline_data   TEXT,                               -- JSON: revenue, AR, aging, recovery rate
    analysis_data   TEXT,                               -- JSON: computed KPIs, projections
    brief_path      TEXT,                               -- generated executive brief PDF
    pilot_outline   TEXT,                               -- JSON: recommended pilot structure
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);
```

### New Tables for Product 4: Packet Room / Client Portal
```sql
CREATE TABLE IF NOT EXISTS portal_sessions (
    id              TEXT PRIMARY KEY,
    contact_id      TEXT NOT NULL REFERENCES contacts(id),
    magic_token     TEXT NOT NULL UNIQUE,
    expires_at      TEXT NOT NULL,
    created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS matter_comments (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    author_type     TEXT NOT NULL DEFAULT 'client',     -- client|admin
    author_name     TEXT,
    content         TEXT NOT NULL,
    created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS packet_exports (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    format          TEXT NOT NULL DEFAULT 'pdf',        -- pdf|zip
    file_path       TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',    -- pending|generating|ready|expired
    created_at      TEXT DEFAULT (datetime('now')),
    ready_at        TEXT
);
```

---

## 8. Phased Rollout Plan

### Phase 0 — Audit & Plan (THIS DOCUMENT)
- [x] Full site architecture audit
- [x] Reference repository analysis
- [x] Risk assessment of existing files
- [x] API endpoint map
- [x] Data model proposal
- [x] AGENTS.md guardrails

### Phase 1 — VCX Intake OS (COMPLETE)
- [x] Backend: FastAPI + SQLite (9 tables, 8 endpoints)
- [x] Frontend: matter-status page, review queue, intake-api wiring
- [x] Services: triage scoring, checklist generation, magic-link auth
- [x] Legal chat: knowledge base, policy engine, chat + escalation endpoints
- [x] Legal assistant frontend page
- [ ] **Remaining:** Email notifications on intake, status change alerts

### Phase 2 — VCX Contract Review Desk
**Goal:** Move contract analysis to server-side; add clause extraction, risk scoring, memo generation.
```
New files:
  app/vcx-contract-review/index.html          ← Upload + results page
  assets/css/vcx-contract-review.css           ← Scoped styles
  assets/js/vcx-contract-review.js             ← Upload flow, results rendering
  vcx-api/app/routers/contracts.py             ← /api/contracts/* endpoints
  vcx-api/app/services/contract_analyzer.py    ← Extraction + scoring logic
  vcx-api/app/models/contract.py               ← Pydantic models

Existing file changes:
  vcx-api/app/main.py                          ← Mount contracts router (1-line add)
  vcx-api/app/schema.sql                       ← Add contract_reviews + contract_clauses tables
  structured-case-intake.html                   ← Add link to contract review (1-line add, optional)
```
**Approach:** Keep existing `/app/contract-intelligence/` as the free client-side scanner. New `/app/vcx-contract-review/` is the server-side premium tier. Monetization ladder: free pre-check (existing) → paid analysis (new) → premium memo (new).

### Phase 3 — VCX Recovery Pilot Studio
**Goal:** Multi-step B2B diagnostic wizard with executive brief + KPI baseline generation.
```
New files:
  app/vcx-recovery-pilot/index.html            ← Multi-step wizard page
  assets/css/vcx-recovery-pilot.css            ← Scoped styles
  assets/js/vcx-recovery-pilot.js              ← Wizard state, step navigation, results
  vcx-api/app/routers/recovery.py              ← /api/recovery/* endpoints
  vcx-api/app/services/recovery_engine.py      ← Deterministic models, projections
  vcx-api/app/services/pdf_generator.py        ← Executive brief PDF generation
  vcx-api/app/models/recovery.py               ← Pydantic models

Existing file changes:
  vcx-api/app/main.py                          ← Mount recovery router (1-line add)
  vcx-api/app/schema.sql                       ← Add recovery_pilots table
  vcx-api/requirements.txt                     ← Add reportlab or weasyprint for PDF
```
**Approach:** Deterministic scoring models (no LLM). Template-based PDF generation. Wizard saves state per-step so user can resume.

### Phase 4 — VCX Packet Room / Client Portal
**Goal:** Secure authenticated portal with matter timeline, comments, document vault, packet export.
```
New files:
  app/vcx-packet-room/index.html               ← Portal dashboard page
  assets/css/vcx-packet-room.css               ← Scoped styles
  assets/js/vcx-packet-room.js                 ← Auth gate, matter list, timeline, comments
  vcx-api/app/routers/portal.py                ← /api/portal/* endpoints
  vcx-api/app/services/packet_builder.py       ← Chronology + packet export
  vcx-api/app/services/portal_auth.py          ← Token refresh, session management
  vcx-api/app/models/portal.py                 ← Pydantic models

Existing file changes:
  vcx-api/app/main.py                          ← Mount portal router (1-line add)
  vcx-api/app/schema.sql                       ← Add portal_sessions, matter_comments, packet_exports
  app/sign-in/index.html                       ← Wire to actual auth flow (currently redirect stub)
```
**Approach:** Extends magic-link pattern from Phase 1. Portal sessions have expiration. Client can see all their matters, add comments, download deliverables. Admin can push deliverables and export final packets.

### Phase 5 — Hardening & Integration
- Email notifications (intake received, status change, deliverable ready)
- Payment integration hooks (Stripe or invoice tracking)
- Analytics dashboard for admin (matter volume, triage distribution, response time)
- Rate limiting on public endpoints
- HTTPS enforcement and security headers
- Backup/restore for SQLite database

---

## 9. Diff Budget Per Phase

| Phase | New Files | Modified Files | Lines Added | Risk |
|-------|-----------|---------------|-------------|------|
| 1 (Intake OS) | 37 | 3 | ~2,200 | Low — additive, tested |
| 2 (Contract Review) | 6 | 2 | ~800 | Low — new namespace |
| 3 (Recovery Pilot) | 7 | 2 | ~1,000 | Low — new namespace |
| 4 (Packet Room) | 7 | 3 | ~1,200 | Medium — touches sign-in |
| 5 (Hardening) | 3 | 2 | ~400 | Low — config only |

**Total modification to global/shared files across all 5 phases: 5 files, minimal diffs.**

---

## 10. Assumptions & Decisions

1. **SQLite is sufficient for MVP.** Single-server deployment. Migration to PostgreSQL deferred until >1000 concurrent matters.
2. **No LLM API calls in MVP.** Contract analysis uses pattern-based extraction (regex + heuristics). Knowledge base uses keyword retrieval. LLM integration is Phase 5+ upgrade.
3. **Magic-link auth is sufficient for client portal.** No passwords. Token-based access. Session expiration enforced. RBAC deferred.
4. **Human review stays in the loop.** Triage auto-scores but does not auto-assign. Contract analysis flags but does not conclude. Recovery projections are estimates, not advice.
5. **FormSubmit.co fallback preserved.** If VCX API is unreachable, intake form falls back to email submission. No single point of failure.
6. **File storage is local.** S3/cloud storage deferred. Uploads stored in `vcx-api/uploads/`. Gitignored.
7. **PDF generation uses server-side Python.** WeasyPrint or ReportLab for executive briefs and packet exports. No client-side PDF.
8. **All new CSS/JS is namespaced.** `vcx-*.css`, `vcx-*.js`. No pollution of global styles or scripts.
9. **All new pages reuse the existing shell.** Same header, footer, time chips, mobile nav, i18n. Copy the boilerplate, don't modify the source.
10. **Existing app pages are not modified.** Contract-intelligence, dealer-contract-check, immigration-forms, private-lookup remain as-is. New product pages are separate routes.
