// Builds the site for GitHub Pages with NexoFlow's posts baked in.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, '_site');
const SKIP = new Set(['.git', '.github', '.vscode', '_site', 'api', 'scripts', 'vercel.json', 'node_modules']);

const nexoflow = require(path.join(ROOT, 'api/_lib/nexoflow'));
const blogHandler = require(path.join(ROOT, 'api/nexoflow/blog'));
const postHandler = require(path.join(ROOT, 'api/nexoflow/post'));
const sitemapHandler = require(path.join(ROOT, 'api/nexoflow/sitemap'));

function copySite(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (from === ROOT && SKIP.has(entry.name)) continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copySite(src, dest);
    else if (entry.isFile()) fs.copyFileSync(src, dest);
  }
}

async function render(handler, url, query = {}) {
  let body = '';
  const res = {
    statusCode: 200,
    setHeader() {},
    end(chunk) { body = chunk == null ? '' : String(chunk); },
  };
  await handler({ url, query }, res);
  return { status: res.statusCode, body };
}

function write(relative, content) {
  const file = path.join(OUT, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function staticPageLinks(html) {
  return html.replace(/\/blog\.html\?page=(\d+)/g, '/blog-page-$1.html');
}

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  copySite(ROOT, OUT);

  const health = await nexoflow.checkConnection();
  const healthJson = JSON.stringify({ ok: health.connected, provider: 'nexoflow', ...health, checkedAt: new Date().toISOString() });
  write('api/nexoflow/health.json', healthJson + '\n');
  write('api/nexoflow/health.html', `<!DOCTYPE html><meta charset="utf-8"><meta name="robots" content="noindex"><title>NexoFlow health</title><pre>${nexoflow.escapeHtml(healthJson)}</pre>\n`);

  if (!health.configured) {
    console.error('::error::NEXOFLOW_API_KEY is empty. Add it under Settings > Secrets and variables > Actions > Secrets (name: NEXOFLOW_API_KEY).');
    process.exit(1);
  }
  if (!health.connected) {
    console.warn('::warning::Could not reach NexoFlow with the API key provided. The site is deployed without NexoFlow posts. Check that the key is correct.');
    return;
  }

  const first = await render(blogHandler, '/blog.html', { page: '1' });
  write('blog.html', staticPageLinks(first.body));
  const firstList = await nexoflow.listPosts(1, nexoflow.PAGE_SIZE);
  const pages = firstList ? nexoflow.totalPages(firstList.pagination, nexoflow.PAGE_SIZE) : 1;
  for (let page = 2; page <= pages; page++) {
    const result = await render(blogHandler, `/blog.html?page=${page}`, { page: String(page) });
    if (result.status === 200) write(`blog-page-${page}.html`, staticPageLinks(result.body));
  }

  const posts = (await nexoflow.listAllPosts()).filter((post) => post && post.slug && !nexoflow.isExistingPage(post.slug));
  let written = 0;
  for (const post of posts) {
    const result = await render(postHandler, '/' + post.slug, { slug: post.slug });
    if (result.status === 200) {
      write(`${post.slug}.html`, result.body);
      written++;
    } else {
      console.warn(`::warning::NexoFlow post "${post.slug}" could not be loaded and was skipped.`);
    }
  }

  const sitemap = await render(sitemapHandler, '/sitemap.xml');
  write('sitemap.xml', sitemap.body);

  console.log(`NexoFlow: published ${written} post(s) across ${pages} blog page(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
