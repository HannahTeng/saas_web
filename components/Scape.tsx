/**
 * The site's one image (.scape in globals.css): an out-of-focus sea under a pale sky, drawn in light and drifting slowly.
 * It fills its nearest positioned, isolated parent and sits behind that parent's content. To use a photograph or a film
 * instead, render it here in the same box with object-fit: cover.
 */
export default function Scape({ className = '' }: { className?: string }) {
  return <div className={`scape ${className}`.trim()} aria-hidden><i /><i /><i /><i /><i /></div>
}
