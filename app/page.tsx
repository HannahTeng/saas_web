import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FlowRing from '@/components/FlowRing'
import PrivateAgentBanner from '@/components/PrivateAgentBanner'
import Showcase from '@/components/Showcase'
import Process from '@/components/Process'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <FlowRing />
      <div className="reading-flow" aria-hidden />
      <Navbar />
      <main className="relative z-[1]">
        <Hero />
        <Showcase />
        <PrivateAgentBanner />
        <Process />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
