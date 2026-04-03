# Chat Runtime QA — Verification Report

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Verify chat runtime stabilization fixes, backend readiness,
>        error diagnostics, CORS configuration, and launcher integrity.

---

## Verification Results

| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | API_BASE auto-detection | PASS | Port 8080 → 8787 mapping in IIFE |
| 2 | window.VCX_API_BASE override | PASS | First priority in resolution chain |
| 3 | Same-origin fallback | PASS | Empty string when port != 8080 |
| 4 | checkBackend() healthz | PASS | Pings /healthz with 4s timeout, AbortController |
| 5 | diagnoseFetchError() | PASS | Classifies TypeError/HTTP errors, dev-only detail |
| 6 | sendMessage() diagnostics | PASS | Uses diagnoseFetchError, shows API_BASE in log |
| 7 | uploadFile() diagnostics | PASS | Uses diagnoseFetchError, shows API_BASE in log |
| 8 | convertToIntake() logging | PASS | Enhanced with API_BASE in console.warn |
| 9 | CORS .env | PASS | Includes 8080, 8787, 127.0.0.1 variants |
| 10 | CORS .env.example | PASS | Updated docs + default ports |
| 11 | Status dot online | PASS | .vcx-cw-dot-online green (#4ADE80) |
| 12 | Status dot offline | PASS | .vcx-cw-dot-offline red (#F87171) |
| 13 | Status dot default | PASS | Neutral gray (#94A3B8) until resolved |
| 14 | Shell drift | PASS | styles.css, site.js, ui-shell.js untouched |
| 15 | Launcher site-wide | PASS | 39/39 HTML files have injection |
| 16 | Welcome message | PASS | Full text with 4 suggestion chips |
| 17 | File upload flow | PASS | Validation + category + acknowledgment intact |
| 18 | Camera capture | PASS | accept="image/*" capture="environment" |
| 19 | Convert-to-intake | PASS | POST + fallback redirect with URL params |
| 20 | Python compile | PASS | 37/37 files clean |

---

## Fix Verification Detail

### API_BASE Auto-Detection

```javascript
var API_BASE = (function () {
  if (window.VCX_API_BASE) return window.VCX_API_BASE;
  var port = location.port;
  if (port === '8080') return 'http://' + location.hostname + ':8787';
  return '';
})();
```

| Scenario | Result |
|----------|--------|
| `http://localhost:8080` | `http://localhost:8787` |
| `http://127.0.0.1:8080` | `http://127.0.0.1:8787` |
| `http://localhost:8787` (direct) | `''` (same-origin) |
| `https://vitacorexllc.com` | `''` (same-origin, production proxy) |
| `window.VCX_API_BASE = 'custom'` | `'custom'` (explicit override) |

### CORS Configuration

`.env` now contains:
```
VCX_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:8787,http://127.0.0.1:8080,http://127.0.0.1:8787,http://localhost:8765,http://127.0.0.1:8765
```

| Origin | Allowed |
|--------|---------|
| http://localhost:8080 | YES |
| http://localhost:8787 | YES |
| http://127.0.0.1:8080 | YES |
| http://127.0.0.1:8787 | YES |
| http://localhost:8765 | YES (legacy) |

### Healthz Readiness

- `checkBackend()` fires on `init()`
- Pings `GET {API_BASE}/healthz`
- Timeout: 4000ms
- Success: dot turns green, `state.backendReady = true`
- Failure: dot turns red, console.warn with API_BASE

### Error Diagnostics (Dev Mode Only)

`diagnoseFetchError()` returns detailed messages only on localhost:

| Error Type | Message |
|------------|---------|
| TypeError: Failed to fetch | "Connection failed — the API server at {API_BASE} may be down or blocked by CORS." |
| HTTP 404 | "Server returned HTTP 404 for {url}. Verify the API is running." |
| Other | "Request failed: {error.message}." |
| Production | null (uses generic fallback) |

---

## Phase 7 Feature Integrity

All original Phase 7A + 7B features verified intact:

| Feature | Status |
|---------|--------|
| FAB launcher (56px, brand navy) | Intact |
| Panel drawer (380x560, slide-up) | Intact |
| Welcome message + suggestions | Intact |
| Message send + bot response | Intact |
| Rate limit handling (429) | Intact |
| File upload with validation | Intact |
| Image preview (objectURL) | Intact |
| Category badges (Document/Image) | Intact |
| Camera capture (mobile) | Intact |
| Server acknowledgment display | Intact |
| Convert-to-intake flow | Intact |
| Session persistence (sessionStorage) | Intact |
| Legal-assistant suppression (dual guard) | Intact |
| Escalation links | Intact |
| Mode badges | Intact |
| Escape key close | Intact |

---

## Frozen Files

| File | Status |
|------|--------|
| assets/css/styles.css | UNTOUCHED |
| assets/css/ui-shell.css | UNTOUCHED |
| assets/js/site.js | UNTOUCHED |
| assets/js/ui-shell.js | UNTOUCHED |
| assets/js/premium-fixes.js | UNTOUCHED |
| assets/css/premium-fixes.css | UNTOUCHED |

---

## Remaining Manual Steps

The following cannot be verified in a static QA pass and require
the user to run the servers:

1. `pip install -r requirements.txt` in the active venv
2. `uvicorn app.main:app --port 8787` — backend starts without crash
3. `python -m http.server 8080` — frontend serves HTML files
4. Open browser → click FAB → verify green dot
5. Send message → verify bot responds
6. Upload file → verify acknowledgment
7. Kill backend → verify red dot + diagnostic error message

---

## Verdict

All static checks pass. The chat runtime stabilization fixes are
correctly implemented. End-to-end verification requires running the
servers (see manual steps above).
