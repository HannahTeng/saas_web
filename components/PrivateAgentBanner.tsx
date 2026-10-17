'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import Section from '@/components/Section'

/**
 * "Runs inside your walls" banner. One perimeter (the customer's company network), the agent inside it,
 * the customer's own systems around it. A scripted loop shows: actions stay inside, a consequential step waits for
 * a human, an outbound call is stopped at the wall, and every step lands in the audit log.
 */

type Pt = { x: number; y: number }
type Kind = 'read' | 'write' | 'wait' | 'ok' | 'block'
type Step = { to: number | 'gate' | 'wall' | null; kind: Kind; t: string; en: string; zh: string; hold?: boolean }

const AGENT: Pt = { x: 250, y: 200 }
const NODES: Pt[] = [{ x: 105, y: 105 }, { x: 395, y: 105 }, { x: 105, y: 295 }, { x: 395, y: 295 }]
const GATE: Pt = { x: 322, y: 248 } // between the agent and node 3
const WALL: Pt = { x: 470, y: 200 }

const SYSTEMS = [{ en: 'Email', zh: '邮箱' }, { en: 'ERP', zh: 'ERP' }, { en: 'Drive', zh: '云盘' }, { en: 'Billing', zh: '财务' }]

const SCRIPT: Step[] = [
  { to: 0, kind: 'read', t: '07:41', en: 'Read 14 new orders from Email', zh: '从邮箱读取 14 个新订单' },
  { to: 1, kind: 'read', t: '07:41', en: 'Matched them to ERP records', zh: '与 ERP 记录逐条核对' },
  { to: 2, kind: 'write', t: '07:42', en: 'Saved the daily report to Drive', zh: '日报已保存到云盘' },
  { to: 'gate', kind: 'wait', t: '07:42', en: 'Waiting: issue 14 invoices in Billing?', zh: '等待审批：在财务系统开 14 张发票？', hold: true },
  { to: 3, kind: 'ok', t: '07:46', en: 'Issued in Billing · approved by finance lead', zh: '已开票 · 财务主管批准' },
  { to: 'wall', kind: 'block', t: '07:46', en: 'Blocked: outbound call to an outside service', zh: '已拦截：向外部服务发送数据' },
]

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
  const [step, setStep] = useState(0)
  const [pulse, setPulse] = useState<{ p: Pt; moving: boolean }>({ p: AGENT, moving: false })
  const [still, setStill] = useState(false)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const label = useRef<SVGTextElement>(null)
  const [labelW, setLabelW] = useState(180)

  // The perimeter label's pill hugs its text: the drawing scales with the viewBox, but the type size changes per breakpoint.
  useEffect(() => {
    const fit = () => { const t = label.current; if (t) setLabelW(Math.ceil(t.getComputedTextLength()) + 40) }
    fit()
    document.fonts?.ready.then(fit)
    const mq = window.matchMedia('(max-width: 767px)')
    mq.addEventListener('change', fit)
    return () => mq.removeEventListener('change', fit)
  }, [zh])

  const script = SCRIPT
  const cur = script[step % script.length]

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
  }, [step, still]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (still || !visible) return
    const t = window.setTimeout(() => setStep((s) => (s + 1) % (script.length + 1)), cur ? STEP_MS * (cur.hold ? 1.5 : 1) : STEP_MS)
    return () => window.clearTimeout(t)
  }, [step, still, visible, script.length, cur])

  const onEnd = step % (script.length + 1) === script.length // short rest before the loop restarts
  const gateState: 'idle' | 'wait' | 'ok' = still ? 'ok' : cur?.kind === 'wait' ? 'wait' : step > 3 && !onEnd ? 'ok' : 'idle'
  const wallHit = still || step >= 5 // stays lit through the rest at the end of the loop
  const activeNode = !still && cur && typeof cur.to === 'number' ? cur.to : -1
  const current = still || onEnd ? -1 : step % script.length // the log entry being written right now
  const approved = still || step > 3 // the waiting entry has been answered

  return (
    <Section id="how-it-works">
      <div ref={root}>
        {/* One column here, unlike the showcase: headline, then the explanation under it. */}
        <div className="max-w-4xl">
          <p className="section-kicker">{zh ? '私有，可控' : 'Private by design'}</p>
          <h2 className="h-section mt-4">
            {zh ? 'Agent 住在你的系统里，数据不离开你的环境。' : <>Your agent lives inside your systems.{' '}<br className="hidden lg:inline" />Your data never leaves{' '}them.</>}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            {zh
              ? '通用 AI 助手把你的数据带到它们的云端。Flowact 把 Agent 内置到你的电脑或公司系统里：私有部署、受控运行、每一步可查。'
              : 'Generic AI assistants take your data to their cloud. Flowact builds the agent into your own laptop or company systems: privately deployed, run under your controls, every step on the record.'}
          </p>
        </div>

        <div className="card mt-10 grid overflow-hidden md:grid-cols-[3fr_2fr]">
          {/* Stage */}
          <div className="relative border-b border-line/10 p-3 md:border-b-0 md:border-r md:p-6">
            <svg viewBox="0 0 560 360" className="h-auto max-h-[420px] w-full" role="img"
              aria-label={zh ? 'Agent 在你的环境内工作，外发数据被拦截，关键操作等待人工批准' : 'The agent works inside your environment; outbound data is blocked and key actions wait for approval'}>
              {/* Outside: named once, where the outbound line ends */}
              <text x={WALL.x + 22} y="204" className="pab-t" fill="var(--text-subtle)" opacity=".75">{zh ? '外部' : 'Outside'}</text>

              {/* Perimeter */}
              <rect x="22" y="34" width="448" height="306" rx="16" fill="rgb(var(--accent-rgb) / .03)" stroke="var(--accent)" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="6 5" className="pab-march" />
              <g transform="translate(40 22)">
                <rect width={labelW} height="24" rx="12" fill="var(--panel-bg)" stroke="rgb(var(--accent-rgb) / .55)" />
                <path d="M14 10.5v-2a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
                <rect x="12" y="10.5" width="11" height="8" rx="1.5" fill="var(--accent)" />
                <text ref={label} x="30" y="16.5" className="pab-p" fill="var(--text-primary)">{zh ? '你的公司网络' : 'Your company network'}</text>
              </g>

              {/* The wall: always marked where the outbound line ends, lit when a call is stopped there */}
              <circle cx={WALL.x} cy={WALL.y} r="15" fill="var(--panel-bg)" stroke="rgb(var(--line-rgb) / .2)" />
              <g opacity={wallHit ? 1 : 0} style={{ transition: 'opacity .3s' }}>
                <circle cx={WALL.x} cy={WALL.y} r="15" fill="var(--danger)" fillOpacity=".15" stroke="var(--danger)" />
                <path d={`M${WALL.x - 5} ${WALL.y - 5}l10 10M${WALL.x + 5} ${WALL.y - 5}l-10 10`} stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Links */}
              {NODES.map((n, i) => (
                <line key={i} x1={AGENT.x} y1={AGENT.y} x2={n.x} y2={n.y}
                  stroke={activeNode === i ? 'var(--accent)' : 'rgb(var(--line-rgb) / .18)'} strokeWidth="1" style={{ transition: 'stroke .3s' }} />
              ))}
              <line x1={AGENT.x} y1={AGENT.y} x2={WALL.x} y2={WALL.y} stroke="rgb(var(--line-rgb) / .18)" strokeDasharray="3 4" />

              {/* Systems */}
              {NODES.map((n, i) => (
                <g key={i} transform={`translate(${n.x} ${n.y})`}>
                  <rect x="-52" y="-21" width="104" height="42" rx="8" fill="var(--panel-bg)"
                    stroke={activeNode === i ? 'var(--accent)' : 'rgb(var(--line-rgb) / .2)'} style={{ transition: 'stroke .3s' }} />
                  <text y="4.5" textAnchor="middle" className="pab-n" fill="var(--text-primary)">{zh ? SYSTEMS[i].zh : SYSTEMS[i].en}</text>
                </g>
              ))}

              {/* Approval gate */}
              <g transform={`translate(${GATE.x} ${GATE.y})`} style={{ transition: 'opacity .3s' }}>
                <rect x="-42" y="-13" width="84" height="26" rx="13" fill="var(--panel-bg)" />
                <rect x="-42" y="-13" width="84" height="26" rx="13"
                  fill={gateState === 'ok' ? 'rgb(var(--ok-rgb) / .16)' : gateState === 'wait' ? 'rgb(var(--warn-rgb) / .16)' : 'var(--panel-bg)'}
                  stroke={gateState === 'ok' ? 'var(--ok)' : gateState === 'wait' ? 'var(--warn)' : 'rgb(var(--line-rgb) / .25)'}
                  className={gateState === 'wait' ? 'pab-blink' : ''} />
                <text y="4" textAnchor="middle" className="pab-g" fill={gateState === 'ok' ? 'var(--ok)' : gateState === 'wait' ? 'var(--warn)' : 'var(--text-subtle)'}>
                  {gateState === 'ok' ? (zh ? '已批准 ✓' : 'Approved ✓') : (zh ? '需批准' : 'Approve?')}
                </text>
              </g>

              {/* Agent */}
              <circle cx={AGENT.x} cy={AGENT.y} r="36" fill="var(--panel-bg)" stroke="var(--accent)" strokeWidth="1.5" />
              <text x={AGENT.x} y={AGENT.y - 2} textAnchor="middle" className="pab-a" fontWeight="600" fill="var(--text-primary)">Flowact</text>
              <text x={AGENT.x} y={AGENT.y + 12} textAnchor="middle" className="pab-s" fill="var(--text-subtle)">agent</text>

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
            {/* The whole log is always on the page; the entry being written right now carries a faint highlight. */}
            <ol className="mt-4 border-t border-line/[0.07] font-mono text-[13px]" aria-live="polite">
              {script.map((s, i) => {
                const ok = s.kind === 'wait' && approved
                return (
                  <li key={i} className={`grid grid-cols-[2.75rem_auto_1fr] items-start gap-2.5 border-b border-line/[0.07] px-2 py-2.5 transition-colors duration-500 ${i === current ? 'bg-line/[0.05]' : ''}`}>
                    <span className="text-subtle">{s.t}</span>
                    <span className="mt-[5px] h-2 w-2 rounded-full transition-colors duration-500" style={{ background: ok ? KIND_COLOR.ok : KIND_COLOR[s.kind] }} />
                    <span className={s.kind === 'block' ? 'text-danger' : s.kind === 'wait' ? (ok ? 'text-ok' : 'text-warn') : 'text-copy'}>
                      {ok ? (zh ? '已批准：' : 'Approved: ') + (zh ? s.zh.replace(/^等待[^：]*：/, '') : s.en.replace(/^Waiting: /, '')).replace(/[?？]$/, '') : zh ? s.zh : s.en}
                    </span>
                  </li>
                )
              })}
            </ol>
            <p className="mt-auto pt-5 text-xs leading-relaxed text-subtle">
              {zh ? '每一步都留在你的环境里，可以随时回查。' : 'Every step is recorded inside your environment and can be reviewed any time.'}
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .pab-t,.pab-g{font-size:11px}.pab-n{font-size:15px}.pab-a{font-size:12.5px}.pab-s{font-size:10px}.pab-p{font-size:11.5px}
        /* The drawing scales with its 560px viewBox; on a phone that is about 0.6x, so the labels grow to stay legible (11px+). */
        @media (max-width:767px){.pab-t{font-size:18px}.pab-g{font-size:16px}.pab-n{font-size:20px}.pab-a{font-size:18px}.pab-s{font-size:13px}.pab-p{font-size:17px}}
        .pab-march{animation:pab-march 18s linear infinite}
        @keyframes pab-march{to{stroke-dashoffset:-220}}
        .pab-blink{animation:pab-blink 1.2s ease-in-out infinite}
        @keyframes pab-blink{50%{opacity:.45}}
        @media (prefers-reduced-motion: reduce){.pab-march,.pab-blink{animation:none}}
      `}</style>
    </Section>
  )
}
