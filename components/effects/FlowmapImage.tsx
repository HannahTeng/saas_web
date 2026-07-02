'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/* ────────────────────────────────────────────────────────────────────────
   FlowmapImage — WebGL flowmap image-distortion trail
   ------------------------------------------------------------------------
   A single image that smears/pushes around under the cursor and slowly heals.
   Implemented with a ping-pong FBO flowmap:

     • Two float render targets (rtA, rtB) are swapped every frame.
     • UPDATE pass  → reads the PREVIOUS trail, multiplies it by `decay`
                      (self-healing), then additively stamps a soft radial
                      brush at the cursor encoding mouse velocity into R/G.
                      Result is written into the OTHER target.
     • MAIN pass    → draws the image, sampling the current trail as a
                      displacement map (offsets UVs by the trail vector) and
                      applying a small velocity-proportional RGB split.

   Reduced-motion / touch / WebGL-failure all fall back to a static <img>.
   ──────────────────────────────────────────────────────────────────────── */

// ── Tuning params — safe to tweak live ──────────────────────────────────
const CONFIG = {
  brushRadius: 0.15, // radius of the cursor brush, in UV space (aspect-corrected)
  brushStrength: 1.2, // how hard each frame stamps velocity into the trail
  decay: 0.93, // per-frame trail multiplier (<1). Lower = heals faster
  displacementScale: 0.35, // how far the image UVs are pushed by the trail
  rgbSplitAmount: 0.012, // chromatic aberration proportional to trail strength
  velocityGain: 1.0, // scales raw pointer velocity before it enters the brush
}

// ── Shared fullscreen-quad vertex shader (no camera; NDC positions) ──────
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// ── UPDATE pass: decay previous trail + additive velocity brush ──────────
const UPDATE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uPrev;      // previous frame's trail (ping-pong read)
  uniform vec2  uMouse;         // cursor position in UV space
  uniform vec2  uVelocity;      // cursor velocity (UV / frame)
  uniform float uAspect;        // width / height, keeps the brush circular
  uniform float uBrushRadius;
  uniform float uBrushStrength;
  uniform float uDecay;

  void main() {
    // 1) read + decay the existing trail  → this is the "self-healing"
    vec4 prev = texture2D(uPrev, vUv);
    prev.rg *= uDecay;

    // 2) soft radial brush around the cursor (aspect-corrected so it's round)
    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    float brush = smoothstep(uBrushRadius, 0.0, length(d)); // 1 center → 0 edge

    // 3) additively blend the mouse velocity into R/G
    vec2 rg = prev.rg + uVelocity * brush * uBrushStrength;
    rg = clamp(rg, -1.0, 1.0);

    gl_FragColor = vec4(rg, 0.0, 1.0);
  }
`

// ── MAIN pass: displace + RGB-split the image using the trail ────────────
const MAIN_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uImage;
  uniform sampler2D uTrail;      // current trail (RG = displacement vector)
  uniform vec2  uCoverScale;     // UV scale for object-fit: cover
  uniform float uDisplacement;
  uniform float uRgbSplit;

  void main() {
    vec2 trail = texture2D(uTrail, vUv).rg;

    // object-fit: cover — scale UVs about the centre
    vec2 uv = (vUv - 0.5) * uCoverScale + 0.5;

    vec2  disp     = trail * uDisplacement;
    float strength = length(trail);
    float split    = strength * uRgbSplit;

    // sample each channel with a slightly different offset → RGB split
    float r = texture2D(uImage, uv - disp + vec2(split, 0.0)).r;
    float g = texture2D(uImage, uv - disp).g;
    float b = texture2D(uImage, uv - disp - vec2(split, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`

type Props = {
  /** Swap for your own hero image. `/hero.jpg` is the intended placeholder;
   *  defaults to the existing portrait so it works out of the box. */
  src?: string
  alt?: string
  enableFlowmap?: boolean
  className?: string
}

export default function FlowmapImage({
  src = '/profile.jpg', // ← swap to '/hero.jpg' once you drop one in /public
  alt = '',
  enableFlowmap = true,
  className = '',
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    // Skip WebGL on reduced-motion, touch/coarse pointers, or when disabled.
    if (!enableFlowmap || reduced || !fine) return

    const host = hostRef.current!
    const canvas = canvasRef.current!

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    } catch {
      setWebglOk(false)
      return
    }

    const dpr = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(dpr)

    // Fullscreen quad shared by both passes.
    const quad = new THREE.PlaneGeometry(2, 2)

    // Ping-pong render targets — half-float so we can store signed velocity.
    const makeRT = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      })
    let rtA = makeRT(2, 2)
    let rtB = makeRT(2, 2)

    // UPDATE material (writes the trail).
    const updateMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: UPDATE_FRAG,
      uniforms: {
        uPrev: { value: rtA.texture },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: 1 },
        uBrushRadius: { value: CONFIG.brushRadius },
        uBrushStrength: { value: CONFIG.brushStrength },
        uDecay: { value: CONFIG.decay },
      },
    })

    // MAIN material (draws the image to screen).
    const mainMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: MAIN_FRAG,
      uniforms: {
        uImage: { value: null as THREE.Texture | null },
        uTrail: { value: rtB.texture },
        uCoverScale: { value: new THREE.Vector2(1, 1) },
        uDisplacement: { value: CONFIG.displacementScale },
        uRgbSplit: { value: CONFIG.rgbSplitAmount },
      },
    })

    const scene = new THREE.Scene()
    const mesh = new THREE.Mesh(quad, mainMat)
    scene.add(mesh)
    const camera = new THREE.Camera() // shaders ignore it; positions are NDC

    const updateScene = new THREE.Scene()
    const updateMesh = new THREE.Mesh(quad, updateMat)
    updateScene.add(updateMesh)

    // ── Pointer → UV mapping (Lenis-safe: uses real client coords) ────────
    const mouse = new THREE.Vector2(-10, -10)
    const lastUv = new THREE.Vector2(-10, -10)
    const vel = new THREE.Vector2(0, 0)
    let hasLast = false

    const onPointerMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      const u = (e.clientX - r.left) / r.width
      const v = 1 - (e.clientY - r.top) / r.height // flip Y into UV space
      mouse.set(u, v)
      if (hasLast) {
        vel.set((u - lastUv.x) * CONFIG.velocityGain, (v - lastUv.y) * CONFIG.velocityGain)
      }
      lastUv.set(u, v)
      hasLast = true
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    // ── Sizing (canvas + render targets track the host box) ───────────────
    let cover = new THREE.Vector2(1, 1)
    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)

      // Trail RTs at capped resolution (cheap; displacement doesn't need dpr).
      const rw = Math.max(2, Math.round(Math.min(w, 900)))
      const rh = Math.max(2, Math.round(Math.min(h, 900)))
      rtA.setSize(rw, rh)
      rtB.setSize(rw, rh)
      updateMat.uniforms.uAspect.value = w / h

      // object-fit: cover UV scale, using the loaded image's aspect.
      const tex = mainMat.uniforms.uImage.value
      if (tex && tex.image) {
        const iA = tex.image.width / tex.image.height
        const cA = w / h
        if (cA > iA) cover.set(1, iA / cA)
        else cover.set(cA / iA, 1)
        mainMat.uniforms.uCoverScale.value.copy(cover)
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // Clear both targets so we start from a blank trail.
    const clearRT = (rt: THREE.WebGLRenderTarget) => {
      renderer.setRenderTarget(rt)
      renderer.setClearColor(0x000000, 1)
      renderer.clear()
    }

    // ── Load image, then start the loop ───────────────────────────────────
    let raf = 0
    let running = false
    let visible = true
    let onScreen = true

    const loader = new THREE.TextureLoader()
    loader.load(
      src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        mainMat.uniforms.uImage.value = tex
        clearRT(rtA)
        clearRT(rtB)
        resize()
        start()
      },
      undefined,
      () => setWebglOk(false), // image failed → static fallback
    )

    const frame = () => {
      raf = requestAnimationFrame(frame)

      // ease velocity back to zero so the trail settles when the mouse stops
      vel.multiplyScalar(0.9)

      // 1) UPDATE pass — read rtA, write rtB
      updateMat.uniforms.uPrev.value = rtA.texture
      updateMat.uniforms.uMouse.value.copy(mouse)
      updateMat.uniforms.uVelocity.value.copy(vel)
      renderer.setRenderTarget(rtB)
      renderer.render(updateScene, camera)

      // 2) ping-pong swap — rtB becomes the current trail
      const tmp = rtA
      rtA = rtB
      rtB = tmp
      mainMat.uniforms.uTrail.value = rtA.texture

      // 3) MAIN pass — draw the displaced image to the screen
      renderer.setRenderTarget(null)
      renderer.render(scene, camera)
    }

    const start = () => {
      if (running || !visible || !onScreen) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Pause when tab hidden or element scrolled offscreen (perf/battery).
    const onVisibility = () => {
      visible = !document.hidden
      visible ? start() : stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        onScreen ? start() : stop()
      },
      { threshold: 0 },
    )
    io.observe(host)

    // ── Cleanup: kill loop, listeners, and dispose all GPU resources ──────
    return () => {
      stop()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      io.disconnect()
      rtA.dispose()
      rtB.dispose()
      quad.dispose()
      updateMat.dispose()
      mainMat.dispose()
      mainMat.uniforms.uImage.value?.dispose()
      renderer.dispose()
    }
  }, [src, enableFlowmap])

  return (
    <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
      {/* Static fallback: shown under the canvas, and the only thing visible
          on reduced-motion / touch / WebGL failure. */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />
      {webglOk && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          aria-hidden
        />
      )}
    </div>
  )
}
