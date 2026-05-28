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
    <div className="bj-empty" role="status" aria-live="polite">
      <span aria-hidden="true"><Notebook size={60} opacity={0.5} /></span>
      <div className="bj-empty-h bj-write">A blank page.</div>
      <p className="bj-empty-lead">Use the line below to write your first {THING_LABEL[view] ?? 'item'}.</p>
      <div className="bj-empty-arrow" aria-hidden="true">
        <DownArrow opacity={0.4} />
      </div>
    </div>
  )
}
