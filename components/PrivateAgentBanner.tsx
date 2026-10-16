'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import Section from '@/components/Section'
import { onTabKey } from '@/components/tabs'

/**
 * "Runs inside your walls" banner. One perimeter (the customer's laptop or company network), the agent inside it,
 * the customer's own systems around it. A scripted loop shows: actions stay inside, a consequential step waits for
 * a human, an outbound call is stopped at the wall, and every step lands in the audit log.
 */

const MODES = ['personal', 'business'] as const
type Mode = (typeof MODES)[number]
type Pt = { x: number; y: number }
type Kind = 'read' | 'write' | 'wait' | 'ok' | 'block'
type Step = { to: number | 'gate' | 'wall' | null; kind: Kind; en: string; zh: string; hold?: boolean }

const AGENT: Pt = { x: 250, y: 200 }
const NODES: Pt[] = [{ x: 105, y: 105 }, { x: 395, y: 105 }, { x: 105, y: 295 }, { x: 395, y: 295 }]
const GATE: Pt = { x: 322, y: 248 } // between the agent and node 3
const WALL: Pt = { x: 470, y: 200 }

const SYSTEMS: Record<Mode, { en: string; zh: string }[]> = {
  business: [{ en: 'Email', zh: '邮箱' }, { en: 'ERP', zh: 'ERP' }, { en: 'Drive', zh: '云盘' }, { en: 'Billing', zh: '财务' }],
  personal: [{ en: 'Mail', zh: '邮件' }, { en: 'Calendar', zh: '日历' }, { en: 'Files', zh: '文件' }, { en: 'Messages', zh: '消息' }],
}

const SCRIPT: Record<Mode, Step[]> = {
  business: [
    { to: 0, kind: 'read', en: 'Read 14 new orders from Email', zh: '从邮箱读取 14 个新订单' },
    { to: 1, kind: 'read', en: 'Matched them to ERP records', zh: '与 ERP 记录逐条核对' },
    { to: 2, kind: 'write', en: 'Saved the daily report to Drive', zh: '日报已保存到云盘' },
    { to: 'gate', kind: 'wait', en: 'Waiting: issue 14 invoices in Billing?', zh: '等待审批：在财务系统开 14 张发票？', hold: true },
    { to: 3, kind: 'ok', en: 'Issued in Billing · approved by finance lead', zh: '已开票 · 财务主管批准' },
    { to: 'wall', kind: 'block', en: 'Blocked: outbound call to an outside service', zh: '已拦截：向外部服务发送数据' },
  ],
  personal: [
    { to: 0, kind: 'read', en: 'Read 6 unread emails', zh: '读取 6 封未读邮件' },
    { to: 1, kind: 'read', en: 'Found 2 free slots on Thursday', zh: '找到周四 2 个空档' },
    { to: 2, kind: 'write', en: 'Drafted a reply with contract.pdf', zh: '附上 contract.pdf 起草回复' },
    { to: 'gate', kind: 'wait', en: 'Waiting: send the reply to the client?', zh: '等待确认：把回复发给客户？', hold: true },
    { to: 3, kind: 'ok', en: 'Sent · approved by you', zh: '已发送 · 由你确认' },
    { to: 'wall', kind: 'block', en: 'Blocked: upload to a third-party cloud', zh: '已拦截：上传到第三方云端' },
  ],
}

const STEP_MS = 1900
const KIND_COLOR: Record<Kind, string> = {
  read: 'rgb(var(--line-rgb) / .75)', write: 'var(--accent)', wait: 'var(--warn)', ok: 'var(--ok)', block: 'var(--danger)',
}

function target(s: Step): Pt {
  if (s.to === 'gate') return GATE
  if (s.to === 'wall') return WALL
  if (s.to === null) return AGENT
  const n = NODES[s.to], dx = AGENT.x - n.x, dy = AGENT.y - n.y, k = 34 / Math.hypot(dx, dy)
  return { x: n.x + dx * k, y: n.y + dy * k }
}

export default function PrivateAgentBanner() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const [mode, setMode] = useState<Mode>('business')
  const [step, setStep] = useState(0)
  const [pulse, setPulse] = useState<{ p: Pt; moving: boolean }>({ p: AGENT, moving: false })
  const [still, setStill] = useState(false)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  const script = SCRIPT[mode]
  const cur = script[step % script.length]
  const done = still ? script.length : step % script.length // entries already logged before the current one

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setStill(m.matches)
    const on = () => setStill(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Each step: snap the pulse back to the agent, then send it to the step's target.
  useEffect(() => {
    if (still) return
    const from = cur.kind === 'ok' ? GATE : AGENT
    setPulse({ p: from, moving: false })
    const t = window.setTimeout(() => setPulse({ p: target(cur), moving: true }), 60)
    return () => window.clearTimeout(t)
  }, [step, mode, still]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (still || !visible) return
    const t = window.setTimeout(() => setStep((s) => (s + 1) % (script.length + 1)), cur ? STEP_MS * (cur.hold ? 1.5 : 1) : STEP_MS)
    return () => window.clearTimeout(t)
  }, [step, still, visible, script.length, cur])

  const onEnd = step % (script.length + 1) === script.length // short rest before the loop restarts
  const gateState: 'idle' | 'wait' | 'ok' = still ? 'ok' : cur?.kind === 'wait' ? 'wait' : step > 3 && !onEnd ? 'ok' : 'idle'
  const wallHit = still || (cur?.kind === 'block' && !onEnd)
  const activeNode = !still && cur && typeof cur.to === 'number' ? cur.to : -1
  const logCount = still ? script.length : onEnd ? script.length : done + 1

  const switchMode = (m: Mode) => { setMode(m); setStep(0) }

  return (
    <Section id="how-it-works">
      <div ref={root}>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="section-kicker">{zh ? '私有，可控' : 'Private by design'}</p>
            <h2 className="h-section mt-4 max-w-4xl">
              {zh ? 'Agent 住在你的系统里，数据不离开你的环境。' : 'Your agent lives inside your systems. Your data never leaves them.'}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {zh
                ? '通用 AI 助手把你的数据带到它们的云端。Flowact 把 Agent 内置到你的电脑或公司系统里：私有部署、受控运行、每一步可查。'
                : 'Generic AI assistants take your data to their cloud. Flowact builds the agent into your own laptop or company systems: privately deployed, run under your controls, every step on the record.'}
            </p>
          </div>
          <div role="tablist" aria-label={zh ? '场景' : 'Setting'} className="inline-flex w-fit rounded-full border border-line/20 p-1 text-sm">
            {MODES.map((m, i) => (
              <button key={m} type="button" role="tab" id={`pab-tab-${m}`} aria-controls="pab-panel" aria-selected={mode === m} tabIndex={mode === m ? 0 : -1}
                onClick={() => switchMode(m)} onKeyDown={(e) => onTabKey(e, i, MODES.length, (n) => switchMode(MODES[n]))}
                className={`rounded-full px-4 py-1.5 transition-colors ${mode === m ? 'bg-accent text-accent-ink' : 'text-muted hover:text-primary'}`}>
                {m === 'personal' ? (zh ? '个人' : 'Personal') : (zh ? '企业' : 'Business')}
              </button>
            ))}
          </div>
        </div>

        <div id="pab-panel" role="tabpanel" aria-labelledby={`pab-tab-${mode}`} className="card mt-8 grid overflow-hidden md:grid-cols-[1.45fr_1fr]">
          {/* Stage */}
          <div className="relative border-b border-line/10 p-3 md:border-b-0 md:border-r md:p-6">
            <svg viewBox="0 0 560 400" className="h-auto w-full" role="img"
              aria-label={zh ? 'Agent 在你的环境内工作，外发数据被拦截，关键操作等待人工批准' : 'The agent works inside your environment; outbound data is blocked and key actions wait for approval'}>
              <defs>
                <radialGradient id="pab-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="var(--accent)" stopOpacity=".35" />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outside world */}
              <g opacity=".75">
                <text x="516" y="150" textAnchor="middle" fontSize="11" fill="var(--text-subtle)">{zh ? '外部' : 'Outside'}</text>
                <text x="516" y="164" textAnchor="middle" fontSize="11" fill="var(--text-subtle)">{zh ? '云端' : 'cloud'}</text>
                <path d="M496 210a14 14 0 0 1 4-27 18 18 0 0 1 34 4 12 12 0 0 1 2 23z" fill="none" stroke="rgb(var(--line-rgb) / .3)" strokeWidth="1.4" strokeDasharray="3 3" />
              </g>

              {/* Perimeter */}
              <rect x="22" y="34" width="448" height="342" rx="26" fill="rgb(var(--accent-rgb) / .03)" stroke="var(--accent)" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="6 5" className="pab-march" />
              <g transform="translate(40 22)">
                <rect width={zh ? 132 : 168} height="24" rx="12" fill="var(--panel-bg)" stroke="rgb(var(--accent-rgb) / .55)" />
                <path d="M14 10.5v-2a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
                <rect x="12" y="10.5" width="11" height="8" rx="1.5" fill="var(--accent)" />
                <text x="30" y="16.5" fontSize="11.5" fill="var(--text-primary)">
                  {mode === 'business' ? (zh ? '你的公司网络' : 'Your company network') : (zh ? '你的电脑' : 'Your laptop')}
                </text>
              </g>

              {/* Wall hit */}
              <g opacity={wallHit ? 1 : 0} style={{ transition: 'opacity .3s' }}>
                <circle cx={WALL.x} cy={WALL.y} r="15" fill="var(--danger)" fillOpacity=".15" stroke="var(--danger)" />
                <path d={`M${WALL.x - 5} ${WALL.y - 5}l10 10M${WALL.x + 5} ${WALL.y - 5}l-10 10`} stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Links */}
              {NODES.map((n, i) => (
                <line key={i} x1={AGENT.x} y1={AGENT.y} x2={n.x} y2={n.y}
                  stroke={activeNode === i ? 'var(--accent)' : 'rgb(var(--line-rgb) / .14)'} strokeWidth={activeNode === i ? 1.6 : 1} style={{ transition: 'stroke .3s' }} />
              ))}
              <line x1={AGENT.x} y1={AGENT.y} x2={WALL.x} y2={WALL.y} stroke="rgb(var(--line-rgb) / .1)" strokeDasharray="2 4" />

              {/* Systems */}
              {NODES.map((n, i) => (
                <g key={i} transform={`translate(${n.x} ${n.y})`}>
                  <rect x="-52" y="-21" width="104" height="42" rx="11" fill="var(--panel-bg)"
                    stroke={activeNode === i ? 'var(--accent)' : 'rgb(var(--line-rgb) / .2)'} style={{ transition: 'stroke .3s' }} />
                  <text y="4.5" textAnchor="middle" fontSize="15" fill="var(--text-primary)">{zh ? SYSTEMS[mode][i].zh : SYSTEMS[mode][i].en}</text>
                </g>
              ))}

              {/* Approval gate */}
              <g transform={`translate(${GATE.x} ${GATE.y})`} style={{ transition: 'opacity .3s' }}>
                <rect x="-38" y="-13" width="76" height="26" rx="13" fill="var(--panel-bg)" />
                <rect x="-38" y="-13" width="76" height="26" rx="13"
                  fill={gateState === 'ok' ? 'rgb(var(--ok-rgb) / .16)' : gateState === 'wait' ? 'rgb(var(--warn-rgb) / .16)' : 'var(--panel-bg)'}
                  stroke={gateState === 'ok' ? 'var(--ok)' : gateState === 'wait' ? 'var(--warn)' : 'rgb(var(--line-rgb) / .25)'}
                  className={gateState === 'wait' ? 'pab-blink' : ''} />
                <text y="4" textAnchor="middle" fontSize="11" fill={gateState === 'ok' ? 'var(--ok)' : gateState === 'wait' ? 'var(--warn)' : 'var(--text-subtle)'}>
                  {gateState === 'ok' ? (zh ? '已批准 ✓' : 'Approved ✓') : (zh ? '需批准' : 'Approve?')}
                </text>
              </g>

              {/* Agent */}
              <circle cx={AGENT.x} cy={AGENT.y} r="62" fill="url(#pab-glow)" />
              <circle cx={AGENT.x} cy={AGENT.y} r="32" fill="var(--panel-bg)" stroke="var(--accent)" strokeWidth="1.5" />
              <text x={AGENT.x} y={AGENT.y - 2} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--text-primary)">Flowact</text>
              <text x={AGENT.x} y={AGENT.y + 12} textAnchor="middle" fontSize="10" fill="var(--text-subtle)">agent</text>

              {/* Pulse */}
              {!still && cur && !onEnd && (
                <g style={{ transform: `translate(${pulse.p.x}px, ${pulse.p.y}px)`, transition: pulse.moving ? 'transform .85s cubic-bezier(.45,0,.2,1)' : 'none' }}>
                  <circle r="9" fill={KIND_COLOR[cur.kind]} opacity=".22" />
                  <circle r="4.5" fill={KIND_COLOR[cur.kind]} />
                </g>
              )}
            </svg>
          </div>

          {/* Audit log */}
          <div className="flex flex-col p-5 md:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{zh ? '操作记录' : 'Audit log'}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                <span className="h-1.5 w-1.5 rounded-full bg-ok pab-blink" /> {zh ? '实时' : 'Live'}
              </span>
            </div>
            <ol className="mt-4 grid gap-2 font-mono text-xs" aria-live="polite">
              {script.map((s, i) => (
                <li key={`${mode}-${i}`}
                  className="flex items-start gap-2.5 rounded-lg border border-line/[0.07] bg-line/[0.02] px-3 py-2 transition-all duration-500"
                  style={{ opacity: i < logCount ? 1 : 0.18, transform: i < logCount ? 'none' : 'translateY(4px)' }}>
                  <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full" style={{ background: s.kind === 'wait' && i < logCount - 1 ? KIND_COLOR.ok : KIND_COLOR[s.kind] }} />
                  <span className={s.kind === 'block' ? 'text-danger' : s.kind === 'wait' ? (i < logCount - 1 ? 'text-ok' : 'text-warn') : 'text-copy'}>
                    {s.kind === 'wait' && i < logCount - 1 ? (zh ? '已批准：' : 'Approved: ') + (zh ? s.zh.replace(/^等待[^：]*：/, '') : s.en.replace(/^Waiting: /, '')).replace(/[?？]$/, '') : zh ? s.zh : s.en}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-auto pt-5 text-xs leading-relaxed text-subtle">
              {zh ? '每一步都留在你的环境里，可以随时回查。' : 'Every step is recorded inside your environment and can be reviewed any time.'}
            </p>
          </div>
        </div>

        {/* Claims */}
        <dl className="card mt-8 grid gap-px overflow-hidden bg-line/10 sm:grid-cols-2 lg:grid-cols-4">
          {(zh
            ? [
                ['运行在你的环境', '部署在你的电脑、服务器或私有云，不是我们的平台。'],
                ['数据不出门', '默认不外发；只连接你授权的系统。'],
                ['关键操作你说了算', '发送、放行、付款前都会停下来等你批准。'],
                ['接入现有工具', '邮件、ERP、CRM、文件，不用换系统。'],
              ]
            : [
                ['Runs in your environment', 'Deployed on your laptop, servers or private cloud, not ours.'],
                ['Data stays inside', 'Nothing goes out by default. It only touches systems you authorize.'],
                ['You approve what matters', 'It stops before sending, releasing or paying, and waits for you.'],
                ['Built into your tools', 'Email, ERP, CRM, files. No new system to move to.'],
              ]).map(([t, d]) => (
            <div key={t} className="bg-page p-5">
              <dt className="font-medium text-primary">{t}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-subtle">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
      <style>{`
        .pab-march{animation:pab-march 18s linear infinite}
        @keyframes pab-march{to{stroke-dashoffset:-220}}
        .pab-blink{animation:pab-blink 1.2s ease-in-out infinite}
        @keyframes pab-blink{50%{opacity:.45}}
        @media (prefers-reduced-motion: reduce){.pab-march,.pab-blink{animation:none}}
      `}</style>
    </Section>
  )
}
