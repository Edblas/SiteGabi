export type CategorySlug =
  | 'vestidos'
  | 'conjuntos'
  | 'blusas'
  | 'calcas'
  | 'saias'
  | 'acessorios'

export interface Category {
  slug: CategorySlug
  name: string
  eyebrow: string
  lead: string
  heroPrompt: string
  heroSize: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9'
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

export interface SiteHeroStat {
  eyebrow: string
  value: string
}

export interface SiteCtaButton {
  label: string
  link: string
  variant: 'solid' | 'ghost'
}

export interface SiteHeroColecao {
  eyebrow: string
  headlineLine1: string
  headlineLine2: string
  headlineLine3: string
  paragraph: string
  badge: string
  imageUrl: string
  imageAlt: string
  primaryButton: SiteCtaButton
  secondaryButton: SiteCtaButton
  stats: [SiteHeroStat, SiteHeroStat, SiteHeroStat]
}

export interface SiteHeroLanding {
  imageUrl: string
  imageAlt: string
}

export interface SiteBenefitItem {
  n: string
  eyebrow: string
  title: string
  copy: string
}

export interface SiteContent {
  heroColecao: SiteHeroColecao
  heroLanding: SiteHeroLanding
  benefits: [SiteBenefitItem, SiteBenefitItem, SiteBenefitItem, SiteBenefitItem]
}
