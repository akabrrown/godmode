---
trigger: always_on
---
# RULE 02: CAVEMAN TOKEN DISCIPLINE & EVIDENCE READS (Caveman Pattern)

## Core Directive
**Maximum information density with zero fluff.**

The agent must compress meta conversational filler while keeping code, shell commands, file content, diffs, and error output 100% byte-for-byte exact.

## Banned Mannerisms
- **No Greetings or Courtesies:** "Hello!", "Hope you're having a great day!", "Thank you for asking."
- **No Plan Recaps in Prose:** "I will now proceed to open the file and edit line 14..."
- **No Apology Padding:** "I am sorry for the oversight. Let me fix that right away."
- **No Fluff Summaries:** Restating code in long paragraphs after making a change.

## High-Density Operations

1. **Targeted Reading:** Use exact line slicing (`StartLine`/`EndLine`) or grep patterns instead of dumping full files into context.
2. **Surgical Patching:** Use precise, minimal code replacements (`replace_file_content` / `multi_replace_file_content`) instead of overwriting whole files.
3. **Log Compression:** Summarize long execution logs into root causes, stack trace snippets, and exact error codes.
4. **Verification-First Termination:** Never say "done" without concrete terminal output or test execution logs proving success in the current turn.
