---
name: redis-caching
description: Use Redis correctly for caching, sessions, rate limiting, leaderboards, queues, pub/sub, locks, and counters; choose data types, TTLs, persistence, eviction, and avoid common pitfalls. Use when adding Redis/Upstash, designing cache invalidation, implementing rate limits or job queues, or debugging cache problems.
---
# Redis and caching

- **When**: caching hot reads, sessions, rate limiting, counters/leaderboards, ephemeral queues/streams, locks, real-time pub/sub. Not a primary store unless persistence is configured and acceptable.
- **Data types**: String (cache values, counters `INCR`), Hash (objects), List (simple queues), Set (unique members), Sorted Set (leaderboards, delayed jobs, sliding windows), Stream (durable queues with consumer groups), Geo, Bitmap/HyperLogLog (cheap analytics), JSON/Search/Bloom modules where available.
- **Keys**: `service:entity:id:field` namespacing; versioned prefix for schema changes; short but readable.
- **TTL always** on cache keys, with jitter to avoid synchronized expiry; invalidation owner defined; cache-aside default; protect against stampede (single-flight lock, stale-while-revalidate).
- **Rate limiting**: fixed window (`INCR` + `EXPIRE`), sliding window (sorted set), token bucket (Lua for atomicity); key by user/IP/route; return 429 + `Retry-After`.
- **Atomicity**: `MULTI/EXEC`, Lua scripts, `WATCH` optimistic locking; distributed locks via `SET NX PX` with unique token (note limits; prefer DB constraints when correctness is critical).
- **Performance**: pipelining/batching; avoid `KEYS` (use `SCAN`); avoid huge values/hot keys/big collections; `maxmemory` + eviction policy (`allkeys-lru` for caches; `noeviction` for queues/state).
- **Persistence**: RDB snapshots vs AOF vs hybrid; none for pure cache. Replication + Sentinel/Cluster for HA when needed.
- **Security**: auth, TLS, private network, no public exposure, ACLs, disable dangerous commands.
- **Serverless**: Upstash REST/HTTP client; mind per-request cost and connection limits.
- **Monitoring**: hit ratio, evictions, memory, latency, connected clients, `INFO`, slowlog.
