import type { EntryView } from '../types/entry'
import { LogoBook, Sun, Moon, Info } from './doodles/Doodle'
import { Tabs } from './Tabs'

interface HeaderBarProps {
  mobile?: boolean
  view: EntryView
  onChangeView: (v: EntryView) => void
  isDark: boolean
  onToggleDark: () => void
  onShowLegend: () => void
}

export function HeaderBar({ mobile, view, onChangeView, isDark, onToggleDark, onShowLegend }: HeaderBarProps) {
  const btnStyle: React.CSSProperties = {
    appearance: 'none', border: 0, background: 'transparent',
    color: 'inherit', cursor: 'pointer', padding: 8,
    borderRadius: 6, opacity: 0.55, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'opacity .15s, background .15s',
  }

  return (
    <header style={{
      display: 'flex', alignItems: 'center',
      padding: mobile ? '12px 16px 4px' : '18px 0 0',
      gap: 12,
      flexShrink: 0,
      borderBottom: mobile ? 'none' : '1px solid var(--bj-rule)',
      marginBottom: mobile ? 0 : 4,
    }}>
      {/* Logo */}
      <div className="bj-logo" style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        <LogoBook size={mobile ? 24 : 28} />
        <span style={{
          fontFamily: 'var(--bj-ui-font)',
          fontSize: mobile ? 15 : 16,
          fontWeight: 700,
          letterSpacing: -0.3,
          opacity: 0.85,
        }}>Journal</span>
      </div>

      {/* Desktop tabs inline with header — strip the bottom padding since we're inside the header */}
      {!mobile && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <Tabs view={view} onChange={onChangeView} mobile={false} />
          </div>
        </div>
      )}

      {mobile && <div style={{ flex: 1 }} />}

      {/* Icon buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: '0 0 auto' }}>
        <button
          style={btnStyle}
          className="bj-header-btn"
          onClick={onShowLegend}
          aria-label="Show bullet key"
          title="Bullet key"
        >
          <Info size={18} />
        </button>
        <button
          style={btnStyle}
          className="bj-header-btn"
          onClick={onToggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
