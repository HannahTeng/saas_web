'use client'

import { useEffect, useRef } from 'react'

/* ────────────────────────────────────────────────────────────────────────
   Cursor — custom glowing crosshair cursor (DOM, lerped)
   ------------------------------------------------------------------------
   • Default state: small cyan dot + fine crosshair lines + soft glow ring.
   • Over any link / button / [data-hover]: morphs into a targeting reticle —
     the ring expands and four corner brackets rotate in (target-lock).
   • Position is eased with a lerp for a weighty, engineered feel.
   Disabled on coarse pointers and under prefers-reduced-motion (native
   cursor stays visible in both cases).
   ──────────────────────────────────────────────────────────────────────── */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduced || !fine) return

    const root = rootRef.current!
    document.body.classList.add('cursor-host')
    root.style.display = 'block'

    let tx = -100
    let ty = -100
    let x = -100
    let y = -100
    let locked = false
    let visible = false

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!visible) {
        visible = true
        root.style.opacity = '1'
        // snap on first appearance so it doesn't fly in from the corner
        x = tx
        y = ty
      }
      const t = (e.target as Element | null)?.closest?.('a, button, [data-hover]')
      const nowLocked = !!t
      if (nowLocked !== locked) {
        locked = nowLocked
        root.classList.toggle('is-locked', locked)
      }
    }
    const onLeave = () => {
      visible = false
      root.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.body.classList.remove('cursor-host')
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed left-0 top-0 z-[80] pointer-events-none opacity-0 transition-opacity duration-300 hidden"
      style={{ willChange: 'transform' }}
    >
      {/* center dot */}
      <span className="cur-dot absolute -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-accent shadow-glowSm" />
      {/* crosshair hairlines */}
      <span className="cur-h absolute -translate-x-1/2 -translate-y-1/2 h-px w-4 bg-accent/60 transition-all duration-300" />
      <span className="cur-v absolute -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-accent/60 transition-all duration-300" />
      {/* ring + corner brackets (reticle) */}
      <span className="cur-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40 w-7 h-7 transition-all duration-300" />
      <span className="cur-box absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 opacity-0 scale-75 rotate-45 transition-all duration-300">
        {(['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'] as const).map((pos) => (
          <span key={pos} className={`absolute w-2 h-2 border-accent ${pos}`} />
        ))}
      </span>
    </div>
  )
}
