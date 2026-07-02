'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, splitWordsPlain, prefersReducedMotion } from '@/lib/anim'

type Props = {
  text: string
  className?: string
}

/**
 * Signature scrub statement: words start muted and fill to ink as the section
 * scrolls through the viewport (tied to scroll position via `scrub`).
 */
export default function WordFill({ text, className = '' }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      el.style.color = 'var(--fg)'
      return
    }

    const words = splitWordsPlain(el)
    gsap.set(words, { color: 'var(--dim)' })

    const tween = gsap.to(words, {
      color: 'var(--fg)',
      stagger: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        end: 'bottom 55%',
        scrub: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [text])

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  )
}
