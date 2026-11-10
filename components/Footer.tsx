'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { Logo } from '@/components/Logo'

export default function Footer() {
  const { language } = useLanguage()
  const zh = language === 'zh'
  const [paused, setPaused] = useState(false)

  // The image, the hero card, the control drawing and the arrivals all read this one switch.
  useEffect(() => { document.body.dataset.motion = paused ? 'paused' : 'running' }, [paused])

  return (
    <footer className="relative z-[1] bg-[var(--sand)] px-6 pb-8 pt-14 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-5 pb-7 md:grid-cols-[1fr_1.4fr_auto]">
          <a href="/#top" aria-label="Flowact home" className="col-start-1 row-start-1 justify-self-start"><Logo height={22} /></a>
          <p className="col-span-2 row-start-2 text-[13px] leading-[1.8] text-muted max-[379px]:row-start-3 md:col-span-1 md:col-start-2 md:row-start-1">
            {zh ? 'AI Agent 咨询与开发服务。' : 'AI agent consulting and development.'}<br />
            {zh ? '围绕你的工作方式来建。' : 'Built around the way you work.'}
          </p>
          <a href="mailto:support@flowact.net" className="col-start-2 row-start-1 justify-self-end py-2.5 text-sm hover:underline hover:underline-offset-4 max-[379px]:col-span-2 max-[379px]:col-start-1 max-[379px]:row-start-2 max-[379px]:justify-self-start md:col-start-3">support@flowact.net</a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-[var(--rule)] pt-[23px] text-[13px] text-subtle">
          <span>© 2026 Flowact, Inc. {zh ? '保留所有权利。' : 'All rights reserved.'}</span>
          <nav aria-label={zh ? '法律条款' : 'Legal'} className="flex gap-[23px]">
            <a href="/terms" className="py-2.5 hover:underline hover:underline-offset-4">{zh ? '服务条款' : 'Terms'}</a>
            <a href="/privacy" className="py-2.5 hover:underline hover:underline-offset-4">{zh ? '隐私政策' : 'Privacy'}</a>
            <a href="/refund" className="py-2.5 hover:underline hover:underline-offset-4">{zh ? '退款政策' : 'Refunds'}</a>
          </nav>
          <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="py-2.5 hover:underline hover:underline-offset-4">
            {paused ? (zh ? '播放动效' : 'Play motion') : (zh ? '暂停动效' : 'Pause motion')}
          </button>
        </div>
      </div>
    </footer>
  )
}
