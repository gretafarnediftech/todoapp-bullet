import { Glyph } from './Glyph'
import { Info } from './doodles/Doodle'
import type { Entry } from '../types/entry'

const KEY: { entry: Pick<Entry, 'type' | 'status'>; name: string; desc: string }[] = [
  { entry: { type: 'task',  status: 'active'   }, name: 'task',     desc: 'something to do' },
  { entry: { type: 'task',  status: 'done'     }, name: 'done',     desc: 'completed' },
  { entry: { type: 'task',  status: 'migrated' }, name: 'migrated', desc: 'moved to a later page' },
  { entry: { type: 'event', status: 'active'   }, name: 'event',    desc: 'meeting, deadline' },
]

export function LegendModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="bj-modal-back" onClick={onClose}>
      <div className="bj-modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="bj-modal-sup"
          style={{ textTransform: 'uppercase', letterSpacing: 1.4, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Info size={16} />
          <span>Quick recap</span>
        </div>

        <div style={{ height: 1, background: 'var(--bj-rule)', margin: '14px 0 18px' }} />

        <div className="bj-modal-h" style={{ fontSize: 18 }}>The bullet key</div>
        <ul className="bj-key" style={{ marginTop: 10 }}>
          {KEY.map((k) => (
            <li key={k.name}>
              <span className="bj-key-sym bj-write">
                <Glyph entry={k.entry} />
              </span>
              <span className="bj-key-name">{k.name}</span>
              <span className="bj-key-desc">{k.desc}</span>
            </li>
          ))}
        </ul>

        <div style={{ height: 1, background: 'var(--bj-rule)', margin: '22px 0' }} />

        <div className="bj-modal-h" style={{ fontSize: 18 }}>The ritual</div>
        <p className="bj-modal-p" style={{ marginTop: 8 }}>
          At the start of a new day, week, or month, you'll be asked to review anything unresolved —
          keep it, migrate it forward, push it to the future log, or let it go.
          Nothing carries forward unless you decide it should.
        </p>

        <div className="bj-modal-foot" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
          <button className="bj-btn-primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  )
}
