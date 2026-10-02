import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#111111',
        'surface-2': '#141414',
        page: 'var(--page-bg)',
        panel: 'rgb(var(--panel-rgb) / <alpha-value>)',
        primary: 'var(--text-primary)',
        copy: 'var(--text-copy)',
        muted: 'var(--text-muted)',
        subtle: 'var(--text-subtle)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        control: 'var(--control-border)',
      },
      animation: {
        'marquee-left': 'marquee-left 34s linear infinite',
        'marquee-right': 'marquee-right 38s linear infinite',
      },
      keyframes: {
        'marquee-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
