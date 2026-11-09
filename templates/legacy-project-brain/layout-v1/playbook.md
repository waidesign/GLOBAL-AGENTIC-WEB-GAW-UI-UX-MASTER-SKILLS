# Development Playbook

## Implementation Workflow

1. **Understand & Discover**
   - Read the user request and check `ai-brain/rules.md`.
   - Run `gaw recommend "<task>"` or query MCP tools to retrieve targeted skills.

2. **Plan & Gate**
   - Define affected files and components.
   - Prove design contract and check for existing reusable primitives.

3. **Implement**
   - Follow framework idioms and established tokens.
   - Respect component boundaries (server vs client components).
   - Only animate compositor properties (`transform`, `opacity`).

4. **Verify**
   - Run unit and component tests.
   - Check mobile layout (390px) and desktop layout (1280px).
   - Verify keyboard navigation and screen-reader accessibility.

5. **Learn**
   - Record significant architectural decisions in `ai-brain/project-history.md`.

