import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { COLORS, formatCurrency, getCashPriceInCents, getColor, CASH_DISCOUNT_PCT, getEffectivePrice } from '../../data/seed'
import ProductQuickView from './ProductQuickView'

interface Props {
  product: Product
  priority?: boolean
  layout?: 'default' | 'wide'
}

export default function ProductCard({ product, priority = false, layout = 'default' }: Props) {
  const [showQuickView, setShowQuickView] = useState(false)

  const firstImage = product.images[0]
  const secondImage = product.images[1] ?? product.images[0]

  const price = getEffectivePrice(product)
  const hasDiscount = !!product.promotionalPriceInCents
  const cashPrice = getCashPriceInCents(price)

  const colors = product.colorIds
    .map((id) => getColor(id))
    .filter((c): c is NonNullable<ReturnType<typeof getColor>> => Boolean(c))
    .slice(0, 5)

  return (
    <>
      <article className={`group flex flex-col ${layout === 'wide' ? 'lg:flex-row lg:gap-10' : ''}`}>
        <div className={`relative overflow-hidden bg-creme-deep ${layout === 'wide' ? 'lg:w-[55%]' : ''}`}>
          <Link
            to={`/produto/${product.slug}`}
            className="block aspect-[4/5] w-full"
            aria-label={`Ver detalhes de ${product.name}`}
          >
            <img
              src={firstImage.url}
              alt={firstImage.alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
            />
            <img
              src={secondImage.url}
              alt={secondImage.alt}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          </Link>

          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-2">
            {product.isNew && (
              <span className="chip bg-creme/90">Nova</span>
            )}
            {hasDiscount && (
              <span className="chip bg-bordo text-creme border-bordo">
                Promoção
              </span>
            )}
            {product.isBestSeller && !product.isNew && !hasDiscount && (
              <span className="chip bg-vinho/90 text-creme border-vinho/90">
                Mais amada
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowQuickView(true)}
            className="absolute bottom-3 right-3 border border-bordo/30 bg-creme/90 px-4 py-2 text-[10px] uppercase tracking-editorial text-bordo opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:bg-bordo hover:text-creme"
            aria-label={`Espiar ${product.name}`}
          >
            Espiar
          </button>
        </div>

        <div className={`flex-1 pt-4 sm:pt-5 ${layout === 'wide' ? 'lg:pt-2' : ''}`}>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="font-serif italic text-[15px] text-bordo/70">
                {product.subtitle}
              </p>
              <Link
                to={`/produto/${product.slug}`}
                className="mt-1 block font-serif text-2xl leading-snug text-vinho hover:text-bordo"
              >
                {product.name}
              </Link>
            </div>
            <div className="text-right">
              {hasDiscount && (
                <p className="text-[11px] text-vinho/50 line-through">
                  {formatCurrency(product.priceInCents)}
                </p>
              )}
              <p className="font-serif text-xl text-vinho">{formatCurrency(price)}</p>
              <p className="mt-0.5 font-serif text-base text-bordo">
                {formatCurrency(cashPrice)} <span className="text-[10px] uppercase tracking-wideish text-bordo/85">· à vista -{CASH_DISCOUNT_PCT}%</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-bordo/15 pt-4">
            <div className="flex items-center gap-2" aria-label="Cores disponíveis">
              {colors.map((c) => (
                <span
                  key={c.id}
                  title={c.name}
                  aria-label={c.name}
                  className="relative block h-4 w-4 rounded-full border border-vinho/10"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colorIds.length > colors.length && (
                <span className="text-[10px] uppercase tracking-wideish text-vinho/55">
                  +{product.colorIds.length - colors.length}
                </span>
              )}
            </div>

            <p className="text-[10px] uppercase tracking-editorial text-bordo/70">
              {product.availableSizes.join(' · ')}
            </p>
          </div>
        </div>
      </article>

      {showQuickView && (
        <ProductQuickView product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  )
}

// Re-exporta COLORS para resolver warning de "import not used" em alguns builds estritos
export { COLORS }
