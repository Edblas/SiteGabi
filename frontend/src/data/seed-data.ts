import seedJson from './seed.json'
import type { Category, ColorSwatch, Product } from '../types/product'

type SeedShape = { colors: ColorSwatch[]; categories: Category[]; products: Product[] }
const shape = seedJson as unknown as SeedShape

export const COLORS: ColorSwatch[] = shape.colors
export const CATEGORIES: Category[] = shape.categories
export const PRODUCTS: Product[] = shape.products

export { seedJson }
export default seedJson
