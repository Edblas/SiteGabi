const ITEMS = [
  {
    n: '01',
    eyebrow: 'Pagamento',
    title: 'Até 6x sem juros',
    copy: 'No cartão em até 6 vezes sem juros, ou 8% OFF à vista e Pix.',
  },
  {
    n: '02',
    eyebrow: 'Logística',
    title: 'Envio para todo o Brasil',
    copy: 'Correios e transportadoras parceiras. Código de rastreio em todos os pedidos.',
  },
  {
    n: '03',
    eyebrow: 'Boas-vindas',
    title: '8% OFF na 1ª compra',
    copy: 'Desconto liberado automaticamente após o primeiro cadastro. Válido para todo o site.',
  },
  {
    n: '04',
    eyebrow: 'Confiança',
    title: 'Trocas em até 30 dias',
    copy: 'Não serviu? Trocamos. Sem burocracia, sem letras miúdas.',
  },
]

export default function BenefitsStrip() {
  return (
    <section aria-label="Benefícios da loja" className="border-y border-bordo/20 bg-creme-deep/60">
      <div className="container-editorial py-6 md:py-7">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          {ITEMS.map((it, i) => (
            <div key={it.eyebrow} className={`relative ${i < ITEMS.length - 1 ? 'md:border-r md:border-bordo/15 md:pr-6' : ''}`}>
              <div className="flex items-baseline gap-3">
                <span className="section-number">{it.n}</span>
                <span className="label-eyebrow">{it.eyebrow}</span>
              </div>
              <h3 className="mt-2 font-serif text-2xl leading-tight text-vinho">
                {it.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-vinho/75 max-w-xs">
                {it.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
