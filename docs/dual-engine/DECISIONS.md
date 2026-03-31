# DocketMint Dual Engine Decisions

## Product Sentence

DocketMint is one platform with two operational engines: Legal Workflow and Recovery Pipeline.

## Hard Decisions

1. DocketMint is the only active product brand.
2. Legal Workflow and Recovery Pipeline are operating environments, not separate products.
3. Both environments run on shared canonical objects, shared identity, shared billing, and shared audit history.
4. Generator behavior is a capability module inside DocketMint, never a separate app surface.
5. Post-login home is the environment chooser for dual-access users.
6. Direct drop into a calendar, generator, or other single-purpose surface is not the default for dual-access users.
7. The long-term technical mainline is the Next.js 14 and Supabase line derived from the `deadline_v10` build.
8. The current Python and Render tree is a reference library, not the target foundation.
9. The data model must converge, not fork, between Legal and Recovery.
10. Any new layer that introduces ambiguity must log it before further implementation continues.

## Approved Architectural Direction

### Product Model

One workspace platform with role-aware interfaces across Legal Workflow and Recovery Pipeline.

### Technical Model

One repo, one deploy path, one canonical schema, one auth system, one billing system.

### Canonical Object Rule

The following objects remain shared across both environments:

1. workspace
2. user
3. membership
4. organization
5. contact
6. matter or case
7. obligation or claim
8. event
9. communication
10. document
11. note
12. task
13. payment or settlement
14. audit entry

## Current Constraint

This thread is operating in a non-Git extracted workspace. The intended branch name is `feature/docketmint-dual-engine-reset`, but the branch cannot be created until the work moves into a real Git checkout.
