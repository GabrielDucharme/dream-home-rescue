import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { revalidateHome, revalidateHomeAfterDelete } from './hooks/revalidateHome'
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
    group: 'Contenu',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Information de base',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nom',
            },
            {
              name: 'successStory',
              type: 'relationship',
              relationTo: 'success-stories',
              hasMany: false,
              label: 'Histoire de Succès',
              admin: {
                description: "L'histoire de succès liée à ce chien (si adopté)",
                condition: (data) => data.status === 'adopted',
              },
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
                    description: 'Âge en années (utilisez 0 pour les chiens de moins d&apos;un an)',
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
          ],
        },
        {
          label: 'Média & Description',
          fields: [
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
          ],
        },
        {
          label: 'Caractéristiques',
          fields: [
            {
              name: 'weight',
              label: 'Poids (lbs)',
              type: 'number',
              min: 0,
            },
            {
              name: 'size',
              label: 'Taille',
              type: 'select',
              options: [
                { label: 'Petit', value: 'small' },
                { label: 'Moyen', value: 'medium' },
                { label: 'Grand', value: 'large' },
              ],
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
          ],
        },
        {
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'metaTitle',
              descriptionPath: 'metaDescription',
              imagePath: 'metaImage',
            }),
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Titre SEO',
            },
            {
              name: 'metaImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image SEO',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Description SEO',
            },
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'metaTitle',
              descriptionPath: 'metaDescription',
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
        if (!data.metaTitle && data.name) {
          data.metaTitle = `${data.name} - Chien pour adoption | Dream Home Rescue`
        }
        
        // Auto-populate meta description if not provided
        if (!data.metaDescription && data.description) {
          let textContent = '';
          try {
            // Try to parse description if it's a string
            const descObj = typeof data.description === 'string' 
              ? JSON.parse(data.description)
              : data.description;
              
            // Extract text from Lexical format
            if (descObj?.root?.children) {
              descObj.root.children.forEach(node => {
                if (node.type === 'paragraph' && node.children) {
                  node.children.forEach(child => {
                    if (child.type === 'text' && child.text) {
                      textContent += child.text + ' ';
                    }
                  });
                }
              });
            }
            
            // Format and limit description
            textContent = textContent.trim();
            if (textContent && textContent.length > 3) {
              // Create a standardized description with breed and status
              const breedInfo = data.breed ? `${data.breed}` : '';
              const statusLabel = {
                'available': 'disponible pour adoption',
                'pending': 'en processus d\'adoption',
                'adopted': 'adopté',
                'foster': 'en famille d\'accueil',
                'medical': 'sous soins médicaux'
              }[data.status] || '';
              
              // Format the description with dog details
              let formattedDesc = `${data.name} est un chien ${breedInfo} ${statusLabel}. `;
              
              // Add content extract, limited to fit within SEO guidelines
              const remainingChars = 160 - formattedDesc.length;
              if (remainingChars > 20 && textContent.length > 0) {
                formattedDesc += textContent.length > remainingChars
                  ? textContent.substring(0, remainingChars - 3) + '...'
                  : textContent;
              }
              
              data.metaDescription = formattedDesc;
            }
          } catch (error) {
            console.error('Error parsing description for SEO:', error);
          }
        }
        
        // Use main image for SEO if not set
        if (!data.metaImage && data.mainImage) {
          data.metaImage = data.mainImage;
        }
        
        return data
      },
    ],
    afterChange: [revalidateHome],
    afterDelete: [revalidateHomeAfterDelete],
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