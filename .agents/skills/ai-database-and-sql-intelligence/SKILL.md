---
name: ai-database-and-sql-intelligence
description: AI-driven database intelligence, SQL query generation, schema visualization, query plan optimization, and spatial/geohash indexing. Synthesizes Chat2DB, BuntDB, Manticore Search, and SeaweedFS. Use when generating complex SQL queries from natural language, visually diagnosing slow query execution plans, configuring spatial R-Tree/geohash indexes, and designing full-text search indexes.
---

# AI Database Intelligence, SQL Tuning & Spatial Indexing

A comprehensive skill for natural language SQL generation, visual execution plan optimization, spatial indexing, and search engine integration.

---

## 1. Natural Language to Production SQL Generation (Chat2DB Standard)

When generating SQL from natural language prompts, always enforce deterministic, safe queries:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SQL GENERATION CONSTRAINTS                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Parameterization: NEVER concatenate user input; use $1, $2 or :val  │
│ 2. Read-Only Enforcement: Restrict ad-hoc queries to SELECT / EXPLAIN  │
│ 3. Row Limit Guarantees: Every query must have an explicit LIMIT       │
│ 4. Null Safety: Use COALESCE for nullable aggregations and calculations│
│ 5. Keyset Pagination: Avoid high-offset pagination (OFFSET 100000);    │
│    use WHERE (created_at, id) < ($last_time, $last_id) ORDER BY ...    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Visual Query Plan Optimization (`EXPLAIN (ANALYZE, BUFFERS)`)

Diagnose slow database queries systematically by analyzing the execution plan:

| Query Plan Marker | What it Means | Remediation Action |
|---|---|---|
| **Seq Scan (Sequential Scan)** | Full table scan; database reads every single page on disk. | Add index matching the `WHERE` filter columns. |
| **Index Scan vs. Index Only Scan** | Index Only Scan reads data directly from the index tree without touching table heap. | Add needed output columns to index via `INCLUDE (col1, col2)`. |
| **External Sort / Disk Sort** | Sort spilled from RAM into temporary disk files. | Increase `work_mem` OR create index on sort columns `ORDER BY col DESC`. |
| **Hash Join vs. Nested Loop** | Hash Join builds hash table of smaller relation. Very expensive if memory insufficient. | Verify table statistics with `ANALYZE tablename`. |

---

## 3. Spatial & Geohash Indexing (BuntDB Pattern)

For location-based queries (e.g., finding drivers or restaurants within 5 km):
- **Never perform raw trigonometry in WHERE clauses:**  
  `WHERE acos(sin(...) * ...) < 5` forces a full table scan on every single row!
- **Use Spatial Indexes (PostGIS / R-Tree):**
  - Store coordinates as a `geography(Point, 4326)` or spatial index.
  - Create GiST spatial index: `CREATE INDEX idx_locations ON places USING GIST (geom);`
  - Query using `ST_DWithin(geom, ST_MakePoint(lng, lat)::geography, 5000);`
- **Geohash Prefix Matching:** Truncate geohashes (e.g. `u09tv`) to perform $O(1)$ prefix range lookups in standard B-Trees or key-value caches.

---

## 4. Large Blob & Object Storage (SeaweedFS Pattern)

- **Anti-Pattern:** Storing multi-megabyte images, videos, or PDFs directly inside PostgreSQL `BYTEA` columns (causes massive table bloat, slow vacuuming, and memory exhaustion).
- **Solution:** Store blobs in an external distributed object store (`SeaweedFS`, Cloudflare R2, S3). Save only the immutable URL, hash, and content-type in the database table.
