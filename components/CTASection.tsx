import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'

const CHECKLIST = [
  'Clear feedback on where an agent fits in your workflow',
  'Realistic scope and timeline — from the engineer who will build it',
  'A fast-track to your first deployed, human-approved agent',
]

const AVATAR_NAMES = ['Dispatch Ops', 'Clinical DM', 'Customs Broker', 'Edu Team', 'Traceability']

const STATS = [
  { value: '5', label: 'Industry cases' },
  { value: '10+', label: 'Platform surfaces shipped' },
  { value: '1M+', label: 'Records modeled' },
]

const PROJECT_INPUTS = [
  'Workflow you want automated',
  'Screen recording or written steps',
  'Test account, test data, or sample files',
  'Exception rules and human review points',
]

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 shrink-0 text-amber-400">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CTASection() {
  return (
    <section id="contact" className="relative py-20 md:py-32 px-6 scroll-mt-16">
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(60rem,140vw)] h-[30rem] pointer-events-none overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.09) 0%, rgba(59,130,246,0.04) 50%, transparent 75%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div>
          <FadeIn>
            <div className="mb-12 border-b border-white/5 pb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Hi, I&apos;m <em className="em-accent">Hannah</em>
              </h2>
              <p className="mt-6 text-gray-400 leading-relaxed">
                I&apos;m Hannah Teng — a forward-deployed engineer. That means I don&apos;t build
                from an office and hand you a login: I sit with your dispatchers, brokers, and data
                managers, learn the workflow from the people who run it, and stay embedded until the
                agent genuinely carries the load.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Every deployment so far — real dispatcher thresholds turned into agent rules, a
                clinical agent running inside researchers&apos; existing platform — followed the same
                principle: the agent adapts to your work, never the other way around.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-4 md:gap-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl md:text-3xl font-bold text-white">{s.value}</dd>
                    <p className="mt-1 text-xs md:text-sm text-gray-500 leading-snug">{s.label}</p>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>

          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Let&apos;s build <em className="em-accent">something.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-gray-400 leading-relaxed">
              Tell me about the task your team repeats every day. I&apos;ll map the workflow with
              the people who run it, draw the agent/human boundary, and come back with a concrete
              plan — the agent does the repetition, your team keeps the judgment.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <ul className="mt-8 space-y-4">
              {CHECKLIST.map((c) => (
                <li key={c} className="flex gap-3 text-gray-300 leading-relaxed">
                  <Check />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="rounded-2xl bg-[#111]/80 border border-white/[0.06] p-8 md:p-10 backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-white leading-snug">
              Start with the workflow. I&apos;ll send back a concrete plan.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Best for rule-clear, repetitive workflows. I keep a human approval step where judgment
              or risk matters.
            </p>

            <form
              action="https://formsubmit.co/6b47f16c7f6b9c2ab14b5f318ada11e1"
              method="POST"
              className="mt-8 space-y-4"
            >
              <input type="hidden" name="_subject" value="New AI agent workflow request" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="true" />
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </span>
                  <input
                    required
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-amber-400/70"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </span>
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-amber-400/70"
                    placeholder="you@company.com"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Company / team
                </span>
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-amber-400/70"
                  placeholder="Company, department, or team"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  What should the agent do?
                </span>
                <textarea
                  required
                  name="workflow"
                  rows={5}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-amber-400/70"
                  placeholder="Example: query, download, organize, fill forms, generate results, then wait for approval."
                />
              </label>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Helpful materials
                </p>
                <div className="mt-3 grid gap-2">
                  {PROJECT_INPUTS.map((item) => (
                    <label key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        name="available_materials"
                        value={item}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-amber-400 focus:ring-amber-400/40"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Notes, timeline, or budget range
                </span>
                <textarea
                  name="notes"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-amber-400/70"
                  placeholder="Include platforms, urgency, and what must stay manual."
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-white px-6 py-4 text-center font-medium text-black transition-colors hover:bg-gray-200"
              >
                Send workflow request →
              </button>
            </form>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Sends to hannahteng777@gmail.com · third-party model, server, account, and tool fees
              are quoted separately
            </p>

            <figure className="mt-8 pt-6 border-t border-white/5">
              <blockquote className="text-sm text-gray-400 italic leading-relaxed">
                &ldquo;You describe the work, she translates it. No tech talk required.&rdquo;
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5">
                <Avatar name="Placeholder Broker" className="w-8 h-8" />
                <p className="text-sm text-gray-500">
                  <span className="text-gray-300">Placeholder Broker</span> · Customs brokerage
                </p>
              </figcaption>
            </figure>

            <div className="mt-6 flex items-center">
              <div className="flex pl-2">
                {AVATAR_NAMES.map((n) => (
                  <Avatar key={n} name={n} className="w-8 h-8 border-2 border-[#111] -ml-2" />
                ))}
              </div>
              <p className="ml-3 text-sm text-gray-500">10+ platform surfaces shipped</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
