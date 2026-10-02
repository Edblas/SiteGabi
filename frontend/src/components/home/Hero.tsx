import { Link } from 'react-router-dom'
import { CONTENT } from '../../data/seed'

export default function Hero() {
  const hc = CONTENT.heroColecao
  const h1 = hc.primaryButton
  const h2 = hc.secondaryButton
  return (
    <section className="relative">
      <div className="container-editorial relative pb-10 pt-8 md:pt-10">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-6 md:pr-6 order-2 md:order-1">
            <p className="label-eyebrow">{hc.eyebrow}</p>
            <h1 className="mt-3 font-display text-vinho">
              <span className="block">{hc.headlineLine1}</span>
              <span className="block italic text-bordo">{hc.headlineLine2}</span>
              <span className="block">{hc.headlineLine3}</span>
            </h1>
            <p className="mt-6 max-w-md font-serif italic text-base leading-relaxed text-vinho/80 md:text-lg">
              {hc.paragraph}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to={h1.link} className={h1.variant === 'solid' ? 'btn-bordo' : 'btn-ghost'}>
                {h1.label}
              </Link>
              <Link to={h2.link} className={h2.variant === 'solid' ? 'btn-bordo' : 'btn-ghost'}>
                {h2.label}
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 max-w-md divide-x divide-bordo/15 border-y border-bordo/15 py-4">
              {hc.stats.map((st) => (
                <div key={st.eyebrow} className="px-3 text-center first:pl-0 last:pr-0">
                  <dt className="label-eyebrow">{st.eyebrow}</dt>
                  <dd className="mt-1.5 font-serif text-2xl text-vinho">{st.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-12 md:col-span-6 order-1 md:order-2 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-bordo/10 bg-creme-deep">
              <img
                src={hc.imageUrl}
                alt={hc.imageAlt}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-hero-bleed" aria-hidden="true" />
              <span className="absolute left-4 top-4 chip bg-creme/85 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-bordo" />
                {hc.badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
