# VCX Roadmap: 30/60/90 Day Plan

## Day 0-30: Foundation (Products 1 + 5 Complete, Products 2-4 Scaffolded)

### Completed
- [x] VCX Intake OS backend (9 tables, 8 endpoints, tested)
- [x] Client status page (matter-status) with magic-link auth
- [x] Admin review queue with triage scoring
- [x] Legal assistant with knowledge base (4 topics)
- [x] Legal assistant frontend with topic chips and escalation form
- [x] site.js wiring for intake API with FormSubmit.co fallback
- [x] Product 2-4 frontend scaffolds (HTML + CSS + JS)
- [x] Product 2-4 backend scaffolds (routers + models + schema)
- [x] Documentation (implementation plan, API map, data model, changelog)

### Remaining (Day 0-30)
- [x] Email notifications on intake submission (SMTP, fire-and-forget)
- [x] Email notification on status change
- [x] Basic rate limiting on public endpoints (slowapi, per-IP)
- [x] CORS tightening for production domain (env-driven allowlist)
- [x] .env.example documentation for all new env vars
- [x] Upload validation (extension allowlist, size limit, filename sanitization)
- [x] Sign-in page wired to portal auth flow
- [x] Session persistence (sessionStorage) for portal and matter-status
- [x] Admin token timing-safe comparison (secrets.compare_digest)
- [x] Error handling improvements across intake, portal, review queue

## Day 31-60: Product 2 (Contract Review Desk) + Product 3 (Recovery Pilot Studio)

### Contract Review Desk
- [x] Pattern-based clause detection (16 regex patterns for common clause types)
- [x] Risk scoring per clause (rule-based: high_risk=25, caution=10, neutral=2)
- [x] Summary generation (template-based risk summary with disclaimer)
- [x] Monetization ladder UI: free pre-check / paid review / premium memo tiers shown
- [x] Frontend: risk score bar, clause cards, full report view
- [x] Text extraction from PDF (pdfplumber)
- [x] Text extraction from DOCX (python-docx)
- [x] Wire existing /app/contract-intelligence/ as free tier entry point

### Recovery Pilot Studio
- [x] Wizard step validation (required fields per step)
- [x] Deterministic financial models (baseline KPIs, 3-scenario projections)
- [x] KPI baseline computation from input data (AR ratio, aging severity, net recovery, leakage)
- [x] Save/resume wizard state (SQLite persistence via PATCH endpoint)
- [x] Pilot outline generation (3-phase engagement with deliverables)
- [x] Executive brief data assembly (company + baseline + projections + outline + disclaimer)
- [x] Frontend: 5-step wizard with API integration, analysis display, brief rendering
- [ ] Template-based executive brief export (HTML to PDF via WeasyPrint)

## Day 61-90: Product 4 (Packet Room) + Hardening

### Packet Room / Client Portal
- [x] Portal session management (create from magic link, 24h TTL, contact-based)
- [x] Contact-based matter listing (show all client's matters)
- [x] Matter comments thread (client posting, admin + client display)
- [x] Chronology builder from status_events
- [x] Documents list with size and date
- [x] Deliverables vault with status display
- [x] Checklist surface with completion state
- [x] Email-based lookup (privacy-safe matter count response)
- [x] URL token auto-login (magic link landing support)
- [ ] Packet export (PDF with cover page, TOC, timeline, documents)
- [x] Wire /app/sign-in/ to portal auth flow

### Hardening
- [x] Security audit: input validation (upload validator), file type restrictions, token entropy
- [x] Rate limiting on all public endpoints (slowapi per-IP)
- [ ] HTTPS enforcement and security headers
- [ ] SQLite backup/restore automation
- [ ] Error monitoring and logging
- [ ] Admin analytics dashboard (matter volume, response time, triage distribution)
- [ ] Load testing (target: 100 concurrent matters)

## Day 90+: Growth
- [ ] LLM integration for contract analysis (Claude API)
- [x] PDF/DOCX text extraction for Contract Review Desk
- [ ] Payment integration (Stripe invoice or per-matter billing)
- [ ] Multi-language support for Products 2-4
- [ ] Webhook integrations (CRM, Slack notifications)
- [ ] PostgreSQL migration (when SQLite limits hit)
- [ ] Mobile-native considerations
- [ ] Executive brief PDF export for Recovery Pilot Studio
