import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
import { cleanRelatedPosts } from './hooks/cleanRelatedPosts'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
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
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image principale',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Contenu',
              required: true,
            },
          ],
          label: 'Contenu',
        },
        {
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              label: 'Articles liés',
              admin: {
                position: 'sidebar',
                description: 'Articles liés à cet article',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
              // Make related posts optional
              required: false,
            },
            {
              name: 'categories',
              type: 'relationship',
              label: 'Catégories',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: 'Méta',
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
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-populate meta title if not provided
        if (!data.meta?.title && data.title) {
          if (!data.meta) data.meta = {}
          data.meta.title = `${data.title} | Dream Home Rescue`
        }
        
        // Auto-populate meta description from content if not provided
        if (!data.meta?.description && data.content) {
          if (!data.meta) data.meta = {}
          
          // Extract text content from the Lexical JSON structure (simplified)
          let textContent = '';
          try {
            // Try to parse content if it's a string
            const contentObj = typeof data.content === 'string' 
              ? JSON.parse(data.content)
              : data.content;
              
            // Check if we have a root with children
            if (contentObj?.root?.children) {
              // Very basic extraction of text from paragraphs
              contentObj.root.children.forEach(node => {
                if (node.type === 'paragraph' && node.children) {
                  node.children.forEach(child => {
                    if (child.type === 'text' && child.text) {
                      textContent += child.text + ' ';
                    }
                  });
                }
              });
            }
            
            // Trim and limit to 160 characters
            textContent = textContent.trim();
            if (textContent && textContent.length > 3) {
              data.meta.description = textContent.length > 160 
                ? textContent.substring(0, 157) + '...'
                : textContent;
            }
          } catch (error) {
            // If parsing fails, don't set a description
            console.error('Error parsing content for auto description:', error);
          }
        }
        
        // Check if meta image is missing, use heroImage if available
        if (!data.meta?.image && data.heroImage) {
          if (!data.meta) data.meta = {}
          data.meta.image = data.heroImage;
        }
        
        return data;
      }
    ],
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
    beforeRead: [cleanRelatedPosts],
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
