# Contract Generator Build Report

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Questionnaire-driven contract document generator with DOCX
>        output via python-docx, clause/template library, generate +
>        download endpoints.

---

## Objective

Build a contract generation system that:
1. Accepts questionnaire input (contract type, parties, terms)
2. Assembles clause sections from a template library
3. Generates a professional DOCX document via python-docx
4. Stores the file and returns a download URL
5. Includes prominent legal disclaimers on every document

---

## Architecture

```
Questionnaire (JSON)
  │
  ▼
POST /api/contracts/generate
  │
  ├─ Validate contract type
  ├─ Build params from request
  │
  ▼
contract_templates.py
  │
  ├─ CONTRACT_TYPES — clause list per type
  ├─ CLAUSE_BUILDERS — registry of clause functions
  ├─ build_contract_sections(type, params) → [(heading, body), ...]
  │
  ▼
docx_generator.py
  │
  ├─ generate_contract_docx(type, params) → bytes
  ├─ Creates Document(), adds header/disclaimer/sections/footer
  ├─ Serializes to io.BytesIO
  │
  ▼
Store on disk: uploads/generated/{contract_id}/VCX_{type}_{id}.docx
  │
  ▼
Response: { contract_id, download_url, filename, size_bytes }
  │
  ▼
GET /api/contracts/{contract_id}/download → DOCX file
```

---

## Files Created

### 1. `vcx-api/app/services/contract_templates.py` (~450 lines)

**Clause template library** — contains reusable clause functions that
accept questionnaire parameters and return (heading, body) tuples.

| Component | Count | Purpose |
|-----------|-------|---------|
| Contract types | 4 | NDA, Service, Employment, Contractor |
| Clause builders | 24 | One function per clause type |
| CLAUSE_BUILDERS registry | 1 | Maps clause key → function |
| `build_contract_sections()` | 1 | Assembles ordered sections for a type |
| `get_contract_types()` | 1 | Returns type list for questionnaire |
| `DISCLAIMER_TEXT` | 1 | Standard legal disclaimer |

**Contract types and their clauses:**

| Type | Label | Clause Count |
|------|-------|-------------|
| `nda` | Non-Disclosure Agreement | 11 |
| `service` | Service Agreement | 15 |
| `employment` | Employment Agreement | 13 |
| `contractor` | Independent Contractor Agreement | 13 |

**Clause library (24 functions):**

| # | Clause | Used By |
|---|--------|---------|
| 1 | preamble | all |
| 2 | recitals | all |
| 3 | confidentiality | nda, service, employment, contractor |
| 4 | term_and_termination | all |
| 5 | permitted_disclosure | nda |
| 6 | return_of_materials | nda |
| 7 | remedies | nda |
| 8 | scope_of_services | service, contractor |
| 9 | payment_terms | service |
| 10 | ip_ownership | service, employment, contractor |
| 11 | indemnification | service, contractor |
| 12 | liability_limitation | service, contractor |
| 13 | warranty | service, employment |
| 14 | force_majeure | service |
| 15 | governing_law | all |
| 16 | assignment | nda, service |
| 17 | arbitration | employment |
| 18 | non_compete | employment |
| 19 | non_solicitation | employment |
| 20 | position_and_duties | employment |
| 21 | compensation | employment |
| 22 | compensation_contractor | contractor |
| 23 | independent_contractor_status | contractor |
| 24 | miscellaneous | all |

### 2. `vcx-api/app/services/docx_generator.py` (~180 lines)

**DOCX creation engine** — uses python-docx to build formatted documents.

| Function | Purpose |
|----------|---------|
| `is_available()` | Checks if python-docx is installed |
| `generate_contract_docx()` | Main entry point — builds full DOCX |
| `_add_draft_header()` | "DRAFT — NOT LEGAL ADVICE" on every page |
| `_add_disclaimer_page()` | Full disclaimer page before content |
| `_add_section_unnumbered()` | Preamble, recitals, signatures |
| `_add_section_numbered()` | Article N: Heading format |
| `_add_footer_disclaimer()` | Small footer disclaimer |

**Document features:**
- Calibri 11pt font, justified alignment
- VCX brand navy (#173A63) headings
- 1.25" margins
- Red "DRAFT" header on every page
- Full disclaimer page before contract text
- Gray footer disclaimer
- Numbered articles with sub-sections

### 3. `vcx-api/app/models/contract_generator.py` (~60 lines)

**Pydantic models:**

| Model | Purpose |
|-------|---------|
| `ContractGenerationRequest` | Questionnaire input (type, parties, terms) |
| `ContractTypeInfo` | Type id + label for list endpoint |
| `ContractTypesResponse` | List response wrapper |
| `ContractGenerationResponse` | Generation result (id, URL, filename) |

### 4. `vcx-api/app/routers/contracts.py` (modified, +80 lines)

**New endpoints:**

| Method | Path | Rate | Purpose |
|--------|------|------|---------|
| GET | `/api/contracts/types` | none | List available contract types |
| POST | `/api/contracts/generate` | 10/min | Generate DOCX from questionnaire |
| GET | `/api/contracts/{id}/download` | none | Download generated DOCX |

**Existing endpoints (UNCHANGED):**

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/contracts/upload` | Upload for analysis |
| POST | `/api/contracts/analyze` | Upload + analyze |
| GET | `/api/contracts/{id}/report` | Get analysis report |

### 5. `vcx-api/app/schema.sql` (modified, +10 lines)

New table:
```sql
CREATE TABLE IF NOT EXISTS generated_contracts (
    id              TEXT PRIMARY KEY,
    contract_type   TEXT NOT NULL,
    filename        TEXT NOT NULL,
    file_path       TEXT NOT NULL,
    size_bytes      INTEGER,
    created_at      TEXT DEFAULT (datetime('now'))
);
```

---

## Disclaimer Strategy

**Every generated document includes THREE disclaimer layers:**

1. **Header (every page):** Red text:
   "DRAFT — NOT LEGAL ADVICE — FOR REFERENCE ONLY"

2. **Disclaimer page (page 1):** Full legal notice before contract text:
   "This document was generated by an automated system... does NOT
   constitute legal advice... consult with a licensed attorney..."

3. **Footer (every page):** Gray text:
   "Generated by VitaCoreX — Not legal advice — Consult licensed counsel"

4. **API response:** `disclaimer` field in `ContractGenerationResponse`

---

## Questionnaire Parameters

All parameters are optional — defaults or placeholder text used if not provided.

| Parameter | Type | Default | Used In |
|-----------|------|---------|---------|
| `contract_type` | str | *required* | All |
| `party_a_name` | str | "[PARTY A NAME]" | All |
| `party_b_name` | str | "[PARTY B NAME]" | All |
| `effective_date` | str | today | All |
| `governing_state` | str | "Florida" | All |
| `term_months` | int | 12 | All |
| `notice_days` | int | 30 | All |
| `purpose` | str | generic | All |
| `scope_of_services` | str | placeholder | Service, Contractor |
| `payment_amount` | str | "[AMOUNT]" | Service |
| `payment_schedule` | str | "monthly" | Service |
| `payment_net_days` | str | "30" | Service |
| `contractor_rate` | str | "[RATE]" | Contractor |
| `job_title` | str | "[JOB TITLE]" | Employment |
| `job_duties` | str | placeholder | Employment |
| `salary` | str | "[SALARY AMOUNT]" | Employment |
| `pay_schedule` | str | "bi-weekly" | Employment |
| `ip_owner` | str | "Party A" | Service, Employment, Contractor |
| `non_compete_months` | str | "12" | Employment |
| `non_compete_geography` | str | governing state | Employment |
| `non_solicit_months` | str | "12" | Employment |

---

## Compile Status

**37/37 Python files compile clean**, including all new files.

---

## Integration with Analyzer

The generator uses the same clause type taxonomy as the analyzer's
16-pattern detection system. This means:

1. A generated NDA can be uploaded to the analyzer
2. The analyzer will detect confidentiality, termination, governing_law,
   assignment clauses
3. Risk scoring and missing-protection detection will work correctly
4. Round-trip integrity: generate → download → upload → analyze

---

## Frozen Files — NOT MODIFIED

| File | Status |
|------|--------|
| `assets/css/styles.css` | UNTOUCHED |
| `assets/css/ui-shell.css` | UNTOUCHED |
| `assets/js/site.js` | UNTOUCHED |
| `assets/js/ui-shell.js` | UNTOUCHED |
| `assets/js/premium-fixes.js` | UNTOUCHED |
| `assets/css/premium-fixes.css` | UNTOUCHED |
| `services/contract_analyzer.py` | UNTOUCHED (analyzer) |
| `models/contract.py` | UNTOUCHED (analyzer models) |

---

## Risk Assessment

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | Users mistake generated doc for legal advice | HIGH | Three-layer disclaimer: header, page, footer |
| 2 | Clause text may not suit all jurisdictions | Medium | Default to Florida; note in disclaimer |
| 3 | python-docx not installed | Low | Graceful 503 error; dependency in requirements.txt |
| 4 | DB table may not exist on first run | Low | Logged warning; generation still succeeds |
| 5 | Large contracts consume disk space | Low | uploads/generated/ can be periodically cleaned |

---

## Rollback

### Remove generator only (keep analyzer):
1. Delete `vcx-api/app/services/contract_templates.py`
2. Delete `vcx-api/app/services/docx_generator.py`
3. Delete `vcx-api/app/models/contract_generator.py`
4. In `vcx-api/app/routers/contracts.py`: remove Phase 8 imports,
   `GENERATED_DIR`, `list_contract_types()`, `generate_contract()`,
   `download_contract()`
5. In `vcx-api/app/schema.sql`: remove `generated_contracts` table
6. Delete `uploads/generated/` directory

No schema migrations. Rollback is purely file-level.
