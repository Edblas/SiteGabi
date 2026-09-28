import { useCart } from '../../context/CartContext'

function BagIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 8h14l-.8 12.2a2 2 0 0 1-2 1.8H7.8a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}

export default function CartFabButton() {
  const { itemCount, toggleDrawer, openDrawer } = useCart()
  const badge = itemCount > 99 ? '99+' : String(itemCount)
  const plural = itemCount === 1 ? 'item' : 'itens'
  const aria =
    itemCount > 0
      ? `Abrir sacola · ${itemCount} ${plural} selecionados`
      : 'Abrir sacola · ainda vazia'

  return (
    <button
      type="button"
      onClick={itemCount > 0 ? toggleDrawer : openDrawer}
      aria-label={aria}
      className="group fixed bottom-20 right-5 z-50 flex items-center gap-2 border border-bordo/15 bg-creme px-4 py-3 shadow-card hover:border-bordo focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bordo"
    >
      <span className="relative text-bordo group-hover:scale-105 transition-transform">
        <BagIcon className="h-6 w-6" />
        {itemCount > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-bordo px-1 text-[9px] font-semibold text-creme"
          >
            {badge}
          </span>
        )}
      </span>
      <span className="hidden sm:inline-flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-[0.22em] text-bordo/70">
          Sacola
        </span>
        <span className="font-serif italic text-[15px] text-bordo">
          {itemCount > 0 ? `${itemCount} ${plural}` : 'vazia'}
        </span>
      </span>
    </button>
  )
}
