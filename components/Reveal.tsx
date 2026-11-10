'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

/**
 * An arrival: the element comes out of a blur and up a little, once, the first time it is on screen (.reveal in globals.css).
 * `delay` (ms) staggers siblings. Reduced motion and the footer's pause switch show it at rest.
 */
export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      el.dataset.in = 'true'
      io.disconnect()
    }, { rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <div ref={ref} className={`reveal ${className}`.trim()} style={delay ? ({ '--d': `${delay}ms` } as CSSProperties) : undefined}>{children}</div>
}
