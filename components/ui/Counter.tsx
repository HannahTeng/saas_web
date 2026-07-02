'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'

type Props = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

/** Counts up from zero when scrolled into view. */
export default function Counter({ value, decimals = 0, prefix = '', suffix = '', className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`

    if (prefersReducedMotion()) {
      el.textContent = format(value)
      return
    }

    el.textContent = format(0)
    const obj = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: value,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = format(obj.v)
          },
        }),
    })
    return () => st.kill()
  }, [value, decimals, prefix, suffix])

  return <span ref={ref} className={className}>{prefix}{value.toFixed(decimals)}{suffix}</span>
}
