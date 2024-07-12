// pages/_app.js or pages/_app.tsx
import '~/styles/styles.css'

import App from 'next/app'
import Link from 'next/link'

import { extractHeaderAndFooter } from '~/lib/helper'
import isServer from '~/lib/isServer'
import { getClient } from '~/lib/sanity.client'
import { getSettings } from '~/lib/sanity.loader'
import { decryptString } from '~/plugins/crypt/encryption'

import Layout from '../components/Layout'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {
      draftMode: false,
    }
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // Only run server-side code on the server
    if (isServer()) {
      const client = getClient()
      const settings = await getSettings(client)
      const headerAndFooterCss = await decryptString(
        settings?.content.css || '',
      )
      const headerAndFooterHtml = await decryptString(
        settings?.content.html || '',
      )
      const { headerHtml, footerHtml } =
        extractHeaderAndFooter(headerAndFooterHtml)

      return {
        pageProps,
        headerHtml,
        footerHtml,
        headerAndFooterCss,
      }
    }

    return { pageProps }
  }

  render() {
    const {
      Component,
      pageProps,
      headerHtml,
      footerHtml,
      headerAndFooterCss,
      router,
    } = this.props
    const { slug } = router.query

    // Check if the slug is equal to "/studio"
    const showLayout = !router.asPath.includes('/studio')

    const transformLink = (node) => {
      if (node.name === 'a' && node.attribs && node.attribs.href) {
        const href = node.attribs.href
        return (
          <Link href={href} key={href}>
            {node.children}
          </Link>
        )
      }
    }

    const transformHtml = (html) => {
      const { parse } = require('node-html-parser')
      const root = parse(html)
      root.querySelectorAll('*').forEach((node) => {
        const transformedNode = transformLink(node)
        if (transformedNode) {
          node.replaceWith(transformedNode)
        }
      })
      return root.toString()
    }

    const transformedHeaderHtml: any = transformHtml(headerHtml)
    const transformedFooterHtml: any = transformHtml(footerHtml)

    return (
      <>
        {showLayout && (
          <Layout
            headerHtml={transformedHeaderHtml}
            footerHtml={transformedFooterHtml}
            css={headerAndFooterCss}
          >
            <Component {...pageProps} />
          </Layout>
        )}
        {!showLayout && <Component {...pageProps} />}
      </>
    )
  }
}

export default MyApp
