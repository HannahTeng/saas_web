import { NextResponse } from 'next/server'
import { deliver, parseRequest } from '@/lib/requests'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = parseRequest(body)
  if (!parsed.ok) {
    // Pretend success to bots that fill the honeypot.
    if (parsed.error === 'spam') return NextResponse.json({ ok: true })
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 })
  }

  try {
    await deliver(parsed.data)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'We couldn’t send that. Please email support@flowact.net.' }, { status: 502 })
  }
}
