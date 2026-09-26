import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CATEGORIES } from '../../data/seed'

function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="Amorena — página inicial" className={`block ${className}`}>
      <span className="font-serif italic text-[32px] leading-none text-bordo tracking-tight">
        amorena
      </span>
    </Link>
  )
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  )
}

function BagIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 8h14l-.8 12.2a2 2 0 0 1-2 1.8H7.8a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.8" />
      <path d="M5 20c1.5-3.5 4.4-5.5 7-5.5s5.5 2 7 5.5" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      ) : (
        <>
          <path d="M4 8h16" strokeLinecap="round" />
          <path d="M4 16h16" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-bordo/15 bg-creme/85 backdrop-blur">
      <div className="container-editorial relative flex items-center justify-between gap-6 py-4">
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="p-2 text-vinho"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>

        <Logo className="md:mx-0 mx-auto" />

        <nav className="hidden md:block flex-1" aria-label="Categorias">
          <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] uppercase tracking-wideish font-medium text-vinho/85">
            <li>
              <Link to="/" className="link-underline hover:text-bordo">
                Início
              </Link>
            </li>
            <li aria-hidden className="text-bordo/20 font-light">·</li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <NavLink
                  to={`/loja/categoria/${c.slug}`}
                  className={({ isActive }) =>
                    `link-underline ${isActive ? 'text-bordo' : 'hover:text-bordo'}`
                  }
                >
                  {c.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-controls="search-field"
            aria-label="Buscar produtos"
            className="p-2 text-vinho hover:text-bordo"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Acessar minha conta" className="hidden sm:inline-flex p-2 text-vinho hover:text-bordo">
            <UserIcon className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Abrir sacola (0 itens)" className="relative inline-flex p-2 text-vinho hover:text-bordo">
            <BagIcon className="h-5 w-5" />
            <span className="pointer-events-none absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-bordo text-[9px] font-semibold text-creme">
              0
            </span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-bordo/10 bg-creme">
          <div className="container-editorial flex items-center gap-3 py-3">
            <SearchIcon className="h-4 w-4 text-bordo/70" />
            <input
              id="search-field"
              type="search"
              placeholder="Buscar peça, cor ou referência…"
              className="flex-1 bg-transparent border-b border-bordo/20 pb-2 text-sm font-light text-vinho placeholder:text-vinho/40 focus:outline-none focus:border-bordo"
            />
            <span className="label-eyebrow hidden sm:block">ESC para fechar</span>
          </div>
        </div>
      )}

      {menuOpen && (
        <nav
          id="main-menu"
          className="md:hidden border-t border-bordo/10 bg-creme"
          aria-label="Menu mobile"
        >
          <ul className="container-editorial divide-y divide-bordo/10 py-2 text-vinho">
            {CATEGORIES.map((c, i) => (
              <li key={c.slug} className="flex items-baseline justify-between gap-4 py-4">
                <span className="font-serif italic text-sm text-bordo/60" aria-hidden="true">
                  0{i + 1}
                </span>
                <NavLink
                  to={`/loja/categoria/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 font-serif text-3xl tracking-tight text-vinho hover:text-bordo"
                >
                  {c.name}
                </NavLink>
                <span className="text-[10px] uppercase tracking-editorial text-bordo/70">
                  {c.eyebrow.split('·')[1]?.trim()}
                </span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-4 py-4 border-t border-bordo/20">
              <span className="font-serif italic text-sm text-bordo/60" aria-hidden="true">00</span>
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex-1 font-serif text-3xl tracking-tight text-bordo/85 hover:text-bordo">
                Voltar ao início
              </Link>
              <span className="text-[10px] uppercase tracking-editorial text-bordo/70">link</span>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
