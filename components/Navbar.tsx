'use client'

import { useLanguage } from '@/components/LanguageProvider'

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage()
  const zh = language === 'zh'

  return (
    <header className="sticky top-0 z-50 h-16 bg-[#06080d]/80 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        <a href="#" aria-label="Hannah Teng — home" className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="1" y="1" width="22" height="22" rx="6" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M8 6.5v11M16 6.5v11M8 12h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="font-semibold tracking-tight text-white">Hannah Teng</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <a
            href="#agent-types"
            className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
          >
            {zh ? 'Agent 形态' : 'Agent forms'}
          </a>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={zh ? 'Switch site language to English' : '将网站切换为中文'}
            className="language-toggle inline-flex h-9 min-w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] px-3 text-xs font-medium text-gray-300 transition-colors hover:border-sky-300/25 hover:text-white"
          >
            {zh ? 'EN' : '中文'}
          </button>
          <a
            href="#contact"
            className="whitespace-nowrap bg-white text-black text-sm font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            {zh ? '定制 Agent' : 'Start your agent'}
          </a>
        </div>
      </nav>
    </header>
  )
}
