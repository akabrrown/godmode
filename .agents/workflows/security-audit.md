---
description: Run a structured security audit of the codebase or a selected area and produce a prioritized fix list
---
# /security-audit
1. Scope: ask for target (whole app, folder, or endpoint set) only if unclear. Load `api-security-audit` and the security rule.
2. Inventory: routes/actions/webhooks, auth flow, roles, tables + RLS state, env/secrets use, file uploads, third-party scripts, dependencies.
3. Automated pass (if tooling exists): dependency audit, secret scan, lint security rules, header check on a running instance.
4. Manual pass by checklist sections 1-8 of `api-security-audit`; record PASS/FAIL with file:line.
5. Report table `Severity | Location | Issue | Fix`, Critical first. Separate "fix now" from "backlog".
6. Offer to apply Critical/High fixes as small separate commits, each with a test; do not change unrelated code.
