import { CollectionConfig } from 'payload/types'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Partenaire',
    plural: 'Partenaires',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Contenu',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'url',
      type: 'text',
      required: false,
      label: 'Site Web',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Logo',
    },
  ],
}