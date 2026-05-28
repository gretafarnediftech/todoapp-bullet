import { useState, useEffect } from 'react'

const LOAD_FRAMES = [
  { ch: '.', size: 0.90, dy:  0.10 },
  { ch: '-', size: 0.80, dy: -0.08 },
  { ch: '>', size: 0.85, dy: -0.04 },
]

function LoadingBullets() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % LOAD_FRAMES.length), 380)
    return () => clearInterval(t)
  }, [])
  const f = LOAD_FRAMES[i]
  return (
    <div
      className="bj-write"
      aria-label="Loading"
      style={{ width: '1.2em', height: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 700, lineHeight: 1, color: 'var(--bj-ink)' }}
    >
      <span key={i} className="bj-load-frame" style={{ display: 'inline-block', fontSize: `${f.size}em`, marginTop: `${f.dy}em` }}>
        {f.ch}
      </span>
    </div>
  )
}

function LoadingPulse() {
  return (
    <div aria-label="Loading" style={{ width: 80, height: 80, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="bj-load-pulse-ring" />
      <span className="bj-load-pulse-ring" style={{ animationDelay: '.55s' }} />
      <span className="bj-write" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1, color: 'var(--bj-ink)', position: 'relative', transform: 'translateY(-8px)' }}>·</span>
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="bj-load-dots bj-write" aria-label="Loading">
      <span className="bj-load-dot" style={{ animationDelay: '0s'   }}>·</span>
      <span className="bj-load-dot" style={{ animationDelay: '.16s' }}>·</span>
      <span className="bj-load-dot" style={{ animationDelay: '.32s' }}>·</span>
    </div>
  )
}

function LoadingSkeleton() {
  const widths = ['88%', '72%', '94%', '60%']
  return (
    <div className="bj-load-skeleton" aria-label="Loading">
      {widths.map((width, i) => (
        <div key={i} className="bj-load-skeleton-row">
          <span className="bj-load-skeleton-glyph animate-pulse" />
          <span className="bj-load-skeleton-line animate-pulse" style={{ width }} />
        </div>
      ))}
    </div>
  )
}

export function LoadingState({ variant = 'bullets' }: { variant?: 'skeleton' | 'bullets' | 'pulse' | 'dots' }) {
  return (
    <div className="bj-state bj-state-loading">
      {variant === 'skeleton' ? <LoadingSkeleton /> : variant === 'pulse' ? <LoadingPulse /> : variant === 'dots' ? <LoadingDots /> : <LoadingBullets />}
      <div className="bj-state-p bj-write" style={{ fontSize: 18 }}>Fetching the page…</div>
    </div>
  )
}
