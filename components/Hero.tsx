'use client'

import { useEffect, useRef, useState } from 'react'
import ParticleField from '@/components/effects/ParticleField'
import Magnetic from '@/components/ui/Magnetic'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'
import { scrollToSection } from '@/components/providers/SmoothScroll'

const TITLE_STATIC = 'Agent systems'
const TITLE_TYPED = 'for real work.'

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const [typed, setTyped] = useState('')
  const [doneTyping, setDoneTyping] = useState(false)

  // ── Slow typewriter on the accent line ─────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion()) {
      setTyped(TITLE_TYPED)
      setDoneTyping(true)
      return
    }
    let i = 0
    let timer: number
    const tick = () => {
      i += 1
      setTyped(TITLE_TYPED.slice(0, i))
      if (i < TITLE_TYPED.length) {
        timer = window.setTimeout(tick, 110)
      } else {
        setDoneTyping(true)
      }
    }
    timer = window.setTimeout(tick, 900) // wait for the static line to settle
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const root = rootRef.current!
    const fades = Array.from(root.querySelectorAll<HTMLElement>('.hero-fade'))

    if (prefersReducedMotion()) {
      gsap.set(fades, { opacity: 1, y: 0 })
      return
    }

    gsap.set(fades, { opacity: 0, y: 18 })
    const fallback = window.setTimeout(() => {
      gsap.to(fades, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.25 })
    }, 140)

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        if (hudRef.current) gsap.set(hudRef.current, { yPercent: p * 45, opacity: 1 - p * 1.4 })
      },
    })

    return () => {
      window.clearTimeout(fallback)
      st.kill()
    }
  }, [])

  return (
    <section ref={rootRef} className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center">
      {/* Ambient background: particle field + two soft glass orbs, no slabs */}
      <ParticleField className="absolute inset-0 z-0 opacity-50" />
      <div aria-hidden className="glass-orb orb-float hidden md:block z-[1]"
        style={{ width: '170px', height: '170px', top: '14%', right: '10%' }} />
      <div aria-hidden className="glass-orb orb-float-b hidden md:block z-[1]"
        style={{ width: '72px', height: '72px', bottom: '18%', left: '12%' }} />

      {/* HUD chrome */}
      <div ref={hudRef} aria-hidden className="absolute inset-0 z-[2] pointer-events-none">
        <div className="hero-fade absolute top-20 left-6 md:left-12 font-mono text-[9px] tracking-[0.24em] uppercase text-dim">
          34.0522°N&nbsp;&nbsp;118.2437°W&nbsp;&nbsp;·&nbsp;&nbsp;LOS ANGELES
        </div>
        <div className="hero-fade absolute top-20 right-6 md:right-12 font-mono text-[9px] tracking-[0.24em] uppercase text-dim hidden sm:block">
          [agent] ONLINE&nbsp;&nbsp;·&nbsp;&nbsp;human-in-the-loop
        </div>
      </div>

      {/* Open, centered hero — no container panel */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-28 flex flex-col items-center text-center gap-8 md:gap-10">
        <p className="hero-fade label !text-accent">
          Enterprise agents · Personal knowledge systems · Agentic workflow design
        </p>

        <h1 className="font-display font-semibold text-fg leading-[1.08] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {TITLE_STATIC}
          <br />
          <span className="text-accent">
            {typed}
            <span className={`type-caret ${doneTyping ? 'caret' : ''}`} aria-hidden />
          </span>
        </h1>

        <p className="hero-fade font-display font-normal text-mid text-base md:text-lg max-w-xl leading-relaxed">
          Agent design and implementation for teams that need structured workflows,
          reliable retrieval, approval controls, and practical deployment.
        </p>

        <div className="hero-fade flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <button
              onClick={() => scrollToSection('#contact')}
              className="glass-btn glass-btn-tinted px-8 py-3.5 font-mono text-[11px] md:text-xs tracking-widest uppercase font-bold"
              data-hover
            >
              Start your agent
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => scrollToSection('#how')}
              className="glass-btn px-8 py-3.5 text-fg font-mono text-[11px] md:text-xs tracking-widest uppercase hover:text-accent"
              data-hover
            >
              See how it works ↓
            </button>
          </Magnetic>
        </div>

        <div className="hero-fade flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2">
          {['Workflow automation', 'Knowledge retrieval', 'Human approval'].map((item) => (
            <span key={item} className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
              {item}
            </span>
          ))}
          <span className="inline-flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent live-dot" />
            <span className="label !text-mid">Taking new workflows</span>
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10">
        <span className="label text-dim">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent/60 to-transparent" />
      </div>
    </section>
  )
}
