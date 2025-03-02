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
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'En savoir plus',
      admin: {
        description: 'Text for the "Learn More" button (default: "En savoir plus")',
      },
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