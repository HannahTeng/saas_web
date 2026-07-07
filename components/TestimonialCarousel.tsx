import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'

type Testimonial = {
  name: string
  role: string
  quote: string
}

// Placeholder testimonials — one voice per industry Hannah has deployed in.
const ROW_A: Testimonial[] = [
  {
    name: 'Placeholder Dispatcher',
    role: 'Dispatch Lead · Logistics',
    quote:
      'My real load limits — 100 CBM, 44,000 lb — became the agent’s rules. It proposes the plans, I approve with one click. Nothing about how I work had to change.',
  },
  {
    name: 'Placeholder Data Manager',
    role: 'Clinical Data Manager · Research',
    quote:
      'I used to hunt through files and columns by hand to run quality checks. Now I type a question in plain English and get the answer inside the platform I already use.',
  },
  {
    name: 'Placeholder Broker',
    role: 'Customs Broker · Trade Compliance',
    quote:
      'Thirty years processing entries, and she started by listening. The repetitive filing gets automated; every judgment call stays with my staff.',
  },
  {
    name: 'Placeholder Founder',
    role: 'Founder · E-commerce Ops',
    quote:
      'No API on half our systems — spreadsheets, portals, browser-only tools. The agent connects to all of it. We approve; it executes.',
  },
]

const ROW_B: Testimonial[] = [
  {
    name: 'Placeholder Educator',
    role: 'Program Lead · Education',
    quote:
      'The agent adapts to how each student learns — four accessibility modes, voice included. Same pattern as her other work: the agent adapts to the human.',
  },
  {
    name: 'Placeholder Ops Manager',
    role: 'Operations Manager · Logistics',
    quote:
      'She sat with the team and walked through a real day before writing a line of code. You explain the work once — she does the listening.',
  },
  {
    name: 'Placeholder Researcher',
    role: 'Researcher · Clinical Trials',
    quote:
      'It started on one workflow, proved itself, then grew. Every action the agent takes is visible and reversible — we never lost control.',
  },
  {
    name: 'Placeholder PM',
    role: 'Product Manager · SaaS',
    quote:
      'Deployed inside the tools we already had instead of asking us to migrate. That alone put this ahead of every automation pitch we’d heard.',
  },
]

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[350px] shrink-0 rounded-2xl bg-[#111] border border-white/[0.06] p-6 transition-colors hover:border-white/[0.12]">
      <Avatar name={t.name} className="w-12 h-12" />
      <blockquote className="mt-4 text-sm text-gray-300 leading-relaxed">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4">
        <p className="text-white font-medium text-sm">{t.name}</p>
        <p className="text-gray-500 text-sm">{t.role}</p>
      </figcaption>
    </figure>
  )
}

function Row({ items, direction }: { items: Testimonial[]; direction: 'left' | 'right' }) {
  const anim = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
  return (
    <div className="marquee-mask overflow-hidden pause-on-hover">
      <div className={`marquee-row ${anim} flex w-max gap-6 pr-6`}>
        {[...items, ...items].map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialCarousel() {
  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <FadeIn className="text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          What the operators <em className="em-accent">say</em>
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Dispatchers, brokers, data managers, educators — the people who run the workflows the
          agents now carry. (Placeholder voices.)
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-12 space-y-6">
          <Row items={ROW_A} direction="left" />
          <Row items={ROW_B} direction="right" />
        </div>
      </FadeIn>
    </section>
  )
}
