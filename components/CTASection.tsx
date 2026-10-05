'use client'

import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'

/** The homepage's closing block: one sentence, one button. The order panel does the rest. */
export default function CTASection() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section id="contact" className="scroll-mt-16 px-4 py-14 sm:px-6 md:py-28">
      <FadeIn>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-3xl border border-line/10 bg-panel p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
              {zh ? <>把重复的工作<em className="em-accent">交出去</em>。</> : <>Hand off the <em className="em-accent">repetition</em>.</>}
            </h2>
            <p className="mt-3 max-w-xl text-muted">{zh ? '选好 Agent，留个联系方式，一个工作日内收到实施方案和报价。' : 'Pick your agents, leave a contact, and get a build plan and quote within one business day.'}</p>
          </div>
          <OrderButton className="shrink-0 px-7 py-4 text-base" />
        </div>
      </FadeIn>
    </section>
  )
}
