import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter'
import { LanguageProvider } from '@/components/LanguageProvider'
import { OrderProvider } from '@/components/order/OrderProvider'
import OrderPanel from '@/components/order/OrderPanel'
import { PaymentNotice } from '@/components/order/PaymentNotice'
import { StickyOrderBar, StickyOrderSpacer } from '@/components/order/OrderButton'
import './globals.css'

const SITE = 'https://flowact.net'
const TITLE = 'Flowact — AI Agents Built Around Your Work'
const DESCRIPTION = 'Flowact builds AI agents that run inside the systems a company already uses: they analyze, act and answer, and wait for a person on every decision that matters.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Flowact', 'AI agents', 'Agentic AI', 'Workflow automation', 'Human-in-the-loop', 'Enterprise AI'],
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website', url: SITE, siteName: 'Flowact', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: '#080808', colorScheme: 'dark' }

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
