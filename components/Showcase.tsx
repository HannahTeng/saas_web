'use client'

import { useEffect, useRef, useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'
import { USE_CASES_HTML } from '@/components/UseCases/markup'
import { startShowcase } from '@/components/UseCases/engine'
import '@/components/UseCases/useCases.css'
import { OrderButton } from '@/components/order/OrderButton'
import Section from '@/components/Section'
import { onTabKey } from '@/components/tabs'

// `demo` names the scene in UseCases/markup.ts; the tab points at that scene's panel (#agent-panel-<demo>).
const CASES = [
  { id: 'data-agent', demo: 'ja', title: 'Data Agent', zhTitle: '数据分析 Agent', line: 'Ask in plain words. Get the numbers, a chart and a report.', zhLine: '一句话提问，直接拿到数字、图表和报告。', tag: 'Pull · reconcile · chart', zhTag: '取数 · 核对 · 出图' },
  { id: 'dispatch-agent', demo: 'dp', title: 'Workflow Agent', zhTitle: '流程执行 Agent', line: 'Signs in, does the repetitive work, acts only on your yes.', zhLine: '登录系统完成重复操作，你确认后才执行。', tag: 'Multi-step tasks · approval', zhTag: '多步操作 · 人工审批' },
  { id: 'knowledge-agent', demo: 'edc', title: 'Knowledge Agent', zhTitle: '知识问答 Agent', line: 'Answers from your own records, every claim cited.', zhLine: '基于你自己的资料回答，每句都有出处。', tag: 'Search · cite · draft', zhTag: '检索 · 引用 · 起草' },
]

/** One product section: three agent functions over a single stage that autoplays each agent in turn. */
export default function Showcase() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const stage = useRef<HTMLDivElement>(null)
  const ctl = useRef<{ select: (i: number) => void; destroy: () => void } | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    el.innerHTML = USE_CASES_HTML // React never manages these children; the engine animates them.
    ctl.current = startShowcase(el, { onActive: setActive })
    return () => ctl.current?.destroy()
  }, [])

  const pick = (i: number) => ctl.current?.select(i)

  useEffect(() => {
    stage.current?.querySelectorAll<HTMLElement>('[data-en]').forEach((el) => {
      el.textContent = (zh ? el.dataset.zh : el.dataset.en) ?? ''
    })
  }, [zh])

  return (
    <Section id="products">
      <FadeIn>
        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12">
          <div>
            <p className="section-kicker">{zh ? 'Agent 能做什么' : 'What our agents do'}</p>
            <h2 className="h-section mt-4">
              {zh ? <>分析、执行、问答，<br className="hidden lg:inline" /><em className="em-accent">都在你自己的系统里</em>。</> : <>Analyze, act, answer. <br className="hidden lg:inline" /><em className="em-accent">Inside your own systems</em>.</>}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted md:text-base">
            {zh
              ? '不分行业，按工作类型配置：每个 Agent 直接接入你现有的系统，关键决策等人确认。往下看它们干活，或直接选一个。'
              : 'Built around the job, not the industry. Each agent works through the systems you already use and waits for a person on every decision that matters. Watch them work, or pick one.'}
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
              id={`agent-tab-${c.demo}`}
              aria-controls={`agent-panel-${c.demo}`}
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => pick(i)}
              onKeyDown={(e) => onTabKey(e, i, CASES.length, pick)}
              className={`card grid content-start gap-1.5 p-3 text-left transition-colors md:p-5 ${on ? 'border-accent/50' : 'bg-transparent hover:border-line/20'}`}
            >
              <span className="label-caps hidden text-subtle md:block">0{i + 1}</span>
              <strong className="text-sm font-medium tracking-tight text-primary md:text-lg">{zh ? c.zhTitle : c.title}</strong>
              <span className="hidden text-sm leading-relaxed text-muted md:block">{zh ? c.zhLine : c.line}</span>
              <span className="mt-1 hidden text-xs text-subtle md:block">{zh ? c.zhTag : c.tag}</span>
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
            ? '连接你现有的业务系统、数据库和邮箱 · 共享知识层 · 审批节点 · 操作留痕 · 云端或私有部署。年度授权或按月代运营。'
            : 'connectors to your existing business systems, databases and email · shared knowledge · approval checkpoints · audit trail · cloud or self-hosted. Annual license or monthly managed plan.'}
        </p>
        <OrderButton preset={{ agents: [CASES[active].id] }} className="shrink-0" />
      </div>
    </Section>
  )
}
