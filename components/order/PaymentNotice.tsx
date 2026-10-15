'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'

/** Shown after Stripe sends the customer back (?paid=1 or ?paid=0). */
export function PaymentNotice() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const [state, setState] = useState<'paid' | 'cancelled' | null>(null)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('paid')
    if (p === '1') setState('paid')
    else if (p === '0') setState('cancelled')
  }, [])

  if (!state) return null
  const close = () => {
    setState(null)
    const u = new URL(window.location.href)
    u.searchParams.delete('paid'); u.searchParams.delete('order')
    window.history.replaceState(null, '', u.toString())
  }
  return (
    <div role="status" className="fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-4" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
      <div className="flex max-w-xl items-start gap-4 rounded-xl border border-line/15 bg-panel px-5 py-4 shadow-panel">
        <p className="text-sm text-primary">
          {state === 'paid'
            ? (zh ? '付款成功，订单已收到。我们会在一个工作日内联系你约 60 分钟的通话。' : 'Payment received and your order is in. We will reach out within one business day to schedule the 60-minute call.')
            : (zh ? '付款没有完成，但你的需求我们已经收到，会通过你留的联系方式跟进。' : 'Payment was not completed, but we have your request and will follow up at the contact you left.')}
        </p>
        <button type="button" onClick={close} aria-label={zh ? '关闭' : 'Close'} className="shrink-0 text-muted hover:text-primary">×</button>
      </div>
    </div>
  )
}
