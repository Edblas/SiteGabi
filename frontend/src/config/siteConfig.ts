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

  vipGroupUrl: 'TODO_INFORMAR_LINK_DO_GRUPO_VIP',
  vipGroupCaption: 'Ofertas e lançamentos em primeira mão',

  store: {
    address: LOJA_ENDERECO,
    cityState: 'Alfenas · MG',
    hours: 'Seg a sex · 10h às 19h  ·  Sáb · 10h às 14h',
  },

  seo: {
    landingTitle: 'Amorena — Moda Feminina',
    landingDescription:
      'Amorena veste você. Compre online, fale no WhatsApp com a Gabi, entre no grupo VIP ou visite nossa loja.',
    storeTitle: 'Loja · Amorena Moda Feminina',
    storeDescription:
      'Coleção Amorena — vestidos, conjuntos, blusas, calças, saias, acessórios e bazar.',
    ogImageUrl: undefined,
  },

  links: {
    buyOnline: '/loja',
    whatsapp: waLink('Olá Gabi! Vim pelo site da Amorena e gostaria de ajuda.'),
    vipGroup: waLink('Olá Gabi! Quero fazer parte do Grupo VIP Amorena e receber novidades em primeira mão.'),
    whatsappStoreContact: waLink('Olá Gabi! Vim pelo site e gostaria de informações sobre a loja física da Amorena.'),
  },
}

/**
 * Placeholders claramente marcados para serem resolvidos antes do deploy.
 */
export const TODO_PENDING_DATA = [
  {
    id: 'vip-group-url',
    place: 'siteConfig.vipGroupUrl',
    note: 'Link de convite do Grupo VIP no WhatsApp.',
  },
  {
    id: 'store-hours',
    place: 'siteConfig.store.hours',
    note: 'Horário de funcionamento real (inclui feriados se necessário).',
  },
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
