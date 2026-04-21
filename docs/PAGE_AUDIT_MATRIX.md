# VitaCoreX — Page Audit Matrix
_Authored: 2026-04-21 • Scope: all site pages + app surfaces_

Legend:
- ✅ Shipped
- 🟡 Planned in next increment
- ⛔ Known issue (see BUG_LOG)
- — Not applicable

## 1 • Marketing + content pages
| Page | Hero unified | Rail section | Legal boundary visible | Color audit | Contrast audit | Increment |
|------|-------------:|-------------:|-----------------------:|------------:|----------------:|----------:|
| index.html | ✅ (canonical) | ✅ tool shelf + legal boundary | ✅ | ✅ | ✅ | I1 shipped |
| corporate-legal-file-control.html | 🟡 | 🟡 | ✅ | ✅ | ✅ | I2 |
| revenue-recovery-workflow.html | 🟡 | 🟡 | ✅ | ✅ | ✅ | I2 |
| structured-case-intake.html | 🟡 | 🟡 | ✅ | ✅ | ✅ | I2 |
| additional-services.html | 🟡 | 🟡 | ✅ | ✅ | ✅ | I2 |
| pricing-and-engagement-tiers.html | 🟡 | 🟡 | ✅ | ✅ | ✅ | I2 |
| resources.html | 🟡 | 🟡 | ✅ | ✅ | ✅ | I2 |
| industries.html | 🟡 | 🟡 | ✅ | ✅ | ✅ | I2 |
| partners.html | 🟡 | — | ✅ | ✅ | ✅ | I2 |
| contact.html | fallback | — | ✅ | ✅ | ✅ | — |
| careers.html | fallback | — | — | ✅ | ✅ | — |
| privacy.html | 🟡 legal variant | — | native | ✅ | ✅ | I2 |
| terms.html | 🟡 legal variant | — | native | ✅ | ✅ | I2 |
| florida-small-claims-help.html | ✅ already teal | — | ✅ | ✅ | ✅ | — |
| auto-deal-review.html | ✅ already teal | — | ✅ | ✅ | ✅ | — |
| case-study-subscription-saas.html | 🟡 | — | ✅ | ✅ | ✅ | I2 |
| case-study-healthcare-network.html | 🟡 | — | ✅ | ✅ | ✅ | I2 |

## 2 • App pages
| Page | Hero variant | Dashboard rail | Main form preserved | Legal boundary | Increment |
|------|-------------:|---------------:|--------------------:|---------------:|----------:|
| app/contract-intelligence/ | 🟡 `--app` | 🟡 | must stay stacked | ✅ | I3 |
| app/immigration-forms/ | 🟡 `--app` | 🟡 | must stay stacked | ✅ | I3 |
| app/dealer-contract-check/ | 🟡 `--app` | 🟡 | must stay stacked | ✅ | I3 |
| app/private-lookup/ | 🟡 `--app` | 🟡 | must stay stacked | ✅ | I3 |
| app/deadline-calendar/ | 🟡 `--app` | 🟡 | must stay stacked | ✅ | I3 |

## 3 • Breakpoint coverage matrix
Tested breakpoints (Playwright + manual): `320 / 360 / 375 / 390 / 393 / 414 / 430 / 768 / 820 / 1024 / 1280 / 1366 / 1440 / 1536 / 1920`.

| Page | 320 | 390 | 430 | 768 | 820 | 1024 | 1280 | 1440 | 1920 | Status |
|------|-----|-----|-----|-----|-----|------|------|------|------|--------|
| index.html (post-I1) | planned | ✅ smoke | planned | ✅ smoke | planned | planned | planned | ✅ smoke | planned | I1 smoke done at 3 bp |
| corporate-legal-file-control.html | — | — | — | — | — | — | — | — | — | I2 |
| revenue-recovery-workflow.html | — | — | — | — | — | — | — | — | — | I2 |
| structured-case-intake.html | — | — | — | — | — | — | — | — | — | I2 |
| app/contract-intelligence/ | — | — | — | — | — | — | — | — | — | I3 |

Full breakpoint matrix fills in with each increment.

## 4 • Per-page structural items to validate
For every page on the rail-refactor list:
- Section order preserved.
- Total word count per section ≤ pre-refactor count (we're restructuring, not adding).
- No new H1.
- Every interactive rail card has a natural `<a>` / `<button>` — no divs-as-buttons.
- Carousel does not require scroll to see disclaimer.
- Form anchor `id` preserved: no broken deep-links.
- External outbound links keep `rel="noopener"` where present.

## 5 • Component usage heatmap (per page)
| Page | `.vcx-rail` | `.vcx-pinned-rail` | `.vcx-dashboard-rail` | `.vcx-tool-shelf` | `.vcx-proof-note` | `.vcx-legal-boundary` |
|------|:-:|:-:|:-:|:-:|:-:|:-:|
| index.html | planned I2 | planned I2 | planned I2 | ✅ I1 | planned I2 | ✅ I1 |
| corporate-legal-file-control.html | 🟡 | 🟡 | — | 🟡 | 🟡 | ✅ existing |
| revenue-recovery-workflow.html | 🟡 | 🟡 | 🟡 | — | 🟡 | ✅ existing |
| structured-case-intake.html | 🟡 | 🟡 | — | — | 🟡 | ✅ existing |
| additional-services.html | 🟡 | — | — | 🟡 | 🟡 | ✅ existing |
| pricing-and-engagement-tiers.html | 🟡 | — | 🟡 | — | 🟡 | ✅ existing |
| resources.html | 🟡 | — | — | 🟡 | — | ✅ existing |
| industries.html | 🟡 | — | — | 🟡 | 🟡 | ✅ existing |

## 6 • Known exceptions
- `app/immigration-forms/` and `app/deadline-calendar/` have complex form state — NOT to be rail-ified; only surrounding content is in scope.
- `case-study-healthcare-network.html` long-form narrative — keep single-column. Only KPI row may become a `.vcx-dashboard-rail`.
- `privacy.html` / `terms.html` MUST remain single-column for legal review.
