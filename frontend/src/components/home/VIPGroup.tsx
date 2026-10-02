export default function VIPGroup() {
  const whatsRaw = (import.meta.env.VITE_WHATSAPP_NUMBER || '5535997061783').replace(/\D/g, '')
  const whatsLink = `https://wa.me/${whatsRaw || '5535997061783'}?text=${encodeURIComponent(
    'Olá Gabi! Quero fazer parte do Grupo VIP Amorena e receber novidades em primeira mão.',
  )}`

  return (
    <section
      aria-labelledby="vip-title"
      className="relative overflow-hidden bg-bordo text-creme"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="container-editorial relative grid grid-cols-1 gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-2">
          <p className="label-eyebrow !text-creme/80">04 · Grupo VIP</p>
          <span className="mt-3 inline-block section-number !text-creme/70">
            Grupo VIP
          </span>
        </div>

        <div className="md:col-span-6">
          <h2 id="vip-title" className="font-h-editorial !text-creme">
            Entre no <em className="italic text-rose-nude">grupo</em> — novidades em primeira mão.
          </h2>
          <p className="mt-8 max-w-xl font-serif italic text-xl leading-relaxed text-creme/85">
            Lançamentos exclusivos, peças de segunda mão selecionadas e cupom de aniversariante.
            Apenas para quem veste Amorena.
          </p>
        </div>

        <div className="md:col-span-4 md:pt-4 md:flex md:flex-col md:items-start md:justify-end">
          <a
            href={whatsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-creme/60 bg-transparent px-6 py-4 text-[12px] uppercase tracking-wideish text-creme hover:bg-creme hover:text-bordo transition-colors"
          >
            Entrar no grupo
            <span className="inline-block h-px w-10 bg-rose-nude" aria-hidden />
          </a>

          <ul className="mt-10 space-y-3 text-sm text-creme/80">
            <li className="flex items-baseline gap-3 border-b border-creme/15 pb-3">
              <span className="font-serif italic text-2xl text-rose-nude">01</span>
              Cupom de 10% no primeiro pedido do grupo
            </li>
            <li className="flex items-baseline gap-3 border-b border-creme/15 pb-3">
              <span className="font-serif italic text-2xl text-rose-nude">02</span>
              Peças que não chegam ao site
            </li>
            <li className="flex items-baseline gap-3">
              <span className="font-serif italic text-2xl text-rose-nude">03</span>
              Vendas de amostra e mostruário
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
