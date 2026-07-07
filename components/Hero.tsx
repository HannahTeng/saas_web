'use client'

import { useEffect, useRef } from 'react'
import ParticleField from '@/components/effects/ParticleField'
import Magnetic from '@/components/ui/Magnetic'
import Decode from '@/components/ui/Decode'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'
import { scrollToSection } from '@/components/providers/SmoothScroll'

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const glowARef = useRef<HTMLDivElement>(null)
  const glowBRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current!
    const words = Array.from(root.querySelectorAll<HTMLElement>('.hero-word'))
    const fades = Array.from(root.querySelectorAll<HTMLElement>('.hero-fade'))

    if (prefersReducedMotion()) {
      gsap.set([...words, ...fades], { y: 0, yPercent: 0, opacity: 1 })
      return
    }

    gsap.set(words, { yPercent: 115 })
    gsap.set(fades, { opacity: 0, y: 18 })

    const intro = () => {
      const tl = gsap.timeline()
      tl.to(words, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.09 })
      tl.to(fades, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09 }, '-=0.55')
    }

    const fallback = window.setTimeout(intro, 140)

    // ── Parallax depth: layers exit at different speeds on scroll ─────────
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        if (glowARef.current) gsap.set(glowARef.current, { yPercent: p * 30 })
        if (glowBRef.current) gsap.set(glowBRef.current, { yPercent: p * 18 })
        if (hudRef.current) gsap.set(hudRef.current, { yPercent: p * 45, opacity: 1 - p * 1.4 })
      },
    })

    return () => {
      window.clearTimeout(fallback)
      st.kill()
    }
  }, [])

  return (
    <section ref={rootRef} className="relative min-h-[100dvh] w-full overflow-hidden flex items-center">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-full md:w-[72vw] opacity-70 z-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(246,248,251,1) 0%, rgba(246,248,251,0.82) 36%, rgba(246,248,251,0.16) 100%), url(/agent-glass.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      />

      {/* ── Parallax layer 0: glass-blue workflow field ── */}
      <ParticleField className="absolute inset-0 z-0 opacity-70" />

      {/* ── Parallax layer 1: drifting glow blobs ── */}
      <div
        ref={glowARef}
        aria-hidden
        className="absolute -top-24 right-0 h-[52vh] w-[64vw] z-0"
        style={{ background: 'linear-gradient(135deg, rgba(75,134,165,0.10), rgba(255,255,255,0))' }}
      />
      <div
        ref={glowBRef}
        aria-hidden
        className="absolute bottom-0 left-0 h-[42vh] w-[58vw] z-0"
        style={{ background: 'linear-gradient(20deg, rgba(255,255,255,0.72), rgba(246,248,251,0))' }}
      />

      {/* ── Parallax layer 2: HUD console chrome ── */}
      <div ref={hudRef} aria-hidden className="absolute inset-0 z-[1] pointer-events-none">
        <div className="hero-fade absolute top-20 left-6 md:left-12 font-mono text-[9px] tracking-[0.24em] uppercase text-dim">
          34.0522°N&nbsp;&nbsp;118.2437°W&nbsp;&nbsp;·&nbsp;&nbsp;LOS ANGELES
        </div>
        <div className="hero-fade absolute top-20 right-6 md:right-12 font-mono text-[9px] tracking-[0.24em] uppercase text-dim hidden sm:block">
          [agent] ONLINE&nbsp;&nbsp;·&nbsp;&nbsp;human-in-the-loop
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12 py-24 md:py-20 flex flex-col items-start gap-6">
        <Decode
          as="p"
          onLoad
          text="Agentic workflows · Forward-deployed · Built by Hannah Teng"
          className="label !text-accent"
        />

        <h1 className="font-display font-medium text-fg leading-[1.02] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.05em]">
            <span className="hero-word inline-block">Your workflow,</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.05em]">
            <span
              className="hero-word inline-block text-accent"
            >
              running itself.
            </span>
          </span>
        </h1>

        <p className="hero-fade font-display font-light text-mid text-sm md:text-lg max-w-2xl leading-relaxed">
          The task your team repeats every day — filing, checking, matching, dispatching — can
          become an AI agent that does the repetitive part and hands you the decision. I sit with
          your team, learn how the work actually flows, and deploy an agent around it. No API?
          I connect to whatever you already use — spreadsheets, ERPs, portals, even
          browser-only systems. You approve; the agent executes.
        </p>

        <div className="hero-fade flex flex-wrap items-center gap-3 mt-2">
          <Magnetic>
            <button
              onClick={() => scrollToSection('#contact')}
              className="px-6 md:px-7 py-2.5 md:py-3 bg-accent text-white font-mono text-[11px] md:text-xs tracking-widest uppercase font-bold transition-all duration-300 hover:shadow-glow active:scale-[0.98]"
              data-hover
            >
              Start your agent
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => scrollToSection('#how')}
              className="px-6 md:px-7 py-2.5 md:py-3 bg-white/62 border border-edge text-mid font-mono text-[11px] md:text-xs tracking-widest uppercase transition-colors duration-300 hover:border-accent hover:text-accent active:scale-[0.98]"
              data-hover
            >
              See how it works ↓
            </button>
          </Magnetic>
          <span className="hero-fade inline-flex items-center gap-2.5 md:ml-1 md:pl-4 md:border-l border-edge">
            <span className="w-1.5 h-1.5 rounded-full bg-accent live-dot" />
            <span className="label !text-mid">Taking new workflows</span>
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hidden md:flex absolute bottom-8 left-12 flex-col items-start gap-2 z-10">
        <span className="label text-dim">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent/60 to-transparent" />
      </div>
    </section>
  )
}
