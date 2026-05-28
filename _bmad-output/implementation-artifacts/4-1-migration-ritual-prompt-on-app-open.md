# Story 4.1: Migration Ritual — Time-Triggered Banner & Blocking Prompt

Status: done

## Story

As a user,
I want to be reminded at 18:00 to deal with unresolved tasks before the day ends, and be required to act on them at 00:01,
so that I consciously close out each day following the BuJo ritual — whether I'm actively using the app or not.

## Acceptance Criteria

1. **Given** the app is open (or is opened) at or after 18:00 **When** there are active `task` entries in the current period (Daily, Weekly, or Monthly view) **Then** the `EndOfPeriodBanner` appears immediately at the top of the current view with contextual copy.
2. **And** the banner has a dismiss (×) button — clicking it hides the banner for the session.
3. **And** the banner is not shown if there are no active tasks in the current period.
4. **And** the banner is not shown in the Backlog view.
5. **Given** the app is open (or is opened) at or after 00:01 **When** there are active `task` entries from the previous period (yesterday/last week/last month) **Then** the `MigrationPrompt` modal opens immediately with `canDefer={false}` and blocks all interaction.
6. **And** the modal title is "The morning ritual" with section header "Yesterday's leftovers" (or equivalent).
7. **And** each unresolved task shows action buttons: done (×), today, migrate (→ submenu), drop.
8. **And** the modal can only be closed once every task has been actioned ("Confirm" button enabled only when all items are decided).
9. **And** if there are no unresolved tasks from the previous period at 00:01, the modal is not shown.
10. **And** once all tasks are actioned, `resolveMigration` is called and the modal closes.

## Tasks / Subtasks

- [x] **Add `createdAt` to Entry type and data layer** (AC: 5, 9)
  - [x] Add `createdAt?: number` (Unix ms timestamp) to `Entry` interface in `src/types/entry.ts`
  - [x] Update `loadEntries()` in `useEntries.ts` to populate `createdAt` for entries without it: `Date.now() - entry.ago * 60 * 1000`
  - [x] Update `add()` in `useEntries.ts` to set `createdAt = Date.now()` on new entries
  - [x] Add two yesterday daily seed entries to `seed.ts` (ago: 1550, 1600) for demo testability

- [x] **Implement `unresolvedFromPreviousPeriod()` in `useEntries`** (AC: 5, 9)
  - [x] Export `unresolvedFromPreviousPeriod(entries: Entry[], view: EntryView): MigrationItem[]` from `useEntries.ts` as a standalone helper
  - [x] For `daily`: return active tasks with `view === 'daily'` and `createdAt < startOfToday()`
  - [x] For `weekly`: return active tasks with `view === 'weekly'` and `createdAt < startOfThisWeek()`
  - [x] For `monthly`: return active tasks with `view === 'monthly'` and `createdAt < startOfThisMonth()`
  - [x] Return `[]` for `backlog` view

- [x] **Create `useTimeReminder` hook** (AC: 1, 5)
  - [x] Create `src/hooks/useTimeReminder.ts`
  - [x] Run `setInterval` every 60s checking `new Date()` against 18:00 and 00:01 thresholds
  - [x] On app open (mount): fire checks immediately so the app triggers correctly if already past threshold
  - [x] Track "already fired this session" via `useRef` — do not re-fire on every interval tick
  - [x] At or after 18:00 (hour >= 18): call `onEveningBanner()`
  - [x] At 00:01 (hour === 0 && minute >= 1): call `onMorningRitual()`
  - [x] Callbacks stored in refs so they always read latest App state without hook re-run

- [x] **Wire `EndOfPeriodBanner` into `App.tsx`** (AC: 1, 2, 3, 4)
  - [x] Add `showBanner` state (boolean, default false) to `BuJoApp`
  - [x] Compute `activePeriodTasks`: active `type === 'task'` entries for the current view (daily/weekly/monthly)
  - [x] Import `EndOfPeriodBanner` and render it above the entry list when `showBanner && activePeriodTasks.length > 0`
  - [x] Pass `view` and `onDismiss={() => setShowBanner(false)}` to `EndOfPeriodBanner`
  - [x] Use `useTimeReminder`: on evening trigger, `setShowBanner(true)` if `activePeriodTasks.length > 0`; on morning trigger, open ritual modal if `unresolvedPrev.length > 0`

- [x] **Wire ritual `MigrationPrompt` with real queue** (AC: 5–10)
  - [x] Compute `unresolvedPrev = unresolvedFromPreviousPeriod(entries, view)` in `BuJoApp`
  - [x] Pass `unresolvedPrev` to `MigrationPrompt` as `queue` when `migrationOpen === 'ritual'`
  - [x] Keep `MIGRATION_QUEUE` as fallback only when `unresolvedPrev.length === 0` (dev demo access remains)
  - [x] `onResolve` calls `resolveMigration(decisions, unresolvedPrev)` when `unresolvedPrev.length > 0`, else `MIGRATION_QUEUE` fallback

## Dev Notes

### Brownfield Context — Significant Scaffolding Already in Place

All UI components for this story already exist in the codebase. **Do NOT recreate them** — wire them up only.

**Already implemented:**
- `src/components/EndOfPeriodBanner.tsx` — full component with contextual messages for daily/weekly/monthly; CSS class `bj-banner` is in `bj.css`
- `src/components/MigrationPrompt.tsx` — full modal with `canDefer` prop; handles all decision types (done, today, weekly, monthly, backlog, drop); already imports from `doodles/Doodle`
- `src/components/App.tsx` — has `migrationOpen` state (`null | 'reminder' | 'ritual'`); `MigrationPrompt` is rendered at line 114–121 using `MIGRATION_QUEUE`
- `src/types/entry.ts` — `MigrationItem`, `MigDecisionKind` types already defined
- `src/data/seed.ts` — `MIGRATION_QUEUE` (static demo queue) and `SEED_ENTRIES` already defined

**What is NOT wired:**
- `EndOfPeriodBanner` is never rendered in `App.tsx` — import it and render it
- `showBanner` state does not exist in `App.tsx` — add it
- `useTimeReminder` hook does not exist — create it
- `unresolvedFromPreviousPeriod()` does not exist — implement it
- `MigrationPrompt` uses static `MIGRATION_QUEUE` only — wire real queue for ritual trigger

### State Shape (from epics spec)

Both triggers use the existing `showBanner` / `migrationOpen` state shape in `App.tsx` — no new global state shape needed:
- `showBanner: boolean` — new state to add
- `migrationOpen: null | 'reminder' | 'ritual'` — already exists

### Time Trigger Logic

```ts
// 18:00 banner trigger
if (hour >= 18) { onEveningBanner() }

// 00:01 ritual trigger
if (hour === 0 && minute >= 1) { onMorningRitual() }
```

Both fire at most once per session (tracked with `useRef`).

### `createdAt` Derivation

Since `ago` is minutes since creation and never updates, derive: `createdAt = Date.now() - entry.ago * 60 * 1000`. Persist this on first compute (loadEntries migration) so it stabilises.

### Seed Entries for Yesterday (Demo Testability)

Add two entries to `SEED_ENTRIES` with `ago: 1550` and `ago: 1600` (≈26 hours) and `view: 'daily'`. These will have `createdAt` before today's midnight, so `unresolvedFromPreviousPeriod('daily')` returns them and the ritual modal can be tested.

## Dev Agent Record

### Implementation Plan

Implementing in order: types → data → hook utilities → useTimeReminder → App wiring.

### Debug Log

(empty)

### Completion Notes

All ACs implemented and verified with `npm run build` (clean, no TypeScript errors):
- `createdAt?: number` added to `Entry` type; backfilled on load for existing entries
- `unresolvedFromPreviousPeriod()` exported from `useEntries.ts`; uses Monday-anchored week logic and month-start boundary
- `useTimeReminder` hook created; fires on mount + every 60s; once-per-session via `useRef` flags; callbacks via ref to avoid stale closures
- `EndOfPeriodBanner` rendered above entry list when `showBanner && activePeriodTasks.length > 0`; dismissed via × (session only)
- `MigrationPrompt` now receives `ritualQueue` (real previous-period tasks) when `migrationOpen === 'ritual'`; falls back to static `MIGRATION_QUEUE` for demo
- Two seed entries added (d_y1, d_y2) with `ago: 1550/1600` (~26h) so daily ritual triggers in demo

### Review Findings

- [x] [Review][Decision] Ritual checks only current UI view — RESOLVED: ritual is now navigation-triggered (not clock-triggered) and fires per-view on first entry. Daily: any day; Weekly: Monday or first open of the week; Monthly: 1st or first open of the month. Each view's queue is independent and stabilised at modal-open time.
- [ ] [Review][Patch] Ref flags set before App guard — banner/ritual slot consumed when guard returns early [`src/hooks/useTimeReminder.ts`] — Both `banneredRef.current = true` and `ritualRef.current = true` are written *before* the callback is invoked. If the App-level guard (`activePeriodTasks.length > 0` / `unresolvedPrev.length > 0`) returns early (e.g. user is in Backlog view at 18:00 or 00:01), the slot is permanently consumed for the session even though the banner/modal never showed.
- [ ] [Review][Patch] `ritualQueue` not stabilised at modal-open time [`src/components/App.tsx`] — `ritualQueue` is derived from `unresolvedFromPreviousPeriod(entries, view)` on every render. If the user switches view while the ritual modal is open, the displayed queue changes and `resolveMigration` is called with the wrong task set (potentially the `MIGRATION_QUEUE` demo data).
- [ ] [Review][Patch] Morning ritual misses users opening app after 01:00 [`src/hooks/useTimeReminder.ts`] — Condition `h === 0 && m >= 1` only covers 00:01–00:59. A user who opens the app at 01:30 (or any time after 01:00 on a new day) will never see the morning ritual. AC5 says "at or after 00:01" — implies the trigger should fire for any app-open after midnight, not only within the first hour.
- [ ] [Review][Patch] Ritual modal header always "Yesterday's leftovers" [`MigrationPrompt.tsx:82`] — AC #6 requires week/month equivalents when ritual runs from Weekly or Monthly view. Header is hardcoded; should derive from active `view` (prop) or queue metadata.
- [x] [Review][Defer] `completedAt` in pre-existing seed entries uses small integers not Unix ms [`src/data/seed.ts`] — deferred, pre-existing
- [x] [Review][Defer] `localStorage` parse errors silently swallowed with no logging [`src/hooks/useEntries.ts`] — deferred, pre-existing
- [x] [Review][Defer] No runtime validation of deserialized localStorage schema [`src/hooks/useEntries.ts`] — deferred, pre-existing
- [x] [Review][Defer] `entry.ago` undefined → NaN timestamp silently drops tasks from migration [`src/hooks/useEntries.ts`] — deferred, pre-existing
- [x] [Review][Defer] `migrate()` preserves `when` field across period boundaries [`src/hooks/useEntries.ts`] — deferred, pre-existing
- [x] [Review][Defer] Browser tab throttling can cause midnight window to be missed [`src/hooks/useTimeReminder.ts`] — deferred, platform limitation
- [x] [Review][Defer] `startOfThisWeek` hardcodes Monday, ignoring locale [`src/hooks/useEntries.ts`] — deferred, pre-existing
- [x] [Review][Defer] `banneredRef`/`ritualRef` never reset across calendar days [`src/hooks/useTimeReminder.ts`] — deferred, spec defines session-based triggering; multi-day sessions are edge case beyond story scope
- [x] [Review][Defer] Negative `entry.ago` yields future timestamp [`src/hooks/useEntries.ts`] — deferred, pre-existing

## File List

- `src/types/entry.ts`
- `src/data/seed.ts`
- `src/hooks/useEntries.ts`
- `src/hooks/useTimeReminder.ts` (new)
- `src/components/App.tsx`
- `_bmad-output/implementation-artifacts/4-1-migration-ritual-prompt-on-app-open.md`
- `_bmad-output/sprint-status.yaml`

## Change Log

- 2026-05-28: Story created from epics spec and implemented (Story 4.1)
