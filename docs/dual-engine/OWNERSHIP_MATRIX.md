# DocketMint Dual Engine Ownership Matrix

## Purpose

This matrix assigns ownership by workstream so implementation order stays disciplined even before named engineers are assigned.

## Ownership Domains

| Domain | Owns | Does Not Own | Depends On |
| --- | --- | --- | --- |
| Schema | Canonical objects, record definitions, permissions model, migration order, shared relations | visual polish, marketing pages, standalone environment forks | master spec, decisions, gate sequence |
| Frontend shell | app home, environment chooser, shared layout, navigation, route entry logic | canonical schema design, billing expansion before permission stability | schema domain, gate rules |
| Legal engine | Legal Workflow views, legal actions, legal-specific validations over shared records | separate auth, separate billing, independent legal database | schema domain, frontend shell, Gate A |
| Recovery engine | Recovery Pipeline views, recovery actions, recovery-specific validations over shared records | separate auth, separate billing, independent recovery database | schema domain, frontend shell, Gate A |
| Docs and testing | test plans, smoke steps, migration notes, changelog, acceptance logging, release discipline | feature ownership that bypasses verification | every implementation domain |

## Ownership Order

The default implementation order is:

1. Schema
2. Frontend shell
3. Legal engine and Recovery engine, depending on active gate
4. Docs and testing across the whole pass

## Gate Ownership

| Gate | Primary owner | Supporting owners |
| --- | --- | --- |
| Gate A / Foundation | Schema | Frontend shell, docs and testing |
| Gate B / Legal MVP | Legal engine | Schema, frontend shell, docs and testing |
| Gate C / Recovery MVP | Recovery engine | Schema, frontend shell, docs and testing |
| Gate D / Cross-linking | Schema | Legal engine, Recovery engine, frontend shell, docs and testing |
| Gate E / Generation module | Schema | Legal engine, Recovery engine, frontend shell, docs and testing |
| Gate F / Production readiness | Docs and testing | Schema, frontend shell, legal engine, recovery engine |

## Escalation Rules

1. If schema is unresolved, UI work cannot define its own substitute model.
2. If frontend shell is unstable, mobile wrapper work cannot begin.
3. If Gate A is not accepted, Legal and Recovery may not create separate data shapes to move faster.
4. If Gate D is not accepted, generation-module work may not begin.

## Current Constraint

This matrix assigns ownership by domain, not by named person, because the active thread is not attached to the real Git mainline or a staffed execution board yet.
