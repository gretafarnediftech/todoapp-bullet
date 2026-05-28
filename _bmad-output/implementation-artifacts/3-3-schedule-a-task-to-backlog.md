# Story 3.3: Schedule a Task to Backlog

Status: ready-for-dev

## Story

As a user,
I want to mark a task as scheduled (moved to the future log/backlog),
so that I can defer open-ended tasks without specifying an exact date.

## Acceptance Criteria

1. **Given** I hover/select an active task **When** EntryActions appear **Then** a "Schedule to Backlog" action is available.
2. **When** I click it **Then** the current entry's symbol changes to `‹` (scheduled) and text opacity reduces.
3. **And** the entry remains visible in the current view with the scheduled symbol.
4. **And** a new active task entry is created in the Backlog view with the same text.
5. **And** the action is immediate with no additional prompt.

## Tasks / Subtasks

- [ ] **Add schedule action to EntryRow** (AC: 1) — **GAP**
  - [ ] Add "Schedule" button/icon in `.bj-actions` for active tasks (and events per consistency)
  - [ ] Distinct from "Move to…" migrate action — one-click, no popover

- [ ] **Implement `scheduleEntry(id)` in `useEntries`** (AC: 2, 3, 4, 5) — **GAP**
  - [ ] Update source entry: `status: 'scheduled'`
  - [ ] Create new entry in `backlog` view: same text, `type: 'task'`, `status: 'active'`
  - [ ] Persist both changes atomically

- [ ] **Verify Glyph rendering** (AC: 2)
  - [ ] `Glyph` already renders `‹` for `status: 'scheduled'` — static character, no animation

- [ ] **Verify row dimming** (AC: 2, 3)
  - [ ] Scheduled source entry uses same dim opacity as done/migrated (`opacity: 0.28`)

- [ ] **Manual test** (AC: 1–5)
  - [ ] Schedule task from Daily — source shows `‹`, Backlog gets new `·` entry
  - [ ] Switch to Backlog tab — new entry visible
  - [ ] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — Scheduled Status Type-Only

`EntryStatus` includes `'scheduled'` and `Glyph` renders `‹`, but **no UI action or hook method sets scheduled status**. This is primarily a **new feature** story.

**What already exists:**
- `src/types/entry.ts` — `EntryStatus: 'scheduled'`
- `src/components/Glyph.tsx` — `if (status === 'scheduled') return ‹`
- `src/components/EntryRow.tsx` — dim row for non-active status

**What must be built:**
- `scheduleEntry(id: string)` in `useEntries.ts`
- Schedule action button in `EntryRow.tsx` actions row
- Wire `onSchedule` prop through App → EntryRow

**Suggested hook logic:**
```typescript
const scheduleEntry = useCallback((id: string) => {
  const source = entriesRef.current.find(e => e.id === id)
  if (!source || source.status !== 'active') return
  const copy: Entry = {
    id: newId(), view: 'backlog', type: 'task',
    text: source.text, ago: 0, status: 'active', createdAt: Date.now(),
  }
  persist(entriesRef.current.map(e =>
    e.id === id ? { ...e, status: 'scheduled' as const } : e
  ).concat(copy))
}, [persist])
```

**Do NOT:**
- Confuse with Migrate → Backlog (MovePicker) which **moves** entry per Fix 8
- Schedule keeps source with `‹` AND creates backlog copy (epic original behaviour)

### References

- Story requirements: [Source: epics.md#Story-3.3]
- Glyph scheduled: [Source: src/components/Glyph.tsx#L59]
- Epic distinction: Schedule (`<`) vs Migrate (`>`) — different rituals
- Story 3.2: migrate move behaviour [Source: 3-2-migrate-a-task-with-when-prompt.md]

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
