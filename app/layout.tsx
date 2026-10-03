import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import { LanguageProvider } from '@/components/LanguageProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flowact — AI Agents for Logistics Operations',
  description:
    'Flowact builds deployable AI agents for logistics operations: a Data Agent, a Dispatch Agent and a Docs Agent that run inside the OMP, WMS, ERP and inbox a team already uses, with human approval built in.',
  keywords: ['Flowact', 'AI Agents', 'Agentic AI', 'Workflow Automation', 'Human-in-the-loop', 'Logistics AI', 'Enterprise AI'],
  openGraph: {
    title: 'Flowact — AI Agents Built Around Your Work',
    description: 'Agents do the repetition. Humans keep the judgment.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-page text-primary">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
