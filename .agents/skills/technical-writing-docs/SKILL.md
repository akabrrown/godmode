---
name: technical-writing-docs
description: Write and review technical documentation - developer docs, API references, tutorials, how-to guides, READMEs, release notes, FAQs, troubleshooting, whitepapers, and technical blog/SEO content. Use when asked to document code or an API, write a README or user guide, improve clarity of docs, write release notes, or plan technical content.
---
# Technical writing

## Know the reader
Define the persona, their goal, prior knowledge, and the task they are trying to finish. Write for that person, not for yourself. One document = one purpose.

## Pick the right type (Diataxis-style)
Tutorial (learning by doing, guaranteed success) | How-to guide (solve a specific task) | Reference (accurate, complete, scannable: API, config, CLI) | Explanation (why/concepts/architecture). Also: README, quickstart, FAQ, troubleshooting (symptom -> cause -> fix), release notes (what changed for the user, breaking changes first), runbooks.

## Style rules
Plain language; short sentences; active voice; present tense; imperative steps; one idea per paragraph; define terms once and use consistently; avoid filler and marketing in reference docs; numbered steps for sequences, bullets for sets; headings that describe content; code samples that run, with expected output; consistent naming and formatting; inclusive language; follow a style guide (Google/Microsoft or the project's own).

## Structure
Title -> one-line summary -> prerequisites -> steps/content -> verification -> next steps/links. Put the most important information first. Cross-link, do not duplicate. Add an overview and a table of contents for long docs.

## API docs
For each endpoint: purpose, method + path, auth, parameters (type, required, default, constraints), request and response examples, error codes, rate limits, versioning notes, and a copy-paste curl example. Generate from OpenAPI where possible and keep examples tested.

## Process
Research (talk to engineers, run the product yourself) -> outline -> draft -> technical review -> edit for clarity -> test every step and snippet -> publish (docs-as-code: Markdown in Git, PR review, CI link checks, versioned docs; Docusaurus/MkDocs/VitePress) -> measure (search terms, feedback, support tickets) -> maintain (date or version content; remove stale pages).

## Content marketing/SEO (when asked)
Map content to the funnel (top: awareness, mid: comparison/how-to, bottom: case studies/docs), research keywords and intent, strong titles, headers, meta description, OpenGraph data, canonical links, internal links, clear CTA, track conversions.

## Quality check
Can a newcomer complete the task using only this page? Are all commands tested? Any undefined term, missing prerequisite, or ambiguous pronoun?
