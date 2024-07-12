import { structureTool } from 'sanity/structure'
import homeDocument from './src/schemas/singletons/home'
import settings from './src/schemas/singletons/settings'
import { FaBeer } from 'react-icons/fa'
import page from './src/schemas/documents/page'
import { singletonPlugin } from './src/plugins/settings'
import { pageStructure } from './src/plugins/settings'
import { defineConfig } from 'sanity'
import globalBlocks from './src/schemas/documents/globalBlocks'
import {
  dataset,
  previewSecretId,
  projectId,
  readToken,
} from './src/lib/sanity.api'
import allOrders from './src/schemas/hidden/ordersSchema'
import prod from './src/schemas/documents/prod'
import Grapes from './src/plugins/grapes'
import { grapesEditor } from './src/schemas/documents/editor'
import { media } from 'sanity-plugin-media'
import { studioPath } from '@sanity/client/csm'
import {
  defineUrlResolver,
  Iframe,
  IframeOptions,
} from 'sanity-plugin-iframe-pane'
import { previewUrl } from 'sanity-plugin-iframe-pane/preview-url'

import Image from 'next/image'

let client: any

const iframeOptions = {
  url: defineUrlResolver({
    base: '/api/draft',
    requiresSlug: ['page', 'prod', ''],
  }),
  urlSecretId: previewSecretId,
  reload: { button: true },
} satisfies IframeOptions

function MyComponent() {
  return (
    <div>
      <FaBeer />
    </div>
  )
}

export default client = defineConfig({
  name: 'default',
  title: ' ',
  icon: () => (
    <Image
      src={
        'https://cdn.sanity.io/images/bu9ovu6d/production/e51460b780f02b0d866d05807a1b619772955841-24x31.jpg'
      } // Replace with your logo path
      alt="My Logo"
      width={24}
      height={28}
    />
  ),

  basePath: '/studio',
  projectId: projectId,
  dataset: dataset,
  apiVersion: 'vX',
  plugins: [
    singletonPlugin(['homeDocument', 'settings', 'userSchema', 'allOrders']),
    structureTool({
      structure: pageStructure([homeDocument, settings, allOrders]),
      defaultDocumentNode: (S, { schemaType }) => {
        return S.document().views([
          // Default form view
          S.view.form(),
          // Preview
          S.view.component(Iframe).options(iframeOptions).title('Preview'),
        ])
      },
    }),
    media(),
  ],

  schema: {
    // If you want more content types, you can add them to this array
    types: [
      // Singletons
      allOrders,
      homeDocument,
      settings,
      // Documents
      grapesEditor,
      page,
      prod,
      globalBlocks,
    ],
  },
  form: {
    components: {
      input: (props: any) => {
        if (props.schemaType.name === 'grapesEditor') {
          return <Grapes {...props} />
        }
        return props.renderDefault(props)
      },
    },
  },
})

export { projectId, dataset, readToken as token }
