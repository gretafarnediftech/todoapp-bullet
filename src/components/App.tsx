import { useState, useEffect } from 'react'
import type { EntryView, MigDecisionKind } from '../types/entry'
import { MIGRATION_QUEUE } from '../data/seed'
import { useEntries } from '../hooks/useEntries'
import { useTheme } from '../hooks/useTheme'

import { HeaderBar } from './HeaderBar'
import { Tabs } from './Tabs'
import { ViewHeader } from './ViewHeader'
import { EntryRow } from './EntryRow'
import { Composer } from './Composer'
import { MigrationPrompt } from './MigrationPrompt'
import { LegendModal } from './LegendModal'
import { EmptyState } from './states/EmptyState'
// ─── BuJoApp ──────────────────────────────────────────────────
interface BuJoAppProps {
  mobile: boolean
  themeStyle: React.CSSProperties
  isDark: boolean
  onToggleDark: () => void
  entries: ReturnType<typeof useEntries>['entries']
  cycle: ReturnType<typeof useEntries>['cycle']
  add: ReturnType<typeof useEntries>['add']
  edit: ReturnType<typeof useEntries>['edit']
  remove: ReturnType<typeof useEntries>['remove']
  migrate: ReturnType<typeof useEntries>['migrate']
  resolveMigration: ReturnType<typeof useEntries>['resolveMigration']
}

function BuJoApp({ mobile, themeStyle, isDark, onToggleDark, entries, cycle, add, edit, remove, migrate, resolveMigration }: BuJoAppProps) {
  const [view, setView] = useState<EntryView>('daily')
  const [migrationOpen, setMigrationOpen] = useState<null | 'reminder' | 'ritual'>(null)
  const [legendOpen, setLegendOpen] = useState(false)

  // Sort: oldest at top, newest at bottom (BuJo page fill direction)
  const visible = entries
    .filter((e) => e.view === view)
    .sort((a, b) => b.ago - a.ago)

  const pad = mobile ? '14px 16px' : '28px 52px'

  return (
    <div
      className="bj-app"
      data-grid="dot"
      data-mobile={mobile ? '1' : undefined}
      style={{
        ...themeStyle,
        background: 'var(--bj-bg)',
        color: 'var(--bj-ink)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid paper */}
      <div className="bj-paper" aria-hidden />

      {/* Header */}
      <HeaderBar
        mobile={mobile}
        view={view}
        onChangeView={setView}
        isDark={isDark}
        onToggleDark={onToggleDark}
        onShowLegend={() => setLegendOpen(true)}
      />

      {/* Scrollable content */}
      <div
        className="bj-scroll"
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 1 }}
      >
        {/* Centred column — max-width on desktop, full-width on mobile */}
        <div style={{ maxWidth: 1048, margin: '0 auto', padding: pad, boxSizing: 'border-box', position: 'relative' }}>
          <ViewHeader view={view} mobile={mobile} showDoodles />

          {visible.length === 0 ? (
            <EmptyState view={view} />
          ) : (
            <div className="bj-list" style={{ padding: '0 10px' }}>
              {visible.map((e) => (
                <EntryRow
                  key={e.id}
                  entry={e}
                  view={view}
                  mobile={mobile}
                  density="cozy"
                  onCycle={cycle}
                  onMigrate={migrate}
                  onDelete={remove}
                  onEdit={edit}
                />
              ))}
            </div>
          )}

          <div style={{ padding: '0 10px' }}>
            <Composer
              view={view}
              onAdd={(type, text, when) => add(view, type, text, when)}
            />
          </div>
        </div>

      </div>

      {/* Mobile bottom tab bar */}
      {mobile && <Tabs view={view} onChange={setView} mobile />}

      {/* Modals */}
      {migrationOpen && (
        <MigrationPrompt
          canDefer={migrationOpen === 'reminder'}
          queue={MIGRATION_QUEUE}
          onClose={() => setMigrationOpen(null)}
          onResolve={(decisions: Record<string, MigDecisionKind>) => resolveMigration(decisions, MIGRATION_QUEUE)}
        />
      )}
      {legendOpen && <LegendModal onClose={() => setLegendOpen(false)} />}
    </div>
  )
}

// ─── Root — responsive + shared state ────────────────────────
export default function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const { themeStyle, isDark, toggleDark } = useTheme()
  const entriesCtx = useEntries()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ height: '100dvh' }}>
      <BuJoApp
        mobile={isMobile}
        themeStyle={themeStyle as React.CSSProperties}
        isDark={isDark}
        onToggleDark={toggleDark}
        {...entriesCtx}
      />
    </div>
  )
}
