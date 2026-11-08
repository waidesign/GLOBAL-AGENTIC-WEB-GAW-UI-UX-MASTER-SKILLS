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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../');

const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });
const discovery = new SkillDiscovery(registry);
const orchestrator = new SkillOrchestrator(registry);
const memoryEngine = new MemoryEngine({ globalBrainDir: path.join(REPO_ROOT, 'brain') });
const bootstrapper = new ProjectBootstrapper({ repoRoot: REPO_ROOT });

const server = new Server(
  {
    name: 'global-agentic-web-mcp',
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
        description: 'List all available skills from the Global Agentic Web central registry.',
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
            id: { type: 'string', description: 'Unique skill ID (e.g. baseline-ui, build-design-system)' }
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
        description: 'Progressively load full skill instructions and conflict resolutions ready for task execution.',
        inputSchema: {
          type: 'object',
          properties: {
            taskPrompt: { type: 'string', description: 'Detailed user task or design objective' }
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
        description: 'Retrieve local Project Brain (ai-brain/) context, rules, and identity for the current project.',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Optional project directory path (defaults to current dir)' }
          }
        }
      },
      {
        name: 'update_project_memory',
        description: 'Safely append a confirmed architectural decision or lesson learned to project memory.',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Category (e.g. Architecture, UI/UX, Performance)' },
            decision: { type: 'string', description: 'Confirmed decision summary' },
            context: { type: 'string', description: 'Context or rationale' }
          },
          required: ['category', 'decision', 'context']
        }
      },
      {
        name: 'initialize_project',
        description: 'Initialize a project directory with Global Agentic Web, creating ai-brain/, the Graphify code graph (graphify-out/, only when the optional Graphify CLI is installed), and agent adapters.',
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
                  frameworks: s.frameworks
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
                  description: s.description
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
          content: [{ type: 'text', text: JSON.stringify({ ...skill, content: skill.content }, null, 2) }]
        };
      }

      case 'recommend_skills': {
        const recs = await orchestrator.recommend(args.taskPrompt, { framework: args.framework });
        return {
          content: [{ type: 'text', text: JSON.stringify(recs, null, 2) }]
        };
      }

      case 'load_skills': {
        const payload = await orchestrator.loadSkillsForTask(args.taskPrompt);
        return {
          content: [{ type: 'text', text: payload.formattedInstructions }]
        };
      }

      case 'get_global_brain': {
        const brain = await memoryEngine.getGlobalBrain();
        return {
          content: [{ type: 'text', text: JSON.stringify(brain, null, 2) }]
        };
      }

      case 'get_project_context': {
        const pPath = args.projectPath || process.cwd();
        const pBrain = await memoryEngine.getProjectBrain(pPath);
        return {
          content: [{ type: 'text', text: JSON.stringify(pBrain, null, 2) }]
        };
      }

      case 'update_project_memory': {
        await memoryEngine.recordDecision(args.category, args.decision, args.context, true);
        return {
          content: [{ type: 'text', text: `Successfully updated project decision history: [${args.category}] ${args.decision}` }]
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
  console.error('Global Agentic Web MCP Server running on stdio');
}

main().catch(err => {
  console.error('Fatal MCP Server error:', err);
  process.exit(1);
});

