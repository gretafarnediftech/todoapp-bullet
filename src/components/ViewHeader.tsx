import type { EntryView } from '../types/entry'
import { Squiggle } from './doodles/Doodle'

function viewTitle(v: EntryView): { sup: string; main: string } {
  const today = new Date()
  const fmt = (opts: Intl.DateTimeFormatOptions) => today.toLocaleDateString('en-GB', opts)
  switch (v) {
    case 'daily':
      return { sup: fmt({ weekday: 'long' }), main: fmt({ day: 'numeric', month: 'long' }) }
    case 'weekly': {
      const dow = (today.getDay() + 6) % 7
      const mon = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dow)
      const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6)
      const weekNum = Math.floor((mon.getDate() - 1) / 7) + 1
      const wd = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short' })
      const mo = (d: Date) => d.toLocaleDateString('en-GB', { month: 'short' })
      const crossesMonth = mon.getMonth() !== sun.getMonth()
      const crossesYear = mon.getFullYear() !== sun.getFullYear()
      let monLabel = `${wd(mon)} ${mon.getDate()}`
      const sunLabel = `${wd(sun)} ${sun.getDate()} ${mo(sun)}${crossesYear ? ` ${sun.getFullYear()}` : ''}`
      if (crossesYear) monLabel += ` ${mo(mon)} ${mon.getFullYear()}`
      else if (crossesMonth) monLabel += ` ${mo(mon)}`
      return { sup: `${monLabel} – ${sunLabel}`, main: `Week ${weekNum}` }
    }
    case 'monthly':
      return { sup: fmt({ year: 'numeric' }), main: fmt({ month: 'long' }) }
    case 'backlog':
      return { sup: 'Backlog', main: 'Future Log' }
    default: {
      const _: never = v
      return { sup: '', main: String(_) }
    }
  }
}

interface ViewHeaderProps {
  view: EntryView
  mobile?: boolean
  showDoodles?: boolean
}

export function ViewHeader({ view, mobile, showDoodles = true }: ViewHeaderProps) {
  const { sup, main } = viewTitle(view)
  return (
    <div
      className="bj-vh"
      style={{
        display: 'flex', alignItems: 'flex-end',
        gap: 16, padding: mobile ? '8px 0 14px' : '4px 0',
        borderBottom: 'none',
        marginBottom: mobile ? 12 : 18,
      }}
    >
      <div>
        <div style={{
          fontSize: mobile ? 10 : 11, opacity: 1, fontWeight: 600,
          letterSpacing: 1.2, textTransform: 'uppercase',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          {sup}
        </div>
        <div style={{
          fontSize: mobile ? 28 : 32, fontWeight: 700, lineHeight: 1.05,
          letterSpacing: -0.6, marginTop: 4,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          {main}
        </div>
        {showDoodles && (
          <div style={{ marginTop: 6, marginLeft: -2 }}>
            <Squiggle w={mobile ? 100 : 150} opacity={0.4} />
          </div>
        )}
      </div>
    </div>
  )
}
