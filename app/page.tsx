import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AgentServices from '@/components/AgentServices'
import UseCases from '@/components/UseCases/UseCases'
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
        <UseCases />
        <AgentServices />
        <TestimonialCarousel />
        <CTASection />
      </main>
      <QuickContact />
      <Footer />
    </>
  )
}
