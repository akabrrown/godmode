---
trigger: glob
globs: "**/*.{tsx,jsx,vue,svelte,html,css,scss}"
description: UI/UX design intelligence, design tokens, anti-slop rules, and 7-phase design review
---
# UI/UX Design System & Anti-Slop Directive

## 1. Design System Enforcement (`/design-plan`)
- No UI component or page markup may be generated without first defining a concrete design system (Tokens, Style, Typography, Spacing, Signature Element).
- Use `python .agents/skills/ui-ux-pro-max/scripts/search.py "<product/industry> <keywords>" --design-system -p "<Project>"` to derive:
  - Appropriate landing pattern (from 34 patterns)
  - Cohesive visual style (from 80 searchable styles / 51 active)
  - Color palette (from 194 industry profiles)
  - Typography pairing (from 74 font combinations with Google Fonts imports)
  - Specific anti-patterns for that industry

## 2. Anti-Slop Visual Checklist
- [ ] No generic purple/pink gradients or AI-template color schemes.
- [ ] No default untuned glassmorphism.
- [ ] No emojis used as functional icons; use vector SVGs (Lucide, Heroicons, Phosphor).
- [ ] `cursor: pointer` applied to all clickable controls.
- [ ] Transition durations calibrated (150–300ms) with ease-out or spring curves.
- [ ] All 5 UI states handled: Loading, Empty, Error, Success, Offline.

## 3. Resilient Text & Compact UI Layout
- **Heading Line Balance**: Use `text-wrap: balance` as a progressive enhancement. Layouts must never depend on a specific word remaining on the last line.
- **Non-Clipping Reflow**: Text must reflow cleanly without truncation or clipping at narrow viewports (375px) and 200% zoom.
- **Chips & Badges**: Overflowing chip collections must wrap or provide an operable `+n` disclosure. Truncated labels must provide an accessible full-value path for keyboard and touch.
- **Status Badges**: Meaning cannot rely on color alone. Include visible text/icon and ARIA context.
- **Cancellable Interactions**: Rapid clicks or route switches may cancel animation, but the final semantic state, focus, and content must remain correct.

## 4. IME Composition Safety
- In search bars, chat inputs, and form fields, never trigger submit on Enter while CJK/IME composition is active (`if (e.isComposing || e.keyCode === 229) return;`).

## 5. 7-Phase Pre-Delivery Verification (`/design-review`)
Before concluding UI feature work, audit the live interface across 5 viewports:
- **375px (Mobile)**: Tap targets ≥ 44×44px, no horizontal scroll, collapsible navigation.
- **768px (Tablet)**: Balanced grid reflow and margins.
- **1024px (Laptop)**: Consistent typography scale and rhythm.
- **1440px (Desktop)**: Baseline desktop composition.
- **1920px (Wide)**: Max-width content containers prevent overstretched lines.
- **WCAG 2.1 AA**: Text contrast ≥ 4.5:1, visible focus rings, logical keyboard order, zero console errors.
