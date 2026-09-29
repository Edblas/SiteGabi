import { Link } from 'react-router-dom'
import { CATEGORIES, categoryHeroUrl } from '../data/seed'
import useSEO from '../hooks/useSEO'
import { siteConfig } from '../config/siteConfig'

export default function ColecaoPage() {
  useSEO({
    title: 'Coleção Amorena · por setor',
    description:
      'Explore a coleção Amorena organizada por setores editoriais: Vestidos, Conjuntos, Blusas, Calças, Saias e Acessórios.',
  })

  return (
    <section className="container-editorial py-10 md:py-16">
      {/* Header editorial */}
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-bordo/20 pb-10">
        <div className="max-w-3xl">
          <p className="label-eyebrow">Coleção 01 · Outono Inverno · Alfenas · MG</p>
          <h1 className="mt-4 font-h-editorial text-vinho">
            A coleção organizada em{' '}
            <em className="italic text-bordo">setores</em>.
          </h1>
          <p className="mt-6 max-w-xl font-serif italic text-xl leading-relaxed text-vinho/75 md:text-2xl">
            Escolha o universo que quer explorar primeiro. Cada setor com seu ritmo,
            mesma mão cuidadosa de sempre.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/loja" className="btn-ghost">
            ← Voltar para a loja
          </Link>
          <Link to="/loja/novidades" className="btn-outline">
            Ver tudo · Novidades →
          </Link>
        </div>
      </header>

      {/* Grid de setores (assimétrico editorial · Pinterest-like) */}
      <ol className="mt-12 grid grid-cols-12 gap-4 md:gap-6">
        {CATEGORIES.map((c, i) => {
          const even = i % 2 === 0
          const hero = categoryHeroUrl(c)
          return (
            <li
              key={c.slug}
              className={
                even
                  ? 'col-span-12 md:col-span-8'
                  : 'col-span-12 md:col-span-4 md:self-end'
              }
            >
              <Link
                to={`/loja/categoria/${c.slug}`}
                data-testid="setor-card"
                data-slug={c.slug}
                className="group relative block overflow-hidden border border-bordo/10 bg-creme-deep focus:outline-none focus-visible:ring-1 focus-visible:ring-bordo"
                aria-label={`Explorar setor ${c.name} — link para a categoria`}
              >
                <div
                  className={
                    even
                      ? 'relative aspect-[16/10] w-full overflow-hidden'
                      : 'relative aspect-[4/5] w-full overflow-hidden'
                  }
                >
                  <img
                    src={hero.url}
                    alt={hero.alt}
                    loading={i <= 1 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.045]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(43,18,22,0) 40%, rgba(43,18,22,0.45) 88%, rgba(43,18,22,0.75) 100%)',
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Conteúdo do card - canto inferior alinhado */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-8 text-creme">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <span className="inline-block font-serif italic text-sm text-creme/80 md:text-base">
                        {c.eyebrow}
                      </span>
                      <h2
                        className={
                          even
                            ? 'mt-2 font-serif leading-none tracking-tight text-creme text-[clamp(2.25rem,8vw,6rem)] group-hover:text-rose-nude transition-colors'
                            : 'mt-2 font-serif italic leading-none tracking-tight text-creme/95 text-[clamp(1.6rem,5.5vw,3.8rem)] group-hover:text-rose-nude transition-colors'
                        }
                      >
                        {c.name}
                      </h2>
                      {even ? (
                        <p className="mt-4 max-w-md font-serif italic text-base text-creme/75 md:text-lg">
                          {c.lead}
                        </p>
                      ) : null}
                    </div>

                    <span className="shrink-0 inline-flex items-center gap-3 border border-creme/35 bg-vinho/30 px-4 py-2 backdrop-blur-[2px] transition-colors group-hover:bg-creme group-hover:text-bordo">
                      <span className="text-[11px] uppercase tracking-[0.32em] font-medium">
                        Entrar
                      </span>
                      <span
                        className="inline-block h-px w-6 bg-creme transition-all group-hover:bg-bordo group-hover:w-10"
                        aria-hidden
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      {/* Call-to-action final */}
      <footer className="mt-16 border-t border-bordo/15 pt-10 md:mt-24 md:pt-16">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-eyebrow">00 · Resumo</p>
            <p className="mt-3 font-serif italic text-lg leading-relaxed text-vinho/80 md:text-xl max-w-2xl">
              Qualquer dúvida entre uma peça e outra? A Gabi ajuda — chama no
              WhatsApp e montamos o seu look ideal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/loja-fisica" className="btn-ghost">
              Visitar a loja física →
            </Link>
            <a
              href={siteConfig.links.whatsappColecao}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bordo"
            >
              Falar com a Gabi →
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
