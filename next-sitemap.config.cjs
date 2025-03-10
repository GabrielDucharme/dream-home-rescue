const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/dogs-sitemap.xml', 
    '/events-sitemap.xml',
    '/success-stories-sitemap.xml',
    '/*', '/posts/*', '/dogs/*', '/evenements/*', '/success-stories/*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        // Allow all bots to access most of the site
        userAgent: '*',
        allow: '/',
      },
      {
        // Disallow admin areas
        userAgent: '*',
        disallow: [
          '/admin/*',
          '/api/*',
          '*/preview/*',
          '*/exit-preview/*',
          '*/seed/*',
        ],
      },
      {
        // Special rules for GPTBot (ChatGPT crawler)
        userAgent: 'GPTBot',
        allow: [
          '/dogs/',
          '/posts/',
          '/evenements/',
          '/success-stories/',
        ],
      },
      {
        // Rules for Google bots - ensure faster indexing for important pages
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        // Rules for Bingbot
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`, 
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/dogs-sitemap.xml`,
      `${SITE_URL}/events-sitemap.xml`,
      `${SITE_URL}/success-stories-sitemap.xml`
    ],
  },
  // Create a sitemap index file for better organization
  sitemapSize: 5000,
  generateIndexSitemap: true,
}
