import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Projects from '@/components/Projects'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Projects />
      <About />
      <Skills />
      <Contact />
    </main>
  )
}
