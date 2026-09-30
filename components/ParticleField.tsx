'use client'

import { useEffect, useRef } from 'react'
import styles from './Landing.module.css'

type Particle = {
  u: number
  v: number
  jitter: number
  size: number
  shade: number
  dx: number
  dy: number
}

/** A live point field: individual points breathe and spring away from the pointer. */
export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const hero = canvas?.closest('section')
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context || !hero) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame = 0
    let lastTime = 0
    let elapsed = 0
    let visible = true
    let pointerActive = false
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0 }
    const tau = Math.PI * 2

    // Deterministic jitter keeps the field stable through resize and hydration.
    const noise = (seed: number) => {
      const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
      return value - Math.floor(value)
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const mobile = width <= 900
      const time = motionPreference.matches ? 0 : elapsed
      const breath = 1 + Math.sin(time * .65) * .022
      const interactionRadius = Math.min(200, width * .22)
      const damping = .14
      pointer.x += (pointer.targetX - pointer.x) * damping
      pointer.y += (pointer.targetY - pointer.y) * damping
      pointer.strength += ((pointerActive && !motionPreference.matches ? 1 : 0) - pointer.strength) * .08
      const buckets: number[][] = Array.from({ length: 8 }, () => [])

      for (const point of particles) {
        const { u, v, jitter } = point
        // A shallow three-dimensional ribbon leaves the copy below it clear.
        const wave = Math.sin(u * tau * 1.1 + time * .28)
        const center = height * ((mobile ? .05 : .12) + Math.sin(u * Math.PI) * (mobile ? .12 : .20) + wave * .035)
        const depth = Math.sin(v * 3.8 + u * 5.2 + time * .2)
        const spread = height * (mobile ? .12 : .22) * breath
        const x = u * width + Math.sin(u * 9 + v * 4 + time * .22) * width * .013 + jitter * 2
        const y = center + v * spread + depth * height * (mobile ? .018 : .025) + Math.sin(time * .4 + point.shade) * 2
        const mx = x - pointer.x
        const my = y - pointer.y
        const distance = Math.hypot(mx, my)
        const influence = Math.max(0, 1 - distance / interactionRadius) ** 2 * pointer.strength
        const force = influence * 38
        const ripple = Math.sin(distance * .04 - time * 2) * influence * 4
        const divisor = Math.max(distance, 1)
        point.dx += (mx / divisor * force - point.dx) * .09
        point.dy += (my / divisor * force + ripple - point.dy) * .09
        const brightness = .45 + Math.sin(time * .6 + u * 5 + v * 2) * .09
        const fade = Math.max(.1, 1 - Math.abs(v) * .8)
        const bucket = Math.min(7, Math.max(0, Math.floor((brightness * fade + influence * .25) * 8)))
        buckets[bucket].push(x + point.dx, y + point.dy, point.size)
      }

      // Batch points by luminance to avoid thousands of canvas state changes.
      buckets.forEach((points, index) => {
        context.fillStyle = `rgba(232,232,232,${(index + 1) / 10})`
        context.beginPath()
        for (let i = 0; i < points.length; i += 3) {
          const [x, y, radius] = [points[i], points[i + 1], points[i + 2]]
          context.moveTo(x + radius, y)
          context.arc(x, y, radius, 0, tau)
        }
        context.fill()
      })
    }

    const tick = (timestamp: number) => {
      frame = 0
      if (!visible || document.hidden || motionPreference.matches) return
      if (lastTime) elapsed += Math.min((timestamp - lastTime) / 1000, .05)
      lastTime = timestamp
      draw()
      frame = window.requestAnimationFrame(tick)
    }

    const syncAnimation = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
      if (motionPreference.matches) {
        pointerActive = false
        pointer.strength = 0
        particles.forEach(point => { point.dx = 0; point.dy = 0 })
        draw()
      } else if (visible && !document.hidden) {
        frame = window.requestAnimationFrame(tick)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, width <= 900 ? 1.5 : 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const columns = width <= 900 ? 88 : 170
      const rows = width <= 900 ? 22 : 34
      particles = Array.from({ length: columns * rows }, (_, index) => ({
        u: (index % columns + (noise(index) - .5) * .6) / (columns - 1),
        v: (Math.floor(index / columns) + (noise(index + 9) - .5) * .6) / (rows - 1) - .5,
        jitter: noise(index + 3) - .5,
        size: .45 + noise(index + 5) * .72,
        shade: noise(index + 11) * tau,
        dx: 0,
        dy: 0,
      }))
      draw()
      syncAnimation()
    }

    const move = (event: Event) => {
      const pointerEvent = event as PointerEvent
      if (pointerEvent.pointerType !== 'mouse' || motionPreference.matches) return
      const rect = canvas.getBoundingClientRect()
      pointer.targetX = pointerEvent.clientX - rect.left
      pointer.targetY = pointerEvent.clientY - rect.top
      if (!pointerActive) { pointer.x = pointer.targetX; pointer.y = pointer.targetY }
      pointerActive = true
    }
    const leave = () => { pointerActive = false }
    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) pointerActive = false
      syncAnimation()
    })

    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', syncAnimation)
    motionPreference.addEventListener('change', syncAnimation)
    resize()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', syncAnimation)
      motionPreference.removeEventListener('change', syncAnimation)
    }
  }, [])

  return <canvas ref={ref} className={styles.particleCanvas} aria-hidden="true" />
}
