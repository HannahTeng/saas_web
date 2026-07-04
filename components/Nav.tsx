'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { scrollToSection } from '@/components/providers/SmoothScroll'

const links = [
  { label: 'How it works', id: '#how', no: '01' },
  { label: 'Proof', id: '#projects', no: '02' },
  { label: 'About', id: '#about', no: '03' },
  { label: 'Capabilities', id: '#skills', no: '04' },
  { label: 'Start', id: '#contact', no: '05' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [clock, setClock] = useState('')
  const barRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const onHome = pathname === '/'

  useEffect(() => {
    // scroll-linked progress bar + condensed header state
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    // live UTC timestamp — console chrome
    const fmt = () => {
      const d = new Date()
      const p = (n: number) => String(n).padStart(2, '0')
      setClock(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`)
    }
    fmt()
    const t = setInterval(fmt, 1000)
    return () => clearInterval(t)
  }, [])

  const go = (id: string) => {
    setMenuOpen(false)
    if (onHome) scrollToSection(id)
    else router.push(`/${id}`)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-void/80 backdrop-blur-md border-b border-edge' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={(e) => {
              if (onHome) {
                e.preventDefault()
                scrollToSection('body')
              }
            }}
            className="font-mono font-bold text-sm text-fg tracking-[0.14em] hover:text-accent transition-colors duration-300"
            data-hover
          >
            HT<span className="text-accent">_</span>
          </Link>
          <span className="hidden lg:inline font-mono text-[9px] tracking-[0.2em] text-dim uppercase">
            {clock}
          </span>
        </div>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => go(l.id)}
                className="group font-mono text-[11px] uppercase tracking-[0.18em] text-mid hover:text-accent transition-colors duration-300"
                data-hover
              >
                <span className="text-accent/50 mr-1 group-hover:text-accent transition-colors">{l.no}</span>
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/HannahTeng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mid hover:text-accent transition-colors duration-300"
              data-hover
            >
              <GithubIcon />
            </a>
          </li>
        </ul>

        <button
          className="md:hidden text-mid hover:text-accent transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          data-hover
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* scroll-linked progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-edge/60">
        <div
          ref={barRef}
          className="h-full w-full bg-accent origin-left shadow-glowSm"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {menuOpen && (
        <div className="md:hidden bg-void/95 backdrop-blur-md border-b border-edge px-6 pb-6">
          <ul className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => go(l.id)}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-mid hover:text-accent transition-colors"
                >
                  <span className="text-accent/60 mr-2">{l.no}</span>
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/HannahTeng"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.18em] text-mid hover:text-accent transition-colors"
              >
                GitHub ↗
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

function GithubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
}
function XIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
