---
description: Plan and write a safe PostgreSQL/Supabase migration with rollback and verification
---
# /db-migration
1. State the change and affected tables/queries. Load `postgres-sql-review`.
2. Classify: additive (safe) vs breaking. For breaking: expand -> backfill (batched) -> contract across separate deploys.
3. Write the migration: constraints, indexes `CONCURRENTLY`, RLS policies, defaults without table rewrites.
4. Write the rollback/down plan and data-loss notes.
5. Verify on a branch/copy: apply, run key queries with `EXPLAIN`, check RLS with two test users.
6. Update the Backend Schema doc and generated types. Never edit an applied migration.
