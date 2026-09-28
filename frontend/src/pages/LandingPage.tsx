import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandWordmark from '../components/ui/BrandWordmark'
import CtaButton from '../components/ui/CtaButton'
import StoreAddressBlock from '../components/landing/StoreAddressBlock'
import { siteConfig } from '../config/siteConfig'
import { trackEvent } from '../hooks/useAnalytics'
import useSEO from '../hooks/useSEO'

const heroImageLocal = '/hero-landing.jpeg'
const heroImageLocalAlt = '/hero-landing.jpg'
const heroImageFallback =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'editorial black and white fashion portrait of brazilian woman wearing cream linen dress standing in minimal studio asymmetric crop soft grain texture film look vogue magazine aesthetic medium format'
  ) +
  '&image_size=portrait_4_3'
const heroAltText =
  'Editorial Amorena — modelo em vestido longo estampado com parede de pedra ao fundo'

export default function LandingPage() {
  const navigate = useNavigate()
  const [showStore, setShowStore] = useState(false)
  const [heroSrc, setHeroSrc] = useState<string>(heroImageLocal)
  const heroTriedRef = useRef(0)

  function handleHeroError() {
    heroTriedRef.current += 1
    if (heroTriedRef.current === 1) {
      setHeroSrc(heroImageLocalAlt)
    } else if (heroTriedRef.current === 2) {
      setHeroSrc(heroImageFallback)
    }
  }

  useSEO({
    title: siteConfig.seo.landingTitle,
    description: siteConfig.seo.landingDescription,
    image: siteConfig.seo.ogImageUrl,
  })

  // Ao clicar em Comprar online, grava escolha no localStorage (próximas visitas pode-se pular a landing, por enquanto só lembra)
  useEffect(() => {
    try {
      const v = localStorage.getItem('amorena:lastEntry')
      if (v) trackEvent('landing_returning', { lastEntry: v })
    } catch {
      /* noop (cookies bloqueados) */
    }
  }, [])

  function rememberEntry(action: string) {
    try {
      localStorage.setItem('amorena:lastEntry', action)
      localStorage.setItem('amorena:lastEntryAt', String(Date.now()))
    } catch {
      /* noop */
    }
  }

  function handleBuyOnline() {
    trackEvent('landing_cta', { cta: 'comprar_online' })
    rememberEntry('loja')
    navigate('/loja')
  }

  function handleWhatsApp() {
    trackEvent('landing_cta', { cta: 'whatsapp' })
    rememberEntry('whatsapp')
    // navegação externa pelo href (não por navigate)
  }

  function handleVipGroup() {
    trackEvent('landing_cta', { cta: 'vip_group' })
    rememberEntry('vip')
  }

  function handleStore(toggle: boolean) {
    trackEvent('landing_cta', { cta: 'visite_loja', expanded: String(toggle) })
    setShowStore(toggle)
    if (toggle) rememberEntry('loja-fisica')
  }

  function handleNovidades() {
    trackEvent('landing_cta', { cta: 'novidades' })
    rememberEntry('novidades')
    navigate('/loja/novidades')
  }

  const vipIsPlaceholder = siteConfig.vipGroupUrl.startsWith('TODO_')

  return (
    <div className="relative min-h-screen w-full bg-creme text-vinho">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(rgba(139, 46, 58, 0.04) 1px, transparent 1px), radial-gradient(rgba(43, 18, 22, 0.03) 1px, transparent 1px)",
          backgroundSize: '22px 22px, 22px 22px',
          backgroundPosition: '0 0, 11px 11px',
        }}
      />

      <div className="relative mx-auto w-full max-w-[480px] px-5 sm:px-8 pb-16">
        {/* HERO assimétrico */}
        <div className="relative -mx-5 sm:-mx-8">
          <div className="relative aspect-[4/3.1] w-full overflow-hidden">
            <img
              src={heroSrc}
              alt={heroAltText}
              loading="eager"
              decoding="async"
              onError={handleHeroError}
              className="h-[115%] w-full object-cover object-[65%_35%] -translate-y-3"
            />
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(180deg, rgba(251,246,242,0) 35%, rgba(251,246,242,0.85) 78%, #FBF6F2 100%)',
              }}
            />
          </div>
        </div>

        {/* LOGO + tagline */}
        <div
          className="mx-auto -mt-10 flex flex-col items-center text-center"
          style={{ opacity: 0, animation: 'fadeUp 700ms ease-out 120ms 1 both' }}
        >
          <BrandWordmark size="large" />
          <p
            className="mt-7 max-w-xs font-serif italic text-[22px] sm:text-2xl leading-snug text-vinho"
            style={{ opacity: 0, animation: 'fadeUp 700ms ease-out 280ms 1 both' }}
          >
            {siteConfig.brand.tagline}
          </p>
          <a
            href={siteConfig.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('landing_cta', { cta: 'instagram' })}
            aria-label={`Abrir Instagram ${siteConfig.social.instagramHandle}`}
            className="mt-7 inline-flex items-center gap-2 border border-bordo/20 px-4 py-2 text-bordo hover:border-bordo hover:bg-bordo hover:text-creme transition-colors"
            style={{ opacity: 0, animation: 'fadeUp 700ms ease-out 420ms 1 both' }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
            </svg>
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] font-medium">
              {siteConfig.social.instagramHandle}
            </span>
          </a>
        </div>

        {/* BOTÕES CTA (5) */}
        <nav
          aria-label="Menu principal"
          className="mt-11 flex flex-col gap-4"
          style={{ opacity: 0, animation: 'fadeUp 700ms ease-out 560ms 1 both' }}
        >
          <CtaButton
            variant="primary"
            delay={620}
            onClick={handleBuyOnline}
            aria-label="Comprar online — abrir a loja virtual"
          >
            {siteConfig.ctaLabels.buyOnline}
          </CtaButton>

          <CtaButton
            variant="secondary"
            delay={700}
            href={siteConfig.links.whatsapp}
            target="_blank"
            onClick={handleWhatsApp}
          >
            {siteConfig.ctaLabels.whatsapp}
          </CtaButton>

          <CtaButton
            variant="secondary"
            delay={780}
            href={vipIsPlaceholder ? siteConfig.links.vipGroup : siteConfig.vipGroupUrl}
            target="_blank"
            onClick={handleVipGroup}
            caption={siteConfig.vipGroupCaption}
          >
            {siteConfig.ctaLabels.vipGroup}
          </CtaButton>

          {showStore ? (
            <div style={{ opacity: 0, animation: 'fadeUp 650ms ease-out 820ms 1 both' }} className="space-y-4">
              <CtaButton variant="ghost" onClick={() => handleStore(false)}>
                {siteConfig.ctaLabels.hideStore}
              </CtaButton>
              <StoreAddressBlock compact />
            </div>
          ) : (
            <CtaButton variant="secondary" delay={860} onClick={() => handleStore(true)}>
              {siteConfig.ctaLabels.visitStore}
            </CtaButton>
          )}

          <CtaButton
            variant="ghost"
            delay={940}
            onClick={handleNovidades}
            caption={siteConfig.ctaLabels.novidadesCaption}
          >
            {siteConfig.ctaLabels.novidades}
          </CtaButton>
        </nav>

        {/* RODAPÉ MÍNIMO */}
        <footer
          className="mt-14 border-t border-bordo/15 pt-6 text-center"
          style={{ opacity: 0, animation: 'fadeUp 700ms ease-out 1050ms 1 both' }}
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] font-light text-vinho/65">
            Enviamos para todo o Brasil
            <span className="mx-2 text-bordo/40">·</span>
            Compre online com confiança
          </p>
          <p className="mt-5 font-serif italic text-sm text-bordo/70">
            amorena
          </p>
        </footer>
      </div>
    </div>
  )
}
