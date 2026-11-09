<!-- Part of the shadcn skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Workflow

1. **Get project context** — already injected above. Run `npx shadcn@latest info` again if you need to refresh.
2. **Check installed components first** — before running `add`, always check the `components` list from project context or list the `resolvedPaths.ui` directory. Don't import components that haven't been added, and don't re-add ones already installed.
3. **Find components** — `npx shadcn@latest search`.
4. **Get docs and examples** — run `npx shadcn@latest docs <component>` to get URLs, then fetch them. Use `npx shadcn@latest view` to browse registry items you haven't installed. To preview changes to installed components, use `npx shadcn@latest add --diff`.
5. **Install or update** — `npx shadcn@latest add`. When updating existing components, use `--dry-run` and `--diff` to preview changes first (see [Updating Components](#updating-components) below).
6. **Fix imports in third-party components** — After adding components from community registries (e.g. `@bundui`, `@magicui`), check the added non-UI files for hardcoded import paths like `@/components/ui/...`. These won't match the project's actual aliases. Use `npx shadcn@latest info` to get the correct `ui` alias (e.g. `@workspace/ui/components`) and rewrite the imports accordingly. The CLI rewrites imports for its own UI files, but third-party registry components may use default paths that don't match the project.
7. **Review added components** — After adding a component or block from any registry, **always read the added files and verify they are correct**. Check for missing sub-components (e.g. `SelectItem` without `SelectGroup`), missing imports, incorrect composition, or violations of the [Critical Rules](#critical-rules). Also replace any icon imports with the project's `iconLibrary` from the project context (e.g. if the registry item uses `lucide-react` but the project uses `hugeicons`, swap the imports and icon names accordingly). Fix all issues before moving on.
8. **Registry must be explicit** — When the user asks to add a block or component, **do not guess the registry**. If no registry is specified (e.g. user says "add a login block" without specifying `@shadcn`, `@tailark`, `owner/repo`, etc.), ask which registry to use. Never default to a registry on behalf of the user.
9. **Switching presets** — Ask the user first: **overwrite**, **partial**, **merge**, or **skip**?
   - **Inspect current preset**: `npx shadcn@latest preset resolve`. Use `--json` when you need structured values.
   - **Inspect incoming preset**: `npx shadcn@latest preset decode <code>`. Use `preset url <code>` or `preset open <code>` to share or open the preset builder.
   - **Overwrite**: `npx shadcn@latest apply <code>`. Overwrites detected components, fonts, and CSS variables.
   - **Partial**: `npx shadcn@latest apply <code> --only theme,font`. Updates only the selected preset parts without reinstalling UI components. Supported values are `theme` and `font`; comma-separated combinations are allowed. `icon` is intentionally not supported, because icon changes may require full component reinstall and transforms.
   - **Merge**: `npx shadcn@latest init --preset <code> --force --no-reinstall`, then run `npx shadcn@latest info` to list installed components, then for each installed component use `--dry-run` and `--diff` to [smart merge](#updating-components) it individually.
   - **Skip**: `npx shadcn@latest init --preset <code> --force --no-reinstall`. Only updates config and CSS, leaves components as-is.
   - **Important**: Always run preset commands inside the user's project directory. `apply` only works in an existing project with a `components.json` file. The CLI automatically preserves the current base (`base` vs `radix`) from `components.json`. If you must use a scratch/temp directory (e.g. for `--dry-run` comparisons), pass `--base <current-base>` explicitly — preset codes do not encode the base.

## Design Systems from DESIGN.md

When the user asks for a design system from a `DESIGN.md` (or a brand spec), with or without a preset, follow [design-system.md](./design-system.md) end to end:

1. `init --preset <code> --template <vite|next> --name <app> --no-monorepo -y`. Without a preset code, pick the closest style and pass `--base base --preset <style>`. Then `add --all -y`.
2. Read the DESIGN.md frontmatter, Do's and Don'ts, and Known Gaps before editing.
3. Map its tokens onto the shadcn variables in `tailwindCssFile`. Pin the radius scale, shadows, fonts and `type-*` utilities.
4. Restyle components by editing their `cva` variants. Change control heights together.
5. Build the design system page per [design-system-page.md](./design-system-page.md): contrast-checked color roles, type specimens, pinned state matrices, edge cases, do/don't pairs, recipes. Check coverage with `scripts/showcase-coverage.mjs`.
6. Verify in a browser: typecheck, no console errors, loads at the top, no horizontal overflow, dark mode.
