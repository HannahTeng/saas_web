import type { HTMLAttributes, ReactNode } from 'react'

type Props = Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'> & {
  children: ReactNode
  /** Hairline above the section. Every section after the hero has one, so the page keeps one rhythm. */
  rule?: boolean
  /** Edge-to-edge content (the testimonial strip) skips the content column. */
  bleed?: boolean
  className?: string
}

/** The one section wrapper: same gutters, same vertical rhythm, same 1152px column everywhere. */
export default function Section({ children, rule = true, bleed = false, className = '', ...rest }: Props) {
  return (
    <section className={`scroll-mt-16 px-4 py-16 sm:px-6 md:py-28 ${rule ? 'border-t border-line/[0.07]' : ''} ${className}`.trim()} {...rest}>
      {bleed ? children : <div className="mx-auto max-w-6xl">{children}</div>}
    </section>
  )
}
