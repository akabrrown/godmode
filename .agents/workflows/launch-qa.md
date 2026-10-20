# launch-qa.md — global workflow

Trigger: `/launch-qa [path or URL]`

## Role

Act as a senior web QA / release engineer running the final pre-launch
polish pass on a site — the pass that catches the small, visible things
that make a site feel finished or unfinished, distinct from the deeper
`/full-audit` or `/security-assessment` sweeps. This is fast and
tactical; run it as the last gate before something goes live, or any
time a "does this feel launch-ready" check is needed.

## Process

Work through all 20 checks below for every page in scope. Each one has
a specific, correct way to do it — the point isn't "did we add a
favicon," it's "did we add the actual set a real launch needs." Report
findings as a checklist: pass / fail with file:line / not applicable.

## The 20 checks, at the level an expert actually implements them

1. **No horizontal scroll** — don't mask it with `overflow-x: hidden`
   globally, that hides content instead of fixing it. Find the actual
   offending element (a fixed pixel width, an image missing
   `max-width: 100%`, a negative margin, or `100vw` — which includes
   the scrollbar and overflows by its width). Fix the element, not the
   symptom.

2. **No broken links** — crawl every internal `href` programmatically
   (status-code check), don't click through manually. Check anchor
   links (`#section`) resolve to a real element, not just full URLs.
   External links can break outside your control — decide a periodic
   re-check cadence rather than treating this as a one-time fix.

3. **Mobile menu, done properly** — not just an open/close toggle:
   `aria-expanded` on the trigger button, focus trapped inside while
   open, closes on Escape and on outside click, focus returns to the
   trigger on close. A menu that opens but fails any of these is a
   half-built menu, not a done one.

4. **Real favicon set, not just `favicon.ico`** — 16×16 and 32×32 PNG,
   `apple-touch-icon` at 180×180, Android/manifest icons at 192×192 and
   512×512, and ideally an SVG favicon with light/dark variants via
   media query. Watch for browser favicon caching hiding an update —
   cache-bust the filename if a changed icon isn't showing.

5. **Unique, descriptive page titles** — every page distinct, under
   ~60 characters to avoid search-result truncation, brand placement
   consistent (`Page name | Brand`), no duplicate titles across pages.

6. **Real meta descriptions** — unique per page, 150–160 characters,
   actually describes that page's content (a mismatch here is itself an
   AI-footprint tell per `footprint-elimination`), includes a natural
   call to action, never keyword-stuffed.

7. **Footer links go somewhere real** — no `#` hrefs, legal links
   (privacy/terms) actually exist and match what `legal-compliance-copy`
   expects, social icons point to real active accounts, not placeholders
   left from a template.

8. **Custom 404 page** — matches the site's actual design, not the
   framework/server default, includes real navigation back to useful
   content (home, search), and logs 404 hits server-side so broken-link
   patterns get caught proactively instead of waiting for a user report.

9. **Dynamic copyright year** — `new Date().getFullYear()` or
   equivalent, never a hardcoded year that goes stale (already a rule in
   `footprint-elimination`'s assets section — this is the same check at
   launch time).

10. **Compressed, properly served images** — WebP/AVIF with a
    responsive `srcset`, explicit width/height to prevent layout shift,
    lazy-loading below the fold, real size budgets (e.g. a hero image
    under ~200KB), automated in the build pipeline rather than done
    manually per image so it doesn't regress on the next upload.

11. **Every button actually wired up** — no dead `onClick={() => {}}`
    left from scaffolding, real `<button>` elements (not a styled `div`
    with a click handler — that's a keyboard/screen-reader failure),
    loading and disabled states during any async action per
    `defensive-coding`.

12. **Success messages that confirm the specific action** — "Profile
    updated," not "Success" — per `conversion-onboarding-ux`'s
    microcopy rules, not a generic toast.

13. **Error messages that are specific and actionable** — what
    happened, why, what to do next; never a raw status code or stack
    trace reaching the user, per `security-hardening`'s error-handling
    rule.

14. **Zero placeholder text** — no lorem ipsum, no `[Company Name]`,
    no `[Insert X here]` anywhere in what's about to go live — this is
    the single most obvious "not actually finished" tell a visitor can
    catch.

15. **No unused/dead nav items** — remove links to pages that don't
    exist yet or point nowhere; don't ship a "Coming soon" nav item
    live unless it's a deliberate waitlist/teaser, in which case it
    should say so.

16. **No mobile overflow** — the mobile-specific version of check #1;
    verify at real narrow widths (320–375px), using an actual device or
    the browser's device toolbar, not just a shrunk desktop window.

17. **Logo always links home** — consistent position across every page,
    with an `aria-label="Home"` if the logo itself carries no visible
    text.

18. **Phone numbers are real `tel:` links** — canonical international
    format in the `href` (`tel:+233...`) regardless of how it's
    displayed to the user; `tel:` links are safe to leave active on
    desktop too (the browser just prompts or no-ops gracefully) — no
    need to conditionally hide them for non-mobile.

19. **Email addresses are real `mailto:` links** — with a pre-filled
    subject line where it helps the recipient triage. On a site with
    real spam-scraper risk, weigh a lightweight obfuscation approach or
    a contact form instead of a bare `mailto:` — a deliberate trade-off
    to name, not an oversight either way.

20. **Genuine mobile optimization, not just responsive breakpoints** —
    test on an actual device and a throttled connection, not only
    devtools emulation, since emulation doesn't always catch real touch
    behavior, real font rendering, or real network latency. Cross-check
    against `ui-ux-design`'s mobile-first section for the fuller rule
    set this check is the final verification of.

## Report format

```
[PASS/FAIL] #N check name — file:line (if applicable) — what's wrong / confirmation it's correct
```

Group failures by how quickly they're fixable — most of this list is
genuinely fast to fix, which is the point of running it as a distinct,
lightweight pass rather than folding it into the heavier `/ship` gate.
