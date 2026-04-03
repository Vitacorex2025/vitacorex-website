# Contract Generator Audit — Pre-Build Assessment

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Read-only audit of the current contract system to assess
>        what exists, what is missing, and what must be built for
>        a questionnaire-driven contract generator with DOCX output.

---

## Executive Summary

The current VCX contract system is **100% analyzer**. It reads uploaded
contracts, detects clause patterns via regex, scores risk, and returns
a structured report. There is **no contract generation capability** —
no templates, no clause library, no DOCX creation, no generation
endpoints.

Building a contract generator requires:
1. Template library (clause text per contract type)
2. DOCX generation engine (python-docx write mode)
3. Questionnaire models (Pydantic)
4. Generation + download endpoints (FastAPI)
5. Frontend questionnaire UI (new HTML page or panel)

---

## Current System Inventory

### What EXISTS (Analyzer)

| Component | File | Purpose |
|-----------|------|---------|
| Clause detection | `services/contract_analyzer.py` | 16 regex patterns, risk scoring |
| Text extraction | `services/contract_analyzer.py` | PDF (pdfplumber), DOCX (python-docx READ), TXT |
| Missing protections | `services/contract_analyzer.py` | Per-type expected clause lists |
| Suggested questions | `services/contract_analyzer.py` | Pre-written counsel questions |
| Issue bucketing | `services/contract_analyzer.py` | Priority grouping of findings |
| Upload endpoint | `routers/contracts.py` | `POST /api/contracts/upload` |
| Analyze endpoint | `routers/contracts.py` | `POST /api/contracts/analyze` |
| Report endpoint | `routers/contracts.py` | `GET /api/contracts/{id}/report` |
| Analyzer models | `models/contract.py` | ClauseItem, MissingProtection, etc. |
| Upload validation | `services/upload_validator.py` | Extension, size, MIME checks |
| Analyzer UI | `app/vcx-contract-review/index.html` | Three tiers, upload + analyze |
| Advanced UI | `app/contract-intelligence/index.html` | Questionnaire + issue buckets |

### What does NOT EXIST (Generator)

| Component | Status |
|-----------|--------|
| Contract templates (clause text) | NOT FOUND |
| Clause library (per-type reusable clauses) | NOT FOUND |
| DOCX creation code | NOT FOUND — python-docx used READ-ONLY |
| `templates/` directory | NOT FOUND |
| `generated/` directory | NOT FOUND |
| `POST /api/contracts/generate` | NOT FOUND |
| `GET /api/contracts/{id}/download` | NOT FOUND |
| Generator models | NOT FOUND |
| Generator service | NOT FOUND |
| Generator UI / questionnaire page | NOT FOUND |

---

## Existing Analyzer Architecture

### Clause Patterns (16)

| # | Pattern | Risk Level |
|---|---------|-----------|
| 1 | termination | caution |
| 2 | termination_for_cause | caution |
| 3 | indemnification | caution |
| 4 | liability_limitation | caution |
| 5 | liability_exclusion | neutral |
| 6 | auto_renewal | caution |
| 7 | non_compete | high_risk |
| 8 | non_solicitation | caution |
| 9 | confidentiality | neutral |
| 10 | governing_law | neutral |
| 11 | assignment | neutral |
| 12 | payment_terms | neutral |
| 13 | force_majeure | neutral |
| 14 | ip_ownership | caution |
| 15 | warranty | neutral |
| 16 | arbitration | caution |

### Expected Protections per Contract Type

| Type | Expected Clauses |
|------|-----------------|
| Employment | termination, non_compete, confidentiality, ip_ownership, non_solicitation, governing_law, arbitration, warranty |
| Service | termination, liability_limitation, indemnification, payment_terms, confidentiality, ip_ownership, governing_law, force_majeure, warranty |
| NDA | confidentiality, termination, governing_law, assignment, arbitration |
| Lease | termination, payment_terms, liability_limitation, force_majeure, governing_law, auto_renewal, assignment |
| Purchase | payment_terms, warranty, liability_limitation, indemnification, termination, governing_law, force_majeure, ip_ownership |
| Other | termination, liability_limitation, confidentiality, governing_law, payment_terms |

These type→clause mappings should be reused by the generator to
determine which clauses to include in generated documents.

### python-docx Usage (READ-ONLY)

`contract_analyzer.py` line 304:
```python
from docx import Document
doc = Document(io.BytesIO(content))
paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
```

This is extraction-only. python-docx is capable of creating new
documents, adding paragraphs, headings, tables, and styles — all
needed for the generator.

### "Stronger Clause Suggestions" (Client-Side Only)

`app/contract-intelligence/index.html` contains pre-written clause
suggestion text rendered client-side. These are NOT stored on the
server and NOT available as an API resource. They are:

- Hardcoded in inline JavaScript
- Displayed as text suggestions in the UI
- Exportable only as `.txt` (plain text copy)
- NOT reusable as template clauses

These should be migrated to a server-side clause library for the
generator.

---

## Database Schema (Contracts)

```sql
CREATE TABLE IF NOT EXISTS contract_reviews (
    id TEXT PRIMARY KEY,
    matter_id TEXT,
    status TEXT DEFAULT 'uploaded',
    extraction_data TEXT,
    risk_score INTEGER,
    risk_summary TEXT,
    review_tier TEXT DEFAULT 'free',
    created_at TEXT,
    completed_at TEXT
);

CREATE TABLE IF NOT EXISTS contract_clauses (
    id TEXT PRIMARY KEY,
    review_id TEXT,
    clause_type TEXT,
    text_excerpt TEXT,
    confidence REAL,
    risk_level TEXT,
    note TEXT,
    sort_order INTEGER,
    FOREIGN KEY (review_id) REFERENCES contract_reviews(id)
);
```

The generator will need new tables:
- `generated_contracts` — metadata for generated documents
- Clause templates stored as Python data (no table needed initially)

---

## Endpoint Inventory (Current)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/contracts/upload` | Upload contract file |
| POST | `/api/contracts/analyze` | Upload + analyze |
| GET | `/api/contracts/{id}/report` | Get analysis report |

No generation or download endpoints exist.

---

## Build Requirements

### 1. Contract Template Library

A Python module with clause templates per contract type. Each template
is a function or dict that accepts questionnaire parameters and returns
formatted clause text.

Minimum contract types for v1:
- **Service Agreement** — most requested
- **NDA / Confidentiality** — simple, high demand
- **Employment Agreement** — common need
- **Independent Contractor** — frequent use case

Each template needs:
- Title and preamble (parties, effective date, recitals)
- Clause sections matching the analyzer's 16 clause types
- Signature block
- Standard legal disclaimer

### 2. DOCX Generation Engine

Using python-docx (already in requirements.txt):
- Create Document()
- Add heading (contract title)
- Add party information paragraph
- Add numbered clause sections
- Add signature block table
- Apply consistent styling (font, size, margins)
- Save to bytes for HTTP response

### 3. Questionnaire Models

Pydantic models for generation input:
- `ContractGenerationRequest` — contract type, parties, state,
  specific terms (duration, payment, IP ownership, etc.)
- `ContractGenerationResponse` — ok, contract_id, download URL

### 4. Generation Endpoints

- `POST /api/contracts/generate` — accepts questionnaire, generates
  contract, stores DOCX, returns metadata + download URL
- `GET /api/contracts/{id}/download` — returns DOCX file

### 5. Frontend (Optional for v1)

Could be a new page or a section added to the existing contract
intelligence page. Minimum: a multi-step questionnaire form that
collects party details, selects contract type, and submits to the
generate endpoint.

---

## Integration Points

### Analyzer → Generator

The generator should use the same clause type taxonomy as the analyzer.
This means generated contracts will be analyzable — a user can:
1. Generate a contract
2. Download the DOCX
3. Upload it to the analyzer
4. Verify all expected clauses are detected

### Existing Router

New endpoints should be added to `routers/contracts.py` (same router,
same `/api/contracts/` prefix). This keeps the contract namespace
unified.

### Upload Validator

Generated DOCX files stored server-side do not go through the upload
validator. The download endpoint serves them directly.

---

## Risk Assessment

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | Generated contracts mistaken for legal advice | HIGH | Prominent disclaimer on every page, watermark "DRAFT" |
| 2 | Clause text quality | Medium | Use standard legal language, mark as starting point |
| 3 | State-specific variations | Medium | v1: generic / Florida-focused; note limitations |
| 4 | Template maintenance | Low | Centralized Python module, easy to update |
| 5 | DOCX styling inconsistency | Low | Shared style function for all templates |

---

## Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `vcx-api/app/services/contract_templates.py` | Clause library + template assembly |
| 2 | `vcx-api/app/services/docx_generator.py` | DOCX creation via python-docx |
| 3 | `vcx-api/app/models/contract_generator.py` | Generation request/response models |
| 4 | (modify) `vcx-api/app/routers/contracts.py` | Add generate + download endpoints |

### Files NOT Modified

| File | Reason |
|------|--------|
| `services/contract_analyzer.py` | Analyzer untouched |
| `models/contract.py` | Analyzer models untouched |
| All frozen shell files | Visual-freeze pattern |

---

## Conclusion

The current system provides zero generation capability. All contract
functionality is read-and-analyze. Building the generator is a
greenfield addition that reuses the clause taxonomy and python-docx
dependency but requires new service modules, models, and endpoints.

The analyzer will continue to work unchanged. The generator is
purely additive.
