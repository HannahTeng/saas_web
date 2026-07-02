'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register client-side only. gsap.registerPlugin is idempotent.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/**
 * Split an element's text into inline-block <span> words, each wrapped in an
 * overflow-hidden line box so the word can rise from a mask. Returns the word
 * spans for animation. Idempotent-ish: safe to call once per element.
 */
export function splitWordsMasked(el: HTMLElement): HTMLElement[] {
  const words = (el.textContent ?? '').trim().split(/\s+/)
  el.textContent = ''
  el.style.overflow = 'visible'

  return words.map((word, i) => {
    const mask = document.createElement('span')
    mask.style.display = 'inline-block'
    mask.style.overflow = 'hidden'
    mask.style.verticalAlign = 'top'
    mask.style.paddingBottom = '0.12em'
    mask.style.marginBottom = '-0.12em'

    const inner = document.createElement('span')
    inner.style.display = 'inline-block'
    inner.style.transform = 'translateY(110%)'
    inner.textContent = word

    mask.appendChild(inner)
    el.appendChild(mask)
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '))
    return inner
  })
}

/**
 * Split into plain inline-block word spans (no mask) — used for scrub colour
 * fills where words stay in place and only change colour.
 */
export function splitWordsPlain(el: HTMLElement): HTMLElement[] {
  const words = (el.textContent ?? '').trim().split(/\s+/)
  el.textContent = ''

  return words.map((word, i) => {
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.textContent = word
    el.appendChild(span)
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '))
    return span
  })
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
