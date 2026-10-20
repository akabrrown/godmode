---
name: frontend-performance-audit
description: Audit and fix frontend speed - Core Web Vitals, bundle size, images, fonts, CSS/JS loading, caching. Use whenever the user mentions slow pages, Lighthouse, LCP/INP/CLS, bundle size, page weight, "optimize performance", or before launching any public website, even if they do not say "performance".
---
# Frontend performance audit

## Procedure
1. **Baseline**: run Lighthouse (mobile, throttled) on 2-3 key routes; note LCP, INP, CLS, TBT, TTFB, transfer size, JS size. Save numbers.
2. **Find the biggest lever** (do not fix everything): identify the LCP element, the largest JS chunks, render-blocking resources, and layout-shift sources.
3. **Fix in this order**, re-measuring after each: server/TTFB -> LCP resource -> JS weight -> CSS -> fonts -> images -> CLS -> INP.
4. **Report**: before/after table + remaining items ranked by impact/effort.

## Checklist
**Network & delivery**: HTTPS + HTTP/2/3; gzip/brotli; CDN; TTFB < 0.8s (never > 1.3s); hashed assets cached immutable; HTML revalidated; no 404/redirect chains; preconnect to critical origins; one protocol (no mixed content); cookies < 4KB each and few.
**JavaScript**: minified; split by route; dynamic-import rare/heavy components; `defer`/`async`; no large inline blocks mid-body; remove unused deps; check size of any new library (bundlephobia-style) and prefer lighter or native APIs; keep deps current; break up tasks > 50ms; avoid hydration of static content (server components/islands).
**CSS**: minified; remove unused; non-blocking; critical CSS inlined only for above-the-fold; avoid inline CSS in body (except critical); watch selector complexity and duplicates.
**Images**: right format (AVIF/WebP, SVG for vectors); compressed (Squoosh-class tools); responsive `srcset/sizes`; explicit width/height; lazy-load offscreen with fallback; avoid base64 for anything but tiny; priority only on LCP image.
**Fonts**: WOFF2; total < 300KB; subset; `font-display: swap`; preload the one critical face; avoid invisible text flash.
**Rendering**: avoid iframes; avoid layout thrash; virtualize long lists; reserve space for async content (CLS); minimize DOM size; use `content-visibility` for long pages; service worker for repeat visits where relevant.
**Tools**: Lighthouse, PageSpeed Insights, WebPageTest, Chrome DevTools (Performance, Coverage), bundle analyzer.

## Output format
`Metric | Before | After | Change` table, then a prioritized "Next" list. Never claim an improvement without a measurement.
