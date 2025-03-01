import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Dogs: CollectionConfig<'dogs'> = {
  slug: 'dogs',
  labels: {
    singular: 'Chien',
    plural: 'Chiens',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    status: true,
    breed: true,
    sex: true,
    age: true,
    mainImage: true,
  },
  admin: {
    defaultColumns: ['name', 'breed', 'status', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'breed',
      type: 'text',
      required: true,
      label: 'Race',
    },
    {
      name: 'sex',
      type: 'select',
      required: true,
      label: 'Sexe',
      options: [
        {
          label: 'Mâle',
          value: 'male',
        },
        {
          label: 'Femelle',
          value: 'female',
        },
      ],
    },
    {
      name: 'age',
      type: 'group',
      label: 'Âge',
      fields: [
        {
          name: 'years',
          type: 'number',
          required: true,
          label: 'Années',
          admin: {
            description: 'Âge en années (utilisez 0 pour les chiens de moins d\'un an)',
          },
          min: 0,
        },
        {
          name: 'months',
          type: 'number',
          required: true,
          label: 'Mois',
          admin: {
            description: 'Mois additionnels (0-11)',
          },
          min: 0,
          max: 11,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Statut',
      defaultValue: 'available',
      options: [
        {
          label: 'Disponible pour l\'adoption',
          value: 'available',
        },
        {
          label: 'Adoption en cours',
          value: 'pending',
        },
        {
          label: 'Adopté',
          value: 'adopted',
        },
        {
          label: 'En famille d\'accueil',
          value: 'foster',
        },
        {
          label: 'Sous soins médicaux',
          value: 'medical',
        },
      ],
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image principale',
    },
    {
      name: 'galleryImages',
      type: 'array',
      label: 'Images additionnelles',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            BlocksFeature({}),
            FixedToolbarFeature(),
          ]
        },
      }),
      required: true,
    },
    {
      name: 'weight',
      label: 'Poids (lbs)',
      type: 'number',
      min: 0,
    },
    {
      name: 'goodWith',
      type: 'group',
      label: 'Compatibilité',
      fields: [
        {
          name: 'kids',
          label: 'Bon avec les enfants',
          type: 'select',
          options: [
            { label: 'Oui', value: 'yes' },
            { label: 'Non', value: 'no' },
            { label: 'Inconnu', value: 'unknown' },
          ],
          defaultValue: 'unknown',
        },
        {
          name: 'dogs',
          label: 'Bon avec les chiens',
          type: 'select',
          options: [
            { label: 'Oui', value: 'yes' },
            { label: 'Non', value: 'no' },
            { label: 'Inconnu', value: 'unknown' },
          ],
          defaultValue: 'unknown',
        },
        {
          name: 'cats',
          label: 'Bon avec les chats',
          type: 'select',
          options: [
            { label: 'Oui', value: 'yes' },
            { label: 'Non', value: 'no' },
            { label: 'Inconnu', value: 'unknown' },
          ],
          defaultValue: 'unknown',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
              label: 'Titre SEO',
            }),
            MetaImageField({
              relationTo: 'media',
              label: 'Image SEO',
            }),
            MetaDescriptionField({
              label: 'Description SEO',
            }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              label: 'Aperçu',
            }),
          ],
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // If no meta title is provided, use the dog's name
        if (!data.meta?.title && data.name) {
          if (!data.meta) data.meta = {}
          data.meta.title = `${data.name} - Chien pour adoption`
        }
        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 20,
  },
  admin: {
    defaultColumns: ['name', 'breed', 'status', 'updatedAt'],
    useAsTitle: 'name',
    group: 'Contenu',
  },
}