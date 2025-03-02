import type { GlobalAfterChangeHook } from 'payload'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Header updated - revalidation may be needed for global_header`)
  }

  return doc
}