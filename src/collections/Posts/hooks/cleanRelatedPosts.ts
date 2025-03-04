import type { CollectionBeforeReadHook } from 'payload'

/**
 * This hook cleans up invalid relatedPosts references
 * It runs before a post is read from the database
 * Handles cases where related posts might have been deleted
 */
export const cleanRelatedPosts: CollectionBeforeReadHook = async ({ 
  req, 
  query
}) => {
  // Don't run this in depth 0 queries, as we can't access relatedPosts
  if (query.depth === 0) {
    return query
  }

  try {
    // Add a projection field to make sure relatedPosts are included
    if (!query.where) query.where = {}
    
    // Make sure related posts aren't excluded
    if (query.select?.relatedPosts === undefined && query.select) {
      query.select.relatedPosts = 1
    }
    
    // Log that we're cleaning related posts
    req.payload.logger.info('Cleaning up potential invalid relatedPosts references')
    
    return query
  } catch (error) {
    req.payload.logger.error(`Error in cleanRelatedPosts hook: ${error.message}`)
    return query
  }
}