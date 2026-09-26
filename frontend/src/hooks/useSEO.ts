import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

/**
 * Atualiza <title> + meta description + Open Graph em runtime.
 * Sem dependências, só DOM.
 */
export default function useSEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    document.title = title

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    if (image) setMeta('property', 'og:image', image)
    if (url) setMeta('property', 'og:url', url)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    if (image) setMeta('name', 'twitter:image', image)
  }, [title, description, image, url])
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}
