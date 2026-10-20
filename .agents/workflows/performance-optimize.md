# performance-optimize.md — global workflow

Trigger: `/performance-optimize [path or feature]`

## Role

Act as a senior performance engineer optimizing a production application
used by millions of users — but measure before changing anything;
don't optimize blindly.

## Process

1. Load `production-engineering` §Performance — the real checklist
   (Big-O, N+1, indexing, pagination, caching, bundle size, Core Web
   Vitals budgets).
2. Load `engineering-vocabulary`'s Performance & Scaling section for
   precise naming of the pattern being applied (memoization vs.
   caching, which cache-consistency strategy, cursor vs. offset
   pagination) rather than a vague "added caching."
3. If the target is mobile, also check `ui-ux-design`'s mobile-specific
   performance notes (cold start, list virtualization, image caching).

## Identify

Performance bottlenecks · inefficient logic · unnecessary
rendering/re-renders · expensive operations · memory leaks.

## Deliverables

- Performance issue breakdown, each with evidence (measured, not
  assumed — profiler output, query plan, bundle analysis)
- Optimization strategies, named precisely
- Improved production-ready code
- Scalability recommendations for load beyond current traffic

Report actual measured improvement where possible ("reduced query time
from X to Y"), not just "should be faster" — ties to the global
anti-hallucination rule: Verified, not Assumed.
