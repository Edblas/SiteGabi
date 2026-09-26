interface Props {
  /** Alinhamento do logo */
  align?: 'left' | 'center'
  /** Tamanho da palavra amorena (default: para landing desktop/mobile) */
  size?: 'large' | 'medium' | 'small'
  /** Tema claro (sobre creme) vs escuro (sobre bordo) — por enquanto só claro */
  variant?: 'light'
}

export default function BrandWordmark({ align = 'center', size = 'large' }: Props) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  const wordClass =
    size === 'large'
      ? 'text-[clamp(3.25rem,15vw,5.5rem)]'
      : size === 'medium'
      ? 'text-[clamp(2rem,8vw,3rem)]'
      : 'text-[clamp(1.5rem,6vw,2.25rem)]'

  const tagClass =
    size === 'large'
      ? 'mt-3 text-[11px] sm:text-[13px] tracking-[0.48em]'
      : size === 'medium'
      ? 'mt-2 text-[10px] sm:text-[11px] tracking-[0.42em]'
      : 'mt-1.5 text-[10px] tracking-[0.36em]'

  const sepWidth = size === 'large' ? 'max-w-[320px]' : size === 'medium' ? 'max-w-[220px]' : 'max-w-[160px]'

  return (
    <div className={`inline-flex w-full max-w-md flex-col ${alignCls}`} aria-label="Amorena Moda Feminina">
      <span className={`block font-serif italic text-bordo leading-[0.9] ${wordClass}`}>
        amorena
      </span>
      <span className={`mt-4 flex w-full items-center justify-center gap-3 ${sepWidth}`} aria-hidden="true">
        <span className="block h-px flex-1 bg-bordo" />
        <span className="block h-[6px] w-[6px] rotate-45 bg-bordo" />
        <span className="block h-px flex-1 bg-bordo" />
      </span>
      <span className={`block font-sans font-medium uppercase text-bordo ${tagClass}`}>
        Moda Feminina
      </span>
    </div>
  )
}
