'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'

/**
 * ScanReveal — scanline wipe image reveal. The content is clipped shut; on
 * enter, a glowing horizontal scan line sweeps down and the clip opens behind
 * it, with a couple of quick glitch slice offsets mid-sweep. Content is fully
 * visible immediately under prefers-reduced-motion.
 */
export default function ScanReveal({
  children,
  className = '',
  onLoad = false,
}: {
  children: React.ReactNode
  className?: string
  /** trigger on `preloader:done` instead of scroll-into-view */
  onLoad?: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current!
    const clip = clipRef.current!
    const line = lineRef.current!

    if (prefersReducedMotion()) {
      clip.style.clipPath = 'inset(0 0 0% 0)'
      line.style.display = 'none'
      return
    }

    gsap.set(clip, { clipPath: 'inset(0 0 100% 0)' })
    gsap.set(line, { top: '0%', opacity: 0 })

    let played = false
    const play = () => {
      if (played) return
      played = true
      const tl = gsap.timeline()
      tl.set(line, { opacity: 1 })
      tl.to(clip, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power2.inOut' }, 0)
      tl.to(line, { top: '100%', duration: 1.1, ease: 'power2.inOut' }, 0)
      // glitch slices mid-sweep
      tl.to(clip, { x: -6, duration: 0.05 }, 0.35)
      tl.to(clip, { x: 5, duration: 0.05 }, 0.45)
      tl.to(clip, { x: 0, duration: 0.05 }, 0.55)
      tl.to(line, { opacity: 0, duration: 0.25 }, '>-0.1')
    }

    let st: ScrollTrigger | undefined
    let fallback = 0
    if (onLoad) {
      const done = () => play()
      window.addEventListener('preloader:done', done, { once: true })
      fallback = window.setTimeout(play, 2800)
      return () => {
        window.removeEventListener('preloader:done', done)
        window.clearTimeout(fallback)
      }
    } else if (root.getBoundingClientRect().top < window.innerHeight * 0.85) {
      play()
    } else {
      st = ScrollTrigger.create({ trigger: root, start: 'top 82%', once: true, onEnter: play })
    }
    return () => st?.kill()
  }, [onLoad])

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${className}`}>
      <div ref={clipRef} className="w-full h-full">
        {children}
      </div>
      {/* the scan line */}
      <div
        ref={lineRef}
        aria-hidden
        className="absolute left-0 right-0 h-px bg-accent shadow-glow"
        style={{ boxShadow: '0 0 18px 2px rgba(0,229,255,0.55)' }}
      />
    </div>
  )
}
