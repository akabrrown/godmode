---
name: distributed-database-scaling
description: Horizontal database scaling, sharding, connection pooling, replication lag mitigation, and distributed transactions. Synthesizes Vitess (YouTube scale), CockroachDB, ShardingSphere, pgdog, and distribute_reads. Use when designing multi-shard schemas, configuring connection poolers, handling primary/replica lag, implementing Sagas, choosing partition keys, and optimizing vector databases.
---

# Distributed Database Scaling & Connection Management

A production-grade guide for scaling relational and vector databases from single-instance setups to globally distributed, sharded clusters.

---

## 1. Connection Pool Sizing & Starvation Prevention

Over-allocating database connections is the #1 cause of database CPU exhaustion. 

### PostgreSQL Connection Formula (HikariCP / PgBouncer Benchmark):
$$\text{Max Pool Connections} = (\text{CPU Cores} \times 2) + \text{Effective Spindle Count}$$

- For an 8-core database server with fast SSDs:  
  $$(8 \times 2) + 1 = 17 \text{ connections}$$
- **Anti-Pattern:** Setting `max_connections: 500` on the app server. Hundreds of idle/active connections trigger context-switch thrashing and cache eviction.
- **Solution:** Deploy a dedicated pooling proxy (`pgdog` or `PgBouncer` in transaction pooling mode). Keep application-to-proxy connections elastic, but proxy-to-Postgres connections small and warm.

---

## 2. Horizontal Sharding Strategies

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHARDING SCHEME SELECTION                       │
├───────────────────────┬────────────────────────┬───────────────────────┤
│ Scheme                │ Pros                   │ Cons                  │
├───────────────────────┼────────────────────────┼───────────────────────┤
│ **Hash-Based**        │ Uniform distribution;  │ Resharding requires   │
│ (e.g. hash(user_id))  │ no hot ranges          │ consistent hashing    │
├───────────────────────┼────────────────────────┼───────────────────────┤
│ **Range-Based**       │ Easy range queries     │ Hot-spots on recent   │
│ (e.g. created_at)     │ and data archiving     │ time ranges           │
├───────────────────────┼────────────────────────┼───────────────────────┤
│ **Directory/Lookup**  │ Complete flexibility;  │ Lookup table is       │
│ (Mapping table)       │ easy rebalancing       │ single point of failure│
└───────────────────────┴────────────────────────┴───────────────────────┘
```

### Golden Rules of Sharding:
1. **Never perform cross-shard joins in the application.** Colocate related parent-child entities on the same shard using the same partition key (e.g., `user_id` on both `users` and `orders`).
2. **Scatter-Gather Queries are strictly bounded.** Any query querying across all shards must be asynchronous or paginated with hard limits.
3. **Partition Keys are immutable.** Never choose an attribute that can change (e.g., email address, status). Use immutable UUIDs or snowflake IDs.

---

## 3. Read/Write Splitting & Replica Lag Mitigation

When sending read queries to secondary replicas to offload the primary, **replication lag** can cause severe consistency bugs (e.g., user submits profile update, page reloads, user sees old data).

### The "Read-After-Write Consistency" Protocol (`distribute_reads` Pattern):

```typescript
// Middleware / Database Router
export class ReadWriteRouter {
  constructor(
    private primaryDb: DatabaseClient,
    private replicaDb: DatabaseClient
  ) {}

  async executeQuery(req: Request, query: string, isMutation: boolean) {
    if (isMutation) {
      // 1. Mutations ALWAYS go to Primary
      const res = await this.primaryDb.query(query);
      // 2. Set session cookie pinning user to primary for 2 seconds (covering replication delay)
      req.session.pinnedToPrimaryUntil = Date.now() + 2000;
      return res;
    }

    // 3. For reads, check if user recently mutated data
    if (req.session.pinnedToPrimaryUntil && Date.now() < req.session.pinnedToPrimaryUntil) {
      return this.primaryDb.query(query);
    }

    // 4. Check replica health and replication lag before routing
    const lagSeconds = await this.replicaDb.getReplicationLag();
    if (lagSeconds > 5) {
      // Replica lag breached safety SLA -> fallback to Primary
      return this.primaryDb.query(query);
    }

    // 5. Safe to read from replica
    return this.replicaDb.query(query);
  }
}
```

---

## 4. Distributed Transactions: Saga Pattern vs. 2PC

- **Two-Phase Commit (2PC):** Heavy coordinator lock. Blocks across network latency. Strictly avoid across microservices or geographic regions.
- **Saga Pattern (Recommended):**
  - Break transaction into a series of local ACID transactions.
  - Each step publishes an event that triggers the next service.
  - If any step fails, execute **Compensating Transactions** in reverse order (e.g., `ChargeCreditCard` → failed `ReserveInventory` → execute `RefundCreditCard`).
  - Use **Choreography** (event-driven pub/sub) for 2–4 services; use **Orchestrator** (workflow state machine) for complex multi-step flows.

---

## 5. Vector Database Optimization (`qdrant` Architecture)

- **HNSW Index Parameters:**
  - `m`: Number of bi-directional links per node (16–32 for general search, 64 for high accuracy).
  - `ef_construct`: Construction search depth (100–200 during indexing).
- **Scalar Quantization:** Compress 32-bit floats (`f32`) to 8-bit integers (`int8`) in memory for up to 4× RAM savings with <1% precision loss.
- **Payload Indexing:** Always index payload fields used for pre-filtering (e.g., `tenant_id`, `category`) to avoid brute-force scanning.
