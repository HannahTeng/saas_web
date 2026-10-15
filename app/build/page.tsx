import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Pricing from '@/components/Pricing'

export const metadata: Metadata = {
  title: 'Agents and pricing — Flowact',
  description: 'Flowact agents and pricing: core agents, add-ons and plans, all built into the systems you already use. Book a 60-minute scoping call and get a fixed quote.',
}

export default function BuildPage() {
  return (
    <>
      <Navbar />
      <Pricing />
      <Footer />
    </>
  )
}
