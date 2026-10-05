import type { Metadata } from 'next'
import { listOrders, storeConfigured, type StoredOrder } from '@/lib/requests'

export const metadata: Metadata = { title: 'Orders — Flowact admin', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

function agentsOf(o: StoredOrder) { return (o.modules ?? []).filter((m) => !m.startsWith('Plan:')) }
function planOf(o: StoredOrder) { return (o.modules ?? []).find((m) => m.startsWith('Plan:'))?.replace('Plan: ', '') ?? '—' }
const fmt = (iso: string) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export default async function AdminPage({ searchParams }: { searchParams: { show?: string } }) {
  const configured = storeConfigured()
  const orders = configured ? await listOrders() : []
  const showAll = searchParams.show === 'all'
  const visible = showAll ? orders : orders.filter((o) => o.status === 'new')
  const newCount = orders.filter((o) => o.status === 'new').length

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Flowact admin</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight">Orders <span className="text-muted">· {newCount} new</span></h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <a href="/admin" className={`rounded-lg border px-3 py-1.5 ${showAll ? 'border-line/15 text-muted' : 'border-accent text-primary'}`}>New</a>
          <a href="/admin?show=all" className={`rounded-lg border px-3 py-1.5 ${showAll ? 'border-accent text-primary' : 'border-line/15 text-muted'}`}>All ({orders.length})</a>
          <a href="/api/admin/orders?format=csv" className="rounded-lg border border-line/15 px-3 py-1.5 text-muted hover:text-primary">Export CSV</a>
        </div>
      </div>

      {!configured && (
        <p className="mt-8 rounded-xl border border-[#E89A86]/40 bg-[#E89A86]/10 p-4 text-sm text-primary">
          The orders store isn’t connected yet. In Vercel, add the <b>Upstash Redis</b> integration to this project (Storage → Create → Upstash Redis); it sets the KV_REST_API_URL and KV_REST_API_TOKEN variables automatically. Orders are still emailed meanwhile if RESEND_API_KEY is set.
        </p>
      )}

      {configured && visible.length === 0 && <p className="mt-10 text-muted">{showAll ? 'No orders yet.' : 'No new orders. 🎉'}</p>}

      <ul className="mt-8 grid gap-3">
        {visible.map((o) => (
          <li key={o.id} className={`rounded-2xl border p-5 ${o.status === 'new' ? 'border-accent/40 bg-panel' : 'border-line/10'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-subtle">{fmt(o.receivedAt)} · {o.kind} · {o.page || '—'}</p>
                <p className="mt-1 text-lg font-medium text-primary break-all">
                  {o.contact.includes('@') ? <a href={`mailto:${o.contact}`} className="underline decoration-line/30 underline-offset-4">{o.contact}</a> : o.contact}
                  {o.company ? <span className="text-muted"> · {o.company}</span> : null}
                </p>
              </div>
              <form action="/api/admin/orders" method="post" className="flex items-center gap-2">
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value={o.status === 'new' ? 'contacted' : 'new'} />
                <input type="hidden" name="back" value={showAll ? '/admin?show=all' : '/admin'} />
                <button type="submit" className={`rounded-lg border px-3 py-1.5 text-sm ${o.status === 'new' ? 'border-accent text-primary' : 'border-line/15 text-muted'}`}>
                  {o.status === 'new' ? 'Mark contacted' : 'Mark new'}
                </button>
              </form>
            </div>
            <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="text-subtle">Agents</dt><dd className="text-copy">{agentsOf(o).join(', ') || '—'}</dd>
              <dt className="text-subtle">Plan</dt><dd className="text-copy">{planOf(o)}</dd>
              {o.preferredTime && <><dt className="text-subtle">Time</dt><dd className="text-copy">{o.preferredTime}</dd></>}
              <dt className="text-subtle">Message</dt><dd className="whitespace-pre-wrap text-copy">{o.message || '—'}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </main>
  )
}
