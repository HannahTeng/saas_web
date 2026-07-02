'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/anim'

const BOOT_LINES = [
  '[ok] mounting /dev/portfolio',
  '[ok] loading clinical datasets … 1,000,000 rows',
  '[ok] agents online · human-in-the-loop',
  '[ok] webgl particle field … ready',
  '[sys] HANNAH TENG // forward-deployed',
]

/**
 * Terminal-boot preloader: monospace boot log types in line by line while a
 * progress counter runs 000→100, then the whole console wipes upward.
 * Dispatches `preloader:done` so the Hero can begin its intro.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const finish = () => {
      window.dispatchEvent(new CustomEvent('preloader:done'))
      setGone(true)
      document.body.style.overflow = ''
    }

    if (prefersReducedMotion()) {
      finish()
      return
    }

    document.body.style.overflow = 'hidden'
    const counter = { v: 0 }
    const tl = gsap.timeline({ onComplete: finish })

    tl.to('.boot-line', {
      opacity: 1,
      y: 0,
      stagger: 0.22,
      duration: 0.3,
      ease: 'power2.out',
    })
    tl.to(
      counter,
      {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (countRef.current)
            countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      },
      0.1,
    )
    tl.to('.boot-bar-fill', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.1)
    tl.to(rootRef.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '+=0.25')

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (gone) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[85] bg-void flex flex-col justify-between px-6 py-8 md:px-14 md:py-12 border-b border-accent/30"
      aria-hidden
    >
      <div className="flex justify-between items-start font-mono text-[10px] tracking-[0.3em] uppercase text-dim">
        <span>Zihan · Hannah Teng</span>
        <span className="hidden sm:inline">Data Science · UCLA</span>
      </div>

      <div className="font-mono text-xs md:text-sm text-mid space-y-2">
        {BOOT_LINES.map((line, i) => (
          <p key={i} className="boot-line opacity-0 translate-y-2">
            <span className="text-accent">{line.slice(0, line.indexOf(']') + 1)}</span>
            {line.slice(line.indexOf(']') + 1)}
          </p>
        ))}
        <p className="boot-line opacity-0 translate-y-2 text-accent">
          &gt; boot sequence complete<span className="caret">▌</span>
        </p>
      </div>

      <div className="flex items-end justify-between gap-8">
        <div className="flex-1 h-px bg-edge relative overflow-hidden">
          <div className="boot-bar-fill absolute inset-0 bg-accent origin-left scale-x-0 shadow-glowSm" />
        </div>
        <span ref={countRef} className="font-mono text-sm text-accent tabular-nums">
          000
        </span>
      </div>
    </div>
  )
}
