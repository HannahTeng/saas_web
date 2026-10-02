// Anonymized testimonials use initials in neutral tones, with no photo claims.
const TONES = ['#30302e', '#393936', '#42423e', '#2b2b29']

type Props = {
  name: string
  className?: string
}

export default function Avatar({ name, className = 'w-8 h-8' }: Props) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  return (
    <span
      aria-hidden
      className={`${className} inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold border border-line/10 text-copy select-none`}
      style={{ background: TONES[hash % TONES.length] }}
    >
      {initials}
    </span>
  )
}
