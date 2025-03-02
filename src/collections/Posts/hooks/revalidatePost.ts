import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`
      payload.logger.info(`Post published - revalidation may be needed for path: ${path}`)
    }

    // If the post was previously published, we need to log the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`
      payload.logger.info(`Post unpublished - revalidation may be needed for old path: ${oldPath}`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`
    payload.logger.info(`Post deleted - revalidation may be needed for path: ${path}`)
  }

  return doc
}