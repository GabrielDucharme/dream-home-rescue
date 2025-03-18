import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { AboutUs } from '../../blocks/AboutUs/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { AvailableDogs } from '../../blocks/AvailableDogs/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { DonationGoalDisplayBlock } from '../../blocks/DonationGoalDisplay/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Newsletter } from '../../blocks/Newsletter/config'
import { NosServices } from '../../blocks/NosServices/config'
import { PartnerLogos } from '../../blocks/PartnerLogos/config'
import { QuiNousSommes } from '../../blocks/QuiNousSommes/config'
import { RecentAdoptions } from '../../blocks/RecentAdoptions/config'
import { Testimonials } from '../../blocks/Testimonials/config'
import { WhereToFindUs } from '../../blocks/WhereToFindUs/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
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
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Héro',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock, AvailableDogs, AboutUs, QuiNousSommes, NosServices, RecentAdoptions, Testimonials, Newsletter, DonationGoalDisplayBlock, WhereToFindUs, PartnerLogos],
              required: true,
              label: 'Mise en page',
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Contenu',
        },
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
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              label: 'Aperçu',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [
      populatePublishedAt,
      ({ data }) => {
        // Auto-populate meta title if not provided
        if (!data.meta?.title && data.title) {
          if (!data.meta) data.meta = {}
          data.meta.title = `${data.title} | Dream Home Rescue`
        }
        
        // Auto-populate meta description from hero if available
        if (!data.meta?.description && data.hero?.description) {
          if (!data.meta) data.meta = {}
          const heroDesc = typeof data.hero.description === 'string' 
            ? data.hero.description 
            : '';
            
          if (heroDesc.length > 0) {
            data.meta.description = heroDesc.length > 160 
              ? heroDesc.substring(0, 157) + '...'
              : heroDesc;
          }
        }
        
        // Use hero image for SEO if available and not set
        if (!data.meta?.image && data.hero?.media) {
          if (!data.meta) data.meta = {}
          data.meta.image = data.hero.media;
        }
        
        return data;
      }
    ],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
