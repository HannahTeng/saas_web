import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Pricing from '@/components/Pricing'

export const metadata: Metadata = {
  title: 'Agents and pricing — Flowact',
  description: 'Flowact agents and pricing: core agents, add-ons and plans, all built into the systems you already use. Start with a $39 demo on your own workflow; the full build comes with a fixed quote.',
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
