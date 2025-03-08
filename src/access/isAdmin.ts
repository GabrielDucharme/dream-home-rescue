import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type IsAdmin = (args: AccessArgs<any>) => boolean

export const isAdmin: IsAdmin = ({ req: { user } }) => {
  // The admin property from payload admin
  return Boolean(user?.collection === 'users')
}