import type { Block } from 'payload/types'

export const AboutUs: Block = {
  slug: 'aboutUs',
  labels: {
    singular: 'À Propos de Nous',
    plural: 'Blocs À Propos de Nous',
  },
  fields: [
    {
      name: 'textAlignment',
      label: 'Alignement du texte',
      type: 'select',
      defaultValue: 'left',
      options: [
        {
          label: 'Gauche',
          value: 'left',
        },
        {
          label: 'Centre',
          value: 'center',
        },
      ],
    },
    {
      name: 'mainHeading',
      label: 'Titre Principal',
      type: 'text',
      defaultValue: 'Notre mission est de fournir amour, soins et secondes chances aux chiens dans le besoin.',
    },
    {
      name: 'supportingStatement',
      label: 'Déclaration de Soutien',
      type: 'text',
      defaultValue: 'Nous sommes une équipe dévouée d\'amoureux des animaux qui travaille pour secourir, réhabiliter et reloger des chiens de toutes races, tailles et origines.',
    },
    {
      name: 'detailedDescription',
      label: 'Description Détaillée',
      type: 'richText',
    },
    {
      name: 'teamMembers',
      label: 'Membres de l\'équipe',
      type: 'array',
      min: 0,
      max: 6,
      labels: {
        singular: 'Membre',
        plural: 'Membres',
      },
      fields: [
        {
          name: 'member',
          label: 'Membre',
          type: 'relationship',
          relationTo: 'team-members',
          required: true,
        }
      ],
      admin: {
        description: 'Ajouter des membres de l\'équipe qui apparaîtront comme portraits circulaires',
      },
    },
    {
      name: 'coreValuesStatement',
      label: 'Déclaration des Valeurs Fondamentales',
      type: 'text',
      defaultValue: 'Fondé par des amoureux des animaux dédiés au bien-être des chiens, nous nous efforçons de créer un environnement sûr et nourrissant où chaque chien peut se sentir aimé et valorisé.',
    },
    {
      name: 'mediaType',
      label: 'Type de média',
      type: 'select',
      defaultValue: 'image',
      options: [
        {
          label: 'Image',
          value: 'image',
        },
        {
          label: 'Vidéo',
          value: 'video',
        },
      ],
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data, siblingData) => siblingData.mediaType === 'image',
      },
    },
    {
      name: 'videoUrl',
      label: 'URL de la vidéo (YouTube ou Vimeo)',
      type: 'text',
      admin: {
        condition: (data, siblingData) => siblingData.mediaType === 'video',
      },
    },
    {
      name: 'videoThumbnail',
      label: 'Miniature de la vidéo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data, siblingData) => siblingData.mediaType === 'video',
      },
    },
    // Media position removed - always centered
    {
      name: 'displayButton',
      label: 'Afficher un bouton',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'buttonText',
      label: 'Texte du bouton',
      type: 'text',
      defaultValue: 'Rejoignez-nous',
      admin: {
        condition: (data, siblingData) => siblingData.displayButton,
      },
    },
    {
      name: 'buttonLink',
      label: 'Lien du bouton',
      type: 'text',
      defaultValue: '/a-propos',
      admin: {
        condition: (data, siblingData) => siblingData.displayButton,
      },
    },
  ],
}