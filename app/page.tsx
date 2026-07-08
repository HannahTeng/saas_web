import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustBadges from '@/components/TrustBadges'
import ProblemSolution from '@/components/ProblemSolution'
import FeaturedTestimonial from '@/components/FeaturedTestimonial'
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
        <FeaturedTestimonial />
        <CaseStudies />
        <TestimonialCarousel />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
