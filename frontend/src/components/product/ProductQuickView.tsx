import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, Size } from '../../types/product'
import { formatCurrency, getColor, getStock } from '../../data/seed'

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductQuickView({ product, onClose }: Props) {
  const navigate = useNavigate()
  const [activeImg, setActiveImg] = useState(0)
  const [color, setColor] = useState(product.colorIds[0])
  const [size, setSize] = useState<Size | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const price = product.promotionalPriceInCents ?? product.priceInCents
  const stock = color && size ? getStock(product, color, size) : 0
  const currentColorName = getColor(color)?.label ?? ''

  const whatsText = encodeURIComponent(
    `Olá Gabi! Tenho interesse na peça ${product.name} (${currentColorName} ${size ?? 'tamanho?'}) — ${typeof window !== 'undefined' ? window.location.host : 'amorena'}.`,
  )
  const whatsLink = `https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '5535997061703').replace(/\D/g, '')}?text=${whatsText}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Espiar — ${product.name}`}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        aria-label="Fechar visualização rápida"
        onClick={onClose}
        className="absolute inset-0 bg-vinho/50 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-5xl bg-creme animate-fade-up sm:mx-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 z-10 px-5 py-4 text-[11px] uppercase tracking-editorial text-vinho/70 hover:text-bordo"
        >
          Fechar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-creme-deep/50 md:border-r border-bordo/10">
            <div className="aspect-[4/5] w-full">
              <img
                src={product.images[activeImg].url}
                alt={product.images[activeImg].alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 border-t border-bordo/10 p-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Ver imagem ${i + 1}`}
                    className={`h-20 w-16 overflow-hidden border ${i === activeImg ? 'border-bordo' : 'border-bordo/20'}`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-7">
            <p className="label-eyebrow">{product.category.toUpperCase()}</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight text-vinho">{product.name}</h2>
            <p className="mt-1 font-serif italic text-lg text-bordo/80">{product.subtitle}</p>

            <div className="mt-6 flex items-baseline gap-3">
              {product.promotionalPriceInCents && (
                <span className="text-sm text-vinho/40 line-through">
                  {formatCurrency(product.priceInCents)}
                </span>
              )}
              <span className="font-serif text-3xl text-vinho">{formatCurrency(price)}</span>
              <span className="text-[10px] uppercase tracking-wideish text-vinho/60">
                6x s/ juros · {formatCurrency(Math.round(price / 6))}
              </span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-vinho/75 max-w-md">
              {product.shortDescription}
            </p>

            <div className="mt-6">
              <p className="label-eyebrow mb-3">Cor — {currentColorName}</p>
              <div className="flex flex-wrap gap-2">
                {product.colorIds.map((cid) => {
                  const c = getColor(cid)
                  if (!c) return null
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setColor(cid)}
                      className={`flex items-center gap-2 border px-3 py-2 text-[11px] uppercase tracking-wideish ${color === cid ? 'border-bordo text-bordo' : 'border-bordo/15 text-vinho/70 hover:border-bordo/45'}`}
                    >
                      <span className="block h-3.5 w-3.5 rounded-full border border-vinho/10" style={{ backgroundColor: c.hex }} />
                      {c.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="label-eyebrow mb-3">Tamanho</p>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((s) => {
                  const sStock = getStock(product, color, s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      disabled={sStock === 0}
                      className={`min-w-[52px] border px-3 py-2 text-[12px] uppercase tracking-wideish ${size === s ? 'border-bordo text-bordo' : sStock === 0 ? 'border-bordo/10 text-vinho/25 line-through' : 'border-bordo/15 text-vinho/75 hover:border-bordo/45'}`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
              {size && (
                <p className={`mt-2 text-[11px] uppercase tracking-wideish ${stock > 0 ? 'text-vinho/60' : 'text-bordo'}`}>
                  {stock > 0 ? `${stock} un. disponíveis` : 'Tamanho indisponível nesta cor'}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                disabled={!size || stock === 0}
                className="btn-bordo disabled:cursor-not-allowed disabled:opacity-40"
              >
                Adicionar ao carrinho
              </button>
              <a
                href={whatsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-center"
              >
                Pedir pelo WhatsApp
              </a>
              <button
                type="button"
                onClick={() => navigate(`/produto/${product.slug}`)}
                className="btn-ghost text-center"
              >
                Ver ficha completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
