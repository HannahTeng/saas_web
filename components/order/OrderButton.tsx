'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder, type OrderPreset } from './OrderProvider'

/** The site's one call to action. Same label, same panel, wherever it appears. */
export function OrderButton({ preset, variant = 'solid', className = '' }: { preset?: OrderPreset; variant?: 'solid' | 'ghost'; className?: string }) {
  const { language } = useLanguage()
  const { openOrder } = useOrder()
  const zh = language === 'zh'
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors'
  const look = variant === 'solid' ? 'form-submit' : 'border border-line/20 text-primary hover:border-accent'
  return (
    <button type="button" onClick={() => openOrder(preset)} className={`${base} ${look} ${className}`}>
      {zh ? '立即下单' : 'Order now'}
    </button>
  )
}

/** Phones: a slim bar that appears once the hero scrolls away, so the CTA is always one tap away. */
export function StickyOrderBar() {
  const { language } = useLanguage()
  const { openOrder, open } = useOrder()
  const zh = language === 'zh'
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) { setShow(true); return }
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting))
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  if (!show || open) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-page/90 px-4 py-3 backdrop-blur-xl md:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-muted">{zh ? '一个工作日内给报价' : 'Quote within one business day'}</p>
        <button type="button" onClick={() => openOrder()} className="form-submit shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold">{zh ? '立即下单' : 'Order now'}</button>
      </div>
    </div>
  )
}
