import { useState, useRef, useEffect, useCallback } from 'react'
import type { Entry, EntryView } from '../types/entry'
import { Glyph } from './Glyph'
import { EditIcon, MigrateIcon, Trash, Undo } from './doodles/Doodle'
import { TabDaily, TabWeekly, TabMonthly, TabBacklog } from './doodles/Doodle'
import { WhenChip } from './pickers/DatePicker'

// ─── Helpers ────────────────────────────────────────────────

export function formatWhen(when: string, view: EntryView): string {
  if (!when) return ''
  if (/^\d{2}:\d{2}$/.test(when)) {
    const [h, m] = when.split(':').map(Number)
    const hr12 = h % 12 || 12
    const ampm = h < 12 ? 'am' : 'pm'
    return `${hr12}:${String(m).padStart(2, '0')}${ampm}`
  }
  const d = new Date(`${when}T00:00`)
  if (view === 'weekly') return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
  if (view === 'monthly') return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ─── Views list (used by MovePicker) ─────────────────────────

const VIEWS = [
  { id: 'daily',   label: 'Daily',      Icon: TabDaily },
  { id: 'weekly',  label: 'Weekly',     Icon: TabWeekly },
  { id: 'monthly', label: 'Monthly',    Icon: TabMonthly },
  { id: 'backlog', label: 'Future Log', Icon: TabBacklog },
]

const DEST_LABEL: Record<string, string> = {
  daily:    'today',
  tomorrow: 'tomorrow',
  weekly:   'this week',
  monthly:  'this month',
  backlog:  'future log',
}

// ─── MovePicker ──────────────────────────────────────────────

function MovePicker({
  fromView,
  onPick,
  onClose,
}: {
  fromView: EntryView
  onPick: (destView: string, label: string) => void
  onClose: () => void
}) {
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const destinations = [
    ...(fromView === 'daily' ? [{ id: 'tomorrow', label: 'Tomorrow', Icon: TabDaily }] : []),
    ...VIEWS.filter((v) => v.id !== fromView),
  ]

  return (
    <div ref={popRef} className="bj-when-pop bj-move-pop">
      <div className="bj-when-pop-head">Move to…</div>
      <div className="bj-move-pop-list">
        {destinations.map((d) => (
          <button
            key={d.id}
            type="button"
            className="bj-move-pop-opt"
            onClick={() => { onPick(d.id, DEST_LABEL[d.id] ?? d.label.toLowerCase()); onClose() }}
          >
            <d.Icon size={15} opacity={0.7} />
            <span>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── EntryRow ────────────────────────────────────────────────

interface EntryRowProps {
  entry: Entry
  view: EntryView
  mobile?: boolean
  density?: 'cozy' | 'compact'
  onCycle: (id: string, status: Entry['status']) => void
  onMigrate: (id: string, destView: string, label: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: { text: string; when?: string }) => void
  canUndo?: boolean
  onUndo?: (id: string) => void
  onUnmigrate?: (id: string) => void
}

export function EntryRow({ entry, view, mobile, density = 'cozy', onCycle, onMigrate, onDelete, onEdit, canUndo, onUndo, onUnmigrate }: EntryRowProps) {
  const [hover, setHover] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(entry.text)
  const [draftWhen, setDraftWhen] = useState(entry.when ?? '')
  const [justDone, setJustDone] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [selected, setSelected] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const commitRef = useRef<() => void>(() => {})

  // Close selected on outside click (mobile)
  useEffect(() => {
    if (!selected) return
    const onDoc = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        setSelected(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [selected])

  // Commit edit on outside click
  useEffect(() => {
    if (!editing) return
    const onDoc = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) commitRef.current()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [editing])

  // Sync draft with entry
  useEffect(() => { setDraft(entry.text) }, [entry.text])
  useEffect(() => { setDraftWhen(entry.when ?? '') }, [entry.when])

  // Focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() }
  }, [editing])

  const commitEdit = useCallback(() => {
    const t = draft.trim()
    if (!t) { setDraft(entry.text); setDraftWhen(entry.when ?? ''); setEditing(false); return }
    const changed = t !== entry.text || draftWhen !== (entry.when ?? '')
    if (changed) onEdit(entry.id, { text: t, when: draftWhen || undefined })
    setEditing(false)
  }, [draft, draftWhen, entry.text, entry.when, entry.id, onEdit])
  commitRef.current = commitEdit

  const cancelEdit = () => { setDraft(entry.text); setDraftWhen(entry.when ?? ''); setEditing(false) }

  const handleGlyphClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (entry.status === 'active') {
      setJustDone(true)
      onCycle(entry.id, 'done')
      setTimeout(() => setJustDone(false), 500)
    } else if (entry.status === 'done') {
      onCycle(entry.id, 'active')
    } else if (entry.status === 'migrated' && entry.migratedTo === 'tomorrow') {
      onUnmigrate?.(entry.id)
    }
  }

  const handleRowClick = (e: React.MouseEvent) => {
    if (!mobile || editing) return
    const t = e.target as Element
    if (t.closest('.bj-glyph-btn') || t.closest('.bj-actions') || t.closest('.bj-edit-input') || t.closest('.bj-when-pop')) return
    setSelected((s) => !s)
  }

  const dim = entry.status !== 'active'
  const lineH = density === 'compact' ? 28 : 36
  const showActions = mobile ? (selected || moveOpen) : (hover || moveOpen)
  const canMigrate = (entry.type === 'task' || entry.type === 'event') && entry.status === 'active'

  return (
    <div
      ref={rowRef}
      className="bj-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '22px 1fr auto',
        alignItems: 'center',
        columnGap: 10,
        minHeight: lineH,
        padding: density === 'compact' ? '2px 10px' : '4px 10px',
        margin: '0 -10px',
        borderRadius: 4,
        position: 'relative',
        transition: 'background .15s ease',
        background: (hover || editing || selected) ? 'var(--bj-soft)' : 'transparent',
        cursor: mobile && !editing ? 'pointer' : 'default',
      }}
      onMouseEnter={() => !mobile && setHover(true)}
      onMouseLeave={() => { if (!moveOpen) { setHover(false) } }}
      onClick={handleRowClick}
    >
      {/* Glyph button */}
      <button
        type="button"
        onClick={handleGlyphClick}
        className="bj-glyph-btn bj-write"
        style={{
          appearance: 'none', border: 0, background: 'transparent',
          padding: 0, cursor: (entry.status === 'active' || (entry.status === 'migrated' && entry.migratedTo === 'tomorrow')) ? 'pointer' : 'default',
          font: 'inherit',
          width: 22, height: lineH, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '1.15em',
          transition: 'transform .12s ease, opacity .3s ease',
          position: 'relative',
          opacity: dim ? 0.28 : 1,
        }}
      >
        <Glyph entry={entry} animate={justDone} />
      </button>

      {/* Text / edit input */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit() }}
          className="bj-write bj-edit-input"
          style={{
            appearance: 'none', border: 0, outline: 'none',
            background: 'transparent', color: 'inherit',
            fontFamily: 'var(--bj-font)', fontSize: '1.1em',
            fontWeight: 'inherit', padding: 0, width: '100%',
            lineHeight: 1.35,
            opacity: dim ? 0.28 : 1,
          }}
        />
      ) : (
        <span className="bj-write" style={{
          lineHeight: 1.35, wordBreak: 'break-word', fontSize: '1.1em',
          opacity: dim ? 0.28 : 1,
          transition: 'opacity .3s ease',
        }}>
          {entry.originalText && entry.originalText !== entry.text && (
            <span style={{
              textDecoration: 'line-through', textDecorationThickness: '1px',
              textDecorationColor: 'currentColor', opacity: 0.4, marginRight: 8,
            }}>{entry.originalText}</span>
          )}
          {entry.text}
          {entry.status === 'migrated' && entry.migratedTo && (
            <span className="bj-migrated-tag"> → {entry.migratedTo}</span>
          )}
        </span>
      )}

      {/* Right slot */}
      <div style={{ display: 'flex', alignItems: 'center', height: lineH, gap: 2, minWidth: 0 }}>
        {editing && (
          <WhenChip value={draftWhen} onChange={setDraftWhen} view={view} />
        )}
        {!editing && !showActions && entry.when && (
          <span className="bj-row-when bj-write">{formatWhen(entry.when, view)}</span>
        )}
        {showActions && !editing && (
          <div className="bj-actions" style={{ display: 'flex', gap: 2 }}>
            <button className="bj-act" onClick={() => { setEditing(true); setHover(false); setSelected(false) }} title="Edit">
              <EditIcon />
            </button>
            {canMigrate && (
              <span className="bj-act-wrap">
                <button className="bj-act" onClick={() => setMoveOpen((v) => !v)} title="Move to…">
                  <MigrateIcon />
                </button>
                {moveOpen && (
                  <MovePicker
                    fromView={view}
                    onPick={(dest, label) => onMigrate(entry.id, dest, label)}
                    onClose={() => setMoveOpen(false)}
                  />
                )}
              </span>
            )}            {canUndo && (
              <button className="bj-act" onClick={() => onUndo?.(entry.id)} title="Undo migration">
                <Undo size={15} />
              </button>
            )}            <button className="bj-act" onClick={() => onDelete(entry.id)} title="Delete">
              <Trash size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
