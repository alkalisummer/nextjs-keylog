/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.BASE_URL || 'http://localhost:3000';
const apiBase = process.env.NEXT_PUBLIC_KEYLOG_API_URL || '';

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
    try {
      const res = await fetch(`${apiBase}/post?tempYn=N&perPage=100000&currPageNum=1`);
      const json = await res.json();
      const posts = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

      return posts.map(p => {
        return {
          loc: `/${p.authorId}/${p.postId}`,
          lastmod: new Date(p.amntDttm || p.rgsnDttm || Date.now()).toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        };
      });
    } catch (e) {
      console.error('next-sitemap additionalPaths error', e);
      return [];
    }
  },
};
