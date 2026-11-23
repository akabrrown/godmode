---
trigger: always_on
description: Zero-cost CPU, memory, and database connection optimization directive to prevent cloud billing surges and server exhaustion
---
# ZERO-COST CPU & RESOURCE OPTIMIZATION DIRECTIVE

> **Universal Standard for Every Project:** Prevent server CPU exhaustion, excessive Vercel/cloud billing, and database connection exhaustion without paying for upgraded tiers.

## 1. Cache Frequently Requested API Responses
- Every public GET endpoint MUST define explicit HTTP caching headers (`Cache-Control: public, s-maxage=60-300, stale-while-revalidate=600-1800`).
- Never use `export const dynamic = "force-dynamic"` on read-only endpoints unless user-specific cookies or headers dictate the response.
- Use tag-based or path-based revalidation (`revalidatePath`, `revalidateTag`) to bust caches immediately upon mutations, keeping data fresh while serving 99% of requests from Edge CDN.

## 2. Avoid Unnecessary Database Queries
- In Next.js middleware, NEVER run database lookups or remote auth calls (`supabase.auth.getUser()`, session verification) on public pages. Check if auth cookies (`sb-*`, session tokens) actually exist before calling remote auth endpoints.
- If an unauthenticated user visits a protected route (`/dashboard`, `/profile`), redirect immediately based on missing auth cookies without making a remote network call.
- Batch queries using `Promise.all` or joined selects. Select only required columns — never `SELECT *` in high-traffic read paths.

## 3. Remove Infinite Loops & Repeated Background Tasks
- Every `setInterval`, `setTimeout`, and event listener must have a strict cleanup return function in React `useEffect`.
- Deduplicate WebSocket and realtime subscriptions: use shared singleton external stores (`useSyncExternalStore`) so multiple components mounted on the same page don't open duplicate sockets or repeat fetches.
- Never set state unconditionally inside `useEffect` that depends on that state.

## 4. Reduce Unnecessary Frontend API Calls
- Deduplicate requests across co-located components.
- Configure client query clients with reasonable `staleTime` (2–5 minutes) and disable `refetchOnWindowFocus` on static data.
- Favor server components that pass initial data directly into client wrappers over client-side `useEffect` waterfalls.

## 5. Compress & Optimize Images
- In `next.config.js/ts`, always configure:
  ```ts
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800, // 7 days
  },
  compress: true,
  poweredByHeader: false,
  ```
- For image CDNs (Cloudinary, Imgix, Supabase Storage), append `f_auto,q_auto` to ensure devices receive modern AVIF/WebP formats instead of multi-megabyte uncompressed files.

## 6. Block Bots & Scrapers on API Routes
- Protect public `/api/*` endpoints with bot detection (Arcjet `detectBot` / Cloudflare WAF / rate limiting).
- In `robots.ts`, explicitly disallow crawling on `/api/`, `/dashboard/`, and `/auth/`. Block aggressive AI scrapers (GPTBot, Bytespider, CCBot, etc.) from hammering dynamic routes.

## 7. Make Static Pages Static (ISR Over SSR)
- Public marketing, news, articles, and documentation pages must NOT re-render from scratch on every visitor request.
- Enforce Incremental Static Regeneration (ISR) using `export const revalidate`:
  - Homepage: `revalidate = 60`
  - Articles/Details: `revalidate = 120`
  - Feeds/Categories: `revalidate = 60`
  - Directories: `revalidate = 300`
  - Informational/About/Handbook: `revalidate = 3600` or `86400`
- The Edge CDN serves pre-built static HTML in <20ms, using 0% server CPU for subsequent visits.

## 8. Protect Expensive API Endpoints From Excessive Requests (Pillar A)
- Implement tiered in-memory rate limiting (`rate-limiter-flexible`) to guard compute-heavy routes:
  - Search routes: 30 req/min per IP (prevents multi-table wildcard ILIKE CPU spikes).
  - File uploads: 10 req/min per IP (prevents memory, buffer, and storage flooding).
  - Mutations (comments, newsletters, contact forms, submissions): 15 req/min per IP.
  - General API endpoints: 120 req/min per IP.
- Return standard RFC 429 status with `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.

## 9. Request Deduplication (Pillar B)
- **Server Component Rendering:** Wrap database and API fetch functions in React's `cache()` so `generateMetadata()` and page components render with a single shared promise instead of executing duplicate queries.
- **Concurrent In-Flight Lock:** Use in-memory in-flight lock registries (`withInFlightLock`) with unique idempotency keys (`route:userId:payloadHash`) to prevent race conditions and duplicate executions when users double-click forms or trigger rapid concurrent requests.
- **Client-Side Deduplication:** Intercept simultaneous client GET requests (`dedupedClientFetch`) so identical API requests sent by different components in the same tick share one network call.

## 10. Database Connection Management (Pillar C)
- Re-use Supabase and database client instances as singletons rather than instantiating `createClient()` inside route handlers or per-request scopes.
- Enable persistent HTTP socket pooling (`Connection: keep-alive`, `Keep-Alive: timeout=60, max=1000`) for PostgREST connections to avoid repeated TCP handshake and TLS negotiation overhead.

## 11. Logging and Monitoring / APM Telemetry (Pillar D)
- Track critical server health and performance metrics without external paid APM services:
  - **Most Frequently Called Routes:** Identify hot routes to apply targeted caching.
  - **Slowest Endpoints:** Track average, p95, and maximum duration to diagnose bottlenecks.
  - **Requests Per Minute (RPM):** Maintain a rolling 60-second window to detect traffic surges.
  - **Database Query Duration:** Isolate DB latency from CPU execution time and inject standard `Server-Timing` headers (`app;dur=X, db;dur=Y, cpu;dur=Z`).
  - **CPU & Memory Consumption:** Sample `process.cpuUsage()` and `process.memoryUsage()` per function.
- Expose an authenticated admin telemetry endpoint (`/api/admin/telemetry`) to monitor live stats.

## 12. Control Expensive Next.js Routes (Pillar E)
- **Static Param Generation:** Add `generateStaticParams()` to dynamic routes with finite or predictable parameters (categories, tags, locales, static catalogs) so Next.js pre-renders them at build time.
- **Parallelize Data Fetching:** Always execute independent server component queries via `Promise.all()` to prevent serial request waterfalls.
- **Keep Middleware Lightweight:** Middleware must only perform header inspection, route rewrites, and fast-exit cookie checks. Never perform heavy cryptographic parsing, remote database calls, or session hydration for public routes in middleware.
