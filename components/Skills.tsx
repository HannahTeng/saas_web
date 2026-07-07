'use client'

import Reveal from '@/components/ui/Reveal'

const rows = [
  {
    title: 'Agent logic',
    body: 'Agent / human boundaries, workflow decomposition, escalation design, and the approval layer that keeps judgment with the operator.',
  },
  {
    title: 'Tool connection',
    body: 'MCP servers, APIs, OAuth-connected apps, browser automation, spreadsheets, portals, and operational software already in use.',
  },
  {
    title: 'Knowledge retrieval',
    body: 'Python, SQL, ETL pipelines, local LLMs, statistical modeling, and RAG retrieval for personal or team knowledge bases.',
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-28 md:py-36">

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <p className="label">
            <span className="text-accent">04 /</span> Build system
          </p>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-fg md:text-5xl">The technical layer stays quiet.</h2>
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
