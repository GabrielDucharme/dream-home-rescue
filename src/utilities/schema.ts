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
  
  // Format dates in ISO format for schema with robust error handling
  // NOTE: Schema.org requires ISO format dates but we need to ensure they're in the correct timezone
  let startDate = null
  let endDate = null
  
  try {
    // Parse start date safely
    if (event.eventDate) {
      // Use original date string which should already have timezone info preserved
      const eventDateObj = new Date(event.eventDate)
      
      // Check if date is valid before using it
      if (!isNaN(eventDateObj.getTime())) {
        // Format with Montreal timezone explicitly for Schema.org
        const dateFormatter = new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Toronto',
          hour12: false
        });
        
        const parts = dateFormatter.formatToParts(eventDateObj);
        const year = parts.find(part => part.type === 'year')?.value;
        const month = parts.find(part => part.type === 'month')?.value;
        const day = parts.find(part => part.type === 'day')?.value;
        const hour = parts.find(part => part.type === 'hour')?.value;
        const minute = parts.find(part => part.type === 'minute')?.value;
        const second = parts.find(part => part.type === 'second')?.value;
        
        // Format with Montreal timezone offset (approximate -04:00 for EDT, -05:00 for EST)
        // For Schema.org, we need to use full ISO format with timezone
        const tzOffset = new Date().toLocaleString('en', { timeZone: 'America/Toronto', timeZoneName: 'short' })
          .split(' ').pop() === 'EDT' ? '-04:00' : '-05:00';
        startDate = `${year}-${month}-${day}T${hour}:${minute}:${second}${tzOffset}`;
      }
    }
    
    // Parse end date safely using same approach
    if (event.endDate) {
      const endDateObj = new Date(event.endDate)
      
      // Check if date is valid before using it
      if (!isNaN(endDateObj.getTime())) {
        // Format with Montreal timezone explicitly
        const dateFormatter = new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Toronto',
          hour12: false
        });
        
        const parts = dateFormatter.formatToParts(endDateObj);
        const year = parts.find(part => part.type === 'year')?.value;
        const month = parts.find(part => part.type === 'month')?.value;
        const day = parts.find(part => part.type === 'day')?.value;
        const hour = parts.find(part => part.type === 'hour')?.value;
        const minute = parts.find(part => part.type === 'minute')?.value;
        const second = parts.find(part => part.type === 'second')?.value;
        
        // Format with Montreal timezone offset
        const tzOffset = new Date().toLocaleString('en', { timeZone: 'America/Toronto', timeZoneName: 'short' })
          .split(' ').pop() === 'EDT' ? '-04:00' : '-05:00';
        endDate = `${year}-${month}-${day}T${hour}:${minute}:${second}${tzOffset}`;
      }
    }
  } catch (error) {
    console.error('Error formatting dates for schema:', error)
  }
  
  // If no valid end date but we have a start date, use start date as fallback
  if (!endDate && startDate) {
    endDate = startDate
  }
  
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