import { Link } from 'react-router-dom'
import { CATEGORIES, categoryHeroUrl } from '../../data/seed'
import type { Category } from '../../types/product'

export default function CategoryList() {
  return (
    <section id="categorias" aria-label="Categorias" className="container-editorial py-10 md:py-14">
      <div className="flex items-end justify-between gap-8 border-b border-bordo/25 pb-4">
        <div>
          <p className="label-eyebrow mb-2">02 · Coleção</p>
          <h2 className="font-h-editorial">
            Navegue por <em className="italic text-bordo">categorias</em>.
          </h2>
        </div>
        <p className="hidden max-w-sm font-serif italic text-base leading-relaxed text-vinho/70 md:block md:text-lg">
          Seis recortes da mesma coleção. Cada peça pensada para um momento diferente da sua rotina.
        </p>
      </div>

      <ol className="mt-6 grid grid-cols-12 gap-3 md:gap-5">
        {CATEGORIES.map((c, i) => (
          <CategoryTile key={c.slug} category={c} index={i} />
        ))}
      </ol>
    </section>
  )
}

function CategoryTile({ category, index }: { category: Category; index: number }) {
  const even = index % 2 === 0
  const hero = categoryHeroUrl(category)
  const aspect = category.heroSize.startsWith('landscape')
    ? 'aspect-[16/10]'
    : category.heroSize === 'portrait_4_3'
      ? 'aspect-[4/5]'
      : category.heroSize === 'portrait_16_9'
        ? 'aspect-[9/16]'
        : 'aspect-square'

  return (
    <li
      className={`${even ? 'col-span-12 lg:col-span-8' : 'col-span-12 lg:col-span-4'} ${even ? '' : 'lg:self-end'}`}
    >
      <Link
        to={`/loja/categoria/${category.slug}`}
        aria-label={`Entrar em ${category.name}`}
        className="group relative block overflow-hidden border border-bordo/10 bg-creme-deep"
      >
        <div className={`relative w-full overflow-hidden ${aspect}`}>
          <img
            src={hero.url}
            alt={hero.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-vinho/75 via-vinho/20 to-transparent"
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 text-creme">
          <div className="flex items-start justify-between gap-4">
            <span className="font-serif italic text-xl text-creme/80 md:text-2xl">
              0{index + 1}
            </span>
          </div>

          <div>
            <h3
              className={`font-serif leading-[0.95] tracking-tight ${even ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'} ${even ? '' : 'italic text-creme/90'}`}
            >
              {category.name}
            </h3>
            <p className="mt-2 max-w-md font-serif italic text-sm leading-relaxed text-creme/80 md:text-base">
              {category.lead}
            </p>
            <div className="mt-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-creme/85 group-hover:text-creme">
              Entrar
              <span className="inline-block h-px w-10 bg-creme/70 transition-all duration-500 group-hover:w-16 group-hover:bg-creme" aria-hidden />
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
