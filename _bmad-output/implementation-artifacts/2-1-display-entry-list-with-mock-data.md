# Story 2.1: Display Entry List with Mock Data

Status: done

## Story

As a user,
I want to see a pre-populated list of entries when I open the app,
so that I can immediately see the BuJo system in action and understand how entries look.

## Acceptance Criteria

1. **Given** the app has loaded successfully **When** I view any of the four views **Then** I see a list of pre-seeded mock entries relevant to that view.
2. **And** each entry displays: a BuJo symbol on the left, the entry text, and a time/date label on the right when `when` is set.
3. **And** mock entries include at least one task (·) and one event (○) per view where seed data provides them.
4. **And** entries are displayed in reverse-chronological order (newest first) per epic — **verify against current sort** (code currently sorts oldest-first via `ago`).
5. **And** the list is scrollable when entries exceed the visible area.

## Tasks / Subtasks

- [x] **Verify seed data coverage** (AC: 1, 3)
  - [x] Confirm `src/data/seed.ts` (`SEED_ENTRIES`) has entries for all 4 views: daily, weekly, monthly, backlog
  - [x] Each view includes mix of `type: 'task'` and `type: 'event'` entries
  - [x] Include done/migrated examples where useful for later stories — do not remove

- [x] **Verify EntryRow display** (AC: 2)
  - [x] Left column: `Glyph` component (22px fixed width)
  - [x] Center: entry text (Kalam via `.bj-write`)
  - [x] Right: `formatWhen(entry.when, view)` when `when` is set — NOT relative "2h ago" (UX-DR4 defers timestamps; epic AC mentions relative timestamp but UX spec overrides)
  - [x] Row uses `align-items: center` grid layout

- [x] **Resolve sort order vs epic** (AC: 4)
  - [x] Current: `App.tsx` sorts `b.ago - a.ago` (lower `ago` = more recent = bottom of list)
  - [x] Epic says reverse-chronological (newest first). **Decision needed:** if product intent is BuJo page-fill (oldest top, newest bottom), document deviation in completion notes; if epic wins, flip sort to `a.ago - b.ago`

- [x] **Verify scroll behaviour** (AC: 5)
  - [x] Entry list inside `.bj-scroll` with `overflowY: auto`
  - [x] Composer stays below list within scroll column

- [x] **Verify persistence** (AC: 1)
  - [x] First visit loads `SEED_ENTRIES`; subsequent visits load `localStorage` key `bj-entries`
  - [x] Run `npm run build` — exit 0

## Dev Notes

### Brownfield Project — List Already Renders

Core list rendering is **already implemented**. Focus on verification, seed completeness, and sort-order decision.

**What already works:**
- `src/data/seed.ts` — 27 pre-seeded entries across 4 views
- `src/hooks/useEntries.ts` — loads seed on first visit, persists to localStorage
- `src/components/EntryRow.tsx` — symbol + text + when label
- `src/components/Glyph.tsx` — all symbol variants
- `src/components/App.tsx` — filters by view, maps to `EntryRow`

**Known doc vs code variances:**

| Epic / Inventory | Actual implementation |
|---|---|
| `mockEntries.ts` | `data/seed.ts` |
| `BulletEntry.tsx` | `EntryRow.tsx` |
| `createdAt: Date` + relative timestamp | `ago: number` (sort only) + optional `when` string displayed |
| `note` symbol type | Not in `EntryType` — only `task` \| `event` |
| Newest-first sort | Oldest-at-top (BuJo fill direction) — confirm with product |

**Note on timestamps:** UX-DR4 says "No timestamp on entries — symbol + text only." Epic Story 2.1 AC mentions relative timestamp — **follow UX-DR4** unless user explicitly requests relative timestamps. Display `when` chip value when present.

### Data Model (actual)

```typescript
interface Entry {
  id: string
  view: EntryView
  type: 'task' | 'event'
  text: string
  ago: number           // minutes since creation — sort key only
  status: EntryStatus
  when?: string         // HH:MM (daily) or YYYY-MM-DD
  migratedTo?: string
  originalText?: string
  completedAt?: number
  createdAt?: number    // ms — period boundary checks (Story 4.1)
}
```

### References

- Story requirements: [Source: epics.md#Story-2.1]
- Seed data: [Source: src/data/seed.ts]
- List rendering: [Source: src/components/App.tsx#L45-47,L118-131]
- Row layout: [Source: src/components/EntryRow.tsx]
- UX timestamp rule: [Source: epics.md#UX-DR4]
- Story 1.1 naming map: [Source: 1-1-app-scaffold-layout-shell.md#Actual-vs-Architecture-Component-Names]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

(none — verification-only story)

### Implementation Plan

Brownfield verification: confirmed existing list pipeline (seed → useEntries → App filter/sort → EntryRow). Only code change: added backlog `event` seed entry `b0` to satisfy AC 3 (backlog previously had tasks only). Sort order kept as `b.ago - a.ago` per `docs/bujo-design-spec.md` § Sort order (BuJo page-fill: oldest top, newest bottom) — documented epic deviation.

### Completion Notes List

- ✅ Seed: 28 entries across daily/weekly/monthly/backlog; each view has ≥1 task and ≥1 event (added `b0` backlog event)
- ✅ EntryRow: 22px glyph column, `.bj-write` text, `formatWhen` for `when` — no relative timestamps (UX-DR4)
- ✅ Sort: kept oldest-first (`b.ago - a.ago`); epic AC4 deviation documented — matches design spec BuJo fill direction
- ✅ Scroll: `.bj-scroll` `overflowY: auto`; composer below list in same column
- ✅ Persistence: first load `SEED_ENTRIES`, then `localStorage` `bj-entries`
- ✅ `npm run build` exit 0

### File List

- `src/data/seed.ts` (modified — added backlog event `b0`)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)
- `_bmad-output/implementation-artifacts/2-1-display-entry-list-with-mock-data.md` (modified)

## Change Log

- 2026-05-28: Verified brownfield entry list; added backlog event seed; documented sort-order epic deviation; build passed
- 2026-05-28: Code review approved — sort order confirmed (newest bottom); d_y1/d_y2 kept as forward scaffolding
- 2026-05-28: Correct course — epics/project-brief/component-inventory aligned to implementation

### Review Findings

- [x] [Review][Decision] Confirm oldest-first sort vs epic AC4 — **Resolved:** product confirms newest-at-bottom per `docs/bujo-design-spec.md`; epic AC4 deviation accepted.
- [x] [Review][Decision] d_y1/d_y2 seed entries belong in Story 2.1? — **Resolved:** keep in 2.1 as forward scaffolding for Story 4.1.
- [x] [Review][Defer] [src/hooks/useEntries.ts:loadEntries] — localStorage does not merge updated seed rows; returning users who already have `bj-entries` will not see `b0`/`d_y1`/`d_y2` until storage is cleared — deferred, pre-existing persistence pattern
- [x] [Review][Defer] [src/components/App.tsx:activePeriodTasks] — d_y1/d_y2 inflate active daily task count for EndOfPeriodBanner (18:00) because filter ignores `createdAt >= startOfToday()` — deferred, Story 4.1 / pre-existing
- [x] [Review][Defer] [src/components/App.tsx:ritualQueue] — ritual queue re-derives on view switch while modal open; switching away from daily can swap to `MIGRATION_QUEUE` with mismatched ids — deferred, pre-existing (Story 4.1)
- [x] [Review][Defer] [src/data/seed.ts] — d_y1 text duplicates MIGRATION_QUEUE mq1; fallback ritual can show the same task under different ids — deferred, Story 4.1 scaffolding
