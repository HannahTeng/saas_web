import type { HTMLAttributes, ReactNode } from 'react'

type Props = Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'> & {
  children: ReactNode
  /** Hairline above the content column. Every dark section after the hero has one, so the page keeps one rhythm. */
  rule?: boolean
  className?: string
}

/** The one section wrapper: same gutters, same vertical rhythm, same 1152px column, and rules that span that column, not the viewport. */
export default function Section({ children, rule = true, className = '', ...rest }: Props) {
  return (
    <section className={`scroll-mt-16 px-4 sm:px-6 ${className}`.trim()} {...rest}>
      <div className={`mx-auto max-w-6xl py-16 md:py-28 ${rule ? 'border-t border-line/[0.07]' : ''}`.trim()}>{children}</div>
    </section>
  )
}
