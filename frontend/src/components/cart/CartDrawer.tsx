import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../data/seed'
import { useAnalytics } from '../../hooks/useAnalytics'
import { siteConfig } from '../../config/siteConfig'

function buildCheckoutMessage(
  items: ReturnType<typeof useCart>['items'],
  subtotal: number,
  ref: string,
): string {
  const lines = items
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.productName} (${it.colorName} · ${it.size}) · ${it.qty} ${it.qty === 1 ? 'un.' : 'un.'} · ${formatCurrency(it.unitPrice)} cada = ${formatCurrency(it.qty * it.unitPrice)}`,
    )
    .join('\n')

  return [
    `Olá Gabi! Gostaria de finalizar meu pedido pelo site da Amorena:`,
    ``,
    `ITENS:`,
    lines,
    ``,
    `SUBTOTAL: ${formatCurrency(subtotal)}`,
    `FRETE: a confirmar pela Gabi`,
    `Referência: ${ref}`,
    ``,
    `Obrigada!`,
  ].join('\n')
}

const waLink = (msg: string) => {
  const number = siteConfig.whatsappNumber || '5535997061703'
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
}

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function TrashIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 12a2 2 0 0 0 2 1.9h6a2 2 0 0 0 2-1.9L18 7M10 11v6M14 11v6" />
    </svg>
  )
}

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    drawerOpen,
    closeDrawer,
    updateQty,
    removeItem,
    clearCart,
  } = useCart()
  const { trackEvent } = useAnalytics()
  const { pathname } = useLocation()
  const href = typeof window !== 'undefined' ? window.location.href : pathname
  const firstBtnRef = useRef<HTMLButtonElement | null>(null)

  // 1) Body overflow lock
  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  // 2) ESC fecha
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen, closeDrawer])

  if (!drawerOpen) return null

  const plural = itemCount === 1 ? 'item' : 'itens'
  const finalMessage = buildCheckoutMessage(items, subtotal, href)
  const finalizeHref = items.length > 0 ? waLink(finalMessage) : undefined

  const handleFinalize = () => {
    if (!finalizeHref) return
    trackEvent('cart_finalize_whatsapp', {
      itemCount,
      subtotal,
      skus: items.map((i) => i.sku ?? i.productId).join(','),
      slugs: items.map((i) => i.slug).join(','),
    })
    window.open(finalizeHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-vinho/30 backdrop-blur-[1px]"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-bordo/15 bg-creme text-vinho shadow-[0_0_80px_rgba(88,18,33,0.2)]"
        style={{
          animation: 'drawerSlideIn 260ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        }}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-bordo/15 px-5 py-5 md:px-7">
          <div>
            <p className="label-eyebrow">00 · Sua sacola</p>
            <h2
              id="cart-drawer-title"
              className="mt-2 font-serif italic text-2xl text-vinho md:text-3xl"
            >
              {itemCount > 0 ? `${itemCount} ${plural} selecionados` : 'Sua sacola ainda está vazia.'}
            </h2>
          </div>
          <button
            ref={firstBtnRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Fechar sacola"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-bordo/20 text-vinho/80 transition-colors hover:border-bordo hover:bg-bordo hover:text-creme focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bordo"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-2 md:px-7">
          {items.length === 0 ? (
            <EmptyState close={closeDrawer} />
          ) : (
            <ul className="divide-y divide-bordo/10 border-y border-bordo/10 py-2">
              {items.map((it) => (
                <CartLine
                  key={it.id}
                  item={it}
                  onUpdateQty={(n) => updateQty(it.id, n)}
                  onRemove={() => removeItem(it.id)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer sticky */}
        <footer className="sticky bottom-0 shrink-0 border-t border-bordo/15 bg-creme px-5 py-5 shadow-[0_-20px_40px_-30px_rgba(43,18,22,0.35)] md:px-7">
          <dl className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="label-eyebrow">Subtotal</dt>
              <dd className="font-serif text-xl text-vinho">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="label-eyebrow">Frete</dt>
              <dd className="font-serif italic text-sm text-bordo/70">a confirmar pela Gabi</dd>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-bordo/15 pt-3">
              <dt className="label-eyebrow">Total</dt>
              <dd className="font-display text-2xl tracking-tight text-bordo">
                {formatCurrency(subtotal)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={closeDrawer}
              className="btn-ghost w-full"
            >
              Continuar comprando →
            </button>
            <button
              type="button"
              onClick={handleFinalize}
              disabled={!finalizeHref}
              className="btn-bordo w-full min-h-[64px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Finalizar compra · enviar para a Gabi →
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={clearCart}
                className="font-serif italic text-sm text-bordo/75 underline decoration-bordo/35 underline-offset-4 transition-colors hover:text-bordo hover:decoration-bordo focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bordo"
              >
                Limpar carrinho
              </button>
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-vinho/45">
                Amorena · Alfenas · MG
              </span>
            </div>
          </div>
        </footer>
      </aside>
    </div>
  )
}

function EmptyState({ close }: { close: () => void }) {
  return (
    <div className="flex h-full min-h-[42vh] flex-col items-center justify-center gap-6 py-14 text-center">
      <span
        aria-hidden
        className="font-serif italic text-6xl text-bordo/25 md:text-7xl"
        style={{ lineHeight: 0.9 }}
      >
        “sacola vazia”
      </span>
      <p className="max-w-sm font-serif italic text-lg leading-relaxed text-vinho/70 md:text-xl">
        Volte para a loja e descubra um olhar. Cada peça pensada para um momento
        diferente da sua rotina.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/loja/colecao"
          onClick={close}
          className="btn-outline"
        >
          Explorar setores →
        </Link>
        <button
          type="button"
          onClick={close}
          className="btn-ghost"
        >
          ← Voltar para a loja
        </button>
      </div>
    </div>
  )
}

interface LineProps {
  item: ReturnType<typeof useCart>['items'][number]
  onUpdateQty: (q: number) => void
  onRemove: () => void
}

function CartLine({ item, onUpdateQty, onRemove }: LineProps) {
  const lineTotal = item.qty * item.unitPrice
  return (
    <li className="grid grid-cols-12 gap-3 py-5">
      <Link
        to={`/loja/produto/${item.slug}`}
        className="col-span-3 md:col-span-2"
        aria-label={`Abrir ficha do produto ${item.productName}`}
      >
        <span className="block aspect-square w-full overflow-hidden border border-bordo/12 bg-creme-deep">
          {item.imageThumbUrl ? (
            <img
              src={item.imageThumbUrl}
              alt={item.imageAlt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : null}
        </span>
      </Link>

      <div className="col-span-9 flex flex-col md:col-span-10 md:grid md:grid-cols-12 md:gap-4">
        {/* Esquerda: nome + cor + tamanho */}
        <div className="md:col-span-7">
          <Link
            to={`/loja/produto/${item.slug}`}
            className="font-serif text-lg leading-snug tracking-tight text-vinho hover:text-bordo md:text-xl"
          >
            {item.productName}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-vinho/65">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-sm border border-bordo/15"
                style={{ backgroundColor: item.colorHex ?? '#D9D9D9' }}
              />
              Cor · {item.colorName}
            </span>
            <span className="text-bordo/35">•</span>
            <span>Tam · {item.size}</span>
          </div>
          <div className="mt-3 text-[11px] uppercase tracking-[0.24em] text-vinho/50">
            Unitário · {formatCurrency(item.unitPrice)}
          </div>
        </div>

        {/* Direita: stepper + total + remover */}
        <div className="md:col-span-5 mt-4 md:mt-0 md:grid md:grid-cols-2 md:items-start md:gap-4">
          <div className="flex items-center justify-between border border-bordo/15 bg-creme-deep/40 px-3 py-1 md:w-full">
            <button
              type="button"
              onClick={() => onUpdateQty(item.qty - 1)}
              aria-label={`Diminuir quantidade de ${item.productName}`}
              className="h-9 w-9 font-serif text-xl text-vinho/80 transition-colors hover:text-bordo focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bordo"
            >
              −
            </button>
            <span className="w-8 text-center font-serif text-base text-vinho">{item.qty}</span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.qty + 1)}
              aria-label={`Aumentar quantidade de ${item.productName}`}
              className="h-9 w-9 font-serif text-xl text-vinho/80 transition-colors hover:text-bordo focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bordo"
            >
              +
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3 md:mt-0 md:flex-col md:items-end md:justify-start">
            <div className="text-right">
              <div className="label-eyebrow">Linha</div>
              <div className="font-display text-xl tracking-tight text-bordo md:text-2xl">
                {formatCurrency(lineTotal)}
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remover ${item.productName} da sacola`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-bordo/15 text-vinho/55 transition-colors hover:border-bordo hover:bg-bordo hover:text-creme focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bordo"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
