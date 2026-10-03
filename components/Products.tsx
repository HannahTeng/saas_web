'use client'

import FadeIn from '@/components/FadeIn'
import { useLanguage } from '@/components/LanguageProvider'

type Product = {
  id: string
  name: string
  zhName: string
  line: string
  zhLine: string
  does: string[]
  zhDoes: string[]
  connects: string[]
  live: string
  zhLive: string
  href: string
}

const PRODUCTS: Product[] = [
  {
    id: 'data',
    name: 'Flowact Data Agent',
    zhName: 'Flowact 数据 Agent',
    line: 'One question in plain English. Numbers, charts and a PDF back.',
    zhLine: '一句话提问，返回数字、图表和 PDF。',
    does: ['Signs in to your OMP, WMS or database', 'States the definition behind every number', 'Exports charts and reports for management'],
    zhDoes: ['自动登录 OMP、WMS 或数据库', '每个数字都写明统计口径', '一键导出图表和报告'],
    connects: ['OMP', 'WMS', 'SQL', 'Excel'],
    live: 'Live at an overseas warehouse operator',
    zhLive: '已在海外仓客户上线',
    href: '#agent-types',
  },
  {
    id: 'dispatch',
    name: 'Flowact Dispatch Agent',
    zhName: 'Flowact 调度 Agent',
    line: 'Arrived containers in. Full trucks out, waiting for your yes.',
    zhLine: '到货柜进来，整车方案出去，等你确认。',
    does: ['Pulls arrivals and waybills from your ERP', 'Packs each truck to your CBM and weight limits', 'Books only after the dispatcher approves'],
    zhDoes: ['从 ERP 拉取到货柜与运单', '按 CBM 和重量上限凑整车', '调度确认后才约车'],
    connects: ['ERP', 'TMS', 'iMessage', 'Excel'],
    live: 'Live at a drayage and trucking company',
    zhLive: '已在卡派客户上线',
    href: '#agent-types',
  },
  {
    id: 'docs',
    name: 'Flowact Docs Agent',
    zhName: 'Flowact 单证 Agent',
    line: 'Invoices, B/Ls and customs forms read, checked and filed.',
    zhLine: '发票、提单、报关单：读取、核对、录入。',
    does: ['Extracts fields from PDFs and scans', 'Checks them against your records', 'Drafts the customer reply with attachments'],
    zhDoes: ['从 PDF 和扫描件提取字段', '与系统记录交叉核对', '起草带附件的客户回复'],
    connects: ['Gmail', 'Outlook', 'PDF', 'ERP'],
    live: 'Live at a customs brokerage',
    zhLive: '已在报关行上线',
    href: '/build',
  },
]

const PLATFORM = [
  { en: 'Connectors', zh: '系统连接', d: 'Works inside OMP, WMS, ERP, email and spreadsheets. No migration.', zd: '直接接入 OMP、WMS、ERP、邮箱和表格，无需迁移。' },
  { en: 'Shared knowledge', zh: '共享知识层', d: 'Every agent uses the same SOPs, definitions and permissions.', zd: '所有 Agent 共用同一套 SOP、口径和权限。' },
  { en: 'Approval checkpoints', zh: '审批节点', d: 'Nothing consequential happens without a person saying yes.', zd: '关键操作必须由人确认后执行。' },
  { en: 'Audit trail', zh: '操作留痕', d: 'Every query, click and export is logged and reversible.', zd: '每次查询、点击、导出都有记录，可回溯。' },
  { en: 'Cloud or self-hosted', zh: '云端或私有部署', d: 'Data-sensitive teams can keep models and data on their own infrastructure.', zd: '对数据敏感的团队可私有部署模型与数据。' },
]

export default function Products() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <section id="products" className="scroll-mt-16 border-b border-line/[0.07] px-4 py-14 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="section-kicker">{zh ? '产品' : 'Products'}</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">
            {zh ? <>三个 Agent，<em className="em-accent">开箱即用</em>。</> : <>Agents for logistics operations, <em className="em-accent">ready to deploy</em>.</>}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {zh
              ? '每个 Agent 都在客户现有系统里运行，同一套平台，按需开通。'
              : 'Each agent runs inside the systems a warehouse, trucking or brokerage team already uses. One platform, switched on per team.'}
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <FadeIn key={p.id} delay={0.05 * i}>
              <article className="flex h-full flex-col gap-5 rounded-2xl border border-line/10 bg-panel p-6">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-primary">{zh ? p.zhName : p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{zh ? p.zhLine : p.line}</p>
                </div>
                <ul className="grid gap-2 text-sm text-copy">
                  {(zh ? p.zhDoes : p.does).map((d) => (
                    <li key={d} className="flex gap-2"><span className="text-accent">·</span>{d}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {p.connects.map((c) => (
                    <span key={c} className="rounded-md border border-line/10 px-2 py-1 text-xs text-subtle">{c}</span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line/[0.08] pt-4 text-sm">
                  <span className="text-subtle">{zh ? p.zhLive : p.live}</span>
                  <a href={p.href} className="shrink-0 text-copy hover:text-primary">{p.href === '/build' ? (zh ? '了解 →' : 'Details →') : (zh ? '看演示 →' : 'Watch it →')}</a>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-14">
            <p className="section-kicker">{zh ? '平台' : 'The platform underneath'}</p>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-5">
              {PLATFORM.map((x) => (
                <div key={x.en} className="bg-page p-5">
                  <dt className="text-sm font-medium text-primary">{zh ? x.zh : x.en}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-subtle">{zh ? x.zd : x.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line/10 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-primary">{zh ? '年度授权或按月托管' : 'Annual license or monthly managed plan'}</p>
              <p className="mt-1 text-sm text-muted">{zh ? '平台费 + 按使用量计费。每个团队单独报价。' : 'Platform fee plus usage. Priced per team and agent.'}</p>
            </div>
            <a href="/build" className="form-submit shrink-0 rounded-lg px-5 py-3 text-sm font-semibold">{zh ? '获取报价' : 'Get pricing'}</a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
