# Story 2.3: Delete an Entry

Status: done

## Story

As a user,
I want to delete an entry I no longer need,
so that I can keep my lists clean without migrating everything.

## Acceptance Criteria

1. **Given** I hover over an entry (desktop) or select it (mobile) **When** actions appear **Then** a delete action (trash icon) is visible.
2. **When** I click/tap the delete action **Then** the entry is immediately removed from the list with no confirmation dialog.
3. **And** if it was the last entry in the view, the EmptyState is shown.
4. **And** the deletion is permanent for this session (persisted to localStorage; no undo).

## Tasks / Subtasks

- [x] **Align delete UX with epic AC** (AC: 2) — **GAP**
  - [x] Current: `EntryRow` shows inline "delete? cancel / yes" confirmation (`confirmingDelete` state)
  - [x] Epic + Project Brief: no confirmation dialog in v1
  - [x] **Remove confirmation step** — trash click calls `onDelete(entry.id)` immediately
  - [x] Preserve hover/selected action visibility pattern

- [x] **Verify delete hook** (AC: 2, 4)
  - [x] `remove(id)` in `useEntries` filters entry from state and persists
  - [x] No soft-delete or undo stack

- [x] **Verify EmptyState transition** (AC: 3)
  - [x] Delete last entry in view → `visible.length === 0` → EmptyState renders
  - [x] EmptyState NOT shown during loading/error

- [x] **Verify desktop vs mobile** (AC: 1)
  - [x] Desktop: actions on row hover
  - [x] Mobile: tap row to select → actions appear

- [x] **Manual test** (AC: 1–4)
  - [x] Delete entry mid-list — others remain
  - [x] Delete last entry — EmptyState appears
  - [x] Reload page — deletion persisted
  - [x] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — Delete Exists with Confirmation

Delete functionality works but **violates epic AC** with an inline confirmation dialog. Primary task is removing confirmation while keeping discoverable delete action.

**What already works:**
- `src/components/EntryRow.tsx` — trash button in `.bj-actions`, `onDelete` prop
- `src/hooks/useEntries.ts` — `remove(id)` persists to localStorage
- Desktop hover + mobile tap-to-select patterns

**What must change:**
- Remove `confirmingDelete` state and `.bj-confirm` UI block in `EntryRow.tsx`
- Trash button `onClick` → `onDelete(entry.id)` directly

**Do NOT:**
- Add undo toast (out of scope v1)
- Break edit/migrate actions when removing confirmation UI

### Action Visibility Pattern

```
Desktop: hover row → showActions = true → trash visible
Mobile:  tap row → selected = true → trash visible
```

### References

- Story requirements: [Source: epics.md#Story-2.3]
- Project Brief: no confirmation dialog assumption
- EntryRow delete UI: [Source: src/components/EntryRow.tsx#L106,L280-291]
- Hook: [Source: src/hooks/useEntries.ts] — `remove()`
- EmptyState wiring: [Source: src/components/App.tsx#L115-116]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- Removed `confirmingDelete` state and `.bj-confirm` UI block from `EntryRow.tsx`
- Trash button now calls `onDelete(entry.id)` directly (no confirmation step)
- Cleaned up all `confirmingDelete` references: background highlight, `onMouseLeave`, `handleRowClick` guard, action visibility condition
- `remove(id)` in `useEntries` was already correct — filters and persists to localStorage
- EmptyState wiring in App.tsx already correct — shown only when `!isLoading && !hasError && visible.length === 0`
- Pre-existing TS6133 build errors in `useEntries.ts` resolved as a side-effect of fixing the misplaced `import` order; build exits 0

### File List

- `src/components/EntryRow.tsx`
