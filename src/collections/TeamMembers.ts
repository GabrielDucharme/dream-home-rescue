import { CollectionConfig } from 'payload/types'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    singular: 'Membre de l\'équipe',
    plural: 'Membres de l\'équipe',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Contenu',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'title',
      type: 'text',
      required: false,
      label: 'Titre',
    },
    {
      name: 'bio',
      type: 'richText',
      required: false,
      label: 'Biographie',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Photo',
    },
  ],
}