// Serves /sitemap.xml: the site's own sitemap.xml with NexoFlow's posts added.
const { SITE_URL, listAllPosts, readSiteFile, isExistingPage, cacheHeaders } = require('../_lib/nexoflow');

function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = async (req, res) => {
  const sitemap = readSiteFile('sitemap.xml') || '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n';
  const posts = await listAllPosts();

  const entries = posts
    .filter((post) => post && post.slug && !isExistingPage(post.slug))
    .map((post) => {
      const date = new Date(post.updatedAt || post.publishedAt);
      const lastmod = isNaN(date) ? '' : `<lastmod>${date.toISOString().slice(0, 10)}</lastmod>`;
      return `  <url><loc>${escapeXml(`${SITE_URL}/${encodeURIComponent(post.slug)}`)}</loc>${lastmod}<priority>0.6</priority></url>\n`;
    })
    .join('');

  const end = sitemap.lastIndexOf('</urlset>');
  const xml = end === -1 ? sitemap : sitemap.slice(0, end) + entries + sitemap.slice(end);

  res.statusCode = 200;
  cacheHeaders(res, true);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.end(xml);
};
