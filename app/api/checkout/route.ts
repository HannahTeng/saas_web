import { NextResponse } from 'next/server'

/**
 * POST { orderId, contact } → { url } for paying the $39 scoping call.
 *
 * Uses, in order:
 *  1. STRIPE_SECRET_KEY → creates a Stripe Checkout Session (order id in metadata, email prefilled).
 *  2. NEXT_PUBLIC_STRIPE_PAYMENT_LINK → a Stripe Payment Link, with the order id as client_reference_id.
 *  3. Neither set → { url: null }; the order is still delivered, payment is arranged after the call.
 */
const PRICE_CENTS = Number(process.env.SCOPING_PRICE_CENTS ?? 3900)

export async function POST(request: Request) {
  const { orderId = '', contact = '' } = (await request.json().catch(() => ({}))) as { orderId?: string; contact?: string }
  const id = String(orderId).slice(0, 64)
  const email = /@/.test(contact) ? String(contact).trim().slice(0, 200) : undefined
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin

  const key = process.env.STRIPE_SECRET_KEY
  if (key) {
    const form = new URLSearchParams({
      mode: 'payment',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': String(PRICE_CENTS),
      'line_items[0][price_data][product_data][name]': 'Flowact scoping call (60 min)',
      'line_items[0][price_data][product_data][description]': 'Map your workflow to the right agents. Written scope and fixed quote after the call.',
      success_url: `${origin}/?paid=1&order=${encodeURIComponent(id)}`,
      cancel_url: `${origin}/?paid=0&order=${encodeURIComponent(id)}`,
      client_reference_id: id,
      'metadata[order_id]': id,
      'payment_intent_data[metadata][order_id]': id,
    })
    if (email) form.set('customer_email', email)
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Idempotency-Key': `scoping-${id}` },
      body: form,
    })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json.url) return NextResponse.json({ url: json.url })
    console.error('[checkout] stripe error', res.status, json?.error?.message)
    return NextResponse.json({ url: null, error: 'stripe' }, { status: 502 })
  }

  const link = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK
  if (link) {
    const u = new URL(link)
    u.searchParams.set('client_reference_id', id)
    if (email) u.searchParams.set('prefilled_email', email)
    return NextResponse.json({ url: u.toString() })
  }

  return NextResponse.json({ url: null })
}
