'use client'

import type { CSSProperties } from 'react'
import Button from '@/components/Button'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import Scape from '@/components/Scape'
import styles from './Landing.module.css'

const CHECK = <svg viewBox="0 0 16 16" aria-hidden><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>

/** A line of the statement, one word at a time (.words in globals.css). `from` continues the count from the line before. */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  const words = text.split(' ')
  return (
    <span>
      {words.map((w, i) => (
        <span key={i}><span className="w" style={{ '--i': from + i } as CSSProperties}>{w}</span>{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </span>
  )
}

/**
 * The opening: one panel of image under the header. The statement, the lede and the two actions sit low on the left;
 * on the right, in glass, the agent's card runs the site's one promise as a loop: it prepares, you approve, then it acts.
 */
export default function Hero() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const lines = zh ? ['我们替你', '把 Agent 建好。'] : ['We build your', 'agents for you.']
  const results = zh ? ['报表已发', '记录已更新', '发票已开'] : ['Report sent', 'Records updated', 'Invoice issued']

  return (
    <section id="top" className={`on-media ${styles.hero}`} aria-labelledby="hero-heading">
      <Scape />
      <div className={styles.heroInner}>
        <div>
          <p className={`${styles.badge} ${styles.rise}`}>{zh ? '为小企业打造的 AI Agent' : 'AI agents for small businesses.'}</p>
          <h1 id="hero-heading" key={language} className={`words ${styles.headline}`}>
            <Words text={lines[0]} />
            <Words text={lines[1]} from={lines[0].split(' ').length} />
          </h1>
          <p className={`${styles.lede} ${styles.rise}`} style={{ '--d': '520ms' } as CSSProperties}>
            {zh
              ? '在你已经在用的工具里处理重复工作的 AI Agent，关键决策等你点头。'
              : 'AI agents that handle the repetitive work in the tools you already use, and wait for you on every decision that matters.'}
          </p>
          <div className={`${styles.actions} ${styles.rise}`} style={{ '--d': '640ms' } as CSSProperties}>
            <OrderButton size="lg" />
            <Button size="lg" variant="ghost" href="#products">{zh ? '查看产品' : 'See the agents'}</Button>
          </div>
        </div>

        <div className={`glass-media ${styles.agent} ${styles.rise}`} style={{ '--d': '820ms' } as CSSProperties} aria-hidden>
          <div className={styles.agentHead}>
            <span className={styles.agentIcon}>
              <svg viewBox="0 0 64 64"><path d="M13 44 H37 C43.5 44 46.5 41.5 48.5 37 L54 19" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span>
              <strong>{zh ? 'Action Agent' : 'Action agent'}</strong>
              <small>{zh ? '读取 · 准备 · 等待' : 'Reads. Prepares. Waits.'}</small>
            </span>
          </div>
          <ul className={styles.steps}>
            {results.map((r) => <li key={r}><span className={styles.tick}>{CHECK}</span>{r}</li>)}
          </ul>
          <div className={styles.agentFoot}>
            <span>{zh ? '一点自主，一条清楚的边界。' : 'A little autonomy. A clear boundary.'}</span>
            <span className={styles.approve}>{CHECK}{zh ? '你批准' : 'You approve'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
