'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/anim'

/* ────────────────────────────────────────────────────────────────────────
   Telemetry — pinned scrollytelling "mission logs"
   ------------------------------------------------------------------------
   On desktop the section pins while scroll steps through three field
   results; each log crossfades in, its headline metric counts up, and a
   telemetry polyline draws itself across the whole pin (scrubbed). On
   mobile / reduced-motion the logs render as a compact stacked list with
   everything visible — no pin, fully readable.
   ──────────────────────────────────────────────────────────────────────── */

const LOGS = [
  {
    id: 'LOG_01',
    source: 'Wekruit · Marketing Data Analyst',
    metric: 85,
    suffix: '%',
    prefix: '+',
    metricLabel: 'user engagement',
    text: 'Designed A/B tests and ran cohort & funnel analysis in SQL and Python to locate drop-off — a 85% increase in user engagement.',
  },
  {
    id: 'LOG_02',
    source: 'UCLA · Medicare Part D Research',
    metric: 206,
    suffix: '×',
    prefix: '~',
    metricLabel: 'specialty vs. geography variance',
    text: 'Built hierarchical linear mixed models on 1 million Medicare Part D records — quantifying that prescriber specialty explains ~206× more oncology-drug cost variance than geography.',
  },
  {
    id: 'LOG_03',
    source: 'Sinotrans Limited (Fortune 500)',
    metric: 100000,
    suffix: '+',
    prefix: '',
    metricLabel: 'datasets centralized',
    text: 'Structured 100,000+ datasets into centralized data pools supporting an L2–L3 digital-transformation initiative; contributed operational dashboards for real-time inventory, delivery timelines, and cost.',
  },
]

const CHART_POINTS = '0,86 40,80 80,84 120,66 160,72 200,52 240,58 280,38 320,44 360,20 400,26 440,8'

export default function Telemetry() {
  const sectionRef = useRef<HTMLElement>(null)
  const polyRef = useRef<SVGPolylineElement>(null)

  useEffect(() => {
    const section = sectionRef.current!
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const logs = Array.from(section.querySelectorAll<HTMLElement>('.tel-log'))
      const nums = Array.from(section.querySelectorAll<HTMLElement>('.tel-num'))
      const dots = Array.from(section.querySelectorAll<HTMLElement>('.tel-dot'))
      const poly = polyRef.current

      // stack the logs for crossfading (mobile keeps them in flow)
      gsap.set(logs, { position: 'absolute', inset: 0, opacity: 0, y: 26 })
      gsap.set(logs[0], { opacity: 1, y: 0 })

      // polyline self-draw, scrubbed across the whole pin
      let len = 0
      if (poly) {
        len = poly.getTotalLength()
        poly.style.strokeDasharray = `${len}`
        poly.style.strokeDashoffset = `${len}`
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=240%',
          pin: true,
          scrub: 0.6,
        },
      })

      const setNum = (el: HTMLElement, v: number, log: (typeof LOGS)[number]) => {
        el.textContent = `${log.prefix}${Math.round(v).toLocaleString('en-US')}${log.suffix}`
      }

      LOGS.forEach((log, i) => {
        const at = i * 2 // each step spans 2 timeline "seconds"
        if (i > 0) {
          tl.to(logs[i - 1], { opacity: 0, y: -26, duration: 0.5 }, at)
          tl.to(logs[i], { opacity: 1, y: 0, duration: 0.5 }, at + 0.35)
        }
        // count the metric up over its step
        const counter = { v: 0 }
        tl.to(
          counter,
          {
            v: log.metric,
            duration: 1.1,
            ease: 'none',
            onUpdate: () => setNum(nums[i], counter.v, log),
          },
          at + (i === 0 ? 0 : 0.4),
        )
        // step indicator dots
        tl.to(dots[i], { backgroundColor: '#00E5FF', duration: 0.2 }, at + 0.4)
      })

      if (poly) tl.to(poly, { strokeDashoffset: 0, duration: 6, ease: 'none' }, 0)

      return () => {
        gsap.set(logs, { clearProps: 'all' })
        if (poly) poly.style.strokeDashoffset = '0'
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative px-6 py-14 md:py-0 md:min-h-svh md:flex md:items-center overflow-hidden">
      {/* evolving glow, no bg jump */}
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[55vw] h-[55vh] -z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8 md:mb-10 flex items-center justify-between flex-wrap gap-3">
          <p className="label">
            <span className="text-accent">//</span> Telemetry&nbsp;&nbsp;<span className="chip">[mission logs]</span>
          </p>
          <div className="flex items-center gap-2">
            {LOGS.map((l) => (
              <span key={l.id} className="tel-dot w-1.5 h-1.5 rounded-full bg-edge" />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          {/* logs — stacked on mobile, crossfading in place on desktop */}
          <div className="relative md:h-[340px] space-y-8 md:space-y-0">
            {LOGS.map((log, i) => (
              <div key={log.id} className="tel-log console-panel corners p-6 md:p-8 md:h-full md:flex md:flex-col md:justify-center">
                <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-accent mb-1">
                  {log.id} <span className="text-dim">· {log.source}</span>
                </p>
                <p className="tel-num font-mono font-medium text-5xl md:text-6xl text-fg leading-none mt-3">
                  {`${log.prefix}${log.metric.toLocaleString('en-US')}${log.suffix}`}
                </p>
                <p className="label !text-accent mt-2">{log.metricLabel}</p>
                <p className="font-display font-light text-mid text-sm md:text-[15px] leading-relaxed mt-4">
                  {log.text}
                </p>
              </div>
            ))}
          </div>

          {/* telemetry chart — polyline draws itself with scroll */}
          <div className="console-panel p-5 md:p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="label">signal://impact-over-time</span>
              <span className="font-mono text-[9px] text-accent">▲ live</span>
            </div>
            <svg viewBox="0 0 440 96" className="w-full h-auto" aria-hidden>
              {/* gridlines */}
              {[0, 24, 48, 72, 96].map((y) => (
                <line key={y} x1="0" y1={y} x2="440" y2={y} stroke="#1B222C" strokeWidth="1" />
              ))}
              <polyline
                ref={polyRef}
                points={CHART_POINTS}
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.6))' }}
              />
              {CHART_POINTS.split(' ').map((p) => {
                const [x, y] = p.split(',').map(Number)
                return <circle key={p} cx={x} cy={y} r="1.8" fill="#00E5FF" opacity="0.7" />
              })}
            </svg>
            <div className="flex justify-between mt-2 font-mono text-[8px] tracking-[0.18em] uppercase text-dim">
              <span>2024</span>
              <span>2025</span>
              <span>2026 →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
