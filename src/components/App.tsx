import { useState, useEffect, useRef } from 'react'
import type { EntryView, MigDecisionKind, MigrationItem } from '../types/entry'
import { MIGRATION_QUEUE } from '../data/seed'
import { useEntries, unresolvedFromPreviousPeriod, startOfToday, startOfThisWeek, startOfThisMonth } from '../hooks/useEntries'
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

// ─── Ritual trigger rules ─────────────────────────────────────

const LAST_OPEN_KEY = 'bj-last-open'

/**
 * Returns true if the ritual for this view should be offered this session.
 * - Daily:   any day (boundary is "createdAt before today's midnight")
 * - Weekly:  today is Monday, OR this is the first app-open of the week
 *            (handles the gap case: last opened before this week started)
 * - Monthly: today is the 1st, OR this is the first app-open of the month
 */
function shouldFireRitualForView(view: EntryView, prevLastOpen: number): boolean {
  switch (view) {
    case 'daily': return true
    case 'weekly': {
      const isMonday = ((new Date().getDay() + 6) % 7) === 0
      return isMonday || prevLastOpen < startOfThisWeek()
    }
    case 'monthly': {
      return new Date().getDate() === 1 || prevLastOpen < startOfThisMonth()
    }
    default: return false
  }
}

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
  unmigrate: ReturnType<typeof useEntries>['unmigrate']
  add: ReturnType<typeof useEntries>['add']
  edit: ReturnType<typeof useEntries>['edit']
  remove: ReturnType<typeof useEntries>['remove']
  migrate: ReturnType<typeof useEntries>['migrate']
  undoMigration: ReturnType<typeof useEntries>['undoMigration']
  migratedDestIds: ReturnType<typeof useEntries>['migratedDestIds']
  resolveMigration: ReturnType<typeof useEntries>['resolveMigration']
}

function BuJoApp({ mobile, themeStyle, isDark, onToggleDark, entries, isLoading, hasError, retryLoad, simulateError, cycle, unmigrate, add, edit, remove, migrate, undoMigration, migratedDestIds, resolveMigration }: BuJoAppProps) {
  const [view, setView] = useState<EntryView>('daily')
  const [migrationOpen, setMigrationOpen] = useState<null | 'reminder' | 'ritual'>(null)
  const [legendOpen, setLegendOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  // Stable queue captured at the moment the ritual modal opens
  const [ritualQueue, setRitualQueue] = useState<MigrationItem[]>([])

  // Read previous last-open date on mount (before overwriting it)
  // so gap detection ("first open of week/month") works correctly
  const prevLastOpen = useRef(0)
  useEffect(() => {
    const raw = localStorage.getItem(LAST_OPEN_KEY)
    prevLastOpen.current = raw ? parseInt(raw, 10) : 0
    localStorage.setItem(LAST_OPEN_KEY, Date.now().toString())
  }, [])

  // Track which views have already shown their ritual this session
  const shownRitualViews = useRef<Set<EntryView>>(new Set())

  // Navigation-triggered ritual: fires on first entry to each view per session.
  // Gated to before 18:00 — after that, the evening banner (useTimeReminder) owns the window.
  useEffect(() => {
    if (isLoading || view === 'backlog') return
    if (new Date().getHours() >= 18) return
    if (shownRitualViews.current.has(view)) return
    if (!shouldFireRitualForView(view, prevLastOpen.current)) return

    const unresolved = unresolvedFromPreviousPeriod(entries, view)
    if (unresolved.length === 0) return

    shownRitualViews.current.add(view)
    setRitualQueue(unresolved)
    setMigrationOpen('ritual')
  }, [view, isLoading, entries])

  // Sort: oldest at top, newest at bottom (BuJo page fill direction)
  const visible = entries
    .filter((e) => e.view === view)
    .sort((a, b) => b.ago - a.ago)

  const pad = mobile ? '14px 16px' : '28px 52px'

  // Active tasks in the current period — drives 18:00 banner condition
  // Exclude entries created before this period's boundary so yesterday's tasks
  // don't trigger the banner before the migration ritual has been run.
  const activePeriodTasks = view !== 'backlog'
    ? entries.filter((e) => {
        if (e.view !== view || e.type !== 'task' || e.status !== 'active') return false
        const boundary =
          view === 'daily'   ? startOfToday() :
          view === 'weekly'  ? startOfThisWeek() :
          view === 'monthly' ? startOfThisMonth() : 0
        return (e.createdAt ?? 0) >= boundary
      })
    : []

  useTimeReminder(() => {
    if (activePeriodTasks.length > 0) {
      setShowBanner(true)
      return true
    }
    return false
  })

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
                  canUndo={migratedDestIds.has(e.id)}
                  onUndo={undoMigration}
                  onUnmigrate={unmigrate}
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
          view={migrationOpen === 'ritual' ? view : undefined}
          onClose={() => setMigrationOpen(null)}
          onResolve={(decisions: Record<string, MigDecisionKind>) => {
            resolveMigration(decisions, migrationOpen === 'ritual' ? ritualQueue : MIGRATION_QUEUE)
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
