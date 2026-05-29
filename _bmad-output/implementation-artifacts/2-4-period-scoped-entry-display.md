# Story 2.4: Period-scoped Entry Display

Status: done

## Story

As a user,
I want each period view to show only the current period's entries,
So that past days/weeks/months don't pollute my current page.

## Acceptance Criteria

1. **Given** I am in Daily view **When** the entry list renders **Then** only entries with `createdAt >= startOfToday()` are shown, and entries from previous days (active, completed `×`, or migrated `>`) are not visible.
2. **Given** I am in Weekly view **When** the entry list renders **Then** only entries with `createdAt >= startOfThisWeek()` are shown.
3. **Given** I am in Monthly view **When** the entry list renders **Then** only entries with `createdAt >= startOfThisMonth()` are shown.
4. **Given** I am in Backlog view **Then** no period filtering is applied — all backlog entries are shown regardless of date.

## Tasks / Subtasks

- [x] **Apply period boundary filter to `visible` in App.tsx** (AC: 1–4)
  - [x] Compute `periodBoundary` from `startOfToday/ThisWeek/ThisMonth` helpers (already imported)
  - [x] Filter `entries` by `e.createdAt >= periodBoundary` for period views; skip filter for backlog
  - [x] Confirm `unresolvedFromPreviousPeriod` (migration ritual source) still uses unfiltered `entries` state — no change needed

- [x] **Verify seed data coverage** (AC: 1)
  - [x] `d_y1` (ago: 1550) and `d_y2` (ago: 1600) resolve to `createdAt` before today's midnight → filtered out ✓
  - [x] `d1`–`d9` (ago: 47–365) resolve within today → visible ✓
  - [x] All weekly entries (ago: 1440–3600, max ~60h) within Monday-start boundary ✓
  - [x] All monthly entries (ago: 8640–13000) within May 1 boundary ✓

- [x] **Run `npm run build`** — exit 0

## Dev Notes

### What Must Change

Single edit in `App.tsx`: the `visible` computed array currently filters only by `e.view === view`. Add a period boundary check for non-backlog views.

```ts
const periodBoundary =
  view === 'daily'   ? startOfToday() :
  view === 'weekly'  ? startOfThisWeek() :
  view === 'monthly' ? startOfThisMonth() :
  null

const visible = entries
  .filter((e) => {
    if (e.view !== view) return false
    if (periodBoundary !== null && (e.createdAt ?? 0) < periodBoundary) return false
    return true
  })
  .sort((a, b) => b.ago - a.ago)
```

### What Must NOT Change

- `unresolvedFromPreviousPeriod()` — already filters on `resolveCreatedAt(e) < beforeTs`, operates on the full `entries` state. No change.
- `activePeriodTasks` — already applies the same boundary check. No change.
- Seed data — `d_y1`/`d_y2` already have `ago` values that place them before yesterday midnight. No change.

### References

- Sprint change proposal: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-05-29-bug-fixes.md#Story-2.4`
- Boundary helpers: `src/hooks/useEntries.ts` — `startOfToday`, `startOfThisWeek`, `startOfThisMonth` (exported, already imported in App.tsx)
- Current `visible` computation: `src/components/App.tsx`
- Seed yesterday entries: `src/data/seed.ts` — `d_y1`, `d_y2`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- Added `periodBoundary` computed variable to `App.tsx` using the already-imported `startOfToday`, `startOfThisWeek`, `startOfThisMonth` helpers
- Updated `visible` filter to exclude entries where `createdAt < periodBoundary` for Daily/Weekly/Monthly views; Backlog is unfiltered (`periodBoundary = null`)
- `unresolvedFromPreviousPeriod` and `activePeriodTasks` already operated on the full `entries` state — no changes needed there
- Seed entries `d_y1`/`d_y2` (ago: 1550/1600 ≈ 26 hours) are always before today's midnight and are correctly filtered out of Daily view
- `npm run build` exits 0

### File List

- `src/components/App.tsx`

### Change Log

- `src/components/App.tsx`: replaced single-condition `visible` filter (`e.view === view`) with period-aware filter that also checks `e.createdAt >= periodBoundary` for period views
