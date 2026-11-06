# Global Brain & Project Brain Architecture

## Two-Tier Intelligence
Global Agentic Web uses a two-tier memory hierarchy:
1. **Global Brain (`brain/`)**: Cross-project user persona, design principles, coding preferences, and confirmed decisions.
2. **Project Brain (`ai-brain/`)**: Local, project-specific architecture, detected technology stack, local rules, and history.

## Memory Precedence Rule
When contradictory instructions arise, agents must strictly follow this precedence:
1. **User Request (Immediate)**
2. **Project Rules (`ai-brain/rules.md`)**
3. **Global Brain Preferences (`brain/`)**
4. **Loaded Skill Instructions**
5. **Tool & Framework Defaults**

## Non-Destructive Memory Updates
Memory updates are append-only to prevent regression. All decisions are logged with timestamps in `decision-history.md` (Global) and `project-history.md` (Project). No secrets or credentials are ever stored in memory markdown files.

