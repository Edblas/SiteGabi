import ProductCard from '../components/product/ProductCard'
import { PRODUCTS } from '../data/seed'
import { siteConfig } from '../config/siteConfig'
import useSEO from '../hooks/useSEO'

export default function NovidadesPage() {
  useSEO({
    title: 'Novidades · ' + siteConfig.seo.storeTitle,
    description: 'As peças que chegaram agora na Amorena Moda Feminina.',
    image: siteConfig.seo.ogImageUrl,
  })

  const list = PRODUCTS.filter((p) => p.isNew)
  // Se houver poucas novidades no seed, complementa com 6 mais recentes por ordem de ID
  const complementar = list.length < 6
  const items = complementar
    ? [...list, ...PRODUCTS.filter((p) => !p.isNew).slice(0, 6 - list.length)]
    : list

  return (
    <section className="container-editorial py-14 md:py-20">
      <header className="border-b border-bordo/25 pb-8">
        <p className="label-eyebrow mb-3">Novidades · Coleção atual</p>
        <h1 className="font-h-editorial">
          Peças que <em className="italic text-bordo">chegaram agora</em>.
        </h1>
        <p className="mt-5 max-w-xl font-serif italic text-xl leading-relaxed text-vinho/75">
          Selecionadas a dedo. Primeiro para quem veste Amorena.
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-editorial text-vinho/60">
          Mostrando {items.length} peças
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i === 0} />
        ))}
      </div>
    </section>
  )
}
