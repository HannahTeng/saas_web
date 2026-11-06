import type { HTMLAttributes, ReactNode } from 'react'

type Props = Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'> & {
  children: ReactNode
  /** Hairline above the content column, for pages that are a run of lists (pricing). The home page separates by space alone. */
  rule?: boolean
  /** Classes for the section itself; its padding is the vertical rhythm, so `!pt-*` adjusts one section. */
  className?: string
}

/** The one section wrapper: same gutters, same vertical rhythm, same 1152px column, and rules that span that column, not the viewport. */
export default function Section({ children, rule = false, className = '', ...rest }: Props) {
  return (
    <section className={`px-6 py-[46px] min-[801px]:py-14 sm:px-10 lg:px-14 ${className}`.trim()} {...rest}>
      <div className={`mx-auto max-w-[1120px] ${rule ? 'border-t border-line/10 pt-12' : ''}`.trim()}>{children}</div>
    </section>
  )
}
