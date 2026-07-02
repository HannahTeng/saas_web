# Hannah Teng — Portfolio (v2 · Dark / Techy)

Personal portfolio for **Zihan (Hannah) Teng** — Forward-Deployed Engineer & Health Data Scientist.
This version is a **dark "live data console"**: near-black (#050507) with a single electric-cyan
accent, Space Grotesk + JetBrains Mono, fine grid + scanline textures, terminal chrome
(timestamps, coordinates, `[status]` chips), and heavy scroll-driven storytelling.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Three.js** — hero particle-network "data cloud" (mouse + scroll reactive) and flowmap portrait distortion
- **GSAP ScrollTrigger** — pinned mission-log scrollytelling, horizontal project rail, scrubbed SVG chart, parallax
- **Lenis** — smooth scroll wired into GSAP's ticker

## Highlights

- Terminal-boot preloader and glitch-wipe route transitions to `/work/[slug]` case-file pages
- Decode/scramble headings, scanline image reveals, scroll-velocity kinetic marquee
- Custom crosshair cursor with target-lock morph + magnetic buttons
- Count-up metrics, nav scroll-progress bar, self-drawing telemetry polyline
- Fully readable with `prefers-reduced-motion`; effects degrade gracefully on mobile

## Run

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```
