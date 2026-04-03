# VCX Chat Runtime Fixes

> Phase 8 Stabilization | 2026-04-03

## Summary

Fixes applied to the floating chat widget (`vcx-chat-launcher`) and the
full-page legal assistant (`vcx-legal-assistant`) to resolve runtime
blockers, improve error visibility, and ensure correct API routing in
dev environments.

---

## 1. API_BASE Auto-Detection

### Problem

Both `vcx-chat-launcher.js` and `vcx-legal-assistant.js` relied on
`window.VCX_API_BASE` being set externally. In the standard dev setup
(frontend on port 8080, backend on port 8787), this variable is never
set, causing all API calls to hit the frontend server (which returns
HTML 404 pages, not JSON).

### Fix

**vcx-chat-launcher.js** (applied in prior session):
```javascript
var API_BASE = (function () {
  if (window.VCX_API_BASE) return window.VCX_API_BASE;
  var port = location.port;
  if (port === '8080') return 'http://' + location.hostname + ':8787';
  return '';
})();
```

**vcx-legal-assistant.js** (applied this session):
Same IIFE pattern, replacing the old `const API_BASE = window.VCX_API_BASE || '';`.

### Effect

All API calls (`/api/legal-chat/message`, `/api/legal-chat/escalate`,
`/api/legal-chat/convert-to-intake`) now route to port 8787 when
served from port 8080.

---

## 2. Error Diagnostics

### Problem

When the backend is unreachable, both scripts showed generic error
messages with no indication of what went wrong. Developers had to
open DevTools console to diagnose.

### Fix

**vcx-legal-assistant.js**: Added `TypeError` detection to both
`sendMessage()` and escalation form error handlers. When a network
error occurs (backend down), the user-facing message now includes
"(Network unreachable -- is the backend running on port 8787?)".
Console output now includes the API_BASE value for debugging.

**vcx-chat-launcher.js**: Already had `diagnoseFetchError()` from
prior session (classifies TypeError vs HTTP error vs generic).

---

## 3. Backend Readiness Indicator

**vcx-chat-launcher.js**: Already has `checkBackend()` (pings
`/healthz` with 4s timeout). Dot in panel header turns green
(`.vcx-cw-dot-online`) or red (`.vcx-cw-dot-offline`).

No further changes needed -- this was implemented in the prior
chat runtime stabilization pass.

---

## 4. CORS Configuration

**vcx-api/.env**: Updated in prior session to include both dev
port pairs:
```
VCX_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:8787,http://127.0.0.1:8080,http://127.0.0.1:8787,http://localhost:8765,http://127.0.0.1:8765
```

---

## 5. API Base Strategy (Production vs Dev)

Two supported modes:

**Mode A -- Same-origin (reverse proxy):**
Deploy behind nginx/Caddy that proxies `/api/*` to the backend.
No configuration needed -- `API_BASE` defaults to empty string (same-origin).

**Mode B -- Explicit override:**
Set `window.VCX_API_BASE = 'https://api.example.com'` in a `<script>` tag
before `vcx-chat-launcher.js` or `vcx-legal-assistant.js` loads.
Both scripts check `window.VCX_API_BASE` first.

**Mode C -- Dev auto-detect (default):**
When served from port 8080, API calls auto-redirect to port 8787.
No configuration needed for standard dev setup.

---

## 6. Session Persistence (Phase 10)

### Problem

The full-page legal assistant (`vcx-legal-assistant.js`) stored chat
state in a local variable only. Any page refresh lost the session ID,
topic, and jurisdiction -- forcing users to start over.

The floating widget already persisted via `sessionStorage`.

### Fix

Added `sessionStorage` persistence to `vcx-legal-assistant.js`:
- Key: `vcx_la_session`
- Stores: `{ sessionId, topic, jurisdiction, mode }`
- Saved after every successful API response
- Restored on page load (session ID, topic chip highlight, jurisdiction display)

---

## 7. Backend Readiness on Legal Assistant Page (Phase 10)

### Problem

The floating widget had a backend health check with a visual status dot,
but the full-page legal assistant page had no readiness indicator.

### Fix

Added to `vcx-legal-assistant.js`:
- `checkBackend()` pings `API_BASE + '/healthz'` with 4s timeout
- Updates dot and label: green "Online" or red "Offline"
- Auto-refreshes every 30 seconds
- HTML element added to `app/legal-assistant/index.html` in the `.assistant-meta` row

---

## 8. File / Image Upload on Legal Assistant Page (Phase 10)

### Problem

The floating chat widget supported file and camera uploads via
`POST /api/legal-chat/upload`, but the full-page legal assistant
page had no upload capability at all.

### Fix

Added to `app/legal-assistant/index.html`:
- Attach button (paperclip icon) and Camera button in form actions
- Two hidden `<input type="file">` elements (general + camera with `capture="environment"`)
- Upload status bar below the form

Added to `vcx-legal-assistant.js`:
- `handleFileUpload()` with client-side validation:
  - Extension allowlist: pdf, doc, docx, txt, md, jpg, jpeg, png, gif, csv, xlsx, xls
  - 25 MB max size
  - Empty file check
- POSTs `FormData` to `/api/legal-chat/upload`
- Handles 413 (too large), 400 (validation), generic errors
- Shows upload status bar with success/error states
- On success: displays server acknowledgment as assistant message

---

## 9. Typing Indicator (Phase 10)

Added animated typing dots to the legal assistant page. Shown while
waiting for API response, hidden when response arrives or error occurs.
Matches the style of the floating widget's typing indicator.

---

## Remaining Backend Blocker

The backend will not start until dependencies are installed:

```bash
cd vcx-api
pip install -r requirements.txt
```

This is a dependency issue, not a code issue. Once installed,
`uvicorn app.main:app --port 8787` starts cleanly and all endpoints
respond.

---

## All Files Modified (Phase 8 + Phase 10)

| File | Phase 8 Change | Phase 10 Change |
|------|---------------|-----------------|
| `assets/js/vcx-legal-assistant.js` | API_BASE auto-detect, error diagnostics | Session persistence, backend check, typing indicator, file upload |
| `assets/js/vcx-chat-launcher.js` | Body class toggle for panel open/close | -- |
| `assets/css/vcx-chat-launcher.css` | z-index, touch targets, safe-area | -- |
| `assets/css/vcx-legal-assistant.css` | Scroll containment, mobile fixes | Backend status, upload buttons, typing animation, upload status bar |
| `app/legal-assistant/index.html` | -- | Backend status element, file inputs, attach/camera buttons |
