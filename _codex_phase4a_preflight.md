# VCX Phase 4A — Visual-Freeze Hardening Plan

> Generated 2026-04-02 | Branch: `codex/phase2-safe-realign`
> Mode: read-only planning (no files modified)
> Priority: backend hardening, zero visual changes

---

## Mandate

Harden the existing VCX platform without touching the visual shell. All work is backend-first. Existing pages remain the acquisition layer. No new visual system, no global CSS redesign, no homepage changes.

### Business Priority Order

1. **VCX Intake OS** — email notifications, upload hardening, better error handling
2. **Contract Review Desk** — already functional, no Phase 4A changes needed
3. **Packet Room / Client Portal** — real sign-in flow, session persistence, portal auth polish
4. **Recovery Pilot Studio** — defer (already functional)
5. **Legal Assistant** — remain narrow, controlled, non-autonomous (no changes)

---

## Task Breakdown

### Task 1: Intake Submission Email Notification

**Current state:** POST /api/intakes creates matter, generates magic link, returns JSON — but sends NO email. The magic link exists only in the API response.

**Required:**
- On successful intake, send email to the submitting contact with: matter ID, magic link, expected response window
- Send admin notification to `VCX_ADMIN_EMAIL` env var with: submitter name/email, service type, triage score
- Use SMTP (stdlib `smtplib` + `email.mime`) — no external dependency needed for MVP
- Env vars: `VCX_SMTP_HOST`, `VCX_SMTP_PORT`, `VCX_SMTP_USER`, `VCX_SMTP_PASS`, `VCX_ADMIN_EMAIL`, `VCX_FROM_EMAIL`
- If SMTP is not configured (env vars missing), log warning and skip — no hard failure

**Files to modify:**
| File | Change |
|------|--------|
| `vcx-api/app/services/email_service.py` | **CREATE** — send_client_intake_confirmation(), send_admin_intake_notification(), _send_email() helper with try/except |
| `vcx-api/app/routers/intakes.py` | Import email_service, call after successful matter creation (fire-and-forget, don't fail intake on email error) |

---

### Task 2: Status-Change Email Notification

**Current state:** PATCH /api/review/matters/{id} updates status and inserts status_event — but sends NO email.

**Required:**
- On admin status change, send email to contact with: matter ID, old status → new status, any admin note
- Reuse email_service from Task 1
- Query contact email from matters → contacts join
- If no contact email on file, skip silently

**Files to modify:**
| File | Change |
|------|--------|
| `vcx-api/app/services/email_service.py` | Add send_status_change_notification() |
| `vcx-api/app/routers/review.py` | Import email_service, call after successful status update |

---

### Task 3: Upload Validation

**Current state:** POST /api/uploads/{matter_id} accepts ANY file with no checks. POST /api/intakes also accepts attachment with no validation. Both store files with UUID prefix but no MIME check, no size limit, no filename sanitization.

**Required:**
- **MIME/extension allowlist:** `.pdf`, `.doc`, `.docx`, `.txt`, `.md`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.csv`, `.xlsx`, `.xls`
- **Max file size:** 25 MB per file (configurable via `VCX_MAX_UPLOAD_MB` env var)
- **Filename sanitization:** strip path separators, null bytes, control chars; truncate to 200 chars; preserve extension
- **Auth per matter:** Already present in uploads.py (Bearer token). Verify intakes.py attachment also validates.

**Rejected extensions (block these):**
`.exe`, `.bat`, `.cmd`, `.sh`, `.ps1`, `.js`, `.html`, `.htm`, `.php`, `.py`, `.rb`, `.pl`, `.com`, `.scr`, `.vbs`, `.wsf`, `.msi`, `.jar`

**Files to modify:**
| File | Change |
|------|--------|
| `vcx-api/app/services/upload_validator.py` | **CREATE** — validate_file(filename, size, content_type) → raises HTTPException on failure; sanitize_filename() |
| `vcx-api/app/routers/uploads.py` | Import upload_validator, call before saving file |
| `vcx-api/app/routers/intakes.py` | Import upload_validator, call before saving attachment |
| `vcx-api/app/routers/contracts.py` | Import upload_validator, call in /analyze and /upload before processing |

---

### Task 4: Basic Rate Limiting on Public Endpoints

**Current state:** No rate limiting anywhere. Any endpoint can be hammered.

**Required:**
- Add `slowapi` dependency (lightweight, FastAPI-compatible, uses `limits` under the hood)
- Rate limits per IP:
  - POST /api/intakes: 10/minute (intake abuse prevention)
  - POST /api/uploads: 20/minute (upload spam prevention)
  - POST /api/contracts/analyze: 10/minute (compute-heavy)
  - POST /api/recovery/pilot: 10/minute
  - POST /api/legal-chat/message: 30/minute (chat flood prevention)
  - POST /api/portal/magic-link: 5/minute (brute-force prevention)
  - POST /api/portal/lookup-email: 5/minute (enumeration prevention)
  - GET /healthz: no limit
- On limit exceeded: return 429 Too Many Requests with `Retry-After` header
- Configurable via `VCX_RATE_LIMIT_ENABLED` env var (default: true)

**Files to modify:**
| File | Change |
|------|--------|
| `vcx-api/requirements.txt` | Add `slowapi>=0.1.9` |
| `vcx-api/app/main.py` | Import and configure slowapi Limiter as middleware; mount exception handler |
| `vcx-api/app/routers/intakes.py` | Add `@limiter.limit("10/minute")` decorator |
| `vcx-api/app/routers/uploads.py` | Add `@limiter.limit("20/minute")` decorator |
| `vcx-api/app/routers/contracts.py` | Add `@limiter.limit("10/minute")` on analyze/upload |
| `vcx-api/app/routers/recovery.py` | Add `@limiter.limit("10/minute")` on POST |
| `vcx-api/app/routers/chat.py` | Add `@limiter.limit("30/minute")` on message |
| `vcx-api/app/routers/portal.py` | Add `@limiter.limit("5/minute")` on magic-link and lookup-email |

---

### Task 5: Env-Driven CORS Allowlist

**Current state:** `main.py` reads `VCX_ALLOWED_ORIGINS` with default `"http://localhost:8765"`. This is already env-driven — but the default is dev-only and the split logic doesn't strip whitespace after commas.

**Required:**
- Fix: strip whitespace from each origin after splitting
- Add `VCX_CORS_ALLOW_CREDENTIALS`, `VCX_CORS_ALLOW_METHODS`, `VCX_CORS_ALLOW_HEADERS` env vars (all optional with sane defaults)
- Document in `.env.example`
- Keep current default for dev; production should set `VCX_ALLOWED_ORIGINS=https://vitacorexllc.com,https://www.vitacorexllc.com`

**Files to modify:**
| File | Change |
|------|--------|
| `vcx-api/app/main.py` | Improve CORS parsing, add optional env vars |
| `vcx-api/.env.example` | **CREATE** — document all env vars with defaults and descriptions |

---

### Task 6: Real Sign-In → Portal Auth Flow

**Current state:** `/app/sign-in/index.html` is a stub that redirects to homepage. The Packet Room has its own auth gate (token/email input). Magic links land on matter-status, not portal.

**Required flow:**
1. `/app/sign-in/` shows a form with email input + submit
2. Backend: POST /api/portal/request-access with email → creates portal_session, builds magic link pointing to `/app/vcx-packet-room/?token=xxx`
3. If SMTP configured: sends email with the link. If not: returns the link in JSON response (dev mode).
4. User clicks link → Packet Room auto-authenticates via URL param (already works)
5. Session token stored in `sessionStorage` so page reload preserves auth
6. Sign-in page links from existing pages that reference `/app/sign-in/`

**Files to modify:**
| File | Change |
|------|--------|
| `app/sign-in/index.html` | **REWRITE** — replace redirect stub with actual sign-in form using v284 shell template |
| `assets/js/vcx-sign-in.js` | **CREATE** — form handler: POST to /api/portal/request-access, show success/error |
| `assets/css/vcx-sign-in.css` | **CREATE** — minimal styles scoped to `body[data-vcx-page="vcx-sign-in"]` |
| `vcx-api/app/routers/portal.py` | Add POST /api/portal/request-access endpoint |
| `vcx-api/app/services/email_service.py` | Add send_portal_access_link() |
| `assets/js/vcx-packet-room.js` | Add sessionStorage persistence for auth token; restore on page load |
| `assets/js/vcx-matter-status.js` | Add sessionStorage persistence for matter auth |

---

### Task 7: Better Error Handling for Intake Submit and Portal Auth

**Current state:**
- Intake: vcx-intake-api.js shows one generic error message for all failure types
- Portal: vcx-packet-room.js shows basic auth error but no differentiation (expired vs. invalid vs. network)
- Review: vcx-review-queue.js shows "Invalid token" or "Cannot reach API" — minimal

**Required:**
- Intake: differentiate between network error, validation error (422), rate limited (429), and server error (500)
- Portal: differentiate between invalid token (404), expired session (401), network error, and rate limited (429)
- Both: add user-actionable guidance (e.g., "Your session has expired. Please request a new access link.")
- Review queue: add timeout handling on fetch calls

**Files to modify:**
| File | Change |
|------|--------|
| `assets/js/vcx-intake-api.js` | Improve error handler with status code differentiation |
| `assets/js/vcx-packet-room.js` | Improve auth error messages, add session restore from sessionStorage |
| `assets/js/vcx-review-queue.js` | Add timeout handling, improve error messages |
| `assets/js/vcx-matter-status.js` | Add session persistence, improve expired-link message |

---

### Task 8: Docs and Rollback Notes

**Files to modify:**
| File | Change |
|------|--------|
| `docs/VCX_CHANGELOG.md` | Add Phase 4A section with all changes |
| `docs/VCX_ROADMAP_30_60_90.md` | Check off completed items, add new items |
| `docs/GUARDRAIL_DEVIATIONS.md` | Add deviation entries if site.js or intake page are modified |
| `docs/VCX_PHASE4A_QA.md` | **CREATE** — QA checklist, rollback notes, done definition |
| `vcx-api/.env.example` | **CREATE** — full env var documentation |
| `_codex_phase4a_preflight.md` | This document |

---

## Exact Files to Modify

### Backend (vcx-api/) — PRIMARY FOCUS

| # | File | Action | Task |
|---|------|--------|------|
| 1 | `vcx-api/app/services/email_service.py` | CREATE | 1, 2, 6 |
| 2 | `vcx-api/app/services/upload_validator.py` | CREATE | 3 |
| 3 | `vcx-api/app/routers/intakes.py` | MODIFY | 1, 3 |
| 4 | `vcx-api/app/routers/uploads.py` | MODIFY | 3, 4 |
| 5 | `vcx-api/app/routers/review.py` | MODIFY | 2, 4 |
| 6 | `vcx-api/app/routers/portal.py` | MODIFY | 4, 6 |
| 7 | `vcx-api/app/routers/contracts.py` | MODIFY | 3, 4 |
| 8 | `vcx-api/app/routers/recovery.py` | MODIFY | 4 |
| 9 | `vcx-api/app/routers/chat.py` | MODIFY | 4 |
| 10 | `vcx-api/app/main.py` | MODIFY | 4, 5 |
| 11 | `vcx-api/requirements.txt` | MODIFY | 4 |
| 12 | `vcx-api/.env.example` | CREATE | 5, 8 |

### Frontend (namespaced JS/CSS only)

| # | File | Action | Task |
|---|------|--------|------|
| 13 | `assets/js/vcx-intake-api.js` | MODIFY | 7 |
| 14 | `assets/js/vcx-packet-room.js` | MODIFY | 6, 7 |
| 15 | `assets/js/vcx-matter-status.js` | MODIFY | 6, 7 |
| 16 | `assets/js/vcx-review-queue.js` | MODIFY | 7 |
| 17 | `assets/js/vcx-sign-in.js` | CREATE | 6 |
| 18 | `assets/css/vcx-sign-in.css` | CREATE | 6 |

### App pages

| # | File | Action | Task |
|---|------|--------|------|
| 19 | `app/sign-in/index.html` | REWRITE (stub → functional) | 6 |

### Docs

| # | File | Action | Task |
|---|------|--------|------|
| 20 | `docs/VCX_CHANGELOG.md` | MODIFY | 8 |
| 21 | `docs/VCX_ROADMAP_30_60_90.md` | MODIFY | 8 |
| 22 | `docs/GUARDRAIL_DEVIATIONS.md` | MODIFY (if needed) | 8 |
| 23 | `docs/VCX_PHASE4A_QA.md` | CREATE | 8 |
| 24 | `_codex_phase4a_preflight.md` | CREATE (this file) | 8 |

**Total: 24 files (6 create, 18 modify)**

---

## Exact Files to Leave UNTOUCHED

| File | Reason |
|------|--------|
| `index.html` | Homepage — hard constraint |
| `assets/css/styles.css` | Global CSS — hard constraint |
| `assets/css/ui-shell.css` | Shell CSS — hard constraint |
| `assets/css/premium-fixes.css` | Premium styling — hard constraint |
| `assets/js/site.js` | Global JS — not needed for Phase 4A |
| `assets/js/ui-shell.js` | Shell JS — hard constraint |
| `assets/js/vcx-i18n.js` | i18n runtime — hard constraint |
| `assets/js/vitacorex-public.js` | Public JS — hard constraint |
| `assets/js/premium-fixes.js` | Premium JS — hard constraint |
| `assets/js/shell-i18n.js` | i18n data — no change needed |
| `structured-case-intake.html` | Not needed — intake wiring already done in Phase 2 |
| `additional-services.html` | Acquisition page — no change |
| `revenue-recovery-workflow.html` | Acquisition page — no change |
| `corporate-legal-file-control.html` | Acquisition page — no change |
| `assets/css/vcx-tokens.css` through `vcx-utilities.css` | Design system — no change |
| `app/contract-intelligence/` | Existing app — no change |
| `app/dealer-contract-check/` | Existing app — no change |
| `app/immigration-forms/` | Existing app — no change |
| `app/private-lookup/` | Existing app — no change |
| `app/legal-assistant/` | Remain narrow — no change |
| `app/vcx-intake/` | No change needed |
| `app/vcx-contract-review/` | No change needed |
| `app/vcx-recovery-pilot/` | Deferred — no change |
| `vcx-api/app/schema.sql` | Schema sufficient — no change |
| `vcx-api/app/db.py` | DB layer sufficient — no change |
| `vcx-api/app/models/*` | Models sufficient — no change |
| `vcx-api/app/services/contract_analyzer.py` | Functional — no change |
| `vcx-api/app/services/recovery_engine.py` | Functional — no change |
| `vcx-api/app/services/triage.py` | Functional — no change |
| `vcx-api/app/services/checklist.py` | Functional — no change |
| `vcx-api/app/services/magic_link.py` | Functional — no change |
| `_references/` | Read-only reference — hard constraint |
| All 27 root HTML pages (except structured-case-intake.html) | Acquisition layer — no change |

---

## Risk List

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | **SMTP misconfiguration silently drops emails** | MEDIUM | Email service must log failures clearly; health endpoint should report SMTP status |
| 2 | **slowapi dependency adds attack surface** | LOW | Pin version, review deps, only rate-limit public POST endpoints |
| 3 | **sign-in page shell template mismatch** | MEDIUM | Copy shell from existing app/vcx-packet-room/index.html (already reconciled with v284) |
| 4 | **sessionStorage auth token accessible to XSS** | LOW | Acceptable for MVP; no sensitive data in token itself; token is time-limited (24h) |
| 5 | **Rate limiting false positives behind proxy** | LOW | Use `X-Forwarded-For` header for real IP; document in .env.example |
| 6 | **Upload validator bypass via content-type spoofing** | LOW | Validate extension AND content-type; add magic-bytes check for PDF/images in future |
| 7 | **Email service introduces latency on intake** | MEDIUM | Send emails in background thread or fire-and-forget; never block the intake response |
| 8 | **Portal timezone mismatch bug (existing)** | MEDIUM | Fix in Task 6: use consistent UTC everywhere (datetime.utcnow() in Python, datetime('now') in SQLite are both UTC) |
| 9 | **Admin token still uses simple string compare** | LOW | Switch to `secrets.compare_digest()` in review.py during Task 4 pass |
| 10 | **sign-in page is the only existing page being rewritten** | LOW | It's currently a non-functional redirect stub; rewriting to actual form is net improvement |

---

## Execution Order

### Phase 4A-1: Backend services (no frontend changes)

| Step | Task | Files | Risk | Commit? |
|------|------|-------|------|---------|
| 1 | Create upload_validator.py | `vcx-api/app/services/upload_validator.py` | NONE (new file) | Combined |
| 2 | Wire upload validation to intakes, uploads, contracts | 3 router files | LOW | Combined |
| 3 | Verify: attempt upload of .exe → rejected; upload .pdf → accepted | — | LOW | No |
| 4 | **Commit: "Add upload validation: mime/size/filename checks"** | | | Yes |

### Phase 4A-2: Rate limiting

| Step | Task | Files | Risk | Commit? |
|------|------|-------|------|---------|
| 5 | Add slowapi to requirements.txt | `vcx-api/requirements.txt` | NONE | Combined |
| 6 | Configure limiter in main.py | `vcx-api/app/main.py` | LOW | Combined |
| 7 | Add decorators to all 7 routers | 7 router files | LOW | Combined |
| 8 | Verify: 11 rapid POST /api/intakes → 429 on 11th | — | LOW | No |
| 9 | **Commit: "Add rate limiting on public endpoints (slowapi)"** | | | Yes |

### Phase 4A-3: CORS tightening + env documentation

| Step | Task | Files | Risk | Commit? |
|------|------|-------|------|---------|
| 10 | Improve CORS parsing in main.py | `vcx-api/app/main.py` | LOW | Combined |
| 11 | Create .env.example with all env vars | `vcx-api/.env.example` | NONE | Combined |
| 12 | **Commit: "Tighten CORS, create .env.example"** | | | Yes |

### Phase 4A-4: Email service

| Step | Task | Files | Risk | Commit? |
|------|------|-------|------|---------|
| 13 | Create email_service.py with SMTP send + 4 email functions | `vcx-api/app/services/email_service.py` | NONE (new file) | Combined |
| 14 | Wire intake email to intakes.py | `vcx-api/app/routers/intakes.py` | LOW | Combined |
| 15 | Wire status-change email to review.py | `vcx-api/app/routers/review.py` | LOW | Combined |
| 16 | Verify: submit intake → email arrives (or log if SMTP not configured) | — | MEDIUM | No |
| 17 | **Commit: "Add email notifications for intake + status change"** | | | Yes |

### Phase 4A-5: Sign-in → portal auth flow

| Step | Task | Files | Risk | Commit? |
|------|------|-------|------|---------|
| 18 | Add POST /api/portal/request-access to portal.py | `vcx-api/app/routers/portal.py` | LOW | Combined |
| 19 | Add send_portal_access_link() to email_service.py | `vcx-api/app/services/email_service.py` | LOW | Combined |
| 20 | Rewrite app/sign-in/index.html with v284 shell + email form | `app/sign-in/index.html` | MEDIUM | Combined |
| 21 | Create vcx-sign-in.js (form handler) | `assets/js/vcx-sign-in.js` | NONE | Combined |
| 22 | Create vcx-sign-in.css (minimal scoped styles) | `assets/css/vcx-sign-in.css` | NONE | Combined |
| 23 | Add sessionStorage persistence to vcx-packet-room.js | `assets/js/vcx-packet-room.js` | LOW | Combined |
| 24 | Add sessionStorage persistence to vcx-matter-status.js | `assets/js/vcx-matter-status.js` | LOW | Combined |
| 25 | Verify: navigate to /app/sign-in/ → enter email → link sent → click link → portal authenticated | — | MEDIUM | No |
| 26 | **Commit: "Wire sign-in page to portal auth flow"** | | | Yes |

### Phase 4A-6: Error handling improvements

| Step | Task | Files | Risk | Commit? |
|------|------|-------|------|---------|
| 27 | Improve vcx-intake-api.js error differentiation | `assets/js/vcx-intake-api.js` | LOW | Combined |
| 28 | Improve vcx-packet-room.js error messages | `assets/js/vcx-packet-room.js` | LOW | Combined |
| 29 | Improve vcx-review-queue.js timeout + errors | `assets/js/vcx-review-queue.js` | LOW | Combined |
| 30 | Improve vcx-matter-status.js expired-link UX | `assets/js/vcx-matter-status.js` | LOW | Combined |
| 31 | Fix admin token comparison in review.py (secrets.compare_digest) | `vcx-api/app/routers/review.py` | LOW | Combined |
| 32 | Fix portal.py timezone consistency | `vcx-api/app/routers/portal.py` | LOW | Combined |
| 33 | Verify: submit intake with backend down → specific error shown | — | LOW | No |
| 34 | **Commit: "Improve error handling across intake, portal, review"** | | | Yes |

### Phase 4A-7: Documentation

| Step | Task | Files | Risk | Commit? |
|------|------|-------|------|---------|
| 35 | Update VCX_CHANGELOG.md with Phase 4A section | `docs/VCX_CHANGELOG.md` | NONE | Combined |
| 36 | Update VCX_ROADMAP_30_60_90.md checkboxes | `docs/VCX_ROADMAP_30_60_90.md` | NONE | Combined |
| 37 | Update GUARDRAIL_DEVIATIONS.md if needed | `docs/GUARDRAIL_DEVIATIONS.md` | NONE | Combined |
| 38 | Create VCX_PHASE4A_QA.md | `docs/VCX_PHASE4A_QA.md` | NONE | Combined |
| 39 | **Commit: "Phase 4A documentation and QA checklist"** | | | Yes |

**Total: 7 commits, 39 steps, 24 files**

---

## Done Definition

Phase 4A is DONE when ALL of the following are true:

### Functional checks
- [ ] POST /api/intakes with attachment: .exe rejected (400), .pdf accepted
- [ ] POST /api/intakes: file > 25MB rejected (413)
- [ ] POST /api/intakes: 11th request in 60s returns 429
- [ ] POST /api/intakes with valid data: email sent to submitter (or logged if no SMTP)
- [ ] POST /api/intakes with valid data: admin email sent (or logged if no SMTP)
- [ ] PATCH /api/review/matters/{id} with status change: email sent to contact (or logged)
- [ ] POST /api/portal/magic-link/{token}: rate limited at 5/min
- [ ] POST /api/portal/request-access with email: creates session, sends link (or returns link in dev)
- [ ] GET /app/sign-in/ shows email form, not redirect
- [ ] Enter email on sign-in → receive portal link → click → authenticated in Packet Room
- [ ] Refresh Packet Room page after auth → session restored from sessionStorage
- [ ] Refresh matter-status page → session restored from sessionStorage
- [ ] POST /api/contracts/analyze with .exe → rejected
- [ ] VCX_ALLOWED_ORIGINS=https://vitacorexllc.com → only that origin allowed

### Error handling checks
- [ ] Intake submit with backend offline → vcx-intake-api.js shows network-specific error
- [ ] Intake submit with 422 response → shows validation error
- [ ] Intake submit with 429 → shows "too many requests" message
- [ ] Portal auth with expired token → shows "session expired, request new link" message
- [ ] Portal auth with invalid token → shows "invalid token" message
- [ ] Review queue with wrong admin token → shows "invalid token"
- [ ] Review queue API timeout → shows timeout message

### Guardrail checks
- [ ] index.html: zero diff
- [ ] styles.css: zero diff
- [ ] ui-shell.css: zero diff
- [ ] premium-fixes.css: zero diff
- [ ] site.js: zero diff
- [ ] ui-shell.js: zero diff
- [ ] vcx-i18n.js: zero diff
- [ ] vitacorex-public.js: zero diff
- [ ] structured-case-intake.html: zero diff
- [ ] All 27 root HTML pages (except sign-in route): zero diff
- [ ] No new CSS rules leak outside `body[data-vcx-page="vcx-sign-in"]` scope
- [ ] sign-in page uses canonical v284 shell (header, footer, nav, i18n, clocks)

### Documentation checks
- [ ] VCX_CHANGELOG.md has Phase 4A section
- [ ] VCX_ROADMAP_30_60_90.md has updated checkboxes
- [ ] .env.example documents all env vars
- [ ] VCX_PHASE4A_QA.md exists with rollback instructions
- [ ] GUARDRAIL_DEVIATIONS.md updated if any global files touched

---

## Dependency Notes

- **Python stdlib only for email:** Uses `smtplib` + `email.mime` — no sendgrid/mailgun dependency. Can upgrade later.
- **slowapi is the only new pip dependency** (plus its transitive dep `limits`). Both are lightweight.
- **No schema.sql changes:** All Phase 4A work uses existing tables (portal_sessions, matters, contacts, status_events).
- **No new HTML pages except sign-in rewrite:** The sign-in page is currently a redirect stub — the rewrite makes it functional.
- **No changes to Products 2, 3, or 5:** Contract Review, Recovery Pilot, and Legal Assistant are untouched.

---

## End of Phase 4A Preflight Plan
