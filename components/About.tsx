'use client'

import Decode from '@/components/ui/Decode'
import Reveal from '@/components/ui/Reveal'
import WordFill from '@/components/ui/WordFill'
import Counter from '@/components/ui/Counter'
import ScanReveal from '@/components/ui/ScanReveal'

const stats = [
  { el: <Counter value={3.83} decimals={2} />, label: 'GPA at UCLA' },
  { el: <Counter value={10} suffix="+" />, label: 'Platform surfaces shipped' },
  { el: <Counter value={206} suffix="×" />, label: 'Specialty vs. geography' },
  { el: <Counter value={4} />, label: 'Industries deployed' },
]

const education = [
  { school: 'UCLA', degree: 'MSc Data Science in Health', years: '2025 – 2027', note: 'GPA 3.83 / 4.0' },
  { school: 'University of Nottingham', degree: 'BSc (Hons) Int. Business & Economics / Statistics', years: '2021 – 2025', note: 'Data Scholarship · Top 1%' },
]

export default function About() {
  return (
    <section id="about" className="relative py-14 md:py-20 px-6">
      {/* local glow keeps the shared background evolving, not jumping */}
      <div
        aria-hidden
        className="absolute top-0 left-1/3 w-[50vw] h-[40vh] -z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.05) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        <p className="label mb-6 md:mb-8">
          <span className="text-accent">01 /</span> About&nbsp;&nbsp;<span className="chip">[profile]</span>
        </p>

        {/* Signature scrub statement */}
        <WordFill
          text="I turn messy clinical and business data into products people actually use — the models, the agents, and the interfaces that ship them."
          className="font-display font-light text-3xl sm:text-4xl md:text-6xl leading-[1.12] tracking-tight max-w-5xl"
        />

        {/* Count-up stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-edge border border-edge mt-10 md:mt-12">
          {stats.map((s, i) => (
            <Reveal key={i} index={i} className="bg-void p-5 md:p-7">
              <p className="font-mono font-medium text-3xl md:text-4xl text-accent leading-none">
                {s.el}
              </p>
              <p className="label mt-3">{s.label}</p>
            </Reveal>
          ))}
        </div>

        {/* Bio + portrait + education */}
        <div className="grid md:grid-cols-[auto_1fr_1fr] gap-8 md:gap-12 mt-12 md:mt-14 items-start">
          <Reveal className="hidden md:block">
            <div className="corners relative w-[190px] border border-edge">
              <ScanReveal>
                <img src="/profile.jpg" alt="Hannah Teng" className="block w-full h-auto grayscale contrast-110" />
              </ScanReveal>
              <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-dim mt-2 px-1 pb-1">
                img://profile.jpg
              </p>
            </div>
          </Reveal>

          <div className="space-y-5">
            <Decode
              as="h2"
              text="Between data science and product."
              className="font-display font-medium text-2xl md:text-3xl text-fg tracking-tight leading-tight"
            />
            <Reveal index={1}>
              <p className="font-display font-light text-mid text-[15px] leading-relaxed">
                I&apos;m a first-year MSc student in Data Science in Health at UCLA, with a Statistics
                background from Nottingham. I model clinical and business data — then design and ship the
                agents, dashboards, and interfaces that put it to work.
              </p>
            </Reveal>
            <Reveal index={2}>
              <p className="font-display font-light text-mid text-[15px] leading-relaxed">
                As a forward-deployed engineer I&apos;ve embedded across four industries, run discovery
                directly with non-technical operators, drawn the line between where AI agents act and where
                humans stay in the loop, and owned the frontend that ships it. Currently building an
                in-platform natural-language query agent for clinical data managers at USC-ATRI.
              </p>
            </Reveal>
          </div>

          <div className="space-y-4">
            <p className="label mb-5">
              Education&nbsp;&nbsp;<span className="chip">[records: 2]</span>
            </p>
            {education.map((edu, i) => (
              <Reveal key={edu.school} index={i}>
                <div className="border-t border-edge pt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display font-medium text-lg text-fg">{edu.school}</p>
                    <p className="font-display font-light text-sm text-mid mt-1">{edu.degree}</p>
                    <p className="label mt-2 !text-accent">{edu.note}</p>
                  </div>
                  <span className="font-mono text-xs text-dim whitespace-nowrap">{edu.years}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
