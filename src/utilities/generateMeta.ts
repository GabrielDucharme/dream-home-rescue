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
    
    // Determine the type of content and add appropriate additional data
    if ('layout' in doc) {
      pageType = 'page'
      ogImageUrl.searchParams.set('type', pageType)
      
      // For pages, add a potential subtitle from meta description
      if (doc?.meta?.description) {
        const shortDesc = doc.meta.description.length > 100 
          ? doc.meta.description.substring(0, 97) + '...' 
          : doc.meta.description
        ogImageUrl.searchParams.set('subtitle', shortDesc)
      }
      
    } else if ('publishedAt' in doc) {
      pageType = 'post'
      ogImageUrl.searchParams.set('type', pageType)
      
      // For posts, add publication date and author info
      if (doc.publishedAt) {
        const pubDate = new Date(doc.publishedAt as string).toLocaleDateString('fr-CA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
        
        // Add author information if available
        let extraData = pubDate
        if (doc.authors && Array.isArray(doc.authors) && doc.authors.length > 0) {
          const authorNames = doc.authors
            .filter(author => author && typeof author === 'object' && 'name' in author)
            .map(author => author.name)
            .join(', ')
            
          if (authorNames) {
            extraData += ` • Par ${authorNames}`
          }
        }
        
        ogImageUrl.searchParams.set('extraData', extraData)
      }
      
      // For posts, also add a subtitle from meta description
      if (doc?.meta?.description) {
        const shortDesc = doc.meta.description.length > 100 
          ? doc.meta.description.substring(0, 97) + '...' 
          : doc.meta.description
        ogImageUrl.searchParams.set('subtitle', shortDesc)
      }
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
