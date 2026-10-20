---
name: api-security-audit
description: Security review of REST/GraphQL/server-action endpoints, auth flows, JWT/OAuth, sessions, headers, rate limiting, uploads, RLS policies. Use for any "is this secure?", pre-launch security check, new auth feature, public API, payment/webhook endpoint, or when reviewing code that handles user input or credentials.
---
# API security audit

Walk each endpoint and mark PASS / FAIL / N/A with file+line evidence.

## 1. AuthN
- Standard mechanism (no custom crypto, no Basic auth over anything but TLS-internal tooling); centralized login.
- Tokens via `Authorization: Bearer` or HttpOnly cookies, never in URLs/query/body. Short expiry + refresh rotation. Logout/revocation path.
- Brute-force protection: max retry/jail/backoff, rate limit per IP and account, generic error messages.
- JWT: server-pinned algorithm, strong secret/keys, `exp/iss/aud` verified, no sensitive or large payload.
- OAuth/OIDC: code flow + PKCE, `state` checked, exact `redirect_uri`, scopes validated, no implicit grant.
## 2. AuthZ
- Every protected endpoint behind auth (enumerate routes, find unguarded ones).
- Object-level checks (IDOR/BOLA): resource owner/tenant verified on every id lookup; function-level checks for admin actions; no trusting role from request body.
- Supabase: RLS enabled, policies per verb, no `USING (true)` on private tables, service key never in client.
- Prefer UUIDs; no personal ids in URLs.
## 3. Input & output
- Schema-validate body/query/params/headers; reject unknown fields where sensible; max body size; strict `Content-Type` check; parameterized queries; XML parsers with entity expansion/XXE disabled.
- Return minimal fields (no mass assignment / excessive data exposure); correct status codes; no stack traces; response `Content-Type` forced.
## 4. Transport & headers
- HTTPS only, HSTS, modern TLS; `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: deny`/frame-ancestors, Referrer-Policy; remove fingerprint headers; CORS allow-list; CSRF protection when cookies are used.
## 5. Abuse & resilience
- Rate limiting/throttling per route class; request/payload limits; avoid HTTP blocking on big work (queue it); API gateway/WAF where available; private APIs IP-restricted.
## 6. Data protection
- Sensitive data encrypted at rest (server-side), not logged, not in URLs/JWT; secrets from env/secret manager; backups encrypted.
## 7. Ops
- Debug off in prod; directory listing off; dependency vulnerability scan + updates; SAST in CI; centralized logs + alerts on auth failures, 5xx spikes, anomalous volume; rollback plan; code review with no self-approval; tests for authz and validation.
## 8. Webhooks / payments
- Verify signature, timestamp tolerance, dedupe by event id, idempotent handlers, never trust client-reported amounts (recompute server-side).

## Output
Findings table: `Severity | Endpoint/File | Issue | Fix`, ordered Critical > High > Medium > Low, then a minimal-diff remediation list.
