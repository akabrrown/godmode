---
name: godmode-software-engineering
description: Unified software engineering lifecycle skill combining Red/Green TDD, YAGNI, DRY, incremental implementation, code simplification, security hardening, and production readiness gates.
---

# GODMODE Software Engineering

## Overview
Synthesizes the software engineering lifecycles from Addy Osmani's `agent-skills`, Jesse Vincent's `superpowers`, ByteDance's `deer-flow`, and `antigravity-config-v2` into an bulletproof engineering system.

## Lifecycle Execution Stages

### 1. DEFINE (Specification & Architecture)
- Tease out requirements before writing any code.
- Define exact inputs, outputs, error conditions, and API contracts.
- Document architectural trade-offs explicitly.

### 2. PLAN (Bite-Sized Task Breakdown)
- Break execution into small, independent sub-tasks. Each task must take under 10 minutes to execute.
- Order dependencies logically (database → services → controllers → UI/client).

### 3. BUILD (Strict Red/Green TDD + YAGNI + DRY)
- Write a failing unit or integration test first. Confirm failure in terminal output.
- Write minimal production code to pass the test.
- Refactor code for DRY (Don't Repeat Yourself) and YAGNI (You Aren't Gonna Need It).

### 4. VERIFY (Error Recovery & Edge Case Testing)
- Verify all 5 UI/data states: **Loading**, **Empty**, **Error**, **Success**, **Offline**.
- Validate client-side and server-side inputs. Ensure all DB operations enforce server-side authorization against record IDs.

### 5. REVIEW (Code Simplification & Security Audit)
- Perform code simplification: remove unused code, dead imports, and boilerplate.
- Execute security audit: check for OWASP Top 10, IDOR, SQL injection, XSS, CSRF, and secret exposure.

### 6. SHIP (Production Readiness Gate)
- Run type-checker, linter, and full test suite.
- Verify zero AI Tells in comments, commit messages, or code structure.
