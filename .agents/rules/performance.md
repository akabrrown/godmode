---
trigger: model_decision
description: Apply when optimizing speed, fixing slow pages/queries, adding caching, bundling, images, fonts, Core Web Vitals, load testing, or database performance
---
# Performance, Core Web Vitals & Scalability Standards

## 1. Measurement-First Model (Field vs. Lab)
Never optimize on intuition. Differentiate the 4 evidence tiers:
1. **CrUX Field Data:** Real Chrome user experience over the 28-day window (determines SEO and real-world impact).
2. **First-Party RUM:** Route-by-route real user analytics across devices and networks.
3. **Lab Traces (DevTools / Lighthouse):** Repeatable diagnostic traces for root-cause analysis.
4. **Static Code Inspection:** Preflight heuristic checks.

## 2. Core Web Vitals Strict Budgets (Mobile 4G)
- **LCP (Largest Contentful Paint) < 2.5s:**
  - Audit all 4 sub-phases: TTFB (<800ms) + Resource Load Delay (<200ms) + Resource Load Duration (<1000ms) + Element Render Delay (<500ms).
  - Preload LCP hero image and font; eliminate render-blocking scripts and CSS `@import`.
- **INP (Interaction to Next Paint) < 200ms:**
  - Break up Long Tasks (>50ms) using `requestAnimationFrame`, `setTimeout(..., 0)`, or `scheduler.yield()`.
  - Avoid layout thrashing (interleaving DOM reads like `offsetHeight` with DOM writes).
- **CLS (Cumulative Layout Shift) < 0.1:**
  - Explicit `width` and `height` (or aspect-ratio) on all images, videos, and dynamic embeds.
  - Reserve placeholder space for dynamic banners and client-rendered components.

## 3. Server Telemetry & Server-Timing Headers
- Inject structured `Server-Timing` headers into every response:
  ```http
  Server-Timing: db;dur=14.2;desc="Postgres Query", cache;dur=1.1;desc="Redis Hit", render;dur=8.4
  ```
- Expose authenticated `/api/admin/telemetry` tracking RPM, p95/p99 latency, and active database connection pool count.

## 4. Backend & Database Zero-Cost Performance
- **Connection Pool Formula:** $\text{Max Connections} = (\text{CPU Cores} \times 2) + \text{Disk Spindles/Channels}$. Use dedicated poolers (`pgdog` or `PgBouncer`).
- **Kill N+1 Queries:** Use batch joins, DataLoaders, or CTEs. Select only needed columns (never `SELECT *` in production hot paths).
- **Read/Write Splitting with Lag Safety:** Route mutations to Primary; pin user to Primary for 2 seconds (`pinnedToPrimaryUntil = now + 2000`) before falling back to read replicas.
- **Edge Caching & ISR:** Use Incremental Static Regeneration (`revalidate = 60-300`) for public pages. Serve 95%+ of traffic from Edge CDN with 0% server CPU.

## 5. Load Testing & Benchmark Gates
- Run automated k6 or Artillery load tests before any production release:
  - Assert `http_req_duration: ['p(95)<200', 'p(99)<500']` and `http_req_failed: ['rate<0.01']`.
  - Test under 3 profiles: Normal Load (steady state), Spike Test (10× surge), and Soak Test (memory leak detection).
