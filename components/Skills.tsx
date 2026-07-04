'use client'

import Decode from '@/components/ui/Decode'
import Reveal from '@/components/ui/Reveal'

const groups = [
  {
    cat: 'Agentic System Design',
    skills: ['Agent / Human Boundaries', 'Human-in-the-loop', 'Workflow Decomposition', 'Escalation Design'],
  },
  {
    cat: 'Connect to Anything',
    skills: ['MCP Servers & APIs', 'OAuth-connected Apps', 'Browser Automation', 'Playwright · Firecrawl', 'No-API Systems'],
  },
  {
    cat: 'Interfaces That Ship',
    skills: ['Next.js · React', 'ag-grid Dashboards', 'React Native', 'Figma → Production'],
  },
  {
    cat: 'Grounded in Data',
    skills: ['Python · R · SQL', 'Statistical Modeling', 'A/B Testing', 'ETL Pipelines', 'Local LLMs (Ollama)'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative py-14 md:py-20 px-6">
      <div
        aria-hidden
        className="absolute bottom-0 left-1/4 w-[50vw] h-[45vh] -z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.05) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-10">
          <p className="label mb-5">
            <span className="text-accent">04 /</span> Capabilities&nbsp;&nbsp;<span className="chip">[modules loaded]</span>
          </p>
          <Decode
            as="h2"
            text="What your agent is built with"
            className="font-display font-medium text-4xl md:text-6xl text-fg tracking-tight"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-edge border border-edge">
          {groups.map((g, i) => (
            <Reveal key={g.cat} index={i % 4} className="bg-void p-3.5 sm:p-5 md:p-6">
              <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-accent mb-3 md:mb-4">
                <span className="text-dim">$</span> {g.cat}
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    data-hover
                    className="font-mono text-[9px] md:text-[11px] text-mid bg-panel border border-edge px-2 py-0.5 md:px-2.5 md:py-1 hover:border-accent hover:text-accent hover:shadow-glowSm transition-all duration-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
