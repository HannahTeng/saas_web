'use client'

import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'
import { useLanguage } from '@/components/LanguageProvider'

type Testimonial = {
  name: string
  role: string
  quote: string
}

// Placeholder testimonials — one voice per industry case.
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
    role: 'Founder · Regulated Supply Chain',
    quote:
      'The traceability plan covered factory production through retail scan, with agents for ingestion, chain queries, and compliance checks.',
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

const ZH_TESTIMONIALS: Testimonial[] = [
  {
    name: '示例调度主管', role: '调度主管 · 物流',
    quote: '我实际使用的装载限制被直接写进 Agent 规则。它提出方案，我一键确认，原有工作方式完全不需要改变。',
  },
  {
    name: '示例数据经理', role: '临床数据经理 · 科研',
    quote: '以前需要手动翻找文件和字段完成质量检查。现在用自然语言提问，就能在原来的平台里得到答案。',
  },
  {
    name: '示例报关员', role: '报关员 · 贸易合规',
    quote: '她先听懂我们三十年来如何处理业务。重复申报被自动化，但每一个判断仍由团队做出。',
  },
  {
    name: '示例创始人', role: '创始人 · 合规供应链',
    quote: '整套追溯方案覆盖从工厂生产到零售扫码，并配套数据接入、链路查询和合规检查 Agent。',
  },
  {
    name: '示例教育负责人', role: '项目负责人 · 教育',
    quote: 'Agent 会适应不同学生的学习方式，包括语音在内的多种无障碍模式。技术适应人，而不是反过来。',
  },
  {
    name: '示例运营经理', role: '运营经理 · 物流',
    quote: '她先跟着团队完整走过真实的一天，之后才开始写代码。我们只需要把工作解释清楚一次。',
  },
  {
    name: '示例研究员', role: '研究员 · 临床试验',
    quote: '从一条工作流开始，验证有效后再扩展。Agent 的每一步都可见、可撤销，我们从未失去控制。',
  },
  {
    name: '示例产品经理', role: '产品经理 · SaaS',
    quote: '系统直接部署进我们已有的工具，没有要求迁移。仅这一点，就比之前听过的自动化方案更实际。',
  },
]

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[78vw] max-w-[290px] md:w-[320px] md:max-w-none shrink-0 rounded-xl bg-[#111] border border-white/[0.06] p-4 md:p-5 transition-colors hover:border-white/[0.12]">
      <Avatar name={t.name} className="w-9 h-9" />
      <blockquote className="mt-3 text-xs md:text-sm text-gray-300 leading-relaxed">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3">
        <p className="text-white font-medium text-sm">{t.name}</p>
        <p className="text-gray-500 text-xs md:text-sm">{t.role}</p>
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
    <section className="overflow-hidden py-8 md:py-14">
      <FadeIn className="text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {zh ? '一线使用者' : 'What the operators'}{' '}
          <em className="em-accent">{zh ? '怎么说' : 'say'}</em>
        </h2>
        <p className="mt-3 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          {zh
            ? '调度员、报关员、数据经理与教育工作者——他们负责的流程，如今由 Agent 分担。以下为示例内容。'
            : 'Dispatchers, brokers, data managers, educators—the people who run the workflows the agents now carry. (Placeholder voices.)'}
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
