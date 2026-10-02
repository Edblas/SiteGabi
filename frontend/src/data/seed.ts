import type { Category, ColorSwatch, Product } from '../types/product'
import { COLORS, CATEGORIES, PRODUCTS, CONTENT, seedJson } from './seed-data'

export { COLORS, CATEGORIES, PRODUCTS, CONTENT, seedJson }

export const getColor = (id: string): ColorSwatch | undefined =>
  COLORS.find((c) => c.id === id)
export const getCategory = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug)

export const formatCurrency = (cents: number): string =>
  cents.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

export const CASH_DISCOUNT_PCT = 10

export function categoryHeroUrl(category: Category): { url: string; alt: string } {
  const url = `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    category.heroPrompt,
  )}&image_size=${category.heroSize}`
  return { url, alt: `Editorial — ${category.name}` }
}

export function getCashPriceInCents(valueInCents: number): number {
  return Math.round(valueInCents * (1 - CASH_DISCOUNT_PCT / 100))
}

export function getEffectivePrice(product: Product): number {
  return product.promotionalPriceInCents ?? product.priceInCents
}

export function getStock(product: Product, colorId: string, size: string): number {
  return (
    product.variations.find((v) => v.colorId === colorId && v.size === size)?.stock ?? 0
  )
}
