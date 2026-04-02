# VCX API Map

## Base URL
Development: `http://localhost:8787`
Production: `https://vitacorexllc.com` (configured via VCX_BASE_URL)

## Health
| Method | Path | Auth | Response |
|--------|------|------|----------|
| GET | /healthz | None | `{"ok": true, "service": "VCX Intake OS", "version": "1.0.0"}` |

## Product 1: VCX Intake OS
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /api/intakes | None | Create matter from intake form (multipart/form-data) |
| POST | /api/uploads/{matter_id} | Bearer (magic_token) | Upload additional documents |
| GET | /api/matters/{matter_id} | Bearer (magic_token) | Get full matter detail |
| PATCH | /api/matters/{matter_id}/checklist/{cid} | Bearer (magic_token) | Toggle checklist item |
| GET | /api/review/queue | X-Admin-Token | Admin triage queue (filter, paginate) |
| PATCH | /api/review/matters/{matter_id} | X-Admin-Token | Admin status update |

## Product 2: VCX Contract Review Desk
| Method | Path | Auth | Purpose | Status |
|--------|------|------|---------|--------|
| POST | /api/contracts/upload | None | Upload contract for analysis | Scaffold |
| POST | /api/contracts/analyze | None | One-shot upload + analyze | Scaffold |
| GET | /api/contracts/{review_id}/report | None | Get analysis report | Scaffold (501) |

## Product 3: VCX Recovery Pilot Studio
| Method | Path | Auth | Purpose | Status |
|--------|------|------|---------|--------|
| POST | /api/recovery/pilot | None | Create new pilot assessment | Scaffold |
| PATCH | /api/recovery/pilot/{pilot_id} | None | Update wizard step data | Scaffold |
| GET | /api/recovery/pilot/{pilot_id} | None | Get pilot state + results | Scaffold (501) |
| POST | /api/recovery/pilot/{pilot_id}/brief | None | Generate executive brief PDF | Scaffold (501) |

## Product 4: VCX Packet Room / Client Portal
| Method | Path | Auth | Purpose | Status |
|--------|------|------|---------|--------|
| GET | /api/portal/magic-link/{token} | None | Verify portal access token | Scaffold |
| GET | /api/portal/matters | Bearer token | List client's matters | Scaffold |
| GET | /api/portal/matters/{id}/packet | Bearer token | Get full matter packet | Scaffold (501) |
| POST | /api/portal/matters/{id}/comments | Bearer token | Add client comment | Scaffold (501) |
| GET | /api/portal/matters/{id}/export | Bearer token | Export packet as PDF/ZIP | Scaffold (501) |

## Product 5: Legal Assistant
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /api/legal-chat/message | None | Chat with topic-gated knowledge base |
| POST | /api/legal-chat/escalate | None | Convert session to lead |
