import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getDogsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'dogs',
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

    // Add the main dogs page
    const defaultSitemap = [
      {
        loc: `${SITE_URL}/dogs`,
        lastmod: dateFallback,
        // Set higher priority and more frequent change rate for the main dogs page
        priority: 0.9,
        changefreq: 'daily',
      },
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((dog) => Boolean(dog?.slug))
          .map((dog) => ({
            loc: `${SITE_URL}/dogs/${dog?.slug}`,
            lastmod: dog.updatedAt || dateFallback,
            // Set high priority for individual dog pages
            priority: 0.8,
            changefreq: 'daily',
          }))
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['dogs-sitemap'],
  {
    tags: ['dogs-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getDogsSitemap()

  return getServerSideSitemap(sitemap)
}