/**
 * Route transition — app/template.tsx remounts on every navigation, so the
 * terminal wipe overlay + content fade play between the home page and the
 * /work/[slug] case files. Pure CSS (see globals.css) and disabled entirely
 * under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="route-wipe" aria-hidden>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent/70">
          [sys] loading route … ok
        </span>
      </div>
      <div className="route-fade">{children}</div>
    </>
  )
}
