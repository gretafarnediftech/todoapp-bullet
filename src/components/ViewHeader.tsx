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
      const monStr = mon.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      const sunStr = sun.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      const weekNum = Math.ceil((today.getDate() + (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7) / 7)
      return { sup: `${monStr} – ${sunStr}`, main: `Week ${weekNum}` }
    }
    case 'monthly':
      return { sup: fmt({ year: 'numeric' }), main: fmt({ month: 'long' }) }
    case 'backlog':
      return { sup: 'Backlog', main: 'Future Log' }
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
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 16, padding: mobile ? '8px 0 14px' : '4px 0 20px',
        borderBottom: '1px solid var(--bj-rule)',
        marginBottom: mobile ? 12 : 18,
      }}
    >
      <div>
        <div style={{
          fontSize: mobile ? 10 : 11, opacity: 0.5, fontWeight: 500,
          letterSpacing: 1.2, textTransform: 'uppercase',
          fontFamily: 'var(--bj-ui-font)',
        }}>
          {sup}
        </div>
        <div style={{
          fontSize: mobile ? 28 : 36, fontWeight: 700, lineHeight: 1.05,
          letterSpacing: -0.6, marginTop: 4,
          fontFamily: 'var(--bj-font)',
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
