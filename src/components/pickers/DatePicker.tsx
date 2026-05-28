import { useState, useRef, useEffect } from 'react'
import type { EntryView } from '../../types/entry'
import { ClockIcon, CalendarPlusIcon } from '../doodles/Doodle'
import { formatWhen } from '../EntryRow'

// ─── TimePicker ──────────────────────────────────────────────

function TimePicker({ value, onChange, onClose }: { value: string; onChange: (v: string) => void; onClose: () => void }) {
  const popRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [onClose])

  const slots: { v: string; label: string }[] = []
  for (let h = 7; h <= 22; h++) {
    for (const m of [0, 30]) {
      const v = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const hr12 = h % 12 || 12
      const ampm = h < 12 ? 'am' : 'pm'
      slots.push({ v, label: `${hr12}:${String(m).padStart(2, '0')}${ampm}` })
    }
  }

  return (
    <div ref={popRef} className="bj-when-pop">
      <div className="bj-when-pop-head">Pick a time</div>
      <div className="bj-when-pop-grid">
        {slots.map((s) => (
          <button key={s.v} className={`bj-when-pop-chip${value === s.v ? ' on' : ''}`} onClick={() => { onChange(s.v); onClose() }}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── WeekPicker ──────────────────────────────────────────────

function WeekPicker({ value, onChange, onClose }: { value: string; onChange: (v: string) => void; onClose: () => void }) {
  const popRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [onClose])

  const today = new Date()
  const dow = (today.getDay() + 6) % 7 // 0 = Mon
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dow)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    days.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i))
  }
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  return (
    <div ref={popRef} className="bj-when-pop bj-when-pop-week">
      <div className="bj-when-pop-head">This week</div>
      <div className="bj-when-pop-week-list">
        {days.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString()
          const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const isSelected = value === iso(d)
          return (
            <button
              key={i}
              type="button"
              className={`bj-when-pop-week-chip${isToday ? ' today' : ''}${isSelected ? ' on' : ''}${isPast ? ' past' : ''}`}
              onClick={() => { onChange(iso(d)); onClose() }}
            >
              <span className="bj-when-pop-week-dow">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
              <span className="bj-when-pop-week-num">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── MonthDatePicker ─────────────────────────────────────────

function MonthDatePicker({ value, onChange, onClose, lockToCurrentMonth }: {
  value: string; onChange: (v: string) => void; onClose: () => void; lockToCurrentMonth?: boolean
}) {
  const popRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [onClose])

  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())

  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startOffset = (first.getDay() + 6) % 7
  const days: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= last.getDate(); d++) days.push(d)

  const monthLabel = first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isSelected = (d: number) => {
    if (!value) return false
    const sel = new Date(`${value}T00:00`)
    return d === sel.getDate() && month === sel.getMonth() && year === sel.getFullYear()
  }
  const pick = (d: number) => {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    onChange(iso); onClose()
  }
  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1) } else setMonth((m) => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1) } else setMonth((m) => m + 1) }

  return (
    <div ref={popRef} className="bj-when-pop bj-when-pop-cal">
      <div className="bj-when-pop-cal-head">
        {lockToCurrentMonth ? <span /> : <button type="button" onClick={prev} aria-label="Previous month">‹</button>}
        <span className="bj-when-pop-cal-title">{monthLabel}</span>
        {lockToCurrentMonth ? <span /> : <button type="button" onClick={next} aria-label="Next month">›</button>}
      </div>
      <div className="bj-when-pop-cal-grid">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={`dow-${i}`} className="bj-when-pop-cal-dow">{d}</span>
        ))}
        {days.map((d, i) =>
          d === null
            ? <span key={`blank-${i}`} />
            : (
              <button
                key={`day-${i}`}
                type="button"
                className={`bj-when-pop-cal-day${isToday(d) ? ' today' : ''}${isSelected(d) ? ' on' : ''}${isPast(d) ? ' past' : ''}`}
                onClick={() => pick(d)}
              >{d}</button>
            )
        )}
      </div>
    </div>
  )
}

// ─── DatePicker dispatcher ───────────────────────────────────

export function DatePicker({ value, onChange, onClose, view }: {
  value: string; onChange: (v: string) => void; onClose: () => void; view: EntryView
}) {
  if (view === 'weekly') return <WeekPicker value={value} onChange={onChange} onClose={onClose} />
  if (view === 'monthly') return <MonthDatePicker value={value} onChange={onChange} onClose={onClose} lockToCurrentMonth />
  return <MonthDatePicker value={value} onChange={onChange} onClose={onClose} />
}

// ─── WhenChip (shared by Composer + EntryRow edit) ────────────

export function WhenChip({ value, onChange, view }: { value: string; onChange: (v: string) => void; view: EntryView }) {
  const [open, setOpen] = useState(false)
  const mode = view === 'daily' ? 'time' : 'date'

  return (
    <span className="bj-composer-when-wrap">
      {value ? (
        <button type="button" className="bj-composer-when bj-write" onClick={() => setOpen((v) => !v)}>
          {formatWhen(value, view)}
        </button>
      ) : (
        <button
          type="button"
          className="bj-composer-when-add"
          onClick={() => setOpen((v) => !v)}
          title={mode === 'time' ? 'Add a time' : 'Add a date'}
          aria-label={mode === 'time' ? 'Add a time' : 'Add a date'}
        >
          {mode === 'time' ? <ClockIcon /> : <CalendarPlusIcon />}
        </button>
      )}
      {value && (
        <button type="button" aria-label="Clear" className="bj-composer-when-x" onClick={(e) => { e.stopPropagation(); onChange(''); setOpen(false) }}>×</button>
      )}
      {open && (
        mode === 'time'
          ? <TimePicker value={value} onChange={onChange} onClose={() => setOpen(false)} />
          : <DatePicker value={value} onChange={onChange} onClose={() => setOpen(false)} view={view} />
      )}
    </span>
  )
}
