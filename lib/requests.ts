import { createHmac } from 'node:crypto'
import { cleanProfile, profileText, type CheckProfile } from './check'

/**
 * One place that defines what an order is and where it goes.
 *
 * Delivery, all in parallel:
 *   1. Flowact Ops inbox (env FLOWACT_INTAKE_URL + FLOWACT_INTAKE_SECRET): the order becomes a lead, signed with
 *      HMAC-SHA256 over "<timestamp>.<body>". Ops sends the client an acknowledgement. This is the main channel.
 *   2. Save to the orders store (Upstash Redis via Vercel; env KV_REST_API_URL / KV_REST_API_TOKEN
 *      or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Shown on /admin.
 *   3. Email support@flowact.net through Resend (env RESEND_API_KEY, optional RESEND_FROM).
 *   4. Optional webhook (env REQUEST_WEBHOOK_URL) for Slack, Sheets, Zapier…
 * The order succeeds if any of 1–3 worked.
 */

export type RequestKind = 'check' | 'brief' | 'consultation' | 'quote'

export type AgentRequest = {
  kind: RequestKind
  contact: string
  message: string
  name?: string
  company?: string
  modules?: string[]
  preferredTime?: string
  page?: string
  /** Answers from the free workflow check. */
  profile?: CheckProfile
}

export type StoredOrder = AgentRequest & { id: string; receivedAt: string; status: 'new' | 'contacted' }

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'support@flowact.net'
export const CONSULTATION_RATE_USD = 39

const KINDS: RequestKind[] = ['check', 'brief', 'consultation', 'quote']
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export function parseRequest(body: unknown): { ok: true; data: AgentRequest } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>
  if (clip(b.website, 200)) return { ok: false, error: 'spam' } // honeypot field
  const kind = b.kind as RequestKind
  if (!KINDS.includes(kind)) return { ok: false, error: 'Unknown request type.' }
  const contact = clip(b.contact, 200)
  // email, phone (7+ digits), or a WeChat-style ID
  if (!/@|^[A-Za-z][\w-]{3,}$/.test(contact) && (contact.match(/\d/g) ?? []).length < 7) return { ok: false, error: 'Enter a work email, phone or WeChat ID so we can reply.' }
  const message = clip(b.message, 4000)
  const modules = Array.isArray(b.modules) ? b.modules.map((m) => clip(m, 80)).filter(Boolean).slice(0, 20) : []
  const profile = kind === 'check' ? cleanProfile(b.profile) : undefined
  const answered = Boolean(profile && (profile.pains.length || profile.wms || profile.daily_orders))
  if (!message && modules.length === 0 && !answered) return { ok: false, error: 'Tell us a little about the job.' }
  return {
    ok: true,
    data: {
      kind, contact, message, modules,
      name: clip(b.name, 120) || undefined,
      company: clip(b.company, 160) || undefined,
      preferredTime: clip(b.preferredTime, 80) || undefined,
      page: clip(b.page, 200) || undefined,
      profile,
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

const KIND_LABEL: Record<RequestKind, string> = { check: 'Free workflow check', brief: 'Request', consultation: 'Scoping session', quote: 'Order' }

export function orderSubject(o: AgentRequest): string {
  const agents = (o.modules ?? []).filter((m) => !m.startsWith('Plan:'))
  const plan = (o.modules ?? []).find((m) => m.startsWith('Plan:'))?.replace('Plan: ', '')
  const parts = [`New ${KIND_LABEL[o.kind].toLowerCase()}`, agents.slice(0, 2).join(' + ') || (o.kind === 'consultation' || o.kind === 'check' ? '' : 'custom'), plan].filter(Boolean)
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
    ...(o.profile ? ['Free workflow check:', ...profileText(o.profile), ''] : []),
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

/* ---------- Flowact Ops inbox ---------- */

async function sendToOps(o: StoredOrder): Promise<void> {
  const url = process.env.FLOWACT_INTAKE_URL
  const secret = process.env.FLOWACT_INTAKE_SECRET
  if (!url || !secret) throw new Error('ops intake not configured')
  const body = JSON.stringify(o)
  const ts = String(Math.floor(Date.now() / 1000))
  const signature = createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-flowact-timestamp': ts, 'x-flowact-signature': signature },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`ops intake ${res.status}: ${(await res.text()).slice(0, 200)}`)
}

/* ---------- deliver ---------- */

export async function deliver(req: AgentRequest): Promise<{ id: string; inbox: boolean; stored: boolean; emailed: boolean }> {
  const order: StoredOrder = {
    ...req,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    receivedAt: new Date().toISOString(),
    status: 'new',
  }

  const [inbox, stored, emailed] = await Promise.all([
    sendToOps(order).then(() => true, (e) => { console.error('[orders] ops inbox failed:', e); return false }),
    saveOrder(order).then(() => true, (e) => { console.error('[orders] store failed:', e); return false }),
    sendEmail(order).then(() => true, (e) => { console.error('[orders] email failed:', e); return false }),
  ])

  if (process.env.REQUEST_WEBHOOK_URL) {
    fetch(process.env.REQUEST_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }).catch(() => {})
  }

  if (!inbox && !stored && !emailed) {
    console.error('[orders] UNDELIVERED ORDER', JSON.stringify(order))
    throw new Error('delivery failed')
  }
  return { id: order.id, inbox, stored, emailed }
}
