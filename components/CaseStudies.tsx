import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'
import { projects } from '@/lib/projects'

// Headline stat pulled from each case file, keyed by slug.
const STATS: Record<string, string> = {
  'agentic-dispatch-dashboard': '1-click',
  'clinical-nl-query-agent': '0 SQL',
  'customs-copilot': '300+',
  'ableedu-ai-educational-agent': '4',
  'regulated-traceability-agents': '3-tier',
}

export default function CaseStudies() {
  return (
    <section className="py-14 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Real results from <em className="em-accent">real workflows</em>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Agents do the repetition. Humans keep the judgment. Logistics, clinical trials, customs,
            education, regulated supply chains — your industry next.
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <figure className="mt-8 max-w-2xl mx-auto rounded-xl bg-[#111]/80 border border-white/[0.06] p-5 md:p-7 border-l-2 border-l-amber-500/60">
            <blockquote className="text-sm md:text-base text-gray-300 italic leading-relaxed">
              &ldquo;The matching used to eat half my morning. Now the agent proposes the load plans
              and I approve them in one click — the repetitive part is gone, but the calls are still
              mine to make.&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Avatar name="Placeholder Dispatcher" className="w-8 h-8" />
              <div>
                <p className="text-white font-medium text-sm">Placeholder Dispatcher</p>
                <p className="text-gray-500 text-sm">
                  Dispatch Lead · Cross-border logistics client
                </p>
              </div>
            </figcaption>
          </figure>
        </FadeIn>

        <div className="mt-8 md:mt-12 grid grid-cols-2 gap-3 md:gap-6">
          {projects.map((p, i) => (
            <FadeIn
              key={p.slug}
              delay={0.1 * (i % 2)}
              className={i === projects.length - 1 ? 'col-span-2 md:col-span-1' : undefined}
            >
              <article className="group flex h-full flex-col justify-between rounded-xl md:rounded-2xl bg-[#111] border border-white/[0.06] p-4 md:p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]">
                <p className="hidden md:block text-5xl font-bold text-white">{STATS[p.slug] ?? p.no}</p>
                <h3 className="md:mt-4 text-sm md:text-xl font-semibold leading-snug text-white">
                  {p.title}
                </h3>
                <p className="mt-3 hidden md:block text-base text-gray-400 leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-4 md:mt-6 pt-3 md:pt-5 border-t border-white/5 flex flex-col md:flex-row md:items-start lg:items-center md:justify-between gap-2 md:gap-4">
                  <p className="text-[10px] md:text-sm text-gray-500 leading-snug">{p.subtitle}</p>
                  <span className="hidden md:inline-flex w-fit shrink-0 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-400 px-3 py-1">
                    {p.status}
                  </span>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
