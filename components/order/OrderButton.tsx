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

/**
 * Follows the reader once the hero scrolls away; hides again at the closing CTA (#contact) and while the order panel is open.
 * Every desktop variant lives in the empty margin beside the 1152px content column, so it never sits on content:
 * - ≥1680px: a small card (sized to the margin).
 * - 1280–1679px: a slim vertical tab on the right edge (the margin is 64–264px there).
 * - <1280px (tablets, phones, no margin): the bottom bar, with a spacer at the end of the page so nothing ends under it.
 */
export function StickyOrderBar() {
  const { language } = useLanguage()
  const { openOrder, open } = useOrder()
  const zh = language === 'zh'
  const [pastHero, setPastHero] = useState(false)
  const [atClose, setAtClose] = useState(false)
  const [overBleed, setOverBleed] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const close = document.getElementById('contact')
    const ios: IntersectionObserver[] = []
    if (hero) {
      const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting))
      io.observe(hero)
      ios.push(io)
    } else setPastHero(true)
    if (close) {
      // From the closing CTA to the end of the page (FAQ, footer), the page's own button is enough.
      const io = new IntersectionObserver(([e]) => setAtClose(e.isIntersecting || e.boundingClientRect.top < 0), { rootMargin: '0px 0px -20% 0px' })
      io.observe(close)
      ios.push(io)
    }
    // Edge-to-edge strips (the testimonial carousel) have no margin to sit in, so step aside while one is on screen.
    const bleeds = Array.from(document.querySelectorAll('[data-full-bleed]'))
    if (bleeds.length) {
      const seen = new Set<Element>()
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
        setOverBleed(seen.size > 0)
      })
      bleeds.forEach((el) => io.observe(el))
      ios.push(io)
    }
    return () => ios.forEach((io) => io.disconnect())
  }, [])

  const show = pastHero && !atClose && !open
  const showSide = show && !overBleed
  const label = zh ? '立即下单' : 'Order now'

  return (
    <>
      {/* wide screens: margin card */}
      <aside
        aria-label={zh ? '下单' : 'Order'}
        className={`fixed bottom-8 right-8 z-40 hidden flex-col gap-4 rounded-2xl border border-line/10 bg-panel/90 p-5 backdrop-blur-xl transition-all duration-300 min-[1680px]:flex ${showSide ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
        style={{ width: 'min(300px, calc((100vw - 1152px) / 2 - 64px))' }}
      >
        <p className="text-[15px] font-medium leading-snug text-primary">{zh ? '把重复的工作交出去。' : 'Hand off the repetition.'}</p>
        <ul className="space-y-1.5 text-[13px] leading-snug text-muted">
          <li>{zh ? '$39 · 60 分钟范围界定通话' : '$39 · 60-min scoping call'}</li>
          <li>{zh ? '通话后给固定报价' : 'Fixed quote after the call'}</li>
          <li>{zh ? '一个工作日内回复' : 'Reply within one business day'}</li>
        </ul>
        <button type="button" onClick={() => openOrder()} className="form-submit w-full rounded-lg px-4 py-2.5 text-sm font-semibold">{label}</button>
      </aside>

      {/* laptops: vertical tab in the right margin */}
      <button
        type="button"
        onClick={() => openOrder()}
        tabIndex={showSide ? 0 : -1}
        aria-hidden={!showSide}
        className={`form-submit fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 rounded-full px-2.5 py-5 text-sm font-semibold transition-opacity duration-300 [writing-mode:vertical-rl] min-[1280px]:block min-[1680px]:hidden ${showSide ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {label}
      </button>

      {/* tablets and phones: bottom bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-page/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 min-[1280px]:hidden ${show ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        aria-hidden={!show}
      >
        <div className="mx-auto flex max-w-[1152px] items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm text-muted">{zh ? '$39 范围界定 · 一个工作日内回复' : '$39 scoping call · Reply within one business day'}</p>
          <button type="button" tabIndex={show ? 0 : -1} onClick={() => openOrder()} className="form-submit shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold">{label}</button>
        </div>
      </div>
    </>
  )
}

/** End-of-page spacer the height of the bottom bar, so nothing (the footer included) can end up under it. */
export function StickyOrderSpacer() {
  return <div aria-hidden className="h-[72px] min-[1280px]:hidden" />
}
