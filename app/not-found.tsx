import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: 'Page not found — Flowact', robots: { index: false } }

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="px-4 py-24 sm:px-6 md:py-36">
        <div className="mx-auto max-w-6xl">
          <p className="section-kicker">404</p>
          <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">This page doesn’t exist.</h1>
          <p className="mt-4 max-w-xl text-muted">The link may be old, or the address has a typo.</p>
          <a href="/" className="mt-8 inline-flex items-center justify-center rounded-lg border border-line/20 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent">
            Back to the homepage
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
