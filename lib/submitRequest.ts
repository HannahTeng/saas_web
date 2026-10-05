import type { AgentRequest } from './requests'

const NOTIFY = 'support@flowact.net'
const FAIL = 'That didn’t go through. Please email support@flowact.net.'

/**
 * Client helper: POST a request to /api/requests.
 * If the server has no delivery channel configured yet, relay it from the browser instead
 * (formsubmit accepts requests that come from the site itself). Returns an error message, or null on success.
 */
export async function submitRequest(req: AgentRequest & { website?: string }): Promise<string | null> {
  const payload = { ...req, page: typeof window !== 'undefined' ? window.location.pathname : '' }
  try {
    const res = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json.ok) return null
    if (json.code !== 'undelivered') return json.error || FAIL
  } catch {
    /* fall through to the browser relay */
  }
  return browserRelay(payload)
}

async function browserRelay(req: AgentRequest & { page?: string }): Promise<string | null> {
  const agents = (req.modules ?? []).filter((m) => !m.startsWith('Plan:'))
  const plan = (req.modules ?? []).find((m) => m.startsWith('Plan:'))?.replace('Plan: ', '') ?? ''
  const body = {
    _subject: `New ${req.kind === 'consultation' ? 'scoping session' : 'order'} · ${agents.slice(0, 2).join(' + ') || 'custom'}${plan ? ' · ' + plan : ''} (flowact.net)`,
    _template: 'table',
    _captcha: 'false',
    _replyto: req.contact.includes('@') ? req.contact : undefined,
    customer_contact: req.contact,
    name: req.name ?? '',
    company: req.company ?? '',
    agents: agents.join(', '),
    plan,
    preferred_time: req.preferredTime ?? '',
    message: req.message,
    page: req.page ?? '',
    received_at: new Date().toISOString(),
  }
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${NOTIFY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    return res.ok && (json.success === 'true' || json.success === true) ? null : FAIL
  } catch {
    return FAIL
  }
}
