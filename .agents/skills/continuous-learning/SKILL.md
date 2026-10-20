---
name: continuous-learning
description: Use whenever a real mistake, missed step, wrong assumption, or bug root cause is identified — via debugging, an audit/review workflow, or an explicit correction from the person — to record it so it doesn't repeat on a future project. Also use before starting a new project, before touching auth/payments/data, or before a final ship review, to check whether a relevant past mistake was already recorded. This is the mechanism that makes this whole config improve from real experience instead of staying static.
---

# Continuous learning — a persistent mistake log across all projects

Skills and rules in this config are static files — they don't
automatically remember what went wrong on the last project. This skill
is the mechanism that closes that gap: a real file on disk that gets
written to when a mistake is found, and read before work that could
repeat it. It only works if both halves actually happen — logging
without consulting is a diary nobody reads; consulting without logging
has nothing to find.

## The file

**Location:** `~/.gemini/antigravity/lessons-learned.md` (global scope
— this is deliberate; a lesson learned on one project should protect
every other project, not just the one where it was found). If it
doesn't exist yet, create it with this structure before the first entry:

```markdown
# Lessons Learned — cross-project mistake log

Entries are appended below, newest first. Each entry: date, tags
(matching this config's skill names where possible), what happened, root
cause, the fix applied, and a prevention rule phrased as an actionable
instruction. Entries promoted into a permanent skill/rule change are
marked [PROMOTED] rather than deleted.

---
```

**Entry format:**

```markdown
## [YYYY-MM-DD] Short title
**Tags:** security-hardening, defensive-coding
**Project:** (name, or "general" if not project-specific)
**What happened:** the mistake or missed step, stated plainly
**Root cause:** the actual mechanism (per `debugging-protocol`'s
standard — not a guess)
**Fix applied:** what was changed
**Prevention rule:** an imperative sentence — "Always check X before Y"
— written so it can be checked against future work directly, not just
read as a story
```

## When to log an entry

- After `/debug` or `debugging-protocol` confirms a root cause that
  wasn't already caught by an existing rule in this config — the gap
  itself is the lesson, not just the bug.
- After `/full-audit`, `/security-assessment`, `/prod-security-audit`,
  `/codebase-audit`, or `/launch-qa` surfaces a finding of a kind not
  named anywhere in the current skill set.
- Whenever the person explicitly flags a repeat mistake ("you did this
  wrong before," "you missed this again") — log it immediately, don't
  wait for a natural checkpoint.
- When `quota-efficient-execution`'s stop-and-ask rule triggers after a
  failed approach — the wrong initial assumption is worth recording,
  not just the eventual fix.
- Anything genuinely project-specific (a quirk of one codebase's
  legacy conventions) still gets logged, tagged with that project name,
  but isn't a candidate for promotion (below) — it's useful only if
  that specific project resurfaces.

## When to consult it — before, not after

- Before `/mvp-architect`, `/backend-architect`, or
  `/clean-architecture-rebuild` — search for entries tagged with the
  relevant domain (auth, payments, the specific stack) before designing
  anything.
- Before any work that would trigger `security-hardening` or
  `defensive-coding` — check for past entries tagged the same way; a
  recorded lesson here is exactly the kind of thing worth re-checking
  before writing the same class of code again.
- Before `/ship` or `production-readiness-gate` — check for unresolved
  entries relevant to the current project that haven't actually been
  verified fixed yet.
- If a search of the file turns up nothing relevant, say so briefly and
  continue — this is a quick check, not a ceremony (ties to
  `quota-efficient-execution`: don't turn a lookup into a production).

## Promotion — turning a repeated lesson into a permanent fix

A log entry is passive: it only helps if someone remembers to check it.
A skill/rule update is active: it applies automatically every time that
skill loads. If the same category of mistake shows up **twice** across
different projects, that's the signal to stop treating it as a log
entry and instead propose an actual edit to the relevant skill or to
`GEMINI.md` — the same way this config has grown throughout this whole
project. Mark the log entry `[PROMOTED]` once the permanent change is
made; don't delete it, since the history of why a rule exists has its
own value.

This is the real point of this skill: not an ever-growing diary, but a
feedback loop where recurring mistakes actually get engineered out of
the config, not just remembered harder.

## Anti-bloat discipline

Don't let this file grow unbounded. Periodically (see the
`/lessons-review` workflow): dedupe near-identical entries, consolidate
several small entries on the same theme into one, and archive
`[PROMOTED]` entries older than a few months into a separate
`lessons-learned-archive.md` so the active file stays fast to search.
This ties directly to `quota-efficient-execution` — a bloated log that
takes real context to read defeats its own purpose.

## Honest limitation

This is on-disk memory the agent explicitly maintains, not automatic
recall — it does nothing unless the logging and consulting habits above
actually run. It also doesn't replace project-specific documentation;
a lesson that's purely about one codebase's own conventions belongs in
that project's own docs too, not only in this global file.

## Commands

`/log-lesson [description]` — record a new entry right now, in the
format above.
`/check-lessons [topic]` — search the file for entries relevant to a
topic before starting related work.
`/lessons-review` — run the anti-bloat maintenance pass and propose
any entries that have hit the promotion threshold.
