# VCX Phase 4A — QA Report

> Generated 2026-04-02 | Branch: `codex/phase2-safe-realign`
> Scope: Visual-freeze hardening — backend security, email, rate limiting, sign-in flow

---

## Changed Files

### New files created (6)

| # | File | Purpose |
|---|------|---------|
| 1 | `vcx-api/app/services/upload_validator.py` | Extension/MIME/size validation + filename sanitization |
| 2 | `vcx-api/app/services/email_service.py` | SMTP email service (fire-and-forget, 4 email functions) |
| 3 | `vcx-api/app/rate_limit.py` | Shared slowapi limiter configuration |
| 4 | `assets/js/vcx-sign-in.js` | Sign-in form handler (POST to /api/portal/request-access) |
| 5 | `assets/css/vcx-sign-in.css` | Scoped styles for sign-in page |
| 6 | `docs/VCX_PHASE4A_QA.md` | This file |

### Existing files modified (18)

| # | File | Changes |
|---|------|---------|
| 1 | `vcx-api/app/main.py` | Rate limiting middleware, improved CORS parsing (whitespace strip, env vars) |
| 2 | `vcx-api/requirements.txt` | Added `slowapi>=0.1.9` |
| 3 | `vcx-api/.env.example` | Comprehensive env var documentation (SMTP, rate limit, CORS, uploads) |
| 4 | `vcx-api/app/routers/intakes.py` | Upload validation, rate limiting, email notifications |
| 5 | `vcx-api/app/routers/uploads.py` | Upload validation, rate limiting |
| 6 | `vcx-api/app/routers/review.py` | Rate limiting, `secrets.compare_digest` for admin token, email on status change |
| 7 | `vcx-api/app/routers/contracts.py` | Upload validation, rate limiting |
| 8 | `vcx-api/app/routers/recovery.py` | Rate limiting |
| 9 | `vcx-api/app/routers/chat.py` | Rate limiting |
| 10 | `vcx-api/app/routers/portal.py` | Rate limiting, POST /request-access endpoint, timezone fix |
| 11 | `assets/js/vcx-intake-api.js` | Error differentiation (422/429/413/500/network) |
| 12 | `assets/js/vcx-packet-room.js` | sessionStorage persistence, session restore, better error messages |
| 13 | `assets/js/vcx-matter-status.js` | sessionStorage persistence, improved expired-link UX, portal link |
| 14 | `assets/js/vcx-review-queue.js` | Fetch timeout (15s), retry on timeout, rate limit messaging |
| 15 | `app/sign-in/index.html` | Rewritten from redirect stub to functional sign-in form with v284 shell |
| 16 | `docs/VCX_CHANGELOG.md` | Phase 4A section |
| 17 | `docs/VCX_ROADMAP_30_60_90.md` | Updated checkboxes |
| 18 | `docs/GUARDRAIL_DEVIATIONS.md` | Sign-in page rewrite deviation |

### Files NOT modified (confirmed)

- `index.html` (homepage)
- `assets/css/styles.css`, `ui-shell.css`, `premium-fixes.css`
- `assets/css/vcx-tokens.css` through `vcx-utilities.css`
- `assets/js/site.js`, `ui-shell.js`, `premium-fixes.js`, `vcx-i18n.js`, `shell-i18n.js`
- `structured-case-intake.html`
- `additional-services.html`, `revenue-recovery-workflow.html`, `corporate-legal-file-control.html`
- `app/legal-assistant/`, `app/matter-status/`, `app/review/`, `app/vcx-intake/`
- `app/vcx-contract-review/`, `app/vcx-recovery-pilot/`, `app/vcx-packet-room/`
- `vcx-api/app/schema.sql`, `vcx-api/app/db.py`
- `vcx-api/app/models/*`
- `vcx-api/app/services/contract_analyzer.py`, `recovery_engine.py`, `triage.py`, `checklist.py`, `magic_link.py`
- `_references/` directory

---

## Functional Check Results

### Upload validation

| Check | Expected | Status |
|-------|----------|--------|
| POST /api/intakes with .exe attachment | 400: blocked | PENDING |
| POST /api/intakes with .pdf attachment | 201: accepted | PENDING |
| POST /api/intakes with >25MB file | 413: rejected | PENDING |
| POST /api/intakes with empty file | 400: rejected | PENDING |
| POST /api/uploads with .bat file | 400: blocked | PENDING |
| POST /api/contracts/analyze with .exe | 400: blocked | PENDING |
| POST /api/contracts/analyze with .txt | 200: accepted | PENDING |
| Filename with path separators | Sanitized (/ and \ replaced with _) | PENDING |

### Rate limiting

| Check | Expected | Status |
|-------|----------|--------|
| 11th POST /api/intakes in 60s | 429 Too Many Requests | PENDING |
| 6th POST /api/portal/magic-link in 60s | 429 | PENDING |
| 6th POST /api/portal/request-access in 60s | 429 | PENDING |
| 31st POST /api/legal-chat/message in 60s | 429 | PENDING |
| VCX_RATE_LIMIT_ENABLED=false | All requests pass | PENDING |
| GET /healthz unlimited | No rate limit | PENDING |

### Email notifications

| Check | Expected | Status |
|-------|----------|--------|
| POST /api/intakes (SMTP configured) | Client + admin emails sent | PENDING |
| POST /api/intakes (SMTP not configured) | Warning logged, no failure | PENDING |
| PATCH /api/review/matters/{id} status change | Client email sent | PENDING |
| POST /api/portal/request-access (SMTP configured) | Portal link email sent | PENDING |
| POST /api/portal/request-access (no SMTP) | dev_link in JSON response | PENDING |

### Sign-in flow

| Check | Expected | Status |
|-------|----------|--------|
| GET /app/sign-in/ | Email form (not redirect) | PENDING |
| Submit email with active matter | Success message shown | PENDING |
| Submit email with no matters | Same generic message (privacy-safe) | PENDING |
| Click portal link from email | Packet Room auto-authenticates | PENDING |
| Refresh Packet Room after auth | Session restored from sessionStorage | PENDING |
| Refresh matter-status page | Session restored from sessionStorage | PENDING |

### Error handling

| Check | Expected | Status |
|-------|----------|--------|
| Intake submit with backend offline | Network-specific error in UI | PENDING |
| Intake submit with 422 response | Field-specific validation error | PENDING |
| Intake submit with 429 | "Too many requests" message | PENDING |
| Intake submit with 413 | "File too large" message | PENDING |
| Portal auth with expired token | "Session expired, request new link" | PENDING |
| Portal auth with invalid token | "Token not found" message | PENDING |
| Review queue API timeout | Timeout message with retry | PENDING |
| Review queue wrong admin token | "Invalid admin token" | PENDING |

### CORS

| Check | Expected | Status |
|-------|----------|--------|
| VCX_ALLOWED_ORIGINS=https://vitacorexllc.com | Only that origin allowed | PENDING |
| Origins with spaces after commas | Whitespace stripped | PENDING |
| VCX_CORS_ALLOW_CREDENTIALS=false | Credentials not allowed | PENDING |

### Guardrail preservation

| Check | Expected | Status |
|-------|----------|--------|
| index.html | Zero diff from v284 baseline | PENDING |
| assets/css/styles.css | Zero diff | PENDING |
| assets/css/ui-shell.css | Zero diff | PENDING |
| assets/css/premium-fixes.css | Zero diff | PENDING |
| assets/js/site.js | Zero diff (from Phase 2) | PENDING |
| assets/js/ui-shell.js | Zero diff | PENDING |
| assets/js/vcx-i18n.js | Zero diff | PENDING |
| vcx-sign-in.css scoping | All rules under `body[data-vcx-page="vcx-sign-in"]` | PENDING |
| sign-in shell template | Matches v284 canonical (vcx-header, footer, i18n, clocks) | PENDING |

---

## Manual QA Checklist

### Critical

- [ ] `/app/sign-in/` — renders email form at 1280px and 375px (no horizontal scroll)
- [ ] `/app/sign-in/` — header matches v284 shell (metric bar, clocks, lang switcher, mobile nav)
- [ ] `/app/sign-in/` — submit email → success message (or dev_link if no SMTP)
- [ ] `/app/vcx-packet-room/` — page refresh after auth → session restored
- [ ] `/app/matter-status/?matter=X&token=Y` — page refresh → token restored from sessionStorage
- [ ] POST /api/intakes with .exe attachment → 400 error
- [ ] POST /api/intakes with valid .pdf → 201 success
- [ ] Verify index.html is completely unchanged

### Important

- [ ] POST /api/intakes returns email confirmation (or warning log)
- [ ] PATCH /api/review/matters/{id} sends email on status change
- [ ] Rate limiting: 11th intake in 60s returns 429
- [ ] `/app/sign-in/` at 375px — form usable, no overflow
- [ ] Click "Open Packet Room" link on sign-in page
- [ ] Click "Start Structured Intake" link on sign-in page
- [ ] Review queue admin token uses constant-time comparison
- [ ] All 7 routers have rate limiting decorators
- [ ] .env.example documents all env vars

### Optional

- [ ] `cd vcx-api && pip install -r requirements.txt` (slowapi installs)
- [ ] `cd vcx-api && uvicorn app.main:app --port 8787` → /healthz returns OK
- [ ] EN/RU/ES language switcher works on sign-in page

---

## Rollback Notes

### Full Phase 4A rollback

Restore all modified files to their Phase 3 state and remove new files:

```bash
# Restore modified backend files
git checkout HEAD~1 -- \
  vcx-api/app/main.py \
  vcx-api/app/routers/intakes.py \
  vcx-api/app/routers/uploads.py \
  vcx-api/app/routers/review.py \
  vcx-api/app/routers/contracts.py \
  vcx-api/app/routers/recovery.py \
  vcx-api/app/routers/chat.py \
  vcx-api/app/routers/portal.py \
  vcx-api/requirements.txt

# Restore modified frontend files
git checkout HEAD~1 -- \
  assets/js/vcx-intake-api.js \
  assets/js/vcx-packet-room.js \
  assets/js/vcx-matter-status.js \
  assets/js/vcx-review-queue.js \
  app/sign-in/index.html

# Remove new files
git clean -f \
  vcx-api/app/services/upload_validator.py \
  vcx-api/app/services/email_service.py \
  vcx-api/app/rate_limit.py \
  assets/js/vcx-sign-in.js \
  assets/css/vcx-sign-in.css
```

### Rollback rate limiting only

```bash
git checkout HEAD~1 -- vcx-api/app/main.py vcx-api/requirements.txt
git clean -f vcx-api/app/rate_limit.py
# Then remove @limiter.limit decorators and Request imports from all 7 routers
```

### Rollback email service only

```bash
git clean -f vcx-api/app/services/email_service.py
# Then remove email_service imports from intakes.py, review.py, portal.py
```

### Rollback sign-in page only

```bash
git checkout HEAD~1 -- app/sign-in/index.html
git clean -f assets/js/vcx-sign-in.js assets/css/vcx-sign-in.css
# Remove request-access endpoint from portal.py
```
