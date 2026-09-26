export default function AnnouncementBar() {
  const items = [
    'Até 6x sem juros',
    'Envio para todo o Brasil',
    '8% OFF na 1ª compra',
    'Trocas em até 30 dias',
  ]

  const loop = [...items, ...items]

  return (
    <div
      className="w-full bg-bordo text-creme overflow-hidden border-b border-bordo/30"
      role="complementary"
      aria-label="Condições comerciais"
    >
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        <ul className="flex shrink-0 items-center gap-16 px-10 text-[11px] uppercase tracking-editorial font-light">
          {loop.map((t, i) => (
            <li key={`${t}-${i}`} className="flex items-center gap-4">
              <span className="inline-block h-1 w-1 rounded-full bg-rose-nude/80" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
