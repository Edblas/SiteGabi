import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { ColorSwatch, Product } from '../types/product'
import { COLORS, getStock, getColor } from '../data/seed'

export interface CartItem {
  id: string
  productId: string
  sku?: string
  productName: string
  slug: string
  colorId: string
  colorName: string
  colorHex?: string
  size: string
  qty: number
  unitPrice: number
  imageThumbUrl: string
  imageAlt: string
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  drawerOpen: boolean

  addToCart: (product: Product, colorId: string, size: string, qty: number) => { ok: boolean; reason?: string; added?: CartItem }
  updateQty: (itemId: string, newQty: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void

  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

const CART_STORAGE_KEY = 'amorena:cart'

const CartContext = createContext<CartContextValue | null>(null)

function loadInitialItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) return parsed.filter((i) => i && typeof i.id === 'string' && typeof i.qty === 'number')
    return []
  } catch {
    return []
  }
}

function resolveColor(
  colorId: string,
): { colorName: string; colorHex?: string } {
  const explicit = getColor(colorId)
  if (explicit) return { colorName: explicit.name, colorHex: explicit.hex }

  const fallback = COLORS[0]
  return fallback
    ? { colorName: fallback.name, colorHex: fallback.hex }
    : { colorName: colorId }
}

function resolveVariation(product: Product, colorId: string, size: string) {
  const v = product.variations.find((vv) => vv.colorId === colorId && vv.size === size)
  return v
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialItems)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Persistência
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage bloqueado (ex. Safari privado) — ignora, só fica em memória
    }
  }, [items])

  // Computados
  const itemCount = useMemo(
    () => items.reduce((sum, it) => sum + (Number.isFinite(it.qty) ? it.qty : 0), 0),
    [items],
  )
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number.isFinite(it.qty) && Number.isFinite(it.unitPrice) ? it.qty * it.unitPrice : 0),
        0,
      ),
    [items],
  )

  // Ações
  const addToCart: CartContextValue['addToCart'] = useCallback(
    (product, colorId, size, qty) => {
      if (qty <= 0) return { ok: false, reason: 'quantidade-invalida' }
      const variation = resolveVariation(product, colorId, size)
      const maxStock = getStock(product, colorId, size)

      if (maxStock <= 0) return { ok: false, reason: 'sem-estoque' }

      const id = `${product.id}__${colorId}__${size}`
      let addedItem: CartItem | undefined

      setItems((prev) => {
        const existing = prev.find((it) => it.id === id)
        if (existing) {
          const nextQty = Math.min(existing.qty + qty, maxStock)
          addedItem = { ...existing, qty: nextQty }
          return prev.map((it) => (it.id === id ? addedItem! : it))
        }

        const colorMeta = resolveColor(colorId)
        const img = product.images[0]
        const price = product.promotionalPriceInCents ?? product.priceInCents

        addedItem = {
          id,
          productId: product.id,
          sku: variation?.sku,
          productName: product.name,
          slug: product.slug,
          colorId,
          colorName: colorMeta.colorName,
          colorHex: colorMeta.colorHex,
          size,
          qty: Math.min(qty, maxStock),
          unitPrice: price,
          imageThumbUrl: img?.url ?? '',
          imageAlt: img?.alt ?? product.name,
        }
        return [...prev, addedItem]
      })

      // Abre drawer de sucesso (Mercado Livre pattern) — executa após setState commit
      queueMicrotask(() => setDrawerOpen(true))

      return { ok: true, added: addedItem }
    },
    [],
  )

  const updateQty = useCallback((itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setItems((prev) => prev.filter((it) => it.id !== itemId))
      return
    }
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, qty: Math.min(newQty, 99) } : it)),
    )
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const toggleDrawer = useCallback(() => setDrawerOpen((v) => !v), [])

  const value: CartContextValue = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      drawerOpen,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [
      items,
      itemCount,
      subtotal,
      drawerOpen,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart precisa ser usado dentro de <CartProvider>')
  }
  return ctx
}

// Helper para usar em outras camadas (drawer, finalizar) se preferir desestruturado
export { COLORS as CART_COLOR_META }
export type { ColorSwatch }
