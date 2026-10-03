import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BuildAgent from '@/components/build/BuildAgent'

export const metadata: Metadata = {
  title: 'Get Flowact — Pricing and agents',
  description: 'Choose Flowact agents for your logistics team (Data, Dispatch and Docs agents plus add-ons) and get pricing, or book a 60-minute scoping session.',
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
