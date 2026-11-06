'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import Section from '@/components/Section'

// The path from this page to a working agent, in the order it happens.
const STEPS = [
  { en: 'Tell us the workflow.', zh: '告诉我们你的流程。', enLine: 'About 60 seconds: what takes time and which systems. Add a description and your website if you like.', zhLine: '约 60 秒：哪些事占时间、用什么系统。愿意的话再写几句流程、留下公司网站。' },
  { en: 'Get a free assessment.', zh: '拿到免费评估。', enLine: 'Within one business day, in writing: the 2–3 jobs most worth automating and roughly what each would save.', zhLine: '一个工作日内书面发给你：最值得自动化的 2–3 件事，以及每件大概能省多少。' },
  { en: 'Build it, at a fixed quote.', zh: '按固定报价开工。', enLine: 'The work starts only when you say yes, and you pay only if it passes acceptance.', zhLine: '你点头才开工，验收通过才付钱。' },
]

// The same curve twice: a faint track, and a line that draws along it as the section scrolls in. The sculpture (FlowRing) unrolls onto it.
const ROUTE = 'M35 97 C140 97 205 27 330 27 S465 126 585 126 S790 43 900 43 S1040 77 1115 77'

/** How it works: the three steps under one route line, then the action. */
export default function Process() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const route = useRef<HTMLDivElement>(null)
  const line = useRef<SVGPathElement>(null)

  useEffect(() => {
    const box = route.current, path = line.current
    if (!box || !path) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let progress = 0, frame = 0, seen = false
    const step = () => {
      frame = 0
      if (still.matches) { path.style.strokeDashoffset = '0'; return }
      const target = Math.max(0, Math.min(1, (window.innerHeight * 0.9 - box.getBoundingClientRect().top) / (window.innerHeight * 0.65)))
      progress += (target - progress) * 0.2
      path.style.strokeDashoffset = String(1000 * (1 - progress))
      if (seen && Math.abs(target - progress) > 0.001) frame = requestAnimationFrame(step)
    }
    const kick = () => { if (seen && !frame) frame = requestAnimationFrame(step) }
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; kick() }, { rootMargin: '100px' })
    io.observe(box)
    window.addEventListener('scroll', kick, { passive: true })
    still.addEventListener('change', kick)
    step()
    return () => { io.disconnect(); window.removeEventListener('scroll', kick); still.removeEventListener('change', kick); cancelAnimationFrame(frame) }
  }, [])

  return (
    <Section id="how-it-works" aria-labelledby="process-heading">
      <h2 id="process-heading" className="h-section text-center">{zh ? '从一个流程，到一个上岗的 Agent。' : 'From one workflow to a working agent.'}</h2>
      <p className="lede mx-auto mt-3 max-w-[640px] text-center">
        {zh ? '从这一页到上线，只有三步。从一次免费评估开始。' : 'Three steps from this page to a working agent. It starts with a free assessment.'}
      </p>
      <div ref={route} id="process-route" className="process-route">
        <svg viewBox="0 0 1150 155" aria-hidden>
          <path className="route-track" d={ROUTE} />
          <path ref={line} className="route-line" pathLength={1000} d={ROUTE} />
        </svg>
      </div>
      <ol className="grid gap-6 sm:grid-cols-3 sm:gap-11 sm:text-center">
        {STEPS.map((s, i) => (
          <li key={s.en} className="grid grid-cols-[30px_1fr] items-baseline gap-x-3 sm:block">
            <span className="text-[13px] text-subtle">0{i + 1}</span>
            <h3 className="h-card sm:mt-[13px]">{zh ? s.zh : s.en}</h3>
            <p className="lede col-start-2 mt-2 max-w-[310px] !text-sm sm:mx-auto sm:mt-3">{zh ? s.zhLine : s.enLine}</p>
          </li>
        ))}
      </ol>
      <div className="mt-9 flex flex-col items-center gap-4">
        <OrderButton size="lg" />
        <a className="link-action" href="/build">{zh ? '各类 Agent 和方案价格' : 'Explore agents and pricing'} <span aria-hidden>↗</span></a>
      </div>
    </Section>
  )
}
