'use client'

import { useEffect } from 'react'

/** Route-level error boundary: shown instead of a blank page when rendering throws. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="px-4 py-24 sm:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <p className="section-kicker">Something went wrong</p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">This page hit an error.</h1>
        <p className="mt-4 max-w-xl text-muted">Try again, or email support@flowact.net if it keeps happening.</p>
        <button type="button" onClick={reset} className="form-submit mt-8 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold">
          Try again
        </button>
      </div>
    </main>
  )
}
