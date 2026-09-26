import Hero from '../components/home/Hero'
import BenefitsStrip from '../components/home/BenefitsStrip'
import CategoryList from '../components/home/CategoryList'
import ProductShowcase from '../components/home/ProductShowcase'
import VIPGroup from '../components/home/VIPGroup'
import VisitStore from '../components/home/VisitStore'
import { PRODUCTS } from '../data/seed'
import { siteConfig } from '../config/siteConfig'
import useSEO from '../hooks/useSEO'

export default function HomePage() {
  useSEO({
    title: siteConfig.seo.storeTitle,
    description: siteConfig.seo.storeDescription,
    image: siteConfig.seo.ogImageUrl,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  })

  const novidades = PRODUCTS.filter((p) => p.isNew).slice(0, 6)
  const maisVendidos = [...PRODUCTS]
    .filter((p) => p.isBestSeller)
    .concat(PRODUCTS.filter((p) => !p.isBestSeller))
    .slice(0, 5)

  return (
    <>
      <Hero />
      <BenefitsStrip />
      <CategoryList />

      <ProductShowcase
        eyebrow="03 · Novidades"
        title={
          <>
            Chegaram <em className="italic text-bordo">agora</em>.
          </>
        }
        lead="Peças selecionadas da nova coleção. Primeiro para quem veste Amorena com frequência."
        products={novidades}
      />

      <ProductShowcase
        eyebrow="03B · Mais amadas"
        title={
          <>
            As que <em className="italic text-bordo">nunca saem</em> de moda.
          </>
        }
        lead="Modelos que atravessam estações. A base do guarda-roupa atemporal."
        products={maisVendidos}
        variant="bestsellers"
      />

      <VIPGroup />
      <VisitStore />
    </>
  )
}
