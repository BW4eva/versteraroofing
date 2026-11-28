// Serves a NexoFlow post at /{slug}, in the layout of the site's own article pages.
// Only slugs NexoFlow returns get a page; everything else answers 404.
const {
  SITE_URL,
  getPost,
  getStructuredData,
  structuredDataScript,
  readSiteFile,
  isExistingPage,
  escapeHtml,
  formatArticleDate,
  cacheHeaders,
} = require('../_lib/nexoflow');

// Pieces shared with the blog page, taken from blog.html so they stay in one place.
function blogSection(pattern) {
  const blog = readSiteFile('blog.html') || '';
  const match = blog.match(pattern);
  return match ? match[0] : '';
}

function jsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
}

function renderPage({ title, description, robots, canonical, styles, body, schema, structuredData }) {
  const metaPixel = blogSection(/<!-- Meta Pixel Code -->[\s\S]*?<!-- End Meta Pixel Code -->/);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  ${description ? `<meta name="description" content="${escapeHtml(description)}">` : ''}
  ${robots ? `<meta name="robots" content="${robots}">` : ''}
  <title>${escapeHtml(title)}</title>
  ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ''}
  <link rel="stylesheet" href="/style.css" />
  <link rel="icon" type="image/x-icon" href="/assets/logo_pix/logo.ico" />
  ${styles ? `<style>${styles.replace(/<\/style/gi, '<\\/style')}</style>` : ''}

  ${metaPixel}
  ${schema ? `<script type="application/ld+json">\n${jsonLd(schema)}\n</script>` : ''}
  ${structuredDataScript(structuredData)}
</head>

<body>

  <!-- Header loaded via JS -->
  <header></header>
${body}
  <!-- Footer loaded via JS -->
  <footer></footer>

  <script src="/js/navigation.js"></script>
  <script src="/js/footer.js"></script>

</body>
</html>
`;
}

function notFound(res, cacheable) {
  const body = `
  <section class="hero article-hero">
    <picture class="hero-background">
      <img src="/assets/redshingles3.webp" alt="" fetchpriority="high">
    </picture>
    <div class="container">
      <h1>Page Not Found</h1>
      <p>The page you are looking for is not here. <a href="/blog.html">Browse our roofing blog</a> or <a href="/index.html">go to the home page</a>.</p>
    </div>
  </section>
`;
  res.statusCode = 404;
  cacheHeaders(res, cacheable);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(renderPage({ title: 'Page Not Found | Verstera Roofing', robots: 'noindex', body }));
}

function slugFromRequest(req) {
  if (req.query && typeof req.query.slug === 'string') return req.query.slug;
  const pathname = new URL(req.url, 'http://localhost').pathname;
  return decodeURIComponent(pathname.replace(/^\/+|\/+$/g, ''));
}

module.exports = async (req, res) => {
  const slug = slugFromRequest(req);
  if (!slug || isExistingPage(slug)) {
    notFound(res, true);
    return;
  }

  const post = await getPost(slug);
  if (!post || !post.slug || !post.content) {
    notFound(res, true);
    return;
  }

  const title = post.metaTitle || `${post.title} | Verstera Roofing`;
  const description = post.metaDescription || post.excerpt || '';
  const robots = [post.noIndex ? 'noindex' : '', post.noFollow ? 'nofollow' : ''].filter(Boolean).join(', ');
  const canonical = `${SITE_URL}/${encodeURIComponent(post.slug)}`;
  const published = formatArticleDate(post.publishedAt);

  const heroImage = post.featuredImageUrl
    ? `<img src="${escapeHtml(post.featuredImageUrl)}" alt="${escapeHtml(post.title)}" width="1600" height="900" fetchpriority="high">`
    : '<img src="/assets/redshingles3.webp" alt="" fetchpriority="high">';

  const cta = blogSection(/<section class="cta-section">[\s\S]*?<\/section>/);

  const body = `
  <!-- Article Hero Section -->
  <section class="hero article-hero">
    <picture class="hero-background">
      ${heroImage}
    </picture>
    <div class="container">
      <h1>${escapeHtml(post.title)}</h1>
      ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ''}
      ${published ? `<p class="article-meta">Published: <time datetime="${escapeHtml(post.publishedAt)}">${published}</time></p>` : ''}
    </div>
  </section>

  <!-- Article Content -->
  <section class="article-content">
    <div class="container">
      <div class="article-body nexoflow-content">
        ${post.content}
      </div>
    </div>
  </section>

  ${cta}
`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: description || undefined,
    image: post.featuredImageUrl || undefined,
    author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Verstera Roofing', url: SITE_URL },
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Verstera Roofing' },
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  // NexoFlow's markup for this page; null (nothing rendered) without a key or an answer.
  const structuredData = await getStructuredData('/' + post.slug);

  res.statusCode = 200;
  cacheHeaders(res, true);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (robots) res.setHeader('X-Robots-Tag', robots);
  res.end(renderPage({ title, description, robots, canonical, styles: post.contentStyles, body, schema, structuredData }));
};
