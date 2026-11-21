---
trigger: glob
globs: "**/*.{ts,tsx,jsx,css}"
description: Frontend standards, UI/UX Pro Max v2.0 anti-slop rules, and responsive design guidelines
---
# Frontend & UI/UX Standards

## 1. Component Architecture & State
- **Components**: Small, composable, single responsibility. Server Components by default in Next.js App Router; add `"use client"` only for state, effects, browser APIs, or event handlers, pushed to the leaf.
- **State**: Server state in TanStack Query / server fetch, URL state in search params, local UI state in `useState`; global client store (Zustand) only when truly cross-tree. Derive, don't duplicate. No effect to sync state that can be computed.
- **Hooks**: Exhaustive deps honored; `useMemo`/`useCallback` only after profiling or for referential stability across memoized children; custom hooks for reusable logic; stable `key`s (never array index for reorderable lists).

## 2. Design Tokens & Anti-Slop Discipline
- **Pre-Build Planning**: Run `/design-plan` or `python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Project>"` to establish design tokens, typography, and palette before writing UI.
- **Styling**: Tailwind with CSS variables for semantic tokens (`primary`, `secondary`, `accent`, `background`, `foreground`, `card`, `muted`, `border`, `ring`). No magic pixel numbers.
- **Anti-AI Tells**: Zero generic purple/pink gradients, zero default glassmorphism blobs, zero uniform pill buttons, zero emojis as functional icons (use SVG: Lucide/Heroicons/Phosphor).
- **Transitions**: Tuned duration (150–300ms) with ease-out or spring physics. `cursor: pointer` on all interactive elements. Always honor `prefers-reduced-motion`.

## 3. Resilient Text & Compact UI (v2.0)
- **Headings**: Use `text-wrap: balance` as a progressive enhancement; never assume a specific word stays on the last line across zoom, widths, fonts, and locales.
- **Non-Clipping Layout**: Essential text must reflow without clipping at narrow widths (375px), browser zoom (200%), and font scaling.
- **Chips & Badges**: Chip collections must wrap or provide an operable `+n` disclosure. Compact labels should remain whole; unavoidable truncation requires an accessible full-value path (tooltip/popover) for keyboard, pointer, and touch.
- **Badge Semantics**: Badge status cannot rely on color alone. Include text or icon, programmatic state, and context for screen readers.
- **Cancellable Interactions**: Rapid clicking or fast navigation may cancel animations, but final semantic state, focus, and content must remain completely accurate.

## 4. Forms, Input & IME Composition
- **Validation**: React Hook Form + Zod resolver with identical server-side schema validation.
- **Real-Time Recovery**: Clear errors as soon as the user corrects the field. Never clear valid input when other fields fail.
- **Unsaved Changes**: Warn users before navigating away from dirty forms. Keep focus inside modal dialogs.
- **IME Composition Safety**: In search fields and form textareas, never trigger submit on Enter while Japanese, Chinese, or Korean IME composition is active (`if (e.isComposing || e.keyCode === 229) return;`).

## 5. Accessibility (WCAG 2.1 AA Required)
- **Contrast**: Text contrast ratio ≥ 4.5:1 (normal text) and ≥ 3:1 (large text / UI controls).
- **Keyboard Path**: Unbroken logical tab index, visible focus ring (`ring-2 ring-offset-2`), no keyboard traps.
- **Screen Readers**: ARIA labels on icon buttons, semantic heading hierarchy (`h1` → `h2` → `h3`), landmarks (`header`, `nav`, `main`, `footer`).

## 6. Performance & Viewport Matrix
- **Images/Fonts**: `next/image` with explicit width/height, modern formats (AVIF/WebP), responsive `sizes`, lazy below fold, priority for LCP. `next/font` with WOFF2 and `font-display: swap`.
- **5-Tier Viewport Verification**: Audit layout across 375px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop), and 1920px (wide).
