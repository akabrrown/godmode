import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { SkillRegistry } from '../../src/registry/skills.js';
import { WorkflowRegistry } from '../../src/registry/workflows.js';
import { WorkspaceBridge } from '../../src/bridge/workspace.js';
import { GodmodeMcpServer } from '../../src/mcp/server.js';

describe('GodmodeMcpServer (TDD Red -> Green)', () => {
  let mcpServer: GodmodeMcpServer;

  beforeAll(async () => {
    const skillsDir = path.resolve(process.cwd(), '.agents/skills');
    const workflowsDir = path.resolve(process.cwd(), '.agents/workflows');
    const workspaceRoot = process.cwd();

    const skillRegistry = new SkillRegistry(skillsDir);
    const workflowRegistry = new WorkflowRegistry(workflowsDir);
    const bridge = new WorkspaceBridge(workspaceRoot);

    await skillRegistry.initialize();
    await workflowRegistry.initialize();

    mcpServer = new GodmodeMcpServer({
      skillRegistry,
      workflowRegistry,
      bridge,
    });
  });

  it('should list all registered tools', () => {
    const tools = mcpServer.getRegisteredTools();
    const toolNames = tools.map((t) => t.name);

    expect(toolNames).toContain('list_skills');
    expect(toolNames).toContain('get_skill');
    expect(toolNames).toContain('list_workflows');
    expect(toolNames).toContain('get_workflow');
    expect(toolNames).toContain('list_projects');
  });

  it('should execute list_skills and return array of skills', async () => {
    const result = await mcpServer.executeTool('list_skills', { query: 'ui-ux' });
    expect(result.content).toBeDefined();
    expect(result.content[0].text).toContain('ui-ux-pro-max');
  });

  it('should execute get_skill and return markdown documentation', async () => {
    const result = await mcpServer.executeTool('get_skill', { name: 'ui-ux-pro-max' });
    expect(result.content).toBeDefined();
    expect(result.content[0].text).toContain('UI/UX Pro Max');
  });

  it('should execute list_workflows and return 30 workflows', async () => {
    const result = await mcpServer.executeTool('list_workflows', {});
    expect(result.content).toBeDefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.length).toBe(30);
  });

  it('should handle get_skill for non-existent skill with error payload', async () => {
    const result = await mcpServer.executeTool('get_skill', { name: 'non-existent' });
    expect(result.isError).toBe(true);
  });
});
