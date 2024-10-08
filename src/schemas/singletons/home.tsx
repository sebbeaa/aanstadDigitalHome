import { HomeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homeDocument',
  title: 'Home | Index Page',
  type: 'document',
  icon: HomeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Home',
      hidden: false,
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
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      hidden: true,
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
          hidden: ({ parent }) => !parent?.private as any,
          initialValue: '',
        }),
      ],
    }),
    defineField({
      title: 'Home Content',
      name: 'content',
      type: 'grapesEditor',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        subtitle: 'Home',
        title,
      }
    },
  },
})
