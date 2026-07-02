import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import Telemetry from '@/components/Telemetry'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Telemetry />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </main>
  )
}
