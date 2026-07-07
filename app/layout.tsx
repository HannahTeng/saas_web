import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import Nav from '@/components/Nav'

const grotesk = Inter({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Hannah Teng — Agentic Workflows, Built For Your Industry',
  description:
    'Turn the work your team repeats every day into an AI agent with a human approval step. Forward-deployed engineer Hannah Teng maps your workflow, encodes your rules, and deploys agents inside the tools you already use — logistics, clinical, education, and beyond.',
  keywords: [
    'Hannah Teng',
    'Zihan Teng',
    'Agentic AI',
    'AI Agents',
    'Workflow Automation',
    'Human-in-the-loop',
    'Forward Deployed Engineer',
    'AI Consulting',
  ],
  openGraph: {
    title: 'Hannah Teng — Agentic Workflows, Built For Your Industry',
    description: 'Your workflow, running itself — agents do the repetition, humans keep the judgment.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body className="scanlines">
        <SmoothScroll>
          <Nav />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
