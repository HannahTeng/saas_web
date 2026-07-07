'use client'

import Reveal from '@/components/ui/Reveal'

const tracks = [
  {
    no: '01',
    label: 'Enterprise agent workflow',
    title: 'Operational agents for teams.',
    body:
      'Custom agent workflows for teams that need intake, routing, checking, drafting, dispatch, reporting, and approval layers across existing operational tools.',
    points: ['Workflow architecture', 'Role-based approval', 'System integration'],
  },
  {
    no: '02',
    label: 'Personal knowledge dashboard',
    title: 'Private workspaces for knowledge.',
    body:
      'Personal and small-team dashboards for documents, notes, retrieval, LLM-assisted search, structured summaries, and lightweight automations around daily knowledge work.',
    points: ['Knowledge base setup', 'Retrieval and LLM layer', 'Dashboard and workflow UI'],
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative px-6 py-28 md:py-36">

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <p className="label">
            <span className="text-accent">01 /</span> Product design
          </p>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-fg md:text-5xl">Agent products with clear operating models.</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tracks.map((track, i) => (
            <Reveal
              key={track.label}
              index={i}
              className="console-panel min-h-[430px] p-7 md:p-10"
            >
              <div className="flex h-full flex-col">
                <div className="mb-10 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {track.no}
                  </span>
                  <span className="label !text-dim">{track.label}</span>
                </div>

                <h3 className="max-w-lg font-display text-2xl font-medium leading-tight tracking-tight text-fg md:text-4xl">
                  {track.title}
                </h3>
                <p className="mt-6 max-w-xl font-display text-base font-light leading-relaxed text-mid">
                  {track.body}
                </p>

                <div className="mt-auto grid gap-0 pt-10">
                  {track.points.map((point, pointIndex) => (
                    <div key={point} className="grid grid-cols-[36px_1fr] border-t border-edge py-4">
                      <span className="font-mono text-[10px] text-accent">
                        {String(pointIndex + 1).padStart(2, '0')}
                      </span>
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
