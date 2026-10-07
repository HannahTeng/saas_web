/**
 * One place that defines what an order is and where it goes.
 *
 * Delivery, in order:
 *   1. Save to the orders store (Upstash Redis via Vercel; env KV_REST_API_URL / KV_REST_API_TOKEN
 *      or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Shown on /admin.
 *   2. Email support@flowact.net through Resend (env RESEND_API_KEY, optional RESEND_FROM).
 *   3. Optional webhook (env REQUEST_WEBHOOK_URL) for Slack, Sheets, Zapier…
 * The order succeeds if the store or the email worked. Stripe later: add a step here.
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

export type StoredOrder = AgentRequest & { id: string; receivedAt: string; status: 'new' | 'contacted' }

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'support@flowact.net'
export const CONSULTATION_RATE_USD = 39

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
      kind, contact, message, modules,
      name: clip(b.name, 120) || undefined,
      company: clip(b.company, 160) || undefined,
      preferredTime: clip(b.preferredTime, 80) || undefined,
      page: clip(b.page, 200) || undefined,
    },
  }
}

/* ---------- store (Upstash Redis REST) ---------- */

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url, token } : null
}

async function redis(cmd: (string | number)[]): Promise<unknown> {
  const env = redisEnv()
  if (!env) throw new Error('store not configured')
  const res = await fetch(env.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`store ${res.status}`)
  const json = (await res.json()) as { result?: unknown; error?: string }
  if (json.error) throw new Error(json.error)
  return json.result
}

export const storeConfigured = () => Boolean(redisEnv())

export async function saveOrder(order: StoredOrder): Promise<void> {
  await redis(['SET', `order:${order.id}`, JSON.stringify(order)])
  await redis(['LPUSH', 'orders', order.id])
}

export async function listOrders(limit = 200): Promise<StoredOrder[]> {
  const ids = (await redis(['LRANGE', 'orders', 0, limit - 1])) as string[]
  if (!ids?.length) return []
  const raw = (await redis(['MGET', ...ids.map((id) => `order:${id}`)])) as (string | null)[]
  return raw.filter((r): r is string => Boolean(r)).map((r) => JSON.parse(r) as StoredOrder)
}

export async function setOrderStatus(id: string, status: StoredOrder['status']): Promise<void> {
  const raw = (await redis(['GET', `order:${id}`])) as string | null
  if (!raw) return
  const order = JSON.parse(raw) as StoredOrder
  order.status = status
  await redis(['SET', `order:${id}`, JSON.stringify(order)])
}

/* ---------- email (Resend) ---------- */

const KIND_LABEL: Record<RequestKind, string> = { brief: 'Request', consultation: 'Scoping session', quote: 'Order' }

export function orderSubject(o: AgentRequest): string {
  const agents = (o.modules ?? []).filter((m) => !m.startsWith('Plan:'))
  const plan = (o.modules ?? []).find((m) => m.startsWith('Plan:'))?.replace('Plan: ', '')
  const parts = [`New ${KIND_LABEL[o.kind].toLowerCase()}`, agents.slice(0, 2).join(' + ') || (o.kind === 'consultation' ? '' : 'custom'), plan].filter(Boolean)
  return parts.join(' · ') + ' (flowact.net)'
}

function orderText(o: StoredOrder): string {
  const agents = (o.modules ?? []).filter((m) => !m.startsWith('Plan:'))
  const plan = (o.modules ?? []).find((m) => m.startsWith('Plan:'))?.replace('Plan: ', '') ?? '—'
  return [
    `NEW ${KIND_LABEL[o.kind].toUpperCase()} · ${o.receivedAt}`,
    '',
    `Customer contact: ${o.contact}`,
    o.name ? `Name: ${o.name}` : null,
    o.company ? `Company: ${o.company}` : null,
    '',
    `Agents: ${agents.length ? agents.join(', ') : '—'}`,
    `Plan: ${plan}`,
    o.preferredTime ? `Preferred time: ${o.preferredTime}` : null,
    '',
    'Message:',
    o.message || '—',
    '',
    `Page: ${o.page || '—'}`,
    `Order id: ${o.id}`,
    '',
    'Reply to the customer within one business day. Manage orders at https://flowact.net/admin',
  ].filter((l) => l !== null).join('\n')
}

async function sendEmail(o: StoredOrder): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('email not configured')
  const from = process.env.RESEND_FROM || 'Flowact Orders <orders@flowact.net>'
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: [NOTIFY_EMAIL], subject: orderSubject(o), text: orderText(o),
      reply_to: o.contact.includes('@') ? o.contact : undefined,
    }),
  })
  if (!res.ok) throw new Error(`email ${res.status}: ${await res.text()}`)
}

/* ---------- deliver ---------- */

export async function deliver(req: AgentRequest): Promise<{ stored: boolean; emailed: boolean }> {
  const order: StoredOrder = {
    ...req,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    receivedAt: new Date().toISOString(),
    status: 'new',
  }

  const [stored, emailed] = await Promise.all([
    saveOrder(order).then(() => true, (e) => { console.error('[orders] store failed:', e); return false }),
    sendEmail(order).then(() => true, (e) => { console.error('[orders] email failed:', e); return false }),
  ])

  if (process.env.REQUEST_WEBHOOK_URL) {
    fetch(process.env.REQUEST_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }).catch(() => {})
  }

  if (!stored && !emailed) {
    console.error('[orders] UNDELIVERED ORDER', JSON.stringify(order))
    throw new Error('delivery failed')
  }
  return { stored, emailed }
}
