import FadeIn from '@/components/FadeIn'

const STATS = [
  { value: '4', label: 'Industries deployed in' },
  { value: '10+', label: 'Platform surfaces shipped' },
  { value: '1M+', label: 'Records modeled' },
]

export default function FounderSection() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center md:text-left">
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
            <dl className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
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
