'use client'

import { useEffect, useRef } from 'react'
import styles from './Landing.module.css'

const backgroundSource = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4'

export default function HeroBackground() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    const hero = video?.closest('section')
    const heading = hero?.querySelector('#hero-heading')
    if (!video || !hero || !heading) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let inView = true

    // Match the previous particle clearance, including after a language switch.
    const measure = () => {
      const clearY = Math.max(0, heading.getBoundingClientRect().top - video.getBoundingClientRect().top - 32)
      video.style.setProperty('--hero-art-clear-y', `${clearY}px`)
    }
    const syncPlayback = () => {
      if (motion.matches || document.hidden || !inView) {
        video.pause()
      } else {
        void video.play().catch(() => { /* Keep the loaded frame if autoplay is unavailable. */ })
      }
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(hero)
    if (heading.parentElement) resizeObserver.observe(heading.parentElement)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncPlayback()
    })
    visibilityObserver.observe(hero)
    motion.addEventListener('change', syncPlayback)
    document.addEventListener('visibilitychange', syncPlayback)
    video.addEventListener('loadeddata', syncPlayback)
    measure()
    syncPlayback()

    return () => {
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      motion.removeEventListener('change', syncPlayback)
      document.removeEventListener('visibilitychange', syncPlayback)
      video.removeEventListener('loadeddata', syncPlayback)
      video.pause()
    }
  }, [])

  return <video ref={ref} className={styles.heroVideo} src={backgroundSource} muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} />
}
