---
name: backend-performance-audit
description: Find and fix backend latency and throughput problems - slow endpoints, N+1 queries, missing indexes, caching, connection pooling, queues, payload size, scaling. Use when the user reports slow APIs, timeouts, high DB load, scaling concerns, or asks to "make the backend faster" or review an endpoint's efficiency.
---
# Backend performance audit

## Procedure
1. **Profile before changing**: identify the slow path with traces/logs/profiler/`EXPLAIN ANALYZE`; get p50/p95/p99 and request rate.
2. **Classify the bottleneck**: DB, network/outbound calls, CPU/algorithm, memory/GC, serialization, locking/contention, cold starts.
3. **Apply the smallest fix**, re-measure, document.

## Checks by area
**Database**: N+1 (batch/join/dataloader); select only needed columns; right indexes (composite order, partial); no unbounded queries; pagination (keyset for deep pages); avoid needless joins or consider read-model denormalization for read-heavy paths; batch inserts/updates; slow-query log on; ORM-generated SQL inspected; pool sized to DB limits (PgBouncer/Supavisor in serverless).
**Caching**: layers - client/HTTP, CDN, app (Redis), DB; patterns - cache-aside default, write-through/behind when justified; every cache has TTL, key naming, and an invalidation owner; protect against stampede (locks/jitter/stale-while-revalidate).
**I/O & network**: timeouts on all calls; keep-alive; parallelize independent calls; compression; stream large bodies; payload size limits; avoid chatty service calls (aggregate).
**Async work**: heavy/slow tasks -> queue/background job, return 202; async logging; message broker between services; retries with backoff and dead-letter queue.
**Algorithms**: check complexity of hot loops (avoid O(n^2) on large n; use maps/sets, sorting+two pointers, binary search, heaps where apt); memoize pure expensive functions; avoid recomputation per request.
**Scaling**: stateless; horizontal scale + load balancer with health checks; read replicas; sharding only with evidence; place compute near users and DB; rate limiting/throttling to protect capacity.
**Verification**: load test with k6/Artillery at realistic concurrency; compare before/after; add a perf budget or alert; monitor via Prometheus/Grafana-style dashboards (RED/USE metrics).

## Output
Bottleneck, evidence, fix, measured effect, residual risks.
