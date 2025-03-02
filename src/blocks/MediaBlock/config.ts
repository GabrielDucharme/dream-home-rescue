import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  labels: {
    singular: 'Bloc média',
    plural: 'Blocs médias',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Média',
    },
  ],
}
