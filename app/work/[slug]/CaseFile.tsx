'use client'

import Reveal from '@/components/ui/Reveal'
import type { Project } from '@/lib/projects'

/** Animated body of a /work/[slug] case-file page. */
export default function CaseFile({ p }: { p: Project }) {
  return (
    <article className="mt-10">
      <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-accent mb-3">
        case_file://{p.no}&nbsp;&nbsp;·&nbsp;&nbsp;[{p.status}]
      </p>
      <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-fg tracking-tight leading-[1.02]">{p.title}</h1>
      <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.14em] text-dim mt-4">
        {p.subtitle}
      </p>

      {/* console metadata readout */}
      <Reveal index={1} className="mt-10">
        <div className="console-panel grid grid-cols-2 md:grid-cols-4 gap-px bg-edge border border-edge overflow-hidden">
          {p.meta.map((m) => (
            <div key={m.k} className="bg-white/70 p-4">
              <p className="label mb-1.5">{m.k}</p>
              <p className="font-mono text-[11px] md:text-xs text-fg leading-snug">{m.v}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal index={2} className="mt-10">
        <p className="label !text-accent mb-4">[brief]</p>
        <p className="font-display font-light text-mid text-lg md:text-xl leading-relaxed max-w-3xl">
          {p.description}
        </p>
      </Reveal>

      <Reveal index={3} className="mt-10">
        <p className="label !text-accent mb-4">[stack]</p>
        <div className="flex flex-wrap gap-2">
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] md:text-xs text-mid bg-white/58 border border-edge px-3 py-1.5 hover:border-accent hover:text-accent transition-colors duration-200"
              data-hover
            >
              {tag}
            </span>
          ))}
          {p.highlight && <span className="chip self-center">{p.highlight}</span>}
        </div>
      </Reveal>
    </article>
  )
}
