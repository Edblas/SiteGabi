export default function VisitStore() {
  const endereco = import.meta.env.VITE_LOJA_ENDERECO || 'Av. São José, 1261 · 1º andar'
  const cidade = 'Alfenas · MG'
  const whatsRaw = (import.meta.env.VITE_WHATSAPP_NUMBER || '5535997061703').replace(/\D/g, '')
  const whatsLink = `https://wa.me/${whatsRaw || '5535997061703'}?text=${encodeURIComponent(
    'Olá Gabi! Vim pelo site e gostaria de informações sobre a loja física da Amorena.',
  )}`

  const mapsQuery = encodeURIComponent(`${endereco}, ${cidade}`)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

  return (
    <section id="loja-fisica" aria-label="Visite a loja física" className="container-editorial py-24 md:py-32">
      <div className="grid grid-cols-12 gap-10 items-start">
        <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
          <p className="label-eyebrow mb-3">05 · Loja física</p>
          <h2 className="font-h-editorial">
            Visite-nos. Prove, <em className="italic text-bordo">toque</em>, leve.
          </h2>
          <address className="mt-8 not-italic font-serif text-2xl leading-relaxed text-vinho/85">
            {endereco}
            <br />
            {cidade}
          </address>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-bordo/15 py-6 max-w-md">
            <div>
              <dt className="label-eyebrow">Horário</dt>
              <dd className="mt-2 font-serif text-lg leading-relaxed text-vinho/80">
                {/* TODO: horário a confirmar */}
                Seg a sex · 10h–19h
                <br />
                Sáb · 10h–14h
              </dd>
            </div>
            <div>
              <dt className="label-eyebrow">Contato</dt>
              <dd className="mt-2 font-serif text-lg leading-relaxed text-vinho/80">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
                  Abrir no mapa
                </a>
                <br />
                <a href={whatsLink} target="_blank" rel="noopener noreferrer" className="link-underline">
                  WhatsApp · resposta rápida
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-bordo">
              Traçar rota
            </a>
            <a href="#categorias" className="btn-ghost">
              Comprar online
            </a>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-bordo/15 bg-creme-deep">
            <iframe
              title="Mapa da loja Amorena"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale contrast-[0.95] opacity-90"
              src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
              onError={(e) => {
                // Fallback se Google Maps recusar iframe
                const target = e.currentTarget
                const alt = document.createElement('div')
                alt.className =
                  'absolute inset-0 flex flex-col items-center justify-center bg-creme-deep p-10 text-center'
                alt.innerHTML = `
                  <span class="font-serif italic text-7xl text-bordo/70">mapa</span>
                  <p class="mt-6 max-w-md font-serif italic text-xl text-vinho/80">
                    ${endereco}<br />${cidade}
                  </p>
                  <a class="mt-8 inline-flex items-center gap-2 border border-bordo px-6 py-3 text-[11px] uppercase tracking-wideish text-bordo hover:bg-bordo hover:text-creme transition-colors" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
                    Abrir no Google Maps
                  </a>
                `
                target.replaceWith(alt)
              }}
            />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-editorial text-vinho/55">
            {endereco} · {cidade}
          </p>
        </div>
      </div>
    </section>
  )
}
