# VitaCoreX — Design System & Layout Rules
_Authored: 2026-04-21 • Status: living document_

## 1 • Canonical Palette (frozen)
| Token | Hex | Role |
|-------|-----|------|
| `--vcx-teal` | `#2D8A82` | Primary brand teal, CTAs on light bg |
| `--vcx-teal-hover` | `#1A4F4A` | CTA hover / pressed |
| `--vcx-teal-deep` | `#0F2F2C` | Deep teal panels / dark CTA sections |
| `--vcx-accent` | `#5BC4B8` | Accent on dark bg, hover sparkle |
| `--vcx-accent-alt` | `#5BBAA7` | Accent variation used in gradients |
| `--vcx-ink` | `#1A2F2A` | Primary text on light |
| `--vcx-ink-body` | `#2E4F46` | Body text on light |
| `--vcx-ink-muted` | `#5E6C7B` | Secondary text / metadata |
| `--vcx-parchment` | `#EEE9DE` | Warm alt bg |
| `--vcx-canvas` | `#F4F7F6` | Default section bg |
| `#9A6A20` | — | Amber — warning/legal only |
| `#D4A853` | — | Amber accent (dark bg) |

Never introduce outside these bounds. Stale navy/blue tokens, pure `#000`, and pre-brand yellows are the failure modes we already fixed and are tracked in `BUG_LOG.md`.

## 2 • Contrast Contract
1. Text on any background must be either near-white (`#FFFFFF` / ≥ `rgba(255,255,255,0.82)`) or dark ink (`#1A2F2A` / `#2E4F46`).
2. Buttons: primary CTAs use `#1A5A54 → #236B64` linear-gradient with `#FFFFFF` fill; this clears AA on normal text.
3. Secondary CTAs on dark bg: transparent with white border + white text.
4. Placeholder text: never darker than `#5E6C7B` on light, never lighter than `rgba(255,255,255,0.55)` on dark.
5. Disabled states: 35% opacity, NOT lighter background.
6. Master override in `vcx-redesign.css` section 21 sets `h1-h6 { color: #000 !important }` on light sections. Dark sections defeat it via the section B14 block — do not delete, do not relax the selector.

## 3 • Typography
- Headings: `'Georgia', 'Times New Roman', serif`, weight `400`, letter-spacing `-0.02em`, line-height `1.15–1.18`.
- Body: `'Inter', -apple-system, system-ui, sans-serif`.
- Sizes:
  - Hero title: `clamp(2.2rem, 3.5vw, 2.8rem)`
  - Section title: `clamp(1.6rem, 3vw, 2.4rem)`
  - Card title: `1.05rem` → `1.35rem`
  - Body: `clamp(0.92rem, 1.15vw, 1.05rem)`
  - Eyebrow: `0.6875rem`, letter-spacing `0.14em`, uppercase.

## 4 • Spacing Rhythm
- Section vertical padding: `clamp(56px, 8vw, 112px)` (compact) or `clamp(72px, 10vw, 140px)` (generous).
- Section horizontal padding: `clamp(22px, 4vw, 32px)` on content, or the rail's `--vcx-rail-pad-x` token.
- Card padding: `24px 24px 20px` desktop; `20px 18px` mobile.
- Gaps in rails: `clamp(16px, 2vw, 24px)`.
- Never stack two full-dark sections back-to-back without a parchment or canvas break — it causes visual weight collapse.

## 5 • Rail Component Contract
### 5.1 Section container
```html
<section class="vcx-rail-section [--dark|--parchment|--teal]"
         aria-labelledby="railTitleX"
         data-vcx-texture?>
  <div class="vcx-rail-head [vcx-rail-head--center]">
    <span class="vcx-rail-head__eyebrow">...</span>
    <h2 id="railTitleX" class="vcx-rail-head__title">...</h2>
    <p class="vcx-rail-head__lede">...</p>
    <div class="vcx-rail-head__nav">           <!-- optional -->
      <button class="vcx-rail-btn" data-rail-prev aria-label="Previous">…</button>
      <button class="vcx-rail-btn" data-rail-next aria-label="Next">…</button>
    </div>
  </div>

  <div class="vcx-rail [vcx-rail--wide|vcx-rail--narrow]"
       aria-label="Scrollable cards">
    <div class="vcx-rail__viewport">
      <div class="vcx-rail__track">
        <a class="vcx-rail-card" href="...">…</a>
        ...
      </div>
    </div>
  </div>

  <div class="vcx-rail-progress"><div class="vcx-rail-progress__bar"></div></div>

  <p class="vcx-legal-boundary">…scope reminder…</p>
</section>
```

### 5.2 Rules
- `.vcx-rail-card` MUST be focusable (`<a>` or `<button>`); cards inside the viewport receive keyboard scroll via arrow keys.
- `.vcx-rail-head__title` is the only element allowed to bear the `id` that `aria-labelledby` references.
- The viewport is focusable automatically (`tabindex="0"`) from JS — do NOT add `tabindex` to individual cards beyond their native one.
- Legal boundary sits OUTSIDE the scroll viewport, never inside a card that could scroll off-screen.

## 6 • Pinned Rail Contract
```html
<section class="vcx-rail-section">
  <div class="vcx-pinned-rail" data-scroll-drive="true">
    <div class="vcx-pinned-rail__stage">
      <div class="vcx-pinned-rail__anchor">
        <span class="vcx-rail-head__eyebrow">...</span>
        <h2 class="vcx-pinned-rail__title">...</h2>
        <p class="vcx-pinned-rail__lede">...</p>
        <p class="vcx-pinned-rail__count">1 / N</p>
      </div>
      <div class="vcx-pinned-rail__viewport">
        <div class="vcx-pinned-rail__track">
          <article class="vcx-pinned-rail__card"><h3>…</h3><p>…</p></article>
          ...
        </div>
      </div>
    </div>
  </div>
</section>
```
- Omit `data-scroll-drive="true"` to get manual (dots + keyboard) progression only.
- Parent section MUST be tall enough to produce the scroll progress — aim for `min(180vh, 1600px)` when scroll-driven with 4–6 cards.
- On viewport `< 900px`, pinning is disabled and the track becomes a horizontal scroll rail. This is automatic.

## 7 • Dashboard Rail Contract
Wide metric tiles, always scrollable horizontally. Use for KPI / proof / dashboard-style surfaces where each tile carries one number + context.

## 8 • Tool Shelf Contract
Slim entry-point row. Icon + label + sublabel. Use for "jump to" navigation blocks. Do NOT use as a carousel of service offerings (that goes in `.vcx-rail`).

## 9 • Hero Contract
- Homepage reference: `.vcx-hero-2` (cybercore variant). Do not alter.
- All other pages: wrap existing hero markup with `.vcx-hero-2` + one of:
  - `.vcx-hero--compact` — service pages
  - `.vcx-hero--app` — in-app headers
  - `.vcx-hero--legal` — disclaimer-heavy pages
- Legacy pages without the cybercore JS: use `.vcx-hero` scaffolding (no particles, no video).

## 10 • Forbidden Alignment Hacks
Do not use:
- `position:absolute; left:50%; transform:translateX(-50%)` to center block text. Use flex or `margin:0 auto`.
- `text-align:center` on a parent flex row where children should control alignment.
- Fixed `height:` on cards inside a rail — use `min-height` or let content set height.
- Inline `style="text-align:center !important"` as a hack. Use `.vcx-rail-head--center` instead.
- `display:table-cell` tricks for vertical centering. Use flexbox `align-items:center`.
- Negative margins to pull cards below a header.

## 11 • Focus & Motion
- Focus ring: `box-shadow: 0 0 0 3px rgba(45,138,130,0.30)` on focus-visible, teal accent.
- All `transition`/`animation` collapse under `prefers-reduced-motion: reduce`.
- Rail scroll smoothing degrades to `behavior: 'auto'` under reduced motion.

## 12 • Versioning
- Every CSS/JS asset reference in HTML includes a `?v=` cache-buster. When modifying an asset, bump the parameter.
- `vcx-rails.css` and `vcx-rails.js` start at `?v=1`.
