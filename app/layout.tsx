import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import { LanguageProvider } from '@/components/LanguageProvider'
import { OrderProvider } from '@/components/order/OrderProvider'
import OrderPanel from '@/components/order/OrderPanel'
import { PaymentNotice } from '@/components/order/PaymentNotice'
import { StickyOrderBar, StickyOrderSpacer } from '@/components/order/OrderButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flowact — AI Agents Built Around Your Work',
  description:
    'Flowact provides AI agent consulting and development services.',
  keywords: ['Flowact', 'AI Agents', 'Agentic AI', 'Workflow Automation', 'Human-in-the-loop', 'Logistics AI', 'Enterprise AI'],
  openGraph: {
    title: 'Flowact — AI Agents Built Around Your Work',
    description: 'AI agent consulting and development services.',
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
            <StickyOrderSpacer />
            <OrderPanel />
            <StickyOrderBar />
            <PaymentNotice />
          </OrderProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
