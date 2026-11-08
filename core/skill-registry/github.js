/**
 * Minimal GitHub access for importing skills and checking licenses.
 * Uses the public API (60 requests/hour without a token). Set GITHUB_TOKEN
 * for higher limits. Raw file downloads do not count against the API limit.
 */
const API = 'https://api.github.com';
const RAW = 'https://raw.githubusercontent.com';

export class GitHubClient {
  constructor(options = {}) {
    this.fetch = options.fetch || globalThis.fetch;
    this.token = options.token ?? process.env.GITHUB_TOKEN ?? null;
    this.trees = new Map();
    this.repoLicenses = new Map();
  }

  headers() {
    const h = { 'User-Agent': 'GAW-Skills', Accept: 'application/vnd.github+json' };
    if (this.token) h.Authorization = `Bearer ${this.token}`;
    return h;
  }

  /** Every file in a repo: { branch, blobs: [{ path, size }] }, or null. Cached per repo. */
  async tree(repo) {
    if (this.trees.has(repo)) return this.trees.get(repo);
    let result = null;
    for (const branch of ['main', 'master']) {
      try {
        const res = await this.fetch(`${API}/repos/${repo}/git/trees/${branch}?recursive=1`, { headers: this.headers() });
        if (res.status === 403 || res.status === 429) throw new Error('GitHub API rate limit reached. Set GITHUB_TOKEN and try again.');
        if (!res.ok) continue;
        const data = await res.json();
        result = { branch, blobs: (data.tree || []).filter(i => i.type === 'blob').map(i => ({ path: i.path, size: i.size || 0 })) };
        break;
      } catch (err) {
        if (err.message.includes('rate limit')) throw err;
      }
    }
    this.trees.set(repo, result);
    return result;
  }

  /** File text (or Buffer with { binary: true }), or null. */
  async raw(repo, branch, filePath, options = {}) {
    try {
      const res = await this.fetch(`${RAW}/${repo}/${branch}/${filePath.split('/').map(encodeURIComponent).join('/')}`);
      if (!res.ok) return null;
      return options.binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch {
      return null;
    }
  }

  /** Repository license as detected by GitHub: { spdx, name, url } or null. Cached per repo. */
  async repoLicense(repo) {
    if (this.repoLicenses.has(repo)) return this.repoLicenses.get(repo);
    let result = null;
    try {
      const res = await this.fetch(`${API}/repos/${repo}/license`, { headers: this.headers() });
      if (res.status === 403 || res.status === 429) throw new Error('GitHub API rate limit reached. Set GITHUB_TOKEN and try again.');
      if (res.ok) {
        const data = await res.json();
        const text = data.content ? Buffer.from(data.content, 'base64').toString('utf8') : '';
        result = { spdx: data.license?.spdx_id || null, name: data.license?.name || null, url: data.html_url, text };
      }
    } catch (err) {
      if (err.message.includes('rate limit')) throw err;
    }
    this.repoLicenses.set(repo, result);
    return result;
  }
}

/**
 * Parse a GitHub link to a skill: repo root, a folder (tree/...), or a SKILL.md (blob/...).
 * Returns { repo, branch, path } (path '' for the repo root) or null.
 */
export function parseGitHubUrl(url) {
  const m = String(url).trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)(?:\/(tree|blob)\/([^/]+)(?:\/(.*))?)?\/?$/);
  if (!m) return null;
  const [, owner, name, , branch, rest = ''] = m;
  let p = rest.replace(/\/$/, '');
  if (p.endsWith('SKILL.md')) p = p.slice(0, -'SKILL.md'.length).replace(/\/$/, '');
  return { repo: `${owner}/${name.replace(/\.git$/, '')}`, branch: branch || null, path: p };
}
