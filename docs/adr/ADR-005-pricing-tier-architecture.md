# ADR-005 — Pricing Tier Architecture

- **Status**: accepted
- **Date**: 2026-04-19 (accepted at P01 kickoff)
- **Phase**: P01 Pricing Reconciliation
- **Supersedes**: none
- **Obsidian**: [[Upgrade 2026-04/Phases/P01 Pricing Reconciliation]]

---

## Context

Audit 2026-04-18 identified two critical pricing conflicts:

1. **Contract Review**: `contract-review-service.html` shows Tier 1 $149 / Tier 2 $219. `additional-services.html` (Private Client lane) shows "starts from $349". Buyer sees contradiction.

2. **Immigration Packet**: `immigration-packet-review.html` shows $149 / $219. `additional-services.html` shows "starts from $649". Same mismatch.

Secondary gaps:
- LLC Formation price ($299) not published on dedicated `llc-formation-florida.html`
- Auto Deal rush add-on undefined
- Net Recovery Program (free pilot) vs. Controlled Operations Pilot (paid $8,500/mo) not clearly disambiguated
- Diagnostic Review ($2,500) referenced in brief but no dedicated page
- Hearing Attendance minimums inconsistent (1-hr in contract consult, 2-hr in small claims)
- Corporate Legal File Control has no published floor

Source: [[Research/Pricing Conflict Matrix]].

## Decision

Adopt a uniform 3-tier ladder for document services, with explicit disambiguation between free and paid pilots.

### Canonical ladder — document packets

| Service | Tier 1 Entry | Tier 2 Full | Tier 3 Advisory / Complex |
|---------|--------------|-------------|---------------------------|
| Contract Review | $149 | $219 | from $349 (custom scope, rush, multi-party) |
| Immigration Packet | $149 | $219 | from $649 (multi-form, RFE support, exhibit binding) |
| Auto Deal Review | $149 | $219 | same-day rush add-on +$49 |
| Small Claims | $149 | $219 | $725 managed to judgment / $110/hr hearing (2-hr min) |

### Canonical ladder — business formation

| Service | Base | Turnkey |
|---------|------|---------|
| LLC Formation | $299 | $2,500 (turnkey business opening bundle) |
| Business Plan | from $1,250 | custom |
| Location Analysis | from $495 | custom |

### Pilots (B2B)

- **Net Recovery Program** (free pilot) — qualified AR portfolios only; success-fee on recovered cash only; no setup fee; 90 days.
- **Controlled Operations Pilot** (paid) — $8,500/mo; broader scope (workflow + file control); not recovery-dependent; for portfolios that don't qualify for free pilot or need wider work.
- **Diagnostic Review** — $2,500 one-time; for operators who aren't ready for either pilot but want a scoped audit with a written brief.

### Consulting / advisory

- **Corporate Legal File Control** — from $3,500/mo retainer floor; custom scope on top.
- **Hearing / Consult Support** — $110/hr uniformly. Minimums: 1-hr consultation, 2-hr hearing block (block-booking).

### Tiering principles

1. Every service has at most 3 published tiers. Above Tier 3 is custom and routes to intake.
2. Every tier has a single canonical price quoted identically on every page.
3. Lane pages (Private Client Services, Solutions) quote the entry price (Tier 1) with a link to the detail page for higher tiers.
4. Rush add-ons are named and priced explicitly; never "call for pricing."
5. Schema.org `Offer` for every published tier. Custom tiers have no `Offer` (would imply a fixed price).

## Alternatives considered

### A) Single flat price per service ($199 / $249)
**Rejected**: kills the "starter for first buyers" effect of $149 and removes the upsell gradient for advisory work.

### B) Keep "starts from" language on lane pages
**Rejected**: the audit demonstrates this confuses buyers. Explicit tiers on both detail and lane pages.

### C) Separate page for every tier
**Rejected**: index bloat; SEO signal dilution.

## Consequences

### Positive
- Buyer sees the same number on every page.
- Rush add-on is a cash booster without implying custom quote.
- Clear laddering supports upsell narratives in checkout (P08).
- Memory MCP captures the decision so future ADRs can reference it.

### Negative
- 12 pages touched in P01 (`contract-review-service.html`, `immigration-packet-review.html`, `additional-services.html`, `llc-formation-florida.html`, `auto-deal-review.html`, `small-claims-documentation.html`, `pre-collection-pilot.html`, `solutions.html`, `index.html`, `corporate-legal-file-control.html`, `pricing-and-engagement-tiers.html`, plus translation JSON).
- Introducing "Diagnostic Review" $2,500 creates a new page to maintain.
- Rush add-on introduces a payment-time option that must be wired in P08 Stripe products.

### Reversible via
- Revert commit range on P01 (~15 commits)
- Keep pricing snapshot in this ADR for rollback reference

## Links

- Obsidian phase: [[Upgrade 2026-04/Phases/P01 Pricing Reconciliation]]
- Obsidian research: [[Upgrade 2026-04/Research/Pricing Conflict Matrix]]
- Audit source: [[Upgrade 2026-04/Research/Site Audit 2026-04-18]]
- Blocks: ADR-006 (nav), ADR-011 (checkout)
