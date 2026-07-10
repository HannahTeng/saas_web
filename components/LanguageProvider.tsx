'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Language = 'en' | 'zh'

type LanguageContextValue = {
  language: Language
  toggleLanguage: () => void
}

const STORAGE_KEY = 'hannah-site-language-v1'
const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [storageReady, setStorageReady] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'zh') setLanguage(saved)
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (!storageReady) return
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language, storageReady])

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'en' ? 'zh' : 'en'))
  }, [])

  const value = useMemo(() => ({ language, toggleLanguage }), [language, toggleLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
