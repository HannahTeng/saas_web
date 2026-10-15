import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Protects /admin and /api/admin with HTTP Basic Auth.
 * Set ADMIN_USER and ADMIN_PASSWORD in Vercel → Settings → Environment Variables.
 */
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASSWORD
  const deny = (msg: string) =>
    new NextResponse(msg, { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Flowact admin", charset="UTF-8"' } })

  if (!user || !pass) return deny('Admin is not configured. Set ADMIN_USER and ADMIN_PASSWORD.')

  const header = req.headers.get('authorization') || ''
  const [scheme, encoded] = header.split(' ')
  if (scheme !== 'Basic' || !encoded) return deny('Sign in required.')
  let decoded = ''
  try {
    decoded = atob(encoded)
  } catch {
    return deny('Sign in required.') // malformed credentials are a 401, not a crash
  }
  const [u, ...rest] = decoded.split(':')
  const p = rest.join(':')
  if (u !== user || p !== pass) return deny('Wrong username or password.')
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
