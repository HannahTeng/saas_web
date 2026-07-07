'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Decode from '@/components/ui/Decode'
import Reveal from '@/components/ui/Reveal'
import { gsap } from '@/lib/anim'
import { projects, type Project } from '@/lib/projects'

/* ────────────────────────────────────────────────────────────────────────
   Projects
   • Mobile: compact 2 × 2 grid (2 cards per row) — per layout rules.
   • Desktop (motion on): horizontal-scroll rail — the section pins and
     vertical scroll drives the four case-file cards sideways.
   Cards route to /work/[slug] case-file pages (animated route transition).
   ──────────────────────────────────────────────────────────────────────── */

function Card({ p, compact = false }: { p: Project; compact?: boolean }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      data-hover
      className={`group relative block console-panel h-full hover:border-accent/50 transition-all duration-500 hover:-translate-y-1 ${
        compact ? 'p-4' : 'p-8 md:p-9'
      }`}
    >
      <div className={`flex items-start justify-between ${compact ? 'mb-3' : 'mb-6'}`}>
        <span className="font-mono text-xs text-dim">
          <span className="text-accent">{'>'}</span> {p.no}
        </span>
        {p.highlight && !compact && <span className="chip">{p.highlight}</span>}
      </div>

      <h3
        className={`font-display font-medium text-fg group-hover:text-accent transition-colors duration-300 leading-tight ${
          compact ? 'text-base' : 'text-2xl md:text-3xl'
        }`}
      >
        {p.title}
      </h3>
      <p className={`font-mono uppercase tracking-[0.12em] text-dim ${compact ? 'text-[8px] mt-1.5' : 'text-[11px] mt-2'}`}>
        {p.subtitle}
      </p>

      <p
        className={`font-display font-light text-mid leading-relaxed ${
          compact ? 'text-[11px] mt-3 line-clamp-4' : 'text-sm mt-5 mb-7'
        }`}
      >
        {p.description}
      </p>

      {!compact && (
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <span key={tag} className="label border border-edge bg-white/50 px-2.5 py-1 group-hover:border-accent/30 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      )}

      <span
        className={`absolute font-mono text-dim opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-300 ${
          compact ? 'top-4 right-4 text-[10px]' : 'top-8 right-8 md:top-9 md:right-9 text-xs'
        }`}
      >
        open →
      </span>
    </Link>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current
      const rail = railRef.current
      if (!section || !rail) return

      const getX = () => -(rail.scrollWidth - window.innerWidth)
      const tween = gsap.to(rail, {
        x: getX,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${rail.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(rail, { clearProps: 'x' })
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className="relative py-14 md:py-0 md:min-h-svh md:flex md:flex-col md:justify-center overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 right-1/4 w-[40vw] h-[50vh] -z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(120deg, transparent, rgba(75,134,165,0.08) 70%, transparent)' }}
      />

      <div className="max-w-6xl mx-auto w-full px-6 mb-8 md:mb-10">
        <p className="label mb-5">
          <span className="text-accent">02 /</span> Proof&nbsp;&nbsp;<span className="chip">[case files: 4]</span>
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <Decode
            as="h2"
            text="Agents already at work"
            className="font-display font-medium text-3xl md:text-5xl text-fg tracking-tight"
          />
          <span className="hidden md:inline label !text-dim">scroll → the rail drives sideways</span>
        </div>
      </div>

      {/* Mobile: 2 × 2 compact grid */}
      <div className="md:hidden px-6">
        <div className="grid grid-cols-2 gap-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} index={i % 2}>
              <Card p={p} compact />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Desktop: horizontal rail (vertical scroll → sideways travel) */}
      <div className="hidden md:block">
        <div ref={railRef} className="flex gap-6 w-max pl-[max(1.5rem,calc((100vw-72rem)/2))] pr-24">
          {projects.map((p) => (
            <div key={p.slug} className="w-[440px] lg:w-[480px] shrink-0">
              <Card p={p} />
            </div>
          ))}
          {/* end-of-stream marker */}
          <div className="flex items-center pr-6">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-dim whitespace-nowrap">
              [eof] — end of stream<span className="caret text-accent">▌</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
