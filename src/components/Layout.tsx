import Head from 'next/head'



import React from 'react'

const Layout = ({ children, headerHtml, footerHtml, css }) => {
    
  return (
    <div className='w-screen'>
      <Head>
        <style>{`${css}`}</style>      
      </Head>
          <div dangerouslySetInnerHTML={{ __html: headerHtml }} />
      
      <main>{children}</main>
          <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </div>
  )
}

export default Layout
