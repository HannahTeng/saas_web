'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import styles from './Landing.module.css'

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage()
  const zh = language === 'zh'
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const query = window.matchMedia('(min-width: 901px)')
    const closeOnResize = () => { if (query.matches) setOpen(false) }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
      if (event.key === 'Tab') {
        const links = Array.from(nav.current?.querySelectorAll('a') ?? [])
        const items = [toggle.current, ...links].filter(Boolean) as HTMLElement[]
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    query.addEventListener('change', closeOnResize)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
      query.removeEventListener('change', closeOnResize)
    }
  }, [open])

  return (
    <header className={`${styles.header} ${open ? styles.menuOpen : ''}`}>
      <a href="#top" aria-label="Flowact — home" className={styles.logo} onClick={() => setOpen(false)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="1" y="1" width="22" height="22" rx="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 17.5V6.5h7M9 12h5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Flowact</span>
      </a>
      <div className={styles.backdrop} aria-hidden onClick={() => setOpen(false)} />
      <nav ref={nav} id="site-nav" aria-label={zh ? '主导航' : 'Primary'} className={styles.nav}>
        <a href="#cases" onClick={() => setOpen(false)}>{zh ? '真实案例' : 'Use cases'}</a>
        <a href="#agent-types" onClick={() => setOpen(false)}>{zh ? 'Agent 形态' : 'Agent forms'}</a>
        <a href="#how-it-works" onClick={() => setOpen(false)}>{zh ? '工作方式' : 'How it works'}</a>
        <a href="#contact" onClick={() => setOpen(false)}>{zh ? '联系我' : 'Let’s talk'}</a>
      </nav>
      <div className={styles.headerActions}>
        <button type="button" className={styles.language} onClick={toggleLanguage} aria-label={zh ? 'Switch site language to English' : '将网站切换为中文'}>{zh ? 'EN' : '中文'}</button>
        <a href="#contact" className={`${styles.button} ${styles.solid} ${styles.headerCta}`}>{zh ? '定制 Agent' : 'Start your agent'}</a>
        <button ref={toggle} type="button" className={styles.burger} aria-controls="site-nav" aria-expanded={open} aria-label={open ? (zh ? '关闭菜单' : 'Close menu') : (zh ? '打开菜单' : 'Open menu')} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
