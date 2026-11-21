---
description: Generate a concrete design system (tokens, style, type, UX) before building UI
argument-hint: <product/industry + keywords>, e.g. "fintech dashboard trustworthy data-dense"
---

# /design-plan

Before writing any markup or frontend components, produce a tailored design system for: **$ARGUMENTS**

## Step 1: Run the UI/UX Pro Max Design System Generator
Execute the local search script to produce the recommended style, palette, typography, and anti-patterns:
```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --design-system -p "Project" --persist --output-dir "."
```

## Step 2: Query Targeted Domain Details (if needed)
- `--domain color "<industry> <mood>"` for palette / semantic CSS variables
- `--domain typography "<mood>"` for font pairing & Google Fonts imports
- `--domain web-vitals "<page type>"` for the performance budget
- `--domain ux "<pattern>"` for specific interaction rules (IME, chips, error handling)
- `--stack <framework>` (e.g. `react`, `nextjs`, `html-tailwind`, `shadcn`) for exact code patterns

## Step 3: Anti-Slop Filter & Signature Selection
- **Purpose & Tone:** State primary user context and choose ONE distinct visual direction.
- **Signature Element:** Define a single memorable interaction or visual element (e.g., custom border treatment, refined spring physics, asymmetric hero grid).
- **Anti-Slop Gate:** Reject generic AI templates (no purple/pink gradients, default glassmorphism, uniform pill buttons).

## Step 4: Token Block Output
Produce a compact token definition block (4–6 named colors, 2–3 typography roles, spacing scale, signature element) and persist to `design-system/<project-slug>/MASTER.md`. Do **not** begin component markup until this contract is established.
