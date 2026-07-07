import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'

const CHECKLIST = [
  'Clear feedback on where an agent fits in your workflow',
  'Realistic scope and timeline — from the engineer who will build it',
  'A fast-track to your first deployed, human-approved agent',
]

const AVATAR_NAMES = ['Dispatch Ops', 'Clinical DM', 'Customs Broker', 'Edu Team', 'Ecom Ops']

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 shrink-0 text-amber-400">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CTASection() {
  return (
    <section id="contact" className="relative py-20 md:py-32 px-6 overflow-hidden scroll-mt-16">
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.09) 0%, rgba(59,130,246,0.04) 50%, transparent 75%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
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
              You know the work. Now let&apos;s make it run itself.
            </h3>
            <a
              href="mailto:hannahteng777@gmail.com"
              className="mt-8 block w-full text-center bg-white text-black font-medium px-6 py-4 rounded-full hover:bg-gray-200 transition-colors"
            >
              Start your agent →
            </a>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Taking new workflows · limited embedded engagements
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
              <p className="ml-3 text-sm text-gray-500">Deployed across 4 industries</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
