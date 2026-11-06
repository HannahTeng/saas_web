'use client'

import { useEffect } from 'react'

const SURFACE = '.glass, .card, .btn'

/** Moves the highlight on a glass surface to where the pointer is (--shine-x/y, read by globals.css). Mouse only. */
export default function GlassShine() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lit: HTMLElement | null = null
    const clear = () => { lit?.style.removeProperty('--shine-x'); lit?.style.removeProperty('--shine-y'); lit = null }
    const onMove = (e: PointerEvent) => {
      const el = still.matches ? null : (e.target as Element | null)?.closest<HTMLElement>(SURFACE) ?? null
      if (el !== lit) clear()
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--shine-x', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
      el.style.setProperty('--shine-y', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
      lit = el
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', clear)
    return () => { document.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', clear); clear() }
  }, [])
  return null
}
