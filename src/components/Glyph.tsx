import { useRef, useEffect } from 'react'
import type { Entry } from '../types/entry'

// ─── Event dot — filled when done, hollow when active ───
export function EventDot({ filled }: { filled?: boolean }) {
  return (
    <span
      className="bj-glyph"
      style={{ fontSize: '0.78em', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <span
        style={{
          width: '0.95em', height: '0.95em', borderRadius: '50%',
          border: '1.6px solid currentColor', boxSizing: 'border-box',
          background: filled ? 'currentColor' : 'transparent',
          display: 'inline-block',
          transition: 'background .15s ease',
        }}
      />
    </span>
  )
}

// ─── Animated SVG × for completed tasks ───
export function XGlyph({ animate, ink }: { animate?: boolean; ink?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!animate) return
    const paths = ref.current?.querySelectorAll('path')
    paths?.forEach((p, i) => {
      p.style.animation = 'none'
      p.getBoundingClientRect() // force reflow
      p.style.animation = `bj-stroke .18s ${i * 0.16}s cubic-bezier(.4,.7,.4,1) forwards`
    })
  }, [animate])

  const dashStyle = animate
    ? { strokeDasharray: 22, strokeDashoffset: 22 }
    : { strokeDasharray: 22, strokeDashoffset: 0 }

  return (
    <svg ref={ref} viewBox="0 0 16 16" width="0.9em" height="0.9em" style={{ overflow: 'visible', display: 'block' }}>
      <path d="M2.5 2.8 L13.5 13.2" stroke={ink ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" fill="none" style={dashStyle} />
      <path d="M13.4 2.8 L2.6 13.2"  stroke={ink ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" fill="none" style={dashStyle} />
    </svg>
  )
}

// ─── Composite glyph — picks the right symbol based on entry status+type ───
export function Glyph({ entry, animate }: { entry: Pick<Entry, 'type' | 'status'>; animate?: boolean }) {
  const { type, status } = entry

  if (status === 'done') {
    if (type === 'event') return <EventDot filled />
    return <XGlyph animate={animate} />
  }
  if (status === 'migrated') return <span className="bj-glyph">›</span>
  if (status === 'scheduled') return <span className="bj-glyph">‹</span>
  if (type === 'event') return <EventDot />
  return <span className="bj-glyph bj-bullet">·</span>
}
