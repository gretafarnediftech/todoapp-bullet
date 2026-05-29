import { useRef, useEffect } from 'react'
import type { Entry } from '../types/entry'

const EVENT_R = 5.5
const EVENT_CIRC = 2 * Math.PI * EVENT_R  // ≈ 34.6

// ─── Event dot — SVG circle, hollow when active, animated fill when done ───
export function EventDot({ filled, animate }: { filled?: boolean; animate?: boolean }) {
  const perimRef = useRef<SVGCircleElement>(null)
  const fillRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!animate) return
    const perim = perimRef.current
    if (perim) {
      perim.style.animation = 'none'
      perim.getBoundingClientRect()
      perim.style.animation = `bj-stroke .2s cubic-bezier(.4,.7,.4,1) forwards`
    }
    const fill = fillRef.current
    if (fill) {
      fill.style.animation = 'none'
      fill.getBoundingClientRect()
      fill.style.animation = `bj-circle-fill-diagonal .2s cubic-bezier(.2,.8,.2,1) forwards`
    }
  }, [animate])

  return (
    <svg
      viewBox="0 0 16 16"
      width="0.9em"
      height="0.9em"
      style={{ overflow: 'visible', display: 'block' }}
    >
      {/* Perimeter stroke — draws around the circle on completion */}
      <circle
        ref={perimRef}
        cx={8} cy={8} r={EVENT_R}
        stroke="currentColor" strokeWidth="1.6" fill="none"
        style={animate ? { strokeDasharray: EVENT_CIRC, strokeDashoffset: EVENT_CIRC } : undefined}
      />
      {/* Fill — visible when done; diagonal sweep on animate */}
      {(filled || animate) && (
        <circle
          ref={fillRef}
          cx={8} cy={8} r={EVENT_R - 1}
          fill="currentColor"
          style={animate ? { clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%)' } : undefined}
        />
      )}
    </svg>
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
    if (type === 'event') return <EventDot filled animate={animate} />
    return <XGlyph animate={animate} />
  }
  if (status === 'migrated') return <span className="bj-glyph">›</span>
  if (type === 'event') return <EventDot />
  return <span className="bj-glyph bj-bullet">·</span>
}
