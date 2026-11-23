---
name: redis-caching
description: Advanced Redis caching architectures, data structures, atomic Lua scripts, distributed locks, and eviction policies. Synthesizes Redis core, catbox, core.cache, and garner. Use when designing cache invalidation, choosing between Redis data types (Hash, Sorted Set, Streams), writing atomic Lua scripts, implementing Redlock distributed locks, and configuring memory eviction.
---

# Advanced Redis Caching & In-Memory Architectures

Production engineering standards for designing fast, reliable, memory-efficient Redis caching and coordination layers.

---

## 1. Choosing the Right Redis Data Structure

| Data Structure | Time Complexity | Best Use Case | Anti-Pattern |
|---|---|---|---|
| **String** | $O(1)$ | Simple key-value cache, serialized JSON, token strings. | Storing large nested objects that frequently update individual fields. |
| **Hash (`HSET`, `HGET`)** | $O(1)$ | User profiles, session data, structured entities. Allows updating single fields without re-serializing. | Storing unbounded sub-collections inside a single hash. |
| **Sorted Set (`ZSET`)** | $O(\log N)$ | Leaderboards, sliding window rate limiters, priority queues, timestamp indexing. | Storing millions of elements in a single set with frequent unbounded range queries. |
| **Set (`SADD`, `SISMEMBER`)** | $O(1)$ | Unique tags, visitor tracking, IP whitelists, mutual friends. | Using `SMEMBERS` on huge sets (blocks Redis single thread; use `SSCAN`). |
| **Bitmaps (`SETBIT`, `BITCOUNT`)** | $O(1)$ | Daily active user tracking (DAU), feature flags, high-density binary flags. | Sparse keys (using bit position 10,000,000 on an empty bitmap wastes RAM). |
| **HyperLogLog (`PFADD`, `PFCOUNT`)** | $O(1)$ | Cardinality estimation (unique page views >100k) with fixed 12KB memory overhead and 0.81% error. | Exact deduplication where zero error is required. |
| **Streams (`XADD`, `XREADGROUP`)** | $O(1)$ | Persistent message queues, audit logs, event streams with consumer group acknowledgments. | Using Streams as an ephemeral cache without trimming (`MAXLEN ~`). |

---

## 2. Memory Eviction Policies (`maxmemory-policy`)

Configure `maxmemory` and the eviction policy deliberately in `redis.conf`:

```conf
maxmemory 2gb
maxmemory-policy allkeys-lru
```

| Policy | Behavior | When to Use |
|---|---|---|
| **`allkeys-lru`** | Evicts least recently used keys out of all keys. | Default for general web caches (95%+ of caching use cases). |
| **`volatile-lru`** | Evicts least recently used keys only among keys with an explicit TTL. | When mixing persistent data (e.g. sessions without expiry) with cached data. |
| **`allkeys-lfu`** | Evicts least frequently used keys. | Superior for long-tail workloads where popular items must stay cached regardless of recency. |
| **`noeviction`** | Returns error on writes when memory limit is reached. | Redis used purely as a message queue or primary datastore (not a cache). |

---

## 3. Distributed Lock Pattern (Redlock / Safe Mutex)

Never use a raw `SET` without an expiry or random lock value. To prevent race conditions and deadlock:

```typescript
export class RedisLock {
  constructor(private redis: RedisClient) {}

  async acquire(resource: string, ttlMs = 5000): Promise<string | null> {
    const lockToken = crypto.randomUUID();
    // SET resource lockToken NX PX ttlMs
    const acquired = await this.redis.set(`lock:${resource}`, lockToken, {
      NX: true,
      PX: ttlMs,
    });
    return acquired ? lockToken : null;
  }

  async release(resource: string, lockToken: string): Promise<boolean> {
    // Atomic release via Lua script (verifies token belongs to caller)
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.redis.eval(luaScript, 1, `lock:${resource}`, lockToken);
    return result === 1;
  }
}
```

---

## 4. Cache Invalidation & Tag-Based Purging

- **Tag-Based Invalidation:** Store set of cache keys under a tag key (`SADD tag:product_123 cache_key_1 cache_key_2`). On mutation of product 123, read the set, delete all associated keys, and delete the tag set.
- **Change-Data-Capture (CDC):** Invalidate cache via database commit logs (Debezium/Postgres logical decoding) rather than relying on distributed application code to remember every cache key.
