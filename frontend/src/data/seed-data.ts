import seedJson from './seed.json'
import type { Category, ColorSwatch, Product, SiteContent } from '../types/product'

type SeedShape = {
  colors: ColorSwatch[]
  categories: Category[]
  products: Product[]
  content: SiteContent
}
const shape = seedJson as unknown as SeedShape

export const COLORS: ColorSwatch[] = shape.colors
export const CATEGORIES: Category[] = shape.categories
export const PRODUCTS: Product[] = shape.products
export const CONTENT: SiteContent = shape.content

export { seedJson }
export default seedJson
