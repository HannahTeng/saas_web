'use client'

import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import styles from './Landing.module.css'

/** The opening: the statement, the lede and the two actions. */
export default function Hero() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroInner}>
        <p className={`${styles.badge} ${styles.appear}`}>{zh ? '为真实业务打造的 AI Agent' : 'AI agents for real operations'}</p>
        <h1 id="hero-heading" className={styles.headline}>
          <span>
            <span className={styles.appear}>
              {zh ? '为你的业务打造' : <>
                Your work deserves{' '}
                <em key={language} className={styles.typed}>
                  <span className={styles.typeMeasure}>AI agents</span>
                  <span className={styles.typeText} aria-hidden="true">AI agents</span>
                </em>
              </>}
            </span>
          </span>
          <span>
            <span className={styles.appear}>
              {zh ? <em key={language} className={styles.typed}>
                <span className={styles.typeMeasure}>专属 AI Agent。</span>
                <span className={styles.typeText} aria-hidden="true">专属 AI Agent。</span>
              </em> : 'built around it.'}
            </span>
          </span>
        </h1>
        <p className={`${styles.lede} ${styles.appear}`}>
          {zh ? 'Flowact 的 Agent 在你现有的业务系统和邮箱里运行，处理重复工作，关键决策交给人审批。已交付物流、医疗、电商、教育等行业。' : 'Flowact agents run inside the systems and inbox you already use. They do the repetitive work and wait for a person on every decision that matters. Delivered across logistics, healthcare, e-commerce and education.'}
        </p>
        <div className={`${styles.actions} ${styles.appear}`}>
          <OrderButton size="lg" />
          <Button size="lg" variant="ghost" href="#products">{zh ? '查看产品' : 'See the agents'}</Button>
        </div>
      </div>
    </section>
  )
}
