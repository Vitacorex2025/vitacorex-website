# Phase 7 Preflight — Floating Chat Launcher (Site-Wide)

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Mode: Read-only audit — no files created or modified
> Scope: Universal floating chat entry point on all 39 HTML pages

---

## 1. Site-Wide Injection Point Audit

### HTML Pages (39 standalone files)

All pages are standalone — no server-side includes, no template engine.
Every page loads the same universal JS stack before `</body>`:

```
<script>window.VCX_TRACKING_IDS = { ... };</script>
<script src="/assets/js/vcx-i18n.js"></script>
<script src="/assets/js/site.js"></script>
<script src="/assets/js/ui-shell.js"></script>
<script src="/assets/js/premium-fixes.js"></script>
<!-- page-specific scripts here -->
```

**Root pages (27):**
index.html, about.html, contact.html, careers.html, resources.html,
solutions.html, industries.html, structured-case-intake.html,
corporate-legal-file-control.html, revenue-recovery-workflow.html,
additional-services.html, ai-intake.html, auto-purchase.html,
business-plans.html, contracts.html, corporate-paralegal.html,
immigration-documents.html, net-recovery.html, cookie-policy.html,
privacy-policy.html, terms-of-use.html, thank-you.html,
v51_institutional_blocks.html, industry-contract-services.html,
industry-fleet-logistics.html, industry-healthcare-dental.html,
industry-subscription-recurring.html

**App pages (12):**
app/sign-in/index.html, app/private-lookup/index.html,
app/contract-intelligence/index.html, app/immigration-forms/index.html,
app/legal-assistant/index.html, app/matter-status/index.html,
app/review/index.html, app/vcx-intake/index.html,
app/vcx-packet-room/index.html, app/vcx-recovery-pilot/index.html,
app/vcx-contract-review/index.html, app/dealer-contract-check/index.html

### Universal CSS Stack (in `<head>`)

```
vcx-tokens.css → vcx-base.css → vcx-layout.css →
vcx-components.css → vcx-utilities.css → styles.css →
ui-shell.css → premium-fixes.css → [page-specific CSS]
```

### AGENTS.md Frozen Files

| File | Type | Status |
|------|------|--------|
| `assets/css/styles.css` | CSS | FROZEN — do not modify |
| `assets/css/ui-shell.css` | CSS | FROZEN — do not modify |
| `assets/js/site.js` | JS | FROZEN — do not modify |
| `assets/js/ui-shell.js` | JS | FROZEN — do not modify |
| `assets/js/premium-fixes.js` | JS | FROZEN — do not modify |

**Conclusion:** Cannot inject the widget loader through any frozen file.
Must add a `<script>` tag to each of the 39 HTML files individually.

---

## 2. Z-Index Landscape

| Layer | Element | Position | z-index | Source |
|-------|---------|----------|---------|--------|
| Top | Error toasts (if any) | fixed | 9999 | (reserved) |
| High | `.vcx-header` | sticky, top:8px | 120 | ui-shell.css |
| High | `.modal` | fixed, full viewport | 120 | styles.css |
| Mid-High | Unnamed fixed element | fixed, bottom | 110 | ui-shell.css |
| Mid | `.vcx-dock` | fixed, bottom center | 100 | ui-shell.css |
| Low-Mid | `.floating-contact-dock` | fixed, right:18px bottom:18px | 80 | styles.css |
| Low | `.site-header` | sticky, top:0 | 70 | styles.css |

### Floating Contact Dock Note

The `.floating-contact-dock` style is defined in `styles.css` (position:fixed,
right:18px, bottom:18px, z-index:80) but **no HTML file contains the markup**.
The dock is either unused or injected by a script not currently active.
The CSS reserves the bottom-right corner at z-80.

### Safe Zone for Chat Widget

| z-index | Verdict | Reasoning |
|---------|---------|-----------|
| 95–99 | **RECOMMENDED** | Above inactive dock (80), below bottom CTA bar (100) |
| 98 | Best single value | Above dock, below vcx-dock bar, below modals |

Widget launcher button: `z-index: 98`
Widget open drawer/panel: `z-index: 99` (above launcher, below modals at 120)

---

## 3. Existing Fixed-Position Occupants

| Occupant | Corner | Active? | Conflict? |
|----------|--------|---------|-----------|
| `.vcx-header` | Top (full width) | YES | No — top edge |
| `.vcx-dock` | Bottom center | YES (some pages) | No — center, not corner |
| `.floating-contact-dock` | Bottom-right | NO (CSS only, no HTML) | Potential — same corner |
| Mobile nav overlay | Full screen | YES (when open) | Low — z-120 > widget z-99 |

**Bottom-right is available.** The floating-contact-dock CSS exists but the HTML
markup does not. If it is ever re-enabled, the widget (z-98) would sit beneath
the dock (z-80)... wait, 98 > 80 so the widget would be on top. We need to
decide: either suppress the dock when the widget is present, or shift the widget
to bottom-left. Recommendation: keep bottom-right, add a CSS rule in the widget
sheet that hides `.floating-contact-dock` when the widget is loaded:

```css
/* Phase 7: widget replaces dock if present */
.vcx-chat-widget-active .floating-contact-dock { display: none; }
```

Mobile (≤900px): the dock CSS already switches to `left:12px; right:12px; bottom:12px`
(full-width). The widget should collapse to a single FAB on mobile to avoid overlap.

---

## 4. Widget Architecture Decision

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A — Embed full legal-assistant | Clone vcx-legal-assistant.js into widget | Feature-complete | 362 lines + 322 CSS; duplicates chat logic; two chat UIs to maintain |
| B — Lightweight shell, delegates to legal-assistant | Widget is a thin launcher; opens the existing /app/legal-assistant/ in an iframe or redirects | Zero logic duplication | iframe has CORS/scroll issues; redirect loses page context |
| **C — Shared chat core, two shells** | Extract chat API layer from vcx-legal-assistant.js into a shared module; widget builds its own compact UI on top | Single API layer; widget is ~200 lines; legal-assistant page reuses same core | Requires refactoring vcx-legal-assistant.js into core + page-specific |
| D — Widget is standalone micro-client | Widget has its own minimal fetch layer calling the same endpoints | No refactor of existing code; fully self-contained | Slight duplication of API calls (POST /message, /escalate) |

### Recommendation: Option D (standalone micro-client)

**Rationale:**
- Zero risk to existing legal-assistant page (no refactor)
- Widget is a single self-contained file with its own CSS
- Calls the same `POST /api/legal-chat/message` and `POST /api/legal-chat/escalate` endpoints
- Can reuse `POST /api/legal-chat/convert-to-intake` for the handoff flow
- Follows AGENTS.md: new work goes in `assets/js/vcx-*.js` and `assets/css/vcx-*.css`
- If/when Option C is desired later, the widget API layer is already isolated

### Widget Components

```
┌──────────────────────────────────────────────┐
│  vcx-chat-widget.js (~250-300 lines)         │
│  ┌────────────┐  ┌──────────────────────┐    │
│  │ Launcher   │  │ Panel / Drawer       │    │
│  │ (FAB btn)  │→ │ - Header bar         │    │
│  │ bottom-right│  │ - Message list       │    │
│  └────────────┘  │ - Input + send       │    │
│                  │ - Upload button       │    │
│                  │ - Escalate CTA       │    │
│                  │ - Convert-to-intake   │    │
│                  └──────────────────────┘    │
├──────────────────────────────────────────────┤
│  vcx-chat-widget.css (~150-200 lines)        │
│  All rules scoped under .vcx-cw-*            │
│  Responsive: FAB only on mobile ≤640px       │
│  Dark-on-light theme matching site tokens     │
└──────────────────────────────────────────────┘
```

---

## 5. Minimum Files

### New Files (2)

| # | File | Type | Est. Lines | Purpose |
|---|------|------|-----------|---------|
| 1 | `assets/js/vcx-chat-widget.js` | JS | 250–300 | Launcher FAB, drawer panel, chat client, upload trigger, escalation CTA |
| 2 | `assets/css/vcx-chat-widget.css` | CSS | 150–200 | All widget styles, `.vcx-cw-*` namespace, responsive breakpoints |

### Modified Files (39 HTML + 1 doc + 1 changelog)

| # | File | Change | Lines |
|---|------|--------|-------|
| 1–39 | All 39 HTML files | Add 2 lines before `</body>`: CSS `<link>` in `<head>`, JS `<script>` before closing body | +2 each |
| 40 | `docs/VCX_PHASE7_CHAT_WIDGET.md` | Architecture doc (new) | ~200 |
| 41 | `docs/VCX_CHANGELOG.md` | Phase 7 section (append) | +30 |

### Frozen Files — NOT TOUCHED

| File | Reason |
|------|--------|
| `index.html` | Only receives 2-line script/link addition (same as all pages) |
| `assets/css/styles.css` | FROZEN |
| `assets/css/ui-shell.css` | FROZEN |
| `assets/js/site.js` | FROZEN |
| `assets/js/ui-shell.js` | FROZEN |
| `assets/js/premium-fixes.js` | FROZEN |
| `assets/css/premium-fixes.css` | FROZEN |

### Backend: New Endpoint (1)

| # | File | Change |
|---|------|--------|
| 1 | `vcx-api/app/routers/chat.py` | Add `POST /api/legal-chat/upload` endpoint for chat-context file upload |
| 2 | `vcx-api/app/models/chat.py` | Add `ChatUploadResponse` model (optional, may use inline dict) |

---

## 6. Upload Support Design

### Current State

- **Intake uploads:** `POST /api/intakes` accepts `attachment` field (single file, UploadFile)
- **Matter uploads:** `POST /api/uploads/{matter_id}` accepts multiple files (Bearer auth)
- **Contract uploads:** `POST /api/contracts/upload` (single file)
- **Chat uploads:** NONE — no file upload support in chat endpoints

### Required: Chat-Context Upload

The widget needs to accept files during the chat session, before any matter exists.
Files are attached to the `session_id` and carried forward when the user converts to intake.

**Proposed endpoint:**

```
POST /api/legal-chat/upload
Content-Type: multipart/form-data
Rate limit: 10/minute

Fields:
  session_id: str (required)
  file: UploadFile (required)

Response (201):
  {
    "ok": true,
    "session_id": "...",
    "file_id": "uuid",
    "filename": "sanitized.pdf",
    "size": 102400,
    "content_type": "application/pdf"
  }

Storage: uploads/chat/{session_id}/{file_id}_{filename}
Validation: Same upload_validator (25MB, extension allowlist, sanitization)
Retention: Chat uploads without conversion → purge after 24h (cron or lazy)
```

**Convert-to-intake integration:**
When `POST /api/legal-chat/convert-to-intake` runs, it checks for files in
`uploads/chat/{session_id}/` and includes them in the `IntakeHandoffResponse.doc_hint`
or passes file references to the intake form as additional URL params.

### Frontend Upload UX

| Input | Method | Notes |
|-------|--------|-------|
| File picker | `<input type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.csv,.xlsx,.xls">` | Standard file picker |
| Photo from gallery | Same input, mobile OS shows gallery option | No extra code needed |
| Camera capture | `<input type="file" accept="image/*" capture="environment">` | Mobile only; opens camera directly |

**Widget approach:** Two buttons in the input area:
1. **📎 Attach** — triggers file input (`accept` = full allowlist)
2. **📷 Photo** — triggers camera input (`accept="image/*" capture="environment"`)

Both hidden `<input>` elements triggered programmatically by button click.
Upload starts immediately on file selection; progress shown inline in chat.

### Upload Flow

```
User taps 📎 → file picker opens → selects file
  → JS validates extension + size client-side
  → POST /api/legal-chat/upload (FormData: session_id + file)
  → Server validates (upload_validator), stores in uploads/chat/{session_id}/
  → Response with file_id + filename
  → Widget shows "📎 contract.pdf uploaded" as a chat bubble
  → File reference saved in chatState.attachments[]
```

---

## 7. Backend Endpoint Summary

### Existing Endpoints Used by Widget

| Endpoint | Rate | Purpose in Widget |
|----------|------|-------------------|
| `POST /api/legal-chat/message` | 30/min | Send/receive chat messages |
| `POST /api/legal-chat/escalate` | 10/min | Collect name/email/phone for follow-up |
| `POST /api/legal-chat/convert-to-intake` | 10/min | Convert chat to prefilled intake form |

### New Endpoint Required

| Endpoint | Rate | Purpose |
|----------|------|---------|
| `POST /api/legal-chat/upload` | 10/min | Upload file attached to chat session |

### No WebSocket Needed

The existing chat is synchronous request-response. The widget follows the same
pattern: user sends message → POST → receive answer → render. No streaming,
no real-time push. This keeps complexity low and matches the existing architecture.

---

## 8. Widget Behavior Specification

### Launcher (Closed State)

- **Element:** Circular button (FAB), 56px diameter
- **Position:** `position: fixed; bottom: 24px; right: 24px;`
- **z-index:** 98
- **Icon:** Chat bubble SVG (inline, no external asset)
- **Badge:** Unread indicator dot (hidden by default)
- **Animation:** Gentle scale-up on page load (0.3s ease)
- **Mobile:** Same position, same size

### Panel (Open State)

- **Element:** Fixed right-side panel
- **Position:** `position: fixed; bottom: 24px; right: 24px;`
- **Size:** `width: 380px; height: min(580px, calc(100vh - 120px));`
- **z-index:** 99
- **Border-radius:** 16px (matches site card system)
- **Shadow:** `var(--shadow-soft)` or equivalent from vcx-tokens
- **Mobile (≤640px):** Full-width, full-height minus header (`inset: 0; top: auto; height: calc(100vh - 80px);` or fullscreen with close button)
- **Backdrop:** None (panel floats, page remains interactive around it)

### Panel Structure

```
┌─────────────────────────────────┐
│ ● VitaCoreX Legal Assistant  ✕  │  ← header bar (brand + close)
├─────────────────────────────────┤
│                                 │
│  Welcome message                │  ← message area (scrollable)
│                                 │
│  [User bubble]                  │
│  [Assistant bubble]             │
│  [User bubble]                  │
│  📎 contract.pdf — uploaded     │  ← file attachment bubble
│                                 │
│  ┌─ Escalation CTA ──────────┐ │  ← appears when policy says escalate
│  │ Ready to move forward?     │ │
│  │ [Continue to Intake →]     │ │
│  └────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [📎] [📷]  [Type a message...] [→] │  ← input bar
└─────────────────────────────────┘
```

### Chat Session Lifecycle

1. **Panel opens** → generate `session_id` (or reuse from sessionStorage)
2. **Welcome message** displayed (static, not an API call)
3. **User types** → `POST /api/legal-chat/message` → render response
4. **Policy engine returns** `status: "escalate"` → widget shows escalation CTA
5. **User fills name/email/phone** → `POST /api/legal-chat/escalate` → lead created
6. **Convert CTA appears** → `POST /api/legal-chat/convert-to-intake` → redirect to intake form
7. **Session persists** in `sessionStorage` (cleared on tab close)

### Page-Specific Behavior

| Page | Widget Behavior |
|------|----------------|
| `/app/legal-assistant/` | **HIDDEN** — full legal assistant already present |
| All other pages | Visible — launcher in bottom-right |

Detection: `if (document.body.getAttribute('data-vcx-page') === 'legal-assistant') return;`

---

## 9. Styling Approach

### CSS Namespace

All widget classes prefixed with `.vcx-cw-` (chat widget):

```
.vcx-cw-launcher     — FAB button
.vcx-cw-panel         — open panel container
.vcx-cw-header        — panel header bar
.vcx-cw-messages      — scrollable message area
.vcx-cw-bubble-user   — user message bubble
.vcx-cw-bubble-bot    — assistant message bubble
.vcx-cw-input-bar     — bottom input area
.vcx-cw-btn-attach    — file attach button
.vcx-cw-btn-camera    — camera button
.vcx-cw-btn-send      — send button
.vcx-cw-file-pill     — uploaded file indicator
.vcx-cw-escalation    — escalation CTA card
.vcx-cw-typing        — typing indicator
```

### Design Tokens

The widget CSS reads from existing `vcx-tokens.css` variables:

| Token | Usage |
|-------|-------|
| `--vcx-brand-primary` (#173A63) | Header bar background, send button |
| `--vcx-ink-base` | Text color |
| `--vcx-ink-muted` | Timestamps, secondary text |
| `--vcx-surface-card` | Panel background |
| `--vcx-radius-card` (16px) | Panel border-radius |
| `--shadow-soft` | Panel box-shadow |

### Mobile Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| > 640px | Floating panel 380×580px, bottom-right |
| ≤ 640px | Panel expands to near-fullscreen (bottom sheet pattern) |
| ≤ 380px | Panel is full-width with 8px margin |

---

## 10. Implementation Path

### Step 1 — Backend: Chat Upload Endpoint

| Task | File | Detail |
|------|------|--------|
| Add ChatUploadResponse model | `models/chat.py` | `ok`, `session_id`, `file_id`, `filename`, `size`, `content_type` |
| Add POST /api/legal-chat/upload | `routers/chat.py` | Accept session_id + file, validate, store in `uploads/chat/{session_id}/` |
| Wire file refs into convert-to-intake | `routers/chat.py` | Scan `uploads/chat/{session_id}/` during conversion, pass to intake |

**Lines changed:** ~40 in chat.py router, ~10 in models/chat.py

### Step 2 — Frontend: Widget JS + CSS

| Task | File | Detail |
|------|------|--------|
| Create widget script | `assets/js/vcx-chat-widget.js` | Self-initializing IIFE, launcher, panel, chat client, upload, escalation |
| Create widget styles | `assets/css/vcx-chat-widget.css` | Scoped `.vcx-cw-*` rules, responsive, dark-on-light |

**Lines:** ~250–300 JS, ~150–200 CSS

### Step 3 — Inject Widget Into All Pages

Add two lines to each of the 39 HTML files:

**In `<head>` (after premium-fixes.css):**
```html
<link href="/assets/css/vcx-chat-widget.css" rel="stylesheet"/>
```

**Before `</body>` (after premium-fixes.js, before page-specific scripts):**
```html
<script src="/assets/js/vcx-chat-widget.js"></script>
```

**Lines changed:** +2 per file × 39 files = +78 lines total

### Step 4 — Documentation

| Task | File | Detail |
|------|------|--------|
| Architecture doc | `docs/VCX_PHASE7_CHAT_WIDGET.md` | Widget design, endpoints, upload flow, rollback |
| Changelog update | `docs/VCX_CHANGELOG.md` | Phase 7 section |
| Phase report | `_codex_phase7_chat_widget.md` | Output report |

### Step 5 — QA

- Shell drift check (all 5+1 frozen files untouched)
- Widget renders on all 39 pages
- Widget hidden on `/app/legal-assistant/`
- Chat flow works (message → response → escalation → convert)
- File upload works (attach → upload → pill displayed)
- Camera capture works on mobile
- Mobile layout (bottom sheet, no horizontal scroll, no overlap)
- z-index layering correct (widget below modals, above page content)
- Session persistence across page navigation (sessionStorage)
- No broken internal links (re-run 1449-link check)

---

## 11. Visual-Risk Summary

| Risk | Level | Detail | Mitigation |
|------|-------|--------|------------|
| Widget overlaps floating-contact-dock | Low | Dock HTML doesn't exist currently; CSS reserves z-80 | Widget CSS hides dock when active; widget at z-98 |
| Widget overlaps vcx-dock bottom bar | Low | vcx-dock is bottom-center, widget is bottom-right | No overlap; different positions |
| Widget panel clips behind header on scroll | None | Panel is fixed; header is sticky z-120 > widget z-99 | Correct layering by default |
| Widget changes site "feel" | Low | FAB is a common pattern (WhatsApp, Intercom, Drift) | Matches brand colors, card radius, shadow from tokens |
| Modal opens with widget panel open | Low | Modals at z-120 will overlay widget at z-99 | Correct behavior — modal should be on top |

---

## 12. Mobile-Risk Summary

| Risk | Level | Detail | Mitigation |
|------|-------|--------|------------|
| Bottom sheet overlaps mobile nav | Low | Mobile nav is z-120, widget panel is z-99 | Nav will correctly overlay; close widget when nav opens (optional) |
| Keyboard pushes layout when typing | Medium | iOS/Android virtual keyboard changes viewport | Use `visualViewport` API to resize panel; `inputmode` hints |
| FAB too close to mobile nav hamburger | None | Hamburger is top-right; FAB is bottom-right | No overlap |
| Camera capture not available on desktop | None | `capture` attribute is ignored on desktop; falls back to file picker | Correct behavior |
| File too large on mobile (cell data) | Low | 25MB limit could be slow on cellular | Show upload progress; client-side size check before upload |
| Panel overflow on very small screens | Low | 320px width devices | Panel at `width: calc(100vw - 16px)` on ≤380px |

---

## 13. Exclusion List (Pages Where Widget Is Hidden)

| Page | Reason |
|------|--------|
| `app/legal-assistant/index.html` | Full chat UI already present — widget would be redundant |

All other 38 pages receive the widget. The widget script checks
`data-vcx-page="legal-assistant"` and exits early if matched.

---

## 14. Rollback Plan

### Full Phase 7 Rollback

1. Remove `assets/js/vcx-chat-widget.js`
2. Remove `assets/css/vcx-chat-widget.css`
3. Remove the 2 added lines from each of the 39 HTML files:
   - `<link href="/assets/css/vcx-chat-widget.css" ...>` from `<head>`
   - `<script src="/assets/js/vcx-chat-widget.js"></script>` from before `</body>`
4. In `vcx-api/app/routers/chat.py`: remove the `POST /api/legal-chat/upload` endpoint
5. In `vcx-api/app/models/chat.py`: remove `ChatUploadResponse` (if added)
6. Remove `uploads/chat/` directory
7. Remove `docs/VCX_PHASE7_CHAT_WIDGET.md`
8. Remove Phase 7 section from `docs/VCX_CHANGELOG.md`

No schema changes. No data migrations. Rollback is purely file-level.

---

## 15. Open Questions (For Implementation)

| # | Question | Default Answer |
|---|----------|----------------|
| 1 | Should widget persist chat across page navigations? | Yes — sessionStorage keyed by session_id |
| 2 | Should widget show typing indicator during API wait? | Yes — simple pulsing dots |
| 3 | Should widget pre-populate topic from page context? | Yes — read `data-vcx-page` to infer topic |
| 4 | Should uploaded files carry over to intake form? | Yes — convert-to-intake scans uploads/chat/{session_id}/ |
| 5 | Should widget have sound notifications? | No — silent, no audio |
| 6 | Maximum messages before "continue in full assistant" prompt? | 20 messages — then suggest opening /app/legal-assistant/ |
| 7 | Should widget work on legal-assistant page as secondary UI? | No — hidden on that page |
| 8 | i18n support (EN/RU/ES)? | Yes — read `VCX_LANG` from site.js or detect from page |

---

## 16. Done Definition

- [ ] Widget launcher visible on 38/39 pages (hidden on legal-assistant)
- [ ] Panel opens/closes with smooth animation
- [ ] Chat messages sent and received via existing endpoints
- [ ] File upload works (attach + camera on mobile)
- [ ] Escalation CTA appears when policy engine triggers it
- [ ] Convert-to-intake redirects to prefilled structured intake form
- [ ] Session persists across page navigations within same tab
- [ ] Mobile layout: bottom sheet, no overflow, no horizontal scroll
- [ ] Desktop layout: 380×580 floating panel, bottom-right corner
- [ ] No frozen files modified
- [ ] No shell drift
- [ ] All 39 pages still pass internal link check
- [ ] Documentation complete (architecture doc, changelog, report)

---

## Summary

| Item | Value |
|------|-------|
| New files | 2 (JS + CSS) |
| Modified files | 39 HTML (2 lines each) + 2 backend + 2 docs |
| New endpoint | 1 (POST /api/legal-chat/upload) |
| Frozen files touched | 0 |
| Estimated JS | 250–300 lines |
| Estimated CSS | 150–200 lines |
| Backend changes | ~50 lines |
| Architecture | Standalone micro-client (Option D) |
| z-index | Launcher 98, Panel 99 |
| Position | Fixed, bottom-right |
| Mobile | Bottom sheet pattern |
| Upload | File picker + camera capture, 25MB, same allowlist |
| Rollback | File-level only, no migrations |
