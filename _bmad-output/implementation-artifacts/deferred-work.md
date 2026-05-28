# Deferred Work

Items deferred from BMad reviews. Each entry is real but not actionable at the time it was raised.

## Deferred from: code review of 1-1-app-scaffold-layout-shell (2026-05-28)

- `MigrationPrompt` and `MIGRATION_QUEUE` are unreachable dead code in `App.tsx:57,141-148,3` — intentional scaffolding for Story 4.1 (`migration-ritual-prompt-on-app-open`). Wire up when that story lands.
- `window.innerWidth` is read in the `useState` initializer at `App.tsx:156` with no SSR guard. Vite SPA with no SSR planned; revisit if SSR/prerender or Node-based tests are added.
- Resize listener at `App.tsx:160-164` is unthrottled — every pixel of resize triggers a state setter. Low impact because the boolean rarely flips, but worth `requestAnimationFrame`/`matchMedia` later.
- Resize listener at `App.tsx:160-164` does not subscribe to `orientationchange` or `window.visualViewport`. iOS rotation and on-screen keyboard appearances can leave `isMobile` stale.
- Two modals (`MigrationPrompt` + `LegendModal`) can be open simultaneously at `App.tsx:141-149` with no mutual exclusion, shared z-index policy, or focus-trap coordination. Currently theoretical because `MigrationPrompt` is unreachable; revisit with Story 4.1.
- Bottom `Tabs` bar at `App.tsx:138` remains interactive while a modal is open. Tab presses can change `view` behind the modal. Revisit with Story 4.1 (or sooner if `LegendModal` becomes more prominent).
- Sort comparator at `App.tsx:61-63` yields `NaN` if any entry has a missing/NaN `ago` (e.g. older localStorage payload). Requires a type bypass to trigger.
- No deterministic tiebreaker at `App.tsx:63` for entries with equal `ago` values — display order depends on insertion order.
- Duplicate React keys possible at `App.tsx:109-121`: `useEntries.newId()` seeds from `Date.now()`. Two tabs opened in the same millisecond sharing the same `localStorage` can mint colliding `eN` ids.
- `today` is captured at render time in `ViewHeader.tsx:5`. A tab left open across midnight keeps showing yesterday's date until some unrelated re-render occurs.
- Locale hard-coded to `en-GB` in `ViewHeader.tsx:6`. No i18n in the brief; flag for future scope.
- DST-day arithmetic in `ViewHeader.tsx:11-13` can produce 23h/25h boundary shifts on the last Sunday of October/March; in far-eastern/western timezones this can shift the rendered date by one day.
- Filter + sort at `App.tsx:60-63` runs on every render with no memoization, producing a new array reference each pass and defeating any downstream `React.memo` on `EntryRow`.
- Sort at `App.tsx:60-63` relies on the undocumented invariant that `ago` is monotonically larger for older entries. A refactor that changes `ago` to "ms since epoch" would silently invert the order.
- `themeStyle as React.CSSProperties` cast at `App.tsx:170` hides a real type mismatch — the cast is required because `useTheme().themeStyle` does not satisfy `React.CSSProperties`. Fix the return type of `useTheme` rather than the call site.
- `{...entriesCtx}` spread at `App.tsx:173` is wider than the declared `BuJoAppProps` — additional fields from `useEntries()` pass unchecked, masking refactors that change the hook's surface.
- Inner content gets stacked padding (`28px 52px` on the column + `0 10px` on `.bj-list` and the composer) at `App.tsx:102,108,125`. Narrows the working area more than the Dev Notes figure implies.

## Deferred from: code review of 1-1-app-scaffold-layout-shell (2026-05-28, re-review)

- Header tabs may overflow horizontally at narrow desktop viewports (768–900px) in `HeaderBar.tsx:30-66` — no horizontal scroll or label truncation guard; low priority polish.

## Deferred from: code review of 1-2-view-tab-navigation (2026-05-28)

- Loading-skeleton CSS in `bj.css:338-363` appears in the working tree alongside Story 1.2 changes — belongs to Story 1.3 (`simulated-loading-state`); do not include in the 1-2 commit.

## Deferred from: code review of 1-3-simulated-loading-state (2026-05-28)

- Unrelated `bj.css` hunks bundled with Story 1.3 (`bj.css:49,422-425`) — `.bj-tab:focus-visible` and `@keyframes bj-circle-scale-in` belong to other stories; exclude from the 1-3 commit.
- README LoadingState description stale (`README.md:113`) — still lists bullets/pulse/dots only; update when docs are next touched.

## Deferred from: code review of 4-1-migration-ritual-prompt-on-app-open (2026-05-28)

- `completedAt` in pre-existing seed entries uses small integers (e.g. 12, 280, 2500) rather than Unix ms timestamps — breaks any date-aware logic on that field (`seed.ts`).
- `localStorage` parse errors in `loadEntries()` are silently swallowed with no logging or user feedback (`useEntries.ts`).
- No runtime validation of deserialized localStorage schema — TypeScript `as` cast only; malformed data passes unchecked (`useEntries.ts`).
- `entry.ago` undefined/missing → `NaN` timestamp; task silently excluded from migration candidates (`useEntries.ts` `resolveCreatedAt`).
- `migrate()` copies the source `when` field unchanged to the new entry, violating the format contract when crossing period types (HH:MM vs YYYY-MM-DD) (`useEntries.ts`).
- Browser background-tab throttling can shift the 60-second interval past the 00:01 window, silently skipping the morning ritual for that calendar day (`useTimeReminder.ts`).
- `startOfThisWeek` hardcodes Monday as week start; Sunday-first locales will misclassify Sunday tasks as previous-week (`useEntries.ts`).
- `banneredRef`/`ritualRef` never reset across calendar days — long-lived sessions won't see the banner/ritual again without a page reload (`useTimeReminder.ts`).
- Negative `entry.ago` values produce a future `createdAt` timestamp, silently excluding those tasks from migration (`useEntries.ts`).

## Deferred from: code review of 2-1-display-entry-list-with-mock-data (2026-05-28)

- `localStorage` does not merge updated seed rows; returning users who already have `bj-entries` will not see `b0`/`d_y1`/`d_y2` until storage is cleared (`useEntries.ts:loadEntries`).
- d_y1/d_y2 inflate active daily task count for EndOfPeriodBanner (18:00) because filter ignores `createdAt >= startOfToday()` (`App.tsx:activePeriodTasks`).
- Ritual queue re-derives on view switch while modal open; switching away from daily can swap to `MIGRATION_QUEUE` with mismatched ids (`App.tsx:ritualQueue`).
- d_y1 text duplicates MIGRATION_QUEUE mq1; fallback ritual can show the same task under different ids (`seed.ts`).
