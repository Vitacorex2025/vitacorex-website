-- VCX Intake OS + Legal Chat — SQLite Schema
-- ===========================================

-- Legal Chat (from starter kit)
-- ===========================================
CREATE TABLE IF NOT EXISTS sessions (
    id            TEXT PRIMARY KEY,
    topic         TEXT,
    state         TEXT,
    language      TEXT DEFAULT 'en',
    created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id    TEXT NOT NULL REFERENCES sessions(id),
    role          TEXT NOT NULL,
    content       TEXT NOT NULL,
    created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id    TEXT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT,
    notes         TEXT,
    source        TEXT DEFAULT 'chat',
    created_at    TEXT DEFAULT (datetime('now'))
);

-- Intake OS: Organizations
-- ===========================================
CREATE TABLE IF NOT EXISTS organizations (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    size            TEXT,
    annual_revenue  TEXT,
    accounts_receivable TEXT,
    agency_usage    TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

-- Intake OS: Contacts
-- ===========================================
CREATE TABLE IF NOT EXISTS contacts (
    id            TEXT PRIMARY KEY,
    org_id        TEXT REFERENCES organizations(id),
    full_name     TEXT NOT NULL,
    email         TEXT NOT NULL,
    phone         TEXT,
    state         TEXT,
    client_type   TEXT NOT NULL DEFAULT 'company',
    created_at    TEXT DEFAULT (datetime('now')),
    updated_at    TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Intake OS: Matters
-- ===========================================
CREATE TABLE IF NOT EXISTS matters (
    id              TEXT PRIMARY KEY,
    contact_id      TEXT NOT NULL REFERENCES contacts(id),
    org_id          TEXT REFERENCES organizations(id),
    service_type    TEXT NOT NULL,
    urgency         TEXT NOT NULL DEFAULT 'Standard',
    message         TEXT,
    client_type     TEXT NOT NULL DEFAULT 'company',
    status          TEXT NOT NULL DEFAULT 'intake_received',
    triage_score    INTEGER,
    triage_notes    TEXT,
    magic_token     TEXT NOT NULL UNIQUE,
    lead_id         INTEGER REFERENCES leads(id),
    assigned_to     TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_matters_token ON matters(magic_token);
CREATE INDEX IF NOT EXISTS idx_matters_status ON matters(status);

-- Intake OS: Documents
-- ===========================================
CREATE TABLE IF NOT EXISTS documents (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    filename        TEXT NOT NULL,
    original_name   TEXT NOT NULL,
    content_type    TEXT,
    size_bytes      INTEGER,
    storage_path    TEXT NOT NULL,
    uploaded_at     TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_documents_matter ON documents(matter_id);

-- Intake OS: Checklists
-- ===========================================
CREATE TABLE IF NOT EXISTS checklists (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    label           TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_complete     INTEGER NOT NULL DEFAULT 0,
    completed_at    TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_checklists_matter ON checklists(matter_id);

-- Intake OS: Status Events (audit trail)
-- ===========================================
CREATE TABLE IF NOT EXISTS status_events (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    old_status      TEXT,
    new_status      TEXT NOT NULL,
    actor           TEXT DEFAULT 'system',
    note            TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_matter ON status_events(matter_id);

-- Intake OS: Deliverables
-- ===========================================
CREATE TABLE IF NOT EXISTS deliverables (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    title           TEXT NOT NULL,
    description     TEXT,
    file_path       TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    created_at      TEXT DEFAULT (datetime('now')),
    delivered_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_deliverables_matter ON deliverables(matter_id);

-- Contract Review Desk (Product 2)
-- ===========================================
CREATE TABLE IF NOT EXISTS contract_reviews (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT REFERENCES matters(id),
    contact_id      TEXT REFERENCES contacts(id),
    document_id     TEXT REFERENCES documents(id),
    status          TEXT NOT NULL DEFAULT 'uploaded',
    extraction_data TEXT,
    risk_score      INTEGER,
    risk_summary    TEXT,
    review_tier     TEXT DEFAULT 'free',
    memo_path       TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    completed_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_contract_reviews_matter ON contract_reviews(matter_id);

-- Contract Clauses
CREATE TABLE IF NOT EXISTS contract_clauses (
    id              TEXT PRIMARY KEY,
    review_id       TEXT NOT NULL REFERENCES contract_reviews(id),
    clause_type     TEXT NOT NULL,
    text_excerpt    TEXT NOT NULL,
    confidence      REAL,
    risk_level      TEXT DEFAULT 'neutral',
    note            TEXT,
    sort_order      INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_contract_clauses_review ON contract_clauses(review_id);

-- Contract Generator (Phase 8)
-- ===========================================
CREATE TABLE IF NOT EXISTS generated_contracts (
    id              TEXT PRIMARY KEY,
    contract_type   TEXT NOT NULL,
    filename        TEXT NOT NULL,
    file_path       TEXT NOT NULL,
    size_bytes      INTEGER,
    created_at      TEXT DEFAULT (datetime('now'))
);

-- Recovery Pilot Studio (Product 3)
-- ===========================================
CREATE TABLE IF NOT EXISTS recovery_pilots (
    id              TEXT PRIMARY KEY,
    contact_id      TEXT REFERENCES contacts(id),
    org_id          TEXT REFERENCES organizations(id),
    status          TEXT NOT NULL DEFAULT 'draft',
    wizard_step     INTEGER DEFAULT 1,
    baseline_data   TEXT,
    analysis_data   TEXT,
    brief_path      TEXT,
    pilot_outline   TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_recovery_pilots_contact ON recovery_pilots(contact_id);

-- Packet Room / Client Portal (Product 4)
-- ===========================================
CREATE TABLE IF NOT EXISTS portal_sessions (
    id              TEXT PRIMARY KEY,
    contact_id      TEXT NOT NULL REFERENCES contacts(id),
    magic_token     TEXT NOT NULL UNIQUE,
    expires_at      TEXT NOT NULL,
    created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_portal_sessions_token ON portal_sessions(magic_token);

CREATE TABLE IF NOT EXISTS matter_comments (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    author_type     TEXT NOT NULL DEFAULT 'client',
    author_name     TEXT,
    content         TEXT NOT NULL,
    created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_matter_comments_matter ON matter_comments(matter_id);

CREATE TABLE IF NOT EXISTS packet_exports (
    id              TEXT PRIMARY KEY,
    matter_id       TEXT NOT NULL REFERENCES matters(id),
    format          TEXT NOT NULL DEFAULT 'pdf',
    file_path       TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    created_at      TEXT DEFAULT (datetime('now')),
    ready_at        TEXT
);
CREATE INDEX IF NOT EXISTS idx_packet_exports_matter ON packet_exports(matter_id);

-- Deadline Calendar (Product 5)
-- ===========================================
CREATE TABLE IF NOT EXISTS calendar_events (
    id              TEXT PRIMARY KEY,
    owner_id        TEXT NOT NULL DEFAULT 'default',
    title           TEXT NOT NULL,
    event_type      TEXT NOT NULL DEFAULT 'followup',
    start_at        TEXT NOT NULL,
    end_at          TEXT,
    status          TEXT NOT NULL DEFAULT 'scheduled',
    priority        TEXT NOT NULL DEFAULT 'medium',
    description     TEXT,
    contact_id      TEXT REFERENCES contacts(id),
    matter_id       TEXT REFERENCES matters(id),
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cal_events_start ON calendar_events(start_at);
CREATE INDEX IF NOT EXISTS idx_cal_events_status ON calendar_events(status);
CREATE INDEX IF NOT EXISTS idx_cal_events_matter ON calendar_events(matter_id);

CREATE INDEX IF NOT EXISTS idx_cal_events_owner ON calendar_events(owner_id);

CREATE TABLE IF NOT EXISTS calendar_day_notes (
    id              TEXT PRIMARY KEY,
    owner_id        TEXT NOT NULL DEFAULT 'default',
    note_date       TEXT NOT NULL,
    short_text      TEXT NOT NULL DEFAULT '',
    content         TEXT NOT NULL DEFAULT '',
    status          TEXT NOT NULL DEFAULT 'open',
    display_priority TEXT NOT NULL DEFAULT 'medium',
    contact_id      TEXT REFERENCES contacts(id),
    matter_id       TEXT REFERENCES matters(id),
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cal_notes_date ON calendar_day_notes(note_date);
CREATE INDEX IF NOT EXISTS idx_cal_notes_owner ON calendar_day_notes(owner_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cal_notes_owner_date ON calendar_day_notes(owner_id, note_date);

-- ===========================================
-- vcx-api v2 — catalog-driven requests, quotes, orders,
-- payments, provider events, durable outbox, event history.
-- Additive: legacy tables above are untouched.
-- ===========================================
CREATE TABLE IF NOT EXISTS v2_requests (
    request_id       TEXT PRIMARY KEY,               -- VX-REQ-XXXXXXXX
    access_token     TEXT NOT NULL,                  -- opaque bearer for customer status
    idempotency_key  TEXT NOT NULL UNIQUE,
    service_id       TEXT NOT NULL,
    subtype          TEXT,
    lane             TEXT NOT NULL,
    queue            TEXT NOT NULL,
    next_action      TEXT NOT NULL,
    locale           TEXT NOT NULL DEFAULT 'en',
    source_channel   TEXT NOT NULL DEFAULT 'web',
    contact_name     TEXT NOT NULL,
    contact_email    TEXT,
    contact_phone    TEXT,
    details_json     TEXT NOT NULL DEFAULT '{}',
    summary          TEXT,
    consent_privacy  INTEGER NOT NULL DEFAULT 0,
    consent_notice_version TEXT,
    consent_referral INTEGER NOT NULL DEFAULT 0,
    status           TEXT NOT NULL DEFAULT 'SUBMITTED',
    payment_status   TEXT NOT NULL DEFAULT 'NOT_REQUESTED',
    amount_cents     INTEGER,
    catalog_version  TEXT NOT NULL,
    is_test          INTEGER NOT NULL DEFAULT 1,
    created_at       TEXT NOT NULL,
    updated_at       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_v2_req_created ON v2_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_v2_req_queue ON v2_requests(queue);
CREATE INDEX IF NOT EXISTS idx_v2_req_status ON v2_requests(status);

CREATE TABLE IF NOT EXISTS v2_quotes (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id            TEXT NOT NULL,               -- VX-QUO-XXXXXXXX, stable per request
    request_id          TEXT NOT NULL REFERENCES v2_requests(request_id),
    revision            INTEGER NOT NULL,
    amount_cents        INTEGER NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'USD',
    scope_text          TEXT NOT NULL,
    external_costs_text TEXT,
    status              TEXT NOT NULL,               -- SENT|ACCEPTED|SUPERSEDED|EXPIRED
    expires_at          TEXT NOT NULL,
    created_at          TEXT NOT NULL,
    accepted_at         TEXT,
    UNIQUE (quote_id, revision)
);
CREATE INDEX IF NOT EXISTS idx_v2_quotes_request ON v2_quotes(request_id);

CREATE TABLE IF NOT EXISTS v2_orders (
    order_id        TEXT PRIMARY KEY,                -- VX-ORD-XXXXXXXX
    request_id      TEXT NOT NULL UNIQUE REFERENCES v2_requests(request_id),
    service_id      TEXT NOT NULL,
    quote_id        TEXT,
    quote_revision  INTEGER,
    amount_cents    INTEGER NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'USD',
    catalog_version TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'AWAITING_REQUIREMENTS',
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS v2_payments (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id          TEXT NOT NULL REFERENCES v2_requests(request_id),
    order_id            TEXT NOT NULL,               -- pre-allocated; order row created on PAID
    quote_id            TEXT,
    quote_revision      INTEGER,
    idempotency_key     TEXT NOT NULL UNIQUE,
    provider_mode       TEXT NOT NULL,               -- mock|stripe_test|stripe_live
    provider_session_id TEXT NOT NULL UNIQUE,
    payment_intent_ref  TEXT,
    amount_cents        INTEGER NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'USD',
    catalog_version     TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING|PROCESSING|PAID|FAILED|EXPIRED|SUPERSEDED
    checkout_url        TEXT NOT NULL,
    success_url         TEXT NOT NULL,
    cancel_url          TEXT NOT NULL,
    exception_code      TEXT,
    created_at          TEXT NOT NULL,
    updated_at          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_v2_pay_request ON v2_payments(request_id);

CREATE TABLE IF NOT EXISTS v2_provider_events (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    provider          TEXT NOT NULL,                 -- stripe (mock events are stripe-shaped)
    provider_event_id TEXT NOT NULL UNIQUE,
    event_type        TEXT NOT NULL,
    object_id         TEXT,
    request_id        TEXT,
    livemode          INTEGER NOT NULL DEFAULT 0,
    payload_sha256    TEXT NOT NULL,
    status            TEXT NOT NULL DEFAULT 'RECEIVED', -- RECEIVED|PROCESSED|IGNORED|UNMATCHED|ERROR
    note              TEXT,
    received_at       TEXT NOT NULL,
    processed_at      TEXT
);

CREATE TABLE IF NOT EXISTS v2_events (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id         TEXT NOT NULL UNIQUE,           -- evt_<uuid4 hex>
    event_type       TEXT NOT NULL,
    occurred_at_utc  TEXT NOT NULL,
    request_id       TEXT,
    service_id       TEXT,
    locale           TEXT,
    source_channel   TEXT,
    schema_version   TEXT NOT NULL DEFAULT 'vcx-events/1',
    order_id         TEXT,
    quote_id         TEXT,
    appointment_id   TEXT,
    provider_event_id TEXT,
    correlation_id   TEXT,
    actor            TEXT NOT NULL DEFAULT 'system',
    data_json        TEXT NOT NULL DEFAULT '{}'      -- minimal, non-sensitive
);
CREATE INDEX IF NOT EXISTS idx_v2_events_request ON v2_events(request_id);

CREATE TABLE IF NOT EXISTS v2_outbox (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id        TEXT NOT NULL UNIQUE,            -- dedupe key: <source event_id>:<kind>
    source_event_id TEXT,
    request_id      TEXT,
    kind            TEXT NOT NULL,
    channel         TEXT NOT NULL DEFAULT 'email',
    audience        TEXT NOT NULL,                   -- owner|customer
    recipient       TEXT NOT NULL,
    subject         TEXT NOT NULL,
    body_text       TEXT NOT NULL,
    body_html       TEXT,
    status          TEXT NOT NULL DEFAULT 'PENDING', -- PENDING|SENDING|ACCEPTED|ACCEPTED_BY_SINK|FAILED|DEAD
    attempts        INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TEXT NOT NULL,
    last_error      TEXT,
    provider_ref    TEXT,
    created_at      TEXT NOT NULL,
    updated_at      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_v2_outbox_due ON v2_outbox(status, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_v2_outbox_request ON v2_outbox(request_id);

CREATE TABLE IF NOT EXISTS v2_exceptions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    queue       TEXT NOT NULL,                       -- PAYMENT_EXCEPTION|OPS
    code        TEXT NOT NULL,                       -- NOTIFICATION_DEAD|DUPLICATE_PAYMENT|AMOUNT_MISMATCH|UNMATCHED_PAYMENT
    request_id  TEXT,
    ref         TEXT,
    detail      TEXT,
    status      TEXT NOT NULL DEFAULT 'OPEN',        -- OPEN|RESOLVED
    created_at  TEXT NOT NULL,
    resolved_at TEXT
);

-- Visitor counter for the owner's daily report (owner 2026-10-16). No cookies and no raw IP: vid is a hash of
-- IP + user agent + a salt that changes every day, so a visitor can be counted within one day but never followed.
CREATE TABLE IF NOT EXISTS v2_visits (
    pv          TEXT PRIMARY KEY,                    -- random id of one page view (made by the page, not stored there)
    day_salt    TEXT NOT NULL,                       -- YYYY-MM-DD (UTC) the vid hash belongs to
    vid         TEXT NOT NULL,
    path        TEXT NOT NULL,
    ref         TEXT,                                -- referring site (domain only)
    lang        TEXT,
    device      TEXT,                                -- mobile|desktop
    seconds     INTEGER NOT NULL DEFAULT 0,          -- visible time on the page
    created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_v2_visits_created ON v2_visits(created_at);
