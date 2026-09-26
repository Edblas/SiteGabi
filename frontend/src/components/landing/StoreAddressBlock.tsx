import { siteConfig } from '../../config/siteConfig'

interface Props {
  compact?: boolean
}

export default function StoreAddressBlock({ compact = false }: Props) {
  const { address, cityState, hours } = siteConfig.store
  const query = encodeURIComponent(`${address}, ${cityState}`)
  const maps = `https://www.google.com/maps/search/?api=1&query=${query}`

  return (
    <section
      aria-label="Loja física Amorena"
      className={`border border-bordo/20 bg-creme/60 backdrop-blur-sm ${compact ? 'rounded p-5 sm:p-6' : ''}`}
    >
      <header className="flex items-baseline justify-between border-b border-bordo/15 pb-3">
        <p className="label-eyebrow">{compact ? 'Loja física' : '01 · Loja física'}</p>
        <span className="font-serif italic text-sm text-bordo/75">Atendimento presencial</span>
      </header>

      <div className={`grid gap-6 ${compact ? 'mt-5' : 'mt-6'}`}>
        <div className="grid gap-4 sm:grid-cols-3 sm:divide-x sm:divide-bordo/15">
          <div className={compact ? '' : 'sm:pr-6'}>
            <p className="label-eyebrow mb-2">Endereço</p>
            <address className="not-italic font-serif text-lg leading-relaxed text-vinho">
              {address}
              <br />
              {cityState}
            </address>
          </div>
          <div className={compact ? 'sm:px-6' : 'sm:px-6'}>
            <p className="label-eyebrow mb-2">Horário</p>
            <p className="font-serif text-lg leading-relaxed text-vinho whitespace-pre-line">
              {hours}
            </p>
          </div>
          <div className={compact ? 'sm:pl-6' : 'sm:pl-6'}>
            <p className="label-eyebrow mb-2">Como chegar</p>
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-bordo bg-bordo px-4 py-2.5 text-[11px] uppercase tracking-[0.24em] text-creme hover:bg-creme hover:text-bordo transition-colors"
            >
              Abrir no mapa
              <span className="font-serif italic text-base normal-case tracking-normal">→</span>
            </a>
          </div>
        </div>

        <div
          className={`relative overflow-hidden border border-bordo/15 bg-creme-deep ${compact ? 'aspect-[16/9]' : 'aspect-[16/8]'}`}
        >
          <iframe
            title="Mapa da loja Amorena"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full grayscale contrast-[0.95] opacity-90"
            src={`https://www.google.com/maps?q=${query}&output=embed`}
            onError={(e) => {
              const target = e.currentTarget
              const alt = document.createElement('div')
              alt.className =
                'absolute inset-0 flex flex-col items-center justify-center bg-creme-deep p-10 text-center'
              alt.innerHTML = `
                <span class="font-serif italic text-5xl sm:text-6xl text-bordo/70">mapa</span>
                <p class="mt-5 max-w-md font-serif italic text-lg sm:text-xl text-vinho/80">
                  ${address}<br />${cityState}
                </p>
                <a class="mt-7 inline-flex items-center gap-2 border border-bordo px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-bordo hover:bg-bordo hover:text-creme transition-colors" href="${maps}" target="_blank" rel="noopener noreferrer">
                  Abrir no Google Maps
                  <span class="font-serif italic text-base normal-case tracking-normal">→</span>
                </a>
              `
              target.replaceWith(alt)
            }}
          />
        </div>
      </div>
    </section>
  )
}
