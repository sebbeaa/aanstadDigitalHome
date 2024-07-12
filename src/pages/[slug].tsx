import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'


import { getClient } from '~/lib/sanity.client'
import { getPage, getPages } from '~/lib/sanity.loader'
import { decryptString } from '~/plugins/crypt/encryption'

export const getStaticPaths = async () => {
  const client = getClient(undefined)
  const paths = await getPages(client)
  return {
    paths: paths.map((page: any) => {
      return {
        params: {
          slug: page.slug.current,
        },
      }
    }),
    fallback: true,
  }
}

export const getStaticProps = async ({
  params = { slug: '' },
}) => {
  const client = getClient()
  

  const pageData = await getPage(client, params.slug)

  const css: string = await decryptString(pageData?.content?.css || '')
  const html: string = await decryptString(pageData?.content?.html || '')

  return {
    props: {
      page: pageData,
      
      html,
      css,
      
      slug: params.slug,
      
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return (
    <>
      <Head>
        <style>{props.css}</style>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: props.html }}></div>
    </>
  )
}
