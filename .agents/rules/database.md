---
trigger: glob
globs: "**/*.sql,**/migrations/**,**/supabase/**,**/schema.*,**/prisma/**,**/drizzle/**"
description: SQL, PostgreSQL, distributed database scaling, connection pooling, and schema design rules
---
# Database Architecture, Distributed Scaling & Schema Rules

## 1. Schema Modeling & Integrity Invariants
- **Normalization:** Default to 3NF. Denormalize only for a measured read hot-path with documentation.
- **Standards:** Every table must have: primary key (`uuid` v7 or identity), `created_at`, `updated_at`. Store monetary amounts as integer minor units (cents/pesewas) or `numeric`, never `float`. Timestamps always `timestamptz`.
- **Database-Enforced Invariants:** Use `NOT NULL`, `CHECK`, `UNIQUE`, and foreign keys with deliberate `ON DELETE (RESTRICT | CASCADE)`. Use partial unique indexes or exclusion constraints (`btree_gist`) to prevent double-booking or overlapping ranges.
- **Auditing & Soft Deletes:** Audit tables are strictly append-only. Soft-delete (`deleted_at`) only where legal or business recovery requires it.

## 2. Indexing Strategy & EXPLAIN Verification
- Index every foreign key and real `WHERE`, `JOIN`, and `ORDER BY` predicate.
- **Composite Index Order:** Equality columns first, then range/sort columns.
- **Index Types:** B-Tree for general lookups; GIN for JSONB, arrays, and full-text; BRIN for huge append-only chronological tables; HNSW for vector embeddings.
- **Verification:** Always run `EXPLAIN (ANALYZE, BUFFERS)` to verify index scans and buffer hit rates before shipping queries. Add indexes with `CONCURRENTLY`.

## 3. Connection Pool Sizing & Starvation Defenses
- Calculate maximum pool size: $\text{Connections} = (\text{CPU Cores} \times 2) + \text{Disk Spindles/Channels}$.
- Never allow client apps to open unbounded direct connections to PostgreSQL. Always front with a connection pooler (`pgdog`, `PgBouncer`, or Supavisor) running in transaction pooling mode.

## 4. Read/Write Splitting & Replica Lag Mitigation
- Direct all mutations (`INSERT`, `UPDATE`, `DELETE`) to the Primary database.
- For read requests occurring immediately after a mutation by the same user, pin the session to the Primary database for 2000ms (`pinnedToPrimaryUntil`) to prevent reading stale replica data before replication catches up.
- Check replica lag before dispatching queries; fall back to Primary if lag exceeds 5 seconds.

## 5. Horizontal Sharding & Distributed Transactions
- **Sharding Key Selection:** Choose immutable, high-cardinality keys (e.g. `user_id` or `tenant_id`). Colocate related entities on the same shard to prevent cross-shard joins.
- **Distributed Transactions (Sagas over 2PC):** Never use blocking Two-Phase Commit across network boundaries. Implement Sagas with compensating transactions and use the Transactional Outbox pattern for reliable event streaming.
