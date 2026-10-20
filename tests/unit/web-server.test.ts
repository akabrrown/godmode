import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'node:path';
import http from 'node:http';
import { GodmodeWebServer } from '../../src/web/server.js';
import { SkillRegistry } from '../../src/registry/skills.js';
import { WorkflowRegistry } from '../../src/registry/workflows.js';
import { WorkspaceBridge } from '../../src/bridge/workspace.js';
import { TelemetryManager } from '../../src/telemetry/intent.js';
import { PipelineRunner } from '../../src/pipeline/runner.js';

describe('GodmodeWebServer (TDD Red -> Green)', () => {
  let server: GodmodeWebServer;
  const testPort = 4099;

  beforeAll(async () => {
    const skillsDir = path.resolve(process.cwd(), '.agents/skills');
    const workflowsDir = path.resolve(process.cwd(), '.agents/workflows');
    const workspaceRoot = process.cwd();

    const skillRegistry = new SkillRegistry(skillsDir);
    const workflowRegistry = new WorkflowRegistry(workflowsDir);
    const bridge = new WorkspaceBridge(workspaceRoot);
    const telemetry = new TelemetryManager();

    await skillRegistry.initialize();
    await workflowRegistry.initialize();

    const runner = new PipelineRunner({
      skillRegistry,
      workflowRegistry,
      bridge,
      telemetry,
    });

    server = new GodmodeWebServer({
      port: testPort,
      skillRegistry,
      workflowRegistry,
      bridge,
      telemetry,
      runner,
    });

    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  const get = (urlPath: string): Promise<{ statusCode: number; data: any }> => {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${testPort}${urlPath}`, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode || 200, data: JSON.parse(body) });
          } catch {
            resolve({ statusCode: res.statusCode || 200, data: body });
          }
        });
      }).on('error', reject);
    });
  };

  it('should serve /api/status with system health and counts', async () => {
    const res = await get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.data.status).toBe('OPERATIONAL');
    expect(res.data.skillsCount).toBeGreaterThanOrEqual(285);
    expect(res.data.workflowsCount).toBe(30);
  });

  it('should serve /api/skills with search query', async () => {
    const res = await get('/api/skills?query=testing');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should serve /api/workflows listing all 30 workflows', async () => {
    const res = await get('/api/workflows');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBe(30);
  });

  it('should serve HTML dashboard on root /', async () => {
    const res = await get('/');
    expect(res.statusCode).toBe(200);
    expect(typeof res.data).toBe('string');
    expect(res.data).toContain('GODMODE OS');
  });
});
