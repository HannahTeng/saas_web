import FadeIn from '@/components/FadeIn'

const STATS = [
  { value: '4', label: 'Industries deployed in' },
  { value: '10+', label: 'Platform surfaces shipped' },
  { value: '1M+', label: 'Records modeled' },
]

export default function FounderSection() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Placeholder portrait — swap for a next/image photo when available */}
        <FadeIn>
          <div
            aria-label="Portrait of Hannah Teng (placeholder)"
            role="img"
            className="relative aspect-[4/5] rounded-2xl border border-white/[0.06] overflow-hidden flex items-center justify-center"
            style={{
              background:
                'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.18) 0%, transparent 55%), linear-gradient(160deg, #141414 0%, #0A0A0A 100%)',
            }}
          >
            <span className="text-7xl font-bold tracking-tight text-white/10 select-none">HT</span>
            <span className="absolute bottom-4 left-4 text-xs text-gray-600">
              Forward-deployed · Los Angeles
            </span>
          </div>
        </FadeIn>

        <div>
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Hi, I&apos;m <em className="em-accent">Hannah</em>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="mt-6 text-gray-400 leading-relaxed">
              I&apos;m Hannah Teng — a forward-deployed engineer. That means I don&apos;t build from
              an office and hand you a login: I sit with your dispatchers, brokers, and data
              managers, learn the workflow from the people who run it, and stay embedded until the
              agent genuinely carries the load.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Every deployment so far — real dispatcher thresholds turned into agent rules, a
              clinical agent running inside researchers&apos; existing platform — followed the same
              principle: the agent adapts to your work, never the other way around.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-3xl font-bold text-white">{s.value}</dd>
                  <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
