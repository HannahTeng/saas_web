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
        void:   '#FAF6F0', // page background (warm cream)
        panel:  '#FFFFFF', // raised surfaces
        deep:   '#F3ECE2', // slightly raised over void
        edge:   '#E3D8C9', // hairline borders
        accent: '#C4703A', // single warm terracotta accent
        fg:     '#2C241C', // primary text (warm near-black)
        mid:    '#5D5044', // secondary text
        dim:    '#96897A', // tertiary / labels
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow:    '0 28px 80px rgba(140, 96, 58, 0.16)',
        glowSm:  '0 14px 34px rgba(140, 96, 58, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config
