import type { Block } from 'payload/types'

export const RecentAdoptions: Block = {
  slug: 'recentAdoptions',
  labels: {
    singular: 'Chiens Récemment Adoptés',
    plural: 'Blocs de Chiens Récemment Adoptés',
  },
  fields: [
    {
      name: 'heading',
      label: 'Titre',
      type: 'text',
      defaultValue: 'Nos réussites d\'adoption récentes',
    },
    {
      name: 'limit',
      label: 'Nombre de chiens à afficher',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
    {
      name: 'ctaText',
      label: 'Texte du bouton "découvrir"',
      type: 'text',
      defaultValue: 'Découvrir l\'histoire',
    },
    {
      name: 'displayLink',
      label: 'Afficher un lien',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'linkText',
      label: 'Texte du lien',
      type: 'text',
      defaultValue: 'Voir toutes nos adoptions',
      admin: {
        condition: (data, siblingData) => siblingData.displayLink,
      },
    },
    {
      name: 'linkUrl',
      label: 'URL du lien',
      type: 'text',
      defaultValue: '/dogs',
      admin: {
        condition: (data, siblingData) => siblingData.displayLink,
      },
    },
  ],
}