// Serves the blog (/blog.html and /blog): the site's own blog.html with
// NexoFlow's published posts merged into its grid, newest first.
const {
  PAGE_SIZE,
  listPosts,
  getStructuredData,
  structuredDataScript,
  totalPages,
  readSiteFile,
  isExistingPage,
  postPath,
  escapeHtml,
  formatCardDate,
  cacheHeaders,
} = require('../_lib/nexoflow');

const CARD_PATTERN = /<article class="blog-card">[\s\S]*?<\/article>/g;

function renderCard(post) {
  const image = post.featuredImageUrl
    ? `
            <div class="blog-image">
              <img src="${escapeHtml(post.featuredImageUrl)}" width="400" height="200" loading="lazy" alt="${escapeHtml(post.title)}" />
            </div>`
    : '';
  const excerpt = post.excerpt ? `\n              <p>${escapeHtml(post.excerpt)}</p>` : '';
  return `<article class="blog-card">
          <a href="${postPath(post)}" class="blog-card-link">${image}
            <div class="blog-content">
              <div class="blog-meta">
                <span class="blog-date">${escapeHtml(formatCardDate(post.publishedAt))}</span>
              </div>
              <h3>${escapeHtml(post.title)}</h3>${excerpt}
              <span class="read-more">Read More</span>
            </div>
          </a>
        </article>`;
}

function renderPagination(page, pages) {
  if (pages <= 1) return '';
  const href = (n) => (n === 1 ? '/blog.html' : `/blog.html?page=${n}`);
  const links = [];
  if (page > 1) links.push(`<a href="${href(page - 1)}" class="prev-page">← Previous</a>`);
  for (let n = 1; n <= pages; n++) {
    links.push(n === page ? `<span class="current-page" aria-current="page">${n}</span>` : `<a href="${href(n)}">${n}</a>`);
  }
  if (page < pages) links.push(`<a href="${href(page + 1)}" class="next-page">Next →</a>`);
  return `
      <nav class="blog-pagination" aria-label="Blog pages">
        ${links.join('\n        ')}
      </nav>
`;
}

function cardTime(cardHtml) {
  const match = cardHtml.match(/class="blog-date">([^<]+)</);
  const time = match ? Date.parse(match[1].trim()) : NaN;
  return isNaN(time) ? 0 : time;
}

module.exports = async (req, res) => {
  const template = readSiteFile('blog.html');
  if (!template) {
    res.statusCode = 500;
    res.end('Blog unavailable');
    return;
  }

  const requested = parseInt((req.query && req.query.page) || '1', 10);
  const page = requested > 0 ? requested : 1;

  const result = await listPosts(page, PAGE_SIZE);
  const nexoflowPosts = result ? result.posts.filter((post) => post && post.slug && !isExistingPage(post.slug)) : [];
  const pages = result ? totalPages(result.pagination, PAGE_SIZE) : 1;

  if (page > 1 && nexoflowPosts.length === 0) {
    res.statusCode = 404;
    cacheHeaders(res, Boolean(result));
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<!DOCTYPE html><title>Page not found</title><p>Page not found. <a href="/blog.html">Back to the blog</a></p>');
    return;
  }

  const existingCards = template.match(CARD_PATTERN) || [];
  if (!existingCards.length) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(template);
    return;
  }
  const firstCard = template.indexOf(existingCards[0]);
  const lastCard = template.lastIndexOf(existingCards[existingCards.length - 1]) + existingCards[existingCards.length - 1].length;

  // The site's own posts all stay on the first page; NexoFlow's posts follow its pagination.
  const cards = (page === 1 ? existingCards.map((html, index) => ({ html, time: cardTime(html), index })) : []).concat(
    nexoflowPosts.map((post, index) => ({
      html: renderCard(post),
      time: Date.parse(post.publishedAt) || 0,
      index: existingCards.length + index,
    }))
  );
  cards.sort((a, b) => b.time - a.time || a.index - b.index);

  const grid = cards.length ? cards.map((card) => card.html).join('\n        ') : '<p>No posts yet.</p>';
  let html = template.slice(0, firstCard) + grid + template.slice(lastCard);

  // Page links go at the end of the blog posts section, below the grid.
  const sectionEnd = html.indexOf('</section>', html.indexOf('id="blog-posts"'));
  html = html.slice(0, sectionEnd) + renderPagination(page, pages) + html.slice(sectionEnd);

  // NexoFlow's markup for the blog page, at its address /blog.html (also served at /blog).
  if (page === 1) {
    const structuredData = (await getStructuredData('/blog.html')) || (await getStructuredData('/blog'));
    const headEnd = html.indexOf('</head>');
    if (structuredData && headEnd !== -1) {
      html = html.slice(0, headEnd) + `  ${structuredDataScript(structuredData)}\n` + html.slice(headEnd);
    }
  }

  if (page > 1) {
    html = html.replace(/<title>([^<]*)<\/title>/, (match, title) => `<title>${title} – Page ${page}</title>`);
  }

  res.statusCode = 200;
  cacheHeaders(res, Boolean(result));
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
};
