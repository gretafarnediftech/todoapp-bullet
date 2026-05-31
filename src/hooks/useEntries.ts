import { useState, useCallback, useRef, useEffect } from 'react'
import type { Entry, EntryView, EntryType, EntryStatus, MigDecisionKind, MigrationItem } from '../types/entry'
import { supabase } from '../lib/supabase'

// ─── Supabase row type + mappers ──────────────────────────────

type EntryRow = {
  id: string
  user_id: string
  view: string
  type: string
  text: string
  ago: number
  status: string
  created_at: number | null
  when_date: string | null
  migrated_to: string | null
  migrated_from_id: string | null
  original_text: string | null
  completed_at: number | null
}

function toRow(entry: Entry, userId: string): EntryRow {
  return {
    id: entry.id,
    user_id: userId,
    view: entry.view,
    type: entry.type,
    text: entry.text,
    ago: entry.ago,
    status: entry.status,
    created_at: entry.createdAt ?? null,
    when_date: entry.when ?? null,
    migrated_to: entry.migratedTo ?? null,
    migrated_from_id: entry.migratedFromId ?? null,
    original_text: entry.originalText ?? null,
    completed_at: entry.completedAt ?? null,
  }
}

function fromRow(row: EntryRow): Entry {
  return {
    id: row.id,
    view: row.view as EntryView,
    type: row.type as EntryType,
    text: row.text,
    ago: row.ago,
    status: row.status as EntryStatus,
    createdAt: row.created_at ?? undefined,
    when: row.when_date ?? undefined,
    migratedTo: row.migrated_to ?? undefined,
    migratedFromId: row.migrated_from_id ?? undefined,
    originalText: row.original_text ?? undefined,
    completedAt: row.completed_at ?? undefined,
  }
}

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

function getTodayDateStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Remove `→ tomorrow` source entries whose scheduled date has arrived.
 * The daily copy (with `when = tomorrow's date`) stays; the dimmed source disappears.
 * Also cleans up orphaned tomorrow-migrated sources that have no copy.
 */
function cleanExpiredTomorrowMigrations(entries: Entry[]): Entry[] {
  const todayStr = getTodayDateStr()
  const expiredSourceIds = new Set<string>()
  for (const e of entries) {
    if (e.status !== 'migrated' || e.migratedTo !== 'tomorrow') continue
    const copy = entries.find((c) => c.migratedFromId === e.id)
    if (!copy || (copy.when && copy.when <= todayStr)) {
      expiredSourceIds.add(e.id)
    }
  }
  return expiredSourceIds.size === 0
    ? entries
    : entries.filter((e) => !expiredSourceIds.has(e.id))
}

import { SEED_ENTRIES } from '../data/seed'

function resolveCreatedAt(entry: Entry): number {
  if (entry.createdAt != null) return entry.createdAt
  return Date.now() - entry.ago * 60 * 1000
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
      (e.type === 'task' || e.type === 'event') &&
      e.status !== 'done' &&
      resolveCreatedAt(e) < beforeTs,
    )
    .map((e) => ({ id: e.id, text: e.text, type: e.type }))
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

export function useEntries(userId: string | null) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [migratedDestIds, setMigratedDestIds] = useState<Set<string>>(new Set())
  // Keep a ref so callbacks always read the latest value without re-creating
  const entriesRef = useRef(entries)
  entriesRef.current = entries
  // Session-only undo stack: destEntryId → undo record
  const undoStackRef = useRef<Map<string, UndoRecord>>(new Map())

  useEffect(() => {
    if (!userId) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') === '1') {
      setIsLoading(false)
      setHasError(true)
      return
    }

    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId)

      if (cancelled) return
      if (error) {
        setIsLoading(false)
        setHasError(true)
        return
      }

      let loaded: Entry[]
      if (data && data.length > 0) {
        loaded = (data as EntryRow[]).map(fromRow)
      } else {
        // First login: seed with default entries and persist them
        loaded = SEED_ENTRIES.map((e) => ({ ...e, createdAt: resolveCreatedAt(e) }))
        const rows = loaded.map((e) => toRow(e, userId))
        await supabase.from('entries').insert(rows)
      }

      const cleaned = cleanExpiredTomorrowMigrations(loaded)
      if (cleaned !== loaded) {
        const toDelete = loaded
          .filter((e) => !cleaned.some((c) => c.id === e.id))
          .map((e) => e.id)
        if (toDelete.length > 0) {
          await supabase.from('entries').delete().in('id', toDelete).eq('user_id', userId)
        }
      }
      setEntries(cleaned)
      setIsLoading(false)
    })()

    return () => { cancelled = true }
  }, [userId])

  const retryLoad = useCallback(() => {
    if (!userId) return
    setHasError(false)
    setIsLoading(true)
    setEntries([])
    ;(async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        setIsLoading(false)
        setHasError(true)
        return
      }

      const loaded = data && data.length > 0
        ? (data as EntryRow[]).map(fromRow)
        : SEED_ENTRIES.map((e) => ({ ...e, createdAt: resolveCreatedAt(e) }))

      const cleaned = cleanExpiredTomorrowMigrations(loaded)
      setEntries(cleaned)
      setIsLoading(false)
    })()
  }, [userId])

  const simulateError = useCallback(() => {
    setEntries([])
    setIsLoading(false)
    setHasError(true)
  }, [])

  const persist = useCallback((next: Entry[]) => {
    const prev = entriesRef.current
    setEntries(next)

    if (!userId) return

    // Diff to find deleted entries
    const nextIds = new Set(next.map((e) => e.id))
    const deletedIds = prev.filter((e) => !nextIds.has(e.id)).map((e) => e.id)

    void (async () => {
      if (deletedIds.length > 0) {
        await supabase.from('entries').delete().in('id', deletedIds).eq('user_id', userId)
      }
      if (next.length > 0) {
        await supabase.from('entries').upsert(next.map((e) => toRow(e, userId)))
      }
    })()
  }, [userId])

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
    queue: MigrationItem[],
  ) => {
    const newEntries: Entry[] = []
    const updates: Record<string, Partial<Entry>> = {}
    const droppedIds = new Set<string>()

    for (const item of queue) {
      const decision = decisions[item.id]
      if (!decision) continue
      switch (decision) {
        case 'done':
          updates[item.id] = { status: 'done', completedAt: Date.now() }
          break
        case 'today':
          updates[item.id] = { status: 'migrated', migratedTo: 'today' }
          newEntries.push({ id: newId(), view: 'daily',   type: item.type, text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'weekly':
          updates[item.id] = { status: 'migrated', migratedTo: 'this week' }
          newEntries.push({ id: newId(), view: 'weekly',  type: item.type, text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'monthly':
          updates[item.id] = { status: 'migrated', migratedTo: 'this month' }
          newEntries.push({ id: newId(), view: 'monthly', type: item.type, text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'backlog':
          updates[item.id] = { status: 'migrated', migratedTo: 'future log' }
          newEntries.push({ id: newId(), view: 'backlog', type: item.type, text: item.text, ago: 0, status: 'active', createdAt: Date.now() })
          break
        case 'drop':
          droppedIds.add(item.id)
          break
      }
    }

    const updated = entriesRef.current
      .filter((e) => !droppedIds.has(e.id))
      .map((e) => updates[e.id] ? { ...e, ...updates[e.id] } : e)
    persist([...updated, ...newEntries])
  }, [persist])

  return { entries, isLoading, hasError, retryLoad, simulateError, cycle, unmigrate, add, edit, remove, migrate, undoMigration, migratedDestIds, migrateForward, resolveMigration }
}
