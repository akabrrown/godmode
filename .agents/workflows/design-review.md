---
description: Run the 7-phase design review (WCAG AA, 5 viewports, interaction flows, console health) on a page or URL
argument-hint: [url-or-file] [optional focus, e.g. "mobile nav" or "checkout flow"]
---

# /design-review

Perform an evidence-based, 7-phase design review on the target UI before calling work complete.

## Inputs
- **Target URL or File:** `$1` (e.g. `http://localhost:3000/pricing` or `src/app/page.tsx`)
- **Optional Focus:** `$2` (e.g. "mobile navigation", "checkout modal", "dark mode contrast")

If no target is given, ask for the dev-server URL or file path, or run `node scripts/design-audit.mjs` against the build output.

---

## The 7-Phase Execution Protocol

### Phase 0: Baseline Setup
- Render at 1440×900 in a browser or test runner.
- Check immediate console output: 0 errors, 0 hydration mismatches, 0 failed assets.

### Phase 1: Interaction & Flow Verification
- Exercise primary user journey: click buttons, open menus/modals, submit forms (valid & invalid).
- Confirm all states exist and differ: Default, Hover, Focus, Active, Disabled, Loading, Empty, Error.
- Confirm destructive actions are guarded and cancellable interactions preserve state.

### Phase 2: Responsive Viewport Matrix
- Audit 5 distinct tiers:
  1. **375px (Mobile)**: Tap targets ≥ 44×44px, no horizontal scroll, collapsed mobile navigation.
  2. **768px (Tablet)**: Grid reflow, appropriate gutter spacing.
  3. **1024px (Laptop)**: Readable font scaling, proper density.
  4. **1440px (Desktop)**: Primary baseline layout.
  5. **1920px (Wide)**: Max-width containers prevent awkward line stretching (>80 chars).

### Phase 3: Visual Polish & Token Discipline
- Spacing rhythm (strict 4px / 8px scale).
- Cohesive typography hierarchy (max 2 font families).
- Consistent corner radii and elevation shadows.
- Zero AI slop tells (no gratuitous purple gradient fills, no generic emojis as icons).

### Phase 4: Accessibility (WCAG 2.1 AA)
- Tab sequence: visible focus ring, logical DOM order, zero keyboard traps.
- Contrast ratio: ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components.
- Screen readers: ARIA labels on icon buttons, semantic heading levels (`h1` → `h2` → `h3`), landmark tags (`header`, `nav`, `main`, `footer`).
- `prefers-reduced-motion` respected (no jarring auto-playing transitions).

### Phase 5: Robustness & Boundary Stress
- Test extreme text strings (German words, long email addresses) — text must wrap without clipping.
- Chip and badge overflow: use wrapping or accessible `+n` disclosures.
- IME composition: Enter key in forms must not trigger submit while composing CJK characters.

### Phase 6: Console, Performance & Health
- 0 network 404s, layout shift (CLS < 0.1), payload size within budget.

---

## Output Report Structure

Rank all findings strictly by severity:
```markdown
## Design Review — [Page/URL]
**Verdict:** [Ship / Ship with fixes / Needs work] | Viewports: 375, 768, 1024, 1440, 1920

### Blockers (Must fix before merge — breaks usability or fails WCAG AA)
- [Observation] → [Why it fails] → [Fix] · Evidence: [Console/Screenshot]

### High (Significant polish defect)
- ...

### Medium (Noticeable improvement)
- ...

### Nitpicks (Minor styling touches)
- ...

### What's Working (Positive design choices to keep)
- ...
```
