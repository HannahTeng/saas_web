'use client'

import ParticleField from '@/components/ParticleField'
import { useLanguage } from '@/components/LanguageProvider'
import styles from './Landing.module.css'

export default function Hero() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroArt} aria-hidden="true"><ParticleField /></div>
      <div className={styles.heroCopy}>
        <p className={`${styles.badge} ${styles.appear}`}>
          <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2.6c.55 0 .88.55 1.08 2.1.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22.2-1.55.53-2.1 1.08-2.1Z" /></svg>
          {zh ? '为真实工作定制的 AI Agent' : 'Custom agents for real work'}
        </p>
        <h1 id="hero-heading" className={styles.headline}>
          <span>
            <span className={styles.appear}>
              {zh ? '为你的工作打造' : <>
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
                <span className={styles.typeMeasure}>专属 Agent。</span>
                <span className={styles.typeText} aria-hidden="true">专属 Agent。</span>
              </em> : 'built around it.'}
            </span>
          </span>
        </h1>
        <p className={`${styles.lede} ${styles.appear}`}>
          {zh ? '为个人打造私人 AI 助手，为企业搭建 Agent 工作流。围绕你的知识、工具与审批规则构建。' : 'Private assistants for individuals. Agentic workflows for companies. Built around your knowledge, tools, and approvals.'}
        </p>
        <div className={`${styles.actions} ${styles.appear}`}>
          <a href="#contact" className={`${styles.button} ${styles.solid}`}>{zh ? '开始定制 Agent' : 'Start your agent'}</a>
          <a href="#agent-types" className={`${styles.button} ${styles.ghost}`}>{zh ? '查看 Agent 形态' : 'Explore agent forms'}</a>
        </div>
      </div>
      <div className={`${styles.principles} ${styles.appear}`} aria-label={zh ? '构建原则' : 'Built around your work'}>
        <span><svg viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="7" height="18" rx="3.5" fill="currentColor" opacity=".65"/><rect x="14" y="3" width="7" height="18" rx="3.5" fill="currentColor" opacity=".3"/><path d="M9 12h6" stroke="currentColor" strokeWidth="2"/></svg>{zh ? '连接你的知识' : 'Connected to your knowledge'}</span>
        <span><svg viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor"/><path d="m8 12 3 3 5-6" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>{zh ? '融入现有工具' : 'Works inside your existing tools'}</span>
        <span><svg viewBox="0 0 24 24" fill="none" aria-hidden><path d="m12 3 8 3v6c0 4-5 8-8 9-3-1-8-5-8-9V6l8-3Z" stroke="currentColor" strokeWidth="1.5"/><path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>{zh ? '关键决策由人审批' : 'Human approval where it matters'}</span>
      </div>
    </section>
  )
}
