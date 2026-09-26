import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/seed'

export default function CategoryList() {
  return (
    <section id="categorias" aria-label="Categorias" className="container-editorial py-24 md:py-32">
      <div className="flex items-end justify-between gap-10 border-b border-bordo/25 pb-6">
        <div>
          <p className="label-eyebrow mb-3">02 · Coleção</p>
          <h2 className="font-h-editorial">
            Navegue por <em className="italic text-bordo">categorias</em>.
          </h2>
        </div>
        <p className="hidden max-w-sm font-serif italic text-lg leading-relaxed text-vinho/70 md:block">
          Sete recortes da mesma coleção. Cada peça pensada para um momento diferente da sua rotina.
        </p>
      </div>

      <ol className="divide-y divide-bordo/15">
        {CATEGORIES.map((c, i) => {
          const even = i % 2 === 0
          return (
            <li key={c.slug}>
              <Link
                to={`/categoria/${c.slug}`}
                className="group grid grid-cols-12 items-baseline gap-4 py-8 transition-colors hover:bg-creme-deep/60 md:py-10"
              >
                <span className="col-span-2 md:col-span-1 font-serif italic text-xl text-bordo/60 md:text-2xl">
                  0{i + 1}
                </span>

                <span
                  className={`col-span-10 md:col-span-5 font-serif tracking-tight leading-none transition-transform duration-300 group-hover:translate-x-2 group-hover:text-bordo ${even ? 'text-[clamp(2.5rem,9vw,6rem)]' : 'text-[clamp(2rem,7vw,4.5rem)] italic text-bordo/90'}`}
                >
                  {c.name}
                </span>

                <span className="col-span-8 md:col-span-4 hidden font-serif italic text-vinho/70 md:block md:text-lg">
                  {c.lead}
                </span>

                <span className="col-span-4 ml-auto text-right md:col-span-2">
                  <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-editorial text-bordo/80 group-hover:text-bordo">
                    Comprar
                    <span className="inline-block h-px w-8 bg-bordo/60 transition-all group-hover:w-12" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
