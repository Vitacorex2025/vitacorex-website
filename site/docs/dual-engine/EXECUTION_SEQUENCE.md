# DocketMint Dual Engine Execution Sequence

## Objective

This file defines the only valid macro-sequence for taking DocketMint from the current legacy state to a production-ready dual-engine platform.

## Macro Phases

### Phase 1 - Reset

Purpose:

1. freeze the product definition
2. freeze the technical source of truth
3. stop parallel product-line drift
4. define execution protocol and sequencing

Included layers:

1. Layer 00
2. Layer 01
3. Layer 02
4. Layer 03

Exit condition:

1. the team agrees on one product, one repo, one deploy path, one model, and one ordered build sequence

### Phase 2 - Foundation

Purpose:

1. establish canonical schema
2. establish permissions and role model
3. establish shared auth, membership, billing, and audit boundaries
4. establish stable app home and environment chooser behavior

Primary gate:

1. Gate A

Exit condition:

1. the shared platform foundation is stable enough to support both environments without duplication

### Phase 3 - Engines

Purpose:

1. deliver Legal Workflow MVP
2. deliver Recovery Pipeline MVP
3. keep both environments on top of shared canonical objects

Primary gates:

1. Gate B
2. Gate C

Exit condition:

1. both engines are minimally usable without splitting records, auth, or billing

### Phase 4 - Cross-Linking

Purpose:

1. connect Legal and Recovery views over the same records
2. preserve escalation continuity and handoff logic
3. make cross-environment navigation and visibility coherent

Primary gate:

1. Gate D

Exit condition:

1. handoff and shared-record continuity work across both environments

### Phase 5 - Automation

Purpose:

1. introduce generation and automation modules
2. keep these modules inside DocketMint as capabilities, not new products
3. avoid premature expansion before cross-linking is stable

Primary gate:

1. Gate E

Exit condition:

1. automation and generation behave as integrated capability modules over the stable shared model

### Phase 6 - Hardening

Purpose:

1. production hardening
2. release discipline
3. observability, resilience, and regression protection
4. readiness for public deployment

Primary gate:

1. Gate F

Exit condition:

1. the product is ready for production rollout with verified foundation, engines, linking, and hardening

## Gate Order Rule

The only valid macro-gate order is:

`Gate A -> Gate B -> Gate C -> Gate D -> Gate E -> Gate F`

Movement to the next gate is blocked until the previous gate is explicitly accepted.

## Packet Generation Rule

Packet generation and adjacent generation-module work must not start before Gate D is accepted.

The reason is simple: generation depends on stable shared records, permissions, and cross-environment continuity.

## Execution Board

| Item | Scope | Status | Notes |
| --- | --- | --- | --- |
| Phase 1 / Reset | Layers 00-03 governance | accepted | Product, rules, and sequence are documented. |
| Gate A / Foundation | Canonical model, permissions, and stack foundation | in progress | Stack choice is now locked, but mainline repo cutover and schema work are still pending. |
| Gate B / Legal MVP | Legal Workflow MVP | planned | Blocked on Gate A acceptance. |
| Gate C / Recovery MVP | Recovery Pipeline MVP | planned | Blocked on Gate A acceptance. |
| Gate D / Cross-linking | Shared continuity and handoff | planned | Blocked on Gates B and C acceptance. |
| Gate E / Generation module | Integrated capability modules | planned | Blocked on Gate D acceptance. |
| Gate F / Production readiness | Hardening and release | planned | Blocked on Gate E acceptance. |

## Current State

The current workspace has completed the reset-phase governance layers only.

No implementation gate is accepted yet.
