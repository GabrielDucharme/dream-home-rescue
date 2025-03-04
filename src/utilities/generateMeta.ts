import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const serverUrl = getServerSideURL()
  
  // Create dynamic OG image URL for better social sharing
  const ogImageUrl = new URL(`${serverUrl}/api/og`)
  
  // Set title and type based on document type
  let pageType = 'default'
  
  if (doc) {
    // Set the title for the OG image
    const docTitle = doc?.meta?.title || (doc.title as string) || 'Dream Home Rescue'
    ogImageUrl.searchParams.set('title', docTitle)
    
    // Determine the type of content
    if ('layout' in doc) {
      pageType = 'page'
      ogImageUrl.searchParams.set('type', pageType)
    } else if ('publishedAt' in doc) {
      pageType = 'post'
      ogImageUrl.searchParams.set('type', pageType)
    }
    
    // Add image if available
    if (doc?.meta?.image && typeof doc.meta.image === 'object' && 'url' in doc.meta.image) {
      ogImageUrl.searchParams.set('image', `${serverUrl}${doc.meta.image.url}`)
    }
  }

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Dream Home Rescue'
    : 'Dream Home Rescue'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: doc?.meta?.description || '',
      images: [ogImageUrl.toString()],
    },
    title,
  }
}
