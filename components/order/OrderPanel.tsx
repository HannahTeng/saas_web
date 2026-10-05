'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder } from './OrderProvider'
import { ADDON_AGENTS, CORE_AGENTS, PLANS } from '@/lib/catalog'
import { submitRequest } from '@/lib/submitRequest'

const inputCls = 'agent-input w-full rounded-xl border border-line/15 px-4 py-3 text-[15px] text-primary outline-none placeholder:text-subtle focus:border-accent'

/** The one order panel: pick agents and a plan, say a sentence, leave a contact. Opens over any page. */
export default function OrderPanel() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const { open, preset, closeOrder } = useOrder()
  const [agents, setAgents] = useState<string[]>([])
  const [plan, setPlan] = useState<string>('annual')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const [honey, setHoney] = useState('')
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    if (preset.agents) setAgents(preset.agents)
    if (preset.plan) setPlan(preset.plan)
    setStatus('idle'); setError('')
    window.setTimeout(() => panel.current?.querySelector<HTMLElement>('button, input')?.focus(), 50)
  }, [open, preset])

  const toggle = (id: string) => setAgents((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  const all = [...CORE_AGENTS, ...ADDON_AGENTS]
  const canSend = (agents.length > 0 || plan === 'scoping' || message.trim().length > 5) && contact.trim().length > 2 && status !== 'sending'

  async function send(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    const planName = PLANS.find((p) => p.id === plan)
    const err = await submitRequest({
      kind: plan === 'scoping' ? 'consultation' : 'quote',
      contact,
      message,
      modules: [...all.filter((a) => agents.includes(a.id)).map((a) => a.en), planName ? `Plan: ${planName.en}` : ''].filter(Boolean),
      website: honey,
    })
    if (err) { setError(zh ? '没有发送成功，请稍后重试，或发邮件到 support@flowact.net。' : err); setStatus('idle') } else { setError(''); setStatus('sent') }
  }

  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={closeOrder} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-line/10 bg-page shadow-[0_0_80px_rgba(0,0,0,.6)] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between border-b border-line/10 px-6 py-4">
          <h2 id="order-title" className="text-lg font-semibold tracking-tight">{zh ? '下单' : 'Order Flowact'}</h2>
          <button type="button" onClick={closeOrder} aria-label={zh ? '关闭' : 'Close'} className="grid h-9 w-9 place-items-center rounded-lg border border-line/15 text-muted hover:text-primary">×</button>
        </div>

        {status === 'sent' ? (
          <div className="grid flex-1 content-center gap-3 px-6" role="status">
            <h3 className="text-3xl font-medium tracking-tight">{zh ? '收到了。' : 'Got it.'}</h3>
            <p className="text-muted">{zh ? '一个工作日内回复实施方案和报价。有问题可以先写信到 support@flowact.net。' : 'A build plan and quote within one business day. Questions meanwhile: support@flowact.net'}</p>
            <button type="button" onClick={closeOrder} className="form-submit mt-4 justify-self-start rounded-lg px-5 py-3 text-sm font-semibold">{zh ? '关闭' : 'Done'}</button>
          </div>
        ) : (
          <form onSubmit={send} noValidate className="flex min-h-0 flex-1 flex-col">
            <input type="text" name="website" value={honey} onChange={(e) => setHoney(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <fieldset>
                <legend className="text-sm font-medium">{zh ? '1 · 选择 Agent' : '1 · Pick your agents'}</legend>
                <div className="mt-3 grid gap-2">
                  {CORE_AGENTS.map((a) => <Pick key={a.id} on={agents.includes(a.id)} onClick={() => toggle(a.id)} title={zh ? a.zh : a.en} line={zh ? a.zhLine : a.enLine} />)}
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-subtle">{zh ? '可加购' : 'Add-ons'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ADDON_AGENTS.map((a) => (
                    <button key={a.id} type="button" aria-pressed={agents.includes(a.id)} onClick={() => toggle(a.id)} className={`rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${agents.includes(a.id) ? 'border-accent text-primary' : 'border-line/15 text-muted hover:text-primary'}`}>{zh ? a.zh : a.en}</button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-7">
                <legend className="text-sm font-medium">{zh ? '2 · 合作方式' : '2 · Plan'}</legend>
                <div className="mt-3 grid gap-2">
                  {PLANS.map((p) => (
                    <button key={p.id} type="button" role="radio" aria-checked={plan === p.id} onClick={() => setPlan(p.id)} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${plan === p.id ? 'border-accent bg-panel' : 'border-line/15 hover:border-line/30'}`}>
                      <span><span className="block text-sm font-medium text-primary">{zh ? p.zh : p.en}</span><span className="block text-xs text-muted">{zh ? p.zhLine : p.enLine}</span></span>
                      <span className="shrink-0 text-xs text-subtle">{zh ? p.priceZh : p.priceEn}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-7 grid gap-2">
                <label htmlFor="order-msg" className="text-sm font-medium">{zh ? '3 · 一句话说说要做的事' : '3 · The job, in a sentence'} <span className="text-subtle">({zh ? '可选' : 'optional'})</span></label>
                <textarea id="order-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputCls} resize-y`} placeholder={zh ? '例如：每天早上从 OMP 拉昨天各仓出库，做成 PDF 发给我。' : 'e.g. Every morning, pull yesterday’s outbound by warehouse from our OMP and send me a PDF.'} />
              </div>

              <div className="mt-5 grid gap-2">
                <label htmlFor="order-contact" className="text-sm font-medium">{zh ? '方案发到哪里？' : 'Where should we send the plan?'}</label>
                <input id="order-contact" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" className={inputCls} placeholder={zh ? '工作邮箱或微信号' : 'Work email or WeChat ID'} />
              </div>
              {error && <p className="mt-3 text-sm text-[#E89A86]" role="alert">{error}</p>}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line/10 px-6 py-4">
              <p className="text-xs text-subtle">{zh ? '一个工作日内回复报价。不占股，不绑定。' : 'Quote within one business day. No commitment.'}</p>
              <button type="submit" disabled={!canSend} className="form-submit shrink-0 rounded-lg px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35">
                {status === 'sending' ? (zh ? '发送中…' : 'Sending…') : (zh ? '提交订单' : 'Send order')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Pick({ on, onClick, title, line }: { on: boolean; onClick: () => void; title: string; line: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${on ? 'border-accent bg-panel' : 'border-line/15 hover:border-line/30'}`}>
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${on ? 'border-accent bg-accent text-[#171614]' : 'border-line/25'}`} aria-hidden>
        {on && <svg width="12" height="12" viewBox="0 0 16 16"><path d="M3.5 8.4l3 3L12.5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <span><span className="block text-sm font-medium text-primary">{title}</span><span className="block text-xs text-muted">{line}</span></span>
    </button>
  )
}
