'use client'

import { useLanguage } from '@/components/LanguageProvider'
import Section from '@/components/Section'

/**
 * "Your systems, your control": one symmetric drawing on a glass surface. Three sources on the left feed the Action
 * agent in the middle; everything it prepares stops at one approval gate, and only then fans out to three results on
 * the right. Light runs along the lines in that order. Positions are percentages, so the drawing keeps its shape at any width.
 */
type Text = { en: string; zh: string }

const ROWS = [22, 50, 78] // y of the three lanes, in % of the stage
const SOURCES: Text[] = [{ en: 'Inbox', zh: '邮箱' }, { en: 'Your systems', zh: '你的系统' }, { en: 'Team chat', zh: '办公软件' }]
const RESULTS: Text[] = [{ en: 'Report sent', zh: '报表已发' }, { en: 'Records updated', zh: '记录已更新' }, { en: 'Invoice issued', zh: '发票已开' }]
const FACTS: { title: Text; line: Text }[] = [
  { title: { en: 'Inside your environment.', zh: '在你的环境里。' }, line: { en: 'It runs on your laptop or company systems, under your controls.', zh: '跑在你的电脑或公司系统里，受你的权限控制。' } },
  { title: { en: 'A person at the right moment.', zh: '关键时刻有人把关。' }, line: { en: 'Anything that matters waits for your approval.', zh: '重要的操作都等你批准。' } },
  { title: { en: 'A clear trail.', zh: '每一步都有记录。' }, line: { en: 'Every step, source and decision can be reviewed.', zh: '每个步骤、来源和决定都能回查。' } },
]

const SIDE = 15, MID = 50, GATE = 69 // x of the outer columns, the agent and the gate, in %
const into = (y: number) => `M${SIDE} ${y} C${SIDE + 18} ${y} ${MID - 16} 50 ${MID} 50`
const out = (y: number) => `M${GATE} 50 C${GATE + 8} 50 ${100 - SIDE - 10} ${y} ${100 - SIDE} ${y}`

export default function PrivateAgentBanner() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const t = (x: Text) => (zh ? x.zh : x.en)

  return (
    <Section id="control" aria-labelledby="control-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="control-heading" className="h-section">{zh ? '你的系统，你说了算。' : <>Your systems. Your control.</>}</h2>
        <p className="lede mx-auto mt-3 max-w-[560px]">
          {zh ? 'Agent 私有部署在你的环境里，关键步骤等人批准，每一步都留有记录。' : 'Privately deployed in your environment, with approval points and a record of what happened.'}
        </p>
      </div>

      <div className="card arrive flow-card mt-6 overflow-hidden">
        <p className="pt-6 text-center text-xs text-muted sm:pt-7">{zh ? '一点自主，一条清楚的边界。' : 'A little autonomy. A clear boundary.'}</p>

        <div className="flow-stage" role="img" aria-label={zh ? '邮箱、系统和办公软件的信息汇入 Action Agent；它准备好的操作要等你批准，然后才发出报表、更新记录、开具发票' : 'Inbox, systems and team chat feed the Action agent; what it prepares waits for your approval, then reports are sent, records updated and invoices issued'}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {ROWS.map((y) => <path key={`i${y}`} className="flow-track" d={into(y)} />)}
            <path className="flow-track" d={`M${MID} 50 L${GATE} 50`} />
            {ROWS.map((y) => <path key={`o${y}`} className="flow-track" d={out(y)} />)}
            {ROWS.map((y, i) => <path key={`li${y}`} className="flow-light" pathLength={100} style={{ animationDelay: `${i * -1.1}s` }} d={into(y)} />)}
            <path className="flow-light flow-light-mid" pathLength={100} d={`M${MID} 50 L${GATE} 50`} />
            {ROWS.map((y, i) => <path key={`lo${y}`} className="flow-light flow-light-out" pathLength={100} style={{ animationDelay: `${i * -1.1 - 1.6}s` }} d={out(y)} />)}
          </svg>

          {SOURCES.map((s, i) => <span key={s.en} className="glass flow-node" style={{ left: `${SIDE}%`, top: `${ROWS[i]}%` }}>{t(s)}</span>)}

          <div className="glass flow-agent" style={{ left: `${MID}%`, top: '50%' }}>
            <svg viewBox="0 0 64 64" aria-hidden><path d="M13 44 H37 C43.5 44 46.5 41.5 48.5 37 L54 19" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <strong>{zh ? 'Action Agent' : 'Action agent'}</strong>
            <small>{zh ? '读取 · 准备 · 等待' : 'Reads. Prepares. Waits.'}</small>
          </div>

          <span className="flow-gate" style={{ left: `${GATE}%`, top: '50%' }}>
            <svg viewBox="0 0 16 16" aria-hidden><path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{zh ? '你批准' : 'You approve'}</span>
          </span>

          {RESULTS.map((s, i) => <span key={s.en} className="glass flow-node" style={{ left: `${100 - SIDE}%`, top: `${ROWS[i]}%` }}>{t(s)}</span>)}
        </div>

        <dl className="grid gap-5 border-t border-white/60 px-6 py-6 text-center sm:grid-cols-3 sm:gap-8 sm:px-10 sm:py-7">
          {FACTS.map((f) => (
            <div key={f.title.en}>
              <dt className="text-[13px] font-medium">{t(f.title)}</dt>
              <dd className="lede mx-auto mt-1.5 max-w-[260px] text-xs">{t(f.line)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
