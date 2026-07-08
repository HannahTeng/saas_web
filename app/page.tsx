import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustBadges from '@/components/TrustBadges'
import ProblemSolution from '@/components/ProblemSolution'
import CaseStudies from '@/components/CaseStudies'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <ProblemSolution />
        <CaseStudies />
        <TestimonialCarousel />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
