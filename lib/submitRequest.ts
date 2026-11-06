import type { AgentRequest } from './requests'
import { profileText } from './check'

const NOTIFY = 'support@flowact.net'
const FAIL = 'That didn’t go through. Please email support@flowact.net.'

/**
 * Client helper: POST a request to /api/requests, which delivers it to the Flowact Ops inbox and the other channels
 * in lib/requests.ts. Until a server channel is configured (the server answers `undelivered`), the browser relays it
 * to support@ through formsubmit (it accepts posts that come from the site itself), so no lead is lost.
 * Returns an error message, or null on success.
 */
export async function submitRequest(req: AgentRequest & { website?: string }): Promise<{ error: string | null; id?: string }> {
  const payload = { ...req, page: typeof window !== 'undefined' ? window.location.pathname : '' }
  try {
    const res = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json.ok) return { error: null, id: json.id }
    if (json.code !== 'undelivered') return { error: json.error || FAIL }
  } catch {
    /* fall through to the browser relay */
  }
  const relayed = await browserRelay(payload)
  return { error: relayed, id: relayed ? undefined : `web-${Date.now().toString(36)}` }
}

async function browserRelay(req: AgentRequest & { page?: string }): Promise<string | null> {
  const agents = (req.modules ?? []).filter((m) => !m.startsWith('Plan:'))
  const plan = (req.modules ?? []).find((m) => m.startsWith('Plan:'))?.replace('Plan: ', '') ?? ''
  const what = req.kind === 'check' ? 'free assessment request' : req.kind === 'consultation' ? 'scoping session' : 'order'
  const body = {
    _subject: `New ${what}${req.company ? ` · ${req.company}` : ''}${agents.length ? ` · ${agents.slice(0, 2).join(' + ')}` : ''} (flowact.net)`,
    _template: 'table',
    _captcha: 'false',
    _replyto: req.contact.includes('@') ? req.contact : undefined,
    customer_contact: req.contact,
    name: req.name ?? '',
    company: req.company ?? '',
    website: req.companyUrl ?? '',
    check: req.profile ? profileText(req.profile).join(' | ') : '',
    agents: agents.join(', '),
    plan,
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
