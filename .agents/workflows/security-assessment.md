# security-assessment.md — global workflow

Trigger: `/security-assessment [path]` (defaults to the whole project)

## Scope note, stated plainly

This workflow explains how each finding could realistically be
exploited (attack narrative, severity, exact fix), backed by real
file:line evidence — that's a legitimate defensive security review, the
same category of work `security-hardening` and `/prod-security-audit`
already do. It does not produce ready-to-run exploit payloads, scanning
tools aimed at systems you don't own, or anything that functions as
attack tooling rather than assessment. Assessing your own system and
explaining its weaknesses with fixes is the goal; that boundary doesn't
limit anything this workflow is actually for.

## Do not pause for clarification

Proceed through the full assessment without stopping to ask questions.
Where something is genuinely ambiguous, state the reasonable
interpretation inline (per the global Assumed/Verified language) and
keep going. Only stop outright if something is a hard blocker — you
can't reach a file or repo needed to continue — and say exactly what's
blocking it.

## Method 1 — adversarial simulation

Act as an external security researcher attempting unauthorized access
to this system, with no inside knowledge beyond what's in the codebase.

1. **Recon** — enumerate the real attack surface: every public endpoint,
   form, file upload, auth flow, webhook receiver, and third-party
   integration actually present in the code.
2. **Hypothesize** — for each surface, reason through how an attacker
   would actually try to abuse it (change an ID to access another
   user's data, submit malformed input, replay a request, race a
   check-then-write, forge a webhook payload) — grounded in what the
   code actually does, not a generic vulnerability checklist recited
   without evidence.
3. **Chain** — look for combinations, not just single flaws: a minor
   information leak that makes a second, more serious exploit easier
   (an error message revealing a valid username, then used against a
   weak login rate limit).
4. **Validate against the code** — for each hypothesis, confirm with
   file:line evidence whether the vulnerability actually exists as
   reasoned, or whether an existing control (from `security-hardening`)
   already blocks it. Report both — confirmed exploitable and
   "hypothesized but actually mitigated by X" are both useful findings.

## Method 2 — standards-based review (OWASP + STRIDE)

Apply two complementary standard frameworks systematically, not
impressionistically:

**OWASP Top 10** — walk every finding from Method 1, plus a direct
category-by-category pass, and tag each with the OWASP category it
falls under (Broken Access Control, Injection, Cryptographic Failures,
etc. — see `engineering-vocabulary`'s Security section for the full
list). A finding with no OWASP tag is either miscategorized or not
actually a security finding — force the tag.

**STRIDE threat modeling** — for each major component and trust
boundary (client ↔ API, API ↔ database, API ↔ third-party service,
admin ↔ regular user), evaluate:
- **S**poofing — can an actor convincingly pretend to be someone else?
- **T**ampering — can data be modified in transit or at rest without
  detection?
- **R**epudiation — can an actor deny having performed an action, for
  lack of an audit trail?
- **I**nformation disclosure — can data be exposed to someone who
  shouldn't see it?
- **D**enial of service — can availability be degraded or knocked out?
- **E**levation of privilege — can an actor gain access beyond their
  actual role?

Draw the trust boundaries explicitly (even as a short written list, not
necessarily a diagram) before running STRIDE against them — a threat
model without named trust boundaries isn't actually a threat model.

## Process

1. Load `security-hardening` in full — both methods above draw on its
   full checklist (auth, authorization, input validation, secrets,
   transport, rate limiting, data protection).
2. Load `defensive-coding` for anything mutating — the adversarial pass
   should specifically probe idempotency, race conditions, and payment/
   booking logic using that skill's chaos-scenario habit.
3. Load `backend-admin-database` to check RLS/tenant isolation and
   admin-endpoint authorization specifically.
4. Load `engineering-vocabulary`'s Security section for precise OWASP
   naming.
5. If the project has E2E tests, load `playwright-testing` — an IDOR or
   auth-bypass hypothesis from Method 1 can often be turned into an
   actual automated regression test as part of the fix.

## Deliverables — one consolidated report

For every finding, regardless of which method surfaced it:

```
[SEVERITY] file:line — OWASP category — STRIDE category
Attack scenario: how this would actually be exploited
Evidence: Verified (confirmed in code) / Assumed (plausible, unconfirmed)
Fix: the specific, concrete remediation
```

Then: a short summary of trust boundaries evaluated, total findings by
severity, and — explicitly — a short list of things checked and found
already solid, not just problems. A security assessment that only lists
problems with no confirmation of what's already correctly defended
reads as incomplete, not thorough.

## After the report

Don't apply fixes automatically. List findings first; the person decides
which to act on and in what order, same as `/prod-security-audit` and
`/full-audit`. High/critical findings should be flagged clearly enough
that they can't be missed in a long report.
