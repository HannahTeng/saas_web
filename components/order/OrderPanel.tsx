'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder } from './OrderProvider'
import { ADDON_AGENTS, CORE_AGENTS, PLANS } from '@/lib/catalog'
import { submitRequest, startScopingCheckout } from '@/lib/submitRequest'

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

/** The one order panel: say what you need, leave a contact, we book a $39 scoping call. No agent or plan picking up front. */
export default function OrderPanel() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const { open, preset, closeOrder } = useOrder()
  const [context, setContext] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'paying' | 'sent'>('idle')
  const [tried, setTried] = useState(false)
  const [error, setError] = useState('')
  const [honey, setHoney] = useState('')
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    // A button deeper in the page (an agent card, a plan) still passes what the visitor was looking at, as context only.
    const all = [...CORE_AGENTS, ...ADDON_AGENTS]
    const names = (preset.agents ?? []).map((id) => all.find((a) => a.id === id)).filter(Boolean).map((a) => (zh ? a!.zh : a!.en))
    const plan = PLANS.find((p) => p.id === preset.plan)
    setContext([...names, ...(plan ? [zh ? plan.zh : plan.en] : [])])
    setStatus('idle'); setError(''); setTried(false)
    window.setTimeout(() => panel.current?.querySelector<HTMLElement>('textarea')?.focus(), 50)
  }, [open, preset, zh])

  // Modal focus: Tab cycles inside the panel while it is open, and focus returns to the button that opened it on close.
  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      const root = panel.current
      if (e.key !== 'Tab' || !root) return
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0], last = items[items.length - 1], inside = root.contains(document.activeElement)
      if (e.shiftKey ? document.activeElement === first || !inside : document.activeElement === last || !inside) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener.current?.focus()
    }
  }, [open])

  // Never silently disable the button: validate on click and say exactly what is missing.
  const contactOk = /@/.test(contact) || /^[A-Za-z][\w-]{3,}$/.test(contact.trim()) || (contact.match(/\d/g) ?? []).length >= 7
  const msgError = message.trim().length < 3 ? (zh ? '请用一句话描述要做的事。' : 'Describe the job in a few words.') : ''
  const contactError = !contactOk ? (zh ? '请留下邮箱、电话或微信号。' : 'Leave an email, phone number or WeChat ID.') : ''
  const busy = status === 'sending' || status === 'paying'

  async function send(e: FormEvent) {
    e.preventDefault()
    setTried(true)
    if (msgError || contactError || busy) return
    setStatus('sending')
    const { error: err, id } = await submitRequest({ kind: 'consultation', contact, message, modules: context.length ? [`Interested in: ${context.join(', ')}`] : [], website: honey })
    if (err) { setError(zh ? '没有发送成功，请稍后重试，或发邮件到 support@flowact.net。' : err); setStatus('idle'); return }
    setError('')
    // The order is already with support@flowact.net. Now take the $39 payment through Stripe, if configured.
    setStatus('paying')
    const url = id ? await startScopingCheckout(id, contact) : null
    if (url) { window.location.assign(url); return }
    setStatus('sent')
  }

  return (
    // `invisible` lands at the end of the slide-out, so the closed panel is out of the tab order and the accessibility tree.
    <div className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${open ? 'visible' : 'invisible pointer-events-none'}`}>
      <div onClick={closeOrder} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-line/10 bg-page shadow-panel transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between border-b border-line/10 px-6 py-4">
          <h2 id="order-title" className="h-card">{zh ? '预约范围界定通话' : 'Book a scoping call'}</h2>
          <button type="button" onClick={closeOrder} aria-label={zh ? '关闭' : 'Close'} className="grid h-10 w-10 place-items-center rounded-lg border border-line/20 text-muted transition-colors hover:border-accent hover:text-primary">×</button>
        </div>

        {status === 'sent' ? (
          <div className="grid flex-1 content-center gap-3 px-6" role="status">
            <h3 className="text-3xl font-medium tracking-tight">{zh ? '收到了。' : 'Got it.'}</h3>
            <p className="text-muted">{zh ? '我们会在一个工作日内联系你，约 60 分钟的范围界定通话（$39）。通话后给出方案和固定报价。' : 'We will reach out within one business day to set up a 60-minute scoping call ($39). You get a plan and a fixed quote after it.'}</p>
            <Button className="mt-4 justify-self-start" onClick={closeOrder}>{zh ? '关闭' : 'Done'}</Button>
          </div>
        ) : (
          <form onSubmit={send} noValidate className="flex min-h-0 flex-1 flex-col">
            <input type="text" name="website" value={honey} onChange={(e) => setHoney(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <ol className="mb-6 grid gap-2 rounded-lg border border-line/10 bg-panel px-4 py-3 text-sm text-muted">
                <li><span className="text-primary">1.</span> {zh ? '一句话说说要自动化的事，留个联系方式' : 'Tell us the job in a sentence and leave a contact'}</li>
                <li><span className="text-primary">2.</span> {zh ? '60 分钟范围界定通话（$39），一起梳理流程和系统' : '60-minute scoping call ($39) to map the workflow and systems'}</li>
                <li><span className="text-primary">3.</span> {zh ? '拿到方案和固定报价，再决定要不要做' : 'Get a plan and a fixed quote, then decide'}</li>
              </ol>

              {context.length > 0 && (
                <p className="mb-4 flex flex-wrap items-center gap-2 text-xs text-subtle">
                  {zh ? '你在看：' : 'You were looking at:'}
                  {context.map((c) => <span key={c} className="rounded-full border border-line/20 px-2.5 py-0.5 text-muted">{c}</span>)}
                  <button type="button" onClick={() => setContext([])} className="underline underline-offset-2 hover:text-primary">{zh ? '清除' : 'clear'}</button>
                </p>
              )}

              <div className="grid gap-2">
                <label htmlFor="order-msg" className="text-sm font-medium">{zh ? '你想让 Agent 做什么？' : 'What should the agent do?'}</label>
                <textarea id="order-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" placeholder={zh ? '例如：每天早上从 OMP 拉昨天各仓出库，做成 PDF 发给我。' : 'e.g. Every morning, pull yesterday’s outbound by warehouse from our OMP and send me a PDF.'} />
                {tried && msgError ? <p className="text-xs text-danger" role="alert">{msgError}</p> : <p className="text-xs text-subtle">{zh ? '一句话就够，不用懂技术。' : 'One sentence is enough. No technical detail needed.'}</p>}
              </div>

              <div className="mt-5 grid gap-2">
                <label htmlFor="order-contact" className="text-sm font-medium">{zh ? '怎么联系你？' : 'How do we reach you?'}</label>
                <input id="order-contact" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" className="field" placeholder={zh ? '工作邮箱、电话或微信号' : 'Work email, phone or WeChat ID'} />
                {tried && contactError && <p className="text-xs text-danger" role="alert">{contactError}</p>}
              </div>
              {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line/10 px-6 py-4">
              <p className="text-xs text-subtle">{zh ? '一个工作日内约时间并发送 $39 账单。' : 'We schedule within one business day and send a $39 invoice.'}</p>
              <Button type="submit" disabled={busy} aria-disabled={busy}>
                {status === 'sending' ? (zh ? '发送中…' : 'Sending…') : status === 'paying' ? (zh ? '前往付款…' : 'Opening payment…') : (zh ? '预约通话 · $39' : 'Book the call · $39')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
