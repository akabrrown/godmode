---
name: godmode-token-compression
description: Token efficiency, context compaction, evidence-first reads, surgical patching, and diff optimization derived from caveman.
---

# GODMODE Token Compression & Context Discipline

## Overview
Applies Julius Brussee's `caveman` token-efficiency principles to keep agent memory clean, context sizes small, and response speeds ultra-fast without sacrificing precise code execution.

## Core Compression Techniques

1. **Precision Slice Viewing:** Never view entire 2,000-line files when fixing a 5-line bug. Use line-budgeted `view_file` calls with exact `StartLine` and `EndLine`.
2. **Targeted Code Replacements:** Use `replace_file_content` with exact matching chunks instead of overwriting whole files.
3. **Log & Trace Summarization:** Strip unneeded verbose stack traces. Extract the exact failing assertion, error code, and file location.
4. **Context Compaction:** Periodically summarize conversation context into memory state, clearing out transient file reads while retaining active variables, routes, and pending tasks.
5. **No AI Conversational Filler:** Deliver direct, high-density responses. Eliminate greetings, apology padding, and repetitive step-by-step narration.
