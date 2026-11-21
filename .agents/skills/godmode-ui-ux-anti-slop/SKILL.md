---
name: godmode-ui-ux-anti-slop
description: Premium, anti-slop UI/UX design intelligence combining taste-skill anti-slop rules, ui-ux-pro-max v2.0 194 reasoning rules, 80 design styles (51 active), 194 palettes, 74 typography pairings, 141 UX guidelines, resilient text & compact UI layout, and 7-phase design review.
---

# GODMODE UI/UX Anti-Slop Design Intelligence & Execution System

## Overview
Eliminates AI UI "slop" (generic purple/pink gradients, default glassmorphism clichés, poor typography, cramped spacing, unhandled edge states, and clipping text) by integrating:
1. **Taste-Skill Anti-Slop Directives:** Strict avoidance of generic AI hallmarks.
2. **UI/UX Pro Max v2.0 Intelligence:** 194 industry reasoning rules, 80 searchable visual styles (51 active), 194 color palettes, 74 font pairings, 141 UX guidelines, and 22 technology stack profiles.
3. **Resilient Text & Compact UI Standards:** Balanced heading wrap as progressive enhancement, chip/badge wrapping with operable `+n` disclosures, cancellable rapid interactions, and IME-safe composition.
4. **Master + Overrides Pattern:** Systematic generation of `design-system/<project-slug>/MASTER.md` and per-page overrides.
5. **7-Phase Design Review:** Live browser audit across 5 viewports (375, 768, 1024, 1440, 1920) checking WCAG 2.1 AA and interaction flows.

---

## 1. Anti-Slop Design Principles

```
  BANNED (AI SLOP)                      GODMODE PREMIUM STANDARD
  ────────────────                    ─────────────────────────
  ✖ Generic purple/pink gradients      ✔ Curated HSL/Hex palettes (194 industry profiles)
  ✖ Default browser fonts              ✔ Curated typography pairings with Google Fonts import URLs
  ✖ Untuned glassmorphism everywhere   ✔ Purposeful elevation, depth, shadows, and subtle borders
  ✖ Instant state changes (0ms)        ✔ Smooth, tuned CSS transitions & spring physics (150-300ms)
  ✖ Emojis as functional icons         ✔ Clean, vector SVG icons (Lucide, Heroicons, Phosphor)
  ✖ Static pixel offsets (+12px)       ✔ Responsive, fluid layout math using rem/em and flex/grid
  ✖ Color alone for badges/status      ✔ Semantic tokens, visible focus, ARIA labels, and live count context
  ✖ Unhandled overflow & truncated text✔ Reflow without clipping, accessible full-value path for tokens
  ✖ Enter submission breaking IME      ✔ Guarded Enter key handler checking e.isComposing / keyCode 229
```

---

## 2. Design System Generation Workflow (`/design-plan`)

Before writing any markup or frontend component code, generate a tailored design system:

```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "<Project Name>" --persist --output-dir "<project-root>"
```

### 5-Pillar Output:
1. **Landing Pattern:** Structure chosen from 34 high-converting patterns (e.g., Trust & Authority, Hero-Centric, Social Proof).
2. **Style Selection:** Filtered from 80 visual styles (51 active), ranking by BM25 relevance (Minimalism, Soft UI, Swiss, Neo-Brutalism, Dark Mode, etc.).
3. **Semantic Colors:** Complete palette (Primary, On-Primary, Secondary, Accent/CTA, Background, Foreground, Card, Muted, Border, Destructive, Ring) passing 4.5:1 WCAG AA contrast.
4. **Typography Pairing:** Header and body font selections with Google Fonts `@import` and font-family declarations.
5. **Anti-Patterns & Pre-Delivery Checklist:** Industry-specific pitfalls to avoid and explicit quality verification points.

---

## 3. Resilient Text & Compact UI Rules

- **Headings:** Use `text-wrap: balance` as a progressive enhancement; never assume a specific word stays on the last line across zoom and locales.
- **Chips & Badges:** Collections must wrap or provide an operable `+n` disclosure. Truncated labels must have accessible full-value tooltips/dialogs.
- **Micro-Interactions:** Rapid clicks may cancel animations, but final semantic state, focus, and content must remain completely accurate.
- **Forms & Inputs:** Clear fixed errors in real time, preserve user inputs across errors, provide unsaved-change warnings, and guard Enter submission against IME composition.

---

## 4. 7-Phase Design Review (`/design-review`)

Before marking any UI deliverable complete, run the 7-phase evidence review across 5 viewports:

| Phase | Focus | Viewport / Method | Success Criteria |
|---|---|---|---|
| **Phase 0** | Baseline Setup | 1440×900 Playwright | No console errors, no render crashes |
| **Phase 1** | Interaction Flows | Active click/tab test | Hover, focus, active, disabled, loading, empty, and error states present |
| **Phase 2** | Responsiveness | 375, 768, 1024, 1440, 1920 | No horizontal scroll, tap targets ≥44×44px, no clipped text |
| **Phase 3** | Visual Polish | Spacing & tokens | Design token alignment, rhythm, consistent border-radii |
| **Phase 4** | Accessibility | Keyboard tab & WCAG AA | Contrast ≥4.5:1, visible focus ring, no keyboard traps, `prefers-reduced-motion` |
| **Phase 5** | Robustness | Long strings & zero data | Graceful reflow with extreme content lengths |
| **Phase 6** | Console & Health | DevTools audit | Zero 404 assets, CLS < 0.1, payload < budget |

Report findings ranked strictly: **Blockers** (must fix) → **High** → **Medium** → **Nitpicks**.
