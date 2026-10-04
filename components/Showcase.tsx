'use client'

import { useEffect, useRef, useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'
import { USE_CASES_HTML } from '@/components/UseCases/markup'
import { startShowcase } from '@/components/UseCases/engine'
import '@/components/UseCases/useCases.css'

const CASES = [
  { title: 'Data Agent', zhTitle: '数据 Agent', line: 'One question in. Numbers, a chart and a PDF out.', zhLine: '一句话提问，返回数字、图表和 PDF。', live: 'overseas warehouse', zhLive: '海外仓' },
  { title: 'Dispatch Agent', zhTitle: '调度 Agent', line: '27 containers in. Four full trucks, booked on a yes.', zhLine: '27 个到货柜，凑成 4 辆整车，确认后才约车。', live: 'trucking company', zhLive: '卡派车队' },
  { title: 'Knowledge Agent', zhTitle: '知识 Agent', line: 'Plain-English questions. Answers cited to the record.', zhLine: '自然语言提问，答案引用到原始记录。', live: 'clinical research team', zhLive: '临床研究团队' },
]

/** One product section: three case cards over a single stage that autoplays each agent in turn. */
export default function Showcase() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const stage = useRef<HTMLDivElement>(null)
  const ctl = useRef<{ select: (i: number) => void; destroy: () => void } | null>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    el.innerHTML = USE_CASES_HTML // React never manages these children; the engine animates them.
    ctl.current = startShowcase(el, { onActive: setActive, onProgress: setProgress })
    return () => ctl.current?.destroy()
  }, [])

  const pick = (i: number) => ctl.current?.select(i)

  return (
    <section id="products" className="scroll-mt-16 border-b border-line/[0.07] px-4 py-14 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12">
            <div>
              <p className="section-kicker">{zh ? '产品 · 已在客户处上线' : 'Products · live at clients'}</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">
                {zh ? <>三个 Agent，<em className="em-accent">已经在干活</em>。</> : <>Three agents, <em className="em-accent">already at work</em>.</>}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted md:text-base">
              {zh
                ? '每个 Agent 都在客户自己的系统里运行，关键决策等人确认。往下看它们干活，或直接选一个。'
                : 'Each one runs inside the client’s own systems and waits for a person on every decision that matters. Watch them work, or pick one.'}
            </p>
          </div>
        </FadeIn>

        <div className="mt-9 grid grid-cols-3 gap-2 md:gap-3" role="tablist" aria-label={zh ? 'Agent 案例' : 'Agent cases'}>
          {CASES.map((c, i) => {
            const on = active === i
            return (
              <button
                key={c.title}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => pick(i)}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
                  const n = (i + (e.key === 'ArrowRight' ? 1 : CASES.length - 1)) % CASES.length
                  ;(e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus()
                  pick(n)
                }}
                className={`relative grid content-start gap-1.5 overflow-hidden rounded-2xl border p-3 text-left transition-colors md:p-5 ${
                  on ? 'border-accent/45 bg-panel' : 'border-line/10 hover:border-line/25'
                }`}
              >
                <span className="absolute inset-x-0 top-0 h-0.5" aria-hidden>
                  <span className="block h-full bg-accent transition-[width] duration-500 ease-out" style={{ width: on ? `${progress * 100}%` : '0%' }} />
                </span>
                <span className="hidden text-xs tracking-wide text-subtle md:block">0{i + 1}</span>
                <strong className="text-sm font-semibold tracking-tight text-primary md:text-lg">{zh ? c.zhTitle : c.title}</strong>
                <span className="hidden text-sm leading-relaxed text-muted md:block">{zh ? c.zhLine : c.line}</span>
                <span className="mt-1 hidden items-center gap-1.5 text-xs text-subtle md:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6FBF73]" aria-hidden />
                  {zh ? `已上线 · ${c.zhLive}` : `Live · ${c.live}`}
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-sm text-muted md:hidden">{zh ? CASES[active].zhLine : CASES[active].line}</p>

        <div ref={stage} className="uc mt-4" />

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line/10 pt-6 md:flex-row md:items-center">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">
            <span className="font-medium text-primary">{zh ? '同一个平台：' : 'One platform underneath: '}</span>
            {zh
              ? '连接 OMP、WMS、ERP 和邮箱 · 共享知识层 · 审批节点 · 操作留痕 · 云端或私有部署。年度授权或按月托管。'
              : 'connectors to OMP, WMS, ERP and email · shared knowledge · approval checkpoints · audit trail · cloud or self-hosted. Annual license or monthly managed plan.'}
          </p>
          <a href="/build" className="form-submit shrink-0 rounded-lg px-5 py-3 text-sm font-semibold">{zh ? '获取报价 →' : 'Get pricing →'}</a>
        </div>
      </div>
    </section>
  )
}
