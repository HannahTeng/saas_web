'use client'

import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import { ADDON_AGENTS, CORE_AGENTS, PLANS } from '@/lib/catalog'

/** /build: what you can order and how it is priced. Every button opens the same order panel. */
export default function Pricing() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <main className="pb-24">
      <section className="px-4 pb-12 pt-16 text-center sm:px-6 md:pb-16 md:pt-24">
        <p className="section-kicker">{zh ? '产品与价格' : 'Agents and pricing'}</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
          {zh ? <>选好 Agent，我们来<em className="em-accent">上线</em>。</> : <>Pick your agents. We switch them <em className="em-accent">on</em>.</>}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted">
          {zh ? '每个 Agent 都在你现有的系统里运行，关键决策由人确认。一个工作日内给出报价。' : 'Every agent runs inside the tools you already use, with a person approving what matters. Pricing within one business day.'}
        </p>
        <div className="mt-8"><OrderButton /></div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="section-kicker">{zh ? '核心 Agent' : 'Core agents'}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {CORE_AGENTS.map((a) => (
              <FadeIn key={a.id}>
                <article className="flex h-full flex-col gap-3 rounded-2xl border border-line/10 bg-panel p-6">
                  <h2 className="text-lg font-medium tracking-tight">{zh ? a.zh : a.en}</h2>
                  <p className="text-sm leading-relaxed text-muted">{zh ? a.zhLine : a.enLine}</p>
                  <div className="mt-auto pt-3"><OrderButton preset={{ agents: [a.id] }} variant="ghost" className="w-full" /></div>
                </article>
              </FadeIn>
            ))}
          </div>
          <p className="mt-10 section-kicker">{zh ? '可加购' : 'Add-ons'}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ADDON_AGENTS.map((a) => (
              <div key={a.id} className="rounded-xl border border-line/10 p-4">
                <p className="text-sm font-medium text-primary">{zh ? a.zh : a.en}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{zh ? a.zhLine : a.enLine}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-20 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <p className="section-kicker">{zh ? '合作方式' : 'Plans'}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <FadeIn key={p.id}>
                <article className={`flex h-full flex-col gap-4 rounded-2xl border p-6 ${p.recommended ? 'border-accent/50 bg-panel' : 'border-line/10'}`}>
                  {p.recommended && <p className="text-xs font-medium uppercase tracking-wide text-accent">{zh ? '推荐' : 'Recommended'}</p>}
                  <h2 className="text-xl font-medium tracking-tight">{zh ? p.zh : p.en}</h2>
                  <p className="text-2xl font-medium tracking-tight">{zh ? p.priceZh : p.priceEn}</p>
                  <p className="text-sm leading-relaxed text-muted">{zh ? p.zhLine : p.enLine}</p>
                  <ul className="grid gap-1.5 text-sm text-copy">
                    {(zh ? p.bulletsZh : p.bulletsEn).map((b) => <li key={b} className="flex gap-2"><span className="text-accent">·</span>{b}</li>)}
                  </ul>
                  <div className="mt-auto pt-2"><OrderButton preset={{ plan: p.id }} variant={p.recommended ? 'solid' : 'ghost'} className="w-full" /></div>
                </article>
              </FadeIn>
            ))}
          </div>
          <p className="mt-6 text-sm text-subtle">{zh ? '第三方模型、服务器、账号及工具费用单独报价。' : 'Third-party model, server, account and tool fees are quoted separately.'}</p>
        </div>
      </section>
    </main>
  )
}
