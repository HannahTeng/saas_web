import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Refund Policy — Flowact', description: 'Refunds and cancellations for Flowact consulting and development services.' }

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund and Cancellation Policy"
      updated="November 6, 2026"
      intro="Flowact, Inc. provides AI agent consulting and development services. This policy explains how refunds and cancellations work."
      sections={[
        { h: 'Free workflow assessment', p: [
          'The workflow assessment is free, so there is nothing to pay or refund.',
        ] },
        { h: 'Fixed-quote builds', p: [
          'Each build is priced by a written quote that lists deliverables and milestones. Where a quote includes a deposit, the deposit is refundable in full if you cancel before work starts. After work starts, fees cover work already performed; if you cancel, you pay only for completed milestones and work in progress up to the cancellation date, and any prepaid amount beyond that is refunded.',
          'If a delivered milestone does not meet the acceptance criteria in the quote, we will fix it at no extra cost. If we cannot, we will refund the fee for that milestone.',
        ] },
        { h: 'Monthly and annual plans', p: [
          'Monthly managed plans can be cancelled any time; cancellation takes effect at the end of the current billing month and is not prorated. Annual licenses are refundable on a prorated basis within the first 30 days; after that, they can be cancelled at renewal.',
        ] },
        { h: 'How to request a refund', p: [
          'Email support@flowact.net with your company name and invoice number. We respond within 2 business days. Approved refunds are returned to the original payment method within 5–10 business days.',
        ] },
      ]}
    />
  )
}
