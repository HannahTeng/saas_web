import type { Metadata } from 'next'
import Button from '@/components/Button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Section from '@/components/Section'

export const metadata: Metadata = { title: 'Page not found — Flowact', robots: { index: false } }

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <Section rule={false}>
          <p className="section-kicker">404</p>
          <h1 className="h-section mt-4">This page doesn’t exist.</h1>
          <p className="mt-4 max-w-xl text-muted">The link may be old, or the address has a typo.</p>
          <Button href="/" variant="ghost" className="mt-8">Back to the homepage</Button>
        </Section>
      </main>
      <Footer />
    </>
  )
}
