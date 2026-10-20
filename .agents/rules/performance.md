---
trigger: model_decision
description: Apply when optimizing speed, fixing slow pages/queries, adding caching, bundling, images, fonts, or when asked about Core Web Vitals or latency
---
# Performance rules
**Measure first** (Lighthouse, DevTools Performance, WebPageTest, `EXPLAIN ANALYZE`, profiler). Never optimize on a hunch; record before/after.
**Web budgets (mobile, 4G)**: LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < ~0.8s (hard ceiling 1.3s), JS per route < ~170KB gz, web fonts < 300KB total, WOFF2 only.
**Frontend**: ship less JS (server components, dynamic import for heavy/rare widgets, check bundle size before adding a dependency); non-blocking CSS/JS (`defer`/`async`), inline only critical CSS; preload LCP image/font and `preconnect` to critical origins; responsive modern images (AVIF/WebP), explicit dimensions; lazy-load offscreen; avoid layout thrash and long tasks (>50ms); virtualize long lists; avoid iframes and 404 requests; keep cookies small (<4KB each).
**Caching**: immutable hashed assets (`max-age=31536000, immutable`); HTML short/`stale-while-revalidate`; CDN for static + media; Next.js: choose static/ISR/dynamic deliberately, tag-based revalidation, dedupe fetches.
**Backend**: kill N+1 (join/batch/DataLoader); `SELECT` only needed columns; index for real predicates; paginate; compress responses (br/gzip); keep-alive + connection pooling (PgBouncer/Supavisor); stream large payloads; move heavy work to queues; cache with explicit TTL and invalidation owner; set payload limits; place compute near users/DB.
**Scale**: stateless services scale horizontally; read replicas for read-heavy; shard only when proven necessary; load test (k6) before launch with realistic mix and think-time.
**Regression guard**: perf budget in CI (Lighthouse CI / bundle analyzer) for key routes.
