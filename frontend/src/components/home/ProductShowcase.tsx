import type { Product } from '../../types/product'
import ProductCard from '../product/ProductCard'

interface Props {
  eyebrow: string
  title: React.ReactNode
  lead?: string
  products: Product[]
  variant?: 'default' | 'bestsellers'
}

export default function ProductShowcase({ eyebrow, title, lead, products, variant = 'default' }: Props) {
  const grid =
    variant === 'bestsellers'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-16'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'

  return (
    <section className="container-editorial py-20 md:py-24">
      <div className="mb-12 grid grid-cols-12 items-end gap-6 border-b border-bordo/25 pb-6">
        <div className="col-span-12 md:col-span-7">
          <p className="label-eyebrow mb-3">{eyebrow}</p>
          <h2 className="font-h-editorial">{title}</h2>
        </div>
        {lead && (
          <p className="col-span-12 md:col-span-5 max-w-md font-serif italic text-lg leading-relaxed text-vinho/70 md:text-right md:justify-self-end">
            {lead}
          </p>
        )}
      </div>

      <div className={grid}>
        {products.map((p, i) => {
          if (variant === 'bestsellers') {
            // Grade irregular para mais vendidos:
            // 0 → 6 col (wide card) · 1 → 4 col · 2 → 4 col · 3 → 4 col
            const spans = ['lg:col-span-6', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-6', 'lg:col-span-6']
            const lay = i === 0 ? 'wide' : 'default'
            return (
              <div key={p.id} className={`${spans[i % spans.length]}`}>
                <ProductCard product={p} layout={lay} priority={i === 0} />
              </div>
            )
          }
          return (
            <div key={p.id}>
              <ProductCard product={p} priority={i < 2} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
