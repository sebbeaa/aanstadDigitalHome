import createImageUrlBuilder from '@sanity/image-url'
import { groq } from 'next-sanity'
import type { Image } from 'sanity'

import { dataset, projectId } from './sanity.api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const pagesQuery = groq`*[_type == "page" && defined(slug.current)] | order(_createdAt desc)`

export const homePageQuery = groq`*[_type == "homeDocument"][0]{content}`
export const settingsQuery = groq`*[_type == "settings"][0]{content}`
export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]{slug}`

export const urlForImage = (source: Image | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}

export function urlForOpenGraphImage(image: Image | undefined) {
  return urlForImage(image)?.width(1200).height(627).fit('crop').url()
}
