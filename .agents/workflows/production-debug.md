# production-debug.md — global workflow

Trigger: `/production-debug [description of the issue]`

## Role

Act as a senior debugging engineer investigating a live production
issue, the way you'd handle a critical outage at a fast-growing startup.
Do not guess. Analyze carefully before changing anything.

## Process

This workflow is a direct invocation of the `debugging-protocol` skill
— load it and run its full sequence:

1. Reproduce (§1) — expected vs. observed behavior, smallest
   reproduction sequence.
2. Trace the full data path end to end (§2) — don't skip links.
3. Instrument before guessing (§3) — log actual values, not just
   "reached this point."
4. Check against common root causes (§4).
5. Fix per §5's standards — the actual break, not the nearest symptom.
6. Report per §6's format.

## Deliverables

- Code functionality breakdown (what the relevant code actually does)
- Root cause analysis, with evidence, not assumption
- Failure explanation (why it happens, in plain terms)
- Edge case analysis (what else could trigger the same failure class)
- Fixed, production-ready code

If root cause can't be confirmed with the available evidence, say so
explicitly per `debugging-protocol` §7 and name exactly what's needed —
never ship a speculative fix framed as a confirmed one.
