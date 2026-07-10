import FadeIn from '@/components/FadeIn'

const PAINS = [
  'Months of meetings before anything real ships',
  'Tool migrations just to fit someone else’s software',
  'Black-box automation that hides the judgment calls',
]

const WINS = [
  {
    title: 'Map',
    body: 'Trace the actual workflow with the people doing the work.',
  },
  {
    title: 'Encode',
    body: 'Turn rules, exceptions, and approval points into agent behavior.',
  },
  {
    title: 'Deploy',
    body: 'Ship inside existing tools, with human review where it matters.',
  },
]

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 shrink-0 text-red-400/70">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 shrink-0 text-emerald-400/80">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ProblemSolution() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 px-6 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
            Operating model
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Keep the tools. Upgrade the workflow.
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-400">
            AI work should feel like a practical systems upgrade, not a vague transformation
            project.
          </p>
        </FadeIn>

        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-6">
          <FadeIn delay={0.1}>
            <div className="h-full border-l border-red-400/25 bg-red-400/[0.025] p-4 md:p-6">
              <h3 className="text-base md:text-xl font-semibold text-white">Avoid</h3>
              <ul className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                {PAINS.map((p) => (
                  <li key={p} className="flex gap-2 md:gap-3 text-gray-400 text-xs md:text-base leading-relaxed">
                    <Cross />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="h-full border-l border-emerald-300/30 bg-emerald-300/[0.035] p-4 md:p-6">
              <h3 className="text-base md:text-xl font-semibold text-white">Ship</h3>
              <ul className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                {WINS.map((w) => (
                  <li key={w.title} className="flex gap-2 md:gap-3">
                    <Check />
                    <span className="text-xs md:text-base leading-relaxed">
                      <span className="text-white font-medium">{w.title}.</span>{' '}
                      <span className="text-gray-400">{w.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
