import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, stringifyFrontmatter } from '../../core/skill-registry/frontmatter.js';

test('frontmatter - plain, quoted and inline list values', () => {
  const { data, content } = parseFrontmatter('---\nname: pdf\ndescription: "Say \\"hi\\""\nlicense: \'Apache 2.0\'\ntags: [a, "b c"]\n---\n\n# Body\n');
  assert.equal(data.name, 'pdf');
  assert.equal(data.description, 'Say "hi"');
  assert.equal(data.license, 'Apache 2.0');
  assert.deepEqual(data.tags, ['a', 'b c']);
  assert.equal(content, '# Body');
});

test('frontmatter - folded and literal multi-line text (the imported-skill bug)', () => {
  const folded = parseFrontmatter('---\ndescription: >\n  Generate images\n  from text.\n\n  Second paragraph.\nname: x\n---\nbody');
  assert.equal(folded.data.description, 'Generate images from text.\nSecond paragraph.');
  assert.equal(folded.data.name, 'x');

  const literal = parseFrontmatter('---\ndescription: |-\n  line one\n  line two\n---\nbody');
  assert.equal(literal.data.description, 'line one\nline two');
});

test('frontmatter - nested metadata map and dash lists', () => {
  const { data } = parseFrontmatter('---\nname: x\nmetadata:\n  gaw-category: "ui-ux"\n  version: 1.0\nitems:\n  - one\n  - "two"\n---\n');
  assert.deepEqual(data.metadata, { 'gaw-category': 'ui-ux', version: '1.0' });
  assert.deepEqual(data.items, ['one', 'two']);
});

test('frontmatter - CRLF, BOM, and files without frontmatter', () => {
  assert.equal(parseFrontmatter('﻿---\r\nname: x\r\n---\r\nbody').data.name, 'x');
  const none = parseFrontmatter('# Just markdown');
  assert.equal(none.hasFrontmatter, false);
  assert.equal(none.content, '# Just markdown');
});

test('frontmatter - stringify round-trips', () => {
  const data = {
    name: 'pricing-page',
    description: 'Pricing "pages": plans & toggles',
    license: 'MIT',
    metadata: { 'gaw-title': 'Pricing Page', 'gaw-tags': 'pricing, plans' }
  };
  const text = stringifyFrontmatter(data, '# Body\n\nText');
  const parsed = parseFrontmatter(text);
  assert.deepEqual(parsed.data, data);
  assert.equal(parsed.content, '# Body\n\nText');
});
