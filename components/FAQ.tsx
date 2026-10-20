'use client'

import { useLanguage } from '@/components/LanguageProvider'

type QA = { q: string; a: string }

const EN: QA[] = [
  { q: 'What does Flowact actually build?', a: 'AI agents that run inside the systems and inbox your team already uses: reports pulled from your own data, multi-step tasks done in your systems, documents read, checked and filed. Each one waits for a person on every decision that matters.' },
  { q: 'Is the workflow check really free?', a: 'Yes. No card, no call. Answer a few taps about your work and systems, and within one business day we send, in writing, the 2–3 jobs most worth automating and roughly how much time each would save.' },
  { q: 'How is a pilot priced?', a: 'Each warehouse is quoted separately, after the check, based on your systems and volume. The work starts only when you say yes, and you pay only if it passes the acceptance tests we agree up front.' },
  { q: 'Do you work with our WMS?', a: '易仓 (ECCANG), 领星 (Lingxing), 马帮, Extensiv, ShipHero, and systems built in-house. Where a system has no API, the work is done through the browser, the way a person would. Tell us yours in the check.' },
  { q: 'Which systems can the agents work with?', a: 'Email (Gmail, Outlook), spreadsheets, SQL databases, and the web systems your team runs on, whether that is an ERP, a CRM, a clinical or e-commerce platform, or an internal tool. Systems without an API are handled through the browser, the way a person would use them.' },
  { q: 'Is my data safe?', a: 'Agents use access you grant and can revoke at any time, and they act only on the steps you approve. We never use your data to train models.' },
]
const ZH: QA[] = [
  { q: 'Flowact 到底做什么？', a: '做在你团队现有系统和邮箱里运行的 AI Agent：从你自己的数据出报表，在你的系统里完成多步操作，读取、核对、归档单据。每个关键决定都会先等人确认。' },
  { q: '流程体检真的免费吗？', a: '免费。不用绑卡，也不用约电话。点几下告诉我们你们的工作和系统，一个工作日内我们把最值得自动化的 2–3 件事、每件大概能省多少时间，书面发给你。' },
  { q: '试点怎么收费？', a: '体检之后按你们仓库的系统和单量单独报价。你点头才开工，按事先约定的验收标准，验收通过才付钱。' },
  { q: '支持我们用的 WMS 吗？', a: '易仓、领星、马帮、Extensiv、ShipHero，以及自己开发的系统都可以。没有接口的系统，用浏览器像人一样操作。在体检里告诉我们你们用哪个。' },
  { q: '能对接哪些系统？', a: '邮箱（Gmail、Outlook）、表格、SQL 数据库，以及团队日常用的网页系统：ERP、CRM、临床或电商平台、内部工具都可以。没有接口的系统，用浏览器像人一样操作。' },
  { q: '数据安全吗？', a: 'Agent 只使用你授权的权限，你随时可以收回，而且只在你批准的步骤上执行。我们不会用你的数据训练模型。' },
]

/**
 * The questions under the closing call to action. Only the questions show; each one opens on a click.
 * `onAccent` recolors it for the accent surface it sits on.
 */
export default function FAQ({ onAccent = false }: { onAccent?: boolean }) {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const items = zh ? ZH : EN
  const c = onAccent
    ? { kicker: 'text-accent-ink/60', rule: 'border-accent-ink/15', q: 'text-accent-ink', a: 'text-accent-ink/75', sign: 'border-accent-ink/25 text-accent-ink/70' }
    : { kicker: 'text-subtle', rule: 'border-line/10', q: 'text-primary', a: 'text-muted', sign: 'border-line/20 text-muted' }
  // Two independent columns from tablets up, so opening a question moves only the entries under it.
  const half = Math.ceil(items.length / 2)
  const columns = [items.slice(0, half), items.slice(half)]
  return (
    <div id="faq" className="scroll-mt-16">
      <p className={`text-sm font-medium ${c.kicker}`}>{zh ? '常见问题' : 'Questions'}</p>
      <div className={`mt-4 border-t md:grid md:grid-cols-2 md:gap-x-16 ${c.rule}`}>
        {columns.map((column, i) => (
          <div key={i}>
            {column.map((it) => (
              <details key={it.q} className={`group border-b ${c.rule}`}>
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-base font-medium [&::-webkit-details-marker]:hidden ${c.q}`}>
                  {it.q}
                  <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-sm leading-none transition-transform duration-200 group-open:rotate-45 ${c.sign}`}>+</span>
                </summary>
                <p className={`pb-5 text-sm leading-relaxed ${c.a}`}>{it.a}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
