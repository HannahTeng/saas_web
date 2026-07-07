import FadeIn from '@/components/FadeIn'
import { projects } from '@/lib/projects'

// Headline stat pulled from each case file, keyed by slug.
const STATS: Record<string, string> = {
  'agentic-dispatch-dashboard': '1-click',
  'clinical-nl-query-agent': '0 SQL',
  'customs-copilot': '300+',
  'ableedu-ai-educational-agent': '4',
}

export default function CaseStudies() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Real results from <em className="em-accent">real workflows</em>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Agents do the repetition. Humans keep the judgment. Logistics, clinical trials, customs,
            education — your industry next.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <FadeIn key={p.slug} delay={0.1 * (i % 2)}>
              <article className="group h-full rounded-2xl bg-[#111] border border-white/[0.06] p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]">
                <p className="text-5xl font-bold text-white">{STATS[p.slug] ?? p.no}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{p.title}</h3>
                <p className="mt-3 text-gray-400 leading-relaxed">{p.description}</p>
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">{p.subtitle}</p>
                  <span className="shrink-0 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-400 px-3 py-1">
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
