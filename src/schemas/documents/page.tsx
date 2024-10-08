import { DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'document',
  name: 'page',
  title: 'Page',
  icon: DocumentIcon,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      initialValue: 'New Page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hidePage',
      type: 'object',
      initialValue: {
        private: false,
        password: '',
      },
      fields: [
        defineField({
          type: 'boolean',
          name: 'private',
          title: 'Private Page',
          initialValue: false,
        }),
        defineField({
          type: 'string',
          name: 'password',
          title: 'Password',
          hidden: ({ parent }) => !parent?.private,
          initialValue: '',
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      type: 'string',
      title: 'SEO Title',
    }),
    defineField({
      name: 'overview',
      type: 'text',
      title: 'SEO Description',
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'grapesEditor',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        subtitle: 'Page',
        title,
      }
    },
  },
})
