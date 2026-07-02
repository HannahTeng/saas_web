import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import Cursor from '@/components/effects/Cursor'
import Preloader from '@/components/Preloader'
import Nav from '@/components/Nav'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Hannah Teng — Data Scientist & Builder',
  description:
    'Zihan (Hannah) Teng — MSc Data Science in Health at UCLA. Building data & AI products end to end, from clinical NL-query agents to the dashboards and interfaces that ship them.',
  keywords: [
    'Hannah Teng',
    'Zihan Teng',
    'Data Scientist',
    'Health Data Science',
    'Forward Deployed Engineer',
    'Agentic AI',
    'UCLA',
    'Next.js',
  ],
  openGraph: {
    title: 'Hannah Teng — Data Scientist & Builder',
    description: 'Health Data Science · Agentic AI · Frontend that ships',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      {/* `.scanlines` overlays a faint CRT texture; `cursor-host` toggled by Cursor */}
      <body className="scanlines">
        <Cursor />
        <Preloader />
        <SmoothScroll>
          <Nav />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
