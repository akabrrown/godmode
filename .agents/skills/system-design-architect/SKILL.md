---
name: system-design-architect
description: Master system design and high-scalability architecture engineering. Synthesizes Donne Martin's System Design Primer, ByteByteGo System Design 101, and Awesome Scalability. Use when designing large-scale distributed systems, microservices, caching topologies, database sharding, asynchronous event architectures, high-throughput APIs, capacity planning, and evaluating CAP/PACELC trade-offs.
---

# System Design & High-Scalability Architecture

Master engineering skill for designing production-grade, fault-tolerant, high-concurrency systems capable of scaling from thousands to millions of requests per second.

---

## 1. Capacity Planning & Back-of-the-Envelope Math

Always perform explicit capacity calculations before choosing technology stacks:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Throughput (QPS / RPS)                                              │
│    • Daily Active Users (DAU) = N                                      │
│    • Avg requests per user per day = R                                 │
│    • Total daily requests = DAU × R                                    │
│    • Average QPS = Total Requests / 86,400 seconds                     │
│    • Peak QPS = Average QPS × 2 (or × 3 for bursty workloads)         │
│                                                                        │
│ 2. Storage Estimation (5-Year Horizon)                                 │
│    • Data per write = B bytes                                          │
│    • Daily storage = (Writes/day) × B                                  │
│    • 5-Year storage = Daily storage × 365 × 5 × Replication Factor     │
│                                                                        │
│ 3. Bandwidth Estimation                                                │
│    • Incoming bandwidth = (Write QPS) × (Payload Size)                 │
│    • Outgoing bandwidth = (Read QPS) × (Response Size)                 │
│                                                                        │
│ 4. Memory & Cache Sizing (80/20 Pareto Principle)                      │
│    • Daily Read Volume = (Daily Reads) × (Item Size)                   │
│    • Cache 20% of hot daily requests: Memory = Daily Read Volume × 0.20│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Fundamental Trade-Offs & Architectural Decisions

### A. CAP Theorem & PACELC
- **In a network partition ($P$):**
  - **Choose Consistency ($CP$):** Banking, financial balances, seat reservations, inventory deduction. Return error or wait if replica unreachable.
  - **Choose Availability ($AP$):** Social media feeds, analytics counters, messaging inbox, DNS, caching layers. Accept stale data over downtime.
- **When no partition ($E$):** Trade-off between Latency ($L$) and Consistency ($C$) — e.g. PACELC: $PA/EL$ (e.g. Cassandra/DynamoDB) vs $PC/EC$ (e.g. PostgreSQL, Spanner, CockroachDB).

### B. Consistent Hashing with Virtual Nodes
- Prevents cache/database redistribution storm when servers are added or removed.
- **Algorithm:** Map both servers and keys onto a circular $2^{32}-1$ hash ring.
- **Virtual Nodes (Tokens):** Assign each physical server 100–300 virtual nodes spread across the ring to avoid hot-spot skew.

---

## 3. High-Performance Caching Topologies

| Pattern | Read Path | Write Path | Best For | Risk & Mitigation |
|---|---|---|---|---|
| **Cache-Aside (Lazy Loading)** | App reads cache; on miss, reads DB, writes cache | App writes directly to DB, invalidates cache | General read-heavy workloads (90%+ reads) | Cache stampede on expiry. Use mutex lock or early soft-expiry. |
| **Read-Through** | App requests from cache; cache loads from DB on miss | Direct or decoupled | Simplifies app logic; library-managed | Cache library complexity |
| **Write-Through** | Read from cache | App writes to cache; cache synchronously writes DB | Data consistency critical, read-immediate | Write latency increased |
| **Write-Behind (Write-Back)** | Read from cache | App writes to cache; cache asynchronously batches to DB | High-volume writes (logging, counters, IoT) | Data loss on node crash. Use replicated cache/WAL. |
| **Refresh-Ahead** | Cache automatically reloads before TTL expires | Standard | Predictable access frequencies | Unused entries refreshed unnecessarily |

### Cache Pitfalls & Mitigations:
1. **Cache Penetration:** Query for non-existent key bypasses cache and hammers DB.
   - *Fix:* Bloom filter before cache check OR cache `NULL` with short TTL (30–60s).
2. **Cache Avalanche:** Thousands of keys expire simultaneously under load.
   - *Fix:* Add random jitter to TTLs: `TTL = base_ttl + rand(-60, 60)`.
3. **Cache Stampede (Thundering Herd):** High-traffic key expires, 10,000 requests query DB at once.
   - *Fix:* Distributed mutex lock (`SET key val NX EX 5`) so only 1 worker refreshes cache; others wait or receive stale.

---

## 4. Database Scaling & Sharding Architecture

```
                               ┌───────────────────┐
                               │    API GATEWAY    │
                               └─────────┬─────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
               ┌───────────────────┐           ┌───────────────────┐
               │   WRITE ROUTER    │           │    READ ROUTER    │
               └─────────┬─────────┘           └─────────┬─────────┘
                         │                               │
                         ▼                               ▼
                 ┌───────────────┐               ┌───────────────┐
                 │PRIMARY SHARD 1│ ──Replicate─> │REPLICA SHARD 1│
                 └───────────────┘               └───────────────┘
```

1. **Read/Write Splitting & Replica Lag Safety:**
   - Always route mutations (`INSERT/UPDATE/DELETE`) to Primary.
   - For reads immediately following a write (e.g. user updates profile then refreshes), set a session cookie `pinned_to_primary_until = timestamp + 2000ms` to prevent reading stale replica data before replication catches up.
2. **Sharding Key Selection:**
   - Must provide high cardinality, uniform data distribution, and colocate related entities to avoid cross-shard joins (e.g. `user_id` or `tenant_id` hash).
3. **Connection Pooling Formula:**
   $$\text{Max Pool Size} = (\text{CPU Cores} \times 2) + \text{Disk Spindles/Channels}$$
   *Never configure unbounded database pools. Use proxies like `pgdog` or `PgBouncer`.*

---

## 5. Resilient Microservices & Async Pipelines

- **Idempotency Keys:** Every non-idempotent mutation (`POST /payments`, `POST /orders`) MUST require a unique header (`Idempotency-Key: uuid`). Cache in Redis for 24h with atomic acquisition (`SET NX`).
- **Transactional Outbox Pattern:** To publish events safely without 2-phase distributed locks: write business entity + outbox event to local DB in a single ACID transaction; background relay (`decaton` / CDC / Debezium) streams to Kafka/RabbitMQ.
- **Circuit Breakers:** Guard remote calls with 3-state state machine (Closed, Open, Half-Open). Trip to Open when error rate exceeds 50% over rolling window; fast-fail immediately without network calls during cooldown.
