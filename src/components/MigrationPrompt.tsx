import { useState, useRef, useEffect } from 'react'
import type { MigrationItem, MigDecisionKind } from '../types/entry'
import { MIGRATION_QUEUE } from '../data/seed'
import { Squiggle, TabDaily, TabWeekly, TabMonthly, TabBacklog, Trash, Undo, MigrateIcon } from './doodles/Doodle'

// ─── Per-item decision options ───────────────────────────────

const MIG_SUBDESTS = [
  { kind: 'weekly'  as MigDecisionKind, label: 'This week',  Icon: TabWeekly  },
  { kind: 'monthly' as MigDecisionKind, label: 'This month', Icon: TabMonthly },
  { kind: 'backlog' as MigDecisionKind, label: 'Future log', Icon: TabBacklog },
]

function decidedGlyph(kind: MigDecisionKind): React.ReactNode {
  if (kind === 'done')    return <span className="bj-write" style={{ fontSize: '0.85em' }}>×</span>
  if (kind === 'today')   return <TabDaily size={22} />
  if (kind === 'weekly')  return <TabWeekly size={22} />
  if (kind === 'monthly') return <TabMonthly size={22} />
  if (kind === 'backlog') return <TabBacklog size={22} />
  if (kind === 'drop')    return <Trash size={22} opacity={0.9} />
  return <span>·</span>
}

// ─── MigrationPrompt ─────────────────────────────────────────

interface MigrationPromptProps {
  canDefer?: boolean
  queue?: MigrationItem[]
  onClose: () => void
  onResolve: (decisions: Record<string, MigDecisionKind>) => void
}

export function MigrationPrompt({ canDefer = true, queue = MIGRATION_QUEUE, onClose, onResolve }: MigrationPromptProps) {
  const [decisions, setDecisions] = useState<Record<string, MigDecisionKind>>({})
  const [migSubOpen, setMigSubOpen] = useState<string | null>(null)
  const subRef = useRef<HTMLSpanElement>(null)

  // Close submenu on outside click
  useEffect(() => {
    if (!migSubOpen) return
    const onDoc = (e: MouseEvent) => {
      if (subRef.current && !subRef.current.contains(e.target as Node)) setMigSubOpen(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [migSubOpen])

  const decide = (id: string, kind: MigDecisionKind) => {
    setDecisions((d) => ({ ...d, [id]: kind }))
    setMigSubOpen(null)
  }
  const undo = (id: string) => setDecisions((d) => { const n = { ...d }; delete n[id]; return n })

  const allDone = queue.every((q) => decisions[q.id])

  const apply = () => {
    if (!allDone) return
    onResolve(decisions)
    onClose()
  }

  // All-clear: empty queue
  if (queue.length === 0) {
    return (
      <div className="bj-modal-back" onClick={onClose}>
        <div className="bj-mig-sheet bj-mig-clear" onClick={(e) => e.stopPropagation()}>
          <div className="bj-mig-clear-h bj-write">All clear.</div>
          <p className="bj-mig-clear-p">Nothing left from yesterday.</p>
          <button className="bj-btn-primary" onClick={onClose}>Great</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bj-modal-back" onClick={canDefer ? onClose : undefined}>
      <div className="bj-mig-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bj-mig-head">
          <div className="bj-mig-head-text">
            <div className="bj-mig-sup">The morning ritual</div>
            <h2 className="bj-write bj-mig-title">Yesterday's leftovers</h2>
            <div className="bj-mig-squig"><Squiggle w={170} opacity={0.45} /></div>
          </div>
          {canDefer && (
            <button className="bj-mig-close" onClick={onClose} aria-label="Close">×</button>
          )}
        </div>

        <p className="bj-mig-lead">
          Nothing carries forward unless you choose it. Mark each item before proceeding.
        </p>

        {/* Item list */}
        <ul className="bj-mig-list">
          {queue.map((q) => {
            const d = decisions[q.id]
            return (
              <li key={q.id} className={`bj-mig-item${d ? ` decided d-${d}` : ''}`}>
                <span className="bj-mig-glyph bj-write">
                  <span key={d ?? 'pending'} className="bj-mig-glyph-frame">
                    {d ? decidedGlyph(d) : '·'}
                  </span>
                </span>

                <span className="bj-mig-text bj-write">{q.text}</span>

                {d ? (
                  <div className="bj-mig-decided">
                    <button className="bj-mig-undo" onClick={() => undo(q.id)} aria-label="Undo">
                      <Undo size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="bj-mig-opts">
                    {/* done */}
                    <button className="bj-mig-opt" onClick={() => decide(q.id, 'done')} aria-label="Mark done" data-tip="Mark done">
                      <span className="bj-mig-opt-glyph bj-write">×</span>
                    </button>
                    {/* today */}
                    <button className="bj-mig-opt" onClick={() => decide(q.id, 'today')} aria-label="Move to today" data-tip="Move to today">
                      <span className="bj-mig-opt-icon"><TabDaily size={18} /></span>
                    </button>
                    {/* migrate → submenu */}
                    <span className="bj-mig-submenu-wrap" ref={migSubOpen === q.id ? subRef : null}>
                      <button
                        className={`bj-mig-opt${migSubOpen === q.id ? ' on' : ''}`}
                        onClick={() => setMigSubOpen(migSubOpen === q.id ? null : q.id)}
                        aria-label="Migrate to…"
                        aria-expanded={migSubOpen === q.id}
                        data-tip="Migrate to…"
                      >
                        <span className="bj-mig-opt-icon"><MigrateIcon /></span>
                      </button>
                      {migSubOpen === q.id && (
                        <div className="bj-mig-submenu">
                          {MIG_SUBDESTS.map((s) => (
                            <button key={s.kind} className="bj-mig-submenu-opt" onClick={() => decide(q.id, s.kind)}>
                              <s.Icon size={14} opacity={0.7} />
                              <span>{s.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </span>
                    {/* drop */}
                    <button className="bj-mig-opt" onClick={() => decide(q.id, 'drop')} aria-label="Drop" data-tip="Let it go">
                      <span className="bj-mig-opt-icon"><Trash size={18} /></span>
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {/* Footer */}
        <div className="bj-mig-foot">
          {canDefer ? (
            <button className="bj-btn-ghost" onClick={onClose}>Maybe later</button>
          ) : (
            <span />
          )}
          <button
            className="bj-btn-primary bj-mig-apply"
            onClick={apply}
            disabled={!allDone}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
