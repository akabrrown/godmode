---
name: react-typescript-standards
description: Write or review React + TypeScript + JavaScript code - hooks, state management, forms, rendering, error boundaries, typing patterns, utility types, generics, narrowing, async/event-loop pitfalls, tsconfig strictness. Use for any React component work, refactor, TS typing question, or when fixing re-render, stale closure, or type-safety issues.
---
# React + TypeScript standards

## React
- Function components + hooks. Props down, events up; lift state only as high as needed; derive instead of storing; avoid prop drilling via composition or context (context for low-frequency data; split contexts).
- `useEffect` is for syncing with external systems, not for deriving state or handling events. Always clean up subscriptions/timers/fetches (AbortController). Fix stale closures via deps or functional updates.
- Memoization (`memo`, `useMemo`, `useCallback`) after profiling; stable references for deps; `useReducer` for complex transitions; `useRef` for non-render values/DOM.
- Lists: stable unique keys. Conditional rendering explicit. Suspense + error boundaries per feature area.
- Server state: TanStack Query/SWR (cache keys, staleTime, optimistic updates, invalidation). Client state: Zustand/Jotai if needed.
- Forms: React Hook Form + Zod. Accessible errors (`aria-describedby`, `aria-invalid`).
- Testing: React Testing Library by user behavior (roles/labels), MSW for network, Playwright for E2E.
- Styling: Tailwind + tokens; headless primitives (Radix/React Aria/shadcn) for a11y.

## TypeScript
- `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` when feasible; `isolatedModules`; path aliases.
- Prefer `type` for unions/utility compositions, `interface` for extendable object contracts; discriminated unions + exhaustive `switch` with `never`.
- Narrow with type guards/predicates, `in`, `instanceof`; use `unknown` over `any` at boundaries; avoid non-null `!` and `as` casts (use `satisfies`, `as const`).
- Generics with constraints (`<T extends ...>`), utility types (`Pick/Omit/Partial/Required/Record/ReturnType/Awaited/NonNullable`), mapped/conditional/template literal types only when they simplify call sites.
- Derive types from runtime schemas (`z.infer`) so validation and types never drift. Share types via a `packages/types` module in monorepos.

## JavaScript pitfalls to catch
`==` vs `===`; mutation of shared objects; floating-point money; unhandled promise rejections; `await` in loops where parallel is safe (`Promise.all`/`allSettled`); closures in loops; event-loop blocking; memory leaks (listeners, intervals, caches without bounds); Date/timezone bugs; ESM/CJS interop.
