# VCX Product Completeness Audit (v3)

> Generated 2026-04-03 | Fresh truth-based audit against intended product directions
> Method: Full code read of every frontend, backend, and service file per product.
> Every claim verified against actual source. Supersedes v2.

---

## Scorecard

| # | Product | Status | Spec Score | Key Gap |
|---|---------|--------|------------|---------|
| 1 | VCX Intake OS | **COMPLETE** | 5/5 | Orphaned CSS only |
| 2 | VCX Contract Review Desk | **PARTIAL** | 6/10 present, 3 partial, 1 missing | 3 backend features not rendered in frontend |
| 3 | VCX Recovery Pilot Studio | **COMPLETE** | 4/4 | No PDF export for brief (HTML only) |
| 4 | VCX Packet Room / Client Portal | **PARTIAL** | 4/9 present, 2 partial, 3 missing | No upload, no chronology, no export |
| 5 | Public Legal Assistant | **COMPLETE** | 4/4 | None |

---

## Product 1: VCX Intake OS

**Classification: COMPLETE**

### Spec Items

| Target | Status | Evidence |
|--------|--------|----------|
| Current pages remain acquisition layer | PRESENT | `app/vcx-intake/index.html` is a 3-card routing page. `structured-case-intake.html` has FormSubmit.co fallback + VCX_IntakeAPI delegation in site.js. |
| Real /api/intakes, /api/uploads, /api/matters flow | PRESENT | `POST /api/intakes` (intakes.py:35), `POST /api/uploads/{id}` (uploads.py:20), `GET /api/matters/{id}` + `PATCH checklist` (matters.py:14,62). Frontend calls confirmed in vcx-intake-api.js:32, vcx-matter-status.js:53,199,224. |
| All 7 required DB tables | PRESENT | schema.sql: organizations (35), contacts (48), matters (63), documents (85), checklists (99), status_events (112), deliverables (125). All with proper FKs and indexes. |
| Submit returns matter ID, checklist, status, magic link | PRESENT | IntakeResponse returns `{ok, matter_id, magic_link, status, triage_score, checklist, next_step}` (intakes.py:190-198). Frontend renders all fields (vcx-intake-api.js:112-148). |
| Human review queue | PRESENT | `GET /api/review/queue` (review.py:25) with X-Admin-Token auth, status filters, pagination, triage_score sort. `PATCH /api/review/matters/{id}` (review.py:79) with audit trail + email notification. Frontend at app/review/ with admin gate, filter dropdown, matter detail drill-down. |

### Proving Files
- `vcx-api/app/routers/intakes.py` (202 lines)
- `vcx-api/app/routers/uploads.py` (78 lines)
- `vcx-api/app/routers/matters.py` (94 lines)
- `vcx-api/app/routers/review.py` (155 lines)
- `vcx-api/app/schema.sql` (7 tables at lines 35-135)
- `assets/js/vcx-intake-api.js` (218 lines)
- `assets/js/vcx-matter-status.js`
- `assets/js/vcx-review-queue.js`
- `app/vcx-intake/index.html`, `app/matter-status/index.html`, `app/review/index.html`

### Minor Issue
`assets/css/vcx-intake.css` defines `.vi-grid`, `.vi-card`, `.vi-pipeline`, `.vi-step` classes not used by any HTML. Dead CSS only.

---

## Product 2: VCX Contract Review Desk

**Classification: PARTIAL**

### Spec Items

| # | Target | Status | Evidence |
|---|--------|--------|----------|
| 1 | Current UX preserved | PRESENT | Dual-mode tabs (Analyze/Generate), 3 tier cards, drag-drop upload zone, type picker, questionnaire form, DOCX download. |
| 2 | Server-side extraction / OCR | PRESENT | `extract_text_from_bytes()` (analyzer.py:247-322) handles PDF (pdfplumber), DOCX (python-docx), TXT. No true OCR for image-based PDFs (pdfplumber extracts text layers only). |
| 3 | Clause tagging | PRESENT | 16 regex patterns (analyzer.py:23-122). Each produces clause_type, excerpt, risk_level, note. `detect_clauses()` at lines 327-366. |
| 4 | Confidence scoring | PRESENT | Per-clause float 0.6-0.9 (analyzer.py:350). Rendered as percentage in JS (vcx-contract-review.js:191). |
| 5 | Issue buckets | **PARTIAL** | Backend: `generate_issue_buckets()` (analyzer.py:511-580) creates 3 severity tiers. API returns `issue_buckets` (contracts.py:248-256). **Frontend: ZERO references. renderResults() ignores this field.** |
| 6 | Preliminary risk memo | PRESENT | `generate_risk_summary()` (analyzer.py:388-414) produces structured text. Rendered in JS (vcx-contract-review.js:150-154) + risk_score bar (lines 136-147). |
| 7 | Missing protections | **PARTIAL** | Backend: `detect_missing_protections()` (analyzer.py:419-471) compares found vs expected per contract type. API returns `missing_protections` (contracts.py:242-244). **Frontend: ZERO references. renderResults() ignores this field.** |
| 8 | Suggested questions for counsel | **PARTIAL** | Backend: `generate_suggested_questions()` (analyzer.py:476-506) produces ~30+ questions from `_QUESTIONS_FOR_FOUND` (lines 164-226) and `_QUESTIONS_FOR_MISSING` (lines 228-242). API returns `suggested_questions` (contracts.py:245-247). **Frontend: ZERO references. renderResults() ignores this field.** |
| 9 | Optional paid advisor review path | **MISSING** | 3 tier cards displayed as information only (index.html:84-103). `review_tier='free'` written to DB (contracts.py:82,207) but never read or acted upon. No upgrade endpoint, no payment integration, no CTA buttons on cards. |
| 10 | No fake legal-AI positioning | PRESENT | Module docstring: "NOT LLM. Pattern-based, rule-driven." (analyzer.py:1-12). Frontend disclaimer at JS:207. HTML disclaimers at index.html:165-166. Code uses only regex (no GPT/Claude/LLM API imports). |

### Critical Frontend Gap

`vcx-contract-review.js` `renderResults()` (lines 117-216) renders:
- `data.status`, `data.filename`, `data.review_id` -- YES
- `data.risk_score`, `data.risk_summary` -- YES
- `data.clauses[]` (type, risk_level, excerpt, note, confidence) -- YES

**Completely ignored** (data flows to client, silently discarded):
- `data.issue_buckets` -- IGNORED
- `data.missing_protections` -- IGNORED
- `data.suggested_questions` -- IGNORED
- `data.extraction_method`, `data.word_count`, `data.questionnaire`, `data.disclaimer` -- IGNORED

### Proving Files
- `vcx-api/app/services/contract_analyzer.py` (580 lines)
- `vcx-api/app/routers/contracts.py` (421 lines)
- `vcx-api/app/models/contract.py`
- `assets/js/vcx-contract-review.js` (~520 lines) -- **renderResults() is the gap**
- `app/vcx-contract-review/index.html`

---

## Product 3: VCX Recovery Pilot Studio

**Classification: COMPLETE**

### Spec Items

| Target | Status | Evidence |
|--------|--------|----------|
| Multi-step diagnostic wizard | PRESENT | 5-step wizard: Company Profile (4 fields), Revenue Baseline (3 fields), AR & Collections (3 fields), Analysis (computed), Executive Brief (rendered). Total: 10 input fields. Step validation, navigation, indicator bar. Backend: POST create, PATCH update, GET detail, POST brief (recovery.py:31-164). |
| KPI baseline | PRESENT | 9 derived KPIs from `compute_baseline()` (recovery_engine.py:14-54): AR ratio, aging severity, DSO, recovery rate, collection cost, net recovery, annual leakage, monthly leakage, monthly new AR. Rendered as KPI card grid (vcx-recovery-pilot.js:250-261). Plus 3-scenario projections with 7 per-scenario metrics. |
| Executive brief / pilot outline | PRESENT | 3-phase engagement plan: Assessment & Quick Wins (weeks 1-3), Process Implementation (weeks 4-8), Optimization & Handoff (weeks 9-12). Each with focus area + 3 deliverables. Priority triage (immediate/high/standard), duration (8 or 12 weeks), target KPIs. Rendered as HTML (recovery_engine.py:105-184, JS:295-348). **No PDF export** (brief_path column unused). |
| Quantified B2B entry point | PRESENT | 3 scenarios (conservative/moderate/aggressive) with dollar projections: incremental_recovery, net_annual_benefit, dso_cash_freed, total_first_year_impact (recovery_engine.py:59-100). All rendered with $ formatting. Brief includes projected Year 1 benefit. |

### Proving Files
- `app/vcx-recovery-pilot/index.html` (237 lines)
- `assets/js/vcx-recovery-pilot.js` (425 lines)
- `vcx-api/app/routers/recovery.py` (165 lines)
- `vcx-api/app/services/recovery_engine.py` (196 lines)
- `vcx-api/app/schema.sql` -- recovery_pilots table (lines 181-194)

### Minor Issues
- `brief_path` column never populated (no PDF generation)
- `contact_id`/`org_id` FKs on recovery_pilots never set by API
- `vcx-recovery-pilot.css` defines orphaned `.rp-*` classes (HTML uses inline styles)

---

## Product 4: VCX Packet Room / Client Portal

**Classification: PARTIAL**

### Spec Items

| # | Target | Status | Evidence |
|---|--------|--------|----------|
| 1 | Real sign-in / magic-link | PRESENT | Token verification `GET /api/portal/magic-link/{token}` (portal.py:90-153). Email lookup `POST /lookup-email` (portal.py:165-236). URL `?token=` auto-detect (JS:92-101). Session in sessionStorage with 24h TTL. Rate limited 5/min. |
| 2 | Secure upload | **MISSING** | Zero `<input type="file">` in index.html. Zero FormData/upload functions in JS. Zero upload endpoints in portal.py. Documents section is read-only. |
| 3 | Matter timeline | **PARTIAL** | Rendered read-only from status_events (JS:359-376, portal.py:335-340). No UI to create entries. No POST endpoint for timeline. |
| 4 | Checklist missing items | PRESENT | Rendered with check/uncheck icons (JS:396-410). Incomplete items clearly visible. Read-only by design for client portal. |
| 5 | Chronology builder | **MISSING** | Not referenced in any file. No UI, no endpoint, no concept of chronology beyond status events. |
| 6 | Comments / clarification requests | PRESENT | Bidirectional: client posts via `POST /api/portal/matters/{id}/comments` (portal.py:436-484). Textarea + submit button in JS (lines 412-519). Analyst comments visible. |
| 7 | Deliverables vault | **PARTIAL** | Listed with status badges (delivered/in_progress/pending) at JS:450-469. **No download links.** No download endpoint. `file_path` exists in DB but not exposed in API response. |
| 8 | Client-visible status | PRESENT | Color-coded badges in matter list (JS:269-283) and detail view (JS:348-357). |
| 9 | Final packet export | **MISSING** | Endpoint returns HTTP 501 "not yet available" (portal.py:487-496). Schema table `packet_exports` defined but never written to. No UI button. |

### Summary: 4 PRESENT, 2 PARTIAL, 3 MISSING

### Proving Files
- `app/vcx-packet-room/index.html`
- `assets/js/vcx-packet-room.js`
- `vcx-api/app/routers/portal.py` (496 lines)
- `vcx-api/app/schema.sql` -- portal_sessions (198), matter_comments (207), packet_exports (217)

---

## Product 5: Public Legal Assistant

**Classification: COMPLETE**

### Spec Items

| Target | Status | Evidence |
|--------|--------|----------|
| Controlled assistant | PRESENT | 4-mode system: general_chat, legal_information, vcx_routing, high_risk (policy.py:240-248). 28+ high-risk keywords + 5 advice-seeking regex patterns (knowledge.py:99-121). All responses retrieval-based, zero LLM. Rate limited (30/min messages, 10/min escalation/upload). Topic scope: 4 domains only (policy.py:39). |
| Useful dialogue | PRESENT | Structured legal blocks per topic + 20+ case-types (knowledge.py:178-486). Fact-gathering sequences with justifications (knowledge.py:492-524). Knowledge retrieval from markdown files (knowledge.py:662-685). 4 contextual suggestions per topic (policy.py:46-71). Broad-legal handler for out-of-scope questions with 4 clarifying questions. |
| Routes into intake / review / portal | PRESENT | 13+ distinct escalation URLs including /structured-case-intake.html (with service-type prefill), /app/vcx-contract-review/, /app/vcx-recovery-pilot/, /app/vcx-packet-room/, /app/sign-in/, /contact.html, tel:+18887948292. Convert-to-intake pipeline: POST /api/legal-chat/convert-to-intake with prefill URL + client-side fallback. Escalation form (name/email/phone/notes) at index.html:143-165. Static "Open structured intake" button in form (index.html:123). Error-state routing with intake + phone links. |
| Not an autonomous lawyer | PRESENT | 5 disclaimer layers: (1) HTML page bottom (index.html:169), (2) Footer i18n (EN/RU/ES), (3) Backend _DISCLAIMER appended to every legal response (policy.py:84-89), (4) Welcome message "I do not provide legal advice" (JS:517), (5) i18n out_disc key. High-risk hard-stop blocks advice-seeking. No generative output anywhere. |

### Phase 10 Additions Verified

| Feature | Status | Evidence |
|---------|--------|----------|
| File upload buttons | PRESENT | Paperclip `#laAttachBtn` + camera `#laCameraBtn` (index.html:121-122). Hidden inputs (index.html:125-126). Upload handler with validation + POST to /api/legal-chat/upload (JS:421-507). |
| sessionStorage persistence | PRESENT | Key `vcx_la_session` (JS:32). loadSession()/saveSession() (JS:34-51). Restores sessionId, topic, jurisdiction, mode on load. |
| Backend readiness indicator | PRESENT | `#backendDot` + `#backendLabel` (index.html:105). checkBackend() pings /healthz every 30s (JS:398-419). Green/red dot. |

### Floating Widget Parity
Same backend endpoints, same file upload, same session persistence, same routing. Hidden on dedicated legal-assistant page (vcx-chat-launcher.js:15). Lacks topic chips and escalation form (those are page-only features).

### Proving Files
- `app/legal-assistant/index.html` (214 lines)
- `assets/js/vcx-legal-assistant.js` (534 lines)
- `assets/js/vcx-chat-launcher.js` (708 lines)
- `vcx-api/app/routers/chat.py` (349 lines)
- `vcx-api/app/services/policy.py` (627 lines) -- via `vcx-api/app/legal_chat/policy.py`
- `vcx-api/app/services/knowledge.py` (718 lines) -- via `vcx-api/app/legal_chat/knowledge.py`

---

## What Should Be Fixed First

### Priority 1: Functional -- user sees incomplete product
| # | Fix | Product | Effort | Impact |
|---|-----|---------|--------|--------|
| 1 | Render `issue_buckets` in renderResults() | Contract Review | ~2h | HIGH |
| 2 | Render `missing_protections` in renderResults() | Contract Review | ~2h | HIGH |
| 3 | Render `suggested_questions` in renderResults() | Contract Review | ~2h | HIGH |
| 4 | Add document upload UI + backend endpoint | Packet Room | ~4h | HIGH |

### Priority 2: Functional -- features promised but absent
| # | Fix | Product | Effort | Impact |
|---|-----|---------|--------|--------|
| 5 | Add deliverable download links + endpoint | Packet Room | ~2h | MEDIUM |
| 6 | Implement packet export (replace 501 stub) | Packet Room | ~8h | MEDIUM |
| 7 | Add OCR for image-based PDFs (pytesseract) | Contract Review | ~4h | MEDIUM |

### Priority 3: Scaffold completion
| # | Fix | Product | Effort | Impact |
|---|-----|---------|--------|--------|
| 8 | Wire paid advisor tier CTAs or label "Coming Soon" | Contract Review | ~2h | LOW |
| 9 | Build chronology builder UI + endpoint | Packet Room | ~8h | LOW |

---

## Cosmetic vs Functionally Missing

| Item | Type | Product |
|------|------|---------|
| Issue buckets not rendered | **FUNCTIONAL** | Contract Review |
| Missing protections not rendered | **FUNCTIONAL** | Contract Review |
| Suggested questions not rendered | **FUNCTIONAL** | Contract Review |
| No document upload UI | **FUNCTIONAL** | Packet Room |
| No chronology builder | **FUNCTIONAL** | Packet Room |
| No deliverable download | **FUNCTIONAL** | Packet Room |
| No packet export | **FUNCTIONAL** | Packet Room |
| No OCR for scanned PDFs | **FUNCTIONAL** | Contract Review |
| Timeline is read-only | COSMETIC (by design) | Packet Room |
| Paid tier CTA not wired | COSMETIC scaffold | Contract Review |
| Orphaned CSS classes | COSMETIC dead code | Intake OS, Recovery Pilot |
| No PDF for executive brief | COSMETIC (HTML works) | Recovery Pilot |

---

## Done Definition for Full Roadmap Compliance

### Intake OS: DONE
No further work required.

### Contract Review Desk: Needs 3 frontend additions + 1 optional
- [ ] Render `data.issue_buckets` -- 3 severity panels (Immediate/Review/Standard)
- [ ] Render `data.missing_protections` -- checklist with per-type recommendations
- [ ] Render `data.suggested_questions` -- collapsible question list per clause/gap
- [ ] (Optional) OCR via pytesseract for image-based PDFs
- [ ] (Optional) Wire paid tier CTAs or label "Coming Soon"

### Recovery Pilot Studio: DONE
No further work required. PDF brief export is nice-to-have.

### Packet Room / Client Portal: Needs 4 features
- [ ] Document upload UI (file input + upload endpoint in portal.py)
- [ ] Deliverable download links (expose file_path or add download endpoint)
- [ ] Packet export implementation (replace 501 stub with PDF/ZIP generator)
- [ ] Chronology builder UI + backend endpoint (scope: decide client vs admin)

### Legal Assistant: DONE
No further work required.

---

*End of VCX Product Completeness Audit v3*
