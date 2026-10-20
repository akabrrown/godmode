---
trigger: glob
globs: "**/*.{ts,tsx,jsx,css}"
description: Frontend standards for React/Next.js/Tailwind code
---
# Frontend standards
- **Components**: small, composable, one responsibility. Server Components by default in Next.js App Router; add `"use client"` only for state, effects, browser APIs, or event handlers, and push it to the leaf.
- **State**: server state in TanStack Query (or server fetch), URL state in search params, local UI state in `useState`; global client store (Zustand) only when truly cross-tree. Derive, don't duplicate. No effect to sync state that can be computed.
- **Hooks**: exhaustive deps honored; `useMemo`/`useCallback` only after measuring or for referential stability across memoized children; custom hooks for reusable logic; stable `key`s (never index for reorderable lists).
- **Forms**: React Hook Form + Zod resolver; the same schema validates on the server.
- **Accessibility (required)**: semantic HTML first, visible focus, labels bound to inputs, alt text, keyboard-operable, contrast >= 4.5:1, respect `prefers-reduced-motion`, ARIA only when native semantics fall short. Prefer Radix/shadcn primitives for dialogs, menus, tabs.
- **Styling**: Tailwind with design tokens (CSS variables) for color/spacing/type; no magic numbers; mobile-first breakpoints; dark mode via tokens.
- **Resilience**: every async view has loading, empty, error, and offline-ish states; error boundaries around route segments.
- **Images/fonts**: `next/image` with width/height, responsive `sizes`, lazy below fold, priority only for LCP image; `next/font`, WOFF2, `font-display: swap`.
- **Types**: props typed explicitly; discriminated unions for variant props; no `any`; `satisfies` for config objects; `as const` for literals.
- **Anti-generic UI**: apply the anti-AI-generic design rules (no gradient blobs, default glassmorphism, uniform pill buttons, fade-in-everything). Design from the Design Brief tokens.
- **Ghana context**: assume mid-range Android on variable networks; keep JS payload lean, support low-bandwidth states, prices in GHS, MoMo-first checkout.
