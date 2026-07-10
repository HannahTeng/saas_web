'use client'

import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'

const PROJECT_INPUTS = [
  'Workflow you want automated',
  'Screen recording or written steps',
  'Test account, test data, or sample files',
  'Exception rules and human review points',
]

const START_PATHS = [
  'Personal assistant',
  'Knowledge base',
  'Browser agent',
  'Local agent',
  'Team workflow',
]

const ZH_PROJECT_INPUTS = [
  '希望自动化的工作流程',
  '录屏或文字步骤',
  '测试账号、测试数据或样例文件',
  '异常规则与人工审批节点',
]

const ZH_START_PATHS = ['私人助手', '个人知识库', '浏览器 Agent', '本地 Agent', '团队工作流']

export default function CTASection() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const projectInputs = zh ? ZH_PROJECT_INPUTS : PROJECT_INPUTS
  const startPaths = zh ? ZH_START_PATHS : START_PATHS

  return (
    <section id="contact" className="relative px-4 py-14 sm:px-6 md:py-32 scroll-mt-16">
      <div aria-hidden className="intake-glow absolute inset-x-0 bottom-0 h-[38rem] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <FadeIn>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="section-kicker">{zh ? '从一个真正有用的任务开始' : 'Start with one useful job'}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {zh ? '你的 Agent 应该了解什么，或完成什么？' : 'What should your agent know—or do?'}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-gray-400 md:text-base">
              {zh
                ? '带来一个重复任务、一组文件，或一条值得变成可用系统的工作流程。'
                : 'Bring one repeated task, a set of files, or a workflow ready to become a working system.'}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <details className="intake-panel group mx-auto max-w-3xl rounded-[1.75rem] border border-white/[0.1] bg-[#0b1019]/85 backdrop-blur-xl shadow-[0_28px_100px_rgba(0,0,0,0.5)]">
            <summary className="flex cursor-pointer list-none flex-col items-center justify-between gap-5 p-5 text-center marker:hidden sm:flex-row sm:p-6 sm:text-left md:p-7">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-sky-300/80">
                  {zh ? '项目需求表' : 'Project intake'}
                </p>
                <h3 className="mt-3 text-xl md:text-2xl font-semibold text-white leading-snug">
                  {zh ? '填写一份简短需求。' : 'Open a short brief.'}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
                  {zh
                    ? '准备好后展开填写。我会把范围、风险和审批节点整理成清晰的实施路径。'
                    : 'Open the brief when you’re ready. Scope, risks, and approval points come back as a concrete build path.'}
                </p>
                <div className="mobile-row-scroll mt-4 flex w-full max-w-full flex-nowrap justify-start gap-2 overflow-x-auto pb-1 sm:mt-5 sm:flex-wrap sm:overflow-visible sm:pb-0">
                  {startPaths.map((path) => (
                    <span
                      key={path}
                      className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400"
                    >
                      {path}
                    </span>
                  ))}
                </div>
              </div>
              <span className="intake-plus grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-2xl leading-none text-white transition-all duration-300 group-hover:border-sky-300/30 group-open:rotate-45 group-open:bg-sky-300/[0.08]">
                +
              </span>
            </summary>

            <div className="border-t border-white/10 px-4 pb-5 sm:px-6 sm:pb-6 md:px-7 md:pb-7">
              <form
                action="https://formsubmit.co/6b47f16c7f6b9c2ab14b5f318ada11e1"
                method="POST"
                className="mt-6 space-y-4"
              >
                <input type="hidden" name="_subject" value={zh ? '新的 AI Agent 定制需求' : 'New AI agent workflow request'} />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="true" />
                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      {zh ? '姓名' : 'Name'}
                    </span>
                    <input
                      required
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="agent-input mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-sky-300/60"
                      placeholder={zh ? '你的姓名' : 'Your name'}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </span>
                    <input
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="agent-input mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-sky-300/60"
                      placeholder="you@company.com"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      {zh ? '公司 / 团队' : 'Company / team'}
                  </span>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="agent-input mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-sky-300/60"
                    placeholder={zh ? '公司、部门或团队' : 'Company, department, or team'}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {zh ? '希望系统完成什么？' : 'What should the system do?'}
                  </span>
                  <textarea
                    required
                    name="workflow"
                    rows={4}
                    className="agent-input mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-sky-300/60"
                    placeholder={zh ? '例如：检索内部知识、起草回复、整理文件、填写表单，或等待人工审批。' : 'Example: search internal knowledge, draft replies, organize files, fill forms, or wait for approval.'}
                  />
                </label>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {zh ? '可提供的辅助资料' : 'Helpful materials'}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {projectInputs.map((item) => (
                      <label key={item} className="flex items-start gap-3 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          name="available_materials"
                          value={item}
                          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-sky-400 focus:ring-sky-400/40"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {zh ? '补充说明、时间安排或预算范围' : 'Notes, timeline, or budget range'}
                  </span>
                  <textarea
                    name="notes"
                    rows={3}
                    className="agent-input mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-sky-300/60"
                    placeholder={zh ? '可补充使用平台、紧急程度，以及必须保留人工处理的环节。' : 'Include platforms, urgency, and what must stay manual.'}
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-full bg-white px-6 py-4 text-center font-medium text-black transition-all hover:bg-sky-50 hover:shadow-[0_0_40px_rgba(125,211,252,0.14)]"
                >
                  {zh ? '发送需求 →' : 'Send request →'}
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-500 text-center">
                {zh
                  ? '将发送至 hannahteng777@gmail.com。第三方模型、服务器、账号及工具费用将单独报价。'
                  : 'Sends to hannahteng777@gmail.com. Third-party model, server, account, and tool fees are quoted separately.'}
              </p>
            </div>
          </details>
        </FadeIn>
      </div>
    </section>
  )
}
