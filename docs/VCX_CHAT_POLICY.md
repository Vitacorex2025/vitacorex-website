# VCX Chat Policy

---

## Phase 5A: Three-Mode Assistant Architecture

> Added 2026-04-03

### Modes

The assistant now routes every message through one of three internal modes:

| Mode | Trigger | Behavior |
|------|---------|----------|
| `general_chat` | Default for non-legal, non-VCX messages | Open conversation, friendly. Nudges toward legal mode if legal keywords detected. |
| `legal_information` | Legal keywords (core 4 topics + broad legal) | Issue spotting, clarifying questions, checklists, jurisdiction prompting. NEVER gives final legal advice. |
| `vcx_routing` | VCX product/service keywords | Routes user to specific VCX products with links and descriptions. |
| `high_risk` | Criminal, emergencies, representation requests | Immediate escalation. Returns 403-style boundary with intake/consultation links. |

### Routing Priority

1. **High-risk check** (always first) — criminal, representation, emergencies
2. **VCX routing** — mentions of VitaCoreX products or "how do I use"
3. **Legal information** — core 4 topics (keyword score >= 2) or broad legal (2+ legal keywords)
4. **General chat** — everything else

### Legal Mode Controls

- Issue spotting templates per topic (contracts, immigration, auto, Florida)
- Clarifying questions asked before answering
- Preparation checklists appended to answers
- State/jurisdiction gate on applicable topics
- Knowledge retrieval from markdown files
- Disclaimer appended to every legal response
- Escalation links to Structured Intake and product pages
- **NEVER gives final legal advice**

### General Chat Safety

- Detects single legal keywords and adds a nudge toward legal mode
- Does not provide legal opinions in general chat mode
- Greeting detection for friendly first interaction
- Always offers path to legal mode or VCX services

### Frontend Changes

- Mode badge shown on assistant messages (Legal Info, Service Guide, Escalation)
- Mode-specific left-border tint (blue for legal, gold for routing, red for escalation)
- Broader greeting: lists all three capabilities (legal, VCX services, general)
- 6 suggestion chips instead of 4

### API Response

`ChatResponse` now includes `mode` field:

```json
{
  "session_id": "...",
  "answer": "...",
  "mode": "legal_information",
  "status": "answered",
  "event_type": "answered",
  "topic": "contracts",
  "escalation_links": [...]
}
```

---

## Phase 4 Fix: Transcript Security

> Added 2026-04-02

## Problem

`GET /api/legal-chat/transcript/{session_id}` was publicly accessible with only a UUID.
While UUIDs are unguessable, this did not meet the bar for production access control.

## Solution

Transcript access now requires one of two auth methods:

### Method 1: Admin Token (header)

Same `VCX_ADMIN_TOKEN` env var used by `/api/review/*`.

```http
GET /api/legal-chat/transcript/{session_id}
X-Admin-Token: <admin-token>
```

### Method 2: Signed HMAC Token (query parameter)

Time-limited, session-scoped token generated via admin-only endpoint.

```http
POST /api/legal-chat/transcript-token/{session_id}
X-Admin-Token: <admin-token>
Content-Type: application/json

Query params:
  expiry_minutes=60   (optional, 1-1440, default 60)
```

Response:

```json
{
  "ok": true,
  "session_id": "...",
  "token": "<signed-token>",
  "expiry_minutes": 60
}
```

Use the token:

```http
GET /api/legal-chat/transcript/{session_id}?token=<signed-token>
```

## Token Format

```
base64url(session_id:expires_unix).hmac_sha256_hex
```

- Payload: `session_id:unix_timestamp`
- Signature: HMAC-SHA256 with `VCX_TRANSCRIPT_SECRET` (falls back to `VCX_ADMIN_TOKEN`)
- Constant-time signature comparison (`hmac.compare_digest`)

## Error Responses

| Condition | Status | Detail |
|-----------|--------|--------|
| No token or header | 403 | "Transcript access requires a valid token or admin credentials." |
| Invalid admin token | 403 | "Invalid admin token." |
| Expired HMAC token | 403 | "Token expired." |
| Tampered HMAC token | 403 | "Invalid token signature." |
| Token for wrong session | 403 | "Token does not match requested session." |
| Malformed token | 403 | "Malformed token." |
| Session not found | 404 | "Session not found or empty." |

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VCX_ADMIN_TOKEN` | `change-me` | Admin token for header auth (shared with review.py) |
| `VCX_TRANSCRIPT_SECRET` | (falls back to VCX_ADMIN_TOKEN) | HMAC signing secret for transcript tokens |
| `VCX_TRANSCRIPT_TOKEN_TTL` | `60` | Default token lifetime in minutes |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `GET /api/legal-chat/transcript/{id}` | 30/minute |
| `POST /api/legal-chat/transcript-token/{id}` | 10/minute |

## Security Properties

1. **No public access** — 403 returned without valid credentials
2. **Constant-time comparison** — both admin token and HMAC signature use `compare_digest`
3. **Time-limited tokens** — HMAC tokens expire (default 60 min, max 24h)
4. **Session-scoped tokens** — a token for session A cannot read session B
5. **No schema changes** — auth is stateless (HMAC), no new DB tables
6. **No frontend changes** — transcript endpoint is admin-only, not called by UI

## Files Changed

| File | Change |
|------|--------|
| `vcx-api/app/services/transcript_auth.py` | Created (HMAC token generation + verification) |
| `vcx-api/app/routers/chat.py` | Modified (auth gate + token-generation endpoint) |
| `docs/VCX_CHAT_POLICY.md` | Created (this document) |
| `docs/VCX_CHANGELOG.md` | Updated |
