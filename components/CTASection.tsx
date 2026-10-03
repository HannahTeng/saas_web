'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'
import { submitRequest } from '@/lib/submitRequest'

const EXAMPLES = [
  { en: 'Warehouse data Q&A', zh: '仓库问数', text: 'Answer questions about our warehouse data in one sentence, with numbers, charts and a PDF.' },
  { en: 'Truck dispatch', zh: '卡派调度', text: 'Pack our arrived containers into full trucks in our ERP and text me for approval.' },
  { en: 'Customs emails', zh: '报关邮件', text: 'Find customer emails, attach the right customs documents and draft replies for my approval.' },
  { en: 'Clinical data QC', zh: '临床数据核查', text: 'Let our data team ask plain-English questions about study data, with record-level sources.' },
]

const STEPS = [
  { en: 'Tell us the job', zh: '一句话说清任务' },
  { en: 'Build path and quote within one business day', zh: '一个工作日内给出方案与报价' },
  { en: 'Live inside the tools you already use', zh: '在你现有的工具里上线' },
  { en: 'Annual license or monthly managed plan', zh: '年度授权或按月托管' },
]

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function CTASection() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const [job, setJob] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const contactRef = useRef<HTMLInputElement>(null)
  const showContact = job.trim().length > 5

  useEffect(() => {
    const onPrefill = (e: Event) => {
      setJob((e as CustomEvent<string>).detail)
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.setTimeout(() => contactRef.current?.focus({ preventScroll: true }), 700)
    }
    window.addEventListener('flowact:prefill', onPrefill)
    return () => window.removeEventListener('flowact:prefill', onPrefill)
  }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!/@|^[A-Za-z][\w-]{3,}$/.test(contact.trim())) {
      setError(zh ? '请填写邮箱或微信号，方便我们回复。' : 'Enter a work email or WeChat ID so we can reply.')
      contactRef.current?.focus()
      return
    }
    setError('')
    setStatus('sending')
    const err = await submitRequest({ kind: 'brief', contact, message: job })
    if (err) {
      setStatus('error')
      setError(zh ? '没有发送成功，请稍后重试，或直接发邮件到 support@flowact.net。' : err)
    } else setStatus('sent')
  }

  return (
    <section id="contact" className="relative px-4 py-14 sm:px-6 md:py-32 scroll-mt-16">
      <FadeIn>
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-line/10 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5 bg-panel p-7 md:p-12">
            <p className="text-sm text-muted">{zh ? '从一个真正有用的任务开始' : 'Start with one useful job'}</p>
            <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
              {zh ? <>你的 Agent 应该<em className="em-accent">做</em>什么？</> : <>What should your agent <em className="em-accent">do</em>?</>}
            </h2>
            <p className="max-w-md text-muted">
              {zh ? '一句话描述任务即可，我们回复实施路径和报价。不用填表，也不用先约电话。' : 'Describe the job in a sentence. We come back with a build path and a quote. No forms, no sales call needed.'}
            </p>
            <a href="/build" className="group mt-2 flex items-center justify-between gap-4 rounded-2xl border border-line/15 p-4 transition-colors hover:border-accent">
              <span>
                <span className="block font-medium text-primary">{zh ? '自己搭一个 Agent' : 'Build your agent'}</span>
                <span className="mt-0.5 block text-sm text-muted">{zh ? '$19.90/小时咨询，或选模块获取报价' : '$19.90/h consultation, or pick modules for a quote'}</span>
              </span>
              <span className="text-xl text-accent transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </a>
            <ol className="mt-auto grid gap-2 pt-6 text-sm text-muted">
              {STEPS.map((s, i) => (
                <li key={s.en} className="flex gap-3"><span className="w-6 text-accent">0{i + 1}</span>{zh ? s.zh : s.en}</li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-4 border-t border-line/10 bg-[#121211] p-7 md:border-l md:border-t-0 md:p-12">
            {status === 'sent' ? (
              <div className="grid min-h-[260px] content-center gap-3" role="status">
                <h3 className="text-3xl font-medium tracking-tight">{zh ? '收到了。' : 'Got it.'}</h3>
                <p className="text-muted">
                  {zh ? '一个工作日内给你实施路径和报价。有问题可以先写信到 support@flowact.net。' : 'Expect a build path and a quote within one business day. Questions in the meantime: support@flowact.net'}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-4">
                <label htmlFor="job" className="text-sm font-medium">{zh ? '描述你的任务' : 'Describe the job'}</label>
                <textarea
                  id="job"
                  name="job"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  rows={4}
                  className="agent-input w-full resize-y rounded-xl border border-line/15 bg-[#0B0B0A] px-4 py-3 text-[15px] text-primary outline-none placeholder:text-subtle focus:border-accent"
                  placeholder={zh ? '例如：每天早上从 OMP 拉昨天各仓出库，做成 PDF 发给我。' : 'e.g. Every morning, pull yesterday’s outbound by warehouse from our OMP and send me a PDF.'}
                />
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex.en}
                      type="button"
                      onClick={() => { setJob(ex.text); window.setTimeout(() => contactRef.current?.focus(), 0) }}
                      className="rounded-lg border border-line/15 px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-accent hover:text-primary"
                    >
                      {zh ? ex.zh : ex.en}
                    </button>
                  ))}
                </div>
                {showContact && (
                  <div className="grid gap-2">
                    <label htmlFor="reply" className="text-sm font-medium">{zh ? '方案发到哪里？' : 'Where should we send the build path?'}</label>
                    <input
                      ref={contactRef}
                      id="reply"
                      name="contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      autoComplete="email"
                      className="agent-input w-full rounded-xl border border-line/15 bg-[#0B0B0A] px-4 py-3 text-[15px] text-primary outline-none placeholder:text-subtle focus:border-accent"
                      placeholder={zh ? '工作邮箱或微信号' : 'Work email or WeChat ID'}
                    />
                  </div>
                )}
                {error && <p className="text-sm text-[#E89A86]" role="alert">{error}</p>}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <small className="text-[13px] text-subtle">{zh ? '仅用于评估你的需求。' : 'Used only to scope your build.'}</small>
                  <button
                    type="submit"
                    disabled={!showContact || contact.trim().length < 3 || status === 'sending'}
                    className="rounded-lg bg-accent px-5 py-3 text-[15px] font-semibold text-[#171614] transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {status === 'sending' ? (zh ? '发送中…' : 'Sending…') : (zh ? '发送给 Flowact' : 'Send to Flowact')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
