'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { OrderButton } from '@/components/order/OrderButton'
import styles from './Landing.module.css'
import { Wordmark } from './Logo'

const LINKS = [
  { href: '/#products', en: 'Agents', zh: '产品' },
  { href: '/#how-it-works', en: 'How it works', zh: '工作方式' },
  { href: '/build', en: 'Pricing', zh: '价格' },
  { href: '/#faq', en: 'FAQ', zh: '常见问题' },
]

/** The floating header: wordmark, the four links, the language switch and the one call to action. On phones the links open as a sheet under it. */
export default function Navbar() {
  const { language, toggleLanguage } = useLanguage()
  const zh = language === 'zh'
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const wide = window.matchMedia('(min-width: 801px)')
    const closeOnResize = () => { if (wide.matches) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
    const onDown = (e: PointerEvent) => { if (!header.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    wide.addEventListener('change', closeOnResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      wide.removeEventListener('change', closeOnResize)
    }
  }, [open])

  const languageSwitch = (
    <button type="button" className={styles.language} onClick={toggleLanguage} aria-label={zh ? 'Switch site language to English' : '将网站切换为中文'}>
      <span className={zh ? '' : styles.on}>EN</span><span aria-hidden>/</span><span className={zh ? styles.on : ''}>中文</span>
    </button>
  )

  return (
    <header ref={header} className={`glass ${styles.header} ${open ? styles.menuOpen : ''}`}>
      <a href="/#top" aria-label="Flowact home" className={styles.logo} onClick={() => setOpen(false)}>
        <Wordmark height={21} />
      </a>
      <nav id="site-nav" aria-label={zh ? '主导航' : 'Primary'} className={styles.nav}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{zh ? l.zh : l.en} <span aria-hidden>↗</span></a>
        ))}
        {languageSwitch}
      </nav>
      <div className={styles.headerActions}>
        {languageSwitch}
        <button ref={toggle} type="button" className={styles.menuButton} aria-controls="site-nav" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? (zh ? '关闭' : 'Close') : (zh ? '菜单' : 'Menu')}
        </button>
        <OrderButton />
      </div>
    </header>
  )
}
