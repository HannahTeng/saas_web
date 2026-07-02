'use client'

import { useEffect, useRef } from 'react'
import FlowmapImage from '@/components/effects/FlowmapImage'
import ParticleField from '@/components/effects/ParticleField'
import ScanReveal from '@/components/ui/ScanReveal'
import Magnetic from '@/components/ui/Magnetic'
import Decode from '@/components/ui/Decode'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/anim'
import { scrollToSection } from '@/components/providers/SmoothScroll'

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
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

    const done = () => intro()
    window.addEventListener('preloader:done', done, { once: true })
    const fallback = window.setTimeout(intro, 2800)

    // ── Parallax depth: layers exit at different speeds on scroll ─────────
    // glow blobs (far) < HUD chrome (mid) < portrait (near foreground)
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
        if (imgWrapRef.current) gsap.set(imgWrapRef.current, { yPercent: p * 10 })
      },
    })

    return () => {
      window.removeEventListener('preloader:done', done)
      window.clearTimeout(fallback)
      st.kill()
    }
  }, [])

  return (
    <section ref={rootRef} className="relative min-h-svh w-full overflow-hidden flex items-center">
      {/* ── Parallax layer 0: WebGL data-cloud (points + link lines) ── */}
      <ParticleField className="absolute inset-0 z-0" />

      {/* ── Parallax layer 1: drifting glow blobs ── */}
      <div
        ref={glowARef}
        aria-hidden
        className="absolute -top-32 -right-24 w-[45vw] h-[45vw] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 65%)' }}
      />
      <div
        ref={glowBRef}
        aria-hidden
        className="absolute bottom-0 -left-32 w-[38vw] h-[38vw] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)' }}
      />

      {/* ── Parallax layer 2: HUD console chrome ── */}
      <div ref={hudRef} aria-hidden className="absolute inset-0 z-[1] pointer-events-none">
        <div className="hero-fade absolute top-20 left-6 md:left-12 font-mono text-[9px] tracking-[0.24em] uppercase text-dim">
          34.0522°N&nbsp;&nbsp;118.2437°W&nbsp;&nbsp;·&nbsp;&nbsp;LOS ANGELES
        </div>
        <div className="hero-fade absolute top-20 right-6 md:right-12 font-mono text-[9px] tracking-[0.24em] uppercase text-dim hidden sm:block">
          [sys] ONLINE&nbsp;&nbsp;·&nbsp;&nbsp;v2.0
        </div>
      </div>

      <div
        className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-24 md:py-16 grid grid-cols-[1fr_auto] gap-x-5 sm:gap-x-8 md:gap-x-12 gap-y-6 items-center md:content-center [grid-template-areas:'nm_ph'_'tg_tg'_'ct_ct'] md:[grid-template-areas:'nm_ph'_'tg_ph'_'ct_ph']"
      >
        {/* Name */}
        <div className="[grid-area:nm] min-w-0">
          <Decode
            as="p"
            onLoad
            text="Forward-Deployed Engineer · Data Scientist & Analyst"
            className="label !text-accent mb-4 md:mb-6"
          />
          <h1 className="font-display font-medium text-fg leading-[0.85] tracking-[-0.03em] text-[13vw] sm:text-7xl md:text-8xl lg:text-9xl">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.05em]">
              <span className="hero-word inline-block">Hannah</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.05em]">
              <span
                className="hero-word inline-block text-accent"
                style={{ textShadow: '0 0 32px rgba(0,229,255,0.35)' }}
              >
                Teng
              </span>
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="[grid-area:tg] hero-fade font-display font-light text-mid text-sm md:text-lg max-w-lg leading-relaxed md:mt-2">
          I build agentic workflows for real industries — healthcare, logistics, education,
          e-commerce — with humans always in the loop. I connect AI to any system, whatever it
          takes: MCP servers &amp; APIs, OAuth-connected apps with zero infra, or browser automation
          &amp; scraping (Playwright, Firecrawl) when no API exists. Just as strong in the analyst
          seat — SQL, A/B testing, statistical modeling, dashboards.
        </p>

        {/* CTAs */}
        <div className="[grid-area:ct] hero-fade flex flex-wrap items-center gap-3 md:mt-3">
          <Magnetic>
            <button
              onClick={() => scrollToSection('#work')}
              className="px-6 md:px-7 py-2.5 md:py-3 bg-accent text-void font-mono text-[11px] md:text-xs tracking-widest uppercase font-bold transition-all duration-300 hover:shadow-glow"
              data-hover
            >
              View Work
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href="https://github.com/HannahTeng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 md:px-7 py-2.5 md:py-3 border border-edge text-mid font-mono text-[11px] md:text-xs tracking-widest uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
              data-hover
            >
              GitHub ↗
            </a>
          </Magnetic>
          <span className="hero-fade inline-flex items-center gap-2.5 md:ml-1 md:pl-4 md:border-l border-edge">
            <span className="w-1.5 h-1.5 rounded-full bg-accent live-dot" />
            <span className="label !text-mid">Available Aug 2026</span>
          </span>
        </div>

        {/* Portrait — flowmap distortion under a scanline reveal */}
        <div className="[grid-area:ph] justify-self-end self-center">
          <div
            ref={imgWrapRef}
            className="corners relative aspect-[221/296] w-[34vw] max-w-[150px] sm:max-w-[230px] md:w-auto md:max-w-none md:h-[70vh] border border-edge"
          >
            <ScanReveal onLoad className="w-full h-full">
              <FlowmapImage src="/hero.jpg" alt="Zihan (Hannah) Teng" className="w-full h-full" />
            </ScanReveal>
            {/* console frame chrome */}
            <div className="absolute -bottom-2.5 -right-2.5 w-full h-full border border-accent/25 -z-10" />
            <div className="absolute -bottom-6 left-0 font-mono text-[8px] tracking-[0.2em] uppercase text-dim hidden md:block">
              img://hero.jpg · 221×296 · flowmap:on
            </div>
          </div>
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
