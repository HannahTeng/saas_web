import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PrivateAgentBanner from '@/components/PrivateAgentBanner'
import Showcase from '@/components/Showcase'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <PrivateAgentBanner />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
