import type { AgentRequest } from './requests'

/** Client helper: POST a request to /api/requests. Returns an error message, or null on success. */
export async function submitRequest(req: AgentRequest & { website?: string }): Promise<string | null> {
  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req, page: typeof window !== 'undefined' ? window.location.pathname : '' }),
    })
    const json = await res.json().catch(() => ({}))
    return res.ok && json.ok ? null : json.error || 'That didn’t go through. Please email support@flowact.net.'
  } catch {
    return 'That didn’t go through. Please email support@flowact.net.'
  }
}
