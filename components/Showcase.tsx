'use client'

import { useEffect, useRef, useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'
import { USE_CASES_HTML } from '@/components/UseCases/markup'
import { startShowcase } from '@/components/UseCases/engine'
import '@/components/UseCases/useCases.css'
import Section from '@/components/Section'
import { onTabKey } from '@/components/tabs'

// The scenes live in UseCases/markup.ts in this order; `demo` names one (#agent-panel-<demo>).
const SCENE_ORDER = ['ja', 'dp', 'edc'] as const
type Demo = (typeof SCENE_ORDER)[number]

type Case = { demo: Demo; en: string; zh: string; enLine: string; zhLine: string; tag: string; zhTag: string }

// The same agent, delivered three ways. Listed in the order they play.
const CASES: Case[] = [
  { demo: 'edc', en: 'Inside your system', zh: '嵌入现有系统', enLine: 'A panel inside the platform you already use. It filters, opens the source record and drafts the reply, right where the work is.', zhLine: '在你现有的平台里多出一个面板：筛选、打开原始记录、起草回复，都在原地完成。', tag: 'Embedded panel · EDC, ERP, CRM', zhTag: '嵌入面板 · EDC / ERP / CRM' },
  { demo: 'ja', en: 'As a desktop app', zh: '桌面应用', enLine: 'Ask in plain words. It signs in to your systems, pulls the data and answers with the number, the table and the chart.', zhLine: '一句话提问。它登录你的系统取数，用数字、表格和图表回答。', tag: 'Desktop assistant · saves PDFs', zhTag: '桌面助手 · 一键存 PDF' },
  { demo: 'dp', en: 'In iMessage', zh: '在 iMessage 里', enLine: 'Text it like a colleague. It does the work in the client’s system and asks before anything is booked.', zhLine: '像给同事发消息一样。它在客户系统里完成工作，约车前先问你。', tag: 'Messages · approval by reply', zhTag: '消息对话 · 回复即审批' },
]

/** One product section: three delivery forms over a single stage that plays the chosen one. */
export default function Showcase() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const stage = useRef<HTMLDivElement>(null)
  const ctl = useRef<{ select: (i: number) => void; destroy: () => void } | null>(null)
  const [active, setActive] = useState(0) // index into CASES

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

  const pick = (i: number) => { setActive(i); ctl.current?.select(SCENE_ORDER.indexOf(CASES[i].demo)) }

  useEffect(() => {
    stage.current?.querySelectorAll<HTMLElement>('[data-en]').forEach((el) => {
      el.textContent = (zh ? el.dataset.zh : el.dataset.en) ?? ''
    })
  }, [zh])

  return (
    <Section id="products">
      <FadeIn>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr] md:items-end md:gap-12">
          <div>
            <p className="section-kicker">{zh ? '交付形式' : 'How it reaches you'}</p>
            <h2 className="h-section mt-4">
              {zh ? <>三种入口，<br className="hidden lg:inline" />不用换系统。</> : <>Three ways in. <br className="hidden lg:inline" />No{' '}new system to{' '}learn.</>}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted md:text-base">
            {zh
              ? '同一个 Agent，嵌在现有系统里、装成桌面应用，或直接在消息里对话。'
              : 'The same agent, inside the platform you use, as a desktop app, or in your messages.'}
          </p>
        </div>
      </FadeIn>

      {/* Wide screens: the index on the left, a column of three ruled entries that select the scene, and the stage on the right.
          The open entry is set in the primary text colour, the others in muted.
          Below that: the three titles in one row, the open entry's line under them, then the stage at full width;
          on phones the stage's camera frames each panel whole (engine.ts). */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-0" role="tablist" aria-label={zh ? '交付形式' : 'Delivery forms'} aria-orientation="vertical">
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
                  className="group grid cursor-pointer gap-y-1 border-t border-line/[0.12] py-3 text-left transition-colors lg:grid-cols-[2.5rem_1fr] lg:items-baseline lg:gap-x-2 lg:py-5 lg:last:border-b"
                >
                  <span className={`label-caps hidden lg:block ${on ? 'text-primary' : 'text-subtle'}`}>0{i + 1}</span>
                  <strong className={`text-sm font-medium tracking-tight underline-offset-4 transition-colors group-hover:underline md:text-base lg:text-lg ${on ? 'text-primary' : 'text-muted group-hover:text-primary'}`}>{zh ? c.zh : c.en}</strong>
                  <span className="hidden text-sm leading-relaxed text-muted lg:col-start-2 lg:block">{zh ? c.zhLine : c.enLine}</span>
                  <span className="hidden text-xs text-subtle lg:col-start-2 lg:flex lg:items-center lg:justify-between lg:gap-3">
                    {zh ? c.zhTag : c.tag}
                    {/* The entry is a control: say so on the ones not playing. */}
                    {!on && <span className="shrink-0 transition-colors group-hover:text-primary">{zh ? '播放 →' : 'Play →'}</span>}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted lg:hidden">{zh ? CASES[active].zhLine : CASES[active].enLine}</p>
        </div>

        {/* The animated stage; it only runs while on screen, so it idles when scrolled away. */}
        <div ref={stage} className="uc" />
      </div>
    </Section>
  )
}
