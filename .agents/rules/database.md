---
trigger: glob
globs: "**/*.sql,**/migrations/**,**/supabase/**,**/schema.*,**/prisma/**,**/drizzle/**"
description: SQL, PostgreSQL and schema design rules
---
# Database rules (PostgreSQL / Supabase)
- **Schema**: normalize to 3NF by default; denormalize only for a measured read hotspot and document why. Every table: primary key (uuid or identity), `created_at`, `updated_at`; money as integer minor units or `numeric`, never float; timestamps as `timestamptz`.
- **Integrity in the DB**: `NOT NULL`, `CHECK`, `UNIQUE`, foreign keys with deliberate `ON DELETE`. Double-booking/overlap: partial unique index or exclusion constraint. Soft-delete via `deleted_at` only where history matters; audit tables append-only.
- **Indexes**: index FKs and real WHERE/JOIN/ORDER predicates; composite order = equality columns first, then range/sort; partial indexes for hot subsets; GIN for jsonb/full-text/arrays; BRIN for huge append-only time data; verify with `EXPLAIN (ANALYZE, BUFFERS)`; drop unused indexes.
- **Queries**: no `SELECT *` in app code; avoid N+1; prefer joins/CTEs for clarity, check CTE cost; window functions for ranking/running totals; keyset pagination for deep pages; parameterize everything; avoid functions on indexed columns in WHERE.
- **Transactions**: keep short; choose isolation deliberately (READ COMMITTED default; SERIALIZABLE for invariants, with retry on serialization failure); lock order consistent; no network calls inside transactions.
- **Migrations**: forward-only, versioned, reviewed, idempotent where possible; expand -> backfill -> contract for breaking changes; add indexes `CONCURRENTLY`; never edit an applied migration; test on a branch/copy; always have a rollback plan.
- **Supabase**: RLS on every exposed table, policies per operation, `service_role` key server-only, views with `security_invoker`, avoid logic-heavy triggers, use pooled connection string for serverless.
- **Ops**: connection pooling; slow-query logging (`pg_stat_statements`); autovacuum healthy; backups with tested restore (PITR for critical data); monitor connections, bloat, replication lag.
