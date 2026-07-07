import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'

const AVATAR_NAMES = ['Dispatch Ops', 'Clinical DM', 'Customs Broker', 'Edu Team', 'Ecom Ops']

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Faint radial orbs for depth */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[70rem] h-[40rem] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-32 md:pt-40 pb-16 md:pb-20 text-center">
        <FadeIn>
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-6">
            Agentic workflows · Forward-deployed · Built by Hannah Teng
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl mx-auto">
            Your workflow, <em className="em-accent">running itself.</em>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The task your team repeats every day — filing, checking, matching, dispatching — can
            become an AI agent that does the repetitive part and hands you the decision. I sit with
            your team, learn how the work actually flows, and deploy an agent around it. No API? I
            connect to whatever you already use — spreadsheets, ERPs, portals, even browser-only
            systems. You approve; the agent executes.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-8 flex items-center justify-center">
            <div className="flex pl-2">
              {AVATAR_NAMES.map((n) => (
                <Avatar key={n} name={n} className="w-8 h-8 border-2 border-black -ml-2" />
              ))}
            </div>
            <p className="ml-3 text-sm text-gray-500">Deployed across 4 industries</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="bg-white text-black font-medium px-8 py-3.5 rounded-full hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(245,158,11,0.15)]"
            >
              Start your agent →
            </a>
            <a
              href="#how-it-works"
              className="bg-transparent border border-white/10 text-white px-6 py-3 rounded-full hover:bg-white/5 transition-colors text-sm"
            >
              See how it works ↓
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
