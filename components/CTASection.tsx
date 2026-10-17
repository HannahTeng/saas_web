'use client'

import Button from '@/components/Button'
import FadeIn from '@/components/FadeIn'
import FAQ from '@/components/FAQ'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder } from '@/components/order/OrderProvider'
import Section from '@/components/Section'

// The path from this page to an agent at work, in the order it happens. The order panel repeats it as a checklist.
const STEPS = [
  { en: 'Tell us the job', zh: '说说要做的事', enLine: 'One sentence and a contact. Free.', zhLine: '一句话加一个联系方式。免费。' },
  { en: '60-minute scoping call', zh: '60 分钟范围界定通话', enLine: '$39, within one business day. We map the job to your systems, data and approvals.', zhLine: '$39，一个工作日内约好。一起把这件事对应到你的系统、数据和审批人。' },
  { en: 'Written scope, fixed quote', zh: '书面范围和固定报价', enLine: 'The build starts only when you say yes.', zhLine: '你点头之后才开工。' },
]

/** The close, on the accent as a surface: the three-step path and one large button that opens the order panel; then the questions. */
export default function CTASection() {
  const { language } = useLanguage()
  const { openOrder } = useOrder()
  const zh = language === 'zh'

  return (
    <Section id="contact" rule={false} className="bg-accent text-accent-ink">
      <FadeIn>
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
          <div>
            <p className="text-sm font-medium text-accent-ink/60">{zh ? '下一步' : 'Next step'}</p>
            <h2 className="h-section mt-4">
              {zh ? <>把重复的工作<em className="em-accent em-ink">交出去。</em></> : <>Hand off the <em className="em-accent em-ink">repetition.</em></>}
            </h2>
            <p className="mt-4 max-w-md text-accent-ink/70">
              {zh ? '从这一页到 Agent 上岗，只有三步。第一步一分钟。' : 'Three steps from this page to an agent at work. The first one takes a minute.'}
            </p>
          </div>

          {/* The path, as three ruled entries. On wide screens it stands beside the heading and the button. */}
          <ol className="border-t border-accent-ink/15 md:col-start-2 md:row-span-2 md:self-start">
            {STEPS.map((s, i) => (
              <li key={s.en} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-2 gap-y-1 border-b border-accent-ink/15 py-4 md:py-5">
                <span className="label-caps text-accent-ink/60">0{i + 1}</span>
                <strong className="text-base font-medium tracking-tight md:text-lg">{zh ? s.zh : s.en}</strong>
                <span className="col-start-2 text-sm leading-relaxed text-accent-ink/70">{zh ? s.zhLine : s.enLine}</span>
              </li>
            ))}
          </ol>

          <div className="grid gap-3 md:col-start-1 md:row-start-2">
            <Button size="lg" variant="inverse" onClick={() => openOrder()} className="h-14 w-full px-10 text-base sm:w-auto sm:min-w-[16rem] sm:justify-self-start">
              {zh ? '立即下单 · $39' : 'Order now · $39'}
            </Button>
            <p className="max-w-md text-sm leading-relaxed text-accent-ink/60">
              {zh ? '面板里写一句要做的事、留联系方式，在线付 $39，我们一个工作日内约好时间。' : 'The panel asks for the job and a contact, then takes the $39 by card. We schedule within one business day.'}{' '}
              <a href="/build" className="underline underline-offset-4 hover:text-accent-ink">{zh ? '各类 Agent 和方案价格' : 'Agents and plan prices'}</a>
            </p>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-16 md:mt-20">
        <FAQ onAccent />
      </FadeIn>
    </Section>
  )
}
