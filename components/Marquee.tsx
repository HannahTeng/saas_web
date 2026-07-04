'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'

const ITEMS = [
  'LOGISTICS & DISPATCH',
  'CLINICAL TRIALS & RESEARCH',
  'CUSTOMS & TRADE COMPLIANCE',
  'EDUCATION & COUNSELING',
  'E-COMMERCE & OPERATIONS',
  'AGENTS DO THE REPETITION',
  'HUMANS KEEP THE JUDGMENT',
  'YOUR INDUSTRY NEXT',
]

/**
 * Data-stream ticker. Kinetic type: the track skews and stretches with the
 * page's scroll velocity, so fast scrolling visibly bends the stream.
 */
export default function Marquee() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const track = wrapRef.current?.querySelector<HTMLElement>('.marquee-track')
    if (!track) return

    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power2.out' })
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-14, 14, self.getVelocity() / 220)
        skewTo(v)
      },
    })
    return () => st.kill()
  }, [])

  const row = (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 md:gap-10 shrink-0">
          <span className="font-mono text-xs md:text-sm font-bold tracking-[0.18em] uppercase whitespace-nowrap text-mid">
            {item}
          </span>
          <span className="text-accent text-base leading-none" aria-hidden>
            ▸
          </span>
        </span>
      ))}
    </>
  )

  return (
    <div
      ref={wrapRef}
      className="relative z-10 border-y border-edge bg-panel/60 py-3.5 md:py-4 overflow-hidden select-none"
      aria-hidden
    >
      <div
        className="marquee-track flex items-center gap-6 md:gap-10 w-max"
        style={{ ['--marquee-speed' as string]: '34s' }}
      >
        {row}
        {row}
      </div>
    </div>
  )
}
