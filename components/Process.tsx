'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import Button from '@/components/Button'
import Section from '@/components/Section'

type Text = { en: string; zh: string }
const T = (en: string, zh: string): Text => ({ en, zh })

// The path from this page to a working agent, in the order it happens.
const STEPS: { title: Text; line: Text }[] = [
  { title: T('Tell us the workflow.', '告诉我们你的流程。'), line: T('About 60 seconds: what takes time and which systems. Add a description and your website if you like.', '约 60 秒：哪些事占时间、用什么系统。愿意的话再写几句流程、留下公司网站。') },
  { title: T('Get a free assessment.', '拿到免费评估。'), line: T('Within one business day, in writing: the 2–3 jobs most worth automating and roughly what each would save.', '一个工作日内书面发给你：最值得自动化的 2–3 件事，以及每件大概能省多少。') },
  { title: T('Build it, at a fixed quote.', '按固定报价开工。'), line: T('The work starts only when you say yes, and you pay only if it passes acceptance.', '你点头才开工，验收通过才付钱。') },
]

/** The three illustrations: the form, the written assessment, the quote. One white card each, on the stage. */
function Art({ i, on, zh }: { i: number; on: boolean; zh: boolean }) {
  const t = (x: Text) => (zh ? x.zh : x.en)
  return (
    <div className="art" data-on={on} aria-hidden>
      {i === 0 && (
        <div className="art-card">
          <h4>{t(T('Your workflow', '你的流程'))}</h4>
          <p className="k">{t(T('What takes the time', '什么最花时间'))}</p>
          <div className="art-chips"><span data-on>{t(T('Invoices', '对账开票'))}</span><span>{t(T('Reports', '报表'))}</span><span data-on>{t(T('Customer replies', '客户回复'))}</span><span>{t(T('Scheduling', '排班'))}</span></div>
          <p className="k">{t(T('Systems', '用的系统'))}</p>
          <div className="art-chips"><span data-on>WMS</span><span data-on>{t(T('Email', '邮箱'))}</span><span>Sheets</span><span>QuickBooks</span></div>
          <div className="art-foot"><span>{t(T('Step 3 of 3 · About 60 seconds', '第 3/3 步 · 约 60 秒'))}</span><Button className="!h-9 !px-4 !text-[13px]" tabIndex={-1}>{t(T('Send', '发送'))}</Button></div>
        </div>
      )}
      {i === 1 && (
        <div className="art-card">
          <h4>{t(T('Assessment · Acme Logistics', '评估 · Acme 物流'))}</h4>
          <p className="k">{t(T('Most worth automating', '最值得自动化'))}</p>
          <div className="art-rows">
            <div><span>{t(T('Invoice matching', '发票对账'))}</span><b>{t(T('≈ 6 h / week', '≈ 6 小时/周'))}</b></div>
            <div><span>{t(T('Daily shipping report', '每日发货报表'))}</span><b>{t(T('≈ 3 h / week', '≈ 3 小时/周'))}</b></div>
            <div><span>{t(T('Customer status replies', '客户进度回复'))}</span><b>{t(T('≈ 4 h / week', '≈ 4 小时/周'))}</b></div>
          </div>
          <div className="art-foot"><span>{t(T('In writing, within one business day', '一个工作日内书面发出'))}</span><b>{t(T('Free', '免费'))}</b></div>
        </div>
      )}
      {i === 2 && (
        <div className="art-card">
          <h4>{t(T('Fixed quote', '固定报价'))}</h4>
          <p className="art-sum">$4,800 <small>{t(T('· 3 weeks', '· 3 周'))}</small></p>
          <div className="art-mini">
            <span>{t(T('Invoice-matching agent, inside your WMS', '发票对账 Agent，嵌在你的 WMS 里'))}</span>
            <span>{t(T('Acceptance: 50 real invoices, zero mismatches', '验收标准：50 张真实发票，零错配'))}</span>
          </div>
          <div className="art-foot">
            <span>{t(T('Work starts when you say yes', '你点头才开工'))}</span>
            <span className="flow-gate !relative !left-0 !top-0 !translate-x-0 !translate-y-0"><svg viewBox="0 0 16 16" aria-hidden><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{t(T('You approve', '你批准'))}</span></span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * How it works: the three steps scroll past on the left while the stage on the right stays put and shows the step
 * that is in view. Below the wide breakpoint each step carries its own illustration.
 */
export default function Process() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const t = (x: Text) => (zh ? x.zh : x.en)
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const items = Array.from(list.current?.children ?? []) as HTMLElement[]
    if (!items.length) return
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(items.indexOf(e.target as HTMLElement)) })
    }, { rootMargin: '-45% 0px -45% 0px' }) // whichever step crosses the middle of the viewport
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <Section id="how-it-works" aria-labelledby="process-heading">
      <h2 id="process-heading" className="h-section text-center">{zh ? '从一个流程，到一个上岗的 Agent。' : 'From one workflow to a working agent.'}</h2>
      <p className="lede mx-auto mt-3 max-w-[640px] text-center">
        {zh ? '从这一页到上线，只有三步。从一次免费评估开始。' : 'Three steps from this page to a working agent. It starts with a free assessment.'}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <ol ref={list} className="grid gap-8 lg:gap-0">
          {STEPS.map((s, i) => (
            <li key={s.title.en} className="grid gap-5 lg:min-h-[62vh] lg:content-center lg:py-10">
              <div className="lg:max-w-[440px]">
                <span className="text-[13px] text-subtle">0{i + 1}</span>
                <h3 className="h-card mt-2 !text-[28px]">{t(s.title)}</h3>
                <p className="lede mt-3 !text-[15.5px]">{t(s.line)}</p>
                {i === STEPS.length - 1 && (
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <OrderButton size="lg" />
                    <Button size="lg" variant="ghost" href="/build">{zh ? '方案与价格' : 'Agents and pricing'} <span aria-hidden className="btn-arrow">↗</span></Button>
                  </div>
                )}
              </div>
              <div className="stage min-h-[300px] lg:hidden"><Art i={i} on zh={zh} /></div>
            </li>
          ))}
        </ol>
        <div className="stage hidden lg:sticky lg:top-[112px] lg:block lg:h-[calc(100svh-150px)] lg:max-h-[720px]" aria-hidden>
          {STEPS.map((_, i) => <Art key={i} i={i} on={active === i} zh={zh} />)}
        </div>
      </div>
    </Section>
  )
}
