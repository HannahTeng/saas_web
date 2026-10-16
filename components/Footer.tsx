'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { Wordmark } from '@/components/Logo'

export default function Footer() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <footer className="bg-page border-t border-line/[0.07] px-4 py-9 sm:px-6 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Wordmark height={26} />
            <p className="mt-2 text-sm text-subtle">
              {zh ? 'AI Agent 咨询与开发服务。' : 'AI agent consulting and development services.'}
            </p>
          </div>
          <a href="mailto:support@flowact.net" className="text-sm text-subtle transition-colors hover:text-primary">
            support@flowact.net
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between md:mt-10 md:pt-6">
          <p className="text-sm text-subtle">© 2026 Flowact, Inc. {zh ? '保留所有权利。' : 'All rights reserved.'}</p>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-subtle">
            <a href="/terms" className="hover:text-primary transition-colors">{zh ? '服务条款' : 'Terms'}</a>
            <a href="/privacy" className="hover:text-primary transition-colors">{zh ? '隐私政策' : 'Privacy'}</a>
            <a href="/refund" className="hover:text-primary transition-colors">{zh ? '退款政策' : 'Refunds'}</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
