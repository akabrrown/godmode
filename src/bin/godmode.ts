#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../registry/skills.js';
import { WorkflowRegistry } from '../registry/workflows.js';
import { WorkspaceBridge } from '../bridge/workspace.js';
import { TelemetryManager } from '../telemetry/intent.js';
import { GodmodeMcpServer } from '../mcp/server.js';
import { PipelineRunner, type PipelineCommand } from '../pipeline/runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  const skillsDir = path.resolve(rootDir, '.agents/skills');
  const workflowsDir = path.resolve(rootDir, '.agents/workflows');
  const workspaceRoot = rootDir;

  const skillRegistry = new SkillRegistry(skillsDir);
  const workflowRegistry = new WorkflowRegistry(workflowsDir);
  const bridge = new WorkspaceBridge(workspaceRoot);
  const telemetry = new TelemetryManager();

  await skillRegistry.initialize();
  await workflowRegistry.initialize();

  switch (command) {
    case 'mcp': {
      const server = new GodmodeMcpServer({
        skillRegistry,
        workflowRegistry,
        bridge,
      });
      await server.startStdio();
      break;
    }

    case 'skills': {
      const query = args[1];
      const skills = query ? skillRegistry.search(query) : skillRegistry.getAllSkills();
      console.log(`\nGODMODE OS — Skills Library (${skills.length} available)`);
      console.log('='.repeat(60));
      for (const s of skills.slice(0, 30)) {
        console.log(`- ${s.name.padEnd(35)} : ${s.description.slice(0, 70)}...`);
      }
      if (skills.length > 30) {
        console.log(`... and ${skills.length - 30} more skills.`);
      }
      break;
    }

    case 'workflows': {
      const workflows = workflowRegistry.getAllWorkflows();
      console.log(`\nGODMODE OS — Workflows (${workflows.length} available)`);
      console.log('='.repeat(60));
      for (const w of workflows) {
        console.log(`- ${w.name.padEnd(30)} : (${w.fileName})`);
      }
      break;
    }

    case 'run': {
      const subCommand = (args[1] || 'build') as PipelineCommand;
      const targetProject = args[2] || '.';
      const taskDescription = args[3] || 'Autonomous task execution';

      console.log(`\n🚀 Initializing GODMODE Pipeline: ${subCommand.toUpperCase()}`);
      console.log(`Target: ${targetProject}`);
      console.log(`Task: ${taskDescription}\n`);

      const runner = new PipelineRunner({
        skillRegistry,
        workflowRegistry,
        bridge,
        telemetry,
      });

      telemetry.subscribe((evt) => {
        if (evt.type === 'intent') {
          console.log(`[INTENT] ${evt.data.toolName} -> ${evt.data.intent}`);
        } else if (evt.type === 'outcome') {
          console.log(`[OUTCOME] ${evt.data.outcome} (${evt.data.durationMs}ms)`);
        }
      });

      const manifest = runner.createPipeline({
        command: subCommand,
        targetProject,
        taskDescription,
      });

      console.log(`Pipeline ID: ${manifest.pipelineId}`);
      await runner.executePreflight(manifest.pipelineId);
      await runner.executeDiscovery(manifest.pipelineId);

      console.log(`\nActive Skills Mapped: ${manifest.requiredSkills.join(', ')}`);
      console.log(`Current Stage: ${manifest.currentStage}`);
      console.log('Ready for stage execution.\n');
      break;
    }

    case 'status': {
      const allSkills = skillRegistry.getAllSkills();
      const allWorkflows = workflowRegistry.getAllWorkflows();
      console.log('\nGODMODE OS Status:');
      console.log(`- Indexed Skills   : ${allSkills.length}`);
      console.log(`- Workflows        : ${allWorkflows.length}`);
      console.log(`- Root Directory   : ${rootDir}`);
      console.log(`- Node.js Runtime  : ${process.version}`);
      console.log('- Status           : OPERATIONAL\n');
      break;
    }

    case 'help':
    default: {
      console.log(`
GODMODE OS — Command Line Interface

Usage:
  godmode mcp                           Start stdio MCP tool server (for IDEs)
  godmode skills [query]                List or search registered skills
  godmode workflows                     List all 30 execution workflows
  godmode run <cmd> <project> "<task>"  Execute a Rule Zero pipeline
  godmode status                        Display system health and indexed count

Commands for 'run':
  build      Autonomous Software Engineering Studio
  media      Multimodal Media & Video Production Studio
  research   Deep Intelligence & Research Studio
  market     Growth, CRO & Design Studio
`);
      break;
    }
  }
}

main().catch((err) => {
  console.error('Fatal GODMODE Error:', err);
  process.exit(1);
});
