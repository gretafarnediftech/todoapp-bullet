# Story 2.3: Delete an Entry

Status: ready-for-dev

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

- [ ] **Align delete UX with epic AC** (AC: 2) — **GAP**
  - [ ] Current: `EntryRow` shows inline "delete? cancel / yes" confirmation (`confirmingDelete` state)
  - [ ] Epic + Project Brief: no confirmation dialog in v1
  - [ ] **Remove confirmation step** — trash click calls `onDelete(entry.id)` immediately
  - [ ] Preserve hover/selected action visibility pattern

- [ ] **Verify delete hook** (AC: 2, 4)
  - [ ] `remove(id)` in `useEntries` filters entry from state and persists
  - [ ] No soft-delete or undo stack

- [ ] **Verify EmptyState transition** (AC: 3)
  - [ ] Delete last entry in view → `visible.length === 0` → EmptyState renders
  - [ ] EmptyState NOT shown during loading/error

- [ ] **Verify desktop vs mobile** (AC: 1)
  - [ ] Desktop: actions on row hover
  - [ ] Mobile: tap row to select → actions appear

- [ ] **Manual test** (AC: 1–4)
  - [ ] Delete entry mid-list — others remain
  - [ ] Delete last entry — EmptyState appears
  - [ ] Reload page — deletion persisted
  - [ ] Run `npm run build` — exit 0

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

(pending)

### Debug Log References

### Completion Notes List

### File List
