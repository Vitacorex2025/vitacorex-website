# VCX Phase 5 — Legal Mode Architecture

> Phase 5B | 2026-04-03

## Overview

The legal assistant operates in three modes (Phase 5A) with structured
legal responses (Phase 5B). Legal mode never gives final legal conclusions
and never simulates attorney advice.

---

## Mode Routing (Phase 5A)

| Priority | Mode | Trigger |
|----------|------|---------|
| 1 | `high_risk` | Criminal, emergencies, representation requests |
| 2 | `vcx_routing` | VCX product/service keywords |
| 3 | `legal_information` | Core 4 topics (keyword >= 2) or broad legal (2+ keywords) |
| 4 | `general_chat` | Everything else |

---

## Legal Mode Behavior (Phase 5B)

### 1. Case-Type Detection

Each core topic has sub-types detected by keyword matching:

| Topic | Case Types |
|-------|-----------|
| contracts | employment, service, nda, lease, purchase |
| immigration_packets | family, employment, adjustment, ead, rfe |
| auto_deal_review | new_purchase, used_purchase, lease, financing, trade_in |
| florida_official_sources | traffic, toll, court, dmv, business |

The detected case type selects a **case-type-specific** structured block
(what-matters, what-to-check, documents-needed). If no sub-type is detected,
a `_default` block for the topic is used.

### 2. Structured Response Format

Every legal-mode response with a resolved topic includes three sections:

```
WHAT MATTERS in this type of matter:
  1. ...
  2. ...

WHAT TO CHECK:
  1. ...
  2. ...

WHAT DOCUMENTS ARE NEEDED:
  1. ...
  2. ...
```

These are **static, curated lists** per topic + case type. Not generated.

### 3. Fact-Gathering Sequences

When jurisdiction is not provided, the assistant asks an ordered sequence:

```
1. Jurisdiction (state/county)        -- "Contract enforcement rules vary by state."
2. Case type (employment, NDA, etc.)  -- "Different contract types have different risk areas."
3. Stage (pre-signing, signed, dispute) -- "Available options depend on execution status."
4. Timeline (deadline approaching?)   -- "Urgency affects which service path to recommend."
5. Specific concern                   -- "Targeted review is more useful than a general scan."
6. Counterparty                       -- "Power dynamic affects negotiation leverage."
```

Each question includes a "Why:" explanation so the user understands the purpose.

### 4. Escalation Paths

Each topic has context-aware escalation routes with "when to use" guidance:

| Topic | Escalation Options |
|-------|-------------------|
| contracts | Contract Scanner, Structured Intake, Contract Review Desk, Client Portal |
| immigration_packets | Structured Intake, Packet Room, Client Portal |
| auto_deal_review | Structured Intake, Client Portal |
| florida_official_sources | Structured Intake, Client Portal |

Escalation text format:
```
READY FOR NEXT STEPS? Here are your options:

  -> Upload to Contract Scanner: Automated clause detection... -- You have the contract file ready.
  -> Submit to Structured Intake: Advisor review... -- You want a human reviewer.
```

### 5. Knowledge Base Integration

If the knowledge base (markdown files in `vcx-api/knowledge/`) has matching
chunks for the user's question, they appear **above** the structured block:

```
Based on your question, here is what I found:
  - [KB chunk title]: [KB chunk snippet]

WHAT MATTERS in this type of matter:
  1. ...
```

### 6. Broad Legal Topics

Topics outside the core 4 (e.g., bankruptcy, employment law, estate planning)
get a structured fact-gathering response instead of a canned block:

```
To help you further, I would need to know:
  1. What type of legal matter is this?
  2. Which state or jurisdiction is involved?
  3. Is there a deadline or timeline concern?
  4. Have you already consulted with an attorney on this?
```

---

## Safety Controls

| Control | Implementation |
|---------|---------------|
| No final legal conclusions | All responses end with disclaimer; no conclusive statements |
| No attorney simulation | Language uses "flag for review", "areas to check", never "you should" |
| Disclaimer on every legal response | Appended automatically by policy engine |
| High-risk escalation | Criminal, emergencies, representation = immediate escalation |
| Advice-seeking regex | 5 patterns catch "should I sue", "am I liable", etc. |
| Human review loop | Every legal response includes at least one VCX product link |

---

## Data Model

### StructuredLegalBlock (dataclass)

```python
@dataclass
class StructuredLegalBlock:
    what_matters: list[str]       # Key considerations for this matter type
    what_to_check: list[str]      # Specific items to verify/review
    documents_needed: list[str]   # Documents to gather before proceeding
```

### STRUCTURED_BLOCKS (dict)

```
STRUCTURED_BLOCKS[topic][case_type] -> StructuredLegalBlock
STRUCTURED_BLOCKS[topic]["_default"] -> StructuredLegalBlock (fallback)
```

### FACT_GATHERING_SEQUENCE (dict)

```
FACT_GATHERING_SEQUENCE[topic] -> list[{id, question, why}]
```

### ESCALATION_PATHS (dict)

```
ESCALATION_PATHS[topic] -> list[{label, url, description, when}]
```

---

## Coverage

| Topic | Case Types | What-Matters Items | What-to-Check Items | Documents Items | Questions |
|-------|-----------|-------------------|--------------------|-----------------|-----------|
| contracts | 4 specific + default | 5-5 per type | 6 per type | 4-6 per type | 6 |
| immigration_packets | 3 specific + default | 4-5 per type | 5-6 per type | 6-8 per type | 6 |
| auto_deal_review | 1 specific + default | 5 per type | 6 per type | 5-6 per type | 6 |
| florida_official_sources | 2 specific + default | 4-5 per type | 4-6 per type | 4-5 per type | 5 |

---

## Files Changed (Phase 5B)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/legal_chat/knowledge.py` | Enhanced (case-type detection, structured blocks, fact-gathering, escalation paths) |
| 2 | `vcx-api/app/legal_chat/policy.py` | Enhanced (structured response formatting, fact-gathering handler, context-aware escalation) |
| 3 | `docs/VCX_PHASE5_LEGAL_MODE.md` | Created (this document) |
| 4 | `docs/VCX_CHANGELOG.md` | Updated |

## Verification

- 10/10 case-type detection tests pass
- 4/4 structured block completeness checks pass
- 4/4 fact-gathering sequence checks pass
- 8/8 policy engine integration tests pass
- All Python files compile clean
