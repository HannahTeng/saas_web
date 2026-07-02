import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void:   '#050507', // page background
        panel:  '#0A0D12', // raised surfaces
        deep:   '#07090D', // slightly raised over void
        edge:   '#1B222C', // hairline borders
        accent: '#00E5FF', // the one electric accent
        fg:     '#E6EDF3', // bright text
        mid:    '#93A0AE', // secondary text
        dim:    '#525D69', // tertiary / labels
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow:    '0 0 24px rgba(0,229,255,0.18)',
        glowSm:  '0 0 10px rgba(0,229,255,0.25)',
      },
    },
  },
  plugins: [],
}
export default config
