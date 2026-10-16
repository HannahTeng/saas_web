'use client'

import { FormEvent, useState } from 'react'
import Button from '@/components/Button'
import FadeIn from '@/components/FadeIn'
import FAQ from '@/components/FAQ'
import { useLanguage } from '@/components/LanguageProvider'
import { useOrder } from '@/components/order/OrderProvider'
import Section from '@/components/Section'

/** The close, on the accent as a surface: the sentence that starts an order, then the questions it raises. */
export default function CTASection() {
  const { language } = useLanguage()
  const { openOrder } = useOrder()
  const zh = language === 'zh'
  const [job, setJob] = useState('')

  // The sentence typed here lands in the order panel's message field, so the panel only has to ask for a contact.
  const start = (e: FormEvent) => { e.preventDefault(); openOrder({ message: job.trim() }) }

  return (
    <Section id="contact" rule={false} className="bg-accent text-accent-ink">
      <FadeIn>
        <div className="grid gap-8 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <p className="text-sm font-medium text-accent-ink/60">{zh ? '下一步' : 'Next step'}</p>
            <h2 className="h-section mt-4">
              {zh ? <>把重复的工作<em className="em-accent em-ink">交出去。</em></> : <>Hand off the <em className="em-accent em-ink">repetition.</em></>}
            </h2>
            <p className="mt-4 max-w-md text-accent-ink/70">
              {zh ? '一句话就够。一个工作日内约你做 60 分钟范围界定（$39），然后给固定报价。' : 'One sentence is enough. We set up a 60-minute scoping call ($39) within one business day, then send a fixed quote.'}
            </p>
          </div>
          <form onSubmit={start} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="job" className="sr-only">{zh ? '你想让 Agent 做什么？' : 'What should the agent do?'}</label>
            <input
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="field h-12 border-accent-ink/20 bg-accent-ink/5 py-0 text-accent-ink placeholder:text-accent-ink/50 focus:border-accent-ink"
              placeholder={zh ? '例如：每天早上把昨天的订单发给我' : 'e.g. Email me yesterday’s orders as a PDF'}
            />
            <Button type="submit" size="lg" variant="inverse" className="sm:shrink-0">{zh ? '继续' : 'Continue'}</Button>
          </form>
        </div>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-16 md:mt-20">
        <FAQ onAccent />
      </FadeIn>
    </Section>
  )
}
