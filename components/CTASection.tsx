'use client'

import Button from '@/components/Button'
import FadeIn from '@/components/FadeIn'
import FAQ from '@/components/FAQ'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder } from '@/components/order/OrderProvider'
import Section from '@/components/Section'

// The path from this page to a pilot, in the order it happens.
const STEPS = [
  { en: 'Take the free check', zh: '填免费流程体检', enLine: 'About 60 seconds, mostly taps: what takes time, which systems, how many orders.', zhLine: '约 60 秒，基本都是点选：哪些事占时间、用什么系统、每天多少单。' },
  { en: 'Get the result in writing', zh: '收到书面体检结果', enLine: 'Within one business day: the 2–3 jobs most worth automating and roughly what each saves. No call needed.', zhLine: '一个工作日内：最值得自动化的 2–3 件事，以及每件大概能省多少。不用约电话。' },
  { en: 'Pilot, quoted per warehouse', zh: '试点，按仓库报价', enLine: 'The work starts only when you say yes, and you pay only if it passes acceptance.', zhLine: '你点头才开工，验收通过才付钱。' },
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
              {zh ? '从这一页到试点，只有三步。第一步一分钟，免费。' : 'Three steps from this page to a pilot. The first takes a minute and is free.'}
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
              {zh ? '获取免费体检' : 'Get a free check'}
            </Button>
            <p className="max-w-md text-sm leading-relaxed text-accent-ink/60">
              {zh ? '不收费、不用绑卡、不用约电话。一个工作日内把结果发给你。' : 'Free, no card and no call. We send the result within one business day.'}{' '}
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
