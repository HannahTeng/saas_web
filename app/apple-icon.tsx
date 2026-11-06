import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** The home-screen icon: the same loop-and-lift mark as app/icon.svg, drawn at 180px. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #4a96a4, #1d5a66)' }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <path d="M44.8 31.4 A15 15 0 1 1 30 19 C40 19 47 17 53 9" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  )
}
