import { useRef } from 'react'
import type { EntryView } from '../types/entry'
import { TabDaily, TabWeekly, TabMonthly, TabBacklog } from './doodles/Doodle'

const VIEWS: { id: EntryView; label: string; mobileLabel?: string; Icon: React.ComponentType<{ size?: number; opacity?: number }> }[] = [
  { id: 'daily',   label: 'Daily',      Icon: TabDaily },
  { id: 'weekly',  label: 'Weekly',     Icon: TabWeekly },
  { id: 'monthly', label: 'Monthly',    Icon: TabMonthly },
  { id: 'backlog', label: 'Future Log', mobileLabel: 'Future', Icon: TabBacklog },
]

interface TabsProps {
  view: EntryView
  onChange: (v: EntryView) => void
  mobile?: boolean
}

export function Tabs({ view, onChange, mobile }: TabsProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const wrapStyle: React.CSSProperties = mobile
    ? {
        display: 'flex', gap: 0, justifyContent: 'space-between',
        padding: '6px 16px',
        borderTop: '1px solid var(--bj-rule)',
        background: 'var(--bj-bg)',
      }
    : { display: 'flex', gap: 6, padding: '0 0 0', justifyContent: 'center', alignItems: 'center' }

  const handleKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
    const count = VIEWS.length
    let next = -1
    if (e.key === 'ArrowRight' || (mobile && e.key === 'ArrowDown')) next = (currentIdx + 1) % count
    if (e.key === 'ArrowLeft'  || (mobile && e.key === 'ArrowUp'))   next = (currentIdx - 1 + count) % count
    if (e.key === 'Home')       next = 0
    if (e.key === 'End')        next = count - 1
    if (next >= 0) {
      e.preventDefault()
      onChange(VIEWS[next].id)
      buttonRefs.current[next]?.focus()
    }
  }

  return (
    <nav className="bj-tabs" role="tablist" style={wrapStyle}>
      {VIEWS.map((v, idx) => {
        const active = v.id === view
        const displayLabel = mobile && v.mobileLabel ? v.mobileLabel : v.label
        return (
          <button
            key={v.id}
            id={`tab-${v.id}`}
            ref={(el) => { buttonRefs.current[idx] = el }}
            role="tab"
            aria-selected={active}
            aria-controls="tabpanel-main"
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(v.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`bj-tab${active ? ' on' : ''}`}
            style={{
              appearance: 'none', border: 0, background: 'transparent',
              font: 'inherit', cursor: 'pointer',
              padding: mobile ? '6px 4px' : '6px 14px',
              fontSize: mobile ? 11 : 13,
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
            <v.Icon size={mobile ? 22 : 15} opacity={active ? 0.9 : 0.6} />
            <span>{displayLabel}</span>
          </button>
        )
      })}
    </nav>
  )
}
