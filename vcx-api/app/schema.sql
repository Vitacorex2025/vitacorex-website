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
