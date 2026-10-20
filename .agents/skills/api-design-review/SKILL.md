---
name: api-design-review
description: Design or review HTTP APIs - resource modeling, URIs, methods, status codes, pagination, filtering, errors, versioning, idempotency, rate limits, OpenAPI docs, webhooks vs polling, REST vs GraphQL vs gRPC. Use when creating new endpoints, writing the API Specification section of a TDD, or reviewing an existing API.
---
# API design review

## Choose the style
REST (default, cacheable, public) | GraphQL (varied client shapes, many frontends; guard depth/cost) | gRPC (internal, typed, streaming) | WebSocket/SSE (real-time push) | Webhooks (server-to-server events; prefer over polling).

## Design rules
- **Resources**: nouns, plural, nested only 1 level (`/orders/{id}/items`); stable ids (UUID); consistent naming (snake_case or camelCase, pick one).
- **Methods**: GET (safe, cacheable), POST (create/non-idempotent action), PUT (replace), PATCH (partial), DELETE; idempotent verbs truly idempotent; `Idempotency-Key` for risky POSTs.
- **Status codes**: 200/201 (+`Location`)/202/204; 400, 401, 403, 404, 409, 415, 422, 429 (+`Retry-After`); 5xx for server faults only.
- **Collections**: cursor pagination (`limit`, `cursor`, `next`); filtering with allow-listed fields; sort param; search param; consistent envelope `{data, meta, links}`.
- **Errors**: RFC 7807 problem details + stable `code`; field-level validation errors; correlation id.
- **Versioning**: URL or header, additive evolution, deprecation headers/policy.
- **Caching**: ETag/`If-None-Match`, `Cache-Control`; content negotiation via `Accept`.
- **Security**: see `api-security-audit`; scopes per endpoint (RBAC/ABAC/ReBAC as the model needs).
- **Performance**: payload limits, compression, field selection, batch endpoints for chatty clients.
- **Docs & contracts**: OpenAPI 3.1 as source of truth; examples for every endpoint; contract tests (Pact/schema) + functional + integration + load tests; mock server for frontend.
- **Lifecycle**: design -> mock -> implement -> test -> publish -> monitor -> deprecate -> retire.

## Output
For each endpoint: method + path, auth/roles, request schema, response schema, errors, idempotency, rate limit, example. Flag deviations from the rules above.
