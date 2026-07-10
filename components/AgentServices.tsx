'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'

type Audience = 'individuals' | 'companies'
type AgentType = 'knowledge' | 'browser' | 'local'

const AUDIENCES = {
  individuals: {
    number: '01',
    eyebrow: 'Individuals',
    title: 'Private AI assistant',
    body: 'A personal operating layer for files, notes, research, email drafts, and searchable knowledge.',
    workspace: 'Private workspace',
  },
  companies: {
    number: '02',
    eyebrow: 'Companies',
    title: 'Agentic workflow',
    body: 'Custom automation for repeated operational work, with human review kept at the decision points.',
    workspace: 'Team operations',
  },
} satisfies Record<Audience, { number: string; eyebrow: string; title: string; body: string; workspace: string }>

const AGENT_TYPES = {
  knowledge: {
    number: '01',
    name: 'Knowledge agent',
    summary: 'Ask across files, notes, research, and memory.',
    individuals: {
      label: 'Personal knowledge agent',
      title: 'Answers grounded in your own material.',
      body: 'Connect the sources you already trust. The agent retrieves, compares, drafts, and cites without turning your information into another filing project.',
      flow: ['Files + notes', 'Grounded answer', 'Review'],
    },
    companies: {
      label: 'Team knowledge agent',
      title: 'One reliable answer across company knowledge.',
      body: 'Connect approved documents, systems, and policies so teams can retrieve grounded answers with source permissions and ownership preserved.',
      flow: ['Approved sources', 'Role-aware answer', 'Escalation'],
    },
  },
  browser: {
    number: '02',
    name: 'Browser agent',
    summary: 'Research, enter data, and complete web tasks.',
    individuals: {
      label: 'Personal browser agent',
      title: 'Web tasks completed with supervision.',
      body: 'Let the agent research, compare, draft, enter, and organize across websites while keeping sign-in and consequential submissions under your control.',
      flow: ['Browser task', 'Agent action', 'Your approval'],
    },
    companies: {
      label: 'Browser workflow agent',
      title: 'Repeated browser operations become a managed queue.',
      body: 'Automate research, portal updates, reconciliation, and data entry. Operators review exceptions and high-impact submissions instead of every click.',
      flow: ['Work queue', 'Browser execution', 'Exception review'],
    },
  },
  local: {
    number: '03',
    name: 'Local agent',
    summary: 'Work with private files and desktop tools on-device.',
    individuals: {
      label: 'Private local agent',
      title: 'Private work handled on your machine.',
      body: 'Use local files and desktop applications without moving sensitive material into a new web platform. Permissions and actions remain explicit.',
      flow: ['Local files', 'On-device action', 'Audit trail'],
    },
    companies: {
      label: 'Local operations agent',
      title: 'Internal tools become part of one agentic workflow.',
      body: 'Coordinate desktop software, private files, and internal systems where cloud-only automation cannot safely reach. Every action is logged and reversible.',
      flow: ['Internal trigger', 'Local execution', 'Operator sign-off'],
    },
  },
} satisfies Record<AgentType, {
  number: string
  name: string
  summary: string
  individuals: { label: string; title: string; body: string; flow: string[] }
  companies: { label: string; title: string; body: string; flow: string[] }
}>

const ZH_AUDIENCES = {
  individuals: {
    number: '01', eyebrow: '个人', title: '私人 AI 助手',
    body: '为文件、笔记、研究、邮件草稿和可检索知识打造的个人智能工作层。', workspace: '私人工作区',
  },
  companies: {
    number: '02', eyebrow: '企业', title: 'Agent 工作流',
    body: '面向重复运营工作的定制自动化，在关键决策点保留人工审核。', workspace: '团队运营',
  },
} satisfies typeof AUDIENCES

const ZH_AGENT_TYPES = {
  knowledge: {
    number: '01', name: '知识库 Agent', summary: '在文件、笔记、研究资料和长期记忆中统一提问。',
    individuals: {
      label: '个人知识库 Agent', title: '基于你自己的资料，给出可靠答案。',
      body: '连接你已经信任的信息源。Agent 可以检索、比较、起草并引用来源，无需重新整理一套知识系统。',
      flow: ['文件与笔记', '溯源回答', '人工确认'],
    },
    companies: {
      label: '企业知识库 Agent', title: '让团队从企业知识中获得一致答案。',
      body: '连接经批准的文档、系统和制度，按照权限返回有来源的答案，同时保留原有内容归属。',
      flow: ['授权信息源', '按角色回答', '升级处理'],
    },
  },
  browser: {
    number: '02', name: '浏览器 Agent', summary: '执行网页调研、数据录入和跨站任务。',
    individuals: {
      label: '个人浏览器 Agent', title: '让网页任务在你的监督下自动完成。',
      body: 'Agent 可以跨网站调研、比较、起草、录入与整理；登录和重要提交仍由你控制。',
      flow: ['网页任务', 'Agent 执行', '你的审批'],
    },
    companies: {
      label: '企业浏览器 Agent', title: '把重复的网页操作变成可管理的工作队列。',
      body: '自动完成调研、门户更新、对账与数据录入，让运营人员只处理异常和高风险提交。',
      flow: ['工作队列', '浏览器执行', '异常审核'],
    },
  },
  local: {
    number: '03', name: '本地 Agent', summary: '在设备端处理私有文件与桌面工具。',
    individuals: {
      label: '个人本地 Agent', title: '敏感工作直接在你的设备上完成。',
      body: '使用本地文件和桌面应用，无需把敏感资料迁移到新的在线平台；权限和操作始终清晰可见。',
      flow: ['本地文件', '设备端执行', '审计记录'],
    },
    companies: {
      label: '企业本地 Agent', title: '把内部工具纳入同一个 Agent 工作流。',
      body: '协调桌面软件、私有文件和内部系统，覆盖纯云端自动化无法安全触达的工作；所有操作可记录、可撤销。',
      flow: ['内部触发', '本地执行', '人工签核'],
    },
  },
} satisfies typeof AGENT_TYPES

function AgentIcon({ type }: { type: AgentType }) {
  if (type === 'browser') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 8h18M7 6h.01M10 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'local') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7h8M8 11h8M8 16h.01M12 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5v-17Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19M9 7h6M9 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function AgentServices() {
  const { language } = useLanguage()
  const [audience, setAudience] = useState<Audience>('individuals')
  const [agentType, setAgentType] = useState<AgentType>('knowledge')
  const reduceMotion = useReducedMotion()
  const zh = language === 'zh'
  const audienceCopy = zh ? ZH_AUDIENCES : AUDIENCES
  const agentTypeCopy = zh ? ZH_AGENT_TYPES : AGENT_TYPES
  const selected = agentTypeCopy[agentType][audience]

  return (
    <>
      <section id="agent-types" className="relative scroll-mt-16 border-b border-white/[0.07] px-4 py-14 sm:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
            <p className="section-kicker">{zh ? '两种开始方式' : 'Two ways to start'}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {zh ? '同一套定制服务，为不同的工作主体而设计。' : 'One service, shaped around who is doing the work.'}
            </h2>
          </FadeIn>

          <div className="mt-8 grid grid-cols-2 border-y border-white/10 md:mt-10">
            {(Object.entries(audienceCopy) as [Audience, (typeof audienceCopy)[Audience]][]).map(
              ([key, item], index) => {
                const active = audience === key
                return (
                  <FadeIn key={key} delay={0.08 * (index + 1)}>
                    <button
                      type="button"
                      onClick={() => setAudience(key)}
                      aria-pressed={active}
                      className={`audience-lane relative grid h-full w-full grid-cols-1 content-start justify-items-center gap-2 overflow-hidden px-3 py-5 text-center transition-colors md:grid-cols-[2.5rem_1fr] md:justify-items-stretch md:gap-4 md:px-8 md:py-9 md:text-left ${
                        active ? 'is-active' : ''
                      } ${index > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}
                    >
                      <span className="text-xs text-amber-300/80">{item.number}</span>
                      <span>
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-gray-500">
                          {item.eyebrow}
                        </span>
                        <strong className="mt-1 block text-base font-semibold text-white md:mt-2 md:text-2xl">
                          {item.title}
                        </strong>
                        <span className="mt-2 block max-w-md text-xs leading-relaxed text-gray-400 md:mt-3 md:text-base">
                          {item.body}
                        </span>
                      </span>
                    </button>
                  </FadeIn>
                )
              },
            )}
          </div>

          <div className="mt-14 md:mt-28">
            <FadeIn className="grid gap-4 text-center md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-6 md:text-left">
              <div>
                <p className="section-kicker">{zh ? '你的 Agent 可以是什么' : 'What your agent can be'}</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
                  {zh ? '选择工作界面，保留同一套智能。' : 'Choose the surface. Keep the intelligence.'}
                </h2>
              </div>
              <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-400 md:mx-0 md:text-base">
                {zh
                  ? '界面跟随任务而定：检索知识、操作浏览器，或在本机安全执行。多数系统会组合多种形态。'
                  : 'The interface follows the job: retrieve knowledge, operate a browser, or work securely on your machine. Most systems combine more than one.'}
              </p>
            </FadeIn>

            <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
              <FadeIn>
                <div className="grid grid-cols-3 border-y border-white/10 md:block md:border-b-0">
                  {(Object.entries(agentTypeCopy) as [AgentType, (typeof agentTypeCopy)[AgentType]][]).map(
                    ([key, item], index) => {
                      const active = agentType === key
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAgentType(key)}
                          aria-pressed={active}
                          className={`agent-type-row group grid w-full grid-cols-1 justify-items-center gap-2 px-2 py-4 text-center transition-all md:grid-cols-[2rem_2.75rem_1fr_auto] md:items-center md:justify-items-stretch md:gap-3 md:border-b md:border-white/10 md:px-1 md:py-5 md:text-left ${
                            active ? 'is-active' : ''
                          } ${index < 2 ? 'border-r border-white/10 md:border-r-0' : ''}`}
                        >
                          <span className="hidden text-xs text-amber-300/70 md:block">{item.number}</span>
                          <span className="agent-icon grid h-11 w-11 place-items-center rounded-full border border-white/10 text-gray-300 transition-colors">
                            <span className="h-5 w-5"><AgentIcon type={key} /></span>
                          </span>
                          <span>
                            <strong className="block text-xs font-medium leading-tight text-white sm:text-sm md:text-base">{item.name}</strong>
                            <span className="mt-1 hidden text-sm leading-relaxed text-gray-500 md:block">
                              {item.summary}
                            </span>
                          </span>
                          <span className="hidden text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-gray-300 md:block">
                            →
                          </span>
                        </button>
                      )
                    },
                  )}
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="agent-console relative min-h-[27rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1019]/90 shadow-[0_28px_90px_rgba(0,0,0,0.42)] md:min-h-[30rem] md:rounded-3xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-2 text-gray-300">
                      <span className="agent-status-dot h-1.5 w-1.5 rounded-full bg-amber-300" />
                      {zh ? 'Agent 已就绪' : 'Agent ready'}
                    </span>
                    <span>{audienceCopy[audience].workspace}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${audience}-${agentType}`}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="p-5 text-center md:p-10 md:text-left"
                    >
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/[0.07] text-sky-200 md:mx-0 md:h-14 md:w-14 md:rounded-2xl">
                        <span className="h-6 w-6"><AgentIcon type={agentType} /></span>
                      </div>
                      <p className="mt-9 text-[11px] font-medium uppercase tracking-[0.22em] text-sky-300/80">
                        {selected.label}
                      </p>
                      <h3 className="mt-3 max-w-lg text-2xl font-semibold tracking-tight text-white md:text-3xl">
                        {selected.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
                        {selected.body}
                      </p>
                      <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400 md:mt-9 md:justify-start">
                        {selected.flow.map((step, index) => (
                          <span key={step} className="contents">
                            {index > 0 && <span className="flow-arrow text-gray-700">→</span>}
                            <span className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-2">
                              {step}
                            </span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-3 border-t border-white/[0.08] bg-black/20 px-5 py-4 text-xs text-gray-500">
                    <span>◇ {zh ? '权限始终可见' : 'Permissions stay visible'}</span>
                    <span>↶ {zh ? '操作始终可撤销' : 'Actions stay reversible'}</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-16 border-b border-white/[0.07] px-4 py-14 sm:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="grid gap-7 border-y border-white/10 py-8 md:grid-cols-2 md:items-start md:gap-20 md:py-10">
              <div className="text-center md:text-left">
                <p className="section-kicker">{zh ? '生产级原则' : 'Production principles'}</p>
                <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
                  {zh ? '让 Agent 适应工作，而不是让工作迁就 Agent。' : 'The agent adapts to the work. The work does not adapt to the agent.'}
                </h2>
              </div>
              <dl className="mobile-row-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:block md:divide-y md:divide-white/10 md:border-t md:border-white/10 md:pb-0">
                {(zh
                  ? [
                      ['可见', '每一次操作和信息来源都可以检查。'],
                      ['可控', '人工审核保留在关键决策位置。'],
                      ['私密', '访问权限遵循最小必要原则。'],
                      ['兼容', '系统与现有工具共同工作。'],
                    ]
                  : [
                      ['Visible', 'Every action and source can be inspected.'],
                      ['Controlled', 'Human review stays at consequential decisions.'],
                      ['Private', 'Access follows the minimum permissions required.'],
                      ['Compatible', 'The system works with tools already in place.'],
                    ]).map(([term, description]) => (
                  <div key={term} className="w-[68vw] max-w-[15rem] shrink-0 snap-start border border-white/[0.08] bg-white/[0.02] p-4 text-center text-sm md:grid md:w-auto md:max-w-none md:grid-cols-[6rem_1fr] md:gap-4 md:border-0 md:bg-transparent md:px-0 md:py-4 md:text-left">
                    <dt className="font-medium text-white">{term}</dt>
                    <dd className="mt-2 leading-relaxed text-gray-500 md:mt-0">{description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
