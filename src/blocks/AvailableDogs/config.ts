import type { Block } from 'payload/types'

export const AvailableDogs: Block = {
  slug: 'availableDogs',
  labels: {
    singular: 'Chiens Disponibles',
    plural: 'Blocs de Chiens Disponibles',
  },
  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      defaultValue: 'Nos chiens disponibles pour l&apos;adoption',
    },
    {
      name: 'subtitle',
      label: 'Texte secondaire',
      type: 'text',
      admin: {
        description: 'Texte qui apparaîtra à droite du titre sur les écrans larges',
      },
    },
    {
      name: 'showStatus',
      label: 'Filtrer par statut',
      type: 'select',
      defaultValue: 'available',
      options: [
        {
          label: 'Tous les chiens',
          value: 'all',
        },
        {
          label: 'Disponibles pour l&apos;adoption',
          value: 'available',
        },
        {
          label: 'Adoption en cours',
          value: 'pending',
        },
        {
          label: 'Adoptés',
          value: 'adopted',
        },
        {
          label: 'En famille d&apos;accueil',
          value: 'foster',
        },
        {
          label: 'Sous soins médicaux',
          value: 'medical',
        },
      ],
    },
    {
      name: 'limit',
      label: 'Nombre de chiens à afficher',
      type: 'number',
      defaultValue: 8,
      min: 3,
      max: 24,
      admin: {
        description: 'Nombre recommandé: entre 6 et 12 pour une expérience carousel optimale',
      },
    },
    {
      name: 'displayLink',
      label: 'Afficher le lien vers tous les chiens',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'linkText',
      label: 'Texte du lien',
      type: 'text',
      defaultValue: 'Voir tous nos chiens',
      admin: {
        condition: (data, siblingData) => siblingData.displayLink,
      },
    },
    {
      name: 'backgroundColor',
      label: 'Couleur de fond',
      type: 'select',
      defaultValue: 'bg-[#F9F9F9]',
      options: [
        {
          label: 'Gris clair',
          value: 'bg-[#F9F9F9]',
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
        }
      ],
    },
  ],
}