'use client'

import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'

export default function Hero() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section className="hero-field relative overflow-hidden border-b border-white/10">
      <div aria-hidden className="hero-orbit hero-orbit-one" />
      <div aria-hidden className="hero-orbit hero-orbit-two" />
      <div className="relative max-w-6xl mx-auto px-6 pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <p className="text-xs font-medium text-amber-300/80 uppercase tracking-[0.3em]">
              {zh ? '为真实工作定制的 AI Agent' : 'Custom agents for real work'}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className={`mx-auto mt-5 max-w-5xl font-bold leading-[1.02] tracking-[-0.045em] md:text-6xl lg:text-7xl ${zh ? 'text-[clamp(2.45rem,10vw,4.5rem)]' : 'text-[clamp(2.8rem,11vw,4.75rem)]'}`}>
              {zh ? '为你的工作打造' : 'Your work deserves an agent'}{' '}
              <span key={language} className="hero-typing-shell">
                <em className="em-accent hero-typing-text">
                  {zh ? '专属 Agent。' : 'built around it.'}
                </em>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto mt-7 max-w-2xl text-base md:text-lg text-gray-400 leading-relaxed">
              {zh
                ? '为个人打造私人 AI 助手，为企业搭建 Agent 工作流。围绕你的知识、工具与审批规则构建。'
                : 'Private assistants for individuals. Agentic workflows for companies. Built around your knowledge, tools, and approvals.'}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
              >
                {zh ? '开始定制 Agent →' : 'Start your agent →'}
              </a>
              <a
                href="#agent-types"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm text-white transition-colors hover:bg-white/5"
              >
                {zh ? '查看 Agent 形态 ↓' : 'Explore agent forms ↓'}
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.48}>
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2 border-t border-white/[0.08] pt-6 text-xs text-gray-500">
              <span>{zh ? '你的知识' : 'Your knowledge'}</span><span className="text-gray-700">→</span>
              <span>{zh ? '你的工具' : 'Your tools'}</span><span className="text-gray-700">→</span>
              <span className="rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-3 py-1.5 text-sky-200">{zh ? '你的 Agent' : 'Your agent'}</span>
              <span className="text-gray-700">→</span><span>{zh ? '你的审批' : 'Your approval'}</span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
