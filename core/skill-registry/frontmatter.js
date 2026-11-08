/**
 * Zero-dependency reader/writer for the YAML subset used in SKILL.md frontmatter:
 *   key: value              plain, "double" or 'single' quoted scalars
 *   key: [a, "b"]           inline lists
 *   key: >  |  >-  |-       multi-line (folded / literal) text
 *   key:                    followed by indented "- item" lists or "child: value" maps
 * Values are returned as strings (or arrays / one-level maps of strings).
 */

function unquote(value) {
  const v = value.trim();
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }
  if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  // Plain scalar: drop a trailing " # comment"
  return v.replace(/\s+#.*$/, '');
}

function parseInlineList(value) {
  const inner = value.trim().slice(1, -1);
  if (!inner.trim()) return [];
  const items = [];
  let current = '';
  let quote = null;
  for (const ch of inner) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
    } else if (ch === ',') {
      items.push(unquote(current));
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) items.push(unquote(current));
  return items.filter(i => i !== '');
}

function parseScalarOrList(value) {
  const v = value.trim();
  if (v.startsWith('[') && v.endsWith(']')) return parseInlineList(v);
  return unquote(v);
}

const indentOf = (line) => line.length - line.trimStart().length;

/** Collect a block scalar (">", "|", with optional "-"/"+" chomping) starting after `start`. */
function readBlockScalar(lines, start, indicator, parentIndent) {
  const block = [];
  let i = start;
  let blockIndent = null;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      block.push('');
      continue;
    }
    const ind = indentOf(line);
    if (ind <= parentIndent) break;
    if (blockIndent === null) blockIndent = ind;
    block.push(line.slice(Math.min(blockIndent, ind)));
  }
  while (block.length && block[block.length - 1] === '') block.pop();

  let text;
  if (indicator.startsWith('|')) {
    text = block.join('\n');
  } else {
    // Folded: single newlines become spaces, blank lines become newlines
    text = block.reduce((acc, line) => {
      if (line === '') return `${acc}\n`;
      if (acc === '' || acc.endsWith('\n')) return acc + line;
      return `${acc} ${line}`;
    }, '');
  }
  if (indicator.endsWith('+')) text += '\n';
  return { value: text.trim() === '' ? '' : text, next: i };
}

/** Parse a YAML mapping block (top level or one nested level). */
function parseMapping(lines, start, end, baseIndent) {
  const data = {};
  let i = start;
  while (i < end) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#') || indentOf(line) < baseIndent) {
      i++;
      continue;
    }
    if (indentOf(line) > baseIndent) {
      i++;
      continue;
    }
    const match = line.trim().match(/^([^:]+?):(?:\s+(.*)|\s*)$/);
    if (!match) {
      i++;
      continue;
    }
    const key = match[1].trim().replace(/^["']|["']$/g, '');
    const rest = (match[2] || '').trim();

    if (/^[>|][+-]?$/.test(rest)) {
      const { value, next } = readBlockScalar(lines, i + 1, rest, baseIndent);
      data[key] = value;
      i = next;
      continue;
    }

    if (rest === '') {
      // Look ahead: indented list or nested map
      let j = i + 1;
      while (j < end && lines[j].trim() === '') j++;
      if (j < end && indentOf(lines[j]) > baseIndent) {
        const childIndent = indentOf(lines[j]);
        let k = j;
        while (k < end && (lines[k].trim() === '' || indentOf(lines[k]) >= childIndent)) k++;
        if (lines[j].trim().startsWith('- ') || lines[j].trim() === '-') {
          data[key] = lines.slice(j, k)
            .filter(l => l.trim().startsWith('-'))
            .map(l => unquote(l.trim().slice(1)));
        } else {
          data[key] = parseMapping(lines, j, k, childIndent);
        }
        i = k;
        continue;
      }
      data[key] = '';
      i++;
      continue;
    }

    data[key] = parseScalarOrList(rest);
    i++;
  }
  return data;
}

/**
 * Split a markdown file into frontmatter data and body.
 * Returns { data, content, hasFrontmatter }.
 */
export function parseFrontmatter(raw) {
  const text = String(raw || '').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---')) return { data: {}, content: text, hasFrontmatter: false };

  const endIdx = text.indexOf('\n---', 3);
  if (endIdx === -1) return { data: {}, content: text, hasFrontmatter: false };

  const header = text.slice(3, endIdx).replace(/^\n/, '');
  const afterFence = text.indexOf('\n', endIdx + 4);
  const body = afterFence === -1 ? '' : text.slice(afterFence + 1);
  const lines = header.split('\n');

  // Exact source text of each top-level field, for lossless round-trips of
  // structures deeper than this reader understands
  const rawFields = {};
  let current = null;
  for (const line of lines) {
    const top = line.match(/^([^\s#:][^:]*):(\s|$)/);
    if (top) {
      current = top[1].trim();
      rawFields[current] = [line];
    } else if (current) {
      rawFields[current].push(line);
    }
  }
  for (const key of Object.keys(rawFields)) rawFields[key] = rawFields[key].join('\n').replace(/\s+$/, '');

  return {
    data: parseMapping(lines, 0, lines.length, 0),
    content: body.replace(/^\n+/, '').replace(/\s+$/, ''),
    hasFrontmatter: true,
    raw: rawFields
  };
}

const quote = (value) => JSON.stringify(String(value));

/**
 * Write frontmatter + body. Values are always double-quoted strings, lists are
 * inline, and plain objects become one-level nested maps (e.g. `metadata`).
 */
export function stringifyFrontmatter(data, content = '') {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(quote).join(', ')}]`);
    } else if (typeof value === 'object') {
      const entries = Object.entries(value).filter(([, v]) => v !== undefined && v !== null && v !== '');
      if (entries.length === 0) continue;
      lines.push(`${key}:`);
      for (const [k, v] of entries) lines.push(`  ${k}: ${quote(v)}`);
    } else {
      lines.push(`${key}: ${quote(value)}`);
    }
  }
  lines.push('---', '');
  return `${lines.join('\n')}\n${String(content).replace(/^\n+/, '').replace(/\s+$/, '')}\n`;
}
