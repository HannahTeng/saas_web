import type { Config } from 'tailwindcss'

/* Every color here is a CSS variable from app/globals.css, so Tailwind and plain CSS share one palette. */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
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
        'accent-ink': 'rgb(var(--accent-ink-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        field: 'var(--field-bg)',
        ok: 'rgb(var(--ok-rgb) / <alpha-value>)',
        warn: 'rgb(var(--warn-rgb) / <alpha-value>)',
        danger: 'rgb(var(--danger-rgb) / <alpha-value>)',
      },
      boxShadow: {
        panel: '0 20px 60px rgb(20 40 44 / 0.14)',
      },
    },
  },
  plugins: [],
}
export default config
