// pages/_app.js or pages/_app.tsx
import React from 'react'
import App from 'next/app'
import Layout from '../components/Layout'
import { decryptString } from '~/plugins/crypt/encryption'
import { getSettings } from '~/lib/sanity.loader'
import { getClient } from '~/lib/sanity.client'
import { extractHeaderAndFooter } from '~/lib/helper'
import isServer from '~/lib/isServer'
import '~/styles/styles.css'


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
      const headerAndFooterCss = await decryptString(settings?.content.css || '')
      const headerAndFooterHtml = await decryptString(settings?.content.html || '')
      const { headerHtml, footerHtml } = extractHeaderAndFooter(headerAndFooterHtml)

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
  const { Component, pageProps, headerHtml, footerHtml, headerAndFooterCss, router } = this.props;
  const { slug } = router.query;

  // Check if the slug is equal to "/studio"
  const showLayout = slug !== "/studio";

  return (
    <>
      {showLayout && (
        <Layout headerHtml={headerHtml} footerHtml={footerHtml} css={headerAndFooterCss}>
          <Component {...pageProps} />
        </Layout>
      )}
      {!showLayout && <Component {...pageProps} />}
    </>
  );
}
}

export default MyApp
