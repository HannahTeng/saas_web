import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import { LanguageProvider } from '@/components/LanguageProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flowact — AI Agents Built Around Your Work',
  description:
    'Flowact builds AI agents that sign in to the systems you already run, do the repetitive work, and stop for a person at every decision that matters. Delivered across logistics, trucking, customs, clinical data and more.',
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
