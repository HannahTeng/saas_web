'use client'

import Decode from '@/components/ui/Decode'
import Reveal from '@/components/ui/Reveal'

const tracks = [
  {
    no: '01',
    label: 'Enterprise agent',
    title: 'Agents for the work your team repeats.',
    body:
      'For logistics, brokerage, clinical, education, and operations teams: I map the workflow, encode the rules, connect the tools you already use, and keep approval with the human operator.',
    points: ['Workflow mapping', 'Human approval layer', 'ERP, portal, spreadsheet, and no-API integration'],
  },
  {
    no: '02',
    label: 'Personal agent',
    title: 'A private workspace for knowledge, search, and decisions.',
    body:
      'For individuals and small teams: I build a personal agent dashboard with a knowledge base, RAG search, document retrieval, and lightweight automations around your daily information flow.',
    points: ['Personal knowledge base', 'RAG query and retrieval', 'Agent dashboard setup'],
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative px-6 py-20 md:py-24">
      <div
        aria-hidden
        className="absolute right-0 top-12 h-[52vh] w-[58vw] -z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(75,134,165,0.10), rgba(255,255,255,0))' }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <p className="label">
            <span className="text-accent">01 /</span> Agent systems
          </p>
          <Decode
            as="h2"
            text="Two ways to make agents useful."
            className="font-display text-3xl font-medium leading-tight tracking-tight text-fg md:text-5xl"
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tracks.map((track, i) => (
            <Reveal
              key={track.label}
              index={i}
              className="console-panel min-h-[420px] p-7 md:p-10"
            >
              <div className="flex h-full flex-col">
                <div className="mb-12 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {track.no}
                  </span>
                  <span className="label !text-dim">{track.label}</span>
                </div>

                <h3 className="max-w-lg font-display text-3xl font-medium leading-tight tracking-tight text-fg md:text-4xl">
                  {track.title}
                </h3>
                <p className="mt-6 max-w-xl font-display text-base font-light leading-relaxed text-mid md:text-[17px]">
                  {track.body}
                </p>

                <div className="mt-auto grid gap-3 pt-10">
                  {track.points.map((point) => (
                    <div key={point} className="border-t border-edge pt-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mid">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
