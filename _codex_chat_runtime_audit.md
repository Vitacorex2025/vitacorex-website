# Chat Runtime Diagnostic Audit

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Read-only diagnostic pass — why the floating chat widget is
>        not responding and not carrying a conversation.

---

## Executive Summary

The chat system has **three CRITICAL blockers** that prevent any
conversation from succeeding. All three must be fixed before the
widget can send or receive messages.

| # | Blocker | Severity | Effect |
|---|---------|----------|--------|
| 1 | `slowapi` not installed in virtualenv | CRITICAL | `main.py` crashes on import — backend never starts |
| 2 | CORS origin mismatch | CRITICAL | Browser blocks API responses (403/CORS error) |
| 3 | `window.VCX_API_BASE` unset | CRITICAL | Fetch hits frontend origin instead of API server |

Additional findings (non-blocking but degrading):

| # | Issue | Severity | Effect |
|---|-------|----------|--------|
| 4 | `pdfplumber` not installed | Medium | PDF contract analysis returns "unsupported" |
| 5 | `python-docx` not installed | Medium | DOCX extraction returns None |
| 6 | No backend readiness signal | Low | Widget sends messages before API is up |
| 7 | Silent fetch failures | Low | User sees generic error, no diagnostics |

---

## Blocker 1: `slowapi` Not Installed

### Evidence

`vcx-api/app/main.py` line 8:
```python
from slowapi import _rate_limit_exceeded_handler
```

`vcx-api/app/rate_limit.py` line 11:
```python
from slowapi import Limiter
```

`slowapi>=0.1.9` is listed in `requirements.txt` but was NOT installed
in the active Python virtualenv. When `uvicorn` tries to start the app,
it crashes immediately with:

```
ModuleNotFoundError: No module named 'slowapi'
```

The backend **never reaches the "startup" event** and no endpoints are
available. The `/healthz` endpoint is unreachable.

### Root Cause

`pip install -r requirements.txt` was never run in the active venv, or
a different venv is active.

### Fix

```bash
cd vcx-api
pip install -r requirements.txt
```

---

## Blocker 2: CORS Origin Mismatch

### Evidence

`.env` contains:
```
VCX_ALLOWED_ORIGINS=http://localhost:8765,http://localhost:3000,http://127.0.0.1:8765
```

But the actual runtime ports are:
- **Frontend:** `python -m http.server 8080` → `http://localhost:8080`
- **Backend:** `uvicorn ... --port 8787` → `http://localhost:8787`

`main.py` reads `VCX_ALLOWED_ORIGINS` and passes the list to
`CORSMiddleware`. Since `http://localhost:8080` is NOT in the list,
the browser rejects ALL cross-origin responses from the API.

The widget's `fetch()` calls succeed at the network level, but the
browser strips the response body and throws a CORS error. The widget
catches this as a generic failure and shows the fallback message.

### Root Cause

`.env` was configured for port 8765 (an older setup or production
proxy). The actual dev servers run on 8080 + 8787.

### Fix

Update `.env`:
```
VCX_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:8787,http://127.0.0.1:8080,http://127.0.0.1:8787
```

---

## Blocker 3: `window.VCX_API_BASE` Not Set

### Evidence

`assets/js/vcx-chat-launcher.js` line 18:
```javascript
var API_BASE = window.VCX_API_BASE || '';
```

No HTML file sets `window.VCX_API_BASE`. The default is `''` (empty
string). This means all fetch calls go to:

```
fetch('' + '/api/legal-chat/message', ...)
→ fetch('/api/legal-chat/message')
→ http://localhost:8080/api/legal-chat/message  (frontend origin!)
```

The frontend server (`python -m http.server 8080`) does not proxy API
requests. It returns a 404 for `/api/legal-chat/message`, which the
widget catches as a failure.

Even if CORS were fixed, the requests go to the wrong server.

### Root Cause

The widget was designed to support cross-origin API via `VCX_API_BASE`,
but the value is never injected.

### Fix Options

1. **Inline script in HTML** (fragile — 39 files):
   ```html
   <script>window.VCX_API_BASE = 'http://localhost:8787';</script>
   ```

2. **Auto-detect in widget JS** (preferred):
   ```javascript
   var API_BASE = window.VCX_API_BASE
     || (location.port === '8080' ? 'http://localhost:8787' : '');
   ```

3. **Config file** (future):
   Load `/assets/config.json` with `{ "apiBase": "..." }`.

Recommended: Option 2 for immediate fix, with production fallback
to same-origin (empty string) when served by a reverse proxy.

---

## Issue 4: Missing `pdfplumber`

`vcx-api/app/services/contract_analyzer.py` line 276:
```python
import pdfplumber
```

Wrapped in `try/except ImportError` — graceful degradation, but PDF
analysis returns "unsupported format" instead of actual results.

Fix: `pip install -r requirements.txt` (same as Blocker 1).

---

## Issue 5: Missing `python-docx`

`vcx-api/app/services/contract_analyzer.py` line 304:
```python
from docx import Document
```

Also wrapped in `try/except ImportError` — graceful degradation.

Fix: Same as above.

---

## Issue 6: No Backend Readiness Signal

The widget immediately shows the welcome message and accepts user
input. If the backend is still starting (or crashed), the first
message silently fails.

There is a `/healthz` endpoint that returns `{"ok": true}`, but
the widget never pings it.

Recommendation: Add a startup readiness check — ping `/healthz`
on widget init, show a connection indicator, and disable input
until the backend responds.

---

## Issue 7: Silent Fetch Failures

The widget catches all fetch errors in a generic `catch(err)` block
and shows a static fallback message. The actual error (CORS, 404,
network, JSON parse) is only logged to `console.error`.

For development, this makes debugging extremely difficult. The user
sees "The assistant is not responding" with no hint about the cause.

Recommendation: In development mode, show the error type in the
bot message (e.g., "Connection failed: CORS error" or "Server
returned 404").

---

## Import Chain Verification

All import chains are structurally correct once dependencies are
installed:

```
main.py
  → dotenv       ✓ (python-dotenv)
  → fastapi      ✓
  → slowapi       ✗ NOT INSTALLED ← crashes here
  → .db          ✓ (sqlite3 stdlib)
  → .rate_limit  → slowapi ✗
  → .routers.chat → .models.chat ✓
                   → .services.chat_attachments ✓
                   → .services.intake_handoff ✓
                   → .services.transcript_auth ✓
                   → .services.upload_validator ✓
  → .routers.contracts → .services.contract_analyzer ✓
                        → pdfplumber ✗ (graceful)
                        → python-docx ✗ (graceful)
```

---

## Database Schema

`db.py` initializes from `schema.sql` on startup. Schema includes:

- `sessions` — chat session tracking
- `messages` — role-based message log (user/assistant/event)
- `leads` — escalation leads
- `contract_reviews` — contract review records
- `contract_clauses` — detected clauses per review
- `intakes` — structured intake submissions

No migrations needed. Schema is create-if-not-exists.

---

## Rate Limiting

`rate_limit.py` creates a `slowapi.Limiter` with `get_remote_address`
as the key function. `VCX_RATE_LIMIT_ENABLED` env var controls
on/off. All router endpoints use `@limiter.limit()` decorators.

Once `slowapi` is installed, rate limiting will work as designed.

---

## Endpoint Inventory (Chat)

| Method | Path | Rate | Status |
|--------|------|------|--------|
| POST | `/api/legal-chat/message` | 30/min | Blocked (server down) |
| POST | `/api/legal-chat/upload` | 10/min | Blocked |
| POST | `/api/legal-chat/escalate` | 10/min | Blocked |
| POST | `/api/legal-chat/convert-to-intake` | 10/min | Blocked |
| GET | `/api/legal-chat/attachments/{session_id}` | 30/min | Blocked |
| GET | `/api/legal-chat/transcript/{session_id}` | 30/min | Blocked |
| POST | `/api/legal-chat/transcript-token/{session_id}` | 10/min | Blocked |
| GET | `/healthz` | none | Blocked |

All blocked because the server never starts (Blocker 1).

---

## Recommended Fix Sequence

1. `pip install -r requirements.txt` in the active venv
2. Update `.env` with correct CORS origins (8080 + 8787)
3. Set `VCX_API_BASE` in widget (auto-detect or inline script)
4. Start backend: `cd vcx-api && uvicorn app.main:app --port 8787`
5. Start frontend: `python -m http.server 8080`
6. Open browser → `http://localhost:8080` → click FAB → type message
7. Verify response appears

---

## Files Examined

| File | Lines | Finding |
|------|-------|---------|
| `vcx-api/app/main.py` | 66 | slowapi import crashes |
| `vcx-api/app/rate_limit.py` | 18 | slowapi import crashes |
| `vcx-api/.env` | 7 | Wrong CORS ports |
| `vcx-api/.env.example` | 58 | Documents port 8765 |
| `vcx-api/requirements.txt` | 9 | Lists all deps correctly |
| `assets/js/vcx-chat-launcher.js` | 630 | API_BASE defaults to '' |
| `vcx-api/app/routers/chat.py` | 349 | All endpoints correct |
| `vcx-api/app/models/chat.py` | 115 | All models correct |
| `vcx-api/app/services/chat_attachments.py` | 166 | Correct |
| `vcx-api/app/services/contract_analyzer.py` | 581 | Graceful import fallback |
| `vcx-api/app/db.py` | ~90 | SQLite WAL, correct |

---

## Conclusion

The chat is non-functional due to three configuration/dependency
issues — NOT code bugs. The widget JS, backend routes, policy engine,
models, and database layer are all structurally sound. Once the three
blockers are resolved, the chat should work end-to-end.
