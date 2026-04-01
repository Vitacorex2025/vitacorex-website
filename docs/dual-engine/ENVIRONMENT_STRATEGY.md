# DocketMint Environment Strategy

## Target Environment Model

DocketMint should run with one Next.js application and one Supabase project per environment.

Approved environments:

1. local development
2. preview
3. production

## Per-Environment Topology

### Local Development

Use:

1. local Next.js app
2. local or isolated development Supabase project
3. local environment variables scoped to development only

Purpose:

1. schema work
2. route handler work
3. RLS policy development
4. environment chooser and shell work

### Preview

Use:

1. Vercel preview deployment for the Next.js app
2. a non-production Supabase project
3. isolated preview secrets and callback URLs

Purpose:

1. validate auth and SSR behavior
2. validate RLS and storage access behavior
3. validate route handlers and server-side utilities
4. validate Legal and Recovery flows without touching production state

### Production

Use:

1. Vercel production deployment for the Next.js app
2. one production Supabase project
3. production-only secrets, callback URLs, and storage buckets

Purpose:

1. serve the single live DocketMint application
2. hold the canonical auth and session state
3. hold the canonical database and protected file state

## Auth And Session Strategy

Auth and session state belong in the Supabase-backed runtime model, not in file-backed local persistence.

That means:

1. browser and server clients use Supabase-aware SSR patterns
2. server-side utilities and route handlers operate against authenticated state
3. protected data access is enforced with RLS
4. protected file access is enforced with storage policies

## Deployment Strategy

### Approved Story

1. Vercel hosts the Next.js app
2. the Next.js app provides pages, layouts, and route handlers
3. Supabase provides auth, Postgres, storage, and policy enforcement

### Deferred Story

Additional workers, queues, or separate services are deferred until:

1. proven performance need
2. clear operational benefit
3. clear ownership and failure isolation

## Explicitly Rejected Story

These are not valid target architecture patterns:

1. static shell deployment plus separate Python SaaS runtime as the default architecture
2. local JSON or file-backed persistence for production canonical state
3. separate auth state living outside the approved Next.js and Supabase flow

## Current Workspace Note

The active workspace in this thread is still the extracted Python reference tree.

Because of that:

1. the current [vercel.json](C:/Users/sergz/OneDrive/Desktop/VITACOREX%20docketmint.app/сайт%20и%20арр/30/vercel.json) is treated as legacy bridge configuration, not the target deploy story
2. no `supabase/config.toml` was added here because local Supabase tooling should live in the actual Next.js mainline, not in the reference shell
3. moving this work into the real Git checkout is still required before the deploy story can be executed for real

## Compatibility Rule

All future architecture decisions must remain compatible with:

1. Next.js App Router
2. Next.js Route Handlers
3. Supabase SSR auth patterns
4. Supabase RLS policies
5. Supabase storage access control

## Official Reference Basis

1. [Next.js App Router](https://nextjs.org/docs/app)
2. [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
3. [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
4. [Supabase SSR for Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
5. [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
6. [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
