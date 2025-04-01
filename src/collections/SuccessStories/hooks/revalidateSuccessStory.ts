import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { SuccessStory } from '../../../payload-types'

export const revalidateSuccessStory: CollectionAfterChangeHook<SuccessStory> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info('Revalidating success story pages')
      revalidatePath('/success-stories')
      if (doc.slug) {
        revalidatePath(`/success-stories/${doc.slug}`)
      }
      revalidateTag('success-stories-sitemap')
    }

    // If the story was previously published but now isn't, revalidate
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      payload.logger.info('Success story unpublished: Revalidating pages')
      revalidatePath('/success-stories')
      if (doc.slug) {
        revalidatePath(`/success-stories/${doc.slug}`)
      }
      revalidateTag('success-stories-sitemap')
    }
  }
  return doc
}

export const revalidateSuccessStoryAfterDelete: CollectionAfterDeleteHook<SuccessStory> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    payload.logger.info('Success story deleted: Revalidating pages')
    revalidatePath('/success-stories')
    revalidateTag('success-stories-sitemap')
  }
  return doc
}