/**
 * One place that defines what a request is and where it goes.
 * Today: email to support@flowact.net via formsubmit, plus an optional webhook.
 * Later: swap `deliver` for a database insert (Supabase / Vercel Postgres) or a Stripe Checkout session.
 */

export type RequestKind = 'brief' | 'consultation' | 'quote'

export type AgentRequest = {
  kind: RequestKind
  contact: string
  message: string
  name?: string
  company?: string
  modules?: string[]
  preferredTime?: string
  page?: string
}

export const NOTIFY_EMAIL = 'support@flowact.net'
export const CONSULTATION_RATE_USD = 19.9

const KINDS: RequestKind[] = ['brief', 'consultation', 'quote']
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export function parseRequest(body: unknown): { ok: true; data: AgentRequest } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>
  if (clip(b.website, 200)) return { ok: false, error: 'spam' } // honeypot field
  const kind = b.kind as RequestKind
  if (!KINDS.includes(kind)) return { ok: false, error: 'Unknown request type.' }
  const contact = clip(b.contact, 200)
  if (!/@|^[A-Za-z][\w-]{3,}$/.test(contact)) return { ok: false, error: 'Enter a work email or WeChat ID so we can reply.' }
  const message = clip(b.message, 4000)
  const modules = Array.isArray(b.modules) ? b.modules.map((m) => clip(m, 80)).filter(Boolean).slice(0, 20) : []
  if (!message && modules.length === 0) return { ok: false, error: 'Tell us a little about the job.' }
  return {
    ok: true,
    data: {
      kind,
      contact,
      message,
      modules,
      name: clip(b.name, 120) || undefined,
      company: clip(b.company, 160) || undefined,
      preferredTime: clip(b.preferredTime, 80) || undefined,
      page: clip(b.page, 200) || undefined,
    },
  }
}

const SUBJECTS: Record<RequestKind, string> = {
  brief: 'New agent request (flowact.net)',
  consultation: `Scoping session request · $${CONSULTATION_RATE_USD} (flowact.net)`,
  quote: 'Quote request (flowact.net)',
}

export async function deliver(req: AgentRequest): Promise<void> {
  const payload = {
    _subject: SUBJECTS[req.kind],
    _template: 'table',
    _captcha: 'false',
    type: req.kind,
    contact: req.contact,
    name: req.name ?? '',
    company: req.company ?? '',
    modules: (req.modules ?? []).join(', '),
    preferred_time: req.preferredTime ?? '',
    message: req.message,
    page: req.page ?? '',
    received_at: new Date().toISOString(),
  }

  const jobs: Promise<Response>[] = [
    fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Referer: 'https://flowact.net/', Origin: 'https://flowact.net' },
      body: JSON.stringify(payload),
    }),
  ]
  // Optional: also post to a webhook (Zapier/Make → Gmail, Google Sheets, Slack, a database…).
  if (process.env.REQUEST_WEBHOOK_URL) {
    jobs.push(fetch(process.env.REQUEST_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }))
  }

  const results = await Promise.allSettled(jobs)
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value.ok)
  if (!delivered) throw new Error('delivery failed')
}
