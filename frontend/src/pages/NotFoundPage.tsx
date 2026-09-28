import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="container-editorial py-28 text-center">
      <p className="label-eyebrow mb-6">Erro · 404</p>
      <h1 className="font-serif italic text-[clamp(4rem,16vw,9rem)] leading-none text-bordo">
        perdida
      </h1>
      <p className="mx-auto mt-8 max-w-xl font-serif text-2xl italic text-vinho/80">
        A página que você procura não existe, ou mudou de lugar.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link to="/" className="btn-bordo">
          Voltar para o início
        </Link>
        <Link to="/loja/colecao" className="btn-ghost">
          Ver coleção
        </Link>
      </div>
    </section>
  )
}
