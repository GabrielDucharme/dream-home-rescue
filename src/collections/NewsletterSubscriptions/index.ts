import type { CollectionConfig } from 'payload'

export const NewsletterSubscriptions: CollectionConfig = {
  slug: 'newsletter-subscriptions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'createdAt'],
    group: 'Marketing',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return false
    },
    create: () => true, // Allow public submissions
    update: ({ req: { user } }) => {
      if (user) return true
      return false
    },
    delete: ({ req: { user } }) => {
      if (user) return true
      return false
    },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        placeholder: 'subscriber@example.com',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      admin: {
        placeholder: 'John',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        placeholder: 'Doe',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Unsubscribed',
          value: 'unsubscribed',
        },
        {
          label: 'Bounced',
          value: 'bounced',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website',
      admin: {
        position: 'sidebar',
        description: 'Where the subscription came from',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.status === 'unsubscribed',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Capture IP and user agent on creation
        if (operation === 'create') {
          const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || ''
          const userAgent = req.headers['user-agent'] || ''

          return {
            ...data,
            ipAddress: Array.isArray(ip) ? ip[0] : ip,
            userAgent: userAgent,
          }
        }

        // Update unsubscribedAt when status changes to unsubscribed
        if (operation === 'update' && data.status === 'unsubscribed' && !data.unsubscribedAt) {
          return {
            ...data,
            unsubscribedAt: new Date().toISOString(),
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
  labels: {
    singular: 'Newsletter Subscription',
    plural: 'Newsletter Subscriptions',
  },
}
