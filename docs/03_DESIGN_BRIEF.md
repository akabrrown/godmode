# UI/UX Design Brief & Anti-Slop Specification — GODMODE OS

**Design Directive:** Anti-Slop Visual Excellence, High-Density Cyber-Architect Aesthetic  
**Target Viewports:** Desktop (1440px+), Tablet (768px - 1024px), Mobile (375px - 430px)  
**Accessibility:** WCAG 2.1 AA Compliant (Contrast ratio $\ge 4.5:1$, visible focus rings, full keyboard accessibility)

---

## 1. Anti-Slop Visual Manifesto

The user interface must look and feel like a high-precision, mission-critical engineering terminal built by senior product designers — **zero generic AI tells survive**.

### Banned Clichés vs. Required Execution

| Banned AI Tell | Strict GODMODE Replacement |
|---|---|
| Purple-to-pink gradient backgrounds (`bg-gradient-to-r from-purple-500 to-pink-500`) | Deep charcoal/zinc canvas (`#09090b` / `#0f172a`) with subtle, directional ambient light (`radial-gradient`) |
| Centered template hero section with floating cartoon 3D shapes | Asymmetric, information-dense dashboard layout with live metrics, terminal telemetry, and code artifacts |
| Generic card borders with excessive blur glow | 1px precision borders (`border-zinc-800`) with crisp subtle hover states (`border-zinc-600`) |
| Vague error alerts ("Something went wrong") | Detailed, actionable error cards showing stack trace snippets, error codes, and a "Retry" button |
| Placeholder text ("Lorem ipsum", "John Doe") | Production-realistic domain data (actual project names, real git hashes, verified metrics) |

---

## 2. Design Tokens & Color System

```css
:root {
  /* Surface Layers */
  --bg-primary: #090a0f;
  --bg-surface: #11131a;
  --bg-surface-elevated: #181b24;
  --bg-glass: rgba(17, 19, 26, 0.75);

  /* Borders & Dividers */
  --border-subtle: #1e2230;
  --border-muted: #2d3345;
  --border-highlight: #3b82f6;

  /* Typography */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-accent: #38bdf8;

  /* Status Accents (Tailored HSL) */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
  --status-info: #06b6d4;

  /* Fonts */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

---

## 3. The Mandatory 5-State UI Matrix

Every screen, modal, card, and component must handle all 5 operational states:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 5-STATE COMPONENT MATRIX                               │
├─────────────────┬──────────────────────────────────────────────────────────────────────┤
│ 1. LOADING      │ Shimmer skeleton matching exact component dimensions. Zero layout   │
│                 │ shift (CLS < 0.05). Never use a solitary spinning circle.            │
├─────────────────┼──────────────────────────────────────────────────────────────────────┤
│ 2. EMPTY        │ Descriptive icon, explanation of why data is absent, and a primary   │
│                 │ action button (e.g. "No pipelines run yet. Run your first build ->"). │
├─────────────────┼──────────────────────────────────────────────────────────────────────┤
│ 3. ERROR        │ Specific root cause, actionable recovery step, copyable error snippet,│
│                 │ and a secondary retry trigger.                                       │
├─────────────────┼──────────────────────────────────────────────────────────────────────┤
│ 4. SUCCESS      │ Clear feedback, elapsed execution time, verified output summary, and  │
│                 │ direct link to generated artifacts or git commit.                     │
├─────────────────┼──────────────────────────────────────────────────────────────────────┤
│ 5. OFFLINE      │ Indicators when local MCP daemon or internet connection drops, with   │
│                 │ queued local operations displayed in amber warning banner.           │
└─────────────────┴──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Micro-Interactions & Motion

- **Tool Shimmer Telemetry**: While a tool call runs, its intent label subtly shimmers with a moving highlight gradient.
- **Outcome Transition**: When the tool settles, the shimmer fades out in 150ms and transforms into a solid badge with a checkmark or cross.
- **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` by immediately swapping states without animated transitions.
