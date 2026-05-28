import { useState, useCallback, useRef } from 'react'
import type { Entry, EntryView, EntryType, MigDecisionKind } from '../types/entry'
import { SEED_ENTRIES } from '../data/seed'

const STORAGE_KEY = 'bj-entries'

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Entry[]
  } catch { /* ignore */ }
  return SEED_ENTRIES
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
  const [entries, setEntries] = useState<Entry[]>(loadEntries)
  // Keep a ref so callbacks always read the latest value without re-creating
  const entriesRef = useRef(entries)
  entriesRef.current = entries

  const persist = useCallback((next: Entry[]) => {
    setEntries(next)
    saveEntries(next)
  }, [])

  const cycle = useCallback((id: string, status: Entry['status']) => {
    const next = entriesRef.current.map((e) =>
      e.id === id ? { ...e, status, completedAt: status === 'done' ? 0 : e.completedAt } : e,
    )
    persist(next)
  }, [persist])

  const add = useCallback((view: EntryView, type: EntryType, text: string, when?: string) => {
    const entry: Entry = { id: newId(), view, type, text, ago: 0, status: 'active', when }
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
    const updated = cur.map((e) =>
      e.id === id ? { ...e, status: 'migrated' as const, migratedTo: destLabel } : e,
    )
    if (destView === 'tomorrow') { persist(updated); return }
    const src = cur.find((e) => e.id === id)
    if (!src) { persist(updated); return }
    const copy: Entry = {
      ...src, id: newId(),
      view: destView as EntryView,
      status: 'active',
      migratedTo: undefined,
      originalText: undefined,
      ago: 0,
    }
    persist([...updated, copy])
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
          updates[item.id] = { status: 'done', completedAt: 0 }
          break
        case 'today':
          updates[item.id] = { status: 'migrated', migratedTo: 'today' }
          newEntries.push({ id: newId(), view: 'daily',   type: 'task', text: item.text, ago: 0, status: 'active' })
          break
        case 'weekly':
          updates[item.id] = { status: 'migrated', migratedTo: 'this week' }
          newEntries.push({ id: newId(), view: 'weekly',  type: 'task', text: item.text, ago: 0, status: 'active' })
          break
        case 'monthly':
          updates[item.id] = { status: 'migrated', migratedTo: 'this month' }
          newEntries.push({ id: newId(), view: 'monthly', type: 'task', text: item.text, ago: 0, status: 'active' })
          break
        case 'backlog':
          updates[item.id] = { status: 'migrated', migratedTo: 'future log' }
          newEntries.push({ id: newId(), view: 'backlog', type: 'task', text: item.text, ago: 0, status: 'active' })
          break
        case 'drop':
          updates[item.id] = { status: 'done' }
          break
      }
    }

    const updated = entriesRef.current.map((e) => updates[e.id] ? { ...e, ...updates[e.id] } : e)
    persist([...updated, ...newEntries])
  }, [persist])

  return { entries, cycle, add, edit, remove, migrate, migrateForward, resolveMigration }
}
