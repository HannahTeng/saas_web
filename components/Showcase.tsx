'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { USE_CASES_HTML } from '@/components/UseCases/markup'
import { startShowcase } from '@/components/UseCases/engine'
import '@/components/UseCases/useCases.css'
import Section from '@/components/Section'
import { onTabKey } from '@/components/tabs'

// The scenes live in UseCases/markup.ts in this order; `demo` names one (#agent-panel-<demo>).
const SCENE_ORDER = ['ja', 'dp', 'edc', 'tc'] as const
type Demo = (typeof SCENE_ORDER)[number]
type Text = { en: string; zh: string }

type Case = { demo: Demo; tab: Text; title: [Text, Text]; line: Text; tag: Text }

// The same agent, delivered four ways. Listed in the order of the menu.
const CASES: Case[] = [
  {
    demo: 'edc',
    tab: { en: 'In your system', zh: '在现有系统里' },
    title: [{ en: 'Right where', zh: '就在工作' }, { en: 'the work is.', zh: '发生的地方。' }],
    line: { en: 'Find records, check the source and prepare a response inside the platform your team already uses.', zh: '在团队已经在用的平台里查记录、核对原始数据、起草回复。' },
    tag: { en: 'Embedded panel · EDC, ERP, CRM', zh: '嵌入面板 · EDC / ERP / CRM' },
  },
  {
    demo: 'ja',
    tab: { en: 'On your desktop', zh: '在桌面上' },
    title: [{ en: 'Ask once.', zh: '问一句，' }, { en: 'Get the whole picture.', zh: '拿到全貌。' }],
    line: { en: 'Ask in plain words. Your agent signs in to your systems, pulls the data and brings back the number, the table and the chart.', zh: '一句话提问。它登录你的系统取数，用数字、表格和图表回答。' },
    tag: { en: 'Desktop assistant · saves PDFs', zh: '桌面助手 · 一键存 PDF' },
  },
  {
    demo: 'dp',
    tab: { en: 'In your messages', zh: '在消息里' },
    title: [{ en: 'A message away.', zh: '发条消息就行，' }, { en: 'Always in the loop.', zh: '全程知情。' }],
    line: { en: 'Text your agent like a colleague. It works in your systems and asks before anything is booked.', zh: '像给同事发消息一样。它在你的系统里完成工作，约车前先问你。' },
    tag: { en: 'iMessage · approval by reply', zh: 'iMessage · 回复即审批' },
  },
  {
    demo: 'tc',
    tab: { en: 'In your team chat', zh: '在办公软件里' },
    title: [{ en: 'Where your team', zh: '就在团队' }, { en: 'already talks.', zh: '每天用的群里。' }],
    line: { en: 'Mention it in a channel like any teammate. It answers in the thread with the data, and waits for an approval the whole channel can see.', zh: '像 @同事一样在群里 @它。它带着数据在群里回答，关键操作等一次全群可见的审批。' },
    tag: { en: 'Slack · Feishu · Teams', zh: 'Slack · 飞书 · Teams' },
  },
]

const WIDE = '(min-width: 1024px)'

/**
 * One product section. On wide screens it pins: the stage with its menu on the left, the scene on the right, and the
 * page's scroll through the tall wrapper picks the case (a click scrolls there). Below that it is a plain stack.
 */
export default function Showcase() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const t = (x: Text) => (zh ? x.zh : x.en)
  const stage = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const ctl = useRef<{ select: (i: number) => void; destroy: () => void } | null>(null)
  const [active, setActive] = useState(0) // index into CASES
  const shown = useRef(0) // what the scroll position last chose

  useEffect(() => {
    const el = stage.current
    if (!el) return
    el.innerHTML = USE_CASES_HTML // React never manages these children; the engine animates them.
    ctl.current = startShowcase(el, {
      start: SCENE_ORDER.indexOf(CASES[0].demo),
      onActive: (scene: number) => setActive(CASES.findIndex((c) => c.demo === SCENE_ORDER[scene])),
    })
    return () => ctl.current?.destroy()
  }, [])

  // Where the wrapper's travel puts case i: its share of the scroll, just past the boundary.
  const placeOf = (i: number) => {
    const box = wrap.current
    if (!box) return 0
    const r = box.getBoundingClientRect(), travel = r.height - window.innerHeight
    return window.scrollY + r.top + (travel * i) / CASES.length + 2
  }

  const pick = (i: number) => {
    setActive(i)
    ctl.current?.select(SCENE_ORDER.indexOf(CASES[i].demo))
    if (window.matchMedia(WIDE).matches) { shown.current = i; window.scrollTo({ top: placeOf(i), behavior: 'smooth' }) }
  }

  // Wide screens: the scroll through the wrapper chooses the case.
  useEffect(() => {
    const box = wrap.current
    if (!box) return
    const wide = window.matchMedia(WIDE)
    let frame = 0
    const read = () => {
      frame = 0
      if (!wide.matches) return
      const r = box.getBoundingClientRect(), travel = r.height - window.innerHeight
      if (travel <= 0 || r.top > 0 || r.bottom < window.innerHeight) return // not pinned right now
      const i = Math.min(CASES.length - 1, Math.floor((-r.top / travel) * CASES.length))
      if (i !== shown.current) { shown.current = i; setActive(i); ctl.current?.select(SCENE_ORDER.indexOf(CASES[i].demo)) }
    }
    const kick = () => { if (!frame) frame = requestAnimationFrame(read) }
    window.addEventListener('scroll', kick, { passive: true })
    return () => { window.removeEventListener('scroll', kick); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    stage.current?.querySelectorAll<HTMLElement>('[data-en]').forEach((el) => {
      el.textContent = (zh ? el.dataset.zh : el.dataset.en) ?? ''
    })
  }, [zh])

  const now = CASES[active]

  return (
    <Section id="products" className="!pt-4 !pb-0" aria-labelledby="products-heading">
      <h2 id="products-heading" className="h-section text-center">{zh ? '看看 Agent 怎么工作。' : 'See your agent at work.'}</h2>
      <p className="lede mx-auto mt-3 max-w-[640px] text-center">
        {zh
          ? '在现有平台里、桌面上、消息里，或团队的办公软件里。不用学新系统。'
          : 'Inside your platform, on your desktop, in your messages or in your team chat. No new system to learn.'}
      </p>

      {/* The tall wrapper gives the pinned screen its scroll; one viewport per case, plus the one it stays on. */}
      <div ref={wrap} className="mt-8 lg:h-[380vh]">
        <div className="grid gap-4 lg:sticky lg:top-[96px] lg:h-[calc(100svh-112px)] lg:grid-cols-[360px_1fr] lg:gap-5">
          <div className="stage flex flex-col justify-between gap-6 p-6 lg:p-7">
            <div key={now.demo} className="story">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/55">{String(active + 1).padStart(2, '0')} / 0{CASES.length} · {zh ? '交付形式' : 'Delivery'}</p>
              <h3 className="mt-4 text-white">{t(now.title[0])} <br className="hidden lg:inline" />{t(now.title[1])}</h3>
              <p className="lede mt-3 !text-[15px] !text-white/70">{t(now.line)}</p>
              <p className="mt-3 text-[13px] text-white/50">{t(now.tag)}</p>
            </div>
            <div className="stage-menu" role="tablist" aria-label={zh ? '交付形式' : 'Agent delivery options'}>
              {CASES.map((c, i) => {
                const on = active === i
                return (
                  <button
                    key={c.demo}
                    type="button"
                    role="tab"
                    id={`agent-tab-${c.demo}`}
                    aria-controls={`agent-panel-${c.demo}`}
                    aria-selected={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => pick(i)}
                    onKeyDown={(e) => onTabKey(e, i, CASES.length, pick)}
                  >
                    {t(c.tab)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* The animated stage in a white frame; it only runs while on screen, so it idles when scrolled away. */}
          <div className="card arrive flex min-w-0 items-center p-[14px] sm:p-[18px]">
            <div ref={stage} className="uc min-w-0 flex-1" />
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[13px] leading-relaxed text-subtle">
        {zh ? '以上为 Flowact 的产品演示示例。你的 Agent 会照你自己的流程来做。' : 'Illustrative product walkthroughs from Flowact. Your agent is built around your own workflow.'}
      </p>
    </Section>
  )
}
