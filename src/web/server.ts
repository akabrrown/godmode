import http, { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';
import { SkillRegistry } from '../registry/skills.js';
import { WorkflowRegistry } from '../registry/workflows.js';
import { WorkspaceBridge } from '../bridge/workspace.js';
import { TelemetryManager } from '../telemetry/intent.js';
import { PipelineRunner, type PipelineCommand } from '../pipeline/runner.js';

export interface GodmodeWebServerOptions {
  port: number;
  skillRegistry: SkillRegistry;
  workflowRegistry: WorkflowRegistry;
  bridge: WorkspaceBridge;
  telemetry: TelemetryManager;
  runner: PipelineRunner;
}

export class GodmodeWebServer {
  private port: number;
  private server: http.Server | null = null;
  private skillRegistry: SkillRegistry;
  private workflowRegistry: WorkflowRegistry;
  private bridge: WorkspaceBridge;
  private telemetry: TelemetryManager;
  private runner: PipelineRunner;

  constructor(options: GodmodeWebServerOptions) {
    this.port = options.port;
    this.skillRegistry = options.skillRegistry;
    this.workflowRegistry = options.workflowRegistry;
    this.bridge = options.bridge;
    this.telemetry = options.telemetry;
    this.runner = options.runner;
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = http.createServer(async (req, res) => {
        try {
          await this.handleRequest(req, res);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: msg }));
        }
      });

      this.server.listen(this.port, '0.0.0.0', () => {
        resolve();
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method?.toUpperCase() || 'GET';

    // CORS headers for local integration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // 1. Root: Web Dashboard
    if (pathname === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(this.renderDashboardHtml());
      return;
    }

    // 2. API: Status
    if (pathname === '/api/status' && method === 'GET') {
      const skills = this.skillRegistry.getAllSkills();
      const workflows = this.workflowRegistry.getAllWorkflows();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          status: 'OPERATIONAL',
          version: '1.0.0',
          skillsCount: skills.length,
          workflowsCount: workflows.length,
          activePipelines: this.runner.getAllPipelines().length,
          timestamp: new Date().toISOString(),
        })
      );
      return;
    }

    // 3. API: Skills
    if (pathname === '/api/skills' && method === 'GET') {
      const query = parsedUrl.searchParams.get('query') || '';
      const skills = query
        ? this.skillRegistry.search(query)
        : this.skillRegistry.getAllSkills();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(skills));
      return;
    }

    // 4. API: Workflows
    if (pathname === '/api/workflows' && method === 'GET') {
      const query = parsedUrl.searchParams.get('query') || '';
      const workflows = query
        ? this.workflowRegistry.search(query)
        : this.workflowRegistry.getAllWorkflows();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(workflows));
      return;
    }

    // 5. API: Projects
    if (pathname === '/api/projects' && method === 'GET') {
      const projects = await this.bridge.listProjects();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(projects));
      return;
    }

    // 6. API: Pipelines (POST)
    if (pathname === '/api/pipelines' && method === 'POST') {
      const body = await this.readJsonBody(req);
      const command = (body.command || 'build') as PipelineCommand;
      const targetProject = String(body.targetProject || '.');
      const taskDescription = String(body.taskDescription || 'Autonomous Studio Run');

      const manifest = this.runner.createPipeline({
        command,
        targetProject,
        taskDescription,
      });

      // Advance through stages asynchronously
      await this.runner.executePreflight(manifest.pipelineId);
      await this.runner.executeDiscovery(manifest.pipelineId);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(manifest));
      return;
    }

    // 7. API: Real-time Telemetry SSE Stream
    if (pathname === '/api/telemetry/stream' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      res.write(`data: ${JSON.stringify({ type: 'connected', time: Date.now() })}\n\n`);

      const unsubscribe = this.telemetry.subscribe((event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      });

      req.on('close', () => {
        unsubscribe();
      });
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }

  private readJsonBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(new Error('Invalid JSON payload'));
        }
      });
      req.on('error', reject);
    });
  }

  private renderDashboardHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GODMODE OS — Autonomous AI Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090a0f;
      --surface: #11131a;
      --surface-elevated: #181b24;
      --border: #1e2230;
      --border-focus: #3b82f6;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --success: #10b981;
      --warning: #f59e0b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
    }
    .badge {
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.3);
      font-family: 'JetBrains Mono', monospace;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 10px var(--success);
    }
    main {
      flex: 1;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 24px;
    }
    .studio-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .tabs {
      display: flex;
      gap: 8px;
      background: var(--bg);
      padding: 4px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .tab-btn {
      flex: 1;
      padding: 8px 14px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      font-weight: 500;
      font-size: 0.88rem;
      transition: all 0.15s ease;
    }
    .tab-btn.active {
      background: var(--surface-elevated);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    label {
      font-size: 0.82rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    select, textarea, input {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
      color: var(--text);
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.15s ease;
    }
    select:focus, textarea:focus, input:focus {
      border-color: var(--border-focus);
    }
    textarea { min-height: 110px; resize: vertical; }
    .btn-run {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 14px 20px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      transition: background 0.15s ease;
    }
    .btn-run:hover { background: #1d4ed8; }
    .console-panel {
      background: #0d0e14;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      height: 280px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .telemetry-item {
      padding: 6px 10px;
      border-radius: 4px;
      border-left: 3px solid var(--accent);
      background: rgba(56, 189, 248, 0.05);
      line-height: 1.4;
    }
    .telemetry-outcome {
      border-left-color: var(--success);
      background: rgba(16, 185, 129, 0.05);
    }
    .sidebar-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .skill-list {
      max-height: 500px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .skill-card {
      padding: 10px 12px;
      border-radius: 6px;
      background: var(--surface-elevated);
      border: 1px solid var(--border);
      font-size: 0.85rem;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    .skill-card:hover { border-color: var(--accent); }
    .skill-title { font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
    .skill-desc { color: var(--text-muted); font-size: 0.75rem; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="status-dot"></div>
      <span>GODMODE OS</span>
      <span class="badge">v1.0.0</span>
    </div>
    <div style="display: flex; gap: 16px; align-items: center;">
      <span class="badge" id="skillsBadge">289 Skills</span>
      <span class="badge">30 Workflows</span>
      <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border-color: var(--success);">ONLINE</span>
    </div>
  </header>

  <main>
    <section class="studio-panel">
      <div class="tabs">
        <button class="tab-btn active" onclick="setStudio('build', this)">Dev Studio (/build)</button>
        <button class="tab-btn" onclick="setStudio('media', this)">Media Studio (/media)</button>
        <button class="tab-btn" onclick="setStudio('research', this)">Research Engine (/research)</button>
        <button class="tab-btn" onclick="setStudio('market', this)">Growth Studio (/market)</button>
      </div>

      <div class="form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <label style="margin-bottom: 0;">Target Project</label>
          <button type="button" id="togglePathBtn" onclick="togglePathMode()" style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); color: var(--accent); cursor: pointer; font-size: 0.75rem; font-family: inherit; font-weight: 500; border-radius: 4px; padding: 2px 8px; transition: all 0.15s ease;">
            Custom Path ✏️
          </button>
        </div>

        <div id="selectProjectContainer" style="display: flex; flex-direction: column; gap: 8px;">
          <input type="text" id="projectSearchInput" placeholder="Quick search projects in PROjects/..." oninput="filterProjects()" style="padding: 8px 12px; font-size: 0.85rem;" />
          <select id="projectSelect" size="5" style="height: auto; max-height: 140px; overflow-y: auto;">
            <option value="." selected>Current Workspace (Agent GODMODE)</option>
          </select>
        </div>

        <div id="customProjectContainer" style="display: none; flex-direction: column; gap: 6px;">
          <input type="text" id="customPathInput" placeholder="Enter absolute or relative path (e.g. Writers website, C:\...)" />
          <span style="font-size: 0.72rem; color: var(--text-muted);">Supports folder names in PROjects or absolute filesystem paths within allowed roots.</span>
        </div>
      </div>

      <div class="form-group">
        <label>Task Directive</label>
        <textarea id="taskInput" placeholder="Describe the feature, video, research objective, or marketing campaign to build..."></textarea>
      </div>

      <button class="btn-run" onclick="triggerPipeline()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Execute Studio Pipeline
      </button>

      <div class="form-group">
        <label>Live Intent & Telemetry Console</label>
        <div class="console-panel" id="consoleLogs">
          <div class="telemetry-item">System ready. Select a studio and execute a pipeline.</div>
        </div>
      </div>
    </section>

    <aside class="sidebar-panel">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <label>Skills Library</label>
        <input type="text" id="skillSearch" placeholder="Search 289 skills..." oninput="filterSkills()" style="padding: 6px 10px; font-size: 0.8rem; width: 180px;">
      </div>
      <div class="skill-list" id="skillsList">
        <div style="color: var(--text-muted); font-size: 0.8rem;">Loading skills...</div>
      </div>
    </aside>
  </main>

  <script>
    let currentStudio = 'build';
    let allSkills = [];
    let allProjects = [];
    let isCustomPath = false;

    function setStudio(studio, btn) {
      currentStudio = studio;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      logConsole('Switched active studio to ' + studio.toUpperCase());
    }

    function togglePathMode() {
      isCustomPath = !isCustomPath;
      const selectBox = document.getElementById('selectProjectContainer');
      const customBox = document.getElementById('customProjectContainer');
      const btn = document.getElementById('togglePathBtn');

      if (isCustomPath) {
        selectBox.style.display = 'none';
        customBox.style.display = 'flex';
        btn.textContent = 'Choose from List 📋';
        document.getElementById('customPathInput').focus();
      } else {
        selectBox.style.display = 'flex';
        customBox.style.display = 'none';
        btn.textContent = 'Custom Path ✏️';
      }
    }

    function logConsole(text, isOutcome = false) {
      const panel = document.getElementById('consoleLogs');
      const item = document.createElement('div');
      item.className = 'telemetry-item' + (isOutcome ? ' telemetry-outcome' : '');
      item.textContent = text;
      panel.appendChild(item);
      panel.scrollTop = panel.scrollHeight;
    }

    function renderProjects(projects) {
      const sel = document.getElementById('projectSelect');
      sel.innerHTML = '<option value="." selected>Current Workspace (Agent GODMODE)</option>';
      projects.forEach(p => {
        if (p !== 'Agent GODMODE') {
          const opt = document.createElement('option');
          opt.value = p;
          opt.textContent = '📁 ' + p;
          sel.appendChild(opt);
        }
      });
    }

    function filterProjects() {
      const q = document.getElementById('projectSearchInput').value.toLowerCase().trim();
      const filtered = allProjects.filter(p => p.toLowerCase().includes(q));
      renderProjects(filtered);
    }

    async function loadInitialData() {
      try {
        const [projRes, skillsRes] = await Promise.all([
          fetch('/api/projects').then(r => r.json()),
          fetch('/api/skills').then(r => r.json())
        ]);

        allProjects = Array.isArray(projRes) ? projRes : [];
        renderProjects(allProjects);

        allSkills = skillsRes;
        renderSkills(allSkills);
        logConsole('Discovered ' + allProjects.length + ' projects across workspace and PROjects root.');
      } catch (err) {
        logConsole('Failed to load initial data: ' + err.message);
      }
    }

    function renderSkills(list) {
      const container = document.getElementById('skillsList');
      container.innerHTML = '';
      list.slice(0, 50).forEach(s => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = '<div class="skill-title">' + s.name + '</div><div class="skill-desc">' + (s.description || 'No description') + '</div>';
        container.appendChild(card);
      });
    }

    function filterSkills() {
      const q = document.getElementById('skillSearch').value.toLowerCase();
      const filtered = allSkills.filter(s => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)));
      renderSkills(filtered);
    }

    async function triggerPipeline() {
      let targetProject = '.';
      if (isCustomPath) {
        targetProject = document.getElementById('customPathInput').value.trim();
        if (!targetProject) {
          alert('Please enter a target project path.');
          return;
        }
      } else {
        targetProject = document.getElementById('projectSelect').value;
      }

      const taskDescription = document.getElementById('taskInput').value.trim();
      if (!taskDescription) {
        alert('Please specify a task directive.');
        return;
      }

      logConsole('[INIT] Triggering ' + currentStudio.toUpperCase() + ' on ' + targetProject);

      try {
        const res = await fetch('/api/pipelines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: currentStudio,
            targetProject,
            taskDescription
          })
        });

        const manifest = await res.json();
        logConsole('[PIPELINE CREATED] ID: ' + manifest.pipelineId + ' | Stage: ' + manifest.currentStage);
        logConsole('[SKILLS MAPPED] ' + manifest.requiredSkills.join(', '));
      } catch (err) {
        logConsole('[ERROR] ' + err.message);
      }
    }

    // Connect SSE stream
    const sse = new EventSource('/api/telemetry/stream');
    sse.onmessage = (e) => {
      try {
        const evt = JSON.parse(e.data);
        if (evt.type === 'intent') {
          logConsole('[INTENT] ' + evt.data.toolName + ' -> ' + evt.data.intent);
        } else if (evt.type === 'outcome') {
          logConsole('[OUTCOME] ' + evt.data.outcome + ' (' + evt.data.durationMs + 'ms)', true);
        }
      } catch {}
    };

    loadInitialData();
  </script>
</body>
</html>`;
  }
}
