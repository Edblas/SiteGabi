import StoreAddressBlock from '../components/landing/StoreAddressBlock'
import { siteConfig } from '../config/siteConfig'
import useSEO from '../hooks/useSEO'

export default function LojaFisicaPage() {
  useSEO({
    title: 'Loja física · Amorena Moda Feminina',
    description: `${siteConfig.store.address} — ${siteConfig.store.cityState}. Horário de funcionamento e como chegar.`,
    image: siteConfig.seo.ogImageUrl,
  })

  return (
    <section className="container-editorial py-14 md:py-20 max-w-5xl">
      <header className="border-b border-bordo/25 pb-8">
        <p className="label-eyebrow mb-3">Página · Loja física</p>
        <h1 className="font-h-editorial">
          Visite-nos. Prove, <em className="italic text-bordo">toque</em>, leve.
        </h1>
        <p className="mt-5 max-w-xl font-serif italic text-xl leading-relaxed text-vinho/75">
          A coleção completa em seu tamanho e cor. Esperamos por você.
        </p>
      </header>

      <div className="mt-12">
        <StoreAddressBlock />
      </div>

      <footer className="mt-12 flex flex-wrap items-center gap-4 border-t border-bordo/15 pt-8">
        <a href="/loja" className="btn-bordo">
          Comprar online
        </a>
        <a
          href={siteConfig.links.whatsappStoreContact}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Falar no WhatsApp
        </a>
      </footer>
    </section>
  )
}
