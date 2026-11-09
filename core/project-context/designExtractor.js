/**
 * Builds ai-brain/design.md for UI projects from values already in the code:
 * CSS custom properties (including Tailwind v4 @theme), font-family declarations
 * and the most-used colors. Agents then reuse these values instead of inventing new ones.
 * Reads at most MAX_FILES stylesheets of up to MAX_FILE_BYTES each, so large repos stay fast.
 */
import fs from 'node:fs';
import path from 'node:path';

const STYLE_EXT = /\.(css|scss|sass|less|pcss)$/i;
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next', '.nuxt', '.svelte-kit', 'ai-brain', 'graphify-out', 'vendor', 'target']);
const MAX_FILES = 200;
const MAX_FILE_BYTES = 512 * 1024;
const MAX_PER_GROUP = 16;

const COLOR_VALUE = /^(#[0-9a-f]{3,8}\b|(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\()/i;

function findStylesheets(root) {
  const files = [];
  const walk = (dir, depth) => {
    if (files.length >= MAX_FILES || depth > 6) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (files.length >= MAX_FILES) return;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!e.name.startsWith('.') && !SKIP_DIRS.has(e.name)) walk(full, depth + 1);
      } else if (STYLE_EXT.test(e.name)) {
        try { if (fs.statSync(full).size <= MAX_FILE_BYTES) files.push(full); } catch { /* unreadable */ }
      }
    }
  };
  walk(root, 0);
  return files;
}

function groupFor(name, value) {
  const n = name.toLowerCase();
  if (/font|typeface|family/.test(n) && !/size|weight|leading|tracking/.test(n)) return 'fonts';
  if (/(^|-)(text|font)-(xs|sm|base|lg|xl|\dxl)|font-size|leading|line-height|tracking|letter-spacing|font-weight/.test(n)) return 'type';
  if (/radius|rounded/.test(n)) return 'radius';
  if (/space|spacing|gap|gutter|size-\d|^-?-?s-\d/.test(n)) return 'spacing';
  if (/shadow|elevation/.test(n)) return 'shadows';
  if (COLOR_VALUE.test(value) || /color|bg|background|foreground|fg|border|primary|secondary|accent|muted|destructive|surface/.test(n)) return 'colors';
  return null;
}

/** Collect design values from the project's stylesheets. */
export function extractDesignValues(projectDir) {
  const groups = { fonts: new Map(), type: new Map(), colors: new Map(), spacing: new Map(), radius: new Map(), shadows: new Map() };
  const fontFamilies = new Map();
  const colorCounts = new Map();
  const files = findStylesheets(projectDir);

  for (const file of files) {
    let text = '';
    try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    const rel = path.relative(projectDir, file).replace(/\\/g, '/');

    for (const m of text.matchAll(/(--[\w-]+)\s*:\s*([^;}{]+);/g)) {
      const name = m[1];
      const value = m[2].trim().replace(/\s+/g, ' ');
      const group = groupFor(name, value);
      if (group && !groups[group].has(name)) groups[group].set(name, { value, file: rel });
    }
    for (const m of text.matchAll(/font-family\s*:\s*([^;}{]+);/g)) {
      const value = m[1].trim().replace(/\s+/g, ' ');
      if (!value.startsWith('var(') && !fontFamilies.has(value)) fontFamilies.set(value, rel);
    }
    for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
      const c = m[0].toLowerCase();
      colorCounts.set(c, (colorCounts.get(c) || 0) + 1);
    }
  }

  return {
    files: files.map(f => path.relative(projectDir, f).replace(/\\/g, '/')),
    groups,
    fontFamilies,
    topColors: [...colorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
    hasTailwindConfig: ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs', 'tailwind.config.cjs'].find(f => fs.existsSync(path.join(projectDir, f))) || null
  };
}

const AUTO = '(auto-detected)';

function rows(map) {
  return [...map.entries()].slice(0, MAX_PER_GROUP).map(([name, v]) => `- \`${name}\`: \`${v.value}\` (${v.file})`);
}

/** Markdown for ai-brain/design.md. */
export function renderDesignMd(projectName, values, date = new Date().toISOString().split('T')[0]) {
  const { groups } = values;
  const out = [
    `# Design: ${projectName}`,
    '',
    `_Design values found in this project's code on ${date}. Agents reuse these instead of inventing new ones. Sections marked ${AUTO} are refreshed by \`gaw update\`; change a heading to (confirmed) to keep your edits. Fill in what's missing._`,
    ''
  ];

  const section = (title, lines, missing) => {
    out.push(`## ${title} ${AUTO}`);
    out.push(...(lines.length ? lines : [`_${missing}_`]));
    out.push('');
  };

  const fontLines = rows(groups.fonts);
  for (const [value, file] of [...values.fontFamilies.entries()].slice(0, 6)) fontLines.push(`- \`font-family: ${value}\` (${file})`);
  section('Typography', [...fontLines, ...rows(groups.type)], 'None found. Add the font families and the type scale (sizes, weights, line heights) you use.');

  const colorLines = rows(groups.colors);
  if (!colorLines.length && values.topColors.length) {
    colorLines.push('No color variables found. Most used colors in the stylesheets:');
    for (const [c, n] of values.topColors) colorLines.push(`- \`${c}\` (${n}×)`);
  }
  section('Colors', colorLines, 'None found. Add the palette with a role for each color (background, text, primary, border, error).');

  section('Spacing Scale', rows(groups.spacing), 'None found. Add the spacing steps you use (for example 4, 8, 12, 16, 24, 32, 48px).');
  section('Radius & Shadows', [...rows(groups.radius), ...rows(groups.shadows)], 'None found.');

  out.push('## Sources');
  if (values.files.length) out.push(`- Stylesheets read: ${values.files.length}${values.files.length >= MAX_FILES ? ' (limit reached)' : ''}`);
  else out.push('- No stylesheets found.');
  if (values.hasTailwindConfig) out.push(`- Tailwind theme is in \`${values.hasTailwindConfig}\`: its colors, fonts and spacing are the design values; read it before adding new ones.`);
  out.push('', '## Direction', '_Not written yet: the look and feel in a few concrete words (density, contrast, corner style, motion). `gaw designs search "<style>"` suggests reference designs._', '');
  return out.join('\n');
}

export function buildDesignMd(projectDir, projectName) {
  return renderDesignMd(projectName, extractDesignValues(projectDir));
}
