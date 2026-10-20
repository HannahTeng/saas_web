'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder, type OrderPreset } from './OrderProvider'

/** The site's one call to action. Same label, same panel, wherever it appears. */
export function OrderButton({ preset, variant = 'solid', size = 'md', className = '' }: { preset?: OrderPreset; variant?: 'solid' | 'ghost'; size?: 'md' | 'lg'; className?: string }) {
  const { language } = useLanguage()
  const { openOrder } = useOrder()
  return (
    <Button variant={variant} size={size} className={className} onClick={() => openOrder(preset)}>
      {language === 'zh' ? '免费体检' : 'Free check'}
    </Button>
  )
}

/**
 * Follows the reader once the hero scrolls away; hides again at the closing CTA (#contact) and while the order panel is open.
 * Every desktop variant lives in the empty margin beside the 1152px content column, so it never sits on content:
 * - ≥1680px: a small card (sized to the margin).
 * - 1280–1679px: a slim vertical tab on the right edge (the margin is 64–264px there).
 * - <1280px (tablets, phones, no margin): the bottom bar, with a spacer at the end of the page so nothing ends under it.
 * Hidden variants go `invisible` at the end of their transition, so they leave the tab order and the accessibility tree.
 */
export function StickyOrderBar() {
  const { language } = useLanguage()
  const { openOrder, open } = useOrder()
  const zh = language === 'zh'
  const [pastHero, setPastHero] = useState(false)
  const [atClose, setAtClose] = useState(false)

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
    return () => ios.forEach((io) => io.disconnect())
  }, [])

  const show = pastHero && !atClose && !open
  const label = zh ? '免费体检' : 'Free check'

  return (
    <>
      {/* wide screens: margin card */}
      <aside
        aria-label={zh ? '免费流程体检' : 'Free workflow check'}
        className={`card fixed bottom-8 right-8 z-40 hidden flex-col gap-4 bg-panel/90 p-5 backdrop-blur-xl transition-all duration-300 min-[1680px]:flex ${show ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-3 opacity-0'}`}
        style={{ width: 'min(300px, calc((100vw - 1152px) / 2 - 64px))' }}
      >
        <p className="text-base font-medium leading-snug text-primary">{zh ? '把重复的工作交出去。' : 'Hand off the repetition.'}</p>
        <ul className="space-y-1.5 text-sm leading-snug text-muted">
          <li>{zh ? '免费 · 60 秒填完' : 'Free · 60 seconds'}</li>
          <li>{zh ? '一个工作日内收到书面结果' : 'Written result within one business day'}</li>
          <li>{zh ? '试点验收不过不付钱' : 'Pilots: no pass, no pay'}</li>
        </ul>
        <Button className="w-full" onClick={() => openOrder()}>{label}</Button>
      </aside>

      {/* laptops: vertical tab in the right margin (its own shape, same solid colours as Button) */}
      <button
        type="button"
        onClick={() => openOrder()}
        className={`fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 rounded-full bg-accent px-2.5 py-5 text-sm font-medium text-accent-ink transition-[opacity,visibility] duration-300 [writing-mode:vertical-rl] hover:bg-accent-hover min-[1280px]:block min-[1680px]:hidden ${show ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'}`}
      >
        {label}
      </button>

      {/* tablets and phones: bottom bar */}
      <div
        data-order-bar
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-page/90 px-4 py-3 backdrop-blur-xl transition-[transform,visibility] duration-300 min-[1280px]:hidden ${show ? 'visible translate-y-0' : 'invisible pointer-events-none translate-y-full'}`}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-auto flex max-w-[1152px] items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm text-muted">{zh ? '免费流程体检 · 一个工作日内回复' : 'Free workflow check · Reply within one business day'}</p>
          <Button onClick={() => openOrder()}>{label}</Button>
        </div>
      </div>
    </>
  )
}

/** End-of-page spacer the height of the bottom bar, so nothing (the footer included) can end up under it. */
export function StickyOrderSpacer() {
  return <div aria-hidden className="h-[72px] min-[1280px]:hidden" />
}
