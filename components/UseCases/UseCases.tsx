'use client'

import { useEffect, useRef } from 'react'
import { USE_CASES_HTML } from './markup'
import { startUseCases } from './engine'
import './useCases.css'

export type SceneKind = 'knowledge' | 'browser' | 'local'

/**
 * Real deployments replayed inside rebuilt client screens, one per agent type.
 * Only the active scene is shown; hidden scenes pause on their own (they leave the viewport).
 */
export default function UseCases({ active }: { active: SceneKind }) {
  const root = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const el = root.current
    if (!el) return
    // React never manages these children: the markup is inserted once and animated by the engine.
    el.innerHTML = USE_CASES_HTML
    el.querySelectorAll<HTMLElement>('[data-kind]').forEach((c) => { c.hidden = c.dataset.kind !== activeRef.current })
    return startUseCases(el)
  }, [])

  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>('[data-kind]').forEach((el) => {
      el.hidden = el.dataset.kind !== active
    })
    root.current?.dispatchEvent(new Event('uc:refit'))
  }, [active])

  return <div ref={root} className="uc" />
}
