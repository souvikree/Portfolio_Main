import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Souvik Ghosh — Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
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
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          display: 'flex',
        }} />

        {/* Cyan glow top-left */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Purple glow bottom-right */}
        <div style={{
          position: 'absolute', bottom: -100, right: 200,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, #00F5FF, #7B2FFF, #FF2D78)',
          display: 'flex',
        }} />

        {/* Main content */}
        <div style={{
          display: 'flex', flex: 1, alignItems: 'center',
          padding: '60px 80px', gap: 60, position: 'relative', zIndex: 10,
        }}>

          {/* LEFT: Text */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 20 }}>

            {/* Available badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999, width: 'fit-content',
              background: 'rgba(0,255,135,0.08)',
              border: '1px solid rgba(0,255,135,0.25)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#00FF87',
                boxShadow: '0 0 8px #00FF87',
              }} />
              <span style={{ color: '#00FF87', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em' }}>
                Available for Opportunities
              </span>
            </div>

            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <span style={{
                fontSize: 90, fontWeight: 900, lineHeight: 0.9,
                color: '#00F5FF', letterSpacing: '-0.02em',
              }}>
                SOUVIK
              </span>
              <span style={{
                fontSize: 90, fontWeight: 900, lineHeight: 0.9,
                color: 'transparent',
                letterSpacing: '-0.02em',
                marginLeft: 16,
                WebkitTextStroke: '2px rgba(255,255,255,0.5)',
              }}>
                GHOSH
              </span>
            </div>

            {/* Role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ color: '#00F5FF', fontSize: 20, fontWeight: 700 }}>~$</span>
              <span style={{ color: '#00F5FF', fontSize: 22, fontWeight: 600, fontFamily: 'monospace' }}>
                Software Engineer
              </span>
            </div>

            {/* Bio */}
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.5,
              maxWidth: 480, margin: 0,
            }}>
              Building production-grade systems that scale. Distributed systems, real-time communication &amp; clean architecture.
            </p>

            {/* Tech tags */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              {['Spring Boot', 'WebRTC', 'Next.js', 'Microservices', 'Java'].map((tag) => (
                <span key={tag} style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  background: 'rgba(0,245,255,0.08)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  color: '#00F5FF',
                  fontFamily: 'monospace',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Photo */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            position: 'relative', width: 300, height: 420,
            flexShrink: 0,
          }}>
            {/* Glow behind photo */}
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: 280, height: 280, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,245,255,0.25) 0%, rgba(123,47,255,0.15) 50%, transparent 70%)',
              filter: 'blur(30px)',
              display: 'flex',
            }} />

            {/* Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://souviksportfolio.vercel.app/images/souvik.png"
              alt="Souvik Ghosh"
              width={280}
              height={380}
              style={{
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: 20,
                border: '2px solid rgba(0,245,255,0.3)',
                boxShadow: '0 0 40px rgba(0,245,255,0.2)',
                position: 'relative',
                zIndex: 5,
              }}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 80px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          position: 'relative', zIndex: 10,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'monospace' }}>
            souviksportfolio.vercel.app
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['GitHub', 'LinkedIn', 'LeetCode'].map((s) => (
              <span key={s} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{s}</span>
            ))}
          </div>
          <span style={{ color: 'rgba(0,245,255,0.5)', fontSize: 13, fontFamily: 'monospace' }}>
            Kolkata, India
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}