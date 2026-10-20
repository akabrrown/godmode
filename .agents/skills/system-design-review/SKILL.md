---
name: system-design-review
description: Design or critique a system architecture - scalability, availability, consistency, caching, queues, load balancing, data partitioning, resilience patterns, microservices vs monolith. Use when writing a Technical Design Document, choosing architecture, planning scale, or when asked "how should I architect/structure/scale this".
---
# System design review

## Approach (in order)
1. **Requirements**: functional, non-functional (users, RPS, data size, latency, availability target, consistency needs, compliance), constraints (budget, team, Ghana network/payment realities, free-tier-first).
2. **Estimate**: traffic, storage growth, bandwidth; identify read/write ratio.
3. **API + data model** first, then components, then deep-dive the riskiest part.
4. **Bottlenecks and failure modes**: for each component ask "what if it is slow, down, or wrong?"
5. **Evolution**: what changes at 10x? Define upgrade triggers.

## Toolbox
- **Scaling**: stateless horizontal scale; vertical first when cheap; replicas for reads; partition/shard when a single node cannot cope (choose key to avoid hot spots).
- **Caching**: client -> CDN -> web server -> app -> DB; cache-aside, read-through, write-through, write-behind, refresh-ahead; plan invalidation.
- **Load balancing**: L4 vs L7; round-robin/least-connections/consistent hashing; health checks; sticky sessions only if unavoidable.
- **Async**: queues, pub/sub, task queues, competing consumers, priority queue, queue-based load leveling, back pressure; outbox for reliable events.
- **Consistency**: strong vs eventual; CAP/PACELC; idempotent operations; sagas/compensating transactions; leader election when needed.
- **Resilience**: retry + backoff + jitter (avoid retry storms), circuit breaker, bulkhead, timeouts, failover, graceful degradation, health endpoint monitoring.
- **Data stores**: SQL by default; document, key-value, wide-column, graph, search, time-series, vector only for a clear access pattern.
- **Edge/gateway**: API gateway (routing, aggregation, offloading auth/rate limit), BFF per client type, CDN push/pull, static content hosting.
- **Migration**: strangler fig for legacy; anti-corruption layer for foreign models.
- **Antipatterns to flag**: chatty I/O, busy database/frontend, noisy neighbor, monolithic persistence, no caching, synchronous I/O in hot path, extraneous fetching, improper instantiation.
- **Security & observability**: gateway auth, mTLS internally if needed, secrets mgmt; logs/metrics/traces, SLOs and alerts.

## Output
Diagram (Mermaid), component table, data model sketch, key decisions as ADR bullets, risks + mitigations, scale triggers.
