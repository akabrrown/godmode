# lessons-review.md — global workflow

Trigger: `/lessons-review`

## What this does

Periodic maintenance pass over `~/.gemini/antigravity/lessons-learned.md`
— run this monthly, or after finishing a project, so the file stays a
genuinely useful reference instead of an ever-growing wall of text
nobody actually reads before starting work.

## Process

1. Load `continuous-learning` and read the full lessons file.
2. **Deduplicate** — merge near-identical entries (same root cause,
   different projects) into one entry with multiple project tags,
   rather than leaving repeats.
3. **Find promotion candidates** — any category of mistake appearing
   twice or more across different projects gets flagged. For each:
   propose the specific permanent edit (which skill file, which
   section, what the new rule text should say) rather than just noting
   "this recurred."
4. **Archive** — entries already marked `[PROMOTED]` and older than a
   few months move to `lessons-learned-archive.md`, keeping the active
   file fast to search. Never delete history outright.
5. **Sanity-check tags** — confirm every entry's tags still match real
   skill names in this config; if a referenced skill was since renamed
   or merged, update the tag rather than leaving a dead reference.

## Report

- Entries before / after this pass
- Duplicates merged
- Promotion candidates found, each with a proposed concrete edit —
  present these for approval before actually editing any skill file
- Entries archived

This workflow doesn't apply any promotion edits on its own — it
proposes them. Confirm before touching a skill file, per the same
audit-then-confirm pattern as `/full-audit` and `/security-assessment`.
