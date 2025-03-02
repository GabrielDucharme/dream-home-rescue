import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import { slugField } from '../fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Contenu',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    ...slugField(),
  ],
}