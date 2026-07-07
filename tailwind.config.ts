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
        void:   '#F6F8FB', // page background
        panel:  '#FFFFFF', // raised surfaces
        deep:   '#EEF4F8', // slightly raised over void
        edge:   '#C8D6E1', // hairline borders
        accent: '#4B86A5', // single desaturated brand accent
        fg:     '#172333', // primary text
        mid:    '#40566C', // secondary text
        dim:    '#6E7F91', // tertiary / labels
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow:    '0 28px 80px rgba(58, 92, 118, 0.14)',
        glowSm:  '0 14px 34px rgba(58, 92, 118, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config
