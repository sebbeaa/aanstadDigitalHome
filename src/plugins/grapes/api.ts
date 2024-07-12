import { createClient } from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const token = process.env.SANITY_API_WRITE_TOKEN
// export const url = import.meta.env.SANITY_STUDIO_URL
// export const openapi = import.meta.env.OPENAI_API_KEY
// export const organizationId = import.meta.env.OPENAI_PROJECT_ID
export const client = createClient({
  projectId,
  dataset,

  apiVersion: '2024-01-29',
  useCdn: false, // `false` if you want fresh data
  token,
})
