import { Block } from 'payload/types'

export const DonationGoalDisplayBlock: Block = {
  slug: 'donationGoalDisplay',
  labels: {
    singular: 'Objectif de don',
    plural: 'Objectifs de don',
  },
  fields: [
    {
      name: 'heading',
      label: 'Titre',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
    },
    {
      name: 'goalID',
      label: 'Objectif à afficher',
      type: 'relationship',
      relationTo: 'donation-goals',
      required: true,
    },
    {
      name: 'showMilestones',
      label: 'Afficher les jalons',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showNextGoals',
      label: 'Afficher les prochains objectifs',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showDonationButton',
      label: 'Afficher le bouton de don',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'donationButtonText',
      label: 'Texte du bouton de don',
      type: 'text',
      defaultValue: 'Faire un don',
      admin: {
        condition: (data) => data.showDonationButton,
      },
    },
    {
      name: 'layout',
      label: 'Disposition',
      type: 'select',
      options: [
        {
          label: 'Standard',
          value: 'standard',
        },
        {
          label: 'Compacte',
          value: 'compact',
        },
        {
          label: 'Large',
          value: 'wide',
        },
      ],
      defaultValue: 'standard',
    },
  ],
}