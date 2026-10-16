'use client'

import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import Section from '@/components/Section'

/** The homepage's closing block: one sentence, one button. The order panel does the rest. */
export default function CTASection() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <Section id="contact">
      <FadeIn>
        <div className="card flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="h-section">
              {zh ? <>把重复的工作<em className="em-accent">交出去</em>。</> : <>Hand off the <em className="em-accent">repetition</em>.</>}
            </h2>
            <p className="mt-3 max-w-xl text-muted">{zh ? '一句话说说要做的事，留个联系方式。一个工作日内约你做 60 分钟范围界定，然后给固定报价。' : 'Tell us the job in a sentence and leave a contact. We set up a 60-minute scoping call within one business day, then send a fixed quote.'}</p>
          </div>
          <OrderButton size="lg" />
        </div>
      </FadeIn>
    </Section>
  )
}
