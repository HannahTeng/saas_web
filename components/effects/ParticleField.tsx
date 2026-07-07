'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ────────────────────────────────────────────────────────────────────────
   ParticleField — Three.js points + connection lines ("data cloud")
   ------------------------------------------------------------------------
   A drifting cloud of glass-blue points; nearby points are joined by faint lines,
   forming a live network graph. The cloud reacts to:
     • mouse — a repulsion field pushes points away from the pointer, and the
       whole cloud tilts toward it;
     • scroll — the cloud rotates slowly with page scroll.
   Points wrap around the bounds so the field is endless. Pauses offscreen /
   on hidden tab. Renders nothing under prefers-reduced-motion (the CSS grid
   background carries the texture instead) and thins out on small screens.
   ──────────────────────────────────────────────────────────────────────── */

const CFG = {
  countDesktop: 170,
  countMobile: 70,
  bounds: new THREE.Vector3(11, 7, 5),
  speed: 0.16, // base drift speed
  linkDist: 1.9, // max distance for a connection line
  maxLinks: 900, // preallocated line segment budget
  mouseRadius: 2.6, // repulsion radius in world units
  mouseForce: 2.4,
  pointSize: 0.045,
}

export default function ParticleField({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const host = hostRef.current!

    let renderer: THREE.WebGLRenderer
    const canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 w-full h-full block'
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    } catch {
      return
    }
    host.appendChild(canvas)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const small = window.innerWidth < 768
    const COUNT = small ? CFG.countMobile : CFG.countDesktop

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.z = 9

    // ── Points ────────────────────────────────────────────────────────────
    const positions = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT * 3)
    const B = CFG.bounds
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() * 2 - 1) * B.x
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * B.y
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * B.z
      velocities[i * 3 + 0] = (Math.random() * 2 - 1) * CFG.speed
      velocities[i * 3 + 1] = (Math.random() * 2 - 1) * CFG.speed
      velocities[i * 3 + 2] = (Math.random() * 2 - 1) * CFG.speed * 0.4
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xc99a6f,
      size: CFG.pointSize,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
    const points = new THREE.Points(pGeo, pMat)
    scene.add(points)

    // ── Connection lines (preallocated buffer, rebuilt each frame) ────────
    const linePos = new Float32Array(CFG.maxLinks * 6)
    const lGeo = new THREE.BufferGeometry()
    const lAttr = new THREE.BufferAttribute(linePos, 3)
    lAttr.setUsage(THREE.DynamicDrawUsage)
    lGeo.setAttribute('position', lAttr)
    const lMat = new THREE.LineBasicMaterial({
      color: 0xc99a6f,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
    const lines = new THREE.LineSegments(lGeo, lMat)
    scene.add(lines)

    // ── Interaction state ─────────────────────────────────────────────────
    const mouseNDC = new THREE.Vector2(-10, -10)
    let mouseWorld = new THREE.Vector3(999, 999, 0)
    const raycastPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const raycaster = new THREE.Raycaster()
    let scrollRot = 0

    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      mouseNDC.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const onScroll = () => {
      scrollRot = (window.scrollY || 0) * 0.00035
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    // ── Loop ──────────────────────────────────────────────────────────────
    let raf = 0
    let running = false
    let onScreen = true
    let visible = true
    const clock = new THREE.Clock()

    const frame = () => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(clock.getDelta(), 0.05)

      // project mouse onto the z=0 plane for a world-space repulsor
      raycaster.setFromCamera(mouseNDC, camera)
      const hit = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(raycastPlane, hit)) mouseWorld = hit

      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3
        let px = positions[ix] + velocities[ix] * dt
        let py = positions[ix + 1] + velocities[ix + 1] * dt
        let pz = positions[ix + 2] + velocities[ix + 2] * dt

        // mouse repulsion (xy only)
        const dx = px - mouseWorld.x
        const dy = py - mouseWorld.y
        const d2 = dx * dx + dy * dy
        if (d2 < CFG.mouseRadius * CFG.mouseRadius && d2 > 0.0001) {
          const d = Math.sqrt(d2)
          const f = ((CFG.mouseRadius - d) / CFG.mouseRadius) * CFG.mouseForce * dt
          px += (dx / d) * f
          py += (dy / d) * f
        }

        // wrap bounds
        if (px > B.x) px = -B.x
        else if (px < -B.x) px = B.x
        if (py > B.y) py = -B.y
        else if (py < -B.y) py = B.y
        if (pz > B.z) pz = -B.z
        else if (pz < -B.z) pz = B.z

        positions[ix] = px
        positions[ix + 1] = py
        positions[ix + 2] = pz
      }
      pGeo.attributes.position.needsUpdate = true

      // rebuild connection lines
      let seg = 0
      const maxD2 = CFG.linkDist * CFG.linkDist
      outer: for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const ax = positions[i * 3] - positions[j * 3]
          const ay = positions[i * 3 + 1] - positions[j * 3 + 1]
          const az = positions[i * 3 + 2] - positions[j * 3 + 2]
          if (ax * ax + ay * ay + az * az < maxD2) {
            const o = seg * 6
            linePos[o] = positions[i * 3]
            linePos[o + 1] = positions[i * 3 + 1]
            linePos[o + 2] = positions[i * 3 + 2]
            linePos[o + 3] = positions[j * 3]
            linePos[o + 4] = positions[j * 3 + 1]
            linePos[o + 5] = positions[j * 3 + 2]
            seg++
            if (seg >= CFG.maxLinks) break outer
          }
        }
      }
      lGeo.setDrawRange(0, seg * 2)
      lAttr.needsUpdate = true

      // scroll rotation + gentle mouse tilt
      const targetRX = scrollRot + mouseNDC.y * 0.06
      const targetRY = mouseNDC.x * 0.1
      scene.rotation.x += (targetRX - scene.rotation.x) * 0.04
      scene.rotation.y += (targetRY - scene.rotation.y) * 0.04

      renderer.render(scene, camera)
    }

    const start = () => {
      if (running || !onScreen || !visible) return
      running = true
      clock.start()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        onScreen ? start() : stop()
      },
      { threshold: 0 },
    )
    io.observe(host)

    const onVisibility = () => {
      visible = !document.hidden
      visible ? start() : stop()
    }
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      pGeo.dispose()
      lGeo.dispose()
      pMat.dispose()
      lMat.dispose()
      renderer.dispose()
      host.removeChild(canvas)
    }
  }, [])

  return <div ref={hostRef} aria-hidden className={`pointer-events-none ${className}`} />
}
