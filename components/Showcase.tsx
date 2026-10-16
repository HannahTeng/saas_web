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

// Phones get the exchange itself, in page type, instead of a shrunken window: the question, what the agent did, the answer.
type Transcript = { q: string; steps: string; a: string; rows?: [string, string][]; bars?: { label: string; items: [string, number][] } }
const TRANSCRIPTS: Record<'en' | 'zh', Record<Demo, Transcript>> = {
  en: {
    edc: { q: 'Which visits after week 12 are missing a lab date?', steps: 'Used the platform’s own filters: visit after week 12, lab date empty · opened each source record and its audit trail', a: 'Found the visits with no lab date and drafted the query for each site. The team decides what goes out.', rows: [['Filter', 'Visit > week 12, lab date empty'], ['Checked', 'Source record + audit trail'], ['Draft', 'Query to the site, for review']] },
    ja: { q: 'How much of the Christmas stock has arrived?', steps: 'Signed in · exported 30 days of inbound · reconciled 3 inbound types', a: '113,190 units shelved (15,577 cartons). Mostly in WH-USCA03 and WH-USCA01; both nearly done.', rows: [['Planned receipt', '113,987 units'], ['Received', '113,479 units'], ['Shelved (good)', '113,190 units'], ['Shelf rate', '99.75%']], bars: { label: 'Share of arrivals by warehouse', items: [['WH-USCA03', 74], ['WH-USCA01', 20], ['WH-USGA01', 4], ['WH-USNJ01', 2]] } },
    dp: { q: '27 containers arrived overnight. Plan the trucks.', steps: 'Signed in to the client’s system · packed each truck to 100 CBM · grouped by destination · exported to Excel', a: '4 trucks planned. Nothing is booked until you say yes.', rows: [['Trucks', '4'], ['Fill', '100 CBM each'], ['Status', 'Waiting for your approval']] },
  },
  zh: {
    edc: { q: '12 周之后哪些访视缺化验日期？', steps: '用平台自带筛选：访视晚于 12 周、化验日期为空 · 逐条打开原始记录和审计轨迹', a: '找到缺化验日期的访视，并为每个中心起草了质疑。发不发，由团队决定。', rows: [['筛选', '访视 > 12 周，化验日期为空'], ['核对', '原始记录 + 审计轨迹'], ['起草', '质疑函，待团队审阅']] },
    ja: { q: '圣诞备货到了多少？', steps: '登录系统 · 导出 30 天入库 · 核对 3 类入库', a: '已上架 113,190 件（15,577 箱），主要在 WH-USCA03 和 WH-USCA01，均接近完成。', rows: [['计划入库', '113,987 件'], ['实收', '113,479 件'], ['良品上架', '113,190 件'], ['上架率', '99.75%']], bars: { label: '各仓到货占比', items: [['WH-USCA03', 74], ['WH-USCA01', 20], ['WH-USGA01', 4], ['WH-USNJ01', 2]] } },
    dp: { q: '昨晚到了 27 个柜，安排整车。', steps: '登录客户系统 · 每车凑满 100 CBM · 按目的地分组 · 导出 Excel', a: '已规划 4 车。你确认之前不会约车。', rows: [['车次', '4'], ['装载', '每车 100 CBM'], ['状态', '等待你确认']] },
  },
}

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
  const transcript = TRANSCRIPTS[zh ? 'zh' : 'en'][CASES[active].demo]

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
              ? '同一个 Agent，按你团队的习惯交付：嵌在现有系统里、装成桌面应用，或直接在消息里对话。往下看它们干活，或在下面选一个。'
              : 'The same agent, delivered the way your team already works: inside the platform you use, as a desktop app, or in the messages you already send. Watch each one, or choose one below.'}
          </p>
        </div>
      </FadeIn>

      {/* The index: three ruled entries that select the scene. The open one is set in the primary text colour, the others in muted.
          Phones stack them as rows; wider screens set them as columns whose tags share one baseline. */}
      <div className="mt-10 grid gap-3 md:grid-cols-3 md:gap-6" role="tablist" aria-label={zh ? '交付形式' : 'Delivery forms'}>
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
              className="group grid cursor-pointer grid-cols-[2.5rem_1fr] items-baseline gap-x-2 gap-y-1 border-t border-line/[0.12] py-4 text-left transition-colors md:grid-cols-1 md:grid-rows-[auto_auto_1fr_auto] md:items-start md:gap-1.5 md:pb-0 md:pt-5"
            >
              <span className={`label-caps ${on ? 'text-primary' : 'text-subtle'}`}>0{i + 1}</span>
              <strong className={`text-base font-medium tracking-tight underline-offset-4 transition-colors group-hover:underline md:text-lg ${on ? 'text-primary' : 'text-muted group-hover:text-primary'}`}>{zh ? c.zh : c.en}</strong>
              <span className="col-start-2 text-sm leading-relaxed text-muted md:col-start-auto">{zh ? c.zhLine : c.enLine}</span>
              <span className="hidden text-xs text-subtle md:flex md:items-center md:justify-between md:gap-3">
                {zh ? c.zhTag : c.tag}
                {/* The entry is a control: say so on the ones not playing. */}
                {!on && <span className="shrink-0 transition-colors group-hover:text-primary">{zh ? '播放 →' : 'Play →'}</span>}
              </span>
            </button>
          )
        })}
      </div>

      {/* The animated stage plays from tablets up; it only runs while on screen, so it idles when hidden. */}
      <div ref={stage} className="uc mx-auto mt-10 hidden max-w-[960px] md:block" />

      <div className="card mt-6 grid gap-4 p-4 text-sm md:hidden" aria-live="polite">
        <p className="max-w-[88%] justify-self-end rounded-lg bg-accent/15 px-3 py-2 text-primary">{transcript.q}</p>
        <p className="text-xs leading-relaxed text-subtle">{transcript.steps}</p>
        <div>
          <p className="leading-relaxed text-primary">{transcript.a}</p>
          {transcript.rows && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-line/10 pt-3 text-xs">
              {transcript.rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-subtle">{k}</dt>
                  <dd className="text-copy">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {transcript.bars && (
            <div className="mt-3 border-t border-line/10 pt-3 text-xs">
              <p className="text-subtle">{transcript.bars.label}</p>
              <div className="mt-2 grid gap-1.5">
                {transcript.bars.items.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-2">
                    <span className="text-subtle">{k}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-line/10"><span className="block h-full rounded-full bg-accent" style={{ width: `${v}%` }} /></span>
                    <span className="text-right text-copy">{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
