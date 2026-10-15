import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Section from '@/components/Section'

export type LegalSection = { h: string; p: (string | string[])[] }

/** Shared layout for the policy pages (Terms, Privacy, Refund). Plain server component, no client state. */
export default function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <Navbar />
      <main>
        <Section rule={false}>
          <article className="max-w-3xl">
            <h1 className="h-section">{title}</h1>
            <p className="mt-2 text-sm text-subtle">Last updated: {updated}</p>
            <p className="mt-6 leading-relaxed text-muted">{intro}</p>
            {sections.map((s, i) => (
              <section key={s.h} className="mt-10">
                <h2 className="h-card">{i + 1}. {s.h}</h2>
                {s.p.map((block, j) =>
                  Array.isArray(block) ? (
                    <ul key={j} className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-muted">
                      {block.map((li) => <li key={li}>{li}</li>)}
                    </ul>
                  ) : (
                    <p key={j} className="mt-3 leading-relaxed text-muted">{block}</p>
                  ),
                )}
              </section>
            ))}
            <p className="mt-12 border-t border-line/10 pt-6 text-sm text-subtle">
              Questions about this policy: <a className="underline hover:text-primary" href="mailto:support@flowact.net">support@flowact.net</a>
            </p>
          </article>
        </Section>
      </main>
      <Footer />
    </>
  )
}
