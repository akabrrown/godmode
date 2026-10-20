---
name: godmode-database-orm-mastery
description: Schema design, migrations, query performance optimization, indexing strategy, ORMs (Prisma, Drizzle, SQLAlchemy, TypeORM), and transaction isolation.
---

# GODMODE Database Engineering & ORM Mastery

## Overview
Comprehensive database engineering patterns for PostgreSQL, MySQL, SQLite, and MongoDB using modern ORMs (Prisma, Drizzle, SQLAlchemy, TypeORM) or raw SQL.

## Core Directives

1. **Migration Safety:** All database schema changes must be versioned via explicit migration scripts. Zero raw destructive `DROP` operations in production migrations without backup verification.
2. **Index Optimization:** Ensure foreign key columns, frequently filtered fields, and sorting columns have composite or B-Tree indexes. Avoid N+1 query patterns using explicit `JOIN`s or eagerly loaded relations.
3. **Transaction Isolation:** Wrap multi-step mutations (e.g. orders, user registration, billing updates) in database transactions with strict isolation levels.
4. **Connection Pooling & Limits:** Enforce connection pool sizing (e.g., PgBouncer, Prisma Accelerate) and set strict query timeouts to prevent database exhaustion.
5. **IDOR & Data Scoping:** Every query mutating or returning private records must filter explicitly by `user_id` or `tenant_id` at the database level.
