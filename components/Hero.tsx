'use client'

import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import styles from './Landing.module.css'

/** The opening, centred under the sculpture: the statement, the lede and a matched pair of actions. */
export default function Hero() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroInner}>
        <p className={`${styles.badge} ${styles.appear}`}>{zh ? '为小企业打造的 AI Agent' : 'AI agents for small businesses.'}</p>
        <h1 id="hero-heading" className={styles.headline}>
          <span>
            <span className={styles.appear}>{zh ? '我们替你' : 'We build your'}</span>
          </span>
          <span>
            <span className={styles.appear}>
              {zh ? '把 Agent ' : 'agents '}<em>{zh ? '建好。' : 'for you.'}</em>
            </span>
          </span>
        </h1>
        <p className={`${styles.lede} ${styles.appear}`}>
          {zh
            ? '在你已经在用的工具里处理重复工作的 AI Agent，关键决策等你点头。'
            : 'AI agents that handle the repetitive work in the tools you already use, and wait for you on every decision that matters.'}
        </p>
        <div className={`${styles.actions} ${styles.appear}`}>
          <OrderButton size="lg" />
          <Button size="lg" variant="ghost" href="#products">{zh ? '查看产品' : 'See the agents'} <span aria-hidden className="btn-arrow">↓</span></Button>
        </div>
      </div>
    </section>
  )
}
