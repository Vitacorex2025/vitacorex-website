# VCX Implementation Plan

## Overview
Five-product platform built additively on the existing VitaCoreX static site. All changes are namespaced under `app/vcx-*/`, `assets/css/vcx-*.css`, `assets/js/vcx-*.js`, and `vcx-api/`.

## Architecture Decisions
1. **No framework rewrite.** Vanilla JS + HTML5 + CSS custom properties.
2. **Single FastAPI backend.** All products share one process, one SQLite database.
3. **Magic-link auth for MVP.** No passwords. Token-based access. Human review stays in the loop.
4. **FormSubmit.co fallback preserved.** If API is unreachable, intake form falls back to email.
5. **Additive only.** New pages, new CSS, new JS. Global files untouched (one documented exception: site.js bindIntakeForm).

## Products
| # | Product | Frontend | Backend | Status |
|---|---------|----------|---------|--------|
| 1 | VCX Intake OS | app/matter-status/, app/review/, structured-case-intake.html wiring | /api/intakes, /api/uploads, /api/matters, /api/review | Built, tested |
| 2 | VCX Contract Review Desk | app/vcx-contract-review/ | /api/contracts/* | Scaffolded |
| 3 | VCX Recovery Pilot Studio | app/vcx-recovery-pilot/ | /api/recovery/* | Scaffolded |
| 4 | VCX Packet Room / Client Portal | app/vcx-packet-room/ | /api/portal/* | Scaffolded |
| 5 | Legal Assistant | app/legal-assistant/ | /api/legal-chat/* | Built, tested |

## Global File Modifications (Documented)
| File | Change | Justification |
|------|--------|--------------|
| assets/js/site.js | bindIntakeForm() delegates to VCX_IntakeAPI.submit() when available | Required to wire intake form to own API without breaking FormSubmit.co fallback |
| structured-case-intake.html | Added intakeResult div, legal-assistant link, vcx-intake-api.js script tag | All additive insertions, no deletions |
| .gitignore | Added vcx-api/data/, vcx-api/uploads/, vcx-api/.env | Standard exclusions for generated data |

## Tech Stack
- Frontend: HTML5, CSS3 (custom properties), Vanilla JS (ES6+)
- Backend: Python 3.14, FastAPI, SQLite (WAL mode)
- Auth: Magic-link tokens (48-byte, URL-safe), X-Admin-Token for admin
- File Storage: Local filesystem
- PDF Generation: Planned (weasyprint/reportlab) for Products 3-4
