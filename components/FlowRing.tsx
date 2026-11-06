'use client'

import { useEffect, useRef } from 'react'

/**
 * The page's one sculpture: a fluted glass ring fixed behind the content. It hangs over the hero, drifts to the
 * right margin as the reader scrolls, and unrolls into the route line of the "how it works" section (#process-route)
 * before closing into a ring again. Its pose is a function of scroll position, read from the page's own anchors.
 *
 * three.js is loaded after first paint, so it never delays the page; without WebGL the CSS ring in the markup stays.
 * Respects prefers-reduced-motion and the footer's "Pause motion" switch (body[data-motion="paused"]).
 */

type Pose = { at: number; x: number; y: number; scale: number; rx: number; ry: number; rz: number; opacity: number; unfurl: number }
const CHANNELS = ['x', 'y', 'scale', 'rx', 'ry', 'rz', 'opacity', 'unfurl'] as const

const SEGMENTS = 1536 // around the ring
const SIDES = 32 // around the band's cross-section
const ROUTE_W = 1150, ROUTE_H = 155, ROUTE_UNIT = 143.75 // the route SVG's viewBox, and its px per scene unit
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))

export default function FlowRing() {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stage.current
    const canvas = el?.querySelector('canvas')
    const route = document.querySelector<SVGSVGElement>('#process-route svg')
    const track = route?.querySelector<SVGPathElement>('.route-track')
    if (!el || !canvas || !route || !track) return
    let dead = false
    let stop = () => {}

    ;(async () => {
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([import('three'), import('three/examples/jsm/environments/RoomEnvironment.js')])
        if (dead) return
        const still = window.matchMedia('(prefers-reduced-motion: reduce)')
        const moving = () => !still.matches && document.body.dataset.motion !== 'paused'
        const scrollMax = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.03
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xe8f0f1) // the page ground, so the canvas edge never shows
        const camera = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 50)
        camera.position.z = 12
        const room = new RoomEnvironment()
        const pmrem = new THREE.PMREMGenerator(renderer)
        scene.environment = pmrem.fromScene(room, 0.06).texture
        scene.environmentIntensity = 1.3
        room.dispose(); pmrem.dispose()

        // Two shapes over one index: the ring, and the same band laid along the route path (the morph target).
        const ring: number[] = [], flat: number[] = [], coord: number[] = [], index: number[] = []
        const length = track.getTotalLength()
        for (let i = 0; i <= SEGMENTS; i++) {
          const a = (i / SEGMENTS) * Math.PI * 2
          const radius = 2.64 + 0.05 * Math.sin(2 * a), twist = 0.3 * Math.sin(2 * a - 0.6)
          const at = (i / SEGMENTS) * length
          const p = track.getPointAtLength(at), ahead = track.getPointAtLength(Math.min(length, at + 0.1)), behind = track.getPointAtLength(Math.max(0, at - 0.1))
          const tangent = new THREE.Vector2(ahead.x - behind.x, behind.y - ahead.y).normalize()
          for (let j = 0; j <= SIDES; j++) {
            const b = (j / SIDES) * Math.PI * 2
            const groove = Math.pow(0.5 + 0.5 * Math.cos(a * 160 + 0.65 * Math.sin(b)), 4), face = Math.pow(Math.abs(Math.sin(b)), 3)
            const u = 0.105 * Math.cos(b), v = 0.048 * Math.sin(b) - 0.008 * groove * face * Math.sign(Math.sin(b))
            const across = u * Math.cos(twist) - v * Math.sin(twist), depth = u * Math.sin(twist) + v * Math.cos(twist)
            coord.push(a, b)
            ring.push((radius + across) * Math.cos(a) * 1.42, (radius + across) * Math.sin(a), depth + 0.1 * Math.sin(2 * a))
            const r = 0.012 * Math.cos(b)
            flat.push((p.x - ROUTE_W / 2) / ROUTE_UNIT - tangent.y * r, (ROUTE_H / 2 - p.y) / ROUTE_UNIT + tangent.x * r, 0.012 * Math.sin(b))
          }
        }
        for (let i = 0; i < SEGMENTS; i++) for (let j = 0; j < SIDES; j++) {
          const n = i * (SIDES + 1) + j, m = n + SIDES + 1
          index.push(n, m, n + 1, m, m + 1, n + 1)
        }
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(ring, 3))
        geometry.setAttribute('surfaceCoord', new THREE.Float32BufferAttribute(coord, 2))
        geometry.setIndex(index)
        geometry.computeVertexNormals()
        const line = new THREE.BufferGeometry()
        line.setAttribute('position', new THREE.Float32BufferAttribute(flat, 3))
        line.setIndex(index)
        line.computeVertexNormals()
        geometry.morphAttributes.position = [line.attributes.position]
        geometry.morphAttributes.normal = [line.attributes.normal]

        const flowTime = { value: 0 }, flowBend = { value: 0 }, surfaceDetail = { value: 1 }
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xbed9e1, metalness: 0.12, roughness: 0.23, clearcoat: 0.6, clearcoatRoughness: 0.17,
          transmission: 0.54, thickness: 0.28, ior: 1.42, attenuationColor: 0x7aa5ae, attenuationDistance: 3, side: THREE.DoubleSide,
        })
        // A slow travelling wave through the ring, and fine flutes in the glass that fade as it flattens into the line.
        material.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, { flowTime, flowBend, surfaceDetail })
          shader.vertexShader = `uniform float flowTime;\nuniform float flowBend;\nattribute vec2 surfaceCoord;\nvarying vec2 vSurfaceCoord;\n${shader.vertexShader}`.replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
   vSurfaceCoord=surfaceCoord;
   float a=atan(position.y,position.x/1.42);
   transformed.z+=(.075+.1*flowBend)*sin(a*2.-flowTime*.25);
   transformed.xy*=1.+.009*sin(a*3.-flowTime*.18);`,
          )
          shader.fragmentShader = `uniform float surfaceDetail;\nvarying vec2 vSurfaceCoord;\n${shader.fragmentShader}`
            .replace(
              '#include <color_fragment>',
              `#include <color_fragment>
   float microGroove=pow(.5+.5*cos(vSurfaceCoord.x*160.+.65*sin(vSurfaceCoord.y)),5.)*pow(abs(sin(vSurfaceCoord.y)),2.);
   diffuseColor.rgb*=1.-.24*microGroove*surfaceDetail;`,
            )
            .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n   roughnessFactor+=.055*microGroove*surfaceDetail;`)
        }
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        for (const [color, power, x, y, z] of [[0xffffff, 2.2, -4, 5, 7], [0xd5f2ff, 1.2, 4, -2, -3], [0xd2e9f3, 0.8, 3, 1, 5]]) {
          const light = new THREE.DirectionalLight(color, power)
          light.position.set(x, y, z)
          scene.add(light)
        }

        let poses: Pose[] = []
        let view = 16 // scene units across the viewport
        let time = 0, last = 0, painted = 0, eased = window.scrollY, frame = 0, settled = false

        // Where the ring is at each landmark of the page. x/y are viewport fractions; `unfurl` 1 is the flat route line.
        const plan = () => {
          const top = (q: string) => { const n = document.querySelector(q); return n ? n.getBoundingClientRect().top + window.scrollY : scrollMax() }
          const max = scrollMax(), narrow = window.innerWidth < 801, vh = window.innerHeight
          const onRoute = (Math.min(route.clientWidth / ROUTE_W, route.clientHeight / ROUTE_H) * view * ROUTE_UNIT) / window.innerWidth
          poses = [
            { at: 0, x: 0.5, y: narrow ? -0.015 : -0.055, scale: narrow ? 1.62 : 1.4, rx: 0.77, ry: 0.06, rz: -0.055, opacity: 0.94, unfurl: 0 },
            { at: Math.max(150, top('#products') - vh * 0.28), x: 1, y: 0.42, scale: 1.3, rx: 0.95, ry: 0.18, rz: -0.25, opacity: narrow ? 0.2 : 0.46, unfurl: 0 },
            { at: top('#control') - vh * 0.4, x: 1.03, y: 0.54, scale: 1.13, rx: 0.84, ry: 0.1, rz: -0.16, opacity: narrow ? 0.16 : 0.4, unfurl: 0 },
            { at: top('#process-route') - vh * 0.44, x: 0.5, y: 0.46, scale: onRoute, rx: 0, ry: 0, rz: 0, opacity: 0.85, unfurl: 1 },
            { at: top('#faq') - vh * 0.3, x: 1.06, y: 0.58, scale: 1.15, rx: 0.9, ry: -0.05, rz: -0.14, opacity: narrow ? 0.12 : 0.32, unfurl: 0 },
            { at: max, x: 0.94, y: 0.68, scale: 1.08, rx: 0.88, ry: -0.1, rz: -0.18, opacity: narrow ? 0.15 : 0.35, unfurl: 0 },
          ]
          for (let i = 1; i < poses.length; i++) poses[i].at = Math.max(poses[i - 1].at + 1, Math.min(max, poses[i].at))
        }

        // Catmull-Rom through the poses, so the ring never stops dead at a landmark.
        const poseAt = (y: number) => {
          let i = 0
          while (i < poses.length - 2 && y > poses[i + 1].at) i++
          const a = poses[i], b = poses[i + 1], before = poses[Math.max(0, i - 1)], after = poses[Math.min(poses.length - 1, i + 2)]
          const span = b.at - a.at, t = clamp((y - a.at) / span), t2 = t * t, t3 = t2 * t
          const out = { ...a }
          for (const k of CHANNELS) {
            const m0 = (b[k] - before[k]) / (b.at - before.at), m1 = (after[k] - a[k]) / (after.at - a.at)
            out[k] = (2 * t3 - 3 * t2 + 1) * a[k] + (t3 - 2 * t2 + t) * span * m0 + (-2 * t3 + 3 * t2) * b[k] + (t3 - t2) * span * m1
          }
          out.opacity = clamp(out.opacity)
          out.unfurl = THREE.MathUtils.smootherstep(clamp(out.unfurl), 0, 1)
          return out
        }

        const draw = () => {
          const p = poseAt(eased), sway = moving() ? Math.sin(time * 0.12) * (1 - p.unfurl) : 0
          flowTime.value = time
          flowBend.value = clamp(eased / scrollMax())
          mesh.rotation.set(p.rx + sway * 0.018, p.ry + sway * 0.015, p.rz + sway * 0.01)
          // Unrolled, the band sits exactly on the route SVG, wherever that is on screen.
          const box = route.getBoundingClientRect(), routeY = (box.top + window.scrollY - eased + box.height / 2) / window.innerHeight
          mesh.morphTargetInfluences![0] = p.unfurl
          surfaceDetail.value = 1 - p.unfurl
          mesh.scale.setScalar(p.scale)
          mesh.position.set((p.x - 0.5) * view, (0.5 - THREE.MathUtils.lerp(p.y, routeY, p.unfurl)) * (camera.top - camera.bottom), 0)
          route.style.opacity = still.matches ? '1' : String(1 - p.unfurl * 0.6)
          el.style.opacity = String(still.matches ? 0.15 : p.opacity)
          renderer.render(scene, camera)
        }

        const fit = () => {
          const w = window.innerWidth, h = window.innerHeight
          view = w < 801 ? 10.5 : 16
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 801 ? 1.5 : 2))
          renderer.setSize(w, h, false)
          const tall = (view * h) / w
          camera.left = -view / 2; camera.right = view / 2; camera.top = tall / 2; camera.bottom = -tall / 2
          camera.updateProjectionMatrix()
          plan()
          eased = window.scrollY
          draw()
        }

        const tick = (now: number) => {
          const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
          last = now
          if (!document.hidden) {
            const go = moving()
            if (go) { time += dt; eased += (window.scrollY - eased) * (1 - Math.exp(-dt * 7)) }
            // Paused or reduced motion: one still frame, then nothing until something changes.
            if (now - painted > 1000 / (window.innerWidth < 801 ? 24 : 35) && (go || !settled)) { draw(); settled = !go; painted = now }
          }
          frame = requestAnimationFrame(tick)
        }

        const ro = new ResizeObserver(fit) // the page growing (a question opened, the language switched) moves the landmarks too
        ro.observe(document.documentElement)
        const onMotion = () => { settled = false; eased = window.scrollY; draw() }
        still.addEventListener('change', onMotion)
        fit()
        el.dataset.renderState = 'ready'
        frame = requestAnimationFrame(tick)

        stop = () => {
          cancelAnimationFrame(frame)
          ro.disconnect()
          still.removeEventListener('change', onMotion)
          route.style.opacity = ''
          geometry.dispose(); line.dispose(); material.dispose(); scene.environment?.dispose(); renderer.dispose()
        }
        if (dead) stop()
      } catch (e) {
        el.dataset.renderState = 'fallback'
        console.warn('Flow sculpture unavailable:', (e as Error).message)
      }
    })()

    return () => { dead = true; stop() }
  }, [])

  return (
    <div ref={stage} className="flow-ring" aria-hidden>
      <canvas />
      <div className="flow-ring-fallback" />
    </div>
  )
}
