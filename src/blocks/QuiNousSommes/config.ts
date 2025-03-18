import type { Block } from 'payload/types'

export const QuiNousSommes: Block = {
  slug: 'quiNousSommes',
  labels: {
    singular: 'Qui Nous Sommes',
    plural: 'Blocs Qui Nous Sommes',
  },
  fields: [
    {
      name: 'heading',
      label: 'Titre',
      type: 'text',
      defaultValue: 'Refuge et Sanctuaire pour chien',
    },
    {
      name: 'introduction',
      label: 'Introduction',
      type: 'text',
      defaultValue: 'Nous offrons un refuge sécuritaire et aimant pour les chiens abandonnés, maltraités ou en détresse.',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
    },
    {
      name: 'adoptionLimit',
      label: 'Nombre de chiens adoptés à afficher',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 10,
      admin: {
        description: 'Nombre maximum de chiens récemment adoptés à faire défiler',
      },
    },
    {
      name: 'backgroundColor',
      label: 'Couleur de fond',
      type: 'select',
      defaultValue: 'gradient',
      options: [
        {
          label: 'Dégradé (Ambre à Gris)',
          value: 'gradient',
        },
        {
          label: 'Ambre clair',
          value: 'bg-amber-50',
        },
        {
          label: 'Blanc',
          value: 'bg-white',
        },
        {
          label: 'Crème',
          value: 'bg-[#ECE0CE]',
        },
        {
          label: 'Gris clair',
          value: 'bg-[#F9F9F9]',
        }
      ],
    },
  ],
}