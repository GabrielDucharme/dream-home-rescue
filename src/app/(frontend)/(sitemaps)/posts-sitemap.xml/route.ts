import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((post) => Boolean(post?.slug))
          .map((post) => {
            // Convert updatedAt string to Date object for comparison
            const updatedAt = new Date(post.updatedAt || dateFallback)
            const now = new Date()
            
            // Calculate difference in days
            const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24))
            
            // Set change frequency based on post age
            let changefreq = 'monthly'
            if (daysSinceUpdate < 7) {
              changefreq = 'daily'  // New posts change more frequently
            } else if (daysSinceUpdate < 30) {
              changefreq = 'weekly'  // Recent posts
            }
            
            // Set priority based on recency
            let priority = 0.6  // Default for older posts
            if (daysSinceUpdate < 7) {
              priority = 0.8  // Higher priority for newer posts
            } else if (daysSinceUpdate < 30) {
              priority = 0.7  // Medium priority for recent posts
            }
            
            return {
              loc: `${SITE_URL}/posts/${post?.slug}`,
              lastmod: post.updatedAt || dateFallback,
              priority,
              changefreq,
            }
          })
      : []

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
