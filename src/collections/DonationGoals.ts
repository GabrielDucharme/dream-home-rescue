import { CollectionConfig } from 'payload/types'

export const DonationGoals: CollectionConfig = {
  slug: 'donation-goals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'currentAmount', 'targetAmount', 'isActive', 'endDate'],
    group: 'Dons',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre de l\'objectif',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'currentAmount',
      type: 'number',
      required: true,
      label: 'Montant actuel (en $)',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'targetAmount',
      type: 'number',
      required: true,
      label: 'Montant objectif (en $)',
      min: 1,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Date de début',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Date de fin (optionnelle)',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Objectif actif',
      defaultValue: true,
    },
    {
      name: 'isHighlighted',
      type: 'checkbox',
      label: 'Objectif mis en avant',
      defaultValue: false,
    },
    {
      name: 'color',
      type: 'select',
      label: 'Couleur de la barre de progression',
      options: [
        {
          label: 'Primaire',
          value: 'primary',
        },
        {
          label: 'Secondaire',
          value: 'secondary',
        },
        {
          label: 'Succès',
          value: 'success',
        },
        {
          label: 'Danger',
          value: 'danger',
        },
        {
          label: 'Attention',
          value: 'warning',
        },
      ],
      defaultValue: 'primary',
    },
    {
      name: 'milestones',
      type: 'array',
      label: 'Jalons',
      fields: [
        {
          name: 'amount',
          type: 'number',
          label: 'Montant (en $)',
          required: true,
          min: 1,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          required: true,
        },
        {
          name: 'isReached',
          type: 'checkbox',
          label: 'Jalon atteint',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'nextGoals',
      type: 'array',
      label: 'Prochains objectifs',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titre',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          label: 'Montant (en $)',
          required: true,
          min: 1,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Image (optionnelle)',
      relationTo: 'media',
    },
  ],
}