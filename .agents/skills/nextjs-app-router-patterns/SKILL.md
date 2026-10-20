---
name: nextjs-app-router-patterns
description: Build or review Next.js 15 App Router code - server vs client components, data fetching, caching and revalidation, server actions, route handlers, middleware, streaming, metadata, images, env vars, deployment on Vercel. Use for any Next.js task, migration to App Router, or Next.js performance/caching confusion.
---
# Next.js 15 App Router patterns

- **Rendering choice** per route: static (SSG) for marketing/docs; ISR (`revalidate`) for catalog-like content; dynamic SSR for per-user data; streaming with `loading.tsx` + `<Suspense>` to show shell fast; CSR only for highly interactive widgets.
- **Server vs client**: default server. `"use client"` at leaf components. Pass serializable props only. Keep secrets and DB access in server code (`server-only` import).
- **Data fetching**: fetch in server components close to where data is used; run independent requests in parallel (`Promise.all`); avoid waterfalls; preload patterns for known next needs; client-side fetching via TanStack Query for interactive/polling data.
- **Caching (verify against current Next 15 docs; defaults changed from 14)**: fetch and GET handlers are NOT cached by default in 15 - opt in explicitly; use `React.cache` for per-request dedupe; `revalidateTag`/`revalidatePath` after mutations; know the four layers (request memoization, data cache, full-route cache, router cache) and which one is surprising you.
- **Mutations**: Server Actions for form-driven mutations with Zod validation, auth check, and `revalidate*`; return typed results (`{ok, errors}`); route handlers for webhooks, public APIs, and non-form clients. Treat actions as public endpoints: authenticate + authorize every call.
- **Routing**: nested layouts for persistent UI; route groups `(group)` for organization; parallel/intercepting routes for modals; `error.tsx`, `not-found.tsx`, `loading.tsx` per segment; dynamic params validated.
- **Middleware**: lightweight only (auth redirect, locale, headers); no heavy DB work; runs at the edge.
- **Metadata/SEO**: `generateMetadata`, OG images, sitemap, robots, canonical URLs, structured data.
- **Assets**: `next/image`, `next/font`, `next/script` strategy for third parties.
- **Env**: only `NEXT_PUBLIC_*` reaches the browser; validate env with Zod at boot.
- **Deploy**: Vercel (default) - preview deployments per PR, env per environment, ISR/edge awareness; Docker/static export when self-hosting; free-tier limits documented.
- **Testing**: Vitest/Jest for units, React Testing Library for components, Playwright for E2E critical flows.
- **Observability**: OpenTelemetry/Vercel analytics, error tracking (Sentry), Web Vitals reporting.
