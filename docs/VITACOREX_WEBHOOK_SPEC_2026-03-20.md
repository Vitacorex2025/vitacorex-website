# VitaCoreX Webhook Spec

Environment variables:
- `VITACOREX_CRM_WEBHOOK_URL`
- `VITACOREX_CRM_WEBHOOK_TOKEN`
- `VITACOREX_ALERT_WEBHOOK_URL`

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` when `VITACOREX_CRM_WEBHOOK_TOKEN` is configured

Payload shape:
```json
{
  "lead_id": "vcx-20260320-abcdef1234",
  "created_at": "2026-03-20T12:00:00+00:00",
  "purpose": "company_review",
  "pipeline_stage": "New",
  "client_type": "company",
  "language": "en",
  "asset_requested": "executive-brief",
  "lead_scoring": {},
  "contact": {},
  "context": {},
  "attachments": [],
  "notes": {}
}
```

Failure behavior:
- Lead storage remains primary and local structured storage always completes first.
- CRM webhook delivery is best-effort.
- Failures are appended to `storage/vitacorex_leads/audit/alerts.jsonl`.
- Optional alert fan-out uses `VITACOREX_ALERT_WEBHOOK_URL`.
