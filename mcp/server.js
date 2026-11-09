#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SkillRegistry } from '../core/skill-registry/SkillRegistry.js';
import { SkillDiscovery } from '../core/skill-discovery/SkillDiscovery.js';
import { SkillOrchestrator } from '../core/orchestrator/SkillOrchestrator.js';
import { MemoryEngine } from '../core/memory-engine/MemoryEngine.js';
import { ProjectDetector } from '../core/project-detector/ProjectDetector.js';
import { ProjectBootstrapper } from '../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager } from '../core/graphify-manager/GraphifyManager.js';
import { loadProjectContext, loadProjectSkillsForTask, selectSkills, writeCatalog } from '../core/project-context/ProjectContext.js';
import { trustLevel, describeTrust } from '../core/skill-registry/trust.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../');

const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills'), user: true });
const discovery = new SkillDiscovery(registry);
const orchestrator = new SkillOrchestrator(registry);
// The user's Global Brain (~/.gaw/brain or GAW_HOME/brain), not the installed package
const memoryEngine = new MemoryEngine();
const bootstrapper = new ProjectBootstrapper({ repoRoot: REPO_ROOT });

const server = new Server(
  {
    name: 'guided-agent-workflow-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_skills',
        description: 'List all available skills from the Guided Agent Workflow central registry.',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Optional category filter' }
          }
        }
      },
      {
        name: 'search_skills',
        description: 'Search skills using full-text and semantic keyword matching.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search keywords or task query' },
            category: { type: 'string', description: 'Optional category filter' },
            framework: { type: 'string', description: 'Optional framework filter' }
          },
          required: ['query']
        }
      },
      {
        name: 'get_skill',
        description: 'Retrieve full markdown instructions and metadata for a specific skill by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Unique skill ID (e.g. baseline-ui, design-system-boss)' }
          },
          required: ['id']
        }
      },
      {
        name: 'recommend_skills',
        description: 'Analyze a user task prompt and return primary, supporting, and dependent skills with execution order.',
        inputSchema: {
          type: 'object',
          properties: {
            taskPrompt: { type: 'string', description: 'Detailed user task or design objective' },
            framework: { type: 'string', description: 'Target framework (e.g. react, nextjs, vue)' }
          },
          required: ['taskPrompt']
        }
      },
      {
        name: 'load_skills',
        description: 'Progressively load full skill instructions and conflict resolutions ready for task execution. Skills that do the same job (e.g. two animation libraries) are not loaded together: the one the project already depends on wins.',
        inputSchema: {
          type: 'object',
          properties: {
            taskPrompt: { type: 'string', description: 'Detailed user task or design objective' },
            projectPath: { type: 'string', description: 'Optional project directory, used to prefer skills for libraries the project already has (defaults to current dir)' }
          },
          required: ['taskPrompt']
        }
      },
      {
        name: 'get_global_brain',
        description: 'Retrieve confirmed global preferences, design principles, and coding standards.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_project_context',
        description: 'Everything GAW knows about the project, validated: stack, goal, project rules, selected skills (short entries, not full text), code graph and Global Brain location. Call this first when starting work in a project.',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Optional project directory path (defaults to current dir)' }
          }
        }
      },
      {
        name: 'get_project_skills',
        description: 'The skills chosen for this project (from ai-brain/skills.lock.json and ai-brain/skills/): name, summary, why chosen, size and file path. Does not load full instructions.',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Optional project directory path (defaults to current dir)' }
          }
        }
      },
      {
        name: 'load_project_skills',
        description: 'Load full instructions of only those project skills that closely match the current task, within a token budget. Returns nothing when no project skill fits.',
        inputSchema: {
          type: 'object',
          properties: {
            taskPrompt: { type: 'string', description: 'The task you are about to do' },
            projectPath: { type: 'string', description: 'Optional project directory path (defaults to current dir)' },
            tokenBudget: { type: 'number', description: 'Max tokens of full skill instructions (default 8000)' }
          },
          required: ['taskPrompt']
        }
      },
      {
        name: 'select_project_skills',
        description: 'Add library skills to the project (ai-brain/skills.lock.json). Only call this after the user agrees to use these skills in the project.',
        inputSchema: {
          type: 'object',
          properties: {
            ids: { type: 'array', items: { type: 'string' }, description: 'Skill names to add' },
            reason: { type: 'string', description: 'Why the project needs them' },
            projectPath: { type: 'string', description: 'Optional project directory path (defaults to current dir)' }
          },
          required: ['ids']
        }
      },
      {
        name: 'update_project_memory',
        description: 'Safely append a confirmed architectural decision or lesson learned to project memory.',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Category (e.g. Architecture, Testing, Performance, UI/UX)' },
            decision: { type: 'string', description: 'Confirmed decision summary' },
            context: { type: 'string', description: 'Context or rationale' }
          },
          required: ['category', 'decision', 'context']
        }
      },
      {
        name: 'initialize_project',
        description: 'Initialize a project directory with Guided Agent Workflow, creating ai-brain/, the Graphify code graph (graphify-out/, only when the optional Graphify CLI is installed), and agent adapters.',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Target project directory' },
            dryRun: { type: 'boolean', description: 'Simulate initialization without modifying files' },
            noAgentation: { type: 'boolean', description: 'Skip Agentation installation' },
            noGraphify: { type: 'boolean', description: 'Skip the Graphify code graph. It is also skipped when Graphify is not installed; this tool never installs it.' }
          }
        }
      },
      {
        name: 'analyze_project',
        description: 'Perform deep architectural inspection of project framework, dependencies, UI systems, and AI tools.',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Target project directory' }
          }
        }
      },
      {
        name: 'get_project_graph',
        description: 'Retrieve the Graphify architectural relationship graph for the project. Returns skipped: true when the optional Graphify CLI is not installed (the user can run `gaw setup`).',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Target project directory' },
            forceRegenerate: { type: 'boolean', description: 'Force regeneration of codebase graph' }
          }
        }
      },
      {
        name: 'get_project_status',
        description: 'Check whether the project is initialized and ready for development.',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Target project directory' }
          }
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case 'list_skills': {
        const skills = args.category
          ? await registry.getSkillsByCategory(args.category)
          : await registry.getAllSkills();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                skills.map(s => ({
                  id: s.id,
                  name: s.name,
                  category: s.category,
                  description: s.description,
                  author: s.author,
                  frameworks: s.frameworks,
                  trust: trustLevel(s)
                })),
                null,
                2
              )
            }
          ]
        };
      }

      case 'search_skills': {
        const results = await discovery.search(args.query, {
          category: args.category,
          framework: args.framework,
          limit: 10
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                results.map(s => ({
                  id: s.id,
                  name: s.name,
                  category: s.category,
                  description: s.description,
                  trust: trustLevel(s)
                })),
                null,
                2
              )
            }
          ]
        };
      }

      case 'get_skill': {
        const skill = await registry.getSkill(args.id);
        if (!skill) {
          return { isError: true, content: [{ type: 'text', text: `Skill not found: ${args.id}` }] };
        }
        // `content` is loaded on demand (not an enumerable field), so include it explicitly
        return {
          content: [{ type: 'text', text: JSON.stringify({ ...skill, trust: trustLevel(skill), trustNote: describeTrust(skill), content: skill.content }, null, 2) }]
        };
      }

      case 'recommend_skills': {
        const recs = await orchestrator.recommend(args.taskPrompt, { framework: args.framework });
        return {
          content: [{ type: 'text', text: JSON.stringify(recs, null, 2) }]
        };
      }

      case 'load_skills': {
        const projectInfo = ProjectDetector.detect(args.projectPath || process.cwd());
        const payload = await orchestrator.loadSkillsForTask(args.taskPrompt, projectInfo);
        const leftOut = payload.excludedSkills?.length
          ? `\n## Left out\n${payload.excludedSkills.map(e => `- ${e.id}: ${e.reason}`).join('\n')}\n`
          : '';
        return {
          content: [{ type: 'text', text: payload.formattedInstructions + leftOut }]
        };
      }

      case 'get_global_brain': {
        const brain = await memoryEngine.getGlobalBrain();
        return {
          content: [{ type: 'text', text: JSON.stringify(brain, null, 2) }]
        };
      }

      case 'get_project_context': {
        // The same validated context the CLI (gaw context) and agent files use
        const ctx = await loadProjectContext(args.projectPath || process.cwd(), { registry });
        return {
          content: [{ type: 'text', text: JSON.stringify(ctx, null, 2) }]
        };
      }

      case 'get_project_skills': {
        const ctx = await loadProjectContext(args.projectPath || process.cwd(), { registry });
        return {
          content: [{ type: 'text', text: JSON.stringify({ selected: ctx.skills.selected, project: ctx.skills.project, warnings: ctx.warnings }, null, 2) }]
        };
      }

      case 'load_project_skills': {
        // Only the project's chosen skills that fit this task, within the token budget
        const payload = await loadProjectSkillsForTask(args.projectPath || process.cwd(), registry, args.taskPrompt, { tokenBudget: args.tokenBudget });
        return {
          content: [{ type: 'text', text: payload.formattedInstructions }]
        };
      }

      case 'select_project_skills': {
        const target = args.projectPath || process.cwd();
        const res = await selectSkills(target, registry, args.ids || [], args.reason);
        await writeCatalog(target, registry);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }

      case 'update_project_memory': {
        const written = await memoryEngine.recordDecision(args.category, args.decision, args.context, true, args.projectPath || process.cwd());
        return {
          content: [{ type: 'text', text: written ? `Recorded the decision in ${written}: [${args.category}] ${args.decision}` : `Recorded the decision: [${args.category}] ${args.decision}` }]
        };
      }

      case 'initialize_project': {
        const target = args.projectPath || process.cwd();
        const initReport = await bootstrapper.init(target, {
          dryRun: args.dryRun,
          noAgentation: args.noAgentation,
          noGraphify: args.noGraphify
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(initReport, null, 2) }]
        };
      }

      case 'analyze_project': {
        const target = args.projectPath || process.cwd();
        const info = ProjectDetector.detect(target);
        return {
          content: [{ type: 'text', text: JSON.stringify(info, null, 2) }]
        };
      }

      case 'get_project_graph': {
        const target = args.projectPath || process.cwd();
        const graphify = new GraphifyManager({ projectRoot: target });
        const res = await graphify.generateGraph({ targetDir: target, force: args.forceRegenerate });
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }

      case 'get_project_status': {
        const target = args.projectPath || process.cwd();
        const status = await bootstrapper.start(target);
        return {
          content: [{ type: 'text', text: JSON.stringify(status, null, 2) }]
        };
      }

      default:
        return {
          isError: true,
          content: [{ type: 'text', text: `Unknown tool name: ${name}` }]
        };
    }
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Error executing ${name}: ${error.message}` }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Guided Agent Workflow MCP Server running on stdio');
}

main().catch(err => {
  console.error('Fatal MCP Server error:', err);
  process.exit(1);
});

