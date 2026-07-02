'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'

type Props = {
  children: React.ReactNode
  className?: string
  /** stagger index — multiplies a small delay so siblings cascade */
  index?: number
  y?: number
}

/** Generic fade-and-rise on scroll into view. */
export default function Reveal({ children, className = '', index = 0, y = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.set(el, { opacity: 0, y })
    const play = () =>
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        delay: index * 0.07,
      })

    // Safety: if already in view at mount (e.g. after a tab switch), play now.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
      play()
      return
    }

    const st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play })
    return () => st.kill()
  }, [index, y])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
