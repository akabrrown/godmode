import fs from 'node:fs/promises';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SkillRegistry } from '../registry/skills.js';
import { WorkflowRegistry } from '../registry/workflows.js';
import { WorkspaceBridge } from '../bridge/workspace.js';

export interface GodmodeMcpOptions {
  skillRegistry: SkillRegistry;
  workflowRegistry: WorkflowRegistry;
  bridge: WorkspaceBridge;
}

export interface McpToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
}

export class GodmodeMcpServer {
  private server: McpServer;
  private skillRegistry: SkillRegistry;
  private workflowRegistry: WorkflowRegistry;
  private bridge: WorkspaceBridge;

  constructor(options: GodmodeMcpOptions) {
    this.skillRegistry = options.skillRegistry;
    this.workflowRegistry = options.workflowRegistry;
    this.bridge = options.bridge;

    this.server = new McpServer({
      name: 'godmode-os',
      version: '1.0.0',
    });

    this.registerTools();
  }

  /**
   * Registers all standard GODMODE tools into the McpServer instance.
   */
  private registerTools(): void {
    // 1. list_skills
    this.server.tool(
      'list_skills',
      'Lists all available skills in GODMODE OS, optionally filtered by keyword query',
      { query: z.string().optional() },
      async ({ query }) => {
        const skills = query
          ? this.skillRegistry.search(query)
          : this.skillRegistry.getAllSkills();

        const formatted = skills.map((s) => ({
          name: s.name,
          description: s.description,
          hasReferences: s.hasReferences,
          hasScripts: s.hasScripts,
        }));

        return {
          content: [{ type: 'text', text: JSON.stringify(formatted, null, 2) }],
        };
      }
    );

    // 2. get_skill
    this.server.tool(
      'get_skill',
      'Retrieves the full documentation and instruction set of a specific skill',
      { name: z.string() },
      async ({ name }) => {
        const skill = this.skillRegistry.getSkill(name);
        if (!skill) {
          return {
            content: [{ type: 'text', text: `Skill '${name}' not found.` }],
            isError: true,
          };
        }

        try {
          const content = await fs.readFile(path.join(skill.path, 'SKILL.md'), 'utf8');
          return {
            content: [{ type: 'text', text: content }],
          };
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: `Error reading SKILL.md: ${errorMsg}` }],
            isError: true,
          };
        }
      }
    );

    // 3. list_workflows
    this.server.tool(
      'list_workflows',
      'Lists all multi-phase execution workflows available in GODMODE OS',
      { query: z.string().optional() },
      async ({ query }) => {
        const workflows = query
          ? this.workflowRegistry.search(query)
          : this.workflowRegistry.getAllWorkflows();

        const formatted = workflows.map((w) => ({
          name: w.name,
          fileName: w.fileName,
        }));

        return {
          content: [{ type: 'text', text: JSON.stringify(formatted, null, 2) }],
        };
      }
    );

    // 4. get_workflow
    this.server.tool(
      'get_workflow',
      'Retrieves the full instructions of a specific multi-phase workflow',
      { name: z.string() },
      async ({ name }) => {
        const wf = this.workflowRegistry.getWorkflow(name);
        if (!wf) {
          return {
            content: [{ type: 'text', text: `Workflow '${name}' not found.` }],
            isError: true,
          };
        }

        return {
          content: [{ type: 'text', text: wf.content }],
        };
      }
    );

    // 5. list_projects
    this.server.tool(
      'list_projects',
      'Lists all recognized workspace projects within PROjects directory',
      {},
      async () => {
        const projects = await this.bridge.listProjects();
        return {
          content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }],
        };
      }
    );
  }

  /**
   * Introspection method for unit testing and CLI tool listings.
   */
  getRegisteredTools(): ToolDefinition[] {
    return [
      { name: 'list_skills', description: 'Lists all available skills in GODMODE OS' },
      { name: 'get_skill', description: 'Retrieves the full documentation of a skill' },
      { name: 'list_workflows', description: 'Lists all multi-phase workflows' },
      { name: 'get_workflow', description: 'Retrieves workflow instructions' },
      { name: 'list_projects', description: 'Lists all recognized workspace projects' },
    ];
  }

  /**
   * Directly executes a tool by name (used for unit tests and local programmatic invocation).
   */
  async executeTool(name: string, args: Record<string, unknown>): Promise<McpToolResult> {
    switch (name) {
      case 'list_skills': {
        const query = typeof args.query === 'string' ? args.query : undefined;
        const skills = query
          ? this.skillRegistry.search(query)
          : this.skillRegistry.getAllSkills();
        return {
          content: [{ type: 'text', text: JSON.stringify(skills, null, 2) }],
        };
      }

      case 'get_skill': {
        const skillName = String(args.name || '');
        const skill = this.skillRegistry.getSkill(skillName);
        if (!skill) {
          return {
            content: [{ type: 'text', text: `Skill '${skillName}' not found.` }],
            isError: true,
          };
        }

        try {
          const content = await fs.readFile(path.join(skill.path, 'SKILL.md'), 'utf8');
          return {
            content: [{ type: 'text', text: content }],
          };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text', text: `Error reading SKILL.md: ${msg}` }],
            isError: true,
          };
        }
      }

      case 'list_workflows': {
        const query = typeof args.query === 'string' ? args.query : undefined;
        const workflows = query
          ? this.workflowRegistry.search(query)
          : this.workflowRegistry.getAllWorkflows();
        return {
          content: [{ type: 'text', text: JSON.stringify(workflows, null, 2) }],
        };
      }

      case 'get_workflow': {
        const wfName = String(args.name || '');
        const wf = this.workflowRegistry.getWorkflow(wfName);
        if (!wf) {
          return {
            content: [{ type: 'text', text: `Workflow '${wfName}' not found.` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: wf.content }],
        };
      }

      case 'list_projects': {
        const projects = await this.bridge.listProjects();
        return {
          content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  }

  /**
   * Starts the MCP server on stdio transport for IDE integration.
   */
  async startStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
