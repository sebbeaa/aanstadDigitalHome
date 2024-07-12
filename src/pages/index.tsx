import type { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import { getClient } from '~/lib/sanity.client'
import { getHome, getPages } from '~/lib/sanity.loader'
import { decryptString } from '~/plugins/crypt/encryption'

export const getStaticProps = async () => {
  const client = getClient()

  const homeData = await getHome(client)
  const pages = await getPages(client)

  const css: string = await decryptString(homeData?.content?.css || '')
  const html: string = await decryptString(homeData?.content?.html || '')

  return {
    props: {
      home: homeData,
      html,
      css,
      pages,
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <>
      <Head>
        <style>{props.css}</style>
      </Head>
      {hydrated && (
        <div dangerouslySetInnerHTML={{ __html: props.html || '' }} />
      )}
    </>
  )
}
