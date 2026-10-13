import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Privacy Policy — Flowact', description: 'How Flowact handles personal information.' }

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 13, 2026"
      intro="This policy explains how Flowact, Inc. (“Flowact”) collects and uses information when you visit flowact.net or work with us on AI agent consulting and development services."
      sections={[
        { h: 'Information we collect', p: [[
          'Contact details you give us: name, company, email address or phone number.',
          'What you tell us about your request, for example a description of the workflow you want automated.',
          'Billing details needed to invoice you. Card details, if any, are handled by our payment provider and are not stored by Flowact.',
          'Basic technical data from your browser (such as pages visited and device type) used to run and secure the site.',
        ]] },
        { h: 'How we use it', p: [[
          'To respond to your request, schedule calls and deliver the services.',
          'To send invoices and service communications.',
          'To operate, secure and improve the website.',
          'To meet legal and accounting obligations.',
        ], 'We do not sell your personal information and do not share it for cross-context behavioral advertising.'] },
        { h: 'Client data in engagements', p: [
          'When we build or run agents for you, we may process data from your systems on your behalf. We use it only to provide the services you asked for, under your instructions and the confidentiality terms of your engagement.',
        ] },
        { h: 'Service providers', p: [
          'We use trusted providers to run our business, such as website hosting, email delivery, data storage, payment processing and AI model providers. They may process information only to provide their services to us.',
        ] },
        { h: 'Retention', p: [
          'We keep information for as long as needed to provide the services and meet legal, tax and accounting requirements, then delete or anonymize it.',
        ] },
        { h: 'Your rights', p: [
          'Depending on where you live (including under the California Consumer Privacy Act), you may have the right to access, correct or delete your personal information, and to know how it is used. Email support@flowact.net to make a request. We will not discriminate against you for exercising these rights.',
        ] },
        { h: 'Security', p: [
          'We use reasonable technical and organizational measures to protect information, including encryption in transit and access controls. No method of transmission or storage is fully secure.',
        ] },
        { h: 'Children', p: [
          'Our services are for businesses and are not directed to children under 16. We do not knowingly collect their information.',
        ] },
        { h: 'Changes', p: [
          'We may update this policy. The “Last updated” date shows the current version.',
        ] },
      ]}
    />
  )
}
