import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      payload.logger.info(`Page published - revalidation may be needed for path: ${path}`)
    }

    // If the page was previously published, we need to log the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
      payload.logger.info(`Page unpublished - revalidation may be needed for old path: ${oldPath}`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    payload.logger.info(`Page deleted - revalidation may be needed for path: ${path}`)
  }

  return doc
}