export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <a href="#" aria-label="Hannah Teng — home" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="1" y="1" width="22" height="22" rx="6" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M8 6.5v11M16 6.5v11M8 12h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="font-semibold tracking-tight text-white">Hannah Teng</span>
        </a>

        <div className="flex items-center gap-4 md:gap-6">
          <a
            href="#how-it-works"
            className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href="#contact"
            className="bg-white text-black text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            Start your agent
          </a>
        </div>
      </nav>
    </header>
  )
}
