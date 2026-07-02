'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'

/**
 * Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync.
 * Disabled entirely when the user prefers reduced motion.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: 'vertical',
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    // Let other components request an anchored scroll through Lenis.
    const onAnchor = (e: Event) => {
      const target = (e as CustomEvent<string>).detail
      const node = document.querySelector(target)
      if (node) lenis.scrollTo(node as HTMLElement, { offset: -8 })
    }
    window.addEventListener('lenis:scrollTo', onAnchor as EventListener)

    return () => {
      window.removeEventListener('lenis:scrollTo', onAnchor as EventListener)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])

  return <>{children}</>
}

/** Helper any component can call to smooth-scroll to a selector. */
export function scrollToSection(selector: string) {
  window.dispatchEvent(new CustomEvent('lenis:scrollTo', { detail: selector }))
  // Fallback for reduced-motion (Lenis not mounted).
  const node = document.querySelector(selector)
  if (node && prefersReducedMotion()) node.scrollIntoView({ behavior: 'auto' })
}
