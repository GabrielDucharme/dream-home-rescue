import { CollectionConfig } from 'payload/types'
import { isAdmin } from '../access/isAdmin'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
    group: 'Dons',
  },
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    create: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Adresse e-mail',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
    {
      name: 'donations',
      type: 'relationship',
      relationTo: 'donations',
      hasMany: true,
      label: 'Dons',
    },
    {
      name: 'sponsoredDogs',
      type: 'relationship',
      relationTo: 'dogs',
      hasMany: true,
      label: 'Chiens parrainés',
      admin: {
        description: 'Chiens que ce client parraine via des dons',
      },
    },
    {
      name: 'stripeCustomerID',
      type: 'text',
      label: 'ID Client Stripe',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'totalDonated',
      type: 'number',
      label: 'Total des dons ($)',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: 0,
    },
    {
      name: 'donationCount',
      type: 'number',
      label: 'Nombre de dons',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: 0,
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Date de création',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}