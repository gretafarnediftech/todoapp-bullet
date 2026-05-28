import { useState, useEffect } from 'react'
import type { EntryView, MigDecisionKind } from '../types/entry'
import { MIGRATION_QUEUE } from '../data/seed'
import { useEntries, unresolvedFromPreviousPeriod } from '../hooks/useEntries'
import { useTheme } from '../hooks/useTheme'
import { useTimeReminder } from '../hooks/useTimeReminder'

import { HeaderBar } from './HeaderBar'
import { Tabs } from './Tabs'
import { ViewHeader } from './ViewHeader'
import { EntryRow } from './EntryRow'
import { Composer } from './Composer'
import { EndOfPeriodBanner } from './EndOfPeriodBanner'
import { MigrationPrompt } from './MigrationPrompt'
import { LegendModal } from './LegendModal'
import { EmptyState } from './states/EmptyState'
import { LoadingState } from './states/LoadingState'
import { ErrorState } from './states/ErrorState'
// ─── BuJoApp ──────────────────────────────────────────────────
interface BuJoAppProps {
  mobile: boolean
  themeStyle: React.CSSProperties
  isDark: boolean
  onToggleDark: () => void
  entries: ReturnType<typeof useEntries>['entries']
  isLoading: ReturnType<typeof useEntries>['isLoading']
  hasError: ReturnType<typeof useEntries>['hasError']
  retryLoad: ReturnType<typeof useEntries>['retryLoad']
  simulateError: ReturnType<typeof useEntries>['simulateError']
  cycle: ReturnType<typeof useEntries>['cycle']
  add: ReturnType<typeof useEntries>['add']
  edit: ReturnType<typeof useEntries>['edit']
  remove: ReturnType<typeof useEntries>['remove']
  migrate: ReturnType<typeof useEntries>['migrate']
  resolveMigration: ReturnType<typeof useEntries>['resolveMigration']
}

function BuJoApp({ mobile, themeStyle, isDark, onToggleDark, entries, isLoading, hasError, retryLoad, simulateError, cycle, add, edit, remove, migrate, resolveMigration }: BuJoAppProps) {
  const [view, setView] = useState<EntryView>('daily')
  const [migrationOpen, setMigrationOpen] = useState<null | 'reminder' | 'ritual'>(null)
  const [legendOpen, setLegendOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  // Sort: oldest at top, newest at bottom (BuJo page fill direction)
  const visible = entries
    .filter((e) => e.view === view)
    .sort((a, b) => b.ago - a.ago)

  const pad = mobile ? '14px 16px' : '28px 52px'

  // Active tasks in the current period (not backlog) — drives 18:00 banner condition
  const activePeriodTasks = view !== 'backlog'
    ? entries.filter((e) => e.view === view && e.type === 'task' && e.status === 'active')
    : []

  // Unresolved tasks from the previous period — drives 00:01 ritual condition
  const unresolvedPrev = unresolvedFromPreviousPeriod(entries, view)
  // Use real previous-period tasks if available; fall back to MIGRATION_QUEUE for demo
  const ritualQueue = unresolvedPrev.length > 0 ? unresolvedPrev : MIGRATION_QUEUE

  useTimeReminder(
    () => { if (activePeriodTasks.length > 0) setShowBanner(true) },
    () => { if (unresolvedPrev.length > 0) setMigrationOpen('ritual') },
  )

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
        role="tabpanel"
        id="tabpanel-main"
        aria-labelledby={`tab-${view}`}
        className="bj-scroll"
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 1 }}
      >
        {/* Centred column — max-width on desktop, full-width on mobile */}
        <div style={{ maxWidth: 1048, margin: '0 auto', width: '100%', padding: pad, boxSizing: 'border-box', position: 'relative' }}>
          <ViewHeader view={view} mobile={mobile} showDoodles />

          {showBanner && activePeriodTasks.length > 0 && (
            <EndOfPeriodBanner view={view} onDismiss={() => setShowBanner(false)} />
          )}

          {isLoading ? (
            <LoadingState />
          ) : hasError ? (
            <ErrorState onRetry={retryLoad} />
          ) : visible.length === 0 ? (
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
              disabled={isLoading || hasError}
              onAdd={(type, text, when) => add(view, type, text, when)}
            />
          </div>

          {import.meta.env.DEV && (
            <div style={{ padding: '0 10px', marginTop: 8 }}>
              <button
                onClick={simulateError}
                style={{
                  fontSize: 11,
                  opacity: 0.4,
                  background: 'transparent',
                  border: '1px dashed currentColor',
                  borderRadius: 4,
                  padding: '2px 8px',
                  cursor: 'pointer',
                  color: 'inherit',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                [dev] simulate error
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile bottom tab bar */}
      {mobile && <Tabs view={view} onChange={setView} mobile />}

      {/* Modals */}
      {migrationOpen && (
        <MigrationPrompt
          canDefer={migrationOpen === 'reminder'}
          queue={migrationOpen === 'ritual' ? ritualQueue : MIGRATION_QUEUE}
          onClose={() => setMigrationOpen(null)}
          onResolve={(decisions: Record<string, MigDecisionKind>) => {
            const q = migrationOpen === 'ritual' ? ritualQueue : MIGRATION_QUEUE
            resolveMigration(decisions, q)
          }}
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
