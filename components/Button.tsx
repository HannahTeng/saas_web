import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'ghost'
type Size = 'md' | 'lg'

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }

const BASE = 'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors disabled:cursor-wait disabled:opacity-60'
const SIZE: Record<Size, string> = { md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' }
const LOOK: Record<Variant, string> = {
  solid: 'bg-accent text-accent-ink hover:bg-accent-hover',
  ghost: 'border border-line/20 text-primary hover:border-accent',
}

/**
 * The site's one button: solid for the primary action, ghost for the secondary one; md (40px) everywhere,
 * lg (48px) in the hero and the closing CTA. Renders a link when given an href.
 */
export default function Button(props: AsButton | AsLink) {
  const { variant = 'solid', size = 'md', className = '', children, ...rest } = props
  const cls = `${BASE} ${SIZE[size]} ${LOOK[variant]} ${className}`.trim()
  if (rest.href !== undefined) return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  const { type = 'button', ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return <button type={type} className={cls} {...button}>{children}</button>
}
