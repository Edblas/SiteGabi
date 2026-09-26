/**
 * Hook leve de tracking de eventos.
 * No momento apenas loga no console e emite window CustomEvent —
 * basta adicionar o script do Google Analytics / Meta Pixel em index.html
 * e subscrever `amorena:track` no window para encaminhar.
 */
export type TrackProps = Record<string, string | number | boolean | undefined | null>

export function trackEvent(name: string, props?: TrackProps) {
  if (typeof window === 'undefined') return
  const payload = { name, props, at: Date.now() }
  // TODO: em produção, descomentar o gtag/gtm abaixo:
  // // @ts-expect-error injetado por gtag
  // if (window.gtag) window.gtag('event', name, props)
  // // @ts-expect-error injetado por Meta
  // if (window.fbq) window.fbq('track', name, props)
  try {
    window.dispatchEvent(new CustomEvent('amorena:track', { detail: payload }))
  } catch {
    /* noop */
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[amorena:track]', name, props ?? {})
  }
}

export function useAnalytics() {
  return { trackEvent }
}
