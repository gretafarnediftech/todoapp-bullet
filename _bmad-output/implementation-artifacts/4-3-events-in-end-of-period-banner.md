# Story 4.3: Events in End-of-Period Banner

Status: done

## Story

As a user,
I want the 18:00 reminder banner to appear when I have unresolved events as well as tasks,
So that I am reminded to close out all entries — not just tasks — before the period ends.

## Acceptance Criteria

1. **Given** the app is open at or after 18:00 **When** the current period has unresolved `event` entries (status `active` — `migrated` is treated as resolved, matching task semantics) but no active `task` entries **Then** the `EndOfPeriodBanner` still appears with the standard contextual copy.
2. **Given** the banner is shown **And** all tasks are resolved but unresolved (active) events remain **Then** the banner is still shown — it dismisses when explicitly closed (×), the session ends, or all period entries (tasks and events) are resolved.

## Tasks / Subtasks

- [x] **Add `activePeriodEvents` computation in `App.tsx`** (AC: 1, 2)
  - [x] Below `activePeriodTasks`, add `activePeriodEvents` that filters entries where `view === view`, `type === 'event'`, `status !== 'done'`, and `createdAt >= boundary`
  - [x] Apply the same period boundary check used in `activePeriodTasks`

- [x] **Update `useTimeReminder` callback to include events** (AC: 1)
  - [x] Change callback condition from `activePeriodTasks.length > 0` to `activePeriodTasks.length > 0 || activePeriodEvents.length > 0`
  - [x] Events use `status !== 'active'` (not `status === 'done'`) so migrated events are treated as resolved, matching task semantics

- [x] **Update banner render condition to include events** (AC: 2)
  - [x] Change `showBanner && activePeriodTasks.length > 0` to `showBanner && (activePeriodTasks.length > 0 || activePeriodEvents.length > 0)`

## Dev Notes

### Brownfield Context

Story 4.3 is a targeted patch to the 18:00 banner system already implemented in Story 4.1. Only `App.tsx` needs changing — no new files, no changes to `useTimeReminder`, `EndOfPeriodBanner`, or `useEntries`.

**Files to modify:**
- `src/components/App.tsx` — add `activePeriodEvents`, update two references

**Already correct (do NOT touch):**
- `useTimeReminder.ts` — hook is correct as-is; no internal changes needed
- `EndOfPeriodBanner.tsx` — component unchanged
- `useEntries.ts` — no changes needed

### Period boundary

Events use the same `createdAt >= boundary` guard as tasks so past-period events don't pollute the banner trigger:

```ts
const activePeriodEvents = view !== 'backlog'
  ? entries.filter((e) => {
      if (e.view !== view || e.type !== 'event' || e.status === 'done') return false
      const boundary =
        view === 'daily'   ? startOfToday() :
        view === 'weekly'  ? startOfThisWeek() :
        view === 'monthly' ? startOfThisMonth() : 0
      return (e.createdAt ?? 0) >= boundary
    })
  : []
```

### Render condition

```tsx
{showBanner && (activePeriodTasks.length > 0 || activePeriodEvents.length > 0) && (
  <EndOfPeriodBanner view={view} onDismiss={() => setShowBanner(false)} />
)}
```

## Dev Agent Record

### File List

- `src/components/App.tsx`

### Change Log

| Date | Change |
|------|--------|
| 2026-05-29 | Created story file; implemented all ACs; fixed pre-existing MigrationItem TS error |

### Completion Notes

Implemented by adding `activePeriodEvents` alongside `activePeriodTasks` in `App.tsx` using the same period-boundary guard. Updated the `useTimeReminder` callback and `EndOfPeriodBanner` render condition to fire on either active tasks or unresolved events. Also fixed a pre-existing TS error in the `[dev] simulate new day` shortcut where `MigrationItem.type` was missing from the `map`.

### Review Findings

- [x] [Review][Decision] AC1 status semantics — resolved: `migrated` = resolved. AC1 wording updated to reflect `active`-only semantics, matching task behavior.
- [x] [Review][Patch] `activePeriodEvents` recomputes period boundary inline instead of using `periodBoundary` const [`src/components/App.tsx`] — applied: both `activePeriodTasks` and `activePeriodEvents` now use `periodBoundary ?? 0`.
