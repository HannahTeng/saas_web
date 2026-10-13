import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PrivateAgentBanner from '@/components/PrivateAgentBanner'
import Showcase from '@/components/Showcase'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import CTASection from '@/components/CTASection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Showcase />
        <PrivateAgentBanner />
        <TestimonialCarousel />
        <CTASection />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
