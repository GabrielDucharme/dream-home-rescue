import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const RefactorHomeIntroBlock: Block = {
  slug: 'refactorHomeIntro',
  labels: {
    singular: 'Refactor Home Intro',
    plural: 'Refactor Home Intro',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Description',
        type: 'richText',
        editor: lexicalEditor({})
    },
  ],
}
