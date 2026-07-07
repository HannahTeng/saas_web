import FadeIn from '@/components/FadeIn'

const PAINS = [
  'Endless meetings, vague proposals, and months of waiting for a demo',
  'Ripping out the tools your team already uses to fit the software',
  'Black-box automation that takes the judgment calls away from your people',
]

const WINS = [
  {
    title: 'We map your workflow',
    body: 'You describe the work with the people who actually do it — no tech talk required. I do the listening and find the part that repeats.',
  },
  {
    title: 'Your rules become the agent',
    body: 'Your thresholds, exceptions, and judgment calls get written into the agent as explicit rules. It connects to spreadsheets, ERPs, email, portals — with or without an API.',
  },
  {
    title: 'You approve, the agent executes',
    body: 'The agent proposes; you click approve. Every action stays visible and reversible, and the judgment calls remain yours.',
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
        <FadeIn className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            AI is moving fast. Your workflow <em className="em-accent">should too…</em>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Any repetitive knowledge work — in any industry — can run as an agent with a human
            approval step.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn delay={0.1}>
            <div className="h-full rounded-2xl bg-[#111]/80 border border-red-500/10 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white">You don&apos;t have to</h3>
              <p className="mt-2 text-sm text-gray-500">
                Deal with the way AI projects usually go
              </p>
              <ul className="mt-6 space-y-4">
                {PAINS.map((p) => (
                  <li key={p} className="flex gap-3 text-gray-400 text-base leading-relaxed">
                    <Cross />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="h-full rounded-2xl bg-[#111]/80 border border-emerald-400/15 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white">Instead you could</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get an agent deployed around the work you already do
              </p>
              <ul className="mt-6 space-y-4">
                {WINS.map((w) => (
                  <li key={w.title} className="flex gap-3">
                    <Check />
                    <span className="text-base leading-relaxed">
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
