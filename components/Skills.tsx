'use client'

import Decode from '@/components/ui/Decode'
import Reveal from '@/components/ui/Reveal'

const rows = [
  {
    title: 'Agent logic',
    body: 'Agent / human boundaries, workflow decomposition, escalation design, and the approval layer that keeps judgment with the operator.',
  },
  {
    title: 'Tool connection',
    body: 'MCP servers, APIs, OAuth-connected apps, browser automation, spreadsheets, portals, and no-API systems.',
  },
  {
    title: 'Knowledge retrieval',
    body: 'Python, SQL, ETL pipelines, local LLMs, statistical modeling, and RAG retrieval for personal or team knowledge bases.',
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-20 md:py-24">
      <div
        aria-hidden
        className="absolute bottom-0 left-1/4 h-[45vh] w-[50vw] -z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(120deg, transparent, rgba(75,134,165,0.08), rgba(255,255,255,0.7))' }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <p className="label">
            <span className="text-accent">04 /</span> Build system
          </p>
          <Decode
            as="h2"
            text="The technical layer stays quiet."
            className="font-display text-3xl font-medium leading-tight tracking-tight text-fg md:text-5xl"
          />
        </div>

        <div className="mt-12 divide-y divide-edge border-y border-edge">
          {rows.map((row, i) => (
            <Reveal key={row.title} index={i}>
              <div className="grid gap-4 py-7 md:grid-cols-[0.35fr_1fr] md:py-9">
                <h3 className="font-display text-xl font-medium tracking-tight text-fg md:text-2xl">
                  {row.title}
                </h3>
                <p className="max-w-3xl font-display text-base font-light leading-relaxed text-mid md:text-[17px]">
                  {row.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
