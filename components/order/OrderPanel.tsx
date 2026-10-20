'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder } from './OrderProvider'
import { ADDON_AGENTS, CORE_AGENTS, PLANS } from '@/lib/catalog'
import { submitRequest } from '@/lib/submitRequest'
import { DAILY_ORDERS, PAINS, WAREHOUSES, WMS } from '@/lib/check'

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

type Step = 1 | 2 | 3

/** A row of choice chips; `multi` toggles several, otherwise one (tapping the chosen one clears it). */
function Chips({ options, value, onChange, multi = false, zh }: { options: readonly { id: string; en: string; zh: string }[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean; zh: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.id)
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(multi ? (on ? value.filter((v) => v !== o.id) : [...value, o.id]) : on ? [] : [o.id])}
            className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${on ? 'border-accent bg-accent text-accent-ink' : 'border-line/20 text-muted hover:border-accent hover:text-primary'}`}
          >
            {zh ? o.zh : o.en}
          </button>
        )
      })}
    </div>
  )
}

/**
 * The one entry panel: a free workflow check. Three short steps, mostly taps: what takes the team's time, which
 * systems and volume, and where to send the result. Free, no card, no call; we reply in writing within a business day.
 */
export default function OrderPanel() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const { open, preset, closeOrder } = useOrder()
  const [step, setStep] = useState<Step>(1)
  const [context, setContext] = useState<string[]>([])
  const [pains, setPains] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [wms, setWms] = useState<string[]>([])
  const [wmsOther, setWmsOther] = useState('')
  const [orders, setOrders] = useState<string[]>([])
  const [warehouses, setWarehouses] = useState<string[]>([])
  const [contact, setContact] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [replyIn, setReplyIn] = useState<'zh' | 'en'>(zh ? 'zh' : 'en')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
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
    setStatus('idle'); setError(''); setTried(false); setStep(1); setReplyIn(zh ? 'zh' : 'en')
    // A sentence typed on the page comes in as the note.
    if (preset.message) setNote(preset.message)
    window.setTimeout(() => panel.current?.querySelector<HTMLElement>('[aria-pressed]')?.focus(), 50)
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

  const contactOk = /@/.test(contact) || /^[A-Za-z][\w-]{3,}$/.test(contact.trim()) || (contact.match(/\d/g) ?? []).length >= 7
  const answered = pains.length > 0 || note.trim().length >= 3 || wms.length > 0
  const answerError = !answered ? (zh ? '请至少选一件最占时间的事，或写一句话。' : 'Pick at least one thing that takes time, or write a sentence.') : ''
  const contactError = !contactOk ? (zh ? '请留下邮箱、电话或微信号。' : 'Leave an email, phone number or WeChat ID.') : ''
  const busy = status === 'sending'

  // Move between steps without a reload; focus lands on the new step's first control for keyboard and screen readers.
  function go(to: Step) {
    setStep(to)
    setError('')
    window.setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-step-start]')?.focus(), 30)
  }

  async function send(e: FormEvent) {
    e.preventDefault()
    if (step < 3) return go((step + 1) as Step)
    setTried(true)
    if (answerError) { setError(answerError); return }
    if (contactError || busy) return
    setStatus('sending')
    const { error: err } = await submitRequest({
      kind: 'check',
      contact,
      name: name || undefined,
      company: company || undefined,
      message: note,
      modules: context.length ? [`Interested in: ${context.join(', ')}`] : [],
      profile: { pains, wms: wms[0], wms_other: wms[0] === 'other' ? wmsOther : undefined, daily_orders: orders[0], warehouses: warehouses[0], language: replyIn },
      website: honey,
    })
    if (err) { setError(zh ? '没有发送成功，请稍后重试，或发邮件到 support@flowact.net。' : err); setStatus('idle'); return }
    setError('')
    setStatus('sent')
  }

  const label = 'text-sm font-medium'
  const hint = 'text-xs text-subtle'
  const STEP_TITLES = zh ? ['哪些事最占时间', '你们用什么系统', '结果发到哪里'] : ['What takes time', 'Your systems', 'Where to send it']

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
          <div>
            <h2 id="order-title" className="h-card">{zh ? '免费流程体检' : 'Free workflow check'}</h2>
            {status !== 'sent' && (
              <p className="mt-1 text-xs text-subtle" aria-live="polite">
                {zh ? `第 ${step}/3 步 · ${STEP_TITLES[step - 1]} · 约 60 秒，不收费` : `Step ${step} of 3 · ${STEP_TITLES[step - 1]} · About 60 seconds, free`}
              </p>
            )}
          </div>
          <button type="button" onClick={closeOrder} aria-label={zh ? '关闭' : 'Close'} className="grid h-10 w-10 place-items-center rounded-lg border border-line/20 text-muted transition-colors hover:border-accent hover:text-primary">×</button>
        </div>
        {status !== 'sent' && (
          <div className="grid grid-cols-3 gap-1.5 px-6 pt-4" aria-hidden>
            {[1, 2, 3].map((n) => <span key={n} className={`h-1 rounded-full ${n <= step ? 'bg-accent' : 'bg-line/15'}`} />)}
          </div>
        )}

        {status === 'sent' ? (
          <div className="grid flex-1 content-center gap-3 px-6" role="status">
            <h3 className="text-3xl font-medium tracking-tight">{zh ? '收到了。' : 'Got it.'}</h3>
            <p className="text-muted">
              {zh
                ? '我们会在一个工作日内把体检结果发给你：你们仓库最值得自动化的 2–3 件事，以及每件大概能省多少时间。'
                : 'Within one business day we will send your check result: the 2–3 jobs most worth automating in your warehouse, and roughly how much time each would save.'}
            </p>
            <p className="text-sm text-subtle">{zh ? '试点按你们仓库单独报价，验收不过不付钱。' : 'Pilots are quoted per warehouse. If one does not pass acceptance, you do not pay.'}</p>
            <Button className="mt-4 justify-self-start" onClick={closeOrder}>{zh ? '关闭' : 'Done'}</Button>
          </div>
        ) : (
          <form onSubmit={send} noValidate className="flex min-h-0 flex-1 flex-col">
            <input type="text" name="website" value={honey} onChange={(e) => setHoney(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {step === 1 && (
                <div className="grid gap-5">
                  {context.length > 0 && (
                    <p className="flex flex-wrap items-center gap-2 text-xs text-subtle">
                      {zh ? '你在看：' : 'You were looking at:'}
                      {context.map((c) => <span key={c} className="rounded-full border border-line/20 px-2.5 py-0.5 text-muted">{c}</span>)}
                      <button type="button" onClick={() => setContext([])} className="underline underline-offset-2 hover:text-primary">{zh ? '清除' : 'clear'}</button>
                    </p>
                  )}
                  <fieldset className="grid gap-3">
                    <legend className={`${label} mb-3`} data-step-start tabIndex={-1}>{zh ? '哪些事最占你们团队的时间？（可多选）' : 'What takes your team the most time? (pick any)'}</legend>
                    <Chips options={PAINS} value={pains} onChange={setPains} multi zh={zh} />
                  </fieldset>
                  <div className="grid gap-2">
                    <label htmlFor="check-note" className={label}>{zh ? '想多说一句吗？（选填）' : 'Anything to add? (optional)'}</label>
                    <textarea id="check-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="field resize-y" placeholder={zh ? '例如：每天早上有人花 2 小时从 WMS 导出库单，再做成表发给卖家。' : 'e.g. Every morning someone spends two hours exporting outbound orders from the WMS and building a sheet for sellers.'} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-6">
                  <fieldset className="grid gap-3">
                    <legend className={`${label} mb-3`} data-step-start tabIndex={-1}>{zh ? '你们用什么 WMS / OMS？' : 'Which WMS / OMS do you use?'}</legend>
                    <Chips options={WMS} value={wms} onChange={setWms} zh={zh} />
                    {wms[0] === 'other' && (
                      <input aria-label={zh ? '系统名称' : 'System name'} value={wmsOther} onChange={(e) => setWmsOther(e.target.value)} className="field" placeholder={zh ? '系统名称' : 'System name'} />
                    )}
                  </fieldset>
                  <fieldset className="grid gap-3">
                    <legend className={`${label} mb-3`}>{zh ? '每天大约多少单？' : 'Roughly how many orders a day?'}</legend>
                    <Chips options={DAILY_ORDERS} value={orders} onChange={setOrders} zh={zh} />
                  </fieldset>
                  <fieldset className="grid gap-3">
                    <legend className={`${label} mb-3`}>{zh ? '几个仓？' : 'How many warehouses?'}</legend>
                    <Chips options={WAREHOUSES} value={warehouses} onChange={setWarehouses} zh={zh} />
                  </fieldset>
                  <p className={hint}>{zh ? '不确定也没关系，可以跳过。' : 'Not sure? Skip any of these.'}</p>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <label htmlFor="order-contact" className={label} data-step-start tabIndex={-1}>{zh ? '结果发到哪里？' : 'Where should we send the result?'}</label>
                    <input id="order-contact" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" className="field" placeholder={zh ? '工作邮箱、电话或微信号' : 'Work email, phone or WeChat ID'} />
                    {tried && contactError && <p className="text-xs text-danger" role="alert">{contactError}</p>}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="check-name" className={label}>{zh ? '称呼（选填）' : 'Your name (optional)'}</label>
                      <input id="check-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="field" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="check-company" className={label}>{zh ? '公司（选填）' : 'Company (optional)'}</label>
                      <input id="check-company" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" className="field" />
                    </div>
                  </div>
                  <fieldset className="grid gap-3">
                    <legend className={`${label} mb-3`}>{zh ? '用哪种语言回复你？' : 'Reply in'}</legend>
                    <Chips options={[{ id: 'zh', en: '中文', zh: '中文' }, { id: 'en', en: 'English', zh: 'English' }]} value={[replyIn]} onChange={(v) => v[0] && setReplyIn(v[0] as 'zh' | 'en')} zh={zh} />
                  </fieldset>
                  <p className={hint}>{zh ? '不收费、不用绑卡、不用约电话。这些信息只用来给你回复。' : 'Free. No card, no call. We use this only to reply to you.'}</p>
                </div>
              )}
              {error && <p className="mt-4 text-sm text-danger" role="alert">{error}</p>}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line/10 px-6 py-4">
              {step > 1 ? (
                <button type="button" onClick={() => go((step - 1) as Step)} className="text-sm text-muted underline underline-offset-4 hover:text-primary">{zh ? '← 上一步' : '← Back'}</button>
              ) : (
                <button type="button" onClick={() => go(3)} className="text-sm text-muted underline underline-offset-4 hover:text-primary">{zh ? '跳过，直接留联系方式' : 'Skip to contact'}</button>
              )}
              <Button type="submit" disabled={busy} aria-disabled={busy}>
                {step < 3 ? (zh ? '下一步' : 'Next') : busy ? (zh ? '发送中…' : 'Sending…') : zh ? '获取免费体检' : 'Get my free check'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
