'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
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

type Case = { demo: Demo; tab: Text; short: Text; title: [Text, Text]; line: Text; tag: Text }

// The same agent, delivered four ways. Listed in the order of the tabs.
const CASES: Case[] = [
  {
    demo: 'edc',
    tab: { en: 'In your system', zh: '在现有系统里' }, short: { en: 'System', zh: '系统' },
    title: [{ en: 'Right where', zh: '就在工作' }, { en: 'the work is.', zh: '发生的地方。' }],
    line: { en: 'Find records, check the source and prepare a response inside the platform your team already uses.', zh: '在团队已经在用的平台里查记录、核对原始数据、起草回复。' },
    tag: { en: 'Embedded panel · EDC, ERP, CRM', zh: '嵌入面板 · EDC / ERP / CRM' },
  },
  {
    demo: 'ja',
    tab: { en: 'On your desktop', zh: '在桌面上' }, short: { en: 'Desktop', zh: '桌面' },
    title: [{ en: 'Ask once.', zh: '问一句，' }, { en: 'Get the whole picture.', zh: '拿到全貌。' }],
    line: { en: 'Ask in plain words. Your agent signs in to your systems, pulls the data and brings back the number, the table and the chart.', zh: '一句话提问。它登录你的系统取数，用数字、表格和图表回答。' },
    tag: { en: 'Desktop assistant · saves PDFs', zh: '桌面助手 · 一键存 PDF' },
  },
  {
    demo: 'dp',
    tab: { en: 'In your messages', zh: '在消息里' }, short: { en: 'Messages', zh: '消息' },
    title: [{ en: 'A message away.', zh: '发条消息就行，' }, { en: 'Always in the loop.', zh: '全程知情。' }],
    line: { en: 'Text your agent like a colleague. It works in your systems and asks before anything is booked.', zh: '像给同事发消息一样。它在你的系统里完成工作，约车前先问你。' },
    tag: { en: 'iMessage · approval by reply', zh: 'iMessage · 回复即审批' },
  },
  {
    demo: 'tc',
    tab: { en: 'In your team chat', zh: '在办公软件里' }, short: { en: 'Team chat', zh: '办公软件' },
    title: [{ en: 'Where your team', zh: '就在团队' }, { en: 'already talks.', zh: '每天用的群里。' }],
    line: { en: 'Mention it in a channel like any teammate. It answers in the thread with the data, and waits for an approval the whole channel can see.', zh: '像 @同事一样在群里 @它。它带着数据在群里回答，关键操作等一次全群可见的审批。' },
    tag: { en: 'Slack · Feishu · Teams', zh: 'Slack · 飞书 · Teams' },
  },
]

/** One product section: four delivery forms on one glass surface, with a single stage that plays the chosen one. */
export default function Showcase() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const t = (x: Text) => (zh ? x.zh : x.en)
  const stage = useRef<HTMLDivElement>(null)
  const ctl = useRef<{ select: (i: number) => void; pause: (on: boolean) => void; destroy: () => void } | null>(null)
  const [paused, setPaused] = useState(false)
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

  const pick = (i: number) => { setActive(i); setPaused(false); ctl.current?.pause(false); ctl.current?.select(SCENE_ORDER.indexOf(CASES[i].demo)) }
  const togglePause = () => { ctl.current?.pause(!paused); setPaused(!paused) }

  useEffect(() => {
    stage.current?.querySelectorAll<HTMLElement>('[data-en]').forEach((el) => {
      el.textContent = (zh ? el.dataset.zh : el.dataset.en) ?? ''
    })
  }, [zh])

  const now = CASES[active]

  return (
    <Section id="products" className="!pt-4" aria-labelledby="products-heading">
      <h2 id="products-heading" className="h-section text-center">{zh ? '看看 Agent 怎么工作。' : 'See your agent at work.'}</h2>
      <p className="lede mx-auto mt-3 max-w-[640px] text-center">
        {zh
          ? '在现有平台里、桌面上、消息里，或团队的办公软件里。不用学新系统。'
          : 'Inside your platform, on your desktop, in your messages or in your team chat. No new system to learn.'}
      </p>

      <div className="card arrive mt-6 p-[18px] sm:p-[23px]">
        {/* The tabs: a glass track with one lens that slides under the chosen form. */}
        <div
          className="glass tabs mx-auto"
          role="tablist"
          aria-label={zh ? '交付形式' : 'Agent delivery options'}
          style={{ '--tab-count': CASES.length, '--active-tab': active } as CSSProperties}
        >
          <span className="tab-lens" aria-hidden />
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
                aria-label={t(c.tab)}
                tabIndex={on ? 0 : -1}
                onClick={() => pick(i)}
                onKeyDown={(e) => onTabKey(e, i, CASES.length, pick)}
              >
                <span className="hidden sm:inline">{t(c.tab)}</span>
                <span className="sm:hidden">{t(c.short)}</span>
              </button>
            )
          })}
        </div>

        {/* Wide screens: the open form's story on the left, the stage on the right. Below that the story sits above the stage;
            on phones the stage's camera frames each panel whole (engine.ts). */}
        <div className="grid items-center gap-6 lg:grid-cols-[0.65fr_1.75fr] lg:gap-7">
          <div key={now.demo} className="story px-0.5 lg:px-2 lg:py-2">
            <h3>{t(now.title[0])} <br className="hidden lg:inline" />{t(now.title[1])}</h3>
            <p className="lede mt-3.5 max-w-[530px] lg:mt-[18px] lg:max-w-[300px]">{t(now.line)}</p>
            <p className="mt-4 text-[13px] text-subtle lg:mt-[22px]">{t(now.tag)}</p>
            <button type="button" onClick={togglePause} aria-pressed={paused} className="link-action mt-3 !text-[13px]">
              <svg aria-hidden width="11" height="11" viewBox="0 0 12 12" fill="currentColor">{paused ? <path d="M2.5 1.2v9.6L11 6z" /> : <path d="M2 1h3v10H2zM7 1h3v10H7z" />}</svg>{paused ? (zh ? '继续播放' : 'Play') : (zh ? '暂停' : 'Pause')}
            </button>
          </div>
          {/* The animated stage; it only runs while on screen, so it idles when scrolled away. */}
          <div ref={stage} className="uc min-w-0" />
        </div>
      </div>
      <p className="mt-4 text-center text-[13px] leading-relaxed text-subtle">
        {zh ? '以上为 Flowact 的产品演示示例。你的演示会照你自己的流程来做。' : 'Illustrative product walkthroughs from Flowact. Your demo is built around your own workflow.'}
      </p>
    </Section>
  )
}
