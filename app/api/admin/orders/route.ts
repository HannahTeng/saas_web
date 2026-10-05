import { NextResponse } from 'next/server'
import { listOrders, setOrderStatus, storeConfigured } from '@/lib/requests'

export const dynamic = 'force-dynamic'

/** GET: orders as JSON, or CSV with ?format=csv. Protected by middleware (Basic Auth). */
export async function GET(request: Request) {
  if (!storeConfigured()) return NextResponse.json({ ok: false, error: 'store not configured' }, { status: 503 })
  const orders = await listOrders(1000)
  const url = new URL(request.url)
  if (url.searchParams.get('format') !== 'csv') return NextResponse.json({ ok: true, orders })
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = [
    ['received_at', 'status', 'kind', 'contact', 'name', 'company', 'agents', 'plan', 'preferred_time', 'message', 'page', 'id'],
    ...orders.map((o) => [
      o.receivedAt, o.status, o.kind, o.contact, o.name ?? '', o.company ?? '',
      (o.modules ?? []).filter((m) => !m.startsWith('Plan:')).join('; '),
      (o.modules ?? []).find((m) => m.startsWith('Plan:'))?.replace('Plan: ', '') ?? '',
      o.preferredTime ?? '', o.message, o.page ?? '', o.id,
    ]),
  ]
  const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n')
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="flowact-orders-${new Date().toISOString().slice(0, 10)}.csv"` } })
}

/** POST (form): set an order's status, then go back to the list. */
export async function POST(request: Request) {
  const form = await request.formData()
  const id = String(form.get('id') || '')
  const status = String(form.get('status') || '')
  const back = String(form.get('back') || '/admin')
  if (id && (status === 'new' || status === 'contacted')) await setOrderStatus(id, status)
  return NextResponse.redirect(new URL(back.startsWith('/admin') ? back : '/admin', request.url), 303)
}
