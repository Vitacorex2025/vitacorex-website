# Layer 04 - Technology Foundation: Next.js + Supabase

## Objective

Lock the single technology stack and explain why it becomes the DocketMint foundation.

## Why This Layer Exists

The extracted `deadline_v10` line already shows a stronger long-term SaaS foundation in Next.js and Supabase. The `clean_release` tree is stronger as a product-logic library, not as the future production runtime.

## Depends On

Layers 00 through 03.

## Codex Directive

Work as a principal full-stack engineer and product architect.
Do not create disconnected concept code.
Do not create duplicated entities across Legal and Recovery.
End this pass with a working, coherent artifact.

## Tasks

1. Approve App Router Next.js as the main app shell and routing layer.
2. Approve Supabase as the auth, Postgres, storage, and RLS foundation.
3. Approve Vercel as the main frontend deployment path.
4. Approve route handlers and server-side utilities inside the Next app as the first backend layer.
5. Allow separate workers or services only later and only for proven load.
6. Ban file-backed persistence as core production state.
7. Ban the parallel Python and Render line as the main production path.

## Files Or Areas To Create Or Change

1. `docs/dual-engine/STACK_DECISION.md`
2. `docs/dual-engine/ENVIRONMENT_STRATEGY.md`
3. `vercel.json` if needed
4. `supabase/config.toml` if local dev tooling is actually used in the mainline

## Acceptance Criteria

1. The product has one deploy story: one Next.js app and one Supabase project per environment.
2. There is no ambiguity about where auth and session state should live.
3. New decisions are compatible with App Router and RLS.

## Do Not Do

1. Do not build domain logic around local JSON or file persistence.
2. Do not mix static-shell deployment and SaaS app deployment as one runtime.

## Delivery Format For Codex

1. Start by reading the existing code before editing.
2. Explain the minimal architectural move for the layer.
3. Implement the layer fully enough that the app remains coherent.
4. List changed files.
5. List migrations.
6. List follow-up risks.
7. Provide smoke-test steps.
