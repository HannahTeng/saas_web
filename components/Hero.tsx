'use client'

import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import styles from './Landing.module.css'

type Step = { who: string; what: string; state: 'done' | 'wait' | 'next' }

const steps: Record<'en' | 'zh', Step[]> = {
  en: [
    { who: 'Email', what: '14 new orders arrived', state: 'done' },
    { who: 'Agent', what: 'Matched them to ERP records', state: 'done' },
    { who: 'Agent', what: 'Drafted 14 invoices', state: 'done' },
    { who: 'You', what: 'Approve the invoices', state: 'wait' },
    { who: 'Billing', what: 'Issue and send', state: 'next' },
  ],
  zh: [
    { who: '邮箱', what: '收到 14 张新订单', state: 'done' },
    { who: 'Agent', what: '已匹配 ERP 记录', state: 'done' },
    { who: 'Agent', what: '已起草 14 张发票', state: 'done' },
    { who: '你', what: '审批发票', state: 'wait' },
    { who: '账单系统', what: '开具并发送', state: 'next' },
  ],
}

/** Desktop-only companion to the headline: one job flowing through an agent, paused for a person. */
function FlowPanel({ zh }: { zh: boolean }) {
  return (
    <div className={`${styles.flow} ${styles.appear}`} aria-hidden="true">
      <div className={styles.flowHead}>
        <span>{zh ? '今日工作流' : "Today's flow"}</span>
        <span className={styles.flowLive}>{zh ? '运行中' : 'Running'}</span>
      </div>
      <ol className={styles.flowSteps}>
        {steps[zh ? 'zh' : 'en'].map((s, i) => (
          <li key={i} className={styles.appear} data-state={s.state} style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
            <span className={styles.flowDot} />
            <span className={styles.flowWho}>{s.who}</span>
            <span className={styles.flowWhat}>{s.what}</span>
            {s.state === 'wait' && <span className={styles.flowChip}>{zh ? '待审批' : 'Needs you'}</span>}
          </li>
        ))}
      </ol>
      <p className={styles.flowFoot}>{zh ? '重复的交给 Agent，关键的留给你。' : 'Agents carry the routine. You keep the decisions.'}</p>
    </div>
  )
}

/** The opening: the statement, the lede, the two actions and, on desktop, the flow panel. */
export default function Hero() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroInner}>
        <div>
          <p className={`${styles.badge} ${styles.appear}`}>{zh ? '为真实业务打造的 AI Agent' : 'AI agents for real operations'}</p>
          <h1 id="hero-heading" className={styles.headline}>
            <span>
              <span className={styles.appear}>{zh ? '让工作流' : 'Let the work'}</span>
            </span>
            <span>
              <span className={styles.appear}>
                <em key={language} className={styles.typed}>
                  <span className={styles.typeMeasure}>{zh ? '自动运转。' : 'flow.'}</span>
                  <span className={styles.typeText} aria-hidden="true">{zh ? '自动运转。' : 'flow.'}</span>
                </em>
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
        <FlowPanel zh={zh} />
      </div>
    </section>
  )
}
