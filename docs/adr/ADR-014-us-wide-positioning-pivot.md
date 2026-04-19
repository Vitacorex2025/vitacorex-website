# ADR-014 — U.S.-wide Positioning Pivot

- **Status**: proposed (draft during 2026-04-19 audit intake; flips to accepted at P11 kickoff)
- **Date**: 2026-04-19
- **Phase**: P11
- **Supersedes**: none (ADR-009 is Legal Disclaimer Architecture under P05 — unrelated and retained)
- **Depends on**: ADR-006 (navigation IA) + ADR-009 (legal disclaimer contract — delivered by P05)

## Context

VitaCoreX's current positioning defaults to Florida:

- Hero eyebrow on `index.html` reads `"Tampa, FL · For companies and private clients"` (shipped in P02 Step 2.7 `964b6f9`).
- Five geo pages are Florida-scoped by URL: `revenue-recovery-florida.html`, `revenue-recovery-miami.html`, `revenue-recovery-orlando.html`, `revenue-recovery-tampa.html`, `immigration-services-tampa.html`.
- Service pages that are genuinely state-scoped (small-claims, LLC, Sunbiz) carry Florida-specific procedure language without an explicit "Florida only" boundary.
- The default UPL disclaimer is written against Florida Chapter 454 and reads as if Florida were the only operating state.
- Footer language implies Florida market scope rather than vendor address.

The 2026-04-19 site audit (§5) argues this self-filters VitaCoreX to roughly 6% of U.S. GDP (Florida's share). The services we actually sell decompose as:

| Service category | Jurisdictional reality |
|---|---|
| AR consulting + counsel-ready packet organization | National — document organization is not legal practice |
| Immigration packet evidence organization | Federal — USCIS forms are the same in every state |
| Contract review (non-advice, document preparation) | National — we organize and annotate, we do not render legal opinions |
| Auto-deal review | National — buyer-side document review, no state bar nexus |
| Small-claims chronology + documentation | **State-scoped** — state civil procedure differs; Florida-only at launch |
| LLC formation + Sunbiz filing | **State-scoped** — Florida Sunbiz is Florida-only; other states use different Secretaries of State |
| Business plan + turnkey opening | National — document + narrative work |

Three of seven categories are state-scoped; four are jurisdictionally neutral at the document-preparation layer.

The opposite risk — **unauthorized practice of law** (UPL) — grows with every state in the implied reach. Each state has its own UPL statute; the document-preparation safe harbor that insulates VitaCoreX in Florida (Chapter 454 + Bar opinions) does not automatically extend to California, New York, or Texas. Even where document preparation is legal, disclaimer wording must be state-neutral, not state-specific, to avoid asymmetric exposure.

## Decision

**Pivot brand positioning default to U.S.-wide, with explicit state-scoped carve-outs.**

Four-layer rule:

### 1. What becomes nation-wide (default)

- Brand voice, home hero, footer market language
- AR consulting pages (`revenue-recovery-workflow.html`, `pre-collection-pilot.html`, `solutions.html`, `corporate-legal-file-control.html`, `industries.html`, `industry-*.html`, `case-study-*.html`)
- Immigration packet pages (`immigration-packet-review.html`, `i-130-petition.html`, `i-485-adjustment.html`, `n-400-naturalization.html`, `immigration-packet-review.html`)
- Contract review, auto-deal, business plan, additional services
- Pricing hub (`pricing-and-engagement-tiers.html`), samples library (`sample-deliverable.html` + `/samples/*.html`), proof/evidence pages
- Security / procurement surface

### 2. What stays state-scoped (Florida only)

- `florida-small-claims-help.html` — Florida civil small-claims procedure
- `small-claims-documentation.html` — corporate Florida small-claims (UPL safe harbor explicitly Florida)
- `llc-formation-florida.html` — Sunbiz-specific
- `immigration-services-tampa.html` — scheduling/local logistics only (packet service itself is national via `immigration-packet-review.html`)

Each of these four pages carries a visible "Florida only — other states not served by this product. [Future states: interest list link]" banner at top of body. The banner is rendered by a new component `vcx-state-banner` (CSS + translations — built in P11 Step 11.6).

### 3. Disclaimer rewrite — state-neutral default

The default UPL disclaimer rewrites from:

> *"VitaCoreX is not a law firm. We do not provide legal advice. Florida residents should consult a licensed Florida attorney for legal matters."*

to:

> *"VitaCoreX is not a law firm and does not provide legal advice in any state. We prepare, organize, and annotate documents at the direction of the client. Clients requiring legal advice should consult a licensed attorney in their jurisdiction."*

The state-scoped pages (from §2 above) retain Florida-specific disclaimer variants that call out Florida Chapter 454 + Florida civil procedure explicitly.

P11 Step 11.3 applies this rewrite site-wide. P05 ADR-009 (Legal Disclaimer Architecture) provides the canonical disclaimer template; ADR-014 selects state-neutral as the default variant.

### 4. Geo pages — role pivot, URL preservation

The five geo pages keep their URLs and canonical tags (no 301s, no index drops). Their role shifts:

**Before** (implicit): *"This is where VitaCoreX operates."*

**After**: *"This is a local SEO entry point into a national service. Local framing is one paragraph; the rest of the page is the national service voice."*

Each geo page gains a single "Local context" paragraph unique to its market (e.g., Miami healthcare density, Orlando hospitality AR patterns, Tampa logistics corridor). The H1, lead paragraphs, CTAs, disclaimers, and JSON-LD `serviceArea` shift to national.

### 5. Hero de-Floridization + footer-as-address

- Hero eyebrow (`home_hero_eyebrow`) rewrites from `"Tampa, FL · For companies and private clients"` to `"For companies and private clients across the United States"` (EN) + EN/RU/ES parity.
- Footer preserves vendor address (Tampa) as an `<address>` element — this is operationally required for SLA contact and procurement verification.
- JSON-LD `Organization.address` stays at the vendor address; `Organization.areaServed` adds `{"@type":"Country","name":"United States"}` (where absent).

### 6. Future-state rollout contract

Adding a second state (e.g., Texas) requires:
1. UPL research for that state + disclaimer variant reviewed
2. New state-scoped pages if small-claims / LLC equivalents are offered
3. State banner text updated on old state-scoped pages to reflect expanded coverage
4. Footer vendor-address stays; `Organization.areaServed` stays at United States (already national)
5. No changes required to hero, geo pages, or disclaimers (those are already national)
6. Playbook documented in `docs/positioning/state-rollout-playbook.md` (P11 Step 11.7)

## Alternatives considered

**Alt A — Stay Florida-first**. Rejected because self-filters TAM to ~6% of U.S. GDP. The service is deliverable nationally at the document layer; positioning should match reality.

**Alt B — Add state-by-state rollout pages (Texas-specific, California-specific, etc.) before pivoting brand**. Rejected because the brand remains Florida-anchored until every state page ships — creating the same self-filter with higher cost. National-default-plus-state-carve-out is cleaner.

**Alt C — Pivot fully national with no state-scoped carve-outs** (drop small claims / LLC / Sunbiz state specificity). Rejected because those services genuinely require state-specific procedure knowledge. Removing the scope creates UPL exposure in the states where we implicitly reach but cannot deliver.

**Alt D — Rebrand the geo pages as retired (301 to nearest national equivalent)**. Rejected because geo pages have SEO equity and local-search signal we cannot afford to throw away. The role pivot (§4) preserves equity while correcting the positioning.

**Alt E — Split into two brands (VitaCoreX Florida + VitaCoreX National)**. Rejected as massive additional complexity for no material gain over §2's four-layer carve-out.

## Consequences

**Positive**:
- National TAM unlocked at the brand layer
- UPL exposure stays bounded by explicit state-scoped carve-outs
- Geo page SEO equity preserved via URL + canonical retention
- Disclaimer standardization reduces per-page drift risk
- Future-state rollout playbook makes expansion a templated operation

**Negative**:
- Florida-specific SEO intent ("Tampa AR consulting", "Miami small claims") may see partial ranking adjustment as pages shift to national framing with local paragraph
- More disclaimer variants to maintain (national default + 1 Florida variant for state-scoped pages); mitigated by ADR-009 template architecture
- State-banner component adds a new UI surface to maintain + translate EN/RU/ES
- Operations team must internalize "we serve nationally at the document layer; state-scoped services are Florida-only" as the messaging rule for email, outbound, and sales conversations

**Reversible via**: revert P11 commits + restore Florida-first disclaimer variant as default + drop state banner component. Geo page URL preservation means SEO reversibility is clean.

## Links

- commit: ADR file merged as `ADR-014` draft on 2026-04-19 alongside audit intake; accepted flip deferred to P11 kickoff
- obsidian: [[Upgrade 2026-04/Phases/P11 US-wide Positioning Pivot]]
- upstream: `docs/adr/ADR-006-navigation-b2b-b2c-split.md` (nav IA) · `docs/adr/ADR-009-legal-disclaimer-architecture.md` (disclaimer contract, delivered by P05)
- audit source: [[Upgrade 2026-04/Research/Site Audit 2026-04-19]] §5
- downstream: P12 (homepage-simplification inherits de-Floridized hero) · P13 (canonical discipline applies to geo-page role pivot) · P14 (state banner responsive behavior)

## Appendix A — State-neutral disclaimer variants (locked)

**Default (national pages)**:
> *"VitaCoreX is not a law firm and does not provide legal advice in any state. We prepare, organize, and annotate documents at the direction of the client. Clients requiring legal advice should consult a licensed attorney in their jurisdiction."*

**Florida-scoped pages (small claims, LLC, Sunbiz)**:
> *"VitaCoreX is not a law firm and does not provide legal advice. This service is scoped to Florida civil procedure / Florida Sunbiz filings and is not available in other states. Clients requiring legal advice should consult a licensed Florida attorney."*

**Debt-collection-adjacent pages (AR consulting, net recovery pilot)** — retained from ADR-009 P05 scope:
> *"VitaCoreX is not a collection agency. We do not contact debtors on behalf of creditors and do not take assignment of debt. Our engagements are limited to AR documentation, workflow mapping, and counsel-ready file preparation."*

All three variants carry EN/RU/ES translations via `vcx-translations.js` under keys `disclaimer_upl_national_*`, `disclaimer_upl_fl_scoped_*`, `disclaimer_not_collection_*`.

## Appendix B — State-banner copy (locked)

EN: *"This service is available in Florida only. Other states are not currently served. [Interested in rollout to your state? →]"*

RU: *"Эта услуга доступна только во Флориде. Другие штаты пока не обслуживаются. [Заинтересованы в расширении на ваш штат? →]"*

ES: *"Este servicio está disponible solo en Florida. Otros estados no son atendidos actualmente. [¿Interesado en expansión a su estado? →]"*

Rendered by `assets/css/vcx-state-banner.css` + translation keys `state_banner_fl_only_*` + `state_banner_rollout_cta_*`.
