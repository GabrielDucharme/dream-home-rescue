import type { Block } from 'payload'

export const PartnerLogos: Block = {
  slug: 'partner-logos',
  interfaceName: 'PartnerLogosBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
    },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      required: true,
      label: 'Partenaires',
    }
  ],
  labels: {
    plural: 'Bannières de partenaires',
    singular: 'Bannière de partenaires',
  },
}