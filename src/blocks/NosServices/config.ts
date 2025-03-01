import type { Block } from 'payload'

export const NosServices: Block = {
  slug: 'nosServices',
  interfaceName: 'NosServicesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
    },
  ],
  labels: {
    singular: 'Nos Services Block',
    plural: 'Nos Services Blocks',
  },
}