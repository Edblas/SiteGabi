import { Link } from 'react-router-dom'

const HERO_IMG =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'editorial fashion full body portrait of elegant brazilian woman wearing burgundy tailored midi dress and nude leather mules standing in minimal cream studio soft side lighting shadows on wall vogue magazine aesthetic shot on medium format film'
  ) +
  '&image_size=portrait_4_3'

const HERO_DETAIL =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'editorial detail close up of hand holding cream silk blouse cuff gold jewelry soft off white background minimal fashion magazine crop'
  ) +
  '&image_size=square_hd'

export default function Hero() {
  return (
    <section className="relative">
      <div className="container-editorial relative pb-14 pt-10 md:pt-16">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-6 md:pr-6 order-2 md:order-1">
            <p className="label-eyebrow">Coleção 01 · Outono Inverno</p>
            <h1 className="mt-4 font-display text-vinho">
              <span className="block">Peças que</span>
              <span className="block italic text-bordo">vestem você</span>
              <span className="block">— de corpo inteiro.</span>
            </h1>
            <p className="mt-8 max-w-md font-serif italic text-xl leading-relaxed text-vinho/80">
              A nova coleção Amorena pensa no tempo lento, nos gestos simples e na roupa que
              acompanha — nunca atrapalha.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/loja/colecao" className="btn-bordo">
                Comprar coleção
              </Link>
              <Link to="/loja/categoria/conjuntos" className="btn-ghost">
                Ver conjuntos
              </Link>
            </div>

            <dl className="mt-16 grid grid-cols-3 max-w-md divide-x divide-bordo/15 border-y border-bordo/15 py-5">
              <div className="px-3 text-center first:pl-0">
                <dt className="label-eyebrow">Peças</dt>
                <dd className="mt-2 font-serif text-3xl text-vinho">120+</dd>
              </div>
              <div className="px-3 text-center">
                <dt className="label-eyebrow">Envio</dt>
                <dd className="mt-2 font-serif text-3xl text-vinho">Brasil</dd>
              </div>
              <div className="px-3 text-center last:pr-0">
                <dt className="label-eyebrow">Trocas</dt>
                <dd className="mt-2 font-serif text-3xl text-vinho">30d</dd>
              </div>
            </dl>
          </div>

          <div className="col-span-12 md:col-span-6 order-1 md:order-2 relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-bordo/10 bg-creme-deep">
              <img
                src={HERO_IMG}
                alt="Editorial — vestido midi de alfaiataria bordô"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-hero-bleed" aria-hidden="true" />
              <span className="absolute left-4 top-4 chip bg-creme/85 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-bordo" />
                Nova coleção
              </span>
            </div>

            <div className="hidden md:block absolute -bottom-12 -left-10 w-40 aspect-square border border-bordo/15 bg-creme p-2 shadow-card">
              <img src={HERO_DETAIL} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
