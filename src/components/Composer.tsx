import { useState, useEffect } from 'react'
import type { EntryView, EntryType } from '../types/entry'
import { WhenChip } from './pickers/DatePicker'

interface ComposerProps {
  view: EntryView
  density?: 'cozy' | 'compact'
  onAdd: (type: EntryType, text: string, when?: string) => void
}

export function Composer({ view, density = 'cozy', onAdd }: ComposerProps) {
  const [type, setType] = useState<EntryType>('task')
  const [text, setText] = useState('')
  const [when, setWhen] = useState('')

  // Reset when crossing views
  useEffect(() => { setWhen(''); }, [view])

  const submit = () => {
    if (!text.trim()) return
    onAdd(type, text.trim(), when || undefined)
    setText('')
    setWhen('')
    setType('task')
  }

  const glyph = type === 'event' ? '○' : '·'
  const placeholder = type === 'task' ? 'Write a task…' : 'Write an event…'

  return (
    <div
      className="bj-composer"
      style={{
        display: 'grid',
        gridTemplateColumns: '22px 1fr auto',
        alignItems: 'baseline',
        columnGap: 10,
        padding: density === 'compact' ? '6px 0 0' : '10px 0 0',
        minHeight: 32,
      }}
    >
      {/* Type toggle glyph */}
      <button
        type="button"
        className="bj-glyph-btn bj-composer-glyph bj-write"
        onClick={() => setType(type === 'task' ? 'event' : 'task')}
        title="Click to change type (↑/↓ arrows also work)"
        style={{
          appearance: 'none', border: 0, background: 'transparent', padding: 0,
          cursor: 'pointer', fontWeight: 700, opacity: text ? 0.85 : 0.35,
          width: 22, textAlign: 'center', fontSize: '1.15em',
          color: 'inherit',
        }}
      >
        {glyph}
      </button>

      {/* Text input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { submit(); return }
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            setType(type === 'task' ? 'event' : 'task')
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="bj-composer-input bj-write"
        style={{
          appearance: 'none', border: 0, outline: 'none',
          background: 'transparent', color: 'inherit',
          padding: 0, width: '100%',
          fontFamily: 'var(--bj-font)',
          fontSize: '1.1em',
          fontWeight: 'inherit',
        }}
      />

      {/* When + submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <WhenChip value={when} onChange={setWhen} view={view} />
        {text && (
          <button onClick={submit} className="bj-submit">return ↵</button>
        )}
      </div>
    </div>
  )
}
