import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    label: 'Taille',
    options: [
      {
        label: 'Un tiers',
        value: 'oneThird',
      },
      {
        label: 'Moitié',
        value: 'half',
      },
      {
        label: 'Deux tiers',
        value: 'twoThirds',
      },
      {
        label: 'Pleine largeur',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: 'Contenu',
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    label: 'Activer le lien',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Bloc de contenu',
    plural: 'Blocs de contenu',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Colonnes',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
}
