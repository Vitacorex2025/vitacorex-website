# VCX Data Model

## Database
- Engine: SQLite 3 with WAL mode and foreign keys enabled
- Location: vcx-api/data/vcx.db
- Schema: vcx-api/app/schema.sql

## Entity Relationship Diagram (Text)
```
organizations ─┐
               ├── contacts ──── matters ──── documents
               │                    │         checklists
               │                    │         status_events
               │                    │         deliverables
               │                    │         matter_comments
               │                    │         packet_exports
               │                    │
               │                    ├── contract_reviews ── contract_clauses
               │                    │
               ├── recovery_pilots  │
               │                    │
sessions ─── messages              portal_sessions
         └── leads
```

## Tables by Product

### Chat (Product 5 - Legal Assistant)
- **sessions** (id, topic, state, language, created_at)
- **messages** (id, session_id FK, role, content, created_at)
- **leads** (id, session_id, name, email, phone, notes, source, created_at)

### Intake OS (Product 1)
- **organizations** (id, name, size, annual_revenue, accounts_receivable, agency_usage)
- **contacts** (id, org_id FK, full_name, email, phone, state, client_type)
- **matters** (id [VCX-YYYYMMDD-NNNN], contact_id FK, org_id FK, service_type, urgency, message, client_type, status, triage_score, triage_notes, magic_token UNIQUE, lead_id FK, assigned_to)
- **documents** (id, matter_id FK, filename, original_name, content_type, size_bytes, storage_path)
- **checklists** (id, matter_id FK, label, sort_order, is_complete, completed_at)
- **status_events** (id, matter_id FK, old_status, new_status, actor, note, created_at)
- **deliverables** (id, matter_id FK, title, description, file_path, status, delivered_at)

### Contract Review Desk (Product 2)
- **contract_reviews** (id, matter_id FK, contact_id FK, document_id FK, status, extraction_data JSON, risk_score, risk_summary, review_tier, memo_path)
- **contract_clauses** (id, review_id FK, clause_type, text_excerpt, confidence, risk_level, note, sort_order)

### Recovery Pilot Studio (Product 3)
- **recovery_pilots** (id, contact_id FK, org_id FK, status, wizard_step, baseline_data JSON, analysis_data JSON, brief_path, pilot_outline JSON)

### Packet Room / Client Portal (Product 4)
- **portal_sessions** (id, contact_id FK, magic_token UNIQUE, expires_at)
- **matter_comments** (id, matter_id FK, author_type, author_name, content)
- **packet_exports** (id, matter_id FK, format, file_path, status, ready_at)

## Status Enums
### Matter Status
intake_received → triage → under_review → action_needed → deliverable_ready → closed

### Contract Review Status
uploaded → extracting → reviewed → memo_ready

### Recovery Pilot Status
draft → baseline → analysis → brief_ready → closed

### Packet Export Status
pending → generating → ready → expired
