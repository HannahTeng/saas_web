/** Everything orderable, in both languages. The order panel and the pricing page read from here. */

export type Item = { id: string; en: string; zh: string; enLine: string; zhLine: string }

export const CORE_AGENTS: Item[] = [
  { id: 'data-agent', en: 'Data Agent', zh: '数据 Agent', enLine: 'One question in; numbers, charts and a PDF out.', zhLine: '一句话提问，返回数字、图表和 PDF。' },
  { id: 'dispatch-agent', en: 'Dispatch Agent', zh: '调度 Agent', enLine: 'Containers in; full trucks out, booked on your yes.', zhLine: '到货柜进来，整车方案出去，确认后约车。' },
  { id: 'docs-agent', en: 'Docs Agent', zh: '单证 Agent', enLine: 'Invoices, B/Ls and customs forms read, checked and filed.', zhLine: '发票、提单、报关单：读取、核对、录入。' },
]

export const ADDON_AGENTS: Item[] = [
  { id: 'email-agent', en: 'Email Agent', zh: '邮件 Agent', enLine: 'Inbox triage, attachments, drafted replies.', zhLine: '邮件分拣、附件匹配、起草回复。' },
  { id: 'support-agent', en: 'Customer Support Agent', zh: '客服 Agent', enLine: 'Answers from your docs and order data.', zhLine: '基于你的文档和订单数据回复客户。' },
  { id: 'knowledge-agent', en: 'Knowledge Agent', zh: '知识 Agent', enLine: 'Plain-language questions, answers cited to the record.', zhLine: '自然语言提问，答案引用到原始记录。' },
  { id: 'personal-assistant', en: 'Personal Assistant', zh: '个人助理', enLine: 'Files, calendar and inbox, for one person.', zhLine: '面向个人的文件、日程和邮箱助理。' },
]

export const PLANS: (Item & { priceEn: string; priceZh: string; bulletsEn: string[]; bulletsZh: string[]; recommended?: boolean })[] = [
  {
    id: 'annual', en: 'Annual license', zh: '年度授权', recommended: true,
    enLine: 'Fixed-price build, then a yearly license with maintenance and upgrades.', zhLine: '固定价格交付，之后按年授权，含维护与升级。',
    priceEn: 'From a fixed quote', priceZh: '固定报价起',
    bulletsEn: ['Agents configured to your systems and rules', 'Maintenance and upgrades included', 'Usage (model and compute) billed at cost plus margin'],
    bulletsZh: ['按你的系统和规则配置 Agent', '含维护与升级', '模型与算力用量按成本加成计费'],
  },
  {
    id: 'managed', en: 'Monthly managed', zh: '按月托管',
    enLine: 'We run and improve the agents for you every month.', zhLine: '我们每月为你运行并持续优化 Agent。',
    priceEn: 'Monthly fee', priceZh: '按月付费',
    bulletsEn: ['New requests every month', 'Dedicated support, fast response', 'Cancel any time'],
    bulletsZh: ['每月可提新需求', '专人支持，快速响应', '随时可取消'],
  },
  {
    id: 'scoping', en: 'Scoping session', zh: '需求梳理会',
    enLine: '60 minutes to map your workflow to the right agents.', zhLine: '60 分钟，把你的流程对应到合适的 Agent。',
    priceEn: '$19.90 · 60 min', priceZh: '$19.90 · 60 分钟',
    bulletsEn: ['Walk through your real workflow and tools', 'Which agent fits, and what stays manual', 'A written rollout plan afterwards'],
    bulletsZh: ['走一遍真实流程和工具', '哪些该交给 Agent，哪些保留人工', '会后给出书面实施方案'],
  },
]
