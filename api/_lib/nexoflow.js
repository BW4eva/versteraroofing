// Server-only helper for NexoFlow's Content API.
// The key is read from the environment here and never leaves the server.
const fs = require('fs');
const path = require('path');

const DEFAULT_API_URL = 'https://nexoflow.net';
const SITE_URL = 'https://versteraroofing.com';
const REVALIDATE_SECONDS = 300; // refresh NexoFlow data at most every 5 minutes
const PAGE_SIZE = 12;

const cache = new Map();

function getConfig() {
  const apiKey = process.env.NEXOFLOW_API_KEY || '';
  const apiUrl = (process.env.NEXOFLOW_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');
  return { apiKey, apiUrl };
}

async function request(pathname) {
  const { apiKey, apiUrl } = getConfig();
  if (!apiKey) return { ok: false, status: 0, data: null };
  try {
    const res = await fetch(apiUrl + pathname, {
      headers: { Authorization: 'Bearer ' + apiKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    const data = res.ok ? await res.json() : null;
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: null };
  }
}

// Successful answers are kept for REVALIDATE_SECONDS; failures are not kept.
async function cached(cacheKey, load) {
  const hit = cache.get(cacheKey);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await load();
  if (value.ok || value.status === 404) {
    cache.set(cacheKey, { value, expires: Date.now() + REVALIDATE_SECONDS * 1000 });
  }
  return value;
}

// One page of published posts: { posts, pagination } or null when NexoFlow is unavailable.
async function listPosts(page = 1, limit = PAGE_SIZE) {
  const pathname = `/api/v1/content/posts?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;
  const result = await cached('list:' + pathname, () => request(pathname));
  if (!result.ok || !result.data) return null;
  return {
    posts: Array.isArray(result.data.posts) ? result.data.posts : [],
    pagination: result.data.pagination || {},
  };
}

// Every published post, following the list's pagination (for the sitemap).
async function listAllPosts(maxPages = 50) {
  const all = [];
  for (let page = 1; page <= maxPages; page++) {
    const result = await listPosts(page, PAGE_SIZE);
    if (!result) break;
    all.push(...result.posts);
    if (page >= totalPages(result.pagination, PAGE_SIZE) || result.posts.length < PAGE_SIZE) break;
  }
  return all;
}

// One post with its HTML content, or null (unknown slug or NexoFlow unavailable).
async function getPost(slug) {
  const pathname = `/api/v1/content/posts/${encodeURIComponent(slug)}?format=html`;
  const result = await cached('post:' + pathname, () => request(pathname));
  if (!result.ok || !result.data) return null;
  return result.data.post || result.data;
}

// Uncached check used by /api/nexoflow/health.
async function checkConnection() {
  const { apiKey } = getConfig();
  const configured = Boolean(apiKey);
  if (!configured) return { configured, connected: false };
  const result = await request('/api/v1/content/posts?page=1&limit=1');
  return { configured, connected: result.ok };
}

function totalPages(pagination, limit) {
  if (!pagination) return 1;
  const pages = Number(pagination.totalPages || pagination.pages);
  if (pages > 0) return pages;
  const total = Number(pagination.total || pagination.totalPosts);
  if (total > 0) return Math.ceil(total / (Number(pagination.limit) || limit));
  return pagination.hasNextPage || pagination.hasMore ? Number(pagination.page || 1) + 1 : 1;
}

// --- Site files the blog functions build on ---

function readSiteFile(name) {
  try {
    return fs.readFileSync(path.join(process.cwd(), name), 'utf8');
  } catch (err) {
    return null;
  }
}

// A NexoFlow post whose slug matches an existing page of the site is left out:
// the existing page stays at its address.
function isExistingPage(slug) {
  if (!/^[A-Za-z0-9_-]+$/.test(slug)) return true;
  return (
    fs.existsSync(path.join(process.cwd(), slug + '.html')) ||
    fs.existsSync(path.join(process.cwd(), 'blog', slug + '.html'))
  );
}

function postPath(post) {
  return '/' + encodeURIComponent(post.slug);
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// "Oct 25, 2026", as the blog cards show dates
function formatCardDate(value) {
  const date = new Date(value);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// "2 Feb 2026", as the article pages show dates
function formatArticleDate(value) {
  const date = new Date(value);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function cacheHeaders(res, ok) {
  res.setHeader(
    'Cache-Control',
    ok ? `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=60` : 'public, s-maxage=60'
  );
}

module.exports = {
  SITE_URL,
  PAGE_SIZE,
  listPosts,
  listAllPosts,
  getPost,
  checkConnection,
  totalPages,
  readSiteFile,
  isExistingPage,
  postPath,
  escapeHtml,
  formatCardDate,
  formatArticleDate,
  cacheHeaders,
};
