'use client'

import { useLanguage } from '@/components/LanguageProvider'
import Section from '@/components/Section'

type QA = { q: string; a: string }

const EN: QA[] = [
  { q: 'What does Flowact actually build?', a: 'AI agents that run inside the systems and inbox your team already uses: reports pulled from your own data, multi-step tasks done in your systems, documents read, checked and filed. Each one waits for a person on every decision that matters.' },
  { q: 'Is the assessment really free?', a: 'Yes, and no card is needed. Tell us the job and your systems, and within one business day we send, in writing, the 2–3 jobs most worth automating and roughly how much time each would save.' },
  { q: 'How is the full build priced?', a: 'If you want to go ahead after the assessment, we send a fixed quote based on your systems and volume. The work starts only when you say yes, and you pay only if it passes the acceptance tests we agree up front.' },
  { q: 'Do you work with our WMS?', a: '易仓 (ECCANG), 领星 (Lingxing), 马帮, Extensiv, ShipHero, and systems built in-house. Where a system has no API, the work is done through the browser, the way a person would. Tell us yours in the assessment.' },
  { q: 'Which systems can the agents work with?', a: 'Email (Gmail, Outlook), team chat (Slack, Feishu, Teams), spreadsheets, SQL databases, and the web systems your team runs on, whether that is an ERP, a CRM, a clinical or e-commerce platform, or an internal tool. Systems without an API are handled through the browser, the way a person would use them.' },
  { q: 'Is my data safe?', a: 'Agents use access you grant and can revoke at any time, and they act only on the steps you approve. We never use your data to train models.' },
]
const ZH: QA[] = [
  { q: 'Flowact 到底做什么？', a: '做在你团队现有系统和邮箱里运行的 AI Agent：从你自己的数据出报表，在你的系统里完成多步操作，读取、核对、归档单据。每个关键决定都会先等人确认。' },
  { q: '评估真的免费吗？', a: '免费，也不用绑卡。告诉我们要做的事和用的系统，一个工作日内我们把最值得自动化的 2–3 件事、每件大概能省多少时间，书面发给你。' },
  { q: '完整应用怎么收费？', a: '评估之后如果想继续，我们按你们的系统和单量给固定报价。你点头才开工，按事先约定的验收标准，验收通过才付钱。' },
  { q: '支持我们用的 WMS 吗？', a: '易仓、领星、马帮、Extensiv、ShipHero，以及自己开发的系统都可以。没有接口的系统，用浏览器像人一样操作。在评估里告诉我们你们用哪个。' },
  { q: '能对接哪些系统？', a: '邮箱（Gmail、Outlook）、办公软件（Slack、飞书、Teams）、表格、SQL 数据库，以及团队日常用的网页系统：ERP、CRM、临床或电商平台、内部工具都可以。没有接口的系统，用浏览器像人一样操作。' },
  { q: '数据安全吗？', a: 'Agent 只使用你授权的权限，你随时可以收回，而且只在你批准的步骤上执行。我们不会用你的数据训练模型。' },
]

/** The questions: the heading and a way to ask more on the left, the list on the right. One answer is open at a time. */
export default function FAQ() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const items = zh ? ZH : EN
  return (
    <Section id="faq" aria-labelledby="faq-heading">
      <div className="grid gap-7 md:grid-cols-[0.75fr_1.25fr] md:gap-[85px]">
        <div>
          <h2 id="faq-heading" className="h-section md:max-w-[300px]">{zh ? '常见问题，一次说清。' : 'Questions, answered.'}</h2>
          <p className="lede mt-4 !text-[15px] md:mt-5">
            {zh ? '还有更具体的问题？' : 'Something more specific?'}<br />
            <a className="underline underline-offset-4 hover:text-primary" href="mailto:support@flowact.net">support@flowact.net</a>
          </p>
        </div>
        <div className="faq">
          {items.map((it) => (
            <details key={it.q} name="faq">
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
