import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'ghost'
type Size = 'md' | 'lg'

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }

const SIZE: Record<Size, string> = { md: 'h-11 gap-4 px-5 text-sm', lg: 'h-14 gap-5 px-8 text-[15px]' }
const LOOK: Record<Variant, string> = { solid: 'btn-primary', ghost: 'btn-secondary' }

/**
 * The site's one button, a liquid-glass pill (.btn in globals.css): solid is the tinted primary action, ghost the clear
 * secondary one; md (44px) everywhere, lg (56px) in the hero and the closing card. Renders a link when given an href.
 */
export default function Button(props: AsButton | AsLink) {
  const { variant = 'solid', size = 'md', className = '', children, ...rest } = props
  const cls = `btn ${SIZE[size]} ${LOOK[variant]} ${className}`.trim()
  if (rest.href !== undefined) return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  const { type = 'button', ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return <button type={type} className={cls} {...button}>{children}</button>
}
