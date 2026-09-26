import type { Category, ColorSwatch, Product } from '../types/product'

export const COLORS: ColorSwatch[] = [
  { id: 'bordo', name: 'Bordô Atemporal', label: 'Bordô', hex: '#6B1F29' },
  { id: 'nude', name: 'Nude Areia', label: 'Nude', hex: '#D8B8A8' },
  { id: 'creme', name: 'Creme Merengue', label: 'Creme', hex: '#F2E7D8' },
  { id: 'terracota', name: 'Terracota Queimado', label: 'Terracota', hex: '#B66A56' },
  { id: 'preto', name: 'Preto Índigo', label: 'Preto', hex: '#1B1618' },
  { id: 'verde', name: 'Verde Oliva', label: 'Oliva', hex: '#5F6146' },
  { id: 'camelo', name: 'Camelo Claro', label: 'Camelo', hex: '#BFA180' },
  { id: 'rose', name: 'Rosé Pálido', label: 'Rosé', hex: '#E3C2BB' },
]

export const CATEGORIES: Category[] = [
  {
    slug: 'vestidos',
    name: 'Vestidos',
    eyebrow: '01 · Coleção',
    lead: 'Peças que vestem o corpo e a memória.',
  },
  {
    slug: 'conjuntos',
    name: 'Conjuntos',
    eyebrow: '02 · Coleção',
    lead: 'O conforto do conjunto, a elegância da peça única.',
  },
  {
    slug: 'blusas',
    name: 'Blusas',
    eyebrow: '03 · Coleção',
    lead: 'Para todas as horas, para todos os dias.',
  },
  {
    slug: 'calcas',
    name: 'Calças',
    eyebrow: '04 · Coleção',
    lead: 'Cortes precisos. Modelagem impecável.',
  },
  {
    slug: 'saias',
    name: 'Saias',
    eyebrow: '05 · Coleção',
    lead: 'Um gesto leve em cada movimento.',
  },
  {
    slug: 'acessorios',
    name: 'Acessórios',
    eyebrow: '06 · Coleção',
    lead: 'O detalhe que transforma o olhar.',
  },
  {
    slug: 'bazar',
    name: 'Bazar',
    eyebrow: '07 · Coleção',
    lead: 'Últimas unidades. Preços especiais.',
  },
]

/**
 * URLs de imagens placeholder geradas com estética editorial.
 * Substituir por fotos reais quando disponíveis (TODO).
 */
const img = (prompt: string, size: 'portrait_4_3' | 'portrait_16_9' | 'square_hd' = 'portrait_4_3') =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt,
  )}&image_size=${size}`

const FRONT = 'editorial fashion photography studio lighting soft shadow plain off-white seamless background elegant brazilian model wearing'
const DETAIL = 'close up detail editorial fashion photography of fabric texture stitching hem studio lighting off-white background'

export const PRODUCTS: Product[] = [
  {
    id: 'p-001',
    slug: 'vestido-midi-alfaiataria-bordo',
    name: 'Vestido Midi Alfaiataria',
    subtitle: 'Bordô Atemporal',
    shortDescription: 'Midi envelope em tecido frio, com manga longa e fenda discreta.',
    longDescription:
      'Vestido midi de alfaiataria com modelagem envelope, lapela profunda e cinto removível na cintura. Manga longa com punho ajustado. Fenda discreta na barra, ideal para compor do escritório ao jantar.',
    category: 'vestidos',
    composition: '72% poliéster · 24% viscose · 4% elastano. Forro 100% viscose.',
    care: 'Lavagem à mão em água fria. Não alvejar. Não secar em tambor. Passar a ferro temperatura média.',
    priceInCents: 42800,
    promotionalPriceInCents: 38500,
    images: [
      { url: img(`${FRONT} burgundy tailored midi wrap dress with long sleeves belt at waist soft editorial pose full body`, 'portrait_4_3'), alt: 'Vestido Midi Alfaiataria — frente' },
      { url: img(`${DETAIL} burgundy wool blend tailored dress fabric seam stitching detail lapel collar`), alt: 'Vestido Midi Alfaiataria — detalhe' },
    ],
    colorIds: ['bordo', 'nude'],
    availableSizes: ['PP', 'P', 'M', 'G', 'GG'],
    variations: [
      { sku: 'AMO-001-BD-PP', colorId: 'bordo', size: 'PP', stock: 4 },
      { sku: 'AMO-001-BD-P', colorId: 'bordo', size: 'P', stock: 7 },
      { sku: 'AMO-001-BD-M', colorId: 'bordo', size: 'M', stock: 2 },
      { sku: 'AMO-001-BD-G', colorId: 'bordo', size: 'G', stock: 5 },
      { sku: 'AMO-001-ND-M', colorId: 'nude', size: 'M', stock: 3 },
      { sku: 'AMO-001-ND-G', colorId: 'nude', size: 'G', stock: 6 },
    ],
    isNew: true,
    isBestSeller: true,
    tags: ['alfaiataria', 'midi', 'bordo-atemporal'],
  },

  {
    id: 'p-002',
    slug: 'vestido-longo-crepe-nude',
    name: 'Vestido Longo Crepe',
    subtitle: 'Nude Areia',
    shortDescription: 'Longo fluido com alças finas e decote reto.',
    longDescription:
      'Vestido longo em crepe de seda com caimento leve. Alças finas ajustáveis, decote reto e saia fluidamente solta. Peça para ocasiões que pedem presença sem esforço.',
    category: 'vestidos',
    composition: '100% poliéster crepe. Forro 100% viscose.',
    care: 'Lavagem a seco recomendada. Não usar alvejante.',
    priceInCents: 56800,
    images: [
      { url: img(`${FRONT} nude sand floor length fluid crepe dress thin straps straight neckline studio editorial`, 'portrait_4_3'), alt: 'Vestido Longo Crepe — frente' },
      { url: img(`${DETAIL} nude sand crepe fabric flowing dress skirt drape detail close up stitching`), alt: 'Vestido Longo Crepe — caimento' },
    ],
    colorIds: ['nude', 'rose'],
    availableSizes: ['PP', 'P', 'M', 'G'],
    variations: [
      { sku: 'AMO-002-ND-PP', colorId: 'nude', size: 'PP', stock: 2 },
      { sku: 'AMO-002-ND-P', colorId: 'nude', size: 'P', stock: 5 },
      { sku: 'AMO-002-ND-M', colorId: 'nude', size: 'M', stock: 3 },
      { sku: 'AMO-002-RS-G', colorId: 'rose', size: 'G', stock: 1 },
    ],
    isNew: true,
    tags: ['longo', 'noivas', 'madrinhas'],
  },

  {
    id: 'p-003',
    slug: 'vestido-curto-linho-creme',
    name: 'Vestido Curto Linho',
    subtitle: 'Creme Merengue',
    shortDescription: 'Curto envelope em linho, amarração nas costas.',
    longDescription:
      'Vestido curto em linho puro com modelagem transpassada. Amarração ajustável nas costas, mangas bufantes curtas e barra acima do joelho. O favorito dos fins de semana.',
    category: 'vestidos',
    composition: '100% linho brasileiro. Forro 100% algodão.',
    care: 'Lavagem à mão. Secar à sombra. Passar a ferro ainda úmido.',
    priceInCents: 29800,
    promotionalPriceInCents: 25800,
    images: [
      { url: img(`${FRONT} off white cream linen short wrap dress puffed short sleeves tie at back studio editorial full body`, 'portrait_4_3'), alt: 'Vestido Curto Linho — frente' },
      { url: img(`${DETAIL} cream linen fabric texture weave detail close up natural fiber`), alt: 'Vestido Curto Linho — tecido' },
    ],
    colorIds: ['creme', 'verde'],
    availableSizes: ['P', 'M', 'G'],
    variations: [
      { sku: 'AMO-003-CR-P', colorId: 'creme', size: 'P', stock: 6 },
      { sku: 'AMO-003-CR-M', colorId: 'creme', size: 'M', stock: 4 },
      { sku: 'AMO-003-VO-G', colorId: 'verde', size: 'G', stock: 2 },
    ],
    isBestSeller: true,
    tags: ['linho', 'verano', 'cottage'],
  },

  {
    id: 'p-004',
    slug: 'conjunto-alfaiataria-terracota',
    name: 'Conjunto Alfaiataria',
    subtitle: 'Terracota Queimado',
    shortDescription: 'Blazer oversize + calça de pinça em tecido frio.',
    longDescription:
      'Conjunto de alfaiataria em tecido frio com stretch leve. Blazer com ombreiras estruturadas e lapela. Calça de cintura alta, pinças frontais e boca reta. Vende também como peças avulsas.',
    category: 'conjuntos',
    composition: '68% poliéster · 30% viscose · 2% elastano.',
    care: 'Lavagem a seco. Passar a ferro temperatura média.',
    priceInCents: 68900,
    images: [
      { url: img(`${FRONT} burnt terracota tailored oversized blazer straight leg trouser suit set studio editorial`, 'portrait_4_3'), alt: 'Conjunto Alfaiataria — frente' },
      { url: img(`${DETAIL} terracota tailored blazer lapel button stitching detail`), alt: 'Conjunto Alfaiataria — lapela' },
    ],
    colorIds: ['terracota', 'preto'],
    availableSizes: ['36', '38', '40', '42'],
    variations: [
      { sku: 'AMO-004-TT-36', colorId: 'terracota', size: '36', stock: 3 },
      { sku: 'AMO-004-TT-38', colorId: 'terracota', size: '38', stock: 5 },
      { sku: 'AMO-004-TT-40', colorId: 'terracota', size: '40', stock: 2 },
      { sku: 'AMO-004-PT-42', colorId: 'preto', size: '42', stock: 1 },
    ],
    isBestSeller: true,
    tags: ['workwear', 'alfaiataria'],
  },

  {
    id: 'p-005',
    slug: 'conjunto-tricot-camelo',
    name: 'Conjunto Tricot Fio',
    subtitle: 'Camelo Claro',
    shortDescription: 'Cardigan longo + calça pantalona em malha fria.',
    longDescription:
      'Conjunto de tricot em malha fria com toque macio. Cardigan longo, sem botões, com bolsos frontais. Calça pantalona de cós elástico. Perfeito para o entre-tempo.',
    category: 'conjuntos',
    composition: '60% viscose · 40% poliamida.',
    care: 'Lavagem à mão em água fria. Secar na horizontal. Não usar secadora.',
    priceInCents: 51200,
    images: [
      { url: img(`${FRONT} camel beige knit long cardigan wide leg pants set studio soft editorial`, 'portrait_4_3'), alt: 'Conjunto Tricot Fio — frente' },
      { url: img(`${DETAIL} camel knit stitch texture rib close up detail`), alt: 'Conjunto Tricot Fio — textura' },
    ],
    colorIds: ['camelo', 'rose'],
    availableSizes: ['P', 'M', 'G', 'GG'],
    variations: [
      { sku: 'AMO-005-CM-P', colorId: 'camelo', size: 'P', stock: 4 },
      { sku: 'AMO-005-CM-M', colorId: 'camelo', size: 'M', stock: 3 },
      { sku: 'AMO-005-RS-G', colorId: 'rose', size: 'G', stock: 2 },
    ],
    tags: ['conforto', 'tricô'],
  },

  {
    id: 'p-006',
    slug: 'blusa-seda-crepe-bordo',
    name: 'Blusa Seda Crepe',
    subtitle: 'Bordô Atemporal',
    shortDescription: 'Decote V profundo, mangas longas, amarração no cós.',
    longDescription:
      'Blusa em crepe de seda com amarração frontal. Decote V profundo, mangas longas amplas e punho ajustado. Combina com calça de alfaiataria, jeans de cintura alta ou saia midi.',
    category: 'blusas',
    composition: '92% poliéster · 08% elastano.',
    care: 'Lavagem à mão. Não torcer. Passar a ferro do avesso.',
    priceInCents: 22800,
    images: [
      { url: img(`${FRONT} burgundy deep V neck silk crepe blouse long sleeves tie at waist studio editorial`, 'portrait_4_3'), alt: 'Blusa Seda Crepe — frente' },
      { url: img(`${DETAIL} burgundy silk crepe fabric blouse neckline tie detail stitching`), alt: 'Blusa Seda Crepe — amarração' },
    ],
    colorIds: ['bordo', 'preto', 'creme'],
    availableSizes: ['PP', 'P', 'M', 'G'],
    variations: [
      { sku: 'AMO-006-BD-PP', colorId: 'bordo', size: 'PP', stock: 5 },
      { sku: 'AMO-006-BD-P', colorId: 'bordo', size: 'P', stock: 7 },
      { sku: 'AMO-006-BD-M', colorId: 'bordo', size: 'M', stock: 4 },
      { sku: 'AMO-006-PT-G', colorId: 'preto', size: 'G', stock: 3 },
      { sku: 'AMO-006-CR-P', colorId: 'creme', size: 'P', stock: 2 },
    ],
    isNew: true,
    tags: ['sedoso', 'noite'],
  },

  {
    id: 'p-007',
    slug: 'blusa-linho-bordado-rose',
    name: 'Blusa Linho Bordado',
    subtitle: 'Rosé Pálido',
    shortDescription: 'Manga curta bufante, gola alta, bordado a mão.',
    longDescription:
      'Blusa em linho com gola alta descontraída e manga curta bufante. Detalhe de bordado manual na barra e nos punhos. Trabalhada pelas nossas artesãs em Peça Única.',
    category: 'blusas',
    composition: '100% linho. Bordado manual em fio de algodão.',
    care: 'Lavagem à mão em água fria. Não centrifugar. Secar à sombra.',
    priceInCents: 27600,
    promotionalPriceInCents: 23800,
    images: [
      { url: img(`${FRONT} pale rose pink linen blouse puff short sleeves mock neck hand embroidery details studio`, 'portrait_4_3'), alt: 'Blusa Linho Bordado — frente' },
      { url: img(`${DETAIL} hand embroidery detail floral stitches on pale rose linen close up`), alt: 'Blusa Linho Bordado — detalhe' },
    ],
    colorIds: ['rose', 'creme'],
    availableSizes: ['P', 'M', 'G'],
    variations: [
      { sku: 'AMO-007-RS-P', colorId: 'rose', size: 'P', stock: 2 },
      { sku: 'AMO-007-RS-M', colorId: 'rose', size: 'M', stock: 1 },
      { sku: 'AMO-007-CR-G', colorId: 'creme', size: 'G', stock: 3 },
    ],
    isNew: true,
    tags: ['peca-unica', 'artesanal'],
  },

  {
    id: 'p-008',
    slug: 'calca-pantalona-alfaiataria-preto',
    name: 'Calça Pantalona Alfaiataria',
    subtitle: 'Preto Índigo',
    shortDescription: 'Cintura alta, boca larga, tecido frio com stretch.',
    longDescription:
      'Calça pantalona de alfaiataria em tecido frio com leve stretch. Cintura alta com pinças frontais, zíper invisível lateral e barra larga. Comprida para usar com salto ou com bainha curta.',
    category: 'calcas',
    composition: '70% poliéster · 28% viscose · 02% elastano.',
    care: 'Lavagem à mão ou a seco. Passar a ferro ainda levemente úmida.',
    priceInCents: 34800,
    images: [
      { url: img(`${FRONT} black high waisted wide leg tailored trouser pants studio editorial full body`), alt: 'Calça Pantalona Alfaiataria — frente' },
      { url: img(`${DETAIL} black tailored pants waist pleats stitch detail close up`), alt: 'Calça Pantalona Alfaiataria — pinças' },
    ],
    colorIds: ['preto', 'bordo', 'camelo'],
    availableSizes: ['36', '38', '40', '42'],
    variations: [
      { sku: 'AMO-008-PT-36', colorId: 'preto', size: '36', stock: 5 },
      { sku: 'AMO-008-PT-38', colorId: 'preto', size: '38', stock: 7 },
      { sku: 'AMO-008-PT-40', colorId: 'preto', size: '40', stock: 4 },
      { sku: 'AMO-008-BD-42', colorId: 'bordo', size: '42', stock: 2 },
      { sku: 'AMO-008-CM-38', colorId: 'camelo', size: '38', stock: 3 },
    ],
    isBestSeller: true,
    tags: ['workwear', 'coringa'],
  },

  {
    id: 'p-009',
    slug: 'calca-reta-jeans-nude',
    name: 'Calça Reta Jeans',
    subtitle: 'Nude Areia',
    shortDescription: 'Reta de cintura média, lavagem clara, sem elastano.',
    longDescription:
      'Calça jeans reta em lavagem clara nude, modelagem vintage. Cintura média, cinco bolsos e fechamento por botão. Sem elastano, modela com o uso.',
    category: 'calcas',
    composition: '98% algodão · 02% elastano.',
    care: 'Lavar do avesso. Não misturar com peças claras nas primeiras lavagens.',
    priceInCents: 28900,
    images: [
      { url: img(`${FRONT} nude sand straight leg mid rise denim jeans studio editorial full body`, 'portrait_4_3'), alt: 'Calça Reta Jeans — frente' },
      { url: img(`${DETAIL} nude denim fabric weave seam stitching detail close up`), alt: 'Calça Reta Jeans — detalhe' },
    ],
    colorIds: ['nude', 'preto'],
    availableSizes: ['36', '38', '40', '42'],
    variations: [
      { sku: 'AMO-009-ND-36', colorId: 'nude', size: '36', stock: 3 },
      { sku: 'AMO-009-ND-38', colorId: 'nude', size: '38', stock: 6 },
      { sku: 'AMO-009-ND-40', colorId: 'nude', size: '40', stock: 2 },
      { sku: 'AMO-009-PT-42', colorId: 'preto', size: '42', stock: 1 },
    ],
    tags: ['denim', 'basico'],
  },

  {
    id: 'p-010',
    slug: 'saia-midi-plissada-creme',
    name: 'Saia Midi Plissada',
    subtitle: 'Creme Merengue',
    shortDescription: 'Saia midi plissada de cós alto com fenda assimétrica.',
    longDescription:
      'Saia midi plissada em tecido fluido de caimento impecável. Cós alto estruturado, zíper invisível no costado e fenda assimétrica na barra. A peça das estações.',
    category: 'saias',
    composition: '100% poliéster. Forro 100% viscose.',
    care: 'Lavagem à mão em água fria. Não passar plissado a ferro.',
    priceInCents: 26800,
    promotionalPriceInCents: 23800,
    images: [
      { url: img(`${FRONT} off white cream pleated midi skirt high waist asymmetric slit studio editorial full body`), alt: 'Saia Midi Plissada — frente' },
      { url: img(`${DETAIL} cream pleated skirt fabric pleats close up detail hem`), alt: 'Saia Midi Plissada — plissado' },
    ],
    colorIds: ['creme', 'bordo'],
    availableSizes: ['36', '38', '40', '42'],
    variations: [
      { sku: 'AMO-010-CR-36', colorId: 'creme', size: '36', stock: 4 },
      { sku: 'AMO-010-CR-38', colorId: 'creme', size: '38', stock: 5 },
      { sku: 'AMO-010-BD-40', colorId: 'bordo', size: '40', stock: 2 },
    ],
    isBestSeller: true,
    tags: ['plissado', 'romantico'],
  },

  {
    id: 'p-011',
    slug: 'cinto-couro-metal-bordo',
    name: 'Cinto Couro Metal',
    subtitle: 'Bordô Atemporal',
    shortDescription: 'Cinto de couro legítimo com fivela em metal escovado.',
    longDescription:
      'Cinto em couro legítimo com 3 cm de largura. Fivela em latão escovado. Modelagem justa à cintura. Feito no Brasil.',
    category: 'acessorios',
    composition: '100% couro bovino. Fivela em metal latão escovado.',
    care: 'Limpar com pano seco. Não expor ao sol. Não usar produtos químicos.',
    priceInCents: 17900,
    images: [
      { url: img(`${FRONT.replace('model wearing', 'editorial product flat lay of')} burgundy leather belt brushed brass buckle off white paper background soft shadow`, 'portrait_4_3'), alt: 'Cinto Couro Metal — frente' },
      { url: img(`${DETAIL} burgundy leather belt brass buckle texture grain close up`), alt: 'Cinto Couro Metal — fivela' },
    ],
    colorIds: ['bordo', 'preto', 'camelo'],
    availableSizes: ['P', 'M', 'G'],
    variations: [
      { sku: 'AMO-011-BD-P', colorId: 'bordo', size: 'P', stock: 6 },
      { sku: 'AMO-011-BD-M', colorId: 'bordo', size: 'M', stock: 8 },
      { sku: 'AMO-011-BD-G', colorId: 'bordo', size: 'G', stock: 4 },
      { sku: 'AMO-011-PT-M', colorId: 'preto', size: 'M', stock: 5 },
    ],
    tags: ['couro', 'acessorio'],
  },

  {
    id: 'p-012',
    slug: 'brinco-perola-gota',
    name: 'Brinco Pérola Gota',
    subtitle: 'Bazar · Últimas unidades',
    shortDescription: 'Par de brincos em metal dourado fosco e pérola gota.',
    longDescription:
      'Par de brincos em banho dourado fosco antialérgico. Pérola gota de 14 mm. Fechamento por pressão. Peça atemporal.',
    category: 'bazar',
    composition: 'Metal com banho dourado. Pérola de vidro. Peças antialérgicas.',
    care: 'Guardar em local arejado. Evitar contato com perfumes e cosméticos.',
    priceInCents: 11800,
    promotionalPriceInCents: 8800,
    images: [
      { url: img(`${FRONT.replace('model wearing', 'editorial product flat lay of')} matte gold drop pearl earrings pair off white paper background soft shadow minimal`, 'portrait_4_3'), alt: 'Brinco Pérola Gota — frente' },
      { url: img(`editorial product macro close up of matte gold earring hook and pearl drop on off white paper`, 'portrait_4_3'), alt: 'Brinco Pérola Gota — detalhe' },
    ],
    colorIds: ['preto', 'creme'],
    availableSizes: ['Único'],
    variations: [{ sku: 'AMO-012-PE-UN', colorId: 'creme', size: 'Único', stock: 3 }],
    tags: ['bazar', 'ultimas-unidades'],
  },
]

export const getColor = (id: string): ColorSwatch | undefined => COLORS.find((c) => c.id === id)
export const getCategory = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug)

export const formatCurrency = (cents: number): string =>
  cents.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

export function getStock(product: Product, colorId: string, size: string): number {
  return (
    product.variations.find((v) => v.colorId === colorId && v.size === size)?.stock ?? 0
  )
}
