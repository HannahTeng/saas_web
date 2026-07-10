'use client'

import { useLanguage } from '@/components/LanguageProvider'

export default function QuickContact() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  return (
    <details className="quick-contact group fixed bottom-4 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0b1019]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 marker:hidden">
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-sky-300/20 bg-sky-300/[0.07] text-sky-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 18.5 3.5 21l1-4.25A8.5 8.5 0 1 1 7 18.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          {zh ? '快速留言' : 'Quick message'}
        </span>
        <span className="text-lg text-gray-400 transition-transform group-open:rotate-45">+</span>
      </summary>

      <form
        action="https://formsubmit.co/6b47f16c7f6b9c2ab14b5f318ada11e1"
        method="POST"
        className="space-y-3 border-t border-white/10 px-4 pb-4 pt-4"
      >
        <input type="hidden" name="_subject" value={zh ? '网站快速留言' : 'Website quick message'} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

        <label className="block">
          <span className="text-xs font-medium text-gray-400">
            {zh ? '怎么联系你？' : 'How can I reach you?'}
          </span>
          <input
            required
            name="reply_contact"
            type="text"
            autoComplete="off"
            className="agent-input mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-sky-300/60"
            placeholder={zh ? '微信、WhatsApp、Telegram 或邮箱' : 'WhatsApp, WeChat, Telegram, or email'}
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-gray-400">
            {zh ? '你想让 Agent 做什么？' : 'What should the agent do?'}
          </span>
          <textarea
            required
            name="quick_message"
            rows={3}
            className="agent-input mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-sky-300/60"
            placeholder={zh ? '用一句话描述即可' : 'One sentence is enough'}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-sky-50"
        >
          {zh ? '发送留言 →' : 'Send message →'}
        </button>
        <p className="text-center text-[11px] leading-relaxed text-gray-600">
          {zh ? '无需公开私人手机号' : 'No private phone number is exposed'}
        </p>
      </form>
    </details>
  )
}
