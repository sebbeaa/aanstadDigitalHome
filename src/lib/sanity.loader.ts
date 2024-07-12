//@ts-ignore

import * as queryStore from '@sanity/react-loader'
import { groq,SanityClient } from 'next-sanity'

import isServer from './isServer'
import { readToken } from './sanity.api'
import { getClient } from './sanity.client'
import {
  homePageQuery,
  pageBySlugQuery,
  pagesQuery,
  settingsQuery,
} from './sanity.queries'

let serverClient: SanityClient

if (isServer()) {
  serverClient = getClient({ token: readToken })
  /**
   * Sets the server client for the query store, doing it here ensures that all data fetching in production
   * happens on the server and not on the client.
   * Live mode in `sanity/presentation` still works, as it uses the `useLiveMode` hook to update `useQuery` instances with
   * live draft content using `postMessage`.
   */
  queryStore.setServerClient(serverClient)
}

const usingCdn = serverClient ? serverClient.config().useCdn : false

// Automatically handle draft mode
export const loadQuery = ((query, params = {}, options = {} as any) => {
  // Don't cache by default
  let revalidate: NextFetchRequestConfig['revalidate'] = 0
  // If `next.tags` is set, and we're not using the CDN, then it's safe to cache
  if (!usingCdn && Array.isArray(options.next?.tags)) {
    revalidate = false
  } else if (usingCdn) {
    revalidate = 60
  }
  return queryStore.loadQuery(query, params, {
    ...options,
    next: {
      revalidate,
      ...(options.next || {}),
    },
    // Enable stega if in Draft Mode, to enable overlays when outside Sanity Studio
  } as any)
}) satisfies typeof queryStore.loadQuery

export const loadHomePage = async () => {
  return loadQuery<{ content: { html: string; css: string } } | null>(
    homePageQuery,
    {},
    {
      next: { tags: [`homeDocument`] },
    } as any,
  )
}

export const getSettings = async (client: SanityClient) => {
  return await client.fetch(settingsQuery)
}

export async function getHome(client: SanityClient): Promise<any> {
  return await client.fetch(homePageQuery)
}

export async function getPage(
  client: SanityClient,
  slug: string,
): Promise<any> {
  return await client.fetch(pageBySlugQuery, {
    slug,
  })
}

export const getPages = async (client: SanityClient) => {
  return await client.fetch(pagesQuery)
}

export const pageSlugsQuery = groq`
*[_type == "page" && defined(slug.current)][].slug.current
`

export const loadSettings = async () => {
  return loadQuery<any>(settingsQuery, {}, {
    next: { tags: ['settings', 'homeDocument', 'pages'] },
  } as any)
}

export const loadPageBySlug = async (slug: string) => {
  return loadQuery<any | null>(pageBySlugQuery, { slug }, {
    next: { tags: [`pages:${slug}`] },
  } as any)
}

// Usage example:
