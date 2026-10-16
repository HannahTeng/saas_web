import type { Config } from 'tailwindcss'

/* Every color here is a CSS variable from app/globals.css, so Tailwind and plain CSS share one palette. */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        page: 'var(--page-bg)',
        panel: 'rgb(var(--panel-rgb) / <alpha-value>)',
        primary: 'var(--text-primary)',
        copy: 'var(--text-copy)',
        muted: 'var(--text-muted)',
        subtle: 'var(--text-subtle)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-hover': 'var(--accent-hover)',
        'accent-ink': 'var(--accent-ink)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        field: 'var(--field-bg)',
        ok: 'rgb(var(--ok-rgb) / <alpha-value>)',
        warn: 'rgb(var(--warn-rgb) / <alpha-value>)',
        danger: 'rgb(var(--danger-rgb) / <alpha-value>)',
      },
      boxShadow: {
        panel: '0 20px 60px rgb(0 0 0 / 0.5)',
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
