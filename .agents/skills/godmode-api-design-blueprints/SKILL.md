---
name: godmode-api-design-blueprints
description: Contract-first API design, OpenAPI 3.1 specification, REST, GraphQL, gRPC, rate-limiting, error payload standards, and webhooks.
---

# GODMODE API Design & Architecture Blueprints

## Overview
Enforces schema-first, contract-driven API engineering across REST, GraphQL, gRPC, and Webhooks, ensuring API contracts, client SDKs, and backend handlers never drift out of sync.

## API Standards Checklist

1. **Schema-First Design:** Define OpenAPI 3.1 or GraphQL schema before writing endpoint handlers.
2. **Consistent Response Payload Envelope:**
   ```json
   {
     "success": true,
     "data": { ... },
     "error": null,
     "meta": { "page": 1, "limit": 20, "total": 100 }
   }
   ```
3. **Structured Error Handling:** Standardize RFC 7807 Problem Details for HTTP errors (type, title, status, detail, instance).
4. **Idempotency & Rate Limiting:** Enforce `Idempotency-Key` headers on POST/PUT requests and rate-limiting headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).
5. **Webhook Security:** Sign all webhook delivery payloads using HMAC SHA-256 with timestamp validation to prevent replay attacks.
