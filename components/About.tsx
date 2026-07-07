'use client'

import Reveal from '@/components/ui/Reveal'
import Counter from '@/components/ui/Counter'

const stats = [
  { el: <Counter value={4} />, label: 'Industries deployed in' },
  { el: <Counter value={4} />, label: 'Client engagements as FDE' },
  { el: <Counter value={10} suffix="+" />, label: 'Platform surfaces shipped' },
  { el: <Counter value={1} suffix="M+" />, label: 'Records modeled' },
]

const deployments = [
  {
    where: 'BiRoot AI · Forward-Deployed Engineer',
    when: '2026 – present',
    what: 'Embedded with four client teams — logistics, customs brokerage, education, e-commerce — running discovery with non-technical operators, drawing the agent/human boundary, and shipping the interfaces that deliver it.',
  },
  {
    where: 'USC-ATRI · Clinical data agent',
    when: '2026',
    what: 'Deploying a natural-language query agent inside the platform clinical data managers already use for Alzheimer’s trial data quality control.',
  },
  {
    where: 'UCLA · MSc Data Science in Health',
    when: '2025 – 2027',
    what: 'The data science depth behind the agents — statistical modeling on million-record datasets, so agent logic is grounded in evidence, not vibes.',
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="label mb-6 md:mb-8">
          <span className="text-accent">03 /</span> Who builds this&nbsp;&nbsp;<span className="chip">[operator]</span>
        </p>

        <div className="grid md:grid-cols-[1fr_1fr] gap-8 md:gap-12 items-start">
          <div className="space-y-5">
            <h2 className="font-display font-medium text-3xl md:text-4xl text-fg tracking-tight leading-tight">I deploy with your team, not at it.</h2>
            <Reveal index={1}>
              <p className="font-display font-light text-mid text-[15px] leading-relaxed">
                I&apos;m Hannah Teng — a forward-deployed engineer. That means I don&apos;t build
                from an office and hand you a login: I sit with your dispatchers, brokers, and data
                managers, learn the workflow from the people who run it, and stay embedded until the
                agent genuinely carries the load.
              </p>
            </Reveal>
            <Reveal index={2}>
              <p className="font-display font-light text-mid text-[15px] leading-relaxed">
                Every deployment so far — real dispatcher thresholds turned into agent rules, a
                clinical agent running inside researchers&apos; existing platform — followed the
                same principle: the agent adapts to your work, never the other way around.
              </p>
            </Reveal>
          </div>

          <div className="space-y-4">
            <p className="label mb-5">
              Deploy history&nbsp;&nbsp;<span className="chip">[records: 3]</span>
            </p>
            {deployments.map((d, i) => (
              <Reveal key={d.where} index={i}>
                <div className="border-t border-edge pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-display font-medium text-base text-fg">{d.where}</p>
                    <span className="font-mono text-xs text-dim whitespace-nowrap">{d.when}</span>
                  </div>
                  <p className="font-display font-light text-sm text-mid mt-1.5 leading-relaxed">{d.what}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-12 md:mt-14">
          {stats.map((s, i) => (
            <Reveal key={i} index={i} className="console-panel p-5 md:p-7">
              <p className="font-mono font-medium text-3xl md:text-4xl text-accent leading-none">
                {s.el}
              </p>
              <p className="label mt-3">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
