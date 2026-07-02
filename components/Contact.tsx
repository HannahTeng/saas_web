'use client'

import Decode from '@/components/ui/Decode'
import Reveal from '@/components/ui/Reveal'
import Magnetic from '@/components/ui/Magnetic'

export default function Contact() {
  return (
    <section id="contact" className="relative pt-10 md:pt-14 pb-16 md:pb-20 px-6 overflow-hidden">
      {/* strongest glow of the page — the console "powers up" at the end */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[70vh] -z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.10) 0%, transparent 65%)' }}
      />
      <div className="max-w-6xl mx-auto">
        <p className="label mb-6">
          <span className="text-accent">05 /</span> Contact&nbsp;&nbsp;<span className="chip">[channel open]</span>
        </p>

        <Decode
          as="h2"
          text="Let’s build something."
          className="font-display font-medium text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95] mb-8"
        />

        <Reveal index={1}>
          <p className="font-display font-light text-mid text-lg max-w-xl leading-relaxed mb-10">
            Open to full-time data science, forward-deployed, and AI-product roles from August 2026 —
            plus research collaborations at the intersection of health and AI.
          </p>
        </Reveal>

        <Reveal index={2}>
          <a
            href="mailto:hannahteng777@gmail.com"
            data-hover
            className="group inline-flex items-center gap-3 font-mono font-medium text-xl sm:text-3xl md:text-4xl text-fg hover:text-accent transition-colors duration-300"
          >
            <span className="text-accent">&gt;</span> hannahteng777@gmail.com
            <svg
              className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </Reveal>

        <Reveal index={3}>
          <div className="flex flex-wrap items-center gap-3 mt-12">
            {[
              { label: 'GitHub ↗', href: 'https://github.com/HannahTeng' },
              { label: 'Email ↗', href: 'mailto:hannahteng777@gmail.com' },
            ].map((s) => (
              <Magnetic key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  data-hover
                  className="inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-mid border border-edge px-5 py-2.5 hover:border-accent hover:text-accent hover:shadow-glowSm transition-all duration-300"
                >
                  {s.label}
                </a>
              </Magnetic>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-16 pt-8 border-t border-edge">
          <p className="label">© 2026 Zihan (Hannah) Teng</p>
          <p className="label">Next.js · Three.js · GSAP · Tailwind</p>
        </div>
      </div>
    </section>
  )
}
