import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { revalidateSuccessStory, revalidateSuccessStoryAfterDelete } from './SuccessStories/hooks/revalidateSuccessStory'
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

export const SuccessStories: CollectionConfig<'success-stories'> = {
  slug: 'success-stories',
  labels: {
    singular: 'Histoire de Succès',
    plural: 'Histoires de Succès',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    dog: true,
    family: true,
    mainImage: true,
    adoptionDate: true,
  },
  admin: {
    defaultColumns: ['title', 'dog', 'adoptionDate', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Contenu',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre',
    },
    {
      name: 'dog',
      type: 'relationship',
      relationTo: 'dogs',
      required: true,
      label: 'Chien Adopté',
      hasMany: false,
    },
    {
      name: 'adoptionDate',
      type: 'date',
      required: true,
      label: 'Date d&apos;adoption',
      admin: {
        date: {
          pickerAppearance: 'dayAndMonth',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'family',
      type: 'text',
      required: true,
      label: 'Nom de la Famille',
      admin: {
        description: 'Nom de la famille qui a adopté le chien (ex: "Famille Dupont")',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image principale',
      admin: {
        description: 'Photo du chien avec sa nouvelle famille',
      },
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
        {
          name: 'caption',
          type: 'text',
          label: 'Légende',
        },
      ],
    },
    {
      name: 'story',
      type: 'richText',
      label: 'Histoire',
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
      admin: {
        description: 'Partagez l&apos;histoire de cette adoption et comment le chien s&apos;adapte à sa nouvelle vie',
      },
    },
    {
      name: 'testimonial',
      type: 'textarea',
      label: 'Témoignage',
      admin: {
        description: 'Citation de la famille adoptive',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Mise en avant',
      defaultValue: false,
      admin: {
        description: 'Mettre cette histoire en avant sur la page d&apos;accueil',
      },
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
        // If no meta title is provided, use the story's title
        if (!data.meta?.title && data.title) {
          if (!data.meta) data.meta = {}
          data.meta.title = `${data.title} - Histoire d&apos;adoption | Dream Home Rescue`
        }
        return data
      },
    ],
    afterChange: [revalidateSuccessStory],
    afterDelete: [revalidateSuccessStoryAfterDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 20,
  },
}