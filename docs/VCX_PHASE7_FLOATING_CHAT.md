# VCX Phase 7A — Floating Chat Launcher

> Architecture doc | 2026-04-03 | Branch: `codex/phase2-safe-realign`

---

## Overview

Phase 7A adds a site-wide floating chat launcher to all 39 HTML pages. A
circular FAB button (bottom-right) opens a conservative drawer panel that
connects to the existing legal-assistant backend. The widget is self-contained,
does not modify any frozen files, and is hidden on the dedicated
legal-assistant page where the full chat UI already exists.

---

## Architecture

### Widget Components

```
assets/js/vcx-chat-launcher.js   (~290 lines)
  Self-initializing IIFE.
  Self-loads its CSS via <link> injection.
  Builds DOM: launcher FAB + drawer panel.
  Chat client: POST /api/legal-chat/message
  File upload: POST /api/legal-chat/upload
  Escalation:  POST /api/legal-chat/escalate
  Conversion:  POST /api/legal-chat/convert-to-intake

assets/css/vcx-chat-launcher.css  (~350 lines)
  All rules scoped under .vcx-cw-* namespace.
  Responsive: 380px panel on desktop, bottom-sheet on mobile.
  z-index: launcher 98, panel 99.
```

### Injection Method

Each of the 39 HTML files received one additive line before `</body>`:

```html
<script src="/assets/js/vcx-chat-launcher.js"></script>
```

The JS self-loads the CSS file, so no `<link>` tag was needed in `<head>`.

### Page Exclusion

The widget is suppressed on the legal-assistant page via:
1. JS guard: checks `data-vcx-page="legal-assistant"` and exits early
2. CSS guard: `body[data-vcx-page="legal-assistant"] .vcx-cw-launcher { display: none !important; }`

---

## Chat Flow

```
User clicks FAB → panel opens → welcome message displayed
  ↓
User types message → POST /api/legal-chat/message
  ↓
Policy engine returns answer → rendered in panel
  ↓
If status="escalate" and user has provided contact info:
  → Intake CTA button appears in panel
  → POST /api/legal-chat/convert-to-intake
  → Redirect to /structured-case-intake.html?vcx_from=chat&...
```

### Existing Endpoints Reused

| Endpoint | Purpose |
|----------|---------|
| `POST /api/legal-chat/message` (30/min) | Send/receive chat messages |
| `POST /api/legal-chat/escalate` (10/min) | Collect contact info for lead |
| `POST /api/legal-chat/convert-to-intake` (10/min) | Convert to prefilled intake form |

### New Endpoint

| Endpoint | Purpose |
|----------|---------|
| `POST /api/legal-chat/upload` (10/min) | Upload file attached to chat session |

---

## File Upload

### Backend

```
POST /api/legal-chat/upload
Content-Type: multipart/form-data
Rate limit: 10/minute
Status code: 201

Fields:
  session_id: str (form field)
  file: UploadFile

Response:
  { ok, session_id, file_id, filename, size, content_type }

Storage: uploads/chat/{session_id}/{file_id}_{sanitized_filename}
Validation: Same upload_validator as intake (25MB, extension allowlist)
```

### Frontend

Two hidden `<input type="file">` elements:
1. **Attach button**: `accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.csv,.xlsx,.xls"`
2. **Camera button**: `accept="image/*" capture="environment"` (mobile camera)

Client-side validation runs before upload (extension + size check).
Upload result displayed as file pill in chat.

---

## Session Persistence

| Data | Storage | Lifetime |
|------|---------|----------|
| `sessionId`, `topic`, `jurisdiction` | `sessionStorage` (key: `vcx_cw_session`) | Tab lifetime |
| Open/closed state | `sessionStorage` (key: `vcx_cw_open`) | Tab lifetime |

Session data persists across same-tab page navigations. Each new tab starts
a fresh session.

---

## z-index Allocation

| Layer | z-index | Element |
|-------|---------|---------|
| 120 | vcx-header, modals | Existing |
| 110 | Secondary fixed elements | Existing |
| 100 | vcx-dock | Existing |
| **99** | **Chat panel** | **Phase 7A** |
| **98** | **Chat launcher FAB** | **Phase 7A** |
| 80 | floating-contact-dock | Existing (CSS only, no HTML) |
| 70 | site-header | Existing |

---

## CSS Namespace

All widget classes use the `.vcx-cw-` prefix:

| Class | Element |
|-------|---------|
| `.vcx-cw-launcher` | FAB button |
| `.vcx-cw-panel` | Drawer panel |
| `.vcx-cw-header` | Panel header bar |
| `.vcx-cw-messages` | Scrollable message area |
| `.vcx-cw-bubble-user` | User message |
| `.vcx-cw-bubble-bot` | Assistant message |
| `.vcx-cw-input-bar` | Bottom input area |
| `.vcx-cw-btn-attach` | File attach button |
| `.vcx-cw-btn-camera` | Camera button |
| `.vcx-cw-btn-send` | Send button |
| `.vcx-cw-file-pill` | Uploaded file indicator |
| `.vcx-cw-typing` | Typing indicator |
| `.vcx-cw-intake-cta` | Intake conversion card |

---

## Mobile Behavior

| Breakpoint | Panel behavior |
|------------|---------------|
| > 640px | 380px wide floating panel, bottom-right |
| <= 640px | Full-width bottom sheet, height: 100vh - 70px |
| <= 380px | Full-width, reduced border-radius |

- Input font-size set to 16px on mobile to prevent iOS zoom
- Camera capture available via `capture="environment"` attribute
- FAB slightly smaller (52px vs 56px) on mobile

---

## Files Changed

### New Files (2)

| File | Lines | Purpose |
|------|-------|---------|
| `assets/js/vcx-chat-launcher.js` | ~290 | Widget JS (self-contained) |
| `assets/css/vcx-chat-launcher.css` | ~350 | Widget CSS (scoped) |

### Modified Files

| File | Change | Lines |
|------|--------|-------|
| 39 HTML files | +1 line each (`<script>` before `</body>`) | +39 total |
| `vcx-api/app/routers/chat.py` | Upload endpoint + imports | +45 |
| `vcx-api/app/models/chat.py` | ChatUploadResponse model | +8 |

### Frozen Files — NOT MODIFIED

| File | Status |
|------|--------|
| `assets/css/styles.css` | UNTOUCHED |
| `assets/css/ui-shell.css` | UNTOUCHED |
| `assets/js/site.js` | UNTOUCHED |
| `assets/js/ui-shell.js` | UNTOUCHED |
| `assets/js/premium-fixes.js` | UNTOUCHED |
| `assets/css/premium-fixes.css` | UNTOUCHED |

---

## Rollback

1. Remove `assets/js/vcx-chat-launcher.js`
2. Remove `assets/css/vcx-chat-launcher.css`
3. Remove `<script src="/assets/js/vcx-chat-launcher.js"></script>` from all 39 HTML files
4. In `vcx-api/app/routers/chat.py`: remove the `POST /api/legal-chat/upload` endpoint and related imports
5. In `vcx-api/app/models/chat.py`: remove `ChatUploadResponse` class
6. Remove `uploads/chat/` directory
7. Remove `docs/VCX_PHASE7_FLOATING_CHAT.md`
8. Remove Phase 7A section from `docs/VCX_CHANGELOG.md`

No schema changes. No data migrations.
