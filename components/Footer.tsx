'use client'

import { useLanguage } from '@/components/LanguageProvider'

export default function Footer() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <footer className="bg-black border-t border-white/5 px-4 py-9 sm:px-6 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="1" y="1" width="22" height="22" rx="6" stroke="#F59E0B" strokeWidth="1.5" />
              <path d="M8 6.5v11M16 6.5v11M8 12h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div>
              <p className="font-semibold text-white leading-tight">Hannah Teng</p>
              <p className="text-sm text-neutral-500">
                {zh ? '重复工作交给 Agent，关键判断留给人。' : 'Agents do the repetition. Humans keep the judgment.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="mailto:support@flowact.net"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              support@flowact.net
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-5 text-center sm:flex-row sm:text-left md:mt-10 md:pt-6">
          <p className="text-sm text-neutral-600">© 2026 Zihan (Hannah) Teng. {zh ? '保留所有权利。' : 'All rights reserved.'}</p>
          <p className="text-sm text-neutral-600">
            {zh ? '2026 年 8 月起开放 FDE、数据科学与 AI 产品全职机会' : 'Open to full-time FDE, data science & AI-product roles from August 2026'}
          </p>
        </div>
      </div>
    </footer>
  )
}
