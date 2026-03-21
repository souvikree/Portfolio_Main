import { ImageResponse } from 'next/og'

// ── Required Next.js exports for route-level OG image ─────────────────────────
export const runtime     = 'edge'
export const alt         = 'Souvik Ghosh — Software Engineer Portfolio'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

// IMPORTANT: must be absolute URL — relative paths don't work in ImageResponse
const BASE_URL = 'https://souviksportfolio.vercel.app'

export default async function OGImage() {
  // Fetch the photo as an ArrayBuffer so ImageResponse can embed it directly
  // This avoids the "unreachable URL" issue with external img src
  let photoSrc: string = `${BASE_URL}/images/souvik.png`
  try {
    const res  = await fetch(`${BASE_URL}/images/souvik.png`)
    const buf  = await res.arrayBuffer()
    const b64  = Buffer.from(buf).toString('base64')
    const mime = res.headers.get('content-type') ?? 'image/png'
    photoSrc   = `data:${mime};base64,${b64}`
  } catch {
    // fall back to absolute URL if fetch fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: '#050508',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* ── Grid pattern ── */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* ── Cyan glow top-left ── */}
        <div style={{
          position: 'absolute', top: -100, left: -100, display: 'flex',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.14) 0%, transparent 70%)',
        }} />

        {/* ── Purple glow bottom-right ── */}
        <div style={{
          position: 'absolute', bottom: -80, right: 160, display: 'flex',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.18) 0%, transparent 70%)',
        }} />

        {/* ── Pink glow top-right ── */}
        <div style={{
          position: 'absolute', top: -60, right: -60, display: 'flex',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,45,120,0.10) 0%, transparent 70%)',
        }} />

        {/* ── Top accent bar ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 5, display: 'flex',
          background: 'linear-gradient(90deg, #00F5FF 0%, #7B2FFF 50%, #FF2D78 100%)',
        }} />

        {/* ── Main content ── */}
        <div style={{
          display: 'flex', flex: 1, alignItems: 'center',
          padding: '60px 72px', gap: 56, position: 'relative', zIndex: 10,
        }}>

          {/* ── LEFT: Text ── */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18 }}>

            {/* Available badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 999, width: 'fit-content',
              background: 'rgba(0,255,135,0.08)',
              border: '1px solid rgba(0,255,135,0.3)',
            }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%',
                background: '#00FF87', boxShadow: '0 0 10px #00FF87',
              }} />
              <span style={{ color: '#00FF87', fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>
                AVAILABLE FOR OPPORTUNITIES
              </span>
            </div>

            {/* Name block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 0.88 }}>
              <span style={{
                fontSize: 96, fontWeight: 900,
                color: '#00F5FF', letterSpacing: '-0.03em',
              }}>
                SOUVIK
              </span>
              <span style={{
                fontSize: 96, fontWeight: 900,
                color: 'transparent',
                letterSpacing: '-0.03em',
                marginLeft: 12,
                WebkitTextStroke: '2.5px rgba(255,255,255,0.45)',
              }}>
                GHOSH
              </span>
            </div>

            {/* Role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
              <span style={{ color: '#00F5FF', fontSize: 22, fontWeight: 700 }}>~/</span>
              <span style={{
                color: 'rgba(255,255,255,0.85)', fontSize: 22, fontWeight: 600,
                fontFamily: 'monospace', letterSpacing: '0.02em',
              }}>
                Software Engineer
              </span>
              <span style={{ color: '#00F5FF', fontSize: 22, fontWeight: 700 }}>_</span>
            </div>

            {/* Bio */}
            <p style={{
              color: 'rgba(255,255,255,0.48)', fontSize: 17, lineHeight: 1.55,
              maxWidth: 500, margin: 0, marginTop: 2,
            }}>
              Building production-grade systems that scale. Distributed systems, real-time communication &amp; clean architecture.
            </p>

            {/* Tech tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {['Spring Boot', 'WebRTC', 'Next.js', 'Microservices', 'Java'].map((tag) => (
                <span key={tag} style={{
                  padding: '5px 14px', borderRadius: 7, fontSize: 13, fontWeight: 700,
                  background: 'rgba(0,245,255,0.07)',
                  border: '1px solid rgba(0,245,255,0.22)',
                  color: '#00F5FF',
                  fontFamily: 'monospace',
                  letterSpacing: '0.03em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Photo ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            position: 'relative', width: 290, height: 430, flexShrink: 0,
          }}>
            {/* Glow behind photo */}
            <div style={{
              position: 'absolute', bottom: -10, left: '50%',
              width: 260, height: 260, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,245,255,0.28) 0%, rgba(123,47,255,0.18) 50%, transparent 70%)',
              filter: 'blur(32px)', display: 'flex',
              transform: 'translateX(-50%)',
            }} />
            {/* Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc}
              alt="Souvik Ghosh"
              width={270}
              height={380}
              style={{
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: 22,
                border: '2px solid rgba(0,245,255,0.35)',
                boxShadow: '0 0 50px rgba(0,245,255,0.22), 0 0 100px rgba(123,47,255,0.15)',
                position: 'relative',
                zIndex: 5,
              }}
            />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 72px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.25)',
          position: 'relative', zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#00FF87', boxShadow: '0 0 6px #00FF87',
            }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: 'monospace' }}>
              souviksportfolio.vercel.app
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['GitHub', 'LinkedIn', 'LeetCode'].map((s) => (
              <span key={s} style={{
                color: 'rgba(255,255,255,0.3)', fontSize: 13,
                fontFamily: 'monospace', letterSpacing: '0.05em',
              }}>
                {s}
              </span>
            ))}
          </div>
          <span style={{ color: 'rgba(0,245,255,0.5)', fontSize: 13, fontFamily: 'monospace' }}>
            📍 Kolkata, India
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      // Explicitly set cache headers so crawlers can always fetch it
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  )
}