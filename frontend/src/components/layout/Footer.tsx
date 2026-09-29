import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/siteConfig'

const COLUMN_1 = [
  { label: 'Trocas e Devoluções', href: '/institucional/trocas' },
  { label: 'Prazo de Envio', href: '/institucional/prazos' },
  { label: 'Tabela de Medidas', href: '/institucional/medidas' },
]

const COLUMN_2 = [
  { label: 'Quem Somos', href: '/institucional/quem-somos' },
  { label: 'Política de Privacidade', href: '/institucional/privacidade' },
  { label: 'Termos de Uso', href: '/institucional/termos' },
]

export default function Footer() {
  const insta = import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/amorena.conceito'
  const whats = import.meta.env.VITE_WHATSAPP_NUMBER || '5535997061703'
  const endereco = siteConfig.store.address
  const cidade = siteConfig.store.cityState
  const horas = siteConfig.store.hours

  const whatsAppLink = `https://wa.me/${whats.replace(/\D/g, '')}`

  return (
    <footer className="mt-24 border-t border-bordo/20 bg-creme-deep/60">
      <div className="container-editorial grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-serif italic text-3xl text-bordo">amorena</p>
          <p className="mt-4 max-w-xs font-serif italic text-lg leading-snug text-vinho/80">
            Amorena veste você. Moda feminina que pensa no corpo, no tempo e no gesto.
          </p>
          <p className="mt-8 label-eyebrow">Atendimento</p>
          <p className="mt-2 text-sm text-vinho/75 whitespace-pre-line">
            {horas}
          </p>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Loja</p>
          <ul className="space-y-3 text-sm text-vinho/80">
            {COLUMN_1.map((it) => (
              <li key={it.href}>
                <Link to={it.href} className="link-underline">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Institucional</p>
          <ul className="space-y-3 text-sm text-vinho/80">
            {COLUMN_2.map((it) => (
              <li key={it.href}>
                <Link to={it.href} className="link-underline">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Contato</p>
          <ul className="space-y-4 text-sm text-vinho/80">
            <li>
              <a href={insta} target="_blank" rel="noopener noreferrer" className="link-underline">
                @amorena.conceito
              </a>
            </li>
            <li>
              <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="link-underline">
                WhatsApp
              </a>
              <span className="ml-2 text-[11px] text-vinho/50">· resposta rápida</span>
            </li>
            <li>
              <span className="block text-vinho/90">Loja física</span>
              <address className="not-italic mt-1 leading-relaxed">
                {endereco}
                <br />
                {cidade}
              </address>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bordo/15 bg-creme/80">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 py-5 text-[11px] uppercase tracking-editorial text-vinho/55 sm:flex-row">
          <p>© {new Date().getFullYear()} Amorena Moda Feminina · Todos os direitos reservados</p>
          <p>Feito à mão no Brasil</p>
        </div>
      </div>
    </footer>
  )
}
