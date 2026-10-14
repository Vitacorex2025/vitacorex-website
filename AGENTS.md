# AGENTS.md — VitaCorex Website

## Commands

```bash
# Local dev server
npx http-server . -p 8080 -c-1      # Static site on port 8080

# VCX API (if running locally)
cd vcx-api && python -m uvicorn main:app --port 8000

# Publish: production is GitHub Pages — every push to main publishes the live site.
# Never push (main or any branch) without the owner's explicit approval of the exact build.
# git push origin main   # only after that approval

# Validate HTML
# All pages are static HTML — open any .html file directly in browser
```

## Project Overview

VitaCorex LLC corporate website — static HTML/CSS/JS site with 50+ pages, 14 interactive web apps, and a Python API backend. Production is served by GitHub Pages from the public GitHub repository; every push to `main` publishes.

**Stack:** Static HTML + CSS + Vanilla JS | FastAPI microservice (vcx-api/) | GitHub Pages (static hosting)

**Repo:** `Vitacorex2025/vitacorex-website.git` on GitHub

**Services:** `assets/data/vcx-catalog.json` is the source of truth for services and prices. Private clients first (translations, online notarization, apostille, tax preparation, contracts and documents, immigration forms, company formation, business plans); B2B small claims is a separate lane; revenue recovery is offered only to existing business clients. VitaCoreX is not a law firm.

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
├── vercel.json              # inert — Vercel does not serve production
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

- **Production:** GitHub Pages, served from the public GitHub repository (`.nojekyll` + `CNAME` → vitacorexllc.com).
- Every push to `main` publishes the live site immediately — there is no staging step.
- GitHub Pages serves static files only: there are no server-side redirects. Moved pages are meta-refresh stubs with a canonical link and `noindex, follow`; do not describe them as 301s.
- `vercel.json` is inert (Vercel does not serve production). `render.yaml` is a secondary config.
- **Never push** to `main` or any remote branch, and never open or merge a PR, without the owner's explicit approval of the exact build.

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
