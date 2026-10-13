import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Terms of Service — Flowact', description: 'Terms for Flowact AI agent consulting and development services.' }

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 13, 2026"
      intro="These Terms govern your use of flowact.net and the services provided by Flowact, Inc. (“Flowact”, “we”, “us”). Flowact provides AI agent consulting and development services to businesses. By booking a call, accepting a quote or using our website, you agree to these Terms."
      sections={[
        { h: 'Our services', p: [
          'Flowact provides AI agent consulting and development services: scoping calls, workflow analysis, and the design, build, deployment and maintenance of AI agents for your business. We work directly with you as the service provider.',
          'The specific deliverables, timeline and price for any build are set out in a written quote or statement of work (“Quote”). If a Quote conflicts with these Terms, the Quote controls for that engagement.',
        ] },
        { h: 'Scoping calls', p: [
          'A scoping call is a paid, 60-minute consultation (currently $39 USD) in which we review your workflow and systems. After the call we send a written plan and a fixed quote. You are under no obligation to accept the quote.',
        ] },
        { h: 'Fees and payment', p: [
          'Fees are stated in US dollars in the Quote or on our website. We invoice for services; payment terms are stated on each invoice. Ongoing maintenance or managed-service plans are billed monthly or annually as stated in the Quote and may be cancelled as described there.',
          'Usage-based costs (for example model and compute usage) are billed as described in the Quote.',
          'Refunds are handled under our Refund Policy at flowact.net/refund.',
        ] },
        { h: 'Your responsibilities', p: [
          'You confirm you are acting on behalf of a business and have authority to agree to these Terms. You are responsible for the accuracy of information you give us, for having the rights to any data or system access you provide, and for reviewing and approving actions taken by agents in your environment where approval checkpoints are configured.',
        ] },
        { h: 'Intellectual property', p: [
          'You keep all rights to your data and materials. Unless a Quote states otherwise, on full payment you receive a license to use the agents and configurations we deliver for your internal business purposes. Flowact keeps ownership of its pre-existing tools, frameworks, know-how and general improvements, and may reuse them in other work without using your confidential information.',
        ] },
        { h: 'Confidentiality', p: [
          'Each party will keep the other’s non-public information confidential and use it only to perform or receive the services. This does not apply to information that is public, already known, independently developed or lawfully received from a third party.',
        ] },
        { h: 'Warranties and disclaimers', p: [
          'We perform services with reasonable skill and care. AI systems can produce incorrect output; agents are designed to work with human review, and you remain responsible for business decisions made using them. Except as stated in a Quote, the services and website are provided “as is” without other warranties, to the extent permitted by law.',
        ] },
        { h: 'Limitation of liability', p: [
          'To the extent permitted by law, neither party is liable for indirect, incidental, special or consequential damages, or lost profits. Flowact’s total liability for any claim is limited to the fees you paid for the services giving rise to the claim in the 12 months before it arose.',
        ] },
        { h: 'Termination', p: [
          'Either party may end an engagement as set out in the Quote. If a Quote is silent, either party may end it with 14 days’ written notice; you pay for work performed up to the end date.',
        ] },
        { h: 'Governing law', p: [
          'These Terms are governed by the laws of the State of California, without regard to conflict-of-law rules. Disputes will be resolved in the state or federal courts located in Los Angeles County, California.',
        ] },
        { h: 'Changes', p: [
          'We may update these Terms. The “Last updated” date shows the current version. Changes do not affect a Quote you have already accepted.',
        ] },
      ]}
    />
  )
}
