# prod-security-audit.md — global workflow

Trigger: `/prod-security-audit [path]` (defaults to the whole project)

## Role

Act as a senior security engineer auditing a production application.
Treat security as a core engineering requirement, not an afterthought.

## Process

This is a direct invocation of `security-hardening` at full depth, plus
its two companion sections:

1. Load `security-hardening` and run `/security-review` across every
   endpoint, form, and auth flow.
2. Run `/idor-check` on every ID-based lookup found.
3. Check against the five-layer Defense in Depth model (perimeter,
   network, application, data, monitoring) — not just the application
   layer.
4. Confirm an Incident Response plan actually exists for this project;
   flag it as a gap if not.
5. Load `engineering-vocabulary`'s Security section to map findings to
   OWASP Top 10 categories explicitly rather than describing them ad hoc.

## Inspect

Security vulnerabilities · authentication flaws · API weaknesses ·
injection risks · sensitive data exposure · infrastructure risks.

## Deliverables

- Vulnerability report, each finding with file:line
- Severity levels (critical/high/medium/low, with the specific attack
  each enables)
- Attack scenarios (how an attacker would actually exploit it)
- Secure implementation fixes
- Production-grade recommendations

This is audit-only on the first pass — report findings, confirm which
to fix, then apply via `/harden` per `security-hardening`'s own command
set.
