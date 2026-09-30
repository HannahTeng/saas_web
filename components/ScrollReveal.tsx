'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, type MotionStyle } from 'framer-motion'
import styles from './Landing.module.css'

/** Reversible reveal tied to scroll distance, with a static CSS fallback. */
export default function ScrollReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.68'],
  })

  return (
    <motion.div
      ref={ref}
      className={`${styles.scrollReveal} ${className}`}
      style={{ '--reveal-progress': scrollYProgress } as MotionStyle}
    >
      <div className={styles.scrollRevealContent}>{children}</div>
    </motion.div>
  )
}
