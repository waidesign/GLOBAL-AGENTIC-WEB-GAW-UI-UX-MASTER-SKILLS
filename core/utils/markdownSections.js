/** Small helpers for editing "## heading" sections of Markdown files people also edit. */

/** Find the line range of a "## heading" section: { start, end } (end exclusive) or null. */
export function findSection(lines, heading) {
  const start = lines.findIndex(l => l.trim() === heading);
  if (start === -1) return null;
  let end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  if (end === -1) end = lines.length;
  return { start, end };
}

/** Replace the body of a "## heading" section, or append the section if it is missing. */
export function setSection(content, heading, body) {
  const lines = content.replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n');
  const section = findSection(lines, heading);
  const block = [heading, ...body.split('\n'), ''];
  if (!section) return `${lines.join('\n')}\n\n${block.join('\n')}`;
  lines.splice(section.start, section.end - section.start, ...block);
  return `${lines.join('\n').replace(/\s+$/, '')}\n`;
}

/** Add lines to the end of a "## heading" section, creating the section if it is missing. */
export function appendToSection(content, heading, newLines) {
  const lines = content.replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n');
  const section = findSection(lines, heading);
  if (!section) return `${lines.join('\n')}\n\n${heading}\n${newLines.join('\n')}\n`;

  let insertAt = section.end;
  while (insertAt > section.start + 1 && lines[insertAt - 1].trim() === '') insertAt--;
  lines.splice(insertAt, 0, ...newLines);
  return `${lines.join('\n').replace(/\s+$/, '')}\n`;
}

/** The body text of a section, or '' when missing. */
export function sectionBody(content, heading) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const section = findSection(lines, heading);
  return section ? lines.slice(section.start + 1, section.end).join('\n').trim() : '';
}

/**
 * Rewrite only the sections that exist with exactly these headings (e.g. "## Stack (auto-detected)").
 * A section someone renamed (e.g. to "(confirmed)") or deleted is left alone.
 * Returns { content, changed: [headings] }.
 */
export function refreshSections(content, sections) {
  let out = content;
  const changed = [];
  for (const [heading, body] of Object.entries(sections)) {
    const lines = out.replace(/\r\n/g, '\n').split('\n');
    if (!findSection(lines, heading)) continue;
    const next = setSection(out, heading, body);
    if (next.replace(/\s+$/, '') !== out.replace(/\r\n/g, '\n').replace(/\s+$/, '')) changed.push(heading);
    out = next;
  }
  return { content: out, changed };
}
