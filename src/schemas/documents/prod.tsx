import { DocumentIcon } from '@sanity/icons'
import { MdProductionQuantityLimits } from 'react-icons/md'
import { defineField, defineType } from 'sanity'
export default defineType({
  type: 'document',
  name: 'prod',
  title: 'Products',
  icon: MdProductionQuantityLimits,
  fields: [
    defineField(
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {},
    ),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'URL slug for the Product, used for page routing',
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      description: 'A short description or excerpt of the blog post',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true, // Enables image cropping
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        subtitle: 'Product',
        title,
      }
    },
  },
})
