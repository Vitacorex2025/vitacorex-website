# Chat Runtime Stabilization — Fix Report

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Fix all chat runtime blockers, improve error handling,
>        add readiness signal, harden CORS configuration.

---

## Objective

Make the floating chat widget actually work end-to-end:
1. Launcher opens
2. User sends message
3. Backend responds
4. Errors are visible (not silent)
5. Backend availability is signaled

---

## Fixes Implemented

### Fix 1: CORS Origin Configuration

**File:** `vcx-api/.env`

**Before:**
```
VCX_ALLOWED_ORIGINS=http://localhost:8765,http://localhost:3000,http://127.0.0.1:8765
```

**After:**
```
VCX_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:8787,http://127.0.0.1:8080,http://127.0.0.1:8787,http://localhost:8765,http://127.0.0.1:8765
```

Adds the actual dev ports (8080 frontend, 8787 backend) while
preserving the legacy 8765 entries for backward compatibility.

**File:** `vcx-api/.env.example`

Updated CORS documentation to show the correct dev port pair and
changed the default to 8080+8787.

### Fix 2: API_BASE Auto-Detection

**File:** `assets/js/vcx-chat-launcher.js`

**Before:**
```javascript
var API_BASE = window.VCX_API_BASE || '';
```

**After:**
```javascript
var API_BASE = (function () {
  if (window.VCX_API_BASE) return window.VCX_API_BASE;
  var port = location.port;
  if (port === '8080') return 'http://' + location.hostname + ':8787';
  return '';
})();
```

Resolution order:
1. `window.VCX_API_BASE` — explicit override (inline `<script>`)
2. Auto-detect: if frontend port is 8080, API is at hostname:8787
3. Same-origin fallback (empty string) — for reverse-proxy / production

This means `fetch('/api/legal-chat/message')` now correctly resolves
to `http://localhost:8787/api/legal-chat/message` in the standard
dev setup, without touching any of the 39 HTML files.

### Fix 3: Backend Readiness Check

**File:** `assets/js/vcx-chat-launcher.js`

New `checkBackend()` function:
- Pings `GET /healthz` on widget init
- 4-second timeout with AbortController
- Sets `state.backendReady` to true on success
- Toggles header status dot:
  - Gray (default) → Green (online) or Red (offline)
- Logs backend status to console for debugging

**File:** `assets/css/vcx-chat-launcher.css`

Updated `.vcx-cw-header-dot`:
- Default: neutral gray (#94A3B8) — "checking"
- `.vcx-cw-dot-online`: green (#4ADE80) — "connected"
- `.vcx-cw-dot-offline`: red (#F87171) — "unreachable"
- 0.3s transition for smooth color change

### Fix 4: Error Diagnostics

**File:** `assets/js/vcx-chat-launcher.js`

New `diagnoseFetchError(err, url)` function:
- **Development only** (localhost/127.0.0.1) — shows detailed
  error messages in the chat bubble
- **Production** — returns null, falls back to generic message
- Classifies errors:
  - `TypeError: Failed to fetch` → CORS / network issue message
  - `HTTP xxx` → server error with URL
  - Other → raw error message

Applied to:
- `sendMessage()` catch block — shows connection diagnostics
- `uploadFile()` catch block — shows upload diagnostics
- All error log lines now include `API_BASE` for debugging
- `convertToIntake()` catch block — enhanced logging

### Fix 5: Dependency Installation (Documentation)

**NOT a code change** — the user must run:
```bash
cd vcx-api
pip install -r requirements.txt
```

This resolves Blocker 1 from the audit:
- slowapi (main.py import)
- pdfplumber (PDF extraction)
- python-docx (DOCX extraction)

All three are in `requirements.txt` already. The fix is operational,
not a code change.

---

## Changes Summary

### Modified Files (3)

| # | File | Change |
|---|------|--------|
| 1 | `vcx-api/.env` | Added 8080+8787 CORS origins |
| 2 | `vcx-api/.env.example` | Updated CORS docs + default ports |
| 3 | `assets/js/vcx-chat-launcher.js` | API_BASE auto-detect, healthz check, error diagnostics |
| 4 | `assets/css/vcx-chat-launcher.css` | Status dot online/offline indicators |

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

## Verification Checklist

After running `pip install -r requirements.txt`:

- [ ] Backend starts: `cd vcx-api && uvicorn app.main:app --port 8787 --reload`
- [ ] Frontend starts: `python -m http.server 8080` (from project root)
- [ ] Open http://localhost:8080 → FAB visible bottom-right
- [ ] Click FAB → panel opens with welcome message
- [ ] Header dot turns green (backend reachable)
- [ ] Type message → assistant responds
- [ ] Type rapid messages → rate limit shows graceful message
- [ ] Kill backend → header dot stays red on next page load
- [ ] Kill backend → send message → detailed error in dev mode
- [ ] Upload file → acknowledgment appears
- [ ] Upload image → thumbnail preview appears
- [ ] Console shows `[VCX Chat Widget] Backend ready at http://localhost:8787`

---

## Startup Commands (Reference)

**Terminal 1 — Backend:**
```bash
cd "C:\Users\sergz\OneDrive\Desktop\докет МИНТ\7\vitacorex_RELEASE_v284\vcx-api"
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8787 --reload
```

**Terminal 2 — Frontend:**
```bash
cd "C:\Users\sergz\OneDrive\Desktop\докет МИНТ\7\vitacorex_RELEASE_v284"
python -m http.server 8080
```

**Verify health:**
```bash
curl http://localhost:8787/healthz
# Expected: {"ok":true,"service":"VCX Intake OS","version":"1.1.0"}
```

---

## Risk Assessment

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | Port 8080→8787 auto-detect assumes standard dev setup | Low | Falls through to same-origin if port != 8080; overridable via VCX_API_BASE |
| 2 | Dev error messages expose API_BASE URL | Very Low | Only shown on localhost; production shows generic message |
| 3 | Healthz timeout (4s) delays offline detection | Very Low | Non-blocking; chat works normally before check completes |
| 4 | Legacy 8765 origins still in .env | None | Harmless extra entries; removed when not needed |
