/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.BASE_URL || 'http://localhost:3000';
const apiBase = process.env.NEXT_PUBLIC_KEYLOG_API_URL || '';
const shouldFetchPosts = process.env.SKIP_SITEMAP_FETCH !== '1' && !!apiBase;

const transformStringDateToDate = str => {
  if (!str || typeof str !== 'string') return null;
  const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(str);
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m;
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)));
  return isNaN(date.getTime()) ? null : date;
};

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 40000,
  transform: async (config, url) => {
    return {
      loc: url,
      changefreq: 'daily',
      priority: url === '/' || url.startsWith('/home') ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
  additionalPaths: async config => {
    if (!shouldFetchPosts) return [];

    try {
      // Short timeout to avoid noisy failures locally
      const controller = new AbortController();
      const timeoutMs = Number(process.env.SITEMAP_FETCH_TIMEOUT_MS || '2000');
      const to = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(`${apiBase}/post?tempYn=N&perPage=100000&currPageNum=1`, { signal: controller.signal });
      clearTimeout(to);
      const json = await res.json();
      const posts = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

      return posts.map(p => {
        const lastmodDate =
          transformStringDateToDate(p.amntDttm) || transformStringDateToDate(p.rgsnDttm) || new Date();
        return {
          loc: `/${p.authorId}/${p.postId}`,
          lastmod: lastmodDate.toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        };
      });
    } catch {
      return [];
    }
  },
};
