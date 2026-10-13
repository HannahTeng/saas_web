'use client'

import { useLanguage } from '@/components/LanguageProvider'

type QA = { q: string; a: string }

const EN: QA[] = [
  { q: 'What does Flowact actually build?', a: 'AI agents that run inside the systems and inbox your team already uses: reports from your OMP or ERP, daily dispatch plans, documents read, checked and filed. Each one waits for a person on every decision that matters.' },
  { q: 'What happens on the scoping call?', a: 'In 60 minutes ($39) we map the job you described to your systems, data and approvals, and agree what "working" means. You leave with a written scope and a fixed quote.' },
  { q: 'Do I need to choose an agent or a plan first?', a: 'No. Describe the work in a sentence. We recommend the agent and the plan after the scoping call, and you decide then.' },
  { q: 'How fast do I hear back?', a: 'Within one business day of your request, to set up the call. The quote follows the call.' },
  { q: 'Which systems can the agents work with?', a: 'Email (Gmail, Outlook), spreadsheets, SQL databases, and the web systems teams run on: OMP, WMS, ERP, TMS, EDC. Systems without an API are handled through the browser, the way a person would use them.' },
  { q: 'Is my data safe?', a: 'Agents use access you grant and can revoke at any time, and they act only on the steps you approve. We never use your data to train models.' },
]
const ZH: QA[] = [
  { q: 'Flowact 到底做什么？', a: '做在你团队现有系统和邮箱里运行的 AI Agent：从 OMP、ERP 出报表，每天排调度计划，读取、核对、归档单据。每个关键决定都会先等人确认。' },
  { q: '范围界定通话会聊什么？', a: '60 分钟（$39），把你描述的工作对应到你的系统、数据和审批人，一起定下"做成什么样算完成"。通话后你会拿到书面范围说明和固定报价。' },
  { q: '需要先选 Agent 或方案吗？', a: '不需要。一句话说说要做的事就行。通话后我们再推荐合适的 Agent 和合作方式，由你决定。' },
  { q: '多久能收到回复？', a: '提交后一个工作日内联系你约通话，报价在通话后给出。' },
  { q: '能对接哪些系统？', a: '邮箱（Gmail、Outlook）、表格、SQL 数据库，以及团队日常用的网页系统：OMP、WMS、ERP、TMS、EDC。没有接口的系统，用浏览器像人一样操作。' },
  { q: '数据安全吗？', a: 'Agent 只使用你授权的权限，你随时可以收回，而且只在你批准的步骤上执行。我们不会用你的数据训练模型。' },
]

/** Plain FAQ above the footer. Native <details>, so it works without JavaScript and is keyboard accessible. */
export default function FAQ() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const items = zh ? ZH : EN
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 border-t border-line/[0.07] px-4 py-14 sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[280px_1fr]">
        <div>
          <h2 id="faq-title" className="text-3xl font-medium tracking-tight md:text-4xl">{zh ? '常见问题' : 'Questions'}</h2>
          <p className="mt-3 text-sm text-muted">{zh ? '没找到答案？写信到 support@flowact.net' : 'Something else? support@flowact.net'}</p>
        </div>
        <div className="divide-y divide-line/10 border-y border-line/10">
          {items.map((it) => (
            <details key={it.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium text-primary marker:hidden">
                {it.q}
                <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line/15 text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
