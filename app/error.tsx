'use client'

import { useEffect } from 'react'
import Button from '@/components/Button'
import Section from '@/components/Section'

/** Route-level error boundary: shown instead of a blank page when rendering throws. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main>
      <Section rule={false}>
        <p className="section-kicker">Something went wrong</p>
        <h1 className="h-section mt-4">This page hit an error.</h1>
        <p className="mt-4 max-w-xl text-muted">Try again, or email support@flowact.net if it keeps happening.</p>
        <Button onClick={reset} className="mt-8">Try again</Button>
      </Section>
    </main>
  )
}
