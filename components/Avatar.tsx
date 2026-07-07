// Placeholder avatar: deterministic warm-gradient circle with initials.
// No external image requests — swap for next/image portraits when real
// photos are available.

const GRADIENTS = [
  'linear-gradient(135deg, #78350F, #F59E0B)',
  'linear-gradient(135deg, #1E3A5F, #38BDF8)',
  'linear-gradient(135deg, #3B0764, #A78BFA)',
  'linear-gradient(135deg, #14532D, #4ADE80)',
  'linear-gradient(135deg, #7F1D1D, #FB7185)',
  'linear-gradient(135deg, #164E63, #2DD4BF)',
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
