'use client'

import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'
import { useLanguage } from '@/components/LanguageProvider'

type Testimonial = {
  name: string
  role: string
  quote: string
}

// Anonymized operator perspectives — identified by role and location.
const ROW_A: Testimonial[] = [
  {
    name: 'Logistics operations lead',
    role: 'Irvine, California',
    quote:
      'My real load limits — 100 CBM, 44,000 lb — became the agent’s rules. It proposes the plans, I approve with one click. Nothing about how I work had to change.',
  },
  {
    name: 'Clinical data manager',
    role: 'San Diego, California',
    quote:
      'I used to hunt through files and columns by hand to run quality checks. Now I type a question in plain English and get the answer inside the platform I already use.',
  },
  {
    name: 'Supply chain founder',
    role: 'Hangzhou, China',
    quote:
      'The traceability plan covered factory production through retail scan, with agents for ingestion, chain queries, and compliance checks.',
  },
]

const ROW_B: Testimonial[] = [
  {
    name: 'Clinical researcher',
    role: 'San Diego, California',
    quote:
      'It started on one workflow, proved itself, then grew. Every action the agent takes is visible and reversible — we never lost control.',
  },
  {
    name: 'AI product manager',
    role: 'Hangzhou, China',
    quote:
      'Deployed inside the tools we already had instead of asking us to migrate. That alone put this ahead of every automation pitch we’d heard.',
  },
]

const ZH_TESTIMONIALS: Testimonial[] = [
  {
    name: '物流运营负责人', role: '美国 · 尔湾',
    quote: '我实际使用的装载限制被直接写进 Agent 规则。它提出方案，我一键确认，原有工作方式完全不需要改变。',
  },
  {
    name: '临床数据经理', role: '美国 · 圣地亚哥',
    quote: '以前需要手动翻找文件和字段完成质量检查。现在用自然语言提问，就能在原来的平台里得到答案。',
  },
  {
    name: '供应链创业者', role: '中国 · 杭州',
    quote: '整套追溯方案覆盖从工厂生产到零售扫码，并配套数据接入、链路查询和合规检查 Agent。',
  },
  {
    name: '临床研究员', role: '美国 · 圣地亚哥',
    quote: '从一条工作流开始，验证有效后再扩展。Agent 的每一步都可见、可撤销，我们从未失去控制。',
  },
  {
    name: 'AI 产品经理', role: '中国 · 杭州',
    quote: '系统直接部署进我们已有的工具，没有要求迁移。仅这一点，就比之前听过的自动化方案更实际。',
  },
]

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[78vw] max-w-[290px] md:w-[320px] md:max-w-none shrink-0 rounded-xl bg-panel border border-line/[0.06] p-4 md:p-5 transition-colors hover:border-line/[0.12]">
      <Avatar name={t.name} className="w-9 h-9" />
      <blockquote className="mt-3 text-xs md:text-sm text-copy leading-relaxed">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3">
        <p className="text-primary font-medium text-sm">{t.name}</p>
        <p className="text-subtle text-xs md:text-sm">{t.role}</p>
      </figcaption>
    </figure>
  )
}

function Row({ items, direction }: { items: Testimonial[]; direction: 'left' | 'right' }) {
  const anim = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
  return (
    <div className="marquee-mask overflow-hidden pause-on-hover">
      <div className={`marquee-row ${anim} flex w-max gap-4 pr-4`}>
        {[...items, ...items].map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialCarousel() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const testimonials = zh ? ZH_TESTIMONIALS : [...ROW_A, ...ROW_B]

  return (
    <section data-full-bleed className="overflow-hidden py-8 md:py-14">
      <FadeIn className="text-center px-6">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
          {zh ? '一线使用者' : 'What operators'}{' '}
          <em className="em-accent">{zh ? '怎么说' : 'say'}</em>
        </h2>
        <p className="mt-3 text-sm md:text-base text-muted max-w-2xl mx-auto">
          {zh
            ? '来自尔湾、圣地亚哥与杭州的一线岗位视角。'
            : 'Perspectives from operators in Irvine, San Diego, and Hangzhou.'}
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-6">
          <Row items={testimonials} direction="left" />
        </div>
      </FadeIn>
    </section>
  )
}
