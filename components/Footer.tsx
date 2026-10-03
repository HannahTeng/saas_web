'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { Wordmark } from '@/components/Logo'

export default function Footer() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <footer className="bg-page border-t border-line/5 px-4 py-9 sm:px-6 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <div>
              <Wordmark height={26} />
              <p className="mt-2 text-sm text-subtle">
                {zh ? '重复工作交给 Agent，关键判断留给人。' : 'Agents do the repetition. Humans keep the judgment.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="mailto:support@flowact.net"
              className="text-sm text-subtle hover:text-primary transition-colors"
            >
              support@flowact.net
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line/5 pt-5 text-center sm:flex-row sm:text-left md:mt-10 md:pt-6">
          <p className="text-sm text-subtle">© 2026 Flowact, Inc. {zh ? '保留所有权利。' : 'All rights reserved.'}</p>
          <p className="text-sm text-subtle">
            {zh ? '企业 AI Agent 落地 · 10+ 行业已交付' : 'Enterprise AI agents · delivered across 10+ industries'}
          </p>
        </div>
      </div>
    </footer>
  )
}
