# Architecture Decision Records (ADR)

Load-bearing decisions for the VitaCoreX website and API live here.

## Format

Every ADR:
- filename: `ADR-NNN-<kebab-slug>.md`
- status: `proposed` / `accepted` / `superseded-by-ADR-XYZ`
- sequential numbering, do not skip
- linked from the matching Obsidian phase note

## Current ADRs

| ID | Title | Status | Phase | Obsidian |
|----|-------|--------|-------|----------|
| ADR-001 | (TBD — historical) | — | pre-upgrade | — |
| ADR-002 | (TBD — historical) | — | pre-upgrade | — |
| ADR-003 | (TBD — historical) | — | pre-upgrade | — |
| ADR-004 | (TBD — historical) | — | pre-upgrade | — |
| ADR-005 | Pricing Tier Architecture | accepted | P01 | `Upgrade 2026-04/Phases/P01 Pricing Reconciliation` |
| ADR-006 | Navigation B2B/B2C Split | accepted | P02 | `Upgrade 2026-04/Phases/P02 Navigation Split B2B B2C` |
| ADR-007 | Claims Inventory Classification | proposed | P04 | `Upgrade 2026-04/Phases/P04 Proof and Claims Audit` |
| ADR-008 | Sample Deliverable Standards | accepted | P03 | `Upgrade 2026-04/Phases/P03 Sample Deliverables` |
| ADR-009 | Legal Disclaimer Architecture | planned | P05 | `Upgrade 2026-04/Phases/P05 Legal Language Hardening` |
| ADR-010 | Partner Channel Terms | planned | P07 | `Upgrade 2026-04/Phases/P07 B2B Outbound and Partners` |
| ADR-011 | Checkout Architecture (Stripe) | planned | P08 | `Upgrade 2026-04/Phases/P08 B2C Checkout and Rush` |
| ADR-012 | Blog Architecture | planned | P09 | `Upgrade 2026-04/Phases/P09 SEO Content Clusters` |
| ADR-013 | Attribution Model (GA4 + CRM) | planned | P10 | `Upgrade 2026-04/Phases/P10 Analytics and CRM` |
| ADR-014 | U.S.-wide Positioning Pivot | proposed | P11 | `Upgrade 2026-04/Phases/P11 US-wide Positioning Pivot` |

## Writing an ADR

```markdown
# ADR-NNN — <title>

- **Status**: proposed
- **Date**: YYYY-MM-DD
- **Phase**: P0X

## Context
<what problem we're solving, what audit finding triggered it>

## Decision
<what we picked>

## Alternatives considered
- <A> — rejected because <reason>
- <B> — rejected because <reason>

## Consequences
- positive: …
- negative: …
- reversible via: …

## Links
- commit: <sha>
- obsidian: [[Phases/P0X …]]
```

## Gate requirement

Every phase in [[Upgrade 2026-04/00 Master Plan]] that produces a load-bearing decision MUST merge its ADR before closing.
