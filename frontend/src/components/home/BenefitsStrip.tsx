import { CONTENT } from '../../data/seed'

export default function BenefitsStrip() {
  const items = CONTENT.benefits
  return (
    <section aria-label="Benefícios da loja" className="border-y border-bordo/20 bg-creme-deep/60">
      <div className="container-editorial py-6 md:py-7">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          {items.map((it, i) => (
            <div key={it.eyebrow} className={`relative ${i < items.length - 1 ? 'md:border-r md:border-bordo/15 md:pr-6' : ''}`}>
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
