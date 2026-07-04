'use client'

import Decode from '@/components/ui/Decode'
import Reveal from '@/components/ui/Reveal'
import WordFill from '@/components/ui/WordFill'

const steps = [
  {
    no: '01',
    cmd: 'map',
    title: 'We map your workflow',
    body: 'I sit with the people who actually do the work — a dispatcher, a data manager, a broker — and walk through a real day. We find the part that repeats: the lookups, the filings, the copy-paste between systems. No tech talk required; you describe the work, I translate it.',
    footer: 'you explain once — I do the listening',
  },
  {
    no: '02',
    cmd: 'encode',
    title: 'Your rules become the agent',
    body: 'Your thresholds, exceptions, and judgment calls get written into the agent as explicit rules — like a dispatcher’s real load limits (100 CBM / 44,000 lb) becoming decision logic. The agent connects to the tools you already use: spreadsheets, ERPs, email, portals — with or without an API.',
    footer: 'nothing changes about how you work — the agent adapts to you',
  },
  {
    no: '03',
    cmd: 'deploy',
    title: 'You approve, the agent executes',
    body: 'The agent proposes; you click approve. Every action stays visible and reversible, and the judgment calls remain yours. It starts on one workflow, proves itself, then grows — and I stay embedded with your team until it runs on its own.',
    footer: 'you stay in control — always',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-14 md:py-20 px-6">
      <div
        aria-hidden
        className="absolute top-0 left-1/3 w-[50vw] h-[40vh] -z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.05) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        <p className="label mb-6 md:mb-8">
          <span className="text-accent">01 /</span> How it works&nbsp;&nbsp;<span className="chip">[3 steps]</span>
        </p>

        <WordFill
          text="Any repetitive knowledge work — in any industry — can run as an agent with a human approval step."
          className="font-display font-light text-3xl sm:text-4xl md:text-6xl leading-[1.12] tracking-tight max-w-5xl"
        />

        <div className="grid md:grid-cols-3 gap-px bg-edge border border-edge mt-10 md:mt-14">
          {steps.map((s, i) => (
            <Reveal key={s.no} index={i} className="bg-void p-6 md:p-8 flex flex-col">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-dim mb-5">
                <span className="text-accent">[{s.no}]</span> $ {s.cmd}
              </p>
              <Decode
                as="h3"
                text={s.title}
                className="font-display font-medium text-xl md:text-2xl text-fg tracking-tight leading-tight mb-4"
              />
              <p className="font-display font-light text-mid text-sm md:text-[15px] leading-relaxed flex-1">
                {s.body}
              </p>
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent mt-6 pt-4 border-t border-edge">
                ▸ {s.footer}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
