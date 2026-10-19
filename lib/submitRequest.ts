import type { AgentRequest } from './requests'

const FAIL = 'That didn’t go through. Please email support@flowact.net.'

/**
 * Client helper: POST a request to /api/requests. The server delivers it to the Flowact inbox (and the other channels
 * in lib/requests.ts); there is no browser-side fallback, so a lead is never sent somewhere it can't be tracked.
 * Returns an error message, or null on success.
 */
export async function submitRequest(req: AgentRequest & { website?: string }): Promise<{ error: string | null; id?: string }> {
  const payload = { ...req, page: typeof window !== 'undefined' ? window.location.pathname : '' }
  try {
    const res = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json.ok) return { error: null, id: json.id }
    return { error: json.error || FAIL }
  } catch {
    return { error: FAIL }
  }
}

/**
 * Start payment for the $39 scoping call. Returns a Stripe Checkout URL, or null when Stripe is not configured
 * (the order is already with support@flowact.net either way).
 */
export async function startScopingCheckout(orderId: string, contact: string): Promise<string | null> {
  try {
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, contact }) })
    const json = await res.json().catch(() => ({}))
    return res.ok && typeof json.url === 'string' ? json.url : null
  } catch {
    return null
  }
}
