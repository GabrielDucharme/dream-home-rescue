import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
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

export const FundingEvents: CollectionConfig<'funding-events'> = {
  slug: 'funding-events',
  labels: {
    singular: 'Événement de financement',
    plural: 'Événements de financement',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'eventDate', 'location', 'status', 'updatedAt'],
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Brouillon',
          value: 'draft',
        },
        {
          label: 'Publié',
          value: 'published',
        },
      ],
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      label: 'Date de l\'événement',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd MMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: false,
      label: 'Date de fin (facultatif)',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd MMM yyyy HH:mm',
        },
        description: 'Seulement requis si l\'événement dure plus d\'une journée',
      },
    },
    {
      name: 'location',
      type: 'group',
      label: 'Emplacement',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nom de l\'endroit',
        },
        {
          name: 'address',
          type: 'text',
          required: true,
          label: 'Adresse',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'Ville',
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          label: 'Code postal',
        },
        {
          name: 'googleMapsUrl',
          type: 'text',
          required: false,
          label: 'Lien Google Maps',
          admin: {
            description: 'URL complète de Google Maps vers cet emplacement',
          },
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
      label: 'Galerie d\'images',
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
          required: false,
          label: 'Légende',
        },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      label: 'Courte description',
      admin: {
        description: 'Bref résumé de l\'événement (100-150 caractères)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description complète',
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
      name: 'ticketOptions',
      type: 'array',
      label: 'Options de billets',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nom de l\'option',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Prix',
          admin: {
            description: 'Prix en dollars canadiens',
            step: 0.01,
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          label: 'Description',
        },
        {
          name: 'maxQuantity',
          type: 'number',
          required: false,
          label: 'Quantité maximale disponible',
          admin: {
            description: 'Laissez vide si illimité',
          },
        },
      ],
    },
    {
      name: 'registrationEnabled',
      type: 'checkbox',
      label: 'Inscription activée',
      defaultValue: true,
    },
    {
      name: 'registrationForm',
      type: 'relationship',
      relationTo: 'forms',
      required: false,
      label: 'Formulaire d\'inscription',
      admin: {
        description: 'Formulaire à utiliser pour les inscriptions à cet événement',
        condition: (data) => Boolean(data?.registrationEnabled),
      },
    },
    {
      name: 'registrationDeadline',
      type: 'date',
      required: false,
      label: 'Date limite d\'inscription',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd MMM yyyy HH:mm',
        },
        description: 'Laissez vide si aucune date limite n\'est applicable',
        condition: (data) => Boolean(data?.registrationEnabled),
      },
    },
    {
      name: 'sponsors',
      type: 'array',
      label: 'Commanditaires',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nom',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Logo',
        },
        {
          name: 'website',
          type: 'text',
          required: false,
          label: 'Site web',
        },
        {
          name: 'sponsorLevel',
          type: 'select',
          required: false,
          label: 'Niveau de commandite',
          options: [
            {
              label: 'Platine',
              value: 'platinum',
            },
            {
              label: 'Or',
              value: 'gold',
            },
            {
              label: 'Argent',
              value: 'silver',
            },
            {
              label: 'Bronze',
              value: 'bronze',
            },
            {
              label: 'Soutien',
              value: 'supporter',
            },
          ],
        },
      ],
    },
    {
      name: 'organizers',
      type: 'array',
      label: 'Organisateurs',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nom',
        },
        {
          name: 'role',
          type: 'text',
          required: false,
          label: 'Rôle',
        },
        {
          name: 'contact',
          type: 'email',
          required: false,
          label: 'Courriel de contact',
        },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'FAQ',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          label: 'Réponse',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                FixedToolbarFeature(),
              ]
            },
          }),
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
        // If no meta title is provided, use the event title
        if (!data.meta?.title && data.title) {
          if (!data.meta) data.meta = {}
          data.meta.title = `${data.title} - Événement de financement | Dream Home Rescue`
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
}