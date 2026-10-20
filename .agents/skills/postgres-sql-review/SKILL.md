---
name: postgres-sql-review
description: Review or write SQL and PostgreSQL schemas, queries, indexes, migrations, transactions, Supabase RLS, and query performance. Use for any database design, slow query, migration plan, "add a table", ER modeling, or EXPLAIN analysis, including Supabase schema work for the Backend Schema document.
---
# PostgreSQL / SQL review

## Schema checklist
PK on every table; `timestamptz` timestamps; money as integer minor units/`numeric`; enums via lookup table or `CHECK` (easier to evolve than native enum); FK with intentional `ON DELETE`; `NOT NULL` by default; `UNIQUE`/`CHECK` for invariants; naming consistent (snake_case, plural tables); normalized to 3NF unless a documented read-model reason; `jsonb` only for truly flexible attributes (index with GIN when queried).

## Query checklist
Named columns, no `SELECT *`; sargable predicates (no function on indexed column); correct JOIN type; no accidental cross joins; `EXISTS` over `IN` for large subqueries when appropriate; CTEs for readability (check materialization cost); window functions (`row_number`, `rank`, `lag/lead`) instead of self-joins; aggregates with `GROUP BY/HAVING`; keyset pagination; batch writes with `INSERT ... ON CONFLICT`.

## Index guide
B-tree default | GIN (jsonb, arrays, full-text, trigram) | GiST/SP-GiST (geo/ranges, PostGIS) | BRIN (huge ordered tables) | Hash (equality only, rare). Composite: equality cols then range/sort. Partial for hot subsets. Cover with `INCLUDE`. Confirm with `EXPLAIN (ANALYZE, BUFFERS)`: look for seq scans on big tables, row-estimate misses, sorts spilling to disk, nested loops on large sets.

## Transactions & concurrency
Short transactions; isolation chosen deliberately; retry on serialization/deadlock; advisory or row locks (`FOR UPDATE SKIP LOCKED` for queues); unique/exclusion constraints for double-booking; no external calls in a transaction.

## Migrations
Versioned, forward-only; expand -> backfill -> contract; `CREATE INDEX CONCURRENTLY`; avoid long table locks (add nullable column, backfill in batches, then constrain); test on a branch; rollback plan.

## Supabase
RLS on + policies; `auth.uid()` in policies with indexed columns; security-invoker views; service role server-only; pooled connection for serverless; realtime only on tables that need it.

## Operations
`pg_stat_statements`, slow query log, autovacuum monitoring, connection pooling, backups + tested restore/PITR, replicas for read scaling, partitioning for very large time-series tables.

## Output
Issues ranked by impact with corrected SQL and the supporting `EXPLAIN` reasoning.
