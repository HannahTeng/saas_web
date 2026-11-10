import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'ghost'
type Size = 'md' | 'lg'

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }

const SIZE: Record<Size, string> = { md: 'h-10 px-[18px] text-sm', lg: 'h-[52px] px-7 text-base' }
const LOOK: Record<Variant, string> = { solid: 'btn-primary', ghost: 'btn-secondary' }

/**
 * The site's one button, a small pill (.btn in globals.css): solid is the brand colour, ghost is a quiet warm grey; on a media panel
 * (.on-media) solid turns white and ghost turns to glass. md (40px) everywhere, lg (52px) in the hero and the close. Renders a link when given an href.
 */
export default function Button(props: AsButton | AsLink) {
  const { variant = 'solid', size = 'md', className = '', children, ...rest } = props
  const cls = `btn ${SIZE[size]} ${LOOK[variant]} ${className}`.trim()
  if (rest.href !== undefined) return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  const { type = 'button', ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return <button type={type} className={cls} {...button}>{children}</button>
}
