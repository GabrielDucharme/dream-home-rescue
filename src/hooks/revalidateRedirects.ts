import type { CollectionAfterChangeHook } from 'payload'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Redirects updated - revalidation may be needed for redirects`)
  return doc
}