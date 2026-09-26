export type CategorySlug =
  | 'vestidos'
  | 'conjuntos'
  | 'blusas'
  | 'calcas'
  | 'saias'
  | 'acessorios'
  | 'bazar'

export interface Category {
  slug: CategorySlug
  name: string
  eyebrow: string
  lead: string
}

export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'Único' | '36' | '38' | '40' | '42'

export interface ColorSwatch {
  id: string
  name: string
  label: string
  hex: string
}

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductVariation {
  sku: string
  colorId: string
  size: Size
  stock: number
}

export interface Product {
  id: string
  slug: string
  name: string
  subtitle: string
  shortDescription: string
  longDescription: string
  category: CategorySlug
  composition: string
  care: string
  priceInCents: number
  promotionalPriceInCents?: number
  images: ProductImage[]
  colorIds: string[]
  availableSizes: Size[]
  variations: ProductVariation[]
  isNew?: boolean
  isBestSeller?: boolean
  tags?: string[]
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'best-sellers'

export interface AppliedFilters {
  colors: string[]
  sizes: Size[]
  minPrice?: number
  maxPrice?: number
  sort: SortOption
}
