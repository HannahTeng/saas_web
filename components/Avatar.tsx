// Placeholder avatar: deterministic silver-gradient circle with initials.
// No external image requests — swap for next/image portraits when real
// photos are available.

const GRADIENTS = [
  'linear-gradient(135deg, #242424, #626262)',
  'linear-gradient(135deg, #343434, #737373)',
  'linear-gradient(135deg, #1f1f1f, #525252)',
  'linear-gradient(135deg, #292929, #696969)',
  'linear-gradient(135deg, #303030, #777777)',
  'linear-gradient(135deg, #222222, #585858)',
]

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
      className={`${className} inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white/90 select-none`}
      style={{ background: GRADIENTS[hash % GRADIENTS.length] }}
    >
      {initials}
    </span>
  )
}
