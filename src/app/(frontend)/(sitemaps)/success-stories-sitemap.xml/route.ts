import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getSuccessStoriesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'successStories',
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

    // Add the main success stories page
    const defaultSitemap = [
      {
        loc: `${SITE_URL}/success-stories`,
        lastmod: dateFallback,
        priority: 0.85,
        changefreq: 'weekly',
      },
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((story) => Boolean(story?.slug))
          .map((story) => ({
            loc: `${SITE_URL}/success-stories/${story?.slug}`,
            lastmod: story.updatedAt || dateFallback,
            // Success stories are important content for reputation
            priority: 0.75,
            changefreq: 'monthly',
          }))
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['success-stories-sitemap'],
  {
    tags: ['success-stories-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getSuccessStoriesSitemap()

  return getServerSideSitemap(sitemap)
}