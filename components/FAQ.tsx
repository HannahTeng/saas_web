'use client'

import { useLanguage } from '@/components/LanguageProvider'

type QA = { q: string; a: string }

const EN: QA[] = [
  { q: 'What does Flowact actually build?', a: 'AI agents that run inside the systems and inbox your team already uses: reports pulled from your own data, multi-step tasks done in your systems, documents read, checked and filed. Each one waits for a person on every decision that matters.' },
  { q: 'What happens on the scoping call?', a: 'In 60 minutes ($39) we map the job you described to your systems, data and approvals, and agree what "working" means. You leave with a written scope and a fixed quote.' },
  { q: 'Do I need to choose an agent or a plan first?', a: 'No. Describe the work in a sentence. We recommend the agent and the plan after the scoping call, and you decide then.' },
  { q: 'How fast do I hear back?', a: 'Within one business day of your request, to set up the call. The quote follows the call.' },
  { q: 'Which systems can the agents work with?', a: 'Email (Gmail, Outlook), spreadsheets, SQL databases, and the web systems your team runs on, whether that is an ERP, a CRM, a clinical or e-commerce platform, or an internal tool. Systems without an API are handled through the browser, the way a person would use them.' },
  { q: 'Is my data safe?', a: 'Agents use access you grant and can revoke at any time, and they act only on the steps you approve. We never use your data to train models.' },
]
const ZH: QA[] = [
  { q: 'Flowact 到底做什么？', a: '做在你团队现有系统和邮箱里运行的 AI Agent：从你自己的数据出报表，在你的系统里完成多步操作，读取、核对、归档单据。每个关键决定都会先等人确认。' },
  { q: '范围界定通话会聊什么？', a: '60 分钟（$39），把你描述的工作对应到你的系统、数据和审批人，一起定下"做成什么样算完成"。通话后你会拿到书面范围说明和固定报价。' },
  { q: '需要先选 Agent 或方案吗？', a: '不需要。一句话说说要做的事就行。通话后我们再推荐合适的 Agent 和合作方式，由你决定。' },
  { q: '多久能收到回复？', a: '提交后一个工作日内联系你约通话，报价在通话后给出。' },
  { q: '能对接哪些系统？', a: '邮箱（Gmail、Outlook）、表格、SQL 数据库，以及团队日常用的网页系统：ERP、CRM、临床或电商平台、内部工具都可以。没有接口的系统，用浏览器像人一样操作。' },
  { q: '数据安全吗？', a: 'Agent 只使用你授权的权限，你随时可以收回，而且只在你批准的步骤上执行。我们不会用你的数据训练模型。' },
]

/**
 * The questions under the closing call to action, answered in the open: no accordion to click through.
 * `onAccent` recolors it for the accent surface it sits on.
 */
export default function FAQ({ onAccent = false }: { onAccent?: boolean }) {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const items = zh ? ZH : EN
  const c = onAccent
    ? { kicker: 'text-accent-ink/60', rule: 'border-accent-ink/15', q: 'text-accent-ink', a: 'text-accent-ink/75' }
    : { kicker: 'text-subtle', rule: 'border-line/10', q: 'text-primary', a: 'text-muted' }
  return (
    <div id="faq" className="scroll-mt-16">
      <p className={`text-sm font-medium ${c.kicker}`}>{zh ? '常见问题' : 'Questions'}</p>
      {/* Each entry carries its own bottom rule, so the rules read the same in one column and in two. */}
      <dl className={`mt-4 border-t md:grid md:grid-cols-2 md:gap-x-16 ${c.rule}`}>
        {items.map((it) => (
          <div key={it.q} className={`border-b py-5 ${c.rule}`}>
            <dt className={`text-base font-medium ${c.q}`}>{it.q}</dt>
            <dd className={`mt-2 text-sm leading-relaxed ${c.a}`}>{it.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
