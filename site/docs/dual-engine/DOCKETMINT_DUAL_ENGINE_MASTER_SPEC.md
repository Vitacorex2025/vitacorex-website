# DocketMint Dual Engine Master Spec

## Product Definition

DocketMint is one platform with two operational engines: Legal Workflow and Recovery Pipeline.

It is not two separate SaaS products. It is not Deadline CRM plus a second generator product. It is not a recovery shell beside a legal shell. It is one coherent system with shared canonical objects and role-aware interfaces.

## Canonical Platform Rules

1. One workspace model.
2. One user identity model.
3. One membership and entitlement model.
4. One billing system.
5. One shared audit trail.
6. One shared document and note trail.
7. One capability model where specialized tools remain modules, not separate products.

## Operating Environments

### Legal Workflow

Use this environment for matters, deadlines, hearings, filings, documents, and legal execution.

### Recovery Pipeline

Use this environment for outreach, debtors, communications, payment follow-up, settlement movement, and escalation readiness.

## Shared Canonical Objects

These objects must stay shared across both environments:

1. Workspace
2. User
3. Membership
4. Organization
5. Contact or person
6. Matter or case
7. Obligation or claim record
8. Timeline event
9. Communication
10. Document
11. Note
12. Task
13. Payment or settlement event
14. Audit entry

Legal and Recovery may present different views, forms, and workflows, but they must not fork these objects into duplicated product lines.

## Platform Entry Rule

Home after sign-in is the DocketMint environment chooser for users who have access to both environments.

The product must not drop dual-access users straight into a calendar, generator, or dashboard junkyard. Users with access to only one environment may land directly in that environment.

## Capability Boundary Rule

Generator behavior is a capability module, not a separate product surface.

The product may expose generation features for packets, forms, documents, or guided actions, but those features remain inside DocketMint and must never become a separate app identity.

## Technical Mainline Rule

The long-term technical source of truth is the Next.js 14 and Supabase line derived from the `deadline_v10` build.

The Python and Render shell is not the long-term production foundation. It is a reference library for:

1. Product logic
2. Workflow names
3. Route ideas
4. Service boundaries
5. Field mapping
6. Operational sequencing

## Current Implementation Constraint

The active workspace available in this thread is an extracted Python tree without Git metadata. The extracted `deadline_v10` reference is available locally as a Next.js and Supabase project, but not as an attached Git branch yet.

That means this layer establishes governance, execution order, and brand rules now, and records the repo-cutover risk explicitly instead of hiding it.

## Delivery Rule

Every layer pass must end in a coherent artifact with:

1. updated changelog
2. updated migration note
3. updated smoke-test result
4. any new risk logged before work continues
