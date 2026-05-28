# Story 3.2: Migrate a Task with "When?" Prompt

Status: ready-for-dev

## Story

As a user,
I want to migrate a task to a future view and be asked where to send it,
so that I can reschedule work following the BuJo migration ritual.

## Acceptance Criteria

1. **Given** I hover/select an active task **When** I click "Move to…" **Then** a popover shows destinations: Tomorrow (daily only), Daily, Weekly, Monthly, Future Log.
2. **When** I select a destination **Then** migration behaviour follows epic Fix 8 (tomorrow = copy + `>` in source; other destinations = move entry to destination view).
3. **And** migrated source entries show `›` symbol + `→ {label}` tag when remaining in source (tomorrow case).
4. **And** Escape / click-outside closes popover without changes.
5. **And** migrate action available for both `task` and `event` active entries (Fix 4).
6. **And** undo icon on moved entries in destination view reverses migration (Fix 6).

## Tasks / Subtasks

- [ ] **Verify MovePicker UI** (AC: 1, 4)
  - [ ] `MovePicker` in `EntryRow.tsx` — "Move to…" header, destination list
  - [ ] Tomorrow option only when `fromView === 'daily'`
  - [ ] Click-outside closes via `mousedown` listener on document

- [ ] **Align `migrate()` with Fix 8** (AC: 2, 3) — **LIKELY GAP**
  - [ ] Read current `migrate(id, destView, label?)` in `useEntries.ts`
  - [ ] **Tomorrow:** entry stays in source with `status: 'migrated'`, `migratedTo: 'tomorrow'`; copy created in daily with `when` = tomorrow's date
  - [ ] **Other destinations:** entry **removed** from source, **added** to destination with `status: 'active'` (no `>` left in source)
  - [ ] Update `EntryRow` `canMigrate` to include `type === 'event'` (Fix 4)

- [ ] **Implement undo migration** (AC: 6) — **GAP**
  - [ ] Add `undoMigration(id, sourceView, destinationView)` to `useEntries`
  - [ ] Show undo icon on recently moved entries in destination view (hover/selected pattern)
  - [ ] Session-only — no cross-reload persistence requirement

- [ ] **Verify migrated tag display** (AC: 3)
  - [ ] `.bj-migrated-tag` shows `→ {migratedTo}` for entries with `status: 'migrated'`

- [ ] **Manual test** (AC: 1–6)
  - [ ] Migrate daily task to weekly — verify move vs copy per destination
  - [ ] Migrate to tomorrow — source shows `›` + tag, daily gets copy
  - [ ] Undo from destination view
  - [ ] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — MovePicker Exists, Behaviour May Differ

UI shell for migration exists (`MovePicker` + migrate button). Core logic likely needs alignment with epic Fix 8 and undo (Fix 6).

**What already works:**
- `src/components/EntryRow.tsx` — `MovePicker`, migrate button, `onMigrate(entry.id, dest, label)`
- `src/hooks/useEntries.ts` — `migrate()` function (verify behaviour)
- `src/components/Glyph.tsx` — `›` for `status: 'migrated'`
- Migrated tag rendering in EntryRow text span

**Current restriction to fix (Fix 4):**
```typescript
const canMigrate = entry.type === 'task' && entry.status === 'active'
// Should be: (task OR event) AND active
```

**Fix 8 behaviour summary:**

| Destination | Source list | Destination list |
|---|---|---|
| Tomorrow (daily only) | Entry stays, `›` + `→ tomorrow` | Copy with `when` = tomorrow |
| Daily / Weekly / Monthly / Backlog | Entry **removed** | Entry **moved** (active `·`) |

**Do NOT:**
- Recreate MovePicker from scratch
- Use old epic behaviour (all migrations leave `>` in source)

### References

- Story requirements: [Source: epics.md#Story-3.2]
- Fix 8 revised behaviour: [Source: epics.md#Revised Migration Behaviour]
- Fix 4 events: migrate for events too
- Fix 6 undo: [Source: epics.md#Undo Migration]
- MovePicker: [Source: src/components/EntryRow.tsx#L43-85]
- Hook: [Source: src/hooks/useEntries.ts] — `migrate()`

## Dev Agent Record

### Agent Model Used

(pending)

### Debug Log References

### Completion Notes List

### File List
