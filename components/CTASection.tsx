'use client'

import { useEffect, useRef } from 'react'
import { OrderButton } from '@/components/order/OrderButton'
import { useLanguage } from '@/components/LanguageProvider'

const LINES = 7

/** One slow field of lines behind the closing card: seven sines a little apart, drifting while the card is on screen. */
function drawLines(paths: SVGPathElement[], t: number) {
  paths.forEach((p, i) => {
    let d = ''
    for (let j = 0; j <= 70; j++) {
      const u = j / 70
      d += `${j ? 'L' : 'M'}${(-30 + 1070 * u).toFixed(1)},${(175 + Math.sin(u * 6.2 - t * 0.18 + i * 0.06) * 88 + (i - 3) * 14).toFixed(1)}`
    }
    p.setAttribute('d', d)
  })
}

/** The close: one glass card, the statement and the one button on the centre axis. */
export default function CTASection() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = svg.current
    if (!el) return
    const paths = Array.from(el.querySelectorAll('path'))
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, seen = false, clock = 0, last = 0, painted = 0
    drawLines(paths, 0)
    const tick = (now: number) => {
      frame = 0
      if (!seen) return
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      if (!still.matches && document.body.dataset.motion !== 'paused') {
        clock += dt
        if (now - painted > 1000 / 30) { drawLines(paths, clock); painted = now }
      }
      frame = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; last = 0; if (seen && !frame) frame = requestAnimationFrame(tick) }, { rootMargin: '100px' })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
  }, [])

  return (
    <section id="contact" className="px-6 pb-16 pt-2.5 sm:px-10 lg:px-14">
      <div className="card arrive closing mx-auto max-w-[1120px] overflow-hidden px-6 py-10 md:py-14">
        <svg ref={svg} viewBox="0 0 1000 330" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: LINES }, (_, i) => <path key={i} />)}
        </svg>
        <div className="relative flex flex-col items-center text-center">
          <h2 className="text-[28px] font-[430] leading-[1.22] tracking-[-0.036em] sm:text-[40px]">
            {zh ? <>把重复的工作<em className="em-accent">交出去。</em></> : <>Hand off the <em className="em-accent">repetition.</em></>}
          </h2>
          <p className="lede mt-3 sm:mt-4">
            {zh ? '$39，换一个跑在你自己流程上的演示，外加完整应用的报价。' : '$39 gets you a working demo on your own workflow, and a quote for the full app.'}
          </p>
          <OrderButton size="lg" className="mt-6" />
        </div>
      </div>
    </section>
  )
}
