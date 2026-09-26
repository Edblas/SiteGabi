import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Base {
  variant?: Variant
  children: ReactNode
  caption?: string
  delay?: number
}

type ButtonProps = Base &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type AnchorProps = Base &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type Props = ButtonProps | AnchorProps

const base =
  'group relative inline-flex w-full items-center justify-between gap-4 overflow-hidden border px-6 text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-bordo'

const variantMap: Record<Variant, string> = {
  primary:
    'min-h-[68px] rounded border-bordo bg-bordo text-creme hover:bg-creme hover:text-bordo',
  secondary:
    'min-h-[64px] rounded border-bordo bg-creme text-bordo hover:bg-bordo hover:text-creme',
  ghost:
    'min-h-[60px] rounded border-bordo/35 bg-transparent text-vinho hover:border-bordo hover:bg-bordo/5 hover:text-bordo',
}

/**
 * Botão editorial Amorena — cantos levemente arredondados (4px = Tailwind `rounded` = 4px).
 * Sem emojis, sem pílula. Inclui uma seta fina → à direita.
 * Suporta captions pequenos abaixo do título (ex.: "Ofertas em primeira mão").
 */
export default function CtaButton(props: Props) {
  const { variant = 'secondary', children, caption, delay = 0, className = '', ...rest } = props

  const style = delay
    ? { animationDelay: `${delay}ms`, opacity: 0, animation: `fadeUp 650ms ease-out ${delay}ms 1 both` }
    : undefined

  const cls = `${base} ${variantMap[variant]} ${className}`

  const content = (
    <>
      <span className="flex flex-col items-start py-2 pr-4">
        <span className="font-sans text-[13px] sm:text-[14px] uppercase tracking-[0.28em] font-medium">
          {children}
        </span>
        {caption && (
          <span className="mt-1 font-serif italic text-[13px] tracking-normal normal-case opacity-80">
            {caption}
          </span>
        )}
      </span>
      <span className="font-serif italic text-xl transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-current">
        →
      </span>
    </>
  )

  if ('href' in rest && rest.href) {
    const { href, target, rel, onClick, ...anchorRest } = rest as AnchorProps
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        className={cls}
        style={style}
        {...anchorRest}
      >
        {content}
      </a>
    )
  }

  const { onClick, type, ...btnRest } = props as ButtonProps
  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      className={cls}
      style={style}
      {...btnRest}
    >
      {content}
    </button>
  )
}
