import { useState, useCallback, useRef, useEffect } from 'react'
import type { Entry, EntryView, EntryType, MigDecisionKind, MigrationItem } from '../types/entry'

// ─── Migration undo record (session-only) ────────────────────

type UndoRecord = {
  sourceEntry: Entry
  destEntryId: string
}

function getTomorrowDateStr(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

import { SEED_ENTRIES } from '../data/seed'

const STORAGE_KEY = 'bj-entries'

function resolveCreatedAt(entry: Entry): number {
  if (entry.createdAt != null) return entry.createdAt
  return Date.now() - entry.ago * 60 * 1000
}

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Entry[]
      // Backfill createdAt for entries that predate this field
      return parsed.map((e) =>
        e.createdAt != null ? e : { ...e, createdAt: resolveCreatedAt(e) },
      )
    }
  } catch { /* ignore */ }
  return SEED_ENTRIES.map((e) => ({ ...e, createdAt: resolveCreatedAt(e) }))
}

// ─── Period boundary helpers ──────────────────────────────────

export function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function startOfThisWeek(): number {
  const d = new Date()
  const dayOfWeek = (d.getDay() + 6) % 7  // Monday = 0
  d.setDate(d.getDate() - dayOfWeek)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function startOfThisMonth(): number {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Returns active tasks from the previous calendar period for the given view. */
export function unresolvedFromPreviousPeriod(entries: Entry[], view: EntryView): MigrationItem[] {
  let beforeTs: number
  if (view === 'daily') beforeTs = startOfToday()
  else if (view === 'weekly') beforeTs = startOfThisWeek()
  else if (view === 'monthly') beforeTs = startOfThisMonth()
  else return []

  return entries
    .filter((e) =>
      e.view === view &&
      e.type === 'task' &&
      e.status === 'active' &&
      resolveCreatedAt(e) < beforeTs,
    )
    .map((e) => ({ id: e.id, text: e.text }))
}

function saveEntries(entries: Entry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch { /* ignore */ }
}

let _nextId = Date.now()
function newId() { return `e${_nextId++}` }

const DEST_LABEL: Record<string, string> = {
  daily:    'today',
  tomorrow: 'tomorrow',
  weekly:   'this week',
  monthly:  'this month',
  backlog:  'future log',
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [migratedDestIds, setMigratedDestIds] = useState<Set<string>>(new Set())
  // Keep a ref so callbacks always read the latest value without re-creating
  const entriesRef = useRef(entries)
  entriesRef.current = entries
  // Session-only undo stack: destEntryId → undo record
  const undoStackRef = useRef<Map<string, UndoRecord>>(new Map())
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearLoadTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current)
      loadTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') === '1') {
      setIsLoading(false)
      setHasError(true)
      return
    }
    loadTimerRef.current = setTimeout(() => {
      setEntries(loadEntries())
      setIsLoading(false)
      loadTimerRef.current = null
    }, 1000)
    return clearLoadTimer
  }, [clearLoadTimer])

  const retryLoad = useCallback(() => {
    clearLoadTimer()
    setHasError(false)
    setIsLoading(true)
    setEntries([])
    loadTimerRef.current = setTimeout(() => {
      setEntries(loadEntries())
      setIsLoading(false)
      loadTimerRef.current = null
    }, 1000)
  }, [clearLoadTimer])

  const simulateError = useCallback(() => {
    clearLoadTimer()
    setEntries([])
    setIsLoading(false)
    setHasError(true)
  }, [clearLoadTimer])

  const persist = useCallback((next: Entry[]) => {
    setEntries(next)
    saveEntries(next)
  }, [])

  const cycle = useCallback((id: string, status: Entry['status']) => {
    const next = entriesRef.current.map((e) =>
      e.id === id
        ? { ...e, status, completedAt: status === 'done' ? Date.now() : undefined }
        : e,
    )
    // If this entry was a migration-undo candidate, actioning it invalidates the undo
    if (undoStackRef.current.has(id)) {
      undoStackRef.current.delete(id)
      setMigratedDestIds((prev) => { const s = new Set(prev); s.delete(id); return s })
    }
    persist(next)
  }, [persist])

  const unmigrate = useCallback((id: string) => {
    const next = entriesRef.current
      .filter((e) => e.migratedFromId !== id)
      .map((e) =>
        e.id === id && e.status === 'migrated' && e.migratedTo === 'tomorrow'
          ? { ...e, status: 'active' as const, migratedTo: undefined }
          : e,
      )
    persist(next)
  }, [persist])

  const add = useCallback((view: EntryView, type: EntryType, text: string, when?: string) => {
    const entry: Entry = { id: newId(), view, type, text, ago: 0, status: 'active', when, createdAt: Date.now() }
    persist([...entriesRef.current, entry])
  }, [persist])

  const edit = useCallback((id: string, patch: { text: string; when?: string }) => {
    const next = entriesRef.current.map((e) =>
      e.id === id
        ? {
            ...e,
            text: patch.text,
            when: patch.when,
            originalText: patch.text !== e.text ? e.text : e.originalText,
          }
        : e,
    )
    persist(next)
  }, [persist])

  const remove = useCallback((id: string) => {
    persist(entriesRef.current.filter((e) => e.id !== id))
  }, [persist])

  const migrate = useCallback((id: string, destView: string, label?: string) => {
    const destLabel = label ?? DEST_LABEL[destView] ?? destView
    const cur = entriesRef.current
    const src = cur.find((e) => e.id === id)
    if (!src) return

    if (destView === 'tomorrow') {
      // Fix 8 — Tomorrow: source stays as migrated (›); copy created in daily with when = tomorrow
      const copyId = newId()
      const copy: Entry = {
        ...src,
        id: copyId,
        view: 'daily',
        status: 'active',
        migratedTo: undefined,
        migratedFromId: id,
        originalText: undefined,
        ago: 0,
        createdAt: Date.now(),
        when: getTomorrowDateStr(),
      }
      const updated = cur.map((e) =>
        e.id === id ? { ...e, status: 'migrated' as const, migratedTo: destLabel } : e,
      )
      persist([...updated, copy])
    } else {
      // Fix 8 — Other destinations: source removed; entry moved to destination as active
      const copyId = newId()
      const copy: Entry = {
        ...src,
        id: copyId,
        view: destView as EntryView,
        status: 'active',
        migratedTo: undefined,
        originalText: undefined,
        ago: 0,
        createdAt: Date.now(),
      }
      const filtered = cur.filter((e) => e.id !== id)
      undoStackRef.current.set(copyId, { sourceEntry: src, destEntryId: copyId })
      setMigratedDestIds((prev) => new Set([...prev, copyId]))
      persist([...filtered, copy])
    }
  }, [persist])

  const undoMigration = useCallback((destEntryId: string) => {
    const record = undoStackRef.current.get(destEntryId)
    if (!record) return
    undoStackRef.current.delete(destEntryId)
    setMigratedDestIds((prev) => {
      const next = new Set(prev)
      next.delete(destEntryId)
      return next
    })
    // Remove the destination copy, restore the original source entry
    const filtered = entriesRef.current.filter((e) => e.id !== destEntryId)
    persist([...filtered, record.sourceEntry])
  }, [persist])

  const migrateForward = useCallback((id: string, fromView: EntryView) => {
    const RULE: Record<EntryView, string> = { daily: 'tomorrow', weekly: 'weekly', monthly: 'monthly', backlog: 'backlog' }
    const LABEL: Record<EntryView, string> = { daily: 'tomorrow', weekly: 'next week', monthly: 'next month', backlog: 'future log' }
    migrate(id, RULE[fromView], LABEL[fromView])
  }, [migrate])

  const resolveMigration = useCallback((
    decisions: Record<string, MigDecisionKind>,
    queue: { id: string; text: string }[],
  ) => {
    const newEntries: Entry[] = []
    const updates: Record<string, Partial<Entry>> = {}

    for (const item of queue) {
      const decision = decisions[item.id]
      if (!decision) continue
      switch (decision) {
        case 'done':
          updates[item.id] = { status: 'done', completedAt: Date.now() }
          break
        case 'today':
          updates[item.id] = { status: 'migrated', migratedTo: 'today' }
          newEntries.push({ id: newId(), view: 'daily',   type: 'task', text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'weekly':
          updates[item.id] = { status: 'migrated', migratedTo: 'this week' }
          newEntries.push({ id: newId(), view: 'weekly',  type: 'task', text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'monthly':
          updates[item.id] = { status: 'migrated', migratedTo: 'this month' }
          newEntries.push({ id: newId(), view: 'monthly', type: 'task', text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'backlog':
          updates[item.id] = { status: 'migrated', migratedTo: 'future log' }
          newEntries.push({ id: newId(), view: 'backlog', type: 'task', text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'drop':
          updates[item.id] = { status: 'done' }
          break
      }
    }

    const updated = entriesRef.current.map((e) => updates[e.id] ? { ...e, ...updates[e.id] } : e)
    persist([...updated, ...newEntries])
  }, [persist])

  return { entries, isLoading, hasError, retryLoad, simulateError, cycle, unmigrate, add, edit, remove, migrate, undoMigration, migratedDestIds, migrateForward, resolveMigration }
}
