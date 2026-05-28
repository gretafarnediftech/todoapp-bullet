import type { EntryView } from '../types/entry'
import { TabDaily, TabWeekly, TabMonthly, TabBacklog } from './doodles/Doodle'

const VIEWS: { id: EntryView; label: string; Icon: React.ComponentType<{ size?: number; opacity?: number }> }[] = [
  { id: 'daily',   label: 'Daily',      Icon: TabDaily },
  { id: 'weekly',  label: 'Weekly',     Icon: TabWeekly },
  { id: 'monthly', label: 'Monthly',    Icon: TabMonthly },
  { id: 'backlog', label: 'Future Log', Icon: TabBacklog },
]

interface TabsProps {
  view: EntryView
  onChange: (v: EntryView) => void
  mobile?: boolean
}

export function Tabs({ view, onChange, mobile }: TabsProps) {
  const wrapStyle: React.CSSProperties = mobile
    ? {
        display: 'flex', gap: 0, justifyContent: 'space-between',
        padding: '6px 16px',
        borderTop: '1px solid var(--bj-rule)',
        background: 'var(--bj-bg)',
      }
    : { display: 'flex', gap: 6, padding: '0 0 18px' }

  return (
    <nav className="bj-tabs" style={wrapStyle}>
      {VIEWS.map((v) => {
        const active = v.id === view
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`bj-tab${active ? ' on' : ''}`}
            style={{
              appearance: 'none', border: 0, background: 'transparent',
              font: 'inherit', cursor: 'pointer',
              padding: mobile ? '6px 4px' : '6px 14px',
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              opacity: active ? 1 : 0.45,
              color: 'inherit', flex: mobile ? 1 : '0 0 auto',
              position: 'relative',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: mobile ? 5 : 8,
              flexDirection: mobile ? 'column' : 'row',
              fontFamily: 'var(--bj-ui-font)',
            }}
          >
            <v.Icon size={mobile ? 18 : 15} opacity={active ? 0.9 : 0.6} />
            <span>{v.label}</span>
            {active && (
              <span style={{
                position: 'absolute', left: '50%',
                bottom: mobile ? -2 : -4,
                transform: 'translateX(-50%)',
                width: mobile ? 22 : 18, height: 2,
                background: 'currentColor',
                borderRadius: 2,
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
