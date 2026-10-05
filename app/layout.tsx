import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import { LanguageProvider } from '@/components/LanguageProvider'
import { OrderProvider } from '@/components/order/OrderProvider'
import OrderPanel from '@/components/order/OrderPanel'
import { StickyOrderBar } from '@/components/order/OrderButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flowact — AI Agents Built Around Your Work',
  description:
    'Flowact builds deployable AI agents that run inside the systems a team already uses, with human approval built in. Data, Dispatch and Docs agents live at clients; delivered across 10+ industries.',
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
        <LanguageProvider>
          <OrderProvider>
            {children}
            <OrderPanel />
            <StickyOrderBar />
          </OrderProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
