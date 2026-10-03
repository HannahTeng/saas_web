import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AgentServices from '@/components/AgentServices'
import Products from '@/components/Products'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import QuickContact from '@/components/QuickContact'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products />
        <AgentServices />
        <TestimonialCarousel />
        <CTASection />
      </main>
      <QuickContact />
      <Footer />
    </>
  )
}
