import type { EntryView } from '../types/entry'

interface BannerMessage {
  sup: string
  h: string
  p: string
}

const MESSAGES: Partial<Record<EntryView, BannerMessage>> = {
  daily:   { sup: 'End of day',   h: 'A new day starts tomorrow.',       p: 'Decide what to do with anything still on the page.' },
  weekly:  { sup: 'End of week',  h: 'Tomorrow the week resets.',        p: 'Migrate what still matters; let the rest go.' },
  monthly: { sup: 'End of month', h: 'A new month begins on Monday.',    p: 'Decide what carries forward — and what doesn\'t.' },
}

interface EndOfPeriodBannerProps {
  view: EntryView
  onDismiss: () => void
}

export function EndOfPeriodBanner({ view, onDismiss }: EndOfPeriodBannerProps) {
  const m = MESSAGES[view]
  if (!m) return null

  return (
    <div className="bj-banner" role="region" aria-label="End of period reminder">
      <div className="bj-banner-mark" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8.5" />
          <path d="M11 6 V 11 L 14.5 13" />
        </svg>
      </div>
      <div className="bj-banner-body">
        <div className="bj-banner-sup">{m.sup}</div>
        <div className="bj-banner-h">{m.h}</div>
        <div className="bj-banner-p">{m.p}</div>
      </div>
      <div className="bj-banner-actions">
        <button className="bj-banner-x" onClick={onDismiss} aria-label="Dismiss reminder">×</button>
      </div>
    </div>
  )
}
