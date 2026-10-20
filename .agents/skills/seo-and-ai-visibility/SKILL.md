---
name: seo-and-ai-visibility
description: Plan, build, and audit SEO for websites - technical SEO, crawling/indexing, on-page, structured data, Core Web Vitals, internal linking, international/local/ecommerce SEO, migrations, link building, plus visibility in AI answer engines (ChatGPT, Perplexity, Google AI Overviews). Use for any public website build, "why am I not ranking", sitemap/robots/metadata/schema work, redirects during a migration, or pre-launch SEO checks.
---
# SEO and AI visibility

## How search works (diagnose in this order)
Crawl -> render -> index -> rank. A page that is not crawled or indexed cannot rank, so check access before content. Match **search intent** (informational, navigational, commercial, transactional) before anything else.

## Technical checklist
- **Crawl control**: `robots.txt` allows important paths and lists the sitemap; `Disallow` blocks crawling but does not remove pages from the index (use `noindex` for that, and do not combine them on one URL); noindex staging/internal/search/filter pages; `nofollow` for untrusted links.
- **Sitemaps**: XML sitemap with only canonical, indexable 200 URLs, accurate `lastmod`, submitted in Search Console; split by type for large sites.
- **Status codes and redirects**: 200 for live pages, 301 for permanent moves (no chains or loops, one hop), 404/410 for gone pages, never soft 404s; fix 5xx fast; watch Crawl Stats.
- **Canonicals and duplicates**: one canonical URL per page (self-referencing canonical), consistent trailing slash/case/www/https, parameter and faceted-navigation control, paginate with crawlable links, consolidate near-duplicate content.
- **Rendering/JS**: critical content and links present in server-rendered HTML (Next.js Server Components/SSG/ISR); real `<a href>` links; no content behind clicks only; test with URL Inspection.
- **Speed and UX**: Core Web Vitals (see performance rule), mobile-first, HTTPS everywhere, no intrusive interstitials.
- **Architecture**: shallow hierarchy (important pages within ~3 clicks), clean readable URLs (lowercase, hyphens, no IDs-only), breadcrumbs, internal links with descriptive anchor text, no orphan pages.
- **International**: `hreflang` with reciprocal tags and `x-default`, one language per URL, avoid auto-redirect by IP.

## On-page checklist
Unique `<title>` (~50-60 chars, primary term near the front) and meta description (~150 chars, written to earn the click); one `<h1>`; logical H2/H3 outline; keyword in natural places without stuffing; descriptive image `alt`, compressed responsive images, explicit dimensions; scannable formatting; clear author, date, and sources for credibility (E-E-A-T: experience, expertise, authoritativeness, trust); original value (information gain) rather than rewriting what already ranks.

## Structured data (JSON-LD)
Organization/Person, WebSite, BreadcrumbList, Article, Product (+ Offer, Review), LocalBusiness, FAQ/HowTo only where eligible and truthful. Must match visible content; validate in the Rich Results Test; keep entity names and `sameAs` links consistent across the site and profiles.

## Next.js implementation
`generateMetadata` per route (title, description, canonical, Open Graph, Twitter), `app/sitemap.ts`, `app/robots.ts`, `next/image`, `next/font`, JSON-LD in a script tag, `notFound()` for missing content, redirects in `next.config` or middleware, `lang` attribute set, no duplicate routes serving the same content.

## Keywords and content
Research with Search Console, Keyword Planner, and competitor/SERP analysis; cluster by intent into topic pillars with supporting pages; one primary intent per page; refresh decaying content; prune or consolidate thin pages; avoid spam practices (cloaking, doorway pages, scaled low-value content, expired-domain or reputation abuse, link schemes).

## Local and ecommerce
Local: Google Business Profile complete, consistent NAP, local citations, reviews with replies, location pages with unique content. Ecommerce: unique product pages, Product schema, faceted navigation controls, out-of-stock handling (keep or redirect deliberately), category content.

## Links and authority
Earn links with original research, data, tools, digital PR, and genuine partnerships; judge quality by relevance and editorial context; no paid or exchanged link schemes; monitor and disavow only for real manipulative links.

## Migrations
Crawl old site, map every old URL to its new equivalent (301), keep metadata and content parity, update internal links/canonicals/sitemaps, launch off-peak, then monitor index coverage, 404s, rankings, and traffic for weeks; keep redirects for at least a year.

## AI search and answer engines
Allow reputable AI crawlers deliberately via `robots.txt` (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Bingbot) and decide per bot, remembering that blocking may cost citations; keep important content in server-rendered HTML; write direct answers near the top, use question-style headings, concise self-contained sections, tables and lists; add original data, quotes and clear authorship; keep entity facts consistent everywhere; maintain presence on the third-party sources AI systems cite (reviews, directories, forums); measure with referral traffic from AI domains, brand mentions, and a fixed prompt set tracked over time. Treat AI visibility tests as directional, not exact.

## Measure
Search Console (impressions, clicks, CTR, index coverage, Core Web Vitals, manual actions), analytics (organic sessions, conversions), rank tracking by intent group, log file analysis for large sites, crawler tools (Screaming Frog/Sitebulb). Report trends, not daily noise.

## Output
Audit table `Priority | Area | Finding | Fix | Effort`, blockers first (indexing, redirects, canonicals), then on-page and content wins, then authority work. Never promise rankings; state expected effects as hypotheses.
