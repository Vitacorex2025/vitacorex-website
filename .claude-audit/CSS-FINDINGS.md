# VitaCoreX CSS Audit — Findings

Scope: `C:\Users\sergz\OneDrive\Desktop\vitacorex-website`
Audit target: warm/beige/cream/yellow/gold/tan colors, white-on-dark contrast failures,
and heading alignment. `#FAFCFC` and similar cool near-neutrals are intentionally **not**
flagged.

---

## 1. Approved Home Palette (source of truth)

Derived from `index.html <head>` + `assets/css/styles.css :root` (line 2) and the extended
token sets in `styles.css`, `vcx-tokens.css`, `ui-shell.css`, `private-lookup.css`.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#eef5fb` | Page canvas (cool blue-tint) |
| `--bg2` | `#f8fbfe` | Alt canvas / card |
| `--ink` | `#0e2036` | Primary text on light |
| `--muted` | `#5b6a7f` | Secondary text |
| `--line` | `rgba(14,32,54,.10)` | Hairlines |
| `--navy` | `#163656` | Brand deep blue |
| `--gold` | `#2D8A82` | **LEGACY NAME — VALUE IS TEAL** (primary accent) |
| `--glass` | `rgba(255,255,255,.58)` | Translucent surface |
| `--glass2` | `rgba(255,255,255,.76)` | Translucent surface alt |
| `--shadow` | `0 18px 60px rgba(7,22,42,.12)` | Elevation |
| `--lux-gold` | `#7ED8C3` | **LEGACY NAME — VALUE IS MINT** (premium accent) |
| `--vcx-cream` | `#F4F7F6` | **LEGACY NAME — VALUE IS COOL PARCHMENT** (gray-green) |
| `--vcx-gold-soft` | `#5BBAA7` | **LEGACY NAME — VALUE IS MINT** |
| `--accent-gold` (tokens) | `#5BBAA7` | **LEGACY NAME — VALUE IS MINT**, commented "rare premium accent" |
| `--vcx-gold` (ui-shell) | `#2D8A82` | **LEGACY NAME — VALUE IS SITE TEAL** |

Legacy `--*-gold*`, `--*-amber`, `--*-cream` tokens are kept for API stability and all
resolve to teal / mint / cyan / cool gray-green values — they are **not** banned.

---

## 2. BANNED warm/beige/cream colors (hard-coded, bypassing tokens)

Matches against `#FBF8F3, #F6F2EA, #EFE9DC, #F0EBE1, #F1EBDD, #FFC107, #FFD700, #DAA520,
#D4AF37, #D2B48C`, and CSS named colors `beige, wheat, khaki, gold, yellow, tan,
burlywood, goldenrod, cornsilk, bisque, moccasin, navajowhite, peachpuff, lemonchiffon,
papayawhip, blanchedalmond, antiquewhite, oldlace, lightyellow`.

| # | File | Line | Selector | Offending value | Fix |
|---|---|---|---|---|---|
| 1 | `assets/css/vcx-premium-2.css` | 1016 | `.vcx-bg-lines` | `background-color: #F0EBE1;` (warm cream, comment reads "Warm cream with diagonal fine lines") | Replace with `var(--vcx-cream)` → `#F4F7F6` (cool parchment) |
| 2 | `assets/css/vcx-premium-2.css` | 2345 | `.vcx-routes` | `linear-gradient(180deg, #F4F7F6 0%, #EFE9DC 100%)` — stop 2 is warm beige | Replace `#EFE9DC` stop with `#E7EEEC` (cool) or second `--vcx-cream` stop |
| 3 | `assets/css/vcx-premium-2.css` | 2460 | `.vcx-route--primary` | `linear-gradient(180deg, #FFFFFF 0%, #F1EBDD 100%)` — stop 2 is warm cream | Replace `#F1EBDD` with `#F4F7F6` / `#EDF4F1` |
| 4 | `assets/css/vitacorex-public.css` | 841 | `body[data-surface="soft"] .disclosure` | `background:#fcfbf8;` (marginally warm off-white R252 G251 B248) | Replace with `#FAFCFC` or `var(--bg2)` |

**Total: 4 banned hits.** No rgba warm triplets, no CSS named warm colors found.

---

## 3. Contrast failures (white-on-dark at low opacity)

Pattern: `color: rgba(255, 255, 255, X)` with `X < 0.6` on a dark surface. At 12-14px
(≈ 0.72-0.88rem) these fail WCAG AA (4.5:1 body). Values at 0.4-0.5 fail AAA at any size.

| # | File | Line | Selector | Value | Size | Notes |
|---|---|---|---|---|---|---|
| 1 | `assets/css/vcx-sample.css` | 52 | `.vcx-sample-topnav__brand` | `rgba(255,255,255,.38)` | small brand | On `#0b2143` navy — raise to ≥ 0.78 |
| 2 | `assets/css/vcx-app-premium.css` | 371 | `.vcx-footer .footer-disc` | `rgba(255,255,255,0.55)` | 0.78rem | Disclaimer copy — raise to ≥ 0.78 |
| 3 | `assets/css/vcx-app-premium.css` | 379 | `.vcx-footer .footer-copy` | `rgba(255,255,255,0.4)` | 0.75rem | Copyright line — raise to ≥ 0.78 |
| 4 | `assets/css/vcx-lookup-premium.css` | 438 | `.vcx-metric-text` | `rgba(255,255,255,0.45)` | small | Numeric label — raise to ≥ 0.72 |
| 5 | `assets/css/vcx-premium-2.css` | 515 | `.vcx-stats-2 .vcx-stat-2__label` | `rgba(255,255,255,0.5)` | 0.65rem | Stat label — raise to ≥ 0.78 or enlarge |
| 6 | `assets/css/vcx-premium-2.css` | 1243 | `.vcx-lang-switch .lang-btn` | `rgba(255,255,255,0.5)` | button label | Interactive — raise to ≥ 0.78 |
| 7 | `assets/css/vcx-premium-2.css` | 1281 | `.vcx-metric-text` | `rgba(255,255,255,0.45)` | 0.72rem | Duplicate of #4 — raise to ≥ 0.72 |
| 8 | `assets/css/vcx-footer.css` | 109 | `.footer-state-tools__label` | `rgba(255,255,255,0.58)` | 0.72rem | Eyebrow label — raise to ≥ 0.72 |

**Total: 8 contrast hits.** All are white-on-dark (footer / top-nav / stat strips).
Recommended remediation: standardize `var(--text-muted-on-dark)` = `rgba(255,255,255,0.78)`
for body and `0.70` for uppercase eyebrow labels, then replace.

---

## 4. Heading alignment bugs

Checked: `.vcx-section-head`, `.vcx-eyebrow`, global `h1 / h2 / h3` rules, and per-page
`.pcp-sec-head`, `.scd-sec-head` scoped rules. Cross-referenced with
`pre-collection-pilot.html` and `small-claims-documentation.html`.

| File | Line | Selector | Finding |
|---|---|---|---|
| `pre-collection-pilot.html` | 135-138 | `body[data-vcx-page="pre-collection"] .pcp-sec-head` | `text-align: center !important` — already fixed |
| `small-claims-documentation.html` | 42 | `.scd-sec-head` | `text-align: center` — already correct |
| `assets/css/vcx-premium-fx.css` | 131-148 | `.vcx-section-head h2` | uses `display: inline-block`, no `text-align: left` forcing — OK |
| `assets/css/vcx-redesign.css` | 2116 | `.section-head` | `background: transparent !important` only, no alignment override — OK |

Remaining `text-align: left` rules in the codebase belong to `table th`, hero content
columns (`vcx-hero-cybercore`, `vcx-hero-2__content`), footer columns, review queue, and
sample gate — all appropriate for their selectors.

**Total: 0 alignment bugs to flag.**

---

## 5. Summary counts

| Category | Count |
|---|---|
| BANNED warm/beige/cream colors | **4** |
| Low-opacity white-on-dark contrast failures | **8** |
| Heading-alignment bugs | **0** |

### Remediation priority
1. **vcx-premium-2.css** — 3 of the 4 banned hits live here (lines 1016, 2345, 2460). One file to fix resolves 75 % of palette issues.
2. **Footer + metric contrast cluster** — lines 371 / 379 of `vcx-app-premium.css` and 515 / 1243 / 1281 of `vcx-premium-2.css` share the same dark-surface pattern; introduce a shared `--text-dim-on-dark` token.
3. **vitacorex-public.css:841** — single one-line swap for the `disclosure` soft surface.
