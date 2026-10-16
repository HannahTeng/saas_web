import type { KeyboardEvent } from 'react'

/**
 * Keyboard handling for a role="tablist" whose tabs are the direct children of one element:
 * Left/Right (or Up/Down) move to the neighbour and select it, Home/End jump. Pair with a roving tabIndex
 * (0 on the selected tab, -1 on the rest) so Tab leaves the list and the arrows move inside it.
 */
export function onTabKey(e: KeyboardEvent<HTMLElement>, index: number, count: number, select: (i: number) => void) {
  const next =
    e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (index + 1) % count
    : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (index + count - 1) % count
    : e.key === 'Home' ? 0
    : e.key === 'End' ? count - 1
    : -1
  if (next < 0) return
  e.preventDefault()
  ;(e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus()
  select(next)
}
