import { CollectionConfig } from 'payload/types'
import { isAdmin } from '../access/isAdmin'

export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'donorName',
    defaultColumns: ['donorName', 'amount', 'donationType', 'createdAt', 'stripePaymentStatus'],
    group: 'Dons',
  },
  access: {
    read: isAdmin,
    create: () => true, // Allow public to create donations
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Check if this is a new donation or an update
        if (!data.createdAt) {
          data.createdAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'donorName',
      type: 'text',
      required: true,
      label: 'Nom du donateur',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Adresse courriel',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Montant du don (en $)',
      min: 1,
    },
    {
      name: 'donationType',
      type: 'select',
      required: true,
      label: 'Type de don',
      options: [
        {
          label: 'Unique',
          value: 'onetime',
        },
        {
          label: 'Mensuel',
          value: 'monthly',
        },
      ],
      defaultValue: 'onetime',
    },
    {
      name: 'relatedGoal',
      type: 'relationship',
      relationTo: 'donation-goals',
      label: 'Objectif relié (optionnel)',
      hasMany: false,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Client',
      hasMany: false,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
    {
      name: 'acceptTerms',
      type: 'checkbox',
      required: true,
      label: 'Accepte les conditions',
      defaultValue: false,
    },
    // Stripe-related fields
    {
      name: 'stripePaymentStatus',
      type: 'select',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'État du paiement',
      options: [
        {
          label: 'En attente',
          value: 'pending',
        },
        {
          label: 'Complété',
          value: 'completed',
        },
        {
          label: 'Échoué',
          value: 'failed',
        },
        {
          label: 'Remboursé',
          value: 'refunded',
        },
      ],
      defaultValue: 'pending',
      access: {
        read: isAdmin,
      },
    },
    {
      name: 'stripeCustomerID',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'ID Client Stripe',
      access: {
        read: isAdmin,
      },
    },
    {
      name: 'stripeSubscriptionID',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data.donationType === 'monthly',
      },
      label: 'ID Abonnement Stripe',
      access: {
        read: isAdmin,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Date de création',
    },
  ],
  timestamps: true,
}