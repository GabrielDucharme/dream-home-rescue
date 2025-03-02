import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

type GetDocumentArgs = {
  collection: Collection;
  slug?: string;
  query?: Record<string, any>;
  depth?: number;
}

export async function getDocument<T = any>({ 
  collection, 
  slug, 
  query = {}, 
  depth = 0 
}: GetDocumentArgs): Promise<T> {
  const payload = await getPayload({ config: configPromise })

  if (slug) {
    const result = await payload.find({
      collection,
      depth,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs[0] as T
  } else {
    // For fetching multiple documents or with custom query
    const result = await payload.find({
      collection,
      depth,
      ...query,
    })

    return result as unknown as T
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string) =>
  unstable_cache(
    async () => getDocument({ collection, slug }), 
    [collection, slug], 
    {
      tags: [`${collection}_${slug}`],
    }
  )