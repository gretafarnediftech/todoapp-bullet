export type EntryView = 'daily' | 'weekly' | 'monthly' | 'backlog'
export type EntryStatus = 'active' | 'done' | 'migrated' | 'scheduled'
export type EntryType = 'task' | 'event'
export type Palette = 'bw' | 'dark'
export type DemoState = 'normal' | 'empty' | 'loading' | 'error' | 'reminder' | 'migration'

export interface Entry {
  id: string
  view: EntryView
  type: EntryType
  text: string
  /** Minutes since creation — used for sort order only, never displayed */
  ago: number
  status: EntryStatus
  /** Unix ms timestamp of creation — used for period boundary checks */
  createdAt?: number
  /** HH:MM for daily, YYYY-MM-DD for others */
  when?: string
  /** Relative label shown after migrated text, e.g. 'tomorrow', 'this week' */
  migratedTo?: string
  /** Previous text before edit, shown struck-through above current text */
  originalText?: string
  completedAt?: number
}

export interface MigrationItem {
  id: string
  text: string
}

export type MigDecisionKind = 'done' | 'today' | 'weekly' | 'monthly' | 'backlog' | 'drop'
