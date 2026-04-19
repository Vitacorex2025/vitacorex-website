# ADR-006 — Navigation B2B / Private Clients Split

- **Status**: accepted
- **Date**: 2026-04-19 (accepted at P02 kickoff)
- **Phase**: P02 Navigation Split B2B / Private Clients
- **Supersedes**: none
- **Depends on**: ADR-005 (Pricing Tier Architecture)
- **Obsidian**: [[Upgrade 2026-04/Phases/P02 Navigation Split B2B B2C]]

---

## Context

Audit 2026-04-18 §3 identified a dual-door architecture failure:

1. **Audience collision in primary nav.** CFO-language ("AR leakage," "controlled operations," "revenue recovery workflow") sits in the same header as B2C fixed-fee packets ($149 contract review, $149 auto deal review). The two buyer types have opposite mental models and bounce off each other's copy.
2. **B2B buyers perceive a "site for everyone."** That reads as unfocused and drops enterprise trust.
3. **B2C buyers hit "institutional infrastructure" copy first.** That reads as "not for me" and increases bounce.

The conversion cost is real — audit §3.2 estimates header collision as the top non-pricing bounce driver on `index.html`, `about.html`, and every service page that carries the shared header.

**Strategic frame (locked, not re-litigated):**

- Memory note `feedback_vitacorex_funnel_split.md` (2025-12): "B2B dominant, Private Clients secondary lane. Dual-entry cards on home — NOT splash/image swap. Label 'Private Clients' (not 'Individuals')."
- User directive 2026-04-19: home dual-entry card section stays pixel-identical during P02.

**Blocking constraint**: P02 cannot ship until ADR-005 has locked pricing (done 2026-04-19 at `b149484..8cf2e39`) — otherwise dual-door nav would point at inconsistent price lists.

---

## Decision

Adopt a **dual-door primary navigation** with explicit audience labels, URL preservation, and a body-level audience attribute for every page.

### Primary navigation — Header

**Lane A — "For Companies" (B2B, dominant weight)**

| Nav item | Target | Notes |
|----------|--------|-------|
| Revenue Recovery / AR Consulting | `revenue-recovery-workflow.html` | B2B entry |
| Corporate Legal File Control | `corporate-legal-file-control.html` | retainer from $3,500/mo (ADR-005 §9) |
| Net Recovery Program — free pilot | `pre-collection-pilot.html` | FREE pilot, success-fee only |
| Controlled Operations Pilot — $8,500/mo | `solutions.html` | paid pilot |
| Small Claims & Civil Packet Desk | `small-claims-documentation.html` | B2B variant of small claims |
| Industries | `industries.html` | vertical entry points |
| Pricing | `pricing-and-engagement-tiers.html` | unified matrix hub (P01 Step 1.11) |
| Sample Deliverables | `sample-deliverable.html` | P03 expands |
| Security & Procurement | `security-and-compliance.html` | enterprise due-diligence |

**Lane B — "For Private Clients" (B2C, secondary weight)**

| Nav item | Target | Notes |
|----------|--------|-------|
| Contract Review | `contract-review-service.html` | 3-tier $149/$219/from $349 |
| Immigration Packet | `immigration-packet-review.html` | 3-tier $149/$219/from $649 |
| Auto Deal Review | `auto-deal-review.html` | $149/$219 + $49 rush |
| Florida Small Claims | `florida-small-claims-help.html` | B2C-localized entry |
| LLC Formation | `llc-formation-florida.html` | $299 / $2,500 Turnkey |
| Business Plan | `business-plans.html` | from $1,250 |
| Location Analysis | `location-analysis.html` *(P09 creates)* | from $495 |
| Turnkey Business Opening | `turnkey-opening.html` *(P09 creates)* | $2,500 bundle |

**Lane C — shared utility (same on both doors)**

About · Resources · Contact · Careers

### Primary navigation — Footer (4 columns)

| Column 1 — Companies | Column 2 — Private Clients | Column 3 — Company | Column 4 — Legal |
|----------------------|----------------------------|--------------------|-----------------:|
| Revenue Recovery | Contract Review | About | Privacy Policy |
| CLFC | Immigration Packet | Careers | Terms |
| Net Recovery (free) | Auto Deal Review | Contact | Cookies |
| Controlled Ops ($8,500/mo) | Florida Small Claims | — | Secure Coordination |
| Small Claims Desk | LLC Formation | — | Sub-processors |
| Industries | Business Plan | — | Security & Compliance |
| Pricing | Location Analysis | — | — |
| Sample Deliverables | Turnkey Opening | — | — |
| Security & Procurement | — | — | — |

### Body-level audience attribute

Every page sets `body[data-audience="b2b" | "b2c" | "shared"]` at render time.

- `b2b`: solutions, CLFC, revenue-recovery, pre-collection-pilot, small-claims-documentation, industries, security-and-compliance, sample-deliverable, case-study-*.html, pricing-and-engagement-tiers (dominant lane rendering)
- `b2c`: contract-review-service, immigration-packet-review, auto-deal-review, florida-small-claims-help, llc-formation-florida, business-plans, additional-services, turnkey-opening, location-analysis, diagnostic-review
- `shared`: index, about, contact, careers, resources, 404, privacy/terms/cookies, security docs

This lets CSS and JS adapt per-page without URL changes:
- Lane-specific accent colors in the header stripe
- Audience-tagged breadcrumbs
- GA4 + CRM attribution (deferred to P10)

### URL preservation rule

**No URL changes in P02.** Every nav item points at an existing slug (or a P03/P09-future slug). SEO continuity preserved. If a target page doesn't exist yet (business-plans, location-analysis, turnkey-opening), the nav item routes to the lane page as fallback until the dedicated page ships in P09.

### Labels (locked)

- "For Companies" / "For Private Clients" — primary lane names
- "Private Clients" (never "Individuals", "Consumers", "Retail")
- "Companies" (never "Enterprise-only", "Corporate-only" — audit says companies <100 FTE are majority of B2B pipeline)

### Home page — dual-entry cards

**Home cards stay pixel-identical.** Visual diff test in Step 2.5 is a regression gate, not a creative pass. Per memory note + 2026-04-19 user directive, no splash, no "choose audience" blocker, no image swap. The existing "Для кого вы пришли? / Who are you coming for?" section is canonical.

---

## Alternatives considered

### A) Single flat nav (status quo)
**Rejected**: this is exactly the conversion bug the audit identified. Shipping nothing keeps the leak.

### B) Splash screen with audience picker
**Rejected**: user directive 2025-12 + 2026-04-19 explicit. Splash screens tank SEO and frustrate return visitors. Memory note `feedback_vitacorex_funnel_split.md` locks this.

### C) Subdomain split (companies.vitacorexllc.com / private.vitacorexllc.com)
**Rejected**: costs SEO domain authority, splits analytics, doubles SSL/DNS operational surface. Core audit finding was IA confusion, not domain confusion.

### D) Rename "Private Clients" to "Individuals"
**Rejected**: "Private Clients" reads as dignified / premium. "Individuals" reads bureaucratic and signals "basic tier." Locked in memory note.

### E) Equal visual weight for both lanes
**Rejected**: revenue mix + pipeline data from audit say B2B is ~70% of committed revenue. Equal weight would misrepresent the business. B2B stays dominant lane.

### F) Merge shared utility (About/Contact/Careers) into one lane
**Rejected**: these are genuinely audience-agnostic. Duplication into both lanes would signal fragmentation.

---

## Consequences

### Positive
- B2B buyers land on enterprise-trust signals (CLFC, Controlled Ops, Industries, Security) without crossing B2C packet language.
- B2C buyers land on fixed-fee product cards without crossing CFO vocabulary.
- Body `data-audience` unlocks per-audience styling and analytics downstream (P10).
- Footer 4-column structure gives legal/company columns their own space — scannable.
- URL preservation means no SEO loss, no redirect chains.

### Negative
- ~60 HTML pages need the new header + footer injected (template pattern via per-page include or a shared header script).
- `data-audience` attribute needs maintenance — every new page must declare it.
- Two future pages (`location-analysis.html`, `turnkey-opening.html`) are referenced in Lane B; until P09 creates them, nav items fall back to lane page anchors.

### Reversible via
- Revert P02 commit range
- Body attribute is additive — removal is safe
- Nav template can be rolled back to single-dropdown pattern without URL migration

---

## Links

- Obsidian phase: [[Upgrade 2026-04/Phases/P02 Navigation Split B2B B2C]]
- Memory note: `feedback_vitacorex_funnel_split.md`
- Audit source: [[Upgrade 2026-04/Research/Site Audit 2026-04-18]] §3
- Depends on: ADR-005 (Pricing Tier Architecture) — accepted 2026-04-19
- Unblocks: P03 Sample Deliverables (ADR-008), P06 Google Business Profile, P08 Checkout (ADR-011)
- Related copy scrubs in this phase: Step 2.7 (home hero plain language), Step 2.8 (remove self-referential SEO copy)
