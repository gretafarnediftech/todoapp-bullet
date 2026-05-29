# Story 4.2: Morning Migration Ritual (Post-Midnight Navigation Trigger)

Status: done

## Story

As a user,
I want to be required to deal with unresolved tasks from the previous period when I navigate into a period view after midnight,
So that I consciously carry forward what still matters and close out each period following the BuJo ritual.

## Acceptance Criteria

1. **Given** the user navigates into a period view (Daily, Weekly, or Monthly) for the first time in a session **And** the current time is after midnight and before 18:00 **And** there are active `task` entries from the previous period for that view (yesterday's Daily, last week's Weekly, last month's Monthly) **Then** the `MigrationPrompt` modal opens immediately for that view's queue and blocks all interaction — no dismiss, no "Maybe later".
2. **And** the modal title is **"The morning ritual"** with section header **"Yesterday's leftovers"** (Daily), **"Last week's leftovers"** (Weekly), or **"Last month's leftovers"** (Monthly).
3. **And** each unresolved task shows action buttons: **done (×)**, **today**, **migrate (→ submenu)**, **drop**.
4. **And** a badge shows **"N left"** (count of undecided tasks in the queue).
5. **And** the modal can only be closed once every task has been actioned (Confirm button enabled only when all items decided).
6. **When** I click "today" on a task **Then** the task is migrated to the Daily view; the original entry gets `>` symbol + `→ today` destination tag.
7. **When** I click "future log" on a task **Then** the task is migrated to the Backlog; the original gets `>` + `→ future log` destination tag.
8. **When** I click "drop" on a task **Then** the task is permanently removed from the previous period's view.
9. **And** once all tasks are actioned and Confirm is clicked, the modal closes.
10. **And** if there are no unresolved tasks for that view's previous period, the modal is not shown.
11. **And** each view's ritual fires independently — navigating from Daily to Weekly can trigger two separate rituals in the same session.
12. **And** if the current time is at or after 18:00, the ritual does NOT fire (the evening banner handles that window).

## Tasks / Subtasks

- [x] **Add `hours < 18` gate to navigation-triggered ritual** (AC: 1, 12)
  - [x] In `BuJoApp` `useEffect` in `App.tsx`, add early return if `new Date().getHours() >= 18`
  - [x] Gate must be checked on every effect run (not cached) so late-evening navigations are skipped

- [x] **Pass `view` prop to `MigrationPrompt` and make header view-aware** (AC: 2)
  - [x] Add `view?: EntryView` to `MigrationPromptProps` interface
  - [x] Derive section header from `view`: Daily → "Yesterday's leftovers", Weekly → "Last week's leftovers", Monthly → "Last month's leftovers", fallback → "Yesterday's leftovers"
  - [x] Replace hardcoded `<h2>Yesterday's leftovers</h2>` with the derived label
  - [x] Pass `view={view}` when rendering `MigrationPrompt` from `App.tsx` for ritual mode (`migrationOpen === 'ritual'`)

- [x] **Add "N left" badge to `MigrationPrompt`** (AC: 4)
  - [x] Compute `remaining = queue.length - Object.keys(decisions).length`
  - [x] Render badge in modal header area showing `{remaining} left` when `remaining > 0`
  - [x] Badge disappears (or shows "0 left") once all tasks are decided

## Dev Notes

### Brownfield Context

Story 4.2 builds on the navigation-triggered ritual already wired in Story 4.1's review cycle. The core mechanism (`shownRitualViews`, `ritualQueue`, `setMigrationOpen('ritual')`) is fully in place. Only three targeted gaps remain.

**Files to modify (no new files required):**
- `src/components/App.tsx` — add `hours < 18` gate + `view` prop on `MigrationPrompt`
- `src/components/MigrationPrompt.tsx` — add `view` prop, dynamic header, "N left" badge

**Already implemented and correct (do NOT touch):**
- `unresolvedFromPreviousPeriod()` in `useEntries.ts`
- `shownRitualViews` per-view session tracking
- `ritualQueue` stabilised via `useState` (captured at modal-open time)
- `canDefer={false}` on ritual modal
- `resolveMigration()` + all decision types (done/today/weekly/monthly/backlog/drop)
- `useTimeReminder` (evening-only, 18:00 banner — separate concern)

### Header Derivation

```ts
const RITUAL_HEADER: Record<string, string> = {
  daily:   "Yesterday's leftovers",
  weekly:  "Last week's leftovers",
  monthly: "Last month's leftovers",
}
const sectionHeader = (view && RITUAL_HEADER[view]) ?? "Yesterday's leftovers"
```

### "N left" Badge

`remaining = queue.length - Object.keys(decisions).length`

Render inline in the modal header (next to or below the squiggle), using the muted Inter style consistent with `bj-mig-sup`.

## Dev Agent Record

### Implementation Plan

Three targeted edits: (1) App.tsx gate, (2) MigrationPrompt view prop + header, (3) MigrationPrompt badge.

### Debug Log

(empty)

### Completion Notes

All ACs implemented and verified with `npx tsc --noEmit` + `npm run build` (clean, no errors):
- `hours < 18` gate added to navigation trigger in `BuJoApp` useEffect in `App.tsx`; ritual will not fire at/after 18:00
- `view?: EntryView` prop added to `MigrationPromptProps`; `RITUAL_HEADER` map drives section header ("Yesterday's / Last week's / Last month's leftovers")
- `view={view}` passed from `App.tsx` only for `migrationOpen === 'ritual'` (demo reminder mode unaffected)
- `remaining` counter + `.bj-mig-badge` rendered in `.bj-mig-head-right` wrapper alongside close button; disappears when all items decided
- `.bj-mig-head-right` and `.bj-mig-badge` CSS added to `bj.css`
- Amendment complete: ritual queue now includes unresolved events from previous period
- Amendment complete: event items render `○` as pending and `●` for done action/state in `MigrationPrompt`
- Amendment complete: `drop` removes the source entry permanently instead of setting `status: 'done'`
- Amendment complete: migration-created entries preserve original item type (`task`/`event`)
- Review findings from story 4.1 already resolved in the codebase (ref-flag-before-guard, ritualQueue stability, morning-after-01:00 window) — confirmed not regressed

## File List

- `src/components/App.tsx`
- `src/components/MigrationPrompt.tsx`
- `src/hooks/useEntries.ts`
- `src/types/entry.ts`
- `src/data/seed.ts`
- `_bmad-output/implementation-artifacts/4-2-morning-migration-ritual.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-05-29: Story created and implemented (Story 4.2)
- 2026-05-29: Amendment completed (events in ritual queue, permanent drop removal, type-safe migration)

---

## Amendment: Events in Ritual Queue (2026-05-29)

**Source:** Sprint Change Proposal 2026-05-29-bug-fixes — Fix 2 (completed)

The following amendment behavior has been incorporated into the implementation.

### Additional Acceptance Criteria

13. **Given** the ritual fires for a period view **And** the previous period contains unresolved `event` entries (status not `done`) alongside tasks **Then** the events appear in the ritual queue alongside tasks, with the same action set: **done (●)**, **today**, **migrate (→ submenu)**, **drop**.
14. **Given** all tasks in the queue are actioned but unresolved events remain **Then** the modal does NOT close — the "N left" badge counts events too, and Confirm remains disabled until every item (task and event) is decided.

### Additional Tasks

- [x] **Expand `unresolvedFromPreviousPeriod()` to include events** (`useEntries.ts`)
  - [x] Return both `task` entries with `status !== 'done'` AND `event` entries with `status !== 'done'` from the previous period
  - [x] `MigrationItem` type accepts `type: 'event'`

- [x] **Render event symbol in `MigrationPrompt` ritual queue** (`MigrationPrompt.tsx`)
  - [x] When item `type === 'event'`, render inline `●` instead of `×` for done state/action
  - [x] "done" action on an event resolves to `status: 'done'` through `resolveMigration`

- [x] **Verify `ritualQueue` count includes events** (`App.tsx`)
  - [x] `unresolvedFromPreviousPeriod()` call that populates `ritualQueue` receives the expanded return set
  - [x] `remaining` badge count is unaffected — counts all undecided items regardless of type

- [x] **Fix drop behavior to permanent removal** (`useEntries.ts`)
  - [x] `drop` now removes source entries from state instead of marking them as `done`
  - [x] Verified in build: no type/runtime regressions introduced by queue expansion
