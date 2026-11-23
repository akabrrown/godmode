---
description: Perform an evidence-led web quality, Core Web Vitals, and Lighthouse audit
argument-hint: <url-or-build-path>, e.g. "http://localhost:3000"
---

# /web-quality

Execute an evidence-led web quality audit using Addy Osmani's measurement framework.

## Step 1: Establish Target & Evidence Scope
- **Target URL:** `$1`
- Collect both **Lab Observations** (controlled DevTools/Lighthouse run) and **Field Context** (CrUX real-user metrics if available).

## Step 2: Core Web Vitals Deep Audit
Evaluate the three core pillars:
1. **LCP (Largest Contentful Paint) < 2.5s:**
   - Audit 4 sub-parts: TTFB, Resource Load Delay, Resource Load Duration, Element Render Delay.
   - Preload priority LCP hero image/font; eliminate render-blocking stylesheets.
2. **INP (Interaction to Next Paint) < 200ms:**
   - Detect Long Animation Frames (LoAF > 50ms) during user clicks and typing.
   - Break up long JavaScript tasks; use `requestAnimationFrame` or `scheduler.yield()`.
3. **CLS (Cumulative Layout Shift) < 0.1:**
   - Ensure explicit `width` and `height` on all images, videos, and dynamic embeds.
   - Reserve space for banners, notices, and web fonts (`font-display: swap` + fallback metrics).

## Step 3: Accessibility (WCAG 2.2 AA)
- Contrast ratio ≥ 4.5:1.
- Visible keyboard focus rings and unobstructed tab order.
- Native semantics and ARIA tags where appropriate.

## Step 4: Output Ranked Quality Report
Structure output strictly:
- **Critical Regressions** (Blocks release)
- **High Impact Optimizations** (Clear performance gain)
- **Lab & Field Evidence Proof**
