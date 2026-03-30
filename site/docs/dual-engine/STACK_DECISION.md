# DocketMint Stack Decision

## Decision

DocketMint adopts a single technology foundation:

1. Next.js App Router for the application shell and routing layer
2. Supabase for auth, Postgres, storage, and Row Level Security
3. Vercel for the main frontend deployment path
4. Next.js Route Handlers and server-side utilities inside the Next app for the first backend layer

## Why This Stack Wins

### App Shell And Routing

The extracted `deadline_v10` technical line already demonstrates a Next.js App Router structure with route handlers and server-rendered application flow. That is a stronger long-term SaaS foundation than the current file-backed Python shell.

Next.js documents App Router as a file-system based router using React Server Components, Suspense, and Server Functions, and Route Handlers as request handlers built from Web Request and Response APIs.

### Auth And Data Foundation

Supabase gives DocketMint one coherent base for:

1. auth and session handling
2. Postgres as canonical state
3. Storage for controlled asset access
4. RLS-based authorization on database and storage access

This is a better fit for a multi-tenant SaaS than local file-backed persistence.

### Deployment Story

Vercel is approved as the main frontend deployment path for the Next.js application.

The target story is:

1. one Next.js app per environment
2. one Supabase project per environment
3. SSR-aware auth and server-side utilities inside the same Next app

That story replaces the legacy split between a static shell and a separate Python and Render runtime.

## Approved Foundations

### Next.js App Router

Approved as:

1. shell layout system
2. route and page composition layer
3. first routing boundary for app entry and authenticated surfaces
4. home and environment chooser surface foundation

### Supabase

Approved as:

1. auth and session foundation
2. Postgres foundation for canonical records
3. storage foundation for protected files and artifacts
4. RLS foundation for tenant-aware access control

### Next Route Handlers

Approved as:

1. first backend layer inside the Next app
2. place for SSR-safe auth-aware server utilities
3. place for environment-aware API boundaries before introducing extra services

### Separate Workers And Services

Not banned forever, but explicitly deferred.

They are allowed only when:

1. load is proven
2. isolation is justified
3. App Router and Route Handler boundaries are no longer sufficient

## Explicit Bans

1. File-backed persistence is banned as core production state.
2. Local JSON collections are banned as the canonical multi-tenant data layer.
3. The Python and Render line is banned as the primary production path.
4. A static marketing shell plus a separate SaaS runtime is banned as the long-term architecture.

## Current Constraint

This thread is still operating inside the extracted Python reference tree, not the actual Next.js mainline checkout.

Because of that, this layer records the approved stack without pretending the cutover is already complete.

The existing [vercel.json](C:/Users/sergz/OneDrive/Desktop/VITACOREX%20docketmint.app/сайт%20и%20арр/30/vercel.json) in this workspace remains legacy bridge configuration for the Python shell and is not the target deploy model.

No `supabase/config.toml` was added here because this workspace is not the actual Supabase-backed mainline repo.

## Official Reference Basis

These decisions are aligned with official product documentation:

1. [Next.js App Router](https://nextjs.org/docs/app)
2. [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
3. [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
4. [Supabase SSR for Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
5. [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
6. [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
