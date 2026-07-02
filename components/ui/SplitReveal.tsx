'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, splitWordsMasked, prefersReducedMotion } from '@/lib/anim'

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  /** delay before the reveal begins, seconds */
  delay?: number
  /** if true, waits for a `preloader:done` event instead of a ScrollTrigger */
  onLoad?: boolean
}

/**
 * Line-mask word reveal: each word rises from a clipped baseline with a stagger.
 * Triggers on scroll into view, or on the preloader finishing (`onLoad`).
 */
export default function SplitReveal({
  text,
  as = 'h2',
  className = '',
  delay = 0,
  onLoad = false,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const Tag = as as React.ElementType

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      el.style.opacity = '1'
      return
    }

    const words = splitWordsMasked(el)
    el.style.opacity = '1'

    const run = () =>
      gsap.to(words, {
        y: '0%',
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.06,
        delay,
      })

    let st: ScrollTrigger | undefined
    if (onLoad) {
      const done = () => run()
      window.addEventListener('preloader:done', done, { once: true })
      // Fallback if the preloader is absent (e.g. reduced motion path elsewhere).
      const fallback = window.setTimeout(run, 2600)
      return () => {
        window.removeEventListener('preloader:done', done)
        window.clearTimeout(fallback)
      }
    } else if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      // Already in view at mount → reveal immediately.
      run()
    } else {
      st = ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: run })
    }

    return () => st?.kill()
  }, [text, delay, onLoad])

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {text}
    </Tag>
  )
}
