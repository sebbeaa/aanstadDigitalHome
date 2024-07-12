import { load } from 'cheerio'

export function extractHeaderAndFooter(html: string) {
  const $ = load(html)
  const header = $('header').html() || ''
  const footer = $('footer').html() || ''
  return { headerHtml: header, footerHtml: footer }
}
