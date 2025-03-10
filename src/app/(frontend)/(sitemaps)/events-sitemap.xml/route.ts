import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getEventsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'fundingEvents',
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
        startDate: true,
      },
    })

    const dateFallback = new Date().toISOString()

    // Add the main events page
    const defaultSitemap = [
      {
        loc: `${SITE_URL}/evenements`,
        lastmod: dateFallback,
        priority: 0.8,
        changefreq: 'weekly',
      },
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((event) => Boolean(event?.slug))
          .map((event) => {
            // Calculate priority based on event date (higher priority for upcoming events)
            const startDate = event.startDate ? new Date(event.startDate) : null
            const now = new Date()
            const isPastEvent = startDate && startDate < now
            
            return {
              loc: `${SITE_URL}/evenements/${event?.slug}`,
              lastmod: event.updatedAt || dateFallback,
              // Lower priority for past events, higher for upcoming
              priority: isPastEvent ? 0.5 : 0.8,
              changefreq: isPastEvent ? 'monthly' : 'weekly',
            }
          })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['events-sitemap'],
  {
    tags: ['events-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getEventsSitemap()

  return getServerSideSitemap(sitemap)
}