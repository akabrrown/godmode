# log-lesson.md — global workflow

Trigger: `/log-lesson [description]`

## What this does

Records a mistake, missed step, or wrong assumption into the persistent
`~/.gemini/antigravity/lessons-learned.md` file, per `continuous-learning`'s
format. Use this the moment a real mistake is caught — right after a
debugging session, an audit finding, or a direct correction — rather
than trusting it'll get logged "later."

## Process

1. Load `continuous-learning`. If the lessons file doesn't exist yet,
   create it with the header template from that skill before adding the
   first entry.
2. If the description given is enough to fill every field (what
   happened, root cause, fix, prevention rule), write the entry
   directly. If root cause isn't actually confirmed yet, run
   `debugging-protocol` first — don't log a guessed root cause as if it
   were confirmed.
3. Tag the entry with the relevant skill name(s) from this config
   (`security-hardening`, `defensive-coding`, `ui-ux-design`, etc.) so
   it's findable later by `/check-lessons`.
4. Append the entry to the file, newest first, without disturbing
   existing entries.
5. Check whether this exact category of mistake already has an entry
   from a different project. If so, this is now a **second occurrence**
   — flag it as a promotion candidate per `continuous-learning`'s
   promotion rule, and ask whether to propose the permanent skill/rule
   edit now rather than log a third passive entry later.

## Report

Confirm the entry was written (or updated, if promoted), with the tags
used and whether this is a first occurrence or a promotion candidate.
