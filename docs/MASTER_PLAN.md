# VitaCoreX — Master Structural + UX Plan
_Authored: 2026-04-21 • Owner: Pink Pixel / VitaCoreX_

## 1 • Scope
This plan governs a multi-increment structural + QA program that spans:

- Dense marketing pages
- All application (app/) surfaces
- Hero unification across the site
- Heading / card / form / calculator alignment
- Color discipline (no drift from homepage palette)
- Contrast discipline (no dark-on-dark, no light-on-light)
- Documentation refresh

## 2 • Delivery Model
The work is shipped in **four increments** so that no ship leaves the site half-upgraded:

| # | Title | What ships | Status |
|---|-------|-----------|--------|
| I1 | Rail + Hero system foundation | `vcx-rails.css`, `vcx-rails.js`, hero modifiers, reference section on homepage, documentation set | **Shipped — this commit** |
| I2 | Marketing page rails | Refactor of dense grid sections on 8 marketing pages into `.vcx-rail-section` components, preserving legal boundary + disclaimers | Planned |
| I3 | App page rails | Refactor app/ pages (contract intelligence, immigration forms, dealer review, private lookup, deadline calendar) into rail + dashboard layouts | Planned |
| I4 | Alignment + breakpoint polish | Heading / form / calculator alignment at 15+ breakpoints; final QA matrix | Planned |

Each increment ships behind the **additive-first** rule: new classes, new components, new docs. No existing working behavior is removed until the replacement is proven.

## 3 • Hard Constraints (apply to every increment)
1. **Color system is frozen.** The homepage palette is the single source of truth:
   - Brand teal: `#2D8A82`
   - Brand teal hover: `#1A4F4A`
   - Deep navy-teal: `#0F2F2C`
   - Accent: `#5BC4B8` / `#5BBAA7`
   - Ink: `#1A2F2A` / body `#2E4F46` / muted `#5E6C7B`
   - Parchment: `#EEE9DE` • Canvas: `#F4F7F6`
   - Amber (warnings only): `#9A6A20` / `#D4A853`
2. **Contrast.** No dark text on dark background. No light text on light background. State variants (hover / focus / disabled / placeholder) obey the same rule.
3. **Legal integrity.** Legal boundary language (not a law firm, not a licensed collection agency, no legal advice, no debt collection) must be visible on every page where VitaCoreX service claims appear. Disclaimers must NEVER be hidden inside a carousel/rail beyond the first visible slide.
4. **Forms stay forms.** No main form or calculator becomes a carousel slide.
5. **No new JS libraries.** Rails are vanilla JS. Hero animation is vanilla.
6. **Respect `prefers-reduced-motion`.** All scroll/transform animations collapse.
7. **Breakpoint floors.** Rails must work at 390 px, 430 px, 768 px, 1440 px minimum — no horizontal overflow, no clipped text, no unreadable states.
8. **SEO-accessible DOM.** Rail contents render in the DOM at load; they are not JS-hydrated.
9. **Keyboard first.** Rails, shelves, and pinned sections are keyboard-navigable with `Arrow`, `Home`, `End`.

## 4 • Component Contracts (I1 — shipped)
See `DESIGN_SYSTEM_LAYOUT_RULES.md` for the full class contract. Shipped in I1:

- `.vcx-rail-section` • `.vcx-rail-section--dark` • `.vcx-rail-section--parchment` • `.vcx-rail-section--teal`
- `.vcx-rail-head` • `.vcx-rail-head--center`
- `.vcx-rail` • `.vcx-rail__viewport` • `.vcx-rail__track`
- `.vcx-rail-card` • `.vcx-rail-card--dark`
- `.vcx-rail-btn` • `.vcx-rail-progress`
- `.vcx-pinned-rail` (with sticky + scroll-drive fallback on mobile)
- `.vcx-dashboard-rail`
- `.vcx-tool-shelf`
- `.vcx-proof-note` • `.vcx-legal-boundary`
- Hero modifiers: `.vcx-hero--compact` • `.vcx-hero--app` • `.vcx-hero--legal` (applied on top of `.vcx-hero-2`)
- Fallback hero: `.vcx-hero` for legacy pages

## 5 • I2 — Marketing Page Rails (Planned)
Pages:
- `index.html` (reference already shipped; extend to testimonials, operator-diagnostic, examples)
- `corporate-legal-file-control.html`
- `revenue-recovery-workflow.html`
- `structured-case-intake.html`
- `additional-services.html`
- `pricing-and-engagement-tiers.html`
- `resources.html`
- `industries.html`

Refactor patterns:
- Dense 6+ card grids → `.vcx-rail` with keyboard + progress bar.
- 3-step / 4-step numbered processes → `.vcx-pinned-rail` with dots (not forced scroll-drive by default — opt-in via `data-scroll-drive="true"`).
- KPI row → `.vcx-dashboard-rail` (mobile scroll; desktop centered).
- Quick-link strip → `.vcx-tool-shelf`.

## 6 • I3 — App Page Rails (Planned)
Apps:
- `app/contract-intelligence/`
- `app/immigration-forms/`
- `app/dealer-contract-check/`
- `app/private-lookup/`
- `app/deadline-calendar/`

Refactor patterns:
- Keep **main form / calculator** as a stable stacked layout.
- Convert supporting content (feature lists, "what you get", example outputs) into rails.
- Keep all state banners + legal boundary + disclaimers above-the-fold on first render.

## 7 • I4 — Alignment + Breakpoint QA (Planned)
Full matrix lives in `PAGE_AUDIT_MATRIX.md`. At minimum:
- All headings left-aligned or explicitly centered via `.vcx-rail-head--center`; no ad-hoc `text-align` hacks.
- Card content vertically aligned `flex-start`; CTAs pin to bottom via `margin-top:auto`.
- Calculator inputs/labels vertically aligned with explicit grid / flex.
- No `position:absolute` on alignment-critical elements.
- Forbidden alignment hacks documented.

## 8 • Open Questions / Risks
- **Reduced-motion fallback on pinned rails:** verified by collapsing sticky and disabling the translate animation. Test needed on Safari iOS 16 ≤ 17 where sticky + will-change has historically misbehaved.
- **Per-page i18n keys:** new `data-page="quickaccess_*"` keys are introduced on the homepage tool shelf. These need to be added to `assets/js/shell-i18n.js` dictionaries for ru/es. Tracked in `BUG_LOG.md`.
- **Playwright file:// blocked:** local verification runs via `python -m http.server`. Tracked in `QA_TEST_REPORT.md`.

## 9 • Definition of Done (per increment)
- Visual regression: homepage unchanged above rail section; no layout shifts measured.
- Contrast: all new surfaces pass WCAG AA for normal text on both light and dark variants.
- Keyboard: rail is fully operable from a keyboard.
- SEO: all rail card content is in the static DOM.
- Legal: scope reminder visible on every surface that introduces a service claim.
- CI: IndexNow + QA CTA audit + Pages build workflows green.
