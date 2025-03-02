import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Dog } from '../../../payload-types'

/**
 * Revalidates the home page when a dog is created, updated, or deleted
 * This ensures that components like AvailableDogs are updated on the home page
 */
export const revalidateHome: CollectionAfterChangeHook<Dog> = ({
  doc,
  previousDoc,
  req: { payload, context },
  operation,
}) => {
  if (!context?.disableRevalidate) {
    // Status changes that require revalidation
    if (doc._status === 'published' || (previousDoc?._status === 'published' && doc._status !== 'published')) {
      payload.logger.info(`Dog ${operation === 'create' ? 'created' : 'updated'}: Revalidating home page`)
      
      // Revalidate the home page path
      revalidatePath('/')
      
      // Also revalidate the dogs page and dog's individual page
      revalidatePath('/dogs')
      if (doc.slug) {
        revalidatePath(`/dogs/${doc.slug}`)
      }
    }
  }
  
  return doc
}

export const revalidateHomeAfterDelete: CollectionAfterDeleteHook<Dog> = ({ 
  doc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    payload.logger.info('Dog deleted: Revalidating home page')
    
    // Revalidate the home page path
    revalidatePath('/')
    
    // Also revalidate the dogs page
    revalidatePath('/dogs')
    
    // Revalidate the dog tags for sitemaps
    revalidateTag('dogs-sitemap')
  }
  
  return doc
}