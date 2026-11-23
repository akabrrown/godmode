import os
import yaml
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_callout(doc, text, title=None):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=160)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:top w:val="none"/>'
        f'  <w:left w:val="single" w:sz="36" w:space="0" w:color="0A2540"/>'
        f'  <w:bottom w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    if title:
        run_title = p.add_run(f"{title}\n")
        run_title.bold = True
        run_title.font.name = "Segoe UI"
        run_title.font.size = Pt(10.5)
        run_title.font.color.rgb = RGBColor(10, 37, 64)
    run_text = p.add_run(text)
    run_text.font.name = "Segoe UI"
    run_text.font.size = Pt(9.5)
    run_text.font.color.rgb = RGBColor(51, 65, 85)
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def parse_skill_md(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1])
                return frontmatter.get('name', os.path.basename(os.path.dirname(file_path))), frontmatter.get('description', '')
    except Exception:
        pass
    name = os.path.basename(os.path.dirname(file_path))
    return name, "Specialized domain skill."

def build_document():
    doc = Document()
    
    # Page Setup: Letter, 0.75 in margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
    
    # ------------------ COVER / HEADER ------------------
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(10)
    title_p.paragraph_format.space_after = Pt(4)
    r_title = title_p.add_run("GODMODE OS: MASTER PRODUCTION AUDIT SPECIFICATION")
    r_title.bold = True
    r_title.font.name = "Segoe UI"
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = RGBColor(10, 37, 64) # Navy
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    r_sub = sub_p.add_run("Comprehensive Technical Registry of 301 Skills, 16 Operational Rules, 34 Workflows & Full-System Audit Execution Protocol")
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(11.5)
    r_sub.font.color.rgb = RGBColor(71, 85, 105)
    
    # Metadata Block
    meta_table = doc.add_table(rows=2, cols=3)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    meta_data = [
        [("System Version", "GODMODE OS v5.0 (Enterprise)"), ("Classification", "Production Standard / Strict Gate"), ("Audit Scope", "End-to-End Workspace & Live Runtime")],
        [("Total Verified Skills", "301 Codified Skills"), ("Operational Rules", "16 Strict Architectural Rules"), ("Lifecycle Workflows", "34 Automated Pipelines")]
    ]
    
    for r_idx, row in enumerate(meta_data):
        for c_idx, (label, val) in enumerate(row):
            cell = meta_table.cell(r_idx, c_idx)
            cell.width = Inches(2.3)
            set_cell_background(cell, "F8FAFC")
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            
            r_lbl = p.add_run(f"{label}: ")
            r_lbl.bold = True
            r_lbl.font.name = "Segoe UI"
            r_lbl.font.size = Pt(8.5)
            r_lbl.font.color.rgb = RGBColor(10, 37, 64)
            
            r_v = p.add_run(val)
            r_v.font.name = "Segoe UI"
            r_v.font.size = Pt(8.5)
            r_v.font.color.rgb = RGBColor(71, 85, 105)
            
    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ------------------ SECTION 1: MASTER PROMPT ------------------
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(4)
    r_h1 = h1.add_run("1. Master Full-System Production Audit Prompt")
    r_h1.bold = True
    r_h1.font.name = "Segoe UI"
    r_h1.font.size = Pt(15)
    r_h1.font.color.rgb = RGBColor(10, 37, 64)
    
    desc_p = doc.add_paragraph()
    desc_p.paragraph_format.space_before = Pt(0)
    desc_p.paragraph_format.space_after = Pt(6)
    r_desc = desc_p.add_run("Copy and execute the exact prompt below into your AI agent session (Antigravity, Claude Code, Cursor, or Terminal Agent) to trigger an uncompromising, end-to-end production audit against every rule, skill, and workflow.")
    r_desc.font.name = "Segoe UI"
    r_desc.font.size = Pt(9.5)
    
    master_prompt_text = (
        "ACTIVATE SUPREME PRODUCTION AUDITOR MODE — GODMODE FULL-SYSTEM PRODUCTION AUDIT PROTOCOL\n\n"
        "Execute a comprehensive, zero-assumption, evidence-first audit of this entire codebase and architecture against all GODMODE OS Rules, Skills, and Workflows.\n\n"
        "Audit Mandate & Verification Rules:\n"
        "1. Never assume or fabricate claims. Verify every file, route, query, and test empirically using CLI tools and file reads.\n"
        "2. Inspect the codebase across the 7 Production Dimensions:\n"
        "   - DIMENSION 1: ARCHITECTURE & HIGH-SCALE RESILIENCE (System capacity, connection pool formulas ((cores * 2) + spindles), Netflix Hystrix 3-state circuit breakers, sliding window rate limits, idempotency keys, CAP/PACELC trade-offs).\n"
        "   - DIMENSION 2: CODE QUALITY, TDD & ANTI-SLOP (Strict Red/Green TDD proof, DRY/YAGNI compliance, zero AI slop, zero narration comments, zero placeholder TODOs, zero generic variable names, handling of all 5 UI states: Loading, Empty, Error, Success, Offline).\n"
        "   - DIMENSION 3: SECURITY, AUTH & OWASP TOP 10 (Strict server-side record-level IDOR validation, parameter sanitization against SQLi/XSS, safe JWT/session handling, zero hardcoded secrets or leaked NEXT_PUBLIC_ keys, CORS headers, rate limiting on compute routes).\n"
        "   - DIMENSION 4: DATABASE & ORM OPTIMIZATION (3NF normalization, foreign key constraints, composite index strategies, EXPLAIN (ANALYZE, BUFFERS) query proof, replication lag mitigation with 2000ms sticky session pinning, connection leak protection).\n"
        "   - DIMENSION 5: WEB QUALITY & CORE WEB VITALS (LCP 4-phase optimization < 2.5s, INP LoAF < 200ms, zero layout shifts CLS < 0.1, WCAG 2.2 AA accessibility, semantic HTML, proper contrast ratios, image AVIF/WebP compression).\n"
        "   - DIMENSION 6: ZERO-COST CPU & RESOURCE GOVERNANCE (Edge CDN Cache-Control headers on read paths, Next.js ISR revalidation over expensive SSR, deduplication with React cache() and withInFlightLock, socket pooling with Keep-Alive).\n"
        "   - DIMENSION 7: DEVOPS, DEPLOYMENT & RELIABILITY (PM2 cluster mode with rolling reloads, graceful SIGTERM/SIGINT drain handling within 10s, automated zombie resource pruning, zero-trust network policies, comprehensive unit and E2E test coverage).\n\n"
        "Required Output Format:\n"
        "- Executive Production Scorecard (0–100% across all 7 dimensions with Go / No-Go Launch Verdict).\n"
        "- Skeptic Test Results (Audit for AI clichés and structural tells).\n"
        "- Production Test Results (Worst-case adversary exploitation analysis).\n"
        "- Concrete, file-by-file prioritized remediation plan with exact line references and byte-exact fixes."
    )
    add_callout(doc, master_prompt_text, title="EXACT COPY-PASTE AUDIT PROMPT")

    # ------------------ SECTION 2: OPERATIONAL RULES ------------------
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(4)
    r_h2 = h2.add_run("2. The 16 GODMODE Operational Rules (Supreme Directives)")
    r_h2.bold = True
    r_h2.font.name = "Segoe UI"
    r_h2.font.size = Pt(15)
    r_h2.font.color.rgb = RGBColor(10, 37, 64)
    
    rules_table = doc.add_table(rows=1, cols=3)
    rules_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rules_table.autofit = False
    
    hdr_cells = rules_table.rows[0].cells
    hdr_cells[0].width = Inches(1.8)
    hdr_cells[1].width = Inches(2.0)
    hdr_cells[2].width = Inches(3.2)
    
    for i, title in enumerate(["Rule Identifier", "Core Operational Focus", "Production Enforcement Mechanism"]):
        cell = hdr_cells[i]
        set_cell_background(cell, "0A2540")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        r = p.add_run(title)
        r.bold = True
        r.font.name = "Segoe UI"
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    rules_catalog = [
        ("00_rule_zero_pipelines.md", "Pipeline-Driven Architecture", "Multi-stage director execution; preflight audit and human signoff before code changes."),
        ("01_anti_rationalization_tdd.md", "Anti-Rationalization & Red/Green TDD", "Bans shortcuts; failing unit/integration test required before implementation; dual quality gates."),
        ("02_caveman_token_discipline.md", "Token Efficiency & Exact Reads", "High-density prose with 100% byte-exact code/diffs; zero fluff, zero apology padding."),
        ("03_tool_intent_telemetry.md", "Tool Intent Labels & Telemetry", "Natural language intent declaration before execution; outcome patch and cost tracking."),
        ("04_harness_subagents_memory.md", "Sub-Agent Harness & Sandboxing", "Sandboxed worker delegation; persistent memory indexing; manual context compaction."),
        ("ai-agents.md", "LLM Features & AI Agent Governance", "LiteLLM gateway routing; fallback cascades; semantic caching (>0.95 similarity); token limits."),
        ("architecture.md", "System Design & Distributed Scalability", "Capacity planning; CAP/PACELC trade-offs; Sagas vs 2PC; circuit breakers; consistent hashing."),
        ("backend-api.md", "Enterprise API Contracts", "REST/OpenAPI 3.1 specifications; RFC 7807 error responses; rate-limiting headers; idempotency keys."),
        ("cloud-and-devops.md", "Infrastructure, PM2 & Zero-Trust", "PM2 cluster mode; graceful SIGTERM drain; Cloud Custodian cost pruning; Cilium eBPF L7 mesh."),
        ("database.md", "Database Integrity & Connection Sizing", "3NF invariants; connection pool limit ((cores*2)+spindles); 2000ms replica lag session pinning."),
        ("frontend.md", "Resilient Production Frontend", "Five UI states mandatory (Loading, Empty, Error, Success, Offline); zero layout shifts; responsive UI."),
        ("git-review.md", "Version Control & Code Review", "Conventional commits; clean linear history; atomic commits; no secrets or artifacts in git."),
        ("performance.md", "Full-Stack Latency & Profiling", "OpenTelemetry tracing; Server-Timing headers; async-profiler flame graphs; connection reuse."),
        ("security.md", "OWASP Top 10 Defense & Auth Hardening", "Server-side IDOR validation; CSRF/CORS protection; zero client-exposed secrets; strict auth guards."),
        ("ui-ux-design.md", "UI/UX Anti-Slop & Polish", "Bans AI clichés (purple gradients, generic hero cards); purposeful typographic hierarchies; accessible tokens."),
        ("zero-cost-cpu-optimization.md", "Zero-Cost Cloud & CPU Governance", "Edge CDN caching; Next.js ISR revalidation; request deduplication; bot blocking; in-memory limits.")
    ]
    
    for r_idx, (r_id, r_focus, r_mech) in enumerate(rules_catalog):
        row_cells = rules_table.add_row().cells
        row_cells[0].width = Inches(1.8)
        row_cells[1].width = Inches(2.0)
        row_cells[2].width = Inches(3.2)
        bg_col = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for i, val in enumerate([r_id, r_focus, r_mech]):
            cell = row_cells[i]
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Segoe UI"
            r.font.size = Pt(8.5)
            if i == 0:
                r.bold = True
                r.font.color.rgb = RGBColor(10, 37, 64)
            else:
                r.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ------------------ SECTION 3: WORKFLOWS REGISTRY ------------------
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(4)
    r_h3 = h3.add_run("3. The 34 GODMODE Lifecycle Workflows")
    r_h3.bold = True
    r_h3.font.name = "Segoe UI"
    r_h3.font.size = Pt(15)
    r_h3.font.color.rgb = RGBColor(10, 37, 64)
    
    wf_table = doc.add_table(rows=1, cols=3)
    wf_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    wf_table.autofit = False
    
    w_hdr = wf_table.rows[0].cells
    w_hdr[0].width = Inches(1.8)
    w_hdr[1].width = Inches(1.8)
    w_hdr[2].width = Inches(3.4)
    
    for i, title in enumerate(["Workflow File", "Trigger / Command", "Operational Pipeline Scope"]):
        cell = w_hdr[i]
        set_cell_background(cell, "0A2540")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        r = p.add_run(title)
        r.bold = True
        r.font.name = "Segoe UI"
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    wf_catalog = [
        ("godmode_build.md", "/godmode-build", "Autonomous multi-stage software engineering: Red/Green TDD, implementation, and verification."),
        ("godmode_design.md", "/godmode-design", "Anti-slop UI/UX overhaul: visual tokens, layout differentiation, and responsive components."),
        ("godmode_market.md", "/godmode-market", "Technical product marketing: positioning, CRO audit, programmatic SEO, and pricing matrices."),
        ("godmode_research.md", "/godmode-research", "Deep research: DeerFlow academic literature survey, repository intelligence, and synthesis."),
        ("system-design.md", "/system-design", "Capacity estimation, QPS, 5-year storage sizing, CAP/PACELC trade-offs, and microservice seams."),
        ("load-test.md", "/load-test", "Automated k6 & Artillery stress testing: ramp stages, latency percentiles, and SLO gating."),
        ("web-quality.md", "/web-quality", "Lighthouse 13+, Core Web Vitals (LCP, INP, CLS), WCAG 2.2 AA accessibility, and SEO audit."),
        ("design-plan.md", "/design-plan", "Design token architecture: typography pairings, color systems, and UI component specifications."),
        ("design-review.md", "/design-review", "7-phase UI/UX audit: layout stability, anti-slop check, responsive inspection, and WCAG proof."),
        ("full-audit.md", "/full-audit", "Comprehensive multi-dimension system audit across architecture, code, security, and performance."),
        ("e2e-test-strategy.md", "/e2e-test-strategy", "Playwright test planning: critical user journey mapping, risk matrix, and flaky test elimination."),
        ("prod-security-audit.md", "/security-audit", "Automated OWASP Top 10 penetration audit, IDOR verification, header inspection, and secret scans."),
        ("db-migration.md", "/db-migration", "Zero-downtime database migration: expand-and-contract schema changes, backfill, and rollback proof."),
        ("release-check.md", "/release-check", "Production readiness gate: test suite green check, type check, build check, and zero-debt audit."),
        ("clean-architecture-rebuild.md", "/clean-rebuild", "Safe refactor of legacy systems into clean hexagonal/domain-driven architectures."),
        ("launch-qa.md", "/launch-qa", "Pre-launch QA smoke test matrix: happy path, edge cases, error handling, and billing flows."),
        ("devops-deploy.md", "/devops-deploy", "Zero-downtime deployment: container orchestration, PM2 cluster rollout, and health check monitoring."),
        ("performance-optimize.md", "/perf-optimize", "Deep performance tuning: query index optimization, bundle splitting, memory leak resolution."),
        ("perf-audit.md", "/perf-audit", "Backend and frontend latency profiling: flame graphs, database bottlenecks, and payload pruning."),
        ("new-endpoint.md", "/new-endpoint", "Contract-first API endpoint implementation: OpenAPI 3.1 spec, Zod validation, and TDD route tests."),
        ("security-assessment.md", "/sec-assess", "Threat modeling and attack surface mapping for external APIs and authentication endpoints."),
        ("seo-audit.md", "/seo-audit", "Technical search engine optimization: sitemaps, robots.txt, schema.org JSON-LD, Core Web Vitals."),
        ("codebase-audit.md", "/codebase-audit", "Static analysis and architectural health check across modules, technical debt, and test coverage."),
        ("production-debug.md", "/prod-debug", "Root cause incident diagnosis: log correlation, distributed trace inspection, and surgical fix."),
        ("pre-merge.md", "/pre-merge", "Strict pre-merge gate: lint, type-check, unit tests, integration tests, and skeptic code review."),
        ("spec-suite.md", "/spec-suite", "Behavior-driven specification authoring before feature development begins."),
        ("adr.md", "/adr", "Architectural Decision Record generation: context, alternatives considered, trade-offs, consequences."),
        ("backend-architect.md", "/backend-arch", "Service boundary design, domain entity modeling, and event-driven messaging topologies."),
        ("frontend-engineer.md", "/frontend-eng", "Production frontend engineering: accessible components, optimistic UI, state synchronization."),
        ("mvp-architect.md", "/mvp-arch", "Lean MVP scoping: high-impact core feature definition with explicit anti-overbuilding gates."),
        ("lessons-review.md", "/lessons-review", "Engineering retrospective and failure analysis: post-mortem synthesis into persistent rules."),
        ("log-lesson.md", "/log-lesson", "Record technical discovery or bug root cause into workspace persistent memory."),
        ("technical-lead-mode.md", "/tech-lead", "Senior technical lead perspective: trade-off evaluation, code quality enforcement, architectural oversight."),
        ("security-audit.md", "/sec-audit", "Security audit workflow executing vulnerability scans, authorization checks, and dependency audits.")
    ]
    
    for r_idx, (w_file, w_cmd, w_scope) in enumerate(wf_catalog):
        row_cells = wf_table.add_row().cells
        row_cells[0].width = Inches(1.8)
        row_cells[1].width = Inches(1.8)
        row_cells[2].width = Inches(3.4)
        bg_col = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for i, val in enumerate([w_file, w_cmd, w_scope]):
            cell = row_cells[i]
            set_cell_background(cell, bg_col)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Segoe UI"
            r.font.size = Pt(8.5)
            if i == 0:
                r.bold = True
                r.font.color.rgb = RGBColor(10, 37, 64)
            elif i == 1:
                r.font.color.rgb = RGBColor(30, 58, 138)
            else:
                r.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # ------------------ SECTION 4: MASTER SKILLS INVENTORY ------------------
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(4)
    r_h4 = h4.add_run("4. Master Inventory of All 301 Codified Skills")
    r_h4.bold = True
    r_h4.font.name = "Segoe UI"
    r_h4.font.size = Pt(15)
    r_h4.font.color.rgb = RGBColor(10, 37, 64)
    
    skills_intro = doc.add_paragraph()
    skills_intro.paragraph_format.space_before = Pt(0)
    skills_intro.paragraph_format.space_after = Pt(6)
    r_si = skills_intro.add_run("All 301 skills are indexed in the GODMODE SkillRegistry. Below is the complete catalog, organized into 10 cohesive architectural domains for structured inspection.")
    r_si.font.name = "Segoe UI"
    r_si.font.size = Pt(9.5)
    
    # Read all skills from .agents/skills
    skills_dir = os.path.abspath(".agents/skills")
    skill_folders = sorted([f for f in os.listdir(skills_dir) if os.path.isdir(os.path.join(skills_dir, f))])
    
    all_skills_data = []
    for sf in skill_folders:
        skill_path = os.path.join(skills_dir, sf, "SKILL.md")
        name, desc = parse_skill_md(skill_path)
        all_skills_data.append((name, desc))

    # Categorize skills into 10 domains
    def categorize_skill(name, desc):
        n = name.lower()
        d = desc.lower()
        if any(k in n for k in ['database', 'postgres', 'sql', 'orm', 'prisma', 'drizzle', 'db', 'shard', 'schema', 'catbox', 'redis', 'replica', 'buntdb', 'qdrant', 'seaweedfs']):
            return "Domain 1: Database, Caching & Distributed Storage"
        elif any(k in n for k in ['system-design', 'scalability', 'resilience', 'queue', 'kafka', 'message', 'eureka', 'circuit', 'rate-limit', 'fault', 'concurrency']):
            return "Domain 2: Distributed Architecture, Queues & Concurrency"
        elif any(k in n for k in ['security', 'auth', 'audit', 'secret', 'hardening', 'owasp', 'mesh', 'nebula', 'cilium', 'arkime']):
            return "Domain 3: Security, Authentication & Zero-Trust Mesh"
        elif any(k in n for k in ['observability', 'profiling', 'trace', 'metric', 'apm', 'jaeger', 'telemetry', 'benchmark', 'load-test', 'flame', 'k6', 'artillery', 'gatling']):
            return "Domain 4: Observability, Profiling & Performance Testing"
        elif any(k in n for k in ['web-quality', 'vitals', 'lighthouse', 'seo', 'accessibility', 'a11y', 'cwv', 'lcp', 'inp', 'cls']):
            return "Domain 5: Web Quality, Core Web Vitals & SEO"
        elif any(k in n for k in ['ui', 'ux', 'taste', 'design', 'tailwind', 'component', 'frontend', 'motion', 'gsap', 'framer', 'brutalist', 'minimalist', 'threejs', 'canvas', 'svg']):
            return "Domain 6: Frontend Engineering & Anti-Slop UI/UX"
        elif any(k in n for k in ['cloud', 'devops', 'pm2', 'docker', 'deploy', 'vercel', 'aws', 'cloudflare', 'custodian', 'ubicloud', 'ci-cd']):
            return "Domain 7: Cloud Infrastructure, DevOps & Process Management"
        elif any(k in n for k in ['ai-agent', 'mcp', 'deep-research', 'litellm', 'rag', 'context', 'token', 'caveman', 'compress', 'prompt', 'subagent']):
            return "Domain 8: AI Agents, MCP Tools & Context Engineering"
        elif any(k in n for k in ['video', 'media', 'audio', 'tts', 'speech', 'music', 'remotion', 'ffmpeg', 'image', 'hyperframes', 'elevenlabs', 'heygen', 'kling', 'flux']):
            return "Domain 9: Multimodal Media, Audio & Video Synthesis"
        else:
            return "Domain 10: Technical Marketing, Growth & Software Engineering"

    categorized = {}
    for s_name, s_desc in all_skills_data:
        dom = categorize_skill(s_name, s_desc)
        if dom not in categorized:
            categorized[dom] = []
        categorized[dom].append((s_name, s_desc))

    for dom_name in sorted(categorized.keys()):
        skills_in_dom = categorized[dom_name]
        
        dh = doc.add_paragraph()
        dh.paragraph_format.space_before = Pt(12)
        dh.paragraph_format.space_after = Pt(3)
        r_dh = dh.add_run(f"{dom_name} ({len(skills_in_dom)} Skills)")
        r_dh.bold = True
        r_dh.font.name = "Segoe UI"
        r_dh.font.size = Pt(12)
        r_dh.font.color.rgb = RGBColor(30, 58, 138)
        
        t = doc.add_table(rows=1, cols=2)
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        t.autofit = False
        
        t_hdr = t.rows[0].cells
        t_hdr[0].width = Inches(2.2)
        t_hdr[1].width = Inches(4.8)
        
        for i, title in enumerate(["Skill Name", "Capability & Focus"]):
            cell = t_hdr[i]
            set_cell_background(cell, "1E3A8A")
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            p = cell.paragraphs[0]
            r = p.add_run(title)
            r.bold = True
            r.font.name = "Segoe UI"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(255, 255, 255)
            
        for s_idx, (s_name, s_desc) in enumerate(skills_in_dom):
            row_cells = t.add_row().cells
            row_cells[0].width = Inches(2.2)
            row_cells[1].width = Inches(4.8)
            bg_col = "F8FAFC" if s_idx % 2 == 0 else "FFFFFF"
            
            # Name
            c0 = row_cells[0]
            set_cell_background(c0, bg_col)
            set_cell_margins(c0, top=50, bottom=50, left=80, right=80)
            p0 = c0.paragraphs[0]
            p0.paragraph_format.space_before = Pt(0)
            p0.paragraph_format.space_after = Pt(0)
            r0 = p0.add_run(s_name)
            r0.bold = True
            r0.font.name = "Segoe UI"
            r0.font.size = Pt(8)
            r0.font.color.rgb = RGBColor(10, 37, 64)
            
            # Desc
            c1 = row_cells[1]
            set_cell_background(c1, bg_col)
            set_cell_margins(c1, top=50, bottom=50, left=80, right=80)
            p1 = c1.paragraphs[0]
            p1.paragraph_format.space_before = Pt(0)
            p1.paragraph_format.space_after = Pt(0)
            clean_desc = (s_desc[:140] + "...") if len(s_desc) > 140 else s_desc
            r1 = p1.add_run(clean_desc)
            r1.font.name = "Segoe UI"
            r1.font.size = Pt(8)
            r1.font.color.rgb = RGBColor(71, 85, 105)
            
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ------------------ SECTION 5: GOVERNANCE ------------------
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(14)
    h5.paragraph_format.space_after = Pt(4)
    r_h5 = h5.add_run("5. Production Verification & Go/No-Go Gate Standards")
    r_h5.bold = True
    r_h5.font.name = "Segoe UI"
    r_h5.font.size = Pt(15)
    r_h5.font.color.rgb = RGBColor(10, 37, 64)
    
    gov_text = (
        "THE DUAL QUALITY GATE — NON-NEGOTIABLE LAUNCH PREREQUISITES\n\n"
        "1. THE SKEPTIC TEST:\n"
        "   - Would a principal engineer, creative director, or security reviewer suspect automated AI generation?\n"
        "   - Zero AI clichés survive: no uncalibrated neon purple/violet gradients, no generic three-column cards, no boilerplate greeting text, no placeholder narration comments, no uniform commit timestamps.\n\n"
        "2. THE PRODUCTION TEST:\n"
        "   - If a malicious adversary or load surge hits the system with full source visibility, what is the worst consequence?\n"
        "   - Every protected mutation is authorized server-side against exact record IDs (IDOR immunity).\n"
        "   - All 5 UI states are cleanly rendered without flashes or layout shifts (Loading, Empty, Error, Success, Offline).\n"
        "   - All database queries run bounded connection pools with index backing; zero unindexed full-table scans.\n"
        "   - Client AND server validate all inputs; zero unhandled promise rejections or unmonitored exceptions.\n"
        "   - The automated test suite must run clean with 100% passing tests before any release is approved."
    )
    add_callout(doc, gov_text, title="DUAL QUALITY GATE & PRODUCTION VERDICT CRITERIA")

    out_path = os.path.abspath("GODMODE_OS_Master_Production_Audit_Specification.docx")
    doc.save(out_path)
    print(f"SUCCESS: Document saved to {out_path} ({len(all_skills_data)} skills, {len(rules_catalog)} rules, {len(wf_catalog)} workflows)")

if __name__ == "__main__":
    build_document()
