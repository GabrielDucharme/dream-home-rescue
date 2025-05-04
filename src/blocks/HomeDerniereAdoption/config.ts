import type { Block } from 'payload'

export const HomeDerniereAdoptionBlock: Block = {
  slug: 'homeDerniereAdoption',
  labels: {
    singular: 'Home Derniere Adoption',
    plural: 'Home Derniere Adoption',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
