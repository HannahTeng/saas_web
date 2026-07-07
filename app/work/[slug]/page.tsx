import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import CaseFile from './CaseFile'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = projects.find((x) => x.slug === params.slug)
  return { title: p ? `${p.title} — Hannah Teng` : 'Case file — Hannah Teng' }
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const idx = projects.findIndex((x) => x.slug === params.slug)
  if (idx === -1) notFound()
  const p = projects[idx]
  const next = projects[(idx + 1) % projects.length]

  return (
    <main className="relative min-h-svh px-6 pt-28 pb-16 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#projects"
          data-hover
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim hover:text-accent transition-colors"
        >
          ← cd ../projects
        </Link>

        <CaseFile p={p} />

        <div className="mt-14 pt-8 border-t border-edge flex flex-wrap items-center justify-between gap-4">
          <a
            href="https://github.com/HannahTeng"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-mid bg-white/58 border border-edge px-5 py-2.5 hover:border-accent hover:text-accent transition-colors duration-300"
          >
            View on GitHub ↗
          </a>
          <Link
            href={`/work/${next.slug}`}
            data-hover
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-mid hover:text-accent transition-colors"
          >
            next file: {next.title} →
          </Link>
        </div>
      </div>
    </main>
  )
}
