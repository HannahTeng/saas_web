'use client'

import { OrderButton } from '@/components/order/OrderButton'
import { useLanguage } from '@/components/LanguageProvider'
import Reveal from '@/components/Reveal'
import Scape from '@/components/Scape'

/** The close: the page ends as it began, on a panel of image. The statement, one line under it and the one button, on the centre axis. */
export default function CTASection() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section id="contact" className="px-2 pb-2 pt-6 min-[801px]:px-[10px] min-[801px]:pb-[10px]">
      <Reveal className="on-media tile-media closing flex min-h-[420px] items-center justify-center px-6 py-16 md:min-h-[520px]">
        <Scape />
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.022em] sm:text-[56px]">
            {zh ? <>把重复的工作<em className="em-accent">交出去。</em></> : <>Hand off the <em className="em-accent">repetition.</em></>}
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-[1.55] text-white/80 sm:text-[17px]">
            {zh ? '免费评估你的流程：哪些事最值得自动化，每件大概能省多少时间。' : 'A free assessment of your workflow: what is most worth automating, and roughly what each job would save.'}
          </p>
          <OrderButton size="lg" className="mt-8" />
        </div>
      </Reveal>
    </section>
  )
}
