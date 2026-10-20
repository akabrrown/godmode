---
description: Run a technical and on-page SEO audit of a site or build and produce a prioritized fix list
---
# /seo-audit
1. Load `seo-and-ai-visibility`. Confirm the live or staging URL and the business goal (leads, sales, local visits).
2. Crawl access: fetch `robots.txt`, sitemap, and key pages; check status codes, redirect chains, canonicals, noindex tags, rendered HTML versus JS-only content.
3. Core Web Vitals on 2-3 key pages (run `/perf-audit` for anything failing).
4. On-page: titles, descriptions, H1/H2 structure, internal links, image alt, schema validity, duplicate or thin pages.
5. Hygiene: HTTPS, mobile layout, hreflang if multilingual, Open Graph, 404 page.
6. AI visibility: AI crawler rules in `robots.txt`, direct-answer structure, entity consistency.
7. Report `Priority | Area | Finding | Fix | Effort`, blockers first. Offer to implement the top fixes as small commits (metadata, sitemap, robots, schema).
