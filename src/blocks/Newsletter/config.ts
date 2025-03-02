import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Titre',
      defaultValue: 'Inscrivez-vous à notre infolettre',
    },
    {
      name: 'subheading',
      type: 'text',
      required: false,
      label: 'Sous-titre',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      label: 'Texte du bouton',
      defaultValue: 'S\'inscrire',
    },
    {
      name: 'emailPlaceholder',
      type: 'text',
      required: false,
      label: 'Texte indicatif pour l\'email',
      defaultValue: 'Votre adresse courriel',
    },
    {
      name: 'richText',
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
      required: false,
      label: 'Contenu',
    },
    {
      name: 'useWaveDivider',
      type: 'checkbox',
      defaultValue: true,
      label: 'Utiliser le séparateur de vague',
    },
  ],
  labels: {
    plural: 'Blocs d\'infolettre',
    singular: 'Bloc d\'infolettre',
  },
}