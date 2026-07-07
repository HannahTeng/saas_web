import FadeIn from '@/components/FadeIn'

const BADGES = [
  'Human-in-the-loop',
  'Works with or without APIs',
  'Deployed in 4 industries',
  'You approve every action',
]

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="text-amber-500/80">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function TrustBadges() {
  return (
    <section aria-label="Trust signals" className="py-6 md:py-8">
      <FadeIn>
        <ul className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3">
          {BADGES.map((b) => (
            <li
              key={b}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/[0.08] text-xs text-gray-400 px-4 py-1.5"
            >
              <Check />
              {b}
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  )
}
