import { NextStudio } from 'next-sanity/studio'
import { metadata } from 'next-sanity/studio/metadata'
import config from '../../../sanity.config'

export default function StudioPage() {
  return (
    <div>
      {Object.entries(metadata).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
      <NextStudio config={config} unstable_globalStyles />
    </div>
  )
}
