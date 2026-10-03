'use client'

import { useEffect, useRef } from 'react'
import { USE_CASES_HTML } from './markup'
import { startUseCases } from './engine'
import './useCases.css'

/** Three real deployments, replayed inside rebuilt client screens. */
export default function UseCases() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    return startUseCases(root.current)
  }, [])

  return <div ref={root} className="uc" dangerouslySetInnerHTML={{ __html: USE_CASES_HTML }} />
}
