import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      min: 1,
      label: 'Témoignages',
      fields: [
        {
          name: 'quote',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          required: true,
          label: 'Citation',
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Auteur',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Rôle',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
      ],
    },
  ],
  labels: {
    plural: 'Témoignages',
    singular: 'Témoignage',
  },
}