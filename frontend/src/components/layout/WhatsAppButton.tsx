const WA_ICON = (
  <svg
    viewBox="0 0 32 32"
    className="h-6 w-6"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16 3a13 13 0 0 0-11.2 19.5L3.5 29l6.7-1.3A13 13 0 1 0 16 3Zm7 18c-.3.9-1.7 1.6-2.4 1.6-.6 0-1.4-.1-2.3-.5-5-1.7-8.3-6-8.5-6.3-.3-.3-2.2-3-2.2-5.6 0-2.7 1.4-4 1.9-4.5.5-.5 1.1-.6 1.5-.6h1c.3 0 .8-.1 1.2 1l1.6 4.1c.2.5.3 1.1 0 1.3 0 .1-.2.2-.4.3-.2.1-.4.3-.6.5-.2.2-.4.5-.2 1 .2.5 1 2 2.1 3.3 1.5 1.7 2.8 2.3 3.2 2.6.5.3.8.2 1.1-.1l1.3-1.6c.2-.3.5-.5 1-.4.4 0 2.7 1.3 3.1 1.5.5.3.8.5.9.7.2.1.2.9-.1 1.8Z" />
  </svg>
)

function buildDefaultMessage(): string {
  const origin = typeof window !== 'undefined' ? window.location.href : 'https://amorena.com.br'
  return encodeURIComponent(
    `Olá Gabi! Vim pelo site Amorena Moda Feminina e gostaria de mais informações.\n\nReferência: ${origin}`,
  )
}

export default function WhatsAppButton() {
  const raw = (import.meta.env.VITE_WHATSAPP_NUMBER || '5535997061703').replace(/\D/g, '')
  const number = raw || '5535997061703'
  const href = `https://wa.me/${number}?text=${buildDefaultMessage()}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp com a Gabi · Amorena"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 border border-bordo/15 bg-creme px-4 py-3 shadow-card hover:border-bordo"
    >
      <span className="text-bordo group-hover:scale-105 transition-transform">{WA_ICON}</span>
      <span className="hidden sm:inline-flex text-[11px] uppercase tracking-wideish font-medium text-bordo">
        Falar com a Gabi
      </span>
      <span
        className="pointer-events-none absolute -top-1.5 -right-1.5 inline-flex h-3 w-3 animate-pulse rounded-full bg-bordo"
        aria-hidden="true"
      />
    </a>
  )
}
