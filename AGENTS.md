# AGENTS.md — VitaCorex Website

## Commands

```bash
# Local dev server
npx http-server . -p 8080 -c-1      # Static site on port 8080

# VCX API (if running locally)
cd vcx-api && python -m uvicorn main:app --port 8000

# Deploy (auto via Vercel on push)
git add -A && git commit -m "description" && git push origin main

# Validate HTML
# All pages are static HTML — open any .html file directly in browser
```

## Project Overview

VitaCorex LLC corporate website — static HTML/CSS/JS site with 50+ pages, 14 interactive web apps, and a Python API backend. Deployed via Vercel (auto-deploy on GitHub push).

**Stack:** Static HTML + CSS + Vanilla JS | FastAPI microservice (vcx-api/) | Vercel deployment

**Repo:** `Vitacorex2025/vitacorex-website.git` on GitHub

**Services:** Revenue Recovery, Immigration, Contract Review, Business Formation, Auto Dealer Contracts, Court Filing, Corporate Paralegal, Business Plans, Intake

## Project Structure

```
/                            # Site root
├── index.html               # Homepage
├── about.html, contact.html # Core pages
├── services-*.html          # Service pages (15+ services)
├── app/                     # 14 interactive web apps
│   ├── vcx-intake/          # Client intake OS
│   ├── vcx-contract-review/ # Contract review desk
│   ├── vcx-recovery-pilot/  # Recovery pilot studio
│   ├── vcx-packet-room/     # Packet room / client portal
│   ├── legal-assistant/     # Public-facing legal assistant
│   ├── vcx-deadline-calendar/
│   ├── vcx-immigration-forms/
│   ├── vcx-contract-intelligence/
│   ├── vcx-dealer-contract-check/
│   ├── vcx-matter-status/
│   ├── vcx-private-lookup/
│   ├── vcx-sign-in/
│   └── vcx-review/
├── assets/
│   ├── css/                 # styles.css, ui-shell.css, vcx-*.css
│   ├── js/                  # site.js, ui-shell.js, premium-fixes.js
│   ├── img/                 # Images
│   ├── pdf/                 # Documents
│   └── video/               # Video content
├── vcx-api/                 # FastAPI backend
│   ├── main.py
│   ├── knowledge/           # Knowledge base files
│   └── data/                # Data directory
├── .well-known/             # AI plugin + context manifests
├── vercel.json              # Vercel deployment config
└── render.yaml              # Render deployment config
```

## Code Style

- **HTML:** Semantic HTML5, all pages follow the same shell (header, main, footer)
- **CSS:** Global styles in `assets/css/styles.css` + `ui-shell.css`. New feature CSS in `assets/css/vcx-*.css`
- **JS:** Vanilla JavaScript. New feature scripts in `assets/js/vcx-*.js`
- **Paths:** Always root-relative (`/assets/css/styles.css`, not `../../assets/...`)
- **i18n:** Language toggle buttons with `aria-label="English"` / `aria-label="Español"`
- **Performance:** All `<script>` tags must have `defer` attribute
- **Accessibility:** All interactive elements need `aria-label`, proper contrast ratios

## Visual Design Rules

- Preserve the VCX visual shell: typography, spacing, card system, premium styling
- Header and footer are consistent across all pages — do not modify layout
- Dark premium theme with teal (#00897b) accent color
- Cards use subtle borders and shadows — match existing card patterns
- Mobile-first: no broken layout on iPhone width, no text overlap, no horizontal scroll

## Deployment

- **Production:** Vercel (auto-deploys on `git push origin main`)
- **Render:** Secondary deployment via `render.yaml`
- **GitHub Pages:** Compatible (`.nojekyll` + `CNAME` present)
- Every `git push` to `main` triggers Vercel rebuild automatically

## Guardrails

✅ **Always do:**
- Prefer additive changes over rewrites
- Put new work in namespaced files/routes (`app/vcx-*/`, `assets/css/vcx-*.css`, `assets/js/vcx-*.js`)
- Keep asset paths root-relative
- Add `defer` to all `<script>` tags
- Add `aria-label` to all interactive elements
- Test on mobile width before committing
- Human review must remain in the loop for legal content

⚠️ **Ask first:**
- Before modifying global files:
  - `assets/css/styles.css`
  - `assets/css/ui-shell.css`
  - `assets/js/site.js`
  - `assets/js/ui-shell.js`
  - `assets/js/premium-fixes.js`
- Before changing homepage (`index.html`) or top navigation
- Before deleting or replacing existing pages
- Before modifying `vercel.json` or `render.yaml`
- If a global file must be touched, keep the diff minimal and document why

🚫 **Never do:**
- Delete or replace existing pages
- Rewrite homepage or top navigation
- Present autonomous legal conclusions without human review
- Modify files under `_references/` (read-only inspiration)
- Break mobile layout (no horizontal scroll, no text overlap)
- Use inline styles for new features (use namespaced CSS files)
- Commit API keys or credentials

## Product Roadmap

Build toward these products:
1. **VCX Intake OS** — client onboarding and routing
2. **VCX Contract Review Desk** — AI-assisted contract analysis
3. **VCX Recovery Pilot Studio** — FDCPA/FCCPA debt recovery
4. **VCX Packet Room / Client Portal** — document management
5. **Legal Assistant** — public-facing AI legal Q&A

## Integration with BloomlyTax

This website connects to the BloomlyTax CRM backend (port 8765) for:
- VCX CRM endpoints (`/api/vcx/*`)
- AI document generation (69 templates across 11 service types)
- 4 VCX AI agents: intake, recovery, immigration, court_filing
- Court filing packet generation (FL-specific, auto County/Circuit Court)
