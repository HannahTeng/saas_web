'use client'

import { FormEvent, useState } from 'react'
import { submitRequest } from '@/lib/submitRequest'
import { CONSULTATION_RATE_USD } from '@/lib/requests'

type Item = { id: string; name: string; blurb: string; does: string[] }

const PERSONAL: Item[] = [
  { id: 'personal-assistant', name: 'Personal assistant', blurb: 'One assistant that knows your files, calendar and inbox.', does: ['Drafts emails and replies in your voice', 'Plans your week from your calendar', 'Finds anything across your files and notes'] },
  { id: 'knowledge-base', name: 'Private knowledge base', blurb: 'Ask questions across everything you have written or saved.', does: ['Connects notes, PDFs, docs and research', 'Answers with citations to your own sources', 'Stays private: your data, your accounts'] },
]

const MODULES: Item[] = [
  { id: 'email-agent', name: 'Email agent', blurb: 'Triage the inbox, attach the right files, draft replies.', does: ['Sorts and labels incoming mail', 'Drafts replies with attachments for approval', 'Follows up when nobody answers'] },
  { id: 'marketing-agent', name: 'Marketing agent', blurb: 'Content, posts and campaign reporting on a schedule.', does: ['Drafts posts and newsletters in brand voice', 'Schedules and tracks campaigns', 'Weekly performance summary'] },
  { id: 'support-agent', name: 'Customer support agent', blurb: 'Answers customers from your docs and order data.', does: ['Replies on email, chat or WhatsApp', 'Looks up orders and shipment status', 'Hands off to a person with full context'] },
  { id: 'data-agent', name: 'Data & report agent', blurb: 'One sentence in; numbers, charts and a PDF out.', does: ['Signs in to your ERP, OMP or database', 'States the definition behind every number', 'Exports charts and PDF reports'] },
  { id: 'document-agent', name: 'Document agent', blurb: 'Reads invoices, B/Ls and forms; fills your systems.', does: ['Extracts fields from PDFs and scans', 'Checks them against your records', 'Enters data and flags mismatches'] },
  { id: 'ops-agent', name: 'Operations & dispatch agent', blurb: 'Plans loads, routes and schedules inside your tools.', does: ['Pulls arrivals and orders automatically', 'Applies your capacity and timing rules', 'Waits for approval before anything moves'] },
]

const TIMES = ['This week', 'Next week', 'Flexible']
const ALL = [...PERSONAL, ...MODULES]

function Check({ on }: { on: boolean }) {
  return (
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${on ? 'border-accent bg-accent text-[#171614]' : 'border-line/25'}`} aria-hidden>
      {on && <svg width="12" height="12" viewBox="0 0 16 16"><path d="M3.5 8.4l3 3L12.5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </span>
  )
}

function ItemCard({ item, on, toggle }: { item: Item; on: boolean; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className={`group flex h-full flex-col gap-4 rounded-2xl border p-6 text-left transition-colors ${on ? 'border-accent/70 bg-accent/[0.06]' : 'border-line/10 bg-panel hover:border-line/25'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-primary">{item.name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.blurb}</p>
        </div>
        <Check on={on} />
      </div>
      <ul className="grid gap-1.5 text-sm text-copy">
        {item.does.map((d) => (
          <li key={d} className="flex gap-2"><span className="text-accent">·</span>{d}</li>
        ))}
      </ul>
      <p className="mt-auto pt-2 text-sm text-subtle">Request a quote</p>
    </button>
  )
}

const inputCls = 'agent-input w-full rounded-xl border border-line/15 px-4 py-3 text-[15px] text-primary outline-none placeholder:text-subtle focus:border-accent'

export default function BuildAgent() {
  const [picked, setPicked] = useState<string[]>([])
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  // consultation form
  const [cTopic, setCTopic] = useState('')
  const [cTime, setCTime] = useState(TIMES[0])
  const [cContact, setCContact] = useState('')
  const [cState, setCState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [cErr, setCErr] = useState('')

  // quote form
  const [qMsg, setQMsg] = useState('')
  const [qCompany, setQCompany] = useState('')
  const [qContact, setQContact] = useState('')
  const [qState, setQState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [qErr, setQErr] = useState('')
  const [honey, setHoney] = useState('')

  async function sendConsult(e: FormEvent) {
    e.preventDefault()
    setCState('sending')
    const err = await submitRequest({ kind: 'consultation', contact: cContact, message: cTopic, preferredTime: cTime, website: honey })
    if (err) { setCErr(err); setCState('idle') } else { setCErr(''); setCState('sent') }
  }

  async function sendQuote(e: FormEvent) {
    e.preventDefault()
    setQState('sending')
    const modules = ALL.filter((i) => picked.includes(i.id)).map((i) => i.name)
    const err = await submitRequest({ kind: 'quote', contact: qContact, company: qCompany, message: qMsg, modules, website: honey })
    if (err) { setQErr(err); setQState('idle') } else { setQErr(''); setQState('sent') }
  }

  const pickedNames = ALL.filter((i) => picked.includes(i.id)).map((i) => i.name)

  return (
    <main className="pb-32">
      {/* honeypot: hidden from people, filled by bots */}
      <input type="text" name="website" value={honey} onChange={(e) => setHoney(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

      <section className="px-4 pb-14 pt-16 text-center sm:px-6 md:pb-20 md:pt-24">
        <p className="section-kicker">Build your agent</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
          Pick the work. We build the <em className="em-accent">agent</em>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-muted">
          Start with an hour to map your workflow, or choose the agents you need and get a quote. Every agent runs inside the tools you already use, with a person approving what matters.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <a href="#consult" className="rounded-lg border border-line/20 px-4 py-2.5 text-copy hover:border-accent">Consultation</a>
          <a href="#personal" className="rounded-lg border border-line/20 px-4 py-2.5 text-copy hover:border-accent">For you</a>
          <a href="#business" className="rounded-lg border border-line/20 px-4 py-2.5 text-copy hover:border-accent">For your team</a>
        </div>
      </section>

      {/* Consultation */}
      <section id="consult" className="scroll-mt-24 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-line/10 md:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-5 bg-panel p-7 md:p-10">
            <p className="text-sm text-muted">Consultation</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-medium tracking-tight">${CONSULTATION_RATE_USD.toFixed(2)}</span>
              <span className="text-muted">/ hour</span>
            </div>
            <p className="max-w-sm text-muted">One working session with the engineer who will build it. Bring the task; leave with a plan.</p>
            <ul className="grid gap-2 text-sm text-copy">
              <li className="flex gap-2"><span className="text-accent">·</span>Walk through your real workflow and tools</li>
              <li className="flex gap-2"><span className="text-accent">·</span>Which agent fits, and what stays manual</li>
              <li className="flex gap-2"><span className="text-accent">·</span>A written scope and price range afterwards</li>
            </ul>
          </div>
          <div className="border-t border-line/10 bg-[#121211] p-7 md:border-l md:border-t-0 md:p-10">
            {cState === 'sent' ? (
              <div className="grid h-full content-center gap-3" role="status">
                <h2 className="text-3xl font-medium tracking-tight">Request received.</h2>
                <p className="text-muted">We’ll reply with available times within one business day.</p>
              </div>
            ) : (
              <form onSubmit={sendConsult} noValidate className="grid gap-4">
                <label htmlFor="c-topic" className="text-sm font-medium">What do you want to work through?</label>
                <textarea id="c-topic" rows={3} value={cTopic} onChange={(e) => setCTopic(e.target.value)} className={`${inputCls} resize-y`} placeholder="e.g. Our team spends 3 hours a day reconciling inbound data across two systems." />
                <fieldset className="grid gap-2">
                  <legend className="mb-2 text-sm font-medium">When suits you?</legend>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map((t) => (
                      <button key={t} type="button" onClick={() => setCTime(t)} aria-pressed={cTime === t} className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${cTime === t ? 'border-accent text-primary' : 'border-line/15 text-muted hover:text-primary'}`}>{t}</button>
                    ))}
                  </div>
                </fieldset>
                <label htmlFor="c-contact" className="text-sm font-medium">Where should we reply?</label>
                <input id="c-contact" value={cContact} onChange={(e) => setCContact(e.target.value)} autoComplete="email" className={inputCls} placeholder="Work email or WeChat ID" />
                {cErr && <p className="text-sm text-[#E89A86]" role="alert">{cErr}</p>}
                <button type="submit" disabled={cState === 'sending' || !cTopic.trim() || cContact.trim().length < 3} className="form-submit rounded-lg px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-35">
                  {cState === 'sending' ? 'Sending…' : 'Request a session'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Personal */}
      <section id="personal" className="scroll-mt-24 px-4 pt-20 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <p className="section-kicker">For you</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">A private assistant, built around <em className="em-accent">your</em> work.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PERSONAL.map((i) => <ItemCard key={i.id} item={i} on={picked.includes(i.id)} toggle={() => toggle(i.id)} />)}
          </div>
        </div>
      </section>

      {/* Business */}
      <section id="business" className="scroll-mt-24 px-4 pt-20 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <p className="section-kicker">For your team</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">Pick the modules. They share one <em className="em-accent">brain</em>.</h2>
          <p className="mt-3 max-w-2xl text-muted">Choose one or several. Modules connect to the same knowledge and permissions, so they work together instead of as separate bots.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((i) => <ItemCard key={i.id} item={i} on={picked.includes(i.id)} toggle={() => toggle(i.id)} />)}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="scroll-mt-24 px-4 pt-20 sm:px-6 md:pt-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line/10 bg-panel p-7 md:p-10">
          {qState === 'sent' ? (
            <div className="grid gap-3" role="status">
              <h2 className="text-3xl font-medium tracking-tight">Quote request received.</h2>
              <p className="text-muted">You’ll get a scope and price within one business day.</p>
            </div>
          ) : (
            <form onSubmit={sendQuote} noValidate className="grid gap-4">
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">Request a quote</h2>
              <div className="flex min-h-[2.25rem] flex-wrap gap-2">
                {pickedNames.length ? pickedNames.map((n) => (
                  <span key={n} className="rounded-full border border-accent/40 px-3 py-1 text-sm text-primary">{n}</span>
                )) : <span className="text-sm text-subtle">Select agents above, or just describe what you need.</span>}
              </div>
              <label htmlFor="q-msg" className="text-sm font-medium">Tell us about the work and the tools you use</label>
              <textarea id="q-msg" rows={4} value={qMsg} onChange={(e) => setQMsg(e.target.value)} className={`${inputCls} resize-y`} placeholder="e.g. 12-person ops team, Gmail + Shopify + our own WMS. We want inbox triage and a daily outbound report." />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="q-company" className="text-sm font-medium">Company <span className="text-subtle">(optional)</span></label>
                  <input id="q-company" value={qCompany} onChange={(e) => setQCompany(e.target.value)} autoComplete="organization" className={inputCls} placeholder="Company or team" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="q-contact" className="text-sm font-medium">Where should we reply?</label>
                  <input id="q-contact" value={qContact} onChange={(e) => setQContact(e.target.value)} autoComplete="email" className={inputCls} placeholder="Work email or WeChat ID" />
                </div>
              </div>
              {qErr && <p className="text-sm text-[#E89A86]" role="alert">{qErr}</p>}
              <button type="submit" disabled={qState === 'sending' || (!qMsg.trim() && !picked.length) || qContact.trim().length < 3} className="form-submit rounded-lg px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-35">
                {qState === 'sending' ? 'Sending…' : 'Request a quote'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Selection bar */}
      {picked.length > 0 && qState !== 'sent' && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-page/90 px-4 py-3 backdrop-blur-xl" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm text-copy">{picked.length} selected · {pickedNames.join(', ')}</p>
            <a href="#quote" className="form-submit shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold">Request a quote</a>
          </div>
        </div>
      )}
    </main>
  )
}
