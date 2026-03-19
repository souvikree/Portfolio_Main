'use client'

const ITEMS = [
  'JAVA', 'SPRING BOOT', 'REACT', 'NODE.JS', 'MICROSERVICES', 'MONGODB',
  'AWS', 'NEXT.JS', 'OPEN SOURCE', 'DISTRIBUTED SYSTEMS', 'WEBSOCKETS',
  'WEBRTC', 'SYSTEM DESIGN', 'TYPESCRIPT', 'MYSQL', 'DOCKER',
]

const DOT = (
  <span
    className="mx-3 inline-block w-1.5 h-1.5 rounded-full align-middle"
    style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--glow)' }}
  />
)

function MarqueeRow({ items, direction }: { items: string[]; direction: 'left' | 'right' }) {
  const cls = direction === 'left' ? 'marquee-left' : 'marquee-right'
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden py-3">
      <div className={`flex whitespace-nowrap ${cls}`} style={{ width: 'max-content' }}>
        {row.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}
            >
              {item}
            </span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  )
}

export function MarqueeTicker() {
  return (
    <section
      className="relative overflow-hidden py-2"
      style={{
        background: 'var(--ticker-bg)',
        borderTop: '1px solid var(--section-divider)',
        borderBottom: '1px solid var(--section-divider)',
      }}
      aria-hidden="true"
    >
      {/* Top gradient border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent-secondary), transparent)' }}
      />

      <MarqueeRow items={ITEMS} direction="left" />
      <MarqueeRow items={[...ITEMS].reverse()} direction="right" />
    </section>
  )
}
