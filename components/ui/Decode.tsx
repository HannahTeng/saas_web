'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger, prefersReducedMotion } from '@/lib/anim'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#·01'

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  /** seconds before the decode starts once triggered */
  delay?: number
  /** run on initial load instead of waiting for a ScrollTrigger */
  onLoad?: boolean
}

/**
 * Decode — text resolves left to right with a light technical feel.
 * Falls back to static text under prefers-reduced-motion.
 */
export default function Decode({ text, as = 'h2', className = '', delay = 0, onLoad = false }: Props) {
  const ref = useRef<HTMLElement>(null)
  const Tag = as as React.ElementType

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      el.textContent = text
      el.style.opacity = '1'
      return
    }

    let raf = 0
    let timeout = 0
    let started = false

    const run = () => {
      if (started) return
      started = true
      el.style.opacity = '1'
      const chars = text.split('')
      const total = 900 // ms for the full resolve
      const startAt = performance.now() + delay * 1000

      const tick = (now: number) => {
        const t = (now - startAt) / total
        if (t < 0) {
          raf = requestAnimationFrame(tick)
          return
        }
        // characters left of the "lock line" are final; right of it churn
        const lock = Math.floor(t * chars.length)
        let out = ''
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i]
          if (c === ' ' || i < lock) out += c
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
        el.textContent = out
        if (lock < chars.length) raf = requestAnimationFrame(tick)
        else el.textContent = text
      }
      raf = requestAnimationFrame(tick)
    }

    let st: ScrollTrigger | undefined
    if (onLoad) {
      const done = () => run()
      window.addEventListener('preloader:done', done, { once: true })
      timeout = window.setTimeout(run, 120)
      return () => {
        window.removeEventListener('preloader:done', done)
        window.clearTimeout(timeout)
        cancelAnimationFrame(raf)
      }
    } else if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      run()
    } else {
      st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: run })
    }

    return () => {
      st?.kill()
      cancelAnimationFrame(raf)
    }
  }, [text, delay, onLoad])

  // Render final text for SSR/no-JS; hidden until the effect starts.
  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }} aria-label={text}>
      {text}
    </Tag>
  )
}
