# Story 3.2: Revert a Migrated Task to Active

Status: review

## Story

As a user,
I want to un-migrate a task that was marked as migrated to tomorrow and revert it to active status,
so that I can change my mind after migrating without having to re-create the task.

## Acceptance Criteria

1. **Given** I see a task entry with a `>` (migrated) symbol and a `→ tomorrow` destination tag **When** I click or tap the `>` bullet **Then** the symbol reverts to `·` (active task) and the entry text returns to full opacity.
2. **And** the `→ tomorrow` destination tag is removed from the entry display.
3. **And** the revert is immediate with no animation.
4. **And** the task is counted as active again — it will appear in the end-of-period banner and migration ritual queues.
5. **And** the reverted entry remains in the same view at the same list position.
6. **Given** the `>` glyph is rendered for a migrated-to-tomorrow task **Then** the glyph is clickable (cursor-pointer, hover state) — consistent with the `×` click-to-uncomplete interaction from FR5.
7. **Given** a task with `migratedTo !== 'tomorrow'` (e.g. 'next week', 'future log') **Then** the `>` glyph is NOT interactive — out of scope for this FR.

## Tasks / Subtasks

- [x] **Add `unmigrate(id)` to `useEntries`** (AC: 1, 2, 3, 4, 5)
  - [x] Implement `unmigrate`: maps over entries, for matching id where `status === 'migrated' && migratedTo === 'tomorrow'` → sets `status: 'active'`, clears `migratedTo`
  - [x] Add `unmigrate` to the hook return value

- [x] **Wire `unmigrate` through `App.tsx`** (AC: 1, 2)
  - [x] Add `unmigrate` to `BuJoAppProps` interface
  - [x] Destructure `unmigrate` in `BuJoApp` function params
  - [x] Pass `onUnmigrate={unmigrate}` to `EntryRow`

- [x] **Update `EntryRow` to handle unmigrate click** (AC: 1, 2, 3, 6, 7)
  - [x] Add `onUnmigrate?: (id: string) => void` to `EntryRowProps`
  - [x] In `handleGlyphClick`: add `else if (entry.status === 'migrated' && entry.migratedTo === 'tomorrow')` branch calling `onUnmigrate?.(entry.id)`
  - [x] Update glyph button `cursor` style: pointer when `status === 'migrated' && migratedTo === 'tomorrow'`

## Dev Notes

### Architecture

- `unmigrate` lives in `useEntries` alongside `cycle`, `migrate`, `undoMigration`
- Only tasks with `migratedTo === 'tomorrow'` are eligible (scoped to FR14); other destinations are non-interactive
- No animation on revert (mirrors the uncomplete-task pattern from FR5)
- The copy that was created in the daily view when migrating to tomorrow is NOT removed — that is handled separately by `undoMigration`; unmigrate only restores the source entry's status

### Key Files

- `src/hooks/useEntries.ts` — add `unmigrate` callback
- `src/components/App.tsx` — add to `BuJoAppProps`, pass to `EntryRow`
- `src/components/EntryRow.tsx` — `onUnmigrate` prop, click handler, cursor style

### Seed Data

Daily view already has `d7` (`status: 'migrated', migratedTo: 'tomorrow'`) which demos this feature.
Weekly view has `w3` (`migratedTo: 'next week'`) which must remain non-interactive.

## File List

- src/hooks/useEntries.ts
- src/components/App.tsx
- src/components/EntryRow.tsx

## Change Log

- 2026-05-29: Story created and implementation started

## Dev Agent Record

### Implementation Plan

1. Add `unmigrate(id)` to `useEntries.ts` — pure status reset for tomorrow-migrated tasks
2. Thread it through `App.tsx` `BuJoAppProps` → `EntryRow`
3. In `EntryRow`, extend `handleGlyphClick` for migrated case and update cursor

### Completion Notes

- Added `unmigrate(id)` to `useEntries` — guards on `status === 'migrated' && migratedTo === 'tomorrow'`, resets to `status: 'active'` and clears `migratedTo`, persists to localStorage
- Threaded through `BuJoAppProps` → `BuJoApp` → `EntryRow` as `onUnmigrate`
- `handleGlyphClick` extended with `migrated && migratedTo === 'tomorrow'` branch — no animation, immediate revert
- Glyph button cursor set to `pointer` for tomorrow-migrated tasks; non-tomorrow migrated glyphs remain `default` (non-interactive) per AC 7
- TypeScript clean, zero build errors
- Seed data: `d7` (`migratedTo: 'tomorrow'`) demos the revert; `w3` (`migratedTo: 'next week'`) remains non-interactive
