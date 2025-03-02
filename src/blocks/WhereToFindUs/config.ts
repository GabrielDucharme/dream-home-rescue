import { Block } from 'payload/types';

export const WhereToFindUs: Block = {
  slug: 'whereToFindUs',
  interfaceName: 'WhereToFindUsBlock',
  labels: {
    singular: {
      en: 'Where To Find Us',
      fr: 'Où Nous Trouver',
    },
    plural: {
      en: 'Where To Find Us Blocks',
      fr: 'Blocs Où Nous Trouver',
    },
  },
  fields: [
    {
      name: 'title',
      label: {
        en: 'Title',
        fr: 'Titre',
      },
      type: 'text',
      required: true,
      defaultValue: 'Où Nous Trouver',
    },
    {
      name: 'address',
      label: {
        en: 'Address',
        fr: 'Adresse',
      },
      type: 'textarea',
      required: true,
    },
    {
      name: 'phone',
      label: {
        en: 'Phone Number',
        fr: 'Numéro de téléphone',
      },
      type: 'text',
    },
    {
      name: 'email',
      label: {
        en: 'Email',
        fr: 'Courriel',
      },
      type: 'email',
    },
    {
      name: 'hours',
      label: {
        en: 'Opening Hours',
        fr: 'Heures d\'ouverture',
      },
      type: 'textarea',
    },
    {
      name: 'mapEmbed',
      label: {
        en: 'Google Maps Embed Code',
        fr: 'Code d\'intégration Google Maps',
      },
      type: 'textarea',
      admin: {
        description: {
          en: 'Paste the embed code from Google Maps',
          fr: 'Collez le code d\'intégration de Google Maps',
        },
      },
    },
    {
      name: 'displayMap',
      label: {
        en: 'Display Map',
        fr: 'Afficher la carte',
      },
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'photos',
      type: 'array',
      label: {
        en: 'Shelter Photos',
        fr: 'Photos du refuge',
      },
      minRows: 0,
      maxRows: 4,
      labels: {
        singular: {
          en: 'Photo',
          fr: 'Photo',
        },
        plural: {
          en: 'Photos',
          fr: 'Photos',
        },
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: {
            en: 'Photo',
            fr: 'Photo',
          },
        },
        {
          name: 'caption',
          type: 'text',
          label: {
            en: 'Caption',
            fr: 'Légende',
          },
        },
      ],
    },
  ],
};