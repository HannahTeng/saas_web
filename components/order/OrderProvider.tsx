'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type OrderPreset = { agents?: string[]; plan?: string }

type OrderContextValue = {
  open: boolean
  preset: OrderPreset
  openOrder: (preset?: OrderPreset) => void
  closeOrder: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)

/** One order flow for the whole site: every "Order now" button opens the same panel. */
export function OrderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [preset, setPreset] = useState<OrderPreset>({})

  const openOrder = useCallback((p: OrderPreset = {}) => { setPreset(p); setOpen(true) }, [])
  const closeOrder = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [open])

  const value = useMemo(() => ({ open, preset, openOrder, closeOrder }), [open, preset, openOrder, closeOrder])
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within OrderProvider')
  return ctx
}
