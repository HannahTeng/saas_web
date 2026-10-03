import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BuildAgent from '@/components/build/BuildAgent'

export const metadata: Metadata = {
  title: 'Build your agent — Flowact',
  description: 'Book a $19.90/hour consultation, or choose a personal assistant, knowledge base, or business agent modules and request a quote.',
}

export default function BuildPage() {
  return (
    <>
      <Navbar />
      <BuildAgent />
      <Footer />
    </>
  )
}
