---
name: design-system-ux
description: Create or review UI/UX and design systems - design tokens, typography, color, spacing, components, accessibility, microcopy, user flows, personas, usability, behavior-aware design. Use for any Design Brief, component library work, shadcn theming, UX critique, or when a UI looks generic and needs intentional design.
---
# Design system and UX

## UX process
Understand users and goals (personas, jobs-to-be-done, user stories) -> map flows (simple flowcharts) -> low-fi wireframes -> prototype -> test with real users -> iterate; measure with analytics and A/B tests. Reduce cognitive load: one primary action per screen, clear hierarchy, short copy, sensible defaults, progressive disclosure, visible progress and success states, forgiving errors, reminders only where valuable. Ethical persuasion: help users reach their goals; no dark patterns.

## Design system building blocks
1. **Foundations/tokens**: color (primitive -> semantic, light/dark), typography scale, spacing scale (4/8 base), radius, elevation, motion, breakpoints, z-index. Tokens are the single source (CSS variables / Tailwind theme / Figma variables).
2. **Components**: core set first (button, input, select, checkbox/radio/switch, textarea, modal, dropdown, tabs, toast, tooltip, card, badge, avatar, table, form patterns). Each documents: purpose, anatomy, variants, sizes, states (default/hover/focus/active/disabled/loading/error), a11y, do/don't, usage guidance.
3. **Patterns**: forms, empty states, loading, errors, onboarding, navigation, data tables, search/filter.
4. **Content**: tone of voice, microcopy rules, terminology, naming.
5. **Governance**: ownership, contribution + PR template, semantic versioning, changelog, release strategy, deprecation, usage analytics.

## Accessibility baseline
WCAG 2.1 AA: contrast, focus order and visibility, keyboard support, labels, error association, touch targets >= 44px, reduced motion, zoom/reflow, screen-reader testing, color not the only signal.

## Anti-generic checklist (this portfolio's rules)
Avoid: gradient blobs, glassmorphism as default card, uniform pill buttons, scroll-fade on every section, cursor-follow gradients, grain-over-gradient, fade-only hovers, decorative italic serif accents on sans UIs, Space Grotesk + Instrument Serif pairing. Derive layout and mechanics from the product's own content and constraints, not from template habits. Take references for a specific mechanic, never to copy a layout.

## Output
Design Brief sections: principles, tokens table, type scale, component inventory with states, key screens, a11y notes, microcopy rules, open questions. For reviews: findings by severity with a concrete fix each.
