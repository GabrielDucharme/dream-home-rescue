import type { Dog, FundingEvent, Post } from '../payload-types'
import { getServerSideURL } from './getURL'

/**
 * Generates NonprofitOrganization schema
 */
export const generateOrganizationSchema = () => {
  const url = getServerSideURL()
  
  return {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    name: 'Dream Home Rescue',
    url: url,
    logo: `${url}/favicon.svg`,
    sameAs: [
      'https://www.facebook.com/dreamhomerescue',
      'https://www.instagram.com/dreamhomerescue'
    ],
    description: 'Dream Home Rescue est un organisme à but non lucratif dédié au sauvetage et à l\'adoption de chiens.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Montreal',
      addressRegion: 'QC',
      addressCountry: 'CA'
    }
  }
}

/**
 * Generates Article schema for blog posts
 */
export const generateArticleSchema = (post: Partial<Post>) => {
  const url = getServerSideURL()
  
  if (!post || !post.title || !post.slug) return null
  
  const postUrl = `${url}/posts/${post.slug}`
  
  // Get hero image
  let imageUrl = `${url}/website-template-OG.webp` // Default image
  if (post.heroImage && typeof post.heroImage === 'object' && 'url' in post.heroImage) {
    imageUrl = `${url}${post.heroImage.url}`
  } else if (post.meta?.image && typeof post.meta.image === 'object' && 'url' in post.meta.image) {
    imageUrl = `${url}${post.meta.image.url}`
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: 'Dream Home Rescue'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dream Home Rescue',
      logo: {
        '@type': 'ImageObject',
        url: `${url}/favicon.svg`
      }
    },
    url: postUrl,
    datePublished: post.publishedAt || post.createdAt || new Date().toISOString(),
    dateModified: post.updatedAt || new Date().toISOString(),
    description: post.meta?.description || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    }
  }
}

/**
 * Generates Event schema
 */
export const generateEventSchema = (event: Partial<FundingEvent>) => {
  const url = getServerSideURL()
  
  if (!event || !event.title || !event.slug || !event.eventDate) return null
  
  const eventUrl = `${url}/evenements/${event.slug}`
  
  // Get image
  let imageUrl = `${url}/website-template-OG.webp`
  if (event.mainImage && typeof event.mainImage === 'object' && 'url' in event.mainImage) {
    imageUrl = `${url}${event.mainImage.url}`
  }
  
  // Format location
  let location = {}
  if (event.location && typeof event.location === 'object') {
    location = {
      '@type': 'Place',
      name: event.location.name || '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.address || '',
        addressLocality: event.location.city || '',
        postalCode: event.location.postalCode || ''
      }
    }
  }
  
  // Format dates in ISO format for schema
  const startDate = event.eventDate ? new Date(event.eventDate).toISOString() : null
  const endDate = event.endDate ? new Date(event.endDate).toISOString() : startDate
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: startDate,
    endDate: endDate,
    image: imageUrl,
    description: event.shortDescription || event.meta?.description || '',
    location,
    organizer: {
      '@type': 'Organization',
      name: 'Dream Home Rescue',
      url: url
    },
    url: eventUrl
  }
}

/**
 * Generates AnimalShelter schema for dog listings
 */
export const generateDogSchema = (dog: Partial<Dog>) => {
  const url = getServerSideURL()
  
  if (!dog || !dog.name || !dog.slug) return null
  
  const dogUrl = `${url}/dogs/${dog.slug}`
  
  // Get main image
  let imageUrl = `${url}/website-template-OG.webp`
  if (dog.mainImage && typeof dog.mainImage === 'object' && 'url' in dog.mainImage) {
    imageUrl = `${url}${dog.mainImage.url}`
  }
  
  // Format age for display
  let ageText = ''
  if (dog.age && typeof dog.age === 'object') {
    const years = dog.age.years || 0
    const months = dog.age.months || 0
    
    if (years > 0) {
      ageText = years === 1 ? '1 an' : `${years} ans`
      if (months > 0) {
        ageText += months === 1 ? ' et 1 mois' : ` et ${months} mois`
      }
    } else if (months > 0) {
      ageText = months === 1 ? '1 mois' : `${months} mois`
    }
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${dog.name} - ${dog.breed} pour adoption`,
    image: imageUrl,
    description: dog.metaDescription || `${dog.name} est un ${dog.breed} de ${ageText}.`,
    offers: {
      '@type': 'Offer',
      availability: dog.status === 'available' ? 'InStock' : 'OutOfStock',
      price: '0',
      priceCurrency: 'CAD',
      url: dogUrl
    }
  }
}