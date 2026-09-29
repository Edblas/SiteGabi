import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Product, Size } from '../types/product'
import { PRODUCTS, CASH_DISCOUNT_PCT, formatCurrency, getCashPriceInCents, getCategory, getColor, getEffectivePrice, getStock } from '../data/seed'
import ProductCard from '../components/product/ProductCard'
import { siteConfig } from '../config/siteConfig'
import useSEO from '../hooks/useSEO'
import { useCart } from '../context/CartContext'
import { useAnalytics } from '../hooks/useAnalytics'

function firstAvailableSize(product: Product, colorId: string): Size | null {
  const sizes = product.availableSizes
  for (const s of sizes) {
    if (getStock(product, colorId, s) > 0) return s
  }
  return sizes[0] ?? null
}

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { trackEvent } = useAnalytics()

  const product = PRODUCTS.find((p) => p.slug === slug)

  useSEO({
    title: product
      ? `${product.name} ${product.subtitle} · Amorena`
      : 'Peça não encontrada · Amorena',
    description: product?.shortDescription ?? siteConfig.seo.storeDescription,
    image: product?.images?.[0]?.url ?? siteConfig.seo.ogImageUrl,
  })

  const [activeImg, setActiveImg] = useState(0)
  const [colorId, setColorId] = useState(product?.colorIds[0] ?? '')
  const [size, setSize] = useState<Size | null>(
    product ? firstAvailableSize(product, product.colorIds[0] ?? '') : null,
  )
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState<string | null>(null)

  const price = useMemo(
    () => (product ? getEffectivePrice(product) : 0),
    [product],
  )
  const cashPrice = useMemo(() => getCashPriceInCents(price), [price])
  const cashLinePrice = useMemo(() => getCashPriceInCents(price * qty), [price, qty])

  const installments = useMemo(() => {
    const plans: { times: number; value: number }[] = []
    for (let i = 2; i <= 6; i++) {
      plans.push({ times: i, value: Math.round(price / i) })
    }
    return plans
  }, [price])

  // Auto-selecionar primeiro tamanho disponível ao trocar de cor
  useEffect(() => {
    if (!product || !colorId) return
    const first = firstAvailableSize(product, colorId)
    setSize((prev) => {
      if (prev && getStock(product, colorId, prev) > 0) return prev
      return first
    })
  }, [product, colorId])

  // Toast desaparece automaticamente após 2.2s
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  if (!product) {
    return (
      <div className="container-editorial py-24 text-center">
        <p className="label-eyebrow">Peça não encontrada</p>
        <h1 className="mt-4 font-serif italic text-6xl text-bordo">perdida</h1>
        <Link to="/" className="btn-bordo mt-10 inline-flex">Voltar</Link>
      </div>
    )
  }

  const category = getCategory(product.category)
  const stock = colorId && size ? getStock(product, colorId, size) : 0
  const hasSelection = colorId && size && stock > 0
  const colorObj = getColor(colorId)

  const whatsMsg = encodeURIComponent(
    `Olá Gabi! Tenho interesse em comprar a peça:\n\n` +
    `• ${product.name}\n` +
    `  Cor: ${colorObj?.name ?? colorId}\n` +
    `  Tamanho: ${size ?? '—'}\n` +
    `  Quantidade: ${qty}\n\n` +
    `Valor: ${formatCurrency(price * qty)}\n` +
    `Referência: ${product.id}\n` +
    `Link: ${typeof window !== 'undefined' ? window.location.href : ''}`,
  )
  const whatsNum = (import.meta.env.VITE_WHATSAPP_NUMBER || '5535997061783').replace(/\D/g, '')
  const whatsLink = `https://wa.me/${whatsNum}?text=${whatsMsg}`

  // Sugestões (produtos da mesma categoria, excluindo o atual)
  const suggestions = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="container-editorial py-12 md:py-16">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-editorial text-vinho/55">
        <Link to="/" className="link-underline">Início</Link>
        <span className="text-bordo/40">/</span>
        <Link to={`/loja/categoria/${product.category}`} className="link-underline">
          {category?.name ?? product.category}
        </Link>
        <span className="text-bordo/40">/</span>
        <span className="text-vinho/85">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Galeria */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-2 order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  aria-label={`Ver imagem ${i + 1} do produto`}
                  className={`shrink-0 aspect-[4/5] w-20 md:w-full overflow-hidden border ${i === activeImg ? 'border-bordo' : 'border-bordo/15'}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-10 order-1 md:order-2 aspect-[4/5] w-full overflow-hidden border border-bordo/10 bg-creme-deep">
              <img
                src={product.images[activeImg].url}
                alt={product.images[activeImg].alt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Ficha */}
        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-[108px] lg:self-start">
          <p className="label-eyebrow mb-3">
            {product.category.toUpperCase()} · {product.id}
          </p>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.25rem)] leading-[1.05] text-vinho">
            {product.name}
          </h1>
          <p className="mt-2 font-serif italic text-2xl text-bordo/80">{product.subtitle}</p>

          <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-y border-bordo/15 py-6">
            {product.promotionalPriceInCents && (
              <span className="font-serif text-xl text-vinho/40 line-through">
                {formatCurrency(product.priceInCents)}
              </span>
            )}
            <span className="font-serif text-5xl text-vinho">{formatCurrency(price)}</span>
            <span className="chip bg-bordo text-creme border-bordo">
              -{CASH_DISCOUNT_PCT}% à vista
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <p className="font-serif text-3xl text-bordo">
              {formatCurrency(cashPrice)}{' '}
              <span className="text-[11px] uppercase tracking-editorial text-bordo/80">· pagamento à vista</span>
            </p>
            <div className="space-y-1.5 text-[12px] uppercase tracking-wideish text-vinho/65">
              <p>em até 6x sem juros no cartão</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-1">
                {installments.map((p) => (
                  <li key={p.times} className="font-serif text-base normal-case tracking-normal text-vinho/80">
                    {p.times}x · {formatCurrency(p.value)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-[15px] leading-relaxed text-vinho/80 max-w-lg">
            {product.longDescription}
          </p>

          {/* Cor */}
          <div className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="label-eyebrow">Cor</p>
              <p className="font-serif italic text-base text-vinho/80">{colorObj?.name}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colorIds.map((cid) => {
                const c = getColor(cid)
                if (!c) return null
                const on = cid === colorId
                return (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => { setColorId(cid); setSize(null) }}
                    aria-label={`Selecionar cor ${c.name}`}
                    className={`flex items-center gap-2 border px-3 py-2 text-[11px] uppercase tracking-wideish ${on ? 'border-bordo text-bordo' : 'border-bordo/15 text-vinho/70 hover:border-bordo/45'}`}
                  >
                    <span className="block h-4 w-4 rounded-full border border-vinho/10" style={{ backgroundColor: c.hex }} />
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tamanho */}
          <div className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="label-eyebrow">Tamanho</p>
              <Link to="/institucional/medidas" className="font-serif italic text-sm text-bordo/80 link-underline">
                Tabela de medidas
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((s) => {
                const sStock = getStock(product, colorId, s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    disabled={sStock === 0}
                    className={`min-w-[56px] border px-4 py-2.5 text-[12px] uppercase tracking-wideish ${size === s ? 'border-bordo text-bordo' : sStock === 0 ? 'border-bordo/10 text-vinho/25 line-through cursor-not-allowed' : 'border-bordo/15 text-vinho/75 hover:border-bordo/45'}`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            {size && (
              <p className={`mt-3 text-[11px] uppercase tracking-editorial ${stock > 0 ? 'text-vinho/60' : 'text-bordo'}`}>
                {stock > 0 ? `Estoque disponível — ${stock} un.` : 'Tamanho indisponível nesta cor'}
              </p>
            )}
          </div>

          {/* Quantidade + botões */}
          <div className="mt-10 space-y-3">
            <div className="flex items-center justify-between border border-bordo/15 py-1 pl-4 pr-1">
              <span className="label-eyebrow">Quantidade</span>
              <div className="flex items-center">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" className="h-10 w-10 text-lg font-serif text-vinho/80 hover:text-bordo">
                  −
                </button>
                <span className="w-10 text-center font-serif text-lg text-vinho">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(stock || 99, q + 1))} aria-label="Aumentar quantidade" className="h-10 w-10 text-lg font-serif text-vinho/80 hover:text-bordo">
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => {
                if (!product || !colorId || !size) return
                const res = addToCart(product, colorId, size, qty)
                if (res.ok) {
                  trackEvent('cart_add_item', {
                    productId: product.id,
                    sku: res.added?.sku,
                    slug: product.slug,
                    colorId,
                    size,
                    qty,
                    unitPrice: res.added?.unitPrice,
                  })
                  setToast(`${product.name} · ${qty} un. adicionada${qty === 1 ? '' : 's'} à sacola →`)
                }
              }}
              className="btn-bordo w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              Adicionar ao carrinho — {formatCurrency(price * qty)}
            </button>
            {hasSelection && (
              <p className="text-center font-serif italic text-sm text-bordo/85">
                ou {formatCurrency(cashLinePrice)} à vista (−{CASH_DISCOUNT_PCT}%)
              </p>
            )}
            {!hasSelection && (
              <p className="mt-2 text-right text-[11px] uppercase tracking-editorial text-bordo/85">
                Selecione cor e tamanho para continuar
              </p>
            )}
            {toast && (
              <div
                role="status"
                aria-live="polite"
                className="mt-3 flex items-center gap-3 border border-bordo/20 bg-rose-soft/30 px-4 py-3 text-vinho shadow-[0_0_40px_rgba(88,18,33,0.12)]"
              >
                <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-bordo" />
                <span className="font-serif italic text-[15px] leading-snug text-vinho md:text-base">
                  {toast}
                </span>
              </div>
            )}

            <a href={whatsLink} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
              Pedir pelo WhatsApp
            </a>

            <button type="button" onClick={() => navigate(-1)} className="btn-ghost w-full">
              Continuar comprando
            </button>
          </div>

          {/* Detalhes técnicos */}
          <dl className="mt-12 divide-y divide-bordo/15 border-y border-bordo/15">
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="label-eyebrow col-span-1">Composição</dt>
              <dd className="col-span-2 font-serif text-[15px] leading-relaxed text-vinho/80">{product.composition}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="label-eyebrow col-span-1">Cuidados</dt>
              <dd className="col-span-2 font-serif text-[15px] leading-relaxed text-vinho/80">{product.care}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="label-eyebrow col-span-1">Envio</dt>
              <dd className="col-span-2 font-serif text-[15px] leading-relaxed text-vinho/80">
                Para todo o Brasil · cálculo por CEP no carrinho · retirada na loja disponível.
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
              <dt className="label-eyebrow col-span-1">Trocas</dt>
              <dd className="col-span-2 font-serif text-[15px] leading-relaxed text-vinho/80">
                Em até 30 dias após o recebimento. Confira nossa política para mais detalhes.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-24 md:mt-32">
          <div className="border-b border-bordo/25 pb-6 mb-12">
            <p className="label-eyebrow mb-3">Também pode gostar</p>
            <h2 className="font-h-editorial">
              Peças da mesma <em className="italic text-bordo">família</em>.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
