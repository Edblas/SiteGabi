/**
 * Configurações únicas do site Amorena.
 * TODO: preencher os campos marcados conforme os dados reais da loja.
 */
export interface SiteConfig {
  brand: {
    name: string
    tagline: string
    /** Paleta fixa — não alterar sem validar contraste */
    palette: {
      bordo: string
      creme: string
      vinho: string
      roseNude: string
    }
  }

  social: {
    instagramHandle: string
    instagramUrl: string
  }

  /** TODO: número com DDI + DDD + 9, só dígitos (ex.: 5548999998888) */
  whatsappNumber: string
  whatsappDefaultMessage: string

  /** TODO: link de convite do Grupo VIP (ex.: https://chat.whatsapp.com/...) */
  vipGroupUrl: string
  vipGroupCaption: string

  store: {
    address: string
    /** TODO: complementar com cidade e UF reais */
    cityState: string
    /** TODO: horário de funcionamento real */
    hours: string
  }

  seo: {
    landingTitle: string
    landingDescription: string
    storeTitle: string
    storeDescription: string
    ogImageUrl?: string
  }

  links: {
    buyOnline: string
    whatsapp: string
    vipGroup: string
    whatsappStoreContact: string
  }

  ctaLabels: {
    buyOnline: string
    whatsapp: string
    vipGroup: string
    visitStore: string
    novidades: string
    novidadesCaption: string
    hideStore: string
  }
}

const WHATSAPP_RAW = (import.meta.env.VITE_WHATSAPP_NUMBER || '5535997061703').replace(/\D/g, '')
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/amorena.conceito'
const LOJA_ENDERECO = import.meta.env.VITE_LOJA_ENDERECO || 'Av. São José, 1261 · 1º andar'

const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_RAW || '0000000000000'}?text=${encodeURIComponent(msg)}`

export const siteConfig: SiteConfig = {
  brand: {
    name: 'Amorena',
    tagline: 'Amorena veste você.',
    palette: {
      bordo: '#581221',
      creme: '#FBF6F2',
      vinho: '#2B1216',
      roseNude: '#E8CFC8',
    },
  },

  social: {
    instagramHandle: '@amorena.conceito',
    instagramUrl: INSTAGRAM_URL,
  },

  whatsappNumber: WHATSAPP_RAW || '5535997061703',
  whatsappDefaultMessage: 'Olá Gabi! Vim pelo site da Amorena e gostaria de ajuda.',

  vipGroupUrl: 'https://chat.whatsapp.com/BmTxtSq0GQlKEJMHPvwp0h?mode=gi_t',
  vipGroupCaption: 'Ofertas e lançamentos em primeira mão',

  store: {
    address: LOJA_ENDERECO,
    cityState: 'Alfenas · MG',
    hours: 'Seg a sex · 09h às 18h\nSáb · 09h às 17h',
  },

  seo: {
    landingTitle: 'Amorena — Moda Feminina',
    landingDescription:
      'Amorena veste você. Compre online, fale com a Gabi, entre no grupo VIP ou visite nossa loja em Alfenas · MG.',
    storeTitle: 'Loja · Amorena Moda Feminina',
    storeDescription:
      'Coleção Amorena — vestidos, conjuntos, blusas, calças, saias e acessórios.',
    ogImageUrl: undefined,
  },

  links: {
    buyOnline: '/loja',
    whatsapp: waLink('Olá Gabi! Vim pelo site da Amorena e gostaria de ajuda.'),
    vipGroup: waLink('Olá Gabi! Quero fazer parte do Grupo VIP Amorena e receber novidades em primeira mão.'),
    whatsappStoreContact: waLink('Olá Gabi! Vim pelo site e gostaria de informações sobre a loja física da Amorena.'),
  },

  ctaLabels: {
    buyOnline: 'Comprar online',
    whatsapp: 'Falar com a Gabi',
    vipGroup: 'Grupo VIP',
    visitStore: 'Visite a loja',
    novidades: 'Novidades',
    novidadesCaption: 'As peças que chegaram agora',
    hideStore: 'Voltar — Ocultar loja física',
  },
}

/**
 * Placeholders claramente marcados para serem resolvidos antes do deploy.
 */
export const TODO_PENDING_DATA = [
  {
    id: 'hero-photo',
    place: 'LandingEntry → heroImage',
    note: 'Foto preto-e-branco / nude para o topo da landing. Atualmente placeholder.',
  },
  {
    id: 'og-image',
    place: 'siteConfig.seo.ogImageUrl',
    note: 'Thumbnail 1200x630 para compartilhamento em WhatsApp / Instagram.',
  },
]
