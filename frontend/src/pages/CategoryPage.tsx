import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { AppliedFilters, Size, SortOption } from '../types/product'
import { COLORS, PRODUCTS, getCategory, formatCurrency } from '../data/seed'
import ProductCard from '../components/product/ProductCard'
import { siteConfig } from '../config/siteConfig'
import useSEO from '../hooks/useSEO'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = getCategory(slug ?? '')

  useSEO({
    title: category ? `${category.name} · Amorena` : 'Catálogo · Amorena',
    description: category?.lead ?? siteConfig.seo.storeDescription,
    image: siteConfig.seo.ogImageUrl,
  })

  const [filters, setFilters] = useState<AppliedFilters>({
    colors: [],
    sizes: [],
    sort: 'featured',
  })

  const list = useMemo(() => {
    const base = category ? PRODUCTS.filter((p) => p.category === slug) : PRODUCTS

    let arr = base.slice()
    if (filters.colors.length) {
      arr = arr.filter((p) => p.colorIds.some((c) => filters.colors.includes(c)))
    }
    if (filters.sizes.length) {
      arr = arr.filter((p) => p.availableSizes.some((s) => filters.sizes.includes(s)))
    }
    if (filters.minPrice != null) {
      arr = arr.filter((p) => (p.promotionalPriceInCents ?? p.priceInCents) >= (filters.minPrice ?? 0))
    }
    if (filters.maxPrice != null) {
      arr = arr.filter((p) => (p.promotionalPriceInCents ?? p.priceInCents) <= (filters.maxPrice ?? Infinity))
    }

    switch (filters.sort) {
      case 'price-asc':
        arr.sort((a, b) => (a.promotionalPriceInCents ?? a.priceInCents) - (b.promotionalPriceInCents ?? b.priceInCents)); break
      case 'price-desc':
        arr.sort((a, b) => (b.promotionalPriceInCents ?? b.priceInCents) - (a.promotionalPriceInCents ?? a.priceInCents)); break
      case 'newest':
        arr.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)); break
      case 'best-sellers':
        arr.sort((a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller)); break
      default: break
    }
    return arr
  }, [slug, category, filters])

  // Valores únicos para os filtros (baseado no que realmente existe nesta categoria)
  const availableColors = useMemo(() => {
    const ids = new Set<string>()
    list.forEach((p) => p.colorIds.forEach((c) => ids.add(c)))
    return COLORS.filter((c) => ids.has(c.id))
  }, [list])

  const availableSizes = useMemo(() => {
    const s = new Set<Size>()
    list.forEach((p) => p.availableSizes.forEach((sz) => s.add(sz)))
    return Array.from(s).sort()
  }, [list])

  function toggleColor(id: string) {
    setFilters((f) => ({ ...f, colors: f.colors.includes(id) ? f.colors.filter((x) => x !== id) : [...f.colors, id] }))
  }
  function toggleSize(size: Size) {
    setFilters((f) => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter((x) => x !== size) : [...f.sizes, size] }))
  }

  return (
    <div className="container-editorial py-12 md:py-16">
      <header className="border-b border-bordo/25 pb-8">
        <p className="label-eyebrow mb-3">{category?.eyebrow ?? 'Catálogo completo'}</p>
        <h1 className="font-h-editorial">
          {category?.name ?? 'Todas as peças'}
        </h1>
        {category && (
          <p className="mt-5 max-w-xl font-serif italic text-xl leading-relaxed text-vinho/75">
            {category.lead}
          </p>
        )}
        <dl className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3 text-[11px] uppercase tracking-editorial text-vinho/60">
          <div className="flex items-baseline gap-2">
            <dt>Mostrando</dt>
            <dd className="font-serif italic text-base normal-case tracking-normal text-vinho">{list.length} peças</dd>
          </div>
          <div className="h-3 w-px bg-bordo/30" />
          <div className="flex items-baseline gap-2">
            <dt>Coleção</dt>
            <dd className="font-serif italic text-base normal-case tracking-normal text-vinho">
              {category?.name ?? 'Amorena'}
            </dd>
          </div>
        </dl>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-3 lg:sticky lg:top-[108px] lg:h-fit">
          <div className="flex flex-wrap gap-3 lg:flex-col lg:gap-8">
            {/* Cores */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-bordo/15 pb-2">
                <p className="label-eyebrow">Cores</p>
                {filters.colors.length > 0 && (
                  <button type="button" onClick={() => setFilters((f) => ({ ...f, colors: [] }))} className="text-[10px] uppercase tracking-editorial text-bordo/80 hover:text-bordo">
                    Limpar ({filters.colors.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((c) => {
                  const on = filters.colors.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleColor(c.id)}
                      className={`group flex flex-col items-center gap-1.5 ${on ? 'opacity-100' : 'opacity-85 hover:opacity-100'}`}
                      aria-pressed={on}
                      aria-label={`Cor ${c.name}`}
                    >
                      <span className={`h-7 w-7 rounded-full border ${on ? 'border-vinho ring-2 ring-bordo/30 ring-offset-2 ring-offset-creme' : 'border-vinho/15'}`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[10px] uppercase tracking-wideish text-vinho/65 group-hover:text-vinho">
                        {c.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tamanhos */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-bordo/15 pb-2">
                <p className="label-eyebrow">Tamanhos</p>
                {filters.sizes.length > 0 && (
                  <button type="button" onClick={() => setFilters((f) => ({ ...f, sizes: [] }))} className="text-[10px] uppercase tracking-editorial text-bordo/80 hover:text-bordo">
                    Limpar ({filters.sizes.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => {
                  const on = filters.sizes.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`min-w-[44px] border px-3 py-2 text-[12px] uppercase tracking-wideish ${on ? 'border-bordo text-bordo' : 'border-bordo/15 text-vinho/75 hover:border-bordo/45'}`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Faixa de preço */}
            <div>
              <p className="label-eyebrow mb-4 border-b border-bordo/15 pb-2">Preço</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wideish text-vinho/55">Mínimo</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={filters.minPrice == null ? '' : filters.minPrice / 100}
                    onChange={(e) => {
                      const v = e.target.value === '' ? undefined : Number(e.target.value) * 100
                      setFilters((f) => ({ ...f, minPrice: v }))
                    }}
                    className="w-full border-b border-bordo/25 bg-transparent py-2 text-sm font-serif text-vinho focus:outline-none focus:border-bordo"
                    placeholder="R$ 0"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wideish text-vinho/55">Máximo</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={filters.maxPrice == null ? '' : filters.maxPrice / 100}
                    onChange={(e) => {
                      const v = e.target.value === '' ? undefined : Number(e.target.value) * 100
                      setFilters((f) => ({ ...f, maxPrice: v }))
                    }}
                    className="w-full border-b border-bordo/25 bg-transparent py-2 text-sm font-serif text-vinho focus:outline-none focus:border-bordo"
                    placeholder="R$ 1000"
                  />
                </label>
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-editorial text-vinho/55">
                De {formatCurrency(filters.minPrice ?? 0)} até {formatCurrency(filters.maxPrice ?? 99999900)}
              </p>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-bordo/15 pb-4">
            <p className="text-[11px] uppercase tracking-editorial text-vinho/60">
              {filters.colors.length + filters.sizes.length + (filters.minPrice != null || filters.maxPrice != null ? 1 : 0)} filtros ativos
            </p>
            <label className="flex items-center gap-3 text-[11px] uppercase tracking-editorial text-vinho/70">
              <span>Ordenar</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortOption }))}
                className="border border-bordo/20 bg-creme px-3 py-2 text-[12px] uppercase tracking-wideish text-vinho focus:outline-none focus:border-bordo"
              >
                <option value="featured">Destaque</option>
                <option value="newest">Novidades</option>
                <option value="best-sellers">Mais vendidos</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </label>
          </div>

          {list.length === 0 ? (
            <div className="py-24 text-center border-y border-bordo/10">
              <p className="font-serif italic text-3xl text-bordo/80">sem resultados</p>
              <p className="mt-4 text-sm text-vinho/70">Tente remover alguns filtros.</p>
              <button type="button" onClick={() => setFilters({ colors: [], sizes: [], sort: 'featured' })} className="btn-ghost mt-8">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i === 0} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
