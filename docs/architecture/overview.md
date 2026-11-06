# GAW Architecture Overview

## Design Principles
1. **Separation of Concerns**: Core orchestration logic (`core/`) is completely decoupled from CLI interface (`cli/`), MCP server (`mcp/`), and filesystem storage (`skills/`, `brain/`).
2. **Deterministic Code Intelligence**: Relationship analysis runs locally without external API dependence.
3. **Progressive Skill Loading**: Minimal context footprint for AI coding agents.

## Module Structure
```text
core/
├── skill-registry/      # Frontmatter parser & catalog indexer
├── skill-discovery/     # Full-text & token relevance search engine
├── orchestrator/        # Task analyzer, dependency resolver, progressive loader
├── memory-engine/       # Global & Project Brain memory manager
├── project-detector/    # AST & package.json environment detector
├── graphify-manager/    # Codebase dependency & architecture graph generator
├── agentation-manager/  # React visual annotation installer & dev-injector
├── agent-adapters/      # Multi-agent instruction generators
└── bootstrapper/        # Universal project initializer (`gaw init`, `gaw start`)
```

