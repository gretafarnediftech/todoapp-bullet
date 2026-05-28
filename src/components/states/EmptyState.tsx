import type { EntryView } from '../../types/entry'
import { Notebook, DownArrow } from '../doodles/Doodle'

const THING_LABEL: Record<EntryView, string> = {
  daily:   'task',
  weekly:  'thing for this week',
  monthly: 'thing for this month',
  backlog: 'future-log entry',
}

export function EmptyState({ view }: { view: EntryView }) {
  return (
    <div className="bj-empty">
      <Notebook size={60} opacity={0.5} />
      <div className="bj-empty-h">A blank page.</div>
      <p className="bj-empty-lead">Use the line below to write your first {THING_LABEL[view]}.</p>
      <div className="bj-empty-arrow">
        <DownArrow opacity={0.4} />
      </div>
    </div>
  )
}
