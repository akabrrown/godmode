---
name: godmode-auth-security-hardening
description: Authentication standards (OAuth2, Passkeys, JWT, Sessions), RBAC/ABAC authorization, OWASP Top 10 defense, IDOR prevention, and secret management.
---

# GODMODE Auth & Security Hardening

## Overview
Defensive security architecture enforcing defense-in-depth across authentication, authorization, API endpoints, form processing, and secret management.

## Security Directives

1. **Authentication:** Support secure session management (HTTP-only, Secure, SameSite=Strict cookies) or rotated JWT access tokens paired with refresh token revocation lists.
2. **Server-Side Authorization (IDOR Defense):** Never rely on client-provided user IDs. Verify ownership of target resources against authenticated session IDs on every endpoint.
3. **Input Sanitization & Injection Defense:** Parameterize all SQL queries. Sanitize HTML/Markdown inputs with DOMPurify/Sanitize-HTML to prevent XSS. Enforce CORS policies with explicit origin allowlists.
4. **Secrets & Environment Config:** Zero hardcoded API keys, private credentials, or secrets in source code. Load configuration exclusively from validated environment variables (`.env`).
5. **Security Auditing:** Pre-ship checks verify protection against OWASP Top 10 vulnerabilities (Injection, Broken Auth, Sensitive Data Exposure, SSRF, Broken Access Control).
